# Review Console Asset Archive Real-preview Render Gate Draft

Status: local render gate draft only. This document does not authorize real
preview rendering, browser image loading, another `asset_archive/` read,
provider call, plugin call, API call, image generation, DailyNote write, VCP
memory write, commit, push, release, or deploy.

## Purpose

Define the next gate after the read-only adapter mapping draft. The mapping
draft proved that three receipt-backed preview refs can be represented inside
`preview_display_state` as ref-only records. This render gate defines the
separate conditions that must be true before those refs may be loaded as real
preview images in the Review Console.

The current task stays non-rendering:

- no browser image load
- no `thumbnail_ref` population
- no `asset_archive/` directory listing
- no additional manifest or preview binary read
- no hash, dimensions, copy, move, or write
- no production candidate inference
- no provider/plugin/API/image generation

## Gate Identity

```yaml
phase: review_console_asset_archive_real_preview_render_gate
gate_status: prepared_not_authorized
gate_type: real_preview_render_gate
source_mapping_ref: tests/schema_examples/ASSET_ARCHIVE_READONLY_PREVIEW_ADAPTER_MAPPING_DRAFT.example.json
target_contract: preview_display_state
can_execute_now: false
can_render_real_preview_now: false
actual_render_execution_authorized_now: false
render_execution_decision_state: undecided
requires_separate_render_activation: true
```

## Selected Preview Refs

The first render gate is limited to the three refs already present in the
mapping draft:

```text
asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp
asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/preview.webp
asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp
```

No fourth ref, wildcard, directory, original asset, absolute path, or remote URL
is allowed by this gate.

## Future Activation Question

Before any real preview render may occur, ask this exact question and wait for a
clear yes/no answer:

```text
Render the 3 selected asset_archive preview refs in the Review Console now, yes or no?
```

Ambiguous continuation is not enough.

## Future Render Boundary

A later activation may only allow the browser/UI to load the three selected
existing preview refs. It must not authorize generation, mutation, promotion, or
memory writes.

```yaml
future_allowed_operation: browser_load_existing_preview_refs_only
max_preview_refs: 3
max_browser_preview_loads: 3
max_manifest_reads: 0
max_node_preview_binary_reads: 0
thumbnail_ref_population_allowed_only_after_activation: true
css_skin_fallback_required: true
receipt_required: true
rollback_plan: restore thumbnail_ref=null and render_mode=css_skin_only
```

## Stop Conditions

Stop before rendering if any of the following appears:

- the mapping draft no longer has exactly 3 display samples
- any selected preview ref differs from the mapping draft
- `thumbnail_ref` becomes populated before activation
- `can_render_real_preview_now` becomes true in this draft
- a new `asset_archive/` read, directory listing, or glob is needed
- a hash, dimensions extraction, copy, move, or write is needed
- original assets, source images, absolute paths, remote URLs, secrets, cookies,
  tokens, or raw private data are involved
- provider/plugin/API/image generation is needed
- DailyNote/VCP memory or production candidate write is needed
- push/tag/release/deploy is needed

## Validation

Local validation for this draft:

```text
node --check scripts/validate_asset_archive_real_preview_render_gate.js
node --check scripts/validators/review_console/validate_asset_archive_real_preview_render_gate.js
node scripts/validate_asset_archive_real_preview_render_gate.js
```

The validator may read only this document, the render gate example, the mapping
draft example, and its own source. It must not inspect or open real
`asset_archive/` contents.
