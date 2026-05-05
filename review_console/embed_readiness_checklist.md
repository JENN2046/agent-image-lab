# Review Console Embed Readiness Checklist

本清单用于未来把 Review Console 嵌入真实 VCPChat 前的人工验收。通过本清单不代表已授权修改 VCPChat，也不代表可以执行插件、调用 API、写 DailyNote 或保存图片。

## Repository Boundary

- [ ] 是否明确本阶段不修改真实 VCPChat。
- [ ] 是否明确本阶段不修改真实 VCPToolBox。
- [ ] 是否没有创建真实 IPC handler。
- [ ] 是否没有新增执行入口。
- [ ] 是否没有读取真实 manifest。

## Electron Boundary

- [ ] 是否要求 `contextIsolation=true`。
- [ ] 是否要求 `nodeIntegration=false`。
- [ ] preload 是否只暴露最小 allowlist API。
- [ ] IPC sender 是否必须校验来源窗口。
- [ ] IPC channel 是否使用固定 allowlist。
- [ ] renderer 是否禁止直接使用 Node `fs`。

## Data Boundary

- [ ] 输入是否只允许受控 `review_session` 草案。
- [ ] 输出是否只允许 `review_session_draft`、`image_case_draft`、`memory_delta_draft`、`asset_index_draft` 和 guard。
- [ ] 是否禁止 URL query/hash/title/localStorage/sessionStorage/clipboard 传递敏感信息。
- [ ] 是否禁止 raw IPC payload 携带 key、token、cookie、密码、私密路径或客户隐私。

## No-execution Boundary

- [ ] renderer 是否禁止调用插件。
- [ ] renderer 是否禁止调用 API。
- [ ] renderer 是否禁止调用 DailyNote。
- [ ] renderer 是否禁止写磁盘。
- [ ] renderer 是否禁止保存图片。
- [ ] 是否保持 `api_called=false`。
- [ ] 是否保持 `vcp_plugin_called=false`。
- [ ] 是否保持 `daily_note_called=false`。
- [ ] 是否保持 `file_write_performed=false`。
- [ ] 是否保持 `image_file_created=false`。

## Review Rules

- [ ] `human_review` 是否覆盖 `ai_review`。
- [ ] `final_review` 是否优先采用 `human_review`。
- [ ] 未人工批准时是否禁止正式 `accepted`。
- [ ] `memory_approval.status != approved` 时是否禁止 DailyNote 写入。
- [ ] `asset_index_draft` 是否只保存引用和验收元数据。
- [ ] 图片二进制是否永不进入 memory_delta、DailyNote 或 VCP 长期记忆。
