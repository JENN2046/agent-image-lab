# 03 Agent 角色与责任边界

## 总原则

MVP 阶段只有 `ImageLab_Master` 是正式 VCP Agent 候选。子 Agent 作为岗位流程存在，但必须有记忆署名并输出 `memory_delta`。

| Agent | MVP 状态 | 主要职责 | 可读记忆 | 可写记忆 | 禁止动作 | 输出物 | memory_delta 类型 |
|---|---|---|---|---|---|---|---|
| ImageLab_Master | 正式 VCP Agent 候选 | 分诊、调度、长期审美、核心规则审核 | 全部 ImageLab 记忆摘要 | ImageLab_Master_Diary、核心规则候选草案 | 绕过 Review Console 写核心记忆 | 调度结果、审核意见 | 项目判断、风格审核 |
| Director_Agent | 岗位流程 | 视觉方向、构图、风格边界 | Photo_Studio_OS_Style_Memory、Rejected_Visual_Lessons | 风格规则候选草案 | 直接写核心风格铁律 | director_plan | 视觉方向经验 |
| Prompt_Agent | 岗位流程 | 主提示词、负面提示词、插件适配 | Prompt_Experiment_Log、VCP_Image_Plugin_Performance_Memory | Prompt_Experiment_Log | 批准资产入库、更新核心风格规则 | prompt_package | 提示词实验 |
| Critic_Agent | 岗位流程，后续优先正式化 | 评分、问题判断、失败经验 | 评分表、案例、失败经验、Photo Studio OS 规则 | Image_Case_Archive、Rejected_Visual_Lessons | 最终批准资产入库 | review_score | 图片评审、失败经验 |
| Iteration_Agent | 岗位流程 | 下一轮精修目标，小步迭代 | Iteration_Log、Prompt_Experiment_Log、Rejected_Visual_Lessons | Iteration_Log | 重设整体方向 | iteration_plan | 精修经验 |
| Archivist_Agent | 岗位流程，后续优先正式化 | 归档、中文 DailyNote 草案、风格候选 | 全部案例与风格记忆 | Image_Case_Archive、Rejected_Visual_Lessons、风格候选 | 未评审图片直接入库 | image_case、case_summary | 归档经验、风格候选 |
| VCP_Dispatcher_Agent | 岗位流程，后续优先正式化 | dispatch_plan、插件表现记录 | 插件能力矩阵、插件表现记忆 | VCP_Image_Plugin_Performance_Memory | 做审美判断、绕过 Gatekeeper | dispatch_plan | 插件表现 |
| Gatekeeper_Agent | 岗位流程 | dry-run、执行风险、人工确认、审计 | Execution_Audit_Log、forbidden_memory | Execution_Audit_Log | 写审美、提示词、核心风格记忆 | execution_gate_report | 执行审计 |

## 共同输入

- `task_envelope`
- 上一阶段输出
- 相关记忆召回摘要
- Review Console 人工意见

## 共同输出

- 结构化阶段产物
- 中文说明
- `memory_delta` 草案或拒绝写入说明

## 禁止

- 子 Agent 不得直接写核心风格铁律。
- Dispatcher 不得做审美裁决。
- Gatekeeper 不得写风格记忆。
- Prompt_Agent 不得批准资产入库。
- 任何 Agent 不得写入密钥、私密路径、客户隐私或图片二进制。
