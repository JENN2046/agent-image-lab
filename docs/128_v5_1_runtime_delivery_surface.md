# v5.1 Runtime Delivery Surface Validation

本文记录 v5.1 runtime delivery surface validation。该阶段为 Review Console runtime prototype 增加一个项目内交付面校验入口，用来确认浏览器原型仍保持本地、无外部副作用、可验收的形态。它不创建真实 VCPChat 子窗口，不创建 IPC / preload 集成，不调用插件、API、DailyNote、VCP 记忆或外部服务。

```yaml
runtime_delivery_surface:
  status: completed_validated_project_local_v5_1_runtime_delivery_surface
  version: v5.1
  validation_file: scripts/validate_runtime_delivery_surface.js
  runtime_file_count: 7
  runtime_files_present: true
  script_order_verified: true
  stylesheet_present: true
  dom_surface_id_count: 14
  dom_surface_present: true
  host_ack_surface_present: true
  field_mapping_current: true
  readme_boundary_current: true
  validation_command_current: true
  suite_integrated: true
  validate_mvp_current: true
  external_assets_loaded: false
  forbidden_runtime_calls_present: false
  external_network_required: false
  external_service_required: false
  file_write_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  real_vcptoolbox_source_read: false
  real_vcptoolbox_modified: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_file_created: false
  commit_tag_push_authorized: false
```

## 校验内容

v5.1 新增的校验只读取项目内文件：

- `review_console/runtime_prototype/index.html`
- `styles.css`
- `runtime_guard.js`
- `host_bridge_mock.js`
- `app.js`
- `FIELD_MAPPING.md`
- `README.md`

校验断言包括：

- runtime 入口文件齐全。
- `index.html` 使用固定本地脚本顺序：`runtime_guard.js -> host_bridge_mock.js -> app.js`。
- 所有预期 DOM id 都存在。
- host ack 面板仍存在。
- `FIELD_MAPPING.md` 覆盖 `review_session_draft`、`image_case_draft`、`memory_delta_draft`、`prototype_guard` 和 Host Submit Ack。
- `README.md` 保留不接真实 VCPChat / VCPToolBox、不调用插件 / API / DailyNote、不写磁盘的边界。
- runtime 原型不加载外部 URL，不包含 `fetch`、IPC、storage 或文件写入调用。

## 验收命令

```powershell
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_prototype_suite.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

## 边界

v5.1 不代表真实 VCPChat 集成已经存在，也不代表 DailyNote 或 VCP 记忆可以写入。它只是把当前 runtime prototype 的本地交付面变成机器可检查的状态。
