# Failure Sample Preview Capsules

This directory is the planned Git-portable evidence location for failure sample previews.

No failure sample capsule is currently created by this README.

Future failure samples should use this layout only after a separate exact authorization:

```text
asset_archive/failure_samples/<sample_id>/
  manifest.json
  preview.webp
  failure_record.json
  review_record.json
```

Rules:

- `preview.webp` is the portable preview artifact committed to Git only after explicit source and conversion authorization.
- The preview long edge must be `512`.
- `manifest.json` records the preview sha256.
- Base64 evidence is not used.
- Original image sha256 is not required for portable validation.
- Failure samples are never production candidates.
- Failure samples may support future failure-learning drafts, but this directory does not authorize DailyNote or VCP memory writes.
- Creating, copying, converting, or generating `preview.webp` is not authorized by this README.

Non-authorization:

- no `asset_archive/failure_samples/<sample_id>/` capsule is created now
- no `manifest.json`, `preview.webp`, `failure_record.json`, or `review_record.json` sample file is created now
- no provider/plugin/API/image generation is authorized
- no DailyNote or VCP memory write is authorized
- no runtime, real manifest, VCPChat, or VCPToolBox read is authorized
- no production candidate is authorized
- no push, tag, release, or deploy is authorized

Future validation should mirror the accepted preview capsule guard style:

```powershell
node scripts/validate_failure_sample_capsule_registry.js
node scripts/validate_failure_sample_capsule_registry_negative_cases.js
node scripts/validate_failure_sample_capsule_registry.js --require-at-least=1
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

The first command is zero-sample safe. The second command is a future readiness
gate and should pass after at least one authorized failure sample capsule exists.
