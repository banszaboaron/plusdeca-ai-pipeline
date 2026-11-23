// U54 app-igény (11-14): kulcs nélküli, nem pontozott szöveges válasz (solution: none) a fordítóban.
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
// Mint az u44.test-ben: a mesterszintű és a választható utas blokk nélkül a verzió a submission miatt 2.0.1.
const fixtureBlocks = plan.blocks.map(ref => readJson(join(planDir, ref))).filter(block => !['mastery', 'resolved'].includes(block.completion.mode));
const validate = compileCourseContract();
const codes = pkg => validate(pkg).errors?.map(e => e.code) ?? [];
const compile = blocks => compileWeek(plan, blocks, { planDir });
const itemOf = (result, id) => result.package?.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).find(i => i.id.endsWith(id));

// Az U54 t02 alakja (editorial/p4-planning/ceo/runs/javitas-U54-2026-11-13/kimenet/block.w01-u-5-4.json).
const t02 = (over = {}) => ({
  id: 'w40-u-3-2-t02',
  capability: 'CAP-writing',
  variant: 'PV-writing-short',
  prompt: 'Egy mondatban, magyarul: miben más egy magyar reggel kávéval, mint a dalbeli p’tit kawa?',
  response: { type: 'text', lines: 'single' },
  solution: { type: 'none' },
  feedback: { correct: 'Elmentettük.' },
  evaluation: { mode: 'formative', scoring: 'formative-required' },
  ...over,
});
// Saját PAGE-closed oldalra kerül a w40-u-3-2 blokkban (a fonetikai ABX-oldal csak ABX-et enged).
const withItem = item => fixtureBlocks.map(block => {
  if (block.id !== 'w40-u-3-2') return block;
  const copy = structuredClone(block);
  copy.pages.push({ ...structuredClone(copy.pages[0]), id: 'w40-u-3-2-p02', template: 'PAGE-closed', variant: 'PV-closed-mixed', items: [item] });
  return copy;
});

test('formatív szöveges válasz solution: none → kulcs nélküli beküldés (2.0.1, formative-only)', () => {
  const result = compile(withItem(t02()));
  assert.equal(result.status, 'COMPILED', JSON.stringify(result.needs ?? result.contract?.errors?.slice(0, 3)));
  assert.equal(result.package.schemaVersion, '2.0.1');
  const item = itemOf(result, 't02');
  assert.equal(item.response.type, 'writing', 'CAP-writing → v2 writing');
  assert.deepEqual(item.solution, { type: 'submission' });
  assert.equal(item.evaluation.mode, 'formative');
  assert.equal(item.evaluation.policyId, 'formative-only');
  assert.deepEqual(codes(result.package), []);
});

test('nem írásos képességű text válasz is: v2 text + submission', () => {
  const result = compile(withItem(t02({ capability: 'CAP-typed-short', variant: 'PV-typed-short' })));
  const item = itemOf(result, 't02');
  if (result.status !== 'COMPILED') assert.fail(JSON.stringify(result.needs ?? result.contract?.errors?.slice(0, 3)));
  assert.equal(item.response.type, 'text');
  assert.deepEqual(item.solution, { type: 'submission' });
  assert.deepEqual(codes(result.package), []);
});

test('pontozott szöveges válasz solution: none nélkül nem lesz beküldés', () => {
  const result = compile(withItem(t02({ evaluation: { mode: 'semantic', scoring: 'scored' } })));
  assert.notEqual(result.status, 'COMPILED');
  assert.notEqual(itemOf(result, 't02')?.solution?.type, 'submission');
});

test('a szerződés kivétele szűk: csak formatív írás; beszédnél és pontozott írásnál marad a rubrika-követelmény', () => {
  const result = compile(withItem(t02()));
  const graded = structuredClone(result.package);
  Object.assign(itemOf({ package: graded }, 't02').evaluation, { mode: 'dual-gate', policyId: 'writing-dual-gate', minimumScore: 3 });
  assert.ok(codes(graded).includes('SUBMISSION_FORMATIVE_ONLY'));
  const speech = structuredClone(result.package);
  Object.assign(itemOf({ package: speech }, 't02'), { capability: 'CAP-recall-spoken', response: { type: 'speech', durationRange: { min: 3, max: 30 } } });
  assert.ok(codes(speech).includes('RUBRIC_REQUIRED'));
  const old = structuredClone(result.package);
  old.schemaVersion = '2.0.0';
  assert.ok(codes(old).includes('UNKNOWN_SOLUTION'), 'a 2.0.0 változatlan');
});
