# Second Git-Portable Preview Capsule Authorization Gate

base_contract: AGENTS.md
mode: A4.8 authorized local capsule creation completed
status: completed_validated_committed

## Purpose

Prepare the second Git-portable accepted sample preview capsule without creating,
copying, converting, or generating any image file.

This gate is a future authorization package. It does not authorize execution by
itself.

## Pre-Execution Check — 2026-05-19

```yaml
sample_id: accepted_product_still_life_tennis_wallet_001
source_image_exists: true
source_image_path: runs/real_generation/v7_24_native_doubao_v3_single_real_run/native_doubao_1778322474131_0.jpg
source_image_git_tracked: false
source_image_git_ignored: true
source_image_size_bytes: 1104027
source_image_format: jpeg
source_image_width: 1920
source_image_height: 1920
target_capsule_exists: false
sharp_available: true
sharp_version: 0.33.5
create_script_supports_sample: true
create_script_source_arg_guard: exact_match_required
create_script_long_edge_guard: exact_match_required
preview_created: false
manifest_written: false
capsule_created: false
```

The repository was ready for a separate explicit creation authorization.

## Creation Closeout — 2026-05-19

```yaml
sample_id: accepted_product_still_life_tennis_wallet_001
creation_authorized_by_user: true
created_capsule_root: asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/
created_files:
  - manifest.json
  - preview.webp
  - import_record.json
  - review_record.json
  - approval_record.json
preview_format: webp
preview_width: 512
preview_height: 512
preview_long_edge: 512
preview_sha256: 125f5fb6fad2c72c23a345ec41fea49ce89285e66056410817eb2b0d0f86542b
registry_total_samples_after_creation: 2
registry_passed_samples_after_creation: 2
commit: fffa45b
push_performed: false
```

Creation did not call provider/plugin/API and did not perform image generation.
It converted an already-present local accepted source image into the Git-tracked
portable `preview.webp` authorized by this package.

## Candidate Scan

Scan date: 2026-05-19.

Repository source scan found only one Git-tracked preview capsule and two local
registry source images currently present under ignored `runs/`:

| rank | sample_id | source path exists | git tracked source | current capsule exists | chain status | recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `accepted_product_still_life_tennis_wallet_001` | true | false | false | registry + review doc + prompt package present; import/review/approval capsule records need to be created from tracked evidence | recommended second capsule |
| 2 | `accepted_french_summer_rattan_bucket_bag_001` | true | false | true | complete capsule already present | do not duplicate |
| 3 | `accepted_french_summer_rattan_bucket_bag_002_shot_1` | false | false | false | tracked review doc present; source image unavailable on this machine | later only |
| 4 | `accepted_french_summer_rattan_bucket_bag_003_shot_2` | false | false | false | tracked review doc present; source image unavailable on this machine | later only |
| 5 | `accepted_french_summer_rattan_bucket_bag_004_shot_3` | false | false | false | tracked review doc present; source image unavailable on this machine | later only |
| 6 | `accepted_womens_resort_relaxed_knit_codex_v2_001` | false | false | false | tracked review/formal package refs present; source image unavailable on this machine | later only |
| 7 | `accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001` | false | false | false | tracked review/formal package refs present; source image unavailable on this machine | later only |
| 8 | `accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001` | false | false | false | tracked review/formal package refs present; source image unavailable on this machine | later only |

Recommended selected sample:

```yaml
sample_id: accepted_product_still_life_tennis_wallet_001
source_image_path: runs/real_generation/v7_24_native_doubao_v3_single_real_run/native_doubao_1778322474131_0.jpg
source_image_git_tracked: false
source_image_in_local_ignored_runs: true
target_capsule: asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/
prompt_package_ref: prompts/image_generation/product_still_life_outdoor_tennis_wallet_hero_no_text_v3.yaml
review_doc_ref: docs/281_v7_24_native_doubao_v3_post_run_review_accepted_candidate.md
registry_ref: accepted_samples/accepted_sample_registry.yaml
category: product_still_life
preview_format: webp
preview_long_edge: 512
base64_allowed: false
original_sha256_required: false
```

## Executed Scope

The explicit authorization created exactly this capsule:

```text
asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/
  manifest.json
  preview.webp
  import_record.json
  review_record.json
  approval_record.json
```

Executed command shape:

```powershell
npm run create-preview-capsule -- --sample-id=accepted_product_still_life_tennis_wallet_001 --source-image=runs/real_generation/v7_24_native_doubao_v3_single_real_run/native_doubao_1778322474131_0.jpg --long-edge=512
```

Completed validation:

```powershell
npm run validate-preview-capsule -- --sample-id=accepted_product_still_life_tennis_wallet_001
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Stop Conditions

Stop before any future re-execution if any are true:

- source image is missing
- target capsule directory already exists with non-empty content
- `preview.webp` would overwrite an existing tracked preview
- source sample is not present in `accepted_samples/accepted_sample_registry.yaml`
- review doc or prompt package ref is missing
- `sharp` is unavailable from the locked local dependency install
- any command would call provider/plugin/API/image generation
- any command would write DailyNote or VCP memory
- any command would read real manifest, VCPChat, or VCPToolBox
- any command would create production candidate, tag, release, deploy, or push

## Continuing Non-Authorization

- no additional `preview.webp` creation, copy, conversion, or generation by this gate
- no Base64 evidence
- no original image sha256 requirement
- no provider, plugin, API, or image generation
- no DailyNote or VCP memory write
- no runtime, real manifest, VCPChat, or VCPToolBox read
- no production candidate
- no push, tag, release, or deploy
