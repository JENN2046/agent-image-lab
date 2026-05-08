# Phase E VCPChat 子窗口接入任务书

本文是 Phase E 的第一项交付物：VCPChat 子窗口接入任务书。它把既有集成笔记和契约草案收束为一份可执行的任务定义，但本阶段仍不修改真实 VCPChat，不创建真实 IPC handler，不调用 DailyNote/API/VCP 插件。

本文继承 `review_console/vcpchat_integration_notes.md`、`review_console/v1_1_vcpchat_review_console_contract.md` 和 `review_console/v1_6_embed_boundary_contract.md` 的边界定义。

```yaml
phase_e_task_plan:
  status: completed_local_task_plan
  phase: "Phase E — VCPChat subwindow integration preparation"
  deliverables:
    - "VCPChat 子窗口接入任务书 (this doc)"
    - "IPC 契约草案 (phase_e_ipc_contract_draft.md)"
    - "安全验收清单 (phase_e_security_acceptance_checklist.md)"
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  real_vcpchat_modified: false
  ipc_handler_created: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  image_created: false
```

## 任务范围

### 目标

把 Review Console 从项目内静态/运行时原型迁移为 VCPChat 内的子窗口模块，同时保持所有 no-execution guard。

### 迁移路径

```text
当前:
  review_console/static_prototype/     (静态原型, Phase 2)
  review_console/runtime_prototype/    (运行时原型, v1.2+, Batch 2A-7A)

目标 (Phase F 实施时):
  VCPChat/ImageLabmodules/review.html  (子窗口 HTML)
  VCPChat/ImageLabmodules/review.js    (子窗口 renderer)
  VCPChat/ImageLabmodules/review.css   (子窗口样式)
  VCPChat/modules/ipc/imageLabReviewHandlers.js  (主进程 IPC handler)
```

### 本阶段（Phase E）边界

本阶段只做本地文档和契约准备，不实施：
- 不创建或修改 VCPChat 文件
- 不创建 `ImageLabmodules/` 目录
- 不创建 IPC handler 实现
- 不修改 VCPChat 的 `package.json` 或 `preload.js`
- 不配置 `BrowserWindow` 或 `webPreferences`

## 技术约束

### Electron 安全基线

```yaml
webPreferences:
  contextIsolation: true
  nodeIntegration: false
  sandbox: true
  preload: "VCPChat 现有安全 preload 路径（不创建新 preload）"
```

### 输入约束

只接收一个受控对象，通过 IPC `loadSession` 传入：

```yaml
input:
  channel: "imageLabReview.loadSession"
  direction: "main → renderer"
  payload: "review_session (受控草案对象)"
  forbidden_in_payload:
    - raw_image_binary
    - raw_plugin_output
    - raw_runtime_log
    - raw_endpoint
    - secret
    - token
    - cookie
    - password
    - private_path
    - customer_private_data
```

### 输出约束

只返回草案对象，通过 IPC `previewDraft` 传回主进程：

```yaml
output:
  channel: "imageLabReview.previewDraft"
  direction: "renderer → main"
  payload:
    review_session_draft: map
    image_case_draft: map
    memory_delta_draft: map
    memory_completion_state_draft: map
    accepted_candidate_delivery_package_draft: map
    human_override_traceability_draft: map
    inactive_authorization_capsules_draft: map
    runtime_review_state_draft: map
    local_commit_scope_plan_draft: map
    bridge_mock_roundtrip_candidate_draft: map
    real_bridge_authorization_package_draft: map
    plugin_reliability_prompt_discipline_draft: map
    memory_write_completion_candidate_draft: map
    single_real_generation_retry_gate_draft: map
    real_memory_write_authorization_package_draft: map
    asset_archive_candidate_draft: map
    traceability_items: list
    traceability_counts: map
    traceability_summary_cn: string
    traceability_boundary_cn: string
    prototype_guard:
      api_called: false
      daily_note_called: false
      vcp_plugin_called: false
      disk_write_performed: false
      image_file_created: false
    host_preview_ack:
      selected_method: "previewDraft"
      accepted_by_host_mock: true (mock) / true (real)
      validation_passed: true
      side_effects_performed: false
```

## IPC 通道定义

| 通道 | 方向 | 用途 | 允许 |
| --- | --- | --- | --- |
| `imageLabReview.loadSession` | main→renderer | 加载审片会话草案 | 只传受控 review_session |
| `imageLabReview.previewDraft` | renderer→main | 预览草案结果 | 只传草案对象，不触发写入 |
| `imageLabReview.submitDraft` | renderer→main | 提交最终草案 | **Phase E 阶段禁止**；仅在真实授权后打开 |
| `imageLabReview.cancel` | renderer→main | 取消当前审片 | 允许，不产生副作用 |

## 实施步骤（Phase F 计划）

```yaml
phase_f_implementation_plan:
  step_1:
    action: "在 VCPChat 中创建 ImageLabmodules/ 目录"
    gates: "需要真实 VCPChat read+write 授权"
  step_2:
    action: "将 runtime_prototype 的 app.js/runtime_guard.js 改编为 review.js"
    gates: "不直拷；移除 mock_data 引用；改为 IPC 输入"
  step_3:
    action: "创建 imageLabReviewHandlers.js IPC handler"
    gates: "主进程校验 sender；所有 handler 遵循 IPC 契约"
  step_4:
    action: "配置 BrowserWindow webPreferences"
    gates: "contextIsolation=true, nodeIntegration=false, sandbox=true"
  step_5:
    action: "运行安全验收清单"
    gates: "所有检查通过；不允许 writable IPC 绕过 preload allowlist"
  step_6:
    action: "关闭提交门 submitDraft"
    gates: "默认禁止；仅在 A5 授权包激活时打开"
```

## 复用清单

从当前 runtime prototype 可复用：

| 源文件 | 复用方式 |
| --- | --- |
| `runtime_guard.js` | 直接复用为 renderer 内 guard 模块 |
| `app.js` 中的 `buildDraft()` 逻辑 | 改编为 IPC 输入驱动 |
| `styles.css` | 直接复用 |
| `index.html` 的 DOM 结构 | 改编 review.html |
| `FIELD_MAPPING.md` | 作为字段映射参考，不进入子窗口 |

不可复用：

| 源文件 | 原因 |
| --- | --- |
| `mock_data.js` / `host_bridge_mock.js` | 仅供测试；生产走真实 IPC |
| 浏览器全局 mock session | 生产必须通过 `loadSession` IPC 接收 |
| 草案输出 textarea 调试面板 | 仅供开发；生产走受控 `previewDraft` |

## 验收标准（本 Phase E）

```yaml
phase_e_acceptance:
  task_plan_complete: true
  ipc_contract_complete: true
  security_checklist_complete: true
  no_real_vcpchat_modified: true
  no_real_ipc_handler_created: true
  no_plugin_api_dailynote: true
  all_forbidden_outputs_absent: true
  references_existing_contracts: true
```
