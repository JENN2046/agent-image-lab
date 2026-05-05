# Agent Image Lab

Agent Image Lab 是一个接入 VCP 生态的视觉生产调度系统。它不重新造生图插件，也不重新造记忆系统，而是把 VCP 的生图 / 编辑插件、VCPChat 的窗口能力、VCP 的长期记忆系统组织成一条可评审、可迭代、可归档、可沉淀的视觉生产线。

## 当前状态

当前仓库处于：

```text
v1.0 true-loop closeout candidate + v4.8 v4 index consistency validation
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

当前 accepted asset 只以 ignored runtime 路径和哈希归档，不把图片二进制写入 Git、DailyNote 或 VCP 长期记忆。人工接受记录保留了已知视觉偏差：这是 `human_override` 通过，不是完美 prompt compliance。

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
node scripts\validate_runtime_prototype_suite.js
node scripts\validate_agent_board_state.js
node scripts\validate_local_checkpoint_manifest.js
node scripts\validate_local_commit_scope.js
node scripts\validate_post_push_state.js
node scripts\validate_v4_index_consistency.js
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
git diff --check
```

## 真实执行授权门

任何新的真实执行前必须先阅读并确认：

- `integrations/vcp/v0_7_real_execution_authorization_gate.md`
- `integrations/vcp/v0_7_gatekeeper_risk_boundary.md`
- `review_console/v0_7_human_approval_preflight.md`
- `workflows/v0_7_real_execution_preflight_confirmation.md`

仅说“继续”不构成新的真实执行授权。

## 不做什么

本包不包含密钥、不包含 raw 插件输出、不包含 raw endpoint、不包含运行日志、不把图片大文件纳入 Git。v0.5 曾在用户授权下把 Adapter-only dry-run 包安装到 VCPToolBox 预发布候选工作线；该安装不代表真实生图插件长期启用。v1.0 closeout 本身也不授权发布 release、再次生图或写 DailyNote；后续 commit、push、tag 均需独立授权记录。
