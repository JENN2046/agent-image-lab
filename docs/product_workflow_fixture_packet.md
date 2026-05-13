# Product Workflow Fixture Packet

Status: A4 docs-only synthetic fixture packet.

中文说明：这是产品图工作流纸面样例包。它使用合成商品和占位引用，帮助
检查 prompt package、未来授权、审片记录、状态流、记忆适配和交付 handoff
是否能连成一条清楚链路。它不是生成请求，不调用 provider/plugin，不写
runtime，不生成图片，不写记忆。

Current upstream status marker:

```text
current_status: failed_no_image_repeated_quota_or_rate_limit
route_selected: ROUTE-3-CONTINUED-STOP
route_3_meaning_zh: 继续停止生成
recommended_next: v7.259_product_workflow_fixture_packet_acceptance_review_gate
```

## Packet Metadata

```yaml
product_workflow_fixture_packet:
  fixture_id: PWFIX-20260513-001
  fixture_version: v1
  fixture_status: draft_for_review
  fixture_type: synthetic_non_executing_product_workflow
  synthetic_product: matte ceramic coffee mug
  real_customer_asset_used: false
  real_image_used: false
  source_files:
    - prompt_templates/product_image_prompt_package_instance_template.md
    - docs/review_record_template_and_status_flow.md
    - docs/memory_suitability_decision_matrix.md
    - docs/delivery_review_surface_package.md
```

## Synthetic Product Brief

```yaml
brief_intake:
  brief_id: BRIEF-SYNTH-COFFEE-MUG-001
  brief_source: synthetic_internal_fixture
  product_goal: show a clean product-photo workflow for a matte ceramic coffee mug
  intended_use: review
  target_audience: internal reviewer
  required_output_context: static Review Surface fixture only
  known_constraints:
    - no real brand
    - no readable logo or text
    - no people, faces, or hands
    - no real image generation
```

## Prompt Package Input

```yaml
prompt_package_instance_ref:
  instance_id: PPI-FIXTURE-20260513-MUG-001
  instance_version: v1
  instance_status: review_ready_fixture
  executable_generation_request_created: false

product_identity:
  product_name: synthetic matte ceramic coffee mug
  product_category: drinkware
  product_variant: warm white matte finish
  brand_context_sanitized: none
  hero_features:
    - smooth matte ceramic body
    - simple curved handle
    - subtle handmade rim detail
  product_detail:
    material:
      - ceramic
    texture:
      - matte
      - smooth
    finish:
      - low sheen
    color_palette:
      - warm white
      - soft gray shadow

shot_intent:
  shot_type: hero
  aspect_ratio: 4:5
  framing: full_product
  angle: three_quarter
  depth_of_field: moderate
  output_count_request: planning_only

positive_prompt_draft:
  subject_anchor: synthetic matte ceramic coffee mug as the only product subject
  product_fidelity: keep the handle, rim, and mug geometry plausible
  material_texture_language: visible smooth matte ceramic surface with soft highlights
  composition_language: centered hero product with quiet negative space
  lighting_language: soft diffused studio light and gentle contact shadow
  camera_language: commercial product photography, three-quarter view
  environment_language: minimal neutral tabletop, no real brand context
  quality_bar: clean catalog-ready product photo style

negative_constraints:
  forbidden_text_or_logo:
    - no readable accidental text
    - no watermark
    - no logo-like mark
  forbidden_artifacts:
    - no malformed handle
    - no duplicate rim
    - no broken mug geometry
  forbidden_people_or_faces:
    - no people
    - no faces
    - no hands
```

## Future Generation Authorization Placeholder

```yaml
future_generation_authorization_placeholder:
  authorization_ref: AUTH-FUTURE-REQUIRED
  authorization_status: not_requested
  generation_plan_ref: GP-FUTURE-REQUIRED
  selected_plugin_or_provider: not_selected
  selected_model: not_selected
  allowed_call_count: 0
  retry_limit: 0
  output_directory_ref: not_selected
  human_approval_phrase: not_requested
  execute_now: false
  A5_required_before_generation: true
```

## Review Record Placeholder

```yaml
review_record:
  review_record_id: RR-FIXTURE-20260513-001
  review_record_version: v1
  review_record_status: draft
  review_surface_ref: RS-STATIC-FIXTURE-001
  prompt_package_ref: PPI-FIXTURE-20260513-MUG-001
  generation_plan_ref: none
  A5_authorization_ref: none
  asset_ref: not_created
  asset_status: not_created
  human_decision: deferred
  human_score: not_reviewed
  reviewer: fixture_reviewer_placeholder
  reviewed_at: not_reviewed
```

## Asset Status Route

```yaml
asset_status_route:
  current_status: not_created
  allowed_future_after_A5_generation:
    - generated_pending_review
  blocked_now:
    accepted_candidate: no_asset_exists
    accepted_final: future_delivery_authorization_required
    rejected: no_asset_exists
    needs_revision: allowed_only_as_prompt_package_revision_feedback
  same_provider_retry_allowed_now: false
```

## Memory Suitability Decision

```yaml
memory_suitability_decision:
  current_asset_status: not_created
  suitability_status: not_reviewable
  DailyNote_write_allowed_now: false
  VCP_memory_write_allowed_now: false
  future_memory_route:
    accepted_final: draft_success_case_after_separate_authorization
    rejected: draft_failure_lesson_after_separate_authorization
    needs_revision: do_not_write
```

## Delivery Handoff

```yaml
delivery_handoff:
  delivery_status: not_ready
  delivery_package_ref: DRSP-FIXTURE-20260513-001
  accepted_candidate_allowed_now: false
  accepted_final_allowed_now: false
  reason: no real asset exists and no A5 authorization is active
  next_review_surface_action: fixture_packet_acceptance_review
```

## Boundary Confirmation

```yaml
boundary:
  executable_generation_request_created: false
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  output_save: false
  runtime_execution: false
  renderer_preload_ipc: false
  DailyNote_write: false
  VCP_memory_write: false
  real_manifest_read: false
  real_asset_read: false
```
