# Sheet: novedades-reddit (2026-11-14)

The source of everything published for this piece. What is not here, with its source, does not go out in the channels.
Piece folder: `docs/media/2026-11-14/04-novedades-reddit/`.

Languages: en

## Channels

- reddit

## What is told

- **In one sentence (for who uses it):** A two-week log of the Galivelop workshop: what changed in Tarkor, Galivelop-workflow, Image Generator, toVeriAI and Voice Generator, and a faster website that now gathers all of it on one News page.
- **In one sentence (technical):** Same range as the LinkedIn piece (`docs/media/2026-11-14/03-novedades-portal/`), told as a devlog for Reddit, in English, with one image that covers every project.
- **Status:** everything merged and published on `main` (76340d5, 2026-11-14).

## Verified facts

| Fact | Source |
|---|---|
| /novedades gathers the news of every project and the wall posts, newest first, with a filter per project | commit 33c4c75 |
| Route-based loading: initial JS goes from 839 KB (258 KB gzip) to 310 KB (97 KB gzip), 62 % less | commit 4ebebe8 |
| Pages in Galician and English show their own image and text when shared (link previews in es, gl and en) | commit 971c719 |
| Front-end audit: Tarkor accent contrast from 3.2:1 to 5:1 | commit 6310d51 |
| The Galivelop-workflow page has three step-by-step animations (Work, Handoff, Road to main) | commit 9853767 |
| The website's images and icons come from our image generator, which runs locally | commit 386fd62; `src/data/proyectos/galivelop-image-generator.json`, news 2026-11-12 |
| Tarkor is a narrative RPG where the world moves on even when you stop | `src/data/proyectos/tarkor.json`, `lema.en` |
| Tarkor milestone 0.4: own map generator that builds each region in layers; travel between regions counting hours and days; 25 zones brought in line with the canon | `src/data/proyectos/tarkor.json`, news 2026-11-10 |
| Tarkor play-testing round: the Town Hall can be repaired after a rebellion, companions show up in the combat panel, each combat round is narrated better | `src/data/proyectos/tarkor.json`, news 2026-11-11 |
| Tarkor installer: choose which game data to delete when uninstalling, delete only the AI and pick a profile again, new «Licences and notices» screen | `src/data/proyectos/tarkor.json`, news 2026-11-12 |
| Galivelop-workflow is the way we work with AI, packaged for any project; its repository is public | `src/data/proyectos/galivelop-workflow.json`, `lema.en` and lines 69, 136 |
| Galivelop-workflow 0.6.0: records tokens per session and model, recommends model and effort per task, reviews long branches in blocks, runs the check in parallel | `src/data/proyectos/galivelop-workflow.json`, news 2026-11-13 |
| Image Generator 0.5.0: export to WebP, ICO and BMP with crop, pause and resume the queue, redesigned interface for narrow screens | `src/data/proyectos/galivelop-image-generator.json`, news 2026-11-13 |
| Image Generator: negative prompt from the command line, the API and the interface | `src/data/proyectos/galivelop-image-generator.json`, news 2026-11-14 |
| Image Generator code is open under the MIT licence (since 0.4.0) | `src/data/proyectos/galivelop-image-generator.json`, news 2026-11-05 |
| Repositories: github.com/Zeldris/Galivelop-workflow and github.com/Zeldris/galivelop-image-generator | `src/data/proyectos/galivelop-workflow.json`:69; `src/data/proyectos/galivelop-image-generator.json`:64 |
| toVeriAI: a score that explains how far you can trust a news story | `src/data/proyectos/toveriai.json`, `lema.en` |
| toVeriAI: server tweaks to cope better with limited resources; tools updated with security fixes | `src/data/proyectos/toveriai.json`, news 2026-11-09 and 2026-11-14 |
| Galivelop Voice Generator (coming soon): voices with local AI; 2 of 8 phases; next, the real voice engine | `src/data/proximamente.json` |
| Everything is published at https://zeldris.github.io/Portal-Galivelop/novedades/ | `docs/handoff.md` (En main, 76340d5) |

## Reddit

- **Subreddit:** r/u_Alvaro-Garcia-Grana
- **Rules read:** 2026-11-14
- **Self-promotion:** it is the user's own profile, so there is no subreddit self-promotion rule; the post is a devlog that tells what changed and asks for feedback, with one link.

### Rules of r/u_Alvaro-Garcia-Grana

Own profile of u/Alvaro-Garcia-Grana. The user said on 2026-11-14 that the Reddit posts of the portal always go to their own profile («En el mío, siempre en el mío u/Alvaro-Garcia-Grana»). A profile has no subreddit rules of its own; only Reddit's site-wide rules apply, which were not pasted here.

## Images

| Image | Alt text | Channels |
|---|---|---|
| `media/1-changelog.webp` | en: Dark "workshop log" card: two weeks in the workshop, five projects and a faster website. One row per project with its icon and changes: Tarkor (map generator, travel between regions, installer), Galivelop-workflow 0.6.0, Image Generator 0.5.0, toVeriAI, Voice Generator (2 of 8 phases) and the website (News page, 62 % less JavaScript, link previews in three languages) | reddit |

## Internal use

- Branch `ccr-5c066d81-ndsd13`; same range as piece 03 (LinkedIn), from `c830281` to 76340d5.
- Different from LinkedIn on purpose: one image instead of eight, dark theme, English, devlog tone.
- `check.py` only accepts subreddit names of `[A-Za-z0-9_]{2,21}`; a profile `u_<user>` with hyphens fails it. To report to Galivelop-workflow.

## Published

| Channel | Language | Date | Link |
|---|---|---|---|
