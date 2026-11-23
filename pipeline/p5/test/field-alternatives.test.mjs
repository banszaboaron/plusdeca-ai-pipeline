// Több mezős exact item alternatívái (11-16, docs/app/MEZONKENTI_ALTERNATIVAK_2026-11-16.md): a fordító a mezőhöz
// kötött alternatívákat a mezőnkénti értékek szorzataként adja az answers-be (U21 A-döntés: „de petits pains”).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileWeek, slotAlternatives } from '../lib/compile.mjs';
import { evaluate } from '../../webapp/src/evaluate.js';

const here = dirname(fileURLToPath(import.meta.url));

test('mezőhöz kötés: „érték (N)”, „id: érték”, „id=érték”', () => {
  assert.deepEqual(slotAlternatives({ f1: "d'", f2: 'des' }, ['de (2)'], ['f1', 'f2']), [{ f1: "d'", f2: 'des' }, { f1: "d'", f2: 'de' }]);
  assert.deepEqual(slotAlternatives({ f1: 'a', f2: 'b' }, ['f2: c', 'f1=x'], ['f1', 'f2']),
    [{ f1: 'a', f2: 'b' }, { f1: 'a', f2: 'c' }, { f1: 'x', f2: 'b' }, { f1: 'x', f2: 'c' }]);
});

test('„a | b” teljes válasz, egymezős itemnél bármely szöveg', () => {
  assert.deepEqual(slotAlternatives({ g1: 'de', g2: 'du' }, ['de | un'], ['g1', 'g2']), [{ g1: 'de', g2: 'du' }, { g1: 'de', g2: 'un' }]);
  assert.deepEqual(slotAlternatives({ s1: 'frais' }, ['sans frais'], ['s1']), [{ s1: 'frais' }, { s1: 'sans frais' }]);
});

test('mezőhöz nem köthető szöveg kimarad, figyelmeztetéssel (nem hiba)', () => {
  const warnings = [];
  assert.deepEqual(slotAlternatives({ f1: 'a', f2: 'b' }, ['des petits pains'], ['f1', 'f2'], { warnings, where: 'x' }), [{ f1: 'a', f2: 'b' }]);
  assert.equal(warnings[0].code, 'FIELD_ALTERNATIVE_UNMAPPED');
});

test('túl sok kombináció: felső határ figyelmeztetéssel', () => {
  const warnings = [];
  const slots = ['a', 'b', 'c', 'd', 'e'];
  const alts = slots.flatMap(id => ['1', '2', '3'].map(v => `${id}: ${v}`));
  const answers = slotAlternatives(Object.fromEntries(slots.map(id => [id, '0'])), alts, slots, { warnings });
  assert.equal(answers.length, 256);
  assert.equal(warnings[0].code, 'FIELD_ALTERNATIVE_LIMIT');
});

test('U21 i03 a fordítás után: a „d’” + „de” is helyes az appban, a „d’” + „du” nem', () => {
  const planDir = join(here, '..', 'weeks');
  const plan = JSON.parse(readFileSync(join(planDir, 'week-01.plan.json'), 'utf8'));
  const blocks = plan.blocks.map(ref => JSON.parse(readFileSync(join(planDir, ref), 'utf8')));
  const result = compileWeek(plan, blocks, { planDir });
  const item = result.package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).find(i => i.id.endsWith('u-2-1:p04:i03'));
  assert.ok(item, 'az U21 i03 benne van a csomagban');
  assert.equal(evaluate(item, { f1: 'd’', f2: 'de' }).status, 'correct');
  assert.equal(evaluate(item, { f1: "d'", f2: 'des' }).status, 'correct');
  assert.notEqual(evaluate(item, { f1: "d'", f2: 'du' }).status, 'correct');
});
