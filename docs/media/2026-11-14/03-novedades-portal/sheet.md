# Sheet: novedades-portal (2026-11-14)

The source of everything published for this piece. What is not here, with its source, does not go out in the channels.
Piece folder: `docs/media/2026-11-14/03-novedades-portal/`.

Languages: es

## Channels

- linkedin

## What is told

- **In one sentence (for who uses it):** El portal de Galivelop estrena página de novedades, carga más rápido, se comparte en el idioma de cada página, explica el workflow con animaciones y usa imágenes de nuestro generador local.
- **In one sentence (technical):** Resumen de lo publicado en `main` del 2026-11-05 al 2026-11-14: /novedades, carga por ruta (JS inicial de 258 a 97 KB gzip), Open Graph por idioma, animaciones en la ficha del workflow, auditoría de contraste, imágenes del generador y fichas al día.
- **Status:** todo publicado en `main` (76340d5, 2026-11-14).

## Verified facts

| Fact | Source |
|---|---|
| /novedades junta las novedades de todas las fichas y las publicaciones del muro, lo más reciente primero, con filtro por proyecto y «Ver más» de 20 en 20; en el menú, el pie y el inicio | commit 33c4c75 |
| Productos sale del menú, el pie y la portada y pasa al perfil de cada miembro que lo lleva (ADR 0004) | commit 33c4c75; `docs/desarrollo.md`:57 |
| Carga por ruta: el JS inicial baja de 839 KB (258 KB gzip) a 310 KB (97 KB gzip), un 62 % menos; las 42 páginas estáticas siguen igual | commit 4ebebe8 |
| Las páginas en gallego e inglés enseñan al compartirse su propia imagen y su texto, con el texto de la imagen traducido | commit 971c719 |
| Auditoría de front: contraste del acento de Tarkor de 3,2:1 a 5:1, medido de nuevo con Playwright; arreglos de idiomas y del menú móvil | commit 6310d51 |
| La ficha de Galivelop-workflow tiene tres animaciones paso a paso (Trabajar, Relevo, Camino a main) en es, gl y en | commit 9853767 |
| Las imágenes e iconos de la web salen de nuestro generador de imágenes, que corre en local | commit 386fd62; `docs/media/2026-10-27/01-piloto-generador/ficha.md` |
| Fichas al día: Galivelop-workflow 0.6.0 (2554 pruebas), Galivelop Image Generator 0.5.0 con prompt negativo (1587 tests), novedades de Tarkor y toVeriAI | commit c67238a |
| Todo está en `main`, publicado en https://zeldris.github.io/Portal-Galivelop/ | `docs/handoff.md` (En main, 76340d5) |
| El repositorio de Galivelop-workflow es público | `docs/media/2026-11-05/01-workflow-en-general/linkedin.md` (pieza publicada) |

## Images

| Image | Alt text | Channels |
|---|---|---|
| `media/1-resumen.webp` | es: Tarjeta «Novedades del portal»: una web más rápida, más clara y en tres idiomas; −62 % de JavaScript al entrar, contraste 5:1 y vista previa en es, gl y en | reserva (X, web) |
| `media/1-resumen.png` | es: Tarjeta «Novedades del portal»: una web más rápida, más clara y en tres idiomas; −62 % de JavaScript al entrar, contraste 5:1 y vista previa en es, gl y en | linkedin |
| `media/2-iconos-inicio.png` | es: Iconos del inicio del portal, hechos con nuestro generador de imágenes local | linkedin |
| `media/3-animacion-relevo.png` | es: Animación «Relevo» de la ficha de Galivelop-workflow: una sesión deja el trabajo a la siguiente | linkedin |

## Internal use

- Rama `ccr-5c066d81-ndsd13`; rango desde la pieza del 2026-11-05 (`c830281`) hasta 76340d5.
- Las imágenes 2 y 3 son copia de las piezas 01 y 02 del día (ya publicadas en X).
- Propuestas P1, P3, P5, P6 y P7 de `docs/media/proposals/2026-11-14.md` quedan cubiertas aquí para LinkedIn; siguen guardadas para X.

## Published

| Channel | Language | Date | Link |
|---|---|---|---|
