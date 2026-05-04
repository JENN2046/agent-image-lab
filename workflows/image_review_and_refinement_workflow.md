# 图片评审与精修生产线

## 目标

对图片引用或占位案例进行评分、人工复核、失败原因归纳和下一轮精修规划。MVP 阶段不生成、不编辑、不下载真实图片。

## 输入

- `task_envelope`
- 图片引用或占位路径。
- 当前 `prompt_package` 引用。
- Photo Studio OS 视觉规则。
- AI 初评或历史案例摘要。
- 人工评论和人工评分。

## 流程

```text
图片引用
→ Critic_Agent 按 100 分评分表生成 review_score
→ Review Console 接收人工评分和中文评论
→ 人工评分覆盖 AI 评分
→ Iteration_Agent 生成 1-3 个精修目标
→ Prompt_Agent 更新提示词草案
→ Archivist_Agent 生成 memory_delta 草案
```

## 输出

- `review_score`
- `human_review`
- `iteration_plan`
- 更新后的 `prompt_package` 草案。
- 中文 `memory_delta`
- 是否继续迭代的建议。

## 使用的 Agent

- `Critic_Agent`
- `Iteration_Agent`
- `Prompt_Agent`
- `Archivist_Agent`
- `ImageLab_Master`

## 是否需要 Review Console

true。人工评分覆盖 AI 评分，人工评论覆盖自动摘要，是否继续迭代由人工审批决定。

## 是否需要 memory_delta

true。失败经验、有效精修经验、候选规则和不写入原因都必须通过 `memory_delta` 表达。

## 是否会写 VCP 记忆

false。MVP 阶段只生成中文记忆草案，不执行 DailyNote 写入。

## 是否会调用真实插件

false。不调用真实生图、精修、放大或图片编辑插件。

## 精修边界

- 一轮只改 1-3 个核心问题。
- 保留成功的构图、主体、光线和风格。
- 不重设整体方向。
- 不把右侧仪表推到侧栏边缘。
- 不用过度蓝光修饰画面。

## MVP 验收

- `review_score` 有分项评分和中文评审。
- `human_review` 明确覆盖关系。
- `memory_delta` 正文中文。
- 真实插件执行为 false。
