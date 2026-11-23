// Mesterszintű teszt (completion.mode: mastery, szerződés 2.0.3) és újrapróba-változatok (retry), GT1 app-igény (11-09).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runBlockGates } from '../lib/gates.mjs';
import { compileWeek } from '../lib/compile.mjs';
import { compileCourseContract } from '../vendor/course-contract/course-contract.js';

const here = dirname(fileURLToPath(import.meta.url));
const p5 = resolve(here, '..');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const planDir = join(here, 'fixtures', 'types');
const plan = readJson(join(planDir, 'week.plan.json'));
const handoffsDir = resolve(planDir, plan.handoffs);
const rules = readJson(join(p5, 'playable-types.json'));
const schema = readJson(join(p5, 'schema', 'block.schema.json'));
// A választható utas lecke (w40-u-5-1) 2.0.4-re emelné a csomagot; itt a 2.0.3-as mesterszint a próba (paths.test.mjs).
const blocks = plan.blocks.map(ref => readJson(resolve(planDir, ref))).filter(block => block.completion.mode !== 'resolved');
const mastery = blocks.find(block => block.id === 'w40-test-maitrise');
const gates = block => runBlockGates(block, { handoffsDir, rules, schema });
const errors = block => gates(block).filter(entry => entry.severity === 'error');
const validate = compileCourseContract();
const codes = pkg => validate(pkg).errors.map(e => e.code);
const v2Block = pkg => pkg.weeks[0].blocks.find(block => block.id.endsWith(':test-maitrise'));

test('mesterszintű blokk: a kapuk zöldek, az -r1 változat a kéziratban lefedett (checkCoverage)', () => {
  assert.deepEqual(errors(mastery), []);
  const noRetry = structuredClone(mastery);
  delete noRetry.pages[0].items[0].retry;
  assert.ok(errors(noRetry).some(entry => entry.cl === 'CL-01' && entry.gate === 'coverage' && entry.location.endsWith('w40-test-maitrise-i01-r1')), 'a változat nélkül az -r1 hiányzik a csomagból');
});

test('fordítás: a változat az alapitem után, retryItemRefs + immutableFirstAttempt; mastery, csak alapitemek kötelezők; csomag 2.0.3', () => {
  const result = compileWeek(plan, blocks, { planDir });
  assert.equal(result.status, 'COMPILED', JSON.stringify(result.contract.errors.slice(0, 3)));
  assert.equal(result.package.schemaVersion, '2.0.3');
  const block = v2Block(result.package), items = block.pages[0].items;
  assert.deepEqual(items.map(i => i.id.split(':').pop()), ['i01', 'i01-r1', 'i02', 'i02-r1', 'i03']);
  assert.deepEqual(block.completion, { mode: 'mastery', requiredRefs: [items[0].id, items[2].id, items[4].id] });
  assert.deepEqual(items[0].repetition, { mode: 'delayed', minIntervening: 1, independentSuccess: true, retryItemRefs: [items[1].id], immutableFirstAttempt: true });
  assert.equal(items[2].repetition.minIntervening, 3);
  assert.equal(result.presentation.items[items[1].id].retryOf, items[0].id);
  assert.equal(result.presentation.items[items[0].id].retryOf, undefined);
});

test('kapu: változat csak mesterszintű tesztben; képesség, választípus és cél egyezik; nem kötelező; nincs saját retry', () => {
  const allItems = structuredClone(mastery);
  allItems.completion.mode = 'all-items';
  assert.ok(errors(allItems).some(e => /csak mesterszintű tesztben/.test(e.message)));
  const lesson = structuredClone(mastery);
  lesson.kind = 'lesson'; delete lesson.assessmentKind;
  assert.ok(errors(lesson).some(e => /csak tesztblokkban/.test(e.message)));
  const other = structuredClone(mastery), variant = other.pages[0].items[0].retry.items[0];
  Object.assign(variant, { capability: 'CAP-typed-short', variant: 'PV-typed-short', response: { type: 'text', lines: 'single' }, solution: { type: 'exact', key: 'une', alternatives: [] } });
  assert.ok(errors(other).some(e => /képessége és választípusa/.test(e.message)));
  const nested = structuredClone(mastery);
  nested.pages[0].items[0].retry.items[0].retry = structuredClone(nested.pages[0].items[0].retry);
  assert.ok(errors(nested).some(e => /nem lehet saját újrapróbája/.test(e.message)));
  const required = structuredClone(mastery);
  required.completion.requiredRefs.push('w40-test-maitrise-i01-r1');
  assert.ok(errors(required).some(e => /nem lehet kötelező/.test(e.message)));
  const missing = structuredClone(mastery);
  missing.completion.requiredRefs = missing.completion.requiredRefs.slice(1);
  assert.ok(errors(missing).some(e => /minden pontozott alapitem kötelező/.test(e.message)));
});

test('szerződés 2.0.3: a mastery csak 2.0.3-ban; a változat nem lehet kötelező; minden pontozott item kötelező vagy változat', () => {
  const pkg = compileWeek(plan, blocks, { planDir }).package;
  assert.deepEqual(codes(pkg), []);
  const old = structuredClone(pkg); old.schemaVersion = '2.0.2';
  assert.ok(codes(old).includes('COMPLETION_MODE_VERSION'));
  const required = structuredClone(pkg), rb = v2Block(required);
  rb.completion.requiredRefs.push(rb.pages[0].items[1].id);
  assert.ok(codes(required).includes('MASTERY_RETRY_REQUIRED'));
  const orphan = structuredClone(pkg), ob = v2Block(orphan);
  delete ob.pages[0].items[0].repetition.retryItemRefs;
  assert.ok(codes(orphan).includes('INCOMPLETE_COMPLETION'));
  const mutable = structuredClone(pkg), mb = v2Block(mutable);
  delete mb.pages[0].items[0].repetition.immutableFirstAttempt;
  assert.ok(codes(mutable).includes('MASTERY_FIRST_ATTEMPT'));
  const binding = structuredClone(pkg), bb = v2Block(binding);
  bb.pages[0].items[1].capability = 'CAP-typed-short';
  assert.ok(codes(binding).includes('RETRY_BINDING'));
});
