# P5L Review Console Failure Capsule Snapshot Validator

```yaml
phase: p5l_review_console_failure_capsule_snapshot_validator
status: completed_validated_pending_guarded_local_commit
mode: A4.8_static_snapshot_validator
fixture_ref: tests/schema_examples/P5L_REVIEW_CONSOLE_FAILURE_CAPSULE_SNAPSHOT.example.json
validator_ref: scripts/validate_review_console_failure_capsule_snapshot.js
source_display_record_ref: docs/P5K_REVIEW_CONSOLE_STATIC_FAILURE_CAPSULE_DISPLAY.md
sample_id: failure_french_summer_rattan_bag_v7_29_001
```

## Purpose

Freeze the P5K static Review Console failure capsule display as a regression
snapshot. The validator protects the new static UI / draft-output surface from
drifting away from the first Git-portable failure capsule evidence.

## Frozen Fields

```yaml
draft_output_keys:
  - portable_failure_capsule_evidence
  - portable_failure_capsule_evidence_list
  - failure_state_static_workbench_state.portable_failure_capsule_records
preview:
  format: webp
  dimensions: 512x512
  long_edge: 512
  sha256: 8addc3084099c1f2aab11a27c7b730f475ced21f80fff0b2e67d877c49d8c43e
final_route: failure_learning_only_never_production
clone_portable_validation_status: passed
registry_validator_status: failure_sample_capsules_verified
```

## Boundary

```yaml
static_snapshot_only: true
static_mock_only: true
in_memory_only: true
preview_loaded_or_rendered: false
asset_archive_read_performed: false
fetch_performed: false
file_write_performed: false
failure_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
vcp_runtime_integration_proven: false
```

## Negative Cases

The validator fails if:

- the sample id, preview metadata, hash, route, or validation status drifts
- failure tags or resolved accepted sample link are lost
- the static UI no longer exposes failure capsule count / id / workbench record
- `base64_evidence_used`, production candidate, memory write, or DailyNote write becomes allowed
- fetch, file write, provider/plugin/API, runtime, real manifest, VCPChat/VCPToolBox, image generation, or remote action is claimed

## Closeout

This is a static snapshot validator only. It does not render the image, read
`asset_archive/`, create or copy previews, write `failure_samples`, or prove VCP
runtime integration.
