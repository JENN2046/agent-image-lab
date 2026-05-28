# Exact A5 Provider Retry 007 Activation Packet Draft

```yaml
phase: exact_a5_provider_retry_007_activation_packet_draft
lane: Amber_B_provider_image_retry_007_when_activated
status: completed_validated_inactive_draft
adapter: adapters/runtime/exact_a5_provider_retry_007_activation_packet_draft.js
validator: scripts/validate_exact_a5_provider_retry_007_activation_packet_draft.js
source_preflight_decision: docs/EXACT_A5_PROVIDER_RETRY_007_PREFLIGHT_DECISION.md
execution_surface_repair_package: docs/EXACT_A5_PROVIDER_RETRY_007_VCPTOOLBOX_OUTPUT_OVERRIDE_REPAIR_PACKAGE.md
authorization_id: AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007
required_model: doubao-seedream-5-0-260128
authorization_status: draft_not_active
authorization_active: false
can_execute_now: false
```

## Purpose

This inactive draft is the separate exact packet required before any possible
`retry_007` provider execution. It reuses the existing `retry_007` preflight
decision boundaries and does not create a provider receipt, output directory,
review handoff, durable audit record, accepted sample, production candidate,
DailyNote entry, or VCP memory entry.

Current execution-surface status: blocked. VCPToolBox currently authorizes exact
output overrides through retry_006 only. The repair package below must be
separately authorized, applied, and validated before this draft can ever become
executable:

```text
docs/EXACT_A5_PROVIDER_RETRY_007_VCPTOOLBOX_OUTPUT_OVERRIDE_REPAIR_PACKAGE.md
```

## Exact Activation Phrase

The owner must send the exact phrase below before this draft can be considered
active:

```text
我授权执行 AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007：NativeDoubao Seedream 5 retry_007 单次真实生成，最多 1 次 provider/plugin/API 调用，最多 1 张图，禁止再次重试，必须传入 model=doubao-seedream-5-0-260128，禁止读取 secret 值，禁止写 DailyNote/VCP memory/accepted_samples/production_candidate，输出仅限 runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007/，执行后写 retry_007 provider receipt、review handoff、durable audit record。
```

Any shorter approval such as `继续`, `下一步`, or `go ahead` is not this
activation phrase.

## When Activated

```yaml
selected_provider: NativeDoubaoImage
provider_case_id: neutral_smoke_test_red_apple_secretless_bridge
model: doubao-seedream-5-0-260128
prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml
output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007/
provider_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_007_receipt.json
review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/bridge_entry.json
durable_audit_store_root: .agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_007/
max_provider_calls: 1
max_plugin_calls: 1
max_api_calls: 1
max_images_created: 1
retry_allowed: false
max_retry_count: 0
```

## Still Forbidden

```yaml
provider_execution_allowed_now: false
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

## Required Before Activation

```text
npm run validate:core
npm run validate:public-disclosure
npm run validate:mvp
npm run validate:provider-evidence-integrity
npm run validate:all
node scripts/validate_exact_a5_provider_retry_007_activation_packet_draft.js
node scripts/validate_exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package.js
git diff --check
```

Also required before provider execution:

```text
VCPToolBox retry_007 output override repair applied and validated
VCPToolBox node --check routes\admin\aiImageAgents.js
VCPToolBox node --test tests\aiImageAgentsRoute.test.js
VCPToolBox node --test tests\aiImageExecutionAdapter.test.js
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
vcptoolbox_retry_007_output_override_repair_applied: false
```

## Validation

Run:

```powershell
node scripts\validate_exact_a5_provider_retry_007_activation_packet_draft.js
```

The validator proves this packet stays inactive, anchors to retry_006 evidence,
inherits retry_007 preflight boundaries, uses the required Seedream 5 model, uses
fresh retry_007 output and evidence refs, keeps one-shot budgets, forbids any
retry after retry_007, and rejects activation drift, source-preflight drift,
model drift, budget drift, path reuse, missing full validation, and side-effect
drift.
