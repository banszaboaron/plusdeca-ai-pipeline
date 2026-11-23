// Public tests on the real U21 example and the synthetic mini week: the deterministic P5 gates, run offline.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ex = join(root, 'examples', 'w01-u-2-1');
const gates = (input, handoffs) => {
  const r = spawnSync(process.execPath, [join(root, 'p5', 'gates.mjs'), input, '--handoffs', handoffs, '--json', '-'], { encoding: 'utf8' });
  const json = r.stdout.slice(r.stdout.indexOf('{'));
  return { code: r.status, report: JSON.parse(json) };
};
const count = (report, cl, severity = 'error') => report.findings.filter(f => f.cl === cl && f.severity === severity).length;

test('U21 after the French-life round (2026-11-15): all gates pass, including the review binding', () => {
  const dir = join(ex, '2-french-life-round', 'output');
  const { code, report } = gates(join(dir, 'block.w01-u-2-1.json'), dir);
  assert.equal(code, 0);
  assert.equal(report.findings.filter(f => f.severity === 'error').length, 0);
});

test('U21 first production run (2026-11-01): passed the gates of that day, fails only the later CL-27 rule', () => {
  const dir = join(ex, '1-production', 'output');
  const recorded = JSON.parse(readFileSync(join(dir, 'p5-report.w01-u-2-1.json'), 'utf8'));
  assert.equal(recorded.ok, true);
  const { code, report } = gates(join(dir, 'block.w01-u-2-1.json'), dir);
  assert.equal(code, 1);
  const errors = report.findings.filter(f => f.severity === 'error');
  assert.ok(errors.length > 0);
  assert.deepEqual([...new Set(errors.map(f => f.cl))], ['CL-27']);
});

test('changing one learner string after review breaks the review binding (CL-01)', () => {
  const dir = join(ex, '2-french-life-round', 'output');
  const block = JSON.parse(readFileSync(join(dir, 'block.w01-u-2-1.json'), 'utf8'));
  const tampered = JSON.stringify(block).replace(/"Samedi, 19 h 40\./, '"Dimanche, 19 h 40.');
  assert.notEqual(tampered, JSON.stringify(block));
  const tmp = join(tmpdir(), `u21-tampered-${process.pid}.json`);
  writeFileSync(tmp, tampered);
  const { code, report } = gates(tmp, dir);
  assert.equal(code, 1);
  assert.ok(count(report, 'CL-01') > 0);
});

test('synthetic mini week: every gate passes', () => {
  const mini = join(root, 'p5', 'test', 'fixtures', 'mini');
  const { code } = gates(join(mini, 'week.json'), join(mini, 'handoffs'));
  assert.equal(code, 0);
});

