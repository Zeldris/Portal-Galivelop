# Sheet: novedades-reddit (2026-11-28)

The source of everything published for this piece. What is not here, with its source, does not go out in the channels.
Piece folder: `docs/media/2026-11-28/02-novedades-reddit/`.

Languages: en

## Channels

- reddit

## What is told

- **In one sentence (for who uses it):** What changed in the workshop over two weeks (Galivelop IG, Galivelop-workflow, Tarkor, toVeriAI), four new projects coming soon and Álvaro's two products, Galivelop Developer and Galivelop Evaluator.
- **In one sentence (technical):** The LinkedIn piece of the same day (`docs/media/2026-11-28/01-saber-parar/`) told in English for Reddit, with more detail on the coming-soon projects and the products; same card, in English.
- **Status:** the projects' news and the products' pages are published on `main`.

## Verified facts

The project facts are those of `docs/media/2026-11-28/01-saber-parar/sheet.md`. Added for this piece:

| Fact | Source |
|---|---|
| Voice Generator, Forge, Runtime, Worlds and Model Atlas: the slogan of each (no progress told, «Mensaje» rule) | `src/data/proximamente.json` (`lema.en`) |
| Galivelop Developer (GalivelopCode): local agents with three roles, separate working copy, review before merging, rules blocked by the system, cloud optional per role, planned requirements tested on a Steam Deck | `src/data/productos/galivelop-developer.json` (`pagina`, `en`) |
| Galivelop Evaluator (GVE): before/after with the same questions, repeatable tests, a missing result is never a pass, held-out questions, `gve` command, Python 3.10+ and git, Spanish and English | `src/data/productos/galivelop-evaluator.json` (`pagina`, `en`) |
| Both products belong to Álvaro, are private, have no prices and are discussed by email; their code is not linked | `docs/desarrollo.md#mensaje` (ADR 0005, 0006) |
| Product pages: `/productos/<slug>` | `src/App.tsx`:74 |

## Reddit

- **Subreddit:** r/u_Alvaro-Garcia-Grana
- **Rules read:** 2026-11-14 (own profile; see `docs/media/2026-11-14/04-novedades-reddit/sheet.md`)
- **Self-promotion:** it is the user's own profile, so there is no subreddit self-promotion rule.

## Images

| Image | Alt text | Channels |
|---|---|---|
| `media/card-en.webp` | en: Galivelop card «New in the workshop»: Galivelop IG stops after three failures in a row, Galivelop-workflow asks before it starts, Tarkor in play-testing, a phone-friendly toVeriAI website and four projects coming soon | reddit |

## Internal use

- The person's request (2026-11-28): a Reddit post in English similar to the LinkedIn one, with more on the new projects and Álvaro's products. The card is a copy of `01-saber-parar/media/card-en.*` (source there).

## Published

| Channel | Language | Date | Link |
|---|---|---|---|
| reddit | en | 2026-11-28 | (sin enlace apuntado) |
