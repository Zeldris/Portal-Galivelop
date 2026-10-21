---
name: orchestrate-dealer
description: La sesión principal como orchestrator que reparte el trabajo a subagentes de contexto limpio, para trabajar mucho rato sin `/clear`. Usar en tareas de varios pasos con lecturas largas (repasar el repo de un proyecto, un banco de imágenes, revisar muchas páginas) y cuando el contexto de la sesión pase de ~150k.
---

# orchestrate-dealer

La sesión principal es el **orchestrator**: guarda el plan, las decisiones y el hilo con el usuario, y reparte
cada trozo de trabajo a un subagente que empieza con el contexto vacío. La principal solo recibe un resumen corto
y crece despacio. Si aun así llega al tope, la compactación automática (`CLAUDE_CODE_AUTO_COMPACT_WINDOW`, 200k) y
el gancho de `tools/qa/recuperar.py --estado` son la red.

## Qué se queda en la principal y qué se reparte

| Orchestrator (principal) | Subagente |
|---|---|
| Hablar con el usuario, preguntar, presentar | Leer el repo de un proyecto, docs largos, logs |
| Partir la tarea en trozos y escribir cada encargo | Implementar un trozo acotado y pasar `npm run check` |
| Decidir (qué se muestra, qué imagen va dónde, qué se publica) | Convertir imágenes, montar hojas de contacto, capturas con Playwright |
| Revisar lo que vuelve: `git log -1 --stat`, nunca el diff entero salvo duda | Commit y push de su trabajo, con la bitácora en el mismo commit |
| `/code-review`, `/opt-tokens`, `/retro` y subir a `main` | — |

Una lectura de más de ~200 líneas o una salida larga en la principal es un trozo que no se repartió.

## Pasos

1. **Partir.** Con el `selector` ya aplicado, divide la tarea en trozos que un subagente cierre de una vez, cada
   uno con su criterio de hecho comprobable (un `npm run check` en verde, una captura, un commit subido).
2. **Repartir.** Un subagente por trozo con `Agent`, en primer plano cuando el siguiente trozo depende de él.
   Modelo y esfuerzo por la escalera del `selector`. El encargo lleva **punteros**, no copias:

   ```text
   Trabajas en el portal Galivelop, rama <rama>. Lee CLAUDE.md y docs/traspaso.md.
   Encargo: <qué, en una o dos frases>.
   Hecho cuando: <criterio comprobable>.
   No hagas: <lo que es de otro trozo o pide decisión del usuario>.
   Todo texto visible, en castellano, gallego e inglés. Si algo pide decidir al usuario, para y devuélvelo como pregunta.
   Devuelve como mucho 15 líneas: HECHO · COMMIT: <sha> · FALTA · PREGUNTAS.
   ```

3. **Revisar lo que vuelve.** `git fetch` + `git log -1 --stat` y que el criterio de hecho se cumple. Si no
   cierra, el reintento sube un peldaño; dos fallos, se para y se le cuenta al usuario.
4. **Seguir.** Siguiente trozo. Al usuario, una línea por trozo cerrado; el detalle está en la bitácora.

## Reglas

- **Sin worktree, uno a la vez en la misma rama**: dos subagentes que hacen commit en la rama de trabajo chocan en
  la bitácora. En paralelo, solo lo que no escribe (buscar, leer, medir).
- **El subagente no habla con el usuario**: lo que necesite de él vuelve como `PREGUNTAS`.
- **Repos de otros proyectos, solo lectura** (`CLAUDE.md`): el encargo lo repite siempre.
