# V0.6.33 Exact New-Trial 003 Selected Candidate Human Approval Intake Package

Status: `completed_validated_local_human_approval_intake_package_pending_external_user_submission`

## Purpose

- Convert the `v0.6.32` preferred-candidate result into an exact future human
  approval intake package for `shot_2`.
- Freeze the exact approval wording, target sample id, category index path, and
  post-approval write scope before any accepted-sample, archive, production, or
  memory path is allowed.
- Keep the blocker honest: `human_approval_captured_now: false`.

## Selected Candidate Scope

```yaml
source_human_review_ref: reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json
source_selected_candidate_closeout_ref: reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json
candidate_attempt_id: v0_3_3_exact_new_trial_003_shot_2
proposed_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
category: fashion_lookbook_portrait
artifact_ref: runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png
verified_sha256: 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
verified_dimensions: 941x1672
verified_mime: image/png
reviewer_required: Jenn
```

## Exact Future Approval Statement

```text
我 Jenn 明确通过 exact_new_trial_003 的候选 v0_3_3_exact_new_trial_003_shot_2 作为 1 个 accepted sample 的 human approval；批准的 sample_id 为 accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001；category 为 fashion_lookbook_portrait；对应 artifact 为 runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png，sha256=8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b，dimensions=941x1672，mime=image/png；允许 Agent Image Lab 后续在 A4.8 / Smart Standing Authorization v3 本地边界内仅登记 accepted_samples 元数据和 fashion_lookbook_portrait 分类索引，不复制图片、不修改 runs 源图、不晋级 production_candidate、不写 failure_samples、不写 DailyNote、不写 VCP memory、不调用 provider/API/plugin/MCP、不读取 .env/.env.local、不读取 real manifest/VCPChat/VCPToolBox、不 push/tag/release/deploy；审批人 Jenn。
```

## Future Allowed Files After Real Approval

- `accepted_samples/accepted_sample_registry.yaml`
- `accepted_samples/categories/fashion_lookbook_portrait.yaml`

## Current Blocker Still Applies

```yaml
approval_statement_source: fixture_only_not_user_submitted
approval_statement_source_is_user_submission: false
approval_statement_matches_required_form: true
human_approval_captured_now: false
registration_unlocks_only_after_external_user_approval: true
accepted_samples_registration_ready_now: false
current_registration_blocker: human_approval_missing
```

## Boundary Confirmation

```yaml
human_approval_intake_package_only: true
accepted_samples_write_performed: false
category_index_write_performed: false
archive_write_performed: false
production_candidate_write_performed: false
failure_samples_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
env_or_secret_read_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
staging_performed: false
commit_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Recommended Next

- Prepare the post-approval gate alignment for this selected candidate so the
  future accepted-sample registration path remains exact-file and fail-closed.
