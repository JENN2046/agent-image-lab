# Runtime Review Batch 9B Runtime Session Compatibility Matrix

本文固化 Review Console runtime prototype 的本地会话导入 / 导出兼容规则。目标是防止后续新增 draft-rich 区块后，误把历史 `runtime_review_session_v1` 导出草案判为坏包。

本批只补文档、fixture 和 validator，不修改真实 VCPChat / VCPToolBox，不调用 bridge / CDP / 插件 / API / DailyNote，不写 VCP memory，不创建图片，也不执行版本动作。

## Compatibility Record

```yaml
runtime_review_batch_9b_runtime_session_compatibility_matrix:
  status: completed_validated_runtime_session_compatibility_matrix
  current_phase: "Runtime Review Batch 9B runtime session compatibility matrix"
  previous_phase: "Runtime Review Batch 9C operator runbook and resume capsule"
  current_export_format: runtime_review_session_v1
  legacy_fixture: tests/schema_examples/runtime_review_session_v1_legacy_minimal.example.json
  current_fixture: tests/schema_examples/runtime_review_session_v1_current_draft_rich.example.json
  validator: scripts/validate_runtime_review_batch_9b_session_compatibility.js
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  bridge_or_cdp_call: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  version_action_performed: false
```

## Accepted Formats

| Format | Profile | Status | Required behavior |
| --- | --- | --- | --- |
| `runtime_review_session_v1` | `legacy_minimal` | accepted | Must include the top-level package fields, clean `prototype_guard`, `side_effects_performed=false`, valid `session_fingerprint`, and a non-empty `review_session_snapshot.review_queue`. Newly added draft-rich blocks may be absent. |
| `runtime_review_session_v1` | `current_draft_rich` | accepted | Must satisfy the v1 base requirements and include current draft-rich blocks with clean `no_execution_guard` when those blocks are present. |
| future format | any future profile | blocked until planned | A future schema bump must add an explicit migration adapter, fixture pair, validator coverage, and release note before it can be accepted. |

## Required v1 Base Fields

Every accepted `runtime_review_session_v1` package must contain:

```yaml
required_v1_base_fields:
  package_status: draft_only
  export_format: runtime_review_session_v1
  session_id: required
  task_id: required
  case_id: required
  review_session_snapshot:
    review_queue: non_empty_array
  prototype_guard:
    api_called: false
    daily_note_called: false
    vcp_plugin_called: false
    disk_write_performed: false
    image_file_created: false
  side_effects_performed: false
  session_fingerprint: fnv1a32_over_payload_without_fingerprint_fields
```

`session_fingerprint` is computed from the stable JSON payload after removing `session_fingerprint` and `session_fingerprint_cn`. A stale or mismatched fingerprint must be rejected.

## Missing-field Fallback Rules

The current importer treats these draft-rich blocks as optional for legacy v1 packages:

```yaml
optional_draft_rich_blocks:
  - batch_decision_draft
  - a5_preauthorization_review_package_draft
  - human_override_traceability_draft
  - accepted_candidate_delivery_package_draft
  - inactive_authorization_capsules_draft
  - runtime_review_state_draft
  - local_commit_scope_plan_draft
  - bridge_mock_roundtrip_candidate_draft
  - real_bridge_authorization_package_draft
  - plugin_reliability_prompt_discipline_draft
  - memory_write_completion_candidate_draft
  - single_real_generation_retry_gate_draft
  - real_memory_write_authorization_package_draft
  - asset_archive_candidate_draft
```

Compatibility rule:

- If one of these blocks is absent in a legacy v1 package, the importer may accept the package after validating the v1 base fields.
- If one of these blocks is present and contains `no_execution_guard`, that guard must be clean.
- If one of these blocks is present and its guard is dirty, the package must be rejected.
- Missing optional blocks do not imply that any real action happened.
- Missing optional blocks do not authorize runtime defaults to call bridge, plugin, API, DailyNote, VCP memory, or image creation.

## Current Draft-rich Rule

Current draft-rich exports should include the current local draft surfaces:

```yaml
current_draft_rich_blocks:
  - batch_review_summary_draft
  - batch_decision_draft
  - risk_review_summary_draft
  - a5_preauthorization_review_package_draft
  - human_inspection_checklist_draft
  - human_override_traceability_draft
  - accepted_candidate_delivery_package_draft
  - inactive_authorization_capsules_draft
  - runtime_review_state_draft
  - local_commit_scope_plan_draft
  - bridge_mock_roundtrip_candidate_draft
  - real_bridge_authorization_package_draft
  - plugin_reliability_prompt_discipline_draft
  - memory_write_completion_candidate_draft
  - single_real_generation_retry_gate_draft
  - real_memory_write_authorization_package_draft
  - asset_archive_candidate_draft
```

For current draft-rich packages, every listed block must exist and either expose a clean `no_execution_guard` or be covered by the top-level clean `prototype_guard` rule when the block is a pure summary surface.

## Rejection Rules

Reject a session package if any of these are true:

```yaml
reject_when:
  package_status_not_draft_only: true
  export_format_not_runtime_review_session_v1: true
  missing_review_queue: true
  stale_or_missing_session_fingerprint: true
  prototype_guard_dirty_or_missing: true
  side_effects_performed_not_false: true
  any_present_draft_block_guard_dirty: true
  plugin_or_api_or_dailynote_or_memory_or_image_flag_enabled: true
  future_format_without_migration_plan: true
```

## Fixtures

```yaml
fixtures:
  legacy_minimal:
    path: tests/schema_examples/runtime_review_session_v1_legacy_minimal.example.json
    expected_status: accepted_legacy_minimal
    new_draft_blocks_required: false
  current_draft_rich:
    path: tests/schema_examples/runtime_review_session_v1_current_draft_rich.example.json
    expected_status: accepted_current_draft_rich
    new_draft_blocks_required: true
```

Both fixtures are project-local examples. They do not contain raw source, raw runtime logs, raw plugin output, secrets, private paths, endpoints, image binaries, or customer data.

## Validation

```powershell
node --check scripts\validate_runtime_review_batch_9b_session_compatibility.js
node scripts\validate_runtime_review_batch_9b_session_compatibility.js
node --check review_console\runtime_prototype\app.js
node --check review_console\runtime_prototype\runtime_guard.js
node scripts\validate_runtime_prototype_suite.js
git diff --check
```
