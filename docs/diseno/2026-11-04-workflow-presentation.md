# Galivelop-workflow: one transaction, start to main (presentation design)

**Date:** 2026-11-04 · **Status:** proposal, pending the person's answers to the open questions (§12) · **Replaces:**
[`2026-11-04-animaciones-workflow.md`](2026-11-04-animaciones-workflow.md) (two separate 8-step animations).
**Prototype:** `/tmp/claude-0/-home-user/643b8278-9143-5c4b-a7e2-db1c23b48944/scratchpad/workflow-presentation.html`
(self-contained, English; screenshots `shot-desktop.png`, `shot-mobile.png`, `shot-record-16x9.png`,
`shot-record-9x16.png` and the test script `test-presentation.js` in the same folder).

Everything below was checked against the real implementation at the commit of branch `ccr-6aa8bbd7-86cgbe`:
`AGENTS.md`, `CLAUDE.md`, `.claude/gw.json`, `.claude/settings.json`, `.claude/gw/scripts/*`, `.githooks/*`,
`.claude/skills/*/SKILL.md`, `.github/workflows/*`, `docs/diagramas/*.svg`, `src/data/proyectos/galivelop-workflow.json`
and `docs/desarrollo.md` «Mensaje». Where the code and a diagram disagree, the code wins and §10 lists the correction.

## 1. Goals and audiences

- **Show the whole transaction, once:** a task enters at the session start and leaves as a published `main` and,
  later, as a new version of the workflow applied to every project. No fragment makes sense alone: the review mark
  of chapter 7 is what the pre-push of chapter 8 checks, and the retro of chapter 6 is what chapter 10 harvests.
- **Show who acts at each step.** The core message of the project (ficha, ADR, `gw-arquitectura.svg`): what needs
  judgement is left to the agent and the person; what can be checked is a script or a hook, and the agent cannot talk
  its way past it. Every line of the presentation carries one of four actors: **agent** (blue `#38b6e8`), **script or
  hook** (green `#4cc38a`), **person** (amber `#f2b34a`), **CI** (`#a9b8d4`, a lighter tint of the muted `#8a9bb0` so
  it reads on the dark panel); a rejection is red `#f0716a`.
- **Audiences, in order:** (1) a developer who wonders whether to adopt the workflow in their own repo (needs the
  exact gates and the exact commands), (2) a collaborator or client reading the Galivelop portal on a phone (needs the
  story and the actors, can skip the commands), (3) a viewer of a 1–3 min video on social channels (needs the rail,
  the actors and the rejection scene, nothing else). The same data serves the three: the lines are the detail, the
  narration is the story, the rail is the video.
- **Brand message** (`docs/desarrollo.md` «Mensaje», ADR 0001–0003): the workshop shows how it works and invites
  collaboration; no prices, no selling; the workflow is public and offered as implantation by Álvaro. The presentation
  therefore explains, with real paths, and never claims results it has not measured: the only figures are the pilot
  (157 calls, 191k average context, 70 % of the spend; `galivelop-workflow.json` «decisiones»/«aprendizajes»), the
  1776 tests and 26 skills (`cifras`, `gw-arquitectura.svg`), and the ~30 tool-call cap (`subagent-cap.py`).

## 2. Chosen format and why

**One continuous timeline of 10 chapters and 24 steps, with the deep dives inside the timeline**, instead of two
animations.

| | Two animations (previous design) | One timeline with chapters (this design) |
|---|---|---|
| Completeness | A1 stopped at the push; A2 started at the review. The link between them (the mark, `is-code.sh`, the remote tip's policy) was in neither. | Chapters 7 → 8 → 9 show the mark being written, checked and deployed in sequence. |
| Precision | 8 steps each forced one scene per hook; the pre-push had to be "five gates". | The pre-push is three steps of its own (what every push passes, what only `main` passes, the rejection) with the real order of `.githooks/pre-push`. |
| Phone | Two viewBoxes per step (desktop and mobile). | One DOM composition that reflows: the rail folds into two rows under 640 px, the lines stack. |
| Video | Two clips, each needing its own intro. | One recording; the chapter rail is the progress bar on screen. Chapter 8 alone also works as a 40 s clip (§7). |
| Maintenance | Scenes drawn by hand in SVG; a renamed script meant redrawing. | Steps are data (`chapters[].steps[].lines[]`); a renamed script is one string, and the weekly `DIAGRAMAS` grep of `gw-portal` can cover it. |

**Deep dives are not separate pages:** each chapter's steps *are* its deep dive (chapter 8 has 3 steps on the
pre-push, chapter 2 has 3 on dealing), and the chapter buttons and the rail jump straight to them. A reader who wants
only the story reads the narration line of each step; a reader who wants the mechanism reads the lines. That removes the
previous "support frames" (`subagentes`, `pre-push`) and their duplication.

**Not a scroll-driven or looping animation:** the content is read, not watched; a stepper with autoplay is what both a
phone and a screen recorder need. Honours `prefers-reduced-motion`: every step is shown whole, nothing autoplays.

## 3. The transaction: chapters and steps

Actors: **A** agent (judgement), **S** script or hook (enforced), **P** person (confirms), **CI**. Each step below is
one screen: the title, the actor chip, 2–6 lines that appear one by one, the narration and the source path. The lines
are the exact ones in the prototype; the narration is the spoken track for a video.

### Chapter 1 · Task start (3 steps)

| # | Title | Who | What moves | Source |
|---|---|---|---|---|
| 1 | The session opens: a hook runs first | S | `SessionStart` (startup, resume, clear) → `session-start.sh`: `git config core.hooksPath .githooks`; in the cloud `npm ci` and the setup in the background (900 s watchdog); warns on a workflow version mismatch or a wrong folder; fails open. After `/clear` or a compaction it runs `recover.py --state` instead. | `.claude/settings.json` hooks.SessionStart; `.claude/gw/scripts/session-start.sh` |
| 2 | The agent reads the log, not the conversation | A | `docs/handoff.md` (branch, task, missing, next step) → `git fetch origin <branch>` and compare the last commit → `npm run check` green → `git fetch origin main && git merge origin/main` (merge, never rebase). | `AGENTS.md` «Al empezar cualquier sesión»; `.claude/gw.json` `log`, `check`, `protectedBranch` |
| 3 | Selector: one line names the skill and the model | A + P | The `gw-selector` table plus the portal rows in `selector.cases` → one line ("Design: `grilling` + `domain-modeling`, large model; light subagents"). The person picks the session model (`/model`); the agent never switches it. `Compaction budget: N` written in the log; `recover.py --state` counts against it. | `.claude/skills/gw-selector/SKILL.md`; `.claude/gw.json` `selector.cases`; `recover.py` |

Narration: *"Nothing depends on the agent remembering to set up git hooks… Every session starts the same way, whoever
ran the previous one: the state lives in files… Judgement, but bounded."*

### Chapter 2 · Plan and deal (3 steps)

| # | Title | Who | What moves | Source |
|---|---|---|---|---|
| 4 | Split the task into chunks a subagent can close | A (+S) | Each chunk: a checkable done criterion, blockers, files. One wave = unblocked chunks; two chunks of one wave never share a file. `subagent-cap.py` (PreToolUse on `Agent`/`Task`) asks before a subagent passes ~30 tool calls. | `gw-orchestrate-dealer/SKILL.md` step 1; `.claude/gw/scripts/subagent-cap.py` |
| 5 | The brief: pointers, not copies | A → subagent; P | Task · Files · Create · Done when · Run before pushing `bash .claude/gw/scripts/check.sh` · Do not · reply ≤ 15 lines (DONE · COMMIT · EVIDENCE · MISSING · QUESTIONS). Branch `agent/<id>-<topic>` in a worktree, `WIP:` at every stable point, never merges into `main`. Ladder sonnet low → sonnet medium → opus medium → opus high; one failure climbs one rung; **two failures at one rung: stop and ask the person**. | `gw-orchestrate-dealer/SKILL.md` template; `gw-selector/SKILL.md` «Subagent ladder» |
| 6 | What returns is reviewed, then merged by a script | A + S | `git fetch && git log -1 --stat`; a reviewer subagent runs a short `/code-review` of the branch against its contract; fixes go back to the subagent that wrote it. `bash .claude/gw/scripts/merge-branch.sh agent/D11-topic "<msg>"` → `--no-ff` merge, runs the check and the related tests, merges `Refs:` trailers, needs a `Next:` line when `commitNext` is set, removes the `agent/*` worktree and branch (never `claude/*`). | `.claude/gw/scripts/merge-branch.sh`; `gw-orchestrate-dealer/SKILL.md` step 3 |

### Chapter 3 · Commit and push (3 steps)

| # | Title | Who | What moves | Source |
|---|---|---|---|---|
| 7 | Every commit passes two hooks | S | `pre-commit`: secrets by filename (`.env`, `*.pem`, `*.key`, `id_rsa`, `.netrc`, `.claude/gw.local.json`) and by content (private keys, `AKIA…`, `gh*_…`, `xox…`, `AIza…`, `sk-ant-…`, `gsk_…`, `glpat-…`, `sk-live…`); `gw-allow-secret` whitelists one line; with `CLAUDECODE=1` nothing staged under `protectedPaths`. `commit-msg`: `handoff.py check --date <today>` on the staged log, `Siguiente:`/`Next:` last line (`commitNext`), `agentSignatures: false` rejects Co-Authored-By Claude, `Claude-Session` and session links; merge and rebase commits skip the format checks. The log goes in the same commit as the work. | `.githooks/pre-commit`; `.githooks/commit-msg`; `handoff.py`; `commit-message.py` |
| 8 | Push at every stable point, never 30–45 min unpushed | A + S | `bash .claude/gw/scripts/check.sh` runs `npm run check` and records the green tree; `check-green.sh` lets the pre-push skip a repeat recorded < 24 h ago on the same tree (never for the protected branch; `GW_CHECK_CACHE=0` disables). `git push -u origin <branch>` in the background; on a network error retry after 2, 4, 8, 16 s. | `AGENTS.md` «Relevos»; `check.sh`; `check-green.sh` |
| 9 | The agent cannot stop with unpushed work | S | `Stop` → `before-stop.py` blocks ending the turn with unpushed commits or uncommitted changes that lack the log update (respects the `gw-push-in-progress.<pid>` marker; not on the protected branch). `PreToolUse` → `config-guard.py` asks before `Edit`/`Write`/`Bash` touch `.claude/settings.json`, `.claude/gw/scripts/` or `.githooks/`; `agent-signatures.py` blocks Claude signatures in GitHub writes and `Bash`. | `.claude/settings.json` hooks.Stop / hooks.PreToolUse; the three scripts |

### Chapter 4 · Session cut and relay (2 steps)

| # | Title | Who | What moves | Source |
|---|---|---|---|---|
| 10 | Compaction at 200k: the hook recovers the state | S | `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000`; `SessionStart` on `compact|clear` → `recover.py --state`: log state (~25 lines), `git status` (15 lines), last 5 commits, worktrees, compactions vs budget, remote branches; `--search "<text>"` for a lost detail. Narration gives the pilot figures. | `.claude/settings.json` env; `recover.py`; ficha «decisiones» |
| 11 | Relay: the next session continues from the log | A + P | Stopping red: `WIP:` commit and what fails in the log. Task closed and pushed: the agent asks the person for a `/clear` in one line, with the reason. The session may end any time (tokens, container, another account); the next one starts at chapter 1 from `docs/handoff.md`. | `AGENTS.md` «Relevos»; `gw-selector/SKILL.md` «Closing a task or PR» |

### Chapter 5 · Phase 1, code review (1 step)

| # | Title | Who | What moves | Source |
|---|---|---|---|---|
| 12 | Review the whole diff against main | A (+S) | `git fetch origin main`; `/code-review --max-findings all` with `REVIEW.md`; serious and medium findings and what the fix breaks are fixed, committed and pushed; minor ones logged as pending and not reviewed again in this PR. `is-code.sh`: paths matching `content` (`^docs/`, `^src/data/.*\.json$`, images, README/GLOSSARY/REVIEW/CLAUDE/AGENTS.md, `.claude/skills/*.md`) are content; `gw.json`, `settings.json`, `.claude/gw/`, `.githooks/` are always code. | `AGENTS.md` «Antes de ir a main» (1); `REVIEW.md`; `is-code.sh`; `.claude/gw.json` `content` |

### Chapter 6 · Phase 2, environment (2 steps; the person decides)

| # | Title | Who | What moves | Source |
|---|---|---|---|---|
| 13 | gw-opt-tokens: measure, propose, the person decides | A + P | `measure.py` → average context × calls, drag per tool, `BY FILE`, `BY SUBAGENT`; proposals ordered by saving with their quality risk; the step ends there: the person approves, rejects or defers; what is approved goes to `.claude/gw/gw-opt-tokens.md`. | `.claude/skills/gw-opt-tokens/SKILL.md` |
| 14 | retro: presented before any push to main | A + P (+S) | Candidates by severity; saved as `docs/records/retro-YYYY-MM-DD-<topic>.md` with a `**Status:**` line (applied / rejected / deferred); general proposals under `## For Galivelop-workflow`. "Merge directly" skips waiting for reviews, never the retro; person absent → `**Status:** pending` and the agent stops before the mark. Portal: `requireRetro: false` → phase 2 only for large code changes; with `true`, `reviewed.sh` refuses a pending retro. | `.claude/skills/retro/SKILL.md` «In a Galivelop-workflow project»; `AGENTS.md` «Reglas del proyecto»; `.claude/gw.json` |

### Chapter 7 · Phase 3, closing and confirmation (2 steps)

| # | Title | Who | What moves | Source |
|---|---|---|---|---|
| 15 | The review mark is a commit | S | `bash .claude/gw/scripts/reviewed.sh` → `docs/records/reviewed.txt` ← HEAD sha; commit "Reviewed: <sha>" ("Revisado:" in Spanish projects); warns about code since the previous mark; with `requireRetro` needs a decided retro; `git push`. | `reviewed.sh`; `docs/records/reviewed.txt` |
| 16 | The person confirms main | P (+A, S) | `main` only with the person's express confirmation, written in the log. Portal: `pushToProtected: direct` → `git push origin HEAD:main`. With `pr`: the `pr` skill writes Summary · Evidence · Merge Danger and `review-before-main.sh` gates create/merge on the mark and a green CI (a `ci-local.py --record` line counts only when CI never started). Exception decided by the person: the weekly task "Proyectos semanal" (Sundays, content only) publishes without asking. | `AGENTS.md` «Ramas y main»; `.claude/gw.json`; `review-before-main.sh`; `docs/runbooks/tarea-semanal.md` «Reglas» |

### Chapter 8 · Pre-push gates (3 steps; the deep dive)

| # | Title | Who | What moves (in the hook's real order) | Source |
|---|---|---|---|---|
| 17 | Part 1: what every push passes | S | Per pushed ref: the commit exists in this clone → `cfg_at` reads `check` and `protectedBranch` from the **pushed commit's** `gw.json` (fails closed) → new commits listed (`git rev-list --not --remotes`) and printed → `scan_leftovers` (conflict markers, `*.rej`, `*.orig`) → `private-check.py` (keys, e-mails, private names; a hit says `git rebase -i`) → `run_checks <sha>`: `npm run check` in a temp worktree (`${TMPDIR}/gw-pre-push-wt-…`, mode 700, `GW_PUSH_PROTECTED` true/false), skipped when `check-green` recorded this tree < 24 h ago (never on `main`). | `.githooks/pre-push` (`cfg_at`, `scan_leftovers`, `run_checks`); `private-check.py`; `check-green.sh` |
| 18 | Part 2: what only main passes | S | `is_protected` (the pushed commit's, the remote tip's or the working tree's config names the branch) → leftovers scanned on all commits gained over the remote tip → policy (`reviewMark`, `content`) read from the **remote tip's** config, so a push cannot bring its own rules → `is-code.sh` on every file changed since the mark → the mark must exist, be a commit, be an ancestor, with no code after it → `prepush-branches.sh` and `related-tests.sh` hook points → `pre-push: all green.` | `.githooks/pre-push` (`is_protected`, policy); `is-code.sh`; `prepush-branches.sh`; `related-tests.sh` |
| 19 | Rejection: exit 1 and the fix in the last line | S → A | `check failed on <sha>: 'npm run check' (full log: …)` / `fix it, commit and push again; reproduce with: npm run check`; or `run /code-review of the diff against origin/main, push the fixes, then mark and push: bash .claude/gw/scripts/reviewed.sh && git push`; every failure ends `(only a WIP: commit may skip this hook: git push --no-verify)`. The agent reads the reason in its push log, fixes, pushes again; nothing left the machine. | `.githooks/pre-push` (`fail`, check and mark messages) |

### Chapter 9 · CI and publication (2 steps)

| # | Title | Who | What moves | Source |
|---|---|---|---|---|
| 20 | CI on every branch but main | CI (+P) | `check.yml` "Check": `push` with `branches-ignore: [main]` and `pull_request`; `ubuntu-latest`, Node 22; `npm ci`, `git config core.hooksPath .githooks`, each `check` command, `npm run build`; on a PR also the base branch's `pre-commit --range BASE..HEAD`. A CI that does not start counts as red; the local check stands in only with the person's confirmation, logged as "checked only locally". | `.github/workflows/check.yml`; `AGENTS.md` «Al cerrar cada bloque o fase»; `ci-local.py` |
| 21 | main is the published web | CI | `pages.yml` "Publicar en GitHub Pages" on push to `main`: `npm ci`, `npm run check`, `npm run build`, `scripts/indexnow.mjs cambios`, upload → `deploy-pages` → IndexNow notice. `check.yml` never runs on `main`. | `.github/workflows/pages.yml` |

### Chapter 10 · Version cycle (3 steps)

| # | Title | Who | What moves | Source |
|---|---|---|---|---|
| 22 | Collect: the retros feed the workflow | A + P | Each project's retro `## For Galivelop-workflow` → `/gw-harvest` (`harvest.py`) → `docs/proposals/*.md` in the workflow repo → the person approves. | `retro/SKILL.md` (general outlet); `gw-versiones.svg` (`harvest.py` lives in the workflow repo: not verified here) |
| 23 | Release a version of the workflow | A + CI | `python3 scripts/version.py --release` in Galivelop-workflow → CHANGELOG, tag `vX.Y.Z`; the workflow's own CI runs its tests on Linux and macOS (1776 tests in the ficha). | `gw-versiones.svg`, `gw-arquitectura.svg`, ficha `cifras` (not verified from this repo's code) |
| 24 | Apply: `/gw-update` in each project, then the loop closes | A + P + S | `ls-remote --tags --refs --sort=-v:refname` → checkout the tag; `apply.py <project> --dry-run`; the person confirms → `--update` replaces workflow-owned files and migrates `schemaVersion`; `*.gw-new` merged block by block, then deleted; `version` in `gw.json` = Y; `doctor.py` with no `FAIL` → commit with `Next:`, push → chapter 3 again. `gw-init` starts a new project at the same version. | `.claude/skills/gw-update/SKILL.md`; `doctor.py`; `.claude/skills/README.md` |

Total: 24 steps. At the prototype's pace (2.6 s + 1.5 s per line) the full run is **200 s at 1×**, 133 s at 1.5×,
100 s at 2×. Per-chapter durations at 1×: 1 → 23 s, 2 → 24 s, 3 → 23 s, 4 → 16 s, 5 → 9 s, 6 → 16 s, 7 → 17 s, 8 → 32 s,
9 → 16 s, 10 → 22 s (`window.gwPresentation.durations()` prints them).

## 4. What moves on screen

- **Rail (top, always visible):** 10 numbered nodes on a line; done chapters filled blue, the current one white with a
  blue ring, the segments behind the cursor lit. One row above 640 px with short labels (Start, Plan, Commit, Relay,
  Review, Environment, Closing, Pre-push, CI, Versions); two rows of five below, with only the current label (labels
  collided on 390 px in the first build). Each node is a button (`role="button"`, `tabindex="0"`, Enter/Space).
- **Stage:** chapter kicker (`Chapter 8/10 · Pre-push gates · step 1 of 3`), title with the actor chip, the lines
  (actor tag + text; `cmd` lines in mono with a `$` prompt, `gate` lines with `→`, `ok` with `✓`, `fail` with `✗` on a
  red tint, `file` with `▤`), then the narration (`aria-live="polite"`) and the source path.
- **Within a step:** lines fade and slide in one by one (500 ms, then every 1.5 s ÷ speed). The only "animation" is
  this reveal and the rail's progress: enough to record, nothing to distract from the text.
- **Rest frame:** with `prefers-reduced-motion: reduce`, transitions are 0 ms, all lines of a step are shown at once
  and nothing autoplays. The same instant render is used when the person jumps while paused.

## 5. Interaction and controls

- Progress slider (one notch per step, `aria-valuetext` = step title), **Prev / Play–Pause / Next**, step counter
  (`17 / 24`), speed (1× → 1.5× → 2×), **Record 16:9 / 9:16 / Exit** (reloads with `?record=`), ten chapter buttons
  (`aria-current` on the active one).
- Keyboard: `Space` play/pause, `←`/`→` step, `1`–`9` and `0` chapter, `Home`/`End`. All controls are native buttons
  or inputs with visible focus (amber outline) and ≥ 42 px targets; the hint line explains the keys.
- Events for an outer page: `gw:beat` (`index`, `chapter`, `duration`) and `gw:end`; API
  `window.gwPresentation.{index,count,chapters,durations(),total(),goTo(i),play(),pause(),setSpeed(s)}`.

## 6. Layout

- **Desktop (≥ 640 px):** one column, max 1040 px; rail in one row; lines in a two-column grid (actor tag 74 px + text).
- **Phone (390 px):** same DOM; the rail folds to 2 × 5; the actor tag stacks above the text; the control row wraps
  (Record on its own line); no horizontal scroll (checked: `scrollWidth == clientWidth` at 390 and 1280 on five steps).
- Smallest text 11.5 px (source line and hint on the phone); body 16 px; titles 1.1–1.25 rem.
- Fonts: Inter from Google Fonts (the only external resource); mono `"DejaVu Sans Mono", ui-monospace, Menlo,
  Consolas` (DejaVu is a system font on Linux and in the recording container; the portal does not load it, see Q7).
- Colours as `:root` tokens; `body` has an explicit gradient background `#06121b → #0e2a42`.

## 7. Recording mode

`?record=16x9` fixes the body at 1280 × 720 (root font 18 px), `?record=9x16` at 1080 × 1920 (root font 26 px): the
controls and the hint disappear, the stage fills the canvas, autoplay starts at step 1 and `gw:end` fires after the
last step. Playwright export, from the scratchpad:

```js
const { chromium } = require('playwright');
(async () => {
  const size = process.argv[2] === '9x16' ? { width: 1080, height: 1920 } : { width: 1280, height: 720 };
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: size, recordVideo: { dir: 'video', size } });
  const page = await ctx.newPage();
  await page.goto('file://' + __dirname + '/workflow-presentation.html?record=' + (process.argv[2] || '16x9'));
  await page.evaluate(() => new Promise((r) => document.addEventListener('gw:end', r)));
  await page.waitForTimeout(1500);
  await ctx.close(); await browser.close();            // video/<id>.webm; ffmpeg -i … out.mp4 for mp4
})();
```

A chapter-only clip (for example the pre-push, 32 s) is the same run with `goTo(16)` before `play()` and a stop on the
`gw:beat` whose `chapter` changes. Timing per chapter is in §3. The record modes were screenshot-tested at both sizes
(`shot-record-16x9.png`, `shot-record-9x16.png`); a full video export was not run in this session (Q8).

## 8. Technical approach for the portal

- **Component** `src/components/PresentacionFlujo.tsx` (name in Spanish like its siblings `Galeria`, `Apartados`):
  the prototype's stepper, with React state instead of the inline script, the rail as inline SVG, the lines as the
  prototype's DOM. No library. Strings come from the ficha through the existing `Texto` (`Record<Idioma, string>`)
  type, so the three languages are a data problem, not a code one.
- **Data** in `src/data/proyectos/galivelop-workflow.json`, new optional field in `src/data/tipos.ts`:

  ```ts
  presentacion?: {
    titulo: Texto; version: string;                      // "Galivelop-workflow v0.5.0"
    capitulos: { id: string; titulo: Texto; corto: Texto;
      pasos: { titulo: Texto; actor: 'agente' | 'script' | 'persona' | 'ci';
               lineas: { quien: Actor; tipo: 'cmd' | 'nota' | 'archivo' | 'ok' | 'fallo' | 'puerta'; texto: Texto }[];
               narracion: Texto; fuente: string }[] }[];
  }
  ```

  `fuente` and the commands inside `cmd` lines are not translated. The `visibleLanguages` check already fails on a
  missing `gl` or `en`, so an untranslated step cannot ship. The weekly `DIAGRAMAS` grep in
  `.claude/skills/gw-portal/proyectos.md` extends to this field (`galivelop-workflow v…`, `[0-9]+ tests`).
- **Placement:** one block on the project page under the header, before the gallery (Q1), rendered only when
  `presentacion` exists. The static build (`scripts/paginas-estaticas.mjs`) renders step 1 as the rest frame, so
  the page is readable without JavaScript and the crawler sees the text.
- **Reduced motion and no-JS:** the step list is in the HTML; JavaScript only adds the reveal and the autoplay.
- **Open Graph / poster:** the current `portada.webp` keeps its role; a poster frame per chapter can be exported from
  the record mode if the social posts want one (Q6).

## 9. Fate of each existing image (`galeria` of the ficha)

| Image | Today | Proposal |
|---|---|---|
| `portada.webp` | Overview map of a task and the version loop | **Keep** as poster and Open Graph image; it is the only one that fits in a card. Its `alt` stays. |
| `arquitectura.webp` | Six layers, judgement vs enforced | **Keep**: the static map of *what* exists; the presentation shows *when* each layer acts. |
| `versiones.webp` | release / apply / harvest loop | **Keep until chapter 10 is published**, then retire: the chapter has the same three steps with the person's approval in the right places. |
| `sesion.webp` | SessionStart, log, compaction, relay | **Retire**: chapters 1 and 4 cover it and fix its omission of `commit-msg` and the Stop hook. |
| `fases.webp` | Three phases, person confirms | **Retire**: chapters 5–7, with `requireRetro` and the weekly exception. |
| `pre-push.webp` | Gate diagram | **Retire**: chapter 8 is the hook's real order, in three screens. |
| `subagentes.webp` | Brief, ladder, limits | **Retire**: chapter 2; also fixes "≤ ~35 tool calls" (the cap is ~30). |

Retiring an image is content (`content` regexes) but the ficha's `galeria` change and the `docs/diagramas/*.svg`
removal should go in the same commit as the component, after the person confirms (Q5). Until then the seven stay.

## 10. Corrections against the previous design and the diagrams

1. **Pre-push order and count.** The previous design said "eight checks, five gates" and `gw-pre-push.svg` draws
   refs → commit → config → leftovers → check → protected? → code? → mark. The hook also runs `private-check.py`
   before the check, reads `check`/`protectedBranch` from the **pushed commit** but the protected policy from the
   **remote tip**, applies the `check-green` cache (never on the protected branch), scans leftovers on all gained
   commits for `main`, and has `prepush-branches.sh` / `related-tests.sh` hook points. Every failure message ends with
   the fix command and the `WIP:` escape; neither was in the old A2.
2. **Commit time has two hooks.** `gw-sesion.svg` names only `pre-commit`; `commit-msg` checks the log date, the
   `Next:` line and the agent signatures.
3. **Three Claude Code hooks were missing:** `before-stop.py` (Stop), `config-guard.py` and `agent-signatures.py`
   (PreToolUse), plus `subagent-cap.py`. They are the clearest "the agent cannot" moments and now have a step (9) and a
   line (4).
4. **CI is not "Linux + macOS" for a project.** `check.yml` runs on `ubuntu-latest` only, on pushes outside `main`
   and on PRs; on `main` the portal runs `pages.yml` (check, build, deploy, IndexNow). The old A2 step 8 ("CI Linux ✓,
   CI macOS ✓") describes the workflow repo's own CI (`gw-arquitectura.svg`), so it moved to chapter 10.
5. **Phase 2 is optional in the portal** (`requireRetro: false`, `AGENTS.md` «Reglas del proyecto») but enforced by
   `reviewed.sh` where it is `true`; the old design showed it as always run.
6. **Publication is direct and, weekly, unconfirmed.** `pushToProtected: direct`; the task "Proyectos semanal" pushes
   content to `main` without confirmation (`docs/runbooks/tarea-semanal.md`). The old design had only "person
   confirms"; the PR variant is a configuration, not the portal's path.
7. **Subagent cap:** `gw-subagentes.svg` says "≤ ~35 tool calls"; `subagent-cap.py` defaults to 30 and the brief
   template says "at ~25 tool calls, commit". The step uses ~30 and cites the script.
8. **Pilot figures** were repeated from memory in the old design; they are in the ficha («decisiones», «aprendizajes»)
   and in `docs/investigacion/presentacion-de-flujos.md`, and the step cites the ficha.
9. **Legacy paths:** `config.py` still defaults `log` to `docs/traspaso.md` and `reviewMark` to
   `docs/registros/revisado.txt`; the portal uses `docs/handoff.md` and `docs/records/reviewed.txt` (both exist). The
   presentation shows the portal's paths; `gw-sesion.svg` shows neither name.
10. **Fonts:** the old design used `ui-monospace`; the brief asks for Inter + DejaVu Sans Mono. The prototype loads
    Inter and names DejaVu first in the mono stack (Q7 decides whether the portal ships the font).
11. **Mobile composition:** the old design needed a second SVG per step (viewBox 340 × 420). One DOM composition
    reflows instead; the only mobile-specific rule is the rail folding to two rows.

Numbers that matched and were kept: 26 skills (11 own + 15 by Matt Pocock, ficha `cifras` and `gw-arquitectura.svg`),
1776 tests, 200k compaction window, ladder of four rungs.

## 11. Risks

- **Drift:** a renamed script or a changed hook makes a line false. Mitigation: lines are data, the weekly grep covers
  the version string, and a line's `fuente` tells the reviewer what to re-read; a test in `src/data/*.test.ts` can
  assert that every `fuente` path exists in the repo (for the portal's own files) at build time.
- **Length:** 200 s at 1× is long for social channels. The chapter clip (32 s for the pre-push, 24 s for dealing) is
  the social cut; the full run is for the project page.
- **Text density on a phone:** steps 7, 17 and 18 have six lines. They are readable at 390 px (screenshot) but the
  person may prefer splitting 17 into two steps (Q4).
- **Unverified chapter 10 details:** `harvest.py` and `version.py --release` live in the workflow repo, not in this
  one; the steps say so in their source line until a subagent reads that repo (Q9).
- **Static build:** rendering the first step without JS needs the component to be SSR-safe; the current pages are
  generated by `scripts/paginas-estaticas.mjs`, which the `pr` skill marks as SEO-sensitive.

## 12. Open questions (numbered; 1–5 and 7 carry over from the previous design's 1, 2, 5, 6, 9 and 4)

1. **Placement:** one block under the header before the gallery, or a tab "How a task runs" next to the sections?
   (Recommended: a block; tabs hide it from the crawler and from the phone.)
2. **Autoplay on the web:** off by default, Play only on the person's tap (recommended), or autoplay when the block
   enters the viewport?
3. **Which existing images retire** (§9), and whether `docs/diagramas/*.svg` go with them or stay as sources.
4. **Six-line steps:** keep 17 and 18 as they are (the hook's real order on one screen each) or split 17 into
   "before the check" and "the check"?
5. **Retire the `diagramas` section of the ficha once the presentation ships** (previous Q10), or keep it for the
   three images that stay?
6. **Poster frames:** export one PNG per chapter from the record mode for the social posts (`gw-media-content-now`),
   or keep `portada.webp` as the only still?
7. **Fonts on the web:** load DejaVu Sans Mono (self-hosted, ~300 KB for one weight) or keep the system mono stack
   and reserve DejaVu for the recorded video, where it is installed?
8. **Video export:** run the Playwright recording now (16:9 and 9:16, ~3.5 min each at 1×, or 100 s at 2×) and keep
   the webm in the scratchpad, or wait for the texts to be approved?
9. **Chapter 10 verification:** have a light subagent read `harvest.py` and `version.py` in the Galivelop-workflow
   repo and confirm the three steps, before translating them?
10. **Languages:** translate the 24 steps to es and gl now (needed by `visibleLanguages` before any commit of the data)
    or publish the English prototype on the portal's page first, behind a feature flag? (Recommended: translate;
    the check does not allow the flag.)
11. **Person as actor:** the amber chip appears on 9 of 24 steps. Is that the right weight, or should the person's
    confirmations (3, 5, 11, 13, 14, 16, 20, 22, 24) be collapsed into fewer, more visible moments?
