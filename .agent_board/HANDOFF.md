# HANDOFF.md — Agent Image Lab

## Handoff Summary

```text
Status: v8_003_delivery_package_closeout_or_retouch_handoff_gate completed in this handoff; retouch handoff package is created for v4, generation remains stopped, and v8.004 final retouch route closeout is the next non-executing step.
Reason: v8.002 was committed and pushed at f77f51e, then v8.003 linked the retouch plan, acceptance criteria, and delivery package into a handoff package without fifth generation, memory write, runtime implementation, or production_candidate_002.
Current repository: A:/agent-image-lab/agent-image-lab-v0.2
Branch: master tracking origin/master
Latest visible head before v7.273: 6f95b53 == origin/master
Current synced HEAD before v8.003 patch: f77f51e docs: add retouch acceptance criteria and delivery package
ahead_behind: 0/0
Worktree: clean before v8.003 retouch handoff patch; v7.281 output remains ignored under runs/
Current status: v8_003_retouch_handoff_package_created
same_provider_retry_allowed_now: false
A5_execution_allowed_now: false after v7.282; the single authorized v7.281 call has been consumed
provider_contact_allowed_now: false after v7.282; no fifth generation is active without a new authorization gate
Native Doubao static hardening: v7.245 completed_validated
Diagnostic decision: continue_generation_stop_until_route_selection
Provider path decision: ROUTE-3-CONTINUED-STOP selected now
Human product route selection request: v7.261 completed_validated
human_route_selection_requested: true
Project plugin route authorization planning: v7.262 completed_validated
prior_route_selection_gate: v7.261_human_product_route_selection_request_gate
project_plugin_route_selected_for_planning: true
candidate_project_plugin: NativeDoubaoImage
Project plugin A5 authorization package draft: v7.263 completed_validated
draft_authorization_package_id: AUTH-DRAFT-PROJECT-PLUGIN-20260513-001
authorization_status: draft
approval_status: not_requested
execute_now: false
Project plugin A5 authorization draft review: v7.264 completed_validated
draft_review_result: pass_to_keep_inactive
activation_verdict: blocked
True A5 authorization request: v7.265 completed_validated
pending_authorization_package_id: AUTH-PENDING-PROJECT-PLUGIN-20260513-001
prompt_package_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
output_directory_ref: runs/real_generation/A5-PROJECT-PLUGIN-20260513-001/
preflight_approval_status: requested_for_preflight_only
active_A5_authorization_created: false
plugin_call_allowed_now: false
image_generation_allowed_now: false
Route B minimal real generation authorization: v7.268b completed_validated
minimal_real_generation_trial_authorized: true
approved_product: matte_ceramic_mug
approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 4
auto_retry: false
stop_after_generation: true
human_review_required_after_generation: true
Minimal real generation trial: v7.269 succeeded
output_images_count: 1
reviewed_output: runs/real_generation/v7_269_matte_ceramic_mug_trial/native_doubao_1778681238211_0.jpg
Human review of real output: v7.270 completed_pending_validation
asset_status: needs_revision
accepted_candidate: false
commercial_delivery_ready: false
memory_suitability: deferred
second_generation_started: false
image_added_to_git: false
Prompt revision planning: v7.271 completed_pending_validation
prompt_revision_plan_created: true
prompt_v2_created_or_planned: created
prompt_v2_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
Prompt v2 static review: v7.272 passed
Second minimal generation authorization: v7.273 completed_committed_pushed_synced
v7.274_status: completed_success
approved_product_for_second_trial: matte_ceramic_mug
approved_prompt_package_for_second_trial: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
provider_calls_max_for_second_trial: 1
generation_attempts_max_for_second_trial: 1
output_images_max_for_second_trial: 4
output_directory_for_second_trial: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/
auto_retry_for_second_trial: false
stop_after_generation_for_second_trial: true
human_review_required_after_generation: true
v7_274_execution_result: success
v7_274_output_images_count: 1
v7_274_output_file: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg
generated_output: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg
provider_calls_used: 1
generation_attempts_used: 1
auto_retry: false
retry_performed: false
third_generation_allowed_now: false
accepted_candidate: pending_human_review
commercial_delivery_ready: pending_human_review
memory_suitability: pending_human_review
v7.275_human_review_status: completed
v7.275_asset_status: accepted_candidate_with_minor_retouch
v7.275_accepted_candidate: true
v7.275_commercial_delivery_ready: false
v7.275_memory_suitability: deferred
prompt_v3_created: true
prompt_v3_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v3.yaml
third_minimal_generation_trial_authorized: true
approved_product_for_third_trial: matte_ceramic_mug
approved_prompt_package_for_third_trial: prompts/image_generation/product_still_life_matte_ceramic_mug_v3.yaml
provider_calls_max_for_third_trial: 1
generation_attempts_max_for_third_trial: 1
output_images_max_for_third_trial: 4
output_directory_for_third_trial: runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/
auto_retry_for_third_trial: false
fourth_generation_auto_start: false
v7.277_status: completed_success
v7.277_output_images_count: 1
v7.277_output_file: runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/native_doubao_1778688750417_0.jpg
v7.278_human_review_status: completed
v7.278_asset_status: needs_revision
v7.278_accepted_candidate: false
v7.278_commercial_delivery_ready: false
v7.278_memory_suitability: deferred
current_best_candidate: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg
v7.279_status: completed_remote_synced
v7.279_selected_route: fourth_minimal_generation_trial
v7.279_v3_failed_reason: handle attachment geometry regression
v7.279_fourth_trial_goal: restore v2 composition while fixing handle geometry and preserving artifact control
prompt_v4_created: true
prompt_v4_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml
fourth_minimal_generation_trial_authorized: true
approved_prompt_package_for_fourth_trial: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml
provider_calls_max_for_fourth_trial: 1
generation_attempts_max_for_fourth_trial: 1
output_images_max_for_fourth_trial: 4
output_directory_for_fourth_trial: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/
auto_retry_for_fourth_trial: false
fifth_generation_auto_start: false
v7.280_recommended_next: v7.281_fourth_minimal_generation_trial_execution
v7.281_status: completed_success
v7.281_output_images_count: 1
v7.281_output_file: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
v7.281_auto_retry_used: false
v7.282_human_review_status: completed
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
v7.285_current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
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
recommended_next: v8_004_final_retouch_route_closeout
recommended_next_zh: 封存 V8 final retouch planning 路线结果，不生成新图
provider_contact_after_v7_274: false
image_generation_after_v7_274: false
human_review_required_now: false
Current active workers: 0
Current operating style: Single-Window 4-Agent Compact Autopilot
```

## Current Mainline Reality

```text
latest_completed_remote_baseline_before_v7_248: 5564ad9
latest_completed_gate_before_v7_243: v7.242_product_image_authorization_activation_gap_review_gate
current_gate: active_a5_execution_attempt_product_image_authorization
current_gate_status: failed_no_image_repeated_quota_or_rate_limit

Smart Commander protocol track: stable and consolidated
Static Review Console mockup track: quality stop reached
v10.12 provider fingerprint prep: complete, inactive, not authorized for execution
release readiness delta: quality stop reached
board calibration: v7.222 completed and pushed
value selection: v7.223 selected v7.224
status freshness alignment: v7.224 completed and pushed
autopilot rule intake hardening: v7.224a pushed
autopilot rule smoke test: v7.224b passed read-only
balanced codex exec role contracts: v7.225 completed_validated
image workflow product return: v7.226 completed_validated
recommended_unique_route: prompt_package_builder
prompt package builder taskbook: v7.227 completed_validated
prompt package instance template: v7.228 completed_validated
prompt package human review checklist: v7.229 completed_validated
prompt package A5 authorization handoff: v7.230 completed_validated
review console asset status taxonomy: v7.231 completed_validated
memory suitability decision matrix: v7.232 completed_validated
delivery review surface package: v7.233 completed_validated
product image workflow runbook: v7.234 completed_validated
product image workflow static walkthrough: v7.235 completed_validated
product image workflow A5 readiness review: v7.236 completed_validated
product image generation authorization draft: v7.237 completed_validated
product image generation authorization draft review: v7.238 completed_validated
product image generation plan draft: v7.239 completed_validated
product image generation plan authorization match review: v7.240 completed_validated
MVP aggregate validator calibration: completed_validated
product image authorization draft plan-ref alignment: v7.241 completed_validated
product image authorization activation gap review: v7.242 completed_validated
product image active authorization package skeleton: v7.243 completed_validated
active A5 preflight only: passed after checkpoint bddcc5e
active A5 execution attempt: failed_no_image_no_retry
desensitized failure analysis: inconclusive_provider_or_api_layer_failure
active A5 diagnostic retry: failed_no_image_quota_or_rate_limit
active A5 diagnostic retry 002: failed_no_image_repeated_quota_or_rate_limit
state surface reconciliation: v7.244 completed_validated
native Doubao syntax and sandbox hardening: v7.245 completed_validated
no-generation quota/provider path diagnostic readiness: v7.246 completed_validated
provider path decision package: v7.247 completed_validated
generation stop closeout / route selection request: v7.248 completed_validated
A5_route_next_if_generation_requested: human_route_selection_required_before_any_new_A5
route_selection_required_before_new_A5: true
static Review Surface product spec: v7.249 completed_validated
review record template and status flow: v7.250 completed_validated
static Review Surface acceptance checklist: v7.251 completed_validated
static Review Surface mockup readiness review: v7.252 completed_validated
static Review Surface mockup spec: v7.253 completed_validated
static Review Surface mockup file: v7.254 completed_validated
static Review Surface mockup acceptance review: v7.255 completed_validated
static_review_surface_mockup_acceptance_result: pass_with_warnings
static Review Surface acceptance patch: v7.256 completed_validated
accepted_final_explicit_state_patched: true
static Review Surface quality stop decision: v7.257 completed_validated
static_review_surface_quality_stop_reached: true
product workflow fixture packet: v7.258 completed_validated
product_workflow_fixture_packet_created: true
product workflow fixture packet acceptance review: v7.259 completed_validated
product_workflow_fixture_packet_acceptance_passed: true
product workflow paper chain quality stop: v7.260 completed_validated
product_workflow_paper_chain_quality_stop_reached: true
human product route selection request: v7.261 completed_validated
human_route_selection_requested: true
project plugin route authorization planning: v7.262 completed_validated
project_plugin_route_selected_for_planning: true
candidate_project_plugin: NativeDoubaoImage
project plugin A5 authorization package draft: v7.263 completed_validated
draft_authorization_package_id: AUTH-DRAFT-PROJECT-PLUGIN-20260513-001
authorization_status: draft
approval_status: not_requested
execute_now: false
project plugin A5 authorization draft review: v7.264 completed_validated
draft_review_result: pass_to_keep_inactive
activation_verdict: blocked
true A5 authorization request: v7.265 completed_validated
pending_authorization_package_id: AUTH-PENDING-PROJECT-PLUGIN-20260513-001
prompt_package_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
output_directory_ref: runs/real_generation/A5-PROJECT-PLUGIN-20260513-001/
preflight_approval_status: requested_for_preflight_only
active_A5_authorization_created: false
plugin_call_allowed_now: false
image_generation_allowed_now: false
route B minimal real generation authorization: v7.268b completed_validated
minimal_real_generation_trial_authorized: true
approved_product: matte_ceramic_mug
approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 4
auto_retry: false
stop_after_generation: true
human_review_required_after_generation: true
minimal real generation trial: v7.269 success
human review of real output: v7.270 completed_pending_validation
reviewed_output: runs/real_generation/v7_269_matte_ceramic_mug_trial/native_doubao_1778681238211_0.jpg
asset_status: needs_revision
accepted_candidate: false
commercial_delivery_ready: false
memory_suitability: deferred
prompt revision planning: v7.271 completed_pending_validation
prompt_revision_plan_created: true
prompt_v2_created_or_planned: created
prompt_v2_ref: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
prompt v2 static review: v7.272 passed
second minimal generation authorization: v7.273 completed_committed_pushed_synced
current_synced_head: d1a7ac8 docs: authorize second minimal generation trial
ahead_behind: 0/0
worktree: clean before v7.285 product loop closeout; dirty only after the authorized v7.285 documentation/state patch
v7.274_status: completed_success
v7.274_output_images_count: 1
v7.274_output_file: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg
v7.281_status: completed_success
v7.281_output_images_count: 1
v7.281_output_file: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
v7.282_human_review_status: completed
v7.282_asset_status: accepted_candidate_with_minor_retouch
v7.282_accepted_candidate: true
v7.282_commercial_delivery_ready: false
v7.282_memory_suitability: deferred
current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
same_provider_retry_allowed_now: false
A5_execution_allowed_now: false; the single authorized v7.281 call has been consumed
provider_contact_allowed_now: false; the single authorized v7.281 provider contact has been consumed

continue_A4_docs_only_by_default: false
recommended_next: v8_route_selection_human_decision_gate
recommended_next_zh: 人工选择 V8 路线；默认推荐 final_retouch_planning
auto_execution_allowed_for_next: false
v7.284_purpose: accepted candidate evidence package for v4
v7.285_purpose: close out V7 product loop and present V8 route options
v7.284_image_generation_allowed: false
v7.284_provider_contact_allowed: false
v7.284_memory_write_allowed_without_separate_authorization: false
```

## Current Stop Gates

```text
Validator Governance Chain v1: closed
batch_005_allowed_now: false
production_candidate_002_allowed_now: false
memory_write_path_allowed_now: false

A5 provider contact: blocked without active authorization package
Review Console runtime integration: blocked without active authorization package
tag/push/release: blocked unless explicit version-action authorization and preflight pass
repetitive A4 docs-only gate: blocked unless it creates new product value
production actions remain blocked without active authorization package
v7.224 does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.224a does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.225 does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.226 does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.227 does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.228 does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.229 does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.230 does not authorize A5 activation, provider, runtime, plugin, image, DailyNote, VCP memory, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.231 does not authorize A5, provider, runtime, Review Console runtime, renderer/preload/IPC, plugin, image, DailyNote, VCP memory, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.232 does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, memory authorization activation, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.233 does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.234 does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.235 does not authorize A5, provider, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.236 does not authorize active A5, provider, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, real manifest read, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.237 does not authorize active A5, provider, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, real manifest read, real output path selection, raw payload creation, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.238 does not authorize active A5, human approval request, provider, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, real manifest read, real output path selection, raw payload creation, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.239 does not authorize active A5, provider/model/plugin selection, provider contact, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, real manifest read, real output path selection, raw payload creation, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.240 does not authorize active A5, provider/model/plugin selection, provider contact, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, real manifest read, real output path selection, raw payload creation, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.241 does not authorize active A5, provider/model/plugin selection, provider contact, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, real manifest read, real output path selection, raw payload creation, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.242 does not authorize active A5, provider/model/plugin selection, provider contact, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, real manifest read, real output path selection, raw payload creation, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
v7.243 does not authorize active A5, provider/model/plugin selection, provider contact, runtime, plugin, image, DailyNote, VCP memory, output save, Review Console runtime, real manifest read, real output path selection, raw payload creation, CDP, bridge, MCP, tag, release, deploy, production_candidate_002, or Batch 005
```

## Validation Snapshot

```text
git status -sb before active execution attempt: clean, ahead 2
git rev-parse HEAD at v7.243 start: 03fd398
git rev-parse origin/master at v7.243 start: 03fd398
agent_board_freshness: manually checked from exact diff
git diff --check: passed
scripts/validate-agent-image-lab-local.ps1: passed with manual-review warnings after stop-rule field rename
scripts/validate_mvp.ps1: passed after aggregate validator calibration and active preflight check
rule_intake_smoke_test: passed in v7.224b read-only smoke test
scripts/validate_mvp.ps1: not required for board-only calibration unless reviewer escalates
scripts/validate-agent-image-lab-local.ps1: not required for board-only calibration unless reviewer escalates
node scripts/validate_runtime_prototype_suite.js: not required; no runtime prototype changed
```

## Boundary Confirmation

```text
real VCPChat read during v7.270: no
real VCPToolBox read during v7.270: no
real manifest read during v7.270: no
plugin call during v7.270: no
API/provider contact during v7.270: no
DailyNote call during v7.270: no
VCP memory write during v7.270: no
image file created during v7.270: no
runtime execution during v7.270: no
generated output image added to Git: no
external repository modification: no
dependency/config/env modification: no
```

## Human Decisions Needed

```text
Next action is v7.283 candidate acceptance or final retouch decision gate only. No retry, fifth generation, product switch, prompt switch, provider/model/account switch, raw plugin stderr/stdout review or capture, secret/config value review, tag/release/deploy beyond this gate, runtime implementation, memory write, or DailyNote call is authorized.
```

## Exact Resume Prompt

```text
你现在在 Agent Image Lab 项目根目录。
读取 AGENTS.md、AGENTS.autopilot-overlay.md 和 .agent_board/*。
用中文汇报。

当前仓库状态：
- master should track origin/master.
- source baseline for v7.243: 03fd398.
- current phase: post_v7.274_board_reality_correction; v7.274 completed successfully with one output and now requires human review.
- v7.221 mainline quality stop reached.
- v7.222 board calibration completed.
- v7.223 read-only value selection selected v7.224 as the only safe next task.
- v7.224 mainline status freshness alignment completed and pushed.
- Validator Governance Chain v1: closed.
- batch_005_allowed_now: false.
- production_candidate_002_allowed_now: false.
- memory_write_path_allowed_now: false.
- continue_A4_docs_only_by_default: false.
- v7.224a rule intake hardening completed and pushed.
- v7.224b read-only smoke test passed.
- v7.226 selected Prompt Package Builder as the next product-mainline route.
- v7.227 created the prompt package builder schema and reusable taskbook.
- v7.228 created the fillable non-executing prompt package instance template.
- v7.229 created the prompt package human review checklist and status taxonomy.
- v7.230 created the prompt package to future A5 authorization handoff template.
- v7.231 created the review console asset status taxonomy and review surface fields.
- v7.232 created the non-writing memory suitability decision matrix.
- v7.233 created the Delivery / Review Surface Package.
- v7.234 created the Product Image Workflow Runbook.
- v7.235 created a synthetic matte ceramic coffee mug static walkthrough.
- v7.236 confirmed readiness for a non-active A5 authorization draft, not active execution.
- v7.237 created a non-active A5 authorization draft with status=draft and approval_status=not_requested.
- v7.238 reviewed the non-active draft and confirmed it is safe-to-keep A4 paperwork but not active A5-ready.
- v7.239 created a non-executing generation plan draft with generation_plan_id=GP-DRAFT-20260512-001.
- v7.240 reviewed the paper-level match between GP-DRAFT-20260512-001 and AUTH-DRAFT-20260512-001.
- v7.241 patched AUTH-DRAFT-20260512-001 with GP-DRAFT-20260512-001 / v1 without activation.
- v7.242 classified remaining active A5 activation gaps without activation.
- v7.243 simplified the authorization draft into a one-page preflight-pending record without execution.
- active A5 preflight passed after local checkpoint bddcc5e.
- AUTH-PENDING-20260512-001 approval phrase matched.
- execution surface was supplemented with exact DoubaoGen plugin directory and secret subprocess authorization.
- one DoubaoGen process attempt ran and returned error; no image was generated.
- secret cache and runtime plugin copy were removed after failure.
- retry_limit=0, so no second generation call is allowed under the consumed authorization.
- desensitized failure analysis result: inconclusive_provider_or_api_layer_failure; exact provider error is unavailable because raw stdout/stderr was not printed or retained.
- one newly authorized DoubaoGen retry/diagnostic call ran and returned sanitized_error_category=quota_or_rate_limit; no image was generated.
- a second newly authorized DoubaoGen retry/diagnostic call also returned sanitized_error_category=quota_or_rate_limit; no image was generated.
- v7.260 product workflow paper chain quality stop reached.
- v7.261 presented Route 1 quota resolution then A5 retry, Route 2 provider/model/account switch, Route 3 manual product prompt package sample, and Route 4 Review Console runtime integration planning.
- v7.262 identified NativeDoubaoImage as the project-local candidate plugin path for future authorization planning.
- v7.263 created AUTH-DRAFT-PROJECT-PLUGIN-20260513-001 with status=draft, approval_status=not_requested, execute_now=false.
- v7.264 reviewed AUTH-DRAFT-PROJECT-PLUGIN-20260513-001 and concluded pass_to_keep_inactive / activation blocked.
- v7.265 prepares AUTH-PENDING-PROJECT-PLUGIN-20260513-001 with prompt_package_ref=prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml and output_directory=runs/real_generation/A5-PROJECT-PLUGIN-20260513-001/.
- v7.268b authorized Route B minimal real generation trial: matte_ceramic_mug, one provider call, one attempt, max 4 outputs, no retry, stop after generation, human review required.
- v7.269 completed the bounded trial with one output: runs/real_generation/v7_269_matte_ceramic_mug_trial/native_doubao_1778681238211_0.jpg.
- v7.270 records human review: needs_revision, accepted_candidate=false, commercial_delivery_ready=false, memory_suitability=deferred.
- v7.271 created prompt v2: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml and a static revision plan; no second generation was started.
- v7.272 static review passed prompt v2 for a bounded second trial.
- v7.273 human authorization allowed a separate v7.274 phase to run exactly one second minimal generation trial using prompt v2; that single call has now been consumed.
- v7.274 completed successfully with one output: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg.
- recommended_next after v7.274: v7.275_human_review_of_second_real_outputs（人工审查第二次真实输出，不生成新图，不写 memory）.
- do not start any retry, third generation, memory write, DailyNote write, Batch 005, production_candidate_002, CDP, bridge, MCP, tag, release, or deploy.

不要读取真实 VCPChat/VCPToolBox。
不要读取真实 manifest。
不要调用插件/API/DailyNote/VCP memory。
不要创建图片。
不要进入 runtime/A5/release/tag，除非已有明确授权且 preflight 通过。
不要继续新增 Smart Commander 调教 gate，除非 review 证明必要。
不要编辑文件，直到 Autopilot Rule Intake 完成并复述 hard stops、no git add .、exact-file staging 和 agent_board update rule。
```
