# 资产归档工作流

## 目标

根据人工评分与审批结果，将图片引用归档为 accepted、candidate 或 rejected，并生成案例摘要和中文记忆草案。MVP 阶段不保存真实图片大文件。

## 输入

- `review_score`
- `human_review`
- `archive_decision`
- 图片引用或占位路径。
- 记忆安全检查结果。
- Review Console 审批状态。

## 流程

```text
review_score
→ human_review
→ Review Console 选择 archive_decision
→ Archivist_Agent 生成 image_case
→ Archivist_Agent 生成 case_summary
→ Gatekeeper_Agent 检查记忆安全
→ 输出 memory_delta 草案
→ 等待人工批准是否写入 VCP 记忆
```

## 输出

- `image_case`
- `case_summary`
- 资产状态：accepted / candidate / rejected。
- 中文 `memory_delta`
- 不写入或待审批原因。

## 使用的 Agent

- `Archivist_Agent`
- `Critic_Agent`
- `ImageLab_Master`
- `Gatekeeper_Agent`

## 是否需要 Review Console

true。正式入库、候选、拒绝和记忆写入都必须有人工审批。

## 是否需要 memory_delta

true。归档结论、失败经验、候选规则或不写入原因都必须输出。

## 是否会写 VCP 记忆

false。MVP 阶段只保留中文 DailyNote 草案，不执行写入。

## 是否会调用真实插件

false。归档流程不触发真实插件。

## 资产边界

- Git 不提交图片大文件。
- VCP 记忆只写摘要、路径引用、评分和规则。
- 图片引用使用占位路径或外部资产引用。
- 不写客户原图完整描述。

## MVP 验收

- 资产状态可追溯到人工评分。
- `case_summary` 可连接 `task_id`、`case_id`、`review_id` 和 `memory_delta`。
- 真实插件执行为 false。
