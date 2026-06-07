# Review Console Asset Archive Exact-read Preview Probe Gate

Status: prepared gate package only. This document selects exact repo-relative
preview refs for a future read-only probe, but it does not authorize execution.

No real `asset_archive/` read was performed while preparing this gate. The refs
below were selected from already checked-in documentation and schema examples.
They are treated as unverified strings until a separate exact-read activation
gate is explicitly opened.

## Gate Identity

```yaml
phase: review_console_asset_archive_exact_read_preview_probe_gate
gate_status: prepared_not_authorized
gate_type: exact_read_probe_gate
source_adapter_contract_ref: docs/review_console_asset_archive_readonly_preview_adapter_contract.md
fixture_ref: tests/schema_examples/ASSET_ARCHIVE_EXACT_READ_PREVIEW_PROBE_GATE.example.json
execution_mode: exact_read_probe_gate_no_execution
can_execute_now: false
requires_separate_activation: true
```

## Selected Preview Refs

These are the only refs allowed by a future probe if that probe is separately
activated:

```yaml
selected_preview_refs:
  - preview_ref: asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp
    manifest_ref: asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/manifest.json
    lane: accepted
    css_skin_fallback: product_still_life
    selection_source_ref: docs/P4_REVIEW_CONSOLE_PORTABLE_CAPSULE_STATIC_READER.md
  - preview_ref: asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/preview.webp
    manifest_ref: asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/manifest.json
    lane: accepted
    css_skin_fallback: studio_dashboard
    selection_source_ref: tests/schema_examples/full_asset_archive_manifest.example.json
  - preview_ref: asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp
    manifest_ref: asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/manifest.json
    lane: failure
    css_skin_fallback: evidence_blocker
    selection_source_ref: docs/P5K_REVIEW_CONSOLE_STATIC_FAILURE_CAPSULE_DISPLAY.md
```

## Future Probe Limits

```yaml
future_probe_limits:
  max_preview_refs: 3
  max_manifest_reads: 3
  max_preview_loads: 3
  retry_allowed: false
  fallback_to_glob_allowed: false
  directory_listing_allowed: false
  broad_asset_archive_glob_allowed: false
  allowed_operation: read_selected_manifest_and_preview_refs_only
```

## Future Mapping

If a later gate activates the probe, the adapter may produce a
`preview_display_state` overlay only for these selected refs:

```yaml
preview_display_state_overlay:
  target_draft_output_key: preview_display_state
  preserve_current_review_session_version: true
  thumbnail_ref_source: selected_preview_refs.preview_ref
  manifest_ref_source: selected_preview_refs.manifest_ref
  css_skin_fallback_source: selected_preview_refs.css_skin_fallback
  do_not_infer_archive_approval: true
  do_not_infer_production_candidate_readiness: true
  do_not_infer_memory_readiness: true
```

## Stop Conditions

Stop instead of executing if any future probe needs:

- a fourth preview ref
- a directory listing
- `asset_archive/**`
- a path outside `asset_archive/accepted_samples/` or
  `asset_archive/failure_samples/`
- an original asset or `runs/` source image
- preview creation, copy, overwrite, deletion, hash extraction, or dimension
  extraction
- provider/plugin/API/image generation
- DailyNote or VCP memory write
- production candidate write
- absolute paths, secrets, tokens, cookies, raw chat history, or base64 image
  payloads

## Validation

Local validation for this gate:

```text
node --check scripts/validate_asset_archive_exact_read_preview_probe_gate.js
node --check scripts/validators/review_console/validate_asset_archive_exact_read_preview_probe_gate.js
node scripts/validate_asset_archive_exact_read_preview_probe_gate.js
```

The validator must read only this gate document, the gate example JSON, and its
own source. It must not open, list, hash, inspect, or load real `asset_archive/`
contents.
