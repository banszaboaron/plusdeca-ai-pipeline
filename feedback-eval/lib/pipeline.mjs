// One submission through the feedback pipeline:
//   1. deterministic filter (no model call)      -> vendor/ellenorzes.js machineFilter
//   2. prompt built from task data + answer       -> vendor/ellenorzes-prompt.mjs buildPrompt
//   3. two independent checkers, same prompt      -> injected `checkers` (live Claude or recorded replay)
//   4. each output validated against the schema   -> validateCheck (model output is untrusted input)
//   5. merge: the stricter checker wins           -> mergeChecks; verdict = score >= minimumScore
// Steps 1, 2, 4 and 5 are the production code, vendored unchanged; this file only wires them together.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { CHECK_SCHEMA, machineFilter, mergeChecks, minimumScoreOf, spansFor, validateCheck } from '../vendor/ellenorzes.js';
import { buildPrompt, taskOf } from '../vendor/ellenorzes-prompt.mjs';

export { CHECK_SCHEMA, spansFor };
export const ROOT = new URL('..', import.meta.url);
export const sha256 = text => createHash('sha256').update(text).digest('hex');

/** Production names the two slots `claude` and `codex`; here both slots are filled by independent Claude runs. */
export const SLOTS = ['claude', 'codex'];

export function loadTasks(file = new URL('data/tasks.v1.json', ROOT)) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const page = { id: `${data.lesson.id}:p`, title: data.lesson.title, content: [{ type: 'text', text: data.lesson.text }] };
  const tasks = new Map(data.tasks.map(t => [t.id, { ...t, entry: { item: t.item, page, block: { pages: [page] }, pres: t.pres ?? {} } }]));
  return { version: data.version, tasks };
}

export function loadEvalSet(file = new URL('data/eval-set.v1.jsonl', ROOT)) {
  return readFileSync(file, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
}

/** The exact prompt production would send for this task and answer. */
export function promptFor(task, text) {
  return buildPrompt(taskOf(task.entry, minimumScoreOf(task.item)), text);
}

/**
 * checkers: array of two async functions prompt -> { output, meta } (meta: durationMs, costUsd, model …).
 * Returns { stage: 'filtered', filter } | { stage: 'checked', result, calls } | { stage: 'pending', calls }.
 */
export async function checkSubmission({ task, text, checkers, entryId }) {
  const filter = machineFilter(task.item, text, task.pres);
  if (!filter.pass) return { stage: 'filtered', filter };
  const prompt = promptFor(task, text), promptSha = sha256(prompt);
  const calls = await Promise.all(checkers.map(async (checker, i) => {
    const started = Date.now();
    try {
      const { output, meta = {} } = await checker(prompt, { entryId, slot: i, promptSha });
      const checked = validateCheck(output);
      return { slot: i, ok: checked.ok, reason: checked.ok ? null : checked.reason, result: checked.ok ? checked.result : null, output, meta: { wallMs: Date.now() - started, ...meta } };
    } catch (error) {
      return { slot: i, ok: false, reason: `did not run: ${error?.code ?? error?.message ?? error}`, result: null, output: null, meta: { wallMs: Date.now() - started } };
    }
  }));
  const valid = Object.fromEntries(calls.filter(c => c.ok).map(c => [SLOTS[c.slot], c.result]));
  const result = mergeChecks(valid, { minimumScore: minimumScoreOf(task.item) });
  return result ? { stage: 'checked', result, calls, promptSha, filter } : { stage: 'pending', calls, promptSha, filter };
}

/** Single-checker verdict (what you would get without the second checker). */
export function singleVerdict(task, call) {
  if (!call?.ok) return null;
  return mergeChecks({ claude: call.result }, { minimumScore: minimumScoreOf(task.item) });
}
