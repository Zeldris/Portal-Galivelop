# Skills y selector de modelo

**Para qué:** qué skills usa Claude en el portal, cuándo, y con qué modelo conviene cada tipo de tarea. Traído
del flujo de trabajo de Tarkor (World-Maker-Fantasy) a petición del usuario (2026-10-21) y adaptado a una web
pequeña: sin roadmap con hitos ni rondas de pruebas jugando.

**`.claude/skills/`, `.claude/hooks/` y `.claude/settings.json` están versionados**; el resto de `.claude/` es
local y está en el `.gitignore`. Si una skill no está cargada, se sigue su descripción de aquí.

## El flujo de una tarea

Cada skill se carga con la herramienta Skill (no basta con nombrarla); `/grill-with-docs` solo lo lanza el usuario.

1. **Empezar:** cargar `selector`, clasificar la tarea con su tabla y decir en una línea qué skill y qué modelo
   pide. Antes, traer `main` a la rama de trabajo (`git fetch origin main` y, si trae commits, `git merge
   origin/main`): la tarea semanal y el usuario también suben a `main`.
   **Puntos de `/clear`:** la compactación automática (200k) es la red; el corte limpio es un `/clear` tras subir
   a `main` o al cerrar un bloque grande. Antes de recomendarlo, todo con commit y push y la bitácora al día;
   Claude lo dice en una línea («Punto de `/clear`: todo subido (`<commit>`)») y no puede lanzarlo. Tras un
   `/clear` o una compactación, el gancho de `SessionStart` pone el estado (`tools/qa/recuperar.py --estado`); un
   detalle de antes se busca con `python3 tools/qa/recuperar.py "<regex>"`.
2. **Si hay diseño o una decisión abierta:** `grilling` + `domain-modeling` (o `/grill-with-docs`). Variantes de
   pantalla, con `prototype` (rama de UI). Lo decidido, a la bitácora; los términos, a `GLOSSARY.md`; lo difícil
   de revertir (rutas, estructura de datos de los proyectos), a `docs/adr/`.
3. **Implementar** por pasos pequeños, con `npm run check` en verde y commit + push en cada punto estable
   (`CLAUDE.md`). Para cambios visibles, captura con Playwright en escritorio y móvil (390 px) y comprobación de
   que no hay desborde horizontal. Antes del commit de un arreglo, «Un dato, un sitio» de
   [`REVIEW.md`](../../REVIEW.md): `grep` de los otros sitios que hacen lo mismo.
4. **Si algo falla** (test rojo, error en consola, se ve mal): `diagnosing-bugs` antes de tocar el código.
5. **Antes de subir a `main`** (solo con confirmación del usuario, salvo la tarea semanal):
   - Cambio de contenido (textos, imágenes, novedades): `npm run check`, build y una captura; basta.
   - Cambio de código (componentes, estilos, `scripts/`, `main.tsx`, rutas): `git fetch origin main` y
     `/code-review` del diff contra `origin/main` con el criterio de [`REVIEW.md`](../../REVIEW.md); se arregla lo
     que encuentre. Si el cambio es grande, después `/opt-tokens` y `retro`: sus propuestas se presentan al
     usuario y solo lo que confirme se aplica. Luego `bash tools/qa/revisado.sh` y el resumen con `pr`.
   - Si se trabaja con PR en vez de subir directo, el gancho `revision-antes-de-main.sh` no deja crearlo ni
     fusionarlo sin la marca de `revisado.sh` del mismo commit, ni fusionarlo con el CI sin terminar en verde.
   Al contárselo al usuario, el destino con su nombre: «en la rama de trabajo, no en `main`» o «en `main`».

## Skills

| Skill | Se invoca | Cuándo, en el portal |
|---|---|---|
| `selector` (propia) | sola, al empezar | Siempre, al arrancar una tarea, un fallo o un diseño |
| `orchestrate-dealer` (propia) | Claude, en tareas de varios pasos con lecturas largas | Repasar el repo de un proyecto, un banco de imágenes, revisar muchas páginas |
| `/grill-with-docs` | el usuario | Antes de diseñar algo grande: un proyecto nuevo en el portal, una sección nueva, la marca |
| `grilling` | Claude, en una decisión abierta | La entrevista en sí, por rondas con respuesta recomendada |
| `domain-modeling` | por debajo de la anterior | `GLOSSARY.md` y `docs/adr/` |
| `diagnosing-bugs` | sola ante un fallo | Algo que se ve mal o falla: primero reproducirlo (Playwright, un test) |
| `/improve-codebase-architecture` | el usuario o de vez en cuando | Candidatos: `Proyecto.tsx`, `Galeria.tsx`, `global.css` |
| `codebase-design` | por debajo de la anterior | — |
| `opt-tokens` | Claude antes de subir un cambio grande, o el usuario | Medir el gasto de la sesión (`medir.py`) y proponer cómo gastar menos |
| `retro` | Claude tras un cambio grande, o el usuario con `/retro` | Mejoras del entorno: comprobaciones, instrucciones, herramientas |
| `writing-for-agents` | sola | Al tocar `CLAUDE.md`, la bitácora, el prompt de la tarea semanal o una skill |
| `prototype` | Claude, en una ronda de diseño | Variantes de una sección o tarjeta para elegir; se publica como Artifact |
| `research` | Claude o el usuario | Investigar con fuentes primarias (SEO, accesibilidad, Pages); notas en `docs/investigacion/` |
| `pr` | Claude, al subir a `main` | Resumen del cambio con evidencia (`npm run check`, build, capturas) y su peligro |

## Selector de modelo

Tres tamaños: **grande** (Opus), **medio** (Sonnet), **ligero** (Haiku). La tabla está en el `selector`.

- El modelo de la sesión lo elige el usuario con `/model`; Claude no puede cambiarlo. Si la tarea pide otro, lo
  dice en una línea al empezar y sigue.
- Claude sí elige el modelo de los **subagentes**. El diseño y las decisiones nunca se delegan.
- **Planificar con el grande, escribir con el medio:** con el plan cerrado, la implementación acotada va a un
  subagente `sonnet` y la sesión principal revisa su diff.
- En la duda, el de más riesgo.
