# v7.58i — memory_overview Payload Contract

## 1. Purpose

Define the exact payload shape for the `memory_overview`-only LT-06 planning surface.

## 2. Payload Contract

```yaml
memory_overview_payload_contract:
  schema_version: v1
  phase: v7_58i

  request_shape:
    jsonrpc: "2.0"
    method: tools/call
    params:
      name: memory_overview
      arguments:
        auditWindow: optional_integer
        limit: optional_integer

  recommended_arguments:
    auditWindow: null
    limit: null

  forbidden_payload_fields:
    - name: search_memory
    - name: record_memory
    - tool_name
    - write_intent
    - memory_write
    - dailynote_write
    - include_content
    - raw_payload
    - private_absolute_path
    - image_binary
    - runs_path

  expected_side_effects:
    file_write: false
    audit_log_write: false
    DailyNote_write: false
    VCP_memory_write: false
    plugin_execution: false
    image_generation: false
```

## 3. Important Notes

- `include_content` is **not** a parameter of `memory_overview`. It belongs to `search_memory` only.
- Do not embed search parameters into the `memory_overview` call.
- No fallback to any other tool.
