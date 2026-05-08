# Phase E 安全验收清单

本文是 Phase E 的第三项交付物：VCPChat Review Console 子窗口接入前的安全验收清单。它覆盖 Electron 安全基线、IPC 安全、输入输出校验和禁止输出。本阶段不修改真实 VCPChat，不创建真实 IPC handler。

本文继承 `review_console/embed_readiness_checklist.md` 的安全条目并扩展为 Phase E 专用验收清单。

```yaml
phase_e_security_checklist:
  status: completed_local_security_checklist
  phase: "Phase E — security acceptance checklist"
  previous: "review_console/embed_readiness_checklist.md"
  real_vcpchat_modified: false
  real_ipc_handler_created: false
```

## 1. Electron 安全基线

- [ ] `contextIsolation=true` — renderer 无法访问 Node API
- [ ] `nodeIntegration=false` — renderer 不加载 Node 模块
- [ ] `sandbox=true` — renderer 在独立 sandbox 中运行
- [ ] preload 脚本只暴露最小 allowlist API（loadSession, previewDraft, cancel）
- [ ] preload 不暴露 `fs`、`child_process`、`fetch`、`XMLHttpRequest`
- [ ] preload 不暴露 `localStorage`、`sessionStorage` 的审片数据写入路径
- [ ] `webSecurity=true`（默认）— 不绕过同源策略
- [ ] 不设置 `--ignore-certificate-errors` 等不安全 flag
- [ ] `BrowserWindow` 不加载外部 URL（`file://` 或 `about:blank` 起步）
- [ ] 窗口标题不含 key/token/cookie/私密路径/客户隐私

## 2. IPC 安全

- [ ] 每个 IPC handler 校验 `event.senderFrame` 来源
- [ ] `imageLabReview.submitDraft` 在 Phase E/F 中永久返回 rejected
- [ ] IPC channel 不在 preload 之外暴露
- [ ] IPC handler 不执行 `eval()` 或 `Function()` 构造
- [ ] IPC handler 不把 renderer 传来的数据当代码执行
- [ ] `previewDraft` handler 在保存任何状态前先校验 prototype_guard
- [ ] 脏 guard 的草案被拒绝后不得部分执行
- [ ] IPC message 大小上限为 1MB

## 3. 输入校验

- [ ] `loadSession` payload 必须是合法 `review_session` 草案对象
- [ ] session 必须带有效 `session_fingerprint`
- [ ] fingerprint 不匹配时拒绝加载
- [ ] payload 不包含图片二进制
- [ ] payload 不包含 raw plugin output
- [ ] payload 不包含 raw endpoint / runtime log / source code
- [ ] 输入来自 IPC channel，不来自 URL query / hash / localStorage / 全局变量

## 4. 输出校验

- [ ] `previewDraft` 的 prototype_guard 五个 flag 全部为 false
- [ ] 输出不包含 raw path / endpoint / websocket URL
- [ ] 输出不包含 raw IPC payload / raw runtime log
- [ ] 输出不包含 raw plugin output / raw source code
- [ ] 输出不包含 secret / token / cookie / password
- [ ] 输出不包含 customer_private_data
- [ ] 输出不包含 image_binary
- [ ] `human_review` 覆盖 `ai_review`
- [ ] `final_review` 优先采用 `human_review`
- [ ] 未人工批准时 `asset_status` 不为 `accepted`
- [ ] `memory_delta.chinese_diary_content` 必须是中文
- [ ] `memory_approval.status != approved` 时 `write_mode=draft`
- [ ] `memory_approval.status = approved` 时有 `approved_by` 和 `approved_at`

## 5. Renderer 隔离

- [ ] renderer 不直接调用 `require('fs')`
- [ ] renderer 不直接调用 `require('child_process')`
- [ ] renderer 不直接调用 `fetch()` 或 `XMLHttpRequest`
- [ ] renderer 不直接写 DailyNote
- [ ] renderer 不直接调用 VCP 插件
- [ ] renderer 不写磁盘文件
- [ ] renderer 不保存图片
- [ ] renderer 不访问 `process` 全局对象（contextIsolation=true 时应不可达）
- [ ] renderer 的所有外部通信仅通过 preload allowlist API

## 6. 数据流安全

- [ ] 审片数据在子窗口关闭后不持久化（不做 localStorage/sessionStorage 写入）
- [ ] 不创建隐藏的开发工具或调试后门
- [ ] 不在 console.log 中输出 session 完整对象
- [ ] 不在错误消息中泄露 file path / endpoint / stack trace 原文
- [ ] 所有错误消息使用中文脱敏摘要
- [ ] `memory_delta` 草案仅作为 IPC 消息传递，不在 renderer 端写入

## 7. 提交门 (submitDraft)

- [ ] `submitDraft` 在 preload allowlist 中不暴露
- [ ] IPC handler 默认返回 `ERR_SUBMITDRAFT_BLOCKED`
- [ ] 仅在 A5 active authorization package + preflight 通过后打开
- [ ] 打开时 `max_submitDraft_calls=1`
- [ ] 执行一次后 authorization package 即被消耗
- [ ] `submitDraft` 执行不把图片二进制写入 Git 或 VCP memory
- [ ] `submitDraft` 执行不绕过 memory_delta 审批

## 8. 禁止输出总清单

以下内容不得出现在任何 IPC 消息、错误响应、日志输出、窗口标题或 URL 中：

```yaml
forbidden_outputs:
  - raw_local_path
  - raw_endpoint
  - raw_websocket_url
  - raw_runtime_log
  - raw_ipc_payload
  - raw_plugin_output
  - raw_request_body
  - raw_response_body
  - raw_source_code
  - raw_prompt_text
  - secret
  - token
  - cookie
  - password
  - customer_private_data
  - image_binary_in_ipc_or_memory
  - plugin_dir_config_values
  - stack_trace_with_paths
```

## 验收决策表

| 检查域 | 条目数 | 验收条件 | Phase E 状态 |
| --- | --- | --- | --- |
| Electron 安全基线 | 10 | 全部通过 | 已定义，待 Phase F 实施 |
| IPC 安全 | 9 | 全部通过 | 已定义，待 Phase F 实施 |
| 输入校验 | 7 | 全部通过 | 已定义（runtime_guard.js 已覆盖大部分） |
| 输出校验 | 13 | 全部通过 | 已定义（runtime_guard.js 已覆盖大部分） |
| Renderer 隔离 | 9 | 全部通过 | 已定义，待 Phase F 实施 |
| 数据流安全 | 6 | 全部通过 | 已定义 |
| 提交门 | 7 | 全部通过 | submitDraft 已在本仓库永久禁止 |
| 禁止输出 | 16 | 全部通过 | 已定义 |

**总计**: 77 项检查，全部已在本 Phase E 契约层定义。Phase F 实施时逐项验证。

## 验收标准（本 Phase E）

```yaml
phase_e_checklist_acceptance:
  all_eight_domains_covered: true
  total_checks: 77
  electron_baseline_defined: true
  ipc_security_defined: true
  input_validation_defined: true
  output_validation_defined: true
  renderer_isolation_defined: true
  dataflow_security_defined: true
  submitDraft_gate_defined: true
  forbidden_outputs_listed: true
  references_existing_contracts: true
  no_real_vcpchat_modified: true
  no_real_ipc_handler_created: true
```
