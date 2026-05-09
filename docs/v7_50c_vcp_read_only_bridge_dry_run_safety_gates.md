# v7.50c VCP Read-only Bridge Dry-run Safety Gates

## Safety Gates

```yaml
dry_run_safety_gates:
  bridge_mode_must_be_read_only: required
  dry_run_must_be_text_only_refs: required
  write_intent_must_be_false: required
  image_binary_must_be_excluded: required
  secrets_must_be_excluded: required
  raw_payload_must_be_excluded: required
  private_absolute_path_must_be_excluded: required
  dailynote_write_must_be_blocked: required
  vcp_memory_write_must_be_blocked: required
  closed_no_memory_write_case_must_not_be_reopened: required
  production_approved_claim_must_be_blocked: required
```

## Hard Blockers

- bridge_mode_not_read_only
- write_intent_detected
- image_binary_requested
- secret_requested
- raw_payload_requested
- private_absolute_path_requested
- dailynote_write_attempted
- vcp_memory_write_attempted
- closed_no_memory_write_reopen_attempted
- production_approved_claim_detected
- vcp_call_without_authorization
- vcpchat_bridge_call_without_authorization

## Rule

未来 dry-run 如果触发任一 hard blocker，应返回 `status: blocked`，并不得继续。
