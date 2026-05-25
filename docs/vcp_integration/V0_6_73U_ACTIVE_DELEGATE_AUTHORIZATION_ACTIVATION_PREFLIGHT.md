# V0.6.73u Active Delegate Authorization Activation Preflight

```yaml
phase: v0_6_73u_active_delegate_authorization_activation_preflight
base_contract: AGENTS.md
mode: Green local activation preflight contract only
source_phase: v0_6_73t_next_phase_selection_gate
source_status: COMPLETED_VALIDATED_selection_opened
result: COMPLETED_VALIDATED
```

## Purpose

This gate defines the non-executing activation preflight for a future exact active bound NativeDoubao delegate authorization.

It does not activate a delegate, bind a runtime delegate, push local commits, execute v0.6.73 real generation, activate the exact authorization phrase, contact a provider, call a plugin, call an API, generate an image, read image binary data, write output, write a successful generation receipt, write a review handoff, read `.env` or `.env.local`, read a secret value, write DailyNote, write VCP memory, write `accepted_samples`, or write `production_candidate`.

## Activation Preflight Packet

```yaml
activation_preflight_id: ACT-PREFLIGHT-V0-6-73U
target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot
source_selection_gate_ref: docs/vcp_integration/V0_6_73T_NEXT_PHASE_SELECTION_GATE.md
source_delegate_draft_ref: docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md
source_delegate_preflight_ref: docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md
source_final_boundary_review_ref: docs/vcp_integration/V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW.md
activation_status: preflight_only_not_active
delegate_binding_active: false
exact_active_delegate_authorization_present: false
authorization_phrase_active: false
can_execute_now: false
runner_policy: fail_closed_until_activation_preflight_and_final_authorization_pass
```

## Required Active Authorization Shape

```yaml
required_active_authorization:
  authorization_packet_id: AUTH-ACTIVE-V0-6-73U-BOUND-DELEGATE
  authorization_status_required: active
  activation_preflight_id_required: ACT-PREFLIGHT-V0-6-73U
  target_execution_phase_required: v0_6_73_real_vcp_agent_generation_execution_one_shot
  bridge_id_required: native_doubao_secretless_provider_runtime_bridge:v0_6_73h
  delegate_id_required: native_doubao_owner_runtime_delegate:v0_6_73_one_shot
  provider_binding_ref_required: native_doubao:capability:owner-runtime:v0_6_73
  provider_binding_ref_redacted_required: true
  provider_binding_ref_is_secret_required: false
  owner_process_required: VCPToolBox_or_owner_authorized_provider_runtime
  max_provider_calls_required: 1
  max_plugin_calls_required: 1
  max_api_calls_required: 1
  max_images_created_required: 1
  retry_limit_required: 0
  output_directory_ref_required: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
  receipt_ref_required: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json
  review_handoff_ref_required: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json
  human_review_required: true
  review_console_required: true
```

## Required Denials

```yaml
required_denials:
  env_file_content_read_allowed: false
  secret_value_allowed: false
  raw_prompt_payload_allowed: false
  raw_provider_payload_retained_allowed: false
  private_absolute_path_allowed: false
  overwrite_existing_files_allowed: false
  image_binary_read_allowed_before_review: false
  accepted_samples_write_allowed: false
  production_candidate_write_allowed: false
  DailyNote_write_allowed: false
  VCP_memory_write_allowed: false
```

## Preflight Decision

```yaml
preflight_decision: FAIL_CLOSED_ACTIVATION_NOT_ACTIVE
preflight_passed_for_real_execution: false
failure_reason: active_authorization_packet_absent_and_final_phrase_inactive
runner_must_stop_before_provider_contact: true
runner_must_stop_before_plugin_call: true
runner_must_stop_before_api_call: true
runner_must_stop_before_image_generation: true
runner_must_stop_before_output_write: true
```

## Stop Conditions

```yaml
stop_conditions:
  - active_authorization_packet_absent
  - authorization_status_not_active
  - activation_preflight_id_mismatch
  - target_execution_phase_mismatch
  - bridge_id_mismatch
  - delegate_id_mismatch
  - provider_binding_ref_not_redacted
  - provider_binding_ref_marked_secret
  - budget_not_exact_one_shot
  - retry_limit_not_zero
  - output_directory_not_exact
  - receipt_path_not_exact
  - review_handoff_path_not_exact
  - human_review_gate_missing
  - review_console_gate_missing
  - env_file_read_allowed
  - secret_value_allowed
  - raw_payload_retention_allowed
  - promotion_or_memory_write_allowed
```

## Boundary Evidence

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
image_binary_read_performed: false
output_write_performed: false
receipt_write_performed: false
review_handoff_write_performed: false
env_file_content_read_performed: false
env_local_file_content_read_performed: false
secret_value_read_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
push_performed: false
v0_6_73_execution_allowed: false
next_safe_task: v0_6_73u3_runtime_delegate_binding_test_harness_no_provider
```

## Validation

```yaml
required:
  - node --check scripts/validate_v0_6_73u_active_delegate_authorization_activation_preflight.js
  - node scripts/validate_v0_6_73u_active_delegate_authorization_activation_preflight.js
  - node scripts/validate_v0_6_73t_next_phase_selection_gate.js
  - node scripts/lib/governance_tooling_maintenance_slice.js
  - npm run validate:mvp
  - git diff --check
```
