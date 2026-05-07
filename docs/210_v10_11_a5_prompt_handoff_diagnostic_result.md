# v10.11 A5 Prompt Handoff Diagnostic Result

本文记录 Agent Image Lab v10.11 A5 prompt handoff diagnostic result。用户明确批准 `批准 v10.10 传参诊断` 后，本阶段只执行无生图、0 插件调用的本地脱敏诊断：校验 v10.8 锁定 prompt fingerprint、v10.9 记录中的 prompt handoff 字段，以及项目内 runner 的 payload prompt 来源。

本阶段不读取真实 PluginDir 内容，不读取 `config.env` 值，不调用插件，不调用 API，不创建图片，不写 DailyNote，不写 VCP memory，不执行 commit/tag/push/PR/release。

```yaml
status: completed_validated_v10_11_a5_prompt_handoff_diagnostic_result
version: v10.11
current_phase: "v10.11 A5 prompt handoff diagnostic result"
validation_file: scripts/validate_v10_11_a5_prompt_handoff_diagnostic_result.js
previous_phase: "v10.10 A5 prompt handoff diagnostic preflight"
previous_record: docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md
default_next_phase: "BLOCKED for provider-side echo, alternate plugin, prompt redesign, or real generation authorization"
```

## Authorization Applied

```yaml
authorization_applied:
  approval_phrase: "批准 v10.10 传参诊断"
  diagnostic_type: sanitized_request_preflight
  prompt_id: a5_positive_still_life_prompt_v1
  expected_prompt_sha256_utf8: f9967d3348a24db6a55652a4c7661f4385aa85c4287b45cba420c9495dece9b6
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls_authorized: 0
  api_call_allowed: false
  vcp_plugin_call_allowed: false
  image_creation_allowed: false
  config_env_value_read_allowed: false
```

## Diagnostic Result

```yaml
diagnostic_result:
  diagnostic_performed: true
  prompt_source_record_checked: docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md
  prompt_text_recorded_here: false
  prompt_chars_observed: 100
  prompt_sha256_utf8: f9967d3348a24db6a55652a4c7661f4385aa85c4287b45cba420c9495dece9b6
  prompt_hash_matches_expected: true
  prompt_id_matches_v10_9: true
  prompt_auto_edited_in_v10_9: false
  local_runner_file_checked: scripts/run_v0_7_photo_studio_os_real_execution.ps1
  local_runner_payload_prompt_source: InputReference
  local_runner_payload_model_source: ModelOverride
  local_runner_prompt_rewrite_detected: false
  private_binding_file_exists: true
  private_binding_file_content_read: false
  real_plugin_dir_read: false
  config_env_value_read: false
```

## Boundary Record

```yaml
boundary_record:
  actual_plugin_calls: 0
  api_called: false
  vcp_plugin_called: false
  image_created: false
  output_directory_written: false
  raw_request_body_saved: false
  raw_plugin_output_saved: false
  raw_endpoint_saved: false
  raw_runtime_log_saved: false
  secret_value_saved: false
  daily_note_called: false
  vcp_memory_written: false
  submitDraft_called: false
  commit_performed: false
  tag_performed: false
  push_performed: false
  pr_created: false
  github_release_created: false
```

## Interpretation

```yaml
interpretation:
  prompt_text_wrong_in_repo: false
  local_prompt_hash_mismatch: false
  local_runner_handoff_mismatch_detected: false
  provider_side_request_observed: false
  root_cause_fully_known: false
  model_adherence_failure_still_possible: true
  provider_or_plugin_side_handoff_failure_not_ruled_out: true
  recommended_next_safe_step: provider_side_echo_or_alternate_plugin_strategy_under_new_authorization
```

## Result Meaning

v10.11 表示：本地仓库里的锁定 prompt、v10.9 记录的 prompt id / auto-edit 状态，以及项目内 runner 的 prompt 字段来源是一致的。当前没有证据表明仓库内 prompt 写错或本地 runner 层主动改写 prompt。

但本诊断没有调用插件，也没有保存 raw request，因此仍不能证明 provider 侧实际收到的请求体。下一步若要继续定位，只能在新的明确授权下执行 provider-side echo / dry-run request capture（仍不得保存 secret、endpoint 或 raw request），或切换插件/策略。
