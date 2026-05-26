# Exact A5 Provider Execution Packet Draft

```yaml
phase: exact_a5_provider_execution_packet_draft
lane: Amber_B_provider_image_when_activated
status: completed_validated_inactive_draft
adapter: adapters/runtime/exact_a5_provider_execution_packet_draft.js
validator: scripts/validate_exact_a5_provider_execution_packet_draft.js
source_preflight: adapters/runtime/provider_preflight_no_provider_call.js
```

## Purpose

This draft turns the no-provider-call preflight into an exact, reviewable A5
execution packet for one future NativeDoubao generation attempt.

It is deliberately inactive:

```yaml
authorization_status: draft_not_active
authorization_active: false
can_execute_now: false
requires_exact_user_activation: true
```

## Exact Activation Phrase

To activate this draft later, the owner must explicitly send:

```text
我授权执行 AUTH-DRAFT-NATIVE-DOUBAO-ONE-SHOT-20260526-001：NativeDoubao 单次真实生成，最多 1 次 provider/plugin/API 调用，最多 1 张图，禁止重试，禁止读取 secret 值，禁止写 DailyNote/VCP memory/accepted_samples/production_candidate，输出仅限 runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/，执行后写 provider receipt、review handoff、durable audit record。
```

Any shorter or broader approval is not this activation phrase.

## When Activated

```yaml
selected_provider: NativeDoubaoImage
provider_case_id: neutral_smoke_test_red_apple_secretless_bridge
model: doubao-seedream-5-0-260128
prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml
output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
provider_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json
review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json
durable_audit_store_root: .agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_one_shot/
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
npm run validate:exact-a5-provider-packet
```

The validator checks the draft stays inactive, has an exact activation phrase,
uses a redacted non-secret provider binding handle, preserves a one-shot budget,
forbids retry, forbids production/memory/promotion writes, and fails closed on
activation drift, budget drift, path drift, and side-effect drift.
