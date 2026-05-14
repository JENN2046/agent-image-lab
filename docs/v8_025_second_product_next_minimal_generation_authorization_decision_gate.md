# v8.025 Second Product Next Minimal Generation Authorization Decision Gate

```yaml
phase: v8_025_second_product_next_minimal_generation_authorization_decision_gate
base_contract: AGENTS.md
mode: A4_decision_gate
intent: planning
risk_level: R2
source_phase: v8_024_second_product_prompt_v2_static_review_gate
source_commit: bcf0b556d7fdc9b63ad62386d0bf338a70e74b68
route: Route_B_multi_product_prompt_package_expansion
product: multi_color_mesh_sports_visor
provider_contact: false
image_generation: false
env_local_secret_value_read: false
memory_write: false
```

## Purpose

This gate presents the human decision for what to do after prompt v2 passed
static review. It does not authorize execution. It does not call the provider,
generate an image, retry, or read `.env.local`.

## Current Evidence

```yaml
source_output: runs/real_generation/v8_021_multi_color_mesh_sports_visor_second_trial/native_doubao_1778733554203_0.jpg
source_asset_status: needs_revision
accepted_candidate: false
commercial_delivery_ready: false
memory_suitability: deferred
prompt_v2_path: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
prompt_v2_static_review_result: pass_ready_for_authorization_decision
A5_authorization_created: false
retry_allowed_now: false
```

Prompt v2 is ready for a human authorization decision, not for automatic
execution. The project now needs the owner to choose whether to run one next
bounded trial, keep reviewing statically, or stop Route B generation here.

## Options

### Option A — Authorize Next Minimal Real Generation Trial

```yaml
option: authorize_next_minimal_real_generation_trial
meaning_zh: 基于 prompt v2，再授权一次最小真实生成。
risk: high_but_bounded
requires:
  - A5_authorization
  - provider_contact
  - env_local_necessary_secret_read_by_existing_runner_only
  - image_generation
limits_if_later_authorized:
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 1
  auto_retry: false
  stop_after_generation: true
  human_review_required_after_generation: true
current_default_allowed: false
```

Choose this only if the goal is to validate whether Route B can move from
prompt v2 to a stronger second-product real sample.

### Option B — More Static Prompt / Payload Review Before Generation

```yaml
option: more_static_prompt_payload_review
meaning_zh: 继续 A4.8 静态复查，不生成。
risk: low
best_when:
  - color_coverage_still_feels_uncertain
  - lifestyle_scene_language_needs_more_tuning
  - runner_payload_mapping_should_be_rechecked
  - provider_parameter_compatibility_should_be_rechecked
current_default_allowed: true_after_human_selection
```

Choose this if prompt v2 still feels too broad, too scene-heavy, or potentially
fragile for the provider payload.

### Option C — Stop Route B Generation Here

```yaml
option: stop_route_B_generation_here
meaning_zh: 保留第二商品 prompt v2 和审查包，不再继续真实生成。
risk: lowest
tradeoff: Route B 暂时只有 needs_revision 样本，没有 accepted candidate。
current_default_allowed: true_after_human_selection
```

Choose this if the current project value is the reusable prompt workflow rather
than another real generation trial.

## Recommendation

```yaml
recommended_option: authorize_next_minimal_real_generation_trial
recommendation_condition: only_if_the_owner_wants_to_validate_multi_product_reuse_with_one_more_bounded_trial
human_decision_required: true
codex_may_execute_option_A_automatically: false
```

Option A is the strongest route if the product goal is validating multi-product
reuse end to end. It remains a high-risk production action and requires a new,
explicit A5 authorization package before any provider contact.

## Non-Authorization Boundary

```yaml
A5_authorization_created: false
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
secret_value_printed: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
runs_output_committed: false
accepted_samples_written: false
dependency_change: false
package_json_modified: false
```

## Recommended Next

```yaml
phase: pending_human_generation_authorization_for_prompt_v2
auto_execution_allowed: false
purpose: wait for human selection of Option A/B/C; do not enter provider execution
```
