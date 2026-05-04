# 30 Release Readiness Report

本文是 Agent Image Lab 当前 release readiness 报告。它收束 v0.4 到 v1.0 的完成状态，并明确当前项目已经完成一次受控真实闭环，但远程发布、打 tag、提交和推送仍需要单独授权。

## 当前结论

```yaml
release_readiness:
  checkpoint: v1.0_true_loop_closeout
  repo_state: ready_for_local_v1_0_closeout
  true_real_loop_completed: true
  real_execution_complete: true
  generated_asset_accepted: true
  human_acceptance_override: true
  prompt_compliance_perfect: false
  final_v1_0_ready: true
  release_publish_authorized: false
  commit_or_tag_authorized: false
```

当前项目已经可以作为“真实闭环本地 v1.0 closeout”交付：文档、Adapter dry-run、VCPToolBox Adapter-only 安装验证、单一 manifest 脱敏审查、Gatekeeper/Review Console 前置包、Photo Studio OS dry-run 演练、真实执行记录和人工接受通过记录均已完成。

当前项目还不能自动发布到远端：提交、推送、打 tag、生成 release 包或发布 release 都必须由用户另行授权。

## 已完成阶段

| 阶段 | 状态 | 证据 |
|---|---|---|
| v0.4 Adapter dry-run export | 完成 | `exports/vcptoolbox/Plugin/AgentImageLabAdapter/` |
| v0.5 Adapter-only VCPToolBox 安装验证 | 完成 | `integrations/vcp/v0_5_adapter_install_verification.md` |
| v0.6 单一真实 manifest 脱敏审查 | 完成 | `integrations/vcp/v0_6_real_plugin_manifest_sanitized_review.md` |
| v0.7 前置包 | 完成 | Gatekeeper、Review Console、Preflight confirmation 三件套 |
| v0.7.1 dry-run rehearsal | 完成 | `integrations/vcp/v0_7_photo_studio_os_dry_run_rehearsal.md` |
| v0.7 first real execution | 完成但资产拒收 | `integrations/vcp/v0_7_photo_studio_os_real_execution_record.md` |
| v0.9 retry and candidate scan | 完成 | retry 记录和候选扫描记录 |
| v0.10 GPTImageGen attempts | 完成但凭据阻断 | GPTImageGen 脱敏失败记录 |
| v0.10 DoubaoGen retry | 完成并人工接受 | `integrations/vcp/v0_10_doubaogen_retry_real_execution_record.md` |

## 当前资产状态

```yaml
accepted_asset:
  scenario: Photo Studio OS
  selected_plugin_id: DoubaoGen
  model_ref: doubao-seedream-5-0-260128
  generated_image_ref: runs/photo_studio_os_v0_10_doubao_retry/image/doubaogen/bcbe3b60-6f7b-4e92-8a9d-b5044a86b7c3.jpg
  generated_image_sha256: b162fab50e6a5bf95b8f761441149ee27d498a3b136eafe6322f05c5499d06f0
  accepted_as_project_cover: true
  acceptance_mode: human_override
  known_visual_deviations_recorded: true
```

## 安全边界

```yaml
safety_status:
  daily_note_called: false
  daily_note_direct_write_allowed: false
  image_binary_saved_to_memory: false
  raw_plugin_output_saved: false
  endpoint_raw_saved: false
  secret_value_saved: false
  runtime_log_saved: false
  vcp_toolbox_files_modified: false
  additional_plugin_call_authorized: false
```

## 验证命令

```powershell
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
node --check adapter_dry_run_lab\adapter_dry_run.js
node --check review_console\static_prototype\app.js
node --check review_console\static_prototype\mock_data.js
node --check exports\vcptoolbox\Plugin\AgentImageLabAdapter\dry-run-adapter.js
git diff --check
```

## Release 建议

```yaml
release_recommendation:
  can_release_as_true_real_loop_final: true
  release_publish_authorized: false
  commit_or_tag_authorized: false
  next_required_authorization: commit_tag_push_or_package_release
```

建议将当前状态作为 v1.0 true-loop closeout 候选。真正执行 commit、tag、push、打包发布或远程 release 前，需要用户给出单独授权。
