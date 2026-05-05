# v5.6 V5 Index Consistency Validation

## Summary

本记录为 v5.0-v5.6 本地交付阶段增加一层索引一致性验证。它检查 v5 阶段文档、schema 示例、验证脚本、README、MANIFEST、roadmap、release notes、validation checklist、`validate_mvp.ps1` 和 `.agent_board` 是否同步。

v5.6 仍是项目内只读验证增强，不执行 commit、push、tag、PR、merge、release，不读取真实 VCPToolBox / VCPChat，不读取外部真实 manifest，不调用插件、API、DailyNote，不创建图片，也不写 VCP 记忆。

## Validation Record

```yaml
status: completed_validated_project_local_v5_6_v5_index_consistency
version: v5.6
validation_file: scripts/validate_v5_index_consistency.js
v5_record_count: 7
docs_present: true
schema_examples_present: true
validation_scripts_present: true
readme_index_current: true
manifest_index_current: true
release_notes_current: true
roadmap_current: true
checklist_current: true
validate_mvp_current: true
agent_board_current: true
push_authorized: false
tag_authorized: false
pr_authorized: false
release_authorized: false
remote_write_performed: false
external_network_required: false
external_service_required: false
file_write_performed: false
real_vcpchat_source_read: false
real_vcpchat_modified: false
real_vcptoolbox_source_read: false
real_vcptoolbox_modified: false
real_manifest_read: false
api_called: false
vcp_plugin_called: false
daily_note_called: false
vcp_memory_written: false
image_file_created: false
commit_tag_push_authorized: false
```

## Covered V5 Records

```yaml
records:
  - version: v5.0
    doc: docs/127_v5_0_delivery_readiness_index.md
    schema: tests/schema_examples/v5_0_delivery_readiness.example.yaml
  - version: v5.1
    doc: docs/128_v5_1_runtime_delivery_surface.md
    schema: tests/schema_examples/v5_1_runtime_delivery_surface.example.yaml
  - version: v5.2
    doc: docs/129_v5_2_adapter_delivery_surface.md
    schema: tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml
  - version: v5.3
    doc: docs/130_v5_3_review_console_adapter_handoff.md
    schema: tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml
  - version: v5.4
    doc: docs/131_v5_4_local_sync_readiness.md
    schema: tests/schema_examples/v5_4_local_sync_readiness.example.yaml
  - version: v5.5
    doc: docs/132_v5_5_post_commit_reconciliation.md
    schema: tests/schema_examples/v5_5_post_commit_reconciliation.example.yaml
  - version: v5.6
    doc: docs/133_v5_6_v5_index_consistency_validation.md
    schema: tests/schema_examples/v5_6_v5_index_consistency_validation.example.yaml
```

## Boundary

v5.6 只验证索引一致性，不代表任何远端版本动作已获授权。后续任何 `push`、远端 tag、PR、merge 或 release 都必须由用户单独授权，并在执行前重新确认目标分支、对象、回滚路径和验证结果。
