# v7.52b VCP Package Schema Mapping

## 1. Purpose

把 Agent Image Lab adapter response 映射为未来 VCPToolBox 可理解的 read-only ingestion package。

## 2. Schema

```yaml
vcp_read_only_ingestion_package:
  schema_version: v1
  phase: v7_52b
  package_type: agent_image_lab_read_only_refs
  source_repo: JENN2046/agent-image-lab
  source_adapter: scripts/agent_image_lab_read_only_adapter.js
  source_case_id: french_summer_rattan_bag_v3_production_candidate_001

  adapter_response_contract:
    status_allowed:
      - ok
      - blocked
      - not_found
      - failed
    payload_type: text_only_refs
    returned_refs_only: true
    returned_resource_refs:
      type: array
      item_type: repository_relative_ref
      opaque_to_ingestion_mock: true

  ingestion_policy:
    consume_refs_as_opaque: true
    dereference_refs: false
    realpath_containment_required_before_future_dereference: true
    full_file_content_allowed: false
    image_binary_allowed: false
    raw_payload_allowed: false
    secret_allowed: false
    memory_write_allowed: false
    dailynote_write_allowed: false

  visibility:
    public_surface_allowed:
      - status
      - package_type
      - source_case_id
      - returned_resource_refs
      - safety_summary
    forbidden_surface_fields:
      - image_binary
      - full_file_content
      - raw_payload
      - secrets
      - private_absolute_path
      - memory_write_action
      - dailynote_write_action
      - production_approved_claim
```

## 3. Mapping Notes

- VCPToolBox 未来只接收 adapter 返回的 refs
- Mock 阶段不展开 refs
- 真实 ingestion 未来如果要展开 refs，必须新增单独授权和 realpath containment
- forbidden_surface_fields 中的任何字段出现在 ingestion package 中时，mock 必须拒绝
