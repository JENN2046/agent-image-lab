# P6E Second Failure Sample Capsule Creation Record

```yaml
phase: p6e_second_failure_sample_capsule_creation
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R3
status: completed_validated_pending_guarded_local_commit
```

## Purpose

Create the second Git-portable failure sample preview capsule from the P6D authorization package.

## Created Capsule

```yaml
sample_id: failure_tennis_wallet_v7_21_001
target_root: asset_archive/failure_samples/failure_tennis_wallet_v7_21_001
source_image: runs/real_generation/v7_21_native_doubao_first_real_run/native_doubao_1778320041596_0.jpg
source_image_git_tracked: false
source_image_required_for_portable_validation: false
resolved_by_accepted_sample: accepted_product_still_life_tennis_wallet_001
```

Created files:

```text
asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/manifest.json
asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/preview.webp
asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/failure_record.json
asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/review_record.json
```

Preview:

```yaml
format: webp
width: 512
height: 512
long_edge: 512
sha256: 7170004f47f0da42577036b0e2ad70c8f152556b73a4cadb3238eb749e20b8fc
base64_used: false
original_sha256_recorded: false
```

Failure tags:

```yaml
failure_tags:
  - watermark_or_generation_mark_risk
  - foreground_tennis_balls_too_large
  - background_material_direction_drift
  - commercial_usability_partial
```

## Creator Update

`scripts/create_failure_sample_capsule.js` now reads registered failure metadata from `failure_samples/failure_registry.yaml` instead of supporting only the first hard-coded failure sample.

The creator still enforces:

- repository-root path containment
- exact source image match
- `long_edge=512`
- target directory must be empty or absent
- no overwrite of existing capsule files
- no provider/plugin/API/image generation/DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox

## Registry State After Creation

```yaml
accepted_capsules: 2
failure_capsules: 2
total_capsules: 4
resolved_by_links:
  - failure_french_summer_rattan_bag_v7_29_001 -> accepted_french_summer_rattan_bucket_bag_001
  - failure_tennis_wallet_v7_21_001 -> accepted_product_still_life_tennis_wallet_001
```

## Boundaries

Not performed:

- no provider contact
- no plugin call
- no API call
- no image generation
- no DailyNote write
- no VCP memory write
- no runtime execution
- no real manifest read
- no VCPChat or VCPToolBox read
- no production candidate creation
- no push, tag, release, or deploy

## Result

```yaml
capsule_created: true
preview_created_from_existing_local_source: true
preview_generation_by_provider: false
asset_archive_modified: true
registry_report_v2_updated_to_failure_count_2: true
review_console_static_state_updated_to_total_4: true
future_portable_validation_requires_old_runs_source: false
```
