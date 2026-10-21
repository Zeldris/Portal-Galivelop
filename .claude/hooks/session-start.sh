#!/bin/bash
# Deja listo el entorno al empezar una sesión (traído del flujo de Tarkor, 2026-10-21): el gancho de antes de subir
# y, en la nube, las dependencias. Idempotente. La raíz sale de la ruta de este script.
set -uo pipefail
cd "$(dirname "$0")/../.." || { echo "Aviso: no encuentro la raíz del portal; el gancho pre-push no se ha activado."; exit 0; }
actual="$(git config --get core.hooksPath || true)"
if [ -z "$actual" ] || [ "$actual" = ".githooks" ]; then
  git config core.hooksPath .githooks
else
  echo "Aviso: core.hooksPath ya es «$actual»; no lo cambio (el pre-push del portal no está activo)."
fi
if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  if [ ! -f node_modules/.package-lock.json ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
    npm ci --no-audit --no-fund --loglevel=error || echo "Aviso: npm ci falló; instala las dependencias antes de comprobar."
  fi
fi
echo "Entorno listo."
