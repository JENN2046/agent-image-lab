# v6.3 Session Store Interaction

## Status

draft_only — local interaction design, no execution.

## Objective

Upgrade Session Store from read-only display to interactive draft-only session management panel supporting session identity display, import preview states, restore candidate toggle, and session list draft.

## Scope

- Session Store draft structure under `v6_product_runtime_draft.session_store`
- Interactive form controls for linked_task_id, linked_asset_refs, import_preview_status, import_preview_reason_cn, restore_candidate
- Readout for session_id, fingerprint, export_ready, import_compatible, session_list count
- `v6SessionStoreIsSafe()` guard in runtime_guard.js
- v6.3 validator (16 checks)
- All operations draft_only, no disk write, no localStorage, no API calls

## UI Layout

```
Session Store
├── current_session_id: [display]
├── fingerprint: [display]
├── export_ready: [display]
├── import_compatible: [display]
├── linked_task_id: [input] → readout
├── linked_asset_refs: [input] → readout
├── import_preview_status: [select]
├── import_preview_reason_cn: [input]
├── restore_candidate: [checkbox]
└── session_list entries: [display count]
```

## Draft Structure

```yaml
session_store:
  draft_only: true
  side_effects_performed: false
  no_execution_guard: { clean }
  current_session:
    session_id: string
    fingerprint: string | null
    linked_task_id: string | null
    linked_asset_refs: list
    export_ready: true
    import_compatible: true
    restore_candidate: boolean
    created_at: string
    updated_at: string
  import_preview:
    status: not_loaded | valid | stale | tampered | incompatible
    reason_cn: string
    candidate_session_id: string | null
    candidate_fingerprint: string | null
    side_effects_performed: false
  session_list:
    entries:
      - session_id: string
        fingerprint: string | null
        linked_task_id: string | null
        linked_asset_refs: list
        source: current_runtime | import_preview | manual_draft
        restore_candidate: boolean
        stale: boolean
        tampered: boolean
        incompatible: boolean
        raw_payload_stored: false
        disk_write_performed: false
        created_at: string
        updated_at: string
    total_entries: number
    visible_count: number
  boundary_cn: string
```

## Boundary Rules

- `draft_only=true` always
- `side_effects_performed=false` always
- `disk_write_performed=false` always
- `raw_payload_stored=false` always
- No localStorage/sessionStorage/IndexedDB
- No file read/write
- No API/plugin/DailyNote/VCP memory calls

## Guard Description

`v6SessionStoreIsSafe()` checks:
- session_store exists
- draft_only === true
- side_effects_performed === false
- no_execution_guard clean
- current_session exists
- current_session.session_id is string
- current_session.linked_asset_refs is array
- import_preview.status in allowed enum
- import_preview.side_effects_performed === false
- session_list.entries is array
- each entry.raw_payload_stored === false
- each entry.disk_write_performed === false
- each entry.linked_asset_refs is array

## Changed Files

- review_console/runtime_prototype/app.js
- review_console/runtime_prototype/index.html
- review_console/runtime_prototype/styles.css
- review_console/runtime_prototype/runtime_guard.js
- review_console/runtime_prototype/FIELD_MAPPING.md
- scripts/validate_runtime_prototype_smoke.js
- scripts/validate_v6_0_product_runtime_kickoff.js
- scripts/validate_v6_1_task_panel_interaction.js
- scripts/validate_v6_2_asset_index_interaction.js
- scripts/validate_mvp.ps1

## New Files

- docs/239_v6_3_session_store_interaction.md
- scripts/validate_v6_3_session_store_interaction.js
- tests/schema_examples/v6_3_session_store_interaction.example.yaml

## Validation

```powershell
node scripts/validate_v6_3_session_store_interaction.js
node scripts/validate_v6_2_asset_index_interaction.js
node scripts/validate_v6_1_task_panel_interaction.js
node scripts/validate_v6_0_product_runtime_kickoff.js
node scripts/validate_runtime_prototype_smoke.js
node scripts/validate_runtime_prototype_suite.js
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```
