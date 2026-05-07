# Agent Image Lab

Agent Image Lab 是一个接入 VCP 生态的视觉生产调度系统。它不重新造生图插件，也不重新造记忆系统，而是把 VCP 的生图 / 编辑插件、VCPChat 的窗口能力、VCP 的长期记忆系统组织成一条可评审、可迭代、可归档、可沉淀的视觉生产线。

## 当前状态

当前仓库处于：

```text
v1.0 true-loop closeout candidate + v10.8 A5 positive still-life generation preflight gate
```

已经完成：

- v0.5 用户授权的 VCPToolBox Adapter-only dry-run 安装验证。
- v0.6 用户授权的单一真实生图插件 manifest 只读脱敏审查。
- v0.7 Gatekeeper 风险边界、Review Console 人工审批前置记录和真实执行前确认表。
- v0.7.1 Photo Studio OS 0 调用 dry-run rehearsal。
- v0.7 Photo Studio OS 首次真实执行记录，技术成功但资产拒收。
- v0.9 Photo Studio OS 重试记录和生图插件候选扫描。
- v0.10 GPTImageGen 尝试记录，因插件凭据阻断未产出图片。
- v0.10 DoubaoGen 重试真实执行，用户人工接受为可进入下一阶段的项目封面资产。
- v3.9 Review Console runtime prototype 共享 guard 抽取，并已打 `v3.9-runtime-guard-extraction-baseline` tag。
- v4.0 runtime smoke test 读取 `index.html` 实际脚本顺序，验证共享 guard API，防止页面加载契约漂移。
- v4.1 runtime guard unit harness 直接验证共享 guard 的拒绝策略、默认值和审批规则。
- v4.2 runtime validation suite 聚合 runtime 原型语法检查、guard unit 和 smoke test。
- v4.3 安装 Agent Image Lab autopilot overlay，并同步 `.agent_board` 续跑状态。
- v4.4 agent board state validation 机器检查 `.agent_board` 的硬停止门、handoff 和验证快照。
- v4.5 local checkpoint readiness 机器检查 v4.0-v4.5 本地 checkpoint 文件、看板状态、验证快照和 commit/tag/push 门。
- v4.6 local commit scope manifest 机器检查 v4.0-v4.6 本地批次的 changed-file allowlist，且不执行 staging。
- v4.7 post-push state reconciliation 记录 v4.6 已推送基线，并把 `.agent_board` 切换到新的本地续跑批次。
- v4.8 v4 index consistency validation 机器检查 v4.0-v4.8 阶段文档、schema、脚本和顶层索引一致性。
- v4.9 local tag push-readiness preflight 记录本地 v4.8 commit/tag 已就位，远端 push 仍需单独授权。
- v5.0 post-merge delivery readiness index 记录 PR #1 已合并、本地 `master` 已同步到 `origin/master`，并收束交付验收入口。
- v5.1 runtime delivery surface validation 机器检查 Review Console runtime prototype 的本地交付面、脚本顺序、DOM surface、host ack 和无外部副作用边界。
- v5.2 adapter delivery surface validation 机器检查 Adapter dry-run lab 和 VCPToolBox 导出级 dry-run 包的 manifest、stdio、fixture 和 no-execution guard。
- v5.3 review console adapter handoff validation 机器检查 Adapter dry-run accepted fixture 能以 no-execution handoff 草案进入 Review Console static prototype。
- v5.4 local sync readiness preflight 机器检查本地 `master` 相对 `origin/master` 的领先提交链，并保留 push/tag/PR/release 独立授权门。
- v5.5 post-commit reconciliation checkpoint 记录 v5.4 已落成本地 commit `a2ae539`，并把当前本地领先提交链更新为 4 个提交。
- v5.6 v5 index consistency validation 机器检查 v5.0-v5.6 文档、schema、脚本、顶层索引和 `.agent_board` 一致性。
- v5.7 local batch commit-readiness preflight 只读检查当前本地未提交批次的 tracked 修改、新文件、staged 状态和版本动作授权门。
- v5.8 handoff freshness validation 机器检查 `.agent_board` 续跑材料是否共同指向当前阶段，并保留硬停止门和 no-execution 边界。
- v5.9 expanded v5 index consistency validation 把 v5 index consistency validation 覆盖范围扩展到 v5.0-v5.9。
- v5.10 local true-loop candidate delivery closeout 收束本地 v1.0 真实闭环候选交付，记录 v5.9 本地提交、审查修复和交付授权边界。
- v5.11 post-merge reconciliation 记录 PR #2 已合并、本地 `master` 已同步到 `origin/master`、v5.10 交付 tag 已推送，并把 `.agent_board` 切换到合并后状态。
- v5.12 release candidate readiness 把真实闭环候选整理成最终交付候选包，并机器检查 release readiness、final acceptance、true-loop closeout、GitHub intake 和安全边界。
- v7.40 local A4/A5 autonomy mode alignment 把项目默认本地自动化提升为 `A4 — Sustained Local Autopilot`，并把 `A5 — Autonomous Production Execution` 固化为必须依赖独立授权包的真实生产执行模式。
- v7.41 external remote-debug verification script creation record 把原 v7.39 指向的脚本创建记录重新落位，并明确真实 remote-debug 脚本仍未创建，后续创建需要 active A5 authorization package 或独立脚本创建授权包。
- v7.42 external remote-debug verification script creation authorization package 固化未来创建真实 remote-debug 脚本所需的未激活授权包模板，并把下一步真实脚本创建标记为需要明确审批。
- v7.43 external remote-debug verification script creation execution record 在明确授权下创建 `scripts/run_vcpchat_review_console_remote_debug_smoke.ps1`，但脚本未运行，VCPChat 未启动，CDP 未访问。
- v7.44 remote-debug script run and VCPChat launch record 在明确授权下运行 dry-run-only 脚本并启动 VCPChat，但 CDP 未访问、bridge 未调用。
- v7.45 CDP read-only attempt record 在明确授权下尝试本机 CDP 只读访问；当前 VCPChat 未暴露可用 CDP endpoint，`Runtime.evaluate` 未执行。
- v7.46 remote-debug relaunch runtime verification record 在明确授权下关闭旧 VCPChat/Electron 进程，以 remote-debug 端口重启 VCPChat，并完成一次 CDP 只读 `Runtime.evaluate` surface 检查；bridge 方法只确认存在性，没有调用。
- v10.0 A5 end-to-end activation package readiness 接收单批 A5 授权包并执行 preflight；因外部 VCPChat / VCPToolBox 工作树不干净而安全停止，真实生产步骤未启动，`github_release_allowed: false`。
- v10.1 A5 resume after external worktree reconciliation 记录用户已报告外部目标工作树干净，并把恢复真实 A5 前必须重新执行 preflight 的条件机器化；本阶段仍未调用 bridge、插件、API、DailyNote、VCP memory 或图片生成。
- v10.2 A5 bridge smoke blocked record 重新执行 A5 preflight 并启动 remote-debug 运行时；preflight clean，但当前 VCPChat 未暴露 `imageLabReview` bridge，`bridge_calls_observed: 0`，因此未继续 DoubaoGen、DailyNote、VCP memory、图片或版本动作。
- v10.3 A5 bridge integration smoke record 在授权 VCPChat 文件集内添加 no-write bridge surface；严格 allowlist-only smoke 中 `cancel/loadSession/previewDraft` 通过，`bridge_calls_observed: 3`，但因初始 smoke 曾做一次 `submitDraft` rejected probe，继续 DoubaoGen 前需要人工复核。
- v10.3 gate: `human_review_required_before_production_continuation=true`。
- v10.4 A5 DoubaoGen single generation rejected asset record 在人工复核后继续 A5 生产链路；DoubaoGen 实际调用 1 次，生成资产 1 个，但审片发现可读文字和类似 logo/标记，`asset_status: rejected`，因此 DailyNote / VCP memory 写入被阻断。
- v10.4 gate: `memory_write_blocked_by_asset_review=true`。
- v10.5 A5 DoubaoGen no-text retry rejected asset record 在更强无文字约束下重试；DoubaoGen 实际调用 1 次，生成资产 1 个，但审片发现人物/脸、可读文字、logo/品牌标识和设备品牌标记，`asset_status: rejected`，因此继续阻断记忆写入和版本动作。
- v10.5 gate: `person_or_face_detected=true`、`readable_text_or_logo_detected=true`。
- v10.6 A5 prompt failure analysis and safer strategy 归档 v10.4 / v10.5 失败原因，确认 v10.5 prompt 模板由 agent 给出且设计失败；下一次真实调用前必须先展示候选 prompt 给用户确认，本阶段不执行真实生图。
- v10.6 gate: `next_real_generation_allowed_by_this_record=false`、`prompt_preview_required_before_real_call=true`。
- v10.7 A5 safer prompt review package 把候选 prompt 收束为 `a5_positive_still_life_prompt_v1`，并用 validator 扫描确认 prompt 不含 OS/app/software/interface/UI/cover/logo/brand/screen/monitor/person/portrait 等英文触发词；本阶段仍不执行真实生图。
- v10.7 gate: `user_prompt_approval_required=true`、`next_real_generation_allowed_by_this_record=false`。
- v10.8 A5 positive still-life generation preflight gate 锁定 `a5_positive_still_life_prompt_v1` 的下一次授权前检查项；`prompt_locked_for_future_authorization=true`，且仍保持 `next_real_generation_allowed_by_this_record=false`。
- v10.8 gate: 必须先由用户批准 prompt，再单独给出真实生成授权字段；本阶段不执行插件、API、图片、记忆或版本动作。

当前 accepted asset 只以 ignored runtime 路径和哈希归档，不把图片二进制写入 Git、DailyNote 或 VCP 长期记忆。人工接受记录保留了已知视觉偏差：这是 `human_override` 通过，不是完美 prompt compliance。
当前 A5 v10.4 / v10.5 新资产均被拒收，只保留 ignored runtime ref、哈希、评分和规则摘要；未把图片二进制写入 Git、DailyNote 或 VCP memory。

## 一句话定义

> 让 AI 生图从一次性出图，变成有审片、有审批、有归档、有中文记忆沉淀的视觉生产流程。

## 第一阶段主战场

Photo Studio OS UI 生图生产线，以及 AI 图片评审与修正生产线。

## 项目边界

- Agent Image Lab 是 VCP 原生视觉生产调度系统，不是普通 AI 生图工具。
- Adapter dry-run 默认保持 0 调用，不越权调用真实插件。
- 真实生图必须单独授权插件、命令、最大调用次数、输入引用、输出目录和回滚方案。
- DailyNote 写入正文必须中文；英文提示词只作为执行素材，并必须附中文解释。
- 子 Agent 在 MVP 阶段是岗位流程，但必须有记忆署名并输出 memory_delta。
- 核心风格记忆必须经过 ImageLab_Master / Archivist_Agent / 人工审核。
- 图片大文件不写入 VCP 长期记忆，只写摘要、路径引用、评分和规则。
- API key、token、cookie、私密路径、客户隐私禁止进入长期记忆。

## MVP 闭环

```text
用户视觉需求
→ task_envelope
→ director_plan
→ prompt_package
→ review_score
→ human_review
→ memory_delta
→ case_summary
```

## 目录导读

- `docs/00_project_roadmap.md`：从 v0.2 基线到 v1.0 true-loop closeout 的总路线图。
- `docs/20_real_loop_completion_plan.md`：从 v0.4 到 v1.0 的真实闭环完成计划。
- `docs/30_release_readiness_report.md`：当前 release readiness 结论。
- `docs/31_install_and_operation_guide.md`：安装、校验和操作指南。
- `docs/32_final_acceptance_report.md`：当前最终验收报告。
- `docs/34_v1_0_true_loop_closeout.md`：v1.0 真实闭环收束记录。
- `docs/116_v3_9_runtime_guard_extraction.md`：runtime prototype 共享 guard 抽取记录。
- `docs/117_v4_0_runtime_contract_smoke_hardening.md`：runtime smoke test 契约加固记录。
- `docs/118_v4_1_runtime_guard_unit_validation.md`：runtime guard unit validation 记录。
- `docs/119_v4_2_runtime_validation_suite.md`：runtime validation suite 记录。
- `docs/120_v4_3_autopilot_overlay_installation.md`：autopilot overlay 安装与 agent board 同步记录。
- `docs/121_v4_4_agent_board_state_validation.md`：agent board state validation 记录。
- `docs/122_v4_5_local_checkpoint_readiness.md`：local checkpoint readiness 记录。
- `docs/123_v4_6_local_commit_scope_manifest.md`：local commit scope manifest 记录。
- `docs/124_v4_7_post_push_state_reconciliation.md`：post-push state reconciliation 记录。
- `docs/125_v4_8_v4_index_consistency_validation.md`：v4 index consistency validation 记录。
- `docs/126_v4_9_local_tag_push_readiness.md`：local tag push-readiness preflight 记录。
- `docs/127_v5_0_delivery_readiness_index.md`：post-merge delivery readiness index 记录。
- `docs/128_v5_1_runtime_delivery_surface.md`：runtime delivery surface validation 记录。
- `docs/129_v5_2_adapter_delivery_surface.md`：adapter delivery surface validation 记录。
- `docs/130_v5_3_review_console_adapter_handoff.md`：review console adapter handoff validation 记录。
- `docs/131_v5_4_local_sync_readiness.md`：local sync readiness preflight 记录。
- `docs/132_v5_5_post_commit_reconciliation.md`：post-commit reconciliation checkpoint 记录。
- `docs/133_v5_6_v5_index_consistency_validation.md`：v5 index consistency validation 记录。
- `docs/134_v5_7_local_batch_commit_readiness.md`：local batch commit-readiness preflight 记录。
- `docs/135_v5_8_handoff_freshness_validation.md`：handoff freshness validation 记录。
- `docs/136_v5_9_expanded_v5_index_consistency.md`：expanded v5 index consistency validation 记录。
- `docs/137_v5_10_local_true_loop_candidate_delivery.md`：local true-loop candidate delivery closeout 记录。
- `docs/138_v5_11_post_merge_reconciliation.md`：post-merge reconciliation 记录。
- `docs/139_v5_12_release_candidate_readiness.md`：release candidate readiness 记录。
- `docs/192_v7_40_local_a4_a5_autonomy_alignment.md`：local A4/A5 autonomy mode alignment 记录。
- `docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md`：remote-debug relaunch runtime verification 脱敏记录。
- `docs/199_v10_0_a5_end_to_end_activation_package_readiness.md`：A5 end-to-end activation package readiness 与 preflight-blocked 脱敏记录。
- `docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md`：A5 外部工作树清理后恢复 preflight 的脱敏接续记录。
- `docs/201_v10_2_a5_bridge_smoke_blocked_record.md`：A5 clean preflight 后 bridge surface 缺失的脱敏阻断记录。
- `docs/202_v10_3_a5_bridge_integration_smoke_record.md`：VCPChat no-write bridge 集成与严格 allowlist smoke 脱敏记录。
- `docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md`：下一次 DoubaoGen 正向静物生成前的 prompt 锁定与授权门记录。
- `.agent_board/`：本地 guarded autopilot 状态板，用于续跑、校验记录和 handoff。
- `docs/`：项目定义、SOP、评分表、VCP 记忆适配、审片台设计。
- `agents/`：ImageLab_Master 和岗位型子 Agent 的规则。
- `memory_policy/`：中文日记、memory_delta、写入权限、召回策略、禁写清单。
- `schemas/`：任务包、提示词包、评分、案例、记忆、调度、审片会话结构。
- `review_console/`：ImageLab Review Console 审片台规格。
- `integrations/vcp/`：VCP 接入草案、脱敏审查、执行授权和真实执行记录。
- `tests/schema_examples/`：schema 样例和阶段验收样例。

## 只读校验

```powershell
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

推荐附加检查：

```powershell
node --check adapter_dry_run_lab\adapter_dry_run.js
node --check review_console\static_prototype\app.js
node --check review_console\static_prototype\mock_data.js
node --check exports\vcptoolbox\Plugin\AgentImageLabAdapter\dry-run-adapter.js
node scripts\validate_runtime_guard_unit.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_adapter_delivery_surface.js
node scripts\validate_review_console_adapter_handoff.js
node scripts\validate_v5_local_sync_readiness.js
node scripts\validate_v5_post_commit_reconciliation.js
node scripts\validate_v5_index_consistency.js
node scripts\validate_v5_local_batch_commit_readiness.js
node scripts\validate_v5_handoff_freshness.js
node scripts\validate_v5_true_loop_candidate_delivery.js
node scripts\validate_v5_post_merge_reconciliation.js
node scripts\validate_v5_12_release_candidate_readiness.js
node scripts\validate_v7_40_local_a4_a5_autonomy_alignment.js
node scripts\validate_v7_46_remote_debug_relaunch_runtime_verification_record.js
node scripts\validate_v10_0_a5_end_to_end_activation_package.js
node scripts\validate_v10_1_a5_resume_after_external_worktree_reconciliation.js
node scripts\validate_v10_2_a5_bridge_smoke_blocked_record.js
node scripts\validate_v10_3_a5_bridge_integration_smoke_record.js
node scripts\validate_v10_8_a5_positive_still_life_generation_preflight_gate.js
node scripts\validate_runtime_prototype_suite.js
node scripts\validate_agent_board_state.js
node scripts\validate_local_checkpoint_manifest.js
node scripts\validate_local_commit_scope.js
node scripts\validate_post_push_state.js
node scripts\validate_v4_index_consistency.js
node scripts\validate_local_tag_push_readiness.js
node scripts\validate_v5_delivery_readiness.js
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
git diff --check
```

## 真实执行授权门

任何新的真实执行前必须先阅读并确认：

- `integrations/vcp/v0_7_real_execution_authorization_gate.md`
- `integrations/vcp/v0_7_gatekeeper_risk_boundary.md`
- `review_console/v0_7_human_approval_preflight.md`
- `workflows/v0_7_real_execution_preflight_confirmation.md`
- `docs/199_v10_0_a5_end_to_end_activation_package_readiness.md`
- `docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md`
- `docs/201_v10_2_a5_bridge_smoke_blocked_record.md`
- `docs/202_v10_3_a5_bridge_integration_smoke_record.md`
- `docs/203_v10_4_a5_doubaogen_single_generation_rejected_asset_record.md`
- `docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md`
- `docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md`
- `docs/206_v10_7_a5_safer_prompt_review_package.md`
- `docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md`

仅说“继续”不构成新的真实执行授权。即使存在 A5 授权包，如果外部目标工作树不干净、tag/分支冲突、输出目录冲突或会泄露 raw 敏感值，也必须停止。

## 不做什么

本包不包含密钥、不包含 raw 插件输出、不包含 raw endpoint、不包含运行日志、不把图片大文件纳入 Git。v0.5 曾在用户授权下把 Adapter-only dry-run 包安装到 VCPToolBox 预发布候选工作线；该安装不代表真实生图插件长期启用。v10.8 已把下一版 prompt 锁定为生成前授权门；DailyNote、VCP memory、commit、push、tag 和 PR 仍需后续单独授权和通过审片。
