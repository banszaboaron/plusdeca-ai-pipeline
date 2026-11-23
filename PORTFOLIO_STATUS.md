# Portfolio status — 2026-11-23

Handoff for the public portfolio version of Plusdeça.

## What the repository contains

| Part | Source in the private repo | Changes |
|---|---|---|
| `pipeline/editorial/p4-planning/ceo/` | Orchestrator, role cards, prompt templates, tests (`64c3a47`) | Private integrations removed (e-mail, relay, dashboard, survey, bug tracker, TTS, detached runs); console notifications; reference example switched to U21 |
| `pipeline/.codex/`, `pipeline/.claude/` | Compiled role agents | Unchanged; `build-agents.mjs --check` passes |
| `pipeline/p5/` | Gates, schema, compiler, contract copy, tests | French-only version (`cec3828^` + `335c62a`, `300d20b`); private blocks, weeks, media and frozen handoffs removed |
| `pipeline/examples/w01-u-2-1/` | Two real CEO runs of U21 (`javitas-U21-2026-11-01`, `t27-U21-2026-11-15`) | Step outputs, reports, decisions, outputs; prompts left out (they embed private references); local paths replaced |
| `docs/week1-run-stats.*` | `report.json` of the 40 week-1 runs | Counts only |
| `feedback-eval/` | Writing-feedback component (published 2026-11-22) | Moved into its own folder |

Decisions by Áron: one repository, renamed to cover the whole pipeline; one real week-1 unit may be public;
role cards stay in Hungarian with an English description ([docs/agents.md](docs/agents.md)). Earlier: no third-party
text or audio, no live-app screenshots, the second course and its learner left out, "a domain expert reviews selected parts".

## Validation (actually run, 2026-11-23)

| Check | Result |
|---|---|
| `npm test` (root) | Orchestrator 119/119, gates 69/69, example 4/4, feedback 12/12. 57 orchestrator tests and 6 gate test files that need private content are skipped by name and listed in `pipeline/PRIVATE_CONTENT_TESTS.md` |
| Private baseline | 253/253 orchestrator and 155/156 (1 skipped) gate tests pass in the private repo at `64c3a47` |
| Dry run of the weekly chain | `ceo.mjs run het --dry-run` builds every prompt and CLI command, no model call |
| Gates on U21 | Run 2 output: `GATE_PASS`; run 1 output: `GATE_FAIL` with CL-27 only (rule added later); tampering with one string: CL-01 fails |
| Scan | No keys or tokens; no e-mail address, private domain, relay name or trigger id; no second-course reference; no ClimbAlong or LOGIMA material; media files are generated test tones only |

## Not proven

- LLM reviewers are not a ground truth; reviewer finding counts are as reported, not audited.
- No learning outcome; no teacher rating yet; weeks 2–40 are a plan.
- The orchestrator cannot run a real week from this copy (private references, logged-in CLIs).
- The feedback eval set is at ceiling (see `feedback-eval/`).

## Open items

1. Rename the GitHub repository (suggested `plusdeca-ai-pipeline`; the old URL redirects) and push. Only on request.
2. The teacher packet in `feedback-eval/teacher-packet/` is unrated.
3. Optional: a short screen recording of the dry run and the gates.

## CV bullets (English)

- Designed and built an LLM course-production pipeline in Node.js: an orchestrator that runs 17 role agents
  (directors, writers, five reviewer types, an independent solver without the key) as isolated Codex/Claude CLI
  sessions with bounded revision rounds and human escalation, followed by deterministic release gates (schema,
  content-hash review binding, fidelity, playability, answer-key and language checks). It produced the first course
  week: 23 blocks, 40 runs, 2,163 model calls.
- Built and evaluated an LLM feedback pipeline for open French writing (filter, two schema-bound checkers, strict merge,
  revision loop) on a versioned labelled set, measuring false accept/reject, error detection, quote grounding,
  agreement, latency and cost, and documenting its ceiling effect and the teacher-rating protocol as the next step.
