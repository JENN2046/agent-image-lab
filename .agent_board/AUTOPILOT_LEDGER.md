# Autopilot Ledger

This ledger records meaningful Smart Standing Authorization v3 Amber receipts.
It is append-only in normal operation. Repository reality and validator output
remain the source of truth.

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
