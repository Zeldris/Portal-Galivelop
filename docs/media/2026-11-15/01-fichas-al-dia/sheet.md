# Sheet: fichas-al-dia (2026-11-15)

The source of everything published for this piece. What is not here, with its source, does not go out in the channels.
Piece folder: `docs/media/2026-11-15/01-fichas-al-dia/`.

Languages: es

## Channels

- x

## What is told

- **In one sentence (for who uses it):** Las fichas del portal cuentan ya lo de esta semana: Galivelop-workflow 0.6.2 con 2671 pruebas, Galivelop IG 0.5.0 con 1587 tests y novedades de Galivelop IG, Tarkor y toVeriAI.
- **In one sentence (technical):** Revisión semanal del 2026-11-15 publicada en `main`: versión y cifra de pruebas del workflow, versiones publicadas 0.6.1 y 0.6.2, y una novedad en cada ficha de Galivelop IG, Tarkor y toVeriAI.
- **Status:** publicado en `main` el 2026-11-15 (c926bcc).

## Verified facts

| Fact | Source |
|---|---|
| Galivelop-workflow va por la 0.6.2, publicada el 2026-11-15 | `src/data/proyectos/galivelop-workflow.json` (estado «v0.6.2», versiones publicadas «0.6.2 · 2026-11-15»); commit c926bcc |
| Galivelop-workflow tiene 2671 pruebas automáticas | `src/data/proyectos/galivelop-workflow.json`:2883-2885 |
| 0.6.2: la subida a main funciona aunque la rama protegida aún no exista, el aviso de trabajo sin subir deja de contar lo traído de main y, tras fusionar, los arreglos van a un subagente nuevo | `src/data/proyectos/galivelop-workflow.json`, novedad 2026-11-15 |
| Galivelop IG va por la 0.5.0, con 1587 tests | `src/data/proyectos/galivelop-image-generator.json`:1181; commit c67238a |
| Galivelop IG: quitar el fondo, pasar un dibujo a SVG y crear texturas que se repiten fallan menos y explican mejor qué ha salido mal; el taller de logos acepta fuentes .ttc | `src/data/proyectos/galivelop-image-generator.json`, novedad 2026-11-15 |
| Tarkor sigue la ronda de pruebas jugando: un personaje con nombre que muere ya no vuelve, dejar a alguien convaleciente te revela quién es y el narrador pone primero lo que hace tu personaje | `src/data/proyectos/tarkor.json`, novedad 2026-11-15 |
| toVeriAI: al pasar rápido de una entrada a otra, la web ya no mezcla datos de la anterior | `src/data/proyectos/toveriai.json`, novedad 2026-11-15 |
| Todo está publicado en https://zeldris.github.io/Portal-Galivelop/ | `docs/handoff.md` («Hecho», 2026-11-15); `git log origin/main` (c926bcc) |

## Images

| Image | Alt text | Channels |
|---|---|---|
| `media/1-resumen.webp` | es: Tarjeta «Las fichas del portal, al día»: Galivelop-workflow 0.6.2, 2671 pruebas automáticas y Galivelop IG 0.5.0 con 1587 tests | x |
| `media/2-workflow.webp` | es: Tarjeta de Galivelop-workflow 0.6.2 con la portada «Relevos sin perder nada» y tres arreglos de la versión | x |
| `media/3-galivelop-ig.webp` | es: Tarjeta de Galivelop IG con su portada de láminas sobre el mar y la novedad de las herramientas de marca | x |
| `media/4-tarkor.webp` | es: Tarjeta de Tarkor con una captura de combate ganado y tres arreglos de la ronda de pruebas | x |

## Internal use

- Propuesta P7 de `docs/media/proposals/2026-11-14.md`, puesta al día con la revisión semanal del 2026-11-15 (la persona: «Actualizar y producir»).
- Fuentes HTML en `media/source/`, con los tokens del tema claro de `docs/marca.md`; las imágenes de proyecto salen de `public/proyectos/`.
- Rama `ccr-8e0862c2-niq1xt`.

## Published

| Channel | Language | Date | Link |
|---|---|---|---|
