#!/usr/bin/env bash
# galivelop-workflow v0.1.0
# Lists the files that are code among those changed between two commits: everything that matches none of the
# config's `content` regexes (Python syntax, on repo-relative paths). The review mark file itself is never code.
# Only code needs /code-review (plan §5.3). Used by .githooks/pre-push and the PR hook.
#   bash es-codigo.sh [--rev REV] A B   # A empty = from the empty tree (a brand-new branch)
# The config (`content`, `reviewMark`) is read as commit REV has it (default B, the commit being checked), never
# from the working tree: an uncommitted edit cannot turn the pushed code into content.
# Exit 0 with the list (possibly empty) on stdout; exit 2 if the config or a commit is missing (fail closed).
# Bash 3.2 compatible.
set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
root="$(git -C "$here" rev-parse --show-toplevel 2>/dev/null)" || {
  echo "es-codigo: $here is not inside a git repository; reinstall the workflow: /gw-update" >&2; exit 2; }
cd "$root" || exit 2
rev=""
if [ "${1:-}" = "--rev" ]; then rev="${2:-}"; shift 2 || true; fi
if [ "$#" -ne 2 ] || [ -z "$2" ]; then
  echo "es-codigo: usage: bash $0 [--rev <commit>] <from-commit or empty> <to-commit>" >&2; exit 2
fi
from="$1"; to="$2"
[ -n "$rev" ] || rev="$to"
if [ -z "$from" ]; then
  from="$(git hash-object -t tree /dev/null)"
elif ! git cat-file -e "$from^{commit}" 2>/dev/null; then
  echo "es-codigo: commit $from is not in this clone; fetch it: git fetch --deepen=200 origin" >&2; exit 2
fi
if ! git cat-file -e "$to^{commit}" 2>/dev/null; then
  echo "es-codigo: commit $to is not in this clone; fetch it: git fetch --deepen=200 origin" >&2; exit 2
fi
config="$here/config.py"
content="$(python3 "$config" --root "$root" --rev "$rev" get content --json)" || {
  echo "es-codigo: cannot read the config of $rev; commit a valid .claude/gw.json: python3 $config --root $root --rev $rev validate" >&2; exit 2; }
mark="$(python3 "$config" --root "$root" --rev "$rev" get reviewMark)" || {
  echo "es-codigo: cannot read reviewMark of $rev; fix it: python3 $config --root $root --rev $rev validate" >&2; exit 2; }
changed="$(git diff --no-renames --name-only "$from" "$to")" || {
  echo "es-codigo: git diff $from $to failed; check both commits exist: git log -1 $from $to" >&2; exit 2; }
[ -n "$changed" ] || exit 0
printf '%s\n' "$changed" | python3 -c '
import json, re, sys
patterns = [re.compile(p) for p in json.loads(sys.argv[1])]
mark = sys.argv[2]
for line in sys.stdin:
    path = line.rstrip("\n")
    if path and path != mark and not any(p.search(path) for p in patterns):
        print(path)
' "$content" "$mark" || { echo "es-codigo: a content regex in .claude/gw.json is invalid; fix it: python3 $config --root $root validate" >&2; exit 2; }
