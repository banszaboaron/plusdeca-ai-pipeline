import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileCourseContract } from '../vendor/course-contract/course-contract.js';
import { compileWeek } from '../lib/compile.mjs';
import { loadPlaywright } from '../lib/crawl.mjs';
import { readLedger, readManifest, rollback } from '../lib/release.mjs';
import { bindBlock } from '../bind.mjs';
import { buildWeek, migrationProblems } from '../week-build.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const p5 = join(here, '..');
// Rögzített pillanatkép (2026-10): a mintablokk erre a láncra van kötve; az élő kéziratmappát a tartalmi sáv átírja.
const handoffs = join(here, 'fixtures', 'handoffs-w01-2026-10');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const sample = readJson(join(p5, 'examples', 'block.w01-u-3-2.json'));
const tmp = mkdtempSync(join(tmpdir(), 'p5-build-'));
after(() => rmSync(tmp, { recursive: true, force: true }));

function plan(name, blocks, extra = {}) {
  const dir = mkdtempSync(join(tmp, `${name}-`));
  const refs = blocks.map((block, index) => { const file = join(dir, `block-${index}.json`); writeFileSync(file, JSON.stringify(block)); return file; });
  const path = join(dir, 'plan.json');
  writeFileSync(path, JSON.stringify({ week: 1, title: 'Semaine test', handoffs, blocks: refs, ...extra }));
  return path;
}

test('v2 szerződés (rögzített másolat + shim): a codex-ági DEMO-csomag érvényes', () => {
  const result = compileCourseContract()(readJson(join(here, 'fixtures', 'v2-demo-course.codex-6167dfc.json')));
  assert.deepEqual(result, { valid: true, errors: [] });
});

test('fordító: a mintablokkból érvényes v2 csomag lesz, névteres ID-kkel', () => {
  const result = compileWeek({ week: 1, title: 'Semaine 1' }, [sample]);
  assert.equal(result.status, 'COMPILED', JSON.stringify(result.contract.errors));
  const block = result.package.weeks[0].blocks[0];
  assert.equal(block.id, 'course:plusdeca:w01:u-3-2');
  assert.equal(block.pages[1].items[0].id, 'course:plusdeca:w01:u-3-2:p02:i01');
  assert.equal(result.presentation.idMap['w01-u-3-2-p02-new01'], 'course:plusdeca:w01:u-3-2:p02:p02-new01');
  // A v2-ben nincs feedbackmező: a kísérő fájlba kerül.
  assert.equal(result.presentation.items['course:plusdeca:w01:u-3-2:p02:i01'].feedback.targeted[0].id, 'U32-P02-E01');
  // Az írásos fő feladat dual-gate értékelésű és kötelező; a formatív előkészítés nem.
  const i11 = block.pages[4].items[0];
  assert.equal(i11.evaluation.policyId, 'writing-dual-gate');
  assert.deepEqual(block.completion.requiredRefs, [i11.id, block.pages[6].items[0].id]);
  assert.ok(result.warnings.some(entry => entry.code === 'FORMATIVE_NOT_REQUIRED'));
  assert.match(result.package.contentVersion, /^w01-[0-9a-f]{16}$/u);
});

test('fordító: amit nem tud leképezni, az NEEDS_CAPABILITY (nem talál ki) — pl. nem deklarált média', () => {
  const block = structuredClone(sample);
  block.pages[0].content.push({ type: 'media', mediaRef: 'w01-audio-x', manuscriptRef: block.pages[0].manuscriptRef });
  const result = compileWeek({ week: 1, title: 'x' }, [block]);
  assert.equal(result.status, 'NEEDS_CAPABILITY');
  assert.match(result.needs[0].message, /Nem deklarált média: w01-audio-x/u);
});

test('fordító: hiányzó helyi médiafájl = nem fordul le (nem talál ki fájlt)', () => {
  const block = structuredClone(sample);
  block.media = [{ id: 'audio-x', kind: 'audio', access: 'local', file: 'nincs-ilyen.wav', alternative: 'x' }];
  const result = compileWeek({ week: 1, title: 'x' }, [block], { planDir: tmp });
  assert.equal(result.status, 'NEEDS_CAPABILITY');
  assert.equal(result.needs[0].code, 'MEDIA_FILE_MISSING');
});

test('week-build: kötés nélküli (átírt) blokk = REJECTED_INPUT', async () => {
  const block = structuredClone(sample);
  block.pages[0].title = 'Titre inventé';
  const out = join(tmp, 'out-rejected');
  const { status, report } = await buildWeek(plan('rejected', [block]), { out, crawl: false });
  assert.equal(status, 'REJECTED_INPUT');
  assert.ok(report.steps.intake.findings.some(entry => entry.cl === 'CL-01' && entry.gate === 'fidelity'));
  assert.equal(readLedger(out).entries.at(-1).status, 'REJECTED_INPUT');
});

test('week-build: kiadás, migráció-ellenőrzés és visszaállítás', async t => {
  const playwright = await loadPlaywright();
  const out = join(tmp, 'out-release');
  const first = await buildWeek(plan('v1', [sample]), { out, crawl: Boolean(playwright) });
  if (!playwright) {
    assert.equal(first.status, 'BUILT_UNCRAWLED');
    t.skip('Playwright nem érhető el; a kiadási lánc többi része bejárás nélkül nem tesztelhető.');
    return;
  }
  assert.equal(first.status, 'RELEASED', JSON.stringify(first.report.steps.crawl));
  assert.equal(first.report.steps.crawl.screenshots, 14);
  const v1 = first.report.contentVersion;

  // Második, hű változat (egy példamondattal kevesebb) → új csomagverzió, a mutató átáll.
  const variant = structuredClone(sample);
  variant.pages[1].content[1].entries = variant.pages[1].content[1].entries.slice(0, 2);
  const released = await buildWeek(plan('v2', [bindBlock(variant, handoffs)]), { out, crawl: true });
  assert.equal(released.status, 'RELEASED');
  assert.notEqual(released.report.contentVersion, v1);
  assert.equal(readManifest(out).weeks['1'].current, released.report.contentVersion);
  const back = rollback(out, 1);
  assert.deepEqual(back, { from: released.report.contentVersion, to: v1 });
  assert.equal(readManifest(out).weeks['1'].current, v1);
  assert.match(readFileSync(join(out, 'RELEASE_STATUS.md'), 'utf8'), /visszaállítva/u);
  const status = JSON.parse(readFileSync(join(out, 'weeks-status.json'), 'utf8'));
  assert.equal(status.released['1'].current, v1);
  assert.equal(status.lastAttempt['1'].status, 'ROLLED_BACK');
});

test('migráció: eltűnt item térkép nélkül piros, térképpel zöld', () => {
  const previous = { items: { a: {}, b: {} } };
  const now = { items: { a: {} } };
  assert.deepEqual(migrationProblems(previous, now).map(entry => entry.location), ['b']);
  assert.deepEqual(migrationProblems(previous, now, { b: null }), []);
  assert.deepEqual(migrationProblems(null, now), []);
});

test('migrációs javaslat: egyértelmű pár (azonos ID más oldalon, -s001 utótag nélkül), különben null', async () => {
  const { proposeMigrations } = await import('../week-build.mjs');
  const items = ids => ({ items: Object.fromEntries(ids.map(id => [id, {}])) });
  const previous = items(['c:w01:u-2-1:p02:i01-s001', 'c:w01:u-2-4:p04:i02', 'c:w01:u-1-4:p02:p02-plan', 'c:w01:u-1-4:p03:keep']);
  const now = items(['c:w01:u-2-1:p02:i01', 'c:w01:u-2-4:p09:i02', 'c:w01:u-1-4:p02:f1', 'c:w01:u-1-4:p02:f2', 'c:w01:u-1-4:p03:keep']);
  assert.deepEqual(proposeMigrations(previous, now), {
    'c:w01:u-2-1:p02:i01-s001': { to: 'c:w01:u-2-1:p02:i01', reason: 'egyértelmű pár' },
    'c:w01:u-2-4:p04:i02': { to: 'c:w01:u-2-4:p09:i02', reason: 'egyértelmű pár' },
    'c:w01:u-1-4:p02:p02-plan': { to: null, reason: 'nincs pár' },
  });
  assert.deepEqual(Object.keys(proposeMigrations(previous, now, { 'c:w01:u-1-4:p02:p02-plan': null })).length, 2);
});
