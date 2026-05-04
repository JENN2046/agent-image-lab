# Codex Task 06 — Write Workflows And Examples

## 目标

补齐 MVP 工作流、样例案例、风格种子和无执行 schema examples。

## 工作范围

只允许修改项目根目录下：

```text
workflows/
tests/schema_examples/
case_studies/
style_memory_seed/
```

不得修改 `codex/00_MASTER_TASK.md`、VCPToolBox 或 VCPChat。

## 工作流要求

每个 workflow 必须包含：

- 目标
- 输入
- 输出
- 使用的 Agent
- 是否需要 Review Console
- 是否需要 `memory_delta`
- 是否会写 VCP 记忆
- 是否会调用真实插件

MVP 阶段所有真实执行必须为 false。

## 样例要求

- 使用 Photo Studio OS 作为第一案例。
- 可以是占位案例。
- 不引用真实图片文件。
- 只写路径占位和文字说明。
- DailyNote / memory_delta 示例正文必须中文。

## Definition of Done

无执行样例能支撑：用户需求 → task_envelope → prompt_package → review_score → human_review → memory_delta → case_summary。
