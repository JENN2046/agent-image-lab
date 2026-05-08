# v6.2 Asset Index Interaction Implementation

## Status

```text
Phase: v6.2 — Asset Index Interaction
Status: draft_only, no-execution
Mode: A4.5 — Smart Local Autopilot under A4
```

## Objective

Make the Asset Index in v6 Product Runtime an interactive draft-only panel where users can edit and filter asset metadata entries. No disk writes, no image binary storage, no plugin/API/DailyNote/VCP memory calls.

## Scope

### In scope

1. Asset Index draft entry editing: asset_ref, asset_hash, asset_status, review_score, human_decision, memory_suitability, linked_case_id
2. asset_status toggle (draft / accepted_candidate / needs_human_review / rejected)
3. human_decision toggle (pending / accepted / rejected / needs_review)
4. memory_suitability toggle (not_evaluated / suitable / unsuitable)
5. review_score input (0-100 number or null)
6. asset_ref / asset_hash display and manual draft input
7. linked_case_id association
8. Simple local filter: all / accepted_candidate / needs_human_review / rejected / memory_suitable
9. All state lives in `v6_product_runtime_draft.asset_index`
10. All behavior stays draft_only / no-execution

### Out of scope

- Image viewer/previewer
- Real file reading
- Real runs/ directory scanning
- Image hash computation from real files
- File upload
- memory queue
- Plugin dashboard
- Release panel
- Real bridge
- submitDraft
- Multi-entry batch editing (code structure ready for future expansion, but only 1 primary entry this round)

## UI Layout

The Asset Index section in the v6 Product Runtime panel now contains:

1. **Filter bar** — `<select>` with 5 filter options + visible count display
2. **Entry editor** — `<fieldset>` with form controls for a single primary entry:
   - asset_ref (`<input>`)
   - asset_hash (`<input>`, can be null)
   - asset_status (`<select>`)
   - review_score (`<input type="number">`, 0-100 or empty=null)
   - human_decision (`<select>`)
   - memory_suitability (`<select>`)
   - linked_case_id (`<input>`)
3. **Readout** — `<dl>` showing current draft values
4. **Boundary text** — declares binary_stored=false, raw_path_stored=false, no disk writes

## Draft Structure

```yaml
v6_product_runtime_draft:
  asset_index:
    draft_only: true
    side_effects_performed: false
    no_execution_guard:
      api_called: false
      daily_note_called: false
      vcp_plugin_called: false
      disk_write_performed: false
      image_file_created: false
    filter_status: all | accepted_candidate | needs_human_review | rejected | memory_suitable
    entries:
      - asset_id: "draft-001"
        asset_ref: string
        asset_hash: string | null
        asset_status: draft | accepted_candidate | needs_human_review | rejected
        review_score: number | null
        human_decision: pending | accepted | rejected | needs_review
        memory_suitability: not_evaluated | suitable | unsuitable
        linked_case_id: string | null
        linked_task_id: string | null
        source: manual_draft
        binary_stored: false
        raw_path_stored: false
        created_at: ISO string
        updated_at: ISO string
    total_entries: 1
    indexed_count: 0
    searchable: true
```

## Boundary Rules

- `binary_stored` is always `false`
- `raw_path_stored` is always `false`
- `side_effects_performed` is always `false`
- `asset_hash` can be a sanitized string or `null`, but never a real image hash
- `asset_ref` must not contain a raw local absolute path
- No real file reads, no API calls, no plugin calls, no DailyNote writes, no VCP memory writes
- No submitDraft
- All changes are draft-only

## Guard

`runtime_guard.js` now exports `v6AssetIndexIsSafe(draft)` which checks:

- `asset_index` exists
- `draft_only === true`
- `side_effects_performed === false`
- `no_execution_guard` clean
- `entries` is array
- each entry's `asset_status` from allowed enum
- each entry's `human_decision` from allowed enum
- each entry's `memory_suitability` from allowed enum
- `binary_stored === false`
- `raw_path_stored === false`
- `asset_ref` does not match raw absolute path pattern
- `filter_status` from allowed enum

## Changed Files

- `review_console/runtime_prototype/app.js` — added v6.2 element references, interactive asset_index builder, renderer, event listeners
- `review_console/runtime_prototype/index.html` — replaced static `<dl>` with interactive form controls + readout
- `review_console/runtime_prototype/styles.css` — added v6.2 Asset Index styles
- `review_console/runtime_prototype/runtime_guard.js` — added `v6AssetIndexIsSafe()`, new enums
- `review_console/runtime_prototype/FIELD_MAPPING.md` — added asset_index field mapping

## New Files

- `docs/238_v6_2_asset_index_interaction.md` — this document
- `scripts/validate_v6_2_asset_index_interaction.js` — v6.2 validator
- `tests/schema_examples/v6_2_asset_index_interaction.example.yaml` — schema example

## Validation

Run:

```powershell
node scripts/validate_v6_2_asset_index_interaction.js
```
