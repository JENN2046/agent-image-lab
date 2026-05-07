# v10.12 A5 Provider-side Prompt Fingerprint Capture Authorization Package

本文记录 Agent Image Lab v10.12 A5 provider-side prompt fingerprint capture authorization package。v10.11 已确认本地锁定 prompt hash 匹配，项目内 runner 的 prompt 来源为 `InputReference`，未发现本地 runner 层 prompt 改写；但 provider-side request 仍未观测。因此下一步若要继续定位，需要一个独立 A5 授权包，用来执行 provider-side echo 或 sanitized request capture，只验证 provider/request 层收到的 prompt fingerprint。

本阶段只创建授权包，不执行它。本阶段不读取真实 PluginDir 内容，不读取 `.agent_private` 绑定内容，不读取 `config.env` 值，不调用插件，不调用 API，不创建图片，不写 DailyNote，不写 VCP memory，不执行 commit/tag/push/PR/release。

```yaml
status: completed_validated_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package
version: v10.12
current_phase: "v10.12 A5 provider-side prompt fingerprint capture authorization package"
validation_file: scripts/validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js
previous_phase: "v10.11 A5 prompt handoff diagnostic result"
previous_record: docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md
default_next_phase: "BLOCKED for explicit v10.12 provider-side fingerprint capture activation"
```

## Inactive Authorization Package

```yaml
a5_provider_side_prompt_fingerprint_capture_authorization_package:
  authorization_status: inactive_package
  execution_authorized_by_this_record: false
  activation_phrase: "批准 v10.12 provider侧指纹捕获"
  target_systems:
    - Agent Image Lab local diagnostic runner
    - DoubaoGen diagnostic request surface
    - provider-side echo or sanitized outbound request capture surface
  selected_plugin_id: DoubaoGen
  selected_plugin_command: provider_side_prompt_fingerprint_capture
  selected_plugin_model: doubao-seedream-5-0-260128
  prompt_id: a5_positive_still_life_prompt_v1
  prompt_source_record: docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md
  expected_prompt_sha256_utf8: f9967d3348a24db6a55652a4c7661f4385aa85c4287b45cba420c9495dece9b6
  max_generation_calls_allowed: 0
  max_image_outputs_allowed: 0
  max_provider_echo_calls_allowed_after_activation: 1
  max_sanitized_request_capture_attempts_after_activation: 1
  overwrite_existing_files_allowed: false
  output_directory_ref: runs/v10_12_provider_side_prompt_fingerprint_capture
  output_directory_must_be_empty_or_new: true
```

## Allowed Operations After Activation

```yaml
allowed_operations_after_activation:
  read_ignored_private_binding_file_for_plugin_dir: true
  record_raw_plugin_dir_path: false
  check_doubaogen_js_exists: true
  use_config_env_values_as_runtime_environment_only: true
  record_config_env_values: false
  build_request_from_locked_prompt: true
  compute_local_payload_prompt_sha256: true
  perform_provider_echo_if_no_image_generation: true
  perform_sanitized_outbound_request_capture_if_no_image_generation: true
  record_provider_observed_prompt_sha256: true
  record_provider_observed_prompt_text: false
  record_raw_request_body: false
  record_raw_response_body: false
  record_endpoint: false
  record_runtime_log: false
  create_image: false
  call_daily_note: false
  write_vcp_memory: false
```

## Allowed Diagnostic Output

```yaml
allowed_diagnostic_output:
  prompt_id: true
  prompt_source_record: true
  expected_prompt_sha256_utf8: true
  local_payload_prompt_sha256_utf8: true
  provider_observed_prompt_sha256_utf8: true
  provider_echo_supported: true
  sanitized_request_capture_performed_boolean: true
  prompt_hash_match_boolean: true
  selected_plugin_id: true
  selected_plugin_command: true
  selected_plugin_model: true
  diagnostic_call_count: true
  raw_prompt_text: false
  raw_plugin_dir_path: false
  raw_request_body: false
  raw_response_body: false
  endpoint: false
  runtime_log: false
  secret_value: false
```

## Forbidden Operations

```yaml
forbidden_operations:
  real_generation: true
  image_file_creation: true
  daily_note_write: true
  vcp_memory_write: true
  submitDraft: true
  raw_prompt_text_recording: true
  raw_request_body_recording: true
  raw_response_body_recording: true
  raw_endpoint_recording: true
  runtime_log_recording: true
  secret_value_recording: true
  plugin_dir_raw_path_recording: true
  dependency_change: true
  commit_tag_push_pr_release: true
```

## Stop Conditions

```yaml
stop_conditions:
  activation_phrase_missing: true
  prompt_hash_mismatch_before_provider_contact: true
  provider_echo_requires_image_generation: true
  provider_echo_not_supported_and_capture_would_save_raw_request: true
  diagnostic_attempt_count_would_exceed_one: true
  output_directory_collision: true
  raw_sensitive_value_would_be_recorded: true
  endpoint_would_be_recorded: true
  runtime_log_would_be_recorded: true
  image_file_would_be_created: true
  daily_note_or_memory_write_would_be_triggered: true
```

## Validation Required After Future Activation

```yaml
validation_required_after_activation:
  - prompt fingerprint before provider contact must equal expected_prompt_sha256_utf8
  - actual_generation_calls must equal 0
  - image_created must equal false
  - raw_request_body_saved must equal false
  - raw_response_body_saved must equal false
  - endpoint_saved must equal false
  - runtime_log_saved must equal false
  - secret_value_saved must equal false
  - provider_observed_prompt_sha256_utf8 may be saved only as hash
  - provider_side_request_text_observed must equal false
```

## Result Meaning

v10.12 表示：provider-side echo / sanitized request capture 的下一步授权包已经本地化并可验证。它仍然不是执行授权；只有用户后续明确批准 `批准 v10.12 provider侧指纹捕获`，并且 preflight 确认不会生成图片、不会保存 raw request、不会记录 endpoint/secret/runtime log，才允许进入下一步诊断。
