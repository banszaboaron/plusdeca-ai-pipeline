// T27 nyelvi kör (PRESIDENT, 2026-11-15): a --t27 mód a review-zott, élesben futó változatból indul, a CL-27 mostani
// jelzéseit adja „tanári kifogásként”, és új almappába ír (a régi kéziratot nem írja felül).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { T27_BRIEF, T27_SUBDIR, UNITS, t27Unit } from '../lib/javitas.mjs';

test('t27Unit: a review-zott kézirat és megoldás a bemenet, a CL-27 jelzések a kifogás, az S8 is benne', async () => {
  const unit = await t27Unit('U11', UNITS.U11);
  assert.match(unit.manuscriptSource, /javitas-2026-10\/U11\/w01-u-1-1\.kezirat\.md/u);
  const manuscript = await unit.manuscript();
  assert.match(manuscript, /review-zott, élesben futó megoldás/u);
  const teacher = await unit.teacher();
  assert.match(teacher, /CL-27 mostani jelzései/u);
  assert.match(teacher, /S8/u);
  assert.match(unit.scope, /^T27 nyelvi kör/u);
  const live = await unit.liveSolution();
  assert.match(live, /élesben futó P5-blokk/u);
  assert.match(live, /^BLOKK_JSON\n\{[\s\S]*"id":"w01-u-1-1"[\s\S]*^BLOKK_JSON_VEGE$/mu);
  assert.equal(T27_SUBDIR, 't27');
  assert.match(T27_BRIEF, /T27-BRIEF\.md$/u);
});

test('t27Unit: egység S-tétel nélkül is működik (U22), a T27-tábla akkor is benne', async () => {
  const teacher = await (await t27Unit('U22', UNITS.U22)).teacher();
  assert.match(teacher, /CL-27 mostani jelzései/u);
  assert.doesNotMatch(teacher, /Az egységre szóló további tétel/u);
});

test('t27Unit: az élő review-pass Felváltja-sora öröklődik (U32), overlay nélkül üres (U22); a review-pass rögzíti', async () => {
  const { reviewRecord } = await import('../lib/week.mjs');
  const u32 = await (await t27Unit('U32', UNITS.U32)).supersedes();
  assert.equal(u32.length, 1);
  assert.match(u32[0], /^Felváltja: w01-u-3-2\.owner-decisions-and-recheck-overlay\.md/);
  assert.deepEqual(await (await t27Unit('U22', UNITS.U22)).supersedes(), []);
  const record = reviewRecord('w01-u-3-2', { kezirat: 'k.md', megoldas: 'm.md', reviews: {}, supersedes: u32 });
  assert.match(record, /REVIEW_PASS\n\nFelváltja: w01-u-3-2\.owner-[^\n]+\n\nKéziratlánc:/);
});
