# v7.54b Real VCPToolBox Read-only Dry-run Contract

## 1. Purpose

定义未来真实 VCPToolBox read-only dry-run 的请求/响应契约。

## 2. Contract

```yaml
lt06_real_vcptoolbox_read_only_dry_run_contract:
  schema_version: v1
  phase: v7_54b
  contract_type: real_read_only_dry_run
  execution_performed_in_this_phase: false

  request_contract:
    mode: read_only
    payload_type: text_only_refs
    returned_refs_only: true
    refs_treated_as_opaque: true
    dereference_refs: false
    write_intent: false
    memory_write_requested: false
    dailynote_write_requested: false
    image_binary_requested: false
    production_approved_claim_requested: false
    reopen_closed_case_requested: false

  response_contract:
    status_allowed:
      - ok
      - blocked
      - failed
    payload_type: text_only_refs
    refs_treated_as_opaque: true
    write_performed: false
    memory_write_performed: false
    dailynote_write_performed: false
    image_binary_read: false
    refs_dereferenced: false

  hard_blockers:
    - endpoint_not_defined
    - no_write_mode_not_confirmed
    - write_intent_detected
    - memory_write_requested
    - dailynote_write_requested
    - refs_dereference_requested_without_realpath_containment
    - image_binary_requested
    - raw_payload_requested
    - secret_detected
    - production_approved_claim_requested
    - closed_case_reopen_requested
```

## 3. Non-goals

- 不执行实际调用
- 不传递真实 endpoint
- 不传递敏感信息
