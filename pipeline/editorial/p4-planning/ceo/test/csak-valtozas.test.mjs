// 2026-11-13: „csak a változás” (javításlistás) leadás a nagy megoldások javító köreiben (lib/csak-valtozas.mjs).
// U33 (11-09, 240 item): a teljes újraleadás a ~450 KB-os megbízással együtt nem fért el, a válasz szétesett. A szerző
// ezért BLOKK_JAVITAS-t ad, a lánc az előző teljes BLOKK_JSON-ba fésüli; az ellenőrök a teljes, összefésült megoldást kapják.

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Engine } from '../lib/engine.mjs';
import { extractBlockJson } from '../lib/p5.mjs';
import { applyBlockPatch, blockSize, formatBlock, mergePatchedSolution, needsPatchMode, PATCH_THRESHOLD } from '../lib/csak-valtozas.mjs';
import { reviewedStep } from '../lib/week.mjs';
import { javitasPipeline } from '../lib/javitas.mjs';
import { fakeConfig, silent, tempDirs } from './helpers.mjs';

const BID = 'w01-u-9-9';
const itemId = i => `${BID}-i${String(i).padStart(3, '0')}`;
const item = (i, text = `Le retour numéro ${i} est correct.`) => ({
  id: itemId(i), capability: 'CAP-typed-short', variant: 'PV-typed-short', prompt: `Question ${i}`,
  response: { type: 'text' }, solution: { type: 'exact', key: `clé ${i}` }, feedback: { correct: text },
});
const blockOf = n => ({
  id: BID, title: 'Titre du bloc', pages: [
    { id: `${BID}-p01`, title: 'Intro', content: [] },
    { id: `${BID}-p02`, title: 'Exercices', items: Array.from({ length: n }, (_, i) => item(i)) },
  ],
});
const gepi = status => `\n\nGEPI_OSSZEGZES\nstatus: ${status}\nGEPI_OSSZEGZES_VEGE\n`;
const MD = '## 1. Megoldás itemenként\n\nA kulcsok a BLOKK_JSON-ban.\n\n## 2. Findingok\n\n- NYE-01: FIXED\n';
const VIEW = '\n\nTANULOI_NEZET\nQuestion 0 …\nTANULOI_NEZET_VEGE\n';
const full = block => `${MD}\nBLOKK_JSON\n${JSON.stringify(block)}\nBLOKK_JSON_VEGE${VIEW}${gepi('DRAFT_FOR_REVIEW')}`;
const patched = patch => `${MD}\nBLOKK_JAVITAS\n${typeof patch === 'string' ? patch : JSON.stringify(patch)}\nBLOKK_JAVITAS_VEGE${VIEW}${gepi('DRAFT_FOR_REVIEW')}`;

const BIG = full(blockOf(120));
const SMALL = full(blockOf(20));
const GOOD_PATCH = {
  replace: [item(5, 'Nouveau retour pour l’item cinq.')],
  add: [{ pageId: `${BID}-p02`, afterId: itemId(9), item: item(500, 'Un item tout neuf après le neuvième.') }],
  remove: [{ id: itemId(7), reason: 'NAVE-02: doublon de l’item 6' }],
};

const review = verdict => `jelentés\n\nGEPI_OSSZEGZES\nverdict: ${verdict}\nblocker: 0\nmajor: ${verdict === 'REVIEW_PASS' ? 0 : 1}\nminor: 0\nGEPI_OSSZEGZES_VEGE\n`;
const PASS = review('REVIEW_PASS');
const FAIL = review('REVISION_REQUIRED');
const author = { role: 'MEGOLDASIRO', provider: 'codex', agent: undefined, prompt: '# Megbízás\n' };
const nye = { name: 'NyE', provider: 'codex', agent: undefined, scope: 'próba', focus: 'próba' };

function scripted(answer) {
  const prompts = {};
  const invoke = async (_provider, { outFile, prompt }) => {
    const id = basename(outFile).replace(/\.out\.md$/, '');
    prompts[id] = prompt;
    return { code: 0, text: answer(id, prompt), stdout: '', stderr: '', ms: 1 };
  };
  return { invoke, prompts };
}
async function engineFor(dirs, invoke) {
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig({ peRuns: 1, maxCalls: 30 }), pipeline: 'test', log: silent, invoke });
  await engine.init();
  return engine;
}
const step = (engine, extra = {}) => reviewedStep(engine, { id: 'x', author, reviewers: [nye], requirement: [], maxRounds: 2, patch: true, ...extra });
const itemIds = text => extractBlockJson(text).block.pages[1].items.map(it => it.id);

test('küszöb: nagy BLOKK_JSON (≥ 100 item vagy ≥ 150 KB) javításlistás; a szokásos egység és a BLOKK_JSON nélküli szöveg nem', () => {
  assert.deepEqual(PATCH_THRESHOLD, { minItems: 100, minBytes: 150_000 });
  assert.equal(needsPatchMode(BIG), true);
  assert.equal(needsPatchMode(full(blockOf(99))), false);
  assert.equal(needsPatchMode(SMALL), false);
  // Kevés, de nagyon hosszú item: a bájtméret dönt.
  const fat = blockOf(40);
  for (const it of fat.pages[1].items) it.feedback.long = 'x'.repeat(4000);
  assert.ok(blockSize(full(fat)).bytes >= 150_000);
  assert.equal(needsPatchMode(full(fat)), true);
  assert.equal(needsPatchMode('kézirat, BLOKK_JSON nélkül'), false);
  assert.equal(needsPatchMode(null), false);
});

test('összefésülés: replace a helyén, add az afterId után, remove indokkal, mezőfelülírás; a sorrend marad, a blokk visszaolvasható', () => {
  const base = blockOf(12);
  const { block, errors } = applyBlockPatch(base, { ...GOOD_PATCH, block: { title: 'Nouveau titre', pages: { [`${BID}-p01`]: { title: 'Intro bis' } } } });
  assert.deepEqual(errors, []);
  const ids = block.pages[1].items.map(it => it.id);
  assert.deepEqual(ids, [0, 1, 2, 3, 4, 5, 6, 8, 9, 500, 10, 11].map(itemId));
  assert.equal(block.pages[1].items[5].feedback.correct, 'Nouveau retour pour l’item cinq.');
  assert.equal(block.title, 'Nouveau titre');
  assert.equal(block.pages[0].title, 'Intro bis');
  assert.equal(base.pages[1].items.length, 12, 'az alapblokk nem változik');
  assert.deepEqual(JSON.parse(formatBlock(block)), block);
  // afterId: null → az oldal elejére; az afterId egy ugyanitt hozzáadott itemre is mutathat.
  const front = applyBlockPatch(base, { add: [{ pageId: `${BID}-p02`, afterId: null, item: item(600) }, { pageId: `${BID}-p02`, afterId: itemId(600), item: item(601) }] });
  assert.deepEqual(front.block.pages[1].items.slice(0, 3).map(it => it.id), [itemId(600), itemId(601), itemId(0)]);
  // Üres javításlista: a blokk változatlan.
  assert.deepEqual(applyBlockPatch(base, { replace: [], add: [], remove: [] }).block, base);
});

test('order: egy oldal itemjeinek teljes új sorrendje (a cserék után); hiányos, ismeretlen vagy kétszeres ID hiba (U43 p12, 11-14)', () => {
  const base = blockOf(4);
  const want = [3, 1, 0, 2].map(itemId);
  const { block, errors } = applyBlockPatch(base, { replace: [item(1, 'Retour un, nouveau.')], order: { [`${BID}-p02`]: want } });
  assert.deepEqual(errors, []);
  assert.deepEqual(block.pages[1].items.map(it => it.id), want);
  assert.equal(block.pages[1].items[1].feedback.correct, 'Retour un, nouveau.', 'a csere az átrendezés előtt történik');
  const err = order => applyBlockPatch(base, { order }).errors.join(' | ');
  assert.match(err({ [`${BID}-p02`]: [3, 1, 0].map(itemId) }), /hiányzik: w01-u-9-9-i002/);
  assert.match(err({ [`${BID}-p02`]: [...want, itemId(9)] }), /ismeretlen: w01-u-9-9-i009/);
  assert.match(err({ [`${BID}-p02`]: [...want, itemId(0)] }), /kétszer: w01-u-9-9-i000/);
  assert.match(err({ [`${BID}-p09`]: want }), /order: nincs ilyen oldal/);
  assert.match(err([want]), /az order nem objektum/);
});

test('összefésülés hibái: ismeretlen ID, ID-ütközés, indok nélküli törlés, részleges item, rossz alak, érvénytelen JSON', () => {
  const base = blockOf(12);
  const err = patch => applyBlockPatch(base, patch).errors.join(' | ');
  assert.match(err({ replace: [item(77)] }), /replace: nincs ilyen item: .*i077/);
  assert.match(err({ remove: [{ id: itemId(77), reason: 'x' }] }), /remove: nincs ilyen item/);
  assert.match(err({ remove: [{ id: itemId(3) }] }), /remove: indok nélkül/);
  assert.match(err({ add: [{ pageId: `${BID}-p02`, afterId: null, item: item(3) }] }), /add: már van ilyen item/);
  assert.match(err({ add: [{ pageId: `${BID}-p99`, afterId: null, item: item(300) }] }), /add: nincs ilyen oldal/);
  assert.match(err({ add: [{ pageId: `${BID}-p02`, afterId: itemId(88), item: item(300) }] }), /afterId nincs/);
  assert.match(err({ replace: [{ id: itemId(3), feedback: { correct: 'csak a feedback' } }] }), /nem teljes item \(hiányzik: capability, variant, response, solution\)/);
  assert.match(err({ replace: [item(3), item(3)] }), /kétszer szerepel/);
  assert.match(err({ add: [{ pageId: `${BID}-p02`, afterId: null, item: { ...item(300), id: `${BID}-p01` } }] }), /ID-ütközés.*p01/);
  assert.match(err({ items: [] }), /ismeretlen kulcs/);
  assert.match(err({ block: { pages: [] } }), /block\.pages/);
  assert.match(err({ block: { id: 'masik' } }), /id nem írható felül/);
  assert.equal(applyBlockPatch(base, { replace: [item(77)] }).block, null);

  assert.match(mergePatchedSolution(BIG, patched('{"replace": [')).errors[0], /nem érvényes JSON/);
  assert.match(mergePatchedSolution(BIG, `${MD}${gepi('DRAFT_FOR_REVIEW')}`).errors[0], /nincs BLOKK_JAVITAS/);
  assert.match(mergePatchedSolution(BIG, `${patched(GOOD_PATCH)}\nBLOKK_JSON\n{}\nBLOKK_JSON_VEGE\n`).errors[0], /BLOKK_JAVITAS és BLOKK_JSON is/);
  // Teljes BLOKK_JSON javításlista helyett: teljes leadásként érvényes, a szöveg változatlan.
  const asFull = mergePatchedSolution(BIG, BIG);
  assert.equal(asFull.mode, 'full');
  assert.equal(asFull.text, BIG);
  // A JSON-ban álló $-jel nem cserélési minta.
  const dollar = mergePatchedSolution(BIG, patched({ replace: [item(1, 'Prix : 5 $& 6 $1 euros.')] }));
  assert.equal(extractBlockJson(dollar.text).block.pages[1].items[1].feedback.correct, 'Prix : 5 $& 6 $1 euros.');
});

test('reviewedStep: nagy megoldás javítási köre javításlistás; az összefésült teljes megoldást kapja az ellenőr, és ez a lépés eredménye', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const s = scripted(id => ({ x: BIG, 'x-rev1': patched(GOOD_PATCH), 'x-nye': FAIL }[id] ?? PASS));
  const r = await step(await engineFor(dirs, s.invoke));
  assert.equal(r.blocked, undefined, JSON.stringify(r.blocked));
  assert.equal(r.id, 'x-rev1');
  assert.doesNotMatch(s.prompts.x, /BLOKK_JAVITAS/, 'az első, nulláról írt megoldás teljes leadás');
  assert.match(s.prompts['x-rev1'], /# Csak a változás: BLOKK_JAVITAS a BLOKK_JSON helyett[\s\S]*A változatlan itemeket \*\*ne\*\* írd ki újra/);
  assert.match(s.prompts['x-rev1'], /# A saját korábbi válaszod[\s\S]*BLOKK_JSON\n\{"id":"w01-u-9-9"/, 'a szerző látja az előző teljes BLOKK_JSON-t');
  // Az eredmény a teljes, összefésült megoldás: 120 − 1 + 1 item, a szerző Markdownja és tanulói nézete.
  const ids = itemIds(r.text);
  assert.equal(ids.length, 120);
  assert.ok(!ids.includes(itemId(7)) && ids.indexOf(itemId(500)) === ids.indexOf(itemId(9)) + 1);
  assert.match(r.text, /^## 2\. Findingok[\s\S]*^TANULOI_NEZET$[\s\S]*^GEPI_OSSZEGZES$/m);
  assert.doesNotMatch(r.text, /BLOKK_JAVITAS/);
  const saved = join(dirs.runDir, 'steps', 'x-rev1.osszefesult.md');
  assert.equal(await readFile(saved, 'utf8'), r.text);
  // Az ellenőr a teljes összefésült blokk tanulói szövegeit kapja (új, cserélt és változatlan item is).
  const recheck = s.prompts['x-nye-recheck1'];
  assert.match(recheck, /Nouveau retour pour l’item cinq\./);
  assert.match(recheck, /Un item tout neuf après le neuvième\./);
  assert.match(recheck, /Le retour numéro 119 est correct\./);
  assert.doesNotMatch(recheck, /Le retour numéro 5 est correct\./);

  // Folytatás ugyanabban a futásmappában: nincs új hívás, ugyanaz az összefésült szöveg.
  const s2 = scripted(() => { throw new Error('nem hívhat újra'); });
  const r2 = await step(await engineFor(dirs, s2.invoke));
  assert.deepEqual(Object.keys(s2.prompts), []);
  assert.equal(r2.id, 'x-rev1');
  assert.equal(r2.text, r.text);

  // --ujrafuttat x-rev1 (és a rá épülő recheck): a lépés és az összefésült szövege elvetve; az új leadás újra
  // javításlistás, és újra összefésül.
  const s3 = scripted(id => ({ 'x-rev1': patched({ replace: [item(6, 'Troisième version du retour six.')] }) }[id] ?? PASS));
  const engine3 = await engineFor(dirs, s3.invoke);
  assert.deepEqual(await engine3.discardSteps('x-rev1'), ['x-rev1']);
  assert.deepEqual(await engine3.discardSteps('x-nye-recheck1'), ['x-nye-recheck1']);
  assert.ok(existsSync(join(dirs.runDir, 'steps', 'x-rev1.elvetett-1.osszefesult.md')));
  assert.ok(!existsSync(join(dirs.runDir, 'steps', 'x-rev1.osszefesult.md')));
  const r3 = await step(engine3);
  assert.deepEqual(Object.keys(s3.prompts).sort(), ['x-nye-recheck1', 'x-rev1']);
  assert.match(s3.prompts['x-rev1'], /BLOKK_JAVITAS/);
  assert.equal(itemIds(r3.text).length, 120);
  assert.match(r3.text, /Troisième version du retour six\./);
  assert.match(s3.prompts['x-nye-recheck1'], /Troisième version du retour six\./);
});

test('reviewedStep: javításlista helyett teljes BLOKK_JSON is elfogadott (teljes leadás, nincs összefésülés)', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const fixed = blockOf(120);
  fixed.pages[1].items[3].feedback.correct = 'Retour corrigé en entier.';
  const s = scripted(id => ({ x: BIG, 'x-rev1': full(fixed), 'x-nye': FAIL }[id] ?? PASS));
  const r = await step(await engineFor(dirs, s.invoke));
  assert.equal(r.blocked, undefined);
  assert.equal(r.id, 'x-rev1');
  assert.equal(r.text, full(fixed));
  assert.ok(!existsSync(join(dirs.runDir, 'steps', 'x-rev1.osszefesult.md')));
  assert.match(s.prompts['x-nye-recheck1'], /Retour corrigé en entier\./);
});

test('reviewedStep: hibás javításlista → egy újrakérés a hibával; ha az is hibás, a lánc megáll (BLOCKED_INCOMPLETE_AUTHOR), ellenőr nem kap csonka blokkot', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const s = scripted(id => ({ x: BIG, 'x-rev1': patched({ replace: [item(777)] }), 'x-rev1-teljes': patched(GOOD_PATCH), 'x-nye': FAIL }[id] ?? PASS));
  const r = await step(await engineFor(dirs, s.invoke));
  assert.equal(r.blocked, undefined, JSON.stringify(r.blocked));
  assert.equal(r.id, 'x-rev1-teljes');
  assert.match(s.prompts['x-rev1-teljes'], /# Csak a változás[\s\S]*# Az előző leadásod nem volt elfogadható\n\nA CEO ezt találta: javításlista: replace: nincs ilyen item: w01-u-9-9-i777/);
  assert.doesNotMatch(s.prompts['x-rev1-teljes'], /A leadásod hiányos volt/, 'nem teljes újraleadást kér');
  assert.equal(itemIds(r.text).length, 120);
  assert.ok(existsSync(join(dirs.runDir, 'steps', 'x-rev1-teljes.osszefesult.md')));
  assert.ok(!existsSync(join(dirs.runDir, 'steps', 'x-rev1.osszefesult.md')));

  for (const [first, second, expected] of [
    ['{"replace": [', { add: [{ pageId: `${BID}-p02`, afterId: null, item: item(4) }] }, /add: már van ilyen item: w01-u-9-9-i004/],
    [{ remove: [{ id: itemId(1) }] }, '{ nem json', /nem érvényes JSON/],
  ]) {
    const d = await tempDirs(); t.after(d.cleanup);
    const sx = scripted(id => ({ x: BIG, 'x-rev1': patched(first), 'x-rev1-teljes': patched(second), 'x-nye': FAIL }[id] ?? PASS));
    const rx = await step(await engineFor(d, sx.invoke));
    assert.equal(rx.blocked.outcome, 'BLOCKED_INCOMPLETE_AUTHOR');
    assert.equal(rx.blocked.checks.step, 'x-rev1-teljes');
    assert.equal(rx.blocked.checks.patch, true);
    assert.match(rx.blocked.checks.missing.join(' '), expected);
    assert.equal(rx.id, 'x', 'a hívó az utolsó teljes változatot kapja vissza');
    assert.equal(rx.text, BIG);
    assert.ok(!sx.prompts['x-nye-recheck1'], 'hibás javításlistából ellenőr nem kap anyagot');
  }
});

test('reviewedStep baseline (eszkaláció, fázisdöntés): az első leadás is javításlistás, az előző teljes megoldásba fésülve', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const s = scripted(id => ({ x: patched(GOOD_PATCH) }[id] ?? PASS));
  const r = await step(await engineFor(dirs, s.invoke), { baseline: BIG });
  assert.equal(r.id, 'x');
  assert.match(s.prompts.x, /# Megbízás\n[\s\S]*# Csak a változás/);
  assert.equal(itemIds(r.text).length, 120);
  assert.match(s.prompts['x-nye'], /Nouveau retour pour l’item cinq\./);
  assert.match(s.prompts['x-nye'], /Le retour numéro 119 est correct\./);
});

test('kis egység és régi futás: a szokásos megoldás teljes leadás marad; a 11-13 előtt kész javítási kör mentésből jön, új hívás nélkül', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const s = scripted(id => ({ x: SMALL, 'x-rev1': SMALL, 'x-nye': FAIL }[id] ?? PASS));
  const r = await step(await engineFor(dirs, s.invoke));
  assert.equal(r.id, 'x-rev1');
  assert.doesNotMatch(s.prompts['x-rev1'], /BLOKK_JAVITAS/);

  // Régi futásmappa: a nagy megoldás javítási köre még teljes leadásra szóló megbízással készült (patch nélkül).
  const old = await tempDirs(); t.after(old.cleanup);
  const s1 = scripted(id => ({ x: BIG, 'x-rev1': BIG, 'x-nye': FAIL }[id] ?? PASS));
  const r1 = await step(await engineFor(old, s1.invoke), { patch: false });
  assert.doesNotMatch(s1.prompts['x-rev1'], /BLOKK_JAVITAS/);
  const s2 = scripted(() => { throw new Error('nem hívhat újra'); });
  const r2 = await step(await engineFor(old, s2.invoke));
  assert.deepEqual(Object.keys(s2.prompts), [], 'a kész lépések megbízása nem „változott meg”');
  assert.equal(r2.text, r1.text);
});

test('javítás mód: a megoldásfázis javító köre javításlistás, a kimenet megoldas.md-je az összefésült megoldásból készül', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const plain = body => `${body}${gepi('DRAFT_FOR_REVIEW')}`;
  const SOLVER = 'r01: A\n\nMEGOLDO_OSSZEGZES\nproblemak: 0\nMEGOLDO_OSSZEGZES_VEGE\n';
  const s = scripted(id => {
    if (/^r11-terv$/.test(id)) return plain('# Javítási terv');
    if (/^r11-kezirat$/.test(id)) return plain('# Kézirat\n\n## VÁLTOZÁSNAPLÓ\n\n- új helyzet');
    if (id === 'r11-megoldas') return BIG;
    if (id === 'r11-megoldas-rev1') return patched(GOOD_PATCH);
    if (id === 'r11-megoldas-nye') return FAIL;
    if (id.includes('solver')) return SOLVER;
    return PASS;
  });
  const config = fakeConfig({ peRuns: 1, maxCalls: 10, javitasMaxCalls: 80 });
  config.assign.SOLVER = 'claude';
  const engine = new Engine({ runDir: dirs.runDir, config, pipeline: 'javitas', log: silent, invoke: s.invoke });
  await engine.init();
  const out = join(dirs.root, 'kimenet');
  const result = await javitasPipeline(engine, { egyseg: 'R11', p5: false, out });
  assert.equal(result.outcome, 'COMPLETED', JSON.stringify(result.checks));
  assert.match(s.prompts['r11-megoldas-rev1'], /# Csak a változás/);
  assert.match(s.prompts['r11-megoldas-nye-recheck1'], /Nouveau retour pour l’item cinq\./);
  assert.ok(existsSync(join(dirs.runDir, 'steps', 'r11-megoldas-rev1.osszefesult.md')));
  const megoldas = await readFile(join(out, 'w01-test-reading-uof.megoldas.md'), 'utf8');
  assert.match(megoldas, /## 2\. Findingok/);
  assert.doesNotMatch(megoldas, /^BLOKK_(JAVITAS|JSON)\s*$/m);
});
