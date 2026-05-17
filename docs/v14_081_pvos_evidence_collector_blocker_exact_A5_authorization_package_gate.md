# V14.081 PVOS Evidence Collector Blocker Exact A5 Authorization Package Gate

```yaml
phase: v14_081_pvos_evidence_collector_blocker_exact_A5_authorization_package_gate
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_draft
risk_level: R3
source_phase: v14_080_pvos_evidence_collector_blocker_A5_authorization_package_draft_gate
source_commit: 5d6e2ba
authorization_package_id: AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001
authorization_status: pending_human_preflight_approval
approval_status: requested_for_preflight_only
active: false
execute_now: false
```

## Purpose

This gate fills the exact A5 authorization package fields needed for a future
human-reviewed NativeDoubaoImage preflight after the PVOS evidence collector and
blocker pipeline baseline.

This is still an A4.8 local drafting gate. It does not activate A5, run the
runner, contact the provider, call a plugin, call an API, generate an image,
read `.env.local` secret values, create an output directory, write DailyNote,
write VCP memory, write accepted samples, write production candidates, read real
VCPChat, read real VCPToolBox, read a real manifest, push, tag, release, or
deploy.

## Executive Verdict

```yaml
overall_status: completed_exact_package_pending_human_preflight_approval
exact_A5_authorization_package_filled: true
active_A5_authorization_created: false
A5_execution_allowed_now: false
preflight_allowed_now: false
provider_contact_allowed_now: false
plugin_call_allowed_now: false
api_call_allowed_now: false
image_generation_allowed_now: false
runtime_execution_allowed_now: false
env_value_read_allowed_now: false
output_directory_creation_allowed_now: false
output_write_allowed_now: false
DailyNote_write_allowed_now: false
VCP_memory_write_allowed_now: false
accepted_samples_write_allowed_now: false
production_candidate_write_allowed_now: false
real_manifest_read_allowed_now: false
real_VCPChat_read_allowed_now: false
real_VCPToolBox_read_allowed_now: false
recommended_next_phase: human_preflight_approval_or_reject_package
recommended_next_phase_zh: 人工批准或拒绝这个 preflight-only 授权包
auto_execution_allowed_for_next: false
```

## Exact Authorization Package

```yaml
a5_authorization_package:
  authorization_package_id: AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001
  package_type: pvos_evidence_collector_blocker_to_native_doubao_preflight_authorization
  status: pending_human_preflight_approval
  approval_status: requested_for_preflight_only
  active: false
  execute_now: false
  expires_at: null
  reviewer: Jenn
  version: v1

  target_systems:
    - agent_image_lab_project_local_native_doubao_generation_runner
    - pvos_evidence_collector_blocker_pipeline

  exact_allowed_paths:
    - kernel/pvos_evidence_collector_blocker_pipeline.js
    - schemas/pvos_evidence_collector_blocker_pipeline.schema.yaml
    - scripts/validate_pvos_evidence_collector_blocker_pipeline.js
    - tests/schema_examples/pvos_evidence_collector_blocker_pipeline.example.json
    - prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
    - plugins/image_generation/native_doubao_image/plugin.profile.yaml
    - scripts/run_native_doubao_image_generation.js
    - runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/

  forbidden_paths:
    - .env
    - .env.local
    - config.env
    - real_VCPChat_source
    - real_VCPToolBox_source
    - real_plugin_manifest
    - accepted_samples/
    - production_candidate_002
    - runs/real_generation/* except runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/

  allowed_commands:
    - node scripts/run_native_doubao_image_generation.js --prompt-package-ref=prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml --plugin-profile-ref=plugins/image_generation/native_doubao_image/plugin.profile.yaml --output-directory=runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/ --model=doubao-seedream-5-0-260128 --max-plugin-calls=1 --max-images-created=1 --retry-allowed=false --dry-run=true --execution-authorized=false --a5-activation-ref=AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001

  forbidden_commands:
    - --dry-run=false
    - --execution-authorized=true
    - provider_contact
    - plugin_call
    - api_call
    - image_generation
    - env_value_read
    - output_directory_creation
    - DailyNote_write
    - VCP_memory_write
    - accepted_samples_write
    - production_candidate_write
    - real_manifest_read
    - VCPChat_runtime
    - VCPToolBox_runtime
    - push
    - tag
    - release
    - deploy

  allowed_operations:
    - validate_this_authorization_package_locally
    - request_exact_human_preflight_approval
    - after_exact_human_preflight_approval_run_dry_run_true_execution_authorized_false_preflight_only

  source_pipeline:
    pipeline_ref: kernel/pvos_evidence_collector_blocker_pipeline.js
    schema_ref: schemas/pvos_evidence_collector_blocker_pipeline.schema.yaml
    validator_ref: scripts/validate_pvos_evidence_collector_blocker_pipeline.js
    example_ref: tests/schema_examples/pvos_evidence_collector_blocker_pipeline.example.json
    source_pipeline_commit: 3db9e17
    current_boundary: local_stdout_only

  prompt_package_ref: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
  prompt_static_review_ref: docs/premium_portable_led_camping_lantern_prompt_package_static_review_v1.md
  prompt_static_review_result: pass_ready_for_A5_decision
  runner_ref: scripts/run_native_doubao_image_generation.js
  plugin_profile_ref: plugins/image_generation/native_doubao_image/plugin.profile.yaml
  selected_plugin_id: NativeDoubaoImage
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls: 1
  max_images_created: 1
  retry_limit: 0
  retry_allowed: false
  input_reference: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
  output_directory_ref: runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/
  overwrite_existing_files_allowed: false
  daily_note_direct_write_allowed: false
  memory_delta_only: true
  rollback_plan: >
    If a future separately approved execution creates files under the exact
    output_directory_ref and the reviewer rejects the run before any archive,
    delete only that newly created directory after separate human cleanup
    approval. Do not clean ignored generated assets or any other path by default.

  validation_required:
    - git status --short --branch
    - git diff --check
    - node scripts/validate_pvos_evidence_collector_blocker_pipeline.js
    - node scripts/validate_native_doubao_sandbox.js
    - node scripts/validate_v14_081_pvos_exact_a5_authorization_package.js
    - node scripts/validate_agent_board_state.js
    - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
    - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
    - verify output_directory_ref is absent or empty before any future execution

  stop_conditions:
    - missing_exact_human_preflight_approval
    - dirty_worktree_before_future_preflight
    - validation_failure
    - prompt_package_ref_outside_exact_allowed_paths
    - plugin_profile_ref_outside_exact_allowed_paths
    - runner_ref_outside_exact_allowed_paths
    - output_directory_ref_exists_with_files
    - max_plugin_calls_not_equal_1
    - max_images_created_not_equal_1
    - retry_requested
    - second_call_requested
    - dry_run_false_requested
    - execution_authorized_true_requested
    - suspected_secret_exposure
    - raw_provider_payload_or_secret_logging_requested
    - provider_contact_required
    - plugin_call_required
    - image_generation_required
    - real_manifest_read_required
    - real_VCPChat_or_VCPToolBox_read_required
    - memory_or_DailyNote_write_requested
    - production_candidate_or_accepted_samples_write_requested
```

## Exact Preflight Approval Phrase

The following phrase would authorize only the dry-run preflight command named
above. It would not authorize provider contact, image generation, `.env.local`
secret value reads, DailyNote writes, VCP memory writes, production writes,
push, tag, release, or deploy:

```text
批准进入 AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001 A5 preflight：使用项目内 NativeDoubaoImage，命令 generate，模型 doubao-seedream-5-0-260128，prompt_package_ref=prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml，plugin_profile_ref=plugins/image_generation/native_doubao_image/plugin.profile.yaml，output_directory=runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/，max_plugin_calls=1，max_images_created=1，retry_limit=0；仅运行 preflight，不调用 provider，不生成图片，不读取 .env.local 密钥值，不写 DailyNote，不写 VCP memory，不 push/tag/release；审批人 Jenn。
```

## Separate Execution Approval Still Required

Even after a future clean preflight, real execution still requires a separate A5
authorization package. That future package must explicitly set all execution
fields, name the same or revised prompt, name the exact output directory, define
the provider-contact budget, and preserve:

```yaml
selected_plugin_id: NativeDoubaoImage
selected_plugin_command: generate
selected_plugin_model: doubao-seedream-5-0-260128
max_plugin_calls: 1
max_images_created: 1
retry_limit: 0
overwrite_existing_files_allowed: false
daily_note_direct_write_allowed: false
memory_delta_only: true
```

## Explicit Non-Authorization

```yaml
not_authorized_by_v14_081:
  A5_execution: false
  preflight_execution_now: false
  provider_contact: false
  plugin_call: false
  api_call: false
  image_generation: false
  runtime_execution: false
  env_value_read: false
  output_directory_creation: false
  output_write: false
  raw_stdout_or_stderr_capture: false
  raw_provider_payload_capture: false
  accepted_samples_write: false
  production_candidate_write: false
  DailyNote_write: false
  VCP_memory_write: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  real_VCPChat_read: false
  real_VCPToolBox_read: false
  CDP_or_bridge_or_MCP: false
  push_tag_release_deploy: false
```

## Validation Plan

```text
node --check scripts/validate_v14_081_pvos_exact_a5_authorization_package.js
node scripts/validate_v14_081_pvos_exact_a5_authorization_package.js
node scripts/validate_native_doubao_sandbox.js
node scripts/validate_agent_board_state.js
git diff --check
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
```

## Recommended Next

```yaml
recommended_next:
  phase: human_preflight_approval_or_reject_package
  zh: 人工批准或拒绝这个 preflight-only 授权包
  type: human_decision
  purpose: >
    Decide whether to approve the exact preflight phrase, reject this package,
    or request a different plugin, model, prompt package, output directory, or
    budget before any runner preflight occurs.
  auto_execution_allowed: false
```
