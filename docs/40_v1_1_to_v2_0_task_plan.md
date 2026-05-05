# 40 v1.1 to v2.0 Task Plan

本文固化 Agent Image Lab 在 v1.0.2 之后的任务面板路线。它只规划和约束后续工作，不授权新的真实插件调用、DailyNote 写入、VCP 长期记忆写入、VCPChat 修改或 VCPToolBox 修改。

## Current Baseline

```yaml
current_baseline:
  post_release_housekeeping_commit: 302c524
  housekeeping_tag: v1.0.2-post-release-housekeeping
  latest_package_release: v1.0.1-post-intake-closeout
  release_packages_ignored: true
  next_track: v1.1_vcpchat_review_console_integration_plan
```

## v1.1 VCPChat Review Console Integration Plan

目标：只做 VCPChat 子窗口接入规划，不改真实 VCPChat。

交付物：

- VCPChat Review Console 子窗口任务书。
- IPC contract 草案。
- Electron 安全验收清单。
- 静态原型迁移边界。

固定边界：

- `contextIsolation=true`
- `nodeIntegration=false`
- preload 只暴露最小 allowlist API。
- IPC sender 必须校验来源窗口。
- renderer 不直接调用 DailyNote、VCP 插件、API 或文件系统。
- 不通过 URL query、hash 或窗口标题传递 key、token、cookie、私密路径或客户隐私。

## v1.2 Review Console Runtime Prototype

目标：把静态原型推进成项目内可嵌入式 runtime prototype，但仍不接真实 VCPChat。

交付物：

- `review_console/runtime_prototype/`。
- 浏览器内 host bridge mock。
- 可导出的 `review_session_draft`、`image_case_draft`、`memory_delta_draft`。
- `prototype_guard` 固定显示无外部副作用。

固定边界：

- 不使用外部 API。
- 不调用 DailyNote。
- 不调用 VCP 插件。
- 不写磁盘。
- 不创建图片。
- 不加载图片二进制，只显示受控引用或占位文本。

## v1.3 DailyNote / VCP Memory Handoff

目标：设计真实记忆写入前置链，不执行 DailyNote 写入。

固定流程：

```text
memory_delta
→ 权限检查
→ Review Console 审批
→ Archivist_Agent 复查
→ ImageLab_Master 复核
→ DailyNote 写入前授权
→ 写入执行审计
```

核心边界：

- `final_decision.should_write_to_vcp=true` 只表示写入申请已批准，不表示已经写入。
- `write_mode=confirmed` 只表示满足审批不变量，不代表调用 DailyNote。
- 真正 DailyNote 写入必须有独立授权、执行记录和失败回滚记录。
- 图片二进制永不进入 Git、DailyNote 或 VCP 长期记忆。
- 敏感内容只能保留中文脱敏拒绝摘要。

## v1.4 Multi-plugin Candidate Evaluation

目标：把单插件候选流程扩展为多插件候选评估，但不自动真实执行。

状态流：

```text
discovered
→ pending_manifest_review
→ manifest_reviewed_safe / rejected
→ dry_run_planned
→ dry_run_checked
→ real_execution_authorization_required
```

每个候选必须满足：

- manifest 脱敏审查先于 dry-run 结论。
- 每个真实 manifest 读取都必须单独授权。
- 不保存 raw manifest、endpoint 原文、密钥、私密路径或客户隐私。
- 真实执行必须再次单独授权，并限定插件、命令、模型、调用次数、输入引用、输出目录和回滚方案。

## v2.0 Productization

目标：把 Agent Image Lab 从流程与记录系统升级为可长期使用的工具体系。

产品化模块：

- 任务面板。
- 可嵌入审片台。
- 资产索引。
- 风格记忆审批。
- 插件表现评分。
- 发布流程自动化。

v2.0 不默认包含自动真实生图、自动 DailyNote 写入、自动插件选择、客户门户、外链分享、复杂权限系统或未授权读取 VCPToolBox / VCPChat 私有配置。

