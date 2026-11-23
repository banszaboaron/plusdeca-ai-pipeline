// A „javítás” mód (lib/javitas.mjs): meglévő egység javítása. A szolgáltató beinjektált hamis invoke, a P5-kapu ki van kapcsolva
// (a kapukat a p5 saját tesztjei és a heti lánc tesztjei fedik); a kimenet egy ideiglenes mappába megy.

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Engine } from '../lib/engine.mjs';
import { estimateCalls, javitasPipeline, renderReadingTest, teacherSection } from '../lib/javitas.mjs';
import { fakeConfig, silent, tempDirs } from './helpers.mjs';

const PASS = 'rendben\n\nPE_FINDINGEK\nPE_FINDINGEK_VEGE\n\nGEPI_OSSZEGZES\nverdict: REVIEW_PASS\nblocker: 0\nmajor: 0\nminor: 0\nGEPI_OSSZEGZES_VEGE\n';
const FAIL = 'baj\n\nPE_FINDINGEK\nF1 | MAJOR | valosag | olvasmány | nem létező helyzet\nPE_FINDINGEK_VEGE\n\nGEPI_OSSZEGZES\nverdict: REVISION_REQUIRED\nblocker: 0\nmajor: 1\nminor: 0\nGEPI_OSSZEGZES_VEGE\n';
const author = body => `${body}\n\nGEPI_OSSZEGZES\nstatus: DRAFT_FOR_REVIEW\nGEPI_OSSZEGZES_VEGE\n`;
const MANUSCRIPT = author('# R11 — új kézirat\n\n## Olvasmány\n\nP1 Au comptoir de la boulangerie…\n\n### w01-test-reading-uof-r01\n\nKérdés.\n\n## VÁLTOZÁSNAPLÓ\n\n- új helyzet: menu petit-déjeuner\n- tanári kifogás „où se déroule la scène” → a hely az első mondatban');
const SOLUTION = author('# Megoldás\n\nr01: A\n\nTANULOI_NEZET\nr01 kérdés, opciók\nTANULOI_NEZET_VEGE');
const SOLVER = 'r01: A\n\nMEGOLDO_OSSZEGZES\nproblemak: 0\nMEGOLDO_OSSZEGZES_VEGE\n';

function scripted(answer) {
  const prompts = {};
  const invoke = async (_provider, { outFile, prompt }) => {
    const id = basename(outFile).replace(/\.out\.md$/, '');
    prompts[id] = prompt;
    return { code: 0, text: answer(id, prompt), stdout: '', stderr: '', ms: 1 };
  };
  return { invoke, prompts };
}

const defaultAnswer = id => {
  if (id === 'r11-terv' || /^r11-terv-(rev|ujra)\d$/.test(id)) return author('# Javítási terv\n\nÚj helyzet: menu petit-déjeuner.');
  if (id === 'r11-kezirat' || /^r11-kezirat-(rev|ujra)\d$/.test(id)) return MANUSCRIPT;
  // Az eszkaláció utáni megoldáskör (-e<n>) is megoldást ad (11-09 óta teljességi próbát kap az előzőhöz képest).
  if (/^r11-megoldas(-e\d+)?(-(rev|ujra)\d)?$/.test(id)) return SOLUTION;
  if (id.includes('solver')) return SOLVER;
  return PASS;
};

async function run(dirs, answer = defaultAnswer, limits = {}) {
  const { invoke, prompts } = scripted(answer);
  const config = fakeConfig({ peRuns: 2, peMaxRounds: 4, peRewriteAfter: 2, maxCalls: 10, javitasMaxCalls: 80, ...limits });
  config.assign.SOLVER = 'claude';
  const engine = new Engine({ runDir: dirs.runDir, config, pipeline: 'javitas', log: silent, invoke });
  await engine.init();
  const out = join(dirs.root, 'kimenet');
  const result = await javitasPipeline(engine, { egyseg: 'R11', p5: false, out });
  return { result, prompts, out, engine };
}

test('R11 régi kézirata olvashatóan renderelve: öt bekezdés, mind a 20 item, a meglévő kulcsokkal', async () => {
  const json = JSON.parse(await readFile(new URL('../../../week-01/handoffs/test-reading-uof-v2.2.draft.json', import.meta.url), 'utf8'));
  const md = renderReadingTest(json);
  assert.match(md, /^P1 Samedi matin, Lina/m);
  assert.match(md, /^P5 Les musiciens plaisantent/m);
  assert.equal((md.match(/^### w01-test-reading-uof-/gm) ?? []).length, 20);
  assert.match(md, /### w01-test-reading-uof-u06[\s\S]*?Kulcs: Il ne reste plus de jus d’orange\./);
  assert.doesNotMatch(md, /lexicalBurden|checksum/);
  const teacher = teacherSection(await readFile(new URL('../../../../docs/tanar/claude-atadas-2026-10-27/PONTOS_TANARI_JELOLESEK.md', import.meta.url), 'utf8'), 'reading');
  assert.match(teacher, /On ne comprend pas très bien ou se déroule la scène/);
  assert.doesNotMatch(teacher, /## listening/);
});

test('javítás: terv → új kézirat → megoldás → kimenet; kettős PE mindkét ellenőrzési fázisban, a megoldó Claude-dal', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const { result, prompts, out } = await run(dirs);
  assert.equal(result.outcome, 'COMPLETED', JSON.stringify(result.checks));
  for (const id of ['r11-terv', 'r11-terv-nave', 'r11-terv-ue', 'r11-kezirat', 'r11-kezirat-pe', 'r11-kezirat-pe-2', 'r11-kezirat-nave',
    'r11-megoldas', 'r11-megoldas-pe', 'r11-megoldas-pe-2', 'r11-megoldas-nave', 'r11-megoldas-nye', 'r11-megoldas-he', 'r11-megoldas-ue', 'r11-megoldas-solver']) {
    assert.ok(prompts[id], `hiányzó lépés: ${id}`);
  }
  assert.equal(Object.keys(prompts).length, estimateCalls(fakeConfig({ peRuns: 2 }), { solver: true }).alap);
  // A szerző és a rendező látja a briefet, a régi kéziratot, a tanári kifogásokat és a mércét.
  for (const id of ['r11-terv', 'r11-kezirat']) {
    assert.match(prompts[id], /# A javítási brief[\s\S]*# A meglévő kézirat[\s\S]*# A tanári kifogások erre az egységre[\s\S]*# Referencia/);
    assert.match(prompts[id], /On ne comprend pas très bien ou se déroule la scène/);
  }
  assert.match(prompts['r11-kezirat'], /# Az elfogadott javítási terv\n\n# Javítási terv/);
  assert.match(prompts['r11-megoldas'], /A blokk P5-azonosítója|TANULOI_NEZET/);
  for (const f of ['w01-test-reading-uof.kezirat.md', 'w01-test-reading-uof.megoldas.md', 'w01-test-reading-uof.review-pass.md', 'VALTOZASNAPLO.md', 'futas.json']) {
    assert.ok(existsSync(join(out, f)), f);
  }
  const kezirat = await readFile(join(out, 'w01-test-reading-uof.kezirat.md'), 'utf8');
  assert.doesNotMatch(kezirat, /VÁLTOZÁSNAPLÓ/, 'a változásnapló külön fájlba megy, nem a kéziratba');
  assert.match(await readFile(join(out, 'VALTOZASNAPLO.md'), 'utf8'), /où se déroule la scène” → a hely az első mondatban/);
  assert.match(await readFile(join(out, 'w01-test-reading-uof.review-pass.md'), 'utf8'), /REVIEW_PASS[\s\S]*Kézirat \/ PE: PASS/);
  const futas = JSON.parse(await readFile(join(out, 'futas.json'), 'utf8'));
  assert.equal(futas.calls, 15);
  assert.deepEqual(futas.rewrites, { kezirat: 0, megoldas: 0 });
});

test('javítás: a kéziratfázisban hat a PE-szabály — két foltozás után újraírás, és csak a végén kerül ki a kimenet', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const { result, prompts } = await run(dirs, id => (/^r11-kezirat-pe(-2)?(-recheck\d)?$/.test(id) ? FAIL : defaultAnswer(id)));
  assert.equal(result.outcome, 'COMPLETED', JSON.stringify(result.checks));
  assert.ok(prompts['r11-kezirat-rev1'] && prompts['r11-kezirat-rev2']);
  assert.match(prompts['r11-kezirat-ujra3'], /# Újraírási megbízás/);
  assert.deepEqual(result.checks.rewrites, { kezirat: 1, megoldas: 0 });
});

test('javítás: ismeretlen egység → érthető hiba; elakadásnál nincs kimenet a repóban', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig(), pipeline: 'javitas', log: silent });
  await engine.init();
  await assert.rejects(javitasPipeline(engine, { egyseg: 'X99' }), /Ismeretlen egység: X99/);

  const dirs2 = await tempDirs(); t.after(dirs2.cleanup);
  const { result, out } = await run(dirs2, id => (id.startsWith('r11-terv-nave') ? FAIL : defaultAnswer(id)));
  assert.equal(result.outcome, 'BLOCKED_DECISION_MAX_ROUNDS');
  assert.ok(!existsSync(out));
});

const ESCALATED = '\n\n## Visszautalt hibák (ESCALATED)\n\n| ID | Hely | Javasolt kéziratmódosítás | Miért | Ha marad |\n|---|---|---|---|---|\n| E-01 | u09 prompt | francia stem, célalak | PE-M02, NAVE-F01 | 14 alak |\n| E-02 | r07 | magázás | PE-M06 | nincs mérési hatás |\n\n## Dispositionök\n\n- x\n';
const SOLUTION_ESC = author('# Megoldás\n\nr01: A' + ESCALATED + '\nTANULOI_NEZET\nr01 kérdés, opciók\nTANULOI_NEZET_VEGE');
const MANUSCRIPT_E1 = author('# R11 — új kézirat, eszkaláció után\n\n### w01-test-reading-uof-u09\n\nComplétez…\n\n## VÁLTOZÁSNAPLÓ\n\n### Eszkaláció\n\n| E-01 | u09 | Egészítsd ki | Complétez | |');

test('parseEscalations / escalationRoles: a valódi R11-megoldás visszautalt tételei és az érintett ellenőrök', async () => {
  const { parseEscalations, escalationRoles } = await import('../lib/javitas.mjs');
  const esc = parseEscalations(SOLUTION_ESC);
  assert.deepEqual(esc.items.map(i => i.id), ['E-01', 'E-02']);
  assert.doesNotMatch(esc.section, /Dispositionök/);
  assert.deepEqual([...escalationRoles(esc.items)].sort(), ['NavE', 'PE']);
  assert.equal(parseEscalations(SOLUTION), null);
});

test('javítás eszkalációval: a szerző célzottan javít, PE + az érintettek recheckje (NyE csak a megoldásban), majd a megoldásíró folytat', async t => {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'r11-eszkalacio1.md'), 'Döntés: egységesen magázó alak; az u09 stemje kényszerítse ki a ça vous fera alakot.');
  const answer = id => {
    if (id === 'r11-megoldas') return SOLUTION_ESC;
    if (id === 'r11-kezirat-e1') return MANUSCRIPT_E1;
    // A NavE a megoldásfázisban addig bukik, amíg az eszkaláció nincs átvezetve (→ BLOCKED_DECISION_MAX_ROUNDS).
    if (/^r11-megoldas-nave(-recheck\d)?$/.test(id)) return FAIL.replace('F1 | MAJOR | valosag | olvasmány | nem létező helyzet', 'NAVE-F01 | MAJOR | tetel | u09 | nem méri');
    if (/^r11-megoldas-rev\d$/.test(id)) return SOLUTION_ESC;
    return defaultAnswer(id);
  };
  const { result, prompts, out } = await run(dirs, answer);
  assert.equal(result.outcome, 'COMPLETED', JSON.stringify(result.checks));
  // Kézirat: célzott megbízás a döntéssel; ellenőrök: PE (recheck, egy futás) és NavE (recheck); NyE nem (11-15).
  assert.match(prompts['r11-kezirat-e1'], /# Célzott kéziratjavítás[\s\S]*# A megoldásíró visszautalt kéziratmódosításai[\s\S]*E-01[\s\S]*# A PRESIDENT döntése az eszkalációkról[\s\S]*ça vous fera/);
  for (const id of ['r11-kezirat-e1-pe', 'r11-kezirat-e1-nave']) assert.match(prompts[id], /A korábbi jelentésed \(recheck/, id);
  assert.ok(!prompts['r11-kezirat-e1-pe-2'], 'recheckben egy PE-futás');
  assert.ok(!prompts['r11-kezirat-e1-nye'], 'a kéziratfázisban nincs NyE (a megoldásé újranézi)');
  assert.ok(!prompts['r11-kezirat-e1-ue'] && !prompts['r11-kezirat-e1-he'], 'nem érintett ellenőr nem fut');
  // Megoldás folytatása: az új kézirattal, a korábbi megoldásból; PE ×2, NyE, megoldó és a NavE.
  assert.match(prompts['r11-megoldas-e1'], /# A befagyasztott új kézirat\n\n# R11 — új kézirat, eszkaláció után[\s\S]*# A korábbi megoldásod \(ebből folytasd\)[\s\S]*# Folytatás az eszkaláció után[\s\S]*# A teljes megoldás kötelező/);
  for (const id of ['r11-megoldas-e1-pe', 'r11-megoldas-e1-nye', 'r11-megoldas-e1-nave', 'r11-megoldas-e1-solver']) assert.ok(prompts[id], id);
  assert.ok(!prompts['r11-megoldas-e1-he'] && !prompts['r11-megoldas-e1-ue'], 'a HE és az UE nem érintett');
  assert.match(prompts['r11-megoldas-e1-nave'], /A korábbi jelentésed \(recheck/);
  const futas = JSON.parse(await readFile(join(out, 'futas.json'), 'utf8'));
  assert.deepEqual(futas.escalations[0].items, ['E-01', 'E-02']);
  assert.deepEqual(futas.escalations[0].kezirat.reviewers, ['PE', 'NavE']);
  assert.match(await readFile(join(out, 'w01-test-reading-uof.kezirat.md'), 'utf8'), /eszkaláció után/);
});

test('eszkaláció: ha a PE miatt van javítási kör, a megoldás NyE-je akkor is újranéz (a PE javaslatából átvett szöveg)', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const answer = id => {
    if (id === 'r11-megoldas') return SOLUTION_ESC;
    if (/^r11-kezirat-e1(-rev\d)?$/.test(id)) return MANUSCRIPT_E1;
    if (id === 'r11-kezirat-e1-pe' || id === 'r11-megoldas-e1-pe') return FAIL;
    return defaultAnswer(id);
  };
  const { result, prompts } = await run(dirs, answer);
  assert.equal(result.outcome, 'COMPLETED', JSON.stringify(result.checks));
  assert.ok(!prompts['r11-kezirat-e1-nye'] && !prompts['r11-kezirat-e1-nye-recheck1'], 'a kéziratfázisban nincs NyE (11-15)');
  for (const phase of ['megoldas']) {
    assert.match(prompts[`r11-${phase}-e1-nye-recheck1`], /# Miért kapod újra[\s\S]*PE javaslatából átvett/, phase);
    assert.ok(!prompts[`r11-${phase}-e1-nave-recheck1`], 'a PASS-t adó többi ellenőr nem fut újra');
  }
});

test('utódöntés: kész egységre adott PRESIDENT-döntés visszautalt tétel nélkül is lefuttat egy célzott kört', async t => {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const first = await run(dirs);
  assert.equal(first.result.outcome, 'COMPLETED');
  assert.ok(!first.prompts['r11-kezirat-e1'], 'döntés nélkül nincs eszkaláció');
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'r11-eszkalacio1.md'), 'Az r11 requiredResult nem lazul.');
  const again = await run(dirs, id => (id === 'r11-kezirat-e1' ? MANUSCRIPT_E1 : defaultAnswer(id)));
  assert.equal(again.result.outcome, 'COMPLETED', JSON.stringify(again.result.checks));
  assert.ok(!again.prompts['r11-megoldas'], 'a kész lépések nem futnak újra');
  assert.match(again.prompts['r11-kezirat-e1'], /nem utalt vissza tételt[\s\S]*# A PRESIDENT döntése az eszkalációkról[\s\S]*requiredResult nem lazul/);
  assert.match(again.prompts['r11-megoldas-e1'], /requiredResult nem lazul/);
  assert.deepEqual(again.result.checks.escalations.map(e => e.items), [[]]);
});

test('U53, U12, U34: a régi kézirat olvashatóan, zaj nélkül; a tanári szakasz és a hatókör megvan', async () => {
  const { UNITS } = await import('../lib/javitas.mjs');
  const u53 = await UNITS.U53.manuscript();
  assert.match(u53, /La bonne surprise du dimanche/);
  assert.match(u53, /# A heti szókincslista \(VR, 100 elem[\s\S]*\| w01-v2-001 \| 1 \(w01-u-1-3\) \| une viennoiserie \|/);
  assert.doesNotMatch(u53, /acceptedSurfacePatterns|"provenance"|"persistence"/);
  assert.match(await UNITS.U53.teacher(), /personne ne parle de la mie/);
  const u12 = await UNITS.U12.manuscript();
  assert.match(u12, /Les habitudes varient également selon les régions/);
  assert.doesNotMatch(u12, /contextualGlosses/);
  assert.match(await UNITS.U12.teacher(), /ça ne sonne pas français/);
  const u34 = await UNITS.U34.manuscript();
  assert.match(u34, /^A01 BOULANGER: Bonjour madame\./m);
  assert.match(await UNITS.U34.teacher(), /cette situation n'existe pas/);
  assert.match(UNITS.U34.scope, /HIANYZIK/);
  for (const id of ['U53', 'U12', 'U34']) assert.equal(UNITS[id].kind, 'lesson', id);
});

test('fázisdöntés: a körkeret után elakadt terv a PRESIDENT döntésével egy további körben folytatódik', async t => {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const failNave = id => (id.startsWith('r11-terv-nave') ? FAIL : defaultAnswer(id));
  const first = await run(dirs, failNave);
  assert.equal(first.result.outcome, 'BLOCKED_DECISION_MAX_ROUNDS');
  assert.equal(first.result.checks.decisionFile, join(dirs.runDir, 'decisions', 'r11-terv-dontes.md'));
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'r11-terv-dontes.md'), 'A p11-i02 kulcsa ne álljon a szövegben.');
  const again = await run(dirs, id => (id === 'r11-terv-d1-nave' ? defaultAnswer(id) : failNave(id)));
  assert.equal(again.result.outcome, 'COMPLETED', JSON.stringify(again.result.checks));
  assert.match(again.prompts['r11-terv-d1'], /# NavE nyitott jelentése[\s\S]*# A PRESIDENT döntése az elakadásról \(ez az elsődleges\)[\s\S]*p11-i02/);
  assert.match(again.prompts['r11-terv-d1-nave'], /A korábbi jelentésed \(recheck/);
  assert.ok(!again.prompts['r11-terv'], 'a kész lépések nem futnak újra');
});

test('fázisdöntés: ha a döntéses kör is elakad, újabb döntés (<fázis>-d1-dontes.md) egy további kört ad', async t => {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const failNave = id => (id.startsWith('r11-terv-nave') || id.startsWith('r11-terv-d1-nave') ? FAIL : defaultAnswer(id));
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'r11-terv-dontes.md'), 'Első döntés.');
  const first = await run(dirs, failNave);
  assert.equal(first.result.outcome, 'BLOCKED_DECISION_MAX_ROUNDS');
  assert.equal(first.result.checks.decisionFile, join(dirs.runDir, 'decisions', 'r11-terv-d1-dontes.md'));
  await writeFile(join(dirs.runDir, 'decisions', 'r11-terv-d1-dontes.md'), 'Második döntés: a p08 szabálya.');
  const again = await run(dirs, id => (id === 'r11-terv-d1-d1-nave' ? defaultAnswer(id) : failNave(id)));
  assert.equal(again.result.outcome, 'COMPLETED', JSON.stringify(again.result.checks));
  assert.match(again.prompts['r11-terv-d1-d1'], /# A PRESIDENT döntése az elakadásról \(ez az elsődleges\)[\s\S]*Második döntés/);
  assert.ok(!again.prompts['r11-terv-d1'], 'a kész döntéses kör nem fut újra');
});

test('fázisdöntés ELFOGADVA sorral: a megnevezett ellenőr nyitott jelzése elfogadva, új kör nélkül; a review-pass jelzi', async t => {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const solverFails = id => (id.startsWith('r11-megoldas-solver') ? 'r01: B\n\nMEGOLDO_OSSZEGZES\nproblemak: 1\nMEGOLDO_OSSZEGZES_VEGE\n' : defaultAnswer(id));
  const first = await run(dirs, solverFails);
  assert.equal(first.result.outcome, 'BLOCKED_DECISION_MAX_ROUNDS');
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'r11-megoldas-dontes.md'), 'Az r11 utasítása a tanár jóváhagyásával változatlan.\nELFOGADVA: SOLVER\n');
  const again = await run(dirs, solverFails);
  assert.equal(again.result.outcome, 'COMPLETED', JSON.stringify(again.result.checks));
  assert.equal(Object.keys(again.prompts).length, 0, 'nincs új hívás: '+Object.keys(again.prompts).join(','));
  assert.match(await readFile(join(again.out, 'w01-test-reading-uof.review-pass.md'), 'utf8'), /Megoldás \/ SOLVER: ELFOGADVA \(PRESIDENT-döntés/);
});

test('fázisdöntés „elfogadom” válasszal (11-15): minden nyitott jelzés elfogadva, új kör nélkül', async t => {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const solverFails = id => (id.startsWith('r11-megoldas-solver') ? 'r01: B\n\nMEGOLDO_OSSZEGZES\nproblemak: 1\nMEGOLDO_OSSZEGZES_VEGE\n' : defaultAnswer(id));
  assert.equal((await run(dirs, solverFails)).result.outcome, 'BLOCKED_DECISION_MAX_ROUNDS');
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'r11-megoldas-dontes.md'), 'Elfogadom.\n');
  const again = await run(dirs, solverFails);
  assert.equal(again.result.outcome, 'COMPLETED', JSON.stringify(again.result.checks));
  assert.equal(Object.keys(again.prompts).length, 0, 'nincs új hívás');
});

test('eszkaláció: a körkeret után elakadt kéziratjavítás fázisdöntéssel folytatható (kezirat-e<n>-dontes.md, ELFOGADVA)', async t => {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const answer = id => {
    if (id === 'r11-megoldas') return SOLUTION_ESC;
    if (/^r11-kezirat-e1(-rev\d)?$/.test(id)) return MANUSCRIPT_E1;
    if (id.startsWith('r11-kezirat-e1-nave')) return FAIL.replace('F1 | MAJOR | valosag | olvasmány | nem létező helyzet', 'NAVE-F01 | MAJOR | tetel | u09 | appigény');
    return defaultAnswer(id);
  };
  const first = await run(dirs, answer);
  assert.equal(first.result.outcome, 'BLOCKED_DECISION_MAX_ROUNDS');
  assert.equal(first.result.checks.decisionFile, join(dirs.runDir, 'decisions', 'r11-kezirat-e1-dontes.md'));
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'r11-kezirat-e1-dontes.md'), 'Átmeneti eltérés, appigény megy.\nELFOGADVA: NavE\n');
  const again = await run(dirs, answer);
  assert.equal(again.result.outcome, 'COMPLETED', JSON.stringify(again.result.checks));
  assert.ok(!again.prompts['r11-kezirat-e1'] && !again.prompts['r11-kezirat-e1-d1'], 'a kész lépések nem futnak újra, új kör nincs');
  assert.ok(again.prompts['r11-megoldas-e1'], 'a megoldásíró folytat');
});

// 11-09: különbözeti megoldáskör nem lehet a végső megoldas.md (DONTESEK 11-04, „CEO-lánc javítandó” (1); U31: 419 CL-01).
const FB = Array.from({ length: 30 }, (_, i) => `Le retour numéro ${i} est correct.`);
const FB_BLOCK = JSON.stringify({ id: 'w01-test-reading-uof', pages: [{ id: 'w01-test-reading-uof-p01', title: 'Lecture', items: FB.map((t, i) => ({ id: `w01-test-reading-uof-r${i}`, feedback: { correct: t } })) }] });
const fbSolution = (md, extra = '') => author(`# Megoldás\n\n${md.map(t => `- ${t}`).join('\n')}${extra}\nTANULOI_NEZET\nr01 kérdés, opciók\nTANULOI_NEZET_VEGE\n\nBLOKK_JSON\n${FB_BLOCK}\nBLOKK_JSON_VEGE`);

test('eszkaláció utáni megoldáskör: különbözeti leadásnál teljes újraleadás, és az kerül a kimenetbe (U31)', async t => {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'r11-eszkalacio1.md'), 'Döntés: egységesen magázó alak.');
  const answer = id => {
    if (id === 'r11-megoldas') return fbSolution(FB, ESCALATED);
    if (id === 'r11-kezirat-e1') return MANUSCRIPT_E1;
    if (id === 'r11-megoldas-e1') return fbSolution(FB.slice(0, 3));
    if (id === 'r11-megoldas-e1-teljes') return fbSolution(FB);
    return defaultAnswer(id);
  };
  const { result, prompts, out } = await run(dirs, answer);
  assert.equal(result.outcome, 'COMPLETED', JSON.stringify(result.checks));
  assert.match(prompts['r11-megoldas-e1-teljes'], /A leadásod hiányos volt[\s\S]*27 olyan tanulói szöveg/);
  assert.match(prompts['r11-megoldas-e1-nye'], /Le retour numéro 29/, 'az ellenőr a teljes leadást látja');
  assert.match(await readFile(join(out, 'w01-test-reading-uof.megoldas.md'), 'utf8'), /Le retour numéro 29/);
});

test('végső teljességi próba: körönként apránként fogyó megoldás sem lehet a végső megoldas.md (BLOCKED_INCOMPLETE_SOLUTION)', async t => {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'r11-eszkalacio1.md'), 'Döntés: egységesen magázó alak.');
  const answer = id => {
    if (id === 'r11-megoldas') return fbSolution(FB, ESCALATED);
    if (id === 'r11-kezirat-e1') return MANUSCRIPT_E1;
    // Körönként 9 szöveg tűnik el (a körönkénti küszöb, 10 alatt), összesen 18 a 30-ból.
    if (id === 'r11-megoldas-e1') return fbSolution(FB.slice(0, 21));
    if (id === 'r11-megoldas-e1-nye') return FAIL;
    if (id === 'r11-megoldas-e1-rev1') return fbSolution(FB.slice(0, 12));
    return defaultAnswer(id);
  };
  const { result, out } = await run(dirs, answer);
  assert.equal(result.outcome, 'BLOCKED_INCOMPLETE_SOLUTION', JSON.stringify(result.checks));
  assert.equal(result.checks.dropped, 18);
  assert.equal(result.checks.covered, 30);
  assert.ok(!existsSync(join(out, 'w01-test-reading-uof.megoldas.md')), 'hiányos megoldás nem kerül a kimenetbe');
});

test('GT1 (nyelvtani záróteszt): 24 item a kulccsal és az újrapróba-változattal, a javított egységek itemjei; zaj nélkül', async () => {
  const { UNITS, renderGrammarTest, GRAMMAR_UNIT_BLOCKS } = await import('../lib/javitas.mjs');
  const gt = UNITS.GT1;
  assert.equal(gt.kind, 'assessment');
  assert.equal(gt.p5Id, 'w01-test-grammar');
  assert.equal(gt.column, 'GI');
  const md = await gt.manuscript();
  assert.equal((md.match(/^### w01-test-grammar-i\d{3}$/gm) ?? []).length, 24);
  assert.equal((md.match(/^Újrapróba-változat \(w01-test-grammar-i\d{3}-r1;/gm) ?? []).length, 24);
  assert.match(md, /### w01-test-grammar-i001[\s\S]*?prompt: Pour le goûter de l’équipe, Nora achète ___ brioche aux pralines\.\nKulcs: une/);
  assert.match(md, /Újrapróba-változat \(w01-test-grammar-i001-r1[\s\S]*?prompt: Le voisin apporte ___ tarte aux abricots\./);
  assert.doesNotMatch(md, /difficultyComponents|sourceBindingRationale|distractorBases/);
  for (const id of GRAMMAR_UNIT_BLOCKS) assert.match(md, new RegExp(`^## ${id} — `, 'm'), id);
  assert.match(await gt.teacher(), /a teszt még a javítás előtti nyelvtani egységekre épül/i);
  assert.match(gt.scope, /újdonság a javított egységekhez képest[\s\S]*APP_IGENY_UJRAPROBA/);
  // A kontrasztpár kulcsa és az elutasított alak tömbként olvasható.
  assert.match(renderGrammarTest({ testId: 't', contentVersion: 'v', items: [{ itemId: 't-i1', type: 'contrast_pair', prompt: '___ / ___', answer: { primary: ['de la', 'de'], accepted: [['de la', 'de']] }, rejected: [{ value: ['de', 'de'], reason: 'x' }] }] }), /Kulcs: de la \| de\nElfogadott: de la \| de\nElutasított: de \| de — x/);
});

test('VT1 (szókincs-záróteszt, statikus): rögzített 50/50 irány adagonként fele-fele, legfeljebb 4-es futam, ismételhető; a válaszszabályok csatolva', async () => {
  const { UNITS, staticVocabularyPlan, fnv1a32 } = await import('../lib/javitas.mjs');
  assert.equal(fnv1a32(''), 0x811c9dc5);
  assert.equal(fnv1a32('a'), 0xe40c292c);
  const vocab = JSON.parse(await readFile(new URL('../../../week-01/data/week-01.json', import.meta.url), 'utf8')).vocabulary;
  const plan = staticVocabularyPlan(vocab);
  assert.deepEqual(plan.counts, { FR_TO_HU: 50, HU_TO_FR: 50 });
  assert.ok(plan.maxRun <= 4, `futam: ${plan.maxRun}`);
  assert.equal(new Set(plan.items.map(x => x.id)).size, 100);
  for (const dose of [1, 2, 3]) {
    const own = plan.items.filter(x => x.dose === dose);
    assert.equal(own.filter(x => x.direction === 'FR_TO_HU').length, own.length / 2, `adag ${dose}`);
  }
  assert.deepEqual(staticVocabularyPlan(vocab), plan, 'ismételhető');
  assert.notDeepEqual(plan.items.slice(0, 5).map(x => x.id), vocab.slice(0, 5).map(v => v.id), 'kevert sorrend');
  const vt = UNITS.VT1;
  assert.equal(vt.kind, 'assessment');
  assert.equal(vt.p5Id, 'w01-test-vocabulary');
  assert.equal(vt.column, 'VI');
  const md = await vt.manuscript();
  assert.equal((md.match(/^### \d+\. w01-test-vocabulary-w01-v2-\d{3} — (FR → HU|HU → FR) \(\d\. adag\)$/gm) ?? []).length, 100);
  assert.match(md, /# A jóváhagyott válaszszabályok[\s\S]*## 3\. `VOC-R01`[\s\S]*# Áron döntése \(DONTESEK 09-21\)\n\n\| 09-21 \|/);
  assert.doesNotMatch(md, /## 9\. Ellenőrzött elemek/);
  assert.match(vt.scope, /teljes névelős alak[\s\S]*APP_IGENY_SORSOLAS_SZERVERKULCS/);
  // Kis listán is tartja a szabályt (páratlan adagméret, futamkorlát).
  const small = staticVocabularyPlan(Array.from({ length: 11 }, (_, i) => ({ id: `x-${i}`, dose: i < 5 ? 1 : 2 })));
  assert.ok(small.maxRun <= 4);
  assert.equal(small.items.length, 11);
});

test('parseEscalations: az ID után jelző is állhat a cellában (U24, U32, 11-15)', async () => {
  const { parseEscalations } = await import('../lib/javitas.mjs');
  const text = '## Visszautalt hibák (ESCALATED)\n\n| ID | Hely | Javaslat | Miért | Ha marad |\n|---|---|---|---|---|\n| E-01 · MINOR | p02 | „x” | F1 | y |\n| E-06 (**2. kör**) | p07 | „z” | F2 | w |\n| **E-07** | p08 | „q” | F3 | v |\n| ID-szöveg | nem | – | – | – |\n\n## Következő\n';
  const parsed = parseEscalations(text);
  assert.deepEqual(parsed.items.map(i => i.id), ['E-01', 'E-06', 'E-07']);
  assert.equal(parsed.items[1].location, 'p07');
});
