# PHASE_PROTOCOL.md — Agent Image Lab

## A4.8 Phase Protocol

```yaml
protocol_id: A4_8_safe_project_operator_rail
name_zh: 安全项目运营轨
scope: low-risk local project operation
is_A5: false
```

## Required Phase Flow

```yaml
phase_flow:
  - Autopilot Rule Intake
  - confirm branch / HEAD / origin / worktree
  - confirm exact allowed files
  - confirm hard stops
  - apply smallest useful patch
  - inspect exact diff
  - run selected validation
  - update .agent_board if status or recommended_next changes
  - stage exact allowlisted files only
  - commit only after validation and diff review
  - push only after explicit push authorization and safe push preflight
  - closeout YAML
  - stop before next phase unless automatic continuation is explicitly allowed
```

## Hard Stops

```yaml
hard_stops:
  A5: true
  provider_contact: true
  plugin_call: true
  image_generation: true
  env_local_secret_value_read: true
  DailyNote_write: true
  VCP_memory_write: true
  memory_write_path: true
  production_candidate_002: true
  Batch_005: true
  accepted_samples_write: true
  runs_output_commit: true
  VCPToolBox_runtime: true
  VCPChat_runtime: true
  CDP_bridge_MCP: true
  real_manifest_read_required: stop
  fifth_or_later_generation_trial: true
  package_json_or_dependency_change: true
  release_deploy_tag: true
```

## Staging Rule

```yaml
staging:
  git_add_dot: forbidden
  exact_file_staging_required: true
  staged_files_must_equal_allowlist: true
```

## Push Rule

Push is allowed only when the task explicitly authorizes guarded push, the branch tracks `origin/master`, the worktree is clean, behind is `0`, pending commits are task-scoped, validation passed, and no hard-stop behavior occurred.
