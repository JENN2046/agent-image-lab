# v10.8 Positive Still-life Short Approval Template

本文把 `a5_positive_still_life_prompt_v1` 的下一次单张真实生成授权压缩成短批准模板。

目标是让用户以后不必反复粘贴整段授权字段；但它不降低安全边界，不保存真实本机路径，不保存 secret，不允许自动读取 VCPChat / VCPToolBox，不允许写 DailyNote / VCP memory，不允许 submitDraft，不允许 commit/tag/push/PR/release。

## Template State

```yaml
short_approval_template:
  template_id: v10_8_positive_still_life_single_generation
  template_only: true
  template_active_without_user_approval: false
  bare_approval_allowed_only_when_this_is_the_current_presented_capsule: true
  private_plugin_dir_binding_required: true
  private_binding_must_be_ignored_by_git: true
  private_binding_ref: .agent_private/doubaogen_plugin_dir.txt
```

## Short Approval Phrase

当且仅当 Codex 在同一轮或紧邻上下文中明确展示本模板为当前待批准模板时，用户可以用以下短句批准：

```text
批准 v10.8 静物单次生成
```

如果上下文里只有一个待批准 A5 capsule，用户说：

```text
批准
```

也可以视为批准当前展示的 template capsule，但 Codex 仍必须先检查：

- 当前待批准 template id 是 `v10_8_positive_still_life_single_generation`。
- `.agent_private/doubaogen_plugin_dir.txt` 已存在且被 Git 忽略。
- 私有绑定解析出的目录中存在 `DoubaoGen.js`。
- 只读取 `DoubaoGen.js` 和执行所需 `config.env`。
- 不记录 raw path、secret、endpoint 或 runtime log。
- 输出目录不存在或为空。

如果任一检查失败，短批准不执行真实生成，只能返回阻断原因。

## Bound Authorization Fields

短批准绑定以下固定字段：

```yaml
bound_authorization:
  prompt_approved: true
  prompt_id: a5_positive_still_life_prompt_v1
  prompt_source_record: docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md
  prompt_must_not_be_auto_edited: true
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls: 1
  input_reference: "docs/207 prompt_lock.prompt_cn exactly"
  output_directory_ref: runs/a5_positive_still_life_prompt_v1
  overwrite_existing_files_allowed: false
  output_directory_must_be_empty_or_new: true
  rollback_plan: "如果生成失败或资产被拒收，只记录脱敏失败结果和 rejected review，不写 DailyNote/VCP memory，不覆盖输出目录，不重试第二次，不 push/tag/PR/release。"
  gatekeeper_approved: true
  review_console_human_approved: true
  daily_note_direct_write_allowed: false
  memory_delta_only: true
```

## Private Binding Setup

真实插件路径不写入 Git。首次使用前，用户需要在本机创建 ignored 文件：

```text
.agent_private/doubaogen_plugin_dir.txt
```

文件内容为 `DoubaoGen.js` 所在目录的真实本机路径。该文件必须保持 ignored，不得提交，不得复制到 `.agent_board`、docs、memory、DailyNote 或日志。

Codex 可在用户明确提供真实路径时帮助写入该 ignored 文件；没有明确真实路径时，不得猜测、搜索外部 VCPToolBox、读取真实 manifest 或读取 config/env。

## Stop Conditions

```yaml
stop_conditions:
  current_capsule_not_this_template: true
  private_plugin_dir_binding_missing: true
  private_binding_not_ignored_by_git: true
  plugin_dir_missing: true
  doubaogen_js_missing: true
  config_env_missing_or_unreadable: true
  output_directory_collision: true
  prompt_text_would_change: true
  max_plugin_calls_not_one: true
  overwrite_requested: true
  raw_path_or_secret_would_be_recorded: true
  submitDraft_requested: true
  memory_write_requested_before_accepted_asset: true
  remote_write_requested: true
```

## Boundary

```yaml
template_boundary:
  plugin_called_by_template_creation: false
  api_called_by_template_creation: false
  image_created_by_template_creation: false
  daily_note_called: false
  vcp_memory_written: false
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  real_manifest_read: false
  raw_plugin_dir_saved_in_git: false
  commit_authorized_by_template: false
  tag_push_pr_release_authorized_by_template: false
```

## Result Meaning

本模板让未来的授权口令变短；它本身不激活 A5。真实生成仍必须由用户短句批准当前 capsule，并通过私有路径绑定、输出目录、secret、防覆盖和 no-external-write preflight。
