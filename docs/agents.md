# The roles

The role cards are written in Hungarian, the language of the project owner, and run as written. Their source is
[`agents-src/`](../pipeline/editorial/p4-planning/ceo/agents-src/); `node build-agents.mjs` compiles them, together with
the shared base and the block list, into Codex agent files (`pipeline/.codex/agents/*.toml`) and a Claude agent file
for the solver (`pipeline/.claude/agents/plusdeca-solver.md`). A test checks that the compiled files are in sync.

Every role runs as a **fresh headless session** (`codex exec` or `claude -p --agent …`) in an empty temporary folder,
read-only, with no shell or file-writing tools; reviewers may use web search to verify facts. The orchestrator passes
all inputs in the prompt and parses a machine summary at the end of each answer. No session sees another session's
conversation.

## Shared base (`KOZOS.md`, `ELLENOR-KOZOS.md`, `ELLENORZOLISTA.md`)

- The course: one adult learner, B1+ → C1, 40 themed weeks planned; a week is a 5 × 4 grid of blocks (grammar,
  reading/Use of French, vocabulary, varied) plus three tests.
- The chain and the rule that a role works only from what is in its prompt and marks anything missing as missing.
- Output contract: an author ends with `{"status": "DRAFT_FOR_REVIEW"}`; a reviewer ends with
  `{"verdict": "REVIEW_PASS" | "REVISION_REQUIRED", "blocker": n, "major": n, "minor": n}` and lists findings with
  location, problem and fix. Severity definitions are shared, so counts are comparable across reviewers.
- Reviewer checklist, and the rule that reviewers report and do not rewrite.

## Authors

| Role | Card | Produces |
|---|---|---|
| Head director (FR) | `FR.md` | The weekly concept and four briefs for the column directors, from the owner's weekly brief. Reviewed by PE and NavE; the owner approves it. |
| Column directors (GR, RR, VR, XR) | `GR.md`, `RR.md`, `VR.md`, `XR.md` | Per column: the plan, an assignment for each block, the test blueprint, and a compliance report. VR selects the 100 vocabulary items of the week and owns one lexical record per item. |
| Block writers (`g-`, `r-`, `v-`, `x-iro`) | `BLOKKIRO.md` (template) | For one block: the *plan*, then the *manuscript* (every page, item, explanation and example, in learner-facing form). |
| Solution writer | `MEGOLDASIRO.md` | Solves every item first on its own, then writes the key, accepted variants, rejected forms with reasons, feedback and rubrics, and the block as JSON in the gates' schema (`BLOKK_JSON`). |
| Gloss writer (F) | `F.md` | Contextual Hungarian glosses for the French learner text of a finished block (tap-to-see meaning in the app). |

## Reviewers

| Role | Card | Looks at |
|---|---|---|
| PE, professional reviewer | `PE.md` | Professional and editorial quality: authenticity of the French and of the situations, measurement validity, sources. Every PE step is two independent sessions; the union of their findings counts. |
| NavE, requirements reviewer | `NavE.md` | Requirements and structure: does the block do what its assignment, the column plan and the weekly brief require, item by item. |
| NyE, language reviewer | `NyE.md` | French grammar, meaning, collocation, register, and whether the accepted alternatives are really correct. |
| HE, spelling and typography | `HE.md` | French and Hungarian spelling, typography, house style. |
| UE, learner-view reviewer | `UE.md` | Walks the block as the learner: clarity, solvability, load. Also does a final walkthrough of the merged block. |

## Independent solver

`plusdeca-solver` (Claude, `.claude/agents/plusdeca-solver.md`) gets **only the learner worksheet**: no key, no author
notes, no reviews. It answers every item, lists every answer it would accept, and flags items that are ambiguous or give
the answer away. The orchestrator compares its answers with the key. Differences go back to the solution writer, and
the solver runs again on the revision.

## Loop rules (in the orchestrator, not in the prompts)

- A phase passes when every assigned reviewer returns `REVIEW_PASS`. A minor-only pass gets at most one cleanup round.
- PE may require up to 4 revision rounds, other reviewers 2. If a major PE finding on authenticity is still open after
  round 2, the next author assignment is a full rewrite, not a patch.
- If the rounds run out but every open reviewer is improving (fewer blocker + major findings, no blocker, few majors left),
  the orchestrator grants one extra round before asking the owner.
- Large solutions are revised as a list of changes, which the orchestrator merges; a reviewer never sees a partial block.
- When rounds run out, the run stops as `BLOCKED_*` with the open question in the report. The owner answers in a
  decision file, and the run resumes from the same step (finished steps are not called again).
- The block JSON then goes through the deterministic gates (`pipeline/p5/`). Gate findings go back to the solution writer
  for at most 3 fix rounds; then `BLOCKED_P5_GATE`.
