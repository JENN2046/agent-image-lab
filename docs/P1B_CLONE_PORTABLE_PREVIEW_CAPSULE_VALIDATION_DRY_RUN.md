# P1b Clone-Portable Preview Capsule Validation Dry Run

```yaml
phase: p1b_clone_portable_preview_capsule_validation_dry_run
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
status: completed_validated_committed_and_pushed
sample_id: accepted_french_summer_rattan_bucket_bag_001
```

## Purpose

Validate that the first Git-portable preview capsule can be recovered from a clean local clone without the old ignored `runs/` source image and without reusing the current workspace `node_modules/`.

This dry run proves the portable evidence path:

```text
Git-tracked capsule files
-> npm ci from package-lock.json
-> scripts/validate_preview_capsule.js
-> preview sha256 and WebP dimensions verified
```

## Boundary

Allowed:

```text
local clean clone under ignored .agent_private/
npm ci in the clean clone from committed package-lock.json
preview capsule validation for accepted_french_summer_rattan_bucket_bag_001
documentation and .agent_board status recording
```

Forbidden and not performed:

```text
push
tag
release
deploy
A5 execution
provider contact
plugin call
API call
image generation
DailyNote write
VCP memory write
runtime execution
real manifest read
VCPChat read
VCPToolBox read
old runs/ source restoration
new preview creation or conversion
```

## Current Git Baseline Event

This record uses Git output as an event baseline only. It is not a durable claim that future `HEAD` must equal this hash.

```yaml
validation_baseline:
  branch: master
  head_at_validation: 7f9f6ec896c9476d17bce186a9b1589e69e52c8b
  origin_master_at_validation: 4a771cea4c04f600c444ec0a395b4aaf7e98846e
  ahead_behind_at_validation: "0/2"
  local_commits_ahead_at_validation_before_later_push:
    - 7f9f6ec feat: create first preview capsule
    - 214c9d8 docs: retarget first preview capsule source
  post_push_baseline_event: 2c84aa9c0ea6be3c04eccaa8b8c3f20aa7715ec7
  post_push_ahead_behind_event: "0/0"
  latest_sync_truth_source: git status and git rev-parse
```

## Clean Clone Method

The clean validation copy was created under ignored `.agent_private/` using local Git clone from the current repository. The clone received Git-tracked files from the current local `HEAD`.

Important controls:

```yaml
clean_copy_controls:
  copied_from_git_tracked_files: true
  reused_current_workspace_node_modules: false
  node_modules_present_before_npm_ci: false
  npm_ci_performed_in_clean_copy: true
  old_real_generation_source_required: false
  runs_path_disabled_before_capsule_validation: true
```

The clean copy initially contained tracked lightweight `runs/` records from the repository, including project metadata and one historical local validation screenshot. To prove this capsule validation does not depend on `runs/`, the clean copy's `runs/` directory was renamed to a disabled path before running the capsule validator.

No source image from `runs/real_generation/` was used.

## Validation Result

Command run in the clean copy after `npm ci`:

```powershell
npm run validate-preview-capsule -- --sample-id=accepted_french_summer_rattan_bucket_bag_001
```

Result:

```yaml
preview_capsule_validation:
  passed: true
  status: git_portable_preview_evidence_verified
  sample_id: accepted_french_summer_rattan_bucket_bag_001
  preview_path: asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp
  preview_sha256: 455bbbc5be93b68f7eb02287ac6d861d1b2397a0f5d793d58ea7ab670f8d6cb3
  preview_signature: RIFF_WEBP_VP8
  preview_width: 512
  preview_height: 512
  preview_long_edge: 512
  failures: []
```

## Decision

```yaml
decision:
  clone_portable_preview_capsule_verified: true
  runs_original_image_required_for_validation: false
  current_workspace_node_modules_required_for_validation: false
  package_lock_dependency_restore_required: true
  mvp_validator_local_private_clone_ignore_required: true
  product_evidence_chain_status: first_preview_capsule_clone_portable
  committed_and_pushed: true
  recommended_next: product_mainline_registry_driven_preview_capsule_validator_or_second_preview_capsule
```

## Validation Reconciliation

The first main-workspace `scripts/validate_mvp.ps1` run failed because the media pollution scan traversed ignored `.agent_private/` clean-clone contents. That was a validator boundary issue, not a capsule failure.

Narrow reconciliation:

```yaml
mvp_validator_reconciliation:
  file: scripts/validate_mvp.ps1
  change: skip .agent_private/ during media/archive pollution scan
  reason: .agent_private/ is an ignored local-only validation workspace and must not be treated as repository artifact content
  validator_behavior_expansion: false
  production_or_runtime_change: false
```

## Post-Push State

This dry run has already been committed and pushed as part of the post-P1b sync baseline event.

```yaml
post_push_state:
  p1b_commit: 2c84aa9 docs: record clone-portable preview capsule validation
  pushed_to_origin_master: true
  head_equals_origin_master_at_reconciliation_start: true
  ahead_behind_at_reconciliation_start: "0/0"
  current_sync_truth_source: git status and git rev-parse
```

## Reconciliation Commit Scope

This post-push wording reconciliation is suitable for an exact-file local commit package if the repository validation remains clean.

Allowlist:

```text
docs/P1B_CLONE_PORTABLE_PREVIEW_CAPSULE_VALIDATION_DRY_RUN.md
.agent_board/HANDOFF.md
.agent_board/RUN_STATE.md
.agent_board/TASK_QUEUE.md
.agent_board/CHECKPOINT.md
scripts/validate_mvp.ps1
```

No push is authorized by this dry run.
