# FILE_LOCKS.md - Agent Image Lab

Persistent file-lock ledger for Single-Window 4-Agent Compact Autopilot.

This file does not authorize edits by itself. It records exact write sets for
Commander / Worker Alpha / Worker Beta coordination under `AGENTS.md` and A4.8
boundaries.

## Current Locks

```yaml
active_locks: []
released_locks:
  - task_id: four_agent_mode_hardening_minimal_patch
    owner: Commander
    files:
      - docs/SINGLE_WINDOW_4_AGENT_COMPACT_AUTOPILOT.md
      - .agent_board/FILE_LOCKS.md
      - .agent_board/RISK_REGISTER.md
    status: released_after_single_commander_patch
    reason: Seed the compact autopilot hardening rails without parallel workers.
```

## Lock Rules

```yaml
rules:
  no_git_add_dot: true
  exact_files_only: true
  workers_do_not_stage: true
  workers_do_not_commit: true
  workers_do_not_push: true
  overlapping_active_locks_block_parallel_work: true
  commander_reviews_before_release: true
```

## Lock Template

```yaml
active_locks:
  - task_id: null
    owner: Commander | Worker_Alpha | Worker_Beta
    files: []
    status: active
    reason: null
    started_at: null
    stop_conditions: []
```
