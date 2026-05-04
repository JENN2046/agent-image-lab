# 07 VCP 记忆系统适配方案

## 原则

Agent Image Lab 不重新造记忆系统，只定义如何正确使用 VCP 记忆系统。

## 三层存储

| 层 | 用途 |
|---|---|
| Git | 硬规则、schema、评分表、项目文档。 |
| VCP 记忆 | 活经验、案例摘要、失败原因、插件表现。 |
| 资产库 | 图片和大文件。 |

## 记忆本

| 记忆本 | 用途 | 主要写入者 |
|---|---|---|
| ImageLab_Master_Diary | 长期项目判断、Jenn 审美偏好、关键决策 | ImageLab_Master |
| Photo_Studio_OS_Style_Memory | Photo Studio OS 风格规则、样板、禁区 | Archivist_Agent / ImageLab_Master |
| Image_Case_Archive | 每张图的案例摘要、评分、入库状态 | Archivist_Agent / Critic_Agent |
| Prompt_Experiment_Log | 提示词实验、有效词、失败词、插件吃词差异 | Prompt_Agent |
| VCP_Image_Plugin_Performance_Memory | 插件表现、适合场景、不适合场景 | VCP_Dispatcher_Agent |
| Execution_Audit_Log | dry-run、审批、执行事实、失败日志 | Gatekeeper_Agent / Dispatcher |
| Rejected_Visual_Lessons | 失败图、跑偏原因、禁止方向、下次规避 | Critic_Agent / Archivist_Agent |
| Iteration_Log | 小步精修经验、有效修正、重绘失控原因 | Iteration_Agent |

## 工具边界

| 工具 | 用途 | 禁止 |
|---|---|---|
| DailyNote | 写入中文日记 | 写图片大文件、写密钥、写英文正文 |
| LightMemo | 查 VCP 日记 / 知识库 | 查完整聊天历史 |
| RAGDiaryPlugin | 被动注入少量长期记忆 | 无条件塞入全部记忆 |
| DeepMemo | 查聊天历史 | 直接当正式知识库 |
| TopicMemo | 完整话题回看 | 日常轻召回 |
