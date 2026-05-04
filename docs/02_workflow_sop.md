# 02 Workflow SOP

## Photo Studio OS UI 生图生产线

目标：把 Photo Studio OS 的视觉需求转成可评审的任务包、提示词包、调度计划、评审结果和记忆草案。

```text
用户需求
→ ImageLab_Master 分诊
→ Director_Agent 生成 director_plan
→ Prompt_Agent 生成 prompt_package
→ VCP_Dispatcher_Agent 生成 dispatch_plan
→ Gatekeeper_Agent 做 dry-run 风险检查
→ Review Console 人工确认
→ Critic_Agent 评分
→ Archivist_Agent 生成 case_summary 与 memory_delta
```

MVP 阶段不真实调用 VCP 插件，`external_api_allowed=false`。

## 图片评审与精修生产线

```text
图片引用 / 占位路径
→ Critic_Agent 按 100 分评分表评审
→ 人工评分覆盖 AI 评分
→ 评论与问题归因
→ Iteration_Agent 生成 1-3 个精修目标
→ Prompt_Agent 更新提示词包
→ memory_delta 草案
```

MVP 只允许路径占位和文字说明，不创建真实图片文件。

## VCP 插件 dry-run 流程

```text
task_envelope
→ vcp_plugin_capability_matrix
→ dispatch_plan
→ Gatekeeper_Agent 检查风险
→ approval_required=true
→ execution_blocked=true
```

dry-run 只说明“如果执行会调用什么、输入输出是什么、风险是什么”，不触发真实插件。

## 资产归档流程

```text
review_score
→ human_review
→ archive_decision
→ accepted / candidate / rejected
→ image_case 草案
→ memory_delta 草案
```

图片大文件不进入 Git 和 VCP 长期记忆。记忆只写摘要、路径引用、评分和规则。

## 记忆写入审批流程

```text
memory_delta 草案
→ Memory Router / Archivist_Agent 初筛
→ Review Console 中文预览
→ ImageLab_Master / 人工审批
→ DailyNote 写入或拒绝
```

未经确认的核心风格规则不得进入 `Photo_Studio_OS_Style_Memory`。
