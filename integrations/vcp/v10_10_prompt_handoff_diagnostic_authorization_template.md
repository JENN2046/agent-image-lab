# v10.10 Prompt Handoff Diagnostic Authorization Template

本模板用于未来一次无生图 prompt handoff diagnostic。它只用于确认最终请求意图的脱敏摘要和 prompt fingerprint，不允许生成图片、调用 API、保存 raw request、保存 raw plugin output、读取或记录 secret/config 值。

```yaml
a5_prompt_handoff_diagnostic_authorization:
  authorization_status: inactive_template
  approval_phrase: "批准 v10.10 传参诊断"
  diagnostic_type: sanitized_request_preflight
  prompt_id: a5_positive_still_life_prompt_v1
  prompt_source_record: docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md
  expected_prompt_sha256_utf8: f9967d3348a24db6a55652a4c7661f4385aa85c4287b45cba420c9495dece9b6
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls: 0
  api_call_allowed: false
  vcp_plugin_call_allowed: false
  image_creation_allowed: false
  output_directory_write_allowed: false
  config_env_value_read_allowed: false
  allowed_outputs:
    - prompt_id
    - prompt_sha256_utf8
    - prompt_source_record
    - selected_plugin_id
    - selected_plugin_command
    - selected_plugin_model
    - max_plugin_calls
    - sanitized_request_intent_summary_cn
  forbidden_outputs:
    - raw_plugin_dir_path
    - raw_prompt_text
    - raw_request_body
    - raw_response
    - endpoint
    - runtime_log
    - secret_value
  stop_conditions:
    - prompt_hash_mismatch
    - plugin_call_would_be_required
    - api_call_would_be_required
    - image_creation_would_be_required
    - config_env_value_read_would_be_required
    - raw_sensitive_value_would_be_recorded
```

## Short Approval Rule

`批准 v10.10 传参诊断` 只适用于 Codex 刚刚展示本 capsule，且再次确认 `max_plugin_calls=0`、`api_call_allowed=false`、`image_creation_allowed=false` 的场景。

裸 `批准` 不自动套用本模板，除非上一条 Codex 回复刚刚完整展示本 capsule。
