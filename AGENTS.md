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

## 11. Guarded Autopilot 合并规则

本节合并自 `AGENTS.autopilot-overlay.md`。根 `AGENTS.md` 现在同时承载项目基础规则和 guarded sustained autopilot 规则；overlay 文件继续作为历史安装记录和续跑辅助保留，不删除、不替换。

Agent Image Lab 不是通用代码项目，而是 VCP 原生视觉生产编排系统。默认可以持续推进的工作必须同时满足：

- 位于当前项目根目录内。
- 本地、安全、可逆。
- 不读取外部真实源代码或真实 manifest。
- 不触发真实执行、真实记忆写入、真实 VCP 仓库修改或隐藏成本。

简写规则：

```text
安全时继续 docs/schema/prototype/validation 工作
遇到外部读取、真实执行、真实记忆写入、VCP 仓库修改或隐藏成本前停止
```

默认对用户输出使用简体中文。

## 12. 项目专用硬停止门

以下动作必须先获得明确人工授权，不得由 `继续`、`去吧`、`自动推进`、`keep going` 等模糊指令推断授权：

- 读取真实 `VCPToolBox` 源码。
- 读取真实 `VCPChat` 源码。
- 读取项目外任何真实 `plugin-manifest.json`。
- 读取 `.env`、`config.env`、日志、token 文件、cookie、secret 或私密配置。
- 列出或存储真实本地私密路径。
- 从外部仓库复制 raw source。
- 修改真实 `VCPToolBox`。
- 修改真实 `VCPChat`。
- 创建 VCPChat IPC / preload / renderer 集成代码。
- 创建可执行 Adapter 入口。
- 调用 VCP 插件。
- 调用 API。
- 调用 DailyNote。
- 写入 VCP 记忆。
- 创建图片文件。
- 修改依赖。
- `git add`、commit、push、PR、merge、tag、release。
- 写入项目根目录外的任何位置。

## 13. 当前可自动推进的安全工作

在项目根目录内，且不跨越硬停止门时，可以继续：

- 文档 refinement。
- schema 对齐。
- validation checklist refinement。
- Review Console 静态原型 refinement，前提是不调用 API、不写文件、不创建图片。
- no-execution examples。
- `.agent_board` 更新。
- 本地 validation scripts。
- dry-run planning docs。
- 保持真实路径为空或脱敏的授权申请模板。

## 14. 记忆和 DailyNote 边界

DailyNote 与记忆相关样例必须遵守：

- 日记正文只写中文。
- 不保存 raw secrets 或敏感原文。
- 不保存私密路径原文。
- 不保存客户隐私。
- 不保存图片二进制。
- 每个子 Agent 任务都必须产出 `memory_delta`。
- `memory_delta` 默认是 draft。
- `confirmed` memory 必须有 approval metadata。
- `audit_only` 和 `forbidden` 不得写入 VCP 长期记忆。

不得把敏感原文放入：

- `memory_delta`
- `preserved_original`
- `Tag`
- audit logs
- rejection reasons
- DailyNote body

只能写脱敏中文摘要和安全标记。

## 15. Review Console 安全定位

Review Console 是 gate，不是生产执行引擎。

MVP / prototype 阶段规则：

- human review 覆盖 AI review。
- `memory_preview` 只是预览。
- `memory_approval.status != approved` 时不得调用 DailyNote。
- 静态原型不得调用 API。
- 静态原型不得写文件。
- 静态原型不得创建图片。
- VCPChat integration code 需要单独授权。

## 16. Adapter Recon 分阶段规则

Adapter recon 必须按阶段推进：

```text
planning baseline
-> authorization gate
-> authorization fill template
-> single-file read authorization
-> real read only after explicit user approval
```

默认安全状态是 no-execution / no-external-read：

```yaml
source_authorized: false
source_read_performed: false
real_manifest_read: false
real_execution_allowed: false
selected_plugin: null
max_plugin_calls: 0
api_called: false
vcp_plugin_called: false
daily_note_called: false
external_repo_access_allowed: false
allowed_source_paths: []
read_commands_allowed: false
```

没有明确授权和验证前，不得把状态推进到 `manifest_reviewed_safe`、`dry_run_checked`、`tested`、`plugin_selected` 或 `execution_ready`。

## 17. 本地验证和版本动作规则

完成前运行最窄但足够的本地验证。常用检查：

```powershell
git status --short
git diff --check
.\scripts\validate-agent-image-lab-local.ps1
```

或：

```bash
git status --short
git diff --check
bash scripts/validate-agent-image-lab-local.sh
```

不得声称执行过未实际运行的验证。结果标签使用：

```text
COMPLETED_VALIDATED
COMPLETED_UNVALIDATED
PARTIAL
BLOCKED
FAILED
```

本地 commit 仅在明确授权或已经处于窄范围 accepted flow 时允许。push、tag、release、移动 tag、PR、merge 必须单独明确授权。

任何本地 commit 前必须先检查：

```bash
git diff --check
git diff --cached --check
git diff --cached --name-only
git diff --cached --stat
```

不得使用 `git add .`；只 stage 当前任务范围内的文件。

## 18. 汇报格式

任务完成后用中文报告：

```text
Status:
Mode:
Risk:
Changed files:
Validation:
Boundary checks:
Findings:
Next recommended task:
```

如果 blocked，需要更新 `.agent_board/BLOCKERS.md` 和 `.agent_board/HANDOFF.md`。
