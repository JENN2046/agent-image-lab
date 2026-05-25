# V0.6.73v Exact Active Delegate Authorization Packet Draft

```yaml
phase: v0_6_73v_exact_active_delegate_authorization_packet_draft
base_contract: AGENTS.md
mode: Green local authorization packet draft only
source_phase: v0_6_73u3_runtime_delegate_binding_test_harness_no_provider
source_status: COMPLETED_VALIDATED_no_provider_harness_passed
result: COMPLETED_VALIDATED
```

## Purpose

This gate drafts the exact active delegate authorization packet shape required for a future NativeDoubao one-shot execution.

It is not active authorization. It does not activate a delegate, bind a runtime delegate, push local commits, execute v0.6.73 real generation, activate the exact final authorization phrase, contact a provider, call a plugin, call an API, generate an image, read image binary data, write output, write a successful generation receipt, write a review handoff, read `.env` or `.env.local`, read a secret value, write DailyNote, write VCP memory, write `accepted_samples`, or write `production_candidate`.

## Exact Active Delegate Authorization Packet Draft

```yaml
authorization_packet_id: AUTH-ACTIVE-V0-6-73U-BOUND-DELEGATE
authorization_status: draft_not_active
activation_preflight_id: ACT-PREFLIGHT-V0-6-73U
target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot
source_activation_preflight_ref: docs/vcp_integration/V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT.md
source_no_provider_harness_ref: docs/vcp_integration/V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER.md
source_secretless_bridge_ref: docs/vcp_integration/V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE.md
bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h
delegate_id: native_doubao_owner_runtime_delegate:v0_6_73_one_shot
delegate_binding_active: false
exact_active_delegate_authorization_present: false
authorization_phrase_active: false
can_execute_now: false
```

## Required Binding Terms

```yaml
binding_terms:
  owner_process: VCPToolBox_or_owner_authorized_provider_runtime
  secret_owner_process: VCPToolBox_or_owner_authorized_provider_runtime
  provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73
  provider_binding_ref_redacted: true
  provider_binding_ref_is_secret: false
  selected_route: NativeDoubaoImage_one_shot_project_plugin
  selected_plugin_id: NativeDoubaoImage
  provider_id: NativeDoubaoImage
  model: doubao-seedream-5-0-260128
  prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml
  output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
  receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json
  review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json
```

## Exact Budget And Denials

```yaml
budget:
  max_provider_calls: 1
  max_plugin_calls: 1
  max_api_calls: 1
  max_images_created: 1
  retry_limit: 0

required_denials:
  overwrite_existing_files_allowed: false
  raw_prompt_payload_allowed: false
  raw_provider_payload_retained_allowed: false
  secret_value_allowed: false
  env_file_content_read_allowed: false
  private_absolute_path_allowed: false
  image_binary_read_allowed_before_review: false
  accepted_samples_write_allowed: false
  production_candidate_write_allowed: false
  DailyNote_write_allowed: false
  VCP_memory_write_allowed: false
```

## Activation Conditions

```yaml
activation_conditions_required_later:
  - authorization_status_changed_from_draft_not_active_to_active_by_exact_human_authorization
  - delegate_binding_active_true_after_controlled_owner_runtime_binding
  - exact_active_delegate_authorization_present_true
  - authorization_phrase_active_true_after_final_GO_review
  - final_go_no_go_review_returns_GO
  - exact_human_phrase_names_v0_6_73_real_vcp_agent_generation_execution_one_shot
  - no_output_receipt_or_review_handoff_path_collision
  - npm_run_validate_mvp_passed_after_activation
```

## Current Draft Decision

```yaml
draft_decision: FAIL_CLOSED_DRAFT_NOT_ACTIVE
preflight_passed_for_real_execution: false
runner_must_stop_before_provider_contact: true
runner_must_stop_before_plugin_call: true
runner_must_stop_before_api_call: true
runner_must_stop_before_image_generation: true
runner_must_stop_before_output_write: true
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
next_safe_task: v0_6_73w_active_delegate_authorization_validator
```

## Validation

```yaml
required:
  - node --check scripts/validate_v0_6_73v_exact_active_delegate_authorization_packet_draft.js
  - node scripts/validate_v0_6_73v_exact_active_delegate_authorization_packet_draft.js
  - node scripts/validate_v0_6_73u3_runtime_delegate_binding_test_harness_no_provider.js
  - node scripts/lib/governance_tooling_maintenance_slice.js
  - npm run validate:mvp
  - git diff --check
```
