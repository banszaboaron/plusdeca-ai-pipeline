import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Engine, LimitError, StepError, loadState, truncatedSection } from '../lib/engine.mjs';
import { PIPELINES } from '../lib/pipelines.mjs';
import { writeReport } from '../lib/report.mjs';
import { runProcess } from '../lib/process.mjs';
import { fakeConfig, tempDirs, callLog, silent } from './helpers.mjs';

async function engineFor(runDir, config = fakeConfig(), pipeline = 'test') {
  const engine = new Engine({ runDir, config, pipeline, log: silent });
  await engine.init();
  return engine;
}

test('egy lépés lefut, menti a kimenetet, a tokenszámot és az állapotot', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  process.env.FAKE_MODE = 'normal';
  const engine = await engineFor(dirs.runDir);
  const r = await engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'írj valamit' });
  assert.match(r.text, /# GI1-P02/);
  assert.deepEqual(r.summary, { status: 'DRAFT_FOR_REVIEW' });
  const state = await loadState(dirs.runDir);
  assert.equal(state.steps.s1.status, 'DONE');
  assert.equal(state.steps.s1.tokens, 1234);
  assert.equal(state.calls, 1);
  assert.equal(await readFile(join(dirs.runDir, 'steps', 's1.prompt.md'), 'utf8'), 'írj valamit');
});

test('a szerep konfigurált gondolkodási szintje átmegy a parancsba', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const engine = await engineFor(dirs.runDir);
  await engine.step('pe', { role: 'PE', provider: 'codex', kind: 'review', prompt: 'verdict: REVIEW_PASS | REVISION_REQUIRED' });
  const [line] = await callLog(dirs.stateDir);
  assert.match(line, /--effort high/);
});

test('folytatás: kész lépést ugyanazzal a bemenettel nem hív újra; megváltozott bemenetnél újrafut (11-15), próbánál hibát dob', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const first = await engineFor(dirs.runDir);
  await first.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'A' });
  const second = await engineFor(dirs.runDir);
  const again = await second.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'A' });
  assert.equal(again.cached, true);
  assert.equal((await callLog(dirs.stateDir)).length, 1);
  await assert.rejects(second.tryCached(() => second.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'B' })), StepError);
  const rerun = await second.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'B' });
  assert.ok(!rerun.cached);
  assert.equal((await callLog(dirs.stateDir)).length, 2);
  assert.equal(second.state.reruns?.[0]?.step, 's1');
});

test('futásonkénti hívási korlát', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const engine = await engineFor(dirs.runDir, fakeConfig({ maxCalls: 1 }));
  await engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'A' });
  await assert.rejects(engine.step('s2', { role: 'GI1-3', provider: 'codex', prompt: 'B' }), LimitError);
  assert.equal((await callLog(dirs.stateDir)).length, 1);
});

test('időtúllépés: leállítja a folyamatot és TIMEOUT állapotot ír', async t => {
  const dirs = await tempDirs(); t.after(() => { process.env.FAKE_MODE = 'normal'; return dirs.cleanup(); });
  process.env.FAKE_MODE = 'sleep';
  const engine = await engineFor(dirs.runDir, fakeConfig({ stepTimeoutMs: 1500 }));
  const started = Date.now();
  await assert.rejects(engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'A' }), /időtúllépés/);
  assert.ok(Date.now() - started < 10_000);
  assert.equal((await loadState(dirs.runDir)).steps.s1.status, 'TIMEOUT');
});

test('hibás kilépés és üres kimenet: FAILED, stderr mentve', async t => {
  const dirs = await tempDirs(); t.after(() => { process.env.FAKE_MODE = 'normal'; return dirs.cleanup(); });
  for (const [mode, id] of [['fail', 'f1'], ['empty', 'f2']]) {
    process.env.FAKE_MODE = mode;
    const engine = await engineFor(join(dirs.runDir, id));
    await assert.rejects(engine.step(id, { role: 'GI1-3', provider: 'codex', prompt: 'A' }), StepError);
    assert.equal((await loadState(join(dirs.runDir, id))).steps[id].status, 'FAILED');
  }
  assert.match(await readFile(join(dirs.runDir, 'f1', 'steps', 'f1.stderr.txt'), 'utf8'), /szimulált hiba/);
});

test('nem létező parancs: FAILED, nem dob kezeletlen hibát', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const config = fakeConfig();
  config.providers.codex = { ...config.providers.codex, command: 'nincs-ilyen-parancs-xyz' };
  const engine = await engineFor(dirs.runDir, config);
  await assert.rejects(engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'A' }), StepError);
});

test('sérült állapotfájlt nem ír felül', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  await mkdir(dirs.runDir, { recursive: true });
  await writeFile(join(dirs.runDir, 'state.json'), '{ sérült');
  await assert.rejects(engineFor(dirs.runDir), /Sérült állapotfájl/);
  assert.equal(await readFile(join(dirs.runDir, 'state.json'), 'utf8'), '{ sérült');
});

test('más lánc futásmappáját nem használja', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  await engineFor(dirs.runDir, fakeConfig(), 'full');
  await assert.rejects(engineFor(dirs.runDir, fakeConfig(), 'replay-pe02'), /másik|lánchoz/);
});

test('próbafutás: nem hív modellt, de minden lépés promptját elkészíti', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig(), pipeline: 'full', dryRun: true, log: silent });
  await engine.init();
  const result = await PIPELINES.full(engine, { solver: 'claude' });
  assert.equal(result.outcome, 'COMPLETED');
  assert.equal((await callLog(dirs.stateDir)).length, 0);
  assert.deepEqual(engine.state.order, ['gi1-3', 'pe-r1', 'gi1-4', 'solver']);
});

test('runProcess: stdin-bemenet és stdout', async () => {
  const r = await runProcess(process.execPath, ['-e', 'process.stdin.pipe(process.stdout)'], { input: 'árvíztűrő' });
  assert.equal(r.code, 0);
  assert.equal(r.stdout, 'árvíztűrő');
});

test('a jelentés kiírja a lépéseket és a NEM MÉRT tokenjelölést', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const engine = await engineFor(dirs.runDir);
  await engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'A' });
  engine.state.steps.s1.tokens = null;
  const report = await writeReport(dirs.runDir, engine.state, { outcome: 'COMPLETED', checks: {} });
  assert.equal(report.calls, 1);
  const md = await readFile(join(dirs.runDir, 'report.md'), 'utf8');
  assert.match(md, /\| s1 \| GI1-3 \| csomag \| codex \|/);
  assert.match(md, /NEM MÉRT/);
  assert.match(md, /Kézi kiegészítés/);
});

test('csonka kimenet: X_VEGE zárósor X nyitósor nélkül', () => {
  assert.equal(truncatedSection('…"x": 1 }\nBLOKK_JSON_VEGE\n\nTANULOI_NEZET\na\nTANULOI_NEZET_VEGE\n'), 'BLOKK_JSON');
  assert.equal(truncatedSection('BLOKK_JSON\n{}\nBLOKK_JSON_VEGE\nGEPI_OSSZEGZES\nstatus: X\nGEPI_OSSZEGZES_VEGE\n'), null);
  assert.equal(truncatedSection('sima szöveg'), null);
  // VT1 megoldas (11-14): a válasz a nyitósor után véget ért; a zárósor nélküli szakasz is csonka.
  assert.equal(truncatedSection('# Megoldás\n\nBLOKK_JSON\n{"pages":['), 'BLOKK_JSON');
  assert.equal(truncatedSection('BLOKK_JSON\n{}\nBLOKK_JSON_VEGE\nGEPI_OSSZEGZES\nstatus: X\n'), 'GEPI_OSSZEGZES');
});
