# A5 Request Pre-submission Checklist — memory_overview LT-06

> This checklist must pass **before** the user submits the independent A5 request. It does not authorize any execution.

```yaml
A5_request_pre_submission_checklist:
  schema_version: v1
  phase: v7_58j

  must_pass_before_user_submits_A5:
    - exact_payload_matches
    - arguments_is_empty_object
    - forbidden_methods_list_complete
    - search_memory_not_present
    - record_memory_not_present
    - native_vcp_routes_not_present
    - no_retry
    - no_fallback
    - redacted_summary_template_attached
    - counts_only_definition_present
    - raw_response_forbidden
    - raw_structuredContent_forbidden
    - second_call_requires_new_independent_A5

  still_not_allowed:
    - execute_LT06
    - call_mcp_codex_memory
    - call_real_VCPToolBox
    - call_VCPChat_bridge
```
