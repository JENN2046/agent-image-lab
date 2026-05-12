# v7.234 Product Image Workflow Runbook Gate

## Executive Verdict

```yaml
phase: v7.234_product_image_workflow_runbook_gate
base_contract: AGENTS.md
mode: A4_docs_only_product_runbook_planning
source_commit: b27413eea154178429a7ec8b46fcf4f31ee57c47
source_phase: v7.233_delivery_review_surface_package_gate
overall_status: pass
product_artifact:
  product_image_workflow_runbook_created: true
  package_chain_operationalized: true
  executable_generation_request_created: false
  runtime_surface_created: false
safety:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  memory_write: false
  runtime_execution: false
recommended_next: v7.235_product_image_workflow_static_walkthrough_gate
```

## Purpose

This gate converts the current product image workflow package chain into an operator runbook.

The runbook tells a human or Codex commander how to move from product brief to delivery/review package while preserving all A4 boundaries.

It is not an execution plan for generation.
It does not authorize A5, provider contact, plugin calls, image generation, runtime, output save, DailyNote write, or VCP memory write.

## Workflow Covered

```text
product brief
-> prompt package builder
-> prompt package instance
-> human prompt-package review
-> future A5 authorization handoff
-> future generated asset after separate A5
-> asset status taxonomy
-> human visual review
-> memory suitability decision
-> delivery / review surface package
```

This v7.234 runbook covers how the workflow is operated and stopped. It does not perform the future A5 generation step.

## Operator Roles

```yaml
operator_roles:
  commander:
    owns:
      - stage selection
      - exact scope
      - hard-stop checks
      - validation review
      - closeout
  prompt_package_author:
    owns:
      - brief intake
      - prompt package draft
      - negative constraints
      - acceptance criteria
  human_reviewer:
    owns:
      - prompt package approval
      - visual review after future generation
      - final delivery decision
  memory_reviewer:
    owns:
      - memory suitability decision
      - future memory authorization recommendation
  A5_authorizer:
    owns:
      - future active authorization package
      - human approval phrase
      - allowed call count
      - provider/plugin scope
```

## Runbook Steps

```yaml
runbook_steps:
  step_01_brief_intake:
    input: product_brief
    output: structured_brief
    stop_if:
      - missing_product_goal
      - secret_or_private_path_present

  step_02_prompt_package_build:
    input: structured_brief
    output: prompt_package_instance
    source: v7.227_and_v7.228
    stop_if:
      - prompt_package_scope_overbroad
      - provider_payload_created

  step_03_prompt_package_human_review:
    input: prompt_package_instance
    output: prompt_package_review_closeout
    source: v7.229
    stop_if:
      - review_status_not_approved_for_A5_authorization

  step_04_A5_authorization_handoff:
    input: approved_prompt_package_review
    output: future_A5_authorization_draft_inputs
    source: v7.230
    stop_if:
      - generation_plan_missing
      - active_A5_authorization_inferred

  step_05_future_A5_generation:
    input: active_A5_authorization_package_required_later
    output: future_generated_asset_ref
    allowed_now: false
    stop_if:
      - no_active_A5_authorization

  step_06_asset_status_review:
    input: future_generated_asset_ref
    output: asset_status_record
    source: v7.231
    allowed_now: taxonomy_only

  step_07_memory_suitability_review:
    input: asset_status_record
    output: memory_candidate_decision
    source: v7.232
    memory_write_allowed_now: false

  step_08_delivery_review_package:
    input:
      - prompt_package_ref
      - authorization_ref
      - asset_status_records
      - human_review_records
      - memory_suitability_records
    output: delivery_review_surface_package
    source: v7.233
```

## Required Artifacts By Step

```yaml
required_artifacts:
  brief_intake:
    - product_goal
    - intended_use
    - constraints
  prompt_package:
    - prompt_package_instance_id
    - positive_prompt_draft
    - negative_constraints
    - acceptance_criteria
  prompt_review:
    - human_review_status
    - blocking_reasons
    - required_revisions
  A5_handoff:
    - prompt_package_ref
    - generation_plan_required_later
    - allowed_call_count_required_later
  visual_review:
    - asset_status
    - human_score
    - rejection_reasons
    - revision_request
  memory_suitability:
    - suitability_status
    - sanitized_summary
    - reusable_learning
  delivery_package:
    - delivery_package_id
    - delivery_summary
    - boundary_assertions
```

## Stop Conditions

```yaml
stop_conditions:
  - dirty_tree_before_edit
  - unclear_write_scope
  - suspected_secret
  - private_path_required
  - real_manifest_read_required
  - real_VCPChat_or_VCPToolBox_read_required
  - provider_contact_required
  - plugin_call_required
  - image_generation_required
  - DailyNote_write_required
  - VCP_memory_write_required
  - runtime_or_Review_Console_integration_required
  - dependency_or_package_change_required
  - tag_release_deploy_required
```

## Validation Policy

```yaml
validation_policy:
  docs_only_runbook:
    required:
      - exact_diff_review
      - git_diff_check
      - agent_board_state_validator_if_board_changed
    not_default:
      - full_repo_validator
      - redaction_validator
      - test_suite
      - runtime_check
```

This follows the risk-scaled validation policy: docs-only gates do not need runtime validation unless the task modifies runtime surfaces or explicitly authorizes broader checks.

## Explicit Non-Authorization

```yaml
not_authorized_by_v7_234:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  review_console_runtime: false
  renderer_code_creation: false
  preload_code_creation: false
  IPC_handler_creation: false
  output_save: false
  accepted_samples_write: false
  runs_write: false
  DailyNote_write: false
  VCP_memory_write: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  CDP_access: false
  bridge_methods: false
  MCP_calls: false
  production_candidate_002: false
  batch_005: false
  tag_release_deploy: false
  dependency_change: false
```

## Recommended Next Phase

```yaml
recommended_next:
  phase: v7.235_product_image_workflow_static_walkthrough_gate
  type: A4_docs_only_static_walkthrough
  purpose: >
    Validate the runbook with one synthetic, non-executing product brief
    walkthrough using placeholders only. Do not generate images, call providers,
    or create runtime artifacts.
  auto_execution_allowed: false
```

## Closeout Template

```yaml
closeout:
  phase: v7.234_product_image_workflow_runbook_gate
  commit_hash: null
  commit_message: "docs: add product image workflow runbook"
  branch: master
  source_commit: b27413eea154178429a7ec8b46fcf4f31ee57c47
  push: not_performed
  product_artifact:
    product_image_workflow_runbook_created: true
    package_chain_operationalized: true
    executable_generation_request_created: false
    runtime_surface_created: false
  validation:
    git_diff_check: pass
    exact_diff_reviewed: true
    agent_board_state_validator: pass
    redaction_validator: not_run
    full_repo_validator: not_run
  safety:
    A5_execution: false
    provider_contact: false
    plugin_call: false
    image_generation: false
    memory_write: false
    runtime_execution: false
  final_state:
    next_phase_started: false
```
