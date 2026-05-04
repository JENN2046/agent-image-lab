# Codex Task 01 — Create Project Skeleton

## 目标

创建或补齐 Agent Image Lab v0.2 的文档优先项目骨架。

## 项目根目录

```text
A:\agent-image-lab\agent-image-lab-v0.2\
```

所有文件都直接位于该目录下。不要创建嵌套的 `agent-image-lab/` 子目录，也不要创建并列目录。

## 工作范围

只允许在项目根目录内补齐：

```text
README.md
AGENTS.md
00_project_skeleton.md
DECISIONS.md
MANIFEST.md
docs/
agents/
workflows/
integrations/vcp/
memory_policy/
prompt_templates/
style_memory_seed/
case_studies/
asset_archive/
review_console/
schemas/
tests/
codex/
```

严禁修改：

```text
VCPToolBox/
VCPChat/
codex/00_MASTER_TASK.md
```

## 根文件要求

- `README.md`：项目定义、项目不是什么、MVP 范围、VCP 关系、Photo Studio OS、禁止事项。
- `AGENTS.md`：Agent 行为规则、ImageLab_Master、子 Agent、memory_delta、DailyNote 中文、审片台审批、禁写内容。
- `00_project_skeleton.md`：项目架构、目录说明、Agent 结构、VCP 接入边界、记忆边界、Review Console 边界、路线。
- `DECISIONS.md`：独立接入 VCP、MVP 不执行生图、ImageLab_Master 先正式化、中文记忆、Review Console 规格先行、核心风格记忆审核。
- `MANIFEST.md`：包含内容和不包含内容。

## 严禁事项

不写真实插件调用，不创建图片文件，不放密钥，不写 UI 实现，不改 VCPToolBox，不改 VCPChat。

## Definition of Done

项目骨架存在于项目根目录，能被人工阅读和复查，并且不会污染 VCPToolBox / VCPChat。
