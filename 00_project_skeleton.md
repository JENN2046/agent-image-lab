# Agent Image Lab v0.2 项目总骨架

## 项目根目录

当前项目根目录是：

```text
A:\agent-image-lab\agent-image-lab-v0.2\
```

所有 MVP 文件都直接位于该目录下。不得再创建嵌套的 `agent-image-lab/` 子目录，也不得创建并列的 `A:\agent-image-lab\agent-image-lab\`。

## 项目架构

Agent Image Lab 是 VCP 原生视觉生产调度系统。它把视觉需求、提示词、VCP 插件调度计划、图片评审、人工审批、资产归档和 VCP 记忆沉淀连接成无执行闭环。

```text
Agent Image Lab v0.2
  ├─ docs / agents / schemas / workflows / prompt_templates
  ├─ review_console 规格
  ├─ memory_policy 记忆边界
  ├─ integrations/vcp 接入草案
  └─ tests/schema_examples 无执行样例

VCPToolBox
  ├─ 未来可同步 ImageLab_Master
  └─ 未来可新增 AgentImageLabAdapter dry-run 插件

VCPChat
  └─ 未来可承载 ImageLab Review Console 子窗口

VCP 记忆系统
  └─ DailyNote / LightMemo / RAGDiaryPlugin / DeepMemo / TopicMemo
```

## 目录说明

| 目录 | 说明 |
|---|---|
| `docs/` | 项目定义、SOP、评分表、VCP 记忆适配、审片台设计、MVP 验收。 |
| `agents/` | ImageLab_Master 与岗位型子 Agent 的职责和权限。 |
| `workflows/` | Photo Studio OS、图片评审、VCP dry-run、资产归档流程。 |
| `integrations/vcp/` | VCP Agent、Adapter、插件矩阵和工具请求格式草案。 |
| `memory_policy/` | 中文记忆、memory_delta、写入权限、召回、禁写规则。 |
| `prompt_templates/` | Photo Studio OS、图片评审、精修提示词模板。 |
| `style_memory_seed/` | Git 中的风格种子，不等于 VCP 长期记忆。 |
| `case_studies/` | MVP 样例案例，不引用真实图片文件。 |
| `asset_archive/` | 资产占位目录，不提交图片大文件。 |
| `review_console/` | 审片台产品规格和 schema，不实现真实 UI。 |
| `schemas/` | 任务包、提示词包、评分、案例、记忆、调度、审片会话 schema 草案。 |
| `tests/schema_examples/` | Photo Studio OS 无执行样例。 |
| `codex/` | 后续 Codex 子任务书。 |

## Agent 结构

- `ImageLab_Master`：MVP 阶段唯一正式 VCP Agent 候选，负责调度、长期审美、核心风格规则审核。
- `Director_Agent`：视觉方向、构图、风格边界。
- `Prompt_Agent`：主提示词、负面提示词、插件适配说明。
- `Critic_Agent`：图片评分、失败原因、迭代价值。
- `Iteration_Agent`：下一轮精修计划。
- `Archivist_Agent`：案例归档、中文 DailyNote 草案、风格规则候选。
- `VCP_Dispatcher_Agent`：dispatch_plan 与插件表现记录。
- `Gatekeeper_Agent`：dry-run、执行风险、审批和审计。

## VCP 接入边界

- 本项目只写规格、schema、模板和样例。
- MVP-A 不调用真实 VCP 生图插件。
- MVP-B 才考虑 Adapter dry-run，且仍需 Gatekeeper 和人工审批。
- 不修改 VCPToolBox 主仓，不修改 VCPChat 主仓。
- VCPToolBox 的运行数据目录不作为稳定源码模块。

## 记忆系统边界

- Git 保存硬规则、schema、评分表、模板和风格种子。
- VCP 记忆保存活经验、案例摘要、失败经验和插件表现。
- 资产库保存图片和大文件引用。
- DailyNote 是中文写入入口。
- LightMemo 主动检索 VCP 日记 / 知识库。
- RAGDiaryPlugin 被动注入少量长期记忆。
- DeepMemo 查聊天历史。
- TopicMemo 做完整话题回看。

## Review Console 边界

ImageLab Review Console 是审片、评分、评论、资产审批和记忆写入预览的裁决台。MVP 阶段只写规格和 schema，不实现复杂前端，不做完整 DAM，不直接调用 DailyNote 或 VCP 插件。

## MVP 阶段路线

```text
MVP-A：无执行闭环
用户需求 → task_envelope → director_plan → prompt_package → review_score → human_review → memory_delta → case_summary

MVP-B：VCP Adapter dry-run
task_envelope → dispatch_plan → Gatekeeper dry-run → 人工审批 → 审计记录

后续：单插件真实执行
只在插件能力、审批、回滚和记忆安全都清楚后推进。
```
