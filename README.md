# Agent Image Lab v0.2

Agent Image Lab 是一个接入 VCP 生态的视觉生产调度系统。它不重新造生图插件，也不重新造记忆系统，而是把 VCP 的生图 / 编辑插件、VCPChat 的窗口能力、VCP 的长期记忆系统组织成一条可评审、可迭代、可归档、可沉淀的视觉生产线。

## 一句话定义

> 让 AI 生图从一次性出图，变成有审片、有审批、有归档、有中文记忆沉淀的视觉生产流程。

## 第一阶段主战场

Photo Studio OS UI 生图生产线，以及 AI 图片评审与修正生产线。

## 项目边界

- Agent Image Lab 是 VCP 原生视觉生产调度系统，不是普通 AI 生图工具。
- MVP 阶段不调用真实生图插件，不修改 VCPToolBox / VCPChat 主仓。
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

- `docs/00_project_roadmap.md`：从 v0.2 基线到 v0.3 授权、MVP-B dry-run 和未来真实闭环的总路线图。
- `docs/20_real_loop_completion_plan.md`：从 v0.4 到 v1.0 的真实闭环完成计划。
- `docs/`：项目定义、SOP、评分表、VCP 记忆适配、审片台设计。
- `agents/`：ImageLab_Master 和岗位型子 Agent 的规则。
- `memory_policy/`：中文日记、memory_delta、写入权限、召回策略、禁写清单。
- `schemas/`：任务包、提示词包、评分、案例、记忆、调度、审片会话结构。
- `review_console/`：ImageLab Review Console 审片台规格。
- `integrations/vcp/`：VCP 接入草案，不直接改 VCP 主仓。
- `tests/schema_examples/`：无执行闭环样例。

## 当前状态

当前仓库已经完成 v0.2 规格基线和 Review Console 静态原型，并开始 v0.3 manifest 授权门槛规划。真实 manifest 读取、真实插件选择、真实 API 调用、DailyNote 写入和图片生成仍未开始，必须作为后续独立授权点处理。

当前还包含 v0.4 dry-run Adapter 导出候选文件；它仍是 draft-not-installed，不代表真实 VCPToolBox 已安装。

## 只读校验

```powershell
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

该脚本只检查仓库结构、安全边界、静态原型和 dry-run 锁定值，不调用 VCP 插件、不调用 API、不写 DailyNote、不创建图片。

## 不做什么

本包不包含真实生图调用、不包含 VCPToolBox 改动、不包含 VCPChat 改动、不包含密钥、不包含图片大文件。
