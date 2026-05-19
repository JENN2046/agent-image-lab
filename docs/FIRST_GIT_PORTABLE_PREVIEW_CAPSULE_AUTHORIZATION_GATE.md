# First Git-Portable Preview Capsule Authorization Gate

base_contract: AGENTS.md
mode: A4.8 authorization planning only
status: draft_not_authorized_for_asset_write

## Purpose

Prepare the smallest future authorization package for the first
Git-portable accepted sample preview capsule.

## Target Capsule Layout

```text
asset_archive/accepted_samples/<sample_id>/
  manifest.json
  preview.webp
  import_record.json
  review_record.json
  approval_record.json
```

## Required Contract

```yaml
preview:
  file_name: preview.webp
  format: webp
  long_edge: 512
  sha256_in_manifest: true
  git_tracked: true
manifest:
  base64_allowed: false
  original_sha256_allowed: false
  original_required_for_portable_validation: false
chain:
  import_record: import_record.json
  review_record: review_record.json
  approval_record: approval_record.json
```

## Future Authorization Must Name

- exact `sample_id`
- exact source asset or approved preview source
- exact output capsule directory
- whether local image conversion to `preview.webp` is allowed
- validation commands to run after capsule creation

## Validation Required After Future Authorization

```text
verify preview.webp exists
verify preview.webp long_edge == 512
verify preview sha256 matches manifest
verify manifest forbids Base64 and original sha256
run relevant recoverability validators
run powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Non-Authorization

- no preview creation now
- no image copy or conversion now
- no provider/API/plugin call
- no image generation
- no DailyNote or VCP memory write
- no runtime/VCPChat/VCPToolBox/real manifest read
- no production candidate or failure sample write
- no push/tag/release/deploy
