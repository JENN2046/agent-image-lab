# v7.52d VCPToolBox Mock Ingestion Validation Report

## 1. Purpose

本文件记录 VCPToolBox mock ingestion validation 结果。
Mock 阶段只做本地 ingestion pipeline 校验，不调用真实 VCPToolBox，不调用 VCPChat bridge，不写 memory，不读图片。

## 2. Mock Pipeline

```yaml
mock_pipeline:
  1_adapter_call:
    mode: local_spawn_only
    command: node scripts/agent_image_lab_read_only_adapter.js
    expected_status: ok
  2_ingestion_package_build:
    package_type: agent_image_lab_read_only_refs
    refs_are_opaque: true
  3_no_write_policy_check:
    memory_write_allowed: false
    dailynote_write_allowed: false
  4_visibility_check:
    no_full_file_content: true
    no_image_binary: true
    no_raw_payload: true
    no_secrets: true
  5_mock_result:
    status: pass
```

## 3. Validation Result

- **result**: pass
- **cases_total**: 14
- **cases_passed**: 14
- **cases_failed**: 0
- **refs_treated_as_opaque**: true
- **dereference_performed**: false

## 4. Test Cases

| # | Case | Expected | Result |
|---|------|----------|--------|
| 1 | valid_adapter_response_as_opaque_refs | pass | pass |
| 2 | reject_payload_type_not_text_only_refs | blocked | pass |
| 3 | reject_returned_refs_only_false | blocked | pass |
| 4 | reject_absolute_ref | blocked | pass |
| 5 | reject_runs_ref | blocked | pass |
| 6 | reject_image_ref | blocked | pass |
| 7 | reject_full_file_content_field | blocked | pass |
| 8 | reject_raw_payload_field | blocked | pass |
| 9 | reject_secret_field | blocked | pass |
| 10 | reject_memory_write_requested | blocked | pass |
| 11 | reject_dailynote_write_requested | blocked | pass |
| 12 | reject_dereference_without_realpath_containment | blocked | pass |
| 13 | reject_production_approved_claim | blocked | pass |
| 14 | reject_closed_case_reopen_attempt | blocked | pass |

## 5. External Side Effects

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
