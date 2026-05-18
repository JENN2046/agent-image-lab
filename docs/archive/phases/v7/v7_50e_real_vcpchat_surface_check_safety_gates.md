# v7.50e Real VCPChat Surface Check Safety Gates

## 1. Purpose

本文件定义未来真实 VCPChat surface check 的安全门。
本阶段只定义安全门，不执行真实 surface check。

## 2. Safety Gates

```yaml
real_surface_check_safety_gates:
  electron_launch_requires_explicit_authorization: required
  remote_debug_requires_explicit_authorization: required
  vcpchat_bridge_call_requires_explicit_authorization: required
  render_mode_must_be_read_only: required
  payload_type_must_be_text_only_refs: required
  memory_write_action_must_not_render: required
  dailynote_write_action_must_not_render: required
  generate_image_action_must_not_render: required
  image_binary_must_not_render: required
  closed_no_memory_write_case_must_not_reopen: required
```

## 3. Hard Blockers

- electron_launched_without_authorization
- remote_debug_started_without_authorization
- bridge_call_attempted_without_authorization
- render_mode_not_read_only
- payload_type_not_text_only_refs
- memory_write_button_rendered
- dailynote_write_button_rendered
- generate_image_button_rendered
- image_binary_rendered
- closed_case_reopen_rendered

未来 v7.50e execution 如果触发任一 hard blocker，应返回 blocked，不得继续真实 surface check。
