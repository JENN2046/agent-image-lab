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

  exact_payload_lock:
    exact_payload_required: true
    one_call_only: true

    exact_payload:
      jsonrpc: "2.0"
      id: "lt06-memory-overview-001"
      method: tools/call
      params:
        name: memory_overview
        arguments: {}

    forbidden_jsonrpc_methods:
      - initialize
      - notifications/initialized
      - ping
      - tools/list
      - resources/list
      - resources/templates/list

    forbidden_tools:
      - search_memory
      - record_memory

    arguments_policy:
      required_shape: {}
      auditWindow_allowed_now: false
      limit_allowed_now: false
      non_empty_arguments_allowed: false
      reason: minimize response volume and exposure surface

    fallback_allowed: false
    retry_allowed: false

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
- The exact payload is frozen with empty arguments to minimize response surface.
