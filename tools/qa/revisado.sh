#!/bin/bash
# Tras el `/code-review` del diff contra main y sus arreglos subidos (paso 5 de
# docs/runbooks/skills-y-modelos.md), marca el commit revisado. El gancho
# `.claude/hooks/revision-antes-de-main.sh` no deja crear ni fusionar un PR a main sin la marca del mismo commit.
set -euo pipefail
raiz="$(git rev-parse --show-toplevel)"
if [ -n "$(git -C "$raiz" status --porcelain --untracked-files=no)" ]; then
  echo "Hay cambios sin commit: súbelos y vuelve a revisar antes de marcar." >&2
  exit 1
fi
git -C "$raiz" rev-parse --verify -q origin/main >/dev/null || {
  echo "No encuentro origin/main: git fetch origin main y vuelve a marcar." >&2
  exit 1
}
git -C "$raiz" rev-parse HEAD > "$raiz/.claude/revision-main.sha"
echo "Revisado: $(cat "$raiz/.claude/revision-main.sha")"
