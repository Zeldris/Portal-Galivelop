# Sheet: saber-parar (2026-11-28)

The source of everything published for this piece. What is not here, with its source, does not go out in the channels.
Piece folder: `docs/media/2026-11-28/01-saber-parar/` (NN = number of the piece of the day).

Languages: es

## Channels

- linkedin

## What is told

- **In one sentence (for who uses it):** Lo nuevo del taller esta semana va de saber parar: el generador de imágenes se detiene al tercer fallo seguido, el flujo de trabajo pregunta antes de empezar, Tarkor se prueba jugando; además, cuatro proyectos en «próximamente» y un diario renovado.
- **In one sentence (technical):** Resumen en tono de diario de las novedades publicadas en `main` entre el 2026-11-16 y el 2026-11-27 (image-generator 0.7/0.8, workflow 0.8.2-0.9.1, Tarkor, toVeriAI, próximamente y diario).
- **Status:** todo publicado en `main` (último, el diario nuevo, 8bf49fe del 2026-11-27).

## Verified facts

| Fact | Source |
|---|---|
| El generador de imágenes bloquea el tercer fallo seguido hasta que se rellena un formulario que cuenta qué pasó | `src/data/proyectos/galivelop-image-generator.json`, novedad 2026-11-26 («Fallos con salida») |
| El flujo de trabajo con IA hace que el agente se pare si el modelo o el esfuerzo de la sesión no son los que pide la tarea | `src/data/proyectos/galivelop-workflow.json`, novedad 2026-11-22 |
| Tarkor sigue en una ronda de pruebas jugando, con arreglos comprobados | `src/data/proyectos/tarkor.json`, novedades 2026-11-20 y 2026-11-26 |
| La web de toVeriAI se usa ya con comodidad desde el móvil | `src/data/proyectos/toveriai.json`, novedad 2026-11-21 |
| En «próximamente» entran Forge, Runtime, Worlds y Model Atlas | `docs/handoff.md` («Hecho», 2026-11-27: `galivelop-forge`, `-runtime`, `-worlds` y `galivelop-models` en próximamente); `src/data/proximamente.json` |
| Forge: datos y ajuste fino para los modelos locales; Runtime: cola y turnos compartidos por los generadores locales; Worlds: kit para mundos de ficción con IA local; Model Atlas: qué modelo cabe en qué máquina | `src/data/proximamente.json` (`lema` de cada uno) |
| El diario del taller se renueva con cinco entradas, entre ellas por qué una Steam Deck es la máquina de referencia y un relato del Génesis de Tarkor | `src/data/diario/` (cinco archivos); `una-consola-como-vara-de-medir.json`, `la-ultima-semilla.json`; commit 8bf49fe |
| El diario está en https://zeldris.github.io/Portal-Galivelop/diario | `src/App.tsx`:75; `scripts/paginas-estaticas.mjs`:169 |

## Images

| Image | Alt text | Channels |
|---|---|---|
| `media/card.png` | es: Tarjeta «Saber parar» de Galivelop: el generador de imágenes se para al tercer fallo seguido, el flujo con IA pregunta antes de empezar, cuatro proyectos en próximamente y cinco entradas nuevas en el diario | linkedin |
| `media/card.webp` | es: Tarjeta «Saber parar» de Galivelop: el generador de imágenes se para al tercer fallo seguido, el flujo con IA pregunta antes de empezar, cuatro proyectos en próximamente y cinco entradas nuevas en el diario | ninguno (la genera el render; sirve para X o Discord) |

## Internal use

- Pedido de la persona (2026-11-28): publicación de LinkedIn de los proyectos nuevos y actualizados, «con el tono del diario, no lo que está escrito pero sí el tono» (`docs/desarrollo.md#diario-del-taller`): primera persona, una idea, el porqué, sin cifras ni versiones, sin vender.
- Sin nota del proyecto (`.claude/gw/gw-media-content.md`): solo en castellano (la persona, 2026-11-28).
- Próximamente, sin contar cómo van (regla de «Mensaje»): solo el lema de cada uno.
- Fuentes HTML en `media/source/`, con los tokens del tema claro de `docs/marca.md`. Rama `ccr-b5664d58-ozb4cv`.

## Published

| Channel | Language | Date | Link |
|---|---|---|---|
