# Agent Image Lab 打包清单

本包包含 Agent Image Lab v1.0 true-loop closeout 候选所需的文档、schema、角色定义、记忆策略、审片台规格、Adapter dry-run 包、VCP 接入记录、授权门、真实执行脱敏记录和最终验收报告。

## 重要声明

- 包含 Adapter-only dry-run 包。
- 包含受控真实执行的脱敏记录，不包含 raw 插件输出。
- 不包含真实图片二进制文件。
- 不包含 API key、token、cookie、密码或私密路径。
- 不包含 raw endpoint、运行日志或客户隐私。
- 不包含 VCPToolBox 生产改动；v0.5 仅验证 Adapter-only dry-run 安装。
- 不修改 VCPChat。
- 所有记忆正文示例均为中文。
- 任何后续真实插件调用、DailyNote 写入、commit、tag、push 或 release 发布都需要单独授权。

## Release readiness 文件

- `docs/30_release_readiness_report.md`
- `docs/31_install_and_operation_guide.md`
- `docs/32_final_acceptance_report.md`
- `docs/33_post_execution_checkpoint.md`
- `docs/34_v1_0_true_loop_closeout.md`
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
