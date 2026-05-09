# v6.8B Plugin Dashboard Guard Hardening

## 目的

为 v6.8A 的 dispatch_plan_draft 增加 runtime_guard 安全校验函数 `v6DispatchPlanIsSafe()`，在 `v6ProductRuntimeIsSafe()` 中接入调用，使 Plugin Dashboard 的 draft surface 有更硬的本地安全门。

## 当前基线

```text
commit: eb4fade (origin/master)
v6.8A Plugin Dashboard Draft Surface — Plugin Selector, Parameter Mapper, Dry-run Toggle, Dispatch Status
```

## 新增内容

### runtime_guard.js

新增函数 `v6DispatchPlanIsSafe(draft)`，校验以下安全字段：

```text
dispatch_plan_draft 存在时：
- draft_only === true
- side_effects_performed === false
- no_execution_guard clean
- dry_run_required === true
- execution_blocked === true
- max_plugin_calls === 0
- allow_file_write === false
- allow_image_binary === false
- selected_plugin.source === local_draft_fixture
- selected_plugin.real_manifest_loaded === false
- selected_plugin.real_plugin_available_confirmed === false
- parameters 是数组
- 每个 parameter.raw_secret_stored === false
- 每个 parameter.raw_endpoint_stored === false
- 每个 parameter.raw_path_stored === false
- gatekeeper_required === true
- forbidden_actions 是非空数组
- dispatch_status ∈ [draft, mapped, blocked, ready_for_human_review]
- gatekeeper_status ∈ [required, pending, reviewed, blocked]
- trace_state ∈ [dispatch_draft, plan_draft, review_draft]
```

新增三个枚举常量：`VALID_DISPATCH_STATUSES`、`VALID_GATEKEEPER_STATUSES`、`VALID_TRACE_STATES`。

在 `v6ProductRuntimeIsSafe()` 中调用 `v6DispatchPlanIsSafe(draft)` 作为最后一道校验。

### 不修改项

- 不改变旧 guard 语义
- 不删除旧校验
- 不放宽任何已有拒绝条件
- dispatch_plan_draft builder 本身安全字段不变

## no-execution 边界

与 v6.8A 相同：不读取真实 PluginDir、不加载真实 manifest、不调用插件/API/DailyNote/VCP memory。

## 验证命令

```powershell
node --check review_console/runtime_prototype/runtime_guard.js
node --check scripts/validate_v6_8b_plugin_dashboard_guard_hardening.js
node scripts/validate_v6_8b_plugin_dashboard_guard_hardening.js
node scripts/validate_v6_8_plugin_dashboard.js
node scripts/validate_v6_7_product_runtime_final_acceptance.js
node scripts/validate_runtime_prototype_smoke.js
node scripts/validate_runtime_prototype_suite.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

## 后续

- **v6.9 Release Panel Planning**
