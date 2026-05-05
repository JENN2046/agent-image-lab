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

`host_bridge_mock.js` 模拟未来 preload 暴露的最小 bridge。页面只在浏览器内读取 mock session，并输出：

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
```

`FIELD_MAPPING.md` 记录 runtime 输出到 `review_session`、`image_case` 和 `memory_delta` schema 的映射关系。`tests/schema_examples/v1_2_runtime_prototype_output.example.yaml` 是验收用的无外部副作用草案样例。

## Validation

```powershell
node --check review_console\runtime_prototype\host_bridge_mock.js
node --check review_console\runtime_prototype\app.js
```

人工验收时还应确认：

- 页面输出包含 `review_session_draft`、`image_case_draft`、`memory_delta_draft` 和 `prototype_guard`。
- `human_review` 覆盖 `ai_review`，`final_review.source=human_review`。
- 未勾选人工批准时，`image_case_draft.asset_status` 不得为 `accepted`。
- `memory_delta_draft.chinese_diary_content` 为中文。
- 未批准记忆时，`memory_delta_draft.write_mode=draft` 且 `final_decision.should_write_to_vcp=false`。
- 即使记忆被 approved，也只表示写入申请被批准，不代表 DailyNote 已执行。
