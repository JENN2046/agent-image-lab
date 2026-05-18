# Product Image Generation Plan Draft

Status: non-executing generation plan draft.

This document defines a paper-level generation plan for the synthetic matte
ceramic coffee mug workflow. It is not an execution request. It does not
authorize A5, provider contact, plugin calls, image generation, output saving,
runtime execution, DailyNote write, or VCP memory write.

## Plan Identity

```yaml
generation_plan:
  generation_plan_id: GP-DRAFT-20260512-001
  generation_plan_version: v1
  generation_plan_status: draft
  authorization_status: not_requested
  A5_authorization_ref: null
  execution_ready: false
```

## Source References

```yaml
source_references:
  synthetic_brief_ref: SYNBRIEF-20260512-001
  prompt_package_ref: PPI-20260512-matte-ceramic-mug-001
  prompt_package_version: v1
  prompt_package_review_status: approved_for_A5_authorization
  authorization_draft_ref: AUTH-DRAFT-20260512-001
  authorization_draft_status: draft
  generation_plan_blueprint: docs/archive/phases/v7/v7_181_generation_plan_package_blueprint_gate.md
```

The synthetic prompt package review status is useful for planning only. It is
not human approval for real generation.

## Draft Fields

```yaml
draft_fields:
  workflow_run_id: WF-DRAFT-20260512-matte-ceramic-mug-001
  prompt_package_ref: PPI-20260512-matte-ceramic-mug-001
  prompt_package_version: v1
  target_model_or_plugin: "<required later; not selected in A4>"
  output_count: "<required later; must be explicit in A5>"
  max_generation_calls: "<required later; must be explicit in A5>"
  output_constraints:
    aspect_ratio: "4:5 from prompt package walkthrough"
    product_category: matte_ceramic_coffee_mug
    no_people_or_faces: true
    no_readable_text_or_logo: true
    no_watermark: true
    geometry_must_remain_plausible: true
  review_console_ref: "<required later>"
  success_criteria:
    - "mug category is immediately recognizable"
    - "matte ceramic finish remains visible"
    - "handle and rim geometry are plausible"
    - "mug remains the primary subject"
    - "no readable text, watermark, logo, people, faces, or hands"
  failure_policy:
    rejected_asset: "record rejection reason and stop before retry unless retry is authorized"
    needs_revision: "return to prompt package revision planning"
    provider_failure: "classify failure before any retry"
    security_or_secret_issue: "stop immediately"
  retry_policy:
    retry_limit: "<required later; default 0 until A5>"
    silent_retry_allowed: false
    retry_counts_against_total_calls: true
  output_directory_ref: "<required later; no real path selected in A4>"
```

## Safe Placeholder Policy

```yaml
safe_placeholder_policy:
  provider_or_plugin_selected: false
  model_selected: false
  raw_prompt_payload_created: false
  raw_endpoint_recorded: false
  raw_response_recorded: false
  real_output_directory_selected: false
  private_path_included: false
  secret_included: false
  generation_call_budget_authorized: false
```

Placeholders are intentional. Replacing them with executable values requires a
separate active A5 authorization package and preflight.

## Relation To Authorization Draft

```yaml
authorization_relation:
  related_authorization_package_id: AUTH-DRAFT-20260512-001
  relation_status: paper_level_reference_candidate
  authorization_may_reference_this_plan_later: true
  authorization_active_now: false
  generation_plan_can_self_authorize: false
```

The authorization draft should not be considered scope-matched until a future
review confirms that both documents use the same plan id, prompt package, call
budget, output constraints, review console ref, and output policy.

## Remaining Blockers

```yaml
remaining_blockers:
  - plan_status_is_draft
  - authorization_status_is_not_requested
  - target_model_or_plugin_missing
  - output_count_missing
  - max_generation_calls_missing
  - output_directory_ref_missing
  - review_console_ref_missing
  - A5_authorization_ref_null
  - active_A5_authorization_missing
  - pre_execution_lock_not_run
```

These blockers are expected and correct for a non-executing generation plan
draft.

## Explicit Non-Authorization

```yaml
not_authorized_by_this_plan:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  model_selection: false
  image_generation: false
  output_save: false
  runtime_execution: false
  DailyNote_write: false
  VCP_memory_write: false
  real_manifest_read: false
  raw_prompt_payload_creation: false
  real_output_directory_selection: false
```

## Plan Draft Closeout

```yaml
plan_draft_closeout:
  plan_draft_created: true
  generation_plan_id: GP-DRAFT-20260512-001
  generation_plan_version: v1
  generation_plan_status: draft
  authorization_status: not_requested
  executable_generation_request_created: false
  generation_allowed_now: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  output_save_allowed_now: false
  memory_write_allowed_now: false
  recommended_next: v7.240_product_image_generation_plan_authorization_match_review_gate
```
