# v7.51c Read-only Bridge Adapter Error Codes

## 1. Purpose

定义 read-only bridge adapter 的推荐错误码体系。

## 2. Status Codes

```yaml
adapter_status_codes:
  ok:
    code: 0
    meaning: Request processed successfully, refs returned.
    http_equivalent: 200

  blocked:
    code: 1
    meaning: Request blocked by safety gate. Details in blocked_reason.
    http_equivalent: 403

  not_found:
    code: 2
    meaning: Requested resource or case_id not found in evidence index.
    http_equivalent: 404

  failed:
    code: 3
    meaning: Adapter internal error. Details in error_message.
    http_equivalent: 500
```

## 3. Blocked Reasons

```yaml
blocked_reasons:
  - bridge_mode_not_read_only
  - write_intent_detected
  - image_binary_requested
  - secret_requested
  - raw_payload_requested
  - private_absolute_path_requested
  - memory_write_attempted
  - dailynote_write_attempted
  - production_approved_claim_detected
  - closed_case_reopen_attempted
```

## 4. Error Message Policy

- error_message 只包含通用描述，不包含具体路径、密钥或 payload 内容
- 不在错误消息中泄露 repository 绝对路径
- 不在错误消息中泄露 VCP / VCPChat 路径
