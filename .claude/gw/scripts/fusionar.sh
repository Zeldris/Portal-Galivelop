#!/usr/bin/env bash
# galivelop-workflow v0.4.3
# Merges a subagent's branch into the current one (merge, never rebase: branches are pushed), runs the config's
# `check` commands and the related tests (`relatedTests`) on the result and, if they pass, cleans up the subagent's
# worktree and branch.
#   bash fusionar.sh <branch> "<merge message>" [--reviewed]
#  - `git merge --no-ff`. On conflict it stops, lists the files and leaves the merge open (resolve it, or abort
#    with: git merge --abort), exit 1.
#  - then every `check` command of .claude/gw.json runs in the project root. If one fails the merge IS already
#    done: it says how to undo it (git reset --hard HEAD^1) and exits 1; branch and worktree stay.
#  - after a green check, the related tests the pre-push would run: tests-relacionados.sh gets the files the merge
#    changed (git diff --name-only --no-renames <HEAD before the merge> HEAD) and runs the `relatedTests` commands
#    that apply (a no-op without `relatedTests`). If they fail it behaves like a failed check: the merge IS already
#    done, it says how to rerun them and how to undo the merge, exits 1; branch and worktree stay. If `relatedTests`
#    is configured but tests-relacionados.sh is not installed it fails the same way (reinstall: /gw-update); with an
#    empty `relatedTests` a missing script is skipped silently.
#  - after a green check and green related tests: `git worktree remove` (without force: with uncommitted changes it warns and leaves it)
#    and `git branch -d` (deletes only what is merged; if it refuses it warns and goes on). Only a branch named
#    worktree-agent-* or whose worktree is under .claude/worktrees/ is cleaned; never the current branch, the
#    protected branch or claude/* (session branches).
#  - --reviewed = the main session already had the diff reviewed; without it, it reminds you.
# Bash 3.2 compatible. Root from this script's path, never from $CLAUDE_PROJECT_DIR or the current directory.
set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
usage() { echo "fusionar: usage: bash $0 <branch> \"<merge message>\" [--reviewed]" >&2; exit 2; }
{ [ $# -eq 2 ] || { [ $# -eq 3 ] && [ "$3" = "--reviewed" ]; }; } || usage
branch="$1"; message="$2"; reviewed="${3:-}"
# Git exports GIT_DIR (and friends) to hooks, also in a linked worktree; with GIT_DIR set `rev-parse --show-toplevel`
# answers $here, not the repo root.
root="$(unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE; git -C "$here" rev-parse --show-toplevel 2>/dev/null)" || {
  echo "fusionar: $here is not inside a git repository; reinstall the workflow: /gw-update" >&2; exit 2; }
cd "$root" || exit 2
config="$here/config.py"
checks="$(python3 "$config" --root "$root" get check)" || {
  echo "fusionar: cannot read check; fix the config: python3 $config --root $root validate" >&2; exit 2; }
wrapper="$(python3 "$config" --root "$root" get checkWrapper)" || {
  echo "fusionar: cannot read checkWrapper; fix the config: python3 $config --root $root validate" >&2; exit 2; }
protected="$(python3 "$config" --root "$root" get protectedBranch)" || {
  echo "fusionar: cannot read protectedBranch; fix the config: python3 $config --root $root validate" >&2; exit 2; }
logs="$(mktemp -d "${TMPDIR:-/tmp}/gw-fusionar.XXXXXX")" || { echo "fusionar: cannot create a temp dir; free space and retry" >&2; exit 2; }
trap 'rm -rf "$logs"' EXIT

git rev-parse --verify --quiet "$branch^{commit}" >/dev/null || { echo "fusionar: no branch $branch; list them: git branch -a" >&2; exit 2; }
before="$(git rev-parse HEAD)"
if ! git merge --no-ff "$branch" -m "$message" > "$logs/merge.log" 2>&1; then
  conflicts="$(git diff --name-only --diff-filter=U)"
  echo "fusionar: CONFLICT (the merge stays open; resolve it and commit, or abort with: git merge --abort):"
  printf '%s\n' "${conflicts:-$(tail -n 5 "$logs/merge.log")}" | sed 's/^/  /'
  exit 1
fi
if [ "$(git rev-parse HEAD)" = "$before" ]; then
  echo "fusionar: nothing to merge, $branch is already in the current branch."
  exit 0
fi
echo "fusionar: merged $branch into $(git branch --show-current) at $(git rev-parse --short HEAD)"

n=0
while IFS= read -r cmd; do
  [ -n "$cmd" ] || continue
  n=$((n + 1))
  [ -z "$wrapper" ] || cmd="$wrapper bash -c '$(printf '%s' "$cmd" | sed "s/'/'\\\\''/g")'"
  if bash -c "$cmd" > "$logs/check-$n.log" 2>&1 < /dev/null; then
    echo "fusionar: check OK: $cmd"
  else
    tail -n 20 "$logs/check-$n.log" >&2
    echo "fusionar: CHECK FAILED: $cmd. The merge is ALREADY done in the current branch; branch and worktree stay." >&2
    echo "fusionar: fix it and commit, or undo the merge with: git reset --hard HEAD^1" >&2
    exit 1
  fi
done <<<"$checks"

# The related tests the pre-push would run, on the files this merge brought. Fail closed: with commands in
# `relatedTests` but tests-relacionados.sh not installed they cannot run, so that is an error (with an empty
# `relatedTests` a missing script has nothing to run); also if the changed list cannot be built.
related_configured=""
for kind in fast slow; do
  value="$(python3 "$config" --root "$root" get "relatedTests.$kind" 2>/dev/null)" && [ -n "$value" ] && related_configured=1
done
if [ ! -f "$here/tests-relacionados.sh" ]; then
  if [ -n "$related_configured" ]; then
    echo "fusionar: RELATED TESTS CANNOT RUN: relatedTests is configured but $here/tests-relacionados.sh is not installed. The merge is ALREADY done in the current branch; branch and worktree stay." >&2
    echo "fusionar: reinstall the workflow with: /gw-update (then run the related tests), or undo the merge with: git reset --hard HEAD^1" >&2
    exit 1
  fi
else
  rerun="f=\$(mktemp) && git diff --name-only --no-renames ${before:0:7} HEAD > \"\$f\" && bash $here/tests-relacionados.sh \"\$f\""
  git diff --name-only --no-renames "$before" HEAD > "$logs/changed" || {
    echo "fusionar: cannot list the files the merge changed. The merge is ALREADY done in the current branch; branch and worktree stay." >&2
    echo "fusionar: run the related tests by hand: $rerun" >&2
    exit 1; }
  if bash "$here/tests-relacionados.sh" "$logs/changed" > "$logs/related.log" 2>&1 < /dev/null; then
    echo "fusionar: related tests OK"
  else
    tail -n 20 "$logs/related.log" >&2
    echo "fusionar: RELATED TESTS FAILED. The merge is ALREADY done in the current branch; branch and worktree stay." >&2
    echo "fusionar: fix it and commit, or undo the merge with: git reset --hard HEAD^1" >&2
    echo "fusionar: rerun them with: $rerun" >&2
    exit 1
  fi
fi

cleanup_branch() {
  local current wt
  current="$(git branch --show-current)"
  case "$branch" in "$protected"|claude/*) return 0 ;; esac
  [ "$branch" = "$current" ] && return 0
  wt="$(git worktree list --porcelain | awk -v r="refs/heads/$branch" '/^worktree /{w=substr($0,10)} $1=="branch" && $2==r {print w}')"
  case "$branch" in
    worktree-agent-*) ;;
    *) case "$wt" in */.claude/worktrees/*) ;; *) return 0 ;; esac ;;
  esac
  if [ -n "$wt" ] && [ "$wt" != "$root" ]; then
    case "$wt" in
      */.claude/worktrees/*)
        if git worktree remove "$wt" > "$logs/wt.log" 2>&1; then
          echo "fusionar: worktree $wt removed."
        else
          echo "fusionar: WARNING: worktree $wt not removed ($(head -n 1 "$logs/wt.log")); $branch stays. Fix it: git worktree remove --force $wt"
          return 0
        fi ;;
      *) echo "fusionar: WARNING: $branch has a worktree outside .claude/worktrees/ ($wt); not removed."; return 0 ;;
    esac
  fi
  if git branch -d "$branch" > "$logs/br.log" 2>&1; then
    echo "fusionar: branch $branch deleted."
  else
    echo "fusionar: WARNING: branch $branch not deleted ($(head -n 1 "$logs/br.log")); check it: git branch --no-merged"
  fi
  return 0
}
cleanup_branch
[ "$reviewed" = "--reviewed" ] || echo "fusionar: no --reviewed: confirm the /code-review of the diff (step 3 of orchestrate-dealer)."
exit 0
