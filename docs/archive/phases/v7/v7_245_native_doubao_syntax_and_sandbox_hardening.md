# v7.245 Native Doubao Syntax And Sandbox Hardening

```yaml
base_contract: AGENTS.md
phase: v7.245_native_doubao_syntax_and_sandbox_hardening
mode: A4_code_static_patch
source_commit: 6bc09de0b4a62a61d168c62b1cc450a085369ef3
current_status: failed_no_image_repeated_quota_or_rate_limit
same_provider_retry_allowed_now: false
A5_execution_allowed_now: false
provider_contact_allowed_now: false
```

## Purpose

v7.245 hardens the repository-local Native Doubao execution surface before any
future A5 decision. It is a static code and validator patch only.

This phase does not retry generation, contact the provider, call a plugin,
read `.env.local` values, write memory, or create image assets.

## Patch Summary

```yaml
patched:
  syntax_check:
    - node --check native plugin, adapter, runner, sandbox validator
  prompt_package_ref:
    - reject absolute paths
    - reject backslashes
    - reject path traversal
    - enforce resolved containment under prompts/image_generation/
  output_directory:
    - reject absolute paths
    - reject backslashes
    - reject path traversal
    - enforce resolved containment under runs/real_generation/
  base_url_gate:
    - require DOUBAO_IMAGE_API_BASE_URL before realGenerate
    - require https
    - reject localhost/private network hosts by default
  call_budget:
    - maxPluginCalls must equal 1
    - maxImagesCreated must equal 1
    - retry remains forbidden
  result_redaction:
    - public adapter result exposes image_count only
    - public adapter result does not expose b64_json
    - public adapter result does not expose provider URL
  env_allowlist:
    - loadEnvLocal imports only allowed Doubao keys
    - preflight reads env field names only
  validator_drift:
    - config.yaml is accepted as placeholder config
    - legacy validators check sandbox gates
    - new sandbox validator checks negative cases
```

## Explicit Non-Authorization

```yaml
not_authorized:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  output_save: false
  memory_write: false
  DailyNote_write: false
  runtime_execution: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  env_local_value_read_or_printed: false
  CDP_bridge_MCP: false
  tag_release_deploy: false
```

## Validation

```yaml
validation:
  syntax:
    - node --check plugins/image_generation/native_doubao_image/native_doubao_image.js
    - node --check adapters/image_generation/native_doubao_adapter.js
    - node --check scripts/run_native_doubao_image_generation.js
    - node --check scripts/validate_native_doubao_sandbox.js
  static_validators:
    - node scripts/validate_native_doubao_sandbox.js
    - node scripts/validate_v7_15_native_doubao_image_plugin.js
    - node scripts/validate_v7_19_native_doubao_a5_runner_preflight.js
    - node scripts/validate_v7_20_native_doubao_real_runner_implementation.js
```

## Recommended Next

```yaml
recommended_next:
  phase: v7.246_no_generation_quota_or_provider_path_diagnostic_readiness_gate
  type: A4_planning_only
  purpose: >
    Decide, without provider contact or generation, whether to resolve quota
    externally, switch provider/model/account path, or stop generation attempts.
  auto_execution_allowed: false
```
