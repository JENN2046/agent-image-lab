# VCPChat Review Console Remote Push Authorization Contract

本文定义 v7.15 remote push authorization contract。它只记录 VCPChat commit `426a2a9` 的远端推送前复查和授权请求；不执行 VCPChat push。

```yaml
contract:
  name: vcpchat_review_console_remote_push_authorization
  version: v7.15-remote-push-authorization-contract
  status: completed_validated_remote_push_authorization_request
  source_record: docs/166_v7_14_vcpchat_review_console_post_commit_record.md
  target_repository_name: VCPChat
  observed_branch: main
  observed_head_short: 426a2a9
  observed_origin_main_short: c97ff0c
  observed_status: "main...origin/main [ahead 1]"
  local_remote_divergence: "1 0"
  remote_has_unpulled_commits: false
  vcpchat_worktree_clean: true
  push_candidate_ready: true
  approval_required_before_push: true
  allowed_command_after_approval:
    - git push origin main
  required_user_approval_phrase_cn: "我明确授权推送 VCPChat commit 426a2a9 到 origin/main。"
  vcpchat_remote_push_performed: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  next_safe_phase: "v7.16 VCPChat Review Console Remote Push Execution Record"
```
