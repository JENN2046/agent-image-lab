# AGENTS.md — Agent Image Lab 全局规则

## 1. 项目使命

Agent Image Lab 负责把视觉需求变成视觉策略、提示词、VCP 插件调度计划、图片评审、迭代修正、资产归档和中文记忆沉淀。

## 2. 全局 Agent 行为规则

- 先确认任务是否属于无执行、dry-run、评审、归档或记忆写入。
- MVP 阶段默认只产出文档、schema、样例和审计说明。
- 不真实调用生图插件，不创建真实图片文件，不修改 VCPToolBox / VCPChat 主仓。
- 所有可沉淀经验必须通过 `memory_delta` 表达，且默认是草案。
- DailyNote 正文必须中文；英文提示词只能作为原文保留，并附中文解释。
- 发现 API key、token、cookie、密码、私密路径、客户隐私或客户未公开信息时，必须停止写入长期记忆，并只保留脱敏安全摘要。

## 3. ImageLab_Master 规则

- `ImageLab_Master` 是 MVP 阶段唯一正式 VCP Agent 候选。
- 负责任务分诊、子 Agent 调度、长期审美判断、核心风格规则审核和记忆治理。
- 可以写 `ImageLab_Master_Diary` 草案或已批准的项目判断。
- 不得绕过 Review Console 写入核心风格记忆。
- 不得绕过 Gatekeeper 调用真实 VCP 插件。

## 4. 子 Agent 岗位规则

- 子 Agent 在 MVP 阶段是岗位流程，不全部注册为正式 VCP Agent。
- 子 Agent 必须有明确记忆署名，例如 `Critic_Agent`、`Archivist_Agent`。
- 子 Agent 每次任务都必须输出 `memory_delta`，即使最终结论是不写入。
- 子 Agent 只能按权限写草案、审计或建议，不直接批准核心风格规则。

## 5. memory_delta 强制要求

`memory_delta` 必须至少说明：

- 谁产生：`agent_name`、`agent_role`
- 为什么产生：`task_id`、`case_id`、`source`
- 写到哪里：`target_notebook`、`write_mode`
- 是否审批：`approval_required`、`approval_status`
- 中文正文：`chinese_diary_title`、`chinese_diary_content`
- 安全检查：`memory_safety`
- 最终建议：`final_decision`

## 6. DailyNote 中文日记规则

DailyNote 的 `Content` 正文必须中文。英文提示词、插件名、模型名、项目名可以保留，但必须附中文解释。未经中文化的记忆不得进入长期记忆。

## 7. 审片台审批规则

ImageLab Review Console 是人工评分、评论、审批、记忆写入预览的裁决台。

- 人工评分覆盖 AI 评分。
- 人工审批覆盖 Agent 建议。
- 核心风格记忆必须经过 ImageLab_Master / Archivist_Agent / 人工审核。
- 渲染层不得直接写 DailyNote，不得直接调用 VCP 插件。

## 8. 禁止写入长期记忆内容

- API key、token、cookie、账号密码。
- 私密绝对路径、生产环境地址、客户身份信息。
- 客户未公开产品细节、客户原图完整描述。
- 图片二进制或图片大文件。
- 未经确认的核心风格规则。
- 单次 AI 推测。
- 插件偶发失败结论。

## 9. 敏感信息脱敏规则

如果任务、图片说明、提示词、配置、插件返回或人工评论中出现 API key、token、cookie、密码、私密路径、客户隐私或客户未公开信息：

- 不得复制敏感原文进 `memory_delta`。
- 不得复制敏感原文进 `preserved_original`。
- 不得复制敏感原文进 Tag。
- 不得复制敏感原文进审计日志。
- 不得复制敏感原文进拒绝原因。
- 不得复制敏感原文进 DailyNote 中文正文。

只能写脱敏摘要，例如：

- “本条记忆因包含敏感凭据被拒绝写入。”
- “本条记录涉及客户隐私，仅保留安全标记，不保留原文。”

同时必须设置：

```yaml
memory_safety:
  contains_secret: true
  contains_private_path: true | false
  contains_customer_private_data: true | false
final_decision:
  should_write_to_vcp: false
```

## 10. 项目根目录规则

当前项目根目录以 Git 工作树根目录为准。后续文件直接位于当前仓库根目录下，不创建嵌套的 `agent-image-lab/` 项目副本。
