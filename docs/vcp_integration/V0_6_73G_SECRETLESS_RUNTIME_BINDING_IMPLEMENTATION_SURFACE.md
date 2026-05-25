# V0.6.73g Secretless Runtime Binding Implementation Surface

```yaml
phase: v0_6_73g_secretless_runtime_binding_implementation_surface
base_contract: AGENTS.md
mode: Amber_B local implementation surface only
source_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot
source_status: BLOCKED_secretless_runtime_binding_not_callable
result: COMPLETED_VALIDATED
```

## Purpose

This gate adds a local, fail-closed NativeDoubao runner surface for the non-secret capability handle designed in v0.6.73b-f.

It does not execute real generation. It does not call NativeDoubao, a provider, a plugin runtime, an API, VCPToolBox, VCPChat, MCP, DailyNote, or VCP memory.

## Binding Contract

```yaml
provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73
provider_binding_ref_redacted: true
provider_binding_ref_is_secret: false
provider_binding_display_ref: native_doubao:capability:owner-runtime:<redacted>
secretless_runtime_required: true
secret_owner_process: VCPToolBox_or_owner_authorized_provider_runtime
agent_image_lab_receives_secret_value: false
env_file_content_read_allowed: false
secret_value_read_allowed: false
raw_provider_payload_retention_policy: forbidden
output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
```

## Implemented Behavior

`scripts/run_native_doubao_image_generation.js` now accepts the non-secret binding reference and validates it without reading `.env.local`.

When `dryRun: false` and `execution_authorized: true` are present with the secretless binding request, the runner returns a blocked status until an exact callable provider runtime bridge is supplied:

```yaml
blocked_status_without_runtime: BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE
blocked_status_with_unwired_runtime: BLOCKED_SECRETLESS_RUNTIME_BRIDGE_NOT_IMPLEMENTED
```

This preserves the v0.6.73 execution boundary while proving Agent Image Lab can recognize the non-secret handle and stop before secret exposure.

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
next_safe_task: provide_exact_secretless_provider_runtime_bridge_before_retry
```

## Validation

```yaml
required:
  - node --check scripts/run_native_doubao_image_generation.js
  - node --check scripts/validate_v0_6_73g_secretless_runtime_binding_implementation_surface.js
  - node scripts/validate_v0_6_73g_secretless_runtime_binding_implementation_surface.js
  - node scripts/validate_real_vcp_agent_generation_preflight_no_call.js
  - npm run validate:mvp
  - git diff --check
```
