#!/bin/bash
# Lista los archivos de código que cambian entre dos commits (uno vacío = desde el principio). Todo lo que no es
# contenido (datos de proyectos, imágenes, documentos) es código. Lo usan .githooks/pre-push y el gancho de PR.
set -euo pipefail
vacio=4b825dc642cb6eb9a060e54bf8d69288fbee4904   # el árbol vacío de git
desde="${1:-$vacio}"; hasta="$2"
git diff --name-only "$desde" "$hasta" | grep -Ev '^(src/data/|public/|docs/|README\.md$|CLAUDE\.md$|GLOSSARY\.md$|REVIEW\.md$)' || true
