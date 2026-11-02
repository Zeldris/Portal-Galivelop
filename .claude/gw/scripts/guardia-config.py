#!/usr/bin/env python3
# galivelop-workflow v0.4.3
"""PreToolUse hook: ask the user before Claude edits the workflow's own configuration.

The files that wire the workflow (.claude/settings.json, .claude/gw.json, everything under .githooks/ and under
.claude/gw/scripts/) change only with the user's OK; AGENTS.md says so, and this hook makes the rule checkable. It
never denies: it returns `ask`, so the user decides in the permission prompt.

Output format (https://code.claude.com/docs/en/hooks.md, PreToolUse "ask" decision): a JSON object on stdout, exit 0,

  {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "ask",
                          "permissionDecisionReason": "..."}}

`permissionDecisionReason` is what the user sees in the prompt. No output at all means "no opinion" (the normal
permission flow goes on).

What it looks at, in the event on stdin (`tool_name`, `tool_input`, `cwd`):

  Edit, Write, MultiEdit      tool_input.file_path (NotebookEdit: notebook_path). Absolute or relative (against the
                              event's `cwd`), with `./`, `..` and symlinks resolved; a path outside the project is
                              none of its business.
  Bash                        tool_input.command, split into simple commands (`;`, `&&`, `||`, `|`, `&`, newlines,
                              `bash -c '...'` and `eval` recursively). It asks when a command names a protected path AND
                              writes to it: a redirection (`>`, `>>`, `>|`) to it, `tee`, `sed -i`, `perl -i`, `cp`,
                              `mv`, `rm`, `install`, `ln`, `chmod`, `chown`, `truncate`, `touch`, `dd`, `rsync`,
                              `find -delete`, `git checkout|restore|rm|mv|clean`. A folder that holds protected files
                              (`.claude`, `.claude/gw`) counts when `rm`/`mv`/`unlink`/`shred`/`rmdir` name it, when
                              it is the destination of `cp`/`mv`/`install`/`ln`/`rsync` (the last argument, or `-t`),
                              and when a `git` write names it; so does `.` (the whole project) for `git checkout -- .`
                              and `git restore .`, which overwrite every protected file with the committed one.
                              Wrappers are looked through with their options and the values of those
                              (`sudo -u me`, `sudo -uroot`, `env -u X`, `nice -n 5`, `timeout -s KILL 5`,
                              `xargs -I{}`), and a redirection before the command (`> f cmd`). A plain read (`cat`,
                              `grep`, `git diff`, `cp .claude/gw.json /tmp/`, `python3 .claude/gw/scripts/x.py`) is
                              allowed: of `cp`/`install`/`ln`/`rsync` only the destination counts as written (the
                              value of an option such as `rsync --exclude .claude` is not a destination), while `mv`
                              also writes its sources, and so does `rsync --remove-source-files`. `dd` writes what
                              `of=` names (`if=` only reads). `git restore --staged` (without `--worktree`),
                              `git rm --cached` and `git clean -n` leave the worktree alone and are allowed. Not seen, on
                              purpose (a hook cannot parse a shell): a path built at run time, and code that opens the
                              file inside `python3 -c`. A `cd` to a literal folder is followed; `rm -r .claude` counts.

Project root: config.find_root (the script's own repo when it holds .claude/gw.json, else the project the hook runs
in); it does not read or validate the config. Fails closed: stdin it cannot read, an event without the tool name or
the target, or a root it cannot find -> `ask`, with that as the reason. Python 3.8+ standard library only.
"""
import json
import os
import re
import select
import shlex
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.dont_write_bytecode = True  # no __pycache__ in the project's .claude/gw/scripts
sys.path.insert(0, HERE)
import config  # noqa: E402

STDIN_WAIT = 3.0
EDIT_TOOLS = ("Edit", "Write", "MultiEdit", "NotebookEdit")
TARGET_KEYS = ("file_path", "notebook_path", "path")
EXACT = (".claude/settings.json", ".claude/gw.json")
TREES = (".githooks", ".claude/gw/scripts")
ANCESTORS = (".claude", ".claude/gw")  # removing or moving one takes protected files with it
WRITERS = {"tee", "cp", "mv", "rm", "install", "ln", "chmod", "chown", "chgrp", "truncate", "touch", "dd", "rsync",
           "unlink", "shred", "rmdir", "patch"}
DESTRUCTIVE = {"rm", "mv", "unlink", "shred", "rmdir"}  # these also count when they name an ancestor folder
COPIERS = {"cp", "mv", "install", "ln", "rsync"}  # these also count when their destination is an ancestor folder
READ_SOURCES = {"cp", "install", "ln", "rsync"}  # of these only the destination is written (`mv` removes its sources)
# Options of each copier that take a value in the next word (the value is not the destination: `--exclude .claude`).
COPIER_VALUE = {
    "rsync": {"-e", "-f", "--rsh", "--filter", "--exclude", "--include", "--exclude-from", "--include-from",
              "--files-from", "--log-file", "--chmod", "--rsync-path", "--partial-dir", "--backup-dir", "--suffix",
              "--compare-dest", "--copy-dest", "--link-dest", "--temp-dir", "-T", "--max-size", "--min-size"},
    "cp": {"-S", "--suffix"},
    "mv": {"-S", "--suffix"},
    "ln": {"-S", "--suffix"},
    "install": {"-S", "--suffix", "-m", "--mode", "-o", "--owner", "-g", "--group"},
}
IN_PLACE = {"sed", "gsed", "perl", "ruby"}
GIT_WRITES = {"checkout", "restore", "rm", "mv", "clean"}
GIT_NOT_WRITES = {  # (git subcommand, long flag, short letter): with this flag the call writes no file of the worktree
    ("rm", "--cached", None), ("clean", "--dry-run", "n"),
}
SHELLS = {"sh", "bash", "zsh", "dash", "ksh"}
# Commands that run another one, and the options of each that take a value in the next word (`sudo -u me`, `env -u X`,
# `nice -n 5`, `timeout -s KILL 5`): the same list as PREFIX_OPTIONS in revision-antes-de-main.sh, plus `doas`.
WRAPPER_OPTIONS = {
    "env": {"-u", "--unset", "-C", "--chdir", "-S", "--split-string"},
    "nice": {"-n", "--adjustment"},
    "time": {"-f", "--format", "-o", "--output"},
    "timeout": {"-s", "--signal", "-k", "--kill-after"},
    "stdbuf": {"-i", "--input", "-o", "--output", "-e", "--error"},
    "sudo": {"-u", "--user", "-g", "--group", "-h", "--host", "-p", "--prompt", "-C", "-D", "--chdir", "-R", "-r",
             "-t", "-T", "-U"},
    "doas": {"-u", "-C"},
    "exec": {"-a"}, "command": set(), "nohup": set(), "builtin": set(),
}
XARGS_VALUE = {"-I", "-L", "-n", "-P", "-s", "-d", "-E", "-a", "--delimiter", "--max-args", "--max-procs",
               "--arg-file", "--replace", "--max-lines", "--eof", "--max-chars"}
RULE = ("these files change only with the user's OK (the workflow's rule). If the user approves, go ahead; to "
        "regenerate the applied copy from the workflow, run: python3 scripts/aplicar.py . (in a project, /gw-update)")


def read_event():
    """(event, problem): the hook's JSON object from stdin, or (None, why it cannot be used)."""
    if sys.stdin is None or sys.stdin.isatty():
        return None, "nothing arrived on stdin"
    try:
        ready, _, _ = select.select([sys.stdin], [], [], STDIN_WAIT)
        if not ready:
            return None, "stdin stayed empty"
        text = sys.stdin.read()
    except (OSError, ValueError) as exc:
        return None, f"stdin could not be read ({exc})"
    try:
        data = json.loads(text)
    except ValueError:
        return None, "stdin is not valid JSON"
    if not isinstance(data, dict):
        return None, "stdin is not a JSON object"
    return data, None


def ask(reason):
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "ask",
                                             "permissionDecisionReason": reason}}))


def classify(token, base, root):
    """The project-relative, normalised path `token` names and its kind: ('protected' | 'ancestor' | 'root' | None). `base`
    is the folder relative paths are read from; `root` the real project root."""
    if not token or token.startswith("~"):
        return None, None
    token = re.sub(r"^(\$\{[A-Za-z_][A-Za-z0-9_]*\}|\$[A-Za-z_][A-Za-z0-9_]*)(?=/|$)", root, token)
    try:
        path = os.path.realpath(token if os.path.isabs(token) else os.path.join(base, token))
        rel = os.path.relpath(path, root)
    except (OSError, ValueError):
        return None, None
    if rel == ".." or rel.startswith("../") or rel.startswith(".." + os.sep):
        return None, None  # outside the project
    rel = rel.replace(os.sep, "/")
    low = rel.lower()  # a case-insensitive disk (macOS, Windows) must not be a way round
    if low in EXACT or any(low == t or low.startswith(t + "/") for t in TREES):
        return rel, "protected"
    if low in ANCESTORS:
        return rel, "ancestor"
    if rel == ".":
        return rel, "root"  # the project folder itself: only a pathspec that covers every protected file cares
    return rel, None


def tokenize(command):
    """Shell words of `command`; operators (`;`, `&&`, `>>`, ...) come out as words of their own."""
    text = command.replace("\\\n", " ").replace("\n", " ; ")
    lex = shlex.shlex(text, posix=True, punctuation_chars=True)
    lex.whitespace_split = True
    lex.commenters = ""
    try:
        return list(lex)
    except ValueError:  # an unclosed quote: still look at the words, cut crudely
        return [w.strip("'\"") for w in re.split(r"\s+|(?<=[;&|<>])|(?=[;&|<>])", text) if w and w.strip("'\"")]


def is_redirect(word):
    return "<" in word or ">" in word


def is_separator(word):
    return bool(word) and all(c in "();|&" for c in word)


def segments(words):
    out, cur = [], []
    for w in words:
        if is_separator(w):
            if cur:
                out.append(cur)
            cur = []
        else:
            cur.append(w)
    if cur:
        out.append(cur)
    return out


def is_redirect_operator(word):
    """`>`, `>>`, `>&`, `>|`, `<`, `&>`: a redirection whose target is the next word."""
    return is_redirect(word) and bool(re.fullmatch(r"[0-9]*(&>>?|[<>]+[&|]?)", word))


def fd_before_redirect(words, i):
    """True for the `2` of `2>file`: the file descriptor the shell reads as part of the redirection."""
    return words[i].isdigit() and i + 1 < len(words) and is_redirect(words[i + 1])


def takes_next(opt, takes_value):
    """True when option word `opt` leaves its value to the next word: `-u`, or a group of short flags whose LAST letter
    takes one (`sudo -Eu root`). A value-taking letter that is not last has its value attached (`-uroot`, `-n5`)."""
    if opt in takes_value:
        return True
    if len(opt) > 2 and opt[1] != "-":
        for k, letter in enumerate(opt[1:]):
            if "-" + letter in takes_value:
                return k == len(opt) - 2
    return False


def skip_options(words, i, takes_value):
    """The index after the options at words[i:] (`takes_value` says which ones also consume the next word)."""
    while i < len(words) and words[i].startswith("-") and words[i] != "-":
        opt = words[i]
        i += 2 if takes_next(opt, takes_value) else 1
        if opt == "--":
            break
    return i


def command_word(words):
    """(index, word) of the command a simple command runs: after redirections, variable assignments, wrappers
    (`sudo`, `env`, `timeout`, `xargs`, ...) and the options of each, values included."""
    i = 0
    while i < len(words):
        w = words[i]
        if is_redirect(w):
            i += 2 if is_redirect_operator(w) else 1  # `> file cmd`: the file is not the command
            continue
        if fd_before_redirect(words, i) or re.match(r"[A-Za-z_][A-Za-z0-9_]*=", w):
            i += 1
            continue
        name = os.path.basename(w)
        if name == "xargs":
            i = skip_options(words, i + 1, XARGS_VALUE)
        elif name in WRAPPER_OPTIONS:
            i = skip_options(words, i + 1, WRAPPER_OPTIONS[name])
            if name == "timeout" and i < len(words):
                i += 1  # the duration
        else:
            return i, name
    return None, None


def destination(seg, i, cmd):
    """Index of the word a copier (`cp`, `mv`, `install`, `ln`, `rsync`) writes into: the `-t`/`--target-directory`
    value, else the last word that is not an option, an option's value or a redirection. None when there is no clear one."""
    values = COPIER_VALUE.get(cmd, set())
    last = None
    j = i + 1
    while j < len(seg):
        w = seg[j]
        if (w in ("-t", "--target-directory") or takes_next(w, {"-t"})) and j + 1 < len(seg):
            return j + 1
        if w.startswith("--target-directory="):
            return -j - 1  # the value is inside the word itself (see bash_hits)
        if w.startswith("-") and w != "-":
            j += 2 if takes_next(w, values) else 1  # an option and, maybe, its value
            continue
        if not (is_redirect(w) or fd_before_redirect(seg, j) or is_redirect_operator(seg[j - 1])):
            last = j
        j += 1
    return last


def git_write_call(args, k):
    """False for the `git` calls that name a path but leave the worktree alone: `restore --staged` (index only,
    unless `--worktree`/`-W` too), `rm --cached`, `clean -n`/`--dry-run`. `k` is the index of the subcommand in `args`."""
    sub, rest = args[k], []
    for w in args[k + 1:]:
        if w == "--":
            break
        rest.append(w)
    shorts = "".join(w[1:] for w in rest if re.fullmatch(r"-[A-Za-z]+", w))

    def has(long_flag, letter):
        return long_flag in rest or (letter is not None and letter in shorts)

    if sub == "restore":
        return not has("--staged", "S") or has("--worktree", "W")
    return not any(sub == s and has(flag, letter) for s, flag, letter in GIT_NOT_WRITES)


def in_place_flag(words):
    return any(w == "--in-place" or w.startswith("--in-place=") or re.match(r"-[A-Za-z]*i", w) and not w.startswith("--")
               for w in words)


def bash_hits(command, base, root, depth=0):
    """[rel, ...]: the protected paths `command` writes to."""
    hits = []
    for seg in segments(tokenize(command)):
        i, cmd = command_word(seg)
        args = [w for j, w in enumerate(seg) if j != i and not is_redirect(w)]
        if cmd in ("cd", "pushd"):  # later commands read their relative paths from there
            target = next((w for w in args if not w.startswith("-")), None)
            if target and not re.search(r"[$~`*?\[]", target):
                base = os.path.realpath(target if os.path.isabs(target) else os.path.join(base, target))
            continue
        if cmd in SHELLS | {"eval"} and depth < 3:
            for j, w in enumerate(seg):
                if j > (i or 0) and (cmd == "eval" or seg[j - 1] == "-c" or re.match(r"-[a-z]*c$", seg[j - 1])):
                    hits += bash_hits(w, base, root, depth + 1)
        dest = destination(seg, i, cmd) if cmd in COPIERS and i is not None else None
        if dest is not None and dest < 0:  # `--target-directory=X`
            rel, kind = classify(seg[-dest - 1].split("=", 1)[1], base, root)
            dest = None
            if kind in ("protected", "ancestor"):
                hits.append(rel)
        writes = git_write = False
        if cmd in WRITERS:
            writes = True
        elif cmd in IN_PLACE and in_place_flag(args):
            writes = True
        elif cmd == "git":
            k = next((k for k, w in enumerate(args) if not w.startswith("-") and (k == 0 or args[k - 1] not in ("-C", "-c"))), None)
            writes = git_write = k is not None and args[k] in GIT_WRITES and git_write_call(args, k)
        elif cmd == "find":
            writes = "-delete" in args
        removes_sources = cmd == "rsync" and any(w.startswith("--remove-source") for w in args)
        for j, w in enumerate(seg):
            if is_redirect(w) or j == i:
                continue
            if cmd == "dd" and w.startswith("of="):
                w = w[3:]  # `dd of=FILE` writes FILE; `if=FILE` only reads it
            rel, kind = classify(w, base, root)
            if kind is None:
                continue
            redirected = j > 0 and ">" in seg[j - 1]  # `>`, `>>`, `>|`, `&>`: the word after it is written
            written = writes and (cmd not in READ_SOURCES or j == dest or removes_sources)  # a copy only reads its sources
            if kind == "protected" and (redirected or written):
                hits.append(rel)
            elif kind == "ancestor" and (redirected or cmd in DESTRUCTIVE or j == dest or git_write):
                hits.append(rel)
            elif kind == "root" and git_write and seg[j - 1] not in ("-C", "-c"):  # `git checkout -- .`, `git restore .`: the pathspec covers it all
                hits.append(rel)
    return hits


def decide(event, root):
    """The reason to ask, or None to say nothing."""
    tool = event.get("tool_name")
    tool_input = event.get("tool_input")
    if not isinstance(tool, str) or not tool:
        return "the hook event has no tool_name, so guardia-config.py cannot tell what is about to run"
    if not isinstance(tool_input, dict):
        return f"the {tool} call has no tool_input, so guardia-config.py cannot tell what it touches"
    cwd = event.get("cwd") if isinstance(event.get("cwd"), str) and os.path.isabs(event.get("cwd", "")) else root
    base = os.path.realpath(cwd)
    if tool == "Bash":
        command = tool_input.get("command")
        if not isinstance(command, str):
            return "the Bash call has no command string, so guardia-config.py cannot tell what it writes"
        hits = bash_hits(command, base, root)
        if hits:
            return f"this command writes to {hits[0]}: {RULE}"
        return None
    if tool in EDIT_TOOLS:
        target = next((tool_input[k] for k in TARGET_KEYS if isinstance(tool_input.get(k), str) and tool_input[k]), None)
        if target is None:
            return f"the {tool} call names no file_path, so guardia-config.py cannot tell which file it edits"
        rel, kind = classify(target, base, root)
        if kind == "protected":
            return f"{tool} would change {rel}: {RULE}"
    return None


def main():
    event, problem = read_event()
    if event is None:
        ask(f"guardia-config.py could not use the hook event ({problem}), so it cannot tell whether the workflow's "
            f"configuration is being edited; confirm the call is safe")
        return 0
    try:
        root = os.path.realpath(str(config.find_root()))
    except config.ConfigError as exc:
        ask(f"guardia-config.py cannot find the project root ({str(exc).strip()}), so it cannot tell whether the "
            f"workflow's configuration is being edited; confirm the call is safe")
        return 0
    reason = decide(event, root)
    if reason:
        ask(reason)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:  # fail closed: a guard that crashed must not look like a green light
        ask(f"guardia-config.py failed ({type(exc).__name__}: {exc}), so it cannot tell whether the workflow's "
            f"configuration is being edited; confirm the call is safe")
        sys.exit(0)
