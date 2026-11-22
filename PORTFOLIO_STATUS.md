# Portfolio status — 2026-11-22

Handoff for the portfolio version of Plusdeça. Local repository only: **nothing is committed, pushed or published.**

## Scope chosen and why

**Component:** asynchronous LLM feedback on open written answers. In production this lives in the private
`plusdeca` repo: `webapp/src/ellenorzes.js`, `webapp/server/ellenorzes-prompt.mjs` and `webapp/tools/ellenorzo.mjs`.

Why this component, and not the authoring chain:
- It answers the target question end to end: an LLM produces feedback, code validates it, two checkers cross-check it,
  and the learner corrects and resubmits.
- It is small enough to extract without the course content (which stays private) or the orchestration history.
- It can be measured on a fixed answer set: false accept and false reject, revision rounds, latency, cost.
- The authoring chain (writer → reviewers → independent solver → deterministic gates) is described in
  `docs/architecture.md` but not extracted: it depends on the private course content and on long runs.

## What was done

| Item | Where |
|---|---|
| Separate repository, no history from the private repo | `C:\Users\bansz\projects\plusdeca-feedback-portfolio` |
| Production pipeline code vendored unchanged (hash-checked) | `vendor/`, `vendor/PROVENANCE.md` |
| Demo data written for this repository: 4 tasks, 1 lesson text, 33 labelled answers | `data/` |
| Offline replay vs. live mode, labelled in every output | `lib/checkers.mjs`, `scripts/*.mjs` |
| One recorded live run: 56 `claude -p` calls | `results/2026-11-22-claude/` |
| Metrics: filter, false accept/reject, error detection, quote grounding, agreement, revision rounds, latency, cost | `lib/metrics.mjs`, `report.md` |
| Teacher rating packet, blind + feedback review (unrated) | `teacher-packet/` |
| English README, architecture page, screenshots (1280 px and 390 px) | `README.md`, `docs/` |

The private `plusdeca` repo, its worktrees, the CEO chain, the scheduled checker and the live app were only read,
not changed. No e-mail, notification, push or publication. The live experiment ran from the Claude subscription
(56 calls, $1.53 notional), and no paid API key was used.

## Validation report (actually run, 2026-11-22)

| Check | Command | Result |
|---|---|---|
| Offline tests | `npm test` | 12/12 pass, including: vendored hashes, filter on all 33 answers, merge and fail-safe paths, stale-replay refusal, replay reproduces `metrics.json` exactly, offline demo |
| Live run | `node scripts/eval.mjs --live --out results/2026-11-22-claude` | 56/56 calls returned valid schema output; model `claude-opus-5-5`, CLI 2.1.289 |
| Replay = live | `npm run eval` | identical `metrics.json` (also asserted by a test) |
| Demo | `npm run demo`, `npm run html` | filtered → revise (3/5, 6 errors) → pass (5/5) |
| Secret / personal-data scan | grep for keys, tokens, e-mail, internal service names | nothing found. The vendored comments mention the author's first name and the production architecture (queue, Worker), with no credentials or endpoints |

Main numbers (full table in the README): merged verdicts 25/25 on the non-contested set, injected errors 21/21,
verbatim quotes 60/60, A/B verdict agreement 28/28, median 7.3 s per call, $0.055 notional per checked answer.

## Not proven (state this in interviews too)

- The eval set is at **ceiling**. The answers and labels were written with Claude, the same family as the checker,
  so the numbers show consistent rubric application on clear cases, not accuracy on real learner writing.
- No teacher reference yet. The only human-review statement is: "a domain expert reviews selected parts" of the course.
- No learning effect, no learner study. The course's 40-week plan is a plan: week 1 runs in the app.
- The production pair is Claude + Codex. The repository measured two Claude calls only.
- One run, one model, 4 tasks: no variance across runs or models.

## Open items

1. **Áron:** read the README and the diff; decide the GitHub repo name and visibility. Suggested name:
   `plusdeca-feedback-eval`. Creating the repo and pushing happen only on your explicit request.
2. **Teacher:** fill in `teacher-packet/A-blind-rating.csv`, then `B-feedback-review.csv` (about 1 hour in total).
   After that, add teacher-referenced metrics (small code change, no new model call).
3. **Next experiment (needs your approval):** `eval-set.v2` with real, consented answers of your own from the app,
   plus borderline cases, and a Claude + Codex comparison.
4. A short video was not made; the screenshots cover the walkthrough. A 30–60 s screen recording of
   `npm run demo` plus `docs/demo.html` can be added.

## CV bullets (English)

- Built an evaluated LLM feedback pipeline for open French writing tasks: a deterministic pre-filter, two independent
  LLM checkers with schema-constrained output, a strict merge and a learner revision loop, with offline replay
  of recorded runs (Node.js, Claude CLI).
- Designed a versioned eval set (33 labelled answers, injected errors, prompt-injection case) and measured false
  accept/reject, error detection (21/21), quote grounding, checker agreement, latency (7 s median) and cost
  ($0.05 per answer). Documented a ceiling effect and prepared a blind teacher-rating protocol as the next validation step.
