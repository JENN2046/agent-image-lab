# Repository Organization Standard

Status: active local repository organization standard
Authority: `docs/PROJECT_STRUCTURE.md`
Mode: Green Lane structure governance

This standard defines how agents and maintainers should add, organize, or
prepare to move repository files. It is a standing rule for future local work.
It does not authorize physical moves, deletion, runtime execution, provider
contact, plugin calls, API calls, image generation, memory writes, production
promotion, dependency changes, commit, push, tag, release, or deploy.

## Core Rule

Prefer discoverability and compatibility before movement.

Every structure change must answer:

- What owns this file?
- Is it current authority, historical evidence, runtime code, a validator,
  a fixture, or local-only output?
- Can existing validators still find it?
- Does an old path need a wrapper, redirect manifest, or reference map?
- Which validation proves the new shape?

If the answer is unclear, add an index, README, manifest, or dry-run map first.
Do not start with broad directory movement.

## Top-Level Directories

Do not create a new top-level directory unless all are true:

- Existing top-level directories cannot express the ownership cleanly.
- The new directory has a README or is recorded in `docs/PROJECT_STRUCTURE.md`.
- It is clear whether the directory is Git-portable or local-only.
- It does not weaken any provider, runtime, memory, production, secret, or
  remote-action boundary.

New top-level directories are exceptional. Prefer an existing owner directory.

## Documentation

Current authority documents must stay small and discoverable.

Historical phase records should move toward `docs/archive/` only through an
approved manifest, reference map, and validation pass. A historical record under
`docs/` is an audit record, not active authorization by itself.

New documentation should declare one of these roles near the top:

- `current_authority`
- `operating_standard`
- `planning_record`
- `execution_record`
- `archive_record`
- `human_review_required`

Long changelogs should not be appended forever to primary README files. When a
README becomes a history ledger, keep the current usage section in the README
and move historical detail behind a named archive or changelog document.

## Validators

New validators must default to:

```text
scripts/validators/<domain_or_version>/
```

Root-level `scripts/validate_*.js` files are legacy-compatible entry points.
Add a new root-level validator only when one of these is true:

- an existing package script, external instruction, or compatibility surface
  needs a stable root path;
- the validator is a small governance guard for repository-wide discoverability;
- the task explicitly requires matching the existing root-level validator
  pattern.

When a new root-level validator is added, document why it stays at root or how
it will be wrapped later.

Validators must be local, deterministic, and side-effect free. They must not
perform provider contact, plugin calls, API calls, DailyNote writes, VCP memory
writes, image generation, production promotion, push, tag, release, deploy, or
destructive filesystem actions.

Runtime runners, `run_*`, `execute_*`, debug launchers, and provider-adjacent
tools are not validators. Keep them behind explicit A5 or runtime boundaries.

## Test Fixtures

`tests/schema_examples/` remains the current schema-example compatibility
surface. Do not move existing fixtures without first mapping every validator
and reference that reads the old path.

When a fixture family grows large, add one of these before moving files:

- a fixture catalog;
- a domain README;
- a validator-owned manifest;
- a dry-run migration map.

Negative cases should stay close to the validator family they protect, or be
named so their protected validator is obvious.

## Review Console

`review_console/static_prototype/` is the safe static UI surface.

`review_console/runtime_prototype/`, `review_console/embed_contract/`, and
runtime handoff documents do not authorize real VCPChat integration, IPC,
preload, renderer integration, provider calls, plugin calls, API calls,
DailyNote writes, VCP memory writes, or production promotion.

If a Review Console README starts carrying long historical release notes, split
the current usage instructions from historical records before adding more
feature history.

## Asset And Run Artifacts

Git-portable evidence belongs in the paths defined by
`docs/PROJECT_STRUCTURE.md`.

Ignored `runs/`, `release_packages/`, private local directories, caches, DB
files, logs, and local path config are not long-term recoverability baselines.
Do not use local-only output as proof of product readiness unless a tracked
manifest and validator explicitly bind it.

Image files, preview creation, image conversion, archive copying, and real
provider outputs require the exact authorization and validation path defined by
the active project gates.

## Agent Board

`.agent_board/` is the active resume rail. Add current-task summaries; do not
rewrite old history unless the task explicitly targets stale status cleanup.

Status updates should separate:

- `changed_by_this_task`
- pre-existing dirty worktree entries
- validation that passed
- validation that was not run
- commit or push status
- next safe task

If `.agent_board` becomes too large, design a compaction plan first. Do not
silently delete old resume material.

## Before Moving Files

Physical file movement needs a separate movement plan.

The plan must include:

- exact source paths;
- exact target paths;
- reference scan results;
- wrapper or redirect strategy when old paths are still called;
- validation commands;
- rollback plan;
- explicit non-authorization for push, tag, release, deploy, provider, plugin,
  API, image generation, memory, production, secret, and destructive actions.

No broad restructure is allowed without this evidence.

## Validation

For structure-governance changes, run at minimum:

```text
node --check scripts\validate_repository_structure_governance.js
node scripts\validate_repository_structure_governance.js
node scripts\validate_agent_board_state.js
git diff --check
git status --short --branch
```

When a change affects current runtime, MVP, public disclosure, package scripts,
or historical archive records, also run the project-specific validator named by
`docs/PROJECT_STRUCTURE.md` or the affected README.
