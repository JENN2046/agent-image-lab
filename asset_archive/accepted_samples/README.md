# Accepted Sample Preview Capsules

This directory is the Git-portable evidence location for accepted sample previews.

Each accepted sample should use this layout:

```text
asset_archive/accepted_samples/<sample_id>/
  manifest.json
  preview.webp
  import_record.json
  review_record.json
  approval_record.json
```

Rules:

- `preview.webp` is the portable preview artifact committed to Git.
- The preview long edge must be `512`.
- `manifest.json` records the preview sha256.
- Base64 evidence is not used.
- Original image sha256 is not required for portable validation.
- Old `runs/` images may be used later only as explicitly authorized source material.
- Creating, copying, or converting `preview.webp` is not authorized by this README.

Legacy note:

- `asset_archive/accepted/` is a legacy bucket name.
- New accepted sample evidence capsules should use `asset_archive/accepted_samples/<sample_id>/`.

Current capsules:

- `accepted_french_summer_rattan_bucket_bag_001/` — first Git-portable preview capsule, generated from the local v7.31 accepted sample source with `preview.webp` long edge `512`.

Validation:

```powershell
npm run validate-preview-capsule -- --sample-id=accepted_french_summer_rattan_bucket_bag_001
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
```

The registry-driven validator reads capsule directories only; it does not create, copy, convert, or generate image files.
The negative-case validator builds temporary text fixtures under ignored `.agent_private/` and cleans them up before exit.
