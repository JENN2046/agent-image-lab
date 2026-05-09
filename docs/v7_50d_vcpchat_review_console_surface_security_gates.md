# v7.50d VCPChat Review Console Surface Security Gates

### Surface security gates

```yaml
surface_security_gates:
  render_mode_must_be_read_only: required
  payload_type_must_be_text_only_refs: required
  returned_refs_only_must_be_true: required
  image_binary_must_not_render: required
  secrets_must_not_render: required
  raw_payload_must_not_render: required
  private_absolute_path_must_not_render: required
  memory_write_action_must_not_render: required
  dailynote_write_action_must_not_render: required
  generate_image_action_must_not_render: required
  closed_no_memory_write_case_must_not_reopen: required
  production_approved_claim_must_not_render: required
```

### Hard blockers

- render_mode_not_read_only
- payload_type_not_text_only_refs
- returned_refs_only_false
- image_binary_render_attempted
- secret_render_attempted
- raw_payload_render_attempted
- private_absolute_path_render_attempted
- memory_write_button_rendered
- dailynote_write_button_rendered
- generate_image_button_rendered
- closed_case_reopen_action_rendered
- production_approved_claim_rendered

未来 surface check 如果触发任一 hard blocker，应返回 blocked，不得进入真实 UI surface。
