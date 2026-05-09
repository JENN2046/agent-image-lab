# v7.0 A5 Single Generation Authorization Template

## 声明

本模板是未激活授权包。`execution_authorized_by_this_record: false`。
不授权插件调用、API 调用、图片创建、DailyNote 写入、VCP memory 写入、
push、tag、release。

```yaml
a5_single_generation_authorization:
  status: inactive_template
  execution_authorized_by_this_record: false

  target_baseline:
    branch: master
    commit: e886b6b
    tag: v6.10-rc1-product-runtime

  generation_scope:
    selected_plugin_id: null
    selected_plugin_command: null
    prompt_package_ref: null
    max_plugin_calls: 1
    max_images_created: 1

  forbidden_without_explicit_activation:
    plugin_call: true
    api_call: true
    image_creation: true
    dailynote_write: true
    vcp_memory_write: true
    push: true
    tag: true
    release: true

  required_preflight:
    working_tree_clean: true
    validator_chain_passed: true
    output_directory_policy_reviewed: true
    asset_review_gate_ready: true
    memory_write_gate_blocked_by_default: true

  post_run_required:
    asset_status: accepted_candidate | needs_human_review | rejected
    memory_write_allowed: false
    daily_note_write_allowed: false
    human_review_required: true
```

## 使用说明

1. 用户将 `status` 改为 `active` 并填入 `generation_scope` 字段
2. `execution_authorized_by_this_record` 改为 `true`
3. 运行 preflight 确认所有 `required_preflight` 条件
4. 执行后按照 `post_run_required` 处理结果
