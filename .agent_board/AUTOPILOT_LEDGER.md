# Autopilot Ledger

This ledger records meaningful Smart Standing Authorization v3 Amber receipts.
It is append-only in normal operation. Repository reality and validator output
remain the source of truth.

---

## autopilot_false_readiness_negative_cases_v1

```yaml
task_id: autopilot_false_readiness_negative_cases_v1
lane: Green
action_performed: local_false_readiness_negative_case_validation
selected_task: add_false_readiness_negative_case_validator
candidate_gap_count: 4
negative_case_count: 6
caught_negative_case_count: 6
all_negative_cases_caught: true
validator_ref: scripts/validate_autopilot_false_readiness_negative_cases.js
fixture_ref: tests/schema_examples/autopilot_false_readiness_negative_cases.example.json
result: completed_validated_guarded_local_commit
push_status: not_performed
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```

---

## current_boundary_semantics_cleanup_v1

```yaml
task_id: current_boundary_semantics_cleanup_v1
lane: Green
action_performed: local_boundary_semantics_validator_tightening
fixture_next_safe_task_evidence: add_goal_decomposition_runtime_validation
fixture_next_safe_task_evidence_type: historical_test_fixture_only
current_next_boundary: owner_push_safety_gate_after_review
current_next_boundary_type: Red push-safety-gate boundary
no_executable_local_task_required_before_push_safety_gate_unless_validator_fails: true
result: completed_validated_guarded_local_commit
push_status: not_performed
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```

---

## Receipt: amber_01_local_receipt_trial

```yaml
receipt_id: receipt-amber-01-local-receipt-trial-001
task_id: amber_01_local_receipt_trial
lane: Amber
envelope_id: envelope-amber-01-local-receipt-trial
action_performed: local_repository_truth_snapshot_and_receipt_record
target_systems:
  - local_repository_only
budget:
  max_provider_calls: 0
  max_plugin_calls: 0
  max_api_calls: 0
  max_image_candidates: 0
  max_external_read_files: 0
  max_write_files: 4
  max_dependency_actions: 0
  max_runtime_probe_minutes: 0
  retry_count: 0
files_written_count: 4
receipt_ref: tests/schema_examples/autopilot_execution_receipt.amber_01_local_trial.example.json
documentation_ref: docs/AMBER_01_LOCAL_RECEIPT_TRIAL.md
validator_ref: scripts/validate_autopilot_governance_kernel.js
validation_result: passed
rollback_or_cleanup_available: true
next_auto_step_allowed: true
stop_reason: none
red_gates_triggered: []
guard:
  provider_contact_performed: false
  plugin_call_performed: false
  api_call_performed: false
  image_generation_performed: false
  DailyNote_write_performed: false
  VCP_memory_write_performed: false
  real_manifest_read_performed: false
  real_vcpchat_read_performed: false
  real_vcptoolbox_read_performed: false
  dependency_change_performed: false
  runtime_probe_performed: false
  secret_value_read_performed: false
  push_tag_release_deploy_performed: false
```

---

## Receipt: amber_02_production_candidate_metadata_receipt_replay

```yaml
receipt_id: receipt-amber-02-production-candidate-metadata-replay-001
task_id: amber_02_production_candidate_metadata_receipt_replay
lane: Amber
envelope_id: envelope-amber-02-production-candidate-receipt-replay
action_performed: local_production_candidate_metadata_receipt_replay
target_systems:
  - local_repository_only
  - existing_production_candidate_metadata
budget:
  max_provider_calls: 0
  max_plugin_calls: 0
  max_api_calls: 0
  max_image_candidates: 0
  max_external_read_files: 0
  max_write_files: 4
  max_dependency_actions: 0
  max_runtime_probe_minutes: 0
  retry_count: 0
files_written_count: 4
receipt_ref: tests/schema_examples/autopilot_execution_receipt.amber_02_production_candidate_replay.example.json
documentation_ref: docs/AMBER_02_PRODUCTION_CANDIDATE_RECEIPT_REPLAY.md
source_evidence_ref: reports/production_candidate_authorization/2026-05-21_tennis_wallet_production_candidate_A5_activation_preflight.json
historical_candidate_id: accepted_product_still_life_tennis_wallet_001_production_candidate_001
historical_production_candidate_write_performed: true
new_production_candidate_created_now: false
production_candidate_metadata_written_now: false
validator_ref: scripts/validate_autopilot_governance_kernel.js
validation_result: passed
rollback_or_cleanup_available: true
next_auto_step_allowed: true
stop_reason: none
red_gates_triggered: []
guard:
  provider_contact_performed: false
  plugin_call_performed: false
  api_call_performed: false
  image_generation_performed: false
  DailyNote_write_performed: false
  VCP_memory_write_performed: false
  real_manifest_read_performed: false
  real_vcpchat_read_performed: false
  real_vcptoolbox_read_performed: false
  dependency_change_performed: false
  runtime_probe_performed: false
  secret_value_read_performed: false
  push_tag_release_deploy_performed: false
```
---

## autopilot_readiness_semantic_tightening_v1

```yaml
task_id: autopilot_readiness_semantic_tightening_v1
lane: Green
action_performed: local_readiness_semantic_validator_tightening
semantic_fixes:
  - amber_future_fixture_scope_not_current_task_execution
  - evolution_next_recommended_task_advances_beyond_completed_readiness
  - agent_board_reconciler_current_state_aware
  - complete_readiness_gate_validates_final_closeout
result: completed_validated_guarded_local_commit
push_status: not_performed
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```

---

## local_full_autopilot_ready_closeout

```yaml
task_id: final_local_closeout
lane: Green
action_performed: local_full_autopilot_readiness_status_closeout
status: COMPLETED_VALIDATED_LOCAL_FULL_AUTOPILOT_READY
complete_readiness_gate: scripts/validate_complete_autopilot_readiness_gate.js
result: completed_validated_guarded_local_commit
push_status: not_performed
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```

---

## complete_autopilot_readiness_gate_v1

```yaml
task_id: complete_autopilot_readiness_gate_v1
lane: Green
action_performed: complete_local_autopilot_chain_readiness_validation
validator: scripts/validate_complete_autopilot_readiness_gate.js
fixture: tests/schema_examples/complete_autopilot_readiness_gate.example.json
readiness_result: passed_pending_final_local_closeout
result: completed_validated_guarded_local_commit
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```

---

## autopilot_evolution_engine_v1

```yaml
task_id: autopilot_evolution_engine_v1
lane: Green
action_performed: local_governance_gap_detection_and_backlog_proposal
backlog: tests/schema_examples/autopilot_evolution_backlog.example.json
proposal_count: 5
next_recommended_task: receipt_registry_negative_cases_v1
red_lane_self_authorized: false
result: completed_validated_guarded_local_commit
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```

---

## amber_dry_run_execution_loop_v1

```yaml
task_id: amber_dry_run_execution_loop_v1
lane: Amber
action_performed: local_amber_envelope_packet_receipt_dry_run
receipt: tests/schema_examples/autopilot_execution_receipt.amber_dry_run_loop.example.json
cost_amount: 0
cost_currency: not_applicable
rollback_structured: true
result: completed_validated_guarded_local_commit
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```

---

## next_safe_task_orchestrator_v1

```yaml
task_id: next_safe_task_orchestrator_v1
lane: Green
action_performed: local_next_safe_task_selection_validation
fixture_selected_next_safe_task_evidence: add_goal_decomposition_runtime_validation
orchestrator: scripts/orchestrate_next_safe_task.js
validator: scripts/validate_next_safe_task_orchestrator.js
result: completed_validated_guarded_local_commit
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```

---

## agent_board_queue_reconciler_v1

```yaml
task_id: agent_board_queue_reconciler_v1
lane: Green
action_performed: local_agent_board_queue_reconciliation_validation
source_snapshot: tests/schema_examples/autopilot_goal_decomposition_materialized.example.json
reconciler: scripts/reconcile_agent_board_queue.js
validator: scripts/validate_agent_board_queue_reconciliation.js
result: completed_validated_guarded_local_commit
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```
