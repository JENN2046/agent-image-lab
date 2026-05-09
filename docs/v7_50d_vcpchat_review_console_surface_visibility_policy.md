# v7.50d VCPChat Review Console Surface Visibility Policy

定义未来 UI 展示边界。

### Visibility layers

```yaml
visibility_layers:
  public_surface:
    allowed:
      - phase
      - status
      - safe_summary
      - returned_resource_refs
      - safety_gate_result
      - current_case_state
    forbidden:
      - secrets
      - raw_payloads
      - image_binary
      - private_absolute_path

  operator_surface:
    allowed:
      - hard_stops
      - validation_result
      - dry_run_result
      - closed_case_reason
    forbidden:
      - api_key
      - token
      - raw_response_payload
      - local_private_path

  internal_evidence_refs:
    allowed:
      - repository_relative_paths_only
      - text_only_refs
    forbidden:
      - full_file_content_by_default
      - binary_file_content
      - runs_directory_content
```

必须写明：

- UI 默认只能显示 repository-relative refs。
- UI 默认不能展开全文。
- UI 默认不能显示 image binary。
- UI 默认不能提供 memory write button。
- UI 不能把 `accepted_with_minor_warning` 显示为 `production_approved`。
- UI 不能把 `closed_no_memory_write` 显示为可写 memory。
