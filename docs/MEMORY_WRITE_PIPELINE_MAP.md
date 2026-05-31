# Memory Write Pipeline Map

Base contract: `AGENTS.md`

Phase: `AIL-MEM-01_memory_write_pipeline_map`
Mode: `A0_read_only_docs_only`

## 1. What this map is for

This document maps the memory write pipeline for `agent-image-lab` and keeps a
hard separation between:

- repository staging artifacts, which are local evidence and draft surfaces
- the canonical `codex-memory` target, which is the actual long-term memory
  service

No actual memory write is allowed in this phase.

## 2. Repository staging artifacts vs canonical memory target

### Repository staging artifacts

These folders hold drafts, target packages, payload refresh packages, dry-run
receipts, and review evidence. They are part of the repository and can be
checked, reviewed, copied, or archived locally, but they are not the real memory
service.

- `reports/memory_delta_drafts/`
  - Drafted memory content
  - Safety scans for the draft
  - Source evidence for the proposed memory entry
- `reports/memory_target_packages/`
  - Exact allowed target ids for DailyNote and VCP memory
  - Target-scoped packaging that stays inside the repo
- `reports/memory_write_payloads/`
  - Combined payload refresh packages
  - Candidate write bundles that still need exact authorization and an exact
    callable writer target
- `reports/visual_asset_eval_dry_run/`
  - Preflight, dry-run, and closeout evidence
  - Review-stage metadata showing what is or is not allowed
- `docs/`
  - Human-readable phase notes, route maps, gate docs, and closeout docs
- `.agent_board/`
  - Current state surfaces, blockers, checkpoints, and next-safe-task records
- `README.md`
  - High-level project summary and current boundary snapshot

### Canonical memory target

The canonical memory target is the separate `codex-memory` service workspace:

- `A:\codex-memory\data\dailynote\Codex\`

That is the actual canonical write location for durable DailyNote / VCP memory
entries. The repository in `A:\agent-image-lab\agent-image-lab-v0.2` may prepare
drafts and exact target packages, but it is not the canonical memory store.

## 3. Write-before / write-time / write-after map

### Write-before

Before any real write, the repository should contain only local preparation
artifacts:

- memory delta draft
- sensitive data scan
- exact allowed memory targets package
- DailyNote / VCP memory write payload refresh package
- authorization package draft
- execution preflight record

During write-before, the work is still local and the canonical memory service is
not mutated.

### Write-time

Write-time is the actual call into the canonical memory target. A real write may
only happen if all of the following are true:

- the writer target is exact and callable
- the target is non-secret and non-broad
- canonical root preflight passes
- the write payload is bounded and reviewed
- the required authorization is present
- the rollback / cleanup path is already defined

For this project, the expected write-time destination is the canonical
`codex-memory` directory:

- `A:\codex-memory\data\dailynote\Codex\`

### Write-after

After a real write, the repository should record evidence locally, but only as
metadata and receipts:

- write receipt
- registry entry
- review closeout
- `.agent_board` checkpoint or run-state sync when the current task changed the
  status surfaces

Write-after is still not the same as the memory service itself. It is the local
proof layer around the real write.

## 4. `memory_candidate` vs `actual_memory_write`

### `memory_candidate`

A memory candidate is a draft or target package that looks eligible for memory
write but has not crossed the real service boundary yet.

Examples:

- a DailyNote draft
- a VCP memory draft
- an exact allowed targets package
- a payload refresh package
- a dry-run preflight package

Candidate status means:

- the content is structured
- the content may be reviewable
- the content may be approved later
- the content is still local

### `actual_memory_write`

An actual memory write means the canonical `codex-memory` service is mutated.
That is the only point where the durable memory store changes.

Actual write status means:

- the exact writer target was resolved
- the canonical path was used
- the write was executed
- the receipt / registry / closeout evidence was recorded

Candidate does not imply write. Draft does not imply write. Approval on its own
does not imply write. Only a real execution at the canonical target is an
actual memory write.

## 5. Forbidden raw fields

The following must never appear in memory write payloads, receipts, docs, or
closeout text:

- secret values
- raw env file contents
- tokens
- passwords
- cookies
- private customer data
- raw image binaries
- raw provider payload dumps
- raw provider responses
- broad filesystem paths when they expose sensitive or private data
- unredacted chat history

Safe replacements should be used instead:

- sanitized refs
- target ids
- hashed outputs
- short bounded summaries
- local repository-relative paths

## 6. A5 gate requirements

Any real memory write belongs to A5 / Amber work and must satisfy the active
standing authorization envelope.

Minimum requirements:

- exact target id
- exact allowed operation
- exact prompt or payload source
- canonical root preflight
- write budget
- receipt path
- registry path
- rollback / cleanup path
- post-write validation
- no secret reads
- no raw private data
- no broad VCPChat / VCPToolBox write
- no push / tag / release / deploy

If the exact writer target cannot be resolved, the task must stop and remain a
draft-only or no-write package.

## 7. Rollback requirement

Every write-time plan must include a rollback path before execution.

Rollback should define:

- what local evidence can be removed
- what canonical memory record can be reverted or superseded
- what receipt / registry entries would be marked as failed or rolled back
- what local closeout note should be updated

If rollback is not known, the write is not ready.

## 8. Closeout YAML template

Use this template for a local closeout record when a memory write is prepared
or rejected:

```yaml
phase_name: AIL-MEM-XX_<short_name>
mode: A0_read_only_docs_only | A5_amber_budgeted_write | Red_blocked
objective: >
  Describe the exact memory write or no-write boundary in one sentence.
repo_staging_artifacts:
  - reports/memory_delta_drafts/<file>
  - reports/memory_target_packages/<file>
  - reports/memory_write_payloads/<file>
canonical_memory_target: A:\\codex-memory\\data\\dailynote\\Codex\\
write_before:
  - draft ready or blocked
  - exact target resolved or unresolved
  - canonical root preflight passed or not passed
write_time:
  actual_memory_write_performed: false
  daily_note_written: false
  vcp_memory_written: false
write_after:
  - receipt path
  - registry path
  - local closeout path
rollback_path: <exact local cleanup or revert description>
next_phase_started: false
```

## 9. Summary

For `agent-image-lab`, the repository is the staging and evidence layer. The
canonical memory lives in the separate `codex-memory` service path:

- `A:\codex-memory\data\dailynote\Codex\`

Everything else in this repository is preparation, proof, or closeout only
unless an exact memory writer target is resolved and the A5 gate is satisfied.

For the next layer down, see `docs/MEMORY_WRITE_PAYLOAD_CONTRACT.md`, which
defines the candidate, draft, target package, preview, dry-run, and rollback
schemas for a no-write or write-ready memory packet.

For the planning layer below that, see `docs/MEMORY_CANDIDATE_DRY_RUN_PLAN.md`,
which defines the exact shape of the first future memory-candidate dry-run gate
without creating any candidate in this phase.
