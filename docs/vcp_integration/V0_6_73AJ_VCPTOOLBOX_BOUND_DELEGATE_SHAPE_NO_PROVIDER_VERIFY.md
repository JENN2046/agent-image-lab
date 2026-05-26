# V0.6.73AJ VCPToolBox Bound Delegate Shape No-Provider Verify

```yaml
phase: v0_6_73aj_vcptoolbox_bound_delegate_shape_no_provider_verify
result: COMPLETED_VALIDATED_VCPTOOLBOX_BOUND_DELEGATE_SHAPE_NO_PROVIDER
base_contract: AGENTS.md
intent: local_implementation
lane: Green
real_vcptoolbox_modified: false
real_vcptoolbox_executed: false
mock_plugin_manager_only: true
```

## Goal

Verify the next safe shape for a VCPToolBox-owned NativeDoubao secretless runtime delegate without touching real VCPToolBox runtime, reading secrets, calling providers, or generating images.

## Read-Only VCPToolBox Injection Points

Observed real VCPToolBox paths, read only:

- `A:\VCP\apps\VCPToolBox\server.js`
  - `ENABLE_AI_IMAGE_AGENTS_ROUTE === 'true'` mounts `/admin_api/ai-image-agents`.
  - `ENABLE_AI_IMAGE_REAL_EXECUTION === 'true'` injects `pluginManager`.
- `A:\VCP\apps\VCPToolBox\routes\admin\aiImageAgents.js`
  - `handleAiImagePipelineRequest()` forwards `pluginManager` to `executeAiImagePipelineV2()` only when real execution is explicitly enabled.
- `A:\VCP\apps\VCPToolBox\modules\aiImagePipelineExecutor.js`
  - `executeAiImagePipelineV2()` allowlists real execution for `DoubaoGen`.
- `A:\VCP\apps\VCPToolBox\modules\aiImageExecutionAdapter.js`
  - `executeImagePlan()` calls `pluginManager.processToolCall()`.

## Verified Mock Call Shape

The local no-provider harness binds a mock VCPToolBox-style delegate through `createBoundSecretlessProviderRuntimeBridge()` and verifies this shape:

```yaml
tool_name: DoubaoGen
tool_args:
  command: generate
  model: doubao-seedream-5-0-260128
  resolution: 1024x1024
execution_context:
  requestSource: agent-image-lab-secretless-runtime
  providerBindingRefRedacted: true
```

The mock `pluginManager.processToolCall()` is called exactly once. It is not a real VCPToolBox call and does not contact a provider.

## Boundary Proof

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
image_binary_read_performed: false
output_write_performed: false
env_file_content_read_performed: false
secret_value_read_performed: false
raw_provider_payload_returned: false
provider_url_returned: false
v0_6_73_execution_allowed: false
```

## Validation

```text
node scripts/native_doubao_vcptoolbox_bound_delegate_shape_no_provider.js
node scripts/validate_v0_6_73aj_vcptoolbox_bound_delegate_shape_no_provider_verify.js
```

## Next Safe Task

```yaml
next_safe_task: draft_vcptoolbox_real_runtime_binding_patch_or_stop
requires_before_real_runtime_patch:
  - explicit authorization to modify A:\VCP\apps\VCPToolBox
  - exact target files
  - no secret value reads
  - no provider/API call during patch validation
```
