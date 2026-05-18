# v7.53d E2E Read-only Integration Failure-mode Validation Report

## 1. Purpose

验证本地 E2E 只读集成链路的 failure modes：adapter 失败响应、ingestion 拒绝策略、surface 禁止字段、wrapper 异常检测。

## 2. Validation Result

```yaml
result: pass
cases_total: 16
cases_passed: 16
cases_failed: 0
unsafe_payloads_blocked: true
crash_masking_prevented: true
```

## 3. Failure Mode Cases

| # | Case | Result |
|---|------|--------|
| 1 | adapter_returns_blocked | pass |
| 2 | adapter_returns_not_found | pass |
| 3 | adapter_returns_failed_structured | pass |
| 4 | ingestion_rejects_non_text_only_payload | pass |
| 5 | ingestion_rejects_returned_refs_only_false | pass |
| 6 | ingestion_rejects_absolute_ref | pass |
| 7 | ingestion_rejects_runs_ref | pass |
| 8 | ingestion_rejects_image_ref | pass |
| 9 | surface_rejects_memory_action | pass |
| 10 | surface_rejects_dailynote_action | pass |
| 11 | surface_rejects_production_approved_claim | pass |
| 12 | surface_rejects_private_absolute_path | pass |
| 13 | surface_rejects_closed_case_reopen_action | pass |
| 14 | wrapper_rejects_unparsed_adapter_output | pass |
| 15 | wrapper_rejects_empty_stdout | pass |
| 16 | wrapper_rejects_stderr_stack | pass |

## 4. External Side Effects

全部 false：

- real_vcptoolbox_call_performed: false
- vcpchat_bridge_call_performed: false
- electron_started: false
- remote_debug_started: false
- cdp_call_performed: false
- daily_note_write_performed: false
- vcp_memory_write_performed: false
- image_generation_performed: false
- image_binary_read: false
- runs_path_read: false
