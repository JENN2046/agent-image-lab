# v1.1 VCPChat Review Console Contract

本文是 v1.1 VCPChat Review Console 子窗口接入契约草案。它只属于 Agent Image Lab 仓库内规划，不修改真实 VCPChat，不创建真实 IPC handler，不调用 DailyNote，不调用 VCP 插件，不调用 API，不写文件，不创建图片。

## Candidate Window

未来候选窗口仍沿用既有规划名称：

```text
VCPChat/ImageLabmodules/review.html
VCPChat/ImageLabmodules/review.js
VCPChat/ImageLabmodules/review.css
VCPChat/modules/ipc/imageLabReviewHandlers.js
```

这些路径只是未来候选，不是本阶段允许修改的真实路径。

## IPC Draft

```yaml
ipc_channels:
  - imageLabReview.loadSession
  - imageLabReview.previewDraft
  - imageLabReview.submitDraft
  - imageLabReview.cancel
```

输入只允许受控 `review_session` 草案对象。输出只允许：

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

## Electron Boundary

- `contextIsolation=true`
- `nodeIntegration=false`
- preload 只暴露最小 allowlist API。
- IPC sender 必须校验来源窗口和允许动作。
- renderer 不直接使用 Node `fs`。
- renderer 不直接调用 DailyNote、VCP 插件或外部 API。
- renderer 不写磁盘，不保存图片。
- 不在 URL query、hash、窗口标题或 localStorage 中传 key、token、cookie、私密路径或客户隐私。

## Draft Rules

- `human_review` 覆盖 `ai_review`。
- `final_review` 优先采用 `human_review`。
- 没有人工批准时不得产生正式 `accepted`。
- `memory_approval.status != approved` 时，`memory_delta.write_mode=draft`。
- `memory_preview.chinese_diary_content` 必须是中文正文。
- AI 的 `archive_recommendation` 不能替代人工批准。

## Acceptance

- 本仓库只能新增规划、契约、样例和无外部副作用原型。
- 不修改真实 VCPChat / VCPToolBox。
- 不创建真实 IPC handler。
- 不引入真实执行按钮。
- 不调用 DailyNote、API 或 VCP 插件。

