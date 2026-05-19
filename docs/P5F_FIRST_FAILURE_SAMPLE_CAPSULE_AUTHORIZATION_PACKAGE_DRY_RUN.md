# P5F First Failure Sample Capsule Authorization Package Dry Run

```yaml
phase: p5f_first_failure_sample_capsule_authorization_package_dry_run
base_contract: AGENTS.md
mode: A4.8
intent: local_draft
risk_level: R2
status: completed_validated_pending_guarded_local_commit
```

## Purpose

Prepare the first Git-portable failure sample preview capsule authorization package without creating the capsule.

This package is a dry-run decision artifact. It selects the preferred failure candidate, records the exact future target layout, and defines the stop conditions for a later execution package.

## Current Decision

Recommended first failure sample:

```yaml
recommended_sample:
  sample_id: failure_french_summer_rattan_bag_v7_29_001
  source_phase: v7_29
  source_registry: failure_samples/failure_registry.yaml
  source_image: runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg
  source_image_exists_on_current_machine: true
  source_image_git_tracked: false
  source_image_ignored_by_git: true
  review_doc_ref: docs/285_v7_30_native_doubao_watermark_parameter_enforcement.md
  prompt_package_ref: prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v2.yaml
  resolved_by_accepted_sample: accepted_french_summer_rattan_bucket_bag_001
  recommended: true
```

Why this candidate:

- The local ignored source image currently exists.
- The sample is already listed in `failure_samples/failure_registry.yaml`.
- The failure tags are specific and useful: watermark / generated mark, clean corner failure, prompt watermark control weakness, and API payload enforcement gap.
- It has a clear downstream accepted sample resolution: `accepted_french_summer_rattan_bucket_bag_001`.
- It helps prove the product loop from failure evidence to accepted portable evidence without needing a new provider call.

## Candidate Scan

```yaml
candidates:
  - sample_id: failure_french_summer_rattan_bag_v7_29_001
    source_image: runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg
    source_exists_now: true
    source_git_tracked: false
    source_ignored_by_git: true
    review_record_available: true
    resolved_by_accepted_sample: accepted_french_summer_rattan_bucket_bag_001
    rank: 1
  - sample_id: failure_tennis_wallet_v7_21_001
    source_image: runs/real_generation/v7_21_native_doubao_first_real_run/native_doubao_1778320041596_0.jpg
    source_exists_now: true
    source_git_tracked: false
    source_ignored_by_git: true
    review_record_available: true
    resolved_by_accepted_sample: accepted_product_still_life_tennis_wallet_001
    rank: 2
  - sample_id: failure_french_summer_rattan_bag_v7_26_001
    source_image: runs/real_generation/v7_26_native_doubao_french_summer_rattan_bag_first_run/native_doubao_1778324208801_0.jpg
    source_exists_now: true
    source_git_tracked: false
    source_ignored_by_git: true
    review_record_available: true
    resolved_by_accepted_sample: null
    rank: 3
  - sample_id: failure_positive_still_life_v10_9_001
    source_image: runs/a5_positive_still_life_prompt_v1/image/doubaogen/35bc0610-3f7c-4295-887b-8b2a2dcf8999.jpg
    source_exists_now: true
    source_git_tracked: false
    source_ignored_by_git: true
    review_record_available: true
    resolved_by_accepted_sample: null
    rank: 4
```

The v10.4 and v10.5 rejected A5 source images are not recommended for the first capsule on this machine because the recorded ignored source files are not currently present.

## Future Target Layout

If separately authorized later, the exact future target should be:

```text
asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/
  manifest.json
  preview.webp
  failure_record.json
  review_record.json
```

The future `preview.webp` must use:

```yaml
preview:
  format: webp
  long_edge: 512
  base64_used: false
  original_sha256_required_for_portable_validation: false
```

## Future Execution Authorization Shape

The future execution package should authorize only these writes:

```yaml
allowed_write_paths:
  - asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/manifest.json
  - asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp
  - asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/failure_record.json
  - asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/review_record.json
```

The future execution package should use a dedicated failure-capsule creator or a scoped extension to the existing preview capsule creator. The current `scripts/create_preview_capsule.js` only supports accepted samples and must not be reused for failure samples without a separate code change and validation.

## Required Future Validation

After a later authorized creation, validation should include:

```powershell
node scripts/validate_failure_sample_capsule_registry.js --require-at-least=1
node scripts/validate_failure_sample_capsule_registry_negative_cases.js
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

If a new failure capsule creation script is added or modified, also run:

```powershell
node --check <changed-js-file>
```

## Stop Conditions

Stop before future execution if any of these are true:

- the source image is missing
- the target directory already contains non-placeholder files
- the future write set would include any path outside `asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/`
- a provider/plugin/API/image generation action would be needed
- a DailyNote or VCP memory write would be needed
- runtime, real manifest, VCPChat, or VCPToolBox access would be needed
- the operation would create a production candidate
- the operation would require push, tag, release, or deploy
- the future validator would need original image availability to pass

## Explicit Non-Authorization

This dry-run package does not authorize:

- creating `asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/`
- creating, copying, converting, or generating `preview.webp`
- writing `manifest.json`, `failure_record.json`, or `review_record.json`
- adding or modifying a capsule creation script
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
recommended_future_sample_id: failure_french_summer_rattan_bag_v7_29_001
future_creation_requires_separate_authorization: true
future_script_change_requires_separate_local_validation: true
capsule_created_now: false
preview_created_or_copied_now: false
provider_plugin_api_image_generation_performed: false
DailyNote_or_VCP_memory_write_performed: false
runtime_or_real_manifest_read_performed: false
production_candidate_created: false
push_tag_release_deploy_performed: false
```
