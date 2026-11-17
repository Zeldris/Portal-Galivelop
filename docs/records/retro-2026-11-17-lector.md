# Retro 2026-11-17: guiones que faltaban y lector de la página

**Estado:** aprobada entera por la persona (2026-11-17: «apruebo todo»): P1, P2, P3, P4 y la propuesta para el flujo. Se aplican tras subir el lector a `main`.

Revisado: lo que entra en `main` desde f507753 (guiones de las siete páginas, lector con enfoques, arreglos de la
fase 1) y la bitácora. Gasto medido con `gw-opt-tokens`: sesión principal 63 llamadas, contexto medio 102k (techo
144k, sin compactar); 7 subagentes (5 `sonnet`, 2 `opus`), 3,3 M de entrada.

## Propuestas

- **P1 (proyecto, acceso a información). Probar el lector sin la persona.** Los dos fallos visibles (el fondo del
  resaltado borraba el texto blanco de la portada; la sección alta se quedaba vacía en pantalla) los vio la persona,
  porque ningún agente pudo abrir un navegador. Script `tools/qa/probar-lector.cjs` (Playwright, como las auditorías,
  tras `npm run build`): abre inicio y Tarkor en escritorio y móvil, pulsa play con el audio acelerado, y en cada
  trozo y enfoque guarda una captura y comprueba que el elemento resaltado está dentro de la ventana y no tapado por
  la barra. Coste: un script de ~100 líneas. Riesgo: ninguno; no entra en `npm run check` (pide Playwright).
- **P2 (proyecto, `gw-portal`). Enfoques al día.** Al reescribir un trozo o cambiar hitos o características de una
  ficha, `gw-portal` revisa los `enfoques` de ese guion (el test ya falla si una frase desaparece, pero no si el
  `hito-N` pasa a ser otro). Una línea en «Guiones de lectura» de `.claude/skills/gw-portal` y de `proyectos.md`.
  Riesgo: ninguno.
- **P3 (proyecto, barrido). Tarea B de los leves del lector** (`pending.md`, «Lector: leves de la revisión»): anclas
  estables en vez de `hito-N`/`caracteristica-N` en `src/pages/Proyecto.tsx`, `LectorCarga` sin `es` fijo y
  `guion.test.tsx` leyendo los guiones del disco. Los tres tocan el lector; juntos, un solo PR pequeño.
- **P4 (gasto). `/clear` tras subir a `main`.** El contexto medio (102k) ya va cerca del techo; la bitácora basta.

## For Galivelop-workflow

- **`before-stop.py` con subagentes trabajando.** El gancho exige commit en cuanto el árbol está sucio, aunque haya
  un subagente en segundo plano editando esos archivos: obligó a cinco commits intermedios (uno con solo
  `pending.md` mientras el subagente tocaba `src/`), unas 5 llamadas × 100k de contexto. Propuesta: que el gancho no
  bloquee si hay tareas de subagente en curso, o que solo avise.
