# v7.50 VCP Read-only Bridge Contract

## 1. Purpose

定义未来只读桥的 request / response schema 和 allowed / forbidden read resources。

## 2. Request Schema

```yaml
vcp_read_only_bridge_request:
  schema_version: v1
  request_id: ""
  requested_by: "VCPChat | VCPToolBox | human_operator"
  bridge_mode: read_only
  case_id: ""
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

## 3. Response Schema

```yaml
vcp_read_only_bridge_response:
  schema_version: v1
  request_id: ""
  bridge_mode: read_only
  source_repo: "JENN2046/agent-image-lab"
  case_id: ""
  status: "ok | blocked | not_found"
  returned_resources:
    project_state_ref: ""
    case_summary_candidate_ref: ""
    production_readiness_ref: ""
    review_checklist_ref: ""
    a5_template_ref: ""
    memory_boundary_ref: ""
  payload_type: text_only_refs
  image_binary_included: false
  secrets_included: false
  write_performed: false
  memory_write_performed: false
  daily_note_write_performed: false
```

## 4. Allowed Read Resources

- README canonical state
- `.agent_board/CHECKPOINT.md` latest checkpoint
- `docs/v7_44_french_summer_rattan_bag_v3_closeout_production_readiness.md`
- `docs/v7_45_french_summer_rattan_bag_v3_production_usage_sop.md`
- `docs/v7_46_french_summer_rattan_bag_v3_one_shot_a5_template.md`
- `docs/v7_47_french_summer_rattan_bag_v3_human_review_checklist.md`
- `docs/v7_48_project_state_sync_pack.md`
- `docs/v7_49_vcp_integration_readiness_pack.md`
- `docs/v7_49_vcp_memory_write_boundary_spec.md`
- `docs/v7_49_vcp_case_summary_schema.md`
- `docs/v7_49_vcp_integration_execution_roadmap.md`

## 5. Forbidden Read Resources

- `runs/`
- jpg / jpeg / png / webp
- API request payloads
- API response payloads
- secrets
- absolute private paths
- unreviewed outputs
- rejected asset as success memory
- VCP private filesystem paths
