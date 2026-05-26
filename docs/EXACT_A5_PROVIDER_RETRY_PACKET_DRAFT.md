# Exact A5 Provider Retry Packet Draft

```yaml
phase: exact_a5_provider_retry_packet_draft
lane: Amber_B_provider_image_retry_when_activated
status: completed_validated_inactive_draft
adapter: adapters/runtime/exact_a5_provider_retry_packet_draft.js
validator: scripts/validate_exact_a5_provider_retry_packet_draft.js
previous_authorization_id: AUTH-DRAFT-NATIVE-DOUBAO-ONE-SHOT-20260526-001
new_authorization_id: AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-002
required_model: doubao-seedream-5-0-260128
```

## Purpose

This inactive draft defines the next exact retry boundary after the VCPToolBox
AI image execution adapter fix that forwards `step.model` into DoubaoGen
`toolArgs.model`.

The previous one-shot authorization was consumed. This draft does not authorize
another provider call by itself.

```yaml
authorization_status: draft_not_active
authorization_active: false
can_execute_now: false
requires_exact_user_activation: true
```

## Previous Attempt Evidence

```yaml
previous_authorization_id: AUTH-DRAFT-NATIVE-DOUBAO-ONE-SHOT-20260526-001
previous_attempt_status: BLOCKED_PROVIDER_RUNTIME_DELEGATE_FAILED
previous_provider_calls_used: 1
previous_plugin_calls_used: 1
previous_api_calls_used: 1
previous_images_created: 0
previous_retry_performed: false
previous_blocker: provider reported model or endpoint doubao-seedream-3-0-t2i-250415 does not exist or is not accessible
previous_authorization_consumed: true
```

## Exact Activation Phrase

To activate this retry draft later, the owner must explicitly send:

```text
我授权执行 AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-002：NativeDoubao Seedream 5 单次真实重试，最多 1 次 provider/plugin/API 调用，最多 1 张图，禁止再次重试，必须传入 model=doubao-seedream-5-0-260128，禁止读取 secret 值，禁止写 DailyNote/VCP memory/accepted_samples/production_candidate，输出仅限 runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_002/，执行后写 retry provider receipt、review handoff、durable audit record。
```

Any shorter approval such as `下一步`, `继续`, or `go ahead` is not this
activation phrase.

## When Activated

```yaml
selected_provider: NativeDoubaoImage
provider_case_id: neutral_smoke_test_red_apple_secretless_bridge
model: doubao-seedream-5-0-260128
prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml
output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_002/
provider_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_002_receipt.json
review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_002/bridge_entry.json
durable_audit_store_root: .agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_002/
max_provider_calls: 1
max_plugin_calls: 1
max_api_calls: 1
max_images_created: 1
retry_allowed: false
max_retry_count: 0
```

## Still Forbidden

```yaml
secret_value_read_allowed: false
env_file_content_read_allowed: false
overwrite_existing_files_allowed: false
production_candidate_write_allowed: false
accepted_samples_write_allowed: false
DailyNote_write_allowed: false
VCP_memory_write_allowed: false
push_tag_release_deploy_allowed: false
raw_provider_payload_retention_allowed: false
automatic_retry_allowed: false
```

## Current Non-Execution Evidence

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
env_file_content_read_performed: false
secret_value_read_performed: false
output_write_performed: false
provider_receipt_write_performed: false
review_handoff_write_performed: false
durable_audit_write_performed: false
production_write_performed: false
accepted_samples_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
push_tag_release_deploy_performed: false
```

## Validation

Run:

```powershell
npm run validate:exact-a5-provider-retry-packet
```

The validator proves the retry packet stays inactive, names the consumed
previous attempt, requires Seedream 5 model passthrough, uses fresh `retry_002`
output and evidence refs, preserves one-shot budgets, forbids another retry,
and rejects activation drift, model drift, budget drift, path reuse, previous
attempt drift, and side-effect drift.
