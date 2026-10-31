# Retro 2026-10-31: textos legales, pie y sesión del día

**Estado:** aprobada entera por la persona el 2026-10-31. Aplicadas en la rama T2, R1 (más la regla de `REVIEW.md` sobre enlaces al código, que seguía diciendo que los repos son privados), R2 y R4. T1 la aplica la persona en el entorno de la nube; R3 se aplaza a una sesión nueva con `/gw-update`.

Lo revisado: los commits `20ef2dc` y `6527d7e` de `ccr-83ea043c-r1gbyp` (aviso legal, privacidad, términos, licencias
y pie nuevo), y la sesión del día (repos públicos, README del flujo, pieza de Reddit, revisión legal de toVeriAI).

## Medida (opt-tokens)

- Sesión entera: 548 llamadas, contexto medio 225k (suelo 114k, techo 383k), 1 compactación; 98 % de lectura de
  caché. Desde `20ef2dc`: 17 llamadas a 374k de media.
- `CLAUDE_CODE_AUTO_COMPACT_WINDOW` no está en el entorno, y la sesión se abrió en `/home/user`: el tope de 200k
  de `.claude/settings.json` no se aplicó. Por eso el contexto llegó a 383k sin compactar.
- Seis tareas seguidas sin `/clear`, con cuatro subidas a `main` por medio, aunque `.claude/gw/opt-tokens.md` ya dice
  «`/clear` al llegar a `main`»: esa nota no está en lo que se carga siempre.
- Bash, 362 llamadas y 42M arrastrados; `docs/traspaso.md` leído 44 veces (casi todo en el primer tramo).

## Propuestas

### T1 · La ventana de compactación, en el entorno de la nube (la persona; ahorro mayor)

Poner `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000` en las variables del entorno de la nube (ajustes del entorno, «Edit»).
Las sesiones con el tope aplicado rondaron los 112-124k de media frente a los 225k de hoy: cerca de la mitad de la
entrada por llamada. **Riesgo:** compactar antes pierde detalle de la conversación; lo cubren la bitácora y
`recuperar.py --buscar`, que es para lo que están.

### T2 · Pedir `/clear` al cerrar cada tarea, en `AGENTS.md` (proyecto; 1 línea)

Cambiar en «Relevos» la línea «Al cerrar una fase (o una tarea grande)… se recomienda `/clear`» por la de la
versión 0.4 del flujo: «Al cerrar cada tarea o PR (y cada fase), con todo subido y la bitácora al día, se pide a la
persona un `/clear` en una línea, con el porqué». La nota de `opt-tokens.md` no se cargaba y hoy no se siguió.
**Riesgo:** ninguno; la bitácora basta para retomar.

### R1 · Comprobación: la privacidad nombra lo que guarda el código (proyecto; test)

Un test en `src/data/legal.test.ts` que falle si `privacidad.json` no nombra cada clave de `localStorage` del código
(`CLAVE_GUARDADA` de `Idioma.tsx` y `Tema.tsx`, y la de `index.html`) o si `index.html` carga un script o una hoja de
otro dominio. Hoy la revisión encontró dos desajustes entre el texto y el código; esta parte es mecánica y la puede
vigilar un test. Y una línea en `REVIEW.md`: un cambio en formularios, correos de contacto (`contacto` de una ficha,
`colabora` de un miembro) o recursos de terceros revisa `src/data/legal/privacidad.json`.

### R2 · «Añadir una página»: su cuerpo en la página estática (proyecto; 1 línea)

En `docs/desarrollo.md`, «Añadir una página»: «si la página tiene contenido propio, su rama en `cuerpo()` de
`scripts/paginas-estaticas.mjs`; sin ella, la página estática solo lleva título y descripción». Se olvidó en los
textos legales (hallazgo 2 de la revisión).

### R3 · Ponerse en la versión 0.4.2 del flujo (sesión nueva, con `/gw-update`)

El portal va en la 0.3.0 y el flujo en la 0.4.2: hoy faltó `gw-media-content` (se usó la copia de World-Maker-Fantasy)
y la regla de T2. `/gw-update` enseña los cambios de plantillas antes de aplicar lo que confirme la persona.
**Riesgo:** pisar ajustes propios; `gw-update` los enseña antes. En una sesión aparte, abierta desde el repo.

### R4 · Reddit no se lee desde la nube (proyecto; nota)

En `.claude/gw/opt-tokens.md`: Reddit responde 403 a la nube (también `old.reddit.com`, la API y `WebFetch`); se pide
a la persona el texto pegado o una captura. Hoy se gastaron seis llamadas en comprobarlo.

## For Galivelop-workflow

- **G1 · Avisar si falta la ventana de compactación en la nube.** `session-start.sh` (o `doctor.py`) avisa cuando la
  sesión corre en la nube sin `CLAUDE_CODE_AUTO_COMPACT_WINDOW` en el entorno. Hoy lo decía una nota que nadie
  comprobó, y la media subió a 225k.
- **G2 · Sustituciones en varios archivos, todo o nada.** Dos veces un script de sustituciones se paró a mitad
  (una ficha sin cambiar, un generador roto) y hubo que rehacer solo lo que faltaba. Un `scripts/sustituir.py` que
  comprueba todos los patrones antes de escribir nada evitaría el estado a medias.
