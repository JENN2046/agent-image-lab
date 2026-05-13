# v7.263 Project Plugin A5 Authorization Package Draft Gate

中文：项目内插件 A5 授权包草案门。

```yaml
phase: v7.263_project_plugin_A5_authorization_package_draft_gate
base_contract: AGENTS.md
mode: A4
intent: local_draft
risk_level: R1
source_commit: ba8dc7e02cfd30c5b85e75f96d3739ab46fa4c4b
source_phase: v7.262_project_plugin_route_authorization_planning_gate
draft_package_id: AUTH-DRAFT-PROJECT-PLUGIN-20260513-001
authorization_status: draft
approval_status: not_requested
execute_now: false
```

## Executive Verdict

```yaml
overall_status: pass
authorization_package_draft_created: true
active_A5_authorization_created: false
plugin_call_allowed_now: false
provider_contact_allowed_now: false
image_generation_allowed_now: false
runtime_execution_allowed_now: false
memory_write_allowed_now: false
same_provider_retry_allowed_now: false
recommended_next_phase: v7.264_project_plugin_A5_authorization_draft_review_gate
recommended_next_phase_zh: 项目内插件 A5 授权包草案复核门
auto_execution_allowed_for_next: false
```

This gate creates the paper package a future owner would review before any real
project-plugin generation attempt. It does not activate A5. It does not contact
the provider. It does not call `NativeDoubaoImage`. It does not create images.

## Plain Meaning

中文解释：

```text
这一步只是写“如果以后要用项目内插件生成图片，授权包必须长什么样”。
它不是批准生成。
它不是插件调用。
它不是 provider 重试。
它不能被“继续”“ok”“可以”等模糊词激活。
```

## Draft Authorization Package

```yaml
a5_authorization_package:
  authorization_package_id: AUTH-DRAFT-PROJECT-PLUGIN-20260513-001
  package_type: project_plugin_generation_authorization
  status: draft
  approval_status: not_requested
  active: false
  execute_now: false
  expires_at: null
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
    generation_plan_ref: GP-FUTURE-PROJECT-PLUGIN-TBD
    generation_plan_version: v1
    prompt_package_ref: prompts/image_generation/<future-approved-package>.yaml
    prompt_package_status_required: approved_for_authorization
    real_product_brief_allowed: false
    synthetic_or_redacted_brief_only_until_activation: true

  execution_budget:
    max_plugin_calls: 1
    max_images_created: 1
    retry_limit: 0
    hidden_second_call_forbidden: true
    retry_requires_new_authorization: true

  output_policy:
    output_directory_ref: runs/real_generation/<future-run-id>/
    output_save_allowed_after_activation: true
    overwrite_existing_files_allowed: false
    output_directory_must_pass_sandbox_validator: true
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
    provider_contact_allowed_only_after_activation: true
    provider_path_status: blocked_pending_quota_or_rate_limit_resolution_or_new_path
    quota_or_rate_limit_resolution_evidence: required_before_activation
    same_provider_retry_allowed_now: false
    env_file_read_allowed_now: false
    env_value_handling_policy: field_names_only_until_A5_preflight
    env_values_must_not_be_printed_or_copied: true

  memory_and_review_policy:
    human_review_required_after_any_future_asset: true
    review_surface_ref: delivery_review_surface_package
    memory_suitability_decision_required: true
    memory_write_allowed: false
    daily_note_write_allowed: false
    memory_delta_only_after_separate_approval: true

  required_preflight_before_activation:
    - worktree_clean
    - branch_master_tracking_origin_master
    - authorization_status_active
    - approval_phrase_exact_match
    - provider_quota_or_rate_limit_resolved_or_new_path_selected
    - generation_plan_ref_matches
    - prompt_package_ref_under_allowed_root
    - output_directory_under_allowed_root
    - max_plugin_calls_equals_1
    - max_images_created_equals_1
    - retry_limit_equals_0
    - native_doubao_sandbox_validator_passed
    - no_env_value_printing
    - no_raw_stdout_stderr_retention
    - no_raw_provider_payload_retention
    - human_review_handoff_ready

  stop_conditions:
    - quota_or_rate_limit
    - credential_or_auth_failure
    - model_mismatch
    - prompt_package_ref_outside_prompts_image_generation
    - output_directory_outside_runs_real_generation
    - unexpected_raw_payload_or_raw_url_returned_publicly
    - suspected_secret_exposure
    - dirty_worktree
    - validation_failure
    - any_second_call_required
    - any_memory_write_requested
    - any_DailyNote_write_requested
```

## Human Approval Phrase Template

This is a template only. It is not requested and not active in this phase.

```text
批准 AUTH-DRAFT-PROJECT-PLUGIN-20260513-001 for GP-FUTURE-PROJECT-PLUGIN-TBD, plugin=NativeDoubaoImage, model=doubao-seedream-5-0-260128, max_plugin_calls=1, max_images_created=1, retry_limit=0
```

The phrase cannot activate this draft unless a later review gate explicitly
marks the package active and confirms all preflight items.

## Activation Blockers

```yaml
activation_blockers:
  provider_quota_or_rate_limit_resolution_missing: true
  generation_plan_ref_finalized: false
  prompt_package_ref_finalized: false
  output_directory_ref_finalized: false
  active_human_approval_requested: false
  exact_approval_phrase_received: false
  A5_preflight_passed: false
```

## Explicit Non-Authorization

```yaml
not_authorized_by_v7_263:
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
  tag_release_deploy: false
```

## Recommended Next Phase

```yaml
recommended_next:
  phase: v7.264_project_plugin_A5_authorization_draft_review_gate
  zh: 项目内插件 A5 授权包草案复核门
  type: A4_read_only_or_docs_review
  purpose: >
    Review whether AUTH-DRAFT-PROJECT-PLUGIN-20260513-001 is internally
    complete, still inactive, and safe to keep as future paperwork.
  auto_execution_allowed: false
```

## Closeout Template

```yaml
closeout:
  phase: v7.263_project_plugin_A5_authorization_package_draft_gate
  commit_hash: <hash>
  commit_message: "docs: add project plugin A5 authorization draft"
  branch: master
  source_commit: ba8dc7e02cfd30c5b85e75f96d3739ab46fa4c4b
  push: not_performed
  draft_package:
    package_id: AUTH-DRAFT-PROJECT-PLUGIN-20260513-001
    selected_project_plugin: NativeDoubaoImage
    selected_command: generate
    selected_model: doubao-seedream-5-0-260128
    status: draft
    approval_status: not_requested
    execute_now: false
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
    phase: v7.264_project_plugin_A5_authorization_draft_review_gate
    auto_execution_allowed: false
```
