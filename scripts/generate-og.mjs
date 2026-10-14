#!/usr/bin/env node
/**
 * Generate the Open Graph / social card images (1200x630 PNG).
 *
 *   npm run og
 *
 * Renders an HTML template per card in headless Chrome (puppeteer-core with the
 * system Chrome, same lookup as generate-pdf.mjs; override with CHROME_PATH) and
 * writes:
 *   public/og-default.png             site-wide default
 *   public/og/projects.png            /projects
 *   public/og/<project slug>.png      each project page
 *
 * The look matches the site: slate-950 background, a faint particle network,
 * cyan accent, Inter + JetBrains Mono. Re-run after changing a card's text.
 */
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CARDS = [
  {
    out: 'public/og-default.png',
    kicker: 'Senior Research Engineer · AI & ML',
    title: 'Emad Gohari',
    subtitle: 'I build intelligent systems: NLP, LLM and agentic AI for regulated, high-stakes domains.',
    large: true,
  },
  {
    out: 'public/og/projects.png',
    kicker: 'Projects',
    title: 'Financial-crime ML, end to end',
    subtitle: 'An investigation agent, a real-time screening service and a fine-tuned extraction model, with measured results.',
  },
  {
    out: 'public/og/fincrime-investigator-agent.png',
    kicker: 'Project · LangGraph agent',
    title: 'Financial-crime investigation agent',
    subtitle: 'Cited risk memos, a deterministic risk floor and a verifier. 62/63 risk levels correct, 0 under-calls.',
  },
  {
    out: 'public/og/sanctions-screening-service.png',
    kicker: 'Project · ML service',
    title: 'Real-time sanctions screening',
    subtitle: 'Calibrated LightGBM matcher: 95.3% recall, 7.2 ms p50 on one vCPU, drift checks and a gated refresh.',
  },
  {
    out: 'public/og/filings-extraction-finetune.png',
    kicker: 'Project · LLM fine-tuning',
    title: 'Grounded extraction from SEC filings',
    subtitle: 'SFT + LoRA + DPO of a small open model with a verifier-checked teacher. GPU results pending.',
  },
];

const CHROME_PATHS = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'],
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ],
};

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  return (CHROME_PATHS[process.platform] || []).find((p) => existsSync(p)) || null;
}

/** Deterministic particle network so the images do not change between runs. */
function network(seed) {
  let s = seed;
  const rand = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const pts = Array.from({ length: 70 }, () => [rand() * 1200, rand() * 630]);
  let lines = '';
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
      if (d < 150) {
        const o = (0.28 * (1 - d / 150)).toFixed(3);
        lines += `<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" stroke="rgba(100,149,237,${o})" stroke-width="1"/>`;
      }
    }
  }
  const dots = pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="rgba(100,149,237,0.6)"/>`).join('');
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">${lines}${dots}</svg>`;
}

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function html(card, i) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #020617; font-family: Inter, system-ui, sans-serif; color: #f8fafc; }
  .bg { position: absolute; inset: 0; }
  .glow { position: absolute; inset: 0; background:
      radial-gradient(800px 420px at 85% 10%, rgba(34,211,238,0.10), transparent 60%),
      radial-gradient(700px 500px at 0% 100%, rgba(59,130,246,0.12), transparent 60%); }
  .panel { position: absolute; left: 80px; right: 80px; top: 0; bottom: 0; background: rgba(15,23,42,0.55);
      border-left: 1px solid rgba(51,65,85,0.5); border-right: 1px solid rgba(51,65,85,0.5); backdrop-filter: blur(4px);
      padding: 70px 72px; display: flex; flex-direction: column; }
  .top { display: flex; justify-content: space-between; align-items: center; }
  .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
  .logo { font-size: 30px; font-weight: 600; letter-spacing: -0.02em; }
  .logo span { color: #22d3ee; }
  .badge { display: inline-flex; align-items: center; gap: 12px; border: 1px solid rgba(34,211,238,0.5); background: rgba(34,211,238,0.1);
      color: #22d3ee; border-radius: 999px; padding: 10px 22px; font-size: 22px; box-shadow: 0 0 24px rgba(34,211,238,0.12); }
  .badge i { width: 10px; height: 10px; border-radius: 50%; background: #22d3ee; box-shadow: 0 0 10px #22d3ee; }
  .main { margin-top: auto; margin-bottom: auto; }
  h1 { font-weight: 600; letter-spacing: -0.03em; line-height: 1.08; font-size: ${card.large ? 96 : 66}px; margin-bottom: 26px; }
  h1 em { font-style: normal; background: linear-gradient(90deg, #22d3ee, #3b82f6); -webkit-background-clip: text; color: transparent; }
  p { font-size: ${card.large ? 32 : 29}px; line-height: 1.4; color: #cbd5e1; max-width: 920px; }
  .foot { display: flex; justify-content: space-between; color: #94a3b8; font-size: 22px; }
  .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; background: linear-gradient(90deg, #22d3ee, #3b82f6); }
</style></head><body>
  <div class="bg">${network(17 + i * 101)}</div>
  <div class="glow"></div>
  <div class="panel">
    <div class="top"><div class="logo mono">EG<span>.</span></div><div class="badge mono"><i></i>${esc(card.kicker)}</div></div>
    <div class="main">
      <h1>${card.large ? `${esc(card.title)}<em>.</em>` : esc(card.title)}</h1>
      <p>${esc(card.subtitle)}</p>
    </div>
    <div class="foot mono"><span>emadgohari.com</span><span>NLP · LLMs · ML systems</span></div>
  </div>
  <div class="bar"></div>
</body></html>`;
}

const chrome = findChrome();
if (!chrome) {
  console.error('Chrome not found. Set CHROME_PATH.');
  process.exit(1);
}

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  for (const [i, card] of CARDS.entries()) {
    await page.setContent(html(card, i), { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    const out = join(root, card.out);
    mkdirSync(dirname(out), { recursive: true });
    await page.screenshot({ path: out, type: 'png' });
    console.log(`wrote ${card.out}`);
  }
} finally {
  await browser.close();
}
