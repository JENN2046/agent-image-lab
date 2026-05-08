# Phase I Plan 01 VCPChat Embed v2 授权前复查

只读确认当前 Agent Image Lab 里已有的 bridge contract、runtime handoff、smoke 记录。列出需要修改 VCPChat 的精确文件。不修改 VCPChat。

```yaml
phase_i_plan_01:
  status: completed_readonly_audit
  timestamp: "2026-05-08"
  phase: "Phase I Plan 01 — VCPChat Embed v2 pre-authorization audit"
  real_execution: false
  vcpchat_modified: false
  vcpchat_files_read: true (read-only structure check)
```

## 1. 已有证据链

| # | 证据 | 位置 | 内容 |
| --- | --- | --- | --- |
| 1 | IPC 契约草案 | `review_console/phase_e_ipc_contract_draft.md` | 4 通道定义、消息 schema、sender 校验、preload allowlist |
| 2 | 安全验收清单 | `review_console/phase_e_security_acceptance_checklist.md` | 77 项检查，8 个安全域 |
| 3 | 子窗口接入任务书 | `review_console/phase_e_vcpchat_subwindow_integration_task_plan.md` | 迁移路径、技术约束、复用清单 |
| 4 | F2 Bridge Smoke | `review_console/phase_f_f2_bridge_smoke_record.md` | VCPChat v4.4.2 实测：4 通道验证，0 side effects |
| 5 | v1.1 VCPChat Contract | `review_console/v1_1_vcpchat_review_console_contract.md` | 原始 IPC draft、Electron boundary |
| 6 | v1.6 Embed Boundary | `review_console/v1_6_embed_boundary_contract.md` | 嵌入边界契约 |
| 7 | Embed Readiness Checklist | `review_console/embed_readiness_checklist.md` | 嵌入就绪检查清单 |
| 8 | Runtime Prototype | `review_console/runtime_prototype/` | 完整的 runtime prototype 源码（app.js, runtime_guard.js, host_bridge_mock.js, index.html, styles.css） |

## 2. VCPChat 目标文件

### 2.1 需要修改的文件

| # | 文件 | 当前状态 | 需要做什么 |
| --- | --- | --- | --- |
| 1 | `main.js` | 现有 VCPChat 入口 | 注册 imageLabReview IPC handlers；配置 BrowserWindow webPreferences |
| 2 | `modules/ipc/imageLabReviewHandlers.js` | **已存在**（v10.2 创建） | 复查 handler 逻辑，确认 guard 校验和 submitDraft 阻塞 |
| 3 | `preloads/chat.js` | 现有 preload | 在 contextBridge 中暴露 imageLabReview API（loadSession, previewDraft, cancel） |
| 4 | `main.html` | 现有主窗口 HTML | 加载 imageLabReviewMount 脚本；添加 review mount DOM |
| 5 | `modules/renderer/imageLabReviewMount.js` | **已存在**（v10.2 创建） | 复查 mount 逻辑，确保 contextIsolation 下正确工作 |

### 2.2 不需要修改的文件

```yaml
not_modified:
  - "preloads/desktop.js"
  - "preloads/utility.js"
  - "modules/ipc/ipcContracts.js"
  - "modules/ipc/*Handlers.js (其他 handler 文件)"
  - "modules/renderer/*.js (其他 renderer 文件)"
  - "package.json"
  - "node_modules/"
```

### 2.3 文件当前内容确认

```yaml
imageLabReviewHandlers.js:
  path: "A:/VCP/VCPChat/modules/ipc/imageLabReviewHandlers.js"
  status: "exists (v10.2 created)"
  channels: ["imageLabReview.loadSession", "imageLabReview.previewDraft", "imageLabReview.submitDraft", "imageLabReview.cancel"]
  guard_keys: ["api_called", "daily_note_called", "vcp_plugin_called", "disk_write_performed", "image_file_created"]

imageLabReviewMount.js:
  path: "A:/VCP/VCPChat/modules/renderer/imageLabReviewMount.js"
  status: "exists (v10.2 created)"
  note: "no-write mount，F2 bridge smoke 验证通过"

main.html (line 614):
  status: "✅ 已有 mount DOM"
  code: '<div id="imageLabReviewMount" hidden data-runtime-status="idle"></div>'

main.html (line 1978):
  status: "✅ 已有 script 引用"
  code: '<script type="module" src="modules/renderer/imageLabReviewMount.js"></script>'

main.js (line 35):
  status: "✅ 已导入 handlers"
  code: "const imageLabReviewHandlers = require('./modules/ipc/imageLabReviewHandlers');"

main.js (line 1040):
  status: "✅ 已初始化 handlers"
  code: "imageLabReviewHandlers.initialize(mainWindow);"

preloads/chat.js (lines 101-106):
  status: "✅ 已暴露 imageLabReview API"
  channels_exposed: [loadSession, previewDraft, submitDraft, cancel]
  via: "contextBridge.exposeInMainWorld"

preloads/chat.js (line 604):
  status: "✅ 已调用 exposeImageLabReviewApi(ops)"
```

### 2.4 发现结论

**VCPChat embed v2 基础设施在 v10.2 已全部落位！**

- 5 个目标文件全部已有 imageLabReview 引用
- IPC handlers 已注册并初始化
- Preload allowlist 已暴露 4 个通道
- Mount DOM + script 已在 main.html
- F2 bridge smoke 已验证 4 通道全部可用

Phase I 的核心工作从"创建"变为**"复查 + 可选加固"**：
1. 复查 submitDraft 阻塞行为（F2 发现是 soft-accept）
2. 复查 cancel 的 payload 格式校验
3. 可选：将 mount 从 hidden 改为条件可见

## 3. Allowed vs Forbidden（Patch 01 授权包预填）

```yaml
allowed:
  write_scope:
    - "A:/VCP/VCPChat/modules/ipc/imageLabReviewHandlers.js (REVIEW only — submitDraft/cancel hardening if needed)"
    - "A:/VCP/VCPChat/modules/renderer/imageLabReviewMount.js (REVIEW only — mount visibility if needed)"
    - "A:/VCP/VCPChat/main.js (NO CHANGE — handlers already imported + initialized)"
    - "A:/VCP/VCPChat/main.html (NO CHANGE — mount DOM + script already present)"
    - "A:/VCP/VCPChat/preloads/chat.js (NO CHANGE — imageLabReview API already exposed)"

  commands:
    - "node --check (syntax check)"
    - "git diff --check"
    - "git add <allowed files>"
    - "git commit"
    - "git push origin <feature-branch>"
    - "创建 PR"

forbidden:
  - "修改 allowed 列表外的任何文件"
  - "npm install / 依赖变更"
  - "修改 package.json"
  - "修改其他 IPC handler"
  - "修改其他 preload"
  - "修改 nodeIntegration / contextIsolation 设置（只能追加 webPreferences）"
  - "删除或重命名现有文件"
  - "git push origin master (只能 push feature branch)"
  - "merge PR 到 master (需 review)"
```

## 4. Rollback Plan（Patch 01 授权包预填）

```yaml
rollback:
  trigger:
    - "VCPChat 启动失败"
    - "Bridge smoke 失败"
    - "IPC handler 报错"
    - "renderer console error"
  actions:
    - "git checkout <feature-branch> 的原始状态"
    - "或 git revert 最后一个 commit"
    - "重启 VCPChat --remote-debugging-port=9222"
    - "重新运行 bridge smoke"
  auto_rollback: false
  requires: "手动确认回滚"
```

## 5. Validation Commands（Patch 01 授权包预填）

```yaml
validation:
  pre_modification:
    - "cd A:/VCP/VCPChat && git status --short --branch"
    - "cd A:/VCP/VCPChat && git diff --check"
    - "node --check main.js"
    - "node --check modules/ipc/imageLabReviewHandlers.js"
    - "node --check preloads/chat.js"
    - "node --check modules/renderer/imageLabReviewMount.js"

  post_modification:
    - "cd A:/VCP/VCPChat && node --check <modified files>"
    - "cd A:/agent-image-lab/agent-image-lab-v0.2 && node scripts/validate_agent_board_state.js"
    - "Launch VCPChat --remote-debugging-port=9222"
    - "F2 bridge smoke: cancel → loadSession → previewDraft → submitDraft(blocked)"
    - "Verify prototype_guard 5 flags all false"
```

## 6. Plan 01 Acceptance

```yaml
plan_01_acceptance:
  evidence_chain_compiled: true
  vcpchat_target_files_listed: true
  current_file_status_checked: true
  key_discovery: "ALL 5 VCPChat files already wired in v10.2 — no CREATE needed, REVIEW only"
  allowed_forbidden_scope_prefilled: true
  scope_reduced: "write_scope reduced from 5 files to 2 (review-only on handlers.js + mount.js)"
  rollback_plan_prefilled: true
  validation_commands_defined: true
  vcpchat_not_modified: true
  ready_for_patch_01: true
```

## 7. Next: Patch 01

Patch 01 = 正式 A5 授权包。将 Plan 01 中的 allowed/forbidden/rollback/validation 填入 `docs/231` template 格式，等待用户激活。激活后进入 Patch 02 实施。
