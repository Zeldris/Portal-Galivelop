# Catalog of post types

Shared by `gw-media-content` (proposes up to 10) and `gw-media-content-now` (produces one). Research:
`docs/investigacion/redes-sociales.md` of the Galivelop-workflow repo: §2 topics, §3 formats, §4.1
catalog, §4.2 rules, §5 per-network rules. Evidence marks follow the research: P primary source, S secondary, J
judgement (validate with the project's own results).

Columns: **Formats** are sources in `plantilla/medios/fuente/` (`tarjeta`, `diagrama`, `metricas`, `cita`, `codigo`,
`antes-despues`, `carrusel`), a screenshot (`.png`/`.jpg` there), or text only. **Networks** are the best of the four
starting ones (`x`, `reddit`, `linkedin`, `discord`); a channel a project declares in its note (`nota.md`) is treated
like these, with the shape the note gives. `carrusel` is a PDF and only LinkedIn takes it: for the other networks a
row offers an image sequence (several `tarjeta` or `diagrama` images) or a thread instead. **Repo data** is where the facts come from; the figures
come from `scripts/cifras.py`, the rest from the file and line or the commit that the ficha cites.

| Topic | Formats | Networks | Repo data | Why it has value | Research |
|---|---|---|---|---|---|
| How the app works | `diagrama` (4-step flow); screenshot; text | x, linkedin, discord | `README`, `docs/` guides, the app running (screenshot steps in the project note) | Shows the proposition in one image; showing the product beats describing it (S) | §2 row 1, §3 |
| App event or update | `tarjeta` (headline + 3 figures); `carrusel` for 5+ changes (LinkedIn only; elsewhere a thread) | x, linkedin, discord, reddit | `CHANGELOG.md` latest section, `cifras.py` (version, last tag, commits since), `git log` since the last tag | Concrete news with a date and a version; stable thing to link (J) | §4.1 release summary |
| Interesting technical development | `codigo` or `diagrama`; long text | reddit, linkedin, x | The commit or ADR that did it, the diff, `docs/plan.md` | Substance that is not plain promotion: devlogs and postmortems work in dev communities (S) | §2 row 2, §4.1 devlog and design decision |
| Workflow data (tokens, tests, retros) | `metricas`; `tarjeta` | linkedin, x, reddit (AI-tooling subreddits) | `/opt-tokens` and `/retro` reports, `cifras.py` (test files, commits), CI runs | Own figures anyone can check; an audience of developers using AI agents (J) | §2 row 5, §4.1 AI-workflow metrics |
| Failures and lessons | `cita` or text only | linkedin, reddit, x | `/retro` files, `docs/propuestas/`, `WIP:` commits, the log's failure notes | Replies drive reach on X and conversation on LinkedIn and Reddit; honest accounts travel (P for X replies) | §2 row 4, §4.1 failures |
| Milestone | `tarjeta`; `metricas` | linkedin, x, discord | `cifras.py` (version, commits, date range), closed phases in the log | Round figures and one concrete piece of news (J) | §2 row 8, §4.1 milestone |
| Before and after | `antes-despues` (two screenshots of the same size); `codigo` for a refactor | x, linkedin, reddit | Screenshots from two commits (`git stash` or two checkouts), the diff | Visual, fast to read, easy to share (S) | §2 row 6, §3 |
| Question to the community | Text only; a poll in the text | discord, x, reddit | Open decisions in the log (`Pending`), `docs/plan.md` open items | Replies weigh most on X; Discord is the natural place for it; Reddit if its rules allow asking (P for X) | §2 row 9, §4.1 community question |
| The project's world or lore (if the project is a game or has a fiction) | Screenshot; `cita`; `tarjeta` | discord, reddit, x | The project's canon files (never invent lore) | Image plus a short text; affinity with the project's audience (J) | §2 row 10 |
| Code snippet | `codigo` (10 lines of ~65 characters at most) with the code in the alt text | x, linkedin, reddit | A diff or fragment of a commit, with file and line | Small, concrete, readable without context (J) | §3 row "Code snippet", §4.1 |
| Roadmap | `diagrama`; `carrusel` (LinkedIn only); text | discord, linkedin, reddit | `docs/plan.md`, roadmap and open issues, the log's next step | Stable link for followers; shows direction (J) | §2 row 11, §4.1 roadmap |
| Short tutorial | `diagrama` with numbered steps (or `carrusel` on LinkedIn only; a numbered thread elsewhere); text | linkedin, reddit, discord | `docs/` guides, `README` quick start | Stays useful and searchable long after the post (J) | §2 row 12, §4.1 |
| Weekly screenshot thread (if the project is a game or visual app and a community runs one) | One screenshot (or `antes-despues`) plus the weekly hashtag | x, reddit | New screenshots of the week; `git log` of the week | Weekly recurring thread that brings audience (S) | §2 row 3, §4.1 |
| Behind the scenes (build in public) | Screenshot of the work in progress; `tarjeta`; text | x, discord | The log's current step, `git log` of the week, a screenshot of what is being built | Continuous conversation with followers (J) | §2 row 7 |
| Anything else with value | Whatever fits | any | The project's own data | A post earns its place if it gives the reader something they can use or check; one nobody could verify or use stays out | §4.2 |

## How to choose

1. **Facts first.** A row is a candidate only if the repo data it lists exists for this project right now. No data,
   no post.
2. **Vary the topic.** A set of proposals mixes topics; no more than 2 of the same topic in one set. A post speaks
   to one audience: the project's users and the readers of its AI-workflow data are different, so they do not share
   a post (research §2 warning).
3. **One canonical piece, one adaptation per network.** The fact, the figure and the image are the same; length,
   tone, hashtags and link position follow the network (limits in `reglas.json`; research §4.2 rule 2).
4. **Mark what is not verified.** Reddit is `NV`: its rules are pasted by the user and dated in `ficha.md`; X's alt
   limit is `NV` too.
5. **Nothing leaves the repo.** No secrets, private paths, task ids, branch names or data from other repos
   (research §4.2 rule 8; `comprobar.py` catches the jargon).
