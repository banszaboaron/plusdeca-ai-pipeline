#!/usr/bin/env node
// Builds the teacher rating packet from the eval set and a recorded run (replay, no model call):
//   teacher-packet/A-blind-rating.csv     phase A: the teacher rates each answer WITHOUT seeing the model output
//   teacher-packet/B-feedback-review.csv  phase B: the teacher judges each feedback item the pipeline produced
// Answers stopped by the deterministic filter are left out (no model feedback exists for them).
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluate, DEFAULT_RUN } from './eval.mjs';
import { ROOT } from '../lib/pipeline.mjs';

const root = fileURLToPath(ROOT);
const csv = rows => rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n') + '\r\n';
const { rows } = await evaluate({ runDir: join(root, DEFAULT_RUN) });
const checked = rows.filter(r => r.outcome.stage === 'checked');

// Phase A is shuffled deterministically so that revisions do not sit next to their originals.
const order = [...checked].sort((a, b) => (a.entry.id.split('').reverse().join('') < b.entry.id.split('').reverse().join('') ? -1 : 1));
const A = [['answer_id', 'task', 'task_prompt', 'learner_answer', 'teacher_verdict (pass / revise)', 'teacher_score (0-5)', 'errors_the_teacher_would_mark (quote -> fix; ...)', 'comment']];
for (const { entry, task } of order) A.push([entry.id, entry.task, task.item.prompt, entry.text, '', '', '', '']);

const B = [['answer_id', 'learner_answer', 'pipeline_verdict', 'pipeline_score', 'item', 'quote', 'fix', 'explanation (Hungarian)', 'is_real_error (y/n)', 'fix_correct (y/n)', 'explanation_clear (y/n)', 'comment']];
for (const { entry, outcome } of checked) {
  const r = outcome.result;
  if (!r.errors.length) B.push([entry.id, entry.text, r.verdict, r.score, 'summary', '', '', r.summary, '', '', '', '']);
  r.errors.forEach((e, i) => B.push([entry.id, i === 0 ? entry.text : '', r.verdict, r.score, `error ${i + 1}`, e.quote, e.fix, e.problem, '', '', '', '']));
}
writeFileSync(join(root, 'teacher-packet', 'A-blind-rating.csv'), `﻿${csv(A)}`);
writeFileSync(join(root, 'teacher-packet', 'B-feedback-review.csv'), `﻿${csv(B)}`);
console.log(`Phase A: ${A.length - 1} answers. Phase B: ${B.length - 1} feedback rows.`);
