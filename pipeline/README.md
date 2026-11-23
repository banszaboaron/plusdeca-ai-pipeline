# Authoring pipeline: orchestrator, roles and deterministic gates

This folder is a copy of the course-production code of the private Plusdeça repository (main at `64c3a47`,
2026-11-22), with the private integrations and the course content removed. The private folder layout is kept, so the
code's relative paths still resolve: the orchestrator is in `editorial/p4-planning/ceo/`, the gates in `p5/`.

## Run (offline)

```bash
npm install --prefix editorial/p4-planning/ceo    # smol-toml, used by the agent-file tests
node run-tests.mjs                                 # 119 + 69 + 4 tests, no model call, no key

# The weekly chain as a dry run: builds every prompt and the exact CLI command of each step, calls no model.
cd editorial/p4-planning/ceo
node ceo.mjs run het --dry-run --het 1 --brief editorial/p4-planning/ceo/test/fixtures/het-brief.md --run-dir ../../../runs/dry
node ceo.mjs agents                                # the 17 compiled role agents
node build-agents.mjs --check                      # role cards ↔ compiled agent files in sync

# Gates on the real example unit
cd ../../../p5
node gates.mjs ../examples/w01-u-2-1/2-french-life-round/output/block.w01-u-2-1.json \
               --handoffs ../examples/w01-u-2-1/2-french-life-round/output
```

A real run (`node ceo.mjs run javitas --egyseg U21`, `run het …`) needs logged-in `codex` and `claude` CLIs
(`node ceo.mjs doctor`) and the private course references; it is not expected to work from this copy.

## How the orchestrator works

| File | Role |
|---|---|
| `ceo.mjs` | CLI: `doctor`, `run <chain>`, `status`, `report`, `agents` |
| `lib/engine.mjs` | Runs one step: builds the prompt, starts a fresh CLI session in an empty temp folder, saves prompt, output and stderr, parses the machine summary, enforces call limits, waits on rate limits, and resumes a stopped run by input hash (finished steps are never called again) |
| `lib/providers.mjs`, `lib/process.mjs`, `lib/agents.mjs` | Command lines for `codex exec` and `claude -p` (agent mode, no write tools), process handling, how the role card reaches the model |
| `lib/week.mjs` | The weekly chain (`run het`): FR → owner approval → column directors → per block plan, manuscript, solution, merge → gates. Independent blocks proceed while one waits for a decision |
| `lib/javitas.mjs` | Revision mode (`run javitas`): rebuilds one existing unit through the same phases. Week 1 was produced this way |
| `lib/verdict.mjs`, `lib/packets.mjs` | Parsing verdicts and findings; what each role may see (author notes stripped for the solver, learner view only) |
| `lib/csak-valtozas.mjs` | Large solutions are revised as change lists and merged by code; a reviewer never gets a partial block |
| `lib/p5.mjs` | The gate hook: extracts `BLOKK_JSON`, runs the gates, sends findings back for fix rounds |
| `lib/agent-defs.mjs`, `build-agents.mjs`, `agents-src/`, `assignments/` | Role cards and prompt templates, compiled into `../../../.codex/agents/` and `../../../.claude/agents/` |
| `lib/usage.mjs`, `lib/problems.mjs`, `lib/report.mjs` | Quota waits, plain-language explanation of a stop, `report.md` |
| `test/fixtures/fake-agent.mjs` | A scripted stand-in for the `codex`/`claude` CLIs used by the tests |

## The gates (`p5/`)

`node p5/gates.mjs <block.json|week.json> --handoffs <manuscript folder>` exits 0 (`GATE_PASS`) or 1 (`GATE_FAIL`).

| Gate | Checks |
|---|---|
| SCHEMA | The block against `schema/block.schema.json` |
| CL-01 | A `review-pass.md` with `REVIEW_PASS` exists; its file hashes and the block's content hash match; every learner string, key and alternative of the block occurs in the reviewed manuscript chain |
| CONTRACT | Run by the orchestrator's gate hook (`ceo/lib/p5.mjs`): the block is compiled and validated against the app's course contract (`vendor/course-contract/`) |
| CL-02 | Static playability: template, capability, response type and key agree |
| CL-04, CL-06 | Answer integrity: fragment answers, duplicate alternatives, open answers with a single accepted form |
| CL-07 | Hidden data: the key expects a number that is not in the task text |
| CL-08 | Brief compliance of writing models: required language, tools, word range, register |
| CL-18 | Internal tokens leaking into learner text |
| CL-23 | Coverage of tap-to-see glosses |
| CL-27 | Target-language rule: French titles, instructions and situations; Hungarian only for explanations; French names |

`lib/compile.mjs` compiles passed blocks into the app's course package; `week-build.mjs` adds a preview, a crawl of the
real app (not included here), a release ledger and rollback.

## Differences from the private version

- **Removed integrations:** e-mail notifications, the private GitHub relay and dashboard, the weekly status survey,
  the bug tracker commands, detached runs, the text-to-speech tools (`lib/notify|relay|iranyitopult|felmeres|hibak-cli|
  eszkoz-jelentes|hatter|hang.mjs`, `tools/hang*.mjs`, `tools/vakproba.mjs`), the tools that depend on
  them or on the app (`tools/glossza-teljes.mjs`, `glossza-utasitas.mjs`, `p5-atvetel.mjs`), and their configuration.
  `ceo.mjs` prints notifications to the console instead; nothing else in its run logic changed.
- **Second course removed:** the private gates also serve a second target language. `p5/` here is the version from
  just before that was added (`cec3828^`), plus the two later French-only fixes (`335c62a`, `300d20b`, applied as
  patches). The orchestrator's course switch and its data were removed.
- **Reference examples:** the solution writer's prompt points at a finished example block. The private version uses
  two unpublished week-1 blocks; this copy uses the published U21 block (`p5/examples/block.w01-u-2-1.json`).
  The recorded runs in `examples/` still name the private files, as they ran.
- **Course content not included:** the week-1 manuscripts, briefs, source lists and media, the pilot quality-run
  inputs, the week plan and released blocks. The tests that read them are skipped by name:
  [PRIVATE_CONTENT_TESTS.md](PRIVATE_CONTENT_TESTS.md) (57 orchestrator tests, 6 gate test files).
- **Paths:** local absolute paths in the example run files are replaced by `<private-repo>`; one comment's media path by `<media-folder>`.
