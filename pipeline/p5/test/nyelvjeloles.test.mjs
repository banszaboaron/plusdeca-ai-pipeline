// Áron, 11-16 (U11 26. oldal): a „cannelés” végét a JS \b miatt magyar „és”-nek vette a fordító is.
import test from 'node:test';
import assert from 'node:assert/strict';
import { looksHungarian } from '../lib/compile.mjs';

test('looksHungarian: betűtudatos szóhatár', () => {
  assert.equal(looksHungarian('Il vous reste des cannelés ? Et des pâtés ?'), false);
  assert.equal(looksHungarian('Complétez le dialogue avec les éléments donnés.'), false);
  assert.equal(looksHungarian('kenyér és vaj'), true);
  assert.equal(looksHungarian('Ez nem az a kávé.'), true);
});
