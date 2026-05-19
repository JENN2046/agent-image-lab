# P4 Review Console Portable Capsule Static Reader

base_contract: AGENTS.md
mode: A4.8 static prototype enhancement
status: implemented_validated

## Purpose

Let the Review Console static prototype display Git-portable preview capsule
evidence without connecting to runtime, VCPChat, VCPToolBox, provider, plugin,
API, DailyNote, or VCP memory.

## Implemented Surface

The static prototype now carries `portable_preview_capsule_evidence` in
`mock_data.js`, renders a compact capsule summary in the existing Artifact
Evidence panel, and includes the seed in draft output.

Current seed:

```yaml
sample_id: accepted_french_summer_rattan_bucket_bag_001
capsule_root: asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/
manifest_ref: asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/manifest.json
preview_ref: asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp
preview_format: webp
preview_long_edge: 512
validation_status: git_portable_preview_evidence_verified
registry_validator_status: registry_driven_preview_capsules_verified
clone_portable_validation_status: passed
```

## Non-Authorization

- no file read from `asset_archive/`
- no fetch, XHR, WebSocket, storage, IPC, or runtime
- no file write
- no preview creation, copy, conversion, or image generation
- no provider, plugin, API, DailyNote, or VCP memory call
- no VCPChat, VCPToolBox, or real manifest read
- no accepted_samples write, failure_samples write, or production candidate
- no push, tag, release, or deploy

## Validation

```powershell
node --check review_console/static_prototype/app.js
node --check review_console/static_prototype/mock_data.js
node scripts/validate_v14_135_review_console_import_reader_safety_review.js
node scripts/validate_review_console_adapter_handoff.js
git diff --check
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```
