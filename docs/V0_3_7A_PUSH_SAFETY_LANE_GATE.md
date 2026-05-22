# v0.3.7a Push Safety Lane Gate

base_contract: AGENTS.md
phase: v0_3_7a_push_safety_lane_gate
mode: Green Lane docs/schema/validator planning gate
source_remote_commit: b5cb845ac280e463c3825ca0bc20e5abc772c421

This gate defines Push Safety Lane classification for future remote ref updates.
It does not perform push, create a real executor, call providers, generate
images, write memory, run runtime probes, read secrets, tag, release, or deploy.

## Purpose

Smart v3 Green / Amber / Red classifies the task action risk. Push Safety Lane
classifies the remote ref update risk. A task can be Green while its push is
still Push_L3_red_manual, and a future push can only move through the Push
Safety Lane after the task commit has already been reviewed and validated.

This policy changes the old "all push is Red" posture into a stricter
four-level push lane model:

```yaml
push_not_always_red_after_policy: true
push_safety_lane_independent_from_task_lane: true
push_execution_performed_by_this_gate: false
```

## Push_L0_forbidden

```yaml
Push_L0_forbidden:
  auto_push_allowed: false
  always_manual_or_forbidden:
    - force_push
    - history_rewrite
    - tag
    - release
    - deploy
    - destructive_git_or_filesystem_action
    - secret_value_read_or_secret_file_change
    - external_repository_broad_modification
    - non_fast_forward_push
    - branch_mismatch
    - unreviewed_or_broad_diff
    - uncapped_cost
    - unbounded_loop
```

L0 items are never auto-pushable. Some are forbidden outright; the rest require
separate manual authorization and a different gate.

## Push_L1_green_auto

```yaml
Push_L1_green_auto:
  auto_push_allowed: true
  scope: narrow docs/status/exact-slice only
  required_conditions:
    - worktree_clean
    - exactly_one_commit_ahead
    - fast_forward_only
    - upstream_branch_exactly_origin_master
    - exact_slice_recognized
    - changed_files_only_docs_status_or_validator_slice
    - no_assets_paths
    - no_runs_paths
    - no_image_files
    - no_package_json_or_lockfile
    - no_runtime_code
    - no_provider_image_memory_runtime_secret_side_effects
    - no_untracked_files
    - no_staged_files_before_push
    - git_diff_check_passed
    - npm_run_validate_mvp_passed
    - post_push_verification_required
    - post_push_state_sync_required
```

L1 is for a single reviewed, fast-forward-only commit whose exact slice is
recognized and limited to docs/status/governance validator surfaces. It cannot
include assets, runs, images, package manifests, runtime code, or side-effect
artifacts.

## Push_L2_amber_auto_guarded

```yaml
Push_L2_amber_auto_guarded:
  auto_push_allowed: true
  scope: bounded governance artifacts only, not side-effect artifacts
  required_conditions:
    - bounded_commit_count_max_2
    - exact_changed_files_known
    - phase_validator_passed
    - push_preflight_packet_exists
    - rollback_or_revert_plan_exists
    - receipt_or_action_packet_if_amber_side_effect_exists
    - no_secret_or_private_path
    - no_generated_binary_unless_separate_gate
    - no_memory_write
    - no_production_candidate
    - remote_head_verified_before_push
    - post_push_state_sync_required
  must_not_cover:
    - generated_image_binaries
    - runs_artifacts
    - accepted_sample_promotion
    - production_candidate_creation
    - memory_write
    - package_or_dependency_change
    - real_executor_runtime_code
```

L2 is still auto-guarded rather than manual, but it requires a push preflight
packet, exact changed-file knowledge, phase validator evidence, remote head
verification, rollback or revert planning, and post-push reconciliation. It is
for bounded governance artifacts only. It does not cover side-effect artifacts.

## Push_L3_red_manual

```yaml
Push_L3_red_manual:
  user_authorization_required: true
  examples:
    - image_binary_commit
    - runs_artifact_commit
    - package_or_dependency_change
    - runtime_code_change
    - real_executor_change
    - memory_write
    - production_candidate
    - accepted_sample_promotion
    - provider_side_effect_without_receipt
    - unreviewed_diff
    - broad_diff
    - branch_or_upstream_uncertain
```

L3 requires explicit manual authorization and must not be silently treated as
Green or Amber just because the underlying task was local.

## Push Preflight Validator

A future push preflight validator must fail closed unless it proves:

```yaml
push_preflight_validator_required: true
remote_head_verified_before_push: true
fast_forward_only: true
no_force_push: true
no_tag_release_deploy: true
no_secret_or_destructive_action: true
exact_slice_recognized: true
validation_passed: true
```

## Post-Push Verification Requirement

Every allowed push lane must verify after push:

```yaml
post_push_verification_required: true
required_commands:
  - git rev-list --left-right --count origin/master...HEAD
  - git status --short
  - git log -1 --oneline origin/master
  - git ls-remote origin refs/heads/master
remote_head_matches_local_head_required: true
ahead_behind_after_push_required: "0 0"
```

## Post-Push Reconciliation Requirement

Every allowed push lane must trigger a separate Green Lane post-push state sync:

```yaml
post_push_state_sync_required: true
required_fields:
  - current_remote_head
  - pushed_commits
  - push_status
  - ahead_behind_after_push
  - force_push_used: false
  - tag_release_deploy_performed: false
  - next_phase_started: false
  - future_push_allowed: false
```

The sync must remain local, reversible, non-secret, non-runtime, non-provider,
non-image, non-memory, non-production, and non-dependency work.

## Validator Negative Cases

The validator must prove:

```yaml
negative_cases_required:
  - Push_L1_assets_path_fails
  - Push_L1_runs_path_fails
  - Push_L1_image_file_fails
  - Push_L1_package_file_fails
  - Push_L1_runtime_code_fails
  - Push_L1_requires_exactly_one_commit_ahead
  - Push_L1_requires_fast_forward_only
  - Push_L1_requires_validation_pass
  - Push_L1_requires_post_push_verification
  - Push_L1_requires_post_push_state_sync
  - Push_L2_requires_bounded_commit_count
  - Push_L2_requires_phase_validator_pass
  - Push_L2_blocks_generated_binary_memory_production
  - Push_L3_requires_user_authorization
  - force_push_auto_allowed_false
  - tag_release_deploy_auto_allowed_false
  - secret_destructive_auto_allowed_false
```

## Boundary

```yaml
provider_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
runtime_call_performed: false
secret_value_read_performed: false
real_executor_implemented_now: false
commit_performed: false
push_performed: false
```
