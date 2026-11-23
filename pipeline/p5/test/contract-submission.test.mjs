// A rögzített v2 szerződés P5-bővítése (2.0.1): kulcs nélküli „submission” megoldás csak nem pontozott itemhez.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileWeek } from '../lib/compile.mjs';
import { compileCourseContract } from '../vendor/course-contract/course-contract.js';

const here = dirname(fileURLToPath(import.meta.url));
const planDir = join(here, 'fixtures', 'types');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const plan = readJson(join(planDir, 'week.plan.json'));
// A mesterszintű tesztblokk (w40-test-maitrise) a csomagot 2.0.3-ra, a választható utas lecke (w40-u-5-1) 2.0.4-re emeli;
// a verzióválasztás próbái nélkülük futnak (mastery.test.mjs, paths.test.mjs).
const blocks = plan.blocks.map(ref => readJson(join(planDir, ref))).filter(block => !['mastery', 'resolved'].includes(block.completion.mode));
const validate = compileCourseContract();
const base = compileWeek(plan, blocks, { planDir }).package;
const formativeIn = pkg => { const item = firstMultiple(pkg); for (const b of pkg.weeks[0].blocks) if (b.completion?.requiredRefs) b.completion.requiredRefs = b.completion.requiredRefs.filter(id => id !== item.id); return item; };
const firstMultiple = pkg => pkg.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).find(i => i.response.type === 'multiple');
const codes = pkg => validate(pkg).errors?.map(e => e.code) ?? [];

// (A blokk itt egyetlen itemét tesszük nem pontozottá, ezért a blokkszintű EMPTY_COMPLETION várható; a teljes érvényességet
// a types.test.mjs fordítási próbája mutatja.)
const SUBMISSION_RULES = ['UNKNOWN_SOLUTION', 'EXACT_SOLUTION_REQUIRED', 'SUBMISSION_FORMATIVE_ONLY', 'ANSWER_ARITY', 'AMBIGUOUS_CHOICE_KEY', 'UNKNOWN_PROPERTY', 'TYPE'];
test('2.0.1: submission + formative-only = érvényes', () => {
  const pkg = structuredClone(base);
  pkg.schemaVersion = '2.0.1';
  Object.assign(formativeIn(pkg), { solution: { type: 'submission' }, evaluation: { ...firstMultiple(pkg).evaluation, mode: 'formative', policyId: 'formative-only' } });
  assert.deepEqual(codes(pkg).filter(code => SUBMISSION_RULES.includes(code)), []);
});

test('pontozott itemen a submission tilos (SUBMISSION_FORMATIVE_ONLY)', () => {
  const pkg = structuredClone(base);
  pkg.schemaVersion = '2.0.1';
  firstMultiple(pkg).solution = { type: 'submission' };
  assert.ok(codes(pkg).includes('SUBMISSION_FORMATIVE_ONLY'));
});

test('2.0.0-s csomagban a submission ismeretlen; a pontozott többválasztós exact kulcsa változatlanul kötelező', () => {
  const pkg = structuredClone(base);
  Object.assign(firstMultiple(pkg), { solution: { type: 'submission' }, evaluation: { ...firstMultiple(pkg).evaluation, mode: 'formative', policyId: 'formative-only' } });
  assert.ok(codes(pkg).includes('UNKNOWN_SOLUTION'));
  assert.deepEqual(codes(base), [], 'a változatlan hét érvényes 2.0.0');
});
