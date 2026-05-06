# VCPChat Review Console Exact Patch Execution Preflight Contract

本文定义 v7.12 exact patch execution preflight contract。它只记录真实 VCPChat patch 执行前的状态检查和文件边界检查；不修改真实 VCPChat / VCPToolBox。

```yaml
contract:
  name: vcpchat_review_console_exact_patch_execution_preflight
  version: v7.12-exact-patch-execution-preflight-contract
  status: completed_validated_execution_preflight
  source_record: docs/163_v7_11_vcpchat_review_console_exact_patch_authorization_request.md
  target_repository_name: VCPChat
  expected_branch: main
  observed_branch: main
  expected_head_short: c97ff0c
  observed_head_short: c97ff0c
  worktree_clean: true
  preflight_passed: true
  real_vcpchat_write_authorized_by_this_record: false
  real_vcpchat_write_performed: false
  exact_allowed_write_scope:
    - main.js
    - modules/ipc/imageLabReviewHandlers.js
    - preloads/chat.js
    - main.html
    - modules/renderer/imageLabReviewMount.js
  expected_new_files_absent:
    - modules/ipc/imageLabReviewHandlers.js
    - modules/renderer/imageLabReviewMount.js
  source_code_body_read_performed: false
  vcpchat_code_modified: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  image_file_created: false
  next_safe_phase: "v7.13 VCPChat Review Console First Runtime Patch Implementation Authorization"
```
