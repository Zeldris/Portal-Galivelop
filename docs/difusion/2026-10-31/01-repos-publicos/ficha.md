# Ficha: repos-publicos (2026-10-31)

La fuente de todo lo que se publica de esta pieza. Lo que no esté aquí, con su fuente, no sale en los canales.
Carpeta de la pieza: `docs/difusion/2026-10-31/01-repos-publicos/` (01 = número de la pieza del día).

Idiomas: en (en Reddit solo se publica en inglés, decisión de la persona del 2026-10-31)

## Canales

- reddit

## Qué se cuenta

- **En una frase (quien lo usa):** Desde hoy se puede leer en GitHub el código de tres proyectos del taller Galivelop, y cada ficha del portal enlaza su repositorio.
- **En una frase (técnico):** Tarkor, Galivelop-workflow y Galivelop Image Generator pasan a repos públicos; el portal añade «Ver el código en GitHub» a sus fichas.
- **Estado:** repos públicos y enlaces publicados en la web el 2026-10-31.

## Hechos comprobados

| Dato | Fuente |
|---|---|
| Los repos `Zeldris/World-Maker-Fantasy`, `Zeldris/Galivelop-workflow` y `Zeldris/galivelop-image-generator` son públicos | listado de repos de la cuenta (visibilidad `public`), consultado el 2026-10-31 |
| Tarkor es un juego de rol por texto con una IA local como directora de juego, en un mundo de bolsillo donde las facciones, la fauna y tu reino viven por su cuenta | `src/data/proyectos/tarkor.json`, `resumen` |
| Tarkor está en alpha y abierto a colaborar | mismo archivo, `fase` («Alpha · hito 0.3») y `colaboracion: abierta` |
| Galivelop-workflow es un flujo de trabajo versionado para programar con agentes de IA: relevos entre sesiones sin perder nada, elegir skill y modelo antes de empezar, revisión obligatoria antes de publicar y menos tokens sin perder calidad | `src/data/proyectos/galivelop-workflow.json`, `resumen` |
| Galivelop-workflow va por la 0.4.2 y tiene licencia MIT | mismo archivo, `fase`; `.claude-plugin/plugin.json` y `LICENSE` del repo del flujo |
| Galivelop Image Generator es un servicio local de generación de imágenes con IA, uno por máquina y compartido por los proyectos del taller; nada sale del equipo | `src/data/proyectos/galivelop-image-generator.json`, `resumen` |
| Galivelop Image Generator está en desarrollo | mismo archivo, `estado` y `fase` («fase 2: motor real») |
| En los proyectos con colaboración privada, las propuestas y las ideas son bienvenidas | `src/i18n/textos.ts`, `participa.privada.texto` |
| Las fichas de los tres proyectos enlazan su repo («Ver el código en GitHub») | `enlaces` de los tres `.json` (commit 47baaec); respuesta 200 y enlace presente en la web publicada, comprobado el 2026-10-31 |
| El portal está en https://zeldris.github.io/Portal-Galivelop/ | respuesta 200 comprobada el 2026-10-31 |

## Imágenes

Ninguna: en Reddit va como publicación de texto con enlaces.

## Uso interno

- Pieza hecha con la skill `gw-media-content` (copia de World-Maker-Fantasy, solo leída; el portal no la tiene).
- Reddit: pensada para el perfil `u/Alvaro-Garcia-Grana`. Para un subreddit, antes hay que leer sus normas (la persona las pega) y ajustar el texto.
- toVeriAI no sale: su repo sigue privado y el anuncio es solo de los que se abren.

## Publicado

| Canal | Idioma | Fecha | Enlace |
|---|---|---|---|
