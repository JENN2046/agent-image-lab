> **Historical planning document. Phase v6.8 Plugin Dashboard was superseded by v7.0+ production flow. This document is kept for reference only. It does not represent current architecture or active work.**
>
> **历史规划文档。v6.8 Plugin Dashboard 阶段已被 v7.0+ 生产流程取代。本文仅作参考，不代表当前架构或活跃工作。**

# v6.8 Plugin Dashboard — 规划书

## 目的

在 v6 Product Runtime Baseline（Task Panel、Asset Index、Session Store、Memory Queue、Product Shell）之上，增加**插件调度面板（Plugin Dashboard）**，让 Review Console 能展示插件选择、参数映射、dry-run 切换和状态追踪。

这是产品壳的业务功能增量，不是重构，不是接真实生产执行。

## 当前基线

```text
commit: e481696 (origin/master)
v6.7 Product Runtime Final Acceptance Baseline — 已封存远端
```

## 设计原则

1. **保持 no-execution 边界** — Plugin Dashboard 所有操作停留在 draft surface，不调用真实插件、API、DailyNote、VCP memory。
2. **保持 runtime_guard 不变** — 不修改 guard 规则，不降低拒绝阈值。
3. **利用已有 schema** — `schemas/dispatch_plan.schema.yaml` 已定义插件调度的核心字段。
4. **可交互但不可执行** — 面板可编辑、可切换、可追踪状态，但 `execution_blocked`、`max_plugin_calls`、`dry_run_required` 等安全字段不可覆写。
5. **不新增依赖** — 纯 HTML/CSS/JS，无 bundler、无 npm、无外部库。

## 提议的模块结构

### 1. 插件选择区（Plugin Selector）

- 候选插件列表（从已有的 plugin 知识/记录读取草案数据，不读取真实 VCP 目录）
- 已选插件展示（plugin ID、名称、输入输出模式）
- 备选插件列表（fallback 排序）
- 选择理由中文输入

**数据来源**：`dispatch_plan_draft.selected_plugin`、`dispatch_plan_draft.fallback_plugins`、`dispatch_plan_draft.reason_cn`

**禁止**：
- 不扫描真实 PluginDir
- 不加载真实 plugin-manifest.json
- 不调用 `fs`、`fetch`、`XMLHttpRequest`

### 2. 参数映射区（Parameter Mapper）

- 输入模式显示（text / image / text_image / none）
- 输出模式显示（image / plan / review / none）
- 参数占位编辑（键值对表单）
- 预期输出数量和最大输出数量

**数据来源**：`dispatch_plan_draft.input_mode`、`dispatch_plan_draft.output_mode`、`dispatch_plan_draft.parameters`、`dispatch_plan_draft.expected_outputs`、`dispatch_plan_draft.max_outputs`

**禁止**：
- 不写真实插件参数
- 不存储 raw endpoint、secret、token

### 3. Dry-run 切换区（Dry-run Toggle）

- Dry-run 开关（固定 `true`，不可关闭）
- 执行阻断状态（固定 `true`，不可关闭）
- 风险等级显示（`dispatch_plan_draft.risk_level`）
- 安全字段展示（`execution_blocked`、`max_plugin_calls`、`allow_file_write`、`allow_image_binary`）—— 只读展示，不可编辑

**数据来源**：`dispatch_plan_draft.dry_run_required`、`dispatch_plan_draft.execution_blocked`、`dispatch_plan_draft.risk_level`、`dispatch_plan_draft.forbidden_actions`

**禁止**：
- 不降低 `max_plugin_calls`
- 不将 `execution_blocked` 设为 `false`
- 不将 `dry_run_required` 设为 `false`

### 4. 状态追踪区（Dispatch Status）

- 调度 ID 展示
- 关联 Task ID（联动 v6.1 Task Panel）
- Gatekeeper 审批状态（`gatekeeper_required`）
- 审核追踪（dispatch → plan → review 流转）

**数据来源**：`dispatch_plan_draft.dispatch_id`、`dispatch_plan_draft.task_id`、`dispatch_plan_draft.gatekeeper_required`

### 5. Guard 集成（可选）

如果 Plugin Dashboard 需要新的拒绝规则（如禁止解除 dry-run 锁定），可在 `runtime_guard.js` 增加只读验证函数。但 guard 的拒绝布尔值必须保持 `runtime_guard_not_relaxed` 校验。

## 禁止触碰项

```text
- 不修改 runtime_guard 的现有拒绝规则
- 不降低 max_plugin_calls（必须保持 0）
- 不解除 execution_blocked
- 不调用真实 VCPChat / VCPToolBox
- 不调用真实插件 / API / DailyNote
- 不写 VCP memory / 图片
- 不新增依赖
- 不 push / tag / release
- 不读取真实文件系统
- 不使用 localStorage / sessionStorage / IndexedDB / fs / fetch / XMLHttpRequest / child_process
```

## 建议的开发顺序

```text
Phase 1: 插件选择区 + Dry-run 切换区（只读展示，验证数据流）
Phase 2: 参数映射区（编辑交互）
Phase 3: 状态追踪区 + Guard 集成
Phase 4: Validator 新增（validate_v6_8_plugin_dashboard.js）
Phase 5: 文档 + 索引同步
```

## Validator 建议检查项

```text
1. docs/244 存在
2. Plugin Dashboard DOM 存在
3. dispatch_plan_draft surface 在 app.js 中存在
4. dispatch_plan_draft 保持 execution_blocked=true
5. dispatch_plan_draft 保持 max_plugin_calls=0
6. dispatch_plan_draft 保持 dry_run_required=true
7. runtime_guard 未放宽
8. 无 forbidden API/pattern
9. v6.7 validator 仍可加载
10. 不出现真实插件调用代码
```

## 与本项目其他模块的关系

| 模块 | 关系 |
|---|---|
| v6.1 Task Panel | Plugin Dashboard 关联 task_id 到 Task Panel |
| v6.2 Asset Index | 插件输出预览可能引用 Asset Index |
| v6.3 Session Store | 调度计划可纳入 session export |
| v6.4 Memory Queue | 调度决策可能触发记忆写入申请 |
| v6.5 Product Shell | Plugin Dashboard 嵌入 Product Shell |
| v6.7 Acceptance Baseline | 验证 v6.8 不破坏已有模块 |

## 不纳入范围

```text
- Release Panel（发布面板，需 v7 或独立规划）
- 真实插件执行（需 A5 授权包）
- 真实 API 网关集成
- 插件安装/卸载管理
- 插件市场浏览
- 性能/负载测试
- E2E 浏览器测试
```

## 迭代策略

v6.8 应在已有 runtime prototype 上增量添加，不重构、不迁移。每个 Phase 完成后应确保所有 v6.0-v6.7 validator 仍通过，runtime suite 仍全绿。

所有 `draft_only` / `no-execution` 边界在 v6.8 结束时不得弱于 v6.7 Final Acceptance Baseline。
