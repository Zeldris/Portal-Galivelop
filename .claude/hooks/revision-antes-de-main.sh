#!/bin/bash
# Traído de Tarkor (QA-50 y QA-62): no se crea ni se fusiona un PR a main sin `/code-review` del mismo commit
# (paso 5 de docs/runbooks/skills-y-modelos.md), ni se fusiona con el CI sin terminar en verde. La marca la deja
# `tools/qa/revisado.sh`. La subida directa a main la vigila `.githooks/pre-push`.
# La raíz del repo sale de la ruta de este script, no de $CLAUDE_PROJECT_DIR (en la nube puede ser /home/user).
entrada="$(cat)"
raiz="$(cd "$(dirname "$0")/../.." && pwd)"
python3 - "$raiz" "$entrada" <<'PY'
import json, subprocess, sys
raiz, entrada = sys.argv[1], json.loads(sys.argv[2])
herramienta = entrada.get('tool_name', '')
datos = entrada.get('tool_input', {}) or {}

def git(*a):
    return subprocess.run(['git', '-C', raiz, *a], capture_output=True, text=True).stdout.strip()

def gh(ruta):
    r = subprocess.run(['gh', 'api', ruta], capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except ValueError:
        return None

repo = f"repos/{datos.get('owner')}/{datos.get('repo')}"
if herramienta.endswith('create_pull_request'):
    if datos.get('base') != 'main':
        sys.exit(0)
    # La cabeza es la de la rama del PR en GitHub, no la de este checkout.
    rama = datos.get('head', '')
    git('fetch', '-q', 'origin', rama)
    cabeza = git('rev-parse', f'origin/{rama}') or f'(no encuentro origin/{rama})'
else:
    info = gh(f"{repo}/pulls/{datos.get('pullNumber')}") or {}
    try:
        if info['base']['ref'] != 'main':
            sys.exit(0)
        cabeza = info['head']['sha']
    except (KeyError, TypeError):
        print('Bloqueado: no se pudo consultar el PR.', file=sys.stderr)
        sys.exit(2)
    corridas = (gh(f"{repo}/commits/{cabeza}/check-runs?per_page=100") or {}).get('check_runs')
    estados = (gh(f"{repo}/commits/{cabeza}/status") or {}).get('statuses') or []
    if corridas is None:
        pendiente = ['no se pudieron leer las comprobaciones']
    elif not corridas and not estados:
        pendiente = ['el CI aún no ha empezado']
    else:
        pendiente = [f"{c['name']}: {c.get('conclusion') or c['status']}" for c in corridas
                     if c['status'] != 'completed' or c.get('conclusion') not in ('success', 'skipped', 'neutral')]
        pendiente += [f"{e['context']}: {e['state']}" for e in estados if e.get('state') != 'success']
    if pendiente:
        print(f'Bloqueado: el CI del PR no está en verde ({"; ".join(pendiente)}). Espera al aviso del PR y fusiona '
              'con todo en verde.', file=sys.stderr)
        sys.exit(2)
try:
    marca = open(f'{raiz}/.claude/revision-main.sha').read().strip()
except OSError:
    marca = ''
if marca and marca == cabeza:
    sys.exit(0)
print(f'Bloqueado: antes de un PR a main, `/code-review` del diff contra main, arreglar lo que encuentre, subirlo y '
      f'marcar con `bash tools/qa/revisado.sh` (marca: {marca or "ninguna"}, commit: {cabeza}). Resumen con la skill `pr`.',
      file=sys.stderr)
sys.exit(2)
PY
