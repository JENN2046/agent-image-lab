# VCPChat Runtime Smoke Test Preflight Contract

本文定义 v7.27 runtime smoke test preflight contract。它只规划运行时 smoke test 的范围、候选启动脚本和断言；不启动应用，不运行 Electron，不发布 release。

```yaml
contract:
  name: vcpchat_runtime_smoke_test_preflight
  version: v7.27-runtime-smoke-test-preflight-contract
  status: completed_validated_runtime_smoke_test_preflight
  source_record: docs/178_v7_26_vcpchat_local_main_sync_execution_record.md
  target_repository_name: VCPChat
  current_local_branch: main
  current_local_head_short: b320e39
  local_origin_main_head_short: b320e39
  worktree_clean: true
  bridge_files_present: true
  package_scripts_read_only_inspected: true
  recommended_future_launch_script: npm run start:desktop:utf8
  app_launch_requires_explicit_authorization: true
  app_launch_performed: false
  runtime_smoke_test_performed: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  branch_deleted: false
  github_release_performed: false
  next_safe_phase: "v7.28 VCPChat Runtime Smoke Test Execution Record"
```
