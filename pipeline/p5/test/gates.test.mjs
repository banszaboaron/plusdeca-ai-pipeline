import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runGates } from '../gates.mjs';
import { bindBlock } from '../bind.mjs';
import { metaTokens, runBlockGates, runWeekGates } from '../lib/gates.mjs';
import { loadReviewChain } from '../lib/manuscripts.mjs';
import { countWords, normalizeManuscript, normalizeText } from '../lib/normalize.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const p5 = join(here, '..');
const repo = join(p5, '..');
const realHandoffs = join(repo, 'editorial', 'week-01', 'handoffs');
// Rögzített pillanatkép (2026-10, main): a mintablokk és a CL-lista (3,2)/(4,1) állításai erre a láncra épülnek.
// Az élő kéziratmappát a tartalmi sáv átírja (pl. U32 új review-pass), ezért ezek a próbák nem olvashatják azt.
const frozenHandoffs = join(here, 'fixtures', 'handoffs-w01-2026-10');
const baselinePath = join(here, 'fixtures', 'week-01.cl-2026-10-03.json');
const miniDir = join(here, 'fixtures', 'mini');
const samplePath = join(p5, 'examples', 'block.w01-u-3-2.json');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const rules = readJson(join(p5, 'playable-types.json'));
const schema = readJson(join(p5, 'schema', 'block.schema.json'));

const has = (findings, cl, predicate) => findings.some(entry => entry.cl === cl && predicate(entry));
const at = (location, message = '') => entry => entry.location.includes(location) && entry.message.includes(message);

// ---------- Viszonyítási alap: a CL-lista week-01.json-ja ----------

const baseline = runGates(baselinePath, realHandoffs);
const findings = baseline.findings;

test('alap: a CL-listán vizsgált csomag (sha256 0971794f…) a bemenet', () => {
  assert.equal(baseline.input.sha256, '0971794f28ff6563b40d0fbb31afeaf7227dc04ca2570b1b28c1eb1de7710446');
});

test('alap: GATE_FAIL, mind a 6 CL jelez (CL-06 csak figyelmeztetés)', () => {
  assert.equal(baseline.verdict, 'GATE_FAIL');
  for (const cl of ['CL-01', 'CL-02', 'CL-04', 'CL-07', 'CL-08', 'CL-18']) assert.ok(baseline.byCl[cl]?.errors > 0, `${cl} hiba hiányzik`);
  assert.ok(baseline.byCl['CL-06']?.warnings > 0);
  assert.equal(baseline.byCl['CL-06'].errors, 0);
});

test('CL-01: review-kötés és hűség a (3,2), (5,2), (4,1) helyeken', () => {
  const frozen = runGates(baselinePath, frozenHandoffs).findings;
  for (const unit of ['w01-u-3-2', 'w01-u-5-2', 'w01-u-4-1']) {
    assert.ok(has(frozen, 'CL-01', entry => entry.location === unit && /Nincs review-kötés/u.test(entry.message)), unit);
  }
  // A (3,2) runtime szövegei nincsenek a REVIEW_PASS kéziratban (p01 és p06 is).
  assert.ok(has(frozen, 'CL-01', entry => entry.gate === 'fidelity' && entry.location.startsWith('w01-u-3-2 › w01-u-3-2-p01')));
  assert.ok(has(frozen, 'CL-01', entry => entry.gate === 'fidelity' && entry.location.startsWith('w01-u-3-2 › w01-u-3-2-p06') && /Claire/u.test(entry.text)));
  // A review-zott safety-item hiányzik a csomagból.
  assert.ok(has(frozen, 'CL-01', at('w01-u-3-2 › w01-u-3-2-p02-new01', 'hiányzik a csomagból')));
  // A (4,1) „approved oldal” promptjai sem a kéziratból valók.
  assert.ok(has(frozen, 'CL-01', entry => entry.gate === 'fidelity' && entry.location.startsWith('w01-u-4-1 › w01-u-4-1-p07')));
  // Az alapcsomag rögzített, a kéziratmappa viszont élő: az egységek egyenként kapnak REVIEW_PASS-t.
  // Ezért nem kódolt egységnevet várunk, hanem hogy a kapu pontosan a kézirat nélkülieket jelezze.
  const entities = findings.filter(entry => entry.cl === 'CL-01' && /Nincs review-kötés/u.test(entry.message)).map(entry => entry.location);
  assert.ok(entities.length >= 23, 'az egységek listája hiányos');
  const targets = [...entities.map(id => [id, id]), ['vocabulary (w01-vocabulary)', 'w01-vocabulary']];
  for (const [location, id] of targets) {
    const flagged = has(findings, 'CL-01', entry => entry.location === location && /Nincs REVIEW_PASS kézirat/u.test(entry.message));
    assert.equal(flagged, !existsSync(join(realHandoffs, `${id}.review-pass.md`)), id);
  }
});

test('CL-02: a CL-dokumentum nem játszható és üres oldalai', () => {
  for (const page of ['w01-u-3-2-p01', 'w01-u-3-2-p06', 'w01-u-4-1-p01', 'w01-u-4-1-p02', 'w01-u-4-2-p02', 'w01-u-4-2-p03', 'w01-u-4-2-p04', 'w01-u-4-2-p06', 'w01-u-2-2-p06', 'w01-u-2-2-p08']) {
    assert.ok(has(findings, 'CL-02', entry => entry.location.endsWith(page) && /Üres oldal/u.test(entry.message)), page);
  }
  const units = new Set(findings.filter(entry => entry.cl === 'CL-02').map(entry => entry.location.split(' › ')[0]));
  for (const unit of ['w01-u-2-4', 'w01-u-3-1', 'w01-u-3-2', 'w01-u-4-4', 'w01-u-5-1', 'w01-u-5-2', 'w01-u-2-2', 'w01-u-3-4', 'w01-u-4-1', 'w01-u-4-2', 'w01-u-5-4']) {
    assert.ok(units.has(unit), unit);
  }
  // A CL-lista szerint hibátlan egységek itt is tiszták.
  for (const unit of ['w01-u-1-1', 'w01-u-1-2', 'w01-u-1-3', 'w01-u-1-4', 'w01-u-2-3', 'w01-u-3-3', 'w01-u-4-3', 'w01-u-5-3']) assert.ok(!units.has(unit), unit);
});

test('CL-04: „e gamme” típusú töredékek (w01-v2-073, 079, 080, 098)', () => {
  for (const id of ['w01-v2-073', 'w01-v2-079', 'w01-v2-080', 'w01-v2-098']) {
    assert.ok(has(findings, 'CL-04', entry => entry.severity === 'error' && entry.location.includes(id) && /Töredékes/u.test(entry.message)), id);
  }
  assert.ok(has(findings, 'CL-04', entry => entry.severity === 'error' && entry.location.includes('w01-u-4-3-v2-active-073') && entry.text === 'e gamme'));
});

test('CL-06: egyetlen elfogadott mondat — csak figyelmeztetés', () => {
  assert.ok(has(findings, 'CL-06', at('w01-test-grammar-i023')));
  assert.ok(has(findings, 'CL-06', at('w01-v2-097')));
  assert.ok(findings.filter(entry => entry.cl === 'CL-06').every(entry => entry.severity === 'warning'));
});

test('CL-07: a (4,1) kulcsa a promptban nem szereplő számot vár', () => {
  for (const id of ['w01-u-4-1-i05-s001', 'w01-u-4-1-i05-s002']) assert.ok(has(findings, 'CL-07', entry => entry.severity === 'error' && entry.location.endsWith(id)), id);
});

test('CL-08: a (3,2) modelljei sértik a saját briefjüket', () => {
  for (const phrase of ['en revanche', 'à emporter', 'cela/ça nous fera']) {
    assert.ok(has(findings, 'CL-08', at('w01-u-3-2-model-a', phrase)), phrase);
  }
  assert.ok(has(findings, 'CL-08', at('w01-u-3-2-p04 › writing_tools', 'ça te dirait de')));
});

test('CL-18: approved, chunk, _subitem a tanulói felületen', () => {
  assert.ok(has(findings, 'CL-18', entry => entry.location.startsWith('w01-u-4-1') && /approved/u.test(entry.message)));
  assert.ok(has(findings, 'CL-18', entry => entry.location.includes('mandatoryLanguage') && /chunk/u.test(entry.message)));
  assert.ok(has(findings, 'CL-18', entry => entry.text === 'open_writing_subitem'));
});

test('CL-18: w01- és MODE TEST token is tiltott', () => {
  const found = metaTokens([{ unit: 'x', field: 'note', text: 'prérequis : w01-u-5-1' }, { unit: 'x', field: 'badge', text: 'MODE TEST — tout ouvrir' }]);
  assert.deepEqual(found.map(entry => entry.message.match(/„(.+)”/u)[1]), ['w01-', 'MODE TEST']);
});

// ---------- Javított kis tesztcsomag ----------

test('javított tesztcsomag: GATE_PASS, hiba és figyelmeztetés nélkül', () => {
  const report = runGates(join(miniDir, 'week.json'), join(miniDir, 'handoffs'));
  assert.equal(report.verdict, 'GATE_PASS', JSON.stringify(report.findings, null, 2));
  assert.equal(report.errors, 0);
  assert.equal(report.warnings, 0);
});

test('javított tesztcsomag: a kötés utáni módosítás és a kitalálandó szám piros', () => {
  const week = readJson(join(miniDir, 'week.json'));
  const item = week.units[0].pages[0].items[0];
  item.prompt = 'Tu veux combien de croissants ?';
  const result = runWeekGates(week, { handoffsDir: join(miniDir, 'handoffs'), rules });
  assert.ok(has(result, 'CL-07', at('w01-u-4-1-i05')));
  // A rövidített prompt szó szerint benne van a kéziratban, ezt a tartalom-hash fogja meg.
  assert.ok(has(result, 'CL-01', entry => entry.gate === 'binding' && /tartalom-hash/u.test(entry.message)));
  assert.ok(!has(result, 'CL-01', entry => entry.gate === 'fidelity'));
});

// ---------- Mintablokk: séma + hűség ----------

const sample = readJson(samplePath);

test('mintablokk: átmegy a sémán, a review-kötésen és a hűségkapun', () => {
  const result = runBlockGates(sample, { handoffsDir: frozenHandoffs, rules, schema });
  assert.deepEqual(result.filter(entry => entry.cl === 'SCHEMA' || entry.cl === 'CL-01'), []);
  // A „chunk” szót a tulajdonosi terminológiai overlay cseréli (2026-10-06), így minden kapu tiszta.
  // A T27 (2026-11-15) óta a befagyasztott minta magyar rubrikafejléce figyelmeztetést ad, az S23 óta a glossza
  // nélküli francia szöveg is (CL-23); hibát egyik sem.
  assert.deepEqual(result.filter(entry => !['CL-23', 'CL-27'].includes(entry.cl) || entry.severity === 'error'), []);
});

test('mintablokk: egy kitalált mondat megbukik a hűségkapun', () => {
  const tampered = structuredClone(sample);
  tampered.pages[5].content[1].text += '\nPS : Je vous apporterai aussi des macarons.';
  const rebound = bindBlock(tampered, frozenHandoffs); // a kötés friss, tehát csak a hűségkapu foghatja meg
  const result = runBlockGates(rebound, { handoffsDir: frozenHandoffs, rules, schema });
  const fidelity = result.filter(entry => entry.cl === 'CL-01' && entry.gate === 'fidelity');
  assert.equal(fidelity.length, 1);
  assert.match(fidelity[0].location, /w01-u-3-2-p06 › model#1/u);
  assert.match(fidelity[0].text, /macarons/u);
  // Kötés nélkül a régi tartalom-hash is eltér.
  const stale = runBlockGates(tampered, { handoffsDir: frozenHandoffs, rules, schema });
  assert.ok(has(stale, 'CL-01', entry => entry.gate === 'binding' && /tartalom-hash/u.test(entry.message)));
});

test('mintablokk: átírt kulcs vagy alternatíva is megbukik', () => {
  const tampered = structuredClone(sample);
  tampered.pages[1].items[1].solution.alternatives.push('à la place du croissant');
  const result = runBlockGates(bindBlock(tampered, frozenHandoffs), { handoffsDir: frozenHandoffs, rules, schema });
  assert.ok(has(result, 'CL-01', entry => entry.gate === 'fidelity' && /solution\.alternatives\[3\]/u.test(entry.location)));
});

test('mintablokk: hiányzó kötelező mező = sémahiba', () => {
  const broken = structuredClone(sample);
  delete broken.pages[0].manuscriptRef;
  broken.pages[1].items[0].capability = 'writing';
  const result = runBlockGates(broken, { handoffsDir: frozenHandoffs, rules, schema });
  assert.ok(result.every(entry => entry.cl === 'SCHEMA'));
  assert.ok(has(result, 'SCHEMA', entry => /hiányzó mező: manuscriptRef/u.test(entry.message)));
  assert.ok(has(result, 'SCHEMA', entry => entry.location.endsWith('/capability')));
});

test('mintablokk: a modellek szószáma a kéziratban deklaráltat adja', () => {
  const models = sample.pages[5].content.filter(entry => entry.type === 'model');
  assert.deepEqual(models.map(model => countWords(model.text)), models.map(model => model.declaredWords));
});

// ---------- Normalizálás és parancssor ----------

test('normalizálás: szóköz, NBSP, aposztróf és idézőjel', () => {
  assert.equal(normalizeText('Avec « au lieu de », j’en prends ?'), normalizeText('Avec "au lieu de", j\'en prends?'));
  assert.notEqual(normalizeText('j’en prends deux'), normalizeText('j’en prends trois'));
});

test('kézirat-normalizálás: a dőlt lebomlik kötőjeles toldalék és három pont előtt is (U21)', () => {
  assert.equal(normalizeManuscript('az *en*-t már ismered'), 'az en-t már ismered');
  assert.equal(normalizeManuscript('a *de*-ben álló'), 'a de-ben álló');
  assert.equal(normalizeManuscript('(pl. *près de*…) után'), '(pl. près de…) után');
  assert.equal(normalizeManuscript('Ha egy *de*-t kívánó ige, *de la vitrine*…)'), 'Ha egy de-t kívánó ige, de la vitrine…)');
  assert.equal(normalizeManuscript('*le café*, *un thé*.'), 'le café, un thé.', 'a régi esetek változatlanok');
  assert.equal(normalizeManuscript('a*b*c és 2*3*4'), 'a*b*c és 2*3*4', 'szó belsejében álló csillag nem bomlik');
  assert.equal(normalizeManuscript('*en*t'), '*en*t', 'betű a záró csillag után: nem dőlt');
});

test('szószám: a szögletes zárójeles színpadi utasítás nem számít (U14)', () => {
  const without = 'Vous : Attendez, 7,90 €, c\'est la formule, non ? Merci, bonne journée !';
  assert.equal(countWords(without), 9);
  assert.equal(countWords('Vous : Attendez, 7,90 €, c\'est la formule, non ? *[Elle corrige.]* Merci, bonne journée !'), 9);
  assert.equal(countWords('Vous : Attendez, 7,90 €, c\'est la formule, non ? [Elle corrige.] Merci, bonne journée !'), 9);
  assert.equal(countWords('Bonjour.[Il sourit.]Merci.'), 2, 'szóköz nélkül sem ragasztja össze a szomszédos szavakat');
});

test('parancssor: 0 = GATE_PASS, 1 = GATE_FAIL, JSON-jelentés', () => {
  const ok = spawnSync(process.execPath, [join(p5, 'gates.mjs'), join(miniDir, 'week.json'), '--handoffs', join(miniDir, 'handoffs')], { encoding: 'utf8' });
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /GATE_PASS/u);
  const fail = spawnSync(process.execPath, [join(p5, 'gates.mjs'), baselinePath, '--handoffs', frozenHandoffs, '--json', '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  assert.equal(fail.status, 1, fail.stderr);
  const report = JSON.parse(fail.stdout);
  assert.equal(report.verdict, 'GATE_FAIL');
  assert.ok(report.findings.every(entry => entry.cl && entry.location && entry.severity));
  const usage = spawnSync(process.execPath, [join(p5, 'gates.mjs')], { encoding: 'utf8' });
  assert.equal(usage.status, 2);
});

test('bind: a heti csomag kötése determinisztikus', () => {
  const output = execFileSync(process.execPath, [join(p5, 'bind.mjs'), join(miniDir, 'week.json'), '--handoffs', join(miniDir, 'handoffs')], { encoding: 'utf8' });
  const [entry] = JSON.parse(output);
  assert.deepEqual(entry.reviewBinding, readJson(join(miniDir, 'week.json')).units[0].reviewBinding);
});

// ---------- Felváltott tulajdonosi overlay (U32, U42, 11-02) ----------

const gateProblems = (block, dir) => runBlockGates(bindBlock(block, dir), { handoffsDir: dir, rules, schema: {} });

test('Felváltja: a felsorolt overlay és a csak rajta át elért fájl kimarad a láncból, a többi overlay marad', () => {
  const dir = mkdtempSync(join(tmpdir(), 'p5-felvaltja-'));
  const id = 'w99-u-1-1';
  const write = (name, text) => writeFileSync(join(dir, `${id}.${name}.md`), text);
  const names = chain => chain.files.map(file => file.file);
  try {
    write('owner-regi-overlay', `Alapkézirat: ${id}.revision-for-recheck.md\n\n## \`${id}-p03-new01\`\n\nRégi szöveg.\n`);
    write('owner-uj-overlay', 'Érvényes döntés.\n');
    write('revision-for-recheck', 'Régi kézirat.\n');
    write('kezirat', 'Új kézirat.\n');
    write('review-pass', `REVIEW_PASS\n\nKéziratlánc:\n- ${id}.kezirat.md\n`);
    const before = loadReviewChain(dir, id);
    assert.deepEqual(names(before).sort(), ['kezirat', 'owner-regi-overlay', 'owner-uj-overlay', 'review-pass', 'revision-for-recheck'].map(name => `${id}.${name}.md`));
    assert.deepEqual(before.superseded, [], 'Felváltja sor nélkül minden marad');

    write('review-pass', `REVIEW_PASS\n\nKéziratlánc:\n- ${id}.kezirat.md\n\n**Felváltja:** \`${id}.owner-regi-overlay.md\`\r\n`);
    const chain = loadReviewChain(dir, id);
    assert.deepEqual(names(chain), ['review-pass', 'owner-uj-overlay', 'kezirat'].map(name => `${id}.${name}.md`));
    assert.deepEqual(chain.superseded, [`${id}.owner-regi-overlay.md`]);
    assert.ok(!chain.corpus.includes('Régi szöveg'), 'a felváltott szöveg a hűségkapunak sem forrás');
    assert.ok(existsSync(join(dir, `${id}.owner-regi-overlay.md`)), 'a régi fájl megmarad előzménynek');

    const ownBlock = { id, title: 'Próba', pages: [] };
    const problems = gateProblems(ownBlock, dir);
    assert.ok(problems.some(entry => entry.severity === 'warning' && entry.location.endsWith(`${id}.owner-regi-overlay.md`)), 'a kapu figyelmeztet');
    assert.ok(!problems.some(entry => entry.gate === 'binding' && entry.severity === 'error' && entry.location.includes('owner-regi')));
    assert.ok(!problems.some(entry => entry.location.includes('p03-new01')), 'a felváltott overlay eleme nem kér lefedést');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('Felváltja: nem létező vagy nem tulajdonosi fájl = CL-01 hiba, és nem esik ki a láncból', () => {
  const dir = mkdtempSync(join(tmpdir(), 'p5-felvaltja-'));
  const id = 'w99-u-1-1';
  const write = (name, text) => writeFileSync(join(dir, `${id}.${name}.md`), text);
  try {
    write('kezirat', 'Új kézirat.\n');
    write('review-pass', `REVIEW_PASS\n\n- ${id}.kezirat.md\n\nFelváltja: ${id}.owner-elirt.md, ${id}.kezirat.md\n`);
    const chain = loadReviewChain(dir, id);
    assert.deepEqual(chain.badSupersedes, [`${id}.owner-elirt.md`, `${id}.kezirat.md`]);
    assert.ok(chain.files.some(file => file.file === `${id}.kezirat.md`));
    const problems = gateProblems({ id, title: 'Próba', pages: [] }, dir);
    assert.equal(problems.filter(entry => entry.severity === 'error' && /Felváltja sora/u.test(entry.message)).length, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('lefedettség: az aláhúzásos kézirat-ID (…-written_fr_to_hu) a kötőjeles blokk-ID-vel egyezik (U33, 11-13)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'p5-alahuzas-'));
  const id = 'w99-u-3-3';
  try {
    writeFileSync(join(dir, `${id}.kezirat.md`), [
      `### ${id}-v2-active-001-written_fr_to_hu`, '', `### ${id}-v2-active-001-hu_to_spoken_fr`, ''
    ].join('\n'));
    writeFileSync(join(dir, `${id}.review-pass.md`), `REVIEW_PASS\n\nKéziratlánc:\n- ${id}.kezirat.md\n`);
    const item = suffix => ({ id: `${id}-v2-active-001-${suffix}`, prompt: 'Traduis.', response: { type: 'text' }, solution: { type: 'none' }, evaluation: { mode: 'formative' } });
    const coverage = block => gateProblems(block, dir).filter(entry => entry.gate === 'coverage');
    const page = items => ({ id, title: 'Próba', pages: [{ id: `${id}-p01`, content: [], items }] });
    assert.deepEqual(coverage(page([item('written-fr-to-hu'), item('hu-to-spoken-fr')])), []);
    const missing = coverage(page([item('written-fr-to-hu')]));
    assert.deepEqual(missing.map(entry => entry.location), [`${id} › ${id}-v2-active-001-hu-to-spoken-fr`], 'a hiányzó item teljes (kötőjelesített) ID-vel jelenik meg, nem csonkán');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('lefedettség: a FELTÉTELES / FÜGGŐ jelölésű címsor hiányzó iteme figyelmeztetés, nem hiba; ha benne van, rendben (U54, 11-14)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'p5-felteteles-'));
  const id = 'w99-u-5-4';
  try {
    writeFileSync(join(dir, `${id}.kezirat.md`), [
      `### ${id}-i01`, '', `### ${id}-i01-r2 (FELTÉTELES)`, '', `### ${id}-i05-r1: csatornás változat (FÜGGŐ: HALLGATÁSI LAP)`, '', `### ${id}-i02`, ''
    ].join('\n'));
    writeFileSync(join(dir, `${id}.review-pass.md`), `REVIEW_PASS\n\nKéziratlánc:\n- ${id}.kezirat.md\n`);
    const item = suffix => ({ id: `${id}-${suffix}`, prompt: 'Réponds.', response: { type: 'text' }, solution: { type: 'none' }, evaluation: { mode: 'formative' } });
    const coverage = block => gateProblems(block, dir).filter(entry => entry.gate === 'coverage');
    const page = items => ({ id, title: 'Próba', pages: [{ id: `${id}-p01`, content: [], items }] });
    const without = coverage(page([item('i01'), item('i02')]));
    assert.deepEqual(without.map(entry => [entry.severity, entry.location]), [['warning', `${id} › ${id}-i01-r2`], ['warning', `${id} › ${id}-i05-r1`]]);
    assert.match(without[0].message, /Feltételes elem, nincs a csomagban/u);
    assert.deepEqual(coverage(page([item('i01'), item('i02'), item('i01-r2'), item('i05-r1')])), [], 'ha a feltételes item benne van, nincs jelzés');
    assert.deepEqual(coverage(page([item('i01')])).map(entry => [entry.severity, entry.location.split(' › ').pop()]),
      [['warning', `${id}-i01-r2`], ['warning', `${id}-i05-r1`], ['error', `${id}-i02`]], 'a jelöletlen címsor hiánya továbbra is hiba');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
