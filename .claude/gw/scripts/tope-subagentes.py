#!/usr/bin/env python3
# galivelop-workflow v0.4.3
"""PreToolUse hook: ask the user when a session has launched many subagents, so a loop does not burn tokens unseen.

It counts every Agent/Task call of a session (the matcher in hooks/hooks.json and in the settings.json template is
`Agent|Task`) and, when the count reaches the cap and every 10 after it (cap, cap+10, cap+20...), returns `ask` so the
user decides in the permission prompt whether the fan-out is on purpose. It never denies, and below the cap it prints
nothing (no opinion: the normal permission flow goes on).

Output format (https://code.claude.com/docs/en/hooks.md, PreToolUse "ask" decision): a JSON object on stdout, exit 0,

  {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "ask",
                          "permissionDecisionReason": "<n> subagents in this session (subagentCap <cap> in
                          .claude/gw.json): check they are not looping (opt-tokens)"}}

The cap is `subagentCap` in .claude/gw.json (integer >= 1, default 30). If the config cannot be read or is invalid, the
default is used and the count goes on.

The counter is one small file per session in tempfile.gettempdir() (named gw-subagents-<session_id>, with every
character that is not a letter, digit, dot, dash or underscore replaced by `_`). It is updated under an exclusive
lock, so subagents launched in parallel are all counted. A file that is not a non-negative integer is read as 0. The
folder can be changed with the environment variable GW_SUBAGENT_COUNTER_DIR (the tests use it; empty means the default).

Fails closed: stdin it cannot read, an event without a `session_id`, or a counter it cannot write -> `ask`, saying it
cannot count. The project root is found by config.find_root (the script's own repo, never the current directory
first). Python 3.8+ standard library only.
"""
import json
import os
import re
import select
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.dont_write_bytecode = True  # no __pycache__ in the project's .claude/gw/scripts
sys.path.insert(0, HERE)
import config  # noqa: E402

try:
    import fcntl
except ImportError:  # not on POSIX: count without the lock
    fcntl = None

DEFAULT_CAP = 30
STEP = 10
STDIN_WAIT = 3.0
COUNTER_DIR_ENV = "GW_SUBAGENT_COUNTER_DIR"


class CannotCount(Exception):
    pass


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


def cap_from_config():
    """The project's subagentCap, or the default when the config cannot be read or has no valid one."""
    try:
        cap = config.load(config.find_root()).get("subagentCap", DEFAULT_CAP)
    except config.ConfigError:
        return DEFAULT_CAP
    return cap if isinstance(cap, int) and not isinstance(cap, bool) and cap >= 1 else DEFAULT_CAP


def counter_path(session_id):
    folder = os.environ.get(COUNTER_DIR_ENV) or tempfile.gettempdir()
    return os.path.join(folder, "gw-subagents-" + re.sub(r"[^A-Za-z0-9_.-]", "_", session_id)[:120])


def bump(path):
    """Add one to the session's counter under an exclusive lock and return the new count."""
    try:
        fd = os.open(path, os.O_RDWR | os.O_CREAT, 0o600)
    except OSError as exc:
        raise CannotCount(f"the subagent counter {path} cannot be opened ({exc.strerror or exc})")
    try:
        if fcntl is not None:
            fcntl.flock(fd, fcntl.LOCK_EX)
        raw = os.read(fd, 64)
        try:
            count = int(raw.decode("ascii").strip())
        except (UnicodeDecodeError, ValueError):
            count = 0
        if count < 0:
            count = 0
        count += 1
        os.lseek(fd, 0, os.SEEK_SET)
        os.ftruncate(fd, 0)
        os.write(fd, str(count).encode("ascii"))
        return count
    except OSError as exc:
        raise CannotCount(f"the subagent counter {path} cannot be updated ({exc.strerror or exc})")
    finally:
        os.close(fd)  # closing releases the lock


def main():
    event, problem = read_event()
    if event is None:
        ask(f"tope-subagentes.py could not use the hook event ({problem}), so it cannot count the subagents of this "
            f"session; check they are not looping (opt-tokens)")
        return 0
    session_id = event.get("session_id")
    if not isinstance(session_id, str) or not session_id.strip():
        ask("tope-subagentes.py got an event with no session_id, so it cannot count the subagents of this session; "
            "check they are not looping (opt-tokens)")
        return 0
    cap = cap_from_config()
    try:
        count = bump(counter_path(session_id))
    except CannotCount as exc:
        ask(f"tope-subagentes.py cannot count the subagents of this session: {exc}; check they are not looping "
            f"(opt-tokens)")
        return 0
    if count >= cap and (count - cap) % STEP == 0:
        ask(f"{count} subagents in this session (subagentCap {cap} in .claude/gw.json): check they are not looping "
            f"(opt-tokens)")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:  # fail closed: a counter that crashed must not look like a green light
        ask(f"tope-subagentes.py failed ({type(exc).__name__}: {exc}), so it cannot count the subagents of this "
            f"session; check they are not looping (opt-tokens)")
        sys.exit(0)
