import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Engine } from '../lib/engine.mjs';
import { PIPELINES } from '../lib/pipelines.mjs';
import { SOLVER_RECHECK_NOTE, agent, extractSection, extractSolverResponse, providerFor, reviewRecord, reviewedStep, weekBlockId, weekBlocks } from '../lib/week.mjs';
import { fakeConfig, tempDirs, callLog, silent } from './helpers.mjs';

const BRIEF = 'editorial/p4-planning/ceo/test/fixtures/het-brief.md';

async function engineFor(dirs, limits = {}) {
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig({ maxCalls: 60, ...limits }), pipeline: 'het', log: silent });
  await engine.init();
  return engine;
}

async function approve(dirs, step = 'fr-jovahagyas', text = 'OK') {
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', `${step}.md`), text);
}

test('extractSection: a fejléctől a következő azonos szintű fejlécig, gépi összegzés nélkül', () => {
  const text = '## HETI KONCEPCIÓ — Kirándulás\nTéma.\n### Részlet\nx\n## BRIEF GR\nNyelvtan.\n## BRIEF RR\nOlvasás.\n\nGEPI_OSSZEGZES\nstatus: DRAFT_FOR_REVIEW\nGEPI_OSSZEGZES_VEGE\n';
  assert.equal(extractSection(text, 'HETI KONCEPCIÓ'), '## HETI KONCEPCIÓ — Kirándulás\nTéma.\n### Részlet\nx\n');
  assert.equal(extractSection(text, 'BRIEF GR'), '## BRIEF GR\nNyelvtan.\n');
  assert.equal(extractSection(text, 'BRIEF RR'), '## BRIEF RR\nOlvasás.\n');
  assert.equal(extractSection(text, 'BRIEF XR'), null);
});

test('weekBlocks és weekBlockId: oszloponként, a teszt az oszlop végén; a P5-azonosító a pozícióból', () => {
  const all = weekBlocks();
  assert.equal(all.length, 23);
  assert.deepEqual(all.slice(0, 6).map(b => b.id), ['GI1', 'GI2', 'GI3', 'GI4', 'GI5', 'GIT']);
  assert.deepEqual(all.slice(-5).map(b => b.id), ['XI1', 'XI2', 'XI3', 'XI4', 'XI5']);
  assert.deepEqual(weekBlocks(['gi2', 'RI1']).map(b => b.id), ['GI2', 'RI1']);
  assert.throws(() => weekBlocks(['ZZ9']), /Ismeretlen blokk/);
  assert.equal(weekBlockId('GI1', '(1,1)', 2), 'w02-u-1-1');
  assert.equal(weekBlockId('XI3', '(3,4)', 12), 'w12-u-3-4');
  assert.equal(weekBlockId('GIT', 'teszt: G', 2), 'w02-test-grammar');
  assert.equal(weekBlockId('RIT', 'teszt: R', 2), 'w02-test-reading-uof');
  assert.equal(weekBlockId('VIT', 'teszt: V', 2), 'w02-test-vocabulary');
});

test('providerFor: assignWeek felülír; alapból ellenőr = a PE szolgáltatója, szerző = a GI1-3-é', () => {
  const config = { assign: { PE: 'claude-web', 'GI1-3': 'codex' } };
  assert.equal(providerFor(config, 'NyE'), 'claude-web');
  assert.equal(providerFor(config, 'FR'), 'codex');
  assert.equal(providerFor({ ...config, assignWeek: { FR: 'claude', reviewer: 'claude' } }, 'FR'), 'claude');
  assert.equal(providerFor({ ...config, assignWeek: { reviewer: 'claude' } }, 'HE'), 'claude');
});

test('reviewRecord: REVIEW_PASS, a kéziratlánc fájljai, ellenőri szöveg nélkül', () => {
  const record = reviewRecord('w02-u-1-1', { kezirat: 'w02-u-1-1.kezirat.md', megoldas: 'w02-u-1-1.megoldas.md', reviews: { Terv: [{ name: 'NavE', pass: true, summary: { blocker: 0, major: 0, minor: 1 } }] } });
  assert.match(record, /^REVIEW_PASS$/m);
  assert.match(record, /- w02-u-1-1\.kezirat\.md/);
  assert.match(record, /Terv \/ NavE: PASS \(blocker 0, major 0, minor 1\)/);
});

test('reviewedStep: REVISION → javítás a jelentéssel → recheck csak a nem PASS ellenőrnél', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  process.env.FAKE_REVIEWS = 'REVISION_REQUIRED,REVIEW_PASS';
  t.after(() => { process.env.FAKE_REVIEWS = 'REVIEW_PASS'; });
  const engine = await engineFor(dirs);
  const r = await reviewedStep(engine, {
    id: 'x', maxRounds: 2, requirement: [['Követelmény', 'Követelmény szövege']],
    author: { role: 'FR', provider: 'codex', prompt: '# Megbízás\n' },
    reviewers: [{ name: 'NavE', provider: 'codex', scope: 'próba', focus: 'minden' }],
  });
  assert.equal(r.rounds, 1);
  assert.deepEqual(engine.state.order, ['x', 'x-nave', 'x-rev1', 'x-nave-recheck1']);
  const fix = await readFile(join(dirs.runDir, 'steps', 'x-rev1.prompt.md'), 'utf8');
  assert.match(fix, /# NavE jelentése/);
  assert.match(fix, /# A saját korábbi válaszod/);
  const recheck = await readFile(join(dirs.runDir, 'steps', 'x-nave-recheck1.prompt.md'), 'utf8');
  assert.match(recheck, /A korábbi jelentésed/);
  assert.match(recheck, /A javított, vizsgálandó anyag/);
});

test('reviewedStep: két sikertelen kör után megáll, nem pörög', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  process.env.FAKE_REVIEWS = 'REVISION_REQUIRED';
  t.after(() => { process.env.FAKE_REVIEWS = 'REVIEW_PASS'; });
  const engine = await engineFor(dirs);
  const r = await reviewedStep(engine, {
    id: 'x', maxRounds: 2, requirement: [],
    author: { role: 'FR', provider: 'codex', prompt: '# Megbízás\n' },
    reviewers: [{ name: 'PE', provider: 'codex', scope: 'próba', focus: 'minden' }],
  });
  assert.equal(r.blocked.outcome, 'BLOCKED_DECISION_MAX_ROUNDS');
  assert.equal(r.blocked.checks.open[0].reviewer, 'PE');
});

test('het: jóváhagyás nélkül az FR után megáll, a kérdés a jelentésbe kerül', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  process.env.FAKE_REVIEWS = 'REVIEW_PASS';
  const engine = await engineFor(dirs);
  const result = await PIPELINES.het(engine, { brief: BRIEF, week: 2, blocks: ['GI1'], crawl: false });
  assert.equal(result.outcome, 'BLOCKED_DECISION');
  assert.equal(result.checks.step, 'fr-jovahagyas');
  assert.match(result.checks.question, /Jóváhagyod\?/);
  assert.deepEqual(new Set(engine.state.order), new Set(['fr', 'fr-pe', 'fr-nave']));
});

test('het (GI1, GI2): FR → jóváhagyás → GR → blokkonként Terv, Kézirat, Megoldás, Egyesítés → P5', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  process.env.FAKE_REVIEWS = 'REVIEW_PASS';
  await approve(dirs);
  const engine = await engineFor(dirs);
  const result = await PIPELINES.het(engine, { brief: BRIEF, week: 2, blocks: ['GI1', 'GI2'], crawl: false });
  assert.equal(result.outcome, 'COMPLETED', JSON.stringify(result.checks, null, 2).slice(0, 2000));
  assert.deepEqual(result.checks.blocks, { GI1: 'DONE', GI2: 'DONE' });
  const order = engine.state.order;
  // A párhuzamos ellenőrök sorrendje nem rögzített: halmazként vetjük össze.
  assert.deepEqual(order.slice(0, 4).filter(id => !id.startsWith('fr-')), ['fr', 'gr']);
  assert.deepEqual(new Set(order.slice(1, 3)), new Set(['fr-pe', 'fr-nave']));
  assert.deepEqual(new Set(order.slice(4, 8)), new Set(['gr-pe', 'gr-nave', 'gr-nye', 'gr-ue']));
  assert.ok(!order.includes('rr'), 'csak az érintett oszlop rendezője fut');
  for (const id of ['gi1-terv', 'gi1-terv-nave', 'gi1-terv-ue', 'gi1-kezirat', 'gi1-kezirat-nave', 'gi1-megoldas', 'gi1-megoldas-pe', 'gi1-megoldas-nave', 'gi1-megoldas-nye', 'gi1-megoldas-he', 'gi1-megoldas-ue', 'gi1-ue-vegigjaras', 'gi2-terv']) {
    assert.ok(order.includes(id), `hiányzó lépés: ${id}`);
  }
  // A második blokk terve látja az első elfogadott tervét (ne ismételje).
  assert.match(await readFile(join(dirs.runDir, 'steps', 'gi2-terv.prompt.md'), 'utf8'), /Az oszlop korábbi blokkjainak elfogadott terve/);
  // A megoldásíró a blokk saját P5-azonosítóját és kéziratfájlját kapja.
  const solution = await readFile(join(dirs.runDir, 'steps', 'gi1-megoldas.prompt.md'), 'utf8');
  assert.match(solution, /A blokk P5-azonosítója: w02-u-1-1/);
  assert.match(solution, /`w02-u-1-1\.kezirat\.md`/);
  assert.match(solution, /TANULOI_NEZET/);
  // Egyesítés: review-nyilvántartás + kéziratlánc a handoffs-ban, kötött blokk-JSON.
  assert.match(await readFile(join(dirs.runDir, 'handoffs', 'w02-u-1-1.review-pass.md'), 'utf8'), /^REVIEW_PASS$/m);
  assert.ok(existsSync(join(dirs.runDir, 'handoffs', 'w02-u-2-1.megoldas.md')));
  const block = JSON.parse(await readFile(join(dirs.runDir, 'blocks', 'block.w02-u-1-1.json'), 'utf8'));
  assert.equal(block.review.reviewPass, 'w02-u-1-1.review-pass.md');
  // P5: a futásmappában épül, a repó p5/out-ját nem érinti.
  assert.ok(['RELEASED', 'BUILT_UNCRAWLED'].includes(result.checks.p5.status), JSON.stringify(result.checks.p5));
  const plan = JSON.parse(await readFile(result.checks.p5.plan, 'utf8'));
  assert.equal(plan.week, 2);
  assert.equal(plan.blocks.length, 2);
  // Ugyanazzal a futásmappával újraindítva nem hív újra modellt.
  const before = (await callLog(dirs.stateDir)).length;
  const again = await PIPELINES.het(await engineFor(dirs), { brief: BRIEF, week: 2, blocks: ['GI1', 'GI2'], crawl: false });
  assert.equal(again.outcome, 'COMPLETED');
  assert.equal((await callLog(dirs.stateDir)).length, before);
});

test('het: döntésre váró blokk alatt a független blokkok haladnak; az oszlop következő blokkja megvárja', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  process.env.FAKE_REVIEWS = 'REVIEW_PASS';
  process.env.FAKE_AUTHOR = 'decide';
  process.env.FAKE_DECIDE_IF = 'a(z) GI1 blokk Terv fázisán';
  t.after(() => { delete process.env.FAKE_AUTHOR; delete process.env.FAKE_DECIDE_IF; });
  await approve(dirs);
  const notes = [];
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig({ maxCalls: 80 }), pipeline: 'het', log: silent, hooks: { onWaiting: w => { notes.push(w); } } });
  await engine.init();
  const result = await PIPELINES.het(engine, { brief: BRIEF, week: 2, blocks: ['GI1', 'GI2', 'RI1'], crawl: false });
  assert.equal(result.outcome, 'BLOCKED_BLOCKS');
  assert.equal(result.checks.blocks.GI1.outcome, 'BLOCKED_DECISION');
  assert.equal(result.checks.blocks.RI1, 'DONE');
  assert.equal(result.checks.blocks.GI2.outcome, 'BLOCKED_DEPENDENCY');
  assert.deepEqual(result.checks.blocks.GI2.checks.waitsFor, ['GI1']);
  assert.ok(!engine.state.order.includes('gi2-terv'), 'a GI2 terve a GI1 elfogadott tervére épülne');
  assert.ok(engine.state.order.includes('ri1-ue-vegigjaras'));
  assert.deepEqual(notes.map(n => [n.step, n.deferred]), [['gi1-terv', true]]);
});

test('het: a halasztott döntés megérkezése után a blokk folytatódik, utána a tőle függő blokk', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  process.env.FAKE_REVIEWS = 'REVIEW_PASS';
  process.env.FAKE_AUTHOR = 'decide';
  process.env.FAKE_DECIDE_IF = 'a(z) GI1 blokk Terv fázisán';
  t.after(() => { delete process.env.FAKE_AUTHOR; delete process.env.FAKE_DECIDE_IF; });
  await approve(dirs);
  const config = { ...fakeConfig({ maxCalls: 80 }), decisions: { waitMinutes: 60, pollSeconds: 1 } };
  let order = null;
  // A válasz akkor jön, amikor a CEO már csak vár: addig a RI1 végigment.
  const sleep = async () => { order ??= [...engine.state.order]; await approve(dirs, 'gi1-terv', '4 példa legyen.'); };
  const engine = new Engine({ runDir: dirs.runDir, config, pipeline: 'het', log: silent, sleep });
  await engine.init();
  const result = await PIPELINES.het(engine, { brief: BRIEF, week: 2, blocks: ['GI1', 'GI2', 'RI1'], crawl: false });
  assert.equal(result.outcome, 'COMPLETED', JSON.stringify(result.checks, null, 2).slice(0, 2000));
  assert.ok(order.includes('ri1-ue-vegigjaras') && !order.includes('gi2-terv'), 'várakozás előtt a független blokk kész, a függő nem indult');
  const all = engine.state.order;
  assert.ok(all.indexOf('gi1-terv-dontes') < all.indexOf('gi2-terv'));
  assert.match(await readFile(join(dirs.runDir, 'steps', 'gi2-terv.prompt.md'), 'utf8'), /Az oszlop korábbi blokkjainak elfogadott terve/);
  assert.equal(engine.state.waiting, null);
  assert.deepEqual(engine.state.deferred, {});
});

test('het: a PRESIDENT módosítást kér → FR átdolgozás (review-val) → újabb jóváhagyás', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  process.env.FAKE_REVIEWS = 'REVIEW_PASS';
  await approve(dirs, 'fr-jovahagyas', 'A téma legyen inkább egy elmaradt vonatút.');
  const engine = await engineFor(dirs);
  const result = await PIPELINES.het(engine, { brief: BRIEF, week: 2, blocks: ['GI1'], p5: false });
  assert.equal(result.outcome, 'BLOCKED_DECISION');
  assert.equal(result.checks.step, 'fr-jovahagyas2');
  assert.deepEqual(new Set(engine.state.order), new Set(['fr', 'fr-pe', 'fr-nave', 'fr-elnok1', 'fr-elnok1-pe', 'fr-elnok1-nave']));
  assert.match(await readFile(join(dirs.runDir, 'steps', 'fr-elnok1.prompt.md'), 'utf8'), /# A PRESIDENT kérése\n\nA téma legyen inkább egy elmaradt vonatút\./);
});

test('het --solver: a független megoldó a Megoldás fázis ellenőre; problémánál javítás és újra megoldó', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  process.env.FAKE_REVIEWS = 'REVIEW_PASS';
  process.env.FAKE_SOLVER_PROBLEMS = '1,0';
  t.after(() => { process.env.FAKE_SOLVER_PROBLEMS = '0'; });
  await approve(dirs);
  const engine = await engineFor(dirs);
  const result = await PIPELINES.het(engine, { brief: BRIEF, week: 2, blocks: ['GI1'], solver: 'claude', crawl: false });
  assert.equal(result.outcome, 'COMPLETED', JSON.stringify(result.checks).slice(0, 1500));
  const order = engine.state.order;
  for (const id of ['gi1-megoldas-solver', 'gi1-megoldas-rev1', 'gi1-megoldas-solver-recheck1']) assert.ok(order.includes(id), id);
  assert.match(await readFile(join(dirs.runDir, 'steps', 'gi1-megoldas-rev1.prompt.md'), 'utf8'), /A független megoldó jelentése/);
});

test('het: hiányzó --brief vagy --het érthető hibát ad', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  await assert.rejects(PIPELINES.het(await engineFor(dirs), { week: 2 }), /--brief/);
  await assert.rejects(PIPELINES.het(await engineFor(dirs), { brief: BRIEF }), /--het/);
});

test('extractSolverResponse: a megoldásíró „Független megoldó” táblája a következő azonos szintű címsorig', () => {
  const text = '## 5. Dispositionök\n\n### NyE\n\n| NYE-1 | FIXED | x |\n\n### Független megoldó\n\n| Tétel | Disposition | Indoklás |\n|---|---|---|\n| p19-s003 | Már FIXED | A kulcs elfogadja. |\n\n## 6. Változáslista\n\n- y\n';
  assert.equal(extractSolverResponse(text), '| Tétel | Disposition | Indoklás |\n|---|---|---|\n| p19-s003 | Már FIXED | A kulcs elfogadja. |');
  assert.equal(extractSolverResponse('# Csak kézirat\n\nszöveg'), null);
});

test('reviewedStep: a megoldó a recheckben megkapja a korábbi jelentését és a számolási szabályt (U11, 10-31)', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  process.env.FAKE_SOLVER_PROBLEMS = '2,0';
  t.after(() => { delete process.env.FAKE_SOLVER_PROBLEMS; });
  const engine = await engineFor(dirs);
  const r = await reviewedStep(engine, {
    id: 'm', maxRounds: 2, requirement: [],
    author: { role: 'MEGOLDASIRO', provider: 'codex', prompt: '# Megbízás\n' },
    reviewers: [{ name: 'SOLVER', solver: true, provider: 'claude', agent: agent('SOLVER') }],
  });
  assert.equal(r.rounds, 1);
  const first = await readFile(join(dirs.runDir, 'steps', 'm-solver.prompt.md'), 'utf8');
  assert.doesNotMatch(first, /A korábbi jelentésed/);
  const recheck = await readFile(join(dirs.runDir, 'steps', 'm-solver-recheck1.prompt.md'), 'utf8');
  assert.match(recheck, /# A korábbi jelentésed/);
  assert.match(recheck, /# Recheck: így számold a problémákat/);
  assert.ok(SOLVER_RECHECK_NOTE.includes('REJECTED_WITH_REASON'));
});
