// CL-27: francia nyelv és francia élet (T27, PRESIDENT 2026-11-15).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { frenchLifeBlock, isHungarian } from '../lib/t27.mjs';
import { blockStrings } from '../lib/extract.mjs';

const block = (pages, title = 'Au comptoir') => ({ id: 'w09-u-1-1', title, pages });
const page = (extra = {}) => ({ id: 'w09-u-1-1-p01', title: 'Une commande', content: [], items: [], ...extra });
const run = (b, opts = {}) => frenchLifeBlock(b, { strings: blockStrings(b), ...opts });
const errors = list => list.filter(entry => entry.severity === 'error');

test('nyelvfelismerés: magyar és francia címek, utasítások', () => {
  for (const hu of ['Péntek reggel, egy lista', 'Mennyit?', 'Vegyes ismétlés', 'A pultnál', 'Kávézó, 10 h 30', 'Írd le franciául: *Je voudrais un café.*', 'Válaszd ki a hiányzó névelőt.']) assert.equal(isHungarian(hu), true, hu);
  for (const fr of ['Le bon pronom', 'Le registre', 'Identifiez le mot ou le groupe repris par le pronom.', 'Complétez la phrase (névelővel).', 'Au comptoir : choisir le déterminant', 'Dessus ou dessous ?']) assert.equal(isHungarian(fr), false, fr);
});

test('magyar cím, utasítás, helyzet → hiba; lesson/note → nincs; példa → figyelmeztetés', () => {
  const b = block([page({
    title: 'Mielőtt elküldi',
    instruction: 'Válaszd ki a hiányzó alakot.',
    content: [
      { type: 'text', role: 'situation', language: 'hu', text: 'Camille épp belép a kávézóba, előtte egy vendég rendel.' },
      { type: 'text', role: 'lesson', language: 'hu', text: 'A partitív névelő a meg nem számolt mennyiséget jelöli.' },
      { type: 'list', role: 'example', language: 'hu', entries: ['Két croissant-t kérek, és egy kávét.'] }
    ]
  })]);
  const found = run(b);
  assert.equal(errors(found).length, 3);
  assert.ok(found.some(entry => entry.severity === 'warning' && /example/u.test(entry.message)));
  assert.ok(!found.some(entry => /lesson/u.test(entry.message)));
});

test('egyenes aposztróf betűk között → hiba, a tipográfiai nem', () => {
  assert.equal(errors(run(block([page({ instruction: "Complétez avec l'article." })]))).length, 1);
  assert.equal(errors(run(block([page({ instruction: 'Complétez avec l’article.' })]))).length, 0);
});

test('azonos bejegyzésű lista → hiba (T29)', () => {
  const b = block([page({ content: [{ type: 'list', role: 'example', language: 'fr', entries: ['(Le serveur répond.)', '(Le serveur répond.)', '(Le serveur répond.)'] }] })]);
  assert.match(errors(run(b))[0].message, /azonos/u);
});

test('munkacím a tanulói címben → hiba', () => {
  assert.equal(errors(run(block([], 'VT1 – Szókincs: záróteszt (statikus változat)'))).filter(entry => /Munkacím/u.test(entry.message)).length, 2);
  assert.equal(errors(run(block([], 'Use of French'))).filter(entry => /Munkacím/u.test(entry.message)).length, 1);
  assert.equal(errors(run(block([], 'Test de vocabulaire de la semaine'))).length, 0);
});

test('T27-átmenet: a nyelvi körre váró blokkban figyelmeztetés, az aposztróf továbbra is hiba', () => {
  const b = block([page({ title: 'Vegyes ismétlés', instruction: "Choisissez l'article." })]);
  const found = run(b, { pending: true });
  assert.equal(errors(found).length, 1);
  assert.match(errors(found)[0].message, /aposztróf/u);
  assert.ok(found.some(entry => /T27-átmenet/u.test(entry.message)));
});

test('magyar név → figyelmeztetés (T08), oldalanként egyszer', () => {
  const b = block([page({ instruction: 'Réka entre. Réka commande.', content: [{ type: 'text', role: 'situation', language: 'fr', text: 'Réka arrive au café.' }] })]);
  const names = run(b).filter(entry => /Magyar név/u.test(entry.message));
  assert.equal(names.length, 1);
  assert.equal(names[0].severity, 'warning');
});

test('S25 T30: egybetűs beszélő-címke → figyelmeztetés; teljes szerep nem', () => {
  const b = block([page({ items: [{ id: 'i1', prompt: 'P : Bonjour, qu’est-ce que je vous sers ?\nToi : ……' }, { id: 'i2', prompt: 'La vendeuse : Bonjour, je vous écoute.' }] })]);
  const speakers = run(b).filter(entry => /T30/u.test(entry.message));
  assert.equal(speakers.length, 1);
  assert.equal(speakers[0].severity, 'warning');
  assert.match(speakers[0].location, /i1/u);
});

test('S25 T34: francia tartalom „hu” jelöléssel → figyelmeztetés; „fr” és magyar magyarázat nem', () => {
  const fr = 'Le client entre dans la boulangerie et demande une baguette bien cuite avec deux croissants.';
  const b = block([page({ content: [
    { type: 'text', language: 'hu', text: fr },
    { type: 'text', language: 'fr', text: fr },
    { type: 'text', role: 'lesson', language: 'hu', text: 'A névelő után a főnév neme dönt: le pain, la baguette.' },
  ] })]);
  const tags = run(b).filter(entry => /T34/u.test(entry.message));
  assert.equal(tags.length, 1);
  assert.match(tags[0].location, /text#0/u);
});
