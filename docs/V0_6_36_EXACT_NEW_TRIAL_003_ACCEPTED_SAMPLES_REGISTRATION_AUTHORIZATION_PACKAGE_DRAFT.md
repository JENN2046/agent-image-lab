# v0.6.36 Exact New-Trial 003 accepted_samples Registration Authorization Package Draft

```yaml
phase: v0_6_36_exact_new_trial_003_accepted_samples_registration_authorization_package_draft
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: authorization_package_draft_only
```

## Purpose

Prepare the smallest exact authorization package text for registering the
selected `exact_new_trial_003` `shot_2` candidate as an `accepted_sample`
later.

This phase does not grant authorization, does not capture human approval, and
does not write `accepted_samples` metadata.

## Current Blocker

```yaml
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
human_approval_status: pending
approved_by: null
registration_ready: false
authorization_package_status: prepared_blocked_not_granted
authorization_granted_by_this_record: false
execution_ready: false
blocker: human_approval_missing
```

## Exact Approval Statement Draft

```text
批准进入 AUTH-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-ACCEPTED-SAMPLES-REGISTRATION-20260524-001 A4.8 accepted_samples metadata registry write execution：将 reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json 与 reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json 对应的候选 accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001 登记为 accepted sample；允许仅修改 accepted_samples/accepted_sample_registry.yaml 和 accepted_samples/categories/fashion_lookbook_portrait.yaml；不允许复制或提交图片文件，不允许修改 runs/real_generation/ 源图，不允许写 failure_samples，不允许写 production_candidate，不允许写 DailyNote，不允许写 VCP memory，不允许 provider/API/plugin/MCP 调用，不允许读取 .env/.env.local，不允许读取 real manifest/VCPChat/VCPToolBox，不允许 push/tag/release/deploy；写入后运行 git diff --check、node scripts/validate_exact_new_trial_003_accepted_samples_registration_authorization_package_draft.js、node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js、node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js、powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1 并停止汇报结果；审批人 Jenn。
```

## Draft Scope

```yaml
would_modify_files:
  - accepted_samples/accepted_sample_registry.yaml
  - accepted_samples/categories/fashion_lookbook_portrait.yaml
forbidden_paths:
  - runs/real_generation/
  - production_candidate/
  - failure_samples/
  - .env
  - .env.local
  - real manifest
  - VCPChat
  - VCPToolBox
validation_required:
  - git diff --check
  - node scripts/validate_exact_new_trial_003_accepted_samples_registration_authorization_package_draft.js
  - node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js
  - node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js
  - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Guard

```yaml
draft_only: true
accepted_samples_write_performed: false
category_index_write_performed: false
image_file_copy_performed: false
runs_source_image_modified: false
failure_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
staging_performed: false
commit_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

This phase only prepares the exact authorization wording and machine-checkable
guard. The package remains blocked until Jenn explicitly approves the selected
candidate and the later execution preflight still matches the frozen write
scope.
