// Elakadások magyarázata (2026-10-28): ugyanaz a szöveg e-mailben és az irányítópulton.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { explainProblem, problemText } from '../lib/problems.mjs';
import { tempDirs } from './helpers.mjs';

test('BLOCKED_EVIDENCE: az ellenőr szövegéből a hiányt leíró rész, teendő és újraindítás', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  await mkdir(join(dirs.runDir, 'steps'), { recursive: true });
  await writeFile(join(dirs.runDir, 'steps', 'u53-terv-nave-recheck1.out.md'), '# NavE\n\nBevezető.\n\n## 4. NEM VIZSGÁLT, hiányzó bemenet\n\nA tanári jelölések 3. oldala hiányzik.\n\nGEPI_OSSZEGZES\nverdict: BLOCKED_EVIDENCE\nGEPI_OSSZEGZES_VEGE\n');
  const e = await explainProblem({ outcome: 'BLOCKED_EVIDENCE', pipeline: 'javitas', runDir: dirs.runDir, checks: { unit: 'U53', step: 'u53-terv-nave-recheck1' }, resumeCommand: 'node ceo.mjs run javitas --egyseg U53' });
  assert.equal(e.title, 'Egy ellenőr nem tudta elvégezni az ellenőrzést');
  assert.match(e.what, /U53 egység/);
  assert.match(e.details[0].text, /tanári jelölések 3\. oldala hiányzik/);
  assert.doesNotMatch(e.details[0].text, /GEPI_OSSZEGZES/);
  assert.match(e.continueHow, /node ceo\.mjs run javitas --egyseg U53/);
});

test('BLOCKED_DECISION_MAX_ROUNDS javítás módban: a nyitott findingok ellenőrönként, a válasz az eszkalációs döntési fájlba', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const e = await explainProblem({
    outcome: 'BLOCKED_DECISION_MAX_ROUNDS', pipeline: 'javitas', runDir: dirs.runDir,
    checks: { unit: 'R11', phase: 'megoldás', step: 'r11-megoldas', escalations: [{ n: 1 }], open: [{ reviewer: 'PE', step: 'r11-megoldas-pe', summary: { verdict: 'REVISION_REQUIRED', major: 1 }, findings: [{ id: 'F1', severity: 'MAJOR', probe: 'valóság', location: 'I03', text: 'A helyzet valószerűtlen.' }] }] },
  });
  assert.equal(e.answerStep, 'r11-eszkalacio2');
  assert.match(e.continueHow, /r11-eszkalacio2\.md/);
  assert.match(e.details[0].label, /szakmai ellenőr \(PE\) — REVISION_REQUIRED \(major: 1\)/);
  assert.match(e.details[0].text, /\[MAJOR, valóság\] I03: A helyzet valószerűtlen\./);
  const text = problemText(e);
  for (const part of ['Mi kell: Döntés kell', 'Mi a gond: R11, megoldás fázis', 'Mi a teendőd:', 'Kérdés: Elfogadod így', '— Részletek —', 'a szakmai ellenőr (PE)']) assert.ok(text.includes(part), part);
  assert.equal(e.owner, true);
});

test('STOPPED_STEP_ERROR: időtúllépésnél nincs teendő, csak újraindítás', async () => {
  const e = await explainProblem({ outcome: 'STOPPED_STEP_ERROR', pipeline: 'javitas', checks: { error: 'r11-p5: időtúllépés (20 perc).' }, resumeCommand: 'X' });
  assert.match(e.what, /időn belül/);
  assert.match(e.todo[0], /Teendőd nincs/);
});

test('BLOCKED_DECISION_MAX_ROUNDS fázisdöntéssel: a válasz a <egység>-<fázis>-dontes fájlba, az ELFOGADVA sor felkínálva', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const open = [{ reviewer: 'SOLVER', step: 'u53-kezirat-solver' }, { reviewer: 'NavE', step: 'u53-kezirat-nave' }];
  for (const decisionFile of [join(dirs.runDir, 'decisions', 'u53-kezirat-dontes.md'), String.raw`C:\run\decisions\u53-kezirat-dontes.md`]) {
    const e = await explainProblem({
      outcome: 'BLOCKED_DECISION_MAX_ROUNDS', pipeline: 'javitas', runDir: dirs.runDir, resumeCommand: 'X',
      checks: { unit: 'U53', phase: 'kézirat', step: 'u53-kezirat', decisionFile, open },
    });
    assert.equal(e.answerStep, 'u53-kezirat-dontes');
    assert.ok(e.todo.some(x => x.includes('„ELFOGADVA: SOLVER, NavE”')), e.todo.join('\n'));
    assert.match(e.continueHow, /u53-kezirat-dontes\.md.*ELFOGADVA.*új kör nélkül lezárul/s);
  }
  const later = await explainProblem({
    outcome: 'BLOCKED_DECISION_MAX_ROUNDS', pipeline: 'javitas', runDir: dirs.runDir,
    checks: { unit: 'U53', phase: 'eszkaláció 1: megoldás', escalations: [{ n: 1 }], decisionFile: join(dirs.runDir, 'decisions', 'u53-megoldas-e1-dontes.md'), open },
  });
  assert.equal(later.answerStep, 'u53-megoldas-e1-dontes');
  const other = await explainProblem({ outcome: 'BLOCKED_DECISION_MAX_ROUNDS', pipeline: 'full', checks: { decisionFile: '/r/decisions/x-dontes.md', open } });
  assert.equal(other.answerStep, 'folytatas', 'csak javítás módban van fázisdöntés');
});
