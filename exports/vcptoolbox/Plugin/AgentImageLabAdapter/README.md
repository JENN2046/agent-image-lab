# AgentImageLabAdapter Dry-Run

> This directory contains the VCPToolBox adapter-only dry-run package for Agent Image Lab.

## Current Status

- v0.5 installable dry-run adapter candidate.
- Adapter-only; no real image generation plugin is selected or called.
- Entry point: `node dry-run-adapter.js`.
- Only allowed command: `dry_run`.
- No `index.js`.
- No external API call.
- No DailyNote write.
- No file write or image binary output.

## VCPToolBox Invocation

The plugin is declared as a synchronous stdio plugin. VCPToolBox passes JSON through stdin, and the adapter returns VCP-shaped JSON through stdout:

```json
{
  "status": "success",
  "result": {
    "adapter_dry_run_response": {
      "status": "accepted_draft"
    }
  }
}
```

Rejected dry-run requests still return `status: "success"` with `adapter_dry_run_response.status="rejected"` because the adapter itself executed safely and blocked the request.

## Required Input Boundary

```yaml
command: dry_run
task_envelope:
  mode: dry_run
  dry_run_controls:
    max_plugin_calls: 0
    allow_external_api: false
    allow_file_write: false
    allow_image_binary: false
  approval_context:
    gatekeeper_required: true
    review_console_required: true
    daily_note_direct_write_allowed: false
  safety:
    contains_secret: false
    contains_private_path: false
    contains_customer_private_data: false
    contains_image_binary: false
```

## Guaranteed Output Guards

```yaml
selected_plugin: null
max_plugin_calls: 0
api_called: false
vcp_plugin_called: false
daily_note_called: false
file_write_performed: false
image_file_created: false
real_execution_allowed: false
```

## Local Delivery Surface Validation

```powershell
node scripts\validate_adapter_delivery_surface.js
```

The validation reads only repository-local adapter files and fixtures. It checks that the manifest remains dry-run only, the exported stdio adapter returns accepted and rejected guarded responses, and no real plugin/API/DailyNote/image/file-write path is present.

## Forbidden

- Do not add real plugin execution logic.
- Do not call VCP image generation plugins.
- Do not write image files.
- Do not write DailyNote.
- Do not add API keys, tokens, cookies, passwords, private paths, endpoints, customer privacy, or raw plugin output.
- Do not treat `accepted_draft` as authorization for real execution.

## Rollback

If this adapter was installed as part of a v0.5 dry-run verification, rollback is limited to removing only the newly installed `Plugin/AgentImageLabAdapter` directory or restoring a pre-install backup. Do not delete or modify user-owned plugins or runtime data.
