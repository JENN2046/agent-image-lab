# Static Review Surface Acceptance Checklist

Status: A4 docs-only static Review Surface acceptance checklist.

中文说明：这是静态审片台验收清单，不是界面实现，不生成图片，不运行
renderer/preload/IPC/runtime，不写记忆。

Current upstream status marker:

```text
current_status: failed_no_image_repeated_quota_or_rate_limit
recommended_next: v7.252_static_review_surface_mockup_readiness_review_gate
```

## Field Completeness Acceptance

```yaml
field_completeness_acceptance:
  required_review_surface_fields:
    - review_surface_id
    - review_surface_version
    - prompt_package_ref
    - generation_plan_ref_or_none
    - authorization_ref_or_none
    - asset_ref_or_not_created
    - asset_status
    - human_decision
    - rejection_reason_or_none
    - revision_request_or_none
    - memory_suitability
    - handoff_target
    - boundary_status
  pass_rule: every visible asset card or review record must expose these fields or an explicit not_applicable reason
```

## Status Flow Acceptance

```yaml
status_flow_acceptance:
  required_status_values:
    - not_created
    - generated_pending_review
    - accepted_candidate
    - rejected
    - needs_revision
    - deferred
    - accepted_final
  required_flow_rules:
    rejected_requires_rejection_reason: true
    needs_revision_requires_revision_request: true
    accepted_candidate_requires_acceptance_conditions: true
    deferred_requires_hold_reason: true
    accepted_final_requires_future_delivery_authorization: true
  forbidden_shortcuts:
    - generated_pending_review_to_memory_write
    - generated_pending_review_to_delivery_without_human_decision
    - rejected_to_accepted_final_without_new_review
```

## Human Decision Priority Acceptance

```yaml
human_decision_priority_acceptance:
  human_decision_overrides_ai_suggestion: true
  ai_score_is_advisory_only: true
  provider_success_is_not_asset_acceptance: true
  plugin_success_is_not_asset_acceptance: true
  automatic_acceptance_forbidden: true
  reviewer_notes_must_remain_visible: true
```

## Memory Write Prohibition Acceptance

```yaml
memory_write_prohibition_acceptance:
  memory_suitability_yes_means_candidate_only: true
  memory_suitability_no_blocks_memory_candidate: true
  memory_suitability_deferred_requires_later_human_review: true
  DailyNote_write_now: false
  VCP_memory_write_now: false
  memory_authorization_required_later: true
  raw_asset_or_private_path_in_memory_forbidden: true
```

## A5 / Provider / Plugin / Runtime Prohibition Acceptance

```yaml
execution_boundary_acceptance:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  renderer_code_created: false
  preload_code_created: false
  IPC_handler_created: false
  real_manifest_read: false
  env_or_secret_read: false
  output_save: false
```

## Future Mockup Preconditions

```yaml
future_mockup_preconditions:
  static_product_spec_complete: true
  review_record_template_complete: true
  status_flow_complete: true
  acceptance_checklist_complete: true
  mockup_must_be_static: true
  mockup_must_not_call_runtime: true
  mockup_must_not_write_files: true
  mockup_must_not_create_images: true
  mockup_must_not_claim_A5_ready: true
```

## Acceptance Result Template

```yaml
static_review_surface_acceptance_result:
  checklist_version: v1
  field_completeness: pass | fail | not_reviewed
  status_flow: pass | fail | not_reviewed
  human_decision_priority: pass | fail | not_reviewed
  memory_write_prohibition: pass | fail | not_reviewed
  A5_provider_plugin_runtime_prohibition: pass | fail | not_reviewed
  future_mockup_preconditions: pass | fail | not_reviewed
  reviewer:
  reviewed_at:
  result: accepted_for_static_mockup_planning | needs_revision | blocked
```
