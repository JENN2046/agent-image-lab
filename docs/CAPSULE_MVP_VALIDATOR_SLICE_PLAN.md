# Capsule MVP Validator Slice Plan

```yaml
gate_template:
  phase: capsule_mvp_validator_slice_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: planning
  risk_level: R1
  allowed_files:
    - docs/CAPSULE_MVP_VALIDATOR_SLICE_PLAN.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
  forbidden_files:
    - scripts/validate_mvp.ps1
    - scripts/**/*.js
    - schemas/**/*.yaml
    - review_console/**
    - runs/**
    - asset_archive/**/*.png
    - asset_archive/**/*.jpg
    - asset_archive/**/*.jpeg
    - asset_archive/**/*.webp
  allowed_actions:
    - inspect validate_mvp.ps1 structure
    - design a docs-first capsule validation slice
    - keep validate_mvp.ps1 as top-level orchestrator
    - preserve current validation semantics
  forbidden_actions:
    - code refactor without explicit authorization
    - actual runs scan
    - image binary reads
    - hash or dimensions extraction
    - preview generation
    - provider/plugin/API call
    - DailyNote/VCP memory write
    - production candidate
    - dependency change
  commit:
    allowed: false
    message: null
  push:
    allowed: false
```

## Objective

Design the first safe cut for moving capsule product-core checks out of
`scripts/validate_mvp.ps1` without changing the validator contract.

This gate is docs-first only. It does not authorize editing
`scripts/validate_mvp.ps1`, adding a helper script, changing any JS validator,
changing dependencies, or skipping a current gate.

## Current Shape

`scripts/validate_mvp.ps1` is still the top-level project validation
orchestrator. It sets `$Root`, owns `$failures`, defines `Add-Failure`, checks
required project files and directories, then calls many phase validators.

The capsule product-core section is a late-file cluster that currently does two
jobs at once:

```yaml
current_responsibilities:
  orchestration:
    - call each capsule JS validator in a fixed order
    - inspect $LASTEXITCODE immediately after each command
    - parse JSON output with ConvertFrom-Json
  policy_assertions:
    - assert expected phase/status/report identifiers
    - assert accepted/failure/total counts
    - assert guard booleans remain false
    - assert negative cases fail closed
    - call Add-Failure with existing message text
```

That work is correct but review-heavy because every capsule product-core update
touches the 11k+ line MVP validator.

## Candidate Slice Boundary

The first implementation slice should extract the current capsule product-core
cluster into one PowerShell helper while leaving `validate_mvp.ps1` as the only
human-facing command.

```yaml
proposed_helper:
  path: scripts/validate_mvp_capsule_product_core.ps1
  exported_function: Invoke-CapsuleProductCoreValidation
  called_by: scripts/validate_mvp.ps1
  top_level_orchestrator_remains: scripts/validate_mvp.ps1
  dependency_change_required: false
  semantic_change_allowed: false
```

The helper should accept:

```powershell
param(
  [Parameter(Mandatory = $true)]
  [string]$Root,

  [Parameter(Mandatory = $true)]
  [scriptblock]$AddFailure
)
```

Inside the helper, each current `Add-Failure "..."` call should become:

```powershell
& $AddFailure "..."
```

The top-level validator should dot-source the helper and call it from the same
relative position where the extracted block currently lives:

```powershell
. (Join-Path $PSScriptRoot 'validate_mvp_capsule_product_core.ps1')
Invoke-CapsuleProductCoreValidation -Root $Root -AddFailure {
  param([string]$Message)
  Add-Failure $Message
}
```

This keeps failure aggregation, command ordering, and the final `Agent Image Lab
validation passed.` behavior owned by `scripts/validate_mvp.ps1`.

## Initial Extraction Set

The first code-refactor gate, if explicitly authorized later, should extract
only the contiguous capsule product-core validation calls and their existing
assertions.

```yaml
initial_slice:
  include:
    - scripts/validate_v14_231_git_tracked_preview_evidence_capsule_baseline.js
    - scripts/validate_preview_capsule_registry.js
    - scripts/validate_preview_capsule_registry_negative_cases.js
    - scripts/validate_failure_sample_capsule_registry.js
    - scripts/validate_failure_sample_capsule_registry_negative_cases.js
    - scripts/validate_failure_sample_capsule_creator_dry_run.js
    - scripts/validate_review_console_failure_capsule_snapshot.js
    - scripts/validate_multi_capsule_dashboard.js
    - scripts/validate_capsule_manifest_contract.js
    - scripts/validate_capsule_manifest_schema_runtime_binding.js
    - scripts/validate_capsule_registry_report_v2.js
    - scripts/validate_capsule_registry_report_v2_negative_states.js
    - scripts/validate_capsule_static_product_smoke_fixture.js
    - scripts/validate_capsule_static_product_smoke_review_console_snapshot.js
    - scripts/validate_capsule_static_operator_checklist_ui_mapping.js
    - scripts/validate_capsule_operator_reviewer_action_matrix.js
  preserve_in_place_or_separate_later:
    - scripts/validate_runs_backup_manifest_schema.js
    - scripts/validate_runs_restore_report_dry_run_schema.js
  reason_for_runs_holdback: >
    These checks are adjacent in validate_mvp.ps1 and share the same hard-stop
    vocabulary, but they belong to runs stewardship rather than capsule
    product-core. They must not be skipped; they should either remain in the
    top-level orchestrator during the first capsule slice or move later under a
    separate runs-stewardship slice gate.
```

If implementation discovers that additional currently-live capsule checks sit
inside the same contiguous block, the code-refactor gate should stop and update
the extraction manifest before editing rather than silently drop or widen the
slice.

## Non-Change Contract

The later code-refactor gate must preserve:

```yaml
must_preserve:
  - exact JS validator command order
  - immediate $LASTEXITCODE check after each node invocation
  - ConvertFrom-Json parsing behavior
  - all current field assertions
  - all current Add-Failure message text
  - final pass/fail behavior of scripts/validate_mvp.ps1
  - capsule gate coverage
  - guard false assertions for provider/plugin/API/image/runtime/memory/production/remote paths
  - docs-only and static-only hard-stop assertions
must_not_introduce:
  - actual runs scan
  - image binary reads
  - hash or dimensions extraction
  - preview generation
  - provider/plugin/API calls
  - DailyNote/VCP memory writes
  - production candidate writes
  - dependency changes
  - browser/runtime execution
```

## Implementation Order For Later Authorization

```yaml
authorized_code_refactor_order:
  step_1:
    action: create scripts/validate_mvp_capsule_product_core.ps1
    content: exact moved capsule product-core checks wrapped in Invoke-CapsuleProductCoreValidation
  step_2:
    action: dot-source helper from scripts/validate_mvp.ps1
    placement: same location as current capsule cluster
  step_3:
    action: replace moved block with one Invoke-CapsuleProductCoreValidation call
    preserve: runs backup/restore checks unless separately authorized for a runs slice
  step_4:
    action: run semantic-preservation validation
    required_commands:
      - pwsh -NoProfile -Command 'git diff --check'
      - pwsh -NoProfile -Command 'node scripts/validate_agent_board_state.js'
      - pwsh -NoProfile -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
      - pwsh -NoProfile -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
```

## Review Checklist For Later Code Gate

```yaml
review_checklist:
  exact_files_only:
    - scripts/validate_mvp.ps1
    - scripts/validate_mvp_capsule_product_core.ps1
    - docs/CAPSULE_MVP_VALIDATOR_SLICE_PLAN.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
  proof_required:
    - validate_mvp.ps1 still exists as the top-level entrypoint
    - no JS validator command removed
    - no current capsule gate skipped
    - no assertion text intentionally loosened
    - no dependency manifest or lockfile changed
    - no runtime/browser/provider/plugin/API/image/memory/production action performed
```

## Recommended Next

```yaml
recommended_next:
  phase: capsule_mvp_validator_slice_code_refactor_authorization_gate
  mode: A4.8 local code refactor only if explicitly authorized
  purpose: authorize the exact two-script refactor that extracts capsule product-core checks while preserving validate_mvp.ps1 semantics
  default_without_authorization: stop_after_docs_first_plan
```
