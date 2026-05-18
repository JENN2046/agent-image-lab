# v7.51a Agent Image Lab Read-only Evidence Index Spec

## 1. Purpose

本文件定义 Agent Image Lab 未来可被 VCPToolBox / VCPChat 只读读取的 evidence index。

## 2. Scope

evidence index 只返回 repository-relative refs。
默认不返回全文。
默认不返回图片二进制。
默认不触发写入。
默认不触发 VCP / VCPChat bridge。

## 3. Allowed Evidence Refs

```yaml
allowed_evidence_refs:
  project_state:
    - README.md
    - .agent_board/CHECKPOINT.md
  bridge_contracts:
    - docs/v7_50_vcp_read_only_bridge_contract.md
    - docs/v7_50_vcp_read_only_bridge_security_gates.md
    - docs/v7_49_vcp_memory_write_boundary_spec.md
  dry_run_results:
    - docs/v7_50a_vcp_read_only_bridge_local_schema_validation_result.yaml
    - docs/v7_50b_vcp_read_only_bridge_mock_payload_validation_result.yaml
    - docs/v7_50c_vcp_read_only_bridge_dry_run_execution_result.yaml
  production_candidate_001:
    - production/reviews/v7_53_french_summer_rattan_bag_v3_production_candidate_001_review.md
    - production/closeouts/v7_56_french_summer_rattan_bag_v3_production_candidate_001_memory_write_skip_closeout.md
```

## 4. Forbidden Evidence Refs

- runs/
- jpg / jpeg / png / webp
- raw API payload
- secrets
- private absolute paths
- DailyNote files
- VCP memory files
- unreviewed generation outputs
- production_approved claims

## 5. Access Rules

- evidence index 只返回 repository-relative refs
- 默认不返回全文
- 默认不返回图片二进制
- 默认不触发写入
- 默认不触发 VCP / VCPChat bridge
