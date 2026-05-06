# VCPChat Review Console File-level Write Authorization Review Contract

本文定义 v7.10 file-level write authorization review contract。它只把 v7.9 的候选范围收敛成最终 `allowed_write_scope` 候选；不修改真实 VCPChat / VCPToolBox。

```yaml
contract:
  name: vcpchat_review_console_file_level_write_authorization_review
  version: v7.10-file-level-write-authorization-review-contract
  status: completed_validated_authorization_review
  source_record: docs/161_v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.md
  source_lookup_reused_from_v7_9: true
  additional_vcpchat_read_performed: false
  source_write_performed: false
  vcpchat_code_modified: false
  final_allowed_write_scope_ready_for_user_authorization: true
  real_vcpchat_write_authorized: false
  implementation_allowed: false
  exact_allowed_write_scope:
    - main.js
    - modules/ipc/imageLabReviewHandlers.js
    - preloads/chat.js
    - main.html
    - modules/renderer/imageLabReviewMount.js
  conditional_write_scope_excluded_by_default:
    - preloads/shared/apiFactory.js
    - preloads/shared/catalog.js
    - preloads/shared/roles.js
    - renderer.js
  forbidden_scope_shapes:
    directories_as_write_scope: true
    glob_patterns: true
    implicit_adjacent_files: true
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  image_file_created: false
  next_safe_phase: "v7.11 VCPChat Review Console Exact Patch Authorization Request"
```
