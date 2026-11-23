# Evaluation report — 2026-11-22-claude

Eval set: `eval-set.v1` (33 answers, 4 tasks). Mode of this report: **replay**. Recorded: 2026-11-22T16:46:05.201Z. Models: claude-opus-5-5.

Labels are **construction labels** (each answer was written to be correct, partially correct or wrong, with known injected errors), following the pipeline's own written scoring policy. They are not teacher ratings; see `teacher-packet/`.

## Verdicts (model-checked answers)

Primary set excludes 3 contested answers (pedagogically debatable labels). False accept = expected *revise*, judged *pass*. False reject = expected *pass*, judged *revise*.

| Configuration | Accuracy | False accept | False reject | Accuracy incl. contested |
|---|---|---|---|---|
| checker A alone | 100.0% (25/25) | 0.0% (0/10) | 0.0% (0/15) | 96.4% (27/28) |
| checker B alone | 100.0% (25/25) | 0.0% (0/10) | 0.0% (0/15) | 96.4% (27/28) |
| A+B merged (stricter wins) | 100.0% (25/25) | 0.0% (0/10) | 0.0% (0/15) | 96.4% (27/28) |

## Other measurements

| Measure | Value |
|---|---|
| Deterministic filter: junk stopped before any model call (right reason) | 5/5; valid answers wrongly filtered: 0 |
| Schema-valid checker outputs | 100.0% (56/56) |
| Error quotes found verbatim in the learner text | 100.0% (60/60) |
| Injected language errors reported (merged feedback) | 100.0% (21/21) |
| Injected language errors reported, checker A / B alone | 100.0% (21/21) / 100.0% (21/21) |
| A vs B: same verdict / same score / score within ±1 | 100.0% (28/28) / 89.3% (25/28) / 100.0% (28/28) |
| Latency per call: median / p90 / max | 7.3 s / 10.7 s / 18.0 s |
| Latency per submission (two calls in parallel), median | 7.4 s |
| Notional API-equivalent cost (reported by the CLI; paid from a subscription, not billed per call) | $1.5312 total, $0.0547 per checked submission (56 calls) |
| Tokens (input / cache read / cache write / output) | 112 / 134094 / 113997 / 29600 |

## Revision rounds

| Original | Revision | 1st verdict | 2nd verdict | Rounds to pass |
|---|---|---|---|---|
| T1-06 | T1-06r | revise | pass | 2 |
| T2-03 | T2-03r | revise | pass | 2 |
| T3-04 | T3-04r | revise | pass | 2 |
| T3-05 | T3-05r | revise | pass | 2 |
| T4-04 | T4-04r | revise | pass | 2 |

## Per answer

| Id | Class | Expected | Filter | Score A | Score B | Merged | OK? | Errors reported |
|---|---|---|---|---|---|---|---|---|
| T1-01 | correct | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T1-02 | correct-paraphrase | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T1-03 | partial-minor | pass | pass | 4 | 4 | pass | ✓ | 1 |
| T1-04 | partial-substantive (contested) | revise | pass | 2 | 3 | revise | ✓ | 2 |
| T1-05 | partial-minor (contested) | pass | pass | 4 | 4 | pass | ✓ | 1 |
| T1-06 | wrong-content | revise | pass | 3 | 2 | revise | ✓ | 1 |
| T1-07 | filter | filtered | nem-francia | — | — | filtered | ✓ | — |
| T1-08 | filter | filtered | zaj | — | — | filtered | ✓ | — |
| T1-06r | revision | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T2-01 | correct | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T2-02 | correct-paraphrase | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T2-03 | partial-substantive | revise | pass | 2 | 2 | revise | ✓ | 1 |
| T2-04 | wrong-grammar | revise | pass | 2 | 2 | revise | ✓ | 1 |
| T2-05 | partial-substantive (contested) | revise | pass | 4 | 4 | pass | ✗ | 1 |
| T2-06 | filter | filtered | masolat | — | — | filtered | ✓ | — |
| T2-03r | revision | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T3-01 | correct | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T3-02 | correct-paraphrase | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T3-03 | partial-minor | pass | pass | 4 | 4 | pass | ✓ | 1 |
| T3-04 | partial-substantive | revise | pass | 3 | 3 | revise | ✓ | 2 |
| T3-05 | partial-substantive | revise | pass | 3 | 3 | revise | ✓ | 6 |
| T3-06 | off-topic | revise | pass | 0 | 0 | revise | ✓ | 1 |
| T3-07 | injection | revise | pass | 2 | 2 | revise | ✓ | 7 |
| T3-08 | filter | filtered | keves | — | — | filtered | ✓ | — |
| T3-04r | revision | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T3-05r | revision | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T4-01 | correct | pass | pass | 5 | 5 | pass | ✓ | 0 |
| T4-02 | partial-minor | pass | pass | 4 | 4 | pass | ✓ | 1 |
| T4-03 | partial-substantive | revise | pass | 2 | 2 | revise | ✓ | 1 |
| T4-04 | partial-substantive | revise | pass | 3 | 2 | revise | ✓ | 4 |
| T4-05 | filter | filtered | nem-francia | — | — | filtered | ✓ | — |
| T4-06 | off-topic | revise | pass | 2 | 2 | revise | ✓ | 2 |
| T4-04r | revision | pass | pass | 5 | 5 | pass | ✓ | 0 |

## What this does not show

- Whether the feedback helps a learner improve (no learner study).
- Agreement with a teacher (the teacher packet is prepared, not yet rated).
- Generalisation: 33 answers, 4 tasks, one lesson, one learner profile (Hungarian L1, B1 French).
- Production uses Claude + Codex as the two checkers; this run uses two independent Claude calls.
