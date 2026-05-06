# VCPChat Review Console First Runtime Integration Scope Fill Gate Contract

本文定义 v7.6 scope fill contract。它只记录首次真实实现的候选 scope，不修改真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 代码。

```yaml
contract:
  name: vcpchat_review_console_first_runtime_integration_scope_fill_gate
  version: v7.6-scope-fill-contract
  status: scope_fill_only
  candidate_preload_files:
    - preloads/chat.js
    - preloads/shared/apiFactory.js
    - preloads/shared/roles.js
  unresolved_required_files:
    - "<repo_relative_main_process_ipc_handler_candidate>"
    - "<repo_relative_renderer_mount_candidate>"
  implementation_allowed: false
  vcpchat_code_modified: false
  additional_vcpchat_read_performed: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  image_file_created: false
```
