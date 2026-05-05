# 120 v4.3 Autopilot Overlay Installation

本文记录 v4.3 项目内 autopilot overlay 安装与 agent board 同步。该阶段只从用户授权的本地 zip 中安装新增 overlay 文件，并同步 `.agent_board` 状态；没有覆盖既有文件，没有读取真实 VCPChat / VCPToolBox，没有调用插件、API、DailyNote 或 VCP 记忆。

## Overlay Install Status

```yaml
v4_3_autopilot_overlay_installation:
  status: completed_validated_project_local_autopilot_overlay_installation
  autopilot_overlay_installed: true
  agent_board_installed: true
  agent_board_synchronized: true
  existing_files_overwritten: false
  root_agents_overwritten: false
  overlay_kept_separate: true
  validation_helper_adjusted_for_historical_records: true
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  real_vcptoolbox_source_read: false
  real_vcptoolbox_modified: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  runtime_disk_write_performed: false
  image_file_created: false
  commit_tag_push_authorized: false
```

## Installed Files

```yaml
installed_files:
  - .agent_board/BLOCKERS.md
  - .agent_board/CHECKPOINT.md
  - .agent_board/DECISIONS.md
  - .agent_board/HANDOFF.md
  - .agent_board/RUN_STATE.md
  - .agent_board/TASK_QUEUE.md
  - .agent_board/VALIDATION_LOG.md
  - AGENTS.autopilot-overlay.md
  - AUTOPILOT_REFACTOR_REPORT.md
  - README_AGENT_IMAGE_LAB_AUTOPILOT.md
  - codex/AGENT_IMAGE_LAB_AUTOPILOT_PROMPT.md
  - scripts/validate-agent-image-lab-local.ps1
  - scripts/validate-agent-image-lab-local.sh
```

## Validation

```yaml
validation:
  validate_mvp: passed_after_integration
  validate_agent_image_lab_local_ps1: passed_with_manual_review_warnings
  runtime_validation_suite: passed
  git_diff_check: passed
```

## Boundary

```yaml
boundary:
  can_continue_project_local_autopilot: true
  can_modify_real_vcpchat: false
  can_modify_real_vcptoolbox: false
  can_call_plugin: false
  can_call_api: false
  can_write_daily_note: false
  can_write_vcp_memory: false
  can_write_disk_from_runtime: false
  can_create_image_file: false
  commit_tag_push_authorized: false
```

v4.3 提升的是本地协作状态和续跑可见性，不授权真实 VCPChat 集成、外部执行、DailyNote 写入或远程发布。
