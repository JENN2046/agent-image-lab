# Review Console Runtime Prototype

本目录是 v1.2 可嵌入式 Review Console runtime prototype。它用于模拟未来 VCPChat 子窗口的输入输出，但仍然完全隔离。

## Boundary

- 不接真实 VCPChat。
- 不接真实 VCPToolBox。
- 不调用 VCP 插件。
- 不调用 API。
- 不调用 DailyNote。
- 不写磁盘。
- 不保存图片。
- 不读取真实 manifest。
- 不读取密钥、token、cookie、密码、私密路径或客户隐私。

## Runtime Shape

`runtime_guard.js` 提供 renderer 与 host mock 共用的 no-execution guard、session normalize 和草案安全校验。`host_bridge_mock.js` 模拟未来 preload 暴露的最小 bridge。页面只在浏览器内读取 mock session，并输出：

```yaml
review_session_draft: map
image_case_draft: map
memory_delta_draft: map
prototype_guard:
  api_called: false
  daily_note_called: false
  vcp_plugin_called: false
  disk_write_performed: false
  image_file_created: false
host_submit_ack:
  accepted_by_host_mock: true
  validation_passed: true
  side_effects_performed: false
```

`FIELD_MAPPING.md` 记录 runtime 输出到 `review_session`、`image_case` 和 `memory_delta` schema 的映射关系。`tests/schema_examples/v1_2_runtime_prototype_output.example.yaml` 是验收用的无外部副作用草案样例。

## First Runtime Patch

v3.7 为 runtime prototype 增加了项目内 host bridge 草案提交回执：

- renderer 在每次草案重算后先校验 `prototype_guard`。
- host mock 再次校验草案结构、人工 accepted 条件和 memory write 条件。
- UI 展示 host ack 和提交时间。
- host mock 永远保持 `side_effects_performed=false`，不写磁盘、不调用外部系统。

## Runtime Guard Extraction

v3.9 将 renderer 与 host mock 的重复 guard 规则收束到 `runtime_guard.js`：

- `app.js` 在提交草案前调用同一套 `assertDraftSafe()`。
- `host_bridge_mock.js` 在接收草案后调用同一套 `draftIsSafe()`。
- smoke test 加载同一模块，并验证顶层 guard 和 audit guard 被污染时都会被拒绝。
- 该模块仍只在项目内浏览器原型中运行，不创建 IPC、插件调用、API 调用、DailyNote 写入或文件写入。

## Validation

```powershell
node --check review_console\runtime_prototype\runtime_guard.js
node --check review_console\runtime_prototype\host_bridge_mock.js
node --check review_console\runtime_prototype\app.js
node scripts\validate_runtime_prototype_smoke.js
```

人工验收时还应确认：

- 页面输出包含 `review_session_draft`、`image_case_draft`、`memory_delta_draft` 和 `prototype_guard`。
- 页面展示 host ack，且 ack 保持 `accepted_by_host_mock=true`、`side_effects_performed=false`。
- `human_review` 覆盖 `ai_review`，`final_review.source=human_review`。
- 未勾选人工批准时，`image_case_draft.asset_status` 不得为 `accepted`。
- `memory_delta_draft.chinese_diary_content` 为中文。
- 未批准记忆时，`memory_delta_draft.write_mode=draft` 且 `final_decision.should_write_to_vcp=false`。
- 即使记忆被 approved，也只表示写入申请被批准，不代表 DailyNote 已执行。
