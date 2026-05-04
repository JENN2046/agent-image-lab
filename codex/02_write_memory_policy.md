# Codex Task 02 — Write Memory Policy

## 目标

补齐 Agent Image Lab 的 VCP 记忆系统适配策略，防止错误内容、英文难审内容、敏感信息和未经确认规则污染长期记忆。

## 工作范围

只允许修改项目根目录下：

```text
memory_policy/
```

可同步检查但谨慎修改：

```text
docs/07_vcp_memory_adaptation_plan.md
schemas/memory_delta.schema.yaml
```

不得修改 `codex/00_MASTER_TASK.md`、VCPToolBox 或 VCPChat。

## 必须覆盖

- Git / VCP 记忆 / 资产库三层边界。
- DailyNote 中文写入入口。
- LightMemo、RAGDiaryPlugin、DeepMemo、TopicMemo 边界。
- 子 Agent 记忆署名。
- 每次任务必须输出 `memory_delta`。
- `memory_delta` 默认是草案。
- 核心风格记忆必须审核。
- 图片大文件不进入长期记忆。
- 禁止写入 API key、token、cookie、密码、私密路径、客户隐私。

## 必须补齐的文件

```text
memory_policy/memory_architecture.md
memory_policy/chinese_memory_policy.md
memory_policy/subagent_memory_protocol.md
memory_policy/memory_delta.schema.yaml
memory_policy/memory_notebook_map.md
memory_policy/tag_dictionary.md
memory_policy/write_permissions.md
memory_policy/recall_rules.md
memory_policy/forbidden_memory.md
```

## Definition of Done

人工审查者可以清楚判断：什么记、谁记、记到哪里、谁审批、怎么召回、什么永远不能记。
