# 50 v2.0 Productization Plan

本文定义 Agent Image Lab v2.0 产品化方向。v2.0 目标是把当前流程与记录系统升级为可长期使用的工具体系，但不默认授权自动真实生图、自动 DailyNote 写入、自动插件选择或未授权读取 VCPToolBox / VCPChat 私有配置。

## Product Modules

### Task Panel

显示并追踪：

- `task_envelope`
- `dispatch_plan`
- `review_status`
- `memory_status`
- Gatekeeper 风险状态
- 下一授权点

### Review Console

从 runtime prototype 走向 VCPChat 可嵌入实现，但必须保持：

- renderer 不直接调用 DailyNote。
- renderer 不直接调用插件。
- renderer 不直接调用 API。
- renderer 不写磁盘。
- IPC sender 校验。

### Asset Index

只记录：

- 资产路径引用。
- SHA256。
- 评分。
- 状态。
- 人工审批记录。
- 已知视觉偏差。

不记录图片二进制，不记录 raw 插件输出。

### Style Memory

支持：

- 风格规则候选。
- Review Console 审批。
- Archivist_Agent 复查。
- ImageLab_Master 复核。
- DailyNote 写入申请。
- 回滚和拒绝审计。

### Plugin Performance Score

记录：

- 成功率。
- 视觉偏差类型。
- 失败类型。
- 权限风险。
- Gatekeeper 备注。
- 人工验收结果。

### Release Automation

支持：

- tag preflight。
- release package。
- SHA256。
- package-inside validation。
- GitHub Release preflight。
- post-release intake review。

## Non-goals

- 自动真实生图。
- 自动 DailyNote 写入。
- 自动插件选择。
- 客户门户。
- 外链分享。
- 复杂权限系统。
- 未授权读取 VCPToolBox / VCPChat 私有配置。

## Productization Entry Criteria

- v1.1 VCPChat integration plan 完成。
- v1.2 runtime prototype 完成并通过无外部副作用验收。
- v1.3 memory handoff contract 完成。
- v1.4 multi-plugin candidate evaluation 完成。
- 用户单独确认进入 v2.0 产品化阶段。

