import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { answeredStepDecisions } from '../lib/engine.mjs';

test('answeredStepDecisions: a korábbi lépés döntése bekerül, az aktuálisé és a nem lépésfájl nem', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ceo-dec-'));
  await mkdir(join(dir, 'decisions'));
  await writeFile(join(dir, 'decisions', 'u24-terv-rev1.md'), 'Döntés: A');
  await writeFile(join(dir, 'decisions', 'u24-kezirat.md'), 'aktuális');
  await writeFile(join(dir, 'decisions', 'folytatas.md'), 'külön csatolva');
  await writeFile(join(dir, 'decisions', 'segitseg-1.md'), 'segítség');
  const text = await answeredStepDecisions(dir, ['u24-terv-rev1', 'u24-kezirat'], 'u24-kezirat');
  assert.match(text, /u24-terv-rev1 lépésre/);
  assert.match(text, /Döntés: A/);
  assert.doesNotMatch(text, /aktuális|külön csatolva|segítség/);
  assert.equal(await answeredStepDecisions(join(dir, 'nincs'), [], 'x'), '');
});

test('kész lépés: ha a megbízás csak később hozzáadott szabálysorban tér el, a mentett eredmény marad; más eltérésnél megáll', async () => {
  const { Engine, StepError } = await import('../lib/engine.mjs');
  const { LATER_RULE_LINES } = await import('../lib/p5.mjs');
  const dir = await mkdtemp(join(tmpdir(), 'ceo-rule-'));
  const config = { limits: { maxCalls: 10 }, providers: { fake: { command: process.execPath, args: ['-e', 'process.stdout.write("kész")'] } } };
  const engine = new Engine({ runDir: dir, config, pipeline: 't', log: () => {}, dryRun: false });
  await engine.init();
  const old = 'Megbízás.\nSzabályok:\n- régi szabály\n';
  engine.state.steps.s1 = { status: 'DONE', inputHash: (await import('node:crypto')).createHash('sha256').update(`fake\n\n\n\n${old}`).digest('hex'), summary: null };
  await mkdir(join(dir, 'steps'), { recursive: true });
  await writeFile(join(dir, 'steps', 's1.out.md'), 'mentett');
  const withRules = old.replace('- régi szabály\n', `- régi szabály\n${LATER_RULE_LINES.join('\n')}\n`);
  const r = await engine.step('s1', { role: 'X', provider: 'fake', prompt: withRules });
  assert.equal(r.text, 'mentett');
  assert.equal(r.cached, true);
  await assert.rejects(engine.step('s1', { role: 'X', provider: 'fake', prompt: withRules + '- más változás\n' }), StepError);
});
