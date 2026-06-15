# Runtime-To-Review V2 Multi-Prompt Controlled Trial Plan

```yaml
phase: runtime_to_review_v2_multi_prompt_controlled_trial_plan_20260608
base_contract: AGENTS.md
mode: A4_8_green_lane_planning_and_validator
intent: local_implementation
risk_level: R2
status: local_plan_no_execute
```

## Purpose

This plan records the next useful step after the attempt-018 runtime-to-review
closeout: run a small number of deliberately different visual jobs before
turning the successful serum path into a broader Image Execution Broker
architecture.

The intent is not to repeat attempt-018 blindly. The intent is to learn which
fields and gates stay stable across product, shot role, prompt style, review
policy, artifact evidence, and memory-candidate routing.

## Current Baseline

```yaml
attempt_018_status: accepted_sample_registered_and_closed_out
attempt_019_recommended_now: false
current_success_path: runtime_to_review_v1_secretless_serum_attempt_018
current_architecture_state: proven_successful_path_but_not_final_broker_abstraction
```

The current codebase has proven that one controlled real image path can reach
artifact evidence, review, accepted-sample registration, and memory-candidate
closeout. That is enough to stop repeating the serum task for its own sake, but
not enough to freeze the long-term architecture.

## Architecture Direction

```text
Agent Image Lab Core
  -> VisualJobContract / ShotPlan / ReviewPolicy
  -> VCP Adapter
  -> secretless activation-bound request
  -> VCPToolBox Image Execution Broker
  -> Internal Authorizer
  -> Capability / Binding Registry
  -> Native Delegate Registry
  -> Restricted Plugin Facade
  -> provider delegate
  -> Artifact Store
  -> Review Queue
  -> Archive / Memory Candidate Gate
```

Plain meaning:

```text
Agent Image Lab owns the visual intent, review truth, archive decision, and
memory-candidate policy. VCPToolBox owns controlled execution, authorization,
runtime binding, provider/plugin access, and artifact receipt evidence.
```

## V2 Learning Goal

```yaml
v2_learning_goal:
  primary: discover_the_stable_contract_shape_before_broker_extraction
  method: run_two_or_three_small_controlled_trials_with_different_visual_jobs
  defer_large_refactor_until: repeated_fields_and_gates_are_observed
```

The next controlled trials should answer these questions:

- Which fields belong in `VisualJobContract` instead of route-specific payloads?
- Which review fields must be consistent before a result can enter `Review Queue`?
- Which artifact and receipt fields are stable enough for a generic broker?
- Which prompt differences cause product or support-logic regressions?
- Which memory-candidate fields should remain delayed until human review?

## Trial Set

```yaml
trial_count: 3
execute_one_trial_at_a_time: true
default_budget_per_trial:
  max_provider_calls: 1
  max_plugin_calls: 1
  max_api_calls: 1
  max_images: 1
  retry_allowed: false
```

### Trial 1 - Same Product, Different Shot Role

```yaml
trial_id: r2r_v2_trial_001_serum_detail_control
product_family: premium_skincare_serum
shot_role: product_detail_controlled_studio
purpose: test whether attempt-018 learning transfers from hero image to detail-oriented product fidelity
prompt_package_ref: prompts/image_generation/product_detail_premium_serum_bottle_v2.yaml
source_prompt_package_ref: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
prompt_revision_policy: derive_from_attempt_018_success_but_rewrite_for_detail_control
review_policy_focus:
  - intentionally_blank_label_boundary
  - cap_and_bottle_geometry
  - material_reflection_control
  - no_readable_text_logo_or_decorative_mark
success_signal: generated_unreviewed_artifact_reaches_review_queue_with_clear_product_fidelity_notes
```

### Trial 2 - Different Product, Similar Commercial Still-Life Rules

```yaml
trial_id: r2r_v2_trial_002_lantern_ecommerce_hero
product_family: premium_portable_led_camping_lantern
shot_role: ecommerce_square_hero
purpose: test product-geometry transfer on a non-beauty object with hard edges, controls, diffuser, and table/background constraints
prompt_package_ref: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml
review_policy_focus:
  - centered_product_scale
  - control_position_readability
  - cylindrical_geometry
  - no_people_hands_fire_smoke
success_signal: generated_unreviewed_artifact_reaches_review_queue_with_geometry_and_material_notes
```

### Trial 3 - Different Category, Support/Context Risk

```yaml
trial_id: r2r_v2_trial_003_bag_support_logic
product_family: fashion_lifestyle_bag
shot_role: lifestyle_still_life_support_logic
purpose: test whether the contract can express support physics, contact shadows, and context props without route-specific product code
prompt_package_ref: prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3.yaml
review_policy_focus:
  - support_logic
  - contact_shadow
  - product_scale
  - no_extra_brand_text
success_signal: generated_unreviewed_artifact_reaches_review_queue_with_support_logic_notes
```

## Execution Boundary

This plan does not execute any trial.

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
route_http_request_performed: false
real_manifest_read_performed: false
real_VCPChat_read_performed: false
real_VCPToolBox_read_performed: false
secret_value_read_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
push_tag_release_deploy_performed: false
```

## Required Gate Before Any Real Trial

Each future real trial must have its own activation packet before execution:

```yaml
required_future_activation_packet:
  lane: Amber_B_provider_image
  exact_trial_id: required
  exact_prompt_package_ref: required
  exact_output_directory_ref: required
  exact_provider_delegate_or_broker_binding: required
  max_provider_calls: 1
  max_plugin_calls: 1
  max_api_calls: 1
  max_images: 1
  retry_allowed: false
  overwrite_existing_files_allowed: false
  secret_value_read_allowed: false
  raw_private_data_print_allowed: false
  can_execute_now: false
```

## Stop Rules

Stop before execution when any of these are true:

- The prompt package is missing or does not match the trial id.
- The output directory already exists and overwrite would be needed.
- The provider/broker binding is not exact.
- The cost or call budget is unclear.
- The trial wants more than one image or a retry.
- The task would read secret values or raw private data.
- The task would write accepted samples, production candidate, DailyNote, or VCP memory directly.
- The task would require push, tag, release, deploy, or external repository modification.

## Broker Extraction Rule

Do not extract a full broker after one more image. Revisit extraction only after
at least two v2 trials produce comparable artifact/review evidence, or after one
trial exposes a clear repeated runtime boundary that should be encoded before
more live calls.

The adopted broker followup plan is
`docs/vcptoolbox_image_execution_broker_followup_plan.md`. It turns the external
VCPToolBox Image Execution Broker draft into the current project-local followup
route:

```yaml
current_broker_followup_next: perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization
current_broker_followup_completed_previous: prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute
external_repo_exact_read_receipt_template_ref: docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md
external_repo_exact_read_receipt_template_status: completed_validated_no_execute_template_20260610
external_draft_status: adopted_as_design_input_only
full_VCPToolBox_broker_implementation_allowed_now: false
generic_endpoint_migration_allowed_now: false
real_execution_allowed_by_broker_followup_plan: false
```

## Recommended Next

```yaml
recommended_next: prepare_r2r_v2_trial_001_serum_detail_control_activation_packet_no_execute
automatic_real_execution_allowed_by_this_plan: false
why: >
  Trial 1 changes the shot role while keeping the product family close to
  attempt-018. It must use the detail-control v2 prompt, not the original hero
  prompt, otherwise the trial would only test repeatability instead of shot-role
  transfer.
```
