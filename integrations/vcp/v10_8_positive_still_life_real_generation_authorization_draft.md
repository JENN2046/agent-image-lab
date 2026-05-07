# v10.8 Positive Still-life Real Generation Authorization Draft

本文是 `a5_positive_still_life_prompt_v1` 下一次真实生成前的未激活授权草案。

它不是执行授权，不允许调用插件，不允许调用 API，不允许写 DailyNote，不允许写 VCP memory，不允许创建图片，不允许 submitDraft，不允许 commit/tag/push/PR/release。

只有当用户用明确语言批准本草案中的 prompt 和所有真实生成字段后，才允许进入新的 A5 preflight；preflight 通过也不自动越过任何输出目录、审片、记忆写入或版本动作边界。

## Current Draft State

```yaml
authorization_draft:
  draft_id: v10_8_positive_still_life_single_generation_authorization_draft
  draft_only: true
  package_active: false
  real_generation_authorization_present: false
  prompt_approved: false
  next_real_generation_allowed_by_this_draft: false
  source_preflight_gate: docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md
  prompt_source_record: docs/206_v10_7_a5_safer_prompt_review_package.md
```

## Locked Prompt

```yaml
prompt_lock:
  prompt_id: a5_positive_still_life_prompt_v1
  prompt_must_match_source_record: true
  prompt_must_not_be_auto_edited: true
  prompt_cn: "明亮摄影棚桌面静物摄影。画面中心是一枚无标识相机镜头，周围摆放柔光灯板、空白色块卡、纯色亚克力几何片和干净浅灰桌面。所有物体表面保持空白、干净、无标记。真实产品摄影，高级柔光，简洁构图，留出干净背景。"
```

## Required User Authorization Fields

下面字段必须由用户明确批准。占位符、默认值、计划、草案、继续、开工、可以、去吧，都不构成真实生成授权。

```yaml
required_user_authorization:
  prompt_approved: "<required true>"
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls: 1
  input_reference: "prompt_lock.prompt_cn exactly"
  output_directory_ref: runs/a5_positive_still_life_prompt_v1
  overwrite_existing_files_allowed: false
  output_directory_must_be_empty_or_new: true
  rollback_plan: "<required human-readable rollback plan>"
  gatekeeper_approved: true
  review_console_human_approved: true
  daily_note_direct_write_allowed: false
  memory_delta_only: true
```

## Forbidden Unless Separately Authorized

```yaml
forbidden_without_separate_authorization:
  change_prompt_text: true
  change_plugin_id: true
  change_plugin_model: true
  increase_max_plugin_calls: true
  overwrite_existing_output: true
  submitDraft_call: true
  daily_note_direct_write: true
  vcp_memory_write: true
  asset_archive_promotion: true
  commit: true
  tag: true
  push: true
  pr: true
  github_release: true
  read_real_vcpchat_source: true
  read_real_vcptoolbox_source: true
  read_real_manifest: true
  record_raw_secret_or_endpoint: true
```

## Minimum Approval Text

如果用户决定真的执行下一次单张生成，最小授权语句应同时包含这些事实：

```text
我批准 prompt_id=a5_positive_still_life_prompt_v1，prompt 内容使用 docs/207 中锁定的中文 prompt，不自动改写。
我授权一次真实生成：selected_plugin_id=DoubaoGen，selected_plugin_command=generate，selected_plugin_model=doubao-seedream-5-0-260128，max_plugin_calls=1。
output_directory_ref=runs/a5_positive_still_life_prompt_v1，overwrite_existing_files_allowed=false，输出目录必须为空或新建。
gatekeeper_approved=true，review_console_human_approved=true。
daily_note_direct_write_allowed=false，memory_delta_only=true。
本授权不允许 submitDraft，不允许直接写 DailyNote/VCP memory，不允许 push/tag/PR/release。
```

## Short Approval Template

为避免重复粘贴整段授权，后续可使用短批准模板：

```yaml
short_approval_template_ref: integrations/vcp/v10_8_positive_still_life_short_approval_template.md
short_approval_phrase: "批准 v10.8 静物单次生成"
private_plugin_dir_binding_ref: .agent_private/doubaogen_plugin_dir.txt
```

短批准只在当前待批准 capsule 明确指向 `v10_8_positive_still_life_single_generation` 且 `.agent_private/doubaogen_plugin_dir.txt` 已存在、被 Git 忽略、并通过 preflight 时有效。短批准不允许自动猜测真实路径，不允许保存 raw path 或 secret。

## Stop Conditions

```yaml
stop_conditions:
  prompt_approval_missing: true
  generation_authorization_missing: true
  prompt_text_different_from_locked_record: true
  plugin_or_model_different_from_required_values: true
  max_plugin_calls_not_one: true
  output_directory_missing_or_collides: true
  overwrite_requested: true
  gatekeeper_or_review_console_approval_missing: true
  daily_note_direct_write_requested: true
  memory_write_requested_before_accepted_asset: true
  submitDraft_requested: true
  raw_sensitive_value_would_be_recorded: true
  remote_write_requested: true
```

## Draft Boundary

```yaml
draft_boundary:
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  bridge_called: false
  submitDraft_called: false
  commit_performed: false
  tag_performed: false
  push_performed: false
  pr_created: false
  github_release_created: false
```

## Result Meaning

本文件只表示下一次真实生成授权包已经整理成可审草案。它不会激活 A5，不会替代用户批准，不会自动执行任何真实生产动作。
