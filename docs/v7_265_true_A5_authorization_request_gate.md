# v7.265 True A5 Authorization Request Gate

中文：真正 A5 授权请求门。

```yaml
phase: v7.265_true_A5_authorization_request_gate
base_contract: AGENTS.md
mode: A4
intent: local_draft
risk_level: R3
source_commit: eecbae59a0d6f3e4c44d4de16bf5b74aede5fbb8
source_phase: v7.264_project_plugin_A5_authorization_draft_review_gate
authorization_package_id: AUTH-PENDING-PROJECT-PLUGIN-20260513-001
authorization_status: pending_human_preflight_approval
approval_status: requested_for_preflight_only
active: false
execute_now: false
```

## Plain Meaning

```text
这一步把“真正 A5”需要审批的对象写清楚。
它已经不再是空白草案：prompt 包、插件、模型、输出目录和预算都固定了。
但它仍不是执行授权。
下一步最多只能先跑 preflight；preflight 通过以后，才可以再请求真实生成授权。
```

## Executive Verdict

```yaml
overall_status: completed_validated
true_A5_authorization_request_created: true
active_A5_authorization_created: false
A5_execution_allowed_now: false
provider_contact_allowed_now: false
plugin_call_allowed_now: false
image_generation_allowed_now: false
output_write_allowed_now: false
env_value_read_allowed_now: false
runtime_execution_allowed_now: false
memory_write_allowed_now: false
same_provider_retry_allowed_now: false
recommended_next_phase: run_true_A5_preflight_only_after_exact_approval
recommended_next_phase_zh: 收到精确授权语后只运行真正 A5 preflight
auto_execution_allowed_for_next: false
```

## 中文字段说明

```yaml
field_notes_cn:
  authorization_package_id: "本次授权包编号，后续批准语必须逐字引用。"
  selected_project_plugin: "准备使用的项目内插件；这里只能是 NativeDoubaoImage。"
  selected_command: "插件命令；这里只能是 generate。"
  selected_model: "模型名；后续 preflight 和执行必须一致。"
  prompt_package_ref: "被批准引用的 prompt 包路径，必须在 prompts/image_generation/ 下。"
  output_directory_ref: "未来真实图片输出目录，必须在 runs/real_generation/ 下，且只允许新建文件不覆盖。"
  max_plugin_calls: "本次最多插件调用次数；必须等于 1。"
  retry_limit: "自动重试次数；必须等于 0。"
  preflight_only_approval_phrase: "你下一步可以复制/改名审批人的授权语；它只允许 preflight，不允许生成。"
```

## Pending A5 Authorization Package

```yaml
a5_authorization_package:
  authorization_package_id: AUTH-PENDING-PROJECT-PLUGIN-20260513-001
  package_type: project_plugin_generation_authorization
  status: pending_human_preflight_approval
  approval_status: requested_for_preflight_only
  active: false
  execute_now: false
  expires_at: 2026-05-14 23:59 Asia/Shanghai
  reviewer: Jenn
  version: v1

  selected_project_plugin:
    plugin_id: NativeDoubaoImage
    plugin_name: Native Doubao Image Plugin
    command: generate
    mode: text_to_image
    required_model: doubao-seedream-5-0-260128
    prompt_root: prompts/image_generation/
    output_root: runs/real_generation/

  generation_inputs:
    generation_plan_ref: GP-PROJECT-PLUGIN-20260513-001
    generation_plan_version: v1
    prompt_package_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
    prompt_package_status_required: approved_for_authorization
    real_product_brief_allowed: false
    synthetic_or_redacted_brief_only_until_activation: true
    source_fixture_ref: docs/product_workflow_fixture_packet.md
    source_fixture_id: PWFIX-20260513-001

  execution_budget:
    max_plugin_calls: 1
    max_images_created: 1
    retry_limit: 0
    hidden_second_call_forbidden: true
    retry_requires_new_authorization: true

  output_policy:
    output_directory_ref: runs/real_generation/A5-PROJECT-PLUGIN-20260513-001/
    output_save_allowed_after_separate_execution_approval: true
    overwrite_existing_files_allowed: false
    create_directory_if_missing_after_execution_approval: true
    raw_provider_payload_retention_policy: forbidden
    raw_stdout_stderr_retention_policy: forbidden
    public_result_redaction_policy:
      allow:
        - status
        - sanitized_error_category
        - image_count
        - model_requested
        - model_reported
        - files_written_count
      forbid:
        - b64_json
        - provider_url
        - raw_response
        - raw_payload
        - raw_endpoint
        - secret
        - private_path

  provider_and_secret_policy:
    provider_contact_allowed_now: false
    provider_contact_requires_later_execution_approval: true
    quota_or_rate_limit_resolution_evidence: not_provided
    same_provider_retry_risk: high
    same_provider_retry_allowed_by_default: false
    env_file_field_name_preflight_allowed_only_after_exact_preflight_approval: true
    env_value_read_allowed_only_after_separate_execution_approval: true
    env_values_must_not_be_printed_copied_committed_logged_or_memorized: true

  memory_and_review_policy:
    human_review_required_after_any_future_asset: true
    review_surface_ref: delivery_review_surface_package
    memory_suitability_decision_required: true
    memory_write_allowed: false
    daily_note_write_allowed: false
    memory_delta_only_after_separate_approval: true

  required_preflight_before_any_execution:
    - worktree_clean
    - branch_master_tracking_origin_master
    - approval_phrase_exact_match_for_preflight_only
    - prompt_package_ref_exists_under_prompts_image_generation
    - output_directory_ref_under_runs_real_generation
    - output_directory_has_no_existing_file_overwrite_risk
    - max_plugin_calls_equals_1
    - max_images_created_equals_1
    - retry_limit_equals_0
    - native_doubao_sandbox_validator_passed
    - current_state_alignment_validator_passed
    - mvp_validator_passed
    - no_env_value_printing
    - no_raw_stdout_stderr_retention
    - no_raw_provider_payload_retention
    - quota_or_rate_limit_risk_acknowledged

  activation_blockers_before_real_generation:
    - exact_execution_approval_not_received
    - A5_preflight_not_run
    - quota_or_rate_limit_resolution_evidence_not_provided
    - same_provider_retry_risk_high
    - provider_contact_not_authorized_now
    - plugin_call_not_authorized_now
    - image_generation_not_authorized_now

  stop_conditions:
    - quota_or_rate_limit
    - credential_or_auth_failure
    - model_mismatch
    - prompt_package_ref_outside_prompts_image_generation
    - output_directory_outside_runs_real_generation
    - existing_output_file_would_be_overwritten
    - unexpected_raw_payload_or_raw_url_returned_publicly
    - suspected_secret_exposure
    - dirty_worktree
    - validation_failure
    - any_second_call_required
    - any_memory_write_requested
    - any_DailyNote_write_requested
```

## Preflight Approval Phrase

这句只允许 preflight。它不允许 provider contact、插件调用、生成图片、读取
`.env.local` 密钥值、写输出图、写 DailyNote 或写 VCP memory。

```text
批准进入 AUTH-PENDING-PROJECT-PLUGIN-20260513-001 A5 preflight：使用项目内 NativeDoubaoImage，命令 generate，模型 doubao-seedream-5-0-260128，prompt_package_ref=prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml，output_directory=runs/real_generation/A5-PROJECT-PLUGIN-20260513-001/，max_plugin_calls=1，max_images_created=1，retry_limit=0；仅运行 preflight，不调用 provider，不生成图片，不读取 .env.local 密钥值，不写 DailyNote，不写 VCP memory，不 push/tag/release；审批人 Jenn。
```

## Later Execution Approval Is Separate

```yaml
real_generation_execution_approval:
  required_after_preflight_passes: true
  required_extra_acknowledgement:
    - quota_or_rate_limit_resolution_evidence_or_explicit_risk_override
    - env_value_subprocess_only_policy
    - provider_contact_allowed_once
    - plugin_call_allowed_once
    - image_generation_allowed_once
    - output_save_allowed_once_under_output_directory_ref
  not_requested_by_this_gate: true
```

## Explicit Non-Authorization

```yaml
not_authorized_by_v7_265:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  output_write: false
  env_value_read: false
  raw_stdout_or_stderr_capture: false
  raw_provider_payload_capture: false
  DailyNote_write: false
  VCP_memory_write: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  CDP_or_bridge_or_MCP: false
  tag_release_deploy_push: false
```

## Recommended Next State

```yaml
recommended_next:
  phase: run_true_A5_preflight_only_after_exact_approval
  zh: 收到上面的精确授权语后，只运行真正 A5 preflight
  type: A5_preflight_only
  purpose: >
    Verify the fixed prompt package, output directory policy, call budget,
    sandbox validator, and no-secret/no-provider-contact boundary before any
    later real generation approval is considered.
  auto_execution_allowed: false
```

## Closeout Template

```yaml
closeout:
  phase: v7.265_true_A5_authorization_request_gate
  commit_hash: <hash>
  commit_message: "docs: request true project plugin A5 preflight authorization"
  branch: master
  source_commit: eecbae59a0d6f3e4c44d4de16bf5b74aede5fbb8
  push: not_performed
  authorization_request:
    package_id: AUTH-PENDING-PROJECT-PLUGIN-20260513-001
    selected_project_plugin: NativeDoubaoImage
    selected_command: generate
    selected_model: doubao-seedream-5-0-260128
    prompt_package_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
    output_directory_ref: runs/real_generation/A5-PROJECT-PLUGIN-20260513-001/
    status: pending_human_preflight_approval
    active_A5_authorization_created: false
  safety:
    A5_execution: false
    provider_contact: false
    plugin_call: false
    image_generation: false
    runtime_execution: false
    memory_write: false
    env_value_read_or_printed: false
  recommended_next:
    phase: run_true_A5_preflight_only_after_exact_approval
    auto_execution_allowed: false
```

## Validation Closeout

```yaml
validation_closeout:
  status: completed_validated
  validation:
    git_diff_check: passed
    current_state_alignment: passed
    agent_board_state: passed
    native_doubao_sandbox: passed
    validate_mvp: passed
    validate_agent_image_lab_local: passed_with_existing_manual_review_warnings
  boundary:
    A5_execution: false
    provider_contact: false
    plugin_call: false
    image_generation: false
    env_value_read_or_printed: false
    DailyNote_write: false
    VCP_memory_write: false
```
