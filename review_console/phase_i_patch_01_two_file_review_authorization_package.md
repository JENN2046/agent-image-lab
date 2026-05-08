# Phase I Patch 01 Embed v2 Two-File Review Authorization Package

基于 Plan 01 结论：5 个目标文件中 3 个无需修改，仅复查 2 个文件。本授权包只授权**只读复查**，默认不写 VCPChat。

```yaml
phase_i_patch_01:
  status: completed_authorization_package
  timestamp: "2026-05-08"
  phase: "Phase I Patch 01 — Two-file Review Authorization Package"
  activation_status: inactive_package
  activation_phrase: "批准 Phase I Patch 02 复查"
  vcpchat_modified: false
  real_execution: false
```

## 1. Plan 01 结论

```yaml
plan_01_findings:
  total_target_files: 5
  already_wired_since_v10_2: 3
  review_only: 2
  create_or_modify: 0

  no_change_needed:
    - file: "main.js"
      reason: "handlers already imported (line 35) + initialized (line 1040)"
    - file: "main.html"
      reason: "mount DOM (line 614) + script tag (line 1978) already present"
    - file: "preloads/chat.js"
      reason: "all 4 channels already exposed via contextBridge (lines 101-604)"

  review_only:
    - file: "modules/ipc/imageLabReviewHandlers.js"
      reason: "复查 handler 逻辑与 Agent Image Lab runtime draft schema 一致"
    - file: "modules/renderer/imageLabReviewMount.js"
      reason: "复查 mount 合约与 Agent Image Lab runtime contract 一致"
```

## 2. Allowed Operations

```yaml
allowed:
  read_only:
    - "cat A:/VCP/VCPChat/modules/ipc/imageLabReviewHandlers.js (只读)"
    - "cat A:/VCP/VCPChat/modules/renderer/imageLabReviewMount.js (只读)"
    - "对比 Agent Image Lab IPC 契约 (phase_e_ipc_contract_draft.md)"
    - "对比 Agent Image Lab runtime guard 规则 (runtime_guard.js)"
    - "记录复查结论到 Agent Image Lab"

  smoke_test_preflight:
    - "node --check (syntax check on VCPChat files)"
    - "如果 VCPChat 在运行：F2 bridge smoke (cancel/loadSession/previewDraft)"
    - "Runtime.evaluate 只读检查 bridge surface"

  agent_image_lab_only:
    - "写复查记录到 review_console/phase_i_patch_02_review_record.md"
    - "commit/tag/push Agent Image Lab 变更"
```

## 3. Forbidden Operations

```yaml
forbidden:
  never_write:
    - "不修改 A:/VCP/VCPChat 下的任何文件"
    - "不创建新文件到 VCPChat"
    - "不删除或重命名 VCPChat 文件"

  never_rebuild:
    - "不重建 main.js / main.html / preloads/chat.js"
    - "不重新注册 IPC handlers"
    - "不重新配置 BrowserWindow webPreferences"

  never_expand:
    - "不扩大 IPC channel 列表"
    - "不新增 IPC channel"
    - "不新增执行入口"
    - "不在 preload 中暴露新 API"

  never_touch:
    - "不改动 VCPChat 其他文件（30+ 个 handler、renderer、preload）"
    - "不改动 package.json"
    - "不改动 node_modules"
    - "不 npm install"

  never_execute:
    - "不调用插件/API/DailyNote/VCP memory"
    - "不创建图片"
    - "不执行 submitDraft 真实提交"
    - "不修改 VCPChat git 历史"
```

## 4. Review Checklist（Patch 02 执行时）

```yaml
review_checklist:
  handlers_js:
    - check: "4 个 channel 名称与 IPC 契约一致"
      expected: "imageLabReview.loadSession, .previewDraft, .submitDraft, .cancel"

    - check: "PROTOTYPE_GUARD_KEYS 包含 5 个 flag"
      expected: "api_called, daily_note_called, vcp_plugin_called, disk_write_performed, image_file_created"

    - check: "loadSession handler 校验 session_id/fingerprint"
      expected: "session_fingerprint 不匹配 → reject"

    - check: "previewDraft handler 校验 prototype_guard"
      expected: "任何 guard flag = true → reject"

    - check: "submitDraft handler 不执行真实写入"
      expected: "stored=false, submitted_to_daily_note=false, side_effects_performed=false"

    - check: "所有 error response 不含 raw path/endpoint/stack trace"
      expected: "中文脱敏摘要 only"

  mount_js:
    - check: "mount 通过 IPC 接收 session，不读 localStorage/URL/全局变量"
    - check: "mount 输出草案走 previewDraft，不直接写 DOM 外的存储"
    - check: "mount 不调用 Node API (contextIsolation=true 下已隔离)"
    - check: "mount 不发起外部 HTTP 请求"
    - check: "mount 错误处理不含敏感信息"
```

## 5. Smoke Test Preflight（Patch 02 复查后）

```yaml
smoke_preflight:
  precondition: "VCPChat 运行中 + remote-debug port 9222"
  steps:
    - "CDP Runtime.evaluate: 确认 window.imageLabReview 存在"
    - "CDP Runtime.evaluate: 确认 imageLabReviewMount 存在"
    - "cancel({reason: 'smoke test'}) → accepted_by_handler? side_effects=false?"
    - "loadSession({session_id:'smoke-01',...}) → accepted? guard clean?"
    - "previewDraft({review_session_draft:{}, prototype_guard:{...}}) → accepted? guard clean?"
    - "submitDraft({test:true}) → stored=false? side_effects=false?"
  allowed_calls: 4 (cancel, loadSession, previewDraft, submitDraft)
  forbidden: "任何调用触发插件/API/DailyNote/VCP memory/图片/文件写入"
```

## 6. Deviation Handling

```yaml
deviation_policy:
  no_deviation:
    action: "记录复查通过，Phase I closeout"
    vcpchat_modified: false

  minor_deviation:
    example: "submitDraft 未硬阻断（soft accept）"
    action: "记录偏差，归类为 known-acceptable，不触发写入授权"
    vcpchat_modified: false

  major_deviation:
    example: "handler 缺少 guard 校验"
    action: "停止，报告偏差，**不自动修复**"
    next_step: "进入新的文件级写入授权点（Phase I Patch 03: Exact File Write Authorization）"
    vcpchat_modified: false (until new auth)

  critical_deviation:
    example: "handler 触发真实副作用"
    action: "立即停止，标记 blocked，不继续任何复查"
```

## 7. Patch 02 Execution Flow

```text
用户激活 Patch 01 → 进入 Patch 02
  │
  ├─ 复查 handlers.js (只读)
  │   ├─ 无偏差 → 记录通过
  │   └─ 有偏差 → 按 deviation_policy 处理
  │
  ├─ 复查 mount.js (只读)
  │   ├─ 无偏差 → 记录通过
  │   └─ 有偏差 → 按 deviation_policy 处理
  │
  ├─ Smoke test preflight (如果 VCPChat 可启动)
  │   ├─ 通过 → Phase I closeout
  │   └─ 失败 → 记录原因，不写 VCPChat
  │
  └─ Phase I closeout record
```

## 8. Acceptance

```yaml
patch_01_acceptance:
  plan_01_conclusion_recorded: true
  two_file_scope_defined: true
  allowed_operations_explicit: true
  forbidden_operations_exhaustive: true
  review_checklist_defined: true
  smoke_preflight_defined: true
  deviation_policy_defined: true
  default_no_write: true
  vcpchat_not_modified: true
  activation_required_for_patch_02: true
```
