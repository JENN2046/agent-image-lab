# v7.52c VCPToolBox No-write Bridge Contract

## 1. Purpose

定义 VCPToolBox read-only ingestion 的 no-write contract。
Mock 阶段严格执行：只读不写，拒绝任何写意图。

## 2. Contract

```yaml
vcptoolbox_no_write_bridge_contract:
  schema_version: v1
  phase: v7_52c
  contract_type: read_only_no_write
  real_vcptoolbox_call_performed: false
  mock_only: true

  allowed:
    - receive_adapter_response
    - validate_payload_type_text_only_refs
    - validate_returned_refs_only_true
    - validate_repository_relative_refs
    - display_refs_as_opaque_evidence
    - produce_mock_ingestion_summary

  forbidden:
    - dereference_refs_without_realpath_containment
    - read_file_content
    - read_image_binary
    - read_runs_directory
    - call_vcptoolbox_real_endpoint
    - call_vcpchat_bridge
    - write_dailynote
    - write_vcp_memory
    - write_topicmemo
    - write_lightmemo
    - write_deepmemo
    - claim_production_approved
    - reopen_closed_no_memory_write_case

  hard_blockers:
    - payload_type_not_text_only_refs
    - returned_refs_only_false
    - absolute_ref_detected
    - runs_ref_detected
    - image_ref_detected
    - raw_payload_detected
    - secret_detected
    - full_file_content_detected
    - memory_write_requested
    - dailynote_write_requested
    - dereference_without_realpath_containment
    - production_approved_claim_detected
    - closed_case_reopen_attempted
```

## 3. Enforcement

如果触发任何 hard blocker，mock ingestion 必须返回 blocked，不得继续。

- 每个 hard blocker 对应 mock 中的一个独立 case
- 触发 blocker 时，mock 输出 blocked status 并附带 blocker reason
- 未触发 blocker 时，mock 输出 pass status
