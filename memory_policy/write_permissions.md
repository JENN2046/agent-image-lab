# 写入权限矩阵

## 总原则

“写入权限”在 MVP 阶段只表示谁可以生成 `memory_delta` 草案、审计草案或写入申请，不表示可以直接写入 DailyNote / VCP 长期记忆。

真正写入 DailyNote / VCP 长期记忆，必须经过：

```text
memory_delta
→ 权限检查
→ Review Console / Archivist_Agent / ImageLab_Master 审批
→ DailyNote 写入
```

任何子 Agent 都不能直接写入 VCP 长期记忆。任何子 Agent 只能生成 `memory_delta`、审计草案或写入申请。

## 权限矩阵

| Agent | 可直接生成草案 | 可直接记录审计草案 | 可提交写入申请 | 必须审核 | 禁止写入 / 禁止申请 |
|---|---|---|---|---|---|
| ImageLab_Master | ImageLab_Master_Diary 草案、项目判断草案 | 项目级审计摘要 | 核心风格规则候选、Git 升级候选 | 核心风格规则、Git 升级候选、长期审美偏好 | 插件执行事实伪造、客户隐私、敏感原文 |
| Director_Agent | 视觉方向草案、风格规则候选 | 无 | 风格规则候选 | 改动 Photo Studio OS 铁律 | 插件表现、资产入库最终结论、敏感原文 |
| Prompt_Agent | Prompt_Experiment_Log 草案、模板升级候选 | 无 | 通用提示词规则候选 | 通用提示词硬规则 | 核心风格规则、执行审计、敏感原文 |
| Critic_Agent | Image_Case_Archive 草案、Rejected_Visual_Lessons 草案、入库建议 | 无 | 失败经验写入申请 | 核心失败规则、正式资产入库相关记忆 | 最终资产入库审批、敏感原文 |
| Iteration_Agent | Iteration_Log 草案、精修规则候选 | 无 | 精修经验写入申请 | 影响全局工作流的规则 | 风格铁律、插件路由硬规则、敏感原文 |
| Archivist_Agent | Image_Case_Archive 草案、风格规则候选 | 归档审计摘要 | 归档记忆写入申请、风格候选写入申请 | Photo_Studio_OS_Style_Memory 核心结论 | 未评审图直接入库、图片二进制、敏感原文 |
| VCP_Dispatcher_Agent | 插件矩阵升级候选 | dispatch_plan dry-run 审计草案 | 插件表现写入申请 | 禁用 / 降级插件、长期插件表现结论 | 审美评分、风格判断、真实插件执行、敏感原文 |
| Gatekeeper_Agent | 风险规则候选 | Execution_Audit_Log 草案 | 执行审计写入申请 | 高风险执行策略变更 | 审美、提示词、风格记忆、真实插件执行、敏感原文 |

## 审批硬规则

- `write_mode: confirmed` 必须有人工审批。
- 核心风格规则必须经过 ImageLab_Master / Archivist_Agent / 人工审核。
- 涉及敏感信息时只能保留脱敏摘要和安全标记。
- `approval_status: not_required` 不得用于已确认长期记忆写入。
