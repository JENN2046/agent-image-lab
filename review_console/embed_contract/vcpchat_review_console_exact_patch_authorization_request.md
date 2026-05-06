# VCPChat Review Console Exact Patch Authorization Request Contract

本文定义 v7.11 exact patch authorization request contract。它只生成真实 VCPChat 首次 patch 的硬授权请求；不修改真实 VCPChat / VCPToolBox。

```yaml
contract:
  name: vcpchat_review_console_exact_patch_authorization_request
  version: v7.11-exact-patch-authorization-request-contract
  status: completed_validated_authorization_request
  source_record: docs/162_v7_10_vcpchat_review_console_file_level_write_authorization_review.md
  target_repository_name: VCPChat
  target_branch_required: main
  target_head_before_patch_required: c97ff0c
  remote_write_allowed: false
  real_vcpchat_write_authorized: false
  implementation_allowed: false
  exact_patch_authorization_request_ready: true
  awaiting_user_explicit_approval: true
  exact_allowed_write_scope:
    - main.js
    - modules/ipc/imageLabReviewHandlers.js
    - preloads/chat.js
    - main.html
    - modules/renderer/imageLabReviewMount.js
  excluded_by_default:
    - preloads/shared/apiFactory.js
    - preloads/shared/catalog.js
    - preloads/shared/roles.js
    - renderer.js
  stop_if_scope_expands: true
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  image_file_created: false
  next_safe_phase: "v7.12 VCPChat Review Console Exact Patch Execution Preflight"
```
