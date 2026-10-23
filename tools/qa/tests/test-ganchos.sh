#!/bin/bash
# Prueba los ganchos y scripts del flujo (Galivelop-workflow, en .githooks/ y .claude/gw/scripts/) con la
# configuración del portal (.claude/gw.json): sintaxis de todos y la regla de .githooks/pre-push para subir a main, en
# un clon temporal aislado de la configuración de git del equipo y con un `npm` simulado (la regla de main se prueba
# sin repetir los tests). Los casos de «contenido» son los de la tarea semanal: tiene que poder publicar sola.
set -uo pipefail
raiz="$(cd "$(dirname "$0")/../../.." && pwd)"
fallos=0
for f in "$raiz"/.githooks/* "$raiz"/.claude/gw/scripts/*.sh "$raiz"/tools/qa/tests/*.sh; do
  bash -n "$f" || { echo "test-ganchos: sintaxis rota en ${f#$raiz/}"; fallos=1; }
done
for f in "$raiz"/.claude/gw/scripts/*.py "$raiz"/.claude/skills/*/scripts/*.py; do
  [ -f "$f" ] || continue
  python3 -c 'import ast, sys; ast.parse(open(sys.argv[1]).read())' "$f" 2>/dev/null \
    || { echo "test-ganchos: Python roto en ${f#$raiz/}"; fallos=1; }
done
python3 "$raiz/.claude/gw/scripts/config.py" --root "$raiz" validate > /dev/null \
  || { echo "test-ganchos: .claude/gw.json no es válido"; fallos=1; }
# Claves de .claude/gw.json que el pre-push lee del commit que se sube, fijadas aquí (retro 2026-10-22, F18 del
# piloto): frena un cambio accidental (que ampliaría lo que llega a main sin marca o cambiaría qué se comprueba), no
# uno deliberado que toque también este test; eso lo arregla el flujo (F18). Si se cambian a propósito, aquí también.
cfg() { python3 "$raiz/.claude/gw/scripts/config.py" --root "$raiz" get "$@"; }
fijar() {  # fijar <clave> <valor esperado> [--json]
  local real; real="$(cfg "$1" ${3:-})" || { echo "test-ganchos: no pude leer $1 de .claude/gw.json"; fallos=1; return; }
  [ "$real" = "$2" ] || { echo "test-ganchos: $1 de .claude/gw.json cambió; si es a propósito, cámbialo también aquí: $real"; fallos=1; }
}
fijar content '["^docs/", "^src/data/.*\\.json$", "^public/.*\\.(webp|png|jpe?g|svg|ico)$", "^(README|GLOSSARY|REVIEW|CLAUDE|AGENTS)\\.md$", "^\\.claude/skills/.*\\.md$"]' --json
fijar check '["npm run check"]' --json
fijar reviewMark docs/registros/revisado.txt
fijar protectedBranch main
fijar pushToProtected direct
# Lo versionado del flujo y de este test no puede estar en el .gitignore del repo (F3 del piloto: .claude/* ocultaba
# .claude/gw.json). Solo el .gitignore del repo: el global de cada equipo no cuenta.
for f in .claude/gw.json .claude/gw/scripts/config.py .claude/gw/scripts/es-codigo.sh .claude/gw/scripts/revisado.sh \
         .claude/gw/schema/gw.schema.json .claude/skills/retro/SKILL.md .claude/settings.json .githooks/pre-push \
         .githooks/pre-commit .github/workflows/comprobar.yml tools/qa/tests/test-ganchos.sh; do
  git -C "$raiz" -c core.excludesFile=/dev/null check-ignore -q --no-index "$f" \
    && { echo "test-ganchos: $f está en el .gitignore y no se subiría"; fallos=1; }
done
tmp="$(mktemp -d)" || exit 1
trap 'rm -rf "$tmp"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
unset CLAUDECODE
# Montaje: cualquier fallo aquí para el test (nunca sigue en la carpeta del repo).
(
  set -e
  git -C "$tmp" init -q r && cd "$tmp/r"
  git symbolic-ref HEAD refs/heads/main
  git config user.email t@t; git config user.name t; git config commit.gpgsign false; git config core.hooksPath /dev/null
  mkdir -p .githooks .claude/gw docs/registros src/data public bin
  cp "$raiz/.githooks/pre-push" .githooks/; cp -R "$raiz/.claude/gw/scripts" "$raiz/.claude/gw/schema" .claude/gw/; cp "$raiz/.claude/gw.json" .claude/
  printf '#!/bin/sh\nexit 0\n' > bin/npm; chmod +x bin/npm
  echo bin/ > .gitignore
  echo a > src/data/a.json; echo d > docs/d.md; git add -A; git commit -qm base; git tag base
  echo x > src/codigo.ts; git add -A; git commit -qm codigo; git tag codigo
  git rev-parse HEAD > docs/registros/revisado.txt; git add -A; git commit -qm marca
  echo y >> docs/d.md; git commit -qam contenido; git tag marcado
  echo z >> src/codigo.ts; git commit -qam mas; git tag tras-marca
  # Semana tipo de la tarea semanal sobre lo ya publicado (marcado): ficha, imagen y bitácora.
  git checkout -q -b semanal marcado
  echo b >> src/data/a.json; echo img > public/nueva.webp; echo e >> docs/d.md; git add -A; git commit -qm semana
  git tag semana
  git checkout -q -b otra base
  echo c >> src/data/a.json; git commit -qam solo-contenido; git tag solo-contenido
  echo w > src/otro.ts; git add -A; git commit -qm codigo-otra
  mkdir -p docs/registros; git rev-parse codigo > docs/registros/revisado.txt; git add -A; git commit -qm marca-ajena; git tag marca-ajena
  echo basura > docs/registros/revisado.txt; git commit -qam marca-basura; git tag marca-basura
  # Qué es código y qué contenido con el `content` del portal (una ruta por regla).
  git checkout -q -b rama-tipos base
  mkdir -p .claude/skills/x/scripts public
  for f in .claude/skills/x/SKILL.md .claude/skills/x/scripts/a.py public/a.html public/b.webp public/c.png AGENTS.md \
           CLAUDE.md README.md docs/x.md src/data/p.json src/data/p.ts src/x.md .claude/gw/opt-tokens.md package.json; do
    echo t > "$f"
  done
  git add -A; git commit -qm tipos; git tag tipos
  git checkout -q -b flujo marcado
  echo '# cambio' >> .claude/gw/scripts/es-codigo.sh; git commit -qam flujo; git tag cambio-flujo
) || { echo "test-ganchos: no pude montar el repo de prueba"; exit 1; }
cd "$tmp/r" || exit 1
export PATH="$tmp/r/bin:$PATH"
sha() { git rev-parse "$1^{commit}"; }
caso() {  # caso <nombre> <sale 0|1> <sha local> <sha remoto> [<motivo esperado en la salida>]
  local salida r
  if [ "$2" = 1 ] && [ -z "${5:-}" ]; then echo "test-ganchos: «$1» espera un rechazo sin decir el motivo"; fallos=1; return; fi
  salida="$(echo "refs/heads/x $3 refs/heads/main $4" | bash .githooks/pre-push origin 2>&1)"; r=$?
  [ "$r" = "$2" ] || { echo "test-ganchos: «$1» salió $r y se esperaba $2"; echo "$salida" | tail -n 3; fallos=1; return; }
  if [ -n "${5:-}" ] && ! printf '%s\n' "$salida" | grep -q -- "$5"; then
    echo "test-ganchos: «$1» no dice «$5»"; echo "$salida" | tail -n 3; fallos=1
  fi
}
B=$(sha base)
caso "código sin marca"                    1 "$(sha codigo)"         "$B" "has no review mark"
caso "marca y contenido después"           0 "$(sha marcado)"        "$B"
caso "código tras la marca"                1 "$(sha tras-marca)"     "$B" "code changed after the review mark"
caso "solo contenido"                      0 "$(sha solo-contenido)" "$B"
caso "marca de otra rama"                  1 "$(sha marca-ajena)"    "$B" "is not an ancestor"
caso "marca basura"                        1 "$(sha marca-basura)"   "$B" "which is not a commit"
caso "tarea semanal sobre main publicado"  0 "$(sha semana)"         "$(sha marcado)"
caso "tarea semanal desde la base"         0 "$(sha semana)"         "$B"
caso "script del flujo tras la marca"      1 "$(sha cambio-flujo)"   "$(sha marcado)" "code changed after the review mark"
caso "main nuevo (remoto vacío)"           1 "$(sha codigo)"         0000000000000000000000000000000000000000 "has no review mark"
caso "main remoto desconocido"             1 "$(sha marcado)"        1111111111111111111111111111111111111111 "which this clone does not have"
# es-codigo.sh: exactamente estos son código entre base y tipos.
esperado=".claude/gw/opt-tokens.md
.claude/skills/x/scripts/a.py
package.json
public/a.html
src/data/p.ts
src/x.md"
obtenido="$(bash .claude/gw/scripts/es-codigo.sh "$B" "$(sha tipos)" | sort)"
[ "$obtenido" = "$esperado" ] || { echo "test-ganchos: es-codigo.sh clasifica mal; código:"; echo "$obtenido" | sed 's/^/  /'; fallos=1; }
# pre-commit (como agente) sobre un commit tipo de la tarea semanal: ficha, imagen y bitácora pasan.
cp "$raiz/.githooks/pre-commit" .githooks/
git checkout -q semana 2>/dev/null
echo '{"novedades": [{"fecha": "2026-10-25", "texto": {"es": "Arte nuevo", "gl": "Arte novo", "en": "New art"}}]}' > src/data/a.json
echo img2 > public/otra.webp; echo "- Revisión semanal: 1 novedad." >> docs/d.md; git add -A
salida="$(CLAUDECODE=1 bash .githooks/pre-commit 2>&1)" \
  || { echo "test-ganchos: el pre-commit rechaza un commit de la tarea semanal:"; echo "$salida" | tail -n 5; fallos=1; }
git reset -q --hard
[ $fallos = 0 ] && echo "test-ganchos: ganchos en verde (sintaxis, config, content, pre-commit y regla de main)."
exit $fallos
