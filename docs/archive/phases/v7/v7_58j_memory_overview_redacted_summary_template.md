# Redacted Summary Template — memory_overview LT-06

> Template for the redacted execution closeout report. No raw values, no paths, no file names, no memory IDs, no audit log excerpts, no source file names, no sample values.

```yaml
memory_overview_redacted_summary_template:
  response_status: success | failed | aborted
  call_count: 1
  endpoint_used_redacted: POST /mcp/codex-memory
  tool_name_used: memory_overview
  exact_payload_id: lt06-memory-overview-001

  side_effect_summary:
    file_write_detected: false
    audit_log_write_detected: false
    DailyNote_write_detected: false
    VCP_memory_write_detected: false
    plugin_execution_detected: false
    image_generation_detected: false

  top_level_keys_present:
    - summary
    - recentAudit
    - recentFiles
    - memoryLinks
    - adaptive
    - recall

  counts_only:
    recentAudit_count:
    recentFiles_process_count:
    recentFiles_knowledge_count:
    memoryLinks_count:
    recall_recent_count:

  redacted_error_type_if_any:
```

## Template Forbidden

- no sample values
- no file basenames
- no path suffixes
- no memory id prefixes
- no raw recent item excerpts
- no source file names
- no audit log snippets
