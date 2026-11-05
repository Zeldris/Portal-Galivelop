# Sheet: workflow-en-general (2026-11-05)

The source of everything published for this piece. What is not here, with its source, does not go out in the channels.
Piece folder: `docs/media/2026-11-05/01-workflow-en-general/`.

Languages: es

## Channels

- linkedin

## What is told

- **In one sentence (for who uses it):** Galivelop-workflow es nuestra forma de trabajar con agentes de IA durante semanas sin perder nada entre sesiones, empaquetada para cualquier proyecto.
- **In one sentence (technical):** Repositorio versionado con reglas en AGENTS.md, skills, scripts y ganchos de git que hacen cumplir relevos, elección de skill y modelo, tres fases de revisión antes de main y ahorro medido de tokens.
- **Status:** en desarrollo, v0.5.0, fase 7 (rodaje); repositorio público.

## Verified facts

| Fact | Source |
|---|---|
| Lema: «Lo que no está subido no existe» | `src/data/proyectos/galivelop-workflow.json`:16 |
| Problema: una sesión con un agente puede acabarse en cualquier momento (tokens, contenedor, relevo de cuenta) y lo no escrito se pierde; cada proyecto inventa sus reglas y las copias divergen | `src/data/proyectos/galivelop-workflow.json`:142 |
| Sale de Tarkor, del portal y otros proyectos del taller; reglas en AGENTS.md (estándar abierto), skills, scripts, ganchos y plantillas en un solo sitio; una mejora se hace una vez y llega a todos | `src/data/proyectos/galivelop-workflow.json`:147 |
| Relevos: bitácora en el mismo commit que el trabajo, commit + push en cada punto estable; un gancho devuelve dónde se quedó la sesión | `src/data/proyectos/galivelop-workflow.json`:201 |
| gw-selector elige skill y modelo; gw-orchestrate-dealer reparte lo mecánico a subagentes de contexto limpio con el modelo más barato que lo haga bien | `src/data/proyectos/galivelop-workflow.json`:214 |
| Tres fases antes de publicar y marca de revisado; los ganchos no dejan subir sin ella ni con pruebas en rojo, y buscan secretos antes de cada commit | `src/data/proyectos/galivelop-workflow.json`:227 |
| gw-opt-tokens mide en qué se fue el gasto y propone recortes que no empeoren el resultado | `src/data/proyectos/galivelop-workflow.json`:240 |
| Las propuestas de la fase 2 se presentan a la persona y solo se aplica lo que confirma | `src/data/proyectos/galivelop-workflow.json`:340 |
| gw-harvest recoge lo que cada proyecto mejora; vuelve en una versión nueva y gw-update la lleva a todos | `src/data/proyectos/galivelop-workflow.json`:266 |
| En un piloto, una sola sesión larga se llevó el 70 % de los tokens; de ahí el tope de compactación y el reparto a subagentes | `src/data/proyectos/galivelop-workflow.json`:187 |
| Once skills propias y quince de Matt Pocock, sin cambios y con su licencia | `src/data/proyectos/galivelop-workflow.json`:157 |
| Versión 0.5.0, fase 7: rodaje; la 1.0 tras semanas de uso; repositorio público y abierto a colaborar | `src/data/proyectos/galivelop-workflow.json`:26, `src/data/proyectos/galivelop-workflow.json`:152 |
| Pasos de una tarea: retomar (bitácora y check), elegir (gw-selector), trabajar y subir (subagentes, commit + push en cada punto estable), revisar (código, gw-opt-tokens y retro con la persona), publicar (marca de revisado; sin ella el gancho rechaza) | `src/data/proyectos/galivelop-workflow.json`, `pasos` (líneas 272-360) |
| Repositorio: https://github.com/Zeldris/Galivelop-workflow | `src/data/proyectos/galivelop-workflow.json` (enlaces[0]) |
| Ficha: https://zeldris.github.io/Portal-Galivelop/proyectos/galivelop-workflow/ | ruta de la ficha, slug `galivelop-workflow` en `src/data/proyectos/galivelop-workflow.json` |

## Images

| Image | Alt text | Channels |
|---|---|---|
| `media/diagrama.png` | es: Diagrama de flujo de una tarea en cinco pasos: retomar, elegir, trabajar y subir, revisar y publicar; una flecha discontinua devuelve lo aprendido a una versión nueva para todos los proyectos | linkedin |
| `media/diagrama.webp` | es: Diagrama de flujo de una tarea en cinco pasos: retomar, elegir, trabajar y subir, revisar y publicar; una flecha discontinua devuelve lo aprendido a una versión nueva para todos los proyectos | — |
| `media/portada.png` | es: Esquema del flujo de una tarea: bitácora, gw-selector, gw-orchestrate-dealer, commit y push con sus ganchos, revisión, gw-opt-tokens y retro, marca de revisado y main; abajo, gw-harvest y gw-update llevan las mejoras a una versión nueva | linkedin |

## Internal use

- Imagen: la portada publicada de la ficha (`public/proyectos/galivelop-workflow/portada.webp`), pasada a PNG porque LinkedIn no admite WebP; copia de la fuente en `media/source/portada.webp`.
- Rama: `ccr-6aa8bbd7-86cgbe`. La presentación en vídeo sigue aparcada hasta la semana del 2026-11-09; esta pieza no la sustituye.

## Published

| Channel | Language | Date | Link |
|---|---|---|---|
