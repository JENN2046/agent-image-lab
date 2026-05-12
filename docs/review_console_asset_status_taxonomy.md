# Review Console Asset Status Taxonomy

Status: A4 docs-only product review surface specification.

This taxonomy defines how future generated assets should be labeled during human review. It does not create assets, run Review Console, call providers, call plugins, save output, or write memory.

## Status Values

```yaml
asset_status:
  - not_created
  - generated_pending_review
  - needs_revision
  - rejected
  - accepted_candidate
  - accepted_final
  - archived_reference_only
  - superseded
```

## Status Meanings

```yaml
status_meanings:
  not_created: "No generated asset exists."
  generated_pending_review: "Future authorized generation produced an asset that awaits human review."
  needs_revision: "Asset needs a revised prompt package or future retry authorization."
  rejected: "Asset is not suitable for use as an accepted output."
  accepted_candidate: "Asset may be accepted after final human confirmation."
  accepted_final: "Asset is approved as a final delivery candidate."
  archived_reference_only: "Asset is retained as reference material only."
  superseded: "Asset was replaced by a newer candidate or review decision."
```

## Required Review Record

```yaml
review_record:
  asset_ref: "<future sanitized asset ref>"
  source_authorization_ref: "<future A5 authorization ref>"
  prompt_package_ref: "<prompt package instance ref>"
  review_status: not_created
  human_score: "<placeholder>"
  product_fidelity_result: "<placeholder>"
  composition_result: "<placeholder>"
  artifact_result: "<placeholder>"
  rejection_reasons: []
  revision_request: "<placeholder>"
  memory_suitability_status: draft
```

## Rejection Reason Options

```yaml
rejection_reason_options:
  - wrong_product_identity
  - missing_hero_feature
  - broken_geometry
  - text_logo_watermark
  - poor_material_fidelity
  - composition_mismatch
  - lighting_failure
  - background_distraction
  - style_drift
  - unsafe_or_private_content
```

## Boundary Checks

```yaml
boundary_checks:
  review_console_runtime_created: false
  renderer_code_created: false
  preload_code_created: false
  IPC_handler_created: false
  provider_contacted: false
  plugin_called: false
  image_generated: false
  output_saved: false
  runs_written: false
  accepted_samples_written: false
  DailyNote_written: false
  VCP_memory_written: false
```

## Memory Suitability Link

```yaml
memory_suitability_link:
  status_is_input_only: true
  memory_write_allowed_now: false
  DailyNote_write_allowed_now: false
  future_decision_matrix_required: true
```
