# 记忆本映射

| 记忆本 | 用途 | 主要写入者 | 主要读取者 | 是否需要审核 | 示例 Tag |
|---|---|---|---|---|---|
| ImageLab_Master_Diary | 长期项目判断、关键决策、审美治理记录 | ImageLab_Master | ImageLab_Master | 中高风险需要审核 | 项目决策、记忆待审批 |
| Photo_Studio_OS_Style_Memory | Photo Studio OS 风格规则、样板、禁区 | Archivist_Agent / ImageLab_Master | Director_Agent / Critic_Agent / Prompt_Agent | 必须审核 | PhotoStudioOS、三仪表、高级黑 |
| Image_Case_Archive | 每张图的案例摘要、评分、入库状态 | Archivist_Agent / Critic_Agent | Critic_Agent / Archivist_Agent | 正式资产需要审核 | 图片评审、候选资产、正式资产 |
| Prompt_Experiment_Log | 提示词实验、有效词、失败词、插件吃词差异 | Prompt_Agent | Prompt_Agent / VCP_Dispatcher_Agent | 通用规则需要审核 | 提示词实验、失败经验 |
| VCP_Image_Plugin_Performance_Memory | 插件表现、适合场景、不适合场景 | VCP_Dispatcher_Agent | VCP_Dispatcher_Agent / Gatekeeper_Agent | 插件降级或禁用必须审核 | 插件表现、dry-run |
| Execution_Audit_Log | dry-run、审批、执行事实、失败日志 | Gatekeeper_Agent / VCP_Dispatcher_Agent | Gatekeeper_Agent / ImageLab_Master | 高风险执行必须审核 | 执行审计、记忆待审批 |
| Rejected_Visual_Lessons | 失败图、跑偏原因、禁止方向、下次规避 | Critic_Agent / Archivist_Agent | Director_Agent / Critic_Agent / Iteration_Agent | 核心失败规则需要审核 | 失败经验、禁止赛博朋克、构图失衡 |
| Iteration_Log | 小步精修经验、有效修正、重绘失控原因 | Iteration_Agent | Iteration_Agent / Prompt_Agent | 影响全局流程时需要审核 | 继续迭代、三仪表 |

## 后续记忆本

- Commercial_Product_Visual_Memory：产品摄影线启动后再创建。
- Client_Project_Memory：真实客户项目且权限体系成熟后再创建。
- Human_Review_Preference_Memory：Review Console 积累足够人工评分后再创建。
