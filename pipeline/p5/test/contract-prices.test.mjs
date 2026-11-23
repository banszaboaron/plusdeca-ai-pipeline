// A rögzített v2 szerződés P5-bővítése (2.0.2): a normalization numbersFr / pricesFr jelzője (francia szám- és
// árírás, Áron 10-29, NYE-U34M-02). A blokk response.normalization-nel kéri, a fordító 2.0.2-es csomagot ad.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileWeek } from '../lib/compile.mjs';
import { runBlockGates } from '../lib/gates.mjs';
import { compileCourseContract } from '../vendor/course-contract/course-contract.js';

const here = dirname(fileURLToPath(import.meta.url));
const planDir = join(here, 'fixtures', 'types');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const plan = readJson(join(planDir, 'week.plan.json'));
// A mesterszintű tesztblokk (w40-test-maitrise) a csomagot 2.0.3-ra, a választható utas lecke (w40-u-5-1) 2.0.4-re emeli;
// a verzióválasztás próbái nélkülük futnak (mastery.test.mjs, paths.test.mjs).
const blocks = plan.blocks.map(ref => readJson(resolve(planDir, ref))).filter(block => !['mastery', 'resolved'].includes(block.completion.mode));
const handoffsDir = resolve(planDir, plan.handoffs);
const rules = readJson(join(here, '..', 'playable-types.json'));
const schema = readJson(join(here, '..', 'schema', 'block.schema.json'));
const validate = compileCourseContract();
const codes = pkg => validate(pkg).errors?.map(e => e.code) ?? [];

/** A w40-u-2-1 diktálásitemje francia ár- és számírás-normalizálással. */
function dictationVariant(normalization = { pricesFr: true, numbersFr: true }) {
  const block = structuredClone(blocks.find(entry => entry.id === 'w40-u-2-1'));
  const item = block.pages.flatMap(page => page.items).find(entry => entry.capability === 'CAP-dictation');
  item.response.normalization = normalization;
  return block;
}
const withBlock = block => blocks.map(entry => (entry.id === block.id ? block : entry));
const textItems = pkg => pkg.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).filter(i => i.response.type === 'text');

test('a blokk kérheti: a kapuk zöldek, a fordítás 2.0.2-es csomag, a jelzők az itemen', () => {
  const block = dictationVariant();
  // (A változtatott blokk review-kötése, a tartalom-hash, értelemszerűen elavul; azt itt nem nézzük.)
  assert.deepEqual(runBlockGates(block, { handoffsDir, rules, schema }).filter(entry => entry.severity === 'error' && entry.gate !== 'binding'), []);
  const result = compileWeek(plan, withBlock(block), { planDir });
  assert.equal(result.status, 'COMPILED', JSON.stringify([...result.needs, ...result.contract.errors].slice(0, 5)));
  assert.equal(result.package.schemaVersion, '2.0.2');
  const flagged = textItems(result.package).filter(i => i.response.normalization.pricesFr);
  assert.equal(flagged.length, 1);
  assert.equal(flagged[0].response.normalization.numbersFr, true);
  assert.equal(flagged[0].response.normalization.accentsSensitive, true, 'a többi szabály változatlan');
});

test('csak a bekapcsolt jelző kerül át; jelző nélkül a csomag marad 2.0.0', () => {
  const result = compileWeek(plan, withBlock(dictationVariant({ pricesFr: true, numbersFr: false })), { planDir });
  assert.equal(result.package.schemaVersion, '2.0.2');
  assert.ok(textItems(result.package).every(i => !('numbersFr' in i.response.normalization)));
  assert.equal(compileWeek(plan, withBlock(dictationVariant({ pricesFr: false })), { planDir }).package.schemaVersion, '2.0.0');
});

test('a blokkséma csak a két ismert logikai jelzőt engedi', () => {
  const schemaErrors = normalization => runBlockGates(dictationVariant(normalization), { handoffsDir, rules, schema }).filter(entry => entry.cl === 'SCHEMA');
  assert.ok(schemaErrors({ pricesFr: 'igen' }).length > 0);
  assert.ok(schemaErrors({ dotDecimal: true }).length > 0);
});

test('szerződés: a jelző csak 2.0.2-es csomagban érvényes, és logikai érték', () => {
  const pkg = compileWeek(plan, withBlock(dictationVariant()), { planDir }).package;
  assert.deepEqual(codes(pkg), []);
  for (const version of ['2.0.0', '2.0.1']) assert.ok(codes({ ...structuredClone(pkg), schemaVersion: version }).includes('NORMALIZATION_FLAG_VERSION'), version);
  const wrong = structuredClone(pkg);
  textItems(wrong).find(i => i.response.normalization.pricesFr).response.normalization.pricesFr = 'igen';
  assert.ok(codes(wrong).length > 0);
});

test('2.0.2-ben a submission is érvényes (a 2.0.1 bővítését tartalmazza)', () => {
  const pkg = compileWeek(plan, withBlock(dictationVariant()), { planDir }).package;
  const item = pkg.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).find(i => i.response.type === 'multiple');
  for (const b of pkg.weeks[0].blocks) if (b.completion?.requiredRefs) b.completion.requiredRefs = b.completion.requiredRefs.filter(id => id !== item.id);
  Object.assign(item, { solution: { type: 'submission' }, evaluation: { ...item.evaluation, mode: 'formative', policyId: 'formative-only' } });
  assert.ok(!codes(pkg).some(code => ['UNKNOWN_SOLUTION', 'SUBMISSION_FORMATIVE_ONLY'].includes(code)));
});

test('CL-07: diktálásnál a kulcs számai a hangátiratból jönnek, nem kell a feladatszövegben lenniük', () => {
  const block = dictationVariant();
  const sentence = 'Un café, deux euros quarante, s’il vous plaît.';
  const item = block.pages.flatMap(page => page.items).find(entry => entry.capability === 'CAP-dictation');
  item.solution.key = sentence;
  const cl07 = () => runBlockGates(block, { handoffsDir, rules, schema }).filter(entry => entry.cl === 'CL-07');
  assert.equal(cl07().length, 1, 'átirat nélkül a kulcs számai nincsenek a feladatban');
  block.media.find(media => item.mediaRefs.includes(media.id)).transcript = sentence;
  assert.deepEqual(cl07(), []);
});
