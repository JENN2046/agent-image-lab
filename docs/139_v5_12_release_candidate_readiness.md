# v5.12 Release Candidate Readiness

本文把 Agent Image Lab 的“真实闭环候选”整理成最终交付候选包。该阶段只做项目内文档、schema、validator、索引和 `.agent_board` 对齐，不发布 GitHub Release，不新增 tag，不调用插件、API、DailyNote，不读取真实 VCPChat / VCPToolBox，不创建图片，也不写 VCP 记忆。

```yaml
status: completed_validated_project_local_v5_12_release_candidate_readiness
version: v5.12
current_phase: "v5.12 release candidate readiness"
validation_file: scripts/validate_v5_12_release_candidate_readiness.js
release_candidate_ready: true
final_delivery_candidate_package_ready: true
true_loop_candidate_ready: true
formal_release_published: false
github_release_published_observed: false
```

## Baseline State

```yaml
post_merge_state:
  pr_number: 3
  pr_merged: true
  pr_merge_commit_short: b3731bf
  pr_head_commit_short: 46bf42b
  merged_branch: codex/v5.11-post-merge-reconciliation
  base_branch: master
  tag_name: v5.11-post-merge-reconciliation
  tag_pushed: true
  local_master_synced: true
  origin_master_short: b3731bf
  local_head_short: b3731bf
  master_origin_divergence: "0 0"
  post_merge_reconciled: true
```

## Candidate Package Evidence

```yaml
candidate_package:
  release_readiness_report: docs/30_release_readiness_report.md
  operation_guide: docs/31_install_and_operation_guide.md
  final_acceptance_report: docs/32_final_acceptance_report.md
  github_intake_review: docs/35_v1_0_github_intake_review.md
  true_loop_closeout_record: docs/34_v1_0_true_loop_closeout.md
  true_loop_closeout_schema: tests/schema_examples/v1_0_true_loop_closeout.example.yaml
  local_delivery_closeout: docs/137_v5_10_local_true_loop_candidate_delivery.md
  post_merge_reconciliation: docs/138_v5_11_post_merge_reconciliation.md
  release_candidate_record: docs/139_v5_12_release_candidate_readiness.md
```

## True Loop Candidate Summary

```yaml
true_loop_candidate:
  scenario: Photo Studio OS
  selected_plugin_id: DoubaoGen
  model_ref: doubao-seedream-5-0-260128
  true_real_loop_completed: true
  real_execution_complete: true
  generated_asset_accepted: true
  accepted_as_project_cover: true
  acceptance_mode: human_override
  prompt_compliance_perfect: false
  known_visual_deviations_recorded: true
  accepted_asset_ref: runs/photo_studio_os_v0_10_doubao_retry/image/doubaogen/bcbe3b60-6f7b-4e92-8a9d-b5044a86b7c3.jpg
  accepted_asset_sha256: b162fab50e6a5bf95b8f761441149ee27d498a3b136eafe6322f05c5499d06f0
```

## Boundary State

```yaml
commit_authorized: false
push_authorized: false
tag_authorized: false
pr_authorized: false
merge_authorized: false
release_authorized: false
release_publish_authorized: false
package_release_authorized: false
remote_write_performed_in_this_batch: false
external_network_required: false
external_service_required: false
file_write_performed: false
real_vcpchat_source_read: false
real_vcpchat_modified: false
real_vcptoolbox_source_read: false
real_vcptoolbox_modified: false
real_manifest_read: false
api_called: false
vcp_plugin_called: false
daily_note_called: false
daily_note_direct_write_allowed: false
vcp_memory_written: false
image_file_created: false
image_binary_saved_to_git: false
image_binary_saved_to_memory: false
raw_plugin_output_saved: false
secret_value_saved: false
endpoint_raw_saved: false
runtime_log_saved: false
additional_real_generation_authorized: false
commit_tag_push_authorized: false
```

## Acceptance Meaning

v5.12 表示当前仓库已经具备最终交付候选包的本地可验证状态：真实闭环候选材料、Photo Studio OS 人工接受资产摘要、v1.0 closeout 证据链、v5.10-v5.11 交付记录、验证入口和 handoff 状态已经对齐。

它仍不是正式发布动作：GitHub Release 发布、再次真实生图、DailyNote 写入、VCP 长期记忆写入、VCPChat 集成、VCPToolBox 修改、commit、tag、push、PR 或 merge 都需要新的独立授权。
