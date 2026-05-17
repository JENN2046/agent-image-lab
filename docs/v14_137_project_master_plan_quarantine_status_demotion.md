# V14.137 PROJECT_MASTER_PLAN Quarantine Status Demotion

```yaml
phase: v14_137_project_master_plan_quarantine_status_demotion
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_implementation
risk_level: R2
source_phase: v14_136_accepted_samples_recoverability_metadata_patch
status: completed_validated
```

## Purpose

This phase demotes `PROJECT_MASTER_PLAN.md` from a current routing surface to a
historical reference. The file still preserves useful old ledger context, but
it must not raise product progress, dashboard progress, production readiness, or
VCP runtime readiness.

Current route selection remains anchored to `.agent_board/RUN_STATE.md`, the
active user goal, and the v14.131-v14.136 real artifact recoverability chain.

## Demotion Result

```yaml
project_master_plan_quarantined: true
project_master_plan_status_demoted: true
project_master_plan_status: historical_reference_only
project_master_plan_default_authority: false
default_routing_authority: false
current_goal_routing_source: .agent_board/RUN_STATE.md
current_artifact_recoverability_chain: v14.131-v14.136
legacy_ledger_progress_promotion_blocked: true
old_ledger_must_not_raise_product_progress: true
dashboard_progress_from_project_master_plan_allowed: false
current_route_remains_artifact_recoverability_chain: true
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Explicit Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
failure_samples_write_performed: false
production_candidate_created: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
```

## Validation

```text
node --check scripts/validate_v14_137_project_master_plan_quarantine_status_demotion.js: passed
node scripts/validate_v14_137_project_master_plan_quarantine_status_demotion.js: passed
```

## Next Council Cycle

```yaml
commander_decision:
  next_safe_cycle: dashboard_alignment_from_real_artifact_evidence
  reason: >
    The old master plan ledger is now explicitly historical. The next safe
    task is to align dashboard/progress surfaces so they can show only
    v14.131 real artifact recoverability evidence, not documentation tokens.
```
