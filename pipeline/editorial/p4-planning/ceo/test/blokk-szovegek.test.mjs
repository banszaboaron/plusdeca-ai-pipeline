// 2026-11-02: a megoldás ellenőrei a BLOKK_JSON tanulói szövegeit (feedback, rubrikacímkék) külön mellékletben kapják;
// a melléklet nélkül kész ellenőri lépés érvényes marad (U42 HE: a feedbackszövegek csak a JSON-ban álltak).

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Engine } from '../lib/engine.mjs';
import { reviewedStep } from '../lib/week.mjs';
import { blockLearnerTexts } from '../lib/p5.mjs';
import { fakeConfig, silent, tempDirs } from './helpers.mjs';

const BLOCK = {
  id: 'w01-u-9-9', title: 'Titre',
  pages: [{
    id: 'w01-u-9-9-p01', title: 'Page',
    items: [{
      id: 'w01-u-9-9-i01', capability: 'CAP-typed-short', prompt: 'Écris !',
      solution: { type: 'exact', rejected: [{ text: 'faux', reason: 'szerkesztői indok' }] },
      feedback: { targeted: [{ id: 'U99-E01', trigger: 'faux', text: 'Figyelj a névelőre.' }] },
    }],
  }],
};
const SUMMARY = 'GEPI_OSSZEGZES\nstatus: DRAFT_FOR_REVIEW\nGEPI_OSSZEGZES_VEGE\n';
const AUTHOR = `kézirat\n\n${SUMMARY}`;
const WITH_JSON = `kézirat\n\nBLOKK_JSON\n${JSON.stringify(BLOCK, null, 2)}\nBLOKK_JSON_VEGE\n\n${SUMMARY}`;
const PASS = 'GEPI_OSSZEGZES\nverdict: REVIEW_PASS\nblocker: 0\nmajor: 0\nminor: 0\nGEPI_OSSZEGZES_VEGE\n';

function scripted(author) {
  const prompts = {};
  const invoke = async (_provider, { outFile, prompt }) => {
    const id = basename(outFile).replace(/\.out\.md$/, '');
    prompts[id] = prompt;
    return { code: 0, text: id === 'x' ? author : PASS, stdout: '', stderr: '', ms: 1 };
  };
  return { invoke, prompts };
}

async function run(dirs, author) {
  const { invoke, prompts } = scripted(author);
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig({ peRuns: 1 }), pipeline: 'test', log: silent, invoke });
  await engine.init();
  const r = await reviewedStep(engine, {
    id: 'x', author: { role: 'MEGOLDASIRO', provider: 'codex', prompt: '# Megbízás\n' },
    reviewers: [{ name: 'HE', provider: 'codex', scope: 'próba', focus: 'próba' }], requirement: [], maxRounds: 2,
  });
  return { r, prompts };
}

test('blockLearnerTexts: a JSON tanulói szövegei helyjelöléssel, bájtra; azonosító nélkül; JSON nélkül null', async () => {
  const texts = await blockLearnerTexts(WITH_JSON);
  assert.match(texts, /w01-u-9-9-p01 › w01-u-9-9-i01 › feedback\.targeted\[0\]\.text: Figyelj a névelőre\./);
  assert.match(texts, /prompt: Écris !/, 'a nem törő szóköz megmarad');
  assert.match(texts, /reason \[a kapu szerint szerkesztői mező\]: szerkesztői indok/);
  assert.doesNotMatch(texts, /U99-E01/);
  assert.equal(await blockLearnerTexts(AUTHOR), null);
});

test('ellenőri prompt: a BLOKK_JSON tanulói szövegei külön mellékletben, a JSON maga nem', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const { r, prompts } = await run(dirs, WITH_JSON);
  assert.equal(r.rounds, 0);
  assert.match(prompts['x-he'], /A BLOKK_JSON tanulói szövegei[\s\S]*Figyelj a névelőre\./);
  assert.doesNotMatch(prompts['x-he'], /BLOKK_JSON_VEGE/);
});

test('a melléklet nélkül kész ellenőri lépés érvényes marad, nincs újrahívás', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  await run(dirs, AUTHOR);
  // A szerző kimenete utólag BLOKK_JSON-t kap (a JSON nélküli szöveg változatlan): a kész HE-lépés a régi prompttal egyezik.
  await writeFile(join(dirs.runDir, 'steps', 'x.out.md'), WITH_JSON);
  const { prompts } = await run(dirs, WITH_JSON);
  assert.deepEqual(Object.keys(prompts), [], 'sem a szerző, sem a HE nem hívódik újra');
  assert.match(await readFile(join(dirs.runDir, 'steps', 'x-he.prompt.md'), 'utf8'), /^(?![\s\S]*A BLOKK_JSON tanulói szövegei)/);
});
