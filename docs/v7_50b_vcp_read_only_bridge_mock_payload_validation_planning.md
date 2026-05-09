# v7.50b VCP Read-only Bridge Mock Payload Validation Planning

## 1. Purpose

本文件定义未来 mock bridge payload validation 的规划。
本阶段不运行 mock。
本阶段只定义测试用例、期望结果、阻断条件和边界。

## 2. Mock Cases

```yaml
mock_cases:
  - case_id: valid_text_only_case_summary_request
    expected_result: pass

  - case_id: request_image_binary
    expected_result: blocked

  - case_id: request_memory_write
    expected_result: blocked

  - case_id: request_dailynote_write
    expected_result: blocked

  - case_id: request_raw_api_payload
    expected_result: blocked

  - case_id: request_private_absolute_path
    expected_result: blocked

  - case_id: request_production_approved_from_stable_candidate_only
    expected_result: blocked
```

## 3. Pass Case Payload Shape

Valid request:

```yaml
vcp_read_only_bridge_request:
  schema_version: v1
  request_id: mock_valid_001
  requested_by: human_operator
  bridge_mode: read_only
  case_id: french_summer_rattan_bag_v3_production_candidate_001
  requested_resources:
    - project_state
    - case_summary_candidate
    - production_readiness
    - review_checklist
    - a5_template
    - memory_boundary
  write_intent: false
  image_binary_requested: false
  secrets_requested: false
```

Expected:

```yaml
expected_response:
  status: ok
  payload_type: text_only_refs
  image_binary_included: false
  secrets_included: false
  write_performed: false
  memory_write_performed: false
  daily_note_write_performed: false
```

## 4. Block Case Rules

- request_image_binary → blocked because image_binary_requested=true
- request_memory_write → blocked because write_intent=true or memory_write requested
- request_dailynote_write → blocked because DailyNote write is not allowed
- request_raw_api_payload → blocked because raw payloads are forbidden
- request_private_absolute_path → blocked because private paths are forbidden
- request_production_approved_from_stable_candidate_only → blocked because stable_candidate does not equal production_approved

## 5. Future Execution

- 本阶段不运行 mock
- mock execution 必须进入单独阶段
- mock 只允许使用手写假 payload
- mock 不允许调用 VCP
- mock 不允许读取图片
- mock 不允许写 memory
