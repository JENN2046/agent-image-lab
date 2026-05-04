# Codex Task 08 — Validation Task

## 目标

对 Agent Image Lab v0.2 MVP 骨架做只读验证，确认文件完整、安全边界清楚、无执行闭环成立。

## 工作范围

只允许读取项目根目录下文件。不得修改 `codex/00_MASTER_TASK.md`、VCPToolBox 或 VCPChat。

## 验证项

1. 所有要求的文件都存在。
2. 没有第二套嵌套 `agent-image-lab/` 目录。
3. 没有任何真实 API key、token、cookie、密码、私密路径或客户隐私。
4. 没有真实 VCP 插件执行代码。
5. 没有图片文件。
6. 所有 DailyNote / memory_delta 示例正文都是中文。
7. 所有子 Agent 文件都包含 `memory_delta`。
8. Photo Studio OS 视觉规则至少出现在 docs、style_memory_seed 和 negative_prompt。
9. Review Console 只做规格和 schema，不做真实 UI。
10. 没有修改 VCPToolBox。
11. 没有修改 VCPChat。
12. tests/schema_examples 下有完整无执行样例。
13. validation_checklist.md 能指导人工复查。

## Definition of Done

输出验证报告，明确哪些已验证、哪些只是人工可复查、哪些仍有风险。
