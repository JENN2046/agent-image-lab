# v14.225 Review Console Six-Month Goal Gap Static Panel

```yaml
phase: v14_225_review_console_six_month_goal_gap_static_panel
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R1
status: completed_validated
purpose: expose the active six-month visual production control-layer goal as a static Review Console gap panel
fixture_ref: tests/schema_examples/v14_225_review_console_six_month_goal_gap_static_panel.example.json
validator_created: scripts/validate_v14_225_review_console_six_month_goal_gap_static_panel.js
draft_output_key: six_month_goal_gap_state
execution_mode: review_console_static_six_month_goal_gap_only
```

## Phase Delta

v14.224 freezes schema binding coverage. v14.225 adds a higher-level local
Review Console panel that maps Month 1-6 of the active goal to current evidence,
remaining gaps, and authorization blockers.

This prevents dashboard overclaiming: local artifact recoverability, dry-run
adapter records, Review Console static reading, and authorization package
drafts are useful product evidence, but they are not real VCP runtime
integration.

## Current Goal State

```yaml
month_count: 6
complete_recoverable_sample_count: 2
required_full_recoverable_sample_count: 3
remaining_full_recoverable_sample_gap: 1
hard_acceptance_three_full_samples_met: false
pending_candidate_counted_as_accepted: false
overall_status: month_1_blocked_by_third_sample_human_approval
vcp_runtime_integration_proven_month_count: 0
```

## Month Mapping

```yaml
month_1:
  objective: three_full_recoverable_accepted_samples
  status: blocked_by_human_approval_missing
  blocker: human_approval_missing
month_2:
  objective: review_console_static_productization
  status: in_progress_static_read_only
month_3:
  objective: authorization_control_layer
  status: draft_preflight_contracts_present_not_executed
  blocker: execution_requires_explicit_A5
month_4:
  objective: vcp_dry_run_adapter_productization
  status: dry_run_contract_only
  blocker: real_runtime_integration_forbidden_without_A5
month_5:
  objective: authorized_real_integration_pilot
  status: blocked_requires_jenn_A5
  blocker: no_active_A5_authorization
month_6:
  objective: v1_visual_production_control_layer_closeout
  status: not_started_not_proven
  blocker: depends_on_month_1_to_5_evidence
```

## Boundary

```yaml
local_static_panel_only: true
accepted_samples_write_performed: false
category_index_write_performed: false
failure_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
env_or_secret_read_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
dry_run_adapter_is_not_vcp_runtime_integration: true
review_console_static_read_is_not_vcp_runtime_integration: true
authorization_package_draft_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Negative Cases

The validator must fail if:

- Month 1 is marked complete with only two recoverable accepted samples
- the pending lamp candidate is counted as accepted
- any accepted_samples, category, failure_samples, production_candidate,
  DailyNote, or VCP memory write is claimed
- provider/API/plugin/MCP/image/env/manifest/VCPChat/VCPToolBox/remote action is claimed
- local recoverability, dry-run adapter, Review Console static read, or
  authorization package draft is claimed as VCP runtime integration
- the six-month goal map no longer contains six month records

## Closeout

This is a static Review Console goal-gap panel only. It does not capture Jenn
approval, does not register the third accepted sample, does not execute VCP
runtime integration, and does not prove the v1 visual production control layer.
