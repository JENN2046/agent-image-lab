# Second Git-Portable Preview Capsule Authorization Gate

base_contract: AGENTS.md
mode: A4.8 authorization package only
status: prepared_no_execution

## Purpose

Prepare the second Git-portable accepted sample preview capsule without creating,
copying, converting, or generating any image file.

This gate is a future authorization package. It does not authorize execution by
itself.

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

## Future Execution Scope

If explicitly authorized later, create exactly this capsule:

```text
asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/
  manifest.json
  preview.webp
  import_record.json
  review_record.json
  approval_record.json
```

Allowed future command shape:

```powershell
npm run create-preview-capsule -- --sample-id=accepted_product_still_life_tennis_wallet_001 --source-image=runs/real_generation/v7_24_native_doubao_v3_single_real_run/native_doubao_1778322474131_0.jpg --long-edge=512
```

Required future validation:

```powershell
npm run validate-preview-capsule -- --sample-id=accepted_product_still_life_tennis_wallet_001
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Stop Conditions

Stop before execution if any are true:

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

## Non-Authorization

- no `preview.webp` creation, copy, conversion, or generation by this gate
- no Base64 evidence
- no original image sha256 requirement
- no provider, plugin, API, or image generation
- no DailyNote or VCP memory write
- no runtime, real manifest, VCPChat, or VCPToolBox read
- no production candidate
- no push, tag, release, or deploy
