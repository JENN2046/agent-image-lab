# v7.50 VCP Read-only Bridge Security Gates

## 1. Purpose

定义未来只读桥的安全门和 hard blockers。

## 2. Security Gates

```yaml
security_gates:
  bridge_mode_must_be_read_only: required
  write_intent_must_be_false: required
  image_binary_must_be_excluded: required
  secrets_must_be_excluded: required
  raw_request_response_must_be_excluded: required
  repo_mutation_must_be_blocked: required
  memory_write_must_be_blocked: required
  daily_note_write_must_be_blocked: required
  vcp_call_must_require_independent_a5: required
  vcp_private_path_access_must_be_blocked: required
```

## 3. Hard Blockers

以下情况必须阻断并返回 `status: blocked`：

- write_intent_detected
- image_binary_requested
- secret_requested
- raw_payload_requested
- run_directory_requested
- private_absolute_path_requested
- memory_write_attempted
- dailynote_write_attempted
- vcp_call_without_a5
- bridge_mode_not_read_only

## 4. Bridge Response Rules

- future bridge 只能返回 text-only refs
- future bridge 不能返回图片二进制
- future bridge 不能返回本机绝对路径
- future bridge 不能自动触发 DailyNote / memory write
- future bridge 不能把 stable_candidate 当成 production_approved
