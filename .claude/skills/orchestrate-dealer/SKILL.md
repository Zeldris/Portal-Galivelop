---
name: orchestrate-dealer
description: Run the main session as an orchestrator that deals work out to clean-context subagents, so it can work for hours without /clear. Use for any task of more than one step (a plan task, a batch of fixes, a whole phase), when bringing material from another repo, and when the session context passes ~150k tokens.
license: MIT
compatibility: Claude Code or any Agent Skills agent with subagents; git; reads .claude/gw.json
metadata:
  version: "0.1.0"
  source: "Galivelop workshop; generalised from the Tarkor, installer and portal orchestrate-dealer"
---

# orchestrate-dealer

The main session is the **orchestrator**: it holds the plan, the decisions and the thread with the user, and deals each
chunk of work to a subagent that starts with an empty context. Every deal is an automatic `/clear`: the main session
receives a short summary and grows slowly. Reply to the user in the project's `language`.

Config values used below come from `.claude/gw.json`: `check` (list of commands), `log` (handover file),
`protectedBranch`, `language`. Read it once at the start.

## Who does what

| Orchestrator (main session) | Subagent |
|---|---|
| Talk to the user, ask, present | Read code, long docs, logs, screenshots, other repos |
| Split the task and write each brief | Implement, debug, run the tests |
| Decide (design, what to fix, what to log) | Run a batch of manual or end-to-end checks |
| Review what returns: `git log`, `git diff --stat`; the whole diff only when in doubt | Commit and push its work, log update in the same commit |
| `/code-review`, `/opt-tokens`, `/retro`, PR and merge | none |

A read of more than ~200 lines, or a long output, in the main session is a chunk that was not dealt out.

## Steps

1. **Split.** With the `selector` already applied, cut the task into chunks one subagent can close in one go: a fix,
   a module, a screen, a command. Each chunk gets a **done criterion** that can be checked (a green test, a green
   CI job, a pushed commit) and a list of what blocks it. The **frontier** is the chunks nothing pending blocks:
   they go out together (see Rules). Cap a subagent at ~60 tool calls; at the cap it saves its state in `log` and the
   next one resumes from it.
2. **Deal.** One subagent per chunk with the Agent tool, in the foreground when the next chunk depends on it. Model and
   effort follow the `selector` ladder: `sonnet` to implement, `opus` to debug something non-obvious. The brief carries
   **pointers, not copies**: where the material is (the log row, the plan task, a doc, a commit, a file and
   function), never the pasted text. Template:

   ```text
   You work in this repository on branch <branch>. Read {log} (your row, if it has one per branch) and, if you touch code, REVIEW.md and
   AGENTS.md. Follow the project's commit and push rules: commit and push each stable point, log update in the
   same commit.
   Task: <what, in one or two sentences>.
   Done when: <checkable criterion>. Run before pushing: {check}.
   Do not: <what belongs to another chunk or needs a user decision>.
   If you change a function or a field, grep every user of it and adjust them, or list them under MISSING.
   If you touch processes, paths or permissions, write it for every platform the project supports.
   If something needs a user decision, stop and return it as a question. Never merge into {protectedBranch}.
   Write your reply and commit message in {language}. Reply in at most 15 lines:
   DONE: … · COMMIT: <sha> · MISSING: … · QUESTIONS: …
   Add FOUND: (one line per finding) and TOOLS: (failures of the project's scripts, hooks or CI) only if you have any.
   ```

   `{check}`, `{log}`, `{protectedBranch}` and `{language}` are filled from the config before sending. Add a line
   for each project rule a fresh agent could miss.
3. **Review what returns.** Fetch and check the commit (`git fetch`, `git log -1 --stat`) and that the done
   criterion holds. If it does not close, the retry climbs one ladder rung; two failures, stop and tell the user.
   For every subagent branch built in a worktree, **before merging it**, a subagent reviewer runs a short
   `/code-review` of its diff and returns only the findings; nothing merges until they are fixed. The reviewer's
   brief asks it to compare the diff with the **contract**: the doc that describes it and the real callers outside
   the branch (grep on the working branch), not the diff alone. Short per-branch reviews miss cross-branch breaks:
   a script against its backend, a doc against its code, two branches that edit the same rule.
   Log what comes back: `FOUND` and `TOOLS` into `log` (or the records the project keeps for them). `QUESTIONS`
   go to the user as they are, with the answer you recommend.
4. **Continue.** Next chunk. One line to the user per chunk closed; the detail lives in `log`.

## Rules

- **Guard code gets its own review:** every chunk that touches hooks, push/merge guards or the scripts they call
  passes a short `/code-review` by a reviewer subagent as soon as the chunk returns, before the next chunk starts
  (commit it first, as `WIP:` if needed, so nothing is lost if the session ends). The reviewer compares the diff with
  the contract (`AGENTS.md`, `REVIEW.md`, the callers), not the diff alone; its fixes land before moving on.
- **One writing subagent at a time on the same branch.** Two that commit to the same branch collide in the log and in
  shared files. In parallel, only what does not write (searching, reading, measuring).
- **Code fixes of the frontier, in parallel, in isolated worktrees:** each subagent runs with `isolation: "worktree"` in
  the background, commits at every stable point (`WIP:` if still red, so a restart loses nothing), does not touch the
  log or push, and returns its branch. The main session has each one reviewed (step 3), merges them one by one
  (merge, never rebase; `check` after each), writes the log and pushes.
- **Shared records, main session only:** with parallel subagents none touches `log`, the findings register or any other
  shared record; they return their entries under `FOUND` and the main session writes them. Parallel writes conflict
  on merge.
- **What names files of a branch, after merging it:** indexes and docs that link to files created in a worktree are
  written in the main session after that branch is merged; before, the links point at files that do not exist yet.
- **Manual or end-to-end batches run in a `sonnet` subagent, in series:** the main session does not drive the
  tool itself; it deals batches and logs what returns. Batches share the environment, so each leaves it in a state the
  next can resume from and says so under `MISSING`.
- **A subagent never talks to the user:** what it needs from them returns as `QUESTIONS`.
- **Measure:** `/opt-tokens` before each PR compares the average context per call, the compactions and the per-model
  split with the previous session; if they do not fall, the dealing is staying in the main session.
- **Automatic compaction is the net, not the plan:** at task boundaries write the handover in `log` and recommend
  a `/clear` to the user rather than letting the context grow.
