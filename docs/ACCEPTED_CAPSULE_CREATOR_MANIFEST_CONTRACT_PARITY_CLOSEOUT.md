# Accepted Capsule Creator Manifest Contract Parity Closeout

```yaml
gate_template:
  phase: accepted_capsule_creator_manifest_contract_parity_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_implementation
  risk_level: R2
  allowed_files:
    - scripts/create_preview_capsule.js
    - scripts/validate_create_preview_capsule_registry_source.js
    - docs/ACCEPTED_CAPSULE_CREATOR_MANIFEST_CONTRACT_PARITY_CLOSEOUT.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
  forbidden_actions:
    - create real accepted or failure capsule
    - modify runs/
    - modify asset_archive image binaries
    - read source image binaries
    - generate preview
    - call provider/plugin/API
    - run browser/runtime
    - write DailyNote or VCP memory
    - create production_candidate
    - change dependencies
    - touch secrets or .env
```

## Summary

This gate closes the fresh-output parity drift between
`scripts/create_preview_capsule.js` and the accepted-lane requirements enforced
by `scripts/lib/capsule_manifest_contract.js`.

The accepted creator now writes the accepted manifest top-level false fields
required by the current contract:

```yaml
fixed_manifest_fields:
  production_candidate_allowed: false
  memory_write_allowed: false
  DailyNote_write_allowed: false
  VCP_memory_write_allowed: false
  commercial_delivery_allowed: false
```

It also creates the common manifest guard with the extra manifest contract false
fields:

```yaml
fixed_manifest_guard_fields:
  production_candidate_created: false
  push_tag_release_deploy_performed: false
```

## Evidence Added

`scripts/validate_create_preview_capsule_registry_source.js` now includes static
source checks proving that `scripts/create_preview_capsule.js` writes:

```yaml
static_evidence_checks:
  - creator_manifest_writes_accepted_top_level_false_fields
  - creator_manifest_guard_writes_contract_false_fields
```

The validator remains no-execution evidence. It does not create a capsule, copy
a preview, generate an image, call a provider, call a plugin, call an API, write
DailyNote, or write VCP memory.

## Validation Evidence

```yaml
validation:
  node_check_create_preview_capsule: passed
  node_check_changed_validator: passed
  validate_create_preview_capsule_registry_source: passed
  validate_capsule_manifest_contract: passed
  validate_capsule_manifest_schema_runtime_binding: passed
  validate_agent_board_state_before_closeout: passed
  git_diff_check_before_closeout: passed
  validate_mvp: passed
  validate_agent_image_lab_local: passed_with_warnings_ok_for_manual_review
```

The manifest contract validator reported:

```yaml
manifest_contract_validation:
  status: capsule_manifest_contract_verified
  schema_runtime_binding_status: schema_runtime_binding_verified
  accepted: 2
  failure: 2
  total: 4
  passed: 4
  failed: 0
  preview_creation_or_copy_performed: false
  image_generation_performed: false
  provider_contact_performed: false
  plugin_call_performed: false
  api_call_performed: false
  DailyNote_write_performed: false
  VCP_memory_write_performed: false
  runtime_execution_performed: false
  real_manifest_read_performed: false
  real_vcpchat_read_performed: false
  real_vcptoolbox_read_performed: false
```

## Boundary Confirmation

```yaml
real_capsule_created: false
accepted_capsule_created: false
failure_capsule_created: false
runs_modified: false
asset_archive_image_binary_modified: false
source_image_binary_read_performed: false
preview_generation_performed: false
preview_creation_or_copy_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
browser_runtime_execution_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
production_candidate_write_performed: false
dependency_change_performed: false
secrets_or_env_touched: false
```

## Decision

```yaml
phase: accepted_capsule_creator_manifest_contract_parity_gate
status: completed_validated
result: fresh accepted creator manifest output is aligned with current accepted manifest contract fields
next_recommended_phase: capsule_mvp_validator_slice_gate
next_phase_started: false
```
