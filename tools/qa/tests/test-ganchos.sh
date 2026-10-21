#!/bin/bash
# Prueba los ganchos y scripts de tools/qa (retro del 2026-10-21): sintaxis de todos y la regla de .githooks/pre-push
# para subir a main, en un clon temporal aislado de la configuración de git del equipo y con un `npm` simulado (la
# regla de main se prueba sin repetir los tests).
set -uo pipefail
raiz="$(cd "$(dirname "$0")/../../.." && pwd)"
fallos=0
for f in "$raiz"/.githooks/pre-push "$raiz"/.claude/hooks/*.sh "$raiz"/tools/qa/*.sh "$raiz"/tools/qa/tests/*.sh; do
  bash -n "$f" || { echo "test-ganchos: sintaxis rota en ${f#$raiz/}"; fallos=1; }
done
for f in "$raiz"/tools/qa/*.py "$raiz"/.claude/skills/opt-tokens/medir.py; do
  python3 -m py_compile "$f" 2>/dev/null || { echo "test-ganchos: Python roto en ${f#$raiz/}"; fallos=1; }
done
tmp="$(mktemp -d)" || exit 1
trap 'rm -rf "$tmp"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
# Montaje: cualquier fallo aquí para el test (nunca sigue en la carpeta del repo).
(
  set -e
  git -C "$tmp" init -q r && cd "$tmp/r"
  git symbolic-ref HEAD refs/heads/main
  git config user.email t@t; git config user.name t; git config commit.gpgsign false; git config core.hooksPath /dev/null
  mkdir -p .githooks tools/qa docs/registros src/data bin
  cp "$raiz/.githooks/pre-push" .githooks/; cp "$raiz/tools/qa/es-codigo.sh" tools/qa/
  printf '#!/bin/sh\nexit 0\n' > bin/npm; chmod +x bin/npm
  echo a > src/data/a.json; echo d > docs/d.md; git add -A; git commit -qm base; git tag base
  echo x > src/codigo.ts; git add -A; git commit -qm codigo; git tag codigo
  git rev-parse HEAD > docs/registros/revisado.txt; git add -A; git commit -qm marca
  echo y >> docs/d.md; git commit -qam contenido; git tag marcado
  echo z >> src/codigo.ts; git commit -qam mas; git tag tras-marca
  git checkout -q -b otra base
  echo c >> src/data/a.json; git commit -qam solo-contenido; git tag solo-contenido
  echo w > src/otro.ts; git add -A; git commit -qm codigo-otra
  mkdir -p docs/registros; git rev-parse codigo > docs/registros/revisado.txt; git add -A; git commit -qm marca-ajena; git tag marca-ajena
  echo basura > docs/registros/revisado.txt; git commit -qam marca-basura; git tag marca-basura
) || { echo "test-ganchos: no pude montar el repo de prueba"; exit 1; }
cd "$tmp/r" || exit 1
export PATH="$tmp/r/bin:$PATH"
sha() { git rev-parse "$1^{commit}"; }
caso() {  # caso <nombre> <sale 0|1> <sha local> <sha remoto>
  echo "refs/heads/x $3 refs/heads/main $4" | bash .githooks/pre-push > /dev/null 2>&1
  local r=$?; [ "$r" = "$2" ] || { echo "test-ganchos: «$1» salió $r y se esperaba $2"; fallos=1; }
}
B=$(sha base)
caso "código sin marca"            1 "$(sha codigo)"         "$B"
caso "marca y contenido después"   0 "$(sha marcado)"        "$B"
caso "código tras la marca"        1 "$(sha tras-marca)"     "$B"
caso "solo contenido"              0 "$(sha solo-contenido)" "$B"
caso "marca de otra rama"          1 "$(sha marca-ajena)"    "$B"
caso "marca basura"                1 "$(sha marca-basura)"   "$B"
caso "main nuevo (remoto vacío)"   1 "$(sha codigo)"         0000000000000000000000000000000000000000
caso "main remoto desconocido"     1 "$(sha marcado)"        1111111111111111111111111111111111111111
[ $fallos = 0 ] && echo "test-ganchos: ganchos en verde (sintaxis y regla de main)."
exit $fallos
