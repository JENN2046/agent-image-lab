# V0.6.73m Bound Delegate Preflight Validator

```yaml
phase: v0_6_73m_bound_delegate_preflight_validator
base_contract: AGENTS.md
mode: Green local preflight validator only
source_phase: v0_6_73l_bound_delegate_authorization_packet_draft
source_status: COMPLETED_VALIDATED_draft_not_active
result: COMPLETED_VALIDATED
```

## Purpose

This gate defines a local fail-closed preflight validator for the future NativeDoubao bound delegate authorization packet.

It proves that when no exact active bound delegate authorization is present, the runner remains blocked before provider contact. It does not activate a delegate, contact a provider, call a plugin, call an API, generate an image, read image binary data, write output, write a receipt, write a review handoff, read `.env` or `.env.local`, read a secret value, write DailyNote, write VCP memory, write `accepted_samples`, or write `production_candidate`.

## Fail-Closed Contract

```yaml
preflight_contract_id: PFC-V0-6-73M-BOUND-DELEGATE
source_authorization_packet_ref: docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md
source_authorization_packet_id: AUTH-DRAFT-V0-6-73L-BOUND-DELEGATE
target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot
runner_policy: fail_closed_until_exact_active_bound_delegate_authorization
exact_active_delegate_authorization_present: false
authorization_status_required_for_execution: active_exact_human_authorized
current_authorization_status: draft_not_active
delegate_binding_active_required_for_execution: true
current_delegate_binding_active: false
can_execute_now: false
preflight_decision: FAIL_CLOSED_BOUND_DELEGATE_AUTHORIZATION_MISSING
provider_contact_allowed: false
plugin_call_allowed: false
api_call_allowed: false
image_generation_allowed: false
output_write_allowed: false
receipt_write_allowed: false
review_handoff_write_allowed: false
runner_must_stop_before_provider_contact: true
```

## Required Active Authorization Shape

```yaml
required_active_authorization_shape:
  authorization_packet_id: AUTH-DRAFT-V0-6-73L-BOUND-DELEGATE
  authorization_status: active_exact_human_authorized
  delegate_binding_active: true
  can_execute_now: true
  exact_human_activation_phrase_names_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot
  bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h
  delegate_id: native_doubao_owner_runtime_delegate:v0_6_73_one_shot
  provider_binding_ref_redacted: true
  provider_binding_ref_is_secret: false
  output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
  receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json
  review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json
  max_provider_calls: 1
  max_plugin_calls: 1
  max_api_calls: 1
  max_images_created: 1
  retry_limit: 0
  human_review_required: true
  review_console_required: true
```

## Rejection Cases

```yaml
reject_when:
  - exact_active_delegate_authorization_present_false
  - authorization_status_is_draft_not_active
  - delegate_binding_active_false
  - can_execute_now_false
  - exact_human_activation_phrase_missing
  - target_execution_phase_mismatch
  - bridge_id_mismatch
  - delegate_id_mismatch
  - provider_binding_ref_not_redacted
  - provider_binding_ref_is_secret_true
  - output_directory_ref_not_exact
  - receipt_ref_not_exact
  - review_handoff_ref_not_exact
  - max_provider_calls_not_one
  - retry_limit_not_zero
  - human_review_required_false
  - review_console_required_false
  - provider_contact_requested_before_preflight_pass
```

## Fixture Expectations

```yaml
fixtures:
  pass:
    path: tests/schema_examples/v0_6_73m_bound_delegate_preflight_validator.example.yaml
    expected_decision: FAIL_CLOSED_BOUND_DELEGATE_AUTHORIZATION_MISSING
    exact_active_delegate_authorization_present: false
    runner_must_stop_before_provider_contact: true
  fail:
    path: tests/schema_examples/v0_6_73m_bound_delegate_preflight_validator_fail.example.yaml
    expected_rejection: unsafe_allows_provider_contact_without_exact_active_delegate_authorization
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
v0_6_73_execution_allowed: false
next_safe_task: v0_6_73n_real_execution_go_no_go_review
```

## Validation

```yaml
required:
  - node --check scripts/validate_v0_6_73m_bound_delegate_preflight_validator.js
  - node scripts/validate_v0_6_73m_bound_delegate_preflight_validator.js
  - node --check scripts/validate_v0_6_73l_bound_delegate_authorization_packet_draft.js
  - node scripts/validate_v0_6_73l_bound_delegate_authorization_packet_draft.js
  - node scripts/lib/governance_tooling_maintenance_slice.js
  - npm run validate:mvp
  - git diff --check
```
