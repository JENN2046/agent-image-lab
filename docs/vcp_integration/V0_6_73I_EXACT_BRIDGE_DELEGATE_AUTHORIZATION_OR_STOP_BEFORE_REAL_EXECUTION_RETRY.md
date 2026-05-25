# V0.6.73i Exact Bridge Delegate Authorization Or Stop Before Real Execution Retry

```yaml
phase: v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry
base_contract: AGENTS.md
mode: Green local bridge authorization lock only
source_phase: v0_6_73h_secretless_provider_runtime_bridge
source_status: COMPLETED_VALIDATED_unbound_bridge_surface_only
result: COMPLETED_VALIDATED
```

## Purpose

This gate prevents a future real-generation retry from treating any supplied JavaScript function as an authorized NativeDoubao provider runtime delegate.

The runner may call only a controlled secretless provider runtime bridge. A bound delegate must also carry an exact active delegate authorization packet before it can be called. If that exact authorization is missing, inactive, or mismatched, the runner stops before provider contact.

## Delegate Authorization Lock

```yaml
bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h
delegate_authorization_ref: docs/vcp_integration/V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY.md
delegate_authorization_status_required: authorized_by_exact_bridge_delegate_authorization
controlled_bridge_marker_required: true
unbound_bridge_allowed_to_fail_closed: true
arbitrary_runtime_function_allowed: false
bound_delegate_without_exact_authorization_allowed: false
execution_retry_allowed_now: false
v0_6_73_execution_allowed: false
```

The unbound bridge created by `createUnboundSecretlessProviderRuntimeBridge()` remains callable only to prove the fail-closed result `BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND`. Any arbitrary function without the controlled bridge marker is rejected before invocation.

## Implemented Surfaces

```yaml
bridge_module: scripts/native_doubao_secretless_provider_runtime_bridge.js
runner_integration: scripts/run_native_doubao_image_generation.js
validator: scripts/validate_v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry.js
fixture: tests/schema_examples/v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry.example.yaml
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
next_safe_task: stop_before_real_execution_retry_until_exact_human_authorization
```

## Validation

```yaml
required:
  - node --check scripts/native_doubao_secretless_provider_runtime_bridge.js
  - node --check scripts/run_native_doubao_image_generation.js
  - node --check scripts/validate_v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry.js
  - node scripts/validate_v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry.js
  - node scripts/validate_v0_6_73h_secretless_provider_runtime_bridge.js
  - npm run validate:mvp
  - git diff --check
```
