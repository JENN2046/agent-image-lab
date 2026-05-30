# Memory Write Payload Contract

Base contract: `AGENTS.md`

Phase: `AIL-MEM-02_memory_payload_contract`
Mode: `docs_only_schema_planning`

## 1. Purpose

This document defines the repository-side contract for memory candidates and
payloads. It keeps the local staging layer separate from the canonical memory
service and makes it possible to review a candidate without accidentally
authorizing a real memory write.

No actual write to `A:\codex-memory\data\dailynote\Codex\` is allowed in this
phase.

## 2. Contract layers

### `memory_candidate`

A memory candidate is the broadest local staging object. It can be a draft,
target package, or preview bundle that is not yet executable.

Minimum meaning:

- local only
- reviewable
- no canonical mutation
- no secret values

### `memory_delta_draft`

The memory delta draft captures the proposed learning content, source evidence,
and safety notes for a future write.

Typical use:

- DailyNote draft text
- VCP memory draft text
- source evidence summary
- sensitive-data scan result

### `memory_target_package`

The target package narrows the candidate to exact target ids and operation
semantics.

Typical use:

- exact DailyNote target id
- exact VCP memory target id
- allowed language
- allowed operation
- forbidden target list

### `memory_write_payload_preview`

The payload preview is the bounded write candidate that would be sent only if
the exact writer target, the A5 gate, and the rollback plan are all present.

It should contain only the minimum information needed to execute a write-time
check.

### `dry_run_result`

The dry-run result is the local proof that the candidate was checked without
mutating the canonical memory service.

It records what would happen, not what did happen.

## 3. Repository staging directories and meaning

These directories are local staging and evidence surfaces only:

- `reports/memory_delta_drafts/`
  - source draft, safety scan, and candidate notes
- `reports/memory_target_packages/`
  - exact allowed target ids and forbidden target ids
- `reports/memory_write_payloads/`
  - combined payload refresh packages and preview bundles
- `reports/visual_asset_eval_dry_run/`
  - dry-run preflight and closeout evidence
- `docs/`
  - human-readable explanations, phase gates, and closeout notes
- `.agent_board/`
  - state surfaces, blockers, checkpoints, and task queue records

These folders may describe a write, but they do not perform one.

## 4. Canonical memory target

The canonical memory target is the separate `codex-memory` service workspace:

- `A:\codex-memory\data\dailynote\Codex\`

That path is the actual durable DailyNote / VCP memory location. It is the
write-time destination only when a real write is authorized and the exact
writer target is resolved.

## 5. Write-before / write-time / write-after

### Write-before

Before the real write, the repository should have:

- `memory_delta_draft`
- `memory_target_package`
- `memory_write_payload_preview`
- `dry_run_result`
- rollback plan
- no-write evidence

### Write-time

Write-time is the real mutation of the canonical memory target. It is allowed
only when:

- the target id is exact
- the writer is callable
- the target is non-secret and non-broad
- the canonical root preflight passes
- the payload is reviewed
- the A5 gate is satisfied
- the rollback path exists

### Write-after

After a real write, the repository should record only local metadata:

- receipt
- registry entry
- review closeout
- `.agent_board` sync when status surfaces changed

Write-after is evidence, not the memory store itself.

## 6. Memory candidate vs actual memory write

### Memory candidate

A memory candidate is any local object that looks eligible for memory
processing but is still on the repository side of the boundary.

It may be:

- a draft
- a target package
- a preview bundle
- a dry-run closeout

### Actual memory write

An actual memory write means the canonical memory service has been mutated.

The write is only real if the canonical path changes:

- `A:\codex-memory\data\dailynote\Codex\`

Candidate does not imply write. Approval does not imply write. Review does not
imply write. Only the actual canonical mutation is a real write.

## 7. Forbidden raw fields

The following must not appear in payloads, receipts, preview files, or docs
intended for the memory pipeline:

- raw secrets
- api keys
- tokens
- cookies
- raw env content
- raw provider payloads
- raw provider responses
- image binaries
- private local paths
- unredacted chat history
- customer private data
- endpoints or websocket URLs when they expose private or secret context

Preferred replacements:

- sanitized refs
- target ids
- bounded summaries
- hashes
- repository-relative non-secret paths

## 8. Required human review fields

Every memory candidate packet should carry the following review fields:

- reviewer
- review_status
- human_approval_required
- approval_status
- risk_flags
- memory_suitability
- archive_status
- exact writer target status
- rollback availability

If any required human review field is missing, the packet is still a draft.

## 9. Memory suitability rules

Use these stable labels:

- `draft_only`
  - not ready for any write
- `reviewable_only`
  - readable, but not ready for execution
- `deferred`
  - potentially useful later, but not executable now
- `blocked`
  - cannot proceed because a required gate or exact target is missing
- `ready_for_a5`
  - exact target and authorizations are present, but execution is still a
    separate step

Rules:

- a candidate may be reviewable without being ready
- a draft may be structurally correct and still blocked
- `ready_for_a5` never means `actual_memory_write_performed: true`
- `deferred` is the safe label when the content is useful but the write path is
  still unresolved

## 10. Rollback fields

Every write-ready packet must define rollback fields before execution:

- `rollback_path`
- `cleanup_steps`
- `previous_state_ref`
- `receipt_rollback_ref`
- `registry_rollback_ref`
- `human_review_revert_note`

Rollback must be defined before any real write is attempted.

## 11. A5 gate requirements

A real memory write requires:

- exact allowed target id
- exact operation
- exact payload source
- canonical root preflight
- write budget
- receipt path
- registry path
- rollback path
- post-write validation
- no secret reads
- no raw private data
- no broad VCPChat / VCPToolBox write
- no push / tag / release / deploy

If the exact writer target cannot be resolved, stop at draft-only or
no-write.

## 12. Closeout YAML template

Use this template for the local closeout record:

```yaml
phase_name: AIL-MEM-XX_<short_name>
mode: docs_only_schema_planning | A5_amber_budgeted_write | Red_blocked
objective: >
  Describe the exact memory payload boundary or real write boundary in one sentence.
memory_candidate:
  type: draft | target_package | preview | dry_run_result
  review_status: pending | passed | blocked
repo_staging_artifacts:
  - reports/memory_delta_drafts/<file>
  - reports/memory_target_packages/<file>
  - reports/memory_write_payloads/<file>
canonical_memory_target: A:\\codex-memory\\data\\dailynote\\Codex\\
write_before:
  exact_target_resolved: false
  canonical_root_preflight_passed: false
  rollback_defined: false
write_time:
  actual_memory_write_performed: false
  daily_note_written: false
  vcp_memory_written: false
write_after:
  receipt_path: <local receipt path or null>
  registry_path: <local registry path or null>
  closeout_path: <local closeout path>
boundary_checks:
  codex_memory_mutated: false
  image_generated: false
  provider_called: false
  plugin_called: false
  api_called: false
  runtime_execution_performed: false
  production_candidate_002_started: false
  batch_005_started: false
next_phase_started: false
```

## 13. Summary

This contract keeps the repository on the staging side of the boundary. The
canonical memory target remains:

- `A:\codex-memory\data\dailynote\Codex\`

Any future memory packet must be able to prove exact target resolution, safety,
rollback, and no raw field leakage before a real write is allowed.
