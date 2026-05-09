# v7.5 A5 Activation Checklist

## 声明

本清单是 inactive checklist。`execution_authorized_by_this_record: false`。
不授权插件调用、API 调用、图片创建、DailyNote 写入、VCP memory 写入。

```yaml
a5_activation_checklist:
  status: inactive_checklist
  execution_authorized_by_this_record: false

  baseline:
    branch: master
    commit: f13c6c3
    tag: v6.10-rc1-product-runtime

  required_human_confirmation:
    selected_plugin_confirmed: false
    prompt_package_confirmed: false
    max_plugin_calls_confirmed: false
    output_directory_confirmed: false
    asset_acceptance_gate_confirmed: false
    memory_write_blocked_confirmed: false

  hard_limits:
    max_plugin_calls: 1
    max_images_created: 1
    retry_allowed: false
    memory_write_allowed: false
    daily_note_write_allowed: false
    push_allowed: false
    tag_allowed: false
    release_allowed: false

  forbidden_until_activation:
    plugin_call: true
    api_call: true
    image_creation: true
    dailynote_write: true
    vcp_memory_write: true
    retry: true
```
