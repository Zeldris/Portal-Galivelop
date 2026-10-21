#!/bin/bash
# Deja listo el entorno al empezar una sesión en la nube (traído del flujo de Tarkor, 2026-10-21):
# dependencias y el gancho de antes de subir. Idempotente: lo que ya está, no se toca.
set -euo pipefail
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi
cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"
[ -d node_modules ] || npm ci --no-audit --no-fund --loglevel=error
git config core.hooksPath .githooks
echo "Entorno listo: dependencias instaladas y gancho pre-push activo (npm run check antes de subir)."
