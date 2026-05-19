# First Git-Portable Preview Capsule Authorization Gate

base_contract: AGENTS.md
mode: A4.8 authorization package only
status: retargeted_package_validated_pending_capsule_creation_authorization

## Purpose

Prepare the smallest explicit package for the first Git-portable accepted
sample preview capsule.

This package is concrete enough for human review, but it still does not
authorize creating, copying, converting, staging, committing, or pushing
`preview.webp`.

## Selected First Sample

```yaml
selected_sample_id: accepted_french_summer_rattan_bucket_bag_001
selection_reason: >
  The previously selected v14.131 womens knit original is not available on
  this computer. This accepted rattan bag sample is already registered and its
  project-relative source image exists locally, making it the smallest honest
  first target for a Git-portable preview capsule.
source_registry_ref: accepted_samples/accepted_sample_registry.yaml
source_category_ref: accepted_samples/categories/fashion_lifestyle_still_life.yaml
legacy_import_record_ref: registry_and_review_metadata_no_standalone_import_record
legacy_review_record_ref: docs/286_v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_post_run_review_accepted_candidate.md
legacy_approval_record_ref: docs/286_v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_post_run_review_accepted_candidate.md
legacy_original_path_ref: runs/real_generation/v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_run/native_doubao_1778327047448_0.jpg
legacy_original_available_on_current_machine: true
legacy_original_sha256_in_manifest_allowed: false
legacy_original_required_for_portable_validation: false
```

## Target Capsule Layout

```text
asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/
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

## Exact Future Allowed Target Paths

```yaml
exact_allowed_target_paths_after_separate_authorization:
  - asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/manifest.json
  - asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp
  - asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/import_record.json
  - asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/review_record.json
  - asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/approval_record.json
```

## Source Requirement

P1 cannot execute until the human supplies one exact source option:

```yaml
source_option_A_existing_preview_webp:
  source_preview_webp_path: "<TO_BE_FILLED_BY_USER>"
  requirements:
    - source must already be WebP
    - source long edge must already be 512
    - source must be approved by reviewer for this sample
source_option_B_existing_original_for_local_conversion:
  source_original_image_path: "runs/real_generation/v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_run/native_doubao_1778327047448_0.jpg"
  allowed_conversion:
    format: webp
    long_edge: 512
    preserve_aspect_ratio: true
  requirements:
    - exact source path must be named by user
    - conversion is local-only
    - no provider/API/plugin/image generation call
source_option_C_old_runs_restoration:
  status: not_recommended_for_p1
  reason: old runs restoration is superseded by the Git-portable preview route
```

If no exact source path is provided, the execution gate is blocked.

## Minimum Authorization Text

Use this text only when the source path is known. Replace exactly one
source path only if the human chooses a different approved source.

```text
批准执行 P1 first Git-portable preview capsule creation for
accepted_french_summer_rattan_bucket_bag_001：
允许在 Agent Image Lab 当前仓库内创建
asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/
下的 manifest.json、preview.webp、import_record.json、review_record.json、
approval_record.json；允许从
runs/real_generation/v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_run/native_doubao_1778327047448_0.jpg
读取已批准的本地源图片，并在本地生成 long_edge=512 的 preview.webp；允许计算
preview.webp sha256 并写入 manifest.json；允许把 registry/review/approval 链路
记录提取为 capsule 内 JSON 记录。

禁止 Base64；禁止 original sha256；禁止 provider/plugin/API/image generation；
禁止 DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox；禁止 production
candidate/failure sample 写入；禁止修改旧 runs/；禁止覆盖已存在目标文件；禁止
git add .；禁止 push/tag/release/deploy。

完成后运行 git diff --check、node scripts/validate_agent_board_state.js、
node scripts/validate_v14_231_git_tracked_preview_evidence_capsule_baseline.js、
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1，并停止汇报结果。
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

## Stop Conditions

- source path is missing, ambiguous, outside the approved source option, or secret-bearing
- target capsule directory already contains any non-placeholder file
- preview cannot be verified as WebP
- preview long edge is not 512
- manifest contains Base64 or original sha256
- any operation would touch provider/API/plugin/image generation/DailyNote/VCP memory/runtime/VCPChat/VCPToolBox/real manifest
- any operation would modify old `runs/` evidence
- any operation would overwrite user-owned files
- any validation command fails twice after one narrow local fix

## Non-Authorization

- no preview creation now
- no image copy or conversion now
- no provider/API/plugin call
- no image generation
- no source image read for capsule creation now
- no DailyNote or VCP memory write
- no runtime/VCPChat/VCPToolBox/real manifest read
- no production candidate or failure sample write
- no push/tag/release/deploy
