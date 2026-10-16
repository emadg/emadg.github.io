#!/usr/bin/env node

/**
 * Generates a PDF from the /resume Astro page via Puppeteer.
 *
 * Usage:
 *   npm run pdf
 *   npm run pdf -- --ats                   # writes public/resume-ats.pdf
 *   npm run pdf -- --out ./build/my-cv.pdf
 *   npm run pdf -- --dir ./exports          # writes ./exports/resume.pdf
 *   npm run pdf -- ./build/my-cv.pdf        # same as --out (single positional)
 *   PDF_OUT=./out.pdf npm run pdf
 *   npm run pdf -- --data ./applications/acme/resume.json --out ./applications/acme/resume.pdf
 *
 * Requires Google Chrome or Chromium installed on the system.
 * The script starts its own Astro dev server on a dedicated port (so a running
 * `npm run dev` is never printed by mistake), renders /resume from
 * src/data/resume.json or the --data file, saves the PDF
 * (default: public/resume.pdf, or public/resume-ats.pdf with --ats), and shuts everything down.
 */

import { spawn, execSync } from 'node:child_process';
import { resolve, dirname, isAbsolute, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DEFAULT_PORT = 4399;
const MAX_WAIT_MS = 30_000;

// ─── Auto-fit ──────────────────────────────────────────────────────────────
// Before printing, the page is scaled very slightly (CSS zoom: fonts and
// spacing together) to minimize blank space at the bottom of every page but
// the last. Disable with --no-fit, or pin a value with --zoom <n>.
const FIT = {
  min: 0.94,          // original standard layout permits up to 6% smaller auto-fit
  max: 1.03,          // largest allowed scale (3% larger)
  step: 0.005,
  minGainPx: 20,      // ignore improvements smaller than this
  safetyPx: 6,        // keep this much spare room on a page to absorb rounding
};
// ──────────────────────────────────────────────────────────────────────────

const PAGE = {
  format: 'Letter',
  widthIn: 8.5,
  heightIn: 11,
  margin: { top: 0.45, bottom: 0.45, left: 0.5, right: 0.5 }, // standard, inches
};
// ──────────────────────────────────────────────────────────────────────────

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
 * Parse --out/-o (file), --dir/-d (directory → layout-specific filename), optional positional file,
 * or PDF_OUT env (file path). --out and --dir must not both be set.
 */
function parseArgs() {
  const argv = process.argv.slice(2);
  let outFile;
  let outDir;
  let positional;
  let dataFile;
  let port;
  let fit = true;
  let zoom;
  let ats = false;
  let compact = false;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') {
      console.log(`Usage:
  node scripts/generate-pdf.mjs [options]
  npm run pdf -- [options]

Options:
  -o, --out <file>   Output PDF file path (parent directories are created)
  -d, --dir <dir>    Output directory; writes resume.pdf (resume-ats.pdf with --ats)
  --data <file>      Resume JSON to render instead of src/data/resume.json
  --ats              Use a plain, left-aligned layout for automated processing
  --compact          Use tighter ATS typography and spacing (requires --ats)
  --port <n>         Port for the temporary dev server (default: ${DEFAULT_PORT})
  --no-fit           Disable auto-fit (already disabled in ATS mode)
  --zoom <n>         Use a fixed scale instead of auto-fit, e.g. 0.97
  -h, --help         Show this message

A single positional argument is treated like --out <file>.

Environment:
  PDF_OUT            Same as --out (file path)
  RESUME_DATA        Same as --data

Default output: public/resume.pdf (public/resume-ats.pdf with --ats).
Auto-fit is enabled for the default layout; ATS uses 100% unless --zoom is supplied.
RESUME_LAYOUT=ats npm run dev previews ATS at /resume; this CLI selects layout by --ats.`);
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
    if (a === '--no-fit') {
      fit = false;
      continue;
    }
    if (a === '--ats') {
      ats = true;
      continue;
    }
    if (a === '--compact') {
      compact = true;
      continue;
    }
    if (a === '--data' || a === '--port' || a === '--zoom') {
      const v = argv[++i];
      if (!v) {
        console.error('pdf: missing value after', a);
        process.exit(1);
      }
      if (a === '--data') dataFile = v;
      else if (a === '--port') port = v;
      else zoom = v;
      continue;
    }
    if (a.startsWith('--zoom=')) {
      zoom = a.slice('--zoom='.length);
      continue;
    }
    if (a.startsWith('--data=')) {
      dataFile = a.slice('--data='.length);
      continue;
    }
    if (a.startsWith('--port=')) {
      port = a.slice('--port='.length);
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

  dataFile ??= process.env.RESUME_DATA;
  let data;
  if (dataFile) {
    data = resolveUserPath(dataFile);
    if (!existsSync(data)) {
      console.error('pdf: data file not found:', data);
      process.exit(1);
    }
  }

  port = Number(port ?? DEFAULT_PORT);
  if (!Number.isInteger(port) || port <= 0) {
    console.error('pdf: invalid --port');
    process.exit(1);
  }

  if (zoom !== undefined) {
    zoom = Number(zoom);
    if (!(zoom >= 0.5 && zoom <= 1.5)) {
      console.error('pdf: --zoom must be between 0.5 and 1.5');
      process.exit(1);
    }
  }

  if (compact && !ats) {
    console.error('pdf: --compact requires --ats');
    process.exit(1);
  }
  const filename = ats ? 'resume-ats.pdf' : 'resume.pdf';
  const defaultOutput = resolve(ROOT, 'public', filename);
  let output;
  if (outDir) {
    const dir = resolveUserPath(outDir);
    mkdirSync(dir, { recursive: true });
    output = join(dir, filename);
  } else if (outFile) {
    output = resolveUserPath(outFile);
    mkdirSync(dirname(output), { recursive: true });
  } else {
    mkdirSync(dirname(defaultOutput), { recursive: true });
    output = defaultOutput;
  }
  return { output, data, port, fit: fit && !ats, zoom, layout: ats ? 'ats' : 'clean', compact };
}

/**
 * Simulate pagination in the browser and pick the CSS zoom (within FIT
 * bounds) that leaves the least blank space at the bottom of every page but
 * the last, without adding pages. Returns { zoom, before, after } where
 * before/after are the blank px per page at zoom 1 and at the chosen zoom.
 */
async function autoFit(page, fixedZoom, printHeightPx) {
  return page.evaluate(({ fit, pageH, fixedZoom }) => {
    const root = document.documentElement;
    // Approximate print pagination in document order. Long projects can split,
    // so measure their children rather than treating them as one block.
    // Section headings and job headers stay with the block that follows.
    const ATOMS = 'header, section > h2, .summary, .skills-row, .job-head, .project:not(.can-split), .project.can-split > .project-header, .project.can-split > .project-meta, .project.can-split > .project-desc, .project.can-split > .project-highlights > li, .project.can-split > .project-tech, .entry, .pub';
    const GLUED = (el) => el.matches('section > h2, .job-head, .project-header, .project-meta');

    const paginate = () => {
      const units = [];
      let pending = null;
      for (const el of document.querySelectorAll(ATOMS)) {
        const { top, bottom } = el.getBoundingClientRect();
        const unit = pending ? { top: pending.top, bottom } : { top, bottom };
        pending = GLUED(el) ? unit : null;
        if (!pending) units.push(unit);
      }
      if (pending) units.push(pending);
      if (!units.length) return [pageH];

      const blanks = [];
      let pageTop = units[0].top;
      let lastBottom = pageTop;
      for (const u of units) {
        if (u.bottom - pageTop > pageH - fit.safetyPx && lastBottom > pageTop) {
          blanks.push(pageH - (lastBottom - pageTop));
          pageTop = u.top;
        }
        // Paragraphs taller than one page flow across pages instead of
        // producing negative blank-space estimates.
        while (u.bottom - pageTop > pageH) {
          blanks.push(0);
          pageTop += pageH;
        }
        lastBottom = u.bottom;
      }
      blanks.push(pageH - (lastBottom - pageTop));
      return blanks;
    };
    const measure = (zoom) => {
      root.style.zoom = String(zoom);
      for (const project of document.querySelectorAll('.project')) {
        // Keeping a project taller than 30% of a page together can leave large
        // gaps, particularly when a job header must stay with its first project.
        project.classList.toggle('can-split', project.getBoundingClientRect().height > pageH * 0.3);
      }
      return paginate();
    };
    // Blank space that matters: every page except the last.
    const waste = (blanks) => blanks.slice(0, -1).reduce((a, b) => a + b, 0);
    const round = (blanks) => blanks.map((b) => Math.round(b));

    const before = measure(1);
    if (fixedZoom !== undefined) {
      const after = measure(fixedZoom);
      return { zoom: fixedZoom, before: round(before), after: round(after) };
    }

    let best = { zoom: 1, blanks: before };
    for (let z = fit.min; z <= fit.max + 1e-9; z += fit.step) {
      const zoom = Math.round(z * 1000) / 1000;
      const blanks = measure(zoom);
      if (blanks.length > best.blanks.length) continue;
      const gain = waste(best.blanks) - waste(blanks);
      const closer = Math.abs(zoom - 1) < Math.abs(best.zoom - 1);
      if (blanks.length < best.blanks.length || gain > 0.5 || (Math.abs(gain) <= 0.5 && closer)) {
        best = { zoom, blanks };
      }
    }
    if (best.blanks.length === before.length && waste(before) - waste(best.blanks) < fit.minGainPx) {
      best = { zoom: 1, blanks: before };
    }
    measure(best.zoom);
    return { zoom: best.zoom, before: round(before), after: round(best.blanks) };
  }, { fit: FIT, pageH: printHeightPx, fixedZoom });
}

/** Fail fast if something is already listening on the port we want. */
async function assertPortFree(port) {
  try {
    await fetch(`http://localhost:${port}/`);
  } catch {
    return;
  }
  console.error(`pdf: port ${port} is already in use; pass --port <n>`);
  process.exit(1);
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
  const { output: OUTPUT, data: DATA, port: PORT, fit: FIT_ON, zoom: ZOOM, layout: LAYOUT, compact: COMPACT } = parseArgs();
  const margins = PAGE.margin;
  const printWidthPx = (PAGE.widthIn - margins.left - margins.right) * 96;
  const printHeightPx = (PAGE.heightIn - margins.top - margins.bottom) * 96;
  const DEV_URL = `http://localhost:${PORT}/resume`;
  await assertPortFree(PORT);

  const chromePath = process.env.CHROME_PATH || findChrome();
  if (!chromePath) {
    console.error(
      'Could not find Chrome/Chromium. Install Google Chrome or set CHROME_PATH env var.\n' +
      'Checked paths:', JSON.stringify(CHROME_PATHS[process.platform], null, 2),
    );
    process.exitCode = 1;
    return;
  }
  console.log(`Using Chrome: ${chromePath}`);

  console.log(`Rendering ${DATA ?? 'src/data/resume.json'}`);
  console.log(`Layout: ${LAYOUT}${LAYOUT === 'ats' ? ' (linear text flow)' : ''}`);
  console.log(`Starting Astro dev server on port ${PORT}…`);
  const env = { ...process.env, FORCE_COLOR: '0', RESUME_LAYOUT: LAYOUT, RESUME_DENSITY: COMPACT ? 'compact' : 'normal' };
  if (DATA) env.RESUME_DATA = DATA;
  else delete env.RESUME_DATA;
  // Run Astro's entry point with this Node directly (not via npx) so that
  // killing `server` stops the dev server itself and the script can exit.
  const astroBin = resolve(ROOT, 'node_modules', 'astro', 'astro.js');
  const server = spawn(process.execPath, [astroBin, 'dev', '--port', String(PORT)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env,
  });

  let serverOutput = '';
  server.stdout.on('data', (d) => { serverOutput += d.toString(); });
  server.stderr.on('data', (d) => { serverOutput += d.toString(); });

  let browser;
  try {
    console.log('Waiting for dev server…');
    await waitForServer(DEV_URL, MAX_WAIT_MS);
    console.log('Dev server ready.');

    browser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
    });
    const page = await browser.newPage();
    // Lay the page out at the printable width so measurements match the PDF.
    await page.setViewport({ width: Math.round(printWidthPx), height: Math.round(printHeightPx) });
    await page.emulateMediaType('print');
    await page.goto(DEV_URL, { waitUntil: 'networkidle0' });

    await page.evaluate(() => document.fonts.ready);
    console.log(LAYOUT === 'ats' ? 'Font: Arial/Liberation Sans.' : 'Fonts: Arial/Liberation Sans body; Georgia/Liberation Serif headings.');

    // Also prepares long projects for splitting when auto-fit is off.
    const { zoom, before, after } = await autoFit(page, ZOOM ?? (FIT_ON ? undefined : 1), printHeightPx);
    if (FIT_ON || ZOOM !== undefined) {
      const fmt = (b) => b.map((px) => `${(px / 96).toFixed(2)}in`).join(', ');
      console.log(`Blank space per page at 100%: ${fmt(before)}`);
      if (zoom !== 1) console.log(`Scaled to ${(zoom * 100).toFixed(1)}%: ${fmt(after)}`);
      else console.log('Kept 100% scale (no better fit within limits).');
    } else {
      console.log('Auto-fit disabled; using 100% scale.');
    }

    const inch = (n) => `${n}in`;
    await page.pdf({
      path: OUTPUT,
      format: PAGE.format,
      margin: {
        top: inch(margins.top),
        bottom: inch(margins.bottom),
        left: inch(margins.left),
        right: inch(margins.right),
      },
      printBackground: true,
      displayHeaderFooter: false,
      tagged: true,
    });

    console.log(`PDF saved to ${OUTPUT}`);
  } catch (err) {
    console.error('PDF generation failed:', err.message);
    if (serverOutput) console.error('Server output:\n', serverOutput);
    process.exitCode = 1;
  } finally {
    server.kill('SIGTERM');
    if (browser) await browser.close();
  }
}

main();
