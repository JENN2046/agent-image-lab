# Push_L1 Usage Rule

phase: v0_3_7c_push_l1_regression_usage_boundary_gate
source_proven_commit: f26e9478c94c7a3dcfc4ba93b6a3efac806ebece

Push_L1_green_auto is a narrow remote-ref update lane. It exists only for a
single, reviewed, fast-forward status or governance exact-slice commit. It is
not a general docs push lane, not a Push_L2 trial, and not permission to push
runtime, provider, image, memory, dependency, asset, or runs changes.

## Candidate Checklist

A candidate can be Push_L1 only when every condition is true:

- worktree_clean: true
- exactly_one_commit_ahead: true
- fast_forward_only: true
- upstream_branch_exactly_origin_master: true
- exact_slice_recognized: true
- changed_files_only_docs_status_or_validator_slice: true
- no_assets_paths: true
- no_runs_paths: true
- no_image_files: true
- no_package_json_or_lockfile: true
- no_runtime_code: true
- no_provider_image_memory_runtime_secret_side_effects: true
- no_untracked_files: true
- no_staged_files_before_push: true
- git_diff_check_passed: true
- npm_run_validate_mvp_passed: true
- post_push_verification_required: true
- post_push_state_sync_required: true

## Allowed Shape

The proven Push_L1 shape is intentionally narrow:

```yaml
proven_scope:
  commit_count_ahead: 1
  upstream_branch: origin/master
  fast_forward_only: true
  file_family:
    - .agent_board status surfaces
    - docs/00_project_roadmap.md
    - reviewed push-safety validator/spec fixtures when exact-slice registered
  forbidden:
    - assets/
    - runs/
    - no_images
    - no_package_files
    - image binaries
    - package.json
    - package-lock.json
    - runtime code
    - provider/image/memory/runtime/secret side effects
```

## Required Commands

Before a Push_L1 push:

```text
git status --short
git log --oneline origin/master..HEAD
git rev-list --left-right --count origin/master...HEAD
git diff --name-only origin/master..HEAD
git diff --check origin/master..HEAD
node scripts/validate_smart_v3_push_safety_lane.js
npm run validate:mvp
```

After a Push_L1 push:

```text
git rev-list --left-right --count origin/master...HEAD
git status --short
git log -1 --oneline origin/master
git ls-remote origin refs/heads/master
```

## Non-Expansion Rule

Do not infer any of the following:

- Push_L1 success means every docs commit can auto-push.
- Push_L1 success means Push_L2 is proven or may be tested.
- Push_L1 success means a real executor may be implemented.
- Push_L1 success covers generated binaries, runs artifacts, package changes,
  memory writes, production candidates, accepted sample promotion, or runtime
  code.

## Boundary

```yaml
Push_L1_green_auto: narrow_status_or_registered_governance_exact_slice_only
Push_L2_amber_auto_guarded: defined_not_exercised
Push_L3_red_manual: preserved
real_executor_implemented_now: false
provider_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
runtime_call_performed: false
secret_value_read_performed: false
```
