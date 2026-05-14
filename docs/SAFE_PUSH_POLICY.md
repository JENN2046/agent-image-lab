# Safe Push Policy

```yaml
policy_id: safe_push_policy
scope: Agent Image Lab A4.8 local project operation
default_push_allowed: false
```

## Plain Rule

Safe push is allowed only when the current task explicitly authorizes push and every push safety condition passes.

A safe push is not a release, tag, deployment, production action, provider call, or memory write. It only publishes an already reviewed local commit to the tracked branch.

## Preconditions

```yaml
safe_push_preconditions:
  branch: master
  upstream: origin/master
  worktree_clean: true
  behind: 0
  ahead: greater_than_0
  pending_commits_scope: current_task_only
  git_diff_check: passed
  exact_diff_reviewed: true
  staged_exact_files_only: true
  used_git_add_dot: false
  no_secret_or_env_change: true
  no_package_or_dependency_change: true
  no_runs_output_committed: true
  no_accepted_samples_write: true
  no_provider_contact: true
  no_image_generation: true
  no_runtime_execution: true
  no_memory_write: true
```

## Allowed Command

```text
git push origin master
```

Only use this command after the task explicitly allows guarded push and the safety gate has passed.

## Forbidden

```yaml
forbidden_push_actions:
  - git_push_force
  - git_push_force_with_lease
  - tag_push
  - release
  - deploy
  - push_other_branch
  - dirty_tree_push
  - unknown_commit_push
  - push_after_validation_failure
```

## Post-Push Check

```yaml
post_push_required:
  - git status -sb
  - git rev-parse HEAD
  - git rev-parse origin/master
  - ahead_behind_0_0
```

The closeout must record whether local HEAD equals `origin/master`.
