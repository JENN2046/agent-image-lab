# v10.10 A5 Prompt Handoff Diagnostic Preflight Contract

本文定义 v10.10 A5 prompt handoff diagnostic preflight contract。它只允许准备一个无生图、0 插件调用的诊断授权门，用来区分 v10.9 的 prompt mismatch 是模型遵循失败还是请求传递失败。

```yaml
contract:
  name: v10_10_a5_prompt_handoff_diagnostic_preflight
  version: v10.10-a5-prompt-handoff-diagnostic-preflight-contract
  status: diagnostic_preflight_ready_no_generation
  record: docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md
  validation_file: scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js
  previous_record: docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md
  diagnostic_authorization_active: false
```

## Diagnostic Boundary

```yaml
diagnostic_boundary:
  diagnostic_type: sanitized_request_preflight
  prompt_id: a5_positive_still_life_prompt_v1
  prompt_cn_sha256_utf8: f9967d3348a24db6a55652a4c7661f4385aa85c4287b45cba420c9495dece9b6
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls_allowed: 0
  api_call_allowed: false
  vcp_plugin_call_allowed: false
  image_creation_allowed: false
```

## Review Gate

```yaml
review_gate:
  raw_prompt_text_allowed: false
  raw_plugin_dir_path_allowed: false
  raw_request_body_allowed: false
  endpoint_allowed: false
  secret_value_allowed: false
  runtime_log_allowed: false
  sanitized_request_intent_summary_cn_allowed: true
  prompt_hash_mismatch_blocks_execution: true
```

## Next Gate

```yaml
next_gate:
  diagnostic_requires_new_authorization: true
  generation_retry_requires_new_authorization: true
  alternate_plugin_requires_new_authorization: true
  daily_note_memory_requires_accepted_asset_and_new_authorization: true
  commit_tag_push_pr_release_requires_separate_authorization: true
```
