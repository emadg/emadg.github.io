#!/usr/bin/env node
/**
 * Copy recorded fincrime-investigator-agent runs into the static site.
 *
 *   node scripts/sync-agent-traces.mjs <path to fincrime-investigator-agent/demo/traces>
 *
 * Copies every *.json trace byte-for-byte into public/demos/fincrime-agent/traces/
 * and writes index.json (the case picker's manifest). The replay page needs nothing
 * else: no backend, no API keys. Re-run after re-recording traces in the agent repo.
 *
 * Refuses to copy a trace that looks like it contains an e-mail address or an API key.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'demos', 'fincrime-agent', 'traces');
const src = process.argv[2] || process.env.AGENT_TRACES_DIR;

if (!src) {
  console.error('usage: node scripts/sync-agent-traces.mjs <agent repo>/demo/traces');
  process.exit(1);
}

const SUSPICIOUS = [
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, // e-mail address
  /AIza[0-9A-Za-z_-]{30,}/, // Google API key
  /sk-ant-[0-9A-Za-z_-]{20,}/, // Anthropic API key
  /sk-[0-9A-Za-z]{32,}/, // OpenAI-style key
];

const files = readdirSync(src).filter((f) => f.endsWith('.json') && f !== 'index.json');
if (files.length === 0) {
  console.error(`no *.json traces in ${src}`);
  process.exit(1);
}

const entries = [];
for (const file of files) {
  const text = readFileSync(join(src, file), 'utf8');
  for (const re of SUSPICIOUS) {
    if (re.test(text)) {
      console.error(`refusing ${file}: matches ${re} (possible secret or e-mail)`);
      process.exit(1);
    }
  }
  const t = JSON.parse(text);
  if (!t.title || !t.memo || !Array.isArray(t.trace)) {
    console.error(`refusing ${file}: missing title / memo / trace`);
    process.exit(1);
  }
  entries.push({
    id: basename(file, '.json'),
    file,
    title: t.title,
    subject: t.subject,
    recorded_at: t.recorded_at,
    model: t.memo.model,
    risk_level: t.memo.risk_level,
    status: t.memo.status,
  });
}

entries.sort((a, b) => String(a.recorded_at).localeCompare(String(b.recorded_at)));

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
for (const e of entries) copyFileSync(join(src, e.file), join(outDir, e.file));
writeFileSync(join(outDir, 'index.json'), JSON.stringify({ traces: entries }, null, 2) + '\n');

console.log(`copied ${entries.length} traces to ${outDir}`);
for (const e of entries) console.log(`  ${e.id}: ${e.title} [${e.model}, ${e.risk_level}]`);
