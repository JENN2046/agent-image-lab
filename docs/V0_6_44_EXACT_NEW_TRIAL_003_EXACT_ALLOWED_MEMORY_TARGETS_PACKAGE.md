# v0.6.44 Exact New-Trial 003 Exact Allowed Memory Targets Package

```yaml
phase: v0_6_44_exact_new_trial_003_exact_allowed_memory_targets_package
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: exact_allowed_memory_targets_package_only
```

## Purpose

Freeze the exact future DailyNote and VCP memory targets for the selected
`shot_2` route without activating any memory write.

This phase prepares the target package only. It does not write `DailyNote`,
write `VCP memory`, modify `accepted_samples`, copy archive assets, or promote
the candidate into production.

## Decision

```yaml
targets_package_created: true
targets_package_ref: reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json
report_ref: reports/visual_asset_eval_dry_run/v0_6_44_exact_new_trial_003_exact_allowed_memory_targets_package.json
validator_ref: scripts/validate_exact_new_trial_003_exact_allowed_memory_targets_package.js
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
category: fashion_lookbook_portrait
exact_allowed_memory_targets_defined: true
exact_allowed_memory_targets_count: 2
execution_allowed_now: false
```

## Exact Target Scope

```yaml
package_type: exact_allowed_memory_targets
package_status: draft_only_blocked_by_accepted_sample_archive_production_and_memory_authorization_dependencies
memory_delta_draft_ref: reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml
sensitive_data_scan_ref: reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json
exact_allowed_memory_targets:
  - system: DailyNote
    operation: write_one_entry
    language: zh-CN
    target_id: exact_new_trial_003_shot_2_daily_note_review_learning_entry
  - system: VCP_memory
    operation: write_one_summary_after_DailyNote_success
    language: zh-CN
    target_id: exact_new_trial_003_shot_2_vcp_memory_review_learning_summary
forbidden_memory_targets:
  - .env
  - .env.local
  - real VCPChat
  - real VCPToolBox
  - accepted_samples/
  - asset_archive/
  - production/
```

## Explicit Non-Authorization

```yaml
accepted_sample_registration_completed: false
durable_archive_ready: false
production_candidate_ready: false
daily_note_write_authorized: false
vcp_memory_write_authorized: false
write_command_permission: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
accepted_samples_write_performed: false
archive_write_performed: false
production_candidate_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

The exact-new-trial memory path now has a precise two-target package for the
future `DailyNote` and `VCP memory` route. The path is still blocked from
execution because human approval, `accepted_samples` registration, durable
archive completion, production readiness, and exact DailyNote / VCP memory
authorization are still absent.
