# V0.6.73AK VCPToolBox Real Runtime Binding Patch Plan

```yaml
phase: v0_6_73ak_vcptoolbox_real_runtime_binding_patch_plan
result: COMPLETED_VALIDATED_PATCH_PLAN_ONLY
base_contract: AGENTS.md
intent: local_draft
lane: Green
real_vcptoolbox_modified: false
real_vcptoolbox_executed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
secret_value_read_performed: false
remote_write_performed: false
```

## Goal

Draft the smallest real VCPToolBox runtime binding patch plan for NativeDoubao secretless execution. This record is a plan only. It does not modify `A:\VCP\apps\VCPToolBox`, does not execute VCPToolBox, does not read `.env`, `.env.local`, `config.env`, or secret values, and does not call Doubao/provider/API.

## Candidate Target Files

```yaml
candidate_target_files:
  - path: A:\VCP\apps\VCPToolBox\routes\admin\aiImageAgents.js
    role: route-level binding and request normalization
    current_entry: createAiImageAgentsRouter(options)
    reason: already receives route options and forwards pluginManager to executeAiImagePipelineV2 when real execution is enabled
  - path: A:\VCP\apps\VCPToolBox\modules\aiImagePipelineExecutor.js
    role: controlled real-execution pipeline
    current_entry: executeAiImagePipelineV2(input, options)
    reason: already gates dryRun=false, requires pluginManager, and allowlists DoubaoGen
  - path: A:\VCP\apps\VCPToolBox\modules\aiImageExecutionAdapter.js
    role: final pluginManager.processToolCall adapter
    current_entry: executeImagePlan(plan, options)
    reason: already maps DoubaoGen to pluginManager.processToolCall
  - path: A:\VCP\apps\VCPToolBox\server.js
    role: runtime dependency injection
    current_entry: ENABLE_AI_IMAGE_AGENTS_ROUTE and ENABLE_AI_IMAGE_REAL_EXECUTION gates
    reason: already injects pluginManager into the AI image route when enabled
```

## Recommended Minimal Patch Design

Preferred path: add a narrow secretless runtime delegate factory in `routes/admin/aiImageAgents.js` or a new nearby module under `modules/`, then pass the existing VCPToolBox `pluginManager` into it. The delegate should expose only a function compatible with Agent Image Lab's `secretless_provider_runtime(request)` contract.

```yaml
recommended_patch:
  new_or_modified_module: A:\VCP\apps\VCPToolBox\modules\nativeDoubaoSecretlessRuntimeDelegate.js
  exported_function: createNativeDoubaoSecretlessRuntimeDelegate
  input:
    - pluginManager
    - optional audit logger or request source tag
  output:
    - async function nativeDoubaoSecretlessRuntimeDelegate(request)
  delegate_behavior:
    - validate request.bridge_id equals native_doubao_secretless_provider_runtime_bridge:v0_6_73h
    - reject if provider_binding_ref is not redacted
    - reject if selected_plugin_id is not NativeDoubaoImage
    - map request to DoubaoGen tool call
    - call pluginManager.processToolCall only after VCPToolBox-side gates pass
    - return metadata-only sanitized result
    - never return provider raw payload, secret values, image binary, or raw URL
```

## Proposed Call Shape

```js
await pluginManager.processToolCall(
  "DoubaoGen",
  {
    command: "generate",
    prompt,
    model: request.model,
    resolution: "1024x1024"
  },
  "127.0.0.1",
  {
    requestSource: "agent-image-lab-secretless-runtime",
    bridgeId: request.bridge_id,
    providerBindingRefRedacted: true
  }
);
```

## Binding Path

```yaml
binding_path:
  server:
    file: A:\VCP\apps\VCPToolBox\server.js
    existing_gate:
      - ENABLE_AI_IMAGE_AGENTS_ROUTE=true
      - ENABLE_AI_IMAGE_REAL_EXECUTION=true
    existing_action: routeOptions.pluginManager = pluginManager
  route:
    file: A:\VCP\apps\VCPToolBox\routes\admin\aiImageAgents.js
    existing_action: handleAiImagePipelineRequest forwards pluginManager to executorOptions
  executor:
    file: A:\VCP\apps\VCPToolBox\modules\aiImagePipelineExecutor.js
    existing_action: executeAiImagePipelineV2 requires pluginManager.processToolCall and allowlists DoubaoGen
  adapter:
    file: A:\VCP\apps\VCPToolBox\modules\aiImageExecutionAdapter.js
    existing_action: executeImagePlan calls pluginManager.processToolCall
```

## Required Authorization Before Real Patch

```yaml
required_before_modifying_vcptoolbox:
  - explicit permission to modify A:\VCP\apps\VCPToolBox
  - exact target file list
  - whether a new module file is allowed
  - no .env/.env.local/config.env/secret value reads
  - no provider/API calls during patch validation
  - no real image generation during patch validation
  - no remote write, commit, or push unless separately authorized
```

## Validation Plan For Future Real Patch

```yaml
future_validation_without_provider:
  - node --check on modified VCPToolBox files
  - VCPToolBox unit test with mock pluginManager.processToolCall
  - Agent Image Lab bridge/harness test with mock delegate
  - verify processToolCall receives DoubaoGen generate shape
  - verify all external side-effect flags remain false
future_validation_with_provider:
  - requires separate exact Amber_B provider authorization
  - max_provider_calls: 1
  - max_plugin_calls: 1
  - max_images_created: 1
  - retry_allowed: false
```

## Current Stop Line

```yaml
real_vcptoolbox_patch_allowed_now: false
real_provider_execution_allowed_now: false
next_safe_task: request_exact_vcptoolbox_patch_authorization_or_stop
```
