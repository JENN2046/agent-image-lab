# Agent Image Lab Project Master Plan

Purpose: short index for current project direction. This file is not the only
source of truth. Detailed history and operating authority remain in `README.md`,
`docs/00_project_roadmap.md`, `AGENTS.md`, and `.agent_board/`.

## Current Baseline

```text
branch: master
latest_synced_head_before_v8_032_authorization_gate: 9c457d991b2e6e1159f5e5d652943ee0c81d8fbb
origin_master_before_v8_032_authorization_gate: 9c457d991b2e6e1159f5e5d652943ee0c81d8fbb
status: v8_032_second_product_post_persistence_fix_generation_authorization_gate
mode: A5 authorization record gate
phase_id: v8_032_second_product_post_persistence_fix_generation_authorization_gate
approved_product: multi_color_mesh_sports_visor
approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
output_directory: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 1
auto_retry: false
success_requires_verified_local_file: true
provider_contact_allowed_now: false
image_generation_allowed_now: false
env_local_secret_value_read_allowed_now: false
recommended_next: v8_033_second_product_post_persistence_fix_minimal_generation_trial_execution
recommended_next_auto_execution_allowed: true_after_v8_032_commit_and_guarded_push
latest_synced_head_before_v8_031_decision_gate: 785cb23452c37c1893855cf75360d32c841e5075
origin_master_before_v8_031_decision_gate: 785cb23452c37c1893855cf75360d32c841e5075
status: v8_031_second_product_retry_after_persistence_fix_decision_gate
mode: A4 decision gate
phase_id: v8_031_second_product_retry_after_persistence_fix_decision_gate
output_persistence_guard_fixed: true
prompt_v2_path: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
previous_execution_status: failed_no_local_output_file
success_requires_verified_local_file: true
A5_authorization_created: false
options_presented: authorize_one_more_minimal_real_generation_trial_after_persistence_fix | more_local_static_sandbox_testing | stop_second_product_real_generation_route
recommended_option: authorize_one_more_minimal_real_generation_trial_after_persistence_fix
human_decision_required: true
provider_contact_allowed_now: false
image_generation_allowed_now: false
retry_allowed_now: false
recommended_next: pending_human_retry_authorization_after_persistence_fix
recommended_next_auto_execution_allowed: false
latest_synced_head_before_v8_030_static_code_fix_gate: 785cb23452c37c1893855cf75360d32c841e5075
origin_master_before_v8_030_static_code_fix_gate: 785cb23452c37c1893855cf75360d32c841e5075
status: v8_030_runner_output_persistence_guard_static_code_fix_gate
mode: A4.8 static code fix gate
phase_id: v8_030_runner_output_persistence_guard_static_code_fix_gate
runner_output_persistence_guard_static_code_fix_created: true
normalize_result_requires_verified_local_file_count: true
legacy_files_written_count_can_create_success: false
local_persistence_success_flag_alone_can_create_success: false
human_review_requires_verified_local_file: true
provider_contact_allowed_now: false
image_generation_allowed_now: false
retry_allowed_now: false
recommended_next: v8_031_second_product_retry_after_persistence_fix_decision_gate
recommended_next_auto_execution_allowed: false
latest_synced_head_before_v8_029_output_persistence_fix_gate: 1c5c97605be208222c326101335d29cb84f48eb2
origin_master_before_v8_029_output_persistence_fix_gate: 1c5c97605be208222c326101335d29cb84f48eb2
status: v8_029_runner_output_persistence_static_review_and_fix_gate
mode: A4.8 static code review and local fix gate
phase_id: v8_029_runner_output_persistence_static_review_and_fix_gate
output_persistence_guard_created: true
provider_success_vs_local_persistence_split: true
local_file_existence_required_for_success: true
local_file_count_verification_added_or_confirmed: true
zero_local_file_forces_failed_no_local_output_file: true
human_review_requires_local_file: true
runner_success_condition_tightened: true
timestamp_evidence_policy_added: true
v8_021_provider_api_platform_time: 2026-05-14 12:41:47
v8_021_local_output_file_time: 2026-05-14 12:39:14.203 +08:00
v8_027_provider_api_platform_time: 2026-05-14 14:01:44
v8_027_local_output_directory_time: 2026-05-14 13:57:02.216 +08:00
provider_api_platform_time_is_primary_provider_contact_evidence: true
local_file_or_directory_time_is_runner_artifact_evidence: true
timestamp_sources_do_not_strictly_prove_causal_order: true
provider_contact_allowed_now: false
image_generation_allowed_now: false
retry_allowed_now: false
recommended_next: v8_030_second_product_retry_after_persistence_fix_decision_gate
recommended_next_auto_execution_allowed: false
latest_synced_head_before_v8_028_anomaly_review_gate: 00764b4bfd980fe92af023667ee06309819b6f32
origin_master_before_v8_028_anomaly_review_gate: 00764b4bfd980fe92af023667ee06309819b6f32
status: v8_028_second_product_prompt_v2_failed_trial_review_or_output_persistence_gate
mode: A4 / A0 failure-anomaly review and decision gate
phase_id: v8_028_second_product_prompt_v2_failed_trial_review_or_output_persistence_gate
route_B_second_product_prompt_v2: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
v8_027_execution_status: failed_no_local_output_file
v8_027_http_status: 200
v8_027_runner_reported_completed_generated: true
v8_027_runner_reported_image_count: 1
v8_027_runner_reported_files_written_count: 1
v8_027_local_file_count_verified: 0
v8_027_output_images_count: 0
image_created_for_review: false
retry_allowed_now: false
new_A5_authorization_required_for_retry: true
suspected_issue_class: output_persistence_anomaly
recommended_next: v8_029_runner_output_persistence_static_review_and_fix_gate
recommended_next_auto_execution_allowed: false
latest_synced_head_before_v8_026_authorization_gate: 6a2417802daa95cf05e611dd607183a374154011
origin_master_before_v8_026_authorization_gate: 6a2417802daa95cf05e611dd607183a374154011
status: v8_026_second_product_prompt_v2_generation_authorization_gate
mode: A5 authorization record gate
phase_id: v8_026_second_product_prompt_v2_generation_authorization_gate
prior_human_route_selection_gate: v7.261_human_product_route_selection_request_gate
prior_project_plugin_A5_authorization_package_draft_gate: v7.263_project_plugin_A5_authorization_package_draft_gate
same_provider_retry_allowed_now: false
A5_execution_allowed_now: false
provider_contact_allowed_now: false
native_doubao_static_hardening: completed
diagnostic_decision: continue_generation_stop_until_route_selection
selected_route_now: ROUTE-3-CONTINUED-STOP
selected_route_meaning_zh: 路线 3，继续停止生成
route_selection_required_before_new_A5: true
review_surface_product_spec_created: true
review_record_template_created: true
status_flow_defined: true
static_review_surface_acceptance_checklist_created: true
static_review_surface_mockup_readiness_review_created: true
static_review_surface_mockup_spec_created: true
static_review_surface_mockup_file_created: true
static_review_surface_mockup_acceptance_review_completed: true
static_review_surface_mockup_acceptance_result: pass_with_warnings
accepted_final_explicit_state_patched: true
static_review_surface_quality_stop_reached: true
product_workflow_fixture_packet_created: true
product_workflow_fixture_packet_acceptance_passed: true
product_workflow_paper_chain_quality_stop_reached: true
human_route_selection_requested: true
project_plugin_route_selected_for_planning: true
candidate_project_plugin: NativeDoubaoImage
project_plugin_A5_authorization_package_draft_created: true
draft_authorization_package_id: AUTH-DRAFT-PROJECT-PLUGIN-20260513-001
authorization_status: draft
approval_status: not_requested
execute_now: false
project_plugin_A5_authorization_draft_review_completed: true
draft_review_result: pass_to_keep_inactive
activation_verdict: blocked
true_A5_authorization_request_created: true
pending_authorization_package_id: AUTH-PENDING-PROJECT-PLUGIN-20260513-001
prompt_package_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
output_directory_ref: runs/real_generation/A5-PROJECT-PLUGIN-20260513-001/
preflight_approval_status: requested_for_preflight_only
active_A5_authorization_created: false
plugin_call_allowed_now: false
image_generation_allowed_now: false
route_B_selected: true
minimal_real_generation_trial_authorized: true
approved_product: matte_ceramic_mug
approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 4
auto_retry: false
stop_after_generation: true
human_review_required_after_generation: true
v7_269_minimal_real_generation_trial_status: success
reviewed_output: runs/real_generation/v7_269_matte_ceramic_mug_trial/native_doubao_1778681238211_0.jpg
output_images_count: 1
image_added_to_git: false
asset_status: needs_revision
accepted_candidate: false
commercial_delivery_ready: false
memory_suitability: deferred
prompt_revision_plan_created: true
prompt_v2_created_or_planned: created
prompt_v2_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
prompt_v2_static_review_result: passed
second_minimal_generation_trial_authorized: true
approved_product_for_second_trial: matte_ceramic_mug
approved_prompt_package_for_second_trial: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
provider_calls_max_for_second_trial: 1
generation_attempts_max_for_second_trial: 1
output_images_max_for_second_trial: 4
output_directory_for_second_trial: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/
v7.274_status: completed_success
v7.274_output_images_count: 1
v7.274_output_file: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg
v7.275_human_review_status: completed
v7.275_asset_status: accepted_candidate_with_minor_retouch
v7.275_accepted_candidate: true
v7.275_commercial_delivery_ready: false
v7.275_memory_suitability: deferred
prompt_v3_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v3.yaml
third_minimal_generation_trial_authorized: true
approved_prompt_package_for_third_trial: prompts/image_generation/product_still_life_matte_ceramic_mug_v3.yaml
provider_calls_max_for_third_trial: 1
generation_attempts_max_for_third_trial: 1
output_images_max_for_third_trial: 4
output_directory_for_third_trial: runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/
v7.277_status: completed_success
v7.277_output_images_count: 1
v7.277_output_file: runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/native_doubao_1778688750417_0.jpg
v7.278_human_review_status: completed
v7.278_asset_status: needs_revision
v7.278_accepted_candidate: false
v7.278_commercial_delivery_ready: false
v7.278_memory_suitability: deferred
previous_best_candidate: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg
v7.279_status: completed_remote_synced
v7.279_selected_route: fourth_minimal_generation_trial
v7.279_v3_failed_reason: handle attachment geometry regression
v7.279_fourth_trial_goal: restore v2 composition while fixing handle geometry and preserving artifact control
prompt_v4_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml
fourth_minimal_generation_trial_authorized: true
approved_prompt_package_for_fourth_trial: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml
provider_calls_max_for_fourth_trial: 1
generation_attempts_max_for_fourth_trial: 1
output_images_max_for_fourth_trial: 4
output_directory_for_fourth_trial: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/
auto_retry_for_fourth_trial: false
stop_after_generation_for_fourth_trial: true
human_review_required_after_generation: true
v7.281_status: completed_success
v7.281_output_images_count: 1
v7.281_output_file: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
v7.281_auto_retry_used: false
v7.282_human_review_status: completed_remote_synced
v7.282_asset_status: accepted_candidate_with_minor_retouch
v7.282_accepted_candidate: true
v7.282_commercial_delivery_ready: false
v7.282_memory_suitability: deferred
current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
v7.283_options_presented: keep_v4_and_stop_generation | final_retouch_planning_no_generation | fifth_minimal_generation_trial
v7.283_recommended_option: keep_v4_and_stop_generation
v7.283_secondary_safe_option: final_retouch_planning_no_generation
v7.283_fifth_trial_recommendation: low_to_medium_requires_new_explicit_human_authorization
v7.283_human_decision_required_before_next_generation: true
v7.284_evidence_package_created: true
accepted_candidate_evidence_package_ref: docs/accepted_candidate_evidence_package_matte_ceramic_mug_v1.md
v7.284_generation_stopped: true
v7.284_output_image_added_to_git: false
v7.284_accepted_samples_written: false
v7.284_memory_write_performed: false
v7.285_product_loop_closed: true
v7.285_real_generation_chain_completed: true
v7.285_total_real_generation_trials: 4
v7.285_prompt_evolution_analysis_created: true
v7.285_review_dataset_summary_created: true
v7.285_v8_route_options_created: true
v7.285_recommended_default_route: final_retouch_planning
v8_route_selection_required: true
v8_route_selection_completed: true
selected_v8_route: final_retouch_planning
selected_v8_route_zh: 最终修图规划
v8_next_phase: v8_001_final_retouch_planning_gate
v8_next_phase_auto_execution_allowed: false
v8_001_final_retouch_plan_created: true
final_retouch_plan_ref: docs/final_retouch_plan_matte_ceramic_mug_v4.md
v8_001_fifth_generation_started: false
v8_001_output_image_added_to_git: false
v8_001_memory_write_performed: false
v8_001_production_candidate_002_started: false
v8_002_retouch_acceptance_criteria_created: true
retouch_acceptance_criteria_ref: docs/retouch_acceptance_criteria_matte_ceramic_mug_v4.md
v8_002_delivery_package_spec_created: true
delivery_package_spec_ref: docs/delivery_package_spec_matte_ceramic_mug_v4.md
v8_002_commercial_delivery_ready: false
v8_002_memory_suitability: deferred
v8_002_fifth_generation_started: false
v8_002_output_image_added_to_git: false
v8_002_memory_write_performed: false
v8_002_production_candidate_002_started: false
v8_003_retouch_handoff_package_created: true
retouch_handoff_package_ref: docs/retouch_handoff_package_matte_ceramic_mug_v4.md
v8_003_delivery_package_spec_linked: true
v8_003_retouch_acceptance_criteria_linked: true
v8_003_commercial_delivery_ready: false
v8_003_memory_suitability: deferred
v8_003_fifth_generation_started: false
v8_003_output_image_added_to_git: false
v8_003_memory_write_performed: false
v8_003_production_candidate_002_started: false
v8_004_final_retouch_route_closed: true
v8_004_route_closeout_ref: docs/v8_final_retouch_route_closeout_matte_ceramic_mug_v4.md
v8_004_final_retouch_plan_created: true
v8_004_retouch_acceptance_criteria_created: true
v8_004_delivery_package_spec_created: true
v8_004_retouch_handoff_package_created: true
v8_004_commercial_delivery_ready: false
v8_004_memory_suitability: deferred
v8_004_fifth_generation_started: false
v8_004_output_image_added_to_git: false
v8_004_memory_write_performed: false
v8_004_production_candidate_002_started: false
v8_005_next_route_decision_options_created: true
v8_005_route_options_ref: docs/v8_next_route_decision_options.md
v8_005_routes_presented: multi_product_prompt_package_expansion | review_console_productization_planning | memory_planning_package | production_readiness_planning | human_retouch_execution_outside_codex
v8_005_recommended_low_risk_route: multi_product_prompt_package_expansion
v8_005_human_route_selection_required: true
v8_005_automatic_next_route_execution_allowed: false
v8_005_fifth_generation_started: false
v8_005_output_image_added_to_git: false
v8_005_memory_write_performed: false
v8_005_production_candidate_002_started: false
v8_003a_A4_8_safe_project_operator_rail_created: true
v8_003a_A4_8_safe_project_operator_rail_zh: 安全项目运营轨
v8_003a_A4_8_is_not_A5: true
v8_003a_provider_contact_allowed: false
v8_003a_image_generation_allowed: false
v8_003a_memory_write_allowed: false
v8_003a_runtime_execution_allowed: false
v8_003b_A4_8_rule_intake_smoke_test_passed: true
v8_006_A4_8_state_and_rule_intake_review_passed: true
v8_007_A4_8_mutation_live_run_docs_only_started: true
v8_007_provider_contact_allowed: false
v8_007_image_generation_allowed: false
v8_007_memory_write_allowed: false
v8_007_runtime_execution_allowed: false
v8_008_controlled_failure_induced: true
v8_008_failure_type: git_diff_check_trailing_whitespace
v8_008_committed_failure_state: false
v8_008_pushed_failure_state: false
v8_008_fixed_before_commit: true
v8_008_recovery_validation_passed: true
v8_009_A4_8_hard_stop_probe_passed: true
v8_010_A4_8_comprehensive_validation_passed: true
A4_8_validated: true
A4_8_is_not_A5: true
v8_011_selected_route: multi_product_prompt_package_expansion
v8_011_selected_route_zh: 多商品 prompt package 扩展
v8_011_route_B_changes_v7_accepted_candidate_status: false
v8_012_selected_second_product: multi_color_mesh_sports_visor
v8_012_second_product_brief_created: true
v8_012_second_product_brief_ref: briefs/product_brief_multi_color_mesh_sports_visor_v1.md
v8_013_second_product_prompt_package_created: true
v8_013_second_product_prompt_package_ref: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
v8_014_second_product_prompt_static_review_completed: true
v8_014_second_product_prompt_static_review_result: pass_with_minor_watch_items
Route_B_initial_docs_sequence_completed: true
A5_execution_allowed_for_v8_016_once: true
provider_contact_allowed_for_v8_016_once: true
approved_second_product_for_v8_016: multi_color_mesh_sports_visor
approved_prompt_package_for_v8_016: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
approved_output_directory_for_v8_016: runs/real_generation/v8_016_multi_color_mesh_sports_visor_trial/
provider_calls_max_for_v8_016: 1
generation_attempts_max_for_v8_016: 1
output_images_max_for_v8_016: 1
auto_retry_for_v8_016: false
v8_016_execution_status: failed_http_400
v8_016_provider_calls_used: 1
v8_016_generation_attempts_used: 1
v8_016_image_created: false
v8_016_output_images_count: 0
v8_016_output_directory_created: false
v8_016_no_image_to_review: true
v8_016_retry_allowed_now: false
v8_017_failed_trial_review_completed: true
v8_018_canonical_prompt_field_added_or_confirmed: true
v8_018_positive_prompt_mapping_resolved: true
v8_018_runner_prompt_field: prompt
v8_019_options_presented: authorize_second_minimal_real_generation_trial | more_static_runner_payload_review | stop_second_product_real_generation_route
v8_019_recommended_option: authorize_second_minimal_real_generation_trial
v8_019_human_selected_option: authorize_second_minimal_real_generation_trial
v8_020_this_is_new_A5_authorization: true
v8_020_previous_v8_015_authorization_consumed: true
v8_020_approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
v8_020_output_directory: runs/real_generation/v8_021_multi_color_mesh_sports_visor_second_trial/
v8_020_provider_calls_max: 1
v8_020_generation_attempts_max: 1
v8_020_output_images_max: 1
v8_021_execution_status: success
v8_021_output_file: runs/real_generation/v8_021_multi_color_mesh_sports_visor_second_trial/native_doubao_1778733554203_0.jpg
v8_021_output_images_count: 1
v8_021_output_added_to_git: false
v8_022_asset_status: needs_revision
v8_022_accepted_candidate: false
v8_022_commercial_delivery_ready: false
v8_022_memory_suitability: deferred
v8_022_reviewable_sample: true
v8_023_prompt_revision_plan_created: true
v8_023_prompt_v2_created: true
v8_023_prompt_v2_ref: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
v8_023_provider_contact: false
v8_023_image_generation: false
v8_024_prompt_v2_static_review_completed: true
v8_024_prompt_v2_static_review_result: pass_ready_for_authorization_decision
v8_024_provider_contact: false
v8_024_image_generation: false
v8_025_options_presented: authorize_next_minimal_real_generation_trial | more_static_prompt_payload_review | stop_route_B_generation_here
v8_025_recommended_option: authorize_next_minimal_real_generation_trial
v8_025_human_decision_required: true
v8_025_A5_authorization_created: false
v8_025_provider_contact: false
v8_025_image_generation: false
v8_026_human_selected_option: authorize_next_minimal_real_generation_trial
v8_026_this_is_new_A5_authorization: true
v8_026_approved_product: multi_color_mesh_sports_visor
v8_026_approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
v8_026_output_directory: runs/real_generation/v8_027_multi_color_mesh_sports_visor_v2_trial/
v8_026_provider_calls_max: 1
v8_026_generation_attempts_max: 1
v8_026_output_images_max: 1
v8_026_auto_retry: false
v8_026_provider_contact: false
v8_026_image_generation: false
recommended_next: v8_027_second_product_prompt_v2_minimal_generation_trial_execution
```

## Product Direction

Agent Image Lab remains a VCP-native visual production orchestration layer.
The product mainline has returned to image workflow planning. The Prompt Package
Builder now defines the first controllable artifact before generation
authorization or provider contact: a reviewable product image prompt package.
v7.228 adds the fillable instance template for that package without creating a
real generation task. v7.229 adds the human review checklist and status taxonomy
that decide whether a package may be referenced by a future A5 authorization
draft. v7.230 adds the non-executing handoff template from approved package to
future A5 authorization draft inputs. v7.231 defines the future generated asset
status taxonomy and review surface fields. v7.232 defines the non-writing
memory suitability decision matrix. v7.233 links these artifacts into a single
Delivery / Review Surface Package. v7.234 turns the chain into an operator
runbook. v7.235 validates the chain with a synthetic matte ceramic coffee mug
walkthrough. v7.236 confirms the chain is ready for a non-active A5
authorization draft, not active execution. v7.237 creates that non-active draft.
v7.238 reviews it as safe A4 paperwork while keeping active A5 blocked. v7.239
creates a non-executing generation plan draft to provide a future plan
reference. v7.240 confirms the plan draft and authorization draft are
compatible at paper level while keeping active A5 blocked. v7.241 patches the
non-active authorization draft with the plan ref/version while leaving all
executable A5 fields blocked. v7.242 classifies the remaining active
authorization gaps and separates A4 paper-preparable fields from fields that
must wait for explicit active authorization. v7.243 simplified the authorization
draft into a one-page preflight-pending record. Subsequent active A5 diagnostic
attempts reached `failed_no_image_repeated_quota_or_rate_limit`; the same
provider/model/account path must not be retried until quota/rate-limit is
resolved or a different path is explicitly authorized. v7.244 reconciled state
surfaces to that reality. v7.245 hardens the Native Doubao local execution
surface statically: syntax check, prompt path containment, output containment,
base URL validation, env allowlist, public result redaction, exact call budget,
and validator drift. v7.246 makes the no-generation diagnostic readiness
decision: generation remains stopped until a human provides sanitized quota
resolution evidence or selects a different provider/model/account path for a
future paper-only decision package. v7.247 defines the paper-only decision
package: Route 1 external quota resolution, Route 2 provider/model/account
switch, and Route 3 continued stop. Route 3 is selected now. v7.248 closes
the current stop state and requests an explicit human route selection before
any new A5, provider contact, plugin call, image generation, or runtime action.
Under Route 3, v7.249 returns to the non-generation product mainline and
creates the static Review Surface product spec: page goal, user roles, core
fields, asset card structure, review decision area, memory suitability area,
handoff area, and no-execution boundaries.
v7.250 adds the paper review record template and status flow, including
accepted_candidate, rejected, needs_revision, deferred, rejection reasons,
revision request handling, and memory_suitability yes/no/deferred routing.
v7.251 adds the static Review Surface acceptance checklist for field
completeness, status flow, human decision priority, memory write prohibition,
A5/provider/plugin/runtime prohibition, and future mockup preconditions.
v7.252 reviews those artifacts and confirms the next safe product step is a
static mockup specification gate, not runtime implementation.
v7.253 defines the mockup specification: screen regions, fixture shape, Chinese
copy rules, disabled action reasons, and checklist mapping before any HTML or
runtime implementation. v7.254 creates a standalone offline static HTML mockup
file under `review_console/static_mockups/` with no external assets, scripts,
runtime imports, provider/plugin calls, image generation, or memory writes.
v7.255 reviews that HTML against the v7.251 checklist and v7.253 spec. It
passes the no-execution and core field checks, with one follow-up warning:
`accepted_final` should become an explicit future/blocked status in the mockup.
v7.256 patches that gap by adding `accepted_final` as an explicit
`future_blocked` status in the offline mockup while preserving no-execution.
v7.257 decides that the static Review Surface track has reached an A4 quality
stop. More static Review Surface polish is not the default next value; the next
useful product task should connect the paper workflow through a synthetic fixture
packet.
v7.258 creates that synthetic non-executing fixture packet, linking prompt
package input, future authorization placeholder, review record, asset status,
memory suitability decision, and delivery handoff.
v7.259 reviews that fixture packet and accepts it as a synthetic non-executing
paper-chain reference.
v7.260 decides that the product image paper workflow has reached quality stop.
Further automatic paper artifacts are blocked by default until a human selects
the next product route. v7.261 presents the route selection request: Route 1
quota resolution then A5 retry, Route 2 provider/model/account path switch,
Route 3 manual product prompt package sample, or Route 4 Review Console runtime
integration planning. The low-risk recommendation is Route 3, but no route may
start automatically. The owner then chose the project plugin path for planning.
v7.262 identifies `NativeDoubaoImage` as the project-local candidate plugin and
lists the authorization fields needed before any future plugin call. v7.263
creates `AUTH-DRAFT-PROJECT-PLUGIN-20260513-001` as a draft-only A5
authorization package for that route, with `approval_status=not_requested` and
`execute_now=false`. v7.264 reviews that draft and finds it safe to keep as
inactive paperwork, but blocked for activation. This does not authorize A5,
provider contact, plugin execution, output write, image generation, or memory
write. v7.265 creates the true A5 authorization request surface for preflight:
`AUTH-PENDING-PROJECT-PLUGIN-20260513-001`, the matte ceramic mug prompt package,
and the sandboxed output directory are now fixed. It still does not authorize
provider contact, plugin execution, image generation, env value reads, output
writes, or memory writes.
v7.268b selects Route B and authorizes exactly one minimal real generation
trial for `matte_ceramic_mug` in v7.269. The boundary is one provider call, one
generation attempt, at most four output images, no retry, no second batch, no
DailyNote, no VCP memory write, and immediate stop for human review after the
trial.
v7.269 completes that bounded trial with one generated image saved under
`runs/real_generation/v7_269_matte_ceramic_mug_trial/`. v7.270 records the
human review result for the first real output: the sample is useful as first
real data, but `asset_status=needs_revision`, `accepted_candidate=false`, and
`commercial_delivery_ready=false` because product scale, top whitespace,
lighting depth, background layering, rim/handle refinement, and a tiny colored
speck need correction before commercial use.
v7.271 turns those review findings into a static prompt revision plan and a new
v2 prompt package at
`prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml`. The v2
package tightens product scale, top margin, directional lighting, background
depth, ceramic rim/handle clarity, and colored-speck suppression. It is not an
execution request and still requires v7.272 static review plus separate human A5
authorization before any second trial.
v7.272 static review passes prompt v2 for a bounded second trial. v7.273 records
the human authorization for exactly one second minimal real generation trial
using the v2 prompt package. v7.274 consumes that single authorized call and
generates one output. v7.275 records the human review result:
`asset_status=accepted_candidate_with_minor_retouch`,
`accepted_candidate=true`, `commercial_delivery_ready=false`, and
`memory_suitability=deferred`. v7.276 creates the v3 prompt package and records
the human authorization boundary for exactly one third minimal real generation
trial using prompt v3. v7.277 consumes that single authorization and generates
one output. v7.278 records that the v3 output regressed on handle geometry:
`asset_status=needs_revision`, `accepted_candidate=false`, and current best
candidate remains the v2 output. v7.279 records the human decision to continue
with one fourth minimal trial focused only on handle geometry and product
credibility. v7.280 creates prompt v4 and records the exact fourth-trial
boundary: one provider call, one generation attempt, at most four outputs, no
retry, no memory writes, no Batch 005, no production candidate promotion, and
immediate stop for human review. v7.281 consumes that single authorization and
generates one output. v7.282 records the human review result:
`asset_status=accepted_candidate_with_minor_retouch`, `accepted_candidate=true`,
`commercial_delivery_ready=false`, and the current best candidate is now the v4
output. v7.283 presents the candidate/retouch/fifth-trial decision options and
recommends keeping v4 while stopping generation by default. v7.284 seals the
accepted candidate evidence package. v7.285 closes the V7 product loop, records
the v1-v4 generation timeline, prompt evolution analysis, review dataset
summary, safety/governance closeout, and V8 route options. The default V8
recommendation is final retouch planning, with multi-product prompt package
expansion as the strongest second option.

## Active Boundaries

```text
A5: not authorized after v7.282; v7.281 single authorized call has been consumed
provider contact: not authorized after v7.282; no fifth generation is active without a new authorization gate
runtime execution: not authorized
plugin call: not authorized after v7.282
image generation: not authorized after v7.282
DailyNote / VCP memory write: not authorized
real manifest / VCPChat / VCPToolBox read: not authorized
tag / release / deploy / push: not authorized by this file
```

## Operating Model

Use one persistent commander as the source of judgment. Use temporary
`codex exec` Workers only for exact task contracts. Use read-only Verifiers only
for evidence review. The commander remains responsible for final scope review,
validation interpretation, staging, commit decisions, and next-task selection.

## Recommended Next

Recommended next is
`v8_route_selection_human_decision_gate`
（人工选择 V8 路线）. The default recommendation is
`final_retouch_planning`; `multi_product_prompt_package_expansion` is the
secondary high-value route. No retry, fifth generation, memory write, Batch 005,
or production_candidate_002 may start automatically.
