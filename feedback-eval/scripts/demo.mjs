#!/usr/bin/env node
// A learner walks through one writing task (T3) in three attempts:
//   1. too short          -> stopped by the deterministic filter, no model call
//   2. six language errors -> both checkers run, stricter result wins: "revise", errors underlined with fixes
//   3. corrected           -> "pass"
//   node scripts/demo.mjs            REPLAY (default): recorded checker outputs, no login, no network
//   node scripts/demo.mjs --live     LIVE: two `claude -p` calls per checked attempt (your Claude Code login)
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { liveClaude, replay } from '../lib/checkers.mjs';
import { checkSubmission, loadEvalSet, loadTasks, ROOT, spansFor } from '../lib/pipeline.mjs';
import { DEFAULT_RUN } from './eval.mjs';

export const STEPS = ['T3-08', 'T3-05', 'T3-05r'];
const tty = process.stdout.isTTY, c = (code, s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
const FILTER_TEXT = { ures: 'empty', masolat: 'copies the task', zaj: 'keyboard noise', 'nem-francia': 'not French', keves: 'too few words', sok: 'too many words', hosszu: 'too long' };

export function underline(text, errors) {
  let out = '', at = 0;
  for (const s of spansFor(text, errors)) { out += text.slice(at, s.start) + c('4;31', `${text.slice(s.start, s.end)}`) + c('31', `[${s.index + 1}]`); at = s.end; }
  return out + text.slice(at);
}

export async function runDemo({ live = false, print = console.log } = {}) {
  const { tasks } = loadTasks(), byId = new Map(loadEvalSet().map(e => [e.id, e]));
  const task = tasks.get('T3');
  const runDir = join(fileURLToPath(ROOT), DEFAULT_RUN);
  const checkers = live ? [liveClaude(), liveClaude()] : [replay(runDir), replay(runDir)];
  print(c('1', live ? 'MODE: LIVE — two independent `claude -p` calls per checked attempt.' : `MODE: REPLAY — recorded outputs (${DEFAULT_RUN}); no model is called.`));
  print(`\n${c('1', 'Task')}: ${task.item.prompt}\n`);
  const outcomes = [];
  for (const [i, id] of STEPS.entries()) {
    const entry = byId.get(id);
    print(c('1', `— Attempt ${i + 1} —`));
    const outcome = await checkSubmission({ task, text: entry.text, checkers, entryId: id });
    outcomes.push({ id, entry, outcome });
    if (outcome.stage === 'filtered') {
      const p = outcome.filter.problems[0];
      print(entry.text);
      print(c('33', `Filter: ${FILTER_TEXT[p.code] ?? p.code}${p.min ? ` (${outcome.filter.wordCount} words, needs ${p.min}–${p.max})` : ''}. Not sent to a model; the learner edits and resubmits.\n`));
      continue;
    }
    if (outcome.stage !== 'checked') { print(c('33', 'Pending: no checker produced a valid result; the submission stays queued.\n')); continue; }
    const r = outcome.result;
    print(underline(entry.text, r.errors));
    print(`Checker scores: ${outcome.calls.map((call, k) => `${'AB'[k]}=${call.ok ? call.result.score : 'invalid'}`).join(', ')} → merged ${r.score}/5 (threshold ${r.minimumScore}) → ${r.verdict === 'pass' ? c('32', 'PASS') : c('31', 'REVISE')}`);
    r.errors.forEach((e, k) => print(`  [${k + 1}] “${e.quote}” → “${e.fix}”  (${e.category}) ${e.problem}`));
    print(`  Summary: ${r.summary}\n`);
  }
  return outcomes;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await runDemo({ live: process.argv.includes('--live') });
