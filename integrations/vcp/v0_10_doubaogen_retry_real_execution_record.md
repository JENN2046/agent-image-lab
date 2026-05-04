# v0.10 DoubaoGen Retry Real Execution Record

This record summarizes the authorized v0.10 DoubaoGen retry attempt. It is
sanitized and does not store raw plugin output, secrets, raw endpoints, runtime
logs, cookies, passwords, or image binary data in project docs.

## Sanitized Execution Summary

```yaml
doubaogen_retry_execution_record:
  phase: v0.10_doubaogen_retry_real_execution
  status: completed_validated_with_human_acceptance
  selected_plugin_id: DoubaoGen
  command: generate
  model_ref: doubao-seedream-5-0-260128
  max_plugin_calls_authorized: 1
  actual_plugin_calls: 1
  gatekeeper_approved: true
  review_console_human_approved: true
  api_called: true
  vcp_plugin_called: true
  file_write_performed: true
  image_file_created: true
  rollback_performed: false
  daily_note_called: false
  daily_note_direct_write_allowed: false
  memory_delta_only: true
  output_directory_ref: runs/photo_studio_os_v0_10_doubao_retry
  generated_image_count: 1
  generated_image_ref: runs/photo_studio_os_v0_10_doubao_retry/image/doubaogen/bcbe3b60-6f7b-4e92-8a9d-b5044a86b7c3.jpg
  generated_image_bytes: 286631
  generated_image_sha256: b162fab50e6a5bf95b8f761441149ee27d498a3b136eafe6322f05c5499d06f0
  raw_plugin_output_saved: false
  secret_value_saved: false
  endpoint_raw_saved: false
  runtime_log_saved: false
  image_binary_saved_to_memory: false
  vcp_toolbox_files_modified: false
  isolated_runtime_used: true
  plugin_runtime_secret_cache_blocked: true
```

## Visual Review

```yaml
visual_review:
  status: accepted_by_human_override
  human_acceptance_override: true
  usable_for_next_phase: true
  prompt_compliance_perfect: false
  known_deviations:
    - generated image contains readable text
    - generated image contains logo-like marks
    - generated image contains letters and numbers despite explicit ban
  no_people_observed: true
  accepted_as_project_cover: true
  additional_plugin_call_authorized: false
  next_action_requires_new_user_authorization: true
```

## Memory Delta

```yaml
memory_delta:
  generated: draft_only
  direct_daily_note_write: false
  binary_image_to_memory: false
  record_ref: runs/photo_studio_os_v0_10_doubao_retry/memory_delta_request.sanitized.yaml
```

## Conclusion

The v0.10 DoubaoGen retry completed exactly one authorized real plugin call with
the requested model reference. The output is accepted by human override for
continuing to the next phase. Known visual deviations remain recorded rather
than erased: the image contains visible text, logo-like marks, and letters or
numbers despite the explicit prompt constraints. Any further retry requires a
new explicit authorization and a fresh max-call budget.
