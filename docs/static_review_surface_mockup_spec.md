# Static Review Surface Mockup Spec

Status: A4 docs-only static mockup specification.

中文说明：这是静态审片台 mockup 规格，不是 HTML 文件，不运行系统，
不接 provider，不生成图片，不写记忆。

Current upstream status marker:

```text
current_status: failed_no_image_repeated_quota_or_rate_limit
recommended_next: v7.254_static_review_surface_mockup_file_gate
```

## Screen Regions

```yaml
screen_regions:
  status_banner:
    purpose: show Route 3 continued stop and no-execution boundary
    required_copy_zh: 路线 3：继续停止生成
  asset_queue:
    purpose: list static review cases
    fields:
      - asset_status
      - prompt_package_ref
      - memory_suitability
      - reviewer_state
  asset_card:
    purpose: show one selected asset or not_created placeholder
    fields:
      - asset_ref
      - product_identity
      - shot_intent
      - style_lock
      - status_badge
  prompt_trace:
    purpose: show prompt package and generation plan references
  review_decision_panel:
    purpose: capture accepted_candidate, rejected, needs_revision, or deferred
  memory_suitability_panel:
    purpose: show yes, no, or deferred without enabling memory write
  handoff_panel:
    purpose: show next paper handoff path
  boundary_footer:
    purpose: repeat no A5/provider/plugin/runtime/image/memory boundary
```

## Static Fixture Shape

```yaml
static_fixture_cases:
  - case_id: CASE-NOT-CREATED
    asset_status: not_created
    memory_suitability: deferred
  - case_id: CASE-PENDING-REVIEW
    asset_status: generated_pending_review
    memory_suitability: deferred
  - case_id: CASE-REJECTED
    asset_status: rejected
    rejection_reason_required: true
  - case_id: CASE-NEEDS-REVISION
    asset_status: needs_revision
    revision_request_required: true
  - case_id: CASE-ACCEPTED-CANDIDATE
    asset_status: accepted_candidate
    final_delivery_allowed_now: false
```

## Copy Rules

```yaml
copy_rules:
  language: zh-CN primary with field identifiers preserved
  must_explain:
    - ROUTE-3-CONTINUED-STOP means 继续停止生成
    - accepted_candidate is not final delivery
    - memory_suitability_yes is only a future memory candidate
    - provider_success is not asset acceptance
  must_not_claim:
    - generation_ready
    - A5_active
    - runtime_connected
    - memory_written
```

## Disabled Action Reasons

```yaml
disabled_actions:
  generate_image:
    enabled: false
    reason_zh: 当前路线为继续停止生成，未授权 A5 / provider / plugin。
  retry_provider:
    enabled: false
    reason_zh: 同 provider/model/account 路径因 repeated quota/rate-limit 被阻断。
  write_memory:
    enabled: false
    reason_zh: 记忆写入需要独立授权，当前只做 suitability 判断。
  open_runtime:
    enabled: false
    reason_zh: 当前是离线静态规格，不接 renderer/preload/IPC/runtime。
  submit_delivery:
    enabled: false
    reason_zh: accepted_candidate 不是最终交付，仍需后续交付 closeout。
```

## Acceptance Mapping

```yaml
acceptance_mapping:
  field_completeness_acceptance:
    mapped_regions:
      - asset_queue
      - asset_card
      - review_decision_panel
  status_flow_acceptance:
    mapped_regions:
      - asset_queue
      - review_decision_panel
  human_decision_priority_acceptance:
    mapped_regions:
      - review_decision_panel
  memory_write_prohibition_acceptance:
    mapped_regions:
      - memory_suitability_panel
      - boundary_footer
  A5_provider_plugin_runtime_prohibition_acceptance:
    mapped_regions:
      - status_banner
      - boundary_footer
      - disabled_actions
```

## Next File Gate Requirements

```yaml
next_file_gate_requirements:
  create_html_file_allowed_next_if_authorized: true
  target_directory_suggestion: review_console/static_mockups/
  must_be_standalone: true
  no_external_assets: true
  no_runtime_imports: true
  no_api_calls: true
  no_file_writes: true
  no_image_generation: true
  no_memory_write: true
```
