# v7.51c Read-only Bridge Adapter Security Gate Plan

## 1. Purpose

定义 read-only bridge adapter 的推荐安全门计划。

## 2. Adapter Security Gates

```yaml
adapter_security_gates:
  bridge_mode_must_be_read_only: required
  write_intent_must_be_false: required
  image_binary_requested_must_be_false: required
  secrets_requested_must_be_false: required
  raw_payload_requested_must_be_false: required
  private_absolute_path_requested_must_be_false: required
  memory_write_must_not_be_attempted: required
  dailynote_write_must_not_be_attempted: required
  production_approved_claim_must_be_blocked: required
  closed_case_reopen_must_be_blocked: required
```

## 3. Request Validation

```yaml
request_validation:
  required_fields:
    - bridge_mode
    - payload_type
    - write_intent
  field_constraints:
    bridge_mode: must_be_read_only
    payload_type: must_be_text_only_refs
    write_intent: must_be_false
    image_binary_requested: must_be_false_or_absent
    secrets_requested: must_be_false_or_absent
    raw_payload_requested: must_be_false_or_absent
    private_absolute_path_requested: must_be_false_or_absent
```

## 4. Response Validation

```yaml
response_validation:
  required_fields:
    - status
    - payload_type
    - returned_refs_only
  forbidden_in_response:
    - image_binary
    - raw_payload
    - secrets
    - private_absolute_path
    - full_file_content_by_default
```

## 5. Hard Blockers

如果任意一个 security gate 未通过，adapter 必须返回 status: blocked，并在 blocked_reason 中列出所有未通过的门。

- bridge_mode_not_read_only
- write_intent_true
- image_binary_requested
- secret_requested
- raw_payload_requested
- private_absolute_path_requested
- memory_write_attempted
- dailynote_write_attempted
- production_approved_claim_detected
- closed_case_reopen_attempted
