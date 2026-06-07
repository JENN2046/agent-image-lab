# Review Console Asset Archive Read-only Preview Adapter Mapping Draft

Status: local mapping draft only. This document maps the sealed exact-read probe
receipt back into a `preview_display_state`-compatible ref-only shape. It does
not authorize preview rendering, browser image loading, another `asset_archive/`
read, provider call, plugin call, API call, image generation, DailyNote write,
VCP memory write, commit, push, release, or deploy.

## Purpose

The exact-read probe receipt proved that three selected archived previews exist
and have RIFF/WebP headers. This draft turns that receipt into a narrow
`preview_display_state` mapping so the Review Console can reason about the
records without loading the real preview images yet.

The mapping is intentionally conservative:

- input source is only the sealed receipt JSON
- no new `asset_archive/` read
- no directory listing or glob
- no manifest raw body copy
- no preview binary copy
- no hash or dimension extraction
- no browser preview render
- no production candidate inference

## Contract Identity

```yaml
phase: review_console_asset_archive_readonly_preview_adapter_mapping_draft
mapping_status: draft_from_probe_receipt_no_render
source_receipt_ref: reports/review_console_asset_archive_readonly_preview_probe/asset_archive_exact_read_preview_probe_receipt_20260607.json
source_contract_ref: docs/review_console_asset_archive_readonly_preview_adapter_contract.md
consumer_contract: preview_display_state
draft_output_key: preview_display_state
execution_mode: receipt_to_preview_display_state_ref_only_no_render
source_mode: exact_read_probe_receipt_to_css_skin_preview_display_state
can_render_real_preview_now: false
```

## Mapping Rules

Each `receipt.selected_refs[]` row maps to one
`preview_display_state.display_samples[]` row:

| Receipt field | Preview display field | Rule |
| --- | --- | --- |
| `ref_id` | `version_id` | Use the probe ref id as display identity only |
| `preview.path` | `source_asset_ref` | Preserve repo-relative ref for future render gate |
| `manifest.path` | `source_manifest_ref` | Preserve repo-relative manifest ref only |
| `fallback_skin` | `skin_id` | Keep the existing CSS skin fallback |
| `preview.detected_container` | `adapter_evidence.detected_container` | Evidence only |
| `preview.file_size_bytes` | `adapter_evidence.file_size_bytes` | Evidence only, not dimensions |
| `manifest.root_keys` | `adapter_evidence.manifest_root_keys` | Key list only, no raw manifest body |

Rendering remains blocked by these fields:

```yaml
thumbnail_ref: null
render_mode: css_skin_only
real_preview_ref_present: true
real_preview_render_allowed: false
asset_archive_read_performed_by_mapping: false
preview_loaded_or_rendered: false
```

## Example

The golden mapping example lives at:

```text
tests/schema_examples/ASSET_ARCHIVE_READONLY_PREVIEW_ADAPTER_MAPPING_DRAFT.example.json
```

It contains exactly three display samples derived from the sealed receipt:

```text
accepted_french_summer_rattan_bucket_bag_001
accepted_product_still_life_tennis_wallet_001
failure_french_summer_rattan_bag_v7_29_001
```

## Stop Conditions

Stop before changing this draft into runtime behavior if any next step requires:

- loading `thumbnail_ref` with an actual `asset_archive` path
- rendering real preview images in the browser
- a fourth preview ref
- another real `asset_archive/` read
- directory listing, glob, hash, dimensions, copy, move, or write
- reading original assets or source images
- production candidate, accepted sample, failure sample, DailyNote, or VCP memory write
- provider/plugin/API/image generation

## Validation

Local validation for this draft:

```text
node --check scripts/validate_asset_archive_readonly_preview_adapter_mapping_draft.js
node --check scripts/validators/review_console/validate_asset_archive_readonly_preview_adapter_mapping_draft.js
node scripts/validate_asset_archive_readonly_preview_adapter_mapping_draft.js
```

The validator may read only this document, the example JSON, the sealed receipt,
and its own source. It must not inspect or open real `asset_archive/` contents.
