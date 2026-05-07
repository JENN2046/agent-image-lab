# v10.10 A5 Prompt Handoff Diagnostic Preflight

本文记录 Agent Image Lab v10.10 A5 prompt handoff diagnostic preflight。v10.9 已证明一次短批准 DoubaoGen 正向静物生成会产出与锁定 prompt 严重不匹配的人像/自然水景资产；但由于授权边界禁止保存 raw request、raw plugin output、endpoint 和 runtime log，当前只能确认本地 prompt lock 与 runner 入参链路，没有足够证据区分“模型未遵循 prompt”和“插件实际请求体未收到正确 prompt”。

本阶段只准备下一步无生图诊断门：对将来可能执行的 request preflight / echo 检查规定允许记录的脱敏字段、禁止记录的敏感字段、最大插件调用次数为 0，以及停止条件。本阶段不读取真实 PluginDir，不读取 `config.env`，不调用插件，不调用 API，不创建图片，不写 DailyNote，不写 VCP memory，不执行 commit/tag/push/PR/release。

```yaml
status: completed_validated_v10_10_a5_prompt_handoff_diagnostic_preflight
version: v10.10
current_phase: "v10.10 A5 prompt handoff diagnostic preflight"
validation_file: scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js
previous_phase: "v10.9 A5 positive still-life generation rejected asset record"
previous_record: docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md
default_next_phase: "BLOCKED for explicit no-generation prompt handoff diagnostic authorization"
```

## Diagnostic Question

```yaml
diagnostic_question:
  root_cause_known: false
  prompt_text_wrong_in_repo: false
  prompt_auto_edited_in_v10_9: false
  model_adherence_failure_possible: true
  plugin_request_handoff_failure_possible: true
  next_diagnostic_goal: "verify sanitized final request intent before any new generation"
```

## Locked Prompt Fingerprint

```yaml
locked_prompt_fingerprint:
  prompt_id: a5_positive_still_life_prompt_v1
  prompt_source_record: docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md
  prompt_cn_sha256_utf8: f9967d3348a24db6a55652a4c7661f4385aa85c4287b45cba420c9495dece9b6
  prompt_text_recorded_here: false
  prompt_auto_edit_allowed: false
  prompt_summary_cn: "明亮摄影棚桌面静物，相机镜头主体，柔光灯板，空白色块卡，亚克力几何片，浅灰桌面，无标识、无标记、无人物。"
```

## Proposed No-generation Diagnostic Gate

```yaml
proposed_no_generation_diagnostic_gate:
  diagnostic_authorization_active: false
  diagnostic_type: sanitized_request_preflight
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls_allowed: 0
  api_call_allowed: false
  vcp_plugin_call_allowed: false
  image_creation_allowed: false
  output_directory_write_allowed: false
  config_env_value_read_allowed: false
  config_env_existence_check_allowed_after_authorization: true
  raw_plugin_dir_path_recording_allowed: false
  raw_request_body_recording_allowed: false
  raw_response_recording_allowed: false
  endpoint_recording_allowed: false
  runtime_log_recording_allowed: false
```

## Allowed Diagnostic Output

```yaml
allowed_diagnostic_output:
  prompt_id_allowed: true
  prompt_sha256_allowed: true
  prompt_source_record_allowed: true
  selected_plugin_id_allowed: true
  selected_plugin_command_allowed: true
  selected_plugin_model_allowed: true
  max_plugin_calls_zero_allowed: true
  sanitized_request_intent_summary_cn_allowed: true
  raw_prompt_text_allowed: false
  raw_plugin_dir_path_allowed: false
  secret_value_allowed: false
  endpoint_allowed: false
  runtime_log_allowed: false
  raw_request_body_allowed: false
```

## Stop Conditions

```yaml
stop_conditions:
  would_call_plugin: true
  would_call_api: true
  would_create_image: true
  would_read_config_env_value: true
  would_record_raw_path: true
  would_record_raw_request: true
  would_record_endpoint: true
  would_record_runtime_log: true
  output_directory_collision: true
  prompt_hash_mismatch: true
  user_requests_retry_generation_without_new_a5_package: true
```

## No-execution Guard

```yaml
no_execution_guard:
  real_plugin_dir_read: false
  config_env_read: false
  plugin_called: false
  api_called: false
  vcp_plugin_called: false
  image_created: false
  daily_note_called: false
  vcp_memory_written: false
  submitDraft_called: false
  commit_performed: false
  tag_performed: false
  push_performed: false
  pr_created: false
  github_release_created: false
```

## Result Meaning

v10.10 表示：项目已把 v10.9 的失败原因拆成两个可诊断方向，并准备了一个无生图、0 插件调用的 prompt handoff diagnostic gate。它不是新的真实生成授权，也不允许读取 secret/config 值或保存 raw request；下一步如果要执行诊断，需要用户明确批准 v10.10 诊断 capsule。
