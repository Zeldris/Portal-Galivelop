<!-- galivelop-workflow v0.9.0 -->
# Front tests template (E5)

Playwright (layout, accessibility, visual) and Stylelint for a project with a front end, fed by the files
`scripts/front.py generate` writes from the project's design tokens. Written in TypeScript. Copy this folder into the
project (or a subfolder of it) and keep the pinned versions of `package.json` together with `package-lock.json`.

## Install

Set `front.dir` in `.claude/gw.json` to this folder (default `.`) and `front.tokens` to the tokens file. The packages
are never installed in the tree: `front.py` runs `npm ci` (exact versions from `package-lock.json`; needs node 22+)
into `<git common dir>/gw/front-node/<lock hash>/`, shared by the worktrees.

Keep every file of this template, and every spec or config that imports `@playwright/test`, `@axe-core/playwright` or
`stylelint`, **inside `front.dir`**: the run links `node_modules` only into `front.dir` of its temporary copy, so an
import from a file outside it does not resolve (Q-38).

```sh
python3 .claude/gw/scripts/front.py install --browsers chromium   # packages and a browser, once per machine
python3 .claude/gw/scripts/front.py generate   # tokens.css, _tokens.scss, stylelint.tokens.json, playwright.projects.json
```

## Run

```sh
python3 .claude/gw/scripts/front.py run fast   # Stylelint + Playwright without @visual, main breakpoints (the pre-push)
python3 .claude/gw/scripts/front.py run full   # everything, whole matrix: Linux, or Docker elsewhere (CI, closing check)
```

Both run from a temporary copy of what git tracks. Stylelint checks `front.stylelintFiles` (repo-relative globs,
default `**/*.{css,scss}`) with this folder's `.stylelintrc.json`: colours, spacing and font sizes must be tokens.

## Visual tests and baselines

Tag the screenshot tests `@visual` (`front.visualTag`): `run fast` leaves them out, `run full` runs them. Baselines
(`*-snapshots/*.png`) only match the render they were taken on, so they are taken on Linux (or in the Playwright
Docker image) with the Playwright pinned in `package.json`, and that version is written into
`front/snapshots.version` (`front.snapshotStamp`); `doctor.py` warns when the stamp and the pin differ, about
baselines from `-darwin`/`-win32` and about large ones outside Git LFS. Take or refresh them with
`python3 .claude/gw/scripts/front.py run full --update-snapshots` (Linux, or Docker elsewhere): the new or changed
baselines come back to the tree and the stamp is written; review them with `git diff` before the commit.

`GW_PORTAL_PORT` sets the port of the `vite preview` that `playwright.config.ts` starts (default 4181; 4173-4177 are
taken by `vite preview` and `tools/qa`).

`GW_PLAYWRIGHT_PROJECTS` overrides the path of `playwright.projects.json` (default: `front/generated/` next to
`gw-config.ts`, the default `front.out`). `.stylelintrc.json` extends `./front/generated/stylelint.tokens.json` and
ignores `front/generated/**` (generated, not hand-written): change both if `front.out` is elsewhere.

## What is here

| File | What it gives |
|---|---|
| `gw-config.ts` | `gwConfig(overrides, projectsFile?)`: the generated projects, `animations: 'disabled'` on screenshots; the default projects file is `front/generated/playwright.projects.json` next to it |
| `playwright.config.ts` | `export default gwConfig()`: the one to run; copy it and pass `overrides` (`baseURL`, `webServer`) |
| `fixtures/stable.ts` | `test` with the automatic `stable` fixture (reduced motion, fixed clock, only the app's origin on the network, no animations); `gotoStable(page, url)` also waits for `document.fonts.ready` |
| `helpers/layout.ts` | `expectNoOverflow(page)` (content in a scroller or parked off-screen is not an overflow), `expectNoOverlap(a, b)`, `expectTouchTargets(page, minPx = 24, { exclude })` (WCAG 2.5.8 exceptions: links inside a sentence and visually hidden elements are skipped) |
| `helpers/a11y.ts` | `expectNoSeriousA11y(page)`: axe, blocks only on serious or critical |
| `.stylelintrc.json` | the standard SCSS config plus the generated strict-value rules |

Every failure message names the element and the reason. Set `baseURL` (and a `webServer`) through
`gwConfig({ use: { baseURL }, webServer })`: `stable` needs `baseURL` to know the app's origin and fails with a message
asking for it when it is missing. Screenshots (`toHaveScreenshot`) are compared only on Linux or in Docker
(E-9): baselines are per platform and are not part of this template.

## Pinned versions

Checked on 2026-11-21 against the npm registry (`registry.npmjs.org`): `@playwright/test` 1.63.0 (released
2026-09-04; the Chromium build it needs is the one preinstalled in the workflow's Linux environment; newer ones exist),
`playwright-core` 1.63.0 (pinned so axe and the tests share one copy), `@axe-core/playwright` 4.14.0, `stylelint` 18.1.0, `stylelint-config-standard-scss` 18.0.0 (requires stylelint 18),
`stylelint-declaration-strict-value` 1.13.0, `postcss` 8.5.33, `typescript` 5.9.3 (last 5.x), `@types/node` 22.20.5.
Update them together and run the sample (`tests/fixtures/front-sample` in the workflow repo) before accepting.
