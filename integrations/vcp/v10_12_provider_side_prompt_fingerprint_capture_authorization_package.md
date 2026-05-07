# v10.12 Provider-side Prompt Fingerprint Capture Authorization Package

本文件是 v10.12 provider-side prompt fingerprint capture 的未激活 A5 授权包。它用于未来一次无图片生成的 provider-side echo / sanitized request capture，只验证 provider/request 层收到的 prompt fingerprint。

```yaml
a5_authorization_package:
  authorization_status: inactive_package
  activation_phrase: "批准 v10.12 provider侧指纹捕获"
  target_systems:
    - Agent Image Lab local diagnostic runner
    - DoubaoGen diagnostic request surface
    - provider-side echo or sanitized outbound request capture surface
  exact_allowed_paths:
    - .agent_private/doubaogen_plugin_dir.txt
    - runs/v10_12_provider_side_prompt_fingerprint_capture
  forbidden_paths:
    - VCPChat source tree
    - VCPToolBox source tree
    - any non-ignored raw log location
  selected_plugin_id: DoubaoGen
  selected_plugin_command: provider_side_prompt_fingerprint_capture
  selected_plugin_model: doubao-seedream-5-0-260128
  max_generation_calls_allowed: 0
  max_image_outputs_allowed: 0
  max_provider_echo_calls_allowed_after_activation: 1
  max_sanitized_request_capture_attempts_after_activation: 1
  prompt_id: a5_positive_still_life_prompt_v1
  expected_prompt_sha256_utf8: f9967d3348a24db6a55652a4c7661f4385aa85c4287b45cba420c9495dece9b6
  output_directory_ref: runs/v10_12_provider_side_prompt_fingerprint_capture
  overwrite_existing_files_allowed: false
  daily_note_direct_write_allowed: false
  memory_delta_only: true
  review_required:
    - Gatekeeper
    - Review Console human approval
  allowed_outputs:
    - prompt_id
    - expected_prompt_sha256_utf8
    - local_payload_prompt_sha256_utf8
    - provider_observed_prompt_sha256_utf8
    - provider_echo_supported
    - sanitized_request_capture_performed
    - prompt_hash_match_boolean
  forbidden_outputs:
    - raw_prompt_text
    - raw_plugin_dir_path
    - raw_request_body
    - raw_response_body
    - endpoint
    - runtime_log
    - secret_value
  rollback_plan: "If provider echo/capture cannot complete without raw sensitive data or image generation, stop and write only a sanitized rejected diagnostic result; do not retry automatically."
```

## Non-Activation Notice

本文件本身不授权执行。裸 `批准` 不适用于本包，除非 Codex 刚刚完整展示本 capsule 并且用户明确批准。
