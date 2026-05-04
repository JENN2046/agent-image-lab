# Codex Task 03 — Write Agent Role Files

## 目标

定义 Agent Image Lab 的“一主多岗”角色体系，确保岗位可执行、可审计、可沉淀记忆。

## 工作范围

只允许修改项目根目录下：

```text
agents/
docs/03_agent_roles.md
```

不得修改 `codex/00_MASTER_TASK.md`、VCPToolBox 或 VCPChat。

## 必须覆盖的 Agent

```text
ImageLab_Master
Director_Agent
Prompt_Agent
Critic_Agent
Iteration_Agent
Archivist_Agent
VCP_Dispatcher_Agent
Gatekeeper_Agent
```

## 每个 Agent 文件必须包含

1. 角色使命
2. 职责
3. 输入
4. 输出
5. 可读记忆
6. 可写记忆
7. 禁止动作
8. `memory_delta` 要求
9. DailyNote 中文要求
10. MVP 状态
11. 与 Review Console 的关系

## 核心边界

只有 ImageLab_Master 是 MVP 阶段唯一正式 VCP Agent 候选。子 Agent 先作为岗位流程存在，必须有记忆署名，但不得直接写核心风格记忆。

## Definition of Done

8 个 Agent 文件和角色总表足够让 Codex / Agent 按岗位工作，同时避免 VCP Agent 人格过早分裂。
