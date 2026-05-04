# VCPChat Integration Notes

本文是 Phase 3 的 VCPChat 接入设计草案。它只描述未来如何把 Review Console 静态原型迁移为 VCPChat 子窗口，不修改真实 VCPChat，不创建真实 IPC，不调用 DailyNote，不调用 VCP 插件，不写文件，不保存图片。

## 当前状态

- Phase 2 已完成隔离静态原型：`review_console/static_prototype/`。
- 静态原型只在浏览器内生成 `review_session`、`image_case`、`memory_delta` 草案文本。
- Phase 3 只冻结迁移边界、数据契约、安全规则和验收清单。
- 本阶段不实现 VCPChat 子窗口。

## 未来模块候选

未来如果进入真实 VCPChat 改造，可考虑新增或改造：

```text
VCPChat/ImageLabmodules/review.html
VCPChat/ImageLabmodules/review.js
VCPChat/ImageLabmodules/review.css
VCPChat/modules/ipc/imageLabReviewHandlers.js
```

上述路径只是未来候选，不代表当前仓库已修改或允许修改真实 VCPChat。

## 输入契约草案

未来 VCPChat 子窗口只应接收受控的 `review_session` 草案对象，不从 URL query、localStorage、全局变量或外部 API 拉取敏感数据。

必须包含：

- `session_id`
- `task_id`
- `case_id`
- `image_versions`
- `current_version_id`
- `compare_version_id`
- `ai_review`
- `human_review`
- `final_review`
- `comments`
- `annotation_notes`
- `version_comparison`
- `approval`
- `archive_decision`
- `memory_preview`
- `memory_approval`
- `next_iteration`
- `audit_log`

输入里的图片只允许使用占位引用或受控资产引用，不加载图片二进制，不通过 URL query 传私密路径。

## 输出契约草案

未来子窗口只能返回草案对象，不直接保存：

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

输出必须满足：

- `human_review` 覆盖 `ai_review`。
- `final_review` 优先采用 `human_review`。
- `archive_decision.asset_status=accepted` 必须有人工批准。
- AI 的 `archive_recommendation` 不能替代人工批准。
- `memory_preview` 只是预览，不等于已写入 DailyNote。
- `memory_preview.chinese_diary_content` 必须是中文正文。
- `memory_approval.status != approved` 时不得调用 DailyNote。
- `memory_approval.status = approved` 时必须有 `approved_by` 和 `approved_at`。

## IPC 设计边界

Phase 3 只保留 IPC 名称草案，不实现 handler：

```text
imageLabReview.loadSession
imageLabReview.previewDraft
imageLabReview.submitDraft
imageLabReview.cancel
```

所有 IPC 必须满足：

- 主进程校验 IPC sender。
- renderer 只提交草案，不直接写文件。
- handler 不接收 API key、token、cookie、密码、私密路径或客户隐私原文。
- handler 不触发 VCP 插件执行。
- handler 不直接调用 DailyNote。
- handler 返回错误时只返回脱敏中文摘要。

## Electron 安全边界

未来 VCPChat 子窗口必须遵守：

- `contextIsolation=true`
- `nodeIntegration=false`
- renderer 不使用 Node `fs`。
- renderer 不直接调用 DailyNote。
- renderer 不直接调用 VCP 插件。
- renderer 不写文件，不保存图片。
- renderer 不发起外部 API 请求。
- 不在 URL query、hash 或窗口标题中传 key、token、cookie、私密路径或客户隐私。
- preload 只暴露最小 allowlist API。
- IPC sender 必须校验来源窗口和允许动作。

## 静态原型迁移清单

可复用：

- 页面区域划分。
- 人工评分覆盖 AI 评分的交互。
- 中文评论模型。
- 记忆预览与审批状态展示。
- `FIELD_MAPPING.md` 的字段映射。

必须改写：

- `mock_data.js` 只能作为测试 fixture，不能进入生产输入源。
- `app.js` 的浏览器全局 mock 读取方式必须改成受控 IPC 输入。
- 草案输出 textarea 只能作为调试视图，真实子窗口必须走受控提交动作。

必须保留隔离：

- 不把静态原型当作真实 VCPChat 模块直接复制运行。
- 不把 mock 数据当作真实审片数据。
- 不在 renderer 内接 DailyNote、VCP 插件或文件系统。

## Phase 3 验收标准

- 只修改本项目文档或验收清单。
- 不修改真实 VCPChat。
- 不修改真实 VCPToolBox。
- 不创建真实 IPC handler。
- 不创建插件执行代码。
- 不调用 API。
- 不调用 DailyNote。
- 不调用 VCP 插件。
- 不创建图片文件。
- 不写入密钥、token、cookie、私密路径或客户隐私。
