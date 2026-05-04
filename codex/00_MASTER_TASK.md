# Codex Master Task — Agent Image Lab v0.2 MVP Skeleton

## 你的身份

你是 Codex 工程执行 Agent。  
你的任务不是发散创意，而是严格按照本任务书创建 Agent Image Lab v0.2 的 MVP 项目骨架。

你必须优先遵守边界、文件结构、禁止事项和验收标准。

---

## 项目名称

Agent Image Lab

---

## 目标项目根目录

本任务的目标项目根目录明确为：

```text
A:\agent-image-lab\agent-image-lab-v0.2\
```

所有文件和目录都应直接位于上述目录下。

不要再创建嵌套目录：

```text
A:\agent-image-lab\agent-image-lab-v0.2\agent-image-lab\
```

也不要创建新的并列目录：

```text
A:\agent-image-lab\agent-image-lab\
```

后文所有文件路径均按目标项目根目录下的相对路径理解，直接落到：

```text
A:\agent-image-lab\agent-image-lab-v0.2\
```

例如：

```text
README.md
```

应执行为：

```text
A:\agent-image-lab\agent-image-lab-v0.2\README.md
```

---

## 项目定位

Agent Image Lab 是一个接入 VCP 生态的视觉生产调度系统。

它不是普通 AI 生图工具。  
它不是新的生图模型。  
它不是新的 VCP 记忆系统。  
它不是完整 DAM。  
它不是现在就要修改 VCPToolBox / VCPChat 主仓的功能项目。

它的目标是把 AI 生图从“单次出图”变成一条可评审、可迭代、可归档、可记忆沉淀的视觉生产线。

---

## 当前 MVP 目标

第一版 MVP 只做文档、规则、schema、样例和无执行闭环。

MVP 必须能支持以下纸面流程：

用户视觉需求
→ task_envelope
→ director_plan
→ prompt_package
→ review_score
→ human_review
→ memory_delta
→ case_summary

本任务不允许真实调用 VCP 生图插件。

---

## 核心硬规则

1. 不重新造记忆系统，只使用 VCP 记忆系统。
2. DailyNote 写入正文必须中文。
3. 子 Agent 必须有记忆署名。
4. 每次任务必须输出 memory_delta。
5. 核心风格记忆需要 ImageLab_Master / Archivist_Agent / 人工审核。
6. 图片大文件不写入长期记忆，只写摘要、路径、评分和规则。
7. API key、token、cookie、私密路径、客户隐私禁止进入长期记忆。
8. DeepMemo 用于聊天历史回忆。
9. LightMemo 用于 VCP 日记 / 知识库主动检索。
10. RAGDiaryPlugin 用于被动长期记忆注入。
11. TopicMemo 用于完整话题回看。
12. Photo Studio OS 是第一阶段主战场。
13. ImageLab Review Console 是必须设计的审片台，但本任务只写规格，不实现 UI。
14. ImageLab_Master 是 MVP 阶段唯一正式 VCP Agent 候选。
15. 子 Agent 在 MVP 阶段是岗位流程，不要全部注册为正式 VCP Agent。

---

## 严禁事项

严禁修改 VCPToolBox 主仓。
严禁修改 VCPChat 主仓。
严禁创建真实 VCP 插件执行代码。
严禁调用任何生图 API。
严禁创建真实图片文件。
严禁写入 API key、token、cookie、密码、私密路径。
严禁把英文作为 DailyNote 日记正文。
严禁让子 Agent 直接写核心风格记忆。
严禁把 Review Console 做成完整 DAM。
严禁创建复杂前端 UI 实现。
严禁把运行期数据目录当作源码模块。

VCPToolBox 自身文档也明确提醒，`dailynote/`、`image/`、插件 `state/` 等是运行数据，不应当作稳定源码模块；插件 manifest 关键字段也不能随意改动。:contentReference[oaicite:1]{index=1}

---

## 你要创建的目录

在目标项目根目录下直接创建以下目录。不要创建嵌套的同名项目子目录：

docs/
agents/
workflows/
integrations/vcp/
memory_policy/
prompt_templates/photo_studio_os/
prompt_templates/image_review/
prompt_templates/image_refinement/
prompt_templates/product_photography/
prompt_templates/commercial_kv/
prompt_templates/vcp_plugin_specific/
style_memory_seed/
case_studies/photo_studio_os_dashboard/
asset_archive/accepted/
asset_archive/candidates/
asset_archive/rejected/
asset_archive/references/
review_console/
schemas/
tests/schema_examples/
codex/

---

## 你要创建的根文件

创建：

README.md
AGENTS.md
00_project_skeleton.md
DECISIONS.md

### README.md 必须包含

- 项目一句话定义
- 项目不是什么
- MVP 范围
- VCPToolBox / VCPChat / VCP 记忆系统的关系
- 第一阶段主战场：Photo Studio OS
- 禁止事项

### AGENTS.md 必须包含

- 全局 Agent 行为规则
- ImageLab_Master 规则
- 子 Agent 岗位规则
- memory_delta 强制要求
- DailyNote 中文日记规则
- 审片台审批规则
- 禁止写入长期记忆内容

### 00_project_skeleton.md 必须包含

- 项目架构
- 目录说明
- Agent 结构
- VCP 接入边界
- 记忆系统边界
- Review Console 边界
- MVP 阶段路线

### DECISIONS.md 必须包含

记录以下决策：

- Agent Image Lab 独立，但接入 VCP
- MVP 不真实执行生图插件
- ImageLab_Master 先正式化，子 Agent 先岗位化
- 记忆正文必须中文
- Review Console 必须存在，但先写规格
- 核心风格记忆必须审核

---

## 你要创建 docs 文件

创建：

docs/01_project_definition.md
docs/02_workflow_sop.md
docs/03_agent_roles.md
docs/04_review_scorecard.md
docs/07_vcp_memory_adaptation_plan.md
docs/08_photo_studio_os_visual_rules.md
docs/11_review_console_design.md
docs/12_mvp_acceptance.md

### 01_project_definition.md

说明：

- 项目是什么
- 项目不是什么
- 为什么独立
- 为什么接入 VCP
- 为什么不重新造记忆系统
- 为什么不重新造生图插件

### 02_workflow_sop.md

写出以下流程：

- Photo Studio OS UI 生图生产线
- 图片评审与精修生产线
- VCP 插件 dry-run 流程
- 资产归档流程
- 记忆写入审批流程

### 03_agent_roles.md

定义：

- ImageLab_Master
- Director_Agent
- Prompt_Agent
- Critic_Agent
- Iteration_Agent
- Archivist_Agent
- VCP_Dispatcher_Agent
- Gatekeeper_Agent

每个角色必须包含：

- 职责
- 输入
- 输出
- 可读记忆
- 可写记忆
- 禁止权限
- 是否正式 VCP Agent
- 是否必须输出 memory_delta

### 04_review_scorecard.md

定义 100 分评分表：

- 构图与空间关系 15
- 主体清晰度 10
- 风格一致性 15
- 高级感 / 商业质感 15
- 细节控制 10
- 色彩与光线 10
- 文字 / UI 可读性 10
- 迭代潜力 10
- 资产沉淀价值 5

必须写明：

- 人工评分覆盖 AI 评分
- 90 分以上可入库
- 85-89 候选
- 75-84 方向可用但问题明显
- 60 以下不建议继续

### 07_vcp_memory_adaptation_plan.md

说明：

- DailyNote 写入
- LightMemo 召回
- RAGDiaryPlugin 被动注入
- DeepMemo 聊天历史回忆
- TopicMemo 完整话题回看
- Git / VCP 记忆 / 资产库三层边界

### 08_photo_studio_os_visual_rules.md

必须写入这些铁律：

- 16:9 widescreen
- 高级黑
- 深冷蓝底色
- 冷白细字体
- 三仪表中心构图
- 中央大仪表是视觉焦点
- 左右小仪表与中央大仪表距离平衡
- 右侧 Risk Pulse / Approval Queue
- 下方 Project Execution / Activity Timeline / AI Inspection Feed
- 克制橙红警示
- 不要赛博朋克
- 不要游戏 HUD
- 不要普通 SaaS
- 不要发灰
- 不要过亮

### 11_review_console_design.md

设计 ImageLab Review Console 审片台：

- MVP 功能范围
- 页面区域
- 用户流程
- AI 评分与人工评分关系
- 评论模型
- 记忆写入预览
- 审批动作
- VCPChat 接入说明
- 不建议 MVP 做的功能

### 12_mvp_acceptance.md

写出 MVP-A 和 MVP-B 验收标准。

MVP-A：无执行闭环。  
MVP-B：VCP Adapter dry-run + 后续单插件执行。

---

## 你要创建 agents 文件

创建：

agents/imagelab_master.md
agents/director_agent.md
agents/prompt_agent.md
agents/critic_agent.md
agents/iteration_agent.md
agents/archivist_agent.md
agents/vcp_dispatcher_agent.md
agents/gatekeeper_agent.md

每个文件必须包含：

1. 角色使命
2. 职责
3. 输入
4. 输出
5. 可读记忆
6. 可写记忆
7. 禁止动作
8. memory_delta 要求
9. DailyNote 中文要求
10. MVP 状态

### imagelab_master.md

必须写明：

- MVP 阶段唯一正式 VCP Agent 候选
- 负责调度子 Agent
- 负责长期审美
- 负责核心风格规则审核
- 不直接绕过 Review Console 写入核心记忆

### critic_agent.md

必须写明：

- 负责图片评分
- 负责失败原因
- 可以写 Image_Case_Archive / Rejected_Visual_Lessons
- 不能最终批准资产入库

### archivist_agent.md

必须写明：

- 负责归档
- 负责中文 DailyNote 草案
- 写核心风格记忆时必须审核

### vcp_dispatcher_agent.md

必须写明：

- 负责 dispatch_plan
- 可以写插件表现记忆
- 不做审美判断

### gatekeeper_agent.md

必须写明：

- 负责 dry-run
- 负责执行风险
- 只能写 Execution_Audit_Log
- 不写审美记忆

---

## 你要创建 memory_policy 文件

创建：

memory_policy/memory_architecture.md
memory_policy/chinese_memory_policy.md
memory_policy/subagent_memory_protocol.md
memory_policy/memory_delta.schema.yaml
memory_policy/memory_notebook_map.md
memory_policy/tag_dictionary.md
memory_policy/write_permissions.md
memory_policy/recall_rules.md
memory_policy/forbidden_memory.md

### memory_architecture.md

写清：

- Git = 硬规则
- VCP 记忆 = 活经验
- 资产库 = 图片与大文件
- DailyNote = 写入入口
- LightMemo / RAGDiaryPlugin / DeepMemo / TopicMemo 的边界

### chinese_memory_policy.md

写清：

- DailyNote Content 必须中文
- 英文提示词可以保留，但必须附中文解释
- 插件名、模型名、项目名可以保留英文
- Tag 以中文为主，可有少量英文锚点
- 未转换为中文的记忆不得写入长期记忆

### subagent_memory_protocol.md

写清：

- 子 Agent 每次任务必须输出 memory_delta
- memory_delta 默认是草案
- 由 Memory Router / Archivist / ImageLab_Master / 人工审批决定是否写入
- 子 Agent 即使不是正式 VCP Agent，也必须有记忆署名

### memory_delta.schema.yaml

必须包含字段：

- delta_id
- task_id
- case_id
- created_at
- agent_name
- agent_role
- project
- memory_type
- target_notebook
- write_mode
- importance
- approval_required
- approval_status
- approved_by
- approved_at
- source
- chinese_diary_title
- chinese_diary_content
- preserved_original
- tags
- visibility
- memory_safety
- promotion
- final_decision

### memory_notebook_map.md

定义这些记忆本：

- ImageLab_Master_Diary
- Photo_Studio_OS_Style_Memory
- Image_Case_Archive
- Prompt_Experiment_Log
- VCP_Image_Plugin_Performance_Memory
- Execution_Audit_Log
- Rejected_Visual_Lessons
- Iteration_Log

### tag_dictionary.md

定义中文 Tag 规则。  
必须包含：

- PhotoStudioOS
- 图片评审
- 三仪表
- 高级黑
- 冷白UI
- 失败经验
- 插件表现
- 提示词实验
- 候选资产
- 正式资产
- 禁止赛博朋克
- 构图失衡

### write_permissions.md

写出子 Agent 写入权限矩阵：

- 可直接写
- 只能写草案
- 必须审核
- 禁止写入

### recall_rules.md

写清：

- DeepMemo 查聊天历史
- LightMemo 查 VCP 日记 / 知识库
- RAGDiaryPlugin 被动注入长期记忆
- TopicMemo 完整话题回看
- 不允许每次全局搜索全部记忆本

### forbidden_memory.md

绝对禁止写入：

- API key
- token
- cookie
- 账号密码
- 私密绝对路径
- 客户身份信息
- 客户未公开产品细节
- 客户原图完整描述
- 图片二进制
- 未经确认的核心风格规则
- 单次 AI 推测
- 插件偶发失败结论

---

## 你要创建 schemas 文件

创建：

schemas/task_envelope.schema.yaml
schemas/prompt_package.schema.yaml
schemas/review_score.schema.yaml
schemas/image_case.schema.yaml
schemas/memory_delta.schema.yaml
schemas/dispatch_plan.schema.yaml
schemas/review_session.schema.yaml

所有 schema 都是草案，不要写复杂验证器。

字段注释必须中文。

### task_envelope.schema.yaml

必须描述：

- task_id
- project
- task_type
- user_request_cn
- visual_goal_cn
- input_assets
- director_plan
- prompt_package_ref
- dispatch_plan_ref
- review_score_ref
- memory_delta_refs
- budget
- visibility

### prompt_package.schema.yaml

必须描述：

- package_id
- task_id
- target_plugin
- main_prompt_cn
- main_prompt_en
- negative_prompt_cn
- negative_prompt_en
- preserve_cn
- change_cn
- avoid_cn
- short_control_cn
- plugin_parameters

### review_score.schema.yaml

必须描述：

- review_id
- task_id
- case_id
- reviewer_type
- total_score
- breakdown
- strengths_cn
- weaknesses_cn
- revision_advice_cn
- continue_iteration
- archive_recommendation
- memory_write_recommendation

### image_case.schema.yaml

必须描述：

- case_id
- project
- task_id
- image_type
- input_assets
- output_assets
- plugin_used
- prompt_package_id
- review_ids
- final_score
- asset_status
- strengths_cn
- weaknesses_cn
- reusable_rules_cn
- memory_entries
- git_promotion_candidate

### dispatch_plan.schema.yaml

必须描述：

- dispatch_id
- task_id
- selected_plugin
- fallback_plugins
- reason_cn
- input_mode
- output_mode
- dry_run_required
- approval_required
- risk_level
- expected_outputs
- max_outputs
- overwrite_allowed
- external_api_allowed

### review_session.schema.yaml

必须描述：

- session_id
- task_id
- case_id
- image_versions
- ai_review
- human_review
- comments
- annotation_notes
- version_comparison
- approval
- archive_decision
- memory_preview
- memory_approval
- next_iteration
- audit_log

---

## 你要创建 integrations/vcp 文件

创建：

integrations/vcp/vcp_integration_overview.md
integrations/vcp/vcp_agent_installation_plan.md
integrations/vcp/vcp_adapter_plugin_plan.md
integrations/vcp/vcp_plugin_capability_matrix.md
integrations/vcp/vcp_task_envelope.schema.yaml
integrations/vcp/vcp_dispatch_plan.schema.yaml
integrations/vcp/vcp_tool_request_examples.md

### vcp_agent_installation_plan.md

说明未来如何把：

agents/imagelab_master.md

同步为：

VCPToolBox/Agent/ImageLab/ImageLab_Master.md

并在 agent_map.json 中增加：

{
  "ImageLab_Master": "ImageLab/ImageLab_Master.md"
}

不要实际修改 VCPToolBox。

### vcp_adapter_plugin_plan.md

说明未来 AgentImageLabAdapter 插件：

- 只做桥接
- 先 dry-run
- 不做审美
- 不直接写记忆
- 不绕过 Gatekeeper

### vcp_plugin_capability_matrix.md

创建表格字段：

- plugin_name
- task_type
- input_mode
- output_mode
- best_for_cn
- not_suitable_for_cn
- approval_required
- risk_level
- current_status
- notes_cn

先用占位行，不填真实插件能力，避免猜测。

### vcp_tool_request_examples.md

写 VCP 工具协议示例，但必须标注：

- 示例仅用于格式说明
- 不代表真实执行
- 不含真实插件调用
- 不含密钥

---

## 你要创建 review_console 文件

创建：

review_console/review_console_product_spec.md
review_console/review_session.schema.yaml
review_console/approval_actions.schema.yaml
review_console/comment_model.schema.yaml

### review_console_product_spec.md

必须包含：

- MVP 功能范围
- 页面区域
- 用户操作流
- AI 评分与人工评分关系
- 评论模型
- 版本对比模型
- 记忆写入预览与审批模型
- 与 DailyNote / LightMemo / Image_Case_Archive 的关系
- 需要在 VCPChat 中新增或改造的模块
- 不建议 MVP 做的功能
- 第一版验收标准

### approval_actions.schema.yaml

必须包含动作：

- approve_archive
- reject_archive
- mark_candidate
- request_iteration
- approve_memory_write
- reject_memory_write
- request_memory_edit
- mark_style_rule_candidate

### comment_model.schema.yaml

必须包含：

- comment_id
- author
- author_type
- target
- severity
- comment_cn
- status
- created_at

---

## 你要创建 workflows 文件

创建：

workflows/photo_studio_os_ui_workflow.md
workflows/image_review_and_refinement_workflow.md
workflows/vcp_generation_workflow.md
workflows/asset_archive_workflow.md

每个 workflow 必须包含：

- 目标
- 输入
- 输出
- 使用的 Agent
- 是否需要 Review Console
- 是否需要 memory_delta
- 是否会写 VCP 记忆
- 是否会调用真实插件

MVP 阶段所有真实执行必须为 false。

---

## 你要创建 prompt_templates 文件

创建：

prompt_templates/README.md
prompt_templates/photo_studio_os/command_center_prompt.md
prompt_templates/photo_studio_os/gauge_refinement_prompt.md
prompt_templates/photo_studio_os/negative_prompt.md
prompt_templates/photo_studio_os/review_prompt.md
prompt_templates/image_review/general_image_review_prompt.md
prompt_templates/image_review/memory_delta_prompt.md
prompt_templates/image_refinement/preserve_layout_refinement.md

要求：

- 中文说明优先
- 英文提示词可出现，但必须附中文解释
- Photo Studio OS 禁止方向必须明确
- 不写真实插件参数

---

## 你要创建 style_memory_seed 文件

创建：

style_memory_seed/photo_studio_os.md
style_memory_seed/luxury_dark_ui.md
style_memory_seed/cockpit_dashboard.md

要求：

- 这是 Git 中的风格种子
- 不等于 VCP 长期记忆
- 不允许写未经确认的新规则
- Photo Studio OS 规则必须与 docs/08_photo_studio_os_visual_rules.md 保持一致

---

## 你要创建 case_studies 文件

创建：

case_studies/README.md
case_studies/photo_studio_os_dashboard/case_summary.md
case_studies/photo_studio_os_dashboard/reviews.md
case_studies/photo_studio_os_dashboard/reusable_rules.md

要求：

- 使用 Photo Studio OS 作为第一案例
- 可以是占位案例
- 必须写明这是 MVP 样例
- 不要引用真实图片文件
- 只写路径占位和文字说明

---

## 你要创建 asset_archive 文件

创建：

asset_archive/README.md
asset_archive/accepted/.gitkeep
asset_archive/candidates/.gitkeep
asset_archive/rejected/.gitkeep
asset_archive/references/.gitkeep

README 必须写明：

- 不把图片大文件直接提交 Git
- 资产文件可放外部路径或专门资产存储
- VCP 记忆只写摘要、路径引用、评分和规则

---

## 你要创建 tests 文件

创建：

tests/schema_examples/task_envelope.example.yaml
tests/schema_examples/review_score.example.yaml
tests/schema_examples/memory_delta.example.yaml
tests/validation_checklist.md

### task_envelope.example.yaml

必须是 Photo Studio OS 无执行样例。

### review_score.example.yaml

必须有分项评分和中文评审。

### memory_delta.example.yaml

必须有：

- agent_name
- target_notebook
- write_mode
- approval_required
- chinese_diary_content
- tags
- memory_safety

---

## 你要创建 codex 文件

创建：

codex/01_create_project_skeleton.md
codex/02_write_memory_policy.md
codex/03_write_agent_roles.md
codex/04_write_schemas.md
codex/05_review_console_spec.md

每个文件写成独立 Codex 子任务书，方便后续拆分执行。

---

## 最终验证

完成后请检查：

1. 所有要求的文件都存在。
2. 没有任何真实 API key、token、cookie。
3. 没有真实 VCP 插件执行代码。
4. 没有图片文件。
5. 所有 DailyNote / memory_delta 示例正文都是中文。
6. 所有子 Agent 文件都包含 memory_delta。
7. Photo Studio OS 视觉规则至少出现在：
   - docs/08_photo_studio_os_visual_rules.md
   - style_memory_seed/photo_studio_os.md
   - prompt_templates/photo_studio_os/negative_prompt.md
8. Review Console 只做规格和 schema，不做真实 UI。
9. 没有修改 VCPToolBox。
10. 没有修改 VCPChat。
11. tests/schema_examples/ 下有完整无执行样例。
12. validation_checklist.md 能指导人工复查。

---

## Definition of Done

完成后，目标项目根目录应该成为一个文档优先的 MVP 骨架。

它必须支持以下无执行闭环：

用户需求
→ task_envelope
→ prompt_package
→ review_score
→ human_review
→ memory_delta
→ case_summary

它不需要，也不允许，在本任务中真实调用任何 VCP 生图插件。
