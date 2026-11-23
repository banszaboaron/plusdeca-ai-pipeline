# Example: one real unit through the chain (U21, week 1)

**U21 — *Du, des, de : forme ou sens ?*** is the second grammar block of week 1 (coordinate 2,1): partitive and
indefinite articles versus *de* after quantities and negation, in a weekend-brunch situation in Lyon. The bakery
"Le Pain Perché" and its Instagram post are invented. Everything here is as the runs produced it: Hungarian
reports, French course text. Only local paths were replaced by `<private-repo>`.

| Folder | Run | Calls | Model time | Wall time | Outcome |
|---|---|---|---|---|---|
| [`1-production/`](1-production/) | 2026-11-01, revision mode (`run javitas --egyseg U21`): the unit rebuilt from its old draft | 55 | 3.0 h | 28 h (paused for evidence) | `COMPLETED`, `GATE_PASS` on that day's gates |
| [`2-french-life-round/`](2-french-life-round/) | 2026-11-15, the same chain after the owner added the French-life rule (CL-27) | 67 | 1.8 h | 15 h | `COMPLETED`, `GATE_PASS` |

Each folder has `report.md` (every step: role, agent, duration, bytes in and out, parsed verdict), `report.json`,
`state.json` (input hashes used for resuming), `steps/*.out.md` (every model answer), `decisions/` (the owner's
answers), and `output/`: the manuscript, the solution, the review record and the block JSON with its gate report.
Prompts are not included: they embed the private course references.

## Run 1, step by step (`1-production/report.md`)

| Phase | Steps | What happened |
|---|---|---|
| Plan | `terv` → UE, NavE → `terv-rev1` → recheck → `terv-rev2` → NavE pass | Both reviewers asked for revisions (4 + 3 majors); two rounds. |
| Manuscript | `kezirat` → PE ×2, NavE → `kezirat-rev1` → PE ×2 pass | The two independent PE sessions each found 3 majors. |
| Solution | `megoldas` → NavE, PE ×2, NyE, UE, HE + **solver** → `rev1` → `rev2` | Six reviewers and the solver. After two rounds NavE still had open majors: the round limit was reached. |
| Escalation | `kezirat-e1` → 5 reviewers pass; `megoldas-e1` → solver, reviewers → `e1-rev1` → pass | A targeted manuscript change and a new solution, reviewed again by everyone concerned. The run also stopped once as `BLOCKED_EVIDENCE` until the evidence a reviewer had asked for was supplied ([`decisions/folytatas.md`](1-production/decisions/folytatas.md)). |
| Gates | `p5-javitas1` → `2` → `3` | After all reviewers passed, the deterministic gates still found 2 schema errors, then 74 places where the block JSON did not match the reviewed text (CL-01), then one app-contract error. Three fix rounds, then `GATE_PASS`. |

Reviewers raised 27 major and 124 minor findings in this run; 14 of 35 review steps asked for a revision.

**What the independent solver found** ([`steps/u21-megoldas-solver.out.md`](1-production/steps/u21-megoldas-solver.out.md)):
answering from the worksheet only, it accepted *…en… trois parts* in an item where the key rejected it. In the next
round the solution writer agreed that the key was wrong and fixed it ([`steps/u21-megoldas-rev1.out.md`](1-production/steps/u21-megoldas-rev1.out.md),
item i05-4). It also flagged that one fill-in field did not say whether *d'* or *de* was expected, that the page title
(*De belles tartes, des petits pains*) nearly gave the answer away, and that *de petits pains* is a borderline but
defensible written form.

## Run 2: a new rule, an owner decision

Two weeks later the owner added CL-27: titles, instructions and situations in French, Hungarian only for explanations.
Against the new gates, the run-1 block fails with 95 errors (the test `pipeline/test/example.test.mjs` checks this).
The same chain re-ran the unit with the new rule. During the solution phase two questions were escalated, and the owner
answered them ([`decisions/u21-eszkalacio1.md`](2-french-life-round/decisions/u21-eszkalacio1.md)):

- *tu* or *vous*: "use one, do not mix" → *vous* to the learner across the week;
- the *de petits pains* question that the run-1 solver had already raised: "accept both" → the key, the rejected list and the
  manuscript's rule were changed accordingly.

The final block passes all gates, including the review binding: a test changes one learner string and checks that
CL-01 then fails.

## What this example does not show

- That the French is right where every reviewer agreed: the reviewers are LLMs. A domain expert reviews selected
  parts of the course, not each unit.
- The version in the app: after run 2 the unit got its tap-to-see glosses and a few small fixes outside the chain.
- Cost in money: the runs used flat-rate subscriptions.
