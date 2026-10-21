#!/bin/bash
# Deja listo el entorno al empezar una sesión (traído del flujo de Tarkor, 2026-10-21): el gancho de antes de subir
# siempre; en la nube, además, las dependencias. Idempotente. La raíz sale de la ruta de este script, no de
# $CLAUDE_PROJECT_DIR (en la nube puede ser /home/user).
set -uo pipefail
cd "$(dirname "$0")/../.."
git config core.hooksPath .githooks
if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  # Se reinstala si falta node_modules o si el lockfile es más nuevo que la última instalación.
  if [ ! -f node_modules/.package-lock.json ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
    npm ci --no-audit --no-fund --loglevel=error || echo "Aviso: npm ci falló; instala las dependencias antes de comprobar."
  fi
fi
echo "Entorno listo: gancho pre-push activo (npm run check y revisión antes de main)."
