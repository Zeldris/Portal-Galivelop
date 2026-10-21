#!/bin/bash
# Tras el `/code-review` del diff contra main y sus arreglos subidos (paso 5 de
# docs/runbooks/skills-y-modelos.md), marca el commit revisado. Lo leen `.githooks/pre-push` (subida directa a
# main con cambios de código) y `.claude/hooks/revision-antes-de-main.sh` (PR a main).
set -euo pipefail
raiz="$(git rev-parse --show-toplevel)"
if [ -n "$(git -C "$raiz" status --porcelain)" ]; then
  echo "Hay cambios sin commit o archivos nuevos sin añadir: súbelos y vuelve a revisar antes de marcar." >&2
  exit 1
fi
rama="$(git -C "$raiz" rev-parse --abbrev-ref HEAD)"
git -C "$raiz" fetch -q origin main "$rama" || { echo "No pude traer origin/main ni origin/$rama." >&2; exit 1; }
if [ "$(git -C "$raiz" rev-parse HEAD)" != "$(git -C "$raiz" rev-parse "origin/$rama")" ]; then
  echo "HEAD no coincide con origin/$rama: sube los arreglos antes de marcar." >&2
  exit 1
fi
if ! git -C "$raiz" merge-base --is-ancestor origin/main HEAD; then
  echo "La rama no incluye el último origin/main: git merge origin/main, revisa otra vez y marca." >&2
  exit 1
fi
git -C "$raiz" rev-parse HEAD > "$raiz/.claude/revision-main.sha"
echo "Revisado: $(cat "$raiz/.claude/revision-main.sha")"
