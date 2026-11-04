# Galivelop-workflow: one transaction, start to main (presentation design)

**Date:** 2026-11-04 · **Status:** prototype v2 (animated scene, three languages, videos exported); Q1–Q5 and Q7–Q11
of the first version are answered below (§12 keeps only what is still open) · **Replaces:**
[`2026-11-04-animaciones-workflow.md`](2026-11-04-animaciones-workflow.md) (two separate 8-step animations).
**Prototype:** `/tmp/claude-0/-home-user/643b8278-9143-5c4b-a7e2-db1c23b48944/scratchpad/workflow-presentation.html`
(self-contained, es/gl/en; in the same folder: `test-presentation.js` and its output `test-results.json`, the
screenshots `shot-*.png`, `record-video.js` and the videos `workflow-16x9.{webm,mp4}` and `workflow-9x16.{webm,mp4}`).

Everything below was checked against the real implementation at the commit of branch `ccr-6aa8bbd7-86cgbe`:
`AGENTS.md`, `CLAUDE.md`, `.claude/gw.json`, `.claude/settings.json`, `.claude/gw/scripts/*`, `.githooks/*`,
`.claude/skills/*/SKILL.md`, `.github/workflows/*`, `docs/diagramas/*.svg`, `src/data/proyectos/galivelop-workflow.json`
and `docs/desarrollo.md` «Mensaje»; chapter 10 against the Galivelop-workflow repo itself (`scripts/harvest.py`,
`scripts/version.py`, `.github/workflows/release.yml` and `check.yml`, the `gw-update` skill, `apply.py`, `doctor.py`).
Where the code and a diagram disagree, the code wins and §10 lists the correction.

## 1. Goals and audiences

- **Show the whole transaction, once:** a task enters at the session start and leaves as a published `main` and,
  later, as a new version of the workflow applied to every project. No fragment makes sense alone: the review mark
  of chapter 7 is what the pre-push of chapter 8 checks, and the retro of chapter 6 is what chapter 10 harvests.
- **Show who acts at each step.** The core message of the project (ficha, ADR, `gw-arquitectura.svg`): what needs
  judgement is left to the agent and the person; what can be checked is a script or a hook, and the agent cannot talk
  its way past it. Every line of the presentation carries one of four actors: **agent** (blue `#38b6e8`), **script or
  hook** (green `#4cc38a`), **person** (amber `#f2b34a`), **CI** (`#a9b8d4`, a lighter tint of the muted `#8a9bb0` so
  it reads on the dark panel); a rejection is red `#f0716a`.
- **Show it moving.** The first prototype was a text slideshow: precise, but useless in a talk or a recorded video. The
  second has a scene (§4) where the transaction itself moves: a token travels the four actor lanes, commits appear on
  the branch, the session is cut and relayed, subagents fan out and merge back, the gates light one by one, a red
  gate sends the token back, the CI chips turn green and the branch merges into `main`. The text is the caption of
  what the scene shows, not the show.
- **Audiences, in order:** (1) a developer who wonders whether to adopt the workflow in their own repo (needs the
  exact gates and the exact commands), (2) a collaborator or client reading the Galivelop portal on a phone (needs the
  story and the actors, can skip the commands), (3) a viewer of a 1–3 min video on social channels (needs the scene,
  the actors and the rejection, nothing else). The same data serves the three: the lines are the detail, the
  narration is the story, the scene with the short captions is the video.
- **Brand message** (`docs/desarrollo.md` «Mensaje», ADR 0001–0003): the workshop shows how it works and invites
  collaboration; no prices, no selling; the workflow is public and offered as implantation by Álvaro. The presentation
  therefore explains, with real paths, and never claims results it has not measured: the only figures are the pilot
  (157 calls, 191k average context, 70 % of the spend; `galivelop-workflow.json` «decisiones»/«aprendizajes»), the
  26 skills (`cifras`, `gw-arquitectura.svg`) and the ~30 tool-call cap (`subagent-cap.py`). The "1776 tests" figure
  is **not** claimed any more (§10.12).

## 2. Chosen format and why

**One continuous timeline of 10 chapters and 27 steps, with an animated scene above the caption**, instead of two
animations or a text stepper.

| | Two animations (previous design) | Text stepper (prototype v1) | Scene + caption (this design) |
|---|---|---|---|
| Completeness | A1 stopped at the push; A2 started at the review. | Whole transaction, 24 steps. | Whole transaction, 27 steps; chapter 10 verified in the workflow repo. |
| What a viewer sees | Two hand-drawn SVG scenes per step. | Lines of text appearing. | The token, the branch, the gates and the CI moving; the text explains what just moved. |
| Phone | Two viewBoxes per step. | One DOM that reflows. | One SVG scene (viewBox 800 × 440) that scales; the caption stacks below it under 960 px. |
| Video | Two clips, each with its own intro. | Readable but static. | One recording per format (16:9 and 9:16), English only, 1–2 short lines per step. |
| Maintenance | A renamed script meant redrawing. | Steps are data. | Scene state and texts are data: `SC[]` (language-independent scene per step) and `T.<lang>` (all visible strings per language). |

**Deep dives are not separate pages:** each chapter's steps *are* its deep dive (chapter 8 has 5 steps on the
pre-push, chapter 2 has 3 on dealing), and the chapter buttons jump straight to them. A reader who wants only the
story reads the narration line of each step; a reader who wants the mechanism reads the lines.

**Not a scroll-driven or looping animation:** a stepper with autoplay is what both a phone and a screen recorder
need. Honours `prefers-reduced-motion`: every step is shown as its final frame, nothing autoplays.

## 3. The transaction: chapters and steps

Actors: **A** agent (judgement), **S** script or hook (enforced), **P** person (confirms), **CI**. Each step is one
screen: the scene state, the title, the actor chip, 3–4 lines that appear one by one (never more than four, §10.13),
the narration and the source path. Durations at 1× on the web: 2.6 s + 1.5 s per line (7.1 s for three lines, 8.6 s
for four); in record mode 3.2 s + 1.6 s per short line.

| # | Ch. | Title | Who | What the scene shows | Source |
|---|---|---|---|---|---|
| 1 | 1 | The session opens; a hook runs first | S | Token on the script lane, far left. | `.claude/settings.json`, `session-start.sh` |
| 2 | 1 | The agent reads the log, not the chat | A | Token on the agent lane with the `handoff.md` icon. | `docs/handoff.md`, `recover.py --state` |
| 3 | 1 | Which skill and which model | A | Token advances. | `gw-selector`, `.claude/gw.json` `selector.cases` |
| 4 | 2 | Split the task into chunks | A | Three subagent branches fan out below the branch. | `gw-orchestrate-dealer`, `subagent-cap.py` |
| 5 | 2 | The brief each subagent gets | A | Each subagent branch gets its commit. | `gw-orchestrate-dealer` (brief, ladder) |
| 6 | 2 | Back into the branch, reviewed | S | The three branches merge back; first commit on `agent/<id>`. | `merge-branch.sh` |
| 7 | 3 | Two hooks on every commit | S | Second commit, both unpushed (hollow). | `pre-commit`, `commit-msg`, `handoff.py` |
| 8 | 3 | Push at every stable point | A | The commits fill (pushed); push arrow. | `check.sh`, `pre-push` (`check-green`) |
| 9 | 3 | The agent cannot stop with unpushed work | S | Lock icon on the agent lane. | `before-stop.py`, `config-guard.py`, `agent-signatures.py` |
| 10 | 4 | Compaction at 200k tokens | S | The session is cut (dashed line); "compaction" tag. | `.claude/settings.json` (compaction), `recover.py` |
| 11 | 4 | Relay: the next session picks up the log | A | Session 2 label; the log icon crosses the cut to the new token. | `docs/handoff.md`, `AGENTS.md` «Relevos» |
| 12 | 5 | Review the whole diff against main | A | Findings badge on the branch; third commit. | `REVIEW.md`, `is-code.sh` |
| 13 | 6 | Measure and propose | A | Proposals card at the agent lane. | `gw-opt-tokens`, `measure.py`, `retro` |
| 14 | 6 | The person decides | **P** | Card travels to the person lane (amber glow), "approved" stamp. | `retro` (`**Status:**`), `requireRetro` |
| 15 | 7 | The review mark is a commit | S | Mark flag on the fourth commit. | `reviewed.sh`, `docs/records/reviewed.txt` |
| 16 | 7 | The person confirms going to main | **P** | Amber glow, "→ main" stamp. | `pushToProtected`, `AGENTS.md` «Ramas y main» |
| 17 | 8 | Pre-push, part 1: what is being pushed | S | Gates 1–4 light (commit exists, `cfg_at`, `rev-list`, `scan_leftovers`). | `.githooks/pre-push` (part 1) |
| 18 | 8 | Pre-push, part 2: the check | S | Gates 5–7 (`private-check.py`, `run_checks`, `check-green`). | `pre-push`, `private-check.py`, `run_checks` |
| 19 | 8 | Rejection: exit 1, and the fix in the last line | S | Gate 6 turns red; red arrow back to the agent ("fix · commit · push"); fix commit and a new mark. | `pre-push` (fail messages) |
| 20 | 8 | What only main passes | S | Gates 8–10 (`is_protected`, policy from the remote tip, `is-code.sh`). | `pre-push`, `is-code.sh` |
| 21 | 8 | The mark must cover the code | S | Gate 11 (mark ancestor); "pre-push: all green". | `pre-push` (mark ancestor) |
| 22 | 9 | CI on every branch but main | CI | `check.yml` chip runs, then green. | `.github/workflows/check.yml` |
| 23 | 9 | main is the published web | CI | `pages.yml` chip green; branch merges into `main`; "published" globe. | `.github/workflows/pages.yml` |
| 24 | 10 | Collect what the projects learned | A | Loop ring: projects → harvest lit. | `gw-harvest`, `harvest.py`, `docs/proposals/` |
| 25 | 10 | The person decides what the workflow adopts | **P** | Workflow node lit, amber glow, "approved" stamp. | `docs/proposals/*.md`, `version.py X.Y.Z`, `CHANGELOG.md` |
| 26 | 10 | Release: a check, a tag, a CI | CI | Release node lit. | `version.py --release`, `release.yml`, `check.yml` |
| 27 | 10 | Each project applies the new version | A | `/gw-update` node lit; arrow back to projects with the `vX.Y.Z` badge. | `gw-update`, `apply.py`, `doctor.py` |

Chapters: 1 Task start (3) · 2 Plan and deal out (3) · 3 Commit and push (3) · 4 Session cut and relay (2) · 5 Phase 1 ·
code (1) · 6 Phase 2 · environment (2) · 7 Phase 3 · closing (2) · 8 Pre-push, gate by gate (5) · 9 CI and publication
(2) · 10 Versions of the workflow (4).

Total: 27 steps, **216 s at 1× on the web** (144 s at 1.5×, 108 s at 2×) and **168 s in record mode** (short captions).
Per chapter at 1× on the web: 1 → 23 s, 2 → 23 s, 3 → 24 s, 4 → 16 s, 5 → 9 s, 6 → 16 s, 7 → 17 s, 8 → 42 s, 9 → 14 s,
10 → 33 s (`window.gwPresentation.durations()` prints them). The person (amber) acts on exactly three steps: 14, 16
and 25.

## 4. What moves on screen

The scene is one inline SVG (viewBox 800 × 440) rebuilt per language, driven by the same step data as the caption
(`SC[i].s`); `applyScene()` toggles classes and transforms, so every state is reachable instantly (jumps, reduced
motion) and animated when played.

- **Four swimlanes** (agent, script, person, CI) with a **token** that moves along the lane of the step's actor; the
  person lane glows amber only on steps 14, 16 and 25.
- **Git picture** under the lanes: the work branch `agent/<id>` with up to six commit slots (hollow = unpushed, filled =
  pushed, flag = review mark, red = the fix of step 19) and `main` below; three **subagent** branches that appear,
  commit and merge back (steps 4–6); the **merge into main** and a "published" globe (step 23).
- **Session cut** (dashed vertical line, "session 1 / session 2") and the **relay**: the `handoff.md` icon crosses the
  cut (steps 10–11); a "compaction" tag on step 10.
- **Review findings** badge (12), **proposals card** travelling from the agent to the person with an "approved" stamp
  (13–14), **lock** icon for the Stop hook (9).
- **Eleven gates** on the script lane, named after the hook's real order (`commit exists`, `cfg_at`, `rev-list`,
  `scan_leftovers`, `private-check.py`, `run_checks`, `check-green`, `is_protected`, `policy`, `is-code.sh`, `mark
  ancestor`), lit one by one with a 300 ms stagger; on step 19 gate 6 turns red and a red arrow returns to the agent
  ("fix · commit · push"), then a fix commit and a new mark appear on the branch; the label reads "pre-push: all green"
  once all eleven are lit.
- **CI chips** `check.yml` and `pages.yml` (run → green after 1.4 s).
- **Chapter 10 ring** replaces the git picture: projects → harvest → workflow → release → `/gw-update` → back to the
  projects with the `vX.Y.Z` badge. On narrow scenes (phone) the ring's sub-labels (`docs/proposals/`, `version.py`…)
  are hidden; they are in the caption's source line.
- **Rest frame:** with `prefers-reduced-motion: reduce`, transitions are 0 ms, each step shows its final scene and all
  its lines at once, and nothing autoplays. The same instant render is used when the person jumps while paused.

## 5. Interaction and controls

- Progress slider (one notch per step, `aria-valuetext` = step title), **Prev / Play–Pause / Next**, step counter
  (`17/27 · 9 s`), speed (1× / 1.5× / 2×), **16:9 / 9:16** record buttons (reload with `?record=`), ten chapter buttons
  (`aria-current` on the active one), language buttons **ES / GL / EN**.
- Keyboard: `Space` play/pause (not when a button has focus), `←`/`→` step, `1`–`9` and `0` chapter, `Home`/`End`;
  ignored inside `select`/`input`. All controls are native buttons or inputs with visible focus and ≥ 42 px targets;
  the hint line explains the keys.
- Language: `?lang=es|gl|en`, else the remembered choice (`localStorage` `gw-lang`, in try/catch), else
  `navigator.language`; `document.documentElement.lang` follows; record mode forces `en`.
- Events for an outer page: `gw:beat` (`index`, `chapter`) and `gw:end`; API
  `window.gwPresentation.{index,count,lang,chapters(),durations(),total(),goTo(i),play(),pause(),setSpeed(s),setLang(l)}`.

## 6. Layout

- **≥ 960 px:** scene 3fr + caption 2fr side by side, max 1240 px; chapter buttons and controls below.
- **Phone (390 px):** scene on top (full width), caption stacked below, chapter buttons wrap, controls wrap; no
  horizontal scroll (checked at 390 and 1280 on ten steps per configuration).
- **Scene text** scales with the scene: `--fs` = clamp(14, 14 px × 800 / scene width, 32) viewBox units, so the
  smallest scene text renders at ≥ 12 px on a 390 px phone (12.0 px measured) and ≥ 12.4 px on desktop; the HTML
  caption's smallest text is 12 px (source line, hint), body 16 px.
- Fonts: Inter from Google Fonts (the only external resource) and the **system mono stack**
  (`ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`); no DejaVu (Q7 answered).
- Colours as `:root` tokens; `body` has an explicit gradient background `#06121b → #0e2a42`.

## 7. Recording mode

`?record=16x9` fixes the page at 1280 × 720 (scene 780 px + caption, `--fs` 21), `?record=9x16` at 1080 × 1920
(scene on top, caption below, `--fs` 30): the controls, the chapter row and the hint disappear, the caption shows
only the title and one or two short lines (`beats[].b`, English), autoplay starts at step 1 and `gw:end` fires after
step 27 (168 s). `record-video.js <16x9|9x16>` in the scratchpad records it with Playwright (`recordVideo` at the
viewport size), waits for `gw:end`, renames the webm and `/usr/bin/ffmpeg` converts it to H.264 mp4:

```
node record-video.js 16x9 && ffmpeg -i workflow-16x9.webm -c:v libx264 -pix_fmt yuv420p -crf 20 workflow-16x9.mp4
```

Both videos were exported in this session (Q8 answered): `workflow-16x9.{webm,mp4}` and `workflow-9x16.{webm,mp4}`
in the scratchpad, English, 1×. A chapter-only clip (the pre-push, 42 s) is the same run with `goTo(16)` before
`play()` and a stop on the `gw:beat` whose `chapter` changes.

## 8. Technical approach for the portal

- **Component** `src/components/PresentacionFlujo.tsx` (name in Spanish like its siblings `Galeria`, `Apartados`):
  the prototype's scene as inline SVG built from the step data, React state instead of the inline script, the caption
  as the prototype's DOM. No library. Strings come from the ficha through the existing `Texto`
  (`Record<Idioma, string>`) type; the prototype's `T.es`, `T.gl` and `T.en` are the three columns of that data
  (Q10 answered: the web ships es/gl/en with the language of the page; the video is English only).
- **Data** in `src/data/proyectos/galivelop-workflow.json`, new optional field in `src/data/tipos.ts`:

  ```ts
  presentacion?: {
    titulo: Texto; version: string;                      // "Galivelop-workflow v0.5.0"
    capitulos: { id: string; titulo: Texto;
      pasos: { titulo: Texto; actor: 'agente' | 'script' | 'persona' | 'ci';
               escena: EstadoEscena;                      // the prototype's SC[i].s, language-independent
               lineas: { quien: Actor; tipo: 'cmd' | 'nota' | 'archivo' | 'ok' | 'fallo' | 'puerta'; texto: Texto }[];
               breve: Texto[];                            // 1–2 short lines for the video
               narracion: Texto; fuente: string }[] }[];
  }
  ```

  `fuente` and the commands inside `cmd` lines are not translated. The `visibleLanguages` check already fails on a
  missing `gl` or `en`. The weekly `DIAGRAMAS` grep in `.claude/skills/gw-portal/proyectos.md` extends to this field
  (`galivelop-workflow v…`).
- **Placement (Q1, Q2 answered):** one block on the project page **under the header, before the gallery**, rendered
  only when `presentacion` exists; autoplay **off**, Play only on the person's tap (the scene shows step 1's rest
  frame until then). The static build (`scripts/paginas-estaticas.mjs`) renders step 1 as the rest frame, so the page
  is readable without JavaScript and the crawler sees the text.
- **The `diagramas` section stays below the presentation** (Q5 answered) for the images that remain (§9).
- **Reduced motion and no-JS:** the step list is in the HTML; JavaScript only adds the scene transitions and the
  autoplay.
- **Open Graph / poster:** the current `portada.webp` keeps its role; a poster frame per chapter can be exported from
  the record mode if the social posts want one (Q6, still open).

## 9. Fate of each existing image (`galeria` of the ficha; Q3 answered)

| Image | Today | Decision |
|---|---|---|
| `portada.webp` | Overview map of a task and the version loop | **Keep** as poster and Open Graph image. |
| `arquitectura.webp` | Six layers, judgement vs enforced | **Keep**: the static map of *what* exists; the presentation shows *when* each layer acts. |
| `versiones.webp` | release / apply / harvest loop | **Keep until chapter 10 is published**, then retire. |
| `sesion.webp` | SessionStart, log, compaction, relay | **Retire from the gallery**; keep `docs/diagramas/gw-sesion.svg` as source. |
| `fases.webp` | Three phases, person confirms | **Retire from the gallery**; keep the SVG source. |
| `pre-push.webp` | Gate diagram | **Retire from the gallery**; keep the SVG source. |
| `subagentes.webp` | Brief, ladder, limits | **Retire from the gallery**; keep the SVG source. |

Retiring an image is content (`content` regexes); the `galeria` change goes in the same commit as the component. The
SVG sources in `docs/diagramas/` stay (they feed the README and future stills).

## 10. Corrections against the previous design and the diagrams

1. **Pre-push order and count.** The previous design said "eight checks, five gates" and `gw-pre-push.svg` draws
   refs → commit → config → leftovers → check → protected? → code? → mark. The hook also runs `private-check.py`
   before the check, reads `check`/`protectedBranch` from the **pushed commit** but the protected policy from the
   **remote tip**, applies the `check-green` cache (never on the protected branch), scans leftovers on all gained
   commits for `main`, and has `prepush-branches.sh` / `related-tests.sh` hook points. The scene shows the eleven
   gates in that order; every failure message ends with the fix command and the `WIP:` escape.
2. **Commit time has two hooks.** `gw-sesion.svg` names only `pre-commit`; `commit-msg` checks the log date, the
   `Next:` line and the agent signatures.
3. **Three Claude Code hooks were missing:** `before-stop.py` (Stop), `config-guard.py` and `agent-signatures.py`
   (PreToolUse), plus `subagent-cap.py`. They are the clearest "the agent cannot" moments and have a step (9) and a
   line (4).
4. **CI is not "Linux + macOS" for a project.** `check.yml` runs on `ubuntu-latest` only, on pushes outside `main`
   and on PRs; on `main` the portal runs `pages.yml` (check, build, deploy, IndexNow). The workflow repo's own
   `check.yml` is the one that runs on ubuntu and macOS (Python 3.12); it is in chapter 10 (step 26).
5. **Phase 2 is optional in the portal** (`requireRetro: false`, `AGENTS.md` «Reglas del proyecto») but enforced by
   `reviewed.sh` where it is `true`; the old design showed it as always run.
6. **Publication is direct and, weekly, unconfirmed.** `pushToProtected: direct`; the task "Proyectos semanal" pushes
   content to `main` without confirmation (`docs/runbooks/tarea-semanal.md`). The PR variant is a configuration, not
   the portal's path.
7. **Subagent cap:** `gw-subagentes.svg` says "≤ ~35 tool calls"; `subagent-cap.py` defaults to 30 and the brief
   template says "at ~25 tool calls, commit". The step uses ~30 and cites the script.
8. **Pilot figures** are cited from the ficha («decisiones», «aprendizajes») and
   `docs/investigacion/presentacion-de-flujos.md`, not repeated from memory.
9. **Legacy paths:** `config.py` still defaults `log` to `docs/traspaso.md` and `reviewMark` to
   `docs/registros/revisado.txt`; the portal uses `docs/handoff.md` and `docs/records/reviewed.txt` (both exist). The
   presentation shows the portal's paths.
10. **Fonts:** Inter plus the system mono stack; DejaVu is dropped (it is not on the portal's visitors' machines and
    the record container renders the system stack the same).
11. **Mobile composition:** one SVG scene that scales, with the caption stacked; the only mobile-specific scene rule
    hides the chapter-10 sub-labels.
12. **Chapter 10, verified in the Galivelop-workflow repo (Q9 answered):** every version starts with a harvest
    (`harvest.py --json --diff`, also edited skills and scripts and the commits since the last harvest; its state is
    saved with `--update-state`); the proposals in `docs/proposals/` are decided by the person; `version.py X.Y.Z`
    bumps `plugin.json`, the markers and the CHANGELOG entry (the agent fills and dates it), while `version.py
    --release` is a **check** that the pre-push runs on `main`; the release notes live in
    `docs/records/release-vX.Y.Z.md`; the person tags by hand; `release.yml` runs on ubuntu only (the tag must be an
    ancestor of `main` and equal `plugin.json`, runs `tests/check.sh`, then `gh release create`); `check.yml` runs
    on ubuntu and macOS with Python 3.12; the "1776 tests" claim is dropped; `/gw-update` is `ls-remote` → checkout
    the tag → `apply.py --dry-run` → the person confirms → `--update` → `*.gw-new` merged by hand → `doctor.py` with
    no `FAIL` → `apply.py --check` → commit with `Next:` and push; `gw-portal` then updates the ficha; only the latest
    minor receives patches. The workflow repo follows its own rules (review, retro presented, mark).
13. **Text density and the person's weight (Q4, Q11 answered):** no step has more than four lines (the pre-push is
    now five steps, 17–21, instead of two six-line screens), and the person acts on three steps only (14, 16, 25),
    each with the amber lane glow and a stamp, instead of nine chips.

Numbers that matched and were kept: 26 skills (11 own + 15 by Matt Pocock, ficha `cifras` and `gw-arquitectura.svg`),
200k compaction window, ladder of four rungs.

## 11. Risks

- **Drift:** a renamed script or a changed hook makes a line or a gate name false. Mitigation: lines and scene state
  are data, the weekly grep covers the version string, and a step's `fuente` tells the reviewer what to re-read; a
  test in `src/data/*.test.ts` can assert that every `fuente` path exists in the repo (for the portal's own files).
- **Length:** 216 s at 1× is long for social channels. The record mode (168 s) and a chapter clip (42 s for the
  pre-push, 23 s for dealing) are the social cuts; the full run is for the project page.
- **Phone scene:** at 390 px the scene is ~200 px tall and the lanes are close; the smallest text is 12 px and the
  chapter-10 sub-labels are hidden. If the person finds it cramped, the scene can take the full viewport width with
  the caption below it, which the layout already does.
- **Translations:** `T.es` and `T.gl` were written by the agent; the Galician in particular should be read by the
  person before it ships (the `visibleLanguages` check verifies presence, not quality).
- **Static build:** rendering the first step without JS needs the component to be SSR-safe; the current pages are
  generated by `scripts/paginas-estaticas.mjs`, which the `pr` skill marks as SEO-sensitive.

## 12. Open questions

Answered in this version: Q1 (block under the header), Q2 (Play on tap), Q3 (retire `sesion`, `fases`, `pre-push`,
`subagentes` from the gallery, keep the SVG sources), Q4 (the pre-push split into five steps), Q5 (`diagramas` stays
below), Q7 (system mono), Q8 (videos exported), Q9 (chapter 10 verified), Q10 (web es/gl/en, video en), Q11 (person on
three steps).

1. **Poster frames** (former Q6): export one PNG per chapter from the record mode for the social posts
   (`gw-media-content-now`), or keep `portada.webp` as the only still?
2. **Galician and Spanish texts:** does the person want to read `T.gl` and `T.es` before the data goes into the ficha,
   or is the review in the PR enough?
3. **Video voice-over:** the record mode has no audio. Subtitles are the captions already on screen; should a
   voice-over (the narration lines, English) be recorded by the person, or is the silent clip the social format?
4. **Retiring `versiones.webp`:** chapter 10 now covers it; retire with the component or keep it one release longer?
