# 01 项目定义

## 项目是什么

Agent Image Lab 是接入 VCP 的视觉生产调度系统，负责视觉策略、提示词、插件调度计划、图片评审、迭代修正、资产归档和中文记忆沉淀。

它的目标是把 AI 生图从“单次出图”变成一条可评审、可迭代、可归档、可记忆沉淀的视觉生产线。

## 项目不是什么

- 不是普通 AI 生图工具。
- 不是新的生图模型。
- 不是新的 VCP 记忆系统。
- 不是完整 DAM。
- 不是现在就要修改 VCPToolBox / VCPChat 主仓的功能项目。
- 不是运行期数据目录或插件 state 的源码化封装。

## 为什么独立

Agent Image Lab 独立保存文档、规则、schema、提示词模板和案例，避免把视觉生产流程直接混入 VCPToolBox 主干。独立项目也方便人工复查、版本化和回滚。

## 为什么接入 VCP

VCP 已经拥有插件、工具、记忆和分布式能力。Agent Image Lab 的价值是编排这些能力，定义任务包、调度计划、评审标准、审批和记忆沉淀边界。

## 为什么不重新造记忆系统

VCP 已有 DailyNote、LightMemo、RAGDiaryPlugin、DeepMemo、TopicMemo 等记忆能力。本项目只定义如何安全使用这些能力：中文写入、权限矩阵、禁写清单、审批和召回规则。

## 为什么不重新造生图插件

MVP 的重点是流程、评审和记忆安全，不是新增模型或插件执行能力。真实插件能力必须等 VCP Adapter dry-run、Gatekeeper 审批和插件能力矩阵确认后再接入。

## 当前 MVP 范围

MVP-A 只做无执行闭环：`task_envelope → director_plan → prompt_package → review_score → human_review → memory_delta → case_summary`。不调用真实生图 API，不创建真实图片文件。
