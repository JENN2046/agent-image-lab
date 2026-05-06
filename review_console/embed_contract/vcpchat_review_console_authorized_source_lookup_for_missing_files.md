# VCPChat Review Console Authorized Source Lookup For Missing Files Contract

本文定义 v7.9 authorized source lookup contract。它只记录已授权的 VCPChat 只读 source lookup 结果，用于确认缺失的主进程 IPC handler 文件和 renderer mount 文件；不修改真实 VCPChat / VCPToolBox。

```yaml
contract:
  name: vcpchat_review_console_authorized_source_lookup_for_missing_files
  version: v7.9-authorized-source-lookup-contract
  status: completed_validated_read_only_lookup
  target_repository_name: VCPChat
  target_branch_observed: main
  target_head_short: c97ff0c
  source_lookup_authorized_by_user: true
  source_lookup_performed: true
  source_lookup_read_only: true
  raw_local_path_saved: false
  raw_source_code_copied: false
  source_write_performed: false
  vcpchat_code_modified: false
  resolved_missing_files:
    main_process_ipc_handler_file: modules/ipc/imageLabReviewHandlers.js
    renderer_mount_file: modules/renderer/imageLabReviewMount.js
  future_default_write_scope_candidate:
    - main.js
    - modules/ipc/imageLabReviewHandlers.js
    - preloads/chat.js
    - main.html
    - modules/renderer/imageLabReviewMount.js
  conditional_write_scope_candidate:
    - preloads/shared/apiFactory.js
    - preloads/shared/catalog.js
    - preloads/shared/roles.js
    - renderer.js
  implementation_allowed: false
  final_write_authorization_ready: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  image_file_created: false
  next_safe_phase: "v7.10 VCPChat Review Console File-level Write Authorization Review"
```
