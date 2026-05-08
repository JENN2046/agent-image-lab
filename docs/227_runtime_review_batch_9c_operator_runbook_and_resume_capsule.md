# Runtime Review Batch 9C Operator Runbook And Resume Capsule

本文是给后续 agent / operator 的五分钟续跑入口。它只记录项目内本地工作路线，不授权真实 VCPChat / VCPToolBox 读取、插件/API 调用、DailyNote/VCP memory 写入、图片创建、依赖变更或版本动作。

## Resume Capsule

```yaml
runtime_review_batch_9c_operator_runbook_and_resume_capsule:
  status: completed_validated_operator_resume_capsule
  current_phase: "Runtime Review Batch 9C operator runbook and resume capsule"
  previous_phase: "Runtime Review Batch 9A state freshness index"
  current_state_index: docs/226_runtime_review_batch_9a_state_freshness_index.md
  sustained_plan: docs/225_runtime_review_batch_8d_sustained_autopilot_task_plan.md
  baseline_branch: master
  baseline_remote_tracking: origin/master
  baseline_head_short_before_batch: 2d34eb0
  safe_local_autopilot_allowed: true
  version_action_performed: false
  commit_performed: false
  tag_performed: false
  push_performed: false
  pr_created: false
  release_created: false
```

## Five-minute Operator Runbook

1. Read `AGENTS.md`, `AGENTS.autopilot-overlay.md`, this file, and `.agent_board/RUN_STATE.md`.
2. Run `git status --short --branch` and treat unrelated changes as user-owned.
3. Use `docs/226_runtime_review_batch_9a_state_freshness_index.md` as the current freshness anchor, then use this file as the resume capsule.
4. Continue the next safe local batch from `docs/225_runtime_review_batch_8d_sustained_autopilot_task_plan.md`.
5. Prefer local A4/A4.5 work: docs, indexes, schema examples, fixtures, validators, runtime prototype no-write surfaces, and `.agent_board` sync.
6. Stop before any real VCPChat / VCPToolBox read, real bridge/CDP call, plugin/API/DailyNote/VCP memory action, image creation, dependency change, or version action unless a concrete active authorization package exists and preflight passes.
7. After each local batch, update `.agent_board/RUN_STATE.md`, `.agent_board/HANDOFF.md`, `.agent_board/CHECKPOINT.md`, `.agent_board/TASK_QUEUE.md`, and `.agent_board/VALIDATION_LOG.md`.

## Safe Next Tasks

```yaml
safe_next_tasks:
  - batch: "Batch 9B Runtime Session Compatibility Matrix"
    reason: "legacy runtime_review_session_v1 import compatibility is the highest runtime regression risk"
    allowed_scope:
      - review_console/runtime_prototype/README.md
      - review_console/runtime_prototype/FIELD_MAPPING.md
      - tests/schema_examples/
      - scripts/
      - tests/validation_checklist.md
      - .agent_board/
    forbidden_actions:
      - real_vcpchat_read
      - real_vcptoolbox_read
      - bridge_or_cdp_call
      - plugin_or_api_call
      - daily_note_or_vcp_memory_write
      - image_creation
      - dependency_change
      - commit_tag_push_pr_release_without_active_package
  - batch: "Batch 10B End-To-End Dry-Run Replay Index"
    reason: "project-local fixture replay can prove the no-write chain after compatibility is explicit"
    prerequisite: "Batch 9B local validation passed"
  - batch: "Batch 10A Release-Candidate Acceptance Matrix"
    reason: "release readiness should be reviewable without scanning historical docs"
  - batch: "Batch 10C Future A5 Authorization Package Consolidation"
    reason: "future production steps need one complete active-package template"
```

## Hard Gates

```yaml
hard_gates:
  real_vcpchat_read: requires_concrete_active_authorization_package
  real_vcptoolbox_read: requires_concrete_active_authorization_package
  real_manifest_read: requires_concrete_active_authorization_package
  bridge_or_cdp_call: requires_concrete_active_authorization_package
  plugin_or_api_call: requires_concrete_active_authorization_package
  daily_note_write: requires_concrete_active_authorization_package
  vcp_memory_write: requires_concrete_active_authorization_package
  image_creation: requires_concrete_active_authorization_package
  dependency_change: requires_concrete_active_authorization_package
  commit_tag_push_pr_release: requires_concrete_active_version_action_package
  write_outside_project_root: requires_concrete_active_external_write_package
```

The conditional automation activation contract is defined in `docs/225_runtime_review_batch_8d_sustained_autopilot_task_plan.md`. This runbook points to that contract; it is not an activation package by itself.

## Validation Commands

```powershell
git diff --check
node --check scripts\validate_runtime_review_batch_9c_operator_runbook.js
node scripts\validate_runtime_review_batch_9c_operator_runbook.js
node scripts\validate_runtime_review_batch_9a_state_freshness.js
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
```

## Forbidden Outputs

```yaml
forbidden_outputs:
  raw_secret_values: true
  raw_private_paths: true
  raw_runtime_logs: true
  raw_plugin_output: true
  raw_endpoint_values: true
  raw_source_copy_from_external_repos: true
  image_binaries: true
  customer_private_data: true
```

## Boundary

```yaml
boundary:
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  real_manifest_read: false
  bridge_or_cdp_call: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  executable_entrypoint_created: false
  version_action_performed: false
```

## Acceptance

- A new agent can identify the current phase, safe next tasks, hard gates, validation commands, and version action status from this file.
- The runbook does not store raw secrets, raw private paths, raw runtime logs, raw plugin output, image binaries, or customer private data.
- The runbook does not authorize A5 production actions; it only references the conditional automation activation contract.
- README, MANIFEST, roadmap, and `.agent_board/HANDOFF.md` link to this file.
