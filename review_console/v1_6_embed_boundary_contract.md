# v1.6 Review Console Embed Boundary Contract

本文定义 Review Console 从 runtime prototype 进入未来 VCPChat 可嵌入形态之前的安全边界。v1.6 只写 contract，不修改真实 VCPChat，不创建真实 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Embed Goal

未来 Review Console 子窗口应只接收受控 `review_session` 草案，并只输出以下草案：

```yaml
review_session_draft: map
image_case_draft: map
memory_delta_draft: map
asset_index_draft: map
prototype_guard: map
```

## Required Electron Boundary

- `contextIsolation=true`
- `nodeIntegration=false`
- preload 只暴露最小 allowlist API。
- IPC sender 必须校验来源窗口。
- IPC channel 必须使用固定 allowlist。
- renderer 不直接使用 Node `fs`。
- renderer 不直接调用 DailyNote。
- renderer 不直接调用插件。
- renderer 不直接调用外部 API。
- renderer 不写磁盘。
- renderer 不保存图片。

## Allowed IPC Draft

候选 channel 仍沿用既有命名：

```yaml
ipc_channels:
  - imageLabReview.loadSession
  - imageLabReview.previewDraft
  - imageLabReview.submitDraft
  - imageLabReview.cancel
```

这些只是 contract，不代表已经创建真实 handler。

## Forbidden Transport

不得通过以下位置传递 key、token、cookie、密码、私密路径、客户隐私或客户未公开信息：

- URL query。
- URL hash。
- window title。
- localStorage。
- sessionStorage。
- clipboard。
- renderer console log。
- raw IPC payload。

## Draft Boundary

- `memory_preview.chinese_diary_content` 必须为中文正文。
- `memory_approval.status != approved` 时不得写 DailyNote。
- `asset_status=accepted` 必须有人工作为批准来源。
- `asset_index_draft` 只能保存资产引用和元数据，不保存图片二进制。
- `prototype_guard` 必须保持无插件、无 API、无 DailyNote、无文件写入、无图片创建。

## Acceptance

- 本阶段不修改真实 VCPChat。
- 本阶段不修改真实 VCPToolBox。
- 本阶段不创建真实 IPC handler。
- 本阶段不新增执行入口。
- 本阶段不读取真实 manifest。
- 本阶段不保存图片二进制或 raw 插件输出。
