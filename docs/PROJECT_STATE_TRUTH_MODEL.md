# Project State Truth Model

base_contract: AGENTS.md
mode: A4.8 local governance documentation
status: active_policy

## Purpose

Prevent tracked status files from becoming stale immediately after every commit
or push.

## Rule

Git commands are the current synchronization truth.

Use these commands to determine the live state:

```text
git status --short --branch
git rev-parse HEAD
git rev-parse origin/master
git rev-list --left-right --count origin/master...HEAD
```

`.agent_board` and docs may record historical baseline events, such as a
fast-forward merge or checkpoint commit, but they must not claim that a
specific hash is the current HEAD forever.

## Allowed Status Wording

Use event wording:

```text
post_merge_baseline: <hash>
verified_at_task_start_by_git: true
latest_state_source: git_status_and_rev_parse
```

Avoid durable current-state wording:

```text
HEAD equals origin/master at <hash>
current HEAD is <hash>
worktree is clean
ahead/behind is 0/0
```

Those facts may be reported in a task closeout, but a future agent must
recheck them before acting.

## Non-Authorization

- no provider/API/plugin/MCP call
- no image generation
- no `.env` or secret read
- no real manifest/VCPChat/VCPToolBox read
- no DailyNote or VCP memory write
- no production candidate or failure sample write
- no tag/release/deploy/push authorization
