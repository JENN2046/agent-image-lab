# Push_L1 Regression Cases

phase: v0_3_7c_push_l1_regression_usage_boundary_gate

The regression suite turns the first successful Push_L1 cycle into a repeatable
classification check. The goal is not to widen Push_L1. The goal is to make it
fail closed when a candidate stops matching the proven narrow shape.

## Positive Case

```yaml
case_id: push_l1_status_sync_pass
expected_classification: Push_L1_green_auto
required:
  - exactly_one_commit_ahead
  - fast_forward_only
  - upstream_branch_exactly_origin_master
  - worktree_clean
  - no_staged_files_before_push
  - no_untracked_files
  - git_diff_check_passed
  - npm_run_validate_mvp_passed
  - post_push_verification_required
  - post_push_state_sync_required
  - changed_files_are_status_surface_only
```

The positive fixture is:

```text
tests/schema_examples/push_l1_status_sync_pass.example.json
```

## Negative Cases

Every negative case must fail Push_L1 classification:

```yaml
negative_cases:
  - assets_path_fails
  - runs_path_fails
  - image_file_fails
  - package_json_fails
  - package_lock_fails
  - runtime_code_fails
  - more_than_one_commit_ahead_fails
  - non_fast_forward_fails
  - validation_missing_or_failed_fails
  - missing_post_push_verification_fails
  - missing_post_push_state_sync_fails
```

The forbidden-path fixture is:

```text
tests/schema_examples/push_l1_forbidden_paths_fail.example.json
```

## Explicit Non-Goals

```yaml
Push_L2_tested: false
provider_image_runtime_commit_auto_push: false
Push_L1_any_docs_commit_allowed: false
real_executor_implemented_now: false
package_dependency_change_allowed: false
assets_or_runs_commit_allowed: false
```

Push_L1 stays useful because it is narrow. It must remain small enough that the
full candidate can be inspected, validated, pushed, verified, and reconciled
without hidden cost or hidden side effects.
