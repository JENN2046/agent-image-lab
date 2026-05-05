# 80 v2.1 VCPChat Embed Preflight

本文定义 Agent Image Lab v2.1 第一阶段的 VCPChat 嵌入前置契约。该阶段只在本仓库内补齐规划、契约、样例和验收清单，不读取真实 VCPChat 或 VCPToolBox 源码，不创建真实 Electron IPC handler，不调用插件、API、DailyNote，不写文件，不创建图片。

## Preflight Decision

```yaml
v2_1_vcpchat_embed_preflight:
  status: contract_ready_no_execution
  can_modify_real_vcpchat: false
  can_read_real_vcpchat_source: false
  can_read_real_vcptoolbox_source: false
  can_create_real_ipc_handler: false
  can_create_preload_runtime_code: false
  can_call_api: false
  can_call_vcp_plugin: false
  can_call_daily_note: false
  can_write_disk_asset: false
  can_create_image_file: false
```

## Goal

v2.1 的目标是把 Review Console runtime prototype 的输入输出边界收束为未来 VCPChat 子窗口可审查的嵌入契约。

本阶段只回答这些问题：

- 未来 VCPChat 子窗口允许接收什么输入。
- 未来 VCPChat 子窗口允许返回什么草案。
- Electron 安全边界必须满足哪些条件。
- 哪些传输位置不得承载敏感信息。
- 进入真实 VCPChat 修改前必须经过哪些授权门槛。

## Non-goals

本阶段不做以下事项：

- 不修改真实 VCPChat。
- 不读取真实 VCPChat 源码。
- 不修改真实 VCPToolBox。
- 不创建真实 IPC handler。
- 不创建 preload 可执行代码。
- 不调用 DailyNote、VCP 插件或外部 API。
- 不读取真实 manifest。
- 不保存图片二进制或生成图片文件。
- 不写入 release 包、tag 或 GitHub Release。

## Fixed IPC Draft

未来候选 IPC channel 仍沿用既有设计：

```yaml
ipc_channels:
  - imageLabReview.loadSession
  - imageLabReview.previewDraft
  - imageLabReview.submitDraft
  - imageLabReview.cancel
```

这些 channel 在 v2.1 仍只是契约名，不代表已经创建真实 handler。

## Input Contract

允许输入仅限受控 `review_session` 草案：

```yaml
allowed_input:
  review_session_draft:
    required: true
    source: controlled_host_payload
    contains_secret: false
    contains_private_path: false
    contains_customer_private_data: false
```

输入不得包含 key、token、cookie、密码、私密路径、客户隐私、endpoint 原文、raw 插件输出、图片二进制或未脱敏运行日志。

## Output Contract

允许输出仅限草案对象：

```yaml
allowed_output:
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

输出不得代表真实 DailyNote 写入、真实插件执行、真实图片创建或真实资产落盘。

## Electron Security Boundary

未来真实接入前，VCPChat 容器必须满足：

- `contextIsolation=true`
- `nodeIntegration=false`
- preload 只暴露最小 allowlist API。
- IPC sender 必须校验来源窗口。
- IPC channel 必须使用固定 allowlist。
- IPC payload 必须经过 schema 校验。
- renderer 不得直接使用 Node `fs`。
- renderer 不得直接调用 DailyNote。
- renderer 不得直接调用 VCP 插件。
- renderer 不得直接调用外部 API。
- renderer 不得写磁盘。
- renderer 不得保存图片。

## Forbidden Transport

不得通过以下位置传递 key、token、cookie、密码、私密路径、客户隐私、客户未公开信息、endpoint 原文或 raw 插件输出：

- URL query。
- URL hash。
- window title。
- localStorage。
- sessionStorage。
- clipboard。
- renderer console log。
- raw IPC payload。
- crash report。
- runtime log 原文。

## Review Rules

- `human_review` 覆盖 `ai_review`。
- `final_review` 必须优先采用 `human_review`。
- 没有人工批准时不得产生正式 `accepted`。
- AI 的 `archive_recommendation` 不能替代人工批准。
- `memory_preview.chinese_diary_content` 必须是中文正文。
- `memory_preview` 只代表预览，不代表已写入 DailyNote。
- `memory_approval.status != approved` 时，`memory_delta.write_mode=draft`。
- `memory_approval.status=approved` 也只代表写入申请进入后续受控流程，不代表 DailyNote 已写。

## Future Authorization Gate

进入真实 VCPChat 修改前，必须另行授权并列出：

- 允许读取的真实 VCPChat 文件范围。
- 允许修改的真实 VCPChat 文件范围。
- 允许新增的 IPC handler 名称。
- 允许新增的 preload API allowlist。
- 禁止读取和禁止摘录的敏感字段。
- 回滚方案。
- 验收命令。
- 审查人和批准人。

未完成上述授权前，v2.1 只能停留在 contract / preflight 状态。

## Acceptance

- v2.1 文档存在。
- embed contract 存在。
- v2.1 schema example 存在。
- validation checklist 包含 v2.1 检查项。
- 不修改真实 VCPChat / VCPToolBox。
- 不读取真实 VCPChat / VCPToolBox。
- 不创建真实 IPC handler 或 preload 执行代码。
- 不调用插件、API 或 DailyNote。
- 不写文件资产，不创建图片文件。
- 样例中的审计摘要和记忆说明为中文脱敏内容。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_1_patch_02_real_vcpchat_source_read_plan
  authorization_required: true
  allowed_after_authorization:
    - plan real VCPChat source read scope
    - define allowed file list
    - define forbidden sensitive fields
  forbidden_without_authorization:
    - read real VCPChat source
    - modify real VCPChat
    - create IPC handler
    - call plugin
    - call API
    - call DailyNote
```
