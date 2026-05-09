# v7.51c Read-only Bridge Adapter Test Plan

## 1. Purpose

定义 read-only bridge adapter 的推荐测试计划。

## 2. Test Categories

```yaml
test_categories:
  schema_validation:
    description: Validate adapter request/response schema compliance.
    expected_count: 5-10 test cases

  security_gate_validation:
    description: Validate all hard blockers are correctly enforced.
    expected_count: 10-12 test cases

  fixture_regression:
    description: Run known good and known bad payloads through adapter.
    expected_count: 5-8 test cases
```

## 3. Test Scenarios

### Schema validation

```yaml
schema_test_scenarios:
  valid_text_only_request:
    expectation: pass, returns ok with refs
  missing_case_id:
    expectation: fail, returns not_found
  invalid_payload_type:
    expectation: fail, returns blocked
  empty_request:
    expectation: fail, returns failed
  unknown_resource:
    expectation: fail, returns not_found
```

### Security gate validation

```yaml
security_test_scenarios:
  write_intent_true:
    expectation: blocked, write_intent_detected
  image_binary_requested_true:
    expectation: blocked, image_binary_requested
  secrets_requested_true:
    expectation: blocked, secret_requested
  raw_payload_requested_true:
    expectation: blocked, raw_payload_requested
  private_absolute_path_requested_true:
    expectation: blocked, private_absolute_path_requested
  bridge_mode_not_read_only:
    expectation: blocked, bridge_mode_not_read_only
  memory_write_attempted:
    expectation: blocked, memory_write_attempted
  dailynote_write_attempted:
    expectation: blocked, dailynote_write_attempted
  production_approved_claim_requested:
    expectation: blocked, production_approved_claim_detected
  closed_case_reopen_attempted:
    expectation: blocked, closed_case_reopen_attempted
```

## 4. Test Data

测试数据使用仓库内已有 fixture：

- `tests/schema_examples/` 目录下的 schema 样例
- `docs/v7_50c_vcp_read_only_bridge_dry_run_execution_result.yaml` 的真实 dry-run 数据
- `production/closeouts/` 下的 production candidate closeout 数据

## 5. Validation Commands

```powershell
node scripts/validate_agent_image_lab_read_only_adapter_schema.js
node scripts/validate_agent_image_lab_read_only_adapter_security_gates.js
node scripts/validate_agent_image_lab_read_only_adapter_fixtures.js
```
