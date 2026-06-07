# Review Console Asset Archive Read-only Preview Adapter Contract Draft

Status: local contract draft only. This document does not authorize a real
`asset_archive/` read, image load, copy, write, provider call, plugin call, API
call, DailyNote write, VCP memory write, commit, push, release, or deploy.

## Purpose

Define the first narrow contract for a future Review Console adapter that can
project already archived preview images into `preview_display_state` without
mutating the archive or promoting a production candidate.

The current task is only a local contract surface:

- no `asset_archive/` directory read
- no manifest read
- no preview image binary read
- no browser preview load
- no filesystem write outside this repository
- no provider, plugin, API, DailyNote, or VCP memory action

## Contract Identity

```yaml
adapter_id: asset_archive_readonly_preview_adapter_v0
phase: review_console_asset_archive_readonly_preview_adapter_contract_draft
contract_status: draft_no_real_read
draft_output_key: asset_archive_readonly_preview_adapter_state
consumer_contract: preview_display_state
execution_mode: local_contract_no_real_asset_archive_read
source_mode: asset_archive_repo_relative_preview_refs_to_preview_display_state
can_execute_now: false
```

## Future Read Boundary

A future exact-read probe may be authorized separately. That future probe must
stay within this read boundary:

```yaml
future_allowed_read_ref_patterns:
  - asset_archive/accepted_samples/{sample_id}/manifest.json
  - asset_archive/accepted_samples/{sample_id}/preview.webp
  - asset_archive/failure_samples/{sample_id}/manifest.json
  - asset_archive/failure_samples/{sample_id}/preview.webp
max_manifest_reads: 3
max_preview_loads: 3
allowed_operation: read_existing_preview_refs_only
```

Forbidden in this draft and in the first future probe:

- reading `asset_archive/original_assets/`
- reading source images from `runs/`
- copying, moving, creating, overwriting, deleting, or hashing image binaries
- writing `asset_archive/`, `accepted_samples/`, `failure_samples/`, or
  `production/`
- provider/plugin/API/image generation
- DailyNote or VCP memory write
- absolute private paths, secrets, cookies, tokens, raw chat history, or base64
  image payloads

## Adapter Output Shape

The adapter produces only sanitized repo-relative preview references and guard
fields. The draft example lives at:

```text
tests/schema_examples/ASSET_ARCHIVE_READONLY_PREVIEW_ADAPTER_CONTRACT.example.json
```

The core output object is:

```yaml
asset_archive_readonly_preview_adapter_contract:
  adapter_id: asset_archive_readonly_preview_adapter_v0
  contract_status: draft_no_real_read
  draft_output_key: asset_archive_readonly_preview_adapter_state
  preview_records: []
  preview_display_state_mapping: {}
  future_probe_gate:
    can_execute_now: false
  guard:
    contract_draft_only: true
    real_asset_archive_read_performed: false
    asset_archive_manifest_read_performed: false
    asset_archive_preview_binary_read_performed: false
    preview_loaded_or_rendered: false
    file_write_performed: false
```

## Mapping To `preview_display_state`

Future adapter rows map into the existing static proxy contract without changing
the review session source of truth:

| Adapter field | Preview display field | Rule |
| --- | --- | --- |
| `adapter_preview_id` | `display_samples[].preview_id` | Stable local UI id |
| `source_sample_id` | `display_samples[].version_id` | Use sample id only as display identity |
| `preview_ref` | `display_samples[].thumbnail_ref` | Future exact-read only |
| `preview_mime_type` | `display_samples[].preview_mime_type` | Allow `image/webp`, `image/jpeg`, `image/png` |
| `css_skin_fallback` | `display_samples[].skin_id` | Used whenever preview load is unavailable |
| `guard.*` | `preview_display_state.guard.*` | False in this draft |

The adapter must never infer approval, archive status, production readiness, or
memory readiness from the mere existence of a preview file.

## Stop Conditions

Stop before execution if any of the following becomes necessary:

- a real `asset_archive/` directory listing
- a broad glob such as `asset_archive/**`
- an absolute local path
- a secret-bearing path or environment file
- preview source outside the exact repo-relative allowlist
- more than 3 manifest reads or more than 3 preview loads
- original image read, preview generation, copy, write, or hash extraction
- production candidate write
- DailyNote or VCP memory write
- provider/plugin/API/image generation call

## Validation

Local validation for this draft:

```text
node --check scripts/validate_asset_archive_readonly_preview_adapter_contract.js
node --check scripts/validators/review_console/validate_asset_archive_readonly_preview_adapter_contract.js
node scripts/validate_asset_archive_readonly_preview_adapter_contract.js
```

The validator must remain a narrow local validator. It may read only this
contract document, the example JSON, and its own source file. It must not inspect
or open real `asset_archive/` contents.
