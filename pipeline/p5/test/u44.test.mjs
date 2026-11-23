// U44 app-igény (11-14): nem pontozott (gyakorló) ABX és önellenőrző tábla (formatív fields + rubric) a fordítóban.
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
// A mesterszintű és a választható utas blokk a csomagot 2.0.3-ra/2.0.4-re emelné; a verzió itt a submission miatt 2.0.1.
const fixtureBlocks = plan.blocks.map(ref => readJson(join(planDir, ref))).filter(block => !['mastery', 'resolved'].includes(block.completion.mode));
const validate = compileCourseContract();
const codes = pkg => validate(pkg).errors?.map(e => e.code) ?? [];

// A w40-u-3-2 ABX-blokkba egy további itemet teszünk; nem kötelező, mert nem pontozott.
// Az önellenőrző tábla saját PAGE-closed oldalra kerül (a fonetikai ABX-oldal csak ABX-et enged).
const withItem = (item, page) => fixtureBlocks.map(block => {
  if (block.id !== 'w40-u-3-2') return block;
  const copy = structuredClone(block);
  const made = item(copy.pages[0].items[0]);
  if (page) copy.pages.push({ ...structuredClone(copy.pages[0]), id: 'w40-u-3-2-p02', template: 'PAGE-closed', variant: 'PV-closed-mixed', items: [made] });
  else copy.pages[0].items.push(made);
  return copy;
});
const compile = blocks => compileWeek(plan, blocks, { planDir });
const itemOf = (result, id) => result.package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).find(i => i.id.endsWith(id));

test('nem pontozott ABX: változtathatatlan első ablak és új teljes ablak (ABX_RECOVERY), formatív értékeléssel', () => {
  const result = compile(withItem(abx => ({ ...structuredClone(abx), id: 'w40-u-3-2-r04', evaluation: { mode: 'exact', scoring: 'not-scored' } })));
  assert.equal(result.status, 'COMPILED', JSON.stringify(result.contract?.errors?.slice(0, 3)));
  const item = itemOf(result, 'r04');
  assert.equal(item.evaluation.policyId, 'formative-only');
  assert.deepEqual(item.solution, { type: 'exact', answers: ['A'] }, 'az ABX kulcsa megmarad');
  assert.deepEqual(item.repetition, { mode: 'none', minIntervening: 0, independentSuccess: true, immutableFirstAttempt: true, recovery: 'new-full-window' });
  assert.deepEqual(codes(result.package), []);
  const broken = structuredClone(result.package);
  delete itemOf({ package: broken }, 'r04').repetition.recovery;
  assert.ok(codes(broken).includes('ABX_RECOVERY'), 'a szerződés a nem pontozott ABX-en is megköveteli');
});

const selfCheck = () => ({
  id: 'w40-u-3-2-f04',
  capability: 'CAP-structured-form',
  variant: 'PV-table-response',
  prompt: 'Remplis le tableau.',
  response: { type: 'fields', fields: [{ id: 'r1', label: 'Lèvres arrondies ?' }, { id: 'r2', label: 'Langue en avant ?' }], bank: [{ id: 'oui', label: 'oui' }, { id: 'non', label: 'non' }] },
  solution: { type: 'rubric', criteria: [{ label: 'Auto-observation', requirements: ['Lèvres arrondies ?', 'Langue en avant ?'] }, { label: 'Honnêteté' }], keyDescription: 'Auto-observation, non notée.' },
  feedback: { correct: 'Toute réponse honnête est acceptée.' },
  evaluation: { mode: 'formative', scoring: 'formative-required' },
});

test('önellenőrző tábla: formatív fields + rubric → kulcs nélküli beküldés (2.0.1), a rubrika szempontjai a megjelenítésben', () => {
  const result = compile(withItem(selfCheck, true));
  assert.equal(result.status, 'COMPILED', JSON.stringify(result.contract?.errors?.slice(0, 3)));
  assert.equal(result.package.schemaVersion, '2.0.1');
  const item = itemOf(result, 'f04');
  assert.deepEqual(item.solution, { type: 'submission' });
  assert.equal(item.evaluation.policyId, 'formative-only');
  assert.deepEqual(result.presentation.items[item.id].rubricCriteria, ['Auto-observation: Lèvres arrondies ? Langue en avant ?', 'Honnêteté']);
  assert.deepEqual(codes(result.package), []);
});

test('pontozott fields + rubric nem lesz beküldés: a pontos kulcs továbbra is kötelező', () => {
  const result = compile(withItem(() => ({ ...selfCheck(), evaluation: { mode: 'semantic', scoring: 'scored' } }), true));
  assert.notEqual(result.status, 'COMPILED');
  assert.notEqual(itemOf(result, 'f04')?.solution?.type, 'submission');
});
