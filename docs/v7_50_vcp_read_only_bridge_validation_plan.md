# v7.50 VCP Read-only Bridge Validation Plan

## 1. Purpose

定义未来只读桥的验证计划。本阶段不执行真实桥。

## 2. Validation Levels

```yaml
validation_levels:
  v7_50:
    type: docs_only_contract_validation
    real_bridge_call: false
  v7_50a:
    type: local_schema_validation
    real_bridge_call: false
  v7_50b:
    type: mock_bridge_payload_validation
    real_bridge_call: false
  v7_50c:
    type: read_only_bridge_dry_run
    real_bridge_call: requires_independent_authorization
  v7_50d:
    type: VCPChat_review_console_surface_check
    real_bridge_call: requires_independent_authorization
```

## 3. Mock Validation Cases

| Case | Input | Expected Result |
|------|-------|----------------|
| 1 | valid text-only case summary request | pass |
| 2 | request image binary | blocked |
| 3 | request memory write | blocked |
| 4 | request DailyNote write | blocked |
| 5 | request raw API payload | blocked |
| 6 | request private absolute path | blocked |
| 7 | request production_approved from stable_candidate only | blocked |

## 4. Current Boundaries

- 本阶段不运行 mock
- 本阶段只定义 validation plan
- 后续如果要执行 mock，需要独立阶段
- 后续如果要真实 bridge，需要独立 A5 或明确只读授权包
