# Static Review Surface Product Spec

Status: A4 docs-only product specification.

中文说明：这是静态审片台产品规格，不是运行时代码，不是生成按钮，也不是 A5 授权。

Current upstream status marker:

```text
current_status: failed_no_image_repeated_quota_or_rate_limit
recommended_next: v7.250_review_record_template_and_status_flow_gate
```

## Page Goal

```yaml
page_goal:
  name: Static Review Surface
  zh: 静态审片台 / 交付评审界面
  purpose: >
    Give a human reviewer one place to inspect a future generated asset,
    compare it against the prompt package, assign an asset status, decide
    memory suitability, and prepare a delivery handoff.
  runtime_created_now: false
```

## User Roles

```yaml
user_roles:
  reviewer:
    zh: 审片人
    responsibility: decide accepted_candidate, rejected, needs_revision, or deferred.
  prompt_owner:
    zh: prompt 包负责人
    responsibility: revise prompt package after rejection or needs_revision.
  delivery_owner:
    zh: 交付负责人
    responsibility: prepare final package only after human acceptance.
  memory_reviewer:
    zh: 记忆审查人
    responsibility: decide whether a future memory draft is suitable; cannot write memory now.
```

## Core Fields

```yaml
core_fields:
  review_surface_id: "<RS placeholder>"
  source_prompt_package_ref: "<prompt package instance ref>"
  source_A5_authorization_ref: "<future authorization ref or none>"
  asset_ref: "<future sanitized asset ref or not_created>"
  asset_status: not_created
  human_review_status: draft
  memory_suitability: deferred
  delivery_status: draft
  boundary_status: no_execution
```

## Asset Card

```yaml
asset_card:
  asset_identity:
    asset_ref: "<sanitized ref>"
    source_generation_plan_ref: "<future plan ref>"
    source_authorization_ref: "<future A5 authorization ref>"
  prompt_trace:
    prompt_package_ref: "<prompt package instance ref>"
    shot_intent: "<hero | detail | lifestyle | packshot | comparison | texture_macro>"
    style_lock: "<style label>"
  review_summary:
    asset_status: not_created
    human_score: "<0-5 or not_reviewed>"
    rejection_reasons: []
    revision_request: "<placeholder>"
```

## Review Decision Area

```yaml
review_decision_area:
  allowed_decisions:
    - accepted_candidate
    - rejected
    - needs_revision
    - deferred
  decision_requirements:
    accepted_candidate:
      - product identity matches brief
      - hero features visible
      - material and texture credible
      - no forbidden text/logo/watermark
    rejected:
      - at least one rejection reason
      - optional failure lesson candidate
    needs_revision:
      - revision request required
      - return to prompt package revision planning
    deferred:
      - reason required
      - no delivery or memory decision may finalize
```

## Memory Suitability Area

```yaml
memory_suitability_area:
  allowed_values:
    - yes
    - no
    - deferred
  meaning_zh:
    yes: 适合未来写入记忆草稿，但现在不写
    no: 不适合写入记忆
    deferred: 暂缓，等待人工或后续上下文
  hard_rule:
    memory_write_allowed_now: false
    DailyNote_write_allowed_now: false
    independent_memory_authorization_required_later: true
```

## Handoff Area

```yaml
handoff_area:
  to_prompt_revision:
    trigger: needs_revision
    includes:
      - rejection_reasons
      - revision_request
      - affected_prompt_sections
  to_delivery:
    trigger: accepted_candidate
    includes:
      - asset_ref
      - acceptance_notes
      - unresolved_risks
  to_memory_review:
    trigger: memory_suitability_yes_or_deferred
    includes:
      - sanitized_summary
      - reusable_learning
      - memory_write_allowed_now_false
```

## Non-Execution Boundary

```yaml
boundary:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  renderer_code_created: false
  preload_code_created: false
  IPC_handler_created: false
  output_save: false
  DailyNote_write: false
  VCP_memory_write: false
  real_manifest_read: false
  env_or_secret_read: false
```

## Acceptance For This Spec

```yaml
acceptance:
  page_goal_defined: true
  user_roles_defined: true
  core_fields_defined: true
  asset_card_defined: true
  review_decision_area_defined: true
  memory_suitability_area_defined: true
  handoff_area_defined: true
  non_execution_boundary_defined: true
```
