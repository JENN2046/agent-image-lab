# memory_architecture

## 核心原则

Agent Image Lab 不重新造记忆系统，只定义如何安全使用 VCP 记忆系统。

## 三层边界

| 层 | 定位 | 保存什么 | 不保存什么 |
|---|---|---|---|
| Git | 硬规则 | AGENTS.md、schema、评分表、提示词模板、风格种子、项目决策 | 临时经验、大图、密钥、客户隐私 |
| VCP 记忆 | 活经验 | 案例摘要、失败原因、插件表现、人工确认后的风格经验 | 图片二进制、API key、token、cookie、私密路径 |
| 资产库 | 图片与大文件 | 原图、输出图、参考图、缩略图的外部引用或占位路径 | 长期规则正文、密钥、未经审批的核心结论 |

## DailyNote

DailyNote 是 VCP 长期记忆写入入口。写入正文必须中文，英文提示词只能作为原文保留并附中文解释。

## LightMemo

LightMemo 用于主动检索 VCP 日记 / 知识库。检索时应指定任务、项目或记忆本范围，不允许每次全局搜索全部记忆。

## RAGDiaryPlugin

RAGDiaryPlugin 用于被动注入少量长期记忆。它只提供上下文参考，不代表本次任务已经获得审批。

## DeepMemo

DeepMemo 用于聊天历史回忆，例如“上次我们怎么说”。DeepMemo 结果不能直接作为长期风格规则。

## TopicMemo

TopicMemo 用于完整话题回看，适合复盘长项目，不适合日常轻量召回。

## 记忆写入链路

```text
子 Agent 输出 memory_delta 草案
→ Archivist_Agent / Gatekeeper_Agent 初筛
→ Review Console 中文预览
→ ImageLab_Master / 人工审批
→ DailyNote 写入或拒绝
```

## Attempt-018 记忆层级拆分

`attempt-018` 的完整生态闭环写入的是 Codex workspace knowledge memory，不是
项目 DailyNote，也不是 VCPToolBox `DailyNoteWrite` 插件结果。

```yaml
attempt_018_memory_layers:
  Codex_knowledge_memory:
    written: true
    receipt_ref: reports/memory_write_receipts/secretless_serum_attempt_018_codex_knowledge_memory_write_receipt_20260606.json
    layer_identity: Codex workspace knowledge
  AIL_DailyNoteWrite_adapter:
    preflight_available: true
    writes_now: false
    calls_VCPToolBox_DailyNoteWrite_now: false
  VCPToolBox_DailyNoteWrite:
    called: false
  project_DailyNote_writer:
    performed: false
  VCP_long_term_memory:
    written_by_attempt_018_closeout: false
```

Any future real DailyNote / VCP long-term memory write must use a separate exact
one-write execution packet, prove the canonical `vcp_root_dailynote` root, and
verify the target file hash after plugin execution. A prior Codex knowledge
memory receipt is supporting context only; it is not authorization to write
DailyNote or VCP long-term memory.

## Memory Router 状态

MVP 阶段不单独实现 Memory Router。记忆初筛由 Archivist_Agent 与 Gatekeeper_Agent 共同承担：

- Archivist_Agent 负责内容归档、案例摘要、风格记忆候选和中文 DailyNote 草案初筛。
- Gatekeeper_Agent 负责安全、敏感信息、执行风险和审计记录初筛。

未来阶段可以将这些职责抽象为 Memory Router，但它不是 MVP 正式模块。
