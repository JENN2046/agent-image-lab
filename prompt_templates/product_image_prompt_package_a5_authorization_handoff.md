# Product Image Prompt Package A5 Authorization Handoff

Status: A4 docs-only handoff template.

This template carries an approved prompt package instance toward a future A5 authorization draft. It does not authorize generation, provider contact, plugin calls, runtime execution, output saving, DailyNote write, or VCP memory write.

## Handoff Identity

```yaml
handoff:
  handoff_id: "<PPA5H placeholder>"
  handoff_version: "v1"
  handoff_status: draft
  allowed_status_values:
    - draft
    - ready_for_A5_draft
    - blocked
    - superseded
```

## Source Prompt Package

```yaml
source_prompt_package:
  prompt_package_instance_id: "<PPI placeholder>"
  prompt_package_instance_version: "<version placeholder>"
  source_template: prompt_templates/product_image_prompt_package_instance_template.md
  human_review_closeout_ref: "<review closeout placeholder>"
  human_review_status: "<must be approved_for_A5_authorization>"
  blocking_review_reasons: []
  required_revisions: []
```

## Reviewed Intent Summary

```yaml
reviewed_intent_summary:
  product_goal: "<summary placeholder>"
  shot_intent_ref: "<prompt package section ref>"
  visual_direction_ref: "<prompt package section ref>"
  positive_prompt_draft_ref: "<prompt package section ref>"
  negative_constraints_ref: "<prompt package section ref>"
  acceptance_criteria_ref: "<prompt package section ref>"
```

## Future A5 Authorization Draft Inputs

```yaml
future_A5_authorization_draft_inputs:
  generation_plan_ref: "<required later>"
  generation_plan_version: "<required later>"
  prompt_package_ref: "<required later>"
  target_model_or_plugin: "<required later>"
  allowed_call_count: "<required later>"
  retry_limit: "<required later>"
  output_directory_ref: "<required later>"
  output_save_allowed: "<required later>"
  provider_contact_allowed: "<required later>"
  plugin_call_allowed: "<required later>"
  memory_write_allowed: false
  review_console_ref: "<required later>"
  approval_phrase: "<required later>"
  expires_at: "<required later>"
```

## Boundary Checks

```yaml
boundary_checks:
  active_A5_authorization_created: false
  generation_allowed_now: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  output_save_allowed_now: false
  runtime_execution_allowed_now: false
  memory_write_allowed_now: false
  DailyNote_write_allowed_now: false
  real_manifest_read: false
  no_secret_or_env_value: true
  no_private_path: true
  no_raw_endpoint: true
  no_raw_payload: true
```

## Blocking Conditions

```yaml
blocking_conditions:
  - prompt_package_not_reviewed
  - prompt_package_status_not_approved_for_A5_authorization
  - prompt_package_version_changed_after_review
  - unresolved_review_revisions
  - provider_or_plugin_selected_prematurely
  - real_output_directory_inserted_prematurely
  - allowed_call_count_inferred_from_chat
  - raw_prompt_payload_or_endpoint_present
  - memory_write_implied
  - generation_plan_missing_when_required_by_future_authorization
```

## Handoff Closeout

```yaml
handoff_closeout:
  reviewer: "<reviewer placeholder>"
  reviewed_at: "<ISO 8601 timestamp placeholder>"
  handoff_status: draft
  ready_for_A5_draft: false
  active_A5_authorization_created: false
  generation_allowed_now: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  memory_write_allowed_now: false
  blocking_conditions: []
  notes: "<placeholder>"
```
