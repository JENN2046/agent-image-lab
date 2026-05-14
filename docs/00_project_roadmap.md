# 00 项目路线图

本文是 Agent Image Lab 的总路线图，用来把 v0.2 基线、v0.3 授权门槛、MVP-B dry-run 和未来真实闭环串成一条可执行路径。

## 完成定义

Agent Image Lab 不是在第一次能生成图片时才算完成。项目完成分为四层：

| 层级 | 状态 | 完成标准 |
|---|---|---|
| L1 规格基线 | 已基本完成 | 文档、Agent 规则、schema、记忆策略、审片台规格、无执行样例完整，并能通过只读校验。 |
| L2 审片台原型 | 已基本完成 | 静态 Review Console 能展示版本、评分、人工覆盖、审批和 memory_delta 草案，不调用 API、不写文件。 |
| L3 MVP-B dry-run | 已基本完成 | Adapter dry-run 已有项目内实现、VCPToolBox 导出包和 v0.5 安装验证，仍保持 `max_plugin_calls=0`、不调用真实插件、不写 DailyNote。 |
| L4 受控真实闭环 | 已完成 v1.0 closeout 候选 | 已完成单一真实生图 manifest 脱敏审查、v0.7 前置包、Photo Studio OS 0 调用 dry-run rehearsal、受控真实执行、脱敏记录和人工接受通过。 |

## 当前基线

当前仓库处于：

```text
Current synced baseline before v9.001 guard gate: a461ce90c3e6072928eca23caf8f625f58f05d8b on master == origin/master.
Current mainline state: v9_001_delivery_readiness_scope_and_asset_selection_plus_code_surface_guard_gate selects ceramic_mug_v4 as the first delivery-readiness asset and hardens Native Doubao local preflight checks; no delivery package execution starts here.
Current phase id: v9_001_delivery_readiness_scope_and_asset_selection_plus_code_surface_guard_gate.
source_phase: v9_delivery_readiness_layer_route_selection_gate.
v8_closed: true.
selected_route: delivery_readiness_layer.
selected_first_asset_for_delivery_readiness: ceramic_mug_v4.
selected_candidate_path: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg.
sports_visor_delivery_readiness_candidate: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg.
asset_selection_matrix_created: true.
commercial_delivery_ready: false.
memory_write_allowed: false.
production_candidate_002_allowed: false.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
retry_allowed_now: false.
prompt_v2_loader_checked: true.
prompt_v2_prompt_non_empty: true.
prompt_v2_negative_prompt_non_empty: true.
output_persistence_guard_checked: true.
local_file_required_for_human_review: true.
recommended_next: v9_002_delivery_readiness_package_gate.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v9 route selection gate: 87cbc755833e00eae03d5f9381cbc324b727cd36 on master == origin/master.
Current mainline state: v9_delivery_readiness_layer_route_selection_gate selects V9 Option A as the delivery readiness layer; no V9 execution starts here.
Current phase id: v9_delivery_readiness_layer_route_selection_gate.
v8_closed: true.
selected_route: delivery_readiness_layer.
selected_route_zh: 交付准备层.
accepted_candidates_exist: true.
ceramic_mug_accepted_candidate_exists: true.
sports_visor_accepted_candidate_exists: true.
commercial_delivery_ready: false.
memory_write_allowed: false.
production_candidate_002_allowed: false.
human_selection_completed: true.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
retry_allowed_now: false.
runtime_allowed_now: false.
recommended_next: v9_001_delivery_readiness_scope_and_asset_selection_gate.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v8_038 final closeout: 615aa187e8909667ade600b22e2e9895e29bffa7 on master == origin/master.
Current mainline state: v8_038 closes the V8 product loop after human selected Option A; V8 is sealed as a multi-product workflow validation cycle, not a commercial delivery or memory-write cycle.
Current phase id: v8_038_v8_product_loop_final_closeout.
v8_closed: true.
route_A_closed: true.
A4_8_validated: true.
route_B_closed: true.
multi_product_reuse_validated: true.
ceramic_mug_accepted_candidate_exists: true.
sports_visor_accepted_candidate_exists: true.
second_product: multi_color_mesh_sports_visor.
second_product_accepted_candidate_path: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg.
second_product_asset_status: accepted_candidate_with_minor_watch_items.
commercial_delivery_ready: false.
memory_suitability: deferred.
output_persistence_guard_fixed: true.
accepted_samples_written: false.
runs_output_committed: false.
memory_write_performed: false.
production_candidate_002_started: false.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
retry_allowed_now: false.
recommended_next: v9_delivery_readiness_layer_route_selection_gate.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v8_037 route decision gate: 462f614d97ec3bccaf9dd67f3b0dc03e2f08d980 on master == origin/master.
Current mainline state: v8_037 presents the human decision gate for closing V8 or selecting the next route; no new route execution starts here.
Current phase id: v8_037_v8_product_loop_closeout_or_next_route_selection_gate.
route_A_closed: true.
A4_8_validated: true.
route_B_closed: true.
multi_product_reuse_validated: true.
second_product_accepted_candidate_created: true.
accepted_candidate_path: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg.
asset_status: accepted_candidate_with_minor_watch_items.
accepted_candidate: true.
commercial_delivery_ready: false.
memory_suitability: deferred.
production_candidate_002_started: false.
options_presented: close_v8_product_loop_now | final_retouch_package_for_second_product | third_product_prompt_package_expansion | review_console_productization_planning | memory_write_planning | production_candidate_002_readiness_planning.
recommended_option: close_v8_product_loop_now.
human_decision_required: true.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
retry_allowed_now: false.
memory_write_allowed_now: false.
recommended_next: v8_038_v8_product_loop_final_closeout.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v8_036 Route B closeout gate: 8c03d48daa674f039f931840e03f4df0ae007509 on master == origin/master.
Current mainline state: v8_036 closes Route B multi-product prompt package expansion; Route B validated cross-product reuse and created a second-product accepted candidate, but did not create a commercial delivery asset, memory write, accepted_samples entry, or production_candidate_002.
Current phase id: v8_036_route_B_multi_product_expansion_closeout.
route_B_closed: true.
route_B_goal_met: true.
multi_product_reuse_validated: true.
second_product: multi_color_mesh_sports_visor.
accepted_candidate_path: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg.
asset_status: accepted_candidate_with_minor_watch_items.
accepted_candidate: true.
commercial_delivery_ready: false.
memory_suitability: deferred.
local_files_verified_count: 1.
local_persistence_success: true.
accepted_samples_written: false.
runs_output_committed: false.
memory_write_performed: false.
production_candidate_002_started: false.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
retry_allowed_now: false.
recommended_next: v8_037_v8_product_loop_closeout_or_next_route_selection_gate.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v8_035 evidence package gate: 5295f77d95c5f6a9ce8b6b3f8e6637661bc8ea67 on master == origin/master.
Current mainline state: v8_035 packages the Route B second-product accepted candidate evidence chain; no provider contact, image generation, retry, memory write, accepted_samples write, or production_candidate_002 starts here.
Current phase id: v8_035_route_B_second_product_accepted_candidate_evidence_package.
accepted_candidate_path: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg.
asset_status: accepted_candidate_with_minor_watch_items.
accepted_candidate: true.
commercial_delivery_ready: false.
memory_suitability: deferred.
local_files_verified_count: 1.
local_persistence_success: true.
route_B_cross_product_reuse_validated: true.
accepted_samples_written: false.
runs_output_committed: false.
production_candidate_002_started: false.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
retry_allowed_now: false.
memory_write_allowed_now: false.
recommended_next: v8_036_route_B_multi_product_expansion_closeout.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v8_034 human review gate: f98dee058ed2eddee77733dc529272593fe95639 on master == origin/master.
Current mainline state: v8_034 records human review for the v8.033 post-persistence-fix second-product output; the output is accepted_candidate_with_minor_watch_items but not commercial_delivery_ready.
Current phase id: v8_034_human_review_of_second_product_post_persistence_fix_output.
reviewed_output: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg.
asset_status: accepted_candidate_with_minor_watch_items.
accepted_candidate: true.
commercial_delivery_ready: false.
memory_suitability: deferred.
reviewable_sample: true.
local_files_verified_count: 1.
local_persistence_success: true.
route_B_cross_product_reuse_validated: true.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
retry_allowed_now: false.
memory_write_allowed_now: false.
recommended_next: v8_035_route_B_second_product_accepted_candidate_evidence_package.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v8_032 authorization gate: 9c457d991b2e6e1159f5e5d652943ee0c81d8fbb on master == origin/master.
Current mainline state: v8_032 records the new single-use A5 authorization for one post-persistence-fix prompt v2 generation trial; no provider contact occurs until v8_033 after commit and push.
Current phase id: v8_032_second_product_post_persistence_fix_generation_authorization_gate.
approved_product: multi_color_mesh_sports_visor.
approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml.
output_directory: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/.
provider_calls_max: 1.
generation_attempts_max: 1.
output_images_max: 1.
auto_retry: false.
success_requires_verified_local_file: true.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
env_local_secret_value_read_allowed_now: false.
recommended_next: v8_033_second_product_post_persistence_fix_minimal_generation_trial_execution.
recommended_next_auto_execution_allowed: true_after_v8_032_commit_and_guarded_push.
Current synced baseline before v8_031 decision gate: 785cb23452c37c1893855cf75360d32c841e5075 on master == origin/master.
Current mainline state: v8_031 presents the human decision gate for whether to authorize one more minimal real generation trial after the output persistence guard fix.
Current phase id: v8_031_second_product_retry_after_persistence_fix_decision_gate.
output_persistence_guard_fixed: true.
prompt_v2_path: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml.
previous_execution_status: failed_no_local_output_file.
success_requires_verified_local_file: true.
A5_authorization_created: false.
options_presented: authorize_one_more_minimal_real_generation_trial_after_persistence_fix | more_local_static_sandbox_testing | stop_second_product_real_generation_route.
recommended_option: authorize_one_more_minimal_real_generation_trial_after_persistence_fix.
human_decision_required: true.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
retry_allowed_now: false.
recommended_next: pending_human_retry_authorization_after_persistence_fix.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v8_030 static code fix gate: 785cb23452c37c1893855cf75360d32c841e5075 on master == origin/master.
Current mainline state: v8_030 statically tightens Native Doubao result normalization so legacy write counts or success flags cannot create local output success without verified local files.
Current phase id: v8_030_runner_output_persistence_guard_static_code_fix_gate.
runner_output_persistence_guard_static_code_fix_created: true.
normalize_result_requires_verified_local_file_count: true.
legacy_files_written_count_can_create_success: false.
local_persistence_success_flag_alone_can_create_success: false.
human_review_requires_verified_local_file: true.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
retry_allowed_now: false.
recommended_next: v8_031_second_product_retry_after_persistence_fix_decision_gate.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v8_029 output persistence fix gate: 1c5c97605be208222c326101335d29cb84f48eb2 on master == origin/master.
Current mainline state: v8_029 statically fixes Native Doubao output persistence accounting so zero verified local files cannot be reported as local output success.
Current phase id: v8_029_runner_output_persistence_static_review_and_fix_gate.
output_persistence_guard_created: true.
provider_success_vs_local_persistence_split: true.
local_file_existence_required_for_success: true.
local_file_count_verification_added_or_confirmed: true.
zero_local_file_forces_failed_no_local_output_file: true.
human_review_requires_local_file: true.
runner_success_condition_tightened: true.
timestamp_evidence_policy_added: true.
v8_021_provider_api_platform_time: 2026-05-14 12:41:47.
v8_021_local_output_file_time: 2026-05-14 12:39:14.203 +08:00.
v8_027_provider_api_platform_time: 2026-05-14 14:01:44.
v8_027_local_output_directory_time: 2026-05-14 13:57:02.216 +08:00.
provider_api_platform_time_is_primary_provider_contact_evidence: true.
local_file_or_directory_time_is_runner_artifact_evidence: true.
timestamp_sources_do_not_strictly_prove_causal_order: true.
provider_contact_allowed_now: false.
image_generation_allowed_now: false.
retry_allowed_now: false.
recommended_next: v8_030_second_product_retry_after_persistence_fix_decision_gate.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v8_028 anomaly review gate: 00764b4bfd980fe92af023667ee06309819b6f32 on master == origin/master.
Current mainline state: v8_028 records the Route B prompt v2 output persistence anomaly; v8.027 consumed one authorized provider call and reported generated, but local artifact verification found no image file.
Current phase id: v8_028_second_product_prompt_v2_failed_trial_review_or_output_persistence_gate.
Route B second product prompt v2: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml.
v8_027_execution_status: failed_no_local_output_file.
v8_027_http_status: 200.
v8_027_runner_reported_completed_generated: true.
v8_027_runner_reported_image_count: 1.
v8_027_runner_reported_files_written_count: 1.
v8_027_local_file_count_verified: 0.
v8_027_output_images_count: 0.
image_created_for_review: false.
retry_allowed_now: false.
new_A5_authorization_required_for_retry: true.
suspected_issue_class: output_persistence_anomaly.
recommended_next: v8_029_runner_output_persistence_static_review_and_fix_gate.
recommended_next_auto_execution_allowed: false.
Current synced baseline before v8_026 authorization gate: 6a2417802daa95cf05e611dd607183a374154011 on master == origin/master.
Current mainline state: v8_026 records the new single-use A5 authorization for one prompt v2 minimal generation trial; no provider contact occurs until v8_027 after commit and push.
Current phase id: v8_026_second_product_prompt_v2_generation_authorization_gate.
Prior project plugin A5 authorization package draft gate: v7.263_project_plugin_A5_authorization_package_draft_gate.
Board calibration: v7.222 completed and pushed.
Task selection: v7.223 read-only review selected v7.224 mainline status freshness alignment as the only safe next task.
Current status: failed_no_image_repeated_quota_or_rate_limit.
same_provider_retry_allowed_now: false.
A5_execution_allowed_now: false.
provider_contact_allowed_now: false.
Native Doubao static hardening: syntax/path sandbox/base URL/raw output/env allowlist/validator drift patched.
Diagnostic decision: continue_generation_stop_until_route_selection.
Provider path decision: ROUTE-3-CONTINUED-STOP（路线 3：继续停止生成）selected now; Route 1 quota resolution and Route 2 provider/model/account switch remain available only after explicit human selection.
Review Surface mainline: static Review Surface and product image paper workflow have reached A4 quality stop; v7.261 presents human-selectable routes and stops automatic artifact creation.
route_selection_required_before_new_A5: true.
human_route_selection_requested: true.
project_plugin_route_selected_for_planning: true.
candidate_project_plugin: NativeDoubaoImage.
project_plugin_A5_authorization_package_draft_created: true.
draft_authorization_package_id: AUTH-DRAFT-PROJECT-PLUGIN-20260513-001.
authorization_status: draft.
approval_status: not_requested.
execute_now: false.
project_plugin_A5_authorization_draft_review_completed: true.
draft_review_result: pass_to_keep_inactive.
activation_verdict: blocked.
true_A5_authorization_request_created: true.
pending_authorization_package_id: AUTH-PENDING-PROJECT-PLUGIN-20260513-001.
prompt_package_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml.
output_directory_ref: runs/real_generation/A5-PROJECT-PLUGIN-20260513-001/.
preflight_approval_status: requested_for_preflight_only.
active_A5_authorization_created: false.
plugin_call_allowed_now: false.
image_generation_allowed_now: false.
route_B_selected: true.
minimal_real_generation_trial_authorized: true.
approved_product: matte_ceramic_mug.
approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml.
provider_calls_max: 1.
generation_attempts_max: 1.
output_images_max: 4.
auto_retry: false.
stop_after_generation: true.
human_review_required_after_generation: true.
v7_269_minimal_real_generation_trial_status: success.
reviewed_output: runs/real_generation/v7_269_matte_ceramic_mug_trial/native_doubao_1778681238211_0.jpg.
output_images_count: 1.
image_added_to_git: false.
asset_status: needs_revision.
accepted_candidate: false.
commercial_delivery_ready: false.
memory_suitability: deferred.
prompt_revision_plan_created: true.
prompt_v2_created_or_planned: created.
prompt_v2_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml.
prompt_v2_static_review_result: passed.
second_minimal_generation_trial_authorized: true.
approved_product_for_second_trial: matte_ceramic_mug.
approved_prompt_package_for_second_trial: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml.
provider_calls_max_for_second_trial: 1.
generation_attempts_max_for_second_trial: 1.
output_images_max_for_second_trial: 4.
output_directory_for_second_trial: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/.
v7.274_status: completed_success.
v7.274_output_images_count: 1.
v7.274_output_file: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg.
v7.275_human_review_status: completed.
v7.275_asset_status: accepted_candidate_with_minor_retouch.
v7.275_accepted_candidate: true.
v7.275_commercial_delivery_ready: false.
v7.275_memory_suitability: deferred.
prompt_v3_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v3.yaml.
third_minimal_generation_trial_authorized: true.
approved_prompt_package_for_third_trial: prompts/image_generation/product_still_life_matte_ceramic_mug_v3.yaml.
provider_calls_max_for_third_trial: 1.
generation_attempts_max_for_third_trial: 1.
output_images_max_for_third_trial: 4.
output_directory_for_third_trial: runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/.
v7.277_status: completed_success.
v7.277_output_images_count: 1.
v7.277_output_file: runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/native_doubao_1778688750417_0.jpg.
v7.278_human_review_status: completed.
v7.278_asset_status: needs_revision.
v7.278_accepted_candidate: false.
v7.278_commercial_delivery_ready: false.
v7.278_memory_suitability: deferred.
previous_best_candidate: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg.
v7.279_status: completed_remote_synced.
v7.279_selected_route: fourth_minimal_generation_trial.
v7.279_v3_failed_reason: handle attachment geometry regression.
v7.279_fourth_trial_goal: restore v2 composition while fixing handle geometry and preserving artifact control.
prompt_v4_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml.
fourth_minimal_generation_trial_authorized: true.
approved_prompt_package_for_fourth_trial: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml.
provider_calls_max_for_fourth_trial: 1.
generation_attempts_max_for_fourth_trial: 1.
output_images_max_for_fourth_trial: 4.
output_directory_for_fourth_trial: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/.
auto_retry_for_fourth_trial: false.
stop_after_generation_for_fourth_trial: true.
human_review_required_after_generation: true.
v7.281_status: completed_success.
v7.281_output_images_count: 1.
v7.281_output_file: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg.
v7.281_auto_retry_used: false.
v7.282_human_review_status: completed_remote_synced.
v7.282_asset_status: accepted_candidate_with_minor_retouch.
v7.282_accepted_candidate: true.
v7.282_commercial_delivery_ready: false.
v7.282_memory_suitability: deferred.
current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg.
v7.283_options_presented: keep_v4_and_stop_generation | final_retouch_planning_no_generation | fifth_minimal_generation_trial.
v7.283_recommended_option: keep_v4_and_stop_generation.
v7.283_secondary_safe_option: final_retouch_planning_no_generation.
v7.283_fifth_trial_recommendation: low_to_medium_requires_new_explicit_human_authorization.
v7.283_human_decision_required_before_next_generation: true.
v7.284_evidence_package_created: true.
accepted_candidate_evidence_package_ref: docs/accepted_candidate_evidence_package_matte_ceramic_mug_v1.md.
v7.284_generation_stopped: true.
v7.284_output_image_added_to_git: false.
v7.284_accepted_samples_written: false.
v7.284_memory_write_performed: false.
v7.285_product_loop_closed: true.
v7.285_real_generation_chain_completed: true.
v7.285_total_real_generation_trials: 4.
v7.285_prompt_evolution_analysis_created: true.
v7.285_review_dataset_summary_created: true.
v7.285_v8_route_options_created: true.
v7.285_recommended_default_route: final_retouch_planning.
v8_route_selection_required: true.
v8_route_selection_completed: true.
selected_v8_route: final_retouch_planning.
selected_v8_route_zh: 最终修图规划.
v8_next_phase: v8_001_final_retouch_planning_gate.
v8_next_phase_auto_execution_allowed: false.
v8_001_final_retouch_plan_created: true.
final_retouch_plan_ref: docs/final_retouch_plan_matte_ceramic_mug_v4.md.
v8_001_fifth_generation_started: false.
v8_001_output_image_added_to_git: false.
v8_001_memory_write_performed: false.
v8_001_production_candidate_002_started: false.
v8_002_retouch_acceptance_criteria_created: true.
retouch_acceptance_criteria_ref: docs/retouch_acceptance_criteria_matte_ceramic_mug_v4.md.
v8_002_delivery_package_spec_created: true.
delivery_package_spec_ref: docs/delivery_package_spec_matte_ceramic_mug_v4.md.
v8_002_commercial_delivery_ready: false.
v8_002_memory_suitability: deferred.
v8_002_fifth_generation_started: false.
v8_002_output_image_added_to_git: false.
v8_002_memory_write_performed: false.
v8_002_production_candidate_002_started: false.
v8_003_retouch_handoff_package_created: true.
retouch_handoff_package_ref: docs/retouch_handoff_package_matte_ceramic_mug_v4.md.
v8_003_delivery_package_spec_linked: true.
v8_003_retouch_acceptance_criteria_linked: true.
v8_003_commercial_delivery_ready: false.
v8_003_memory_suitability: deferred.
v8_003_fifth_generation_started: false.
v8_003_output_image_added_to_git: false.
v8_003_memory_write_performed: false.
v8_003_production_candidate_002_started: false.
v8_004_final_retouch_route_closed: true.
v8_004_route_closeout_ref: docs/v8_final_retouch_route_closeout_matte_ceramic_mug_v4.md.
v8_004_final_retouch_plan_created: true.
v8_004_retouch_acceptance_criteria_created: true.
v8_004_delivery_package_spec_created: true.
v8_004_retouch_handoff_package_created: true.
v8_004_commercial_delivery_ready: false.
v8_004_memory_suitability: deferred.
v8_004_fifth_generation_started: false.
v8_004_output_image_added_to_git: false.
v8_004_memory_write_performed: false.
v8_004_production_candidate_002_started: false.
v8_005_next_route_decision_options_created: true.
v8_005_route_options_ref: docs/v8_next_route_decision_options.md.
v8_005_routes_presented: multi_product_prompt_package_expansion | review_console_productization_planning | memory_planning_package | production_readiness_planning | human_retouch_execution_outside_codex.
v8_005_recommended_low_risk_route: multi_product_prompt_package_expansion.
v8_005_human_route_selection_required: true.
v8_005_automatic_next_route_execution_allowed: false.
v8_005_fifth_generation_started: false.
v8_005_output_image_added_to_git: false.
v8_005_memory_write_performed: false.
v8_005_production_candidate_002_started: false.
v8_003a_A4_8_safe_project_operator_rail_created: true.
v8_003a_A4_8_safe_project_operator_rail_zh: 安全项目运营轨.
v8_003a_A4_8_is_not_A5: true.
v8_003a_provider_contact_allowed: false.
v8_003a_image_generation_allowed: false.
v8_003a_memory_write_allowed: false.
v8_003a_runtime_execution_allowed: false.
v8_003b_A4_8_rule_intake_smoke_test_passed: true.
v8_006_A4_8_state_and_rule_intake_review_passed: true.
v8_007_A4_8_mutation_live_run_docs_only_started: true.
v8_007_provider_contact_allowed: false.
v8_007_image_generation_allowed: false.
v8_007_memory_write_allowed: false.
v8_007_runtime_execution_allowed: false.
v8_008_controlled_failure_induced: true.
v8_008_failure_type: git_diff_check_trailing_whitespace.
v8_008_committed_failure_state: false.
v8_008_pushed_failure_state: false.
v8_008_fixed_before_commit: true.
v8_008_recovery_validation_passed: true.
v8_009_A4_8_hard_stop_probe_passed: true.
v8_010_A4_8_comprehensive_validation_passed: true.
A4_8_validated: true.
A4_8_is_not_A5: true.
v8_011_selected_route: multi_product_prompt_package_expansion.
v8_011_selected_route_zh: 多商品 prompt package 扩展.
v8_011_route_B_changes_v7_accepted_candidate_status: false.
v8_012_selected_second_product: multi_color_mesh_sports_visor.
v8_012_second_product_brief_created: true.
v8_012_second_product_brief_ref: briefs/product_brief_multi_color_mesh_sports_visor_v1.md.
v8_013_second_product_prompt_package_created: true.
v8_013_second_product_prompt_package_ref: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml.
v8_014_second_product_prompt_static_review_completed: true.
v8_014_second_product_prompt_static_review_result: pass_with_minor_watch_items.
Route_B_initial_docs_sequence_completed: true.
A5_execution_allowed_for_v8_016_once: true.
provider_contact_allowed_for_v8_016_once: true.
approved_second_product_for_v8_016: multi_color_mesh_sports_visor.
approved_prompt_package_for_v8_016: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml.
approved_output_directory_for_v8_016: runs/real_generation/v8_016_multi_color_mesh_sports_visor_trial/.
provider_calls_max_for_v8_016: 1.
generation_attempts_max_for_v8_016: 1.
output_images_max_for_v8_016: 1.
auto_retry_for_v8_016: false.
v8_016_execution_status: failed_http_400.
v8_016_provider_calls_used: 1.
v8_016_generation_attempts_used: 1.
v8_016_image_created: false.
v8_016_output_images_count: 0.
v8_016_output_directory_created: false.
v8_016_no_image_to_review: true.
v8_016_retry_allowed_now: false.
v8_017_failed_trial_review_completed: true.
v8_018_prompt_runner_mapping_fix_completed: true.
v8_018_canonical_prompt_field_added_or_confirmed: true.
v8_018_positive_prompt_mapping_resolved: true.
v8_018_runner_prompt_field: prompt.
v8_019_second_trial_authorization_decision_completed: true.
v8_019_options_presented: authorize_second_minimal_real_generation_trial | more_static_runner_payload_review | stop_second_product_real_generation_route.
v8_019_recommended_option: authorize_second_minimal_real_generation_trial.
v8_019_human_decision_required: true.
v8_020_human_selected_option: authorize_second_minimal_real_generation_trial.
v8_020_this_is_new_A5_authorization: true.
v8_020_previous_v8_015_authorization_consumed: true.
v8_020_approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml.
v8_020_output_directory: runs/real_generation/v8_021_multi_color_mesh_sports_visor_second_trial/.
v8_020_provider_calls_max: 1.
v8_020_generation_attempts_max: 1.
v8_020_output_images_max: 1.
v8_021_execution_status: success.
v8_021_output_file: runs/real_generation/v8_021_multi_color_mesh_sports_visor_second_trial/native_doubao_1778733554203_0.jpg.
v8_021_output_images_count: 1.
v8_021_output_added_to_git: false.
v8_022_asset_status: needs_revision.
v8_022_accepted_candidate: false.
v8_022_commercial_delivery_ready: false.
v8_022_memory_suitability: deferred.
v8_022_reviewable_sample: true.
v8_023_prompt_revision_plan_created: true.
v8_023_prompt_v2_created: true.
v8_023_prompt_v2_ref: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml.
v8_023_provider_contact: false.
v8_023_image_generation: false.
v8_024_prompt_v2_static_review_completed: true.
v8_024_prompt_v2_static_review_result: pass_ready_for_authorization_decision.
v8_024_provider_contact: false.
v8_024_image_generation: false.
v8_025_options_presented: authorize_next_minimal_real_generation_trial | more_static_prompt_payload_review | stop_route_B_generation_here.
v8_025_recommended_option: authorize_next_minimal_real_generation_trial.
v8_025_human_decision_required: true.
v8_025_A5_authorization_created: false.
v8_025_provider_contact: false.
v8_025_image_generation: false.
v8_026_human_selected_option: authorize_next_minimal_real_generation_trial.
v8_026_this_is_new_A5_authorization: true.
v8_026_approved_product: multi_color_mesh_sports_visor.
v8_026_approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml.
v8_026_output_directory: runs/real_generation/v8_027_multi_color_mesh_sports_visor_v2_trial/.
v8_026_provider_calls_max: 1.
v8_026_generation_attempts_max: 1.
v8_026_output_images_max: 1.
v8_026_auto_retry: false.
v8_026_provider_contact: false.
v8_026_image_generation: false.
Recommended next: v8_027_second_product_prompt_v2_minimal_generation_trial_execution（执行一次已授权 prompt v2 最小真实生成，然后停止）.
auto_execution_allowed_for_next: true_after_v8_026_commit_and_push.
Master plan index: PROJECT_MASTER_PLAN.md.
Historical baseline: v1.0 true-loop closeout candidate + v10.28 DailyNote canonical location guard + Runtime Review sustained autopilot chain complete (9A→10C→final checkpoint, 7/7) + Smart Commander portable support model complete (v7.199→v7.203) + Static Review Console mockup quality stop reached (v7.205→v7.212) + Provider fingerprint preparation complete/inactive (v7.214→v7.216) + Release readiness delta quality stop (v7.219)
```

当前工作分支：

```text
master tracking origin/master
```

已经完成：

- MVP-A 无执行闭环的文档、schema、样例和角色规则。
- Review Console 静态原型。
- VCPChat 接入设计边界。
- Adapter dry-run planning。
- v0.3 manifest recon / authorization gate / sanitized read preflight 文档。
- v0.3 authorization planning closeout。
- 仓库内 AgentImageLabAdapter 草案 manifest 的 Phase C 脱敏审查记录。
- Phase D 项目内 Adapter dry-run lab 最小实现。
- v0.4 VCPToolBox 导出级 dry-run Adapter 候选文件。
- v0.5 VCPToolBox Adapter-only dry-run 安装验证记录。
- v0.6 单一真实生图插件 manifest 只读脱敏审查记录。
- v0.7 Gatekeeper 风险边界、Review Console 人工审批前置记录和真实执行前确认表。
- v0.7 独立真实执行授权门和 Photo Studio OS 0 调用 dry-run rehearsal。
- v0.8 release readiness 报告、安装操作指南和最终验收报告。
- v0.9 post-execution checkpoint、retry authorization gate、retry 真实执行记录和候选插件扫描。
- v0.10 GPTImageGen 脱敏失败记录。
- v0.10 DoubaoGen model-explicit retry 真实执行记录，已由用户人工接受进入下一阶段。
- v1.0 true-loop closeout 记录和最终验收材料。
- v3.9 Review Console runtime prototype 共享 guard 抽取，并已形成 baseline tag。
- v4.0 runtime smoke test 加固：从 `index.html` 读取真实脚本顺序，并验证共享 guard API。
- v4.1 runtime guard unit harness：直接验证共享 guard 的拒绝策略、默认值和审批规则。
- v4.2 runtime validation suite：聚合 runtime 原型语法检查、guard unit 和 smoke test。
- v4.3 guarded autopilot overlay：安装 `.agent_board`、overlay 规则和本地校验 helper，且保持不覆盖根 `AGENTS.md`。
- v4.4 agent board state validation：机器检查 `.agent_board` 必需文件、硬停止门、handoff 和验证快照。
- v4.5 local checkpoint readiness：机器检查 v4.0-v4.5 本地 checkpoint、overlay、agent board、验证脚本和 commit/tag/push 门。
- v4.6 local commit scope manifest：机器检查 v4.0-v4.6 本地 changed-file allowlist、staging 状态和 commit/tag/push 门。
- v4.7 post-push state reconciliation：记录 v4.6 pushed baseline，并校正 `.agent_board` 续跑状态。
- v4.8 v4 index consistency validation：机器检查 v4.x 阶段索引一致性，覆盖 README、MANIFEST、roadmap、checklist、release notes、schema、脚本和 `.agent_board`。
- v4.9 local tag push-readiness preflight：记录本地 v4.8 commit/tag 已就位，远端 push 仍需单独授权。
- v5.0 post-merge delivery readiness index：记录 PR #1 已合并、本地 `master` 已同步到 `origin/master`，并把交付验收入口机器可查化。
- v5.1 runtime delivery surface validation：机器检查 Review Console runtime prototype 的本地交付面、脚本顺序、DOM surface、host ack 和无外部副作用边界。
- v5.2 adapter delivery surface validation：机器检查 Adapter dry-run lab 和 VCPToolBox 导出级 dry-run 包的 manifest、stdio、fixture、README 边界和 no-execution guard。
- v5.3 review console adapter handoff validation：机器检查 Adapter dry-run accepted fixture 能以 no-execution handoff 草案进入 Review Console static prototype。
- v5.4 local sync readiness preflight：机器检查本地 `master` 相对 `origin/master` 的领先提交链，并保留 push/tag/PR/release 独立授权门。
- v5.5 post-commit reconciliation checkpoint：记录 v5.4 已落成本地 commit `a2ae539`，并把当前本地领先提交链更新为 4 个提交。
- v5.6 v5 index consistency validation：机器检查 v5.0-v5.6 阶段文档、schema、脚本、顶层索引和 `.agent_board` 一致性。
- v5.7 local batch commit-readiness preflight：只读检查当前本地未提交批次的 tracked 修改、新文件、staged 状态和版本动作授权门。
- v5.8 handoff freshness validation：机器检查 `.agent_board` 续跑材料是否共同指向当前阶段，并保留硬停止门、远端动作授权门和 no-execution 边界。
- v5.9 expanded v5 index consistency validation：把 v5 index consistency validation 覆盖范围扩展到 v5.0-v5.9。
- v5.10 local true-loop candidate delivery closeout：收束本地 v1.0 真实闭环候选交付，记录 v5.9 本地提交、审查修复和交付授权边界。
- v5.11 post-merge reconciliation：记录 PR #2 已合并、本地 `master` 已同步到 `origin/master`、v5.10 交付 tag 已推送，并把 `.agent_board` 切换到合并后状态。
- v5.12 release candidate readiness：把真实闭环候选整理成最终交付候选包，并机器检查 release readiness、final acceptance、true-loop closeout、GitHub intake 和安全边界。
- v7.40 local A4/A5 autonomy mode alignment：把项目默认本地自动化提升为 `A4 — Sustained Local Autopilot`，并把 `A5 — Autonomous Production Execution` 固化为必须依赖独立授权包的真实生产执行模式。
- v7.41 external remote-debug verification script creation record：把原 v7.39 指向的脚本创建记录重新落位，确认真实 remote-debug 脚本仍未创建，并把后续创建授权包要求机器化。
- v7.42 external remote-debug verification script creation authorization package：把未来创建真实 remote-debug 脚本所需的未激活授权包模板、禁止动作、验证要求、回滚路径和停止条件固化下来。
- v7.43 external remote-debug verification script creation execution record：在明确授权下创建 dry-run-only remote-debug smoke 脚本，并记录脚本未运行、VCPChat 未启动、CDP 未访问。
- v7.44 remote-debug script run and VCPChat launch record：在明确授权下运行 dry-run-only 脚本并启动 VCPChat，同时记录 CDP 未访问、bridge 未调用。
- v7.45 CDP read-only attempt record：在明确授权下尝试本机 CDP 只读访问；当前 VCPChat 未暴露可用 CDP endpoint，Runtime.evaluate 未执行。
- v7.46 remote-debug relaunch runtime verification record：在明确授权下关闭旧 VCPChat/Electron 进程，以 remote-debug 端口重启 VCPChat，读取 CDP targets，并执行一次只读 Runtime.evaluate surface 检查；bridge 方法未调用。
- v10.0 A5 end-to-end activation package readiness：接收单批 A5 授权包并执行 preflight；因外部 VCPChat / VCPToolBox 工作树不干净而停止，真实生产步骤未启动。
- v10.1 A5 resume after external worktree reconciliation：记录用户已报告外部目标工作树干净，并固化恢复前必须重新执行 A5 preflight 的接续条件；本阶段未执行真实生产步骤。
- v10.2 A5 bridge smoke blocked record：重新执行 A5 preflight 并启动 remote-debug 运行时；preflight clean，但当前 VCPChat 未暴露 `imageLabReview` bridge，`cancel` 未调用，真实生产链路停止。
- v10.3 A5 bridge integration smoke record：在授权 VCPChat 文件集中添加 no-write `imageLabReview` bridge，严格 allowlist-only smoke 中 `cancel/loadSession/previewDraft` 通过；因初始 `submitDraft` rejected probe 偏差，DoubaoGen 继续执行前需要人工复核。
- v10.4 A5 DoubaoGen single generation rejected asset record：人工复核后继续 A5 生产链路，DoubaoGen 实际调用 1 次并生成 1 个资产；自动审片发现可读文字和类似 logo/标记，资产拒收，DailyNote / VCP memory 写入被阻断。
- v10.5 A5 DoubaoGen no-text retry rejected asset record：更强无文字约束下执行一次 DoubaoGen 重试，实际调用 1 次并生成 1 个资产；自动审片发现人物/脸、可读文字、logo/品牌标识和设备品牌标记，资产拒收，记忆写入继续阻断。
- v10.6 A5 prompt failure analysis and safer strategy：归档 v10.4 / v10.5 prompt 失败原因，明确 v10.5 prompt 模板由 agent 给出且设计失败；下一次真实调用前必须先展示更安全的正向静物 prompt 草案。
- v10.7 A5 safer prompt review package：把候选 prompt 收束为 `a5_positive_still_life_prompt_v1` 并执行触发词扫描；本阶段不真实生图，下一步必须由用户确认 prompt 并单独授权。
- v10.8 A5 positive still-life generation preflight gate：把 `a5_positive_still_life_prompt_v1` 锁定为下一次真实生成前的候选 prompt，并把 prompt approval、单独授权字段、输出目录、回滚和 no-execution guard 机器化；本阶段不真实生图。
- v10.9 A5 positive still-life generation rejected asset record：在短批准模板和私有 ignored PluginDir 绑定通过 preflight 后执行一次 DoubaoGen 真实生成；实际调用 1 次并生成 1 个资产，但本地审片发现人物/脸和 prompt 主题偏离，资产拒收，记忆写入继续阻断。
- v10.10 A5 prompt handoff diagnostic preflight：把 v10.9 失败原因拆成模型遵循失败和插件请求传递失败两个待诊断方向，准备无生图、0 插件调用的脱敏传参诊断门；本阶段不读取 PluginDir / `config.env`，不调用插件/API，不创建图片。
- v10.11 A5 prompt handoff diagnostic result：在用户批准无生图传参诊断后，确认锁定 prompt hash 匹配、本地 runner payload prompt 来源为 InputReference，且没有执行插件/API/图片；provider 侧请求仍未观测。
- v10.12 A5 provider-side prompt fingerprint capture authorization package：准备 provider-side echo / sanitized request capture 授权包，目标是只验证 provider 侧收到的 prompt 指纹；当前为未激活授权包，不执行 provider echo、不调用插件/API、不创建图片。
- v10.26 real DailyNote/VCP memory write closeout：记录 v10.25 使用 DailyNoteWrite 完成一次真实写入，actual_write_calls=1，保存文件名/sha256 已脱敏记录，单次授权已消耗。
- v10.27 DailyNoteWrite root path correction：修正未来 DailyNoteWrite 写入根目录分类，从 `plugin_dir_dailynote` 改为 `vcp_root_dailynote`，并通过 no-write recomputation 验证。
- v10.28 DailyNote canonical location guard：固化后续 DailyNote 写入成功判定，要求 canonical file 存在和 hash 匹配，插件 `success` 不能单独判定完成。
- v7.199-v7.203 Smart Commander 支持层收束：AGENTS 精简固化、portable protocol、reuse package index、external adoption readiness 和 portable release candidate 已完成；该支线只改善本地 docs-only 指挥/审查/提交模型，不授权 A5、runtime、plugin/provider、image 或 memory，不再作为主线继续调教。
- v7.205 Static Review Console mockup spec：回到产品主线，完成静态 Review Console mockup 的 screen inventory、region specification、static data contract、interaction specification、review states 和 no-execution 边界；仍不创建 renderer/preload/IPC/runtime 代码。
- v7.206 Static Review Console mockup file：创建离线 standalone HTML mockup `review_console/static_mockups/v7_206_static_review_console_mockup.html`；仅供本地视觉检查，不引用外部资产或脚本，不导入 runtime，不接 VCPChat/VCPToolBox。
- v7.208-v7.209 Static mockup decision and cleanup：根据只读审查选择 product copy cleanup + light visual polish，补齐 generation_result_recorded、closeout_ready_or_blocked、asset_rejected 可见状态和 disabled action reason；仍不进入 runtime。
- v7.211-v7.212 Static mockup accessibility review and patch：完成静态 accessibility/readability 审查和小补丁，关联 disabled action reason，改善 static contract grouping semantics，静态 mockup 达到 quality stop。
- v7.214-v7.216 Provider fingerprint preparation：static mockup 后重新审查主线 backlog，选择 v10.12 provider-side prompt fingerprint capture 作为下一高价值准备项；完成 readiness review 和 activation briefing，但明确停止在 inactive package，不进入 A5/provider/plugin/image/memory。
- v7.219 Release readiness delta：说明 v1.0 release readiness baseline 与当前 post-v7.217 状态的差异；当前新增的是治理、静态审片台清晰度和 provider diagnostic 准备，不是 release/tag/A5 授权。
- Runtime Review follow-up requirements audit：梳理审片台下一步本地交付需求，优先处理 accepted candidate delivery package draft 和 memory completion state split。
- Runtime Review follow-up Batch 2A/2C：在 runtime prototype 中实现 accepted candidate delivery package draft 和 human override traceability draft，并把 no-write guard、UI、session export、smoke 和 delivery surface validation 同步。
- Runtime Review follow-up Batch 2B：在 runtime prototype 中实现 memory completion state split，把写入请求、写入授权、真实执行、canonical location 校验、hash 匹配和 `plugin_success_sufficient=false` 拆开。
- Runtime Review long task delivery plan：把后续长任务拆成 Batch 3A 到 Batch 8A，并明确 A4 本地任务、A5/真实写入/远端版本动作授权门、验收标准和停止条件。
- Runtime Review Batch 3A/3B/3C：在 runtime prototype 中实现 inactive authorization capsules、runtime review state convergence 和 local commit scope plan；所有新增面仍保持 no-execution、no-stage、no-version-action。
- Runtime Review Batch 4A：在 runtime prototype 中实现 bridge mock roundtrip candidate，用项目内 `loadSession` / `previewDraft` mock 证明 no-write 交接，`submitDraft` 和真实 CDP/bridge 仍禁止。
- Runtime Review Batch 4B/5A/6A：在 runtime prototype 中实现真实 bridge 授权包草案、prompt reliability/model lock 草案和 memory write completion candidate；所有新增面仍保持 no-execution、no-plugin、no-memory-write。
- Runtime Review Batch 5B/6B/7A：在 runtime prototype 中实现真实重试授权门、真实记忆写入授权包和 no-binary 资产归档候选；所有新增面仍保持 no-execution、no-plugin-call、no-memory-write、no-image-create。
- Runtime Review Batch 8A：把 Runtime Review follow-up 累积工作收束为本地 release-candidate proposal 和提交范围清单；仍不执行 commit/tag/push/PR/release。
- Runtime Review Batch 8A post-merge checkpoint：记录 PR #6 已合并，本地 `master` 已同步到 `origin/master` 的 `563ccc4`，并确认 legacy `runtime_review_session_v1` import compatibility fix 已进入主线。
- Runtime Review Batch 8B vNext RC acceptance：把 post-merge checkpoint 上的当前本地 master 收束成下一轮 release-candidate 接受基线；不触发版本动作。
- Runtime Review Batch 8C final acceptance summary：把 8A / 8B 的收束结果归并为最终可读 acceptance 摘要；不触发版本动作。
- Runtime Review Batch 8D sustained autopilot task plan：把后续任务拆成默认自动队列和条件自动队列；A4/A4.5 本地任务满足条件自动执行，真实执行、外部读取、记忆写入和版本动作只有在具体 active authorization package 与 preflight 通过后自动执行到授权上限。
- Runtime Review Batch 9A state freshness index：把当前阶段统一到 `docs/226_runtime_review_batch_9a_state_freshness_index.md`，并通过 `scripts/validate_runtime_review_batch_9a_state_freshness.js` 检查 README、roadmap、manifest、release notes、validation checklist 和 `.agent_board` 是否一致。
- Runtime Review Batch 9C operator runbook and resume capsule：新增 `docs/227_runtime_review_batch_9c_operator_runbook_and_resume_capsule.md`，把当前阶段、安全下一步、硬停止门、验证命令和版本动作状态收束成五分钟续跑入口。
- Runtime Review Batch 9B runtime session compatibility matrix：新增 `docs/228_runtime_review_batch_9b_runtime_session_compatibility_matrix.md`、legacy/current 两个 `runtime_review_session_v1` fixture 和 validator，固定旧版缺省字段与当前 draft-rich guard 的兼容规则。
- Runtime Review Batch 10B end-to-end dry-run replay index：新增 `docs/229_runtime_review_batch_10b_end_to_end_dry_run_replay_index.md` 和 `scripts/validate_runtime_review_batch_10b_dry_run_replay_index.js`，把 Adapter dry-run → Review Console → mock bridge → session export 的完整回放路径做成可索引、可校验链。
- Runtime Review Batch 10A release-candidate acceptance matrix：新增 `docs/230_runtime_review_batch_10a_release_candidate_acceptance_matrix.md`，把 bridge、plugin、asset archive、memory lifecycle、runtime prototype、validator suite、operator docs 和 release readiness 八个领域收束成结构化验收矩阵。
- Runtime Review Batch 10C future A5 authorization package consolidation：新增 `docs/231_runtime_review_batch_10c_future_a5_authorization_package_consolidation.md`，把 bridge、plugin、asset review、DailyNote/VCP memory、rollback、forbidden outputs 和 version actions 七个领域的 preflight 字段合并到一个可填入模板。
- Runtime Review final local checkpoint — sustained autopilot chain closeout：新增 `docs/232_runtime_review_final_local_checkpoint_sustained_autopilot_chain_closeout.md`，汇总 7 个 batch 的完整交付物、worktree 状态和 commit/push 就绪条件。
- Phase E VCPChat subwindow integration preparation：新增 `review_console/phase_e_vcpchat_subwindow_integration_task_plan.md`、`review_console/phase_e_ipc_contract_draft.md`、`review_console/phase_e_security_acceptance_checklist.md`（77 项检查），完成子窗口接入任务书、IPC 契约和安全验收清单。
- Phase F MVP-B controlled real execution：已完成 F1→F8 全流程。2 次 DoubaoGen 人像生图（双图 accepted_candidate），Bridge smoke 通过（VCPChat v4.4.2，4 通道 0 side effects）。收束记录：`review_console/phase_f_f8_closeout_record.md`
- Tag and version strategy：新增 `docs/233_tag_and_version_strategy.md`，定义 tag 命名规范、版本号策略和 release 发布条件。
- v6.0 Product Runtime Kickoff：Task Panel、Asset Index、Session Store 三层叠加到 Review Console。`docs/236_v6_0_product_runtime_kickoff.md`
- v6.1 Task Panel Interaction：Task Panel 实现可交互表单（6 inputs/selects），runtime_guard 校验，smoke test 覆盖。`docs/237_v6_1_task_panel_interaction.md`
- v6.2 Asset Index Interaction：Asset Index 从只读展示变成可本地编辑、筛选、索引的 draft-only 资产索引面板。`docs/238_v6_2_asset_index_interaction.md`
- v6.3 Session Store Interaction：Session Store 从只读展示变成可交互草案管理面板——current_session 展示、linked_task_id/asset_refs 输入、import_preview 5 状态选择、restore_candidate 切换、session_list 草案。闭合 Task/Asset/Session 三角底座。`docs/239_v6_3_session_store_interaction.md`
- v6.4 Memory Queue Interaction：记忆草案队列——approval_status 切换、reviewer_role、should_write_to_vcp 意图、block/reject reason、队列计数。`docs/240_v6_4_memory_queue_interaction.md`
- v6.5 Review Console Product Shell：全产品壳布局（左栏→顶栏→工作区→裁决栏→底栏），审片驾驶舱升级。`docs/241_v6_5_review_console_product_shell.md`
- v6.6 Product Shell QA + Visual Polish：v6.5 产品壳质量复查、布局修整、可读性优化、视觉一致性、裁决栏验收加固。`docs/242_v6_6_product_shell_qa_visual_polish.md`
- v6.7 Product Runtime Final Acceptance Baseline：把 v6.1～v6.6 收束成 v6 Product Runtime Baseline。`docs/243_v6_7_product_runtime_final_acceptance.md`，validator `scripts/validate_v6_7_product_runtime_final_acceptance.js`（33 checks）
- v6.8 Plugin Dashboard Draft Surface：Plugin Selector、Parameter Mapper、Dry-run Toggle、Dispatch Status 四个区块和 dispatch_plan_draft 数据结构。`docs/245_v6_8a_plugin_dashboard_draft_surface.md`，validator `scripts/validate_v6_8_plugin_dashboard.js`（30 checks）
- v6.8B Plugin Dashboard Guard Hardening：runtime_guard 新增 `v6DispatchPlanIsSafe()`。`docs/246_v6_8b_plugin_dashboard_guard_hardening.md`，validator `scripts/validate_v6_8b_plugin_dashboard_guard_hardening.js`（18 checks）
- v6.9 Release Panel Planning：发布面板规划书。`docs/247_v6_9_release_panel_plan.md`，validator `scripts/validate_v6_9_release_panel_plan.js`（15 checks）
- v6.9A Release Panel Draft Surface：Release Panel 面板实现。`docs/248_v6_9a_release_panel_draft_surface.md`，validator `scripts/validate_v6_9a_release_panel_draft_surface.js`（17 checks）
- v6.9B Release Panel Guard Hardening：runtime_guard 新增 `v6ReleaseReadinessIsSafe()`。`docs/249_v6_9b_release_panel_guard_hardening.md`，validator `scripts/validate_v6_9b_release_panel_guard_hardening.js`（12 checks）
- v6.10 Product Runtime RC Readiness Matrix：全模块验收矩阵。`docs/250_v6_10_product_runtime_rc_readiness_matrix.md`，validator `scripts/validate_v6_10_product_runtime_rc_readiness_matrix.js`（8 checks）
- Validator Quality Gate：v6 validators 质量 meta 检查。`docs/251_v6_validator_quality_gate.md`，validator `scripts/validate_v6_validator_quality_gate.js`（8 checks）
- v6 Operator Runbook + Resume Capsule：运维手册与续跑胶囊。`docs/252_v6_product_runtime_operator_runbook.md` + `docs/253_v6_10_resume_capsule.md`，validator `scripts/validate_v6_operator_runbook_and_resume_capsule.js`（14 checks）
- v7.0 Real Production Landing Preflight：真实生产落地预案 + A5 授权包模板。`docs/254_v7_0_real_production_landing_preflight.md` + `docs/255_v7_0_a5_single_generation_authorization_template.md`，validator `scripts/validate_v7_0_real_production_landing_preflight.js`（20 checks）
- v7.1 Single Real Generation Controlled Run Package：单次真实生成受控运行包。`docs/256`，validator `validate_v7_1.js`（13 checks）
- v7.2 Generation Failure Taxonomy + Retry Policy：失败分类（11 类）+ 重试策略。`docs/257`，validator `validate_v7_2.js`（16 checks）
- v7.3 Asset Acceptance Gate：资产验收门 + gate checklist。`docs/258`，validator `validate_v7_3.js`（17 checks）
- v7.4 Memory Write Gate Package：记忆写入闸门（需独立 A5 授权）。`docs/259`，validator `validate_v7_4.js`（9 checks）
- v7.5 Production Run Dry Run Prep：生产运行 dry-run 准备 + A5 激活清单。`docs/260` + `docs/261`，validator `validate_v7_5.js`（24 checks）
- v7.6 Single Real Generation Activation Package：A5 激活包 + 操作员确认清单。`docs/262` + `docs/263`，validator `validate_v7_6.js`（25 checks）
- v7.7 Single Real Generation Activation Readiness Check：准备就绪确认。`docs/264`，validator `validate_v7_7.js`（12 checks）
- v7.8 A5 Template + Prompt Library Separation：提示词库（20 包）+ A5 统一模板。
- v7.9 Prompt Library + A5 Activation UX Polish：选择指南 `docs/266` + 中文 UX 优化。validator `validate_v7_9.js`（16 checks）
- v7.34 3-shot Stability Test Plan：3-shot 稳定性测试计划。`stability_tests/` + `docs/289` + validator `validate_v7_34.js`（51 checks）。plan_only, no-execution。
- 只读校验脚本 `scripts/validate_mvp.ps1`。

仍未完成：

- VCPChat 子窗口接入（Phase E 任务书已完成，Phase F Bridge smoke 已验证通过 VCPChat v4.4.2）。
- 后续 DailyNote / VCP 长期记忆写入仍需单独授权。
- 正式 release 发布仍需单独授权（tag 策略已定义：`docs/233_tag_and_version_strategy.md`）。
- 后续更多真实图片生成需新 A5 授权包（Phase F 已消耗 2/2 calls，双图 accepted）。
- version actions 需要匹配当前授权和 preflight；v7.224 只允许白名单 docs/status 文件的 commit + push。
- Product image A5 path 已进入 repeated quota/rate-limit stop；Native Doubao static syntax / sandbox 已硬化；v7.260 判断产品图纸面链路已进入 quality stop；v7.261 已提出四条路线；v7.262 已选择“项目内插件路线”进入纸面授权规划；v7.263 已起草项目内插件 A5 授权包但保持 draft / not_requested / execute_now=false；v7.264 已复核草案，结论为 pass_to_keep_inactive / activation blocked；v7.265 已把真正 A5 preflight 授权请求、prompt 包和输出目录固定下来；v7.268b 授权一次最小真实生成试跑；v7.269 成功生成 1 张 matte_ceramic_mug 图；v7.270 人工审片结论为 needs_revision；v7.271 已根据问题创建 prompt v2 修订计划和 v2 prompt package；v7.272 静态审查通过；v7.273 已由人工授权第二次最小真实生成试跑；v7.274 已用 v2 prompt 成功生成 1 张图；v7.275 人工审片结论为 accepted_candidate_with_minor_retouch；v7.276 已创建 v3 小幅精修 prompt 并记录第三次最小试跑授权边界；v7.277 已成功生成 1 张 v3 输出；v7.278 人工审片结论为 needs_revision，当前最佳候选回到 v2；v7.279 已选择一次第四次最小试跑；v7.280 已创建 v4 prompt 并封存第四次最小试跑授权边界；v7.281 已成功生成 1 张 v4 输出；v7.282 人工审片结论为 accepted_candidate_with_minor_retouch，当前最佳候选为 v4。

## 阶段路线

### Phase A：项目基线收束

目标：让仓库自身可被复查、校验和交付。

必须完成：

- `scripts/validate_mvp.ps1` 通过。
- `node --check review_console/static_prototype/app.js` 通过。
- `node --check review_console/static_prototype/mock_data.js` 通过。
- `git diff --check` 通过。
- README 指向路线图、验收标准和校验脚本。
- `AGENTS.md` 不写死本地解压路径。

禁止：

- 调用 API。
- 调用 VCP 插件。
- 写 DailyNote。
- 写图片文件。
- 修改 VCPToolBox / VCPChat。

### Phase B：v0.3 manifest 读取授权闭环

目标：完成真实 manifest 读取前的授权记录链，但不读取 manifest。

必须完成：

- 明确唯一候选 manifest 的脱敏引用格式。
- 明确读取方式必须只读。
- 明确允许摘录字段和禁止字段。
- 明确 Gatekeeper、Review Console、Archivist、ImageLab_Master 的审批顺序。
- 所有样例保持 `source_authorized=false`、`source_read_performed=false`、`real_manifest_read=false`。

进入下一阶段的条件：

- 用户单独授权读取一个候选 manifest。
- 授权中必须写明读取对象、读取方式、可摘录字段、禁止字段和拒绝条件。

### Phase C：单一 manifest 脱敏读取

目标：在独立授权下，只读取一个候选 manifest，并只输出中文脱敏摘要。

进入 Phase C 前必须先使用 `integrations/vcp/phase_c_manifest_sanitized_read_contract.md` 形成独立授权申请。没有唯一候选和用户明确授权时，只允许维护授权模板，不得读取真实 manifest。

当前已完成一次仓库内草案 manifest 的授权脱敏读取，记录位于 `integrations/vcp/phase_c_manifest_sanitized_review_record.md`。该记录只允许进入 Phase D dry-run 设计评估，不代表真实插件选择、dry-run 已执行或真实执行授权。

v0.6 已在用户授权下完成一次单一真实生图插件 manifest 的只读脱敏审查，记录位于 `integrations/vcp/v0_6_real_plugin_manifest_sanitized_review.md`。该记录可把候选推进到 `manifest_reviewed_safe`，但不代表 dry-run 已完成、插件已选择或真实执行已授权。

允许输出：

- 脱敏插件显示名摘要。
- 命令集合中文摘要。
- 输入输出模式中文摘要。
- 权限风险中文摘要。
- Gatekeeper 需要复查的风险点。

禁止输出：

- raw manifest 原文。
- API key、token、cookie、密码。
- endpoint、webhook、数据库地址原文。
- 私密路径。
- 客户隐私或客户未公开信息。
- 真实插件输出。
- 真实运行日志。

完成标准：

- 形成 manifest review record。
- 能力矩阵可从 `pending_manifest_review` 推进到 `manifest_reviewed_safe` 或 `rejected`。
- 不进入 `dry_run_checked`、`tested` 或 `execution_ready`。

### Phase D：Adapter dry-run 最小实现

目标：实现一个只接受 dry-run 输入、只返回草案对象的最小 Adapter 骨架。

Phase D 的实现边界以 `integrations/vcp/phase_d_adapter_dry_run_minimal_contract.md` 为准。未获得真实执行授权前，不得在 `exports/vcptoolbox/Plugin/AgentImageLabAdapter/` 中创建 `index.js` 或任何真实 VCP 插件执行入口。

当前已有项目内实验实现 `adapter_dry_run_lab/adapter_dry_run.js`，只读 JSON fixture 并向 stdout 输出 dry-run 草案；它不是 VCP 插件，不写文件、不调用插件、不调用 API。

v0.5 已在用户授权下把 `exports/vcptoolbox/Plugin/AgentImageLabAdapter/` 的 Adapter-only dry-run 包安装到 VCPToolBox 预发布候选工作线中验证，记录位于 `integrations/vcp/v0_5_adapter_install_verification.md`。该验证只证明 `dry_run` 可返回草案，不代表真实插件选择或真实执行授权。

必须保持：

```yaml
selected_plugin: null
max_plugin_calls: 0
external_api_allowed: false
execution_blocked: true
daily_note_called: false
```

必须完成：

- 输入字段校验。
- 敏感字段拒绝。
- `vcp_task_envelope` 到 `vcp_dispatch_plan` 草案转换。
- Gatekeeper handoff 草案。
- Review Console handoff 草案。
- 中文脱敏 audit summary。

禁止：

- 调用真实插件。
- 调用外部 API。
- 写文件。
- 写 DailyNote。
- 保存图片。

### Phase E：Review Console 集成准备

目标：把静态原型升级为可嵌入 VCPChat 的设计实现准备，但仍不改真实 VCPChat。

必须完成：

- 明确输入对象只允许受控 `review_session` 草案。
- 明确输出只允许 `review_session_draft`、`image_case_draft`、`memory_delta_draft`。
- 保持 `contextIsolation=true`、`nodeIntegration=false`、IPC sender 校验。
- renderer 不直接写 DailyNote、不直接调用插件、不写磁盘。

完成标准：

- 形成 VCPChat 子窗口接入任务书。`review_console/phase_e_vcpchat_subwindow_integration_task_plan.md`
- 形成 IPC 契约草案。`review_console/phase_e_ipc_contract_draft.md`
- 形成安全验收清单。`review_console/phase_e_security_acceptance_checklist.md`（77 项检查）
- 三项交付物已在本 Phase E 完成；不修改真实 VCPChat，不创建真实 IPC handler。

### Phase F：MVP-B 受控真实执行 ✅ 已完成

状态：**已完成**（2026-05-08）。收束记录：`review_console/phase_f_f8_closeout_record.md`

执行摘要：
- F1 Preflight ✅ → F2 Bridge Smoke ✅ (VCPChat v4.4.2, 4 通道) → F3 Adapter ✅ → F4 生图 x2 ✅ (DoubaoGen, both success) → F5 审片 ✅ (双图 accepted) → F6 Memory Draft ✅ → F7 ⏭️ (memory write not authorized) → F8 Closeout ✅
- 2 张人像均 accepted_candidate，run_1 为首选。
- 授权包已消耗（2/2 calls），再次生图需新 A5 授权。
- Review Console 可人工评分和审批。
- 资产只保存路径引用和摘要，不把图片二进制写入长期记忆。
- memory_delta 只生成写入申请，不绕过审批写 DailyNote。

## 当前优先队列

1. v7.261_human_product_route_selection_request_gate 已把下一步路线选择交还给项目 owner。
2. v7.262_project_plugin_route_authorization_planning_gate 已把项目内插件路线规划到 NativeDoubaoImage 候选，但不执行。
3. v7.263_project_plugin_A5_authorization_package_draft_gate 已创建 AUTH-DRAFT-PROJECT-PLUGIN-20260513-001 草案；它不是 active A5。
4. v7.264_project_plugin_A5_authorization_draft_review_gate 已复核草案；草案可保留，但 activation blocked。
5. v7.265_true_A5_authorization_request_gate 已创建 AUTH-PENDING-PROJECT-PLUGIN-20260513-001 preflight-only 请求；它不是执行授权。
6. v7.268b_true_A5_minimal_real_generation_authorization_gate 授权 v7.269 仅执行一次最小真实生成试跑。
7. v7.269_minimal_real_generation_trial_execution 已成功生成 1 张真实样本，未 retry，未把图片加入 Git。
8. v7.270_human_review_of_real_outputs 已记录人工审片：needs_revision、accepted_candidate=false、commercial_delivery_ready=false、memory_suitability=deferred。
9. v7.271_prompt_revision_plan_from_first_real_output 已创建 prompt v2 修订计划和 `prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml`，不执行生成。
10. v7.273_second_minimal_generation_trial_authorization_gate 已由人工授权第二次最小真实生成试跑：v2 prompt、1 次 provider call、1 次 attempt、最多 4 张输出、no retry、生成后停止等待人工审片。
11. v7.274_second_minimal_generation_trial_execution 已成功生成 1 张 v2 输出并停止，图片未加入 Git。
12. v7.275_human_review_of_second_real_outputs 已记录人工审片：accepted_candidate_with_minor_retouch、accepted_candidate=true、commercial_delivery_ready=false、memory_suitability=deferred。
13. v7.276_prompt_v3_minor_refinement_and_third_trial_authorization_gate 已创建 `prompts/image_generation/product_still_life_matte_ceramic_mug_v3.yaml` 并记录第三次最小真实生成试跑授权边界。
14. v7.277_third_minimal_generation_trial_execution 已成功生成 1 张 v3 输出并停止，图片未加入 Git。
15. v7.278_human_review_of_third_real_outputs 已记录人工审片：needs_revision、accepted_candidate=false、commercial_delivery_ready=false、memory_suitability=deferred，当前最佳候选仍是 v2。
16. v7.279_best_candidate_selection_or_fourth_trial_decision_gate 已记录人工选择方案 B：继续一次第四次最小试跑，目标只修把手结构和产品可信度。
17. v7.280_prompt_v4_handle_geometry_refinement_authorization_gate 已创建 `prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml` 并记录第四次最小真实生成试跑授权边界。
18. v7.281_fourth_minimal_generation_trial_execution 已成功生成 1 张 v4 输出并停止，图片未加入 Git。
19. v7.282_human_review_of_fourth_real_outputs 已记录人工审片：accepted_candidate_with_minor_retouch、accepted_candidate=true、commercial_delivery_ready=false、memory_suitability=deferred，当前最佳候选为 v4。
20. v7.283_candidate_acceptance_or_final_retouch_decision_gate 已给出三个选项：保留 v4 并停止生成、只做 final retouch planning、或重新授权第五次极小试跑；默认推荐保留 v4 并停止生成。
21. v7.284_accepted_candidate_evidence_package 已封存 v4 accepted candidate 证据包；不复制、不移动、不 stage、不 commit `runs/` 输出图。
22. v7.285_v7_product_loop_closeout_and_v8_route_planning_gate 已封存 V7 第一条真实生成-审片-prompt 迭代闭环，形成 prompt 演进分析、review 数据集摘要和 V8 路线选项。
23. Batch 005、production_candidate_002、memory_write_path、DailyNote/VCP memory、retry、第五次生成、tag/release/deploy 仍未授权。
24. v8_route_selection_human_decision_gate 已正式选择 `final_retouch_planning`（最终修图规划），不进入第五次生成、不写 memory、不进入 production_candidate_002。
25. v8_001_final_retouch_planning_gate 已为 v4 当前最佳候选制定最终修图说明包；不生成新图、不写 memory、不复制或提交 `runs/` 输出图。
26. v8_002_retouch_acceptance_criteria_or_delivery_package_gate 已定义修图验收标准和交付包结构；commercial_delivery_ready 仍为 false，memory_suitability 仍为 deferred。
27. v8_003_delivery_package_closeout_or_retouch_handoff_gate 已创建 v4 修图交接包，串联修图计划、验收标准和交付包规格；不生成新图、不写 memory、不进入 production_candidate_002。
28. v8_004_final_retouch_route_closeout 已封存 V8 final retouch planning 路线结果；final retouch plan、retouch acceptance criteria、delivery package spec、retouch handoff package 均已创建或链接，commercial_delivery_ready 仍为 false，memory_suitability 仍为 deferred。
29. v8_005_next_route_decision_gate 已整理下一阶段路线选项：多产品 prompt package 扩展、Review Console 产品化规划、memory planning、production readiness planning、人工修图外部执行；推荐低风险候选为多产品 prompt package 扩展，但必须等待人工选择。
30. recommended next after v8.005: pending_human_route_selection（等待项目 owner 选择下一条 V8 路线）。
31. v8_003a_A4_8_safe_project_operator_rail_package 已作为治理/运营轨道回填创建：A4.8 = Safe Project Operator Rail / 安全项目运营轨；它可以自动推进低风险本地项目工作、验证、exact stage、commit、safe push，但不是 A5，不授权 provider contact、image generation、secret read、memory write、runtime、production_candidate_002、Batch 005、runs output commit、accepted_samples write、第五次生成、依赖变更、tag/release/deploy。
32. v8_003b_A4_8_rule_intake_smoke_test 已通过，只读验证 Codex 能正确复述 A4.8 权限和 hard stops。
33. v8_006_A4_8_state_and_rule_intake_review 已只读确认当前状态、规则源和综合测试计划。
34. v8_007_A4_8_mutation_live_run_docs_only 已验证 A4.8 能完成低风险 docs-only 修改、validation、exact stage、guarded commit 和 safe push。
35. v8_008_A4_8_controlled_failure_recovery_drill 诱发一次未提交的 trailing whitespace failure，修复后复验，不提交或推送失败状态。
36. v8_009_A4_8_hard_stop_probe 已只读验证 A4.8 会拒绝第五次生成、provider 试跑、secret read、memory write、production_candidate_002、runs 输出提交、依赖变更和 runtime integration。
37. v8_010_A4_8_comprehensive_validation_closeout 已封存综合验证结果：A4.8 validated，但仍不是 A5；项目停在 `human_route_selection_after_A4_8_validation`。
38. v8_011_route_B_multi_product_expansion_selection_gate 已记录人工选择 Route B：多商品 prompt package 扩展；它不改变 v7/v8 陶瓷杯 accepted candidate 状态，不进入 provider/image/memory/production。
39. v8_012_second_product_candidate_and_brief_gate 已选择第二商品：多色透气网眼运动空顶帽，并创建 brief；不生成图、不调用 provider、不写 memory。
40. v8_013_second_product_prompt_package_draft_gate 已创建第二商品 prompt package 草案；该文件不是执行授权，不允许 provider 或 image generation。
41. v8_014_second_product_prompt_static_review_gate 已静态审查第二商品 prompt package，结果为 pass_with_minor_watch_items；Route B 初始 docs-only 序列完成，必须停在 v8_015 人工授权决策前。

## 永久安全门

任何阶段都不能绕过以下规则：

- 不复制密钥、token、cookie、密码、私密路径或客户隐私。
- 不把图片二进制写入 Git 或 VCP 长期记忆。
- 不把英文提示词作为 DailyNote 正文。
- 不让子 Agent 直接批准核心风格记忆。
- 不让 Review Console renderer 直接调用 DailyNote、插件、API 或文件写入。
- 不把 `tested` 理解为真实执行授权。
