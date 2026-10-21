#!/bin/bash
# Tras el `/code-review` del diff contra main y sus arreglos subidos (paso 5 de docs/runbooks/skills-y-modelos.md),
# apunta el commit revisado en docs/registros/revisado.txt y lo deja en un commit. Al estar en el repo, la marca
# viaja con él (la tarea semanal también la ve). `.githooks/pre-push` y el gancho de PR aceptan una subida a main si
# desde ese commit no ha cambiado código (solo contenido). Después: git push.
set -euo pipefail
raiz="$(git rev-parse --show-toplevel)"; cd "$raiz"
rama="$(git rev-parse --abbrev-ref HEAD)"
[ "$rama" != "HEAD" ] || { echo "HEAD suelto: cámbiate a la rama de trabajo antes de marcar." >&2; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "Hay cambios sin commit o archivos sin añadir: súbelos y revisa otra vez." >&2; exit 1; }
git fetch -q origin main "$rama" || { echo "No pude traer origin/main ni origin/$rama." >&2; exit 1; }
[ "$(git rev-parse HEAD)" = "$(git rev-parse "origin/$rama")" ] || { echo "HEAD no coincide con origin/$rama: sube los arreglos antes de marcar." >&2; exit 1; }
git merge-base --is-ancestor origin/main HEAD || { echo "La rama no incluye el último origin/main: git merge origin/main, revisa otra vez y marca." >&2; exit 1; }
sha="$(git rev-parse HEAD)"
echo "$sha" > docs/registros/revisado.txt
git add docs/registros/revisado.txt
git commit -q -m "Revisado: ${sha:0:7} (/code-review del diff contra main)"
echo "Revisado: $sha. Sube con git push."
