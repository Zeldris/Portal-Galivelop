#!/bin/bash
# Prueba los ganchos y scripts de tools/qa (retro del 2026-10-21): sintaxis de todos y la regla de .githooks/pre-push
# para subir a main, en un clon temporal (código sin marca, marca + contenido, código tras la marca, main desconocido).
set -uo pipefail
raiz="$(cd "$(dirname "$0")/../../.." && pwd)"
fallos=0
for f in "$raiz"/.githooks/pre-push "$raiz"/.claude/hooks/*.sh "$raiz"/tools/qa/*.sh; do
  bash -n "$f" || { echo "test-ganchos: sintaxis rota en ${f#$raiz/}"; fallos=1; }
done
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
git -C "$tmp" init -q -b main r && cd "$tmp/r"
G=(git -c user.email=t@t -c user.name=t -c core.hooksPath=/dev/null)
mkdir -p .githooks tools/qa docs/registros src/data
cp "$raiz/.githooks/pre-push" .githooks/; cp "$raiz/tools/qa/es-codigo.sh" tools/qa/
echo a > src/data/a.json; echo d > docs/d.md; "${G[@]}" add -A; "${G[@]}" commit -qm base; base=$(git rev-parse HEAD)
echo x > src/codigo.ts; "${G[@]}" add -A; "${G[@]}" commit -qm codigo; con_codigo=$(git rev-parse HEAD)
echo "$con_codigo" > docs/registros/revisado.txt; "${G[@]}" add -A; "${G[@]}" commit -qm marca
echo y >> docs/d.md; "${G[@]}" commit -qam contenido; marcado=$(git rev-parse HEAD)
echo z >> src/codigo.ts; "${G[@]}" commit -qam mas; tras_marca=$(git rev-parse HEAD)
caso() {  # caso <nombre> <sale 0|1> <sha local> <sha remoto>
  echo "refs/heads/x $3 refs/heads/main $4" | PREPUSH_SIN_CHECK=1 bash .githooks/pre-push > /dev/null 2>&1
  local r=$?; [ "$r" = "$2" ] || { echo "test-ganchos: «$1» salió $r y se esperaba $2"; fallos=1; }
}
caso "código sin marca" 1 "$con_codigo" "$base"
caso "marca y contenido después" 0 "$marcado" "$base"
caso "código tras la marca" 1 "$tras_marca" "$base"
caso "solo contenido" 0 "$base" "$base"
caso "main remoto desconocido" 1 "$marcado" 1111111111111111111111111111111111111111
[ $fallos = 0 ] && echo "test-ganchos: ganchos en verde (sintaxis y regla de main)."
exit $fallos
