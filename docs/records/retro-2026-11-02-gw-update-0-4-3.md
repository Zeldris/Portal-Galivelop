# Retro 2026-11-02 · `/gw-update` del flujo 0.3.0 → 0.4.3

Lo revisado: los commits de `ccr-83ea043c-r1gbyp` desde `ed78f76` (`a223d6f` actualización, `4bbf37d` fase 1) y la
bitácora. Medida de la sesión (`medir.py --hours 0`): 51 llamadas, contexto medio 154k (suelo 98k, techo 202k, sin
compactar), más un subagente de revisión (19 llamadas, 80k de arranque).

**Estado:** aprobada entera por la persona («Apruebo todo», 2026-11-02) y aplicada: T2 (nota en
`.claude/gw/opt-tokens.md`), R1 (`test-ganchos.sh` vigila Node 22 y `npm run build` en `comprobar.yml`, rojo
comprobado), R2 (`AGENTS.md` de 186 a 167 líneas: publicación semanal y mensaje de la marca en
`docs/runbooks/tarea-semanal.md#reglas` y `docs/desarrollo.md#mensaje`) y R3. P1-P4 quedan abajo para `gw-harvest`.

T1 la hace la persona en el entorno de la nube (variable de compactación y un entorno solo con el portal).

## Propuestas

### Gasto (`opt-tokens`)

- **T1 · Sesión del portal sin los otros repos y con tope de compactación** (proyecto, lo hace la persona). La sesión
  arrancó en `/home/user` con cuatro repos: cada llamada carga sus `CLAUDE.md`/`AGENTS.md` y sus listas de skills
  (~15k de un suelo de 98k), `.claude/settings.json` del portal no se carga (ni el tope de compactación ni los ganchos
  nuevos, que esta actualización trae) y `doctor.py` lo avisa. Arreglo: el entorno de la nube con
  `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000` y, para el portal, un entorno solo con `Portal-Galivelop` (los otros repos,
  por subagente cuando hagan falta, como ya dice «Costes conocidos»). Ahorro: ~15k × cada llamada. Riesgo: ninguno.
- **T2 · `/gw-update` con la salida de `aplicar.py` filtrada** (nota del proyecto + flujo). El ensayo y el
  `--update` sacaron el diff entero de `REVIEW.md` y `GLOSSARY.md` contra la plantilla (~300k arrastrados), que el
  paso 3 de la skill no usa (compara plantilla vieja con nueva). Aquí: nota en `.claude/gw/opt-tokens.md` con
  `aplicar.py … | grep -v '^  [-+ @]'`. Riesgo: ninguno; el diff útil sale del paso 3.

### Entorno (`retro`)

- **R1 · El CI del portal vigilado por su test** (proyecto, grave). `aplicar.py --update` reescribió
  `.github/workflows/comprobar.yml` como «update» y quitó Node 22, la caché de npm y el `npm run build` del portal,
  sin `.gw-nuevo`. Se vio a ojo. Arreglo: `tools/qa/tests/test-ganchos.sh` comprueba que `comprobar.yml` sigue
  corriendo `npm run build` y usa `node-version: 22`, como ya fija las claves de `gw.json`. Riesgo: ninguno.
- **R2 · `AGENTS.md` más corto** (proyecto). 186 líneas (`doctor.py` avisa a partir de 150), y se carga en cada
  llamada. «Publicación semanal» (16 líneas) y el mensaje de la marca (14) pasan a `docs/runbooks/tarea-semanal.md` y
  `docs/desarrollo.md`, con una línea de puntero cada una que conserve lo que manda (sin confirmación solo la tarea
  semanal; rama siempre publicable; solo contenido). Riesgo: una sesión que no siga el puntero; contrapeso: el
  `pre-push` ya rechaza código sin marca en `main`, y el puntero nombra los dos casos.
- **R3 · Hallazgos de archivos del flujo, a esta retro y no a la bitácora** (proyecto). La fase 1 los dejó en una
  línea larga de la bitácora; `gw-harvest` los recoge de `## For Galivelop-workflow` de las retros. Se mueven abajo y
  la bitácora queda con un puntero. Riesgo: ninguno.

## For Galivelop-workflow

- **P1 · `aplicar.py --update` pisa cambios locales de un archivo del flujo sin avisar.** `comprobar.yml` del portal
  llevaba líneas propias (`# Portal: …`) desde la 0.3.0; `aplicar.py` lo dio por «update v0.3.0 → v0.4.3» y lo
  reescribió. Debería comparar con su copia de la versión de la cabecera (`git show v0.3.0:<archivo>`) y, si difiere,
  dejar `.gw-nuevo`, como hace `--check` después.
- **P2 · `/gw-update` sobre un clon de una sola rama.** El clon `galivelop-workflow` seguía solo
  `claude/galivelop-workflow-inicio` (0.1.0) y `git pull --ff-only` no traía `main` ni las etiquetas. La skill, como
  `gw-init` desde la 0.4.3: `git ls-remote --tags --refs --sort=-v:refname` y la última etiqueta (`git fetch origin
  tag vX.Y.Z`), sin depender de la rama del clon.
- **P3 · `aplicar.py --dry-run` sin el diff proyecto-contra-plantilla de los archivos rellenados** (o tras
  `--verbose`): el paso 3 de `gw-update` ya da el que importa, y ese otro cuesta ~300k arrastrados por sesión (T2).
- **P4 · Hallazgos del `/code-review` de la fase 1** (ninguno empeora lo que hay en `main` del portal, que no tiene
  esos ganchos):
  1. `guardia-config.py` no protege `.claude/settings.local.json`, que puede apagar los ganchos.
  2. Ni las rutas protegidas dentro de `.claude/worktrees/<agente>/`.
  3. Ni `find -exec rm`, `tar -C`, `unzip -d`, `awk -i inplace`, `git apply`, `patch`, `git checkout <rama>` o
     `git stash pop`.
  4. Falso positivo con `touch -r`, `chmod --reference=` y `chown --reference=`.
  5. `tope-subagentes.py` guarda su contador en `/tmp` con nombre fijo y sigue enlaces (`O_NOFOLLOW` o carpeta por
     usuario).
  6. `commit-msg` corta cualquier commit, también un `WIP:`, si `.claude/gw.json` no se lee, aunque el commit no lleve
     la bitácora.
  7. La marca `gw-push-en-curso` del `pre-push` guarda la rama remota (la documentación dice local) y dos subidas
     desde worktrees se la pisan.
  8. El paso «Git hooks path» de `comprobar.yml` dice que `doctor.py` está en el check; va solo cuando lo está.
  9. El aviso de «sesión fuera del repo» calla en la nube aunque la sesión arranque en `/home/user` con varios repos y
     no cargue `.claude/settings.json`: que avise según falten los ganchos, no según la carpeta (revisa la P1 del
     portal de la 0.4.1).
  10. `prepush-ramas.sh` solo mira la bitácora en la punta subida (a propósito desde la 0.4.2): un commit intermedio
      con la bitácora rota queda en el remoto; decidir si basta.
