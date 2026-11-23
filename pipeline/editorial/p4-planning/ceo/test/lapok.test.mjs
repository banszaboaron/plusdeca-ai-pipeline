import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { listeningSheetAttachment, listeningSheetIds } from '../lib/lapok.mjs';

test('a hivatkozott lap-ID-k ismétlés nélkül, sorrendben', () => {
  const t = 'Forrás: X\nHALLGATÁSI LAP: FK-H18-H6\nmég egyszer HALLGATÁSI LAP: FK-H18-H6, és HALLGATASI LAP: VIZS-DELFB2-ex1.';
  assert.deepEqual(listeningSheetIds(t), ['FK-H18-H6', 'VIZS-DELFB2-ex1']);
  assert.deepEqual(listeningSheetIds('nincs benne lap'), []);
});

test('a vezérlő csatolja a meglévő lapot, a hiányzóról jelzést ad', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lap-'));
  try {
    await writeFile(join(dir, 'FK-H18-H6.md'), '# FK-H18-H6 — Panne\n[00:01] Bonjour.\n', 'utf8');
    const out = await listeningSheetAttachment('HALLGATÁSI LAP: FK-H18-H6\nHALLGATÁSI LAP: FK-NINCS', { dir });
    assert.match(out, /# Hallgatási lap — FK-H18-H6 \(a vezérlő csatolta/);
    assert.match(out, /\[00:01\] Bonjour\./);
    assert.match(out, /# Hallgatási lap — FK-NINCS[\s\S]*A lap nem található/);
    assert.equal(await listeningSheetAttachment('nincs hivatkozás', { dir }), null);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('a csatolási keret fölötti lapot csak megnevezi', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lap-'));
  try {
    await writeFile(join(dir, 'AA.md'), 'x'.repeat(50), 'utf8');
    await writeFile(join(dir, 'BB.md'), 'y'.repeat(50), 'utf8');
    const out = await listeningSheetAttachment('HALLGATÁSI LAP: AA HALLGATÁSI LAP: BB', { dir, maxChars: 60 });
    assert.match(out, /x{50}/);
    assert.match(out, /B[\s\S]*nem fért a csatolási keretbe/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('az engine a megbízásban hivatkozott lapot az agent promptjába csatolja', async t => {
  const { Engine } = await import('../lib/engine.mjs');
  const { fakeConfig, tempDirs, callLog, silent } = await import('./helpers.mjs');
  const { LAP_DIR } = await import('../lib/lapok.mjs');
  const { mkdir } = await import('node:fs/promises');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const id = `TESZT-${process.pid}`;
  await mkdir(LAP_DIR, { recursive: true });
  const file = join(LAP_DIR, `${id}.md`);
  await writeFile(file, `# ${id}\n` + 'átirat '.repeat(2000), 'utf8');
  t.after(() => rm(file, { force: true }));
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig(), pipeline: 'test', log: silent });
  await engine.init();
  await engine.step('a', { role: 'GI1-3', provider: 'codex', prompt: 'listening-terv' });
  await engine.step('b', { role: 'GI1-3', provider: 'codex', prompt: `listening-terv\nHALLGATÁSI LAP: ${id}` });
  const [a, b] = (await callLog(dirs.stateDir)).map(l => Number(l.split('\t').at(-1)));
  assert.ok(b - a > 14_000, `a lap nem került a promptba (${a} → ${b} bájt)`);
});
