// 2026-11-09: a CEO-lánc két javítása (DONTESEK 11-04, „CEO-lánc javítandó” (1) és (2)).
// (1) Különbözeti („csak a változás”) megoldáskör nem lehet a végső megoldás: a körönkénti teljességi próba kiszűri
//     (U31: 419 CL-01, mert az utolsó, csak különbözeti kör lett a megoldas.md).
// (2) A lépésen belül meghozott PRESIDENT-döntés a teljes újraleadásba és a későbbi körökbe is bekerül
//     (U41: a -teljes kör nem látta a döntést, és újra kérdezett).

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Engine } from '../lib/engine.mjs';
import { droppedLearnerTexts } from '../lib/p5.mjs';
import { incompleteParts, reviewedStep } from '../lib/week.mjs';
import { fakeConfig, silent, tempDirs } from './helpers.mjs';

const TEXTS = Array.from({ length: 20 }, (_, i) => `Le retour numéro ${i} est correct.`);
const block = texts => ({ id: 'w01-u-9-9', pages: [{ id: 'w01-u-9-9-p01', title: 'Titre', items: texts.map((t, i) => ({ id: `w01-u-9-9-i${i}`, feedback: { correct: t } })) }] });
const gepi = status => `\n\nGEPI_OSSZEGZES\nstatus: ${status}\nGEPI_OSSZEGZES_VEGE\n`;
/** Megoldás: a Markdown md szövegeit írja ki, a BLOKK_JSON a json szövegeit tartalmazza. */
const solution = (md, json = TEXTS) => `## 1. Megoldás itemenként\n${md.map(t => `- ${t}`).join('\n')}\n\nBLOKK_JSON\n${JSON.stringify(block(json))}\nBLOKK_JSON_VEGE${gepi('DRAFT_FOR_REVIEW')}`;
const FULL = solution(TEXTS);
const DIFF = solution(TEXTS.slice(0, 3));
const ASK = `# Részleges válasz\n\n# DÖNTÉSI KÉRDÉS\n\nA vagy B?${gepi('BLOCKED_DECISION')}`;
const CUT = `csak a változás${gepi('DRAFT_FOR_REVIEW')}`;

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

test('különbözeti leadás: a BLOKK_JSON-ban megmaradt, korábban kiírt tanulói szövegek tömegesen kimaradnak a Markdownból', async () => {
  const diff = await droppedLearnerTexts(FULL, DIFF);
  assert.equal(diff.covered, 20);
  assert.equal(diff.dropped.length, 17);
  assert.equal(diff.diff, true);
  assert.equal((await droppedLearnerTexts(FULL, FULL)).diff, false);
  // A JSON-ból is kikerült (átírt, törölt) szöveg nem hiány.
  assert.equal((await droppedLearnerTexts(FULL, solution(TEXTS.slice(0, 3), TEXTS.slice(0, 3)))).diff, false);
  // Kevés eltűnt szöveg (a küszöb alatt) még nem különbözeti leadás.
  assert.equal((await droppedLearnerTexts(FULL, solution(TEXTS.slice(0, 18)))).diff, false);
  // BLOKK_JSON nélkül (pl. kézirat) nincs ilyen próba.
  assert.equal(await droppedLearnerTexts('kézirat', 'kézirat'), null);
  const parts = await incompleteParts(FULL, DIFF);
  assert.equal(parts.length, 1);
  assert.match(parts[0], /17 olyan tanulói szöveg[\s\S]*különbözeti/);
  assert.deepEqual(await incompleteParts(FULL, FULL), []);
});

test('reviewedStep: különbözeti javított leadás → teljes újraleadás; ha az is különbözeti, a lánc megáll', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const s = scripted(id => ({ x: FULL, 'x-rev1': DIFF, 'x-rev1-teljes': FULL, 'x-nye': FAIL }[id] ?? PASS));
  const r = await reviewedStep(await engineFor(dirs, s.invoke), { id: 'x', author, reviewers: [nye], requirement: [], maxRounds: 2 });
  assert.equal(r.blocked, undefined);
  assert.equal(r.id, 'x-rev1-teljes');
  assert.match(s.prompts['x-rev1-teljes'], /A leadásod hiányos volt[\s\S]*17 olyan tanulói szöveg/);
  assert.match(s.prompts['x-nye-recheck1'], /Le retour numéro 19/, 'a recheck a teljes leadást kapja');

  const dirs2 = await tempDirs(); t.after(dirs2.cleanup);
  const s2 = scripted(id => ({ x: FULL, 'x-rev1': DIFF, 'x-rev1-teljes': DIFF, 'x-nye': FAIL }[id] ?? PASS));
  const r2 = await reviewedStep(await engineFor(dirs2, s2.invoke), { id: 'x', author, reviewers: [nye], requirement: [], maxRounds: 2 });
  assert.equal(r2.blocked.outcome, 'BLOCKED_INCOMPLETE_AUTHOR');
  assert.equal(r2.id, 'x', 'a hívó az utolsó teljes változatot kapja vissza');
  assert.ok(!s2.prompts['x-nye-recheck1'], 'különbözeti anyagot ellenőr nem kap');
});

test('reviewedStep baseline: az új kör első leadása is teljességi próbát kap az előző teljes megoldáshoz képest (eszkaláció utáni kör)', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const s = scripted(id => ({ x: DIFF, 'x-teljes': FULL }[id] ?? PASS));
  const r = await reviewedStep(await engineFor(dirs, s.invoke), { id: 'x', author, reviewers: [nye], requirement: [], maxRounds: 2, baseline: FULL });
  assert.equal(r.id, 'x-teljes');
  assert.match(r.text, /Le retour numéro 19/);
  assert.match(s.prompts['x-teljes'], /# Megbízás[\s\S]*A leadásod hiányos volt/);
  assert.match(s.prompts['x-nye'], /Le retour numéro 19/, 'az ellenőr a teljes leadást látja');
  // Baseline nélkül az első leadás nem kap próbát (a lánc első megoldása nem hasonlítható semmihez).
  const dirs2 = await tempDirs(); t.after(dirs2.cleanup);
  const s2 = scripted(id => ({ x: DIFF }[id] ?? PASS));
  const r2 = await reviewedStep(await engineFor(dirs2, s2.invoke), { id: 'x', author, reviewers: [nye], requirement: [], maxRounds: 2 });
  assert.equal(r2.id, 'x');
  assert.equal(s2.prompts['x-teljes'], undefined);
});

test('reviewedStep: a javítási körben meghozott döntés a teljes újraleadásba és a későbbi körökbe is bekerül; folytatáskor nincs új hívás (U41)', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'x-rev1.md'), 'Válasz: A. A pas d’eau gazeuse elfogadott variáns.\n');
  let nyeCalls = 0;
  const answer = id => {
    if (id === 'x') return FULL;
    if (id === 'x-rev1') return ASK;
    if (id === 'x-rev1-dontes') return CUT;
    if (id === 'x-rev1-teljes') return FULL;
    if (id === 'x-rev2') return FULL;
    if (id.startsWith('x-nye')) return (nyeCalls += 1) <= 2 ? FAIL : PASS;
    return PASS;
  };
  const s = scripted(answer);
  const r = await reviewedStep(await engineFor(dirs, s.invoke), { id: 'x', author, reviewers: [nye], requirement: [], maxRounds: 3 });
  assert.equal(r.blocked, undefined, JSON.stringify(r.blocked));
  assert.match(s.prompts['x-rev1-dontes'], /# A PRESIDENT döntése\n\nVálasz: A\./);
  assert.match(s.prompts['x-rev1-teljes'], /A leadásod hiányos volt[\s\S]*# A PRESIDENT korábbi döntése \(decisions\/x-rev1\.md; érvényes, ne kérdezd újra\)\n\nVálasz: A\./);
  assert.match(s.prompts['x-rev2'], /# A PRESIDENT korábbi döntése \(decisions\/x-rev1\.md/);
  assert.doesNotMatch(s.prompts.x, /PRESIDENT korábbi döntése/, 'a döntés előtti lépés nem kapja');

  // Folytatás ugyanabban a futásmappában: minden lépés kész, új hívás nincs.
  const s2 = scripted(() => { throw new Error('nem hívhat újra'); });
  const r2 = await reviewedStep(await engineFor(dirs, s2.invoke), { id: 'x', author, reviewers: [nye], requirement: [], maxRounds: 3 });
  assert.equal(r2.id, r.id);
  assert.deepEqual(Object.keys(s2.prompts), []);
});

