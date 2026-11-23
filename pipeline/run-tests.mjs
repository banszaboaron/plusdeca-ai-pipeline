#!/usr/bin/env node
// Runs every test of the public copy offline (no model call, no network, no API key):
//   1. the CEO orchestrator tests (fake agent CLI), skipping by name the tests listed in PRIVATE_CONTENT_TESTS.md;
//   2. the P5 gate tests that do not read the private week-1 content;
//   3. pipeline/test/*.test.mjs: the gates on the real U21 example and on the synthetic mini week.
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const ceo = join(root, 'editorial', 'p4-planning', 'ceo');
const p5 = join(root, 'p5');
const P5_PRIVATE = new Set(['gates', 'blocks', 'glosses', 'field-alternatives', 'build', 'app-crawl'].map(n => `${n}.test.mjs`));

const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const skipped = readFileSync(join(root, 'PRIVATE_CONTENT_TESTS.md'), 'utf8')
  .split('## CEO tests skipped by name')[1].split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2).trim());

const env = { ...process.env };
delete env.PLUSDECA_OPENAI_API_KEY;
const files = (dir, keep = () => true) => readdirSync(join(dir, 'test')).filter(f => f.endsWith('.test.mjs') && keep(f)).map(f => join('test', f));

const suites = [
  { name: 'CEO orchestrator', cwd: ceo, args: [...skipped.map(n => `--test-skip-pattern=^${escape(n)}$`), ...files(ceo)] },
  { name: 'P5 gates', cwd: p5, args: files(p5, f => !P5_PRIVATE.has(f)) },
  { name: 'Public example', cwd: root, args: files(root) },
];

let failed = 0;
for (const s of suites) {
  const r = spawnSync(process.execPath, ['--test', ...s.args], { cwd: s.cwd, env, encoding: 'utf8' });
  const line = k => (r.stdout.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) ?? [])[1] ?? '?';
  console.log(`${s.name.padEnd(18)} tests ${line('tests')}, pass ${line('pass')}, fail ${line('fail')}, skipped ${line('skipped')}`);
  if (r.status !== 0) { failed += 1; console.log(r.stdout.split('\n').filter(l => /^\s*not ok|Error/.test(l)).slice(0, 20).join('\n')); }
}
console.log(`Skipped by name (need private course content): ${skipped.length}. See PRIVATE_CONTENT_TESTS.md.`);
process.exitCode = failed ? 1 : 0;
