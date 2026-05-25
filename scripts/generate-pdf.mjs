#!/usr/bin/env node

/**
 * Generates a PDF from the /resume Astro page via Puppeteer.
 *
 * Usage:
 *   npm run pdf
 *   npm run pdf -- --out ./build/my-cv.pdf
 *   npm run pdf -- --dir ./exports          # writes ./exports/resume.pdf
 *   npm run pdf -- ./build/my-cv.pdf        # same as --out (single positional)
 *   PDF_OUT=./out.pdf npm run pdf
 *
 * Requires Google Chrome or Chromium installed on the system.
 * The script starts the Astro dev server, prints the page to PDF,
 * saves the file (default: public/resume.pdf), and shuts everything down.
 */

import { spawn, execSync } from 'node:child_process';
import { resolve, dirname, isAbsolute, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DEFAULT_OUTPUT = resolve(ROOT, 'public', 'resume.pdf');
const DEV_URL = 'http://localhost:4321/resume';
const MAX_WAIT_MS = 30_000;

const CHROME_PATHS = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  ],
  linux: [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ],
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ],
};

function findChrome() {
  const candidates = CHROME_PATHS[process.platform] || [];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }

  if (process.platform === 'darwin') {
    try {
      const path = execSync(
        'mdfind "kMDItemCFBundleIdentifier == com.google.Chrome" | head -1',
        { encoding: 'utf8' },
      ).trim();
      if (path) return `${path}/Contents/MacOS/Google Chrome`;
    } catch { /* ignore */ }
  }

  return null;
}

/** Resolve a user-supplied path relative to cwd unless absolute. */
function resolveUserPath(p) {
  return isAbsolute(p) ? resolve(p) : resolve(process.cwd(), p);
}

/**
 * Parse --out/-o (file), --dir/-d (directory → resume.pdf inside), optional positional file,
 * or PDF_OUT env (file path). --out and --dir must not both be set.
 */
function parseOutputTarget() {
  const argv = process.argv.slice(2);
  let outFile;
  let outDir;
  let positional;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') {
      console.log(`Usage:
  node scripts/generate-pdf.mjs [options]
  npm run pdf -- [options]

Options:
  -o, --out <file>   Output PDF file path (parent directories are created)
  -d, --dir <dir>    Output directory; writes resume.pdf inside (dir is created)
  -h, --help         Show this message

A single positional argument is treated like --out <file>.

Environment:
  PDF_OUT            Same as --out (file path)

Default output: public/resume.pdf (under the project root).`);
      process.exit(0);
    }
    if (a === '-o' || a === '--out') {
      outFile = argv[++i];
      if (!outFile) {
        console.error('pdf: missing path after', argv[i - 1]);
        process.exit(1);
      }
      continue;
    }
    if (a === '-d' || a === '--dir') {
      outDir = argv[++i];
      if (!outDir) {
        console.error('pdf: missing path after', argv[i - 1]);
        process.exit(1);
      }
      continue;
    }
    if (a.startsWith('--out=')) {
      outFile = a.slice('--out='.length);
      continue;
    }
    if (a.startsWith('--dir=')) {
      outDir = a.slice('--dir='.length);
      continue;
    }
    if (!a.startsWith('-')) {
      positional ??= a;
    }
  }

  if (!outFile && !outDir && process.env.PDF_OUT) {
    outFile = process.env.PDF_OUT;
  }
  if (!outFile && !outDir && positional) {
    outFile = positional;
  }
  if (outFile && outDir) {
    console.error('pdf: use only one of --out/-o or --dir/-d');
    process.exit(1);
  }

  if (outDir) {
    const dir = resolveUserPath(outDir);
    mkdirSync(dir, { recursive: true });
    return join(dir, 'resume.pdf');
  }
  if (outFile) {
    const file = resolveUserPath(outFile);
    mkdirSync(dirname(file), { recursive: true });
    return file;
  }
  mkdirSync(dirname(DEFAULT_OUTPUT), { recursive: true });
  return DEFAULT_OUTPUT;
}

async function waitForServer(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* server not ready yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Dev server did not become ready within ${timeoutMs}ms`);
}

async function main() {
  const OUTPUT = parseOutputTarget();

  const chromePath = findChrome();
  if (!chromePath) {
    console.error(
      'Could not find Chrome/Chromium. Install Google Chrome or set CHROME_PATH env var.\n' +
      'Checked paths:', JSON.stringify(CHROME_PATHS[process.platform], null, 2),
    );
    process.exitCode = 1;
    return;
  }
  console.log(`Using Chrome: ${chromePath}`);

  console.log('Starting Astro dev server…');
  const server = spawn('npx', ['astro', 'dev'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' },
  });

  let serverOutput = '';
  server.stdout.on('data', (d) => { serverOutput += d.toString(); });
  server.stderr.on('data', (d) => { serverOutput += d.toString(); });

  try {
    console.log('Waiting for dev server…');
    await waitForServer(DEV_URL, MAX_WAIT_MS);
    console.log('Dev server ready.');

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_PATH || chromePath,
    });
    const page = await browser.newPage();
    await page.goto(DEV_URL, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: OUTPUT,
      format: 'Letter',
      margin: { top: '0.45in', bottom: '0.45in', left: '0.5in', right: '0.5in' },
      printBackground: true,
    });

    console.log(`PDF saved to ${OUTPUT}`);
    await browser.close();
  } catch (err) {
    console.error('PDF generation failed:', err.message);
    if (serverOutput) console.error('Server output:\n', serverOutput);
    process.exitCode = 1;
  } finally {
    server.kill('SIGTERM');
  }
}

main();
