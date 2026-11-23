// Minden átírt 1. heti blokk (P3-előkészítés) a kapukon és a v2 fordítón is átmegy.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runBlockGates } from '../lib/gates.mjs';
import { compileWeek } from '../lib/compile.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const p5 = join(here, '..');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const plan = readJson(join(p5, 'weeks', 'week-01.plan.json'));
const planDir = join(p5, 'weeks');
const handoffsDir = resolve(planDir, plan.handoffs);
const rules = readJson(join(p5, 'playable-types.json'));
const schema = readJson(join(p5, 'schema', 'block.schema.json'));
const blocks = plan.blocks.map(ref => readJson(resolve(planDir, ref)));

for (const block of blocks) {
  test(`${block.id}: minden kapu zöld (figyelmeztetés lehet)`, () => {
    const errors = runBlockGates(block, { handoffsDir, rules, schema, t27Pending: (plan.t27Pending ?? []).includes(block.id) }).filter(entry => entry.severity === 'error');
    assert.deepEqual(errors, []);
  });
}

test('az 1. heti terv blokkjai együtt érvényes v2 csomagra fordulnak', () => {
  const result = compileWeek(plan, blocks, { planDir });
  assert.equal(result.status, 'COMPILED', JSON.stringify(result.contract.errors.slice(0, 5)));
  assert.equal(result.package.weeks[0].blocks.length, blocks.length);
});

test('az 1. hét roster-e (23 egység) a presentation-be kerül, a kiadott blokkok v2-ID-jével egyezően', () => {
  const result = compileWeek(plan, blocks, { planDir });
  const roster = result.presentation.roster;
  assert.equal(roster.length, 23);
  const released = new Set(result.package.weeks[0].blocks.map(b => b.id));
  assert.equal(roster.filter(entry => released.has(entry.blockRef)).length, blocks.length);
  assert.equal(roster.filter(entry => entry.kind === 'assessment').length, 3);
});

test('a javításra váró egység (t27Pending) roster-bejegyzése hold-jelet kap, a többi nem (Áron, 11-15)', () => {
  const result = compileWeek({ ...plan, t27Pending: ['w01-u-2-1'] }, blocks, { planDir });
  const roster = result.presentation.roster;
  assert.deepEqual(roster.filter(entry => entry.hold).map(entry => entry.id), ['w01-u-2-1']);
});
