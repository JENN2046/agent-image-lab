# Codex Task 04 — Write Core Schemas

## 目标

创建或补齐 Agent Image Lab MVP 的核心 YAML schema 草案。schema 是协议，不是运行时代码。

## 工作范围

只允许修改项目根目录下：

```text
schemas/
integrations/vcp/
tests/schema_examples/
```

不得修改 `codex/00_MASTER_TASK.md`、VCPToolBox 或 VCPChat。

## 必须补齐的 schema

```text
schemas/task_envelope.schema.yaml
schemas/prompt_package.schema.yaml
schemas/review_score.schema.yaml
schemas/image_case.schema.yaml
schemas/memory_delta.schema.yaml
schemas/dispatch_plan.schema.yaml
schemas/review_session.schema.yaml
integrations/vcp/vcp_task_envelope.schema.yaml
integrations/vcp/vcp_dispatch_plan.schema.yaml
```

## 通用要求

- 使用 YAML。
- 字段注释必须中文。
- 不写可执行验证器。
- 不写真实插件执行逻辑。
- 不包含真实密钥、真实图片或真实插件调用。
- 必须能支撑 Photo Studio OS 无执行任务。

## 示例文件

```text
tests/schema_examples/task_envelope.example.yaml
tests/schema_examples/review_score.example.yaml
tests/schema_examples/memory_delta.example.yaml
```

示例必须是 Photo Studio OS 无执行任务，DailyNote / memory_delta 正文必须中文。

## Definition of Done

schema 能串联：task → prompt → dispatch → review → memory → case。
