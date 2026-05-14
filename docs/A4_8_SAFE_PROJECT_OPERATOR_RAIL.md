# A4.8 Safe Project Operator Rail

```yaml
rail_id: A4.8
name: Safe Project Operator Rail
name_zh: 安全项目运营轨
mode: A4_docs_and_local_ops
is_A5: false
production_executor: A5
```

## Purpose

A4.8 lets Codex keep useful local project work moving without turning local autonomy into production authority.

It is for safe project operation: planning, documentation, tests, fixtures, dry-run records, evidence packages, review packages, route decision gates, status sync, validation, exact staging, guarded commit, and safe push when the task explicitly authorizes push and push preflight passes.

A4.8 is not a shortcut into real provider calls, image generation, memory writing, runtime integration, production promotion, or secret access.

## Allowed Work

```yaml
allowed_A4_8_work:
  - docs-only planning
  - evidence package
  - review package
  - route decision gate
  - tests and fixtures that do not call external services
  - dry-run records and no-execution examples
  - README / roadmap / PROJECT_MASTER_PLAN status sync
  - .agent_board resume surface sync
  - validation selection and validation execution
  - exact-file staging
  - guarded local commit
  - safe push when explicitly authorized and preflight passes
  - consecutive low-risk A4 docs-only / tests / fixtures / dry-run / planning stages
```

## Required Operating Loop

```yaml
A4_8_loop:
  - Autopilot Rule Intake
  - repo reality check
  - exact scope and file allowlist
  - smallest useful patch
  - exact diff review
  - validation selection
  - validation execution
  - .agent_board sync when status or recommended_next changes
  - exact-file staging
  - guarded commit
  - safe push only if explicitly allowed and preflight passes
  - closeout YAML
  - stop at hard stop
```

## Hard Stops

A4.8 must stop before:

```yaml
hard_stops:
  - A5
  - provider_contact
  - plugin_call
  - image_generation
  - env_local_secret_value_read
  - DailyNote_write
  - VCP_memory_write
  - memory_write_path
  - production_candidate_002
  - Batch_005
  - accepted_samples_write
  - runs_output_commit
  - VCPToolBox_runtime
  - VCPChat_runtime
  - CDP_bridge_MCP
  - real_manifest_read
  - fifth_or_later_generation_trial
  - package_json_or_dependency_change
  - release_deploy_tag
  - destructive_git_or_filesystem_action
```

## Non-Authorization

```yaml
explicit_non_authorization:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  secret_read: false
  memory_write: false
  DailyNote_write: false
  runtime_execution: false
  production_candidate: false
```

## Relationship To A5

A4.8 prepares, validates, and packages local work. A5 executes production actions after an explicit authorization package names the target, command, budget, output boundary, reviewer, rollback path, and stop conditions.

If the next useful action requires A5, A4.8 must stop and request authorization.
