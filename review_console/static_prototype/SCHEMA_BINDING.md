# Review Console Static Schema Binding

```yaml
binding_id: v14_144_review_console_schema_binding
mode: static_local_reader_only
runtime_integration: false
vcpchat_integration: false
vcptoolbox_integration: false
file_write_allowed: false
provider_api_plugin_mcp_allowed: false
DailyNote_write_allowed: false
VCP_memory_write_allowed: false
accepted_samples_write_allowed: false
production_candidate_write_allowed: false
```

## Bound Schemas

```yaml
bound_schemas:
  codex_session_image_import: schemas/codex_session_image_import.schema.yaml
  local_review_record: schemas/local_review_record.schema.yaml
  accepted_sample_registry: schemas/accepted_sample_registry.schema.yaml
```

## Static Sources

```yaml
static_sources:
  import_record_seed: mock_data.js.codex_session_import_record_seed
  artifact_evidence_seed: mock_data.js.artifact_recoverability_dashboard_evidence
  field_mapping: review_console/static_prototype/FIELD_MAPPING.md
  readme_boundary: review_console/static_prototype/README.md
```

## Binding Rules

```yaml
import_record_reader_binding:
  import_id: codex_session_image_import.import_id
  provider_id: codex_session_image_import.provider_id
  prompt_package_ref: codex_session_image_import.prompt_package_ref
  artifact_ref: codex_session_image_import.imported_asset.relative_path
  sha256: codex_session_image_import.imported_asset.sha256
  dimensions: codex_session_image_import.imported_asset.width_px_and_height_px
  mime_type: codex_session_image_import.imported_asset.mime_type
  review_record_ref: codex_session_image_import.review_bridge.review_record_ref
  no_execution_guard: codex_session_image_import.no_execution_guard

review_record_binding:
  review_doc_ref: local_review_record.required_artifact_link_fields.review_record_ref
  import_record_ref: local_review_record.required_artifact_link_fields.import_record_ref
  asset_ref_or_final_asset_ref: local_review_record.required_artifact_link_fields.asset_ref_or_final_asset_ref
  pending_human_review_is_not_approval: true

accepted_registry_binding:
  accepted_sample_id: accepted_sample_registry.sample_entry.sample_id
  artifact_ref: accepted_sample_registry.sample_entry.image_path
  verified_sha256: accepted_sample_registry.full_recoverability_metadata.verified_sha256
  verified_dimensions: accepted_sample_registry.full_recoverability_metadata.verified_dimensions
  verified_mime: accepted_sample_registry.full_recoverability_metadata.verified_mime
  import_record_ref: accepted_sample_registry.full_recoverability_metadata.import_record_ref
  category_index_ref: accepted_sample_registry.category_index_contract
  artifact_recoverability_is_not_vcp_runtime_integration: true
```

## Non-Execution Rules

```yaml
fetch_performed: false
file_write_performed: false
runtime_vcp_integration_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
accepted_samples_write_performed: false
image_binary_copy_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
production_candidate_created: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
```

The static Review Console can display schema-bound evidence and draft outputs.
It cannot replace the artifact recoverability validator and cannot claim VCP
runtime integration.
