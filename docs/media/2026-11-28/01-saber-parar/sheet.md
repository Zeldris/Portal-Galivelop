# Sheet: saber-parar (2026-11-28)

The source of everything published for this piece. What is not here, with its source, does not go out in the channels.
Piece folder: `docs/media/2026-11-28/01-saber-parar/` (NN = number of the piece of the day).

Languages: es

## Channels

- linkedin

## What is told

- **In one sentence (for who uses it):** Repaso de lo nuevo del taller, proyecto a proyecto, con la ficha y el código de cada uno: Galivelop IG, Galivelop-workflow, Tarkor y toVeriAI al día, cuatro proyectos en «próximamente» y cinco entradas en el diario.
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
| Galivelop IG genera imágenes en el propio equipo sin mandar nada fuera, y agrupa pedidos en tandas | `src/data/proyectos/galivelop-image-generator.json` (`resumen`: «Nada sale del equipo»; novedades 0.7.0/0.8.0, 2026-11-27) |
| Galivelop-workflow es nuestra forma de trabajar con IA empaquetada para cualquier proyecto; pregunta antes de empezar (0.8.0); la 0.9 trae idiomas configurables y revisión repartida entre varios revisores; se instala para opencode y Codex | `src/data/proyectos/galivelop-workflow.json` (`lema` y novedades 0.8.0, 0.9.0) |
| Tarkor es un juego de rol por texto con IA local como directora de juego; en la ronda de pruebas los personajes responden sin desvelar secretos y el combate entiende mejor las esquivas | `src/data/proyectos/tarkor.json` (`resumen`; novedades 2026-11-20 y 2026-11-26) |
| toVeriAI dice cuánto puedes fiarte de una noticia y por qué | `src/data/proyectos/toveriai.json` (`lema`, `resumen`) |
| Una entrada del diario explica por qué medimos con una consola (Steam Deck) | `src/data/diario/una-consola-como-vara-de-medir.json` |
| Enlaces de fichas: `/proyectos/<slug>` del sitio https://zeldris.github.io/Portal-Galivelop/ | `src/App.tsx`:68 |
| Código público: github.com/Zeldris/galivelop-image-generator, /Galivelop-workflow, /World-Maker-Fantasy, /Instalador-WMF-Tarkor; toVeriAI solo su web, www.toveriai.com (repo privado) | `enlaces` de cada ficha en `src/data/proyectos/` |
| El diario está en https://zeldris.github.io/Portal-Galivelop/diario | `src/App.tsx`:75; `scripts/paginas-estaticas.mjs`:169 |

## Images

| Image | Alt text | Channels |
|---|---|---|
| `media/card.png` | es: Tarjeta «Lo nuevo del taller» de Galivelop: Galivelop IG se para al tercer fallo seguido, Galivelop-workflow pregunta antes de empezar, Tarkor en pruebas jugando, toVeriAI cómoda en el móvil y cuatro proyectos en próximamente | linkedin |
| `media/card.webp` | es: Tarjeta «Lo nuevo del taller» de Galivelop: Galivelop IG se para al tercer fallo seguido, Galivelop-workflow pregunta antes de empezar, Tarkor en pruebas jugando, toVeriAI cómoda en el móvil y cuatro proyectos en próximamente | ninguno (la genera el render; sirve para X o Discord) |
| `media/card-en.png` (y `card-en.webp`, `card-en-mini.webp`) | en: Galivelop card «New in the workshop»: Galivelop IG stops after three failures in a row, Galivelop-workflow asks before it starts, Tarkor in play-testing, a phone-friendly toVeriAI website and four projects coming soon | reddit (pedido de la persona, 2026-11-28; el texto del post de Reddit se dio en la conversación y no está guardado) |

## Internal use

- Pedido de la persona (2026-11-28): publicación de LinkedIn de los proyectos nuevos y actualizados, «con el tono del diario, no lo que está escrito pero sí el tono»: la voz (tutear, en llano, honesta, sin vender), no su formato. Corrección: formato de LinkedIn con enlaces al portal y a los repos y una pregunta final.
- Sin nota del proyecto (`.claude/gw/gw-media-content.md`): solo en castellano (la persona, 2026-11-28).
- Próximamente, sin contar cómo van (regla de «Mensaje»): solo el lema de cada uno.
- Fuentes HTML en `media/source/`, con los tokens del tema claro de `docs/marca.md`. Rama `ccr-b5664d58-ozb4cv`.

## Published

| Channel | Language | Date | Link |
|---|---|---|---|
