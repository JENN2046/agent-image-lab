# Memory Candidate Dry-Run Plan

Base contract: `AGENTS.md`

Phase: `AIL-MEM-03_memory_candidate_dry_run_planning_gate`
Mode: `docs_only_gate`

## 1. Purpose

This phase defines how a future `memory_candidate` dry-run artifact may be
planned, reviewed, and closed out without creating any candidate, payload, or
write result in this phase.

No actual write to `A:\codex-memory\data\dailynote\Codex\` is allowed here.
No `memory_candidate`, `memory_target_package`, `memory_write_payload`,
`dry_run_result`, DailyNote entry, or VCP memory entry may be created in this
phase.

## 2. Phase difference patch

This phase is a planning gate only.

Compared with `AIL-MEM-02_memory_payload_contract`, this phase adds the exact
shape of the first future dry-run package, but it does not create that package.

Allowed in this phase:

- define candidate naming rules
- define allowed source evidence
- define required review fields
- define required `memory_suitability` fields
- define redacted summary requirements
- define forbidden raw fields
- define future dry-run output paths
- define rollback requirements
- define validation commands
- define the closeout template

Forbidden in this phase:

- create any memory candidate file
- create any target package file
- create any payload preview file
- create any dry-run result file
- mutate the canonical `codex-memory` target
- write DailyNote
- write VCP memory
- call provider / plugin / API / runtime
- generate images

## 3. Candidate ID naming rule

Future candidate ids must be stable, repository-readable, and easy to trace
back to the source phase.

Recommended format:

```text
memcand_<source_phase>_<YYYYMMDD>_<seq3>
```

Rules:

- `memcand` is the fixed prefix for memory-candidate planning artifacts
- `<source_phase>` is the lowercase source phase id, with punctuation replaced
  by underscores
- `<YYYYMMDD>` is the local planning date for the closeout record
- `<seq3>` is a zero-padded sequence number such as `001`

Example:

```text
memcand_ail_mem_02_memory_payload_contract_20260530_001
```

## 4. Allowed source evidence

Future dry-run planning may use only local repository evidence that is already
reviewable and non-secret.

Allowed source evidence includes:

- `docs/MEMORY_WRITE_PIPELINE_MAP.md`
- `docs/MEMORY_WRITE_PAYLOAD_CONTRACT.md`
- validated `.agent_board` surfaces
- existing `reports/memory_delta_drafts/` files
- existing `reports/memory_target_packages/` files
- existing `reports/memory_write_payloads/` files
- existing `reports/visual_asset_eval_dry_run/` files
- already-validated phase docs and closeouts that are local to this repository
- `README.md` and other local project docs when they describe the same boundary

Disallowed source evidence includes:

- secret values
- raw env contents
- raw provider payloads
- raw provider responses
- unredacted chat history
- private customer data
- image binaries
- external live service output that has not been sanitized

## 5. Required review fields

Every future dry-run planning packet should carry these review fields:

- `reviewer`
- `review_status`
- `human_approval_required`
- `approval_status`
- `risk_flags`
- `archive_status`
- `exact_writer_target_status`
- `rollback_availability`

If any required review field is missing, the packet is only a draft.

## 6. Required memory_suitability fields

Use one of these stable labels:

- `draft_only`
- `reviewable_only`
- `deferred`
- `blocked`
- `ready_for_a5`

The future packet should also record:

- `memory_candidate_type` with one of `draft`, `target_package`, `preview`,
  or `dry_run_result`
- `memory_suitability_reason`
- `forbidden_raw_fields_checked`

Important:

- `ready_for_a5` means the planning packet is structurally ready for a later
  exact-A5 step
- `ready_for_a5` does not mean an actual memory write is permitted in this
  phase
- `blocked` is the safe label whenever a required gate or exact writer target
  is still unresolved

## 7. Redacted summary requirements

Future closeout packets should include a short Chinese summary field
(`redacted_summary_zh`) that explains the state without leaking raw payload
content.

The summary should:

- state whether the packet is draft-only, reviewable-only, deferred, blocked,
  or ready-for-a5
- state whether the exact writer target is resolved or unresolved
- state whether the canonical memory target is still untouched
- avoid raw payload text
- avoid secrets, tokens, or unredacted history
- stay short enough to review quickly

## 8. Forbidden raw fields

The following must never appear in planning packets, closeouts, or preview
files:

- secret values
- api keys
- tokens
- passwords
- cookies
- raw env file contents
- raw provider payload dumps
- raw provider responses
- image binaries
- unredacted chat history
- private customer data
- private absolute paths when they expose sensitive context
- broad runtime traces copied verbatim

Preferred replacements:

- sanitized refs
- target ids
- hashes
- repository-relative paths
- bounded summaries

## 9. Future dry-run output paths

This phase only plans the first future dry-run artifacts. It does not create
them.

Planned output locations for a later phase:

- `reports/memory_delta_drafts/<candidate_id>.md`
- `reports/memory_target_packages/<candidate_id>.json`
- `reports/memory_write_payloads/<candidate_id>.json`
- `reports/visual_asset_eval_dry_run/<candidate_id>_precheck.json`

If a later phase adds a closeout result, that closeout file must be documented
in that later phase, not created here.

## 10. Rollback requirement

Every future dry-run or write-ready packet must define rollback before any
real write is attempted.

Required rollback fields for the later packet:

- `rollback_path`
- `cleanup_steps`
- `previous_state_ref`
- `receipt_rollback_ref`
- `registry_rollback_ref`
- `human_review_revert_note`

If rollback is not known, the future packet is not ready.

## 11. A5 gate requirements

A real memory write remains a separate A5 / Amber step and still requires:

- exact writer target
- exact allowed operation
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

This phase only defines the plan for that later gate. It does not authorize a
real write.

## 12. Validation commands

Use only local documentation validation for this phase:

```text
git diff --check
git status --short
```

No runtime validation is required or authorized for this phase.

## 13. Closeout YAML template

Use this template for the local closeout record:

```yaml
phase_name: AIL-MEM-03_memory_candidate_dry_run_planning_gate
mode: docs_only_gate
objective: >
  Define exactly how one future memory_candidate dry-run artifact will be
  planned, reviewed, and closed out without creating it in this phase.
memory_candidate:
  type: draft | target_package | preview | dry_run_result
  review_status: pending | passed | blocked
repo_staging_artifacts:
  - reports/memory_delta_drafts/<candidate_id>.md
  - reports/memory_target_packages/<candidate_id>.json
  - reports/memory_write_payloads/<candidate_id>.json
  - reports/visual_asset_eval_dry_run/<candidate_id>_precheck.json
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
  receipt_path: null
  registry_path: null
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

## 14. Summary

This phase is the planning gate for the first future memory-candidate dry-run
artifact.

The repository stays on the staging side of the boundary. The canonical memory
target remains:

- `A:\codex-memory\data\dailynote\Codex\`

The next layer down is the actual dry-run packaging phase, which will only be
allowed after this planning gate is complete and the future packet has an exact
writer target, rollback, and review fields.
