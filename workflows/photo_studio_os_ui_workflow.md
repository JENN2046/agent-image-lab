# Photo Studio OS UI 生图生产线

## 目标

把 Photo Studio OS 的视觉需求整理为无执行闭环：`task_envelope`、`director_plan`、`prompt_package`、`dispatch_plan`、`review_score`、`human_review`、`memory_delta` 和 `case_summary`。

## 输入

- 用户视觉需求中文说明。
- Photo Studio OS 视觉铁律。
- 图片引用或占位路径。
- 历史案例、失败经验和风格记忆摘要。
- 本轮预算：插件调用次数为 0，输出图片数量为 0。

## 流程

```text
用户需求
→ ImageLab_Master 分诊
→ Director_Agent 生成 director_plan
→ Prompt_Agent 生成 prompt_package
→ VCP_Dispatcher_Agent 生成 dispatch_plan dry-run
→ Gatekeeper_Agent 确认 execution_blocked=true
→ Critic_Agent 生成 review_score
→ Review Console 接收 human_review
→ Archivist_Agent 生成 memory_delta 与 case_summary
```

## 输出

- `task_envelope`
- `director_plan`
- `prompt_package`
- `dispatch_plan`
- `review_score`
- `human_review`
- `memory_delta`
- `case_summary`

## 使用的 Agent

- `ImageLab_Master`
- `Director_Agent`
- `Prompt_Agent`
- `VCP_Dispatcher_Agent`
- `Gatekeeper_Agent`
- `Critic_Agent`
- `Archivist_Agent`

## 是否需要 Review Console

true。人工评分、资产状态、记忆写入预览和继续迭代决定必须进入 Review Console 或等价人工审批流程。

## 是否需要 memory_delta

true。每次任务必须输出 `memory_delta`，即使最终决定不写入长期记忆。

## 是否会写 VCP 记忆

false。MVP 阶段只生成中文 DailyNote / memory_delta 草案，不调用 DailyNote 写入。

## 是否会调用真实插件

false。MVP 阶段只允许 dry-run 设计，不调用真实 VCP 插件，不调用任何生图 API。

## Photo Studio OS 风格约束

- 16:9 widescreen。
- 高级黑，近黑背景，深冷蓝底色。
- 冷白细字体。
- 三仪表中心构图，中央大仪表是视觉焦点。
- 左右小仪表与中央大仪表距离平衡。
- 右侧保留 Risk Pulse / Approval Queue。
- 下方保留 Project Execution / Activity Timeline / AI Inspection Feed。
- 克制橙红警示。
- 不要赛博朋克、不要游戏 HUD、不要普通 SaaS、不要发灰、不要过亮、不要过度蓝光。
- 不要破坏三仪表平衡，不要让右侧仪表贴近侧栏。

## MVP 验收

- 可从用户需求生成完整任务包。
- 所有输出都是文档、schema 或中文说明。
- `max_plugin_calls=0`。
- `external_api_allowed=false`。
- `execution_blocked=true`。
