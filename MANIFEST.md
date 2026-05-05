# Agent Image Lab 打包清单

本包包含 Agent Image Lab v1.0 true-loop closeout 候选所需的文档、schema、角色定义、记忆策略、审片台规格、Adapter dry-run 包、VCP 接入记录、授权门、真实执行脱敏记录、最终验收报告、v3.9-v4.2 Review Console runtime prototype 本地验证加固记录，v4.3-v4.9 guarded autopilot overlay / agent board / local checkpoint readiness / commit scope manifest / post-push state reconciliation / v4 index consistency validation / local tag push-readiness preflight，v5.0 post-merge delivery readiness index，v5.1 runtime delivery surface validation，以及 v5.2 adapter delivery surface validation。

## 重要声明

- 包含 Adapter-only dry-run 包。
- 包含受控真实执行的脱敏记录，不包含 raw 插件输出。
- 不包含真实图片二进制文件。
- 不包含 API key、token、cookie、密码或私密路径。
- 不包含 raw endpoint、运行日志或客户隐私。
- 不包含 VCPToolBox 生产改动；v0.5 仅验证 Adapter-only dry-run 安装。
- 不修改 VCPChat。
- 所有记忆正文示例均为中文。
- 已安装 `AGENTS.autopilot-overlay.md` 和 `.agent_board/` 作为本地续跑辅助；它不覆盖根 `AGENTS.md`。
- 任何后续真实插件调用、DailyNote 写入、commit、tag、push 或 release 发布都需要单独授权。

## Release readiness 文件

- `docs/30_release_readiness_report.md`
- `docs/31_install_and_operation_guide.md`
- `docs/32_final_acceptance_report.md`
- `docs/33_post_execution_checkpoint.md`
- `docs/34_v1_0_true_loop_closeout.md`
- `docs/116_v3_9_runtime_guard_extraction.md`
- `docs/117_v4_0_runtime_contract_smoke_hardening.md`
- `docs/118_v4_1_runtime_guard_unit_validation.md`
- `docs/119_v4_2_runtime_validation_suite.md`
- `docs/120_v4_3_autopilot_overlay_installation.md`
- `docs/121_v4_4_agent_board_state_validation.md`
- `docs/122_v4_5_local_checkpoint_readiness.md`
- `docs/123_v4_6_local_commit_scope_manifest.md`
- `docs/124_v4_7_post_push_state_reconciliation.md`
- `docs/125_v4_8_v4_index_consistency_validation.md`
- `docs/126_v4_9_local_tag_push_readiness.md`
- `docs/127_v5_0_delivery_readiness_index.md`
- `docs/128_v5_1_runtime_delivery_surface.md`
- `docs/129_v5_2_adapter_delivery_surface.md`
- `.agent_board/`
- `AGENTS.autopilot-overlay.md`
- `README_AGENT_IMAGE_LAB_AUTOPILOT.md`
- `scripts/validate-agent-image-lab-local.ps1`
- `scripts/validate-agent-image-lab-local.sh`
- `scripts/validate_agent_board_state.js`
- `scripts/validate_local_checkpoint_manifest.js`
- `scripts/validate_local_commit_scope.js`
- `scripts/validate_post_push_state.js`
- `scripts/validate_v4_index_consistency.js`
- `scripts/validate_local_tag_push_readiness.js`
- `scripts/validate_v5_delivery_readiness.js`
- `scripts/validate_runtime_delivery_surface.js`
- `scripts/validate_adapter_delivery_surface.js`
- `integrations/vcp/v0_7_real_execution_authorization_gate.md`
- `integrations/vcp/v0_7_photo_studio_os_dry_run_rehearsal.md`
- `integrations/vcp/v0_7_photo_studio_os_real_execution_record.md`
- `integrations/vcp/v0_9_photo_studio_os_retry_real_execution_record.md`
- `integrations/vcp/v0_10_doubaogen_retry_real_execution_record.md`
- `workflows/v0_9_photo_studio_os_retry_authorization_gate.md`
- `scripts/run_v0_7_photo_studio_os_real_execution.ps1`
- `scripts/run_v0_10_gptimagegen_real_execution.ps1`

## Post-execution runtime outputs

- Generated runtime files live under `runs/` and are ignored by Git.
- The packaged project records only sanitized relative refs, hashes, and review status.
- The first v0.7 real execution produced one image, but the asset was rejected because it violated the no-people visual constraint.
- v0.9 recorded a retry attempt and candidate plugin scan.
- v0.10 recorded GPTImageGen credential-blocked attempts and a DoubaoGen retry that was accepted by human override.
- v3.9-v4.2 records project-local Review Console runtime prototype validation hardening only; they do not represent real VCPChat integration or DailyNote writes.
- v4.3 records project-local guarded autopilot overlay installation only; it does not authorize external reads, real execution, commits, tags, pushes, or releases.
- v4.4 records project-local agent board state validation only; it does not authorize external reads, real execution, commits, tags, pushes, or releases.
- v4.5 records project-local checkpoint readiness validation only; it does not authorize external reads, real execution, commits, tags, pushes, or releases.
- v4.6 records project-local commit scope validation only; it does not stage files and does not authorize commits, tags, pushes, or releases.
- v4.7 records project-local post-push state reconciliation only; it does not authorize new commits, tags, pushes, or releases.
- v4.8 records project-local v4 index consistency validation only; it does not authorize new commits, tags, pushes, or releases.
- v4.9 records project-local tag push-readiness only; it does not authorize pushes, releases, or remote writes.
- v5.0 records post-merge delivery readiness only; it does not authorize new commits, tags, pushes, releases, real execution, or external reads.
- v5.1 records runtime delivery surface validation only; it does not authorize VCPChat integration, IPC/preload work, real execution, or external reads.
- v5.2 records adapter delivery surface validation only; it does not authorize real plugin selection, real execution, VCPToolBox changes, DailyNote writes, commits, tags, pushes, or releases.
