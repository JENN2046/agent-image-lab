# Product Image Generation Authorization Draft

Status: non-active A5 authorization draft.

This document is a draft authorization package for review only. It is not active. It does not authorize provider contact, plugin calls, image generation, output saving, runtime execution, DailyNote write, or VCP memory write.

## Authorization Identity

```yaml
generation_authorization_package:
  authorization_package_id: AUTH-DRAFT-20260512-001
  authorization_package_version: v1
  authorization_package_status: draft
  approval_status: not_requested
  active_A5_authorization_created: false
```

## Source References

```yaml
source_references:
  source_readiness_review: docs/product_image_workflow_A5_readiness_review.md
  authorization_blueprint: docs/archive/phases/v7/v7_182_generation_authorization_package_blueprint_gate.md
  generation_plan_ref: GP-DRAFT-20260512-001
  generation_plan_version: v1
  generation_plan_document: docs/product_image_generation_plan_draft.md
  generation_plan_match_review: docs/product_image_generation_plan_authorization_match_review.md
  synthetic_brief_ref: SYNBRIEF-20260512-001
  prompt_package_ref: PPI-20260512-matte-ceramic-mug-001
  prompt_package_version: v1
  prompt_package_review_status: approved_for_A5_authorization
  prompt_package_review_is_synthetic: true
```

The synthetic review status is useful for planning only. It is not human approval for real generation.

## Draft Fields

```yaml
draft_fields:
  generation_plan_ref: GP-DRAFT-20260512-001
  generation_plan_version: v1
  prompt_package_ref: PPI-20260512-matte-ceramic-mug-001
  prompt_package_version: v1
  target_model_or_plugin: "<required later>"
  allowed_call_count: "<required later>"
  retry_limit: "<required later>"
  output_directory_ref: "<required later>"
  output_save_allowed: "<required later>"
  provider_contact_allowed: "<required later>"
  plugin_call_allowed: "<required later>"
  memory_write_allowed: false
  review_console_ref: "<required later>"
  approval_phrase: "<template only; required later>"
  expires_at: "<required later>"
```

## Safe Placeholder Policy

```yaml
safe_placeholder_policy:
  real_provider_endpoint_included: false
  raw_prompt_payload_included: false
  raw_response_included: false
  private_path_included: false
  secret_included: false
  real_output_directory_included: false
  plugin_command_selected: false
  model_selected: false
```

Placeholders are intentional. Replacing them with real executable values requires a separate A5 authorization package and preflight.

## Draft Approval Phrase Template

```yaml
approval_phrase_template:
  template: "批准 AUTH-DRAFT-20260512-001 for GP-DRAFT-20260512-001, allowed_call_count=<N>"
  usable_now: false
  reason: "allowed_call_count, target_model_or_plugin, output policy, review_console_ref, expires_at, and pre_execution_lock_result are not yet finalized"
```

Vague phrases such as `continue`, `ok`, `go`, `继续`, `可以`, or `执行` do not activate this draft.

## Pre-Execution Lock Checklist

```yaml
pre_execution_lock_checklist:
  working_tree_clean: required_later
  authorization_status_active: required_later
  generation_plan_scope_match: required_later
  prompt_package_ref_match: required_later
  provider_or_plugin_scope_confirmed: required_later
  allowed_call_count_remaining: required_later
  output_directory_confirmed: required_later
  raw_payload_recording_forbidden: true
  memory_write_forbidden: true
  review_console_ready: required_later
```

No pre-execution lock was run in this phase.

## Activation Blockers

```yaml
activation_blockers:
  - authorization_status_is_draft
  - approval_status_is_not_requested
  - target_model_or_plugin_missing
  - allowed_call_count_missing
  - retry_limit_missing
  - output_directory_ref_missing
  - output_save_policy_missing
  - review_console_ref_missing
  - expires_at_missing
  - pre_execution_lock_not_run
```

These blockers are expected and correct for a non-active draft.

## Boundary Matrix

```yaml
boundary_matrix:
  authorization_draft_created:
    allowed_under_A4: true
  approval_phrase_template_created:
    allowed_under_A4: true
  active_A5_authorization:
    allowed_now: false
  generation_plan_ref_alignment:
    completed_under_A4: true
  provider_contact:
    allowed_now: false
  plugin_call:
    allowed_now: false
  image_generation:
    allowed_now: false
  output_save:
    allowed_now: false
  runtime_execution:
    allowed_now: false
  memory_write:
    allowed_now: false
```

## Draft Review Closeout

```yaml
draft_closeout:
  draft_created: true
  authorization_package_id: AUTH-DRAFT-20260512-001
  status: draft
  generation_plan_ref_aligned: true
  generation_plan_ref: GP-DRAFT-20260512-001
  generation_plan_version: v1
  active_A5_authorization_created: false
  generation_allowed_now: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  output_save_allowed_now: false
  memory_write_allowed_now: false
  recommended_next: v7.242_product_image_authorization_activation_gap_review_gate
```
