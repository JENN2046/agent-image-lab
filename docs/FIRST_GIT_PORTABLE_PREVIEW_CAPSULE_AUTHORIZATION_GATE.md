# First Git-Portable Preview Capsule Authorization Gate

base_contract: AGENTS.md
mode: A4.8 authorization package only
status: concrete_package_validated_pending_source_authorization

## Purpose

Prepare the smallest explicit package for the first Git-portable accepted
sample preview capsule.

This package is concrete enough for human review, but it still does not
authorize creating, copying, converting, staging, committing, or pushing
`preview.webp`.

## Selected First Sample

```yaml
selected_sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001
selection_reason: >
  This sample is the original v14.131 real artifact recoverability MVP sample.
  It already has registry, category index, review, formal package, closeout,
  import-record, hash, dimensions, and human approval lineage. It is the best
  first target for migrating from old local-only runs evidence to a
  Git-portable preview capsule.
source_registry_ref: accepted_samples/accepted_sample_registry.yaml
source_category_ref: accepted_samples/categories/fashion_lookbook_portrait.yaml
legacy_import_record_ref: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json
legacy_review_record_ref: docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md
legacy_approval_record_ref: docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md
legacy_formal_sample_package_ref: docs/v14_106_womens_resort_relaxed_knit_formal_sample_promotion_package.md
legacy_original_path_ref: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png
legacy_original_required_for_p1: false
```

## Target Capsule Layout

```text
asset_archive/accepted_samples/accepted_womens_resort_relaxed_knit_codex_v2_001/
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
  - asset_archive/accepted_samples/accepted_womens_resort_relaxed_knit_codex_v2_001/manifest.json
  - asset_archive/accepted_samples/accepted_womens_resort_relaxed_knit_codex_v2_001/preview.webp
  - asset_archive/accepted_samples/accepted_womens_resort_relaxed_knit_codex_v2_001/import_record.json
  - asset_archive/accepted_samples/accepted_womens_resort_relaxed_knit_codex_v2_001/review_record.json
  - asset_archive/accepted_samples/accepted_womens_resort_relaxed_knit_codex_v2_001/approval_record.json
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
  source_original_image_path: "<TO_BE_FILLED_BY_USER>"
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
`<TO_BE_FILLED_BY_USER>` source placeholder before approval.

```text
批准执行 P1 first Git-portable preview capsule creation for
accepted_womens_resort_relaxed_knit_codex_v2_001：
允许在 Agent Image Lab 当前仓库内创建
asset_archive/accepted_samples/accepted_womens_resort_relaxed_knit_codex_v2_001/
下的 manifest.json、preview.webp、import_record.json、review_record.json、
approval_record.json；允许从 <TO_BE_FILLED_BY_USER> 读取已批准的本地源图片或
preview，并在本地生成/复制 long_edge=512 的 preview.webp；允许计算 preview.webp
sha256 并写入 manifest.json；允许把 import/review/approval 链路记录复制或提取
为 capsule 内 JSON 记录。

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
- no source image read now
- no DailyNote or VCP memory write
- no runtime/VCPChat/VCPToolBox/real manifest read
- no production candidate or failure sample write
- no push/tag/release/deploy
