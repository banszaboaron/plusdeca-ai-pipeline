# Architecture

How the parts in this repository fit together, and which parts of the system stay private (the app, the release
tooling, the course content). Role details: [agents.md](agents.md). Code: [pipeline/](../pipeline/) and [feedback-eval/](../feedback-eval/).

## 1. The whole system (private, single learner)

Plusdeça is a self-built French course (B1 → C1) for one adult learner, with an offline-first phone web app.
LLMs are used in two different places:

1. **Authoring:** an orchestrated chain of LLM roles writes and reviews the course content.
2. **Learning:** LLM checkers give feedback on the learner's open answers.

Both places follow the same rule: *an LLM output is a proposal; deterministic checks and independent reviewers decide whether it is used.*

```mermaid
flowchart LR
  subgraph A["Authoring (offline, per block)"]
    W[Block writer<br/>plan + manuscript] --> R[Reviewers<br/>4 review lenses +<br/>learner walkthrough]
    R -- findings --> W
    R --> S[Solution writer<br/>separate author]
    S --> I[Independent solver<br/>no answer key]
    I -- problems --> W
  end
  subgraph G["Deterministic release gates"]
    P5[Schema, review-binding hashes,<br/>playability, answer-key checks,<br/>brief compliance] --> C[Compile to course package]
    C --> X[Crawl the real app<br/>390 px / 1280 px, offline]
  end
  subgraph L["Learning (phone app)"]
    APP[Offline web app<br/>exact keys checked locally] -->|open answers| Q[Queue]
    Q --> F[Feedback pipeline<br/>this repository]
    F --> APP
  end
  I --> P5
  X -->|RELEASED| APP
```

| Part | What it does | Evidence it works | Not shown by that evidence |
|---|---|---|---|
| Authoring chain ([pipeline/](../pipeline/)) | Headless role sessions (`codex exec`, `claude -p`). Each role gets a fresh session. Bounded fix rounds. A block is complete only when every assigned reviewer passes it and the independent solver's problems are resolved. | The first week (23 blocks) went through it and runs in the app; [run statistics](week1-run-stats.md); [one unit end to end](../pipeline/examples/w01-u-2-1/); 119 orchestrator tests. | Content quality beyond what the reviewers and the solver check. Weeks 2–40 are planned, not produced. |
| Release gates ([pipeline/p5/](../pipeline/p5/)) | Deterministic checks on every block: content hashes bind the release to the reviewed manuscript, then playability, answer-key, brief and target-language checks. Then compilation and a crawl of the real app (crawl not included). | 69 gate tests here; the gates re-run on the real example. | Pedagogical value. |
| Phone app | Offline PWA. Closed answers are checked locally against keys, open answers are queued for feedback. | In use by the learner on a phone. A domain expert reviews selected parts. | Learning outcomes (no study). |
| Feedback pipeline ([feedback-eval/](../feedback-eval/)) | See below. | [Recorded run and eval set](../feedback-eval/results/2026-11-22-claude/report.md). | See [its limitations](../feedback-eval/README.md#limitations--what-is-not-claimed). |

## 2. The authoring chain

See the diagram in the [README](../README.md#the-idea-in-one-diagram), the [roles](agents.md) and the
[U21 walkthrough](../pipeline/examples/w01-u-2-1/). The orchestrator is plain Node.js: it starts each role as a CLI
process, saves every prompt and answer to the run folder, parses the verdict line, and decides the next step in code.
A stopped run can be resumed: steps are keyed by a hash of their inputs, and a finished step with unchanged inputs is not called again.

## 3. The feedback pipeline

```mermaid
sequenceDiagram
  participant L as Learner (app)
  participant F as Deterministic filter
  participant A as Checker A
  participant B as Checker B
  participant M as Validate + merge
  L->>F: answer
  alt empty / noise / copy / wrong language / word count
    F-->>L: rejected instantly, no model call
  else passes
    par same prompt, no shared state
      F->>A: prompt (task data + lesson text + answer)
      F->>B: prompt
    end
    A->>M: JSON {score, errors[quote, problem, fix, category], summary}
    B->>M: JSON
    M->>M: schema check (invalid output is dropped)
    M->>M: stricter score wins, error lists united and de-duplicated
    M-->>L: pass (score ≥ 4/5) or revise, with errors underlined
    L->>F: revised answer (next round)
  end
```

Design decisions, with the reason for each:

- **Filter before the model.** Junk answers cost nothing and get an instant reason. The filter has no
  false-positive budget: an answer that matches the reference is never filtered.
- **The model scores, code decides.** The model returns a 0–5 score. The pass threshold (≥ 4) is applied in code,
  so the policy cannot drift with the prompt.
- **Two independent checkers, stricter wins.** In production these are two different vendors (Claude and Codex),
  both run from flat-rate subscriptions on the learner's machine. If one fails, the other decides alone and the result is
  flagged `single`. If both fail, the answer stays *pending*: there is never a silent pass.
- **Untrusted output.** Model output is validated against the schema like any other input. Error quotes are used to
  underline the learner's text only where they occur verbatim.
- **Learner text is data.** The answer is fenced in delimiters, and the rules say it is not an instruction.
  The eval set contains one injection attempt.
- **Privacy.** Only task data and the answer go to the checker. No name, e-mail or account id is sent.
- **Feedback in L1.** Explanations are in Hungarian (the learner's first language). French forms are quoted.

What the feedback-eval copy changes: both checker slots are filled by two independent Claude calls
(the Codex slot was out of scope). The queue, the Cloudflare Worker and the app UI are not included.
The pipeline logic itself (`vendor/`) is the production code, byte-for-byte.
