# V0.6.73h Secretless Provider Runtime Bridge

```yaml
phase: v0_6_73h_secretless_provider_runtime_bridge
base_contract: AGENTS.md
mode: Amber_B local bridge surface only
source_phase: v0_6_73g_secretless_runtime_binding_implementation_surface
source_status: COMPLETED_VALIDATED_fail_closed_surface_only
result: COMPLETED_VALIDATED
```

## Purpose

This gate adds a local callable bridge surface between Agent Image Lab and a future owner-authorized NativeDoubao provider runtime.

The bridge is intentionally unbound. It validates the non-secret request package and returns a blocked sanitized result until a real owner runtime delegate is supplied in a later exact authorization.

## Bridge Contract

```yaml
bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h
provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73
provider_binding_ref_redacted: true
provider_binding_ref_is_secret: false
provider_binding_display_ref: native_doubao:capability:owner-runtime:<redacted>
secret_owner_process: VCPToolBox_or_owner_authorized_provider_runtime
runtime_delegate_bound: false
unbound_bridge_status: BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND
request_includes_raw_prompt_payload: false
request_includes_secret_value: false
request_includes_private_absolute_path: false
output_write_allowed_by_bridge: false
raw_provider_payload_retention_policy: forbidden
```

## Implemented Surfaces

```yaml
bridge_module: scripts/native_doubao_secretless_provider_runtime_bridge.js
runner_integration: scripts/run_native_doubao_image_generation.js
validator: scripts/validate_v0_6_73h_secretless_provider_runtime_bridge.js
fixture: tests/schema_examples/v0_6_73h_secretless_provider_runtime_bridge.example.yaml
```

The runner can now call `secretless_provider_runtime(request)` when supplied. The validation path uses only `createUnboundSecretlessProviderRuntimeBridge()`, which returns `BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND` and records all external side-effect flags as false.

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
next_safe_task: draft_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry
```

## Validation

```yaml
required:
  - node --check scripts/native_doubao_secretless_provider_runtime_bridge.js
  - node --check scripts/run_native_doubao_image_generation.js
  - node --check scripts/validate_v0_6_73h_secretless_provider_runtime_bridge.js
  - node scripts/validate_v0_6_73h_secretless_provider_runtime_bridge.js
  - node scripts/validate_v0_6_73g_secretless_runtime_binding_implementation_surface.js
  - npm run validate:mvp
  - git diff --check
```
