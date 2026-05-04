# 子 Agent 记忆协议

## 原则

子 Agent 可以不是正式 VCP Agent，但必须有记忆署名。每次任务必须输出 `memory_delta`，用于说明本次任务是否产生了可沉淀经验。

## 必需字段

```yaml
memory_delta:
  agent_name: Critic_Agent
  task_id: task-photo-studio-os-001
  project: Photo Studio OS
  memory_type: failed_visual_lesson
  target_notebook: Rejected_Visual_Lessons
  write_mode: draft
  importance: medium
  chinese_diary_content: "本次评审发现右侧小仪表距离右侧栏过近，破坏三仪表平衡。"
  tags:
    - PhotoStudioOS
    - 三仪表
  approval_required: true
```

## 标准链路

```text
子 Agent 输出任务结果
→ 输出 memory_delta
→ 权限检查
→ Review Console 中文预览
→ 人工审批
→ DailyNote 写入或拒绝
```

## 默认状态

`memory_delta` 默认是 `draft`，不是事实。未经审批不得作为核心风格规则使用。

## 角色写入方向

- `Prompt_Agent` 写提示词实验。
- `Critic_Agent` 写图片评审与失败经验。
- `Archivist_Agent` 写案例归档与风格候选。
- `VCP_Dispatcher_Agent` 写插件表现。
- `Gatekeeper_Agent` 写执行审计。

## 禁止

子 Agent 不得直接写核心风格记忆，不得写 API key、token、cookie、私密路径、客户隐私或图片二进制。
