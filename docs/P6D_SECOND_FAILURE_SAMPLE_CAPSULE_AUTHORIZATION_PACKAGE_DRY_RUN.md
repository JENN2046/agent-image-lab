# P6D Second Failure Sample Capsule Authorization Package Dry Run

```yaml
phase: p6d_second_failure_sample_capsule_authorization_package_dry_run
base_contract: AGENTS.md
mode: A4.8
intent: local_draft
risk_level: R2
status: completed_validated_pending_guarded_local_commit
```

## Purpose

Prepare the second Git-portable failure sample preview capsule authorization package without creating the capsule, creating or converting `preview.webp`, or modifying `asset_archive/`.

This dry-run selects the preferred second failure candidate, records candidate evidence, defines the exact future target layout, and preserves the A5 hard stops for any later execution package.

## Candidate Scan Method

Read-only scan inputs:

```text
failure_samples/failure_registry.yaml
runs/real_generation/**/*
asset_archive/failure_samples/
docs/278_v7_21_native_doubao_first_real_generation_post_run_review.md
docs/283_v7_27_watermark_provenance_diagnostic.md
docs/285_v7_30_native_doubao_watermark_parameter_enforcement.md
```

Current registry facts:

```yaml
failure_registry_count: 3
existing_git_portable_failure_capsules: 1
existing_capsule:
  - failure_french_summer_rattan_bag_v7_29_001
source_images_checked_read_only: true
asset_archive_modified: false
preview_created_or_converted: false
```

## Candidate List

| Rank | sample_id | source image path | source exists now | existing capsule | review / failure evidence | failure tags | accepted link | long_edge=512 suitability |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `failure_tennis_wallet_v7_21_001` | `runs/real_generation/v7_21_native_doubao_first_real_run/native_doubao_1778320041596_0.jpg` | yes | no | `failure_samples/failure_registry.yaml`; `docs/278_v7_21_native_doubao_first_real_generation_post_run_review.md` | `watermark_or_generation_mark_risk`; `foreground_tennis_balls_too_large`; `background_material_direction_drift`; `commercial_usability_partial` | `accepted_product_still_life_tennis_wallet_001` | yes, primary candidate |
| 2 | `failure_french_summer_rattan_bag_v7_26_001` | `runs/real_generation/v7_26_native_doubao_french_summer_rattan_bag_first_run/native_doubao_1778324208801_0.jpg` | yes | no | `failure_samples/failure_registry.yaml`; `docs/283_v7_27_watermark_provenance_diagnostic.md` | `watermark_or_generated_mark_present`; `product_partially_obstructed_by_leaf`; `readable_page_texture_risk`; `commercial_usability_partial` | none recorded | yes, backup candidate after relation decision |
| control | `failure_french_summer_rattan_bag_v7_29_001` | `runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg` | yes | yes | `asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/`; `docs/285_v7_30_native_doubao_watermark_parameter_enforcement.md` | `watermark_or_generated_mark_present`; `clean_image_corners_failed`; `prompt_watermark_control_insufficient`; `api_payload_missing_watermark_false` | `accepted_french_summer_rattan_bucket_bag_001` | not eligible as second capsule because the capsule already exists |

## Recommendation

Primary recommendation:

```yaml
recommended_sample:
  sample_id: failure_tennis_wallet_v7_21_001
  source_phase: v7_21
  source_registry: failure_samples/failure_registry.yaml
  source_image: runs/real_generation/v7_21_native_doubao_first_real_run/native_doubao_1778320041596_0.jpg
  source_image_exists_on_current_machine: true
  source_image_git_tracked: false
  review_doc_ref: docs/278_v7_21_native_doubao_first_real_generation_post_run_review.md
  prompt_package_ref: prompts/image_generation/product_still_life_outdoor_tennis_wallet_hero_v2.yaml
  resolved_by_accepted_sample: accepted_product_still_life_tennis_wallet_001
  target_root: asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/
  recommended: true
```

Why this candidate:

- It is already represented in `failure_samples/failure_registry.yaml`.
- Its ignored local source image currently exists on this machine.
- It does not already have a Git-portable failure capsule.
- It has a direct `resolved_by_accepted_sample` link to the second accepted preview capsule.
- Its failure tags are distinct from the first failure capsule and expand the evidence track from rattan-bag watermark enforcement into tennis-wallet composition and material drift.

Backup candidate:

```yaml
backup_sample:
  sample_id: failure_french_summer_rattan_bag_v7_26_001
  source_image_exists_on_current_machine: true
  existing_capsule: false
  blocker: missing_resolved_by_accepted_sample
  usable_after: accepted-link decision or explicit authorization to create an unresolved failure-learning capsule
```

No second backup is recommended from the current failure registry because the remaining registered sample already has a capsule.

## Future Target Layout

If separately authorized later, the exact future target should be:

```text
asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/
  manifest.json
  preview.webp
  failure_record.json
  review_record.json
```

The future preview standard remains:

```yaml
preview:
  format: webp
  long_edge: 512
  base64_used: false
  original_sha256_required_for_portable_validation: false
```

## Future Execution Authorization Shape

A later creation request should authorize only these writes:

```yaml
allowed_write_paths:
  - asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/manifest.json
  - asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/preview.webp
  - asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/failure_record.json
  - asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/review_record.json
```

Suggested future command:

```powershell
node scripts/create_failure_sample_capsule.js --sample-id=failure_tennis_wallet_v7_21_001 --source-image=runs/real_generation/v7_21_native_doubao_first_real_run/native_doubao_1778320041596_0.jpg --long-edge=512 --confirm-create=true
```

That command is not authorized by this document.

## Required Future Validation

After a later authorized creation, run:

```powershell
node scripts/validate_failure_sample_capsule_registry.js --require-at-least=2
node scripts/validate_failure_sample_capsule_registry_negative_cases.js
node scripts/validate_failure_sample_capsule_creator_dry_run.js
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
node scripts/validate_capsule_registry_report_v2.js
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Stop Conditions

Stop before future creation if any condition is true:

- the source image is missing
- `asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/` already contains capsule files
- any future write would escape the four-file allowlist
- the future creator would overwrite an existing capsule
- registry evidence or review evidence is missing
- the accepted link to `accepted_product_still_life_tennis_wallet_001` becomes invalid
- provider/plugin/API/image generation would be needed
- DailyNote or VCP memory write would be needed
- runtime, real manifest, VCPChat, or VCPToolBox access would be needed
- production candidate creation would be needed
- push, tag, release, or deploy would be needed

## Explicit Non-Authorization

This dry-run does not authorize:

- creating `asset_archive/failure_samples/failure_tennis_wallet_v7_21_001/`
- creating, copying, converting, or generating `preview.webp`
- writing `manifest.json`, `failure_record.json`, or `review_record.json`
- modifying any existing capsule
- modifying `asset_archive/`
- provider contact
- plugin calls
- API calls
- image generation
- DailyNote writes
- VCP memory writes
- runtime execution
- real manifest reads
- VCPChat or VCPToolBox reads
- production candidate creation
- push, tag, release, or deploy

## Result

```yaml
authorization_package_ready: true
recommended_future_sample_id: failure_tennis_wallet_v7_21_001
backup_sample_id: failure_french_summer_rattan_bag_v7_26_001
future_creation_requires_separate_authorization: true
capsule_created_now: false
preview_created_or_copied_now: false
asset_archive_modified: false
provider_plugin_api_image_generation_performed: false
DailyNote_or_VCP_memory_write_performed: false
runtime_or_real_manifest_read_performed: false
production_candidate_created: false
push_tag_release_deploy_performed: false
```
