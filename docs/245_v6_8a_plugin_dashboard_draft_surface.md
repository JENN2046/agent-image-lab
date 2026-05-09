# v6.8A Plugin Dashboard Draft Surface

## 目的

在 v6 Product Runtime Baseline 之上，增加 Plugin Dashboard 的 draft-only 调度面板。
本轮只实现 Plugin Selector、Parameter Mapper、Dry-run Toggle、Dispatch Status 四个区域和 dispatch_plan_draft 数据结构，不接真实插件执行。

## 当前基线

```text
commit: e481696 (origin/master)
v6.7 Product Runtime Final Acceptance Baseline — 已封存远端
```

## Plugin Dashboard 四个区域

### 1. Plugin Selector（插件选择）

- `dispatch_id` 只读展示
- `selected_plugin` 选择（从本地草案候选列表中选择，不读取真实 PluginDir）
- `display_name` 输入
- `input_mode` / `output_mode` 选择
- `fallback_plugins` 只读展示
- `reason_cn` 中文选择理由输入

插件候选列表为本地硬编码 fixture（DoubaoGen、GPTImageGen、AgentImageLabAdapter），不代表真实插件可用。

### 2. Parameter Mapper（参数映射）

- `parameter_key` 输入
- `parameter_value` 输入（参数值草案预览，非真实参数）
- `expected_outputs` / `max_outputs` 数值输入
- `parameter_preview` 只读展示

本轮只支持一组 key-value 参数，数据结构预留数组扩展。

### 3. Dry-run Toggle（安全字段区——只读）

只读展示以下安全字段：
- `dry_run_required: true`
- `execution_blocked: true`
- `max_plugin_calls: 0`
- `allow_file_write: false`
- `allow_image_binary: false`
- `risk_level`
- `forbidden_actions`

UI 可以使用 `<select>` 或 `<dl>`，字段必须不可被用户解除。

### 4. Dispatch Status（调度状态）

- `dispatch_id` 只读展示
- `linked_task_id` 只读展示
- `gatekeeper_required` 只读展示（固定 true）
- `gatekeeper_status` 选择（required / pending / reviewed / blocked）
- `dispatch_status` 选择（draft / mapped / blocked / ready_for_human_review）
- `trace_state` 选择（dispatch_draft / plan_draft / review_draft）

## dispatch_plan_draft 字段说明

完整字段定义见 `review_console/runtime_prototype/app.js` 中 `dispatch_plan_draft` builder。

字段铁律：

```text
draft_only: true
side_effects_performed: false
dry_run_required: true          不可更改
execution_blocked: true         不可更改
max_plugin_calls: 0             不可更改
allow_file_write: false         不可更改
allow_image_binary: false       不可更改
real_manifest_loaded: false     不可更改
real_plugin_available_confirmed: false
raw_secret_stored: false        不可更改
raw_endpoint_stored: false      不可更改
raw_path_stored: false          不可更改
```

## no-execution 边界

- 不读取真实 PluginDir
- 不加载真实 plugin-manifest.json
- 不调用真实 VCPChat / VCPToolBox
- 不调用插件 / API / DailyNote
- 不写 VCP memory
- 不创建图片
- 不读取真实文件系统
- 不新增依赖
- 不 push / tag / release

## 与已有模块的关系

| 模块 | 关系 |
|---|---|
| v6.1 Task Panel | `dispatch_plan_draft.linked_task_id` 关联到 Task Panel 的 task_id |
| v6.2 Asset Index | 插件输出模式可能与 Asset Index 条目关联 |
| v6.3 Session Store | 调度计划纳入 session export 草案 |
| v6.4 Memory Queue | 调度决策可能触发记忆写入申请 |
| v6.5 Product Shell | Plugin Dashboard 作为 v6 Product Runtime 新板块嵌入 |
| v6.7 Acceptance Baseline | v6.8 不破坏已有模块和 validator |

## runtime_guard 策略

本轮不改 runtime_guard.js。所有安全字段通过 dispatch_plan_draft builder 和 v6.8 validator 保证。

## 验证命令

```powershell
node --check review_console/runtime_prototype/app.js
node --check review_console/runtime_prototype/runtime_guard.js
node --check scripts/validate_v6_8_plugin_dashboard.js
node scripts/validate_v6_8_plugin_dashboard.js
node scripts/validate_v6_7_product_runtime_final_acceptance.js
node scripts/validate_v6_6_product_shell_qa.js
node scripts/validate_v6_5_review_console_product_shell.js
node scripts/validate_v6_4_memory_queue_interaction.js
node scripts/validate_v6_3_session_store_interaction.js
node scripts/validate_v6_2_asset_index_interaction.js
node scripts/validate_v6_1_task_panel_interaction.js
node scripts/validate_v6_0_product_runtime_kickoff.js
node scripts/validate_runtime_prototype_smoke.js
node scripts/validate_runtime_prototype_suite.js
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

## 后续

- **v6.8B**: guard hardening（如需新增 `v6DispatchPlanIsSafe` 函数）
- **v6.9**: Release Panel planning 或 Plugin Dashboard 增强（fallback 排序、参数模板）
