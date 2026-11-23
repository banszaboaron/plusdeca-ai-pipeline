// S23 (T16, PRESIDENT 2026-11-15): koppintásos jelentés — séma, CL-23 kapu, fordítás a presentation.json-ba.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { contextGlossesBlock } from '../lib/glosses.mjs';
import { validateSchema } from '../lib/schema-validate.mjs';
import { compileWeek } from '../lib/compile.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const p5 = join(here, '..');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const schema = readJson(join(p5, 'schema', 'block.schema.json'));
const plan = readJson(join(p5, 'weeks', 'week-01.plan.json'));
const planDir = join(p5, 'weeks');
const blocks = plan.blocks.map(ref => readJson(resolve(planDir, ref)));

// Egy francia szövegű tartalmi elem és egy item az 1. hétből, glosszával.
function sample() {
  const block = structuredClone(blocks.find(b => b.id === 'w01-u-1-2'));
  const page = block.pages.find(p => p.content.some(c => c.type === 'text' && c.language === 'fr'));
  const stimulus = page.content.find(c => c.type === 'text' && c.language === 'fr');
  const word = stimulus.text.match(/[\p{L}’-]{6,}/u)[0];
  stimulus.glosses = [{ surface: word, lemma: word, meaning: 'próba', note: 'rövid megjegyzés' }];
  return { block, page, stimulus, word };
}

test('séma: a glosses mező a tartalmi elemen és az itemen érvényes; hiányos glossza sémahiba', () => {
  const { block, page } = sample();
  const item = block.pages.flatMap(p => p.items)[0];
  item.glosses = [{ surface: 'x', lemma: 'x', meaning: 'x' }];
  assert.deepEqual(validateSchema(schema, block), []);
  page.content.find(c => c.glosses).glosses = [{ surface: 'x', meaning: 'x' }];
  assert.ok(validateSchema(schema, block).length > 0);
});

test('CL-23: a surface betű szerint az elem szövegében; ha nincs, hiba', () => {
  const { block, stimulus } = sample();
  assert.equal(contextGlossesBlock(block).filter(f => f.severity === 'error').length, 0);
  stimulus.glosses.push({ surface: 'nincs-ilyen-szó', lemma: 'x', meaning: 'x' });
  const errors = contextGlossesBlock(block).filter(f => f.severity === 'error');
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /nincs meg betű szerint/u);
});

test('CL-23: a glossza nélküli francia szöveg blokkonként egy összesítő figyelmeztetés', () => {
  const warnings = contextGlossesBlock(blocks.find(b => b.id === 'w01-u-1-2')).filter(f => /koppintásos jelentése/u.test(f.message));
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].severity, 'warning');
});

test('fordítás: a tartalmi és az item-glossza a presentation.json-ba kerül', () => {
  const { block, word } = sample();
  const item = block.pages.flatMap(p => p.items)[0];
  item.glosses = [{ surface: 'x', lemma: 'x', meaning: 'x' }];
  const result = compileWeek(plan, blocks.map(b => (b.id === block.id ? block : b)), { planDir });
  // A T27-körben átvett blokkoknak (U11, U21, U24…) már saját glosszáik vannak; itt csak a mintaszót keressük.
  const pages = Object.values(result.presentation.pages).filter(p => p.glosses?.some(g => g.glosses?.some(x => x.surface === word)));
  assert.equal(pages.length, 1);
  assert.equal(pages[0].glosses[0].glosses[0].surface, word);
  assert.ok(Object.values(result.presentation.items).some(i => i.glosses?.[0]?.surface === 'x'));
});
