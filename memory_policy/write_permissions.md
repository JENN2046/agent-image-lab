# 写入权限矩阵

| Agent | 可直接写 | 只能写草案 | 必须审核 | 禁止写入 |
|---|---|---|---|---|
| ImageLab_Master | ImageLab_Master_Diary | 风格规则候选 | 核心风格规则、Git 升级候选 | 插件执行事实伪造、客户隐私 |
| Director_Agent | 视觉方向记录 | 风格规则候选 | 改动 Photo Studio OS 铁律 | 插件表现、资产入库最终结论 |
| Prompt_Agent | Prompt_Experiment_Log | 模板升级候选 | 通用提示词硬规则 | 核心风格规则、执行审计 |
| Critic_Agent | Image_Case_Archive、Rejected_Visual_Lessons | 入库建议 | 核心失败规则 | 最终资产入库审批 |
| Iteration_Agent | Iteration_Log | 精修规则候选 | 影响全局工作流的规则 | 风格铁律、插件路由硬规则 |
| Archivist_Agent | Image_Case_Archive | 风格规则候选 | Photo_Studio_OS_Style_Memory 核心结论 | 未评审图直接入库 |
| VCP_Dispatcher_Agent | VCP_Image_Plugin_Performance_Memory | 插件矩阵升级候选 | 禁用 / 降级插件 | 审美评分、风格判断 |
| Gatekeeper_Agent | Execution_Audit_Log | 风险规则候选 | 高风险执行策略变更 | 审美、提示词、风格记忆 |
