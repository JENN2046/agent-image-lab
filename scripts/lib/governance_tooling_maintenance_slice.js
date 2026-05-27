"use strict";

const EXPECTED_PREVIEW_SCRIPT = "node scripts/serve_review_console_static.js";
const GOVERNANCE_TOOLING_SLICE_HELPER_FILE = "scripts/lib/governance_tooling_maintenance_slice.js";
const EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE = [
  ".agent_board/AUTOPILOT_LEDGER.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "AGENTS.autopilot-overlay.md",
  "AGENTS.md",
  "docs/00_project_roadmap.md",
  "docs/AUTOPILOT_AGENT_BOARD_RESUME_COMPACTION_GUARD.md",
  "docs/AUTOPILOT_COMPLETE_READINESS_GATE.md",
  "docs/AUTOPILOT_AMBER_PACKET_TO_RECEIPT_TRACEABILITY.md",
  "docs/AUTOPILOT_EVOLUTION_ENGINE.md",
  "docs/AUTOPILOT_READINESS_RECEIPT_REGISTRY_CROSS_CLAIMS.md",
  "package.json",
  "review_console/static_prototype/app.js",
  "review_console/static_prototype/index.html",
  "review_console/static_prototype/styles.css",
  "scripts/detect_autopilot_evolution_gaps.js",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/serve_review_console_static.js",
  "scripts/simulate_amber_dry_run_execution_loop.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_autopilot_amber_packet_to_receipt_traceability.js",
  "scripts/validate_autopilot_evolution_engine.js",
  "scripts/validate_autopilot_readiness_receipt_registry_cross_claims.js",
  "scripts/validate_complete_autopilot_readiness_gate.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_commit_and_authorization_readiness_audit.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_mvp_capsule_product_core.ps1",
  "tests/schema_examples/amber_dry_run_execution_loop.example.json",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/autopilot_amber_action_packet.example.json",
  "tests/schema_examples/autopilot_amber_packet_to_receipt_traceability.example.json",
  "tests/schema_examples/autopilot_evolution_backlog.example.json",
  "tests/schema_examples/autopilot_receipt_registry.example.json",
  "tests/schema_examples/autopilot_readiness_receipt_registry_cross_claims.example.json",
  "tests/schema_examples/complete_autopilot_readiness_gate.example.json"
].sort();

const EXPECTED_V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN_SLICE = [
  ".agent_board/AUTOPILOT_LEDGER.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN.md",
  "docs/V0_3_CONTROLLED_REAL_PROVIDER_PRODUCTION_LOOP.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_v0_3_1_real_provider_cost_boundary_plan.js",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/v0_3_1_real_provider_cost_boundary_plan.example.json"
].sort();

const EXPECTED_V0_3_2_LIVE_CANDIDATE_ACTION_PACKET_SLICE = [
  ".agent_board/AUTOPILOT_LEDGER.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN.md",
  "docs/V0_3_2_LIVE_CANDIDATE_ACTION_PACKET.md",
  "docs/V0_3_CONTROLLED_REAL_PROVIDER_PRODUCTION_LOOP.md",
  "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_v0_3_1_real_provider_cost_boundary_plan.js",
  "scripts/validate_v0_3_2_live_candidate_action_packet.js",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/v0_3_1_real_provider_cost_boundary_plan.example.json",
  "tests/schema_examples/v0_3_2_live_candidate_action_packet.example.json"
].sort();

const EXPECTED_V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE_SLICE = [
  ".agent_board/AUTOPILOT_LEDGER.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN.md",
  "docs/V0_3_2_LIVE_CANDIDATE_ACTION_PACKET.md",
  "docs/V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE.md",
  "docs/V0_3_CONTROLLED_REAL_PROVIDER_PRODUCTION_LOOP.md",
  "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml",
  "prompts/image_generation/fashion_night_balcony_vertical_portrait_retry_001_simple.yaml",
  "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
  "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml",
  "reports/provider_receipts/provider_receipt_registry.json",
  "reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json",
  "reports/provider_receipts/v0_3_3_retry_001_receipt.json",
  "reports/provider_receipts/v0_3_3_retry_001_registry.json",
  "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json",
  "reports/provider_receipts/v0_3_3_safe_portrait_001_registry.json",
  "reports/provider_receipts/v0_3_3_smoke_001_neutral_receipt.json",
  "reports/provider_receipts/v0_3_3_smoke_001_neutral_registry.json",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_v0_3_1_real_provider_cost_boundary_plan.js",
  "scripts/validate_v0_3_2_live_candidate_action_packet.js",
  "scripts/validate_v0_3_3_first_live_generation_pilot_gate.js",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/v0_3_1_real_provider_cost_boundary_plan.example.json",
  "tests/schema_examples/v0_3_2_live_candidate_action_packet.example.json",
  "tests/schema_examples/v0_3_3_first_live_generation_pilot_gate.example.json"
].sort();

const EXPECTED_PROVIDER_RECEIPT_ARTIFACT_REPAIR_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".gitignore",
  "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json",
  "reports/provider_receipts/v0_3_3_smoke_001_neutral_receipt.json",
  "runs/real_generation/v0_3_3_codex_sample_first_trial/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_retry_001_codex_sample/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_safe_portrait_001/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_smoke_001_neutral/generation_attempt_result.json",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_local_commit_scope.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js"
].sort();

const EXPECTED_V0_3_4_VISUAL_ASSET_GOVERNANCE_RECONCILIATION_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "assets/visual_asset_authorization_registry.example.json",
  "docs/00_project_roadmap.md",
  "docs/V0_3_4_VISUAL_ASSET_GOVERNANCE_AND_RECEIPT_STATE_RECONCILIATION.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_local_commit_scope.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_v0_3_3_first_live_generation_pilot_gate.js",
  "scripts/validate_visual_asset_authorization_policy.js",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/v0_3_3_first_live_generation_pilot_gate.example.json"
].sort();

const EXPECTED_V0_3_5_VISUAL_ASSET_PROMOTION_GATE_DESIGN_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "assets/visual_asset_authorization_registry.example.json",
  "docs/00_project_roadmap.md",
  "docs/V0_3_4_VISUAL_ASSET_GOVERNANCE_AND_RECEIPT_STATE_RECONCILIATION.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_v0_3_3_first_live_generation_pilot_gate.js",
  "scripts/validate_visual_asset_authorization_policy.js",
  "tests/schema_examples/v0_3_3_first_live_generation_pilot_gate.example.json"
].sort();

const EXPECTED_V0_3_6_BOUNDED_L4_AUTOPILOT_REQUIREMENTS_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "AGENTS.autopilot-overlay.md",
  "docs/00_project_roadmap.md",
  "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  "docs/STANDING_OWNER_AUTOMATIC_AUTHORIZATION_POLICY.md",
  "docs/V0_3_6_BOUNDED_L4_AUTOPILOT_REQUIREMENTS_AND_AMBER_SUBCLASS_GATE.md",
  "schemas/autopilot_receipt_registry.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_bounded_l4_autopilot_requirements.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/autopilot_receipt_registry.example.json",
  "tests/schema_examples/bounded_l4_autopilot_requirements.example.json"
].sort();

const EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md"
].sort();

const EXPECTED_V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "AGENTS.autopilot-overlay.md",
  "docs/00_project_roadmap.md",
  "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  "docs/STANDING_OWNER_AUTOMATIC_AUTHORIZATION_POLICY.md",
  "docs/V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_GATE.md",
  "schemas/bounded_l4_executor_preflight_packet.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_bounded_l4_executor_preflight_contract.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/bounded_l4_executor_preflight_packet.example.json"
].sort();

const EXPECTED_V0_3_7A_PUSH_SAFETY_LANE_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "AGENTS.autopilot-overlay.md",
  "AGENTS.md",
  "docs/00_project_roadmap.md",
  "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  "docs/STANDING_OWNER_AUTOMATIC_AUTHORIZATION_POLICY.md",
  "docs/V0_3_7A_PUSH_SAFETY_LANE_GATE.md",
  "schemas/smart_v3_push_safety_lane.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_smart_v3_push_safety_lane.js",
  "tests/schema_examples/smart_v3_push_safety_lane.example.json"
].sort();

const EXPECTED_V0_3_7C_PUSH_L1_REGRESSION_USAGE_BOUNDARY_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/PUSH_L1_REGRESSION_CASES.md",
  "docs/PUSH_L1_USAGE_RULE.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_smart_v3_push_safety_lane.js",
  "tests/schema_examples/push_l1_forbidden_paths_fail.example.json",
  "tests/schema_examples/push_l1_status_sync_pass.example.json"
].sort();

const EXPECTED_V0_3_7D_VISUAL_ASSET_EVAL_V0_1_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/VISUAL_ASSET_EVAL_V0_1.md",
  "schemas/visual_asset_review_report.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_asset_eval_v0_1.js",
  "tests/schema_examples/visual_asset_review_report.example.json"
].sort();

const EXPECTED_V0_3_7E_VISUAL_SAMPLE_MEMORY_POLICY_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/VISUAL_SAMPLE_MEMORY_POLICY.md",
  "schemas/accepted_sample_record.schema.yaml",
  "schemas/rejected_sample_record.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_sample_memory_policy.js",
  "tests/schema_examples/accepted_sample_record.example.json",
  "tests/schema_examples/rejected_sample_record.example.json"
].sort();

const EXPECTED_V0_3_15_FIFTEEN_DAY_ARCHITECTURE_CHECKPOINT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_3_15_FIFTEEN_DAY_ARCHITECTURE_CHECKPOINT.md",
  "docs/VISUAL_SAMPLE_MEMORY_POLICY.md",
  "next_30_day_route_options.md",
  "schemas/accepted_sample_record.schema.yaml",
  "schemas/rejected_sample_record.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_15_day_architecture_checkpoint.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_sample_memory_policy.js",
  "tests/schema_examples/accepted_sample_record.example.json",
  "tests/schema_examples/rejected_sample_record.example.json"
].sort();

const EXPECTED_V0_4_0_VISUAL_ASSET_EVAL_DRY_RUN_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_0_VISUAL_ASSET_EVAL_DRY_RUN.md",
  "docs/VISUAL_ASSET_EVAL_V0_1.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_asset_eval_dry_run.js",
  "tests/schema_examples/visual_asset_eval_dry_run.example.json",
  "tests/schema_examples/visual_asset_eval_dry_run_fail.example.json"
].sort();

const EXPECTED_V0_4_0A_VISUAL_ASSET_EVAL_DRY_RUN_ASSET_CLASS_BINDING_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_0_VISUAL_ASSET_EVAL_DRY_RUN.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_visual_asset_eval_dry_run.js"
].sort();

const EXPECTED_V0_4_1_VISUAL_ASSET_REVIEW_PACK_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_1_VISUAL_ASSET_REVIEW_PACK.md",
  "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_asset_review_pack.js"
].sort();

const EXPECTED_V0_4_2_VISUAL_FAILURE_TAXONOMY_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_2_VISUAL_FAILURE_TAXONOMY.md",
  "schemas/visual_failure_taxonomy.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_failure_taxonomy.js",
  "tests/schema_examples/visual_failure_taxonomy.example.json",
  "tests/schema_examples/visual_failure_taxonomy_fail.example.json"
].sort();

const EXPECTED_V0_4_3_REVIEW_TO_PROMPT_CORRECTION_HINT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_3_REVIEW_TO_PROMPT_CORRECTION_HINT.md",
  "schemas/visual_prompt_correction_hint.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_prompt_correction_hints.js",
  "tests/schema_examples/visual_prompt_correction_hint.example.json",
  "tests/schema_examples/visual_prompt_correction_hint_fail.example.json"
].sort();

const EXPECTED_V0_4_4_SAMPLE_REGISTRY_DRY_RUN_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_4_SAMPLE_REGISTRY_DRY_RUN.md",
  "reports/visual_asset_eval_dry_run/v0_4_4_sample_registry_dry_run.json",
  "schemas/visual_sample_registry_dry_run.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_sample_registry_dry_run.js",
  "tests/schema_examples/visual_sample_registry_dry_run.example.json",
  "tests/schema_examples/visual_sample_registry_dry_run_fail.example.json"
].sort();

const EXPECTED_V0_4_5_VISUAL_EVAL_CONSISTENCY_CHECK_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_5_VISUAL_EVAL_CONSISTENCY_CHECK.md",
  "schemas/visual_eval_consistency_check.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_eval_consistency_check.js",
  "tests/schema_examples/visual_eval_consistency_check.example.json",
  "tests/schema_examples/visual_eval_consistency_check_fail.example.json"
].sort();

const EXPECTED_V0_4_6_NOOP_VISUAL_WORKFLOW_RUNNER_PLAN_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_6_NOOP_VISUAL_WORKFLOW_RUNNER_PLAN.md",
  "schemas/visual_noop_workflow_runner_plan.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_noop_visual_workflow_runner_plan.js",
  "tests/schema_examples/visual_noop_workflow_runner_plan.example.json",
  "tests/schema_examples/visual_noop_workflow_runner_plan_fail.example.json"
].sort();

const EXPECTED_V0_4_7_SEVEN_DAY_VISUAL_WORKFLOW_CHECKPOINT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_7_SEVEN_DAY_VISUAL_WORKFLOW_CHECKPOINT.md",
  "docs/next_14_day_route_options.md",
  "next_14_day_route_options.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_local_commit_scope.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_seven_day_visual_workflow_checkpoint.js"
].sort();

const EXPECTED_V0_4_7_REVIEW_FINDINGS_FIX_SLICE = [
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_seven_day_visual_workflow_checkpoint.js"
].sort();

const EXPECTED_V0_4_8_VISUAL_REVIEW_SEMANTICS_HARDENING_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_8_VISUAL_REVIEW_SEMANTICS_HARDENING.md",
  "schemas/visual_review_semantics_hardening.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_review_semantics_hardening.js",
  "tests/schema_examples/visual_review_semantics_hardening.example.json",
  "tests/schema_examples/visual_review_semantics_hardening_fail.example.json"
].sort();

const EXPECTED_V0_4_9_VISUAL_EVIDENCE_CONSISTENCY_HARDENING_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_4_9_VISUAL_EVIDENCE_CONSISTENCY_HARDENING.md",
  "reports/visual_asset_eval_dry_run/v0_4_9_evidence_consistency_hardening.json",
  "schemas/visual_evidence_consistency_hardening.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_evidence_consistency_hardening.js",
  "tests/schema_examples/visual_evidence_consistency_hardening.example.json",
  "tests/schema_examples/visual_evidence_consistency_hardening_fail.example.json"
].sort();

const EXPECTED_V0_5_0_CONTROLLED_GENERATION_READINESS_PACKET_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_5_0_CONTROLLED_GENERATION_READINESS_PACKET.md",
  "reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json",
  "schemas/controlled_generation_readiness_packet.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_controlled_generation_readiness_packet.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/controlled_generation_readiness_packet.example.json",
  "tests/schema_examples/controlled_generation_readiness_packet_fail.example.json"
].sort();

const EXPECTED_V0_5_1_PROMPT_PACKAGE_PREVIEW_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_5_1_PROMPT_PACKAGE_PREVIEW.md",
  "reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json",
  "schemas/prompt_package_preview.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_prompt_package_preview.js",
  "tests/schema_examples/prompt_package_preview.example.json",
  "tests/schema_examples/prompt_package_preview_fail.example.json"
].sort();

const EXPECTED_V0_5_2_VISUAL_REVIEW_REPLAY_SET_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_5_2_VISUAL_REVIEW_REPLAY_SET.md",
  "reports/visual_asset_eval_dry_run/v0_5_2_review_replay_set.json",
  "schemas/visual_review_replay_set.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_review_replay_set.js",
  "tests/schema_examples/visual_review_replay_set.example.json",
  "tests/schema_examples/visual_review_replay_set_fail.example.json"
].sort();

const EXPECTED_V0_5_3_VISUAL_MEMORY_READONLY_PLAN_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_5_3_VISUAL_MEMORY_READONLY_PLAN.md",
  "reports/visual_asset_eval_dry_run/v0_5_3_visual_memory_readonly_plan.json",
  "schemas/visual_memory_readonly_plan.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_visual_memory_readonly_plan.js",
  "tests/schema_examples/visual_memory_readonly_plan.example.json",
  "tests/schema_examples/visual_memory_readonly_plan_fail.example.json"
].sort();

const EXPECTED_V0_5_4_NEXT_15_DAY_VISUAL_WORKFLOW_CHECKPOINT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_5_4_NEXT_15_DAY_CHECKPOINT.md",
  "reports/visual_asset_eval_dry_run/v0_5_4_next_15_day_checkpoint.json",
  "schemas/next_15_day_visual_workflow_checkpoint.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_next_15_day_visual_workflow_checkpoint.js",
  "tests/schema_examples/next_15_day_visual_workflow_checkpoint.example.json",
  "tests/schema_examples/next_15_day_visual_workflow_checkpoint_fail.example.json"
].sort();

const EXPECTED_V0_5_5_CONTROLLED_GENERATION_READINESS_SEMANTICS_HARDENING_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_5_5_CONTROLLED_GENERATION_READINESS_SEMANTICS_HARDENING.md",
  "reports/visual_asset_eval_dry_run/v0_5_5_controlled_generation_readiness_semantics_hardening.json",
  "schemas/controlled_generation_readiness_semantics_hardening.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_controlled_generation_readiness_semantics_hardening.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/controlled_generation_readiness_semantics_hardening.example.json",
  "tests/schema_examples/controlled_generation_readiness_semantics_hardening_fail.example.json"
].sort();

const EXPECTED_V0_5_6_HUMAN_REVIEW_GATE_PACKET_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_5_6_HUMAN_REVIEW_GATE_PACKET.md",
  "reports/visual_asset_eval_dry_run/v0_5_6_human_review_gate_packet.json",
  "schemas/human_review_gate_packet.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_human_review_gate_packet.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/human_review_gate_packet.example.json",
  "tests/schema_examples/human_review_gate_packet_fail.example.json"
].sort();

const EXPECTED_V0_5_7_NOOP_CONTROLLED_GENERATION_RUNNER_DRY_RUN_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_5_7_NOOP_CONTROLLED_GENERATION_RUNNER_DRY_RUN.md",
  "reports/visual_asset_eval_dry_run/v0_5_7_noop_controlled_generation_runner_dry_run.json",
  "schemas/noop_controlled_generation_runner_dry_run.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_noop_controlled_generation_runner_dry_run.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/noop_controlled_generation_runner_dry_run.example.json",
  "tests/schema_examples/noop_controlled_generation_runner_dry_run_fail.example.json"
].sort();

const EXPECTED_V0_5_8_CONTROLLED_GENERATION_EVIDENCE_CONTRACT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_5_8_CONTROLLED_GENERATION_EVIDENCE_CONTRACT.md",
  "reports/visual_asset_eval_dry_run/v0_5_8_controlled_generation_evidence_contract.json",
  "schemas/controlled_generation_evidence_contract.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_controlled_generation_evidence_contract.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/controlled_generation_evidence_contract.example.json",
  "tests/schema_examples/controlled_generation_evidence_contract_fail.example.json"
].sort();

const EXPECTED_V0_5_9_VISUAL_MEMORY_READONLY_QUERY_CONTRACT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_5_9_VISUAL_MEMORY_READONLY_QUERY_CONTRACT.md",
  "reports/visual_asset_eval_dry_run/v0_5_9_visual_memory_readonly_query_contract.json",
  "schemas/visual_memory_readonly_query_contract.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_visual_memory_readonly_query_contract.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/visual_memory_readonly_query_contract.example.json",
  "tests/schema_examples/visual_memory_readonly_query_contract_fail.example.json"
].sort();

const EXPECTED_V0_6_0_FIRST_CONTROLLED_GENERATION_AUTHORIZATION_PACKET_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_0_FIRST_CONTROLLED_GENERATION_AUTHORIZATION_PACKET.md",
  "reports/visual_asset_eval_dry_run/v0_6_0_first_controlled_generation_authorization_packet.json",
  "schemas/first_controlled_generation_authorization_packet.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_first_controlled_generation_authorization_packet.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/first_controlled_generation_authorization_packet.example.json",
  "tests/schema_examples/first_controlled_generation_authorization_packet_fail.example.json"
].sort();

const EXPECTED_V0_6_1_FIFTEEN_DAY_CONTROLLED_GENERATION_READINESS_CHECKPOINT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_1_FIFTEEN_DAY_CONTROLLED_GENERATION_READINESS_CHECKPOINT.md",
  "reports/visual_asset_eval_dry_run/v0_6_1_fifteen_day_controlled_generation_readiness_checkpoint.json",
  "schemas/fifteen_day_controlled_generation_readiness_checkpoint.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_fifteen_day_controlled_generation_readiness_checkpoint.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/fifteen_day_controlled_generation_readiness_checkpoint.example.json",
  "tests/schema_examples/fifteen_day_controlled_generation_readiness_checkpoint_fail.example.json"
].sort();

const EXPECTED_V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN.md",
  "scripts/lib/governance_tooling_maintenance_slice.js"
].sort();

const EXPECTED_V0_6_3_FAILED_PROVIDER_ATTEMPT_INSPECTION_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN.md",
  "docs/V0_6_3_FAILED_PROVIDER_ATTEMPT_INSPECTION.md",
  "reports/visual_asset_eval_dry_run/v0_6_3_failed_provider_attempt_inspection.json",
  "schemas/failed_provider_attempt_inspection.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_failed_provider_attempt_inspection.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/failed_provider_attempt_inspection.example.json",
  "tests/schema_examples/failed_provider_attempt_inspection_fail.example.json"
].sort();

const EXPECTED_V0_6_4_EXACT_NEW_TRIAL_AUTHORIZATION_REFRESH_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN.md",
  "docs/V0_6_3_FAILED_PROVIDER_ATTEMPT_INSPECTION.md",
  "docs/V0_6_4_EXACT_NEW_TRIAL_AUTHORIZATION_REFRESH.md",
  "reports/visual_asset_eval_dry_run/v0_6_3_failed_provider_attempt_inspection.json",
  "reports/visual_asset_eval_dry_run/v0_6_4_exact_new_trial_authorization_refresh.json",
  "schemas/exact_new_trial_authorization_refresh.schema.yaml",
  "schemas/failed_provider_attempt_inspection.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_authorization_refresh.js",
  "scripts/validate_failed_provider_attempt_inspection.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_authorization_refresh.example.json",
  "tests/schema_examples/exact_new_trial_authorization_refresh_fail.example.json",
  "tests/schema_examples/failed_provider_attempt_inspection.example.json",
  "tests/schema_examples/failed_provider_attempt_inspection_fail.example.json"
].sort();

const EXPECTED_V0_6_5_READY_FOR_EXACT_NEW_TRIAL_AUTHORIZATION_CHECKPOINT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN.md",
  "docs/V0_6_3_FAILED_PROVIDER_ATTEMPT_INSPECTION.md",
  "docs/V0_6_4_EXACT_NEW_TRIAL_AUTHORIZATION_REFRESH.md",
  "docs/V0_6_5_READY_FOR_EXACT_NEW_TRIAL_AUTHORIZATION_CHECKPOINT.md",
  "reports/visual_asset_eval_dry_run/v0_6_3_failed_provider_attempt_inspection.json",
  "reports/visual_asset_eval_dry_run/v0_6_4_exact_new_trial_authorization_refresh.json",
  "reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json",
  "schemas/exact_new_trial_authorization_refresh.schema.yaml",
  "schemas/failed_provider_attempt_inspection.schema.yaml",
  "schemas/ready_for_exact_new_trial_authorization_checkpoint.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_authorization_refresh.js",
  "scripts/validate_failed_provider_attempt_inspection.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_ready_for_exact_new_trial_authorization_checkpoint.js",
  "tests/schema_examples/exact_new_trial_authorization_refresh.example.json",
  "tests/schema_examples/exact_new_trial_authorization_refresh_fail.example.json",
  "tests/schema_examples/failed_provider_attempt_inspection.example.json",
  "tests/schema_examples/failed_provider_attempt_inspection_fail.example.json",
  "tests/schema_examples/ready_for_exact_new_trial_authorization_checkpoint.example.json",
  "tests/schema_examples/ready_for_exact_new_trial_authorization_checkpoint_fail.example.json"
].sort();

const EXPECTED_V0_6_6_EXACT_NEW_TRIAL_A5_REQUEST_DRAFT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN.md",
  "docs/V0_6_3_FAILED_PROVIDER_ATTEMPT_INSPECTION.md",
  "docs/V0_6_4_EXACT_NEW_TRIAL_AUTHORIZATION_REFRESH.md",
  "docs/V0_6_5_READY_FOR_EXACT_NEW_TRIAL_AUTHORIZATION_CHECKPOINT.md",
  "docs/V0_6_6_EXACT_NEW_TRIAL_A5_REQUEST_DRAFT.md",
  "reports/visual_asset_eval_dry_run/v0_6_3_failed_provider_attempt_inspection.json",
  "reports/visual_asset_eval_dry_run/v0_6_4_exact_new_trial_authorization_refresh.json",
  "reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json",
  "reports/visual_asset_eval_dry_run/v0_6_6_exact_new_trial_a5_request_draft.json",
  "schemas/exact_new_trial_a5_request_draft.schema.yaml",
  "schemas/exact_new_trial_authorization_refresh.schema.yaml",
  "schemas/failed_provider_attempt_inspection.schema.yaml",
  "schemas/ready_for_exact_new_trial_authorization_checkpoint.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_a5_request_draft.js",
  "scripts/validate_exact_new_trial_authorization_refresh.js",
  "scripts/validate_failed_provider_attempt_inspection.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_ready_for_exact_new_trial_authorization_checkpoint.js",
  "tests/schema_examples/exact_new_trial_a5_request_draft.example.json",
  "tests/schema_examples/exact_new_trial_a5_request_draft_fail.example.json",
  "tests/schema_examples/exact_new_trial_authorization_refresh.example.json",
  "tests/schema_examples/exact_new_trial_authorization_refresh_fail.example.json",
  "tests/schema_examples/failed_provider_attempt_inspection.example.json",
  "tests/schema_examples/failed_provider_attempt_inspection_fail.example.json",
  "tests/schema_examples/ready_for_exact_new_trial_authorization_checkpoint.example.json",
  "tests/schema_examples/ready_for_exact_new_trial_authorization_checkpoint_fail.example.json"
].sort();

const EXPECTED_V0_6_7_EXACT_NEW_TRIAL_AUTHORIZATION_INTAKE_PREFLIGHT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_7_EXACT_NEW_TRIAL_AUTHORIZATION_INTAKE_PREFLIGHT.md",
  "reports/visual_asset_eval_dry_run/v0_6_7_exact_new_trial_authorization_intake_preflight.json",
  "schemas/exact_new_trial_authorization_intake_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_authorization_intake_preflight.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_authorization_intake_preflight.example.json",
  "tests/schema_examples/exact_new_trial_authorization_intake_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_8_EXACT_NEW_TRIAL_INTAKE_FIELD_RESOLUTION_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_7_EXACT_NEW_TRIAL_AUTHORIZATION_INTAKE_PREFLIGHT.md",
  "docs/V0_6_8_EXACT_NEW_TRIAL_INTAKE_FIELD_RESOLUTION.md",
  "reports/visual_asset_eval_dry_run/v0_6_7_exact_new_trial_authorization_intake_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_8_exact_new_trial_intake_field_resolution.json",
  "schemas/exact_new_trial_authorization_intake_preflight.schema.yaml",
  "schemas/exact_new_trial_intake_field_resolution.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_authorization_intake_preflight.js",
  "scripts/validate_exact_new_trial_intake_field_resolution.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_authorization_intake_preflight.example.json",
  "tests/schema_examples/exact_new_trial_authorization_intake_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_intake_field_resolution.example.json",
  "tests/schema_examples/exact_new_trial_intake_field_resolution_fail.example.json"
].sort();

const EXPECTED_V0_6_9_EXACT_NEW_TRIAL_REQUEST_TEXT_REGENERATED_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_7_EXACT_NEW_TRIAL_AUTHORIZATION_INTAKE_PREFLIGHT.md",
  "docs/V0_6_8_EXACT_NEW_TRIAL_INTAKE_FIELD_RESOLUTION.md",
  "docs/V0_6_9_EXACT_NEW_TRIAL_REQUEST_TEXT_REGENERATED.md",
  "reports/visual_asset_eval_dry_run/v0_6_7_exact_new_trial_authorization_intake_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_8_exact_new_trial_intake_field_resolution.json",
  "reports/visual_asset_eval_dry_run/v0_6_9_exact_new_trial_request_text_regenerated.json",
  "schemas/exact_new_trial_authorization_intake_preflight.schema.yaml",
  "schemas/exact_new_trial_intake_field_resolution.schema.yaml",
  "schemas/exact_new_trial_request_text_regenerated.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_authorization_intake_preflight.js",
  "scripts/validate_exact_new_trial_intake_field_resolution.js",
  "scripts/validate_exact_new_trial_request_text_regenerated.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_authorization_intake_preflight.example.json",
  "tests/schema_examples/exact_new_trial_authorization_intake_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_intake_field_resolution.example.json",
  "tests/schema_examples/exact_new_trial_intake_field_resolution_fail.example.json",
  "tests/schema_examples/exact_new_trial_request_text_regenerated.example.json",
  "tests/schema_examples/exact_new_trial_request_text_regenerated_fail.example.json"
].sort();

const EXPECTED_V0_6_10_EXACT_NEW_TRIAL_HUMAN_DECISION_PREVIEW_GATE_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_10_EXACT_NEW_TRIAL_HUMAN_DECISION_PREVIEW_GATE.md",
  "reports/visual_asset_eval_dry_run/v0_6_10_exact_new_trial_human_decision_preview_gate.json",
  "schemas/exact_new_trial_human_decision_preview_gate.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_human_decision_preview_gate.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_human_decision_preview_gate.example.json",
  "tests/schema_examples/exact_new_trial_human_decision_preview_gate_fail.example.json"
].sort();

const EXPECTED_V0_6_11_EXACT_NEW_TRIAL_PREFLIGHT_AUTHORIZATION_GATE_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_10_EXACT_NEW_TRIAL_HUMAN_DECISION_PREVIEW_GATE.md",
  "docs/V0_6_11_EXACT_NEW_TRIAL_PREFLIGHT_AUTHORIZATION_GATE.md",
  "reports/visual_asset_eval_dry_run/v0_6_10_exact_new_trial_human_decision_preview_gate.json",
  "reports/visual_asset_eval_dry_run/v0_6_11_exact_new_trial_preflight_authorization_gate.json",
  "schemas/exact_new_trial_human_decision_preview_gate.schema.yaml",
  "schemas/exact_new_trial_preflight_authorization_gate.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_human_decision_preview_gate.js",
  "scripts/validate_exact_new_trial_preflight_authorization_gate.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_human_decision_preview_gate.example.json",
  "tests/schema_examples/exact_new_trial_human_decision_preview_gate_fail.example.json",
  "tests/schema_examples/exact_new_trial_preflight_authorization_gate.example.json",
  "tests/schema_examples/exact_new_trial_preflight_authorization_gate_fail.example.json"
].sort();

const EXPECTED_V0_6_11_POST_PULL_CLEANUP_SLICE = [
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1"
].sort();

const EXPECTED_V0_6_12_LOCAL_PREFLIGHT_ONLY_GATE_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_12_LOCAL_PREFLIGHT_ONLY_GATE.md",
  "reports/visual_asset_eval_dry_run/v0_6_12_local_preflight_only_gate.json",
  "schemas/exact_new_trial_local_preflight_only_gate.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_local_preflight_only_gate.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_local_preflight_only_gate.example.json",
  "tests/schema_examples/exact_new_trial_local_preflight_only_gate_fail.example.json"
].sort();

const EXPECTED_V0_6_13_FAILED_PROVIDER_ATTEMPT_REVIEW_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_13_FAILED_PROVIDER_ATTEMPT_REVIEW.md",
  "reports/visual_asset_eval_dry_run/v0_6_13_failed_provider_attempt_review.json",
  "schemas/exact_new_trial_failed_provider_attempt_review.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_failed_provider_attempt_review.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_failed_provider_attempt_review.example.json",
  "tests/schema_examples/exact_new_trial_failed_provider_attempt_review_fail.example.json"
].sort();

const EXPECTED_V0_6_12_AND_V0_6_13_WEEK1_PREFLIGHT_AND_FAILED_REVIEW_SLICE = Array.from(new Set([
  ...EXPECTED_V0_6_12_LOCAL_PREFLIGHT_ONLY_GATE_SLICE,
  ...EXPECTED_V0_6_13_FAILED_PROVIDER_ATTEMPT_REVIEW_SLICE
])).sort();

const EXPECTED_V0_6_14_EXACT_NEW_TRIAL_ACTION_PACKET_V0_1_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_14_EXACT_NEW_TRIAL_ACTION_PACKET_V0_1.md",
  "reports/visual_asset_eval_dry_run/v0_6_14_exact_new_trial_action_packet_v0_1.json",
  "schemas/exact_new_trial_action_packet_v0_1.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_action_packet_v0_1.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_action_packet_v0_1.example.json",
  "tests/schema_examples/exact_new_trial_action_packet_v0_1_fail.example.json"
].sort();

const EXPECTED_V0_6_15_EXACT_NEW_TRIAL_NOOP_REHEARSAL_HUMAN_APPROVAL_GATE_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_15_EXACT_NEW_TRIAL_NOOP_REHEARSAL_HUMAN_APPROVAL_GATE.md",
  "reports/visual_asset_eval_dry_run/v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate.json",
  "schemas/exact_new_trial_noop_rehearsal_human_approval_gate.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_noop_rehearsal_human_approval_gate.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_noop_rehearsal_human_approval_gate.example.json",
  "tests/schema_examples/exact_new_trial_noop_rehearsal_human_approval_gate_fail.example.json"
].sort();

const EXPECTED_V0_6_16_EXACT_NEW_TRIAL_HUMAN_APPROVAL_INTAKE_VALIDATOR_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_16_EXACT_NEW_TRIAL_HUMAN_APPROVAL_INTAKE_VALIDATOR.md",
  "reports/visual_asset_eval_dry_run/v0_6_16_exact_new_trial_human_approval_intake_validator.json",
  "schemas/exact_new_trial_human_approval_intake_validator.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_human_approval_intake_validator.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_human_approval_intake_validator.example.json",
  "tests/schema_examples/exact_new_trial_human_approval_intake_validator_fail.example.json"
].sort();

const EXPECTED_V0_6_17_30_DAY_EXACT_NEW_TRIAL_CHECKPOINT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "30_DAY_EXACT_NEW_TRIAL_CHECKPOINT.md",
  "docs/00_project_roadmap.md",
  "reports/visual_asset_eval_dry_run/v0_6_17_30_day_exact_new_trial_checkpoint.json",
  "schemas/exact_new_trial_30_day_checkpoint.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_30_day_checkpoint.js",
  "scripts/validate_local_commit_scope.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_30_day_checkpoint.example.json",
  "tests/schema_examples/exact_new_trial_30_day_checkpoint_fail.example.json"
].sort();

const EXPECTED_V0_6_18_SINGLE_GENERATION_EXECUTION_PREFLIGHT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_18_SINGLE_GENERATION_EXECUTION_PREFLIGHT.md",
  "reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json",
  "reports/visual_asset_eval_dry_run/v0_6_18_single_generation_execution_preflight.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001/bridge_entry.json",
  "runs/real_generation/v0_3_3_exact_new_trial_001/generation_attempt_result.json",
  "schemas/exact_new_trial_single_generation_execution_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_exact_new_trial_single_generation_execution_preflight.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_single_generation_execution_preflight.example.json",
  "tests/schema_examples/exact_new_trial_single_generation_execution_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_12_TO_V0_6_14_EXACT_NEW_TRIAL_PREP_SLICE = Array.from(new Set([
  ...EXPECTED_V0_6_12_LOCAL_PREFLIGHT_ONLY_GATE_SLICE,
  ...EXPECTED_V0_6_13_FAILED_PROVIDER_ATTEMPT_REVIEW_SLICE,
  ...EXPECTED_V0_6_14_EXACT_NEW_TRIAL_ACTION_PACKET_V0_1_SLICE
])).sort();

const EXPECTED_V0_6_12_TO_V0_6_15_EXACT_NEW_TRIAL_PREPARATION_LOOP_SLICE = Array.from(new Set([
  ...EXPECTED_V0_6_12_TO_V0_6_14_EXACT_NEW_TRIAL_PREP_SLICE,
  ...EXPECTED_V0_6_15_EXACT_NEW_TRIAL_NOOP_REHEARSAL_HUMAN_APPROVAL_GATE_SLICE
])).sort();

const EXPECTED_V0_6_12_TO_V0_6_16_EXACT_NEW_TRIAL_AUDITABLE_PREPARATION_LOOP_SLICE = Array.from(new Set([
  ...EXPECTED_V0_6_12_TO_V0_6_15_EXACT_NEW_TRIAL_PREPARATION_LOOP_SLICE,
  ...EXPECTED_V0_6_16_EXACT_NEW_TRIAL_HUMAN_APPROVAL_INTAKE_VALIDATOR_SLICE
])).sort();

const EXPECTED_V0_6_12_TO_V0_6_17_EXACT_NEW_TRIAL_30_DAY_CLOSED_LOOP_SLICE = Array.from(new Set([
  ...EXPECTED_V0_6_12_TO_V0_6_16_EXACT_NEW_TRIAL_AUDITABLE_PREPARATION_LOOP_SLICE,
  ...EXPECTED_V0_6_17_30_DAY_EXACT_NEW_TRIAL_CHECKPOINT_SLICE
])).sort();

const EXPECTED_V0_6_12_TO_V0_6_18_EXACT_NEW_TRIAL_EXECUTION_PREFLIGHT_SLICE = Array.from(new Set([
  ...EXPECTED_V0_6_12_TO_V0_6_17_EXACT_NEW_TRIAL_30_DAY_CLOSED_LOOP_SLICE,
  ...EXPECTED_V0_6_18_SINGLE_GENERATION_EXECUTION_PREFLIGHT_SLICE
])).sort();

const EXPECTED_V0_6_12_TO_V0_6_20_FAILED_NO_IMAGE_POST_RUN_REVIEW_SLICE = Array.from(new Set([
  ...EXPECTED_V0_6_12_TO_V0_6_18_EXACT_NEW_TRIAL_EXECUTION_PREFLIGHT_SLICE,
  "docs/V0_6_20_FAILED_NO_IMAGE_GENERATED_POST_RUN_REVIEW.md",
  "reports/visual_asset_eval_dry_run/v0_6_20_failed_no_image_generated_post_run_review.json"
])).sort();

const EXPECTED_V0_6_12_TO_V0_6_21_RAW_PROVIDER_PAYLOAD_CAPTURE_POLICY_SLICE = Array.from(new Set([
  ...EXPECTED_V0_6_12_TO_V0_6_20_FAILED_NO_IMAGE_POST_RUN_REVIEW_SLICE,
  "docs/V0_6_21_RAW_PROVIDER_PAYLOAD_CAPTURE_STANDING_DIAGNOSTIC_POLICY.md",
  "reports/visual_asset_eval_dry_run/v0_6_21_raw_provider_payload_capture_standing_diagnostic_policy.json"
])).sort();

const EXPECTED_V0_6_12_TO_V0_6_22_PROVIDER_PAYLOAD_EXTRACTION_PREFLIGHT_SLICE = Array.from(new Set([
  ...EXPECTED_V0_6_12_TO_V0_6_21_RAW_PROVIDER_PAYLOAD_CAPTURE_POLICY_SLICE,
  "docs/V0_6_22_PROVIDER_PAYLOAD_EXTRACTION_PREFLIGHT.md",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_001_request_payload.sanitized.json",
  "reports/visual_asset_eval_dry_run/v0_6_22_provider_payload_extraction_preflight.json",
  "scripts/create_provider_payload_capture_preflight.js",
  "scripts/validate_provider_payload_capture_preflight.js"
])).sort();

const EXPECTED_V0_6_12_TO_V0_6_23_SINGLE_GENERATION_WITH_PAYLOAD_TRACE_SLICE = Array.from(new Set([
  ...EXPECTED_V0_6_12_TO_V0_6_22_PROVIDER_PAYLOAD_EXTRACTION_PREFLIGHT_SLICE,
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_002_request_payload.sanitized.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_002_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_002_registry.json",
  "reports/visual_asset_eval_dry_run/v0_6_23_single_generation_with_payload_capture_and_artifact_trace.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_002/bridge_entry.json",
  "runs/real_generation/v0_3_3_exact_new_trial_002/generation_attempt_result.json"
])).sort();

const EXPECTED_V0_6_24_EXACT_NEW_TRIAL_3SHOT_STABILITY_PREFLIGHT_SLICE = [
  ".agent_board/AUTOPILOT_LEDGER.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/V0_6_24_EXACT_NEW_TRIAL_3SHOT_STABILITY_PREFLIGHT.md",
  "docs/00_project_roadmap.md",
  "reports/visual_asset_eval_dry_run/v0_6_24_exact_new_trial_3shot_stability_preflight.json",
  "schemas/exact_new_trial_3shot_stability_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_3shot_stability_preflight.js",
  "scripts/validate_mvp.ps1",
  "stability_tests/README.md",
  "stability_tests/plans/safe_adult_editorial_portrait_v1_3shot_stability_preflight.yaml",
  "stability_tests/three_shot_stability_plan_registry.yaml",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/exact_new_trial_3shot_stability_preflight.example.json",
  "tests/schema_examples/exact_new_trial_3shot_stability_preflight_fail.json"
].sort();

const EXPECTED_V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW.md",
  "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json",
  "schemas/exact_new_trial_artifact_persistence_truth_review.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_artifact_persistence_truth_review.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review_fail.example.json"
].sort();

const EXPECTED_V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW.md",
  "docs/V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT.md",
  "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json",
  "reports/visual_asset_eval_dry_run/v0_6_26_exact_new_trial_local_persistence_repair_preflight.json",
  "schemas/exact_new_trial_artifact_persistence_truth_review.schema.yaml",
  "schemas/exact_new_trial_local_persistence_repair_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_artifact_persistence_truth_review.js",
  "scripts/validate_exact_new_trial_local_persistence_repair_preflight.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review_fail.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_27_EXACT_NEW_TRIAL_003_SHOT_1_EXECUTION_CLOSEOUT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW.md",
  "docs/V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT.md",
  "docs/V0_6_27_EXACT_NEW_TRIAL_003_SHOT_1_EXECUTION_CLOSEOUT.md",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_1_request_payload.sanitized.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_registry.json",
  "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json",
  "reports/visual_asset_eval_dry_run/v0_6_26_exact_new_trial_local_persistence_repair_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_27_exact_new_trial_003_shot_1_execution_closeout.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_1/bridge_entry.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/generation_attempt_result.json",
  "schemas/exact_new_trial_artifact_persistence_truth_review.schema.yaml",
  "schemas/exact_new_trial_local_persistence_repair_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_exact_new_trial_003_shot_1_execution_closeout.js",
  "scripts/validate_exact_new_trial_3shot_stability_preflight.js",
  "scripts/validate_exact_new_trial_artifact_persistence_truth_review.js",
  "scripts/validate_exact_new_trial_local_persistence_repair_preflight.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review_fail.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_28_EXACT_NEW_TRIAL_003_SHOT_2_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW.md",
  "docs/V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT.md",
  "docs/V0_6_27_EXACT_NEW_TRIAL_003_SHOT_1_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_28_EXACT_NEW_TRIAL_003_SHOT_2_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT.md",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_1_request_payload.sanitized.json",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_2_request_payload.sanitized.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_registry.json",
  "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json",
  "reports/visual_asset_eval_dry_run/v0_6_26_exact_new_trial_local_persistence_repair_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_27_exact_new_trial_003_shot_1_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_1/bridge_entry.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/generation_attempt_result.json",
  "schemas/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.schema.yaml",
  "schemas/exact_new_trial_artifact_persistence_truth_review.schema.yaml",
  "schemas/exact_new_trial_local_persistence_repair_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_exact_new_trial_003_shot_1_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_3shot_stability_preflight.js",
  "scripts/validate_exact_new_trial_artifact_persistence_truth_review.js",
  "scripts/validate_exact_new_trial_local_persistence_repair_preflight.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review_fail.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_29_EXACT_NEW_TRIAL_003_SHOT_2_EXECUTION_CLOSEOUT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW.md",
  "docs/V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT.md",
  "docs/V0_6_27_EXACT_NEW_TRIAL_003_SHOT_1_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_28_EXACT_NEW_TRIAL_003_SHOT_2_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT.md",
  "docs/V0_6_29_EXACT_NEW_TRIAL_003_SHOT_2_EXECUTION_CLOSEOUT.md",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_1_request_payload.sanitized.json",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_2_request_payload.sanitized.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_registry.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_registry.json",
  "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json",
  "reports/visual_asset_eval_dry_run/v0_6_26_exact_new_trial_local_persistence_repair_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_27_exact_new_trial_003_shot_1_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_1/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_2/bridge_entry.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/generation_attempt_result.json",
  "schemas/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.schema.yaml",
  "schemas/exact_new_trial_artifact_persistence_truth_review.schema.yaml",
  "schemas/exact_new_trial_local_persistence_repair_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_exact_new_trial_003_shot_1_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_3shot_stability_preflight.js",
  "scripts/validate_exact_new_trial_artifact_persistence_truth_review.js",
  "scripts/validate_exact_new_trial_local_persistence_repair_preflight.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review_fail.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_30_EXACT_NEW_TRIAL_003_SHOT_3_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW.md",
  "docs/V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT.md",
  "docs/V0_6_27_EXACT_NEW_TRIAL_003_SHOT_1_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_28_EXACT_NEW_TRIAL_003_SHOT_2_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT.md",
  "docs/V0_6_29_EXACT_NEW_TRIAL_003_SHOT_2_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_30_EXACT_NEW_TRIAL_003_SHOT_3_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT.md",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_1_request_payload.sanitized.json",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_2_request_payload.sanitized.json",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_3_request_payload.sanitized.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_registry.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_registry.json",
  "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json",
  "reports/visual_asset_eval_dry_run/v0_6_26_exact_new_trial_local_persistence_repair_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_27_exact_new_trial_003_shot_1_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_1/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_2/bridge_entry.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/generation_attempt_result.json",
  "schemas/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.schema.yaml",
  "schemas/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.schema.yaml",
  "schemas/exact_new_trial_artifact_persistence_truth_review.schema.yaml",
  "schemas/exact_new_trial_local_persistence_repair_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_exact_new_trial_003_shot_1_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_3shot_stability_preflight.js",
  "scripts/validate_exact_new_trial_artifact_persistence_truth_review.js",
  "scripts/validate_exact_new_trial_local_persistence_repair_preflight.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review_fail.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_31_EXACT_NEW_TRIAL_003_SHOT_3_EXECUTION_CLOSEOUT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW.md",
  "docs/V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT.md",
  "docs/V0_6_27_EXACT_NEW_TRIAL_003_SHOT_1_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_28_EXACT_NEW_TRIAL_003_SHOT_2_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT.md",
  "docs/V0_6_29_EXACT_NEW_TRIAL_003_SHOT_2_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_30_EXACT_NEW_TRIAL_003_SHOT_3_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT.md",
  "docs/V0_6_31_EXACT_NEW_TRIAL_003_SHOT_3_EXECUTION_CLOSEOUT.md",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_1_request_payload.sanitized.json",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_2_request_payload.sanitized.json",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_3_request_payload.sanitized.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_registry.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_registry.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_registry.json",
  "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json",
  "reports/visual_asset_eval_dry_run/v0_6_26_exact_new_trial_local_persistence_repair_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_27_exact_new_trial_003_shot_1_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_31_exact_new_trial_003_shot_3_execution_closeout.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_1/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_2/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_3/bridge_entry.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_3/generation_attempt_result.json",
  "schemas/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.schema.yaml",
  "schemas/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.schema.yaml",
  "schemas/exact_new_trial_artifact_persistence_truth_review.schema.yaml",
  "schemas/exact_new_trial_local_persistence_repair_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_exact_new_trial_003_shot_1_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_003_shot_3_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_3shot_stability_preflight.js",
  "scripts/validate_exact_new_trial_artifact_persistence_truth_review.js",
  "scripts/validate_exact_new_trial_local_persistence_repair_preflight.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review_fail.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_32_EXACT_NEW_TRIAL_003_HUMAN_REVIEW_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW.md",
  "docs/V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT.md",
  "docs/V0_6_27_EXACT_NEW_TRIAL_003_SHOT_1_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_28_EXACT_NEW_TRIAL_003_SHOT_2_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT.md",
  "docs/V0_6_29_EXACT_NEW_TRIAL_003_SHOT_2_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_30_EXACT_NEW_TRIAL_003_SHOT_3_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT.md",
  "docs/V0_6_31_EXACT_NEW_TRIAL_003_SHOT_3_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_32_EXACT_NEW_TRIAL_003_HUMAN_REVIEW.md",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_1_request_payload.sanitized.json",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_2_request_payload.sanitized.json",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_3_request_payload.sanitized.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_registry.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_registry.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_registry.json",
  "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json",
  "reports/visual_asset_eval_dry_run/v0_6_26_exact_new_trial_local_persistence_repair_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_27_exact_new_trial_003_shot_1_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_31_exact_new_trial_003_shot_3_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_1/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_2/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_3/bridge_entry.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_3/generation_attempt_result.json",
  "schemas/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.schema.yaml",
  "schemas/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.schema.yaml",
  "schemas/exact_new_trial_artifact_persistence_truth_review.schema.yaml",
  "schemas/exact_new_trial_local_persistence_repair_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_exact_new_trial_003_human_review.js",
  "scripts/validate_exact_new_trial_003_shot_1_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_003_shot_3_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_3shot_stability_preflight.js",
  "scripts/validate_exact_new_trial_artifact_persistence_truth_review.js",
  "scripts/validate_exact_new_trial_local_persistence_repair_preflight.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js",
  "tests/schema_examples/exact_new_trial_003_human_review.example.json",
  "tests/schema_examples/exact_new_trial_003_human_review_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review_fail.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_33_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_HUMAN_APPROVAL_INTAKE_PACKAGE_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW.md",
  "docs/V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT.md",
  "docs/V0_6_27_EXACT_NEW_TRIAL_003_SHOT_1_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_28_EXACT_NEW_TRIAL_003_SHOT_2_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT.md",
  "docs/V0_6_29_EXACT_NEW_TRIAL_003_SHOT_2_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_30_EXACT_NEW_TRIAL_003_SHOT_3_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT.md",
  "docs/V0_6_31_EXACT_NEW_TRIAL_003_SHOT_3_EXECUTION_CLOSEOUT.md",
  "docs/V0_6_32_EXACT_NEW_TRIAL_003_HUMAN_REVIEW.md",
  "docs/V0_6_33_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_HUMAN_APPROVAL_INTAKE_PACKAGE.md",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_1_request_payload.sanitized.json",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_2_request_payload.sanitized.json",
  "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_3_request_payload.sanitized.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_registry.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_registry.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_registry.json",
  "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json",
  "reports/visual_asset_eval_dry_run/v0_6_26_exact_new_trial_local_persistence_repair_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_27_exact_new_trial_003_shot_1_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.json",
  "reports/visual_asset_eval_dry_run/v0_6_31_exact_new_trial_003_shot_3_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  "reports/visual_asset_eval_dry_run/v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_1/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_2/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_3/bridge_entry.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_exact_new_trial_003_shot_3/generation_attempt_result.json",
  "schemas/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.schema.yaml",
  "schemas/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.schema.yaml",
  "schemas/exact_new_trial_artifact_persistence_truth_review.schema.yaml",
  "schemas/exact_new_trial_local_persistence_repair_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_exact_new_trial_003_human_review.js",
  "scripts/validate_exact_new_trial_003_selected_candidate_human_approval_intake_package.js",
  "scripts/validate_exact_new_trial_003_shot_1_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_003_shot_3_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_3shot_stability_preflight.js",
  "scripts/validate_exact_new_trial_artifact_persistence_truth_review.js",
  "scripts/validate_exact_new_trial_local_persistence_repair_preflight.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js",
  "tests/schema_examples/exact_new_trial_003_human_review.example.json",
  "tests/schema_examples/exact_new_trial_003_human_review_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_selected_candidate_human_approval_intake_package.example.json",
  "tests/schema_examples/exact_new_trial_003_selected_candidate_human_approval_intake_package_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_1_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_2_pre_call_payload_capture_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_execution_closeout.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_execution_closeout_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight_fail.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review.example.json",
  "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review_fail.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight.example.json",
  "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_34_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_POST_APPROVAL_GATE_ALIGNMENT_SLICE = [
  ...EXPECTED_V0_6_33_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_HUMAN_APPROVAL_INTAKE_PACKAGE_SLICE,
  "docs/V0_6_34_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_POST_APPROVAL_GATE_ALIGNMENT.md",
  "reports/visual_asset_eval_dry_run/v0_6_34_exact_new_trial_003_selected_candidate_post_approval_gate_alignment.json",
  "scripts/validate_exact_new_trial_003_selected_candidate_post_approval_gate_alignment.js",
  "tests/schema_examples/exact_new_trial_003_selected_candidate_post_approval_gate_alignment.example.json",
  "tests/schema_examples/exact_new_trial_003_selected_candidate_post_approval_gate_alignment_fail.example.json"
].sort();

const EXPECTED_V0_6_35_EXACT_NEW_TRIAL_003_POST_APPROVAL_REGISTRATION_PREFLIGHT_DRAFT_SLICE = [
  ...EXPECTED_V0_6_34_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_POST_APPROVAL_GATE_ALIGNMENT_SLICE,
  "docs/V0_6_35_EXACT_NEW_TRIAL_003_POST_APPROVAL_REGISTRATION_PREFLIGHT_DRAFT.md",
  "reports/visual_asset_eval_dry_run/v0_6_35_exact_new_trial_003_post_approval_registration_preflight_draft.json",
  "scripts/validate_exact_new_trial_003_post_approval_registration_preflight_draft.js",
  "tests/schema_examples/exact_new_trial_003_post_approval_registration_preflight_draft.example.json",
  "tests/schema_examples/exact_new_trial_003_post_approval_registration_preflight_draft_fail.example.json"
].sort();

const EXPECTED_V0_6_36_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_REGISTRATION_AUTHORIZATION_PACKAGE_DRAFT_SLICE = [
  ...EXPECTED_V0_6_35_EXACT_NEW_TRIAL_003_POST_APPROVAL_REGISTRATION_PREFLIGHT_DRAFT_SLICE,
  "docs/V0_6_36_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_REGISTRATION_AUTHORIZATION_PACKAGE_DRAFT.md",
  "reports/visual_asset_eval_dry_run/v0_6_36_exact_new_trial_003_accepted_samples_registration_authorization_package_draft.json",
  "scripts/validate_exact_new_trial_003_accepted_samples_registration_authorization_package_draft.js",
  "tests/schema_examples/exact_new_trial_003_accepted_samples_registration_authorization_package_draft.example.json",
  "tests/schema_examples/exact_new_trial_003_accepted_samples_registration_authorization_package_draft_fail.example.json"
].sort();

const EXPECTED_V0_6_37_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_REGISTRATION_EXECUTION_PREFLIGHT_SLICE = [
  ...EXPECTED_V0_6_36_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_REGISTRATION_AUTHORIZATION_PACKAGE_DRAFT_SLICE,
  "docs/V0_6_37_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_REGISTRATION_EXECUTION_PREFLIGHT.md",
  "reports/visual_asset_eval_dry_run/v0_6_37_exact_new_trial_003_accepted_samples_registration_execution_preflight.json",
  "scripts/validate_exact_new_trial_003_accepted_samples_registration_execution_preflight.js",
  "tests/schema_examples/exact_new_trial_003_accepted_samples_registration_execution_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_accepted_samples_registration_execution_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_38_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT_SLICE = [
  ...EXPECTED_V0_6_37_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_REGISTRATION_EXECUTION_PREFLIGHT_SLICE,
  "docs/V0_6_38_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT.md",
  "reports/visual_asset_eval_dry_run/v0_6_38_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.json",
  "scripts/validate_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.js",
  "tests/schema_examples/exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_durable_archive_authorization_compiler_output_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_39_EXACT_NEW_TRIAL_003_PRODUCTION_CANDIDATE_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT_SLICE = [
  ...EXPECTED_V0_6_38_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT_SLICE,
  "docs/V0_6_39_EXACT_NEW_TRIAL_003_PRODUCTION_CANDIDATE_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT.md",
  "reports/visual_asset_eval_dry_run/v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.json",
  "scripts/validate_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.js",
  "tests/schema_examples/exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_production_candidate_authorization_compiler_output_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_40_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT_SLICE = [
  ...EXPECTED_V0_6_39_EXACT_NEW_TRIAL_003_PRODUCTION_CANDIDATE_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT_SLICE,
  "docs/V0_6_40_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT.md",
  "reports/visual_asset_eval_dry_run/v0_6_40_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight.json",
  "scripts/validate_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight.js",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_41_EXACT_NEW_TRIAL_003_MEMORY_DELTA_DRAFT_PACKAGE_SLICE = [
  ...EXPECTED_V0_6_40_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT_SLICE,
  "docs/V0_6_41_EXACT_NEW_TRIAL_003_MEMORY_DELTA_DRAFT_PACKAGE.md",
  "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml",
  "reports/visual_asset_eval_dry_run/v0_6_41_exact_new_trial_003_memory_delta_draft_package.json",
  "scripts/validate_exact_new_trial_003_memory_delta_draft_package.js",
  "tests/schema_examples/exact_new_trial_003_memory_delta_draft_package.example.yaml",
  "tests/schema_examples/exact_new_trial_003_memory_delta_draft_package_fail.example.yaml"
].sort();

const EXPECTED_V0_6_42_EXACT_NEW_TRIAL_003_SENSITIVE_DATA_SCAN_PREFLIGHT_SLICE = [
  ...EXPECTED_V0_6_41_EXACT_NEW_TRIAL_003_MEMORY_DELTA_DRAFT_PACKAGE_SLICE,
  "docs/V0_6_42_EXACT_NEW_TRIAL_003_SENSITIVE_DATA_SCAN_PREFLIGHT.md",
  "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json",
  "reports/visual_asset_eval_dry_run/v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight.json",
  "scripts/validate_exact_new_trial_003_sensitive_data_scan_preflight.js",
  "tests/schema_examples/exact_new_trial_003_sensitive_data_scan_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_sensitive_data_scan_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_43_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_AUTHORIZATION_COMPILER_OUTPUT_REFRESH_PREFLIGHT_SLICE = [
  ...EXPECTED_V0_6_42_EXACT_NEW_TRIAL_003_SENSITIVE_DATA_SCAN_PREFLIGHT_SLICE,
  "docs/V0_6_43_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_AUTHORIZATION_COMPILER_OUTPUT_REFRESH_PREFLIGHT.md",
  "reports/visual_asset_eval_dry_run/v0_6_43_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight.json",
  "scripts/validate_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight.js",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_44_EXACT_NEW_TRIAL_003_EXACT_ALLOWED_MEMORY_TARGETS_PACKAGE_SLICE = [
  ...EXPECTED_V0_6_43_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_AUTHORIZATION_COMPILER_OUTPUT_REFRESH_PREFLIGHT_SLICE,
  "docs/V0_6_44_EXACT_NEW_TRIAL_003_EXACT_ALLOWED_MEMORY_TARGETS_PACKAGE.md",
  "reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json",
  "reports/visual_asset_eval_dry_run/v0_6_44_exact_new_trial_003_exact_allowed_memory_targets_package.json",
  "scripts/validate_exact_new_trial_003_exact_allowed_memory_targets_package.js",
  "tests/schema_examples/exact_new_trial_003_exact_allowed_memory_targets_package.example.json",
  "tests/schema_examples/exact_new_trial_003_exact_allowed_memory_targets_package_fail.example.json"
].sort();

const EXPECTED_V0_6_45_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_AUTHORIZATION_PACKAGE_DRAFT_SLICE = [
  ...EXPECTED_V0_6_44_EXACT_NEW_TRIAL_003_EXACT_ALLOWED_MEMORY_TARGETS_PACKAGE_SLICE,
  "docs/V0_6_45_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_AUTHORIZATION_PACKAGE_DRAFT.md",
  "reports/memory_write_authorization/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_authorization_package_draft.json",
  "reports/visual_asset_eval_dry_run/v0_6_45_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft.json",
  "scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft.js",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft.example.json",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft_fail.example.json"
].sort();

const EXPECTED_V0_6_46_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_EXECUTION_PREFLIGHT_SLICE = [
  ...EXPECTED_V0_6_45_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_AUTHORIZATION_PACKAGE_DRAFT_SLICE,
  "docs/V0_6_46_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_EXECUTION_PREFLIGHT.md",
  "reports/visual_asset_eval_dry_run/v0_6_46_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight.json",
  "scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight.js",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_47_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_PAYLOAD_REFRESH_PACKAGE_SLICE = [
  ...EXPECTED_V0_6_46_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_EXECUTION_PREFLIGHT_SLICE,
  "docs/V0_6_47_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_PAYLOAD_REFRESH_PACKAGE.md",
  "reports/memory_write_payloads/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_payload_refresh_package.json",
  "reports/visual_asset_eval_dry_run/v0_6_47_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package.json",
  "scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package.js",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package.example.json",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package_fail.example.json"
].sort();

const EXPECTED_V0_6_48_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_RECEIPT_CONTRACT_SLICE = [
  ...EXPECTED_V0_6_47_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_PAYLOAD_REFRESH_PACKAGE_SLICE,
  "docs/V0_6_48_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_RECEIPT_CONTRACT.md",
  "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_receipt_contract.json",
  "reports/visual_asset_eval_dry_run/v0_6_48_exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract.json",
  "scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract.js",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract.example.json",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract_fail.example.json"
].sort();

const EXPECTED_V0_6_49_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_REGISTRY_CONTRACT_SLICE = [
  ...EXPECTED_V0_6_48_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_RECEIPT_CONTRACT_SLICE,
  "docs/V0_6_49_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_REGISTRY_CONTRACT.md",
  "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_registry_contract.json",
  "reports/visual_asset_eval_dry_run/v0_6_49_exact_new_trial_003_daily_note_vcp_memory_write_registry_contract.json",
  "scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_registry_contract.js",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_registry_contract.example.json",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_registry_contract_fail.example.json"
].sort();

const EXPECTED_V0_6_50_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_GO_NO_GO_CHECKPOINT_SLICE = [
  ...EXPECTED_V0_6_49_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_REGISTRY_CONTRACT_SLICE,
  "docs/V0_6_50_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_GO_NO_GO_CHECKPOINT.md",
  "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_go_no_go_checkpoint.json",
  "reports/visual_asset_eval_dry_run/v0_6_50_exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint.json",
  "scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint.js",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint.example.json",
  "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint_fail.example.json"
].sort();

const EXPECTED_V0_6_51_EXACT_NEW_TRIAL_003_WORKFLOW_PREREQUISITE_RECONCILIATION_PACKET_SLICE = [
  ...EXPECTED_V0_6_50_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_GO_NO_GO_CHECKPOINT_SLICE,
  "docs/V0_6_51_EXACT_NEW_TRIAL_003_WORKFLOW_PREREQUISITE_RECONCILIATION_PACKET.md",
  "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_workflow_prerequisite_reconciliation_packet.json",
  "reports/visual_asset_eval_dry_run/v0_6_51_exact_new_trial_003_workflow_prerequisite_reconciliation_packet.json",
  "scripts/validate_exact_new_trial_003_workflow_prerequisite_reconciliation_packet.js",
  "tests/schema_examples/exact_new_trial_003_workflow_prerequisite_reconciliation_packet.example.json",
  "tests/schema_examples/exact_new_trial_003_workflow_prerequisite_reconciliation_packet_fail.example.json"
].sort();

const EXPECTED_V0_6_52_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_PACKET_SLICE = [
  ...EXPECTED_V0_6_51_EXACT_NEW_TRIAL_003_WORKFLOW_PREREQUISITE_RECONCILIATION_PACKET_SLICE,
  "docs/V0_6_52_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_PACKET.md",
  "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_capture_packet.json",
  "reports/visual_asset_eval_dry_run/v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet.json",
  "scripts/validate_exact_new_trial_003_formal_human_approval_evidence_capture_packet.js",
  "tests/schema_examples/exact_new_trial_003_formal_human_approval_evidence_capture_packet.example.json",
  "tests/schema_examples/exact_new_trial_003_formal_human_approval_evidence_capture_packet_fail.example.json"
].sort();

const EXPECTED_V0_6_53_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_CAPTURE_SURFACE_STATIC_PANEL_SLICE = [
  ...EXPECTED_V0_6_52_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_PACKET_SLICE,
  "docs/V0_6_53_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_CAPTURE_SURFACE_STATIC_PANEL.md",
  "reports/visual_asset_eval_dry_run/v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel.json",
  "review_console/static_prototype/app.js",
  "review_console/static_prototype/index.html",
  "review_console/static_prototype/mock_data.js",
  "review_console/static_prototype/styles.css",
  "scripts/validate_exact_new_trial_003_formal_human_approval_capture_surface_static_panel.js",
  "tests/schema_examples/exact_new_trial_003_formal_human_approval_capture_surface_static_panel.example.json",
  "tests/schema_examples/exact_new_trial_003_formal_human_approval_capture_surface_static_panel_fail.example.json"
].sort();

const EXPECTED_V0_6_54_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_INGESTION_PACKET_SLICE = [
  ...EXPECTED_V0_6_53_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_CAPTURE_SURFACE_STATIC_PANEL_SLICE,
  "docs/V0_6_54_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_INGESTION_PACKET.md",
  "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_ingestion_packet.json",
  "reports/visual_asset_eval_dry_run/v0_6_54_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet.json",
  "scripts/validate_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet.js",
  "tests/schema_examples/exact_new_trial_003_formal_human_approval_evidence_ingestion_packet.example.json",
  "tests/schema_examples/exact_new_trial_003_formal_human_approval_evidence_ingestion_packet_fail.example.json"
].sort();

const EXPECTED_V0_6_55_EXACT_NEW_TRIAL_003_USER_SUBMITTED_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_SLICE = [
  ...EXPECTED_V0_6_54_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_INGESTION_PACKET_SLICE,
  "docs/V0_6_55_EXACT_NEW_TRIAL_003_USER_SUBMITTED_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE.md",
  "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json",
  "reports/visual_asset_eval_dry_run/v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.json",
  "scripts/validate_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.js",
  "tests/schema_examples/exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.example.json",
  "tests/schema_examples/exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture_fail.example.json"
].sort();

const EXPECTED_V0_6_56_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_METADATA_REGISTRATION_SLICE = [
  ...EXPECTED_V0_6_55_EXACT_NEW_TRIAL_003_USER_SUBMITTED_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_SLICE,
  "accepted_samples/accepted_sample_registry.yaml",
  "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  "docs/V0_6_56_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_METADATA_REGISTRATION.md",
  "docs/v14_142_multi_accepted_sample_matrix.md",
  "docs/v14_160_two_month_product_capability_closeout.md",
  "docs/v14_212_six_month_goal_prompt_to_artifact_completion_audit.md",
  "reports/visual_asset_eval_dry_run/v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration.json",
  "schemas/two_month_product_capability_closeout.schema.yaml",
  "scripts/validate_exact_new_trial_003_accepted_samples_metadata_registration.js",
  "scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js",
  "scripts/validate_v14_142_multi_accepted_sample_matrix.js",
  "scripts/validate_v14_143_import_review_registry_schema_hardening.js",
  "scripts/validate_v14_160_two_month_product_capability_closeout.js",
  "scripts/validate_v14_212_six_month_goal_prompt_to_artifact_completion_audit.js",
  "scripts/validate_v7_32_accepted_sample_registry_update.js",
  "tests/schema_examples/exact_new_trial_003_accepted_samples_metadata_registration.example.json",
  "tests/schema_examples/exact_new_trial_003_accepted_samples_metadata_registration_fail.example.json",
  "tests/schema_examples/v14_160_two_month_product_capability_closeout.example.yaml",
  "tests/schema_examples/v14_212_six_month_goal_prompt_to_artifact_completion_audit.example.json"
].sort();

const EXPECTED_V0_6_57_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_METADATA_PREFLIGHT_AFTER_ACCEPTED_SAMPLE_REGISTRATION_SLICE = [
  ...EXPECTED_V0_6_56_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_METADATA_REGISTRATION_SLICE,
  "docs/V0_6_57_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_METADATA_PREFLIGHT_AFTER_ACCEPTED_SAMPLE_REGISTRATION.md",
  "reports/visual_asset_eval_dry_run/v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration.json",
  "scripts/validate_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration.js",
  "tests/schema_examples/exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration.example.json",
  "tests/schema_examples/exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration_fail.example.json"
].sort();

const EXPECTED_V0_6_58_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_AUTHORIZATION_PACKAGE_AFTER_METADATA_PREFLIGHT_SLICE = [
  ...EXPECTED_V0_6_57_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_METADATA_PREFLIGHT_AFTER_ACCEPTED_SAMPLE_REGISTRATION_SLICE,
  "docs/V0_6_58_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_AUTHORIZATION_PACKAGE_AFTER_METADATA_PREFLIGHT.md",
  "reports/visual_asset_eval_dry_run/v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight.json",
  "scripts/validate_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight.js",
  "tests/schema_examples/exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight.example.json",
  "tests/schema_examples/exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight_fail.example.json"
].sort();

const EXPECTED_V0_6_59_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_PREFLIGHT_NO_WRITE_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_59_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_PREFLIGHT_NO_WRITE.md",
  "reports/visual_asset_eval_dry_run/v0_6_59_exact_new_trial_003_durable_archive_write_execution_preflight_no_write.json",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_003_durable_archive_write_execution_preflight_no_write.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_003_durable_archive_write_execution_preflight_no_write.example.json",
  "tests/schema_examples/exact_new_trial_003_durable_archive_write_execution_preflight_no_write_fail.example.json"
].sort();

const EXPECTED_V0_6_60_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_RECEIPT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/manifest.json",
  "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/original.png",
  "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/preview.webp",
  "docs/00_project_roadmap.md",
  "docs/V0_6_59_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_PREFLIGHT_NO_WRITE.md",
  "docs/V0_6_60_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_RECEIPT.md",
  "reports/visual_asset_eval_dry_run/v0_6_59_exact_new_trial_003_durable_archive_write_execution_preflight_no_write.json",
  "reports/visual_asset_eval_dry_run/v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt.json",
  "review_console/static_prototype/app.js",
  "review_console/static_prototype/mock_data.js",
  "scripts/lib/artifact_recoverability_core.js",
  "scripts/lib/capsule_manifest_contract.js",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_capsule_manifest_contract.js",
  "scripts/validate_capsule_operator_reviewer_action_matrix.js",
  "scripts/validate_capsule_registry_report_v2.js",
  "scripts/validate_capsule_static_operator_checklist_ui_mapping.js",
  "scripts/validate_capsule_static_product_smoke_fixture.js",
  "scripts/validate_capsule_static_product_smoke_review_console_snapshot.js",
  "scripts/validate_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration.js",
  "scripts/validate_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight.js",
  "scripts/validate_exact_new_trial_003_durable_archive_write_execution_preflight_no_write.js",
  "scripts/validate_exact_new_trial_003_durable_archive_write_execution_receipt.js",
  "scripts/validate_multi_capsule_dashboard.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_mvp_capsule_product_core.ps1",
  "scripts/validate_review_console_registry_report_v2_state.js",
  "scripts/validate_v14_165_bag_accepted_samples_metadata_registration.js",
  "tests/schema_examples/CAPSULE_OPERATOR_REVIEWER_ACTION_MATRIX.example.json",
  "tests/schema_examples/CAPSULE_STATIC_PRODUCT_SMOKE_REVIEW_CONSOLE_SNAPSHOT.example.json",
  "tests/schema_examples/CAPSULE_STATIC_PRODUCT_SMOKE_UNIFIED_CONTRACT.example.json",
  "tests/schema_examples/P6B_CAPSULE_REGISTRY_REPORT_V2.example.json",
  "tests/schema_examples/P6C_REVIEW_CONSOLE_REGISTRY_REPORT_V2_STATE.example.json",
  "tests/schema_examples/P6_MULTI_CAPSULE_ACCEPTED_FAILURE_DASHBOARD.example.json",
  "tests/schema_examples/exact_new_trial_003_durable_archive_write_execution_preflight_no_write.example.json",
  "tests/schema_examples/exact_new_trial_003_durable_archive_write_execution_preflight_no_write_fail.example.json",
  "tests/schema_examples/exact_new_trial_003_durable_archive_write_execution_receipt.example.json",
  "tests/schema_examples/exact_new_trial_003_durable_archive_write_execution_receipt_fail.example.json"
].sort();

const EXPECTED_V0_6_61_EXACT_NEW_TRIAL_003_CHINESE_MEMORY_ENTRY_READINESS_PREFLIGHT_NO_WRITE_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_61_EXACT_NEW_TRIAL_003_CHINESE_MEMORY_ENTRY_READINESS_PREFLIGHT_NO_WRITE.md",
  "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_chinese_memory_entry_readiness_preflight_no_write.json",
  "reports/visual_asset_eval_dry_run/v0_6_61_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write.json",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write.example.json",
  "tests/schema_examples/exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write_fail.example.json"
].sort();

const EXPECTED_V0_6_62_EXACT_NEW_TRIAL_003_AMBER_C_MEMORY_WRITE_TARGET_RESOLUTION_BLOCKED_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md",
  "docs/V0_6_62_EXACT_NEW_TRIAL_003_AMBER_C_MEMORY_WRITE_TARGET_RESOLUTION_BLOCKED.md",
  "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_amber_c_memory_write_target_resolution_blocked.json",
  "reports/visual_asset_eval_dry_run/v0_6_62_exact_new_trial_003_amber_c_memory_write_target_resolution_blocked.json",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_new_trial_003_amber_c_memory_write_target_resolution_blocked.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/exact_new_trial_003_amber_c_memory_write_target_resolution_blocked.example.json",
  "tests/schema_examples/exact_new_trial_003_amber_c_memory_write_target_resolution_blocked_fail.example.json"
].sort();

const EXPECTED_V0_6_63_VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  "schemas/vcp_agent_image_generation_request.schema.yaml",
  "schemas/vcp_agent_image_generation_response.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_vcp_agent_image_generation_tool_contract.js",
  "tests/schema_examples/vcp_agent_image_generation_request.example.yaml",
  "tests/schema_examples/vcp_agent_image_generation_request_fail.example.yaml"
].sort();

const EXPECTED_V0_6_64_VCP_AGENT_IMAGE_GENERATION_CONTRACT_MOCK_VALIDATION_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_CONTRACT_MOCK_VALIDATION.md",
  "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  "schemas/vcp_agent_image_generation_request.schema.yaml",
  "schemas/vcp_agent_image_generation_response.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_vcp_agent_image_generation_contract_mock.js",
  "scripts/validate_vcp_agent_image_generation_tool_contract.js",
  "tests/schema_examples/vcp_agent_image_generation_mock_blocked_cases.example.yaml",
  "tests/schema_examples/vcp_agent_image_generation_request.example.yaml",
  "tests/schema_examples/vcp_agent_image_generation_request_fail.example.yaml",
  "tests/schema_examples/vcp_agent_image_generation_response.example.yaml",
  "tests/schema_examples/vcp_agent_image_generation_response_fail.example.yaml"
].sort();

const EXPECTED_V0_6_65_VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_vcp_agent_generation_route_selection_gate.js",
  "tests/schema_examples/vcp_agent_generation_route_selection_gate.example.yaml"
].sort();

const EXPECTED_V0_6_66_CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT_ONLY_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md",
  "schemas/codex_session_image_import_preflight.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_codex_session_image_import_preflight.js",
  "tests/schema_examples/codex_session_image_import_preflight.example.yaml",
  "tests/schema_examples/codex_session_image_import_preflight_fail.example.yaml"
].sort();

const EXPECTED_V0_6_67_CODEX_SESSION_IMAGE_IMPORT_RECORD_CONTRACT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_RECORD_CONTRACT.md",
  "schemas/codex_session_image_import_record.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_codex_session_image_import_record_contract.js",
  "tests/schema_examples/codex_session_image_import_record.example.yaml",
  "tests/schema_examples/codex_session_image_import_record_fail.example.yaml"
].sort();

const EXPECTED_V0_6_68_CODEX_SESSION_IMAGE_IMPORT_RECORD_MOCK_VALIDATION_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_RECORD_MOCK_VALIDATION.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_codex_session_image_import_record_mock_validation.js",
  "tests/schema_examples/codex_session_image_import_record_mock.example.yaml",
  "tests/schema_examples/codex_session_image_import_record_mock_blocked_cases.example.yaml"
].sort();

const EXPECTED_V0_6_69_CODEX_SESSION_IMAGE_IMPORT_ROUTE_GAP_REVIEW_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_ROUTE_CLOSEOUT_OR_REAL_GENERATION_GAP_REVIEW.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_codex_session_image_import_route_gap_review.js",
  "tests/schema_examples/codex_session_image_import_route_gap_review.example.yaml"
].sort();

const EXPECTED_V0_6_70_TO_V0_6_72_REAL_VCP_AGENT_GENERATION_PREFLIGHT_BLOCKED_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ACTION_PACKET.md",
  "docs/vcp_integration/REAL_VCP_AGENT_GENERATION_PREFLIGHT_NO_CALL.md",
  "docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ROUTE_ACTIVATION_GATE.md",
  "reports/provider_receipts/v0_6_72_real_vcp_agent_generation_preflight_blocked_receipt.json",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_real_vcp_agent_generation_action_packet.js",
  "scripts/validate_real_vcp_agent_generation_preflight_no_call.js",
  "scripts/validate_real_vcp_agent_generation_route_activation_gate.js",
  "tests/schema_examples/real_vcp_agent_generation_action_packet.example.yaml",
  "tests/schema_examples/real_vcp_agent_generation_preflight_no_call.example.yaml",
  "tests/schema_examples/real_vcp_agent_generation_route_activation_gate.example.yaml"
].sort();

const EXPECTED_MVP_LEGACY_DEBT_VALIDATOR_REPAIR_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md",
  "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_RECORD_CONTRACT.md",
  "schemas/codex_session_image_import_preflight.schema.yaml",
  "schemas/codex_session_image_import_record.schema.yaml",
  "scripts/lib/exact_new_trial_legacy_artifacts.js",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_codex_session_image_import_preflight.js",
  "scripts/validate_codex_session_image_import_record_contract.js",
  "scripts/validate_exact_new_trial_003_durable_archive_write_execution_receipt.js",
  "scripts/validate_exact_new_trial_003_human_review.js",
  "scripts/validate_exact_new_trial_003_post_approval_registration_preflight_draft.js",
  "scripts/validate_exact_new_trial_003_selected_candidate_human_approval_intake_package.js",
  "scripts/validate_exact_new_trial_003_selected_candidate_post_approval_gate_alignment.js",
  "scripts/validate_exact_new_trial_003_shot_1_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_003_shot_3_execution_closeout.js",
  "scripts/validate_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.js",
  "scripts/validate_exact_new_trial_artifact_persistence_truth_review.js",
  "scripts/validate_exact_new_trial_local_persistence_repair_preflight.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js",
  "scripts/validate_v14_142_multi_accepted_sample_matrix.js",
  "tests/schema_examples/codex_session_image_import_preflight.example.yaml",
  "tests/schema_examples/codex_session_image_import_preflight_fail.example.yaml",
  "tests/schema_examples/codex_session_image_import_record.example.yaml",
  "tests/schema_examples/codex_session_image_import_record_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73A_BASELINE_SYNC_AND_ROUTE_STATE_CHECK_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73A_BASELINE_SYNC_AND_ROUTE_STATE_CHECK.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_v0_6_73a_baseline_sync_and_route_state_check.js",
  "tests/schema_examples/v0_6_73a_baseline_sync_and_route_state_check.example.yaml"
].sort();

const EXPECTED_V0_6_73B_NATIVE_DOUBAO_SECRETLESS_BINDING_IMPLEMENTATION_SURFACE_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73B_NATIVE_DOUBAO_SECRETLESS_BINDING_IMPLEMENTATION_SURFACE.md",
  "scripts/validate_v0_6_73b_native_doubao_secretless_binding_implementation_surface.js",
  "tests/schema_examples/v0_6_73b_native_doubao_secretless_binding_implementation_surface.example.yaml"
].sort();

const EXPECTED_V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT.md",
  "scripts/validate_v0_6_73c_secretless_provider_receipt_contract.js",
  "tests/schema_examples/v0_6_73c_secretless_provider_receipt_contract.example.yaml"
].sort();

const EXPECTED_V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT.md",
  "scripts/validate_v0_6_73d_real_generation_review_handoff_contract.js",
  "tests/schema_examples/v0_6_73d_real_generation_review_handoff_contract.example.yaml"
].sort();

const EXPECTED_V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET.md",
  "scripts/validate_v0_6_73e_one_shot_execution_readiness_packet.js",
  "tests/schema_examples/v0_6_73e_one_shot_execution_readiness_packet.example.yaml"
].sort();

const EXPECTED_V0_6_73F_EXACT_A5_EXECUTION_AUTHORIZATION_DRAFT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73F_EXACT_A5_EXECUTION_AUTHORIZATION_DRAFT.md",
  "scripts/validate_v0_6_73f_exact_a5_execution_authorization_draft.js",
  "tests/schema_examples/v0_6_73f_exact_a5_execution_authorization_draft.example.yaml"
].sort();

const EXPECTED_V0_6_73_EXECUTION_BLOCKED_STATUS_SYNC_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md"
].sort();

const EXPECTED_V0_6_73G_SECRETLESS_RUNTIME_BINDING_IMPLEMENTATION_SURFACE_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73G_SECRETLESS_RUNTIME_BINDING_IMPLEMENTATION_SURFACE.md",
  "scripts/run_native_doubao_image_generation.js",
  "scripts/validate_v0_6_73g_secretless_runtime_binding_implementation_surface.js",
  "tests/schema_examples/v0_6_73g_secretless_runtime_binding_implementation_surface.example.yaml"
].sort();

const EXPECTED_V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73G_SECRETLESS_RUNTIME_BINDING_IMPLEMENTATION_SURFACE.md",
  "docs/vcp_integration/V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE.md",
  "scripts/native_doubao_secretless_provider_runtime_bridge.js",
  "scripts/run_native_doubao_image_generation.js",
  "scripts/validate_v0_6_73g_secretless_runtime_binding_implementation_surface.js",
  "scripts/validate_v0_6_73h_secretless_provider_runtime_bridge.js",
  "tests/schema_examples/v0_6_73g_secretless_runtime_binding_implementation_surface.example.yaml",
  "tests/schema_examples/v0_6_73h_secretless_provider_runtime_bridge.example.yaml"
].sort();

const EXPECTED_V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73G_SECRETLESS_RUNTIME_BINDING_IMPLEMENTATION_SURFACE.md",
  "docs/vcp_integration/V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE.md",
  "docs/vcp_integration/V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY.md",
  "scripts/native_doubao_secretless_provider_runtime_bridge.js",
  "scripts/run_native_doubao_image_generation.js",
  "scripts/validate_v0_6_73g_secretless_runtime_binding_implementation_surface.js",
  "scripts/validate_v0_6_73h_secretless_provider_runtime_bridge.js",
  "scripts/validate_v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry.js",
  "tests/schema_examples/v0_6_73g_secretless_runtime_binding_implementation_surface.example.yaml",
  "tests/schema_examples/v0_6_73h_secretless_provider_runtime_bridge.example.yaml",
  "tests/schema_examples/v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry.example.yaml"
].sort();

const EXPECTED_V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md",
  "scripts/validate_v0_6_73l_bound_delegate_authorization_packet_draft.js",
  "tests/schema_examples/v0_6_73l_bound_delegate_authorization_packet_draft.example.yaml"
].sort();

const EXPECTED_V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md",
  "scripts/validate_v0_6_73m_bound_delegate_preflight_validator.js",
  "tests/schema_examples/v0_6_73m_bound_delegate_preflight_validator.example.yaml",
  "tests/schema_examples/v0_6_73m_bound_delegate_preflight_validator_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW.md",
  "scripts/validate_v0_6_73n_real_execution_go_no_go_review.js",
  "tests/schema_examples/v0_6_73n_real_execution_go_no_go_review.example.yaml"
].sort();

const EXPECTED_V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT.md",
  "scripts/validate_v0_6_73o_exact_real_execution_authorization_phrase_draft.js",
  "tests/schema_examples/v0_6_73o_exact_real_execution_authorization_phrase_draft.example.yaml"
].sort();

const EXPECTED_V0_6_73P_LOCAL_AGGREGATE_READINESS_REVIEW_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73P_LOCAL_AGGREGATE_READINESS_REVIEW.md",
  "scripts/validate_v0_6_73p_local_aggregate_readiness_review.js",
  "tests/schema_examples/v0_6_73p_local_aggregate_readiness_review.example.yaml"
].sort();

const EXPECTED_V0_6_73Q_PUSH_SAFETY_GATE_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73Q_PUSH_SAFETY_GATE.md",
  "scripts/validate_v0_6_73q_push_safety_gate.js",
  "tests/schema_examples/v0_6_73q_push_safety_gate.example.yaml"
].sort();

const EXPECTED_V0_6_73R_REMOTE_POST_PUSH_STATE_SYNC_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73R_REMOTE_POST_PUSH_STATE_SYNC.md",
  "scripts/validate_v0_6_73r_remote_post_push_state_sync.js",
  "tests/schema_examples/v0_6_73r_remote_post_push_state_sync.example.yaml"
].sort();

const EXPECTED_V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW.md",
  "scripts/validate_v0_6_73s_final_real_execution_boundary_review.js",
  "tests/schema_examples/v0_6_73s_final_real_execution_boundary_review.example.yaml"
].sort();

const EXPECTED_V0_6_73T_NEXT_PHASE_SELECTION_GATE_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73T_NEXT_PHASE_SELECTION_GATE.md",
  "scripts/validate_v0_6_73t_next_phase_selection_gate.js",
  "tests/schema_examples/v0_6_73t_next_phase_selection_gate.example.yaml"
].sort();

const EXPECTED_V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT.md",
  "scripts/validate_v0_6_73u_active_delegate_authorization_activation_preflight.js",
  "tests/schema_examples/v0_6_73u_active_delegate_authorization_activation_preflight.example.yaml",
  "tests/schema_examples/v0_6_73u_active_delegate_authorization_activation_preflight_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER.md",
  "scripts/native_doubao_delegate_binding_test_harness_no_provider.js",
  "scripts/validate_v0_6_73u3_runtime_delegate_binding_test_harness_no_provider.js",
  "tests/schema_examples/v0_6_73u3_runtime_delegate_binding_test_harness_no_provider.example.yaml"
].sort();

const EXPECTED_V0_6_73V_EXACT_ACTIVE_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73V_EXACT_ACTIVE_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md",
  "scripts/validate_v0_6_73v_exact_active_delegate_authorization_packet_draft.js",
  "tests/schema_examples/v0_6_73v_exact_active_delegate_authorization_packet_draft.example.yaml",
  "tests/schema_examples/v0_6_73v_exact_active_delegate_authorization_packet_draft_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73W_ACTIVE_DELEGATE_AUTHORIZATION_VALIDATOR_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73W_ACTIVE_DELEGATE_AUTHORIZATION_VALIDATOR.md",
  "scripts/validate_v0_6_73w_active_delegate_authorization_validator.js",
  "tests/schema_examples/v0_6_73w_active_delegate_authorization_candidate.example.yaml",
  "tests/schema_examples/v0_6_73w_active_delegate_authorization_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73X_FINAL_LOCAL_READINESS_STOP_LINE_REVIEW_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73X_FINAL_LOCAL_READINESS_STOP_LINE_REVIEW.md",
  "scripts/validate_v0_6_73x_final_local_readiness_stop_line_review.js",
  "tests/schema_examples/v0_6_73x_final_local_readiness_stop_line_review.example.yaml"
].sort();

const EXPECTED_V0_6_73Z_REAL_EXECUTION_AUTHORIZATION_BOUNDARY_REVIEW_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73Z_REAL_EXECUTION_AUTHORIZATION_BOUNDARY_REVIEW.md",
  "scripts/validate_v0_6_73z_real_execution_authorization_boundary_review.js",
  "tests/schema_examples/v0_6_73z_real_execution_authorization_boundary_review.example.yaml"
].sort();

const EXPECTED_V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD.md",
  "scripts/validate_v0_6_73aa_active_delegate_authorization_activation_record.js",
  "tests/schema_examples/v0_6_73aa_active_delegate_authorization_activation_record.example.yaml",
  "tests/schema_examples/v0_6_73aa_active_delegate_authorization_activation_record_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73AB_POST_ACTIVATION_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73AB_POST_ACTIVATION_REAL_EXECUTION_GO_NO_GO_REVIEW.md",
  "scripts/validate_v0_6_73ab_post_activation_real_execution_go_no_go_review.js",
  "tests/schema_examples/v0_6_73ab_post_activation_real_execution_go_no_go_review.example.yaml",
  "tests/schema_examples/v0_6_73ab_post_activation_real_execution_go_no_go_review_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73AD_REMOTE_SYNCED_FINAL_EXECUTION_PHRASE_ACTIVATION_REVIEW_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73AD_REMOTE_SYNCED_FINAL_EXECUTION_PHRASE_ACTIVATION_REVIEW.md",
  "scripts/validate_v0_6_73ad_remote_synced_final_execution_phrase_activation_review.js",
  "tests/schema_examples/v0_6_73ad_remote_synced_final_execution_phrase_activation_review.example.yaml",
  "tests/schema_examples/v0_6_73ad_remote_synced_final_execution_phrase_activation_review_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73AE_EXACT_EXECUTION_PHRASE_ACTIVE_FOR_EXECUTION_RECORD_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73AE_EXACT_EXECUTION_PHRASE_ACTIVE_FOR_EXECUTION_RECORD.md",
  "scripts/validate_v0_6_73ae_exact_execution_phrase_active_for_execution_record.js",
  "tests/schema_examples/v0_6_73ae_exact_execution_phrase_active_for_execution_record.example.yaml",
  "tests/schema_examples/v0_6_73ae_exact_execution_phrase_active_for_execution_record_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73AF_FINAL_PRE_PROVIDER_EXECUTION_GO_NO_GO_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73AF_FINAL_PRE_PROVIDER_EXECUTION_GO_NO_GO.md",
  "scripts/validate_v0_6_73af_final_pre_provider_execution_go_no_go.js",
  "tests/schema_examples/v0_6_73af_final_pre_provider_execution_go_no_go.example.yaml",
  "tests/schema_examples/v0_6_73af_final_pre_provider_execution_go_no_go_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73AG_REMOTE_SYNCED_PHRASE_ACTIVATION_POST_PULL_VERIFY_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73AG_REMOTE_SYNCED_PHRASE_ACTIVATION_POST_PULL_VERIFY.md",
  "scripts/validate_v0_6_73ag_remote_synced_phrase_activation_post_pull_verify.js",
  "tests/schema_examples/v0_6_73ag_remote_synced_phrase_activation_post_pull_verify.example.yaml",
  "tests/schema_examples/v0_6_73ag_remote_synced_phrase_activation_post_pull_verify_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73AH_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO_NO_GO_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73AH_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO_NO_GO.md",
  "scripts/validate_v0_6_73ah_current_head_final_pre_provider_go_no_go.js",
  "tests/schema_examples/v0_6_73ah_current_head_final_pre_provider_go_no_go.example.yaml",
  "tests/schema_examples/v0_6_73ah_current_head_final_pre_provider_go_no_go_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73AG_TO_AH_REMOTE_SYNC_AND_CURRENT_HEAD_GO_NO_GO_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73AG_REMOTE_SYNCED_PHRASE_ACTIVATION_POST_PULL_VERIFY.md",
  "docs/vcp_integration/V0_6_73AH_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO_NO_GO.md",
  "scripts/validate_v0_6_73ag_remote_synced_phrase_activation_post_pull_verify.js",
  "scripts/validate_v0_6_73ah_current_head_final_pre_provider_go_no_go.js",
  "tests/schema_examples/v0_6_73ag_remote_synced_phrase_activation_post_pull_verify.example.yaml",
  "tests/schema_examples/v0_6_73ag_remote_synced_phrase_activation_post_pull_verify_fail.example.yaml",
  "tests/schema_examples/v0_6_73ah_current_head_final_pre_provider_go_no_go.example.yaml",
  "tests/schema_examples/v0_6_73ah_current_head_final_pre_provider_go_no_go_fail.example.yaml"
].sort();

const EXPECTED_V0_6_73AG_TO_AI_REMOTE_SYNC_CURRENT_HEAD_AND_ONE_SHOT_BLOCKED_SLICE = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73AG_REMOTE_SYNCED_PHRASE_ACTIVATION_POST_PULL_VERIFY.md",
  "docs/vcp_integration/V0_6_73AH_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO_NO_GO.md",
  "docs/vcp_integration/V0_6_73AI_REAL_VCP_AGENT_GENERATION_EXECUTION_ONE_SHOT_ATTEMPT.md",
  "docs/vcp_integration/V0_6_73AJ_VCPTOOLBOX_BOUND_DELEGATE_SHAPE_NO_PROVIDER_VERIFY.md",
  "docs/vcp_integration/V0_6_73AK_VCPTOOLBOX_REAL_RUNTIME_BINDING_PATCH_PLAN.md",
  "docs/vcp_integration/V0_6_73AM_VCPTOOLBOX_REAL_RUNTIME_BINDING_NO_PROVIDER_VERIFY_AND_AGENT_LAB_SYNC.md",
  "docs/vcp_integration/V0_6_73AN_VCPTOOLBOX_RUNTIME_DRY_RUN_NO_PROVIDER_VERIFY.md",
  "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json",
  "scripts/native_doubao_delegate_binding_test_harness_no_provider.js",
  "scripts/native_doubao_secretless_provider_runtime_bridge.js",
  "scripts/native_doubao_vcptoolbox_bound_delegate_shape_no_provider.js",
  "scripts/validate_v0_6_73ag_remote_synced_phrase_activation_post_pull_verify.js",
  "scripts/validate_v0_6_73ah_current_head_final_pre_provider_go_no_go.js",
  "scripts/validate_v0_6_73ai_real_vcp_agent_generation_execution_one_shot_attempt.js",
  "scripts/validate_v0_6_73aj_vcptoolbox_bound_delegate_shape_no_provider_verify.js",
  "scripts/validate_v0_6_73ak_vcptoolbox_real_runtime_binding_patch_plan.js",
  "scripts/validate_v0_6_73am_vcptoolbox_real_runtime_binding_no_provider_verify_and_agent_lab_sync.js",
  "scripts/validate_v0_6_73an_vcptoolbox_runtime_dry_run_no_provider_verify.js",
  "scripts/validate_v0_6_73h_secretless_provider_runtime_bridge.js",
  "tests/schema_examples/v0_6_73ag_remote_synced_phrase_activation_post_pull_verify.example.yaml",
  "tests/schema_examples/v0_6_73ag_remote_synced_phrase_activation_post_pull_verify_fail.example.yaml",
  "tests/schema_examples/v0_6_73ah_current_head_final_pre_provider_go_no_go.example.yaml",
  "tests/schema_examples/v0_6_73ah_current_head_final_pre_provider_go_no_go_fail.example.yaml",
  "tests/schema_examples/v0_6_73ai_real_vcp_agent_generation_execution_one_shot_attempt.example.yaml",
  "tests/schema_examples/v0_6_73aj_vcptoolbox_bound_delegate_shape_no_provider_verify.example.yaml",
  "tests/schema_examples/v0_6_73ak_vcptoolbox_real_runtime_binding_patch_plan.example.yaml",
  "tests/schema_examples/v0_6_73am_vcptoolbox_real_runtime_binding_no_provider_verify_and_agent_lab_sync.example.yaml",
  "tests/schema_examples/v0_6_73an_vcptoolbox_runtime_dry_run_no_provider_verify.example.yaml"
].sort();

const EXPECTED_P1_1_EVIDENCE_GOVERNANCE_SANITIZATION_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "package.json",
  "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_003_receipt.json",
  "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_004_receipt.json",
  "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_005_receipt.json",
  "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_006_receipt.json",
  "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_sequence_002_006_commit_readiness_audit.json",
  "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_003/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_004/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_005/bridge_entry.json",
  "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_006/bridge_entry.json",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_exact_a5_provider_retry_003_activation_receipt.js",
  "scripts/validate_exact_a5_provider_retry_004_activation_receipt.js",
  "scripts/validate_exact_a5_provider_retry_005_activation_receipt.js",
  "scripts/validate_exact_a5_provider_retry_006_activation_receipt.js",
  "scripts/validate_mvp_core.js",
  "scripts/validate_retry_006_artifact_integrity.js"
].sort();

const EXPECTED_P1_8_GOVERNANCE_V14_212_BASELINE_RECONCILIATION_SLICE = [
  "scripts/validate_governance.ps1"
].sort();

const EXPECTED_P2_0_VALIDATION_GATE_SEMANTICS_SLICE = [
  "docs/PROJECT_STRUCTURE.md"
].sort();

const EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PHASE_2_SLICE = [
  "package.json",
  "schemas/provider_evidence_integrity_contract.schema.yaml",
  "scripts/validate_mvp_core.js",
  "scripts/validate_provider_evidence_integrity_contract.js"
].sort();

const EXPECTED_EVIDENCE_GOVERNANCE_SANITIZATION_PACKAGE_SCRIPTS = {
  "validate:all": "npm run validate:smoke && npm run validate:mvp && npm run validate:runtime-kernel && npm run validate:review-bridge-readonly && npm run validate:durable-audit-store && npm run validate:provider-preflight && npm run validate:exact-a5-provider-packet && npm run validate:exact-a5-provider-retry-packet && npm run validate:exact-a5-activation-receipt && npm run validate:exact-a5-retry-activation-receipt && npm run validate:exact-a5-retry-003-activation-receipt && npm run validate:exact-a5-retry-004-activation-receipt && npm run validate:exact-a5-retry-005-activation-receipt && npm run validate:exact-a5-retry-006-activation-receipt && npm run validate:retry-006-artifact-integrity && npm run validate:capsule-regression && npm run validate:governance",
  "validate:core": "npm run validate:smoke && npm run validate:runtime-kernel && npm run validate:review-bridge-readonly && npm run validate:durable-audit-store && npm run validate:provider-preflight",
  "validate:runtime-kernel-audit": "node scripts/validate_runtime_kernel_v0_audit_write.js",
  "validate:runtime-kernel": "node scripts/validate_runtime_kernel_v0.js && npm run validate:runtime-kernel-audit",
  "validate:retry-006-artifact-integrity": "node scripts/validate_retry_006_artifact_integrity.js"
};

const EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PACKAGE_SCRIPTS = {
  "validate:all": "npm run validate:smoke && npm run validate:mvp && npm run validate:runtime-kernel && npm run validate:review-bridge-readonly && npm run validate:durable-audit-store && npm run validate:provider-preflight && npm run validate:exact-a5-provider-packet && npm run validate:exact-a5-provider-retry-packet && npm run validate:exact-a5-activation-receipt && npm run validate:exact-a5-retry-activation-receipt && npm run validate:exact-a5-retry-003-activation-receipt && npm run validate:exact-a5-retry-004-activation-receipt && npm run validate:exact-a5-retry-005-activation-receipt && npm run validate:exact-a5-retry-006-activation-receipt && npm run validate:retry-006-artifact-integrity && npm run validate:provider-evidence-integrity && npm run validate:capsule-regression && npm run validate:governance",
  "validate:provider-evidence-integrity": "node scripts/validate_provider_evidence_integrity_contract.js"
};

const GOVERNANCE_TOOLING_ALLOWED_SLICES = [
  {
    id: "provider_evidence_integrity_phase_2_slice",
    files: EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PHASE_2_SLICE
  },
  {
    id: "validation_gate_semantics_slice",
    files: EXPECTED_P2_0_VALIDATION_GATE_SEMANTICS_SLICE
  },
  {
    id: "governance_v14_212_baseline_reconciliation_slice",
    files: EXPECTED_P1_8_GOVERNANCE_V14_212_BASELINE_RECONCILIATION_SLICE
  },
  {
    id: "evidence_governance_sanitization_slice",
    files: EXPECTED_P1_1_EVIDENCE_GOVERNANCE_SANITIZATION_SLICE
  },
  {
    id: "governance_tooling_maintenance_slice_v1",
    files: EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE
  },
  {
    id: "v0_3_1_real_provider_cost_boundary_plan_slice",
    files: EXPECTED_V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN_SLICE
  },
  {
    id: "v0_3_2_live_candidate_action_packet_slice",
    files: EXPECTED_V0_3_2_LIVE_CANDIDATE_ACTION_PACKET_SLICE
  },
  {
    id: "v0_3_3_first_live_generation_pilot_gate_slice",
    files: EXPECTED_V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE_SLICE
  },
  {
    id: "provider_receipt_artifact_repair_slice",
    files: EXPECTED_PROVIDER_RECEIPT_ARTIFACT_REPAIR_SLICE
  },
  {
    id: "v0_3_4_visual_asset_governance_reconciliation_slice",
    files: EXPECTED_V0_3_4_VISUAL_ASSET_GOVERNANCE_RECONCILIATION_SLICE
  },
  {
    id: "v0_3_5_visual_asset_promotion_gate_design_slice",
    files: EXPECTED_V0_3_5_VISUAL_ASSET_PROMOTION_GATE_DESIGN_SLICE
  },
  {
    id: "v0_3_6_bounded_l4_autopilot_requirements_slice",
    files: EXPECTED_V0_3_6_BOUNDED_L4_AUTOPILOT_REQUIREMENTS_SLICE
  },
  {
    id: "v0_3_6_post_push_state_sync_slice",
    files: EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE
  },
  {
    id: "v0_3_7_bounded_l4_executor_preflight_contract_slice",
    files: EXPECTED_V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_SLICE
  },
  {
    id: "v0_3_7a_push_safety_lane_slice",
    files: EXPECTED_V0_3_7A_PUSH_SAFETY_LANE_SLICE
  },
  {
    id: "v0_3_7c_push_l1_regression_usage_boundary_slice",
    files: EXPECTED_V0_3_7C_PUSH_L1_REGRESSION_USAGE_BOUNDARY_SLICE
  },
  {
    id: "v0_3_7d_visual_asset_eval_v0_1_slice",
    files: EXPECTED_V0_3_7D_VISUAL_ASSET_EVAL_V0_1_SLICE
  },
  {
    id: "v0_3_7e_visual_sample_memory_policy_slice",
    files: EXPECTED_V0_3_7E_VISUAL_SAMPLE_MEMORY_POLICY_SLICE
  },
  {
    id: "v0_3_15_fifteen_day_architecture_checkpoint_slice",
    files: EXPECTED_V0_3_15_FIFTEEN_DAY_ARCHITECTURE_CHECKPOINT_SLICE
  },
  {
    id: "v0_4_0_visual_asset_eval_dry_run_slice",
    files: EXPECTED_V0_4_0_VISUAL_ASSET_EVAL_DRY_RUN_SLICE
  },
  {
    id: "v0_4_0a_visual_asset_eval_dry_run_asset_class_binding_slice",
    files: EXPECTED_V0_4_0A_VISUAL_ASSET_EVAL_DRY_RUN_ASSET_CLASS_BINDING_SLICE
  },
  {
    id: "v0_4_1_visual_asset_review_pack_slice",
    files: EXPECTED_V0_4_1_VISUAL_ASSET_REVIEW_PACK_SLICE
  },
  {
    id: "v0_4_2_visual_failure_taxonomy_slice",
    files: EXPECTED_V0_4_2_VISUAL_FAILURE_TAXONOMY_SLICE
  },
  {
    id: "v0_4_3_review_to_prompt_correction_hint_slice",
    files: EXPECTED_V0_4_3_REVIEW_TO_PROMPT_CORRECTION_HINT_SLICE
  },
  {
    id: "v0_4_4_sample_registry_dry_run_slice",
    files: EXPECTED_V0_4_4_SAMPLE_REGISTRY_DRY_RUN_SLICE
  },
  {
    id: "v0_4_5_visual_eval_consistency_check_slice",
    files: EXPECTED_V0_4_5_VISUAL_EVAL_CONSISTENCY_CHECK_SLICE
  },
  {
    id: "v0_4_6_noop_visual_workflow_runner_plan_slice",
    files: EXPECTED_V0_4_6_NOOP_VISUAL_WORKFLOW_RUNNER_PLAN_SLICE
  },
  {
    id: "v0_4_7_seven_day_visual_workflow_checkpoint_slice",
    files: EXPECTED_V0_4_7_SEVEN_DAY_VISUAL_WORKFLOW_CHECKPOINT_SLICE
  },
  {
    id: "v0_4_7_review_findings_fix_slice",
    files: EXPECTED_V0_4_7_REVIEW_FINDINGS_FIX_SLICE
  },
  {
    id: "v0_4_8_visual_review_semantics_hardening_slice",
    files: EXPECTED_V0_4_8_VISUAL_REVIEW_SEMANTICS_HARDENING_SLICE
  },
  {
    id: "v0_4_9_visual_evidence_consistency_hardening_slice",
    files: EXPECTED_V0_4_9_VISUAL_EVIDENCE_CONSISTENCY_HARDENING_SLICE
  },
  {
    id: "v0_5_0_controlled_generation_readiness_packet_slice",
    files: EXPECTED_V0_5_0_CONTROLLED_GENERATION_READINESS_PACKET_SLICE
  },
  {
    id: "v0_5_1_prompt_package_preview_slice",
    files: EXPECTED_V0_5_1_PROMPT_PACKAGE_PREVIEW_SLICE
  },
  {
    id: "v0_5_2_visual_review_replay_set_slice",
    files: EXPECTED_V0_5_2_VISUAL_REVIEW_REPLAY_SET_SLICE
  },
  {
    id: "v0_5_3_visual_memory_readonly_plan_slice",
    files: EXPECTED_V0_5_3_VISUAL_MEMORY_READONLY_PLAN_SLICE
  },
  {
    id: "v0_5_4_next_15_day_visual_workflow_checkpoint_slice",
    files: EXPECTED_V0_5_4_NEXT_15_DAY_VISUAL_WORKFLOW_CHECKPOINT_SLICE
  },
  {
    id: "v0_5_5_controlled_generation_readiness_semantics_hardening_slice",
    files: EXPECTED_V0_5_5_CONTROLLED_GENERATION_READINESS_SEMANTICS_HARDENING_SLICE
  },
  {
    id: "v0_5_6_human_review_gate_packet_slice",
    files: EXPECTED_V0_5_6_HUMAN_REVIEW_GATE_PACKET_SLICE
  },
  {
    id: "v0_5_7_noop_controlled_generation_runner_dry_run_slice",
    files: EXPECTED_V0_5_7_NOOP_CONTROLLED_GENERATION_RUNNER_DRY_RUN_SLICE
  },
  {
    id: "v0_5_8_controlled_generation_evidence_contract_slice",
    files: EXPECTED_V0_5_8_CONTROLLED_GENERATION_EVIDENCE_CONTRACT_SLICE
  },
  {
    id: "v0_5_9_visual_memory_readonly_query_contract_slice",
    files: EXPECTED_V0_5_9_VISUAL_MEMORY_READONLY_QUERY_CONTRACT_SLICE
  },
  {
    id: "v0_6_0_first_controlled_generation_authorization_packet_slice",
    files: EXPECTED_V0_6_0_FIRST_CONTROLLED_GENERATION_AUTHORIZATION_PACKET_SLICE
  },
  {
    id: "v0_6_1_fifteen_day_controlled_generation_readiness_checkpoint_slice",
    files: EXPECTED_V0_6_1_FIFTEEN_DAY_CONTROLLED_GENERATION_READINESS_CHECKPOINT_SLICE
  },
  {
    id: "v0_6_2_first_month_live_pilot_recovery_plan_slice",
    files: EXPECTED_V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN_SLICE
  },
  {
    id: "v0_6_3_failed_provider_attempt_inspection_slice",
    files: EXPECTED_V0_6_3_FAILED_PROVIDER_ATTEMPT_INSPECTION_SLICE
  },
  {
    id: "v0_6_4_exact_new_trial_authorization_refresh_slice",
    files: EXPECTED_V0_6_4_EXACT_NEW_TRIAL_AUTHORIZATION_REFRESH_SLICE
  },
  {
    id: "v0_6_5_ready_for_exact_new_trial_authorization_checkpoint_slice",
    files: EXPECTED_V0_6_5_READY_FOR_EXACT_NEW_TRIAL_AUTHORIZATION_CHECKPOINT_SLICE
  },
  {
    id: "v0_6_6_exact_new_trial_a5_request_draft_slice",
    files: EXPECTED_V0_6_6_EXACT_NEW_TRIAL_A5_REQUEST_DRAFT_SLICE
  },
  {
    id: "v0_6_7_exact_new_trial_authorization_intake_preflight_slice",
    files: EXPECTED_V0_6_7_EXACT_NEW_TRIAL_AUTHORIZATION_INTAKE_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_8_exact_new_trial_intake_field_resolution_slice",
    files: EXPECTED_V0_6_8_EXACT_NEW_TRIAL_INTAKE_FIELD_RESOLUTION_SLICE
  },
  {
    id: "v0_6_9_exact_new_trial_request_text_regenerated_slice",
    files: EXPECTED_V0_6_9_EXACT_NEW_TRIAL_REQUEST_TEXT_REGENERATED_SLICE
  },
  {
    id: "v0_6_10_exact_new_trial_human_decision_preview_gate_slice",
    files: EXPECTED_V0_6_10_EXACT_NEW_TRIAL_HUMAN_DECISION_PREVIEW_GATE_SLICE
  },
  {
    id: "v0_6_11_exact_new_trial_preflight_authorization_gate_slice",
    files: EXPECTED_V0_6_11_EXACT_NEW_TRIAL_PREFLIGHT_AUTHORIZATION_GATE_SLICE
  },
  {
    id: "v0_6_11_post_pull_cleanup_slice",
    files: EXPECTED_V0_6_11_POST_PULL_CLEANUP_SLICE
  },
  {
    id: "v0_6_12_local_preflight_only_gate_slice",
    files: EXPECTED_V0_6_12_LOCAL_PREFLIGHT_ONLY_GATE_SLICE
  },
  {
    id: "v0_6_13_failed_provider_attempt_review_slice",
    files: EXPECTED_V0_6_13_FAILED_PROVIDER_ATTEMPT_REVIEW_SLICE
  },
  {
    id: "v0_6_12_and_v0_6_13_week1_preflight_and_failed_review_slice",
    files: EXPECTED_V0_6_12_AND_V0_6_13_WEEK1_PREFLIGHT_AND_FAILED_REVIEW_SLICE
  },
  {
    id: "v0_6_14_exact_new_trial_action_packet_v0_1_slice",
    files: EXPECTED_V0_6_14_EXACT_NEW_TRIAL_ACTION_PACKET_V0_1_SLICE
  },
  {
    id: "v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate_slice",
    files: EXPECTED_V0_6_15_EXACT_NEW_TRIAL_NOOP_REHEARSAL_HUMAN_APPROVAL_GATE_SLICE
  },
  {
    id: "v0_6_16_exact_new_trial_human_approval_intake_validator_slice",
    files: EXPECTED_V0_6_16_EXACT_NEW_TRIAL_HUMAN_APPROVAL_INTAKE_VALIDATOR_SLICE
  },
  {
    id: "v0_6_17_30_day_exact_new_trial_checkpoint_slice",
    files: EXPECTED_V0_6_17_30_DAY_EXACT_NEW_TRIAL_CHECKPOINT_SLICE
  },
  {
    id: "v0_6_18_single_generation_execution_preflight_slice",
    files: EXPECTED_V0_6_18_SINGLE_GENERATION_EXECUTION_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_12_to_v0_6_14_exact_new_trial_prep_slice",
    files: EXPECTED_V0_6_12_TO_V0_6_14_EXACT_NEW_TRIAL_PREP_SLICE
  },
  {
    id: "v0_6_12_to_v0_6_15_exact_new_trial_preparation_loop_slice",
    files: EXPECTED_V0_6_12_TO_V0_6_15_EXACT_NEW_TRIAL_PREPARATION_LOOP_SLICE
  },
  {
    id: "v0_6_12_to_v0_6_16_exact_new_trial_auditable_preparation_loop_slice",
    files: EXPECTED_V0_6_12_TO_V0_6_16_EXACT_NEW_TRIAL_AUDITABLE_PREPARATION_LOOP_SLICE
  },
  {
    id: "v0_6_12_to_v0_6_17_exact_new_trial_30_day_closed_loop_slice",
    files: EXPECTED_V0_6_12_TO_V0_6_17_EXACT_NEW_TRIAL_30_DAY_CLOSED_LOOP_SLICE
  },
  {
    id: "v0_6_12_to_v0_6_18_exact_new_trial_execution_preflight_slice",
    files: EXPECTED_V0_6_12_TO_V0_6_18_EXACT_NEW_TRIAL_EXECUTION_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_12_to_v0_6_20_failed_no_image_post_run_review_slice",
    files: EXPECTED_V0_6_12_TO_V0_6_20_FAILED_NO_IMAGE_POST_RUN_REVIEW_SLICE
  },
  {
    id: "v0_6_12_to_v0_6_21_raw_provider_payload_capture_policy_slice",
    files: EXPECTED_V0_6_12_TO_V0_6_21_RAW_PROVIDER_PAYLOAD_CAPTURE_POLICY_SLICE
  },
  {
    id: "v0_6_12_to_v0_6_22_provider_payload_extraction_preflight_slice",
    files: EXPECTED_V0_6_12_TO_V0_6_22_PROVIDER_PAYLOAD_EXTRACTION_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_12_to_v0_6_23_single_generation_with_payload_trace_slice",
    files: EXPECTED_V0_6_12_TO_V0_6_23_SINGLE_GENERATION_WITH_PAYLOAD_TRACE_SLICE
  },
  {
    id: "v0_6_24_exact_new_trial_3shot_stability_preflight_slice",
    files: EXPECTED_V0_6_24_EXACT_NEW_TRIAL_3SHOT_STABILITY_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_25_exact_new_trial_artifact_persistence_truth_review_slice",
    files: EXPECTED_V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW_SLICE
  },
  {
    id: "v0_6_26_exact_new_trial_local_persistence_repair_preflight_slice",
    files: EXPECTED_V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_27_exact_new_trial_003_shot_1_execution_closeout_slice",
    files: EXPECTED_V0_6_27_EXACT_NEW_TRIAL_003_SHOT_1_EXECUTION_CLOSEOUT_SLICE
  },
  {
    id: "v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight_slice",
    files: EXPECTED_V0_6_28_EXACT_NEW_TRIAL_003_SHOT_2_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_29_exact_new_trial_003_shot_2_execution_closeout_slice",
    files: EXPECTED_V0_6_29_EXACT_NEW_TRIAL_003_SHOT_2_EXECUTION_CLOSEOUT_SLICE
  },
  {
    id: "v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight_slice",
    files: EXPECTED_V0_6_30_EXACT_NEW_TRIAL_003_SHOT_3_PRE_CALL_PAYLOAD_CAPTURE_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_31_exact_new_trial_003_shot_3_execution_closeout_slice",
    files: EXPECTED_V0_6_31_EXACT_NEW_TRIAL_003_SHOT_3_EXECUTION_CLOSEOUT_SLICE
  },
  {
    id: "v0_6_32_exact_new_trial_003_human_review_slice",
    files: EXPECTED_V0_6_32_EXACT_NEW_TRIAL_003_HUMAN_REVIEW_SLICE
  },
  {
    id: "v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package_slice",
    files: EXPECTED_V0_6_33_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_HUMAN_APPROVAL_INTAKE_PACKAGE_SLICE
  },
  {
    id: "v0_6_34_exact_new_trial_003_selected_candidate_post_approval_gate_alignment_slice",
    files: EXPECTED_V0_6_34_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_POST_APPROVAL_GATE_ALIGNMENT_SLICE
  },
  {
    id: "v0_6_35_exact_new_trial_003_post_approval_registration_preflight_draft_slice",
    files: EXPECTED_V0_6_35_EXACT_NEW_TRIAL_003_POST_APPROVAL_REGISTRATION_PREFLIGHT_DRAFT_SLICE
  },
  {
    id: "v0_6_36_exact_new_trial_003_accepted_samples_registration_authorization_package_draft_slice",
    files: EXPECTED_V0_6_36_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_REGISTRATION_AUTHORIZATION_PACKAGE_DRAFT_SLICE
  },
  {
    id: "v0_6_37_exact_new_trial_003_accepted_samples_registration_execution_preflight_slice",
    files: EXPECTED_V0_6_37_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_REGISTRATION_EXECUTION_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_38_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight_slice",
    files: EXPECTED_V0_6_38_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight_slice",
    files: EXPECTED_V0_6_39_EXACT_NEW_TRIAL_003_PRODUCTION_CANDIDATE_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_40_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight_slice",
    files: EXPECTED_V0_6_40_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_41_exact_new_trial_003_memory_delta_draft_package_slice",
    files: EXPECTED_V0_6_41_EXACT_NEW_TRIAL_003_MEMORY_DELTA_DRAFT_PACKAGE_SLICE
  },
  {
    id: "v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight_slice",
    files: EXPECTED_V0_6_42_EXACT_NEW_TRIAL_003_SENSITIVE_DATA_SCAN_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_43_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight_slice",
    files: EXPECTED_V0_6_43_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_AUTHORIZATION_COMPILER_OUTPUT_REFRESH_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_44_exact_new_trial_003_exact_allowed_memory_targets_package_slice",
    files: EXPECTED_V0_6_44_EXACT_NEW_TRIAL_003_EXACT_ALLOWED_MEMORY_TARGETS_PACKAGE_SLICE
  },
  {
    id: "v0_6_45_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft_slice",
    files: EXPECTED_V0_6_45_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_AUTHORIZATION_PACKAGE_DRAFT_SLICE
  },
  {
    id: "v0_6_46_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight_slice",
    files: EXPECTED_V0_6_46_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_EXECUTION_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_47_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package_slice",
    files: EXPECTED_V0_6_47_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_PAYLOAD_REFRESH_PACKAGE_SLICE
  },
  {
    id: "v0_6_48_exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract_slice",
    files: EXPECTED_V0_6_48_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_RECEIPT_CONTRACT_SLICE
  },
  {
    id: "v0_6_49_exact_new_trial_003_daily_note_vcp_memory_write_registry_contract_slice",
    files: EXPECTED_V0_6_49_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_REGISTRY_CONTRACT_SLICE
  },
  {
    id: "v0_6_50_exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint_slice",
    files: EXPECTED_V0_6_50_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_GO_NO_GO_CHECKPOINT_SLICE
  },
  {
    id: "v0_6_51_exact_new_trial_003_workflow_prerequisite_reconciliation_packet_slice",
    files: EXPECTED_V0_6_51_EXACT_NEW_TRIAL_003_WORKFLOW_PREREQUISITE_RECONCILIATION_PACKET_SLICE
  },
  {
    id: "v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet_slice",
    files: EXPECTED_V0_6_52_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_PACKET_SLICE
  },
  {
    id: "v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel_slice",
    files: EXPECTED_V0_6_53_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_CAPTURE_SURFACE_STATIC_PANEL_SLICE
  },
  {
    id: "v0_6_54_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet_slice",
    files: EXPECTED_V0_6_54_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_INGESTION_PACKET_SLICE
  },
  {
    id: "v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture_slice",
    files: EXPECTED_V0_6_55_EXACT_NEW_TRIAL_003_USER_SUBMITTED_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_SLICE
  },
  {
    id: "v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration_slice",
    files: EXPECTED_V0_6_56_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_METADATA_REGISTRATION_SLICE
  },
  {
    id: "v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration_slice",
    files: EXPECTED_V0_6_57_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_METADATA_PREFLIGHT_AFTER_ACCEPTED_SAMPLE_REGISTRATION_SLICE
  },
  {
    id: "v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight_slice",
    files: EXPECTED_V0_6_58_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_AUTHORIZATION_PACKAGE_AFTER_METADATA_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_59_exact_new_trial_003_durable_archive_write_execution_preflight_no_write_slice",
    files: EXPECTED_V0_6_59_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_PREFLIGHT_NO_WRITE_SLICE
  },
  {
    id: "v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt_slice",
    files: EXPECTED_V0_6_60_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_RECEIPT_SLICE
  },
  {
    id: "v0_6_61_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write_slice",
    files: EXPECTED_V0_6_61_EXACT_NEW_TRIAL_003_CHINESE_MEMORY_ENTRY_READINESS_PREFLIGHT_NO_WRITE_SLICE
  },
  {
    id: "v0_6_62_exact_new_trial_003_amber_c_memory_write_target_resolution_blocked_slice",
    files: EXPECTED_V0_6_62_EXACT_NEW_TRIAL_003_AMBER_C_MEMORY_WRITE_TARGET_RESOLUTION_BLOCKED_SLICE
  },
  {
    id: "v0_6_63_vcp_agent_image_generation_tool_contract_v1_slice",
    files: EXPECTED_V0_6_63_VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1_SLICE
  },
  {
    id: "v0_6_64_vcp_agent_image_generation_contract_mock_validation_slice",
    files: EXPECTED_V0_6_64_VCP_AGENT_IMAGE_GENERATION_CONTRACT_MOCK_VALIDATION_SLICE
  },
  {
    id: "v0_6_65_vcp_agent_generation_route_selection_gate_slice",
    files: EXPECTED_V0_6_65_VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE_SLICE
  },
  {
    id: "v0_6_66_codex_session_image_import_preflight_only_slice",
    files: EXPECTED_V0_6_66_CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT_ONLY_SLICE
  },
  {
    id: "v0_6_67_codex_session_image_import_record_contract_slice",
    files: EXPECTED_V0_6_67_CODEX_SESSION_IMAGE_IMPORT_RECORD_CONTRACT_SLICE
  },
  {
    id: "v0_6_68_codex_session_image_import_record_mock_validation_slice",
    files: EXPECTED_V0_6_68_CODEX_SESSION_IMAGE_IMPORT_RECORD_MOCK_VALIDATION_SLICE
  },
  {
    id: "v0_6_69_codex_session_image_import_route_gap_review_slice",
    files: EXPECTED_V0_6_69_CODEX_SESSION_IMAGE_IMPORT_ROUTE_GAP_REVIEW_SLICE
  },
  {
    id: "v0_6_70_to_v0_6_72_real_vcp_agent_generation_preflight_blocked_slice",
    files: EXPECTED_V0_6_70_TO_V0_6_72_REAL_VCP_AGENT_GENERATION_PREFLIGHT_BLOCKED_SLICE
  },
  {
    id: "mvp_legacy_debt_validator_repair_slice",
    files: EXPECTED_MVP_LEGACY_DEBT_VALIDATOR_REPAIR_SLICE
  },
  {
    id: "v0_6_73a_baseline_sync_and_route_state_check_slice",
    files: EXPECTED_V0_6_73A_BASELINE_SYNC_AND_ROUTE_STATE_CHECK_SLICE
  },
  {
    id: "v0_6_73b_native_doubao_secretless_binding_implementation_surface_slice",
    files: EXPECTED_V0_6_73B_NATIVE_DOUBAO_SECRETLESS_BINDING_IMPLEMENTATION_SURFACE_SLICE
  },
  {
    id: "v0_6_73c_secretless_provider_receipt_contract_slice",
    files: EXPECTED_V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT_SLICE
  },
  {
    id: "v0_6_73d_real_generation_review_handoff_contract_slice",
    files: EXPECTED_V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT_SLICE
  },
  {
    id: "v0_6_73e_one_shot_execution_readiness_packet_slice",
    files: EXPECTED_V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET_SLICE
  },
  {
    id: "v0_6_73f_exact_a5_execution_authorization_draft_slice",
    files: EXPECTED_V0_6_73F_EXACT_A5_EXECUTION_AUTHORIZATION_DRAFT_SLICE
  },
  {
    id: "v0_6_73_execution_blocked_status_sync_slice",
    files: EXPECTED_V0_6_73_EXECUTION_BLOCKED_STATUS_SYNC_SLICE
  },
  {
    id: "v0_6_73g_secretless_runtime_binding_implementation_surface_slice",
    files: EXPECTED_V0_6_73G_SECRETLESS_RUNTIME_BINDING_IMPLEMENTATION_SURFACE_SLICE
  },
  {
    id: "v0_6_73h_secretless_provider_runtime_bridge_slice",
    files: EXPECTED_V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE_SLICE
  },
  {
    id: "v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry_slice",
    files: EXPECTED_V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY_SLICE
  },
  {
    id: "v0_6_73l_bound_delegate_authorization_packet_draft_slice",
    files: EXPECTED_V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE
  },
  {
    id: "v0_6_73m_bound_delegate_preflight_validator_slice",
    files: EXPECTED_V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR_SLICE
  },
  {
    id: "v0_6_73n_real_execution_go_no_go_review_slice",
    files: EXPECTED_V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE
  },
  {
    id: "v0_6_73o_exact_real_execution_authorization_phrase_draft_slice",
    files: EXPECTED_V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT_SLICE
  },
  {
    id: "v0_6_73p_local_aggregate_readiness_review_slice",
    files: EXPECTED_V0_6_73P_LOCAL_AGGREGATE_READINESS_REVIEW_SLICE
  },
  {
    id: "v0_6_73q_push_safety_gate_slice",
    files: EXPECTED_V0_6_73Q_PUSH_SAFETY_GATE_SLICE
  },
  {
    id: "v0_6_73r_remote_post_push_state_sync_slice",
    files: EXPECTED_V0_6_73R_REMOTE_POST_PUSH_STATE_SYNC_SLICE
  },
  {
    id: "v0_6_73s_final_real_execution_boundary_review_slice",
    files: EXPECTED_V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW_SLICE
  },
  {
    id: "v0_6_73t_next_phase_selection_gate_slice",
    files: EXPECTED_V0_6_73T_NEXT_PHASE_SELECTION_GATE_SLICE
  },
  {
    id: "v0_6_73u_active_delegate_authorization_activation_preflight_slice",
    files: EXPECTED_V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT_SLICE
  },
  {
    id: "v0_6_73u3_runtime_delegate_binding_test_harness_no_provider_slice",
    files: EXPECTED_V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER_SLICE
  },
  {
    id: "v0_6_73v_exact_active_delegate_authorization_packet_draft_slice",
    files: EXPECTED_V0_6_73V_EXACT_ACTIVE_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE
  },
  {
    id: "v0_6_73w_active_delegate_authorization_validator_slice",
    files: EXPECTED_V0_6_73W_ACTIVE_DELEGATE_AUTHORIZATION_VALIDATOR_SLICE
  },
  {
    id: "v0_6_73x_final_local_readiness_stop_line_review_slice",
    files: EXPECTED_V0_6_73X_FINAL_LOCAL_READINESS_STOP_LINE_REVIEW_SLICE
  },
  {
    id: "v0_6_73z_real_execution_authorization_boundary_review_slice",
    files: EXPECTED_V0_6_73Z_REAL_EXECUTION_AUTHORIZATION_BOUNDARY_REVIEW_SLICE
  },
  {
    id: "v0_6_73aa_active_delegate_authorization_activation_record_slice",
    files: EXPECTED_V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD_SLICE
  },
  {
    id: "v0_6_73ab_post_activation_real_execution_go_no_go_review_slice",
    files: EXPECTED_V0_6_73AB_POST_ACTIVATION_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE
  },
  {
    id: "v0_6_73ad_remote_synced_final_execution_phrase_activation_review_slice",
    files: EXPECTED_V0_6_73AD_REMOTE_SYNCED_FINAL_EXECUTION_PHRASE_ACTIVATION_REVIEW_SLICE
  },
  {
    id: "v0_6_73ae_exact_execution_phrase_active_for_execution_record_slice",
    files: EXPECTED_V0_6_73AE_EXACT_EXECUTION_PHRASE_ACTIVE_FOR_EXECUTION_RECORD_SLICE
  },
  {
    id: "v0_6_73af_final_pre_provider_execution_go_no_go_slice",
    files: EXPECTED_V0_6_73AF_FINAL_PRE_PROVIDER_EXECUTION_GO_NO_GO_SLICE
  },
  {
    id: "v0_6_73ag_remote_synced_phrase_activation_post_pull_verify_slice",
    files: EXPECTED_V0_6_73AG_REMOTE_SYNCED_PHRASE_ACTIVATION_POST_PULL_VERIFY_SLICE
  },
  {
    id: "v0_6_73ah_current_head_final_pre_provider_go_no_go_slice",
    files: EXPECTED_V0_6_73AH_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO_NO_GO_SLICE
  },
  {
    id: "v0_6_73ag_to_ah_remote_sync_and_current_head_go_no_go_slice",
    files: EXPECTED_V0_6_73AG_TO_AH_REMOTE_SYNC_AND_CURRENT_HEAD_GO_NO_GO_SLICE
  },
  {
    id: "v0_6_73ag_to_ai_remote_sync_current_head_and_one_shot_blocked_slice",
    files: EXPECTED_V0_6_73AG_TO_AI_REMOTE_SYNC_CURRENT_HEAD_AND_ONE_SHOT_BLOCKED_SLICE
  }
];

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = stable(value[key]);
    return result;
  }, {});
}

function sameJson(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}

function sameStringList(left, right) {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

function diffStringList(actual, expected) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  return {
    unexpected_files: actual.filter((file) => !expectedSet.has(file)).sort(),
    missing_files: expected.filter((file) => !actualSet.has(file)).sort()
  };
}

function normalizeChangedFilesForSliceMatching(changedFiles) {
  const withoutHelper = changedFiles.filter((file) => file !== GOVERNANCE_TOOLING_SLICE_HELPER_FILE);
  const isP2_1ProviderEvidenceIntegrityRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PHASE_2_SLICE);
  const isP2_0ValidationGateSemanticsRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_P2_0_VALIDATION_GATE_SEMANTICS_SLICE);
  const isP1_8GovernanceV14_212BaselineRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_P1_8_GOVERNANCE_V14_212_BASELINE_RECONCILIATION_SLICE);
  const isPostPushSyncRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE);
  const isExecutionBlockedStatusSyncRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73_EXECUTION_BLOCKED_STATUS_SYNC_SLICE);
  const isV0_6_73gRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73G_SECRETLESS_RUNTIME_BINDING_IMPLEMENTATION_SURFACE_SLICE);
  const isV0_6_73hRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE_SLICE);
  const isV0_6_73iRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY_SLICE);
  const isV0_6_73lRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE);
  const isV0_6_73mRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR_SLICE);
  const isV0_6_73nRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE);
  const isV0_6_73oRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT_SLICE);
  const isV0_6_73pRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73P_LOCAL_AGGREGATE_READINESS_REVIEW_SLICE);
  const isV0_6_73qRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73Q_PUSH_SAFETY_GATE_SLICE);
  const isV0_6_73rRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73R_REMOTE_POST_PUSH_STATE_SYNC_SLICE);
  const isV0_6_73sRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW_SLICE);
  const isV0_6_73tRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73T_NEXT_PHASE_SELECTION_GATE_SLICE);
  const isV0_6_73uRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT_SLICE);
  const isV0_6_73u3RegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER_SLICE);
  const isV0_6_73vRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73V_EXACT_ACTIVE_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE);
  const isV0_6_73wRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73W_ACTIVE_DELEGATE_AUTHORIZATION_VALIDATOR_SLICE);
  const isV0_6_73xRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73X_FINAL_LOCAL_READINESS_STOP_LINE_REVIEW_SLICE);
  const isV0_6_73zRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73Z_REAL_EXECUTION_AUTHORIZATION_BOUNDARY_REVIEW_SLICE);
  const isV0_6_73aaRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD_SLICE);
  const isV0_6_73abRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73AB_POST_ACTIVATION_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE);
  const isV0_6_73adRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73AD_REMOTE_SYNCED_FINAL_EXECUTION_PHRASE_ACTIVATION_REVIEW_SLICE);
  const isV0_6_73aeRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73AE_EXACT_EXECUTION_PHRASE_ACTIVE_FOR_EXECUTION_RECORD_SLICE);
  const isV0_6_73afRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73AF_FINAL_PRE_PROVIDER_EXECUTION_GO_NO_GO_SLICE);
  const isV0_6_73agRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73AG_REMOTE_SYNCED_PHRASE_ACTIVATION_POST_PULL_VERIFY_SLICE);
  const isV0_6_73ahRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73AH_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO_NO_GO_SLICE);
  const isV0_6_73agToAhRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73AG_TO_AH_REMOTE_SYNC_AND_CURRENT_HEAD_GO_NO_GO_SLICE);
  const isV0_6_73agToAiRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_6_73AG_TO_AI_REMOTE_SYNC_CURRENT_HEAD_AND_ONE_SHOT_BLOCKED_SLICE);

  return (isP2_1ProviderEvidenceIntegrityRegistrationPatch || isP2_0ValidationGateSemanticsRegistrationPatch || isP1_8GovernanceV14_212BaselineRegistrationPatch || isPostPushSyncRegistrationPatch || isExecutionBlockedStatusSyncRegistrationPatch || isV0_6_73gRegistrationPatch || isV0_6_73hRegistrationPatch || isV0_6_73iRegistrationPatch || isV0_6_73lRegistrationPatch || isV0_6_73mRegistrationPatch || isV0_6_73nRegistrationPatch || isV0_6_73oRegistrationPatch || isV0_6_73pRegistrationPatch || isV0_6_73qRegistrationPatch || isV0_6_73rRegistrationPatch || isV0_6_73sRegistrationPatch || isV0_6_73tRegistrationPatch || isV0_6_73uRegistrationPatch || isV0_6_73u3RegistrationPatch || isV0_6_73vRegistrationPatch || isV0_6_73wRegistrationPatch || isV0_6_73xRegistrationPatch || isV0_6_73zRegistrationPatch || isV0_6_73aaRegistrationPatch || isV0_6_73abRegistrationPatch || isV0_6_73adRegistrationPatch || isV0_6_73aeRegistrationPatch || isV0_6_73afRegistrationPatch || isV0_6_73agRegistrationPatch || isV0_6_73ahRegistrationPatch || isV0_6_73agToAhRegistrationPatch || isV0_6_73agToAiRegistrationPatch) ? withoutHelper : changedFiles;
}

function fileAllowedInGovernanceToolingSlice(file) {
  return GOVERNANCE_TOOLING_ALLOWED_SLICES.some((slice) => slice.files.includes(file));
}

function findMatchingGovernanceToolingSlice(changedFiles) {
  const normalizedChangedFiles = normalizeChangedFilesForSliceMatching(changedFiles);
  return GOVERNANCE_TOOLING_ALLOWED_SLICES.find((slice) => sameStringList(normalizedChangedFiles, slice.files)) || null;
}

function closestGovernanceToolingSlice(changedFiles) {
  const sortedChangedFiles = normalizeChangedFilesForSliceMatching([...changedFiles].sort());
  return GOVERNANCE_TOOLING_ALLOWED_SLICES
    .map((slice) => {
      const diff = diffStringList(sortedChangedFiles, slice.files);
      return {
        id: slice.id,
        files: slice.files,
        diff,
        distance: diff.unexpected_files.length + diff.missing_files.length
      };
    })
    .sort((left, right) => left.distance - right.distance || left.id.localeCompare(right.id))[0];
}

function packageChangeIsPreviewScriptOnly(currentPackageJson, baselinePackageJson, changedFiles) {
  if (!changedFiles.includes("package.json")) {
    return { allowed: true, mode: "package_json_unchanged" };
  }

  const current = cloneJson(currentPackageJson);
  const baseline = cloneJson(baselinePackageJson);
  const currentPreview = current.scripts?.["preview:review-console"];
  const baselinePreview = baseline.scripts?.["preview:review-console"];

  if (baselinePreview === currentPreview && sameJson(current, baseline)) {
    return { allowed: true, mode: "package_json_identical" };
  }

  if (baselinePreview !== undefined) {
    return { allowed: false, mode: "preview_script_already_existed_or_changed" };
  }

  if (currentPreview !== EXPECTED_PREVIEW_SCRIPT) {
    return { allowed: false, mode: "preview_script_value_unexpected" };
  }

  delete current.scripts["preview:review-console"];
  if (Object.keys(current.scripts).length === 0 && baseline.scripts === undefined) {
    delete current.scripts;
  }

  return {
    allowed: sameJson(current, baseline),
    mode: sameJson(current, baseline)
      ? "preview_review_console_script_added_only"
      : "package_json_has_other_changes"
  };
}

function packageChangeIsEvidenceGovernanceSanitizationOnly(currentPackageJson, baselinePackageJson, changedFiles) {
  if (!changedFiles.includes("package.json")) {
    return { allowed: true, mode: "package_json_unchanged" };
  }

  const current = cloneJson(currentPackageJson);
  const baseline = cloneJson(baselinePackageJson);
  const currentScripts = current.scripts || {};
  const baselineScripts = baseline.scripts || {};
  const expectedScripts = EXPECTED_EVIDENCE_GOVERNANCE_SANITIZATION_PACKAGE_SCRIPTS;

  for (const [name, value] of Object.entries(expectedScripts)) {
    if (currentScripts[name] !== value) {
      return { allowed: false, mode: `evidence_governance_script_${name}_unexpected` };
    }
  }

  for (const name of Object.keys(expectedScripts)) {
    if (baselineScripts[name] !== undefined) {
      baselineScripts[name] = currentScripts[name];
    } else {
      delete currentScripts[name];
    }
  }

  return {
    allowed: sameJson(current, baseline),
    mode: sameJson(current, baseline)
      ? "evidence_governance_validation_scripts_only"
      : "evidence_governance_package_has_other_changes"
  };
}

function packageChangeIsProviderEvidenceIntegrityPhase2Only(currentPackageJson, baselinePackageJson, changedFiles) {
  if (!changedFiles.includes("package.json")) {
    return { allowed: true, mode: "package_json_unchanged" };
  }

  const current = cloneJson(currentPackageJson);
  const baseline = cloneJson(baselinePackageJson);
  const currentScripts = current.scripts || {};
  const baselineScripts = baseline.scripts || {};
  const expectedScripts = EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PACKAGE_SCRIPTS;

  for (const [name, value] of Object.entries(expectedScripts)) {
    if (currentScripts[name] !== value) {
      return { allowed: false, mode: `provider_evidence_integrity_script_${name}_unexpected` };
    }
  }

  for (const name of Object.keys(expectedScripts)) {
    if (baselineScripts[name] !== undefined) {
      baselineScripts[name] = currentScripts[name];
    } else {
      delete currentScripts[name];
    }
  }

  return {
    allowed: sameJson(current, baseline),
    mode: sameJson(current, baseline)
      ? "provider_evidence_integrity_validation_scripts_only"
      : "provider_evidence_integrity_package_has_other_changes"
  };
}

function buildGovernanceToolingMaintenanceSliceReport({ changedFiles, stagedFiles, behind, currentPackageJson, baselinePackageJson }) {
  const sortedChangedFiles = [...changedFiles].sort();
  const normalizedChangedFiles = normalizeChangedFilesForSliceMatching(sortedChangedFiles);
  const pathAllowed = sortedChangedFiles.every(fileAllowedInGovernanceToolingSlice);
  const matchingSlice = findMatchingGovernanceToolingSlice(sortedChangedFiles);
  const closestSlice = matchingSlice || closestGovernanceToolingSlice(normalizedChangedFiles);
  const exactSliceMatches = matchingSlice !== null;
  const packageReport = matchingSlice?.id === "provider_evidence_integrity_phase_2_slice"
    ? packageChangeIsProviderEvidenceIntegrityPhase2Only(currentPackageJson, baselinePackageJson, sortedChangedFiles)
    : matchingSlice?.id === "evidence_governance_sanitization_slice"
      ? packageChangeIsEvidenceGovernanceSanitizationOnly(currentPackageJson, baselinePackageJson, sortedChangedFiles)
      : packageChangeIsPreviewScriptOnly(currentPackageJson, baselinePackageJson, sortedChangedFiles);
  const fileDiff = closestSlice
    ? diffStringList(normalizedChangedFiles, closestSlice.files)
    : { unexpected_files: normalizedChangedFiles, missing_files: [] };

  return {
    passed: behind === 0
      && stagedFiles.length === 0
      && sortedChangedFiles.length > 0
      && pathAllowed
      && exactSliceMatches
      && packageReport.allowed,
    behind_count_is_zero: behind === 0,
    staged_file_count_is_zero: stagedFiles.length === 0,
    path_allowed: pathAllowed,
    exact_slice_matches: exactSliceMatches,
    matched_slice_id: matchingSlice?.id || null,
    closest_slice_id: closestSlice?.id || null,
    package_change_allowed: packageReport.allowed,
    package_change_mode: packageReport.mode,
    expected_file_count: closestSlice?.files.length || 0,
    actual_file_count: sortedChangedFiles.length,
    unexpected_files: fileDiff.unexpected_files,
    missing_files: fileDiff.missing_files
  };
}

function governanceToolingMaintenanceSliceSelfCheck() {
  const baselinePackage = {
    name: "agent-image-lab",
    scripts: {
      "validate:mvp": "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
    },
    dependencies: {
      keep: "1.0.0"
    }
  };
  const previewOnlyPackage = cloneJson(baselinePackage);
  previewOnlyPackage.scripts["preview:review-console"] = EXPECTED_PREVIEW_SCRIPT;
  const dependencyChangedPackage = cloneJson(previewOnlyPackage);
  dependencyChangedPackage.dependencies.extra = "2.0.0";
  const arbitraryScriptPackage = cloneJson(baselinePackage);
  arbitraryScriptPackage.scripts["other:new-script"] = "node scripts/other.js";
  const evidenceGovernancePackage = cloneJson(baselinePackage);
  Object.assign(
    evidenceGovernancePackage.scripts,
    EXPECTED_EVIDENCE_GOVERNANCE_SANITIZATION_PACKAGE_SCRIPTS
  );
  const evidenceGovernanceDependencyChangedPackage = cloneJson(evidenceGovernancePackage);
  evidenceGovernanceDependencyChangedPackage.dependencies.extra = "2.0.0";
  const evidenceGovernanceArbitraryScriptPackage = cloneJson(evidenceGovernancePackage);
  evidenceGovernanceArbitraryScriptPackage.scripts["other:new-script"] = "node scripts/other.js";
  const evidenceGovernanceUnexpectedScriptPackage = cloneJson(evidenceGovernancePackage);
  evidenceGovernanceUnexpectedScriptPackage.scripts["validate:core"] = "echo unexpected";

  const checks = [
    {
      check: "allowlist_accepts_expected_helper",
      passed: fileAllowedInGovernanceToolingSlice("scripts/lib/governance_tooling_maintenance_slice.js")
    },
    {
      check: "allowlist_rejects_env",
      passed: !fileAllowedInGovernanceToolingSlice(".env")
    },
    {
      check: "exact_slice_matches_provider_evidence_integrity_phase_2",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PHASE_2_SLICE
      )?.id === "provider_evidence_integrity_phase_2_slice"
    },
    {
      check: "exact_slice_matches_provider_evidence_integrity_phase_2_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PHASE_2_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "provider_evidence_integrity_phase_2_slice"
    },
    {
      check: "provider_evidence_integrity_phase_2_rejects_runtime_kernel_change",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PHASE_2_SLICE,
        "scripts/validate_runtime_kernel_v0.js"
      ]) === null
    },
    {
      check: "provider_evidence_integrity_package_scripts_expected",
      passed: Object.keys(EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PACKAGE_SCRIPTS).length === 2
        && EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PACKAGE_SCRIPTS["validate:provider-evidence-integrity"] === "node scripts/validate_provider_evidence_integrity_contract.js"
        && EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PACKAGE_SCRIPTS["validate:all"].includes("npm run validate:provider-evidence-integrity")
    },
    {
      check: "exact_slice_matches_validation_gate_semantics",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_P2_0_VALIDATION_GATE_SEMANTICS_SLICE
      )?.id === "validation_gate_semantics_slice"
    },
    {
      check: "exact_slice_matches_validation_gate_semantics_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_P2_0_VALIDATION_GATE_SEMANTICS_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "validation_gate_semantics_slice"
    },
    {
      check: "validation_gate_semantics_rejects_package_change",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_P2_0_VALIDATION_GATE_SEMANTICS_SLICE,
        "package.json"
      ]) === null
    },
    {
      check: "exact_slice_matches_governance_v14_212_baseline_reconciliation",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_P1_8_GOVERNANCE_V14_212_BASELINE_RECONCILIATION_SLICE
      )?.id === "governance_v14_212_baseline_reconciliation_slice"
    },
    {
      check: "exact_slice_matches_governance_v14_212_baseline_reconciliation_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_P1_8_GOVERNANCE_V14_212_BASELINE_RECONCILIATION_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "governance_v14_212_baseline_reconciliation_slice"
    },
    {
      check: "governance_v14_212_baseline_reconciliation_rejects_package_change",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_P1_8_GOVERNANCE_V14_212_BASELINE_RECONCILIATION_SLICE,
        "package.json"
      ]) === null
    },
    {
      check: "exact_slice_matches_expected",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE)?.id
        === "governance_tooling_maintenance_slice_v1"
    },
    {
      check: "exact_slice_matches_evidence_governance_sanitization",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_P1_1_EVIDENCE_GOVERNANCE_SANITIZATION_SLICE)?.id
        === "evidence_governance_sanitization_slice"
    },
    {
      check: "exact_slice_matches_v0_3_1_plan",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN_SLICE)?.id
        === "v0_3_1_real_provider_cost_boundary_plan_slice"
    },
    {
      check: "exact_slice_matches_v0_3_2_packet",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_2_LIVE_CANDIDATE_ACTION_PACKET_SLICE)?.id
        === "v0_3_2_live_candidate_action_packet_slice"
    },
    {
      check: "exact_slice_matches_v0_3_3_gate",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE_SLICE)?.id
        === "v0_3_3_first_live_generation_pilot_gate_slice"
    },
    {
      check: "exact_slice_matches_provider_receipt_artifact_repair",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_PROVIDER_RECEIPT_ARTIFACT_REPAIR_SLICE)?.id
        === "provider_receipt_artifact_repair_slice"
    },
    {
      check: "exact_slice_matches_v0_3_4_visual_asset_governance_reconciliation",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_4_VISUAL_ASSET_GOVERNANCE_RECONCILIATION_SLICE)?.id
        === "v0_3_4_visual_asset_governance_reconciliation_slice"
    },
    {
      check: "exact_slice_matches_v0_3_6_post_push_state_sync",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE)?.id
        === "v0_3_6_post_push_state_sync_slice"
    },
    {
      check: "exact_slice_matches_v0_3_6_post_push_state_sync_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_3_6_post_push_state_sync_slice"
    },
    {
      check: "exact_slice_matches_v0_3_7_bounded_l4_executor_preflight_contract",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_SLICE)?.id
        === "v0_3_7_bounded_l4_executor_preflight_contract_slice"
    },
    {
      check: "exact_slice_matches_v0_3_7a_push_safety_lane",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_7A_PUSH_SAFETY_LANE_SLICE)?.id
        === "v0_3_7a_push_safety_lane_slice"
    },
    {
      check: "exact_slice_matches_v0_3_7c_push_l1_regression_usage_boundary",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_7C_PUSH_L1_REGRESSION_USAGE_BOUNDARY_SLICE)?.id
        === "v0_3_7c_push_l1_regression_usage_boundary_slice"
    },
    {
      check: "exact_slice_matches_v0_3_7d_visual_asset_eval_v0_1",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_7D_VISUAL_ASSET_EVAL_V0_1_SLICE)?.id
        === "v0_3_7d_visual_asset_eval_v0_1_slice"
    },
    {
      check: "exact_slice_matches_v0_3_7e_visual_sample_memory_policy",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_7E_VISUAL_SAMPLE_MEMORY_POLICY_SLICE)?.id
        === "v0_3_7e_visual_sample_memory_policy_slice"
    },
    {
      check: "exact_slice_matches_v0_3_15_fifteen_day_architecture_checkpoint",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_15_FIFTEEN_DAY_ARCHITECTURE_CHECKPOINT_SLICE)?.id
        === "v0_3_15_fifteen_day_architecture_checkpoint_slice"
    },
    {
      check: "exact_slice_matches_v0_4_0_visual_asset_eval_dry_run",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_0_VISUAL_ASSET_EVAL_DRY_RUN_SLICE)?.id
        === "v0_4_0_visual_asset_eval_dry_run_slice"
    },
    {
      check: "exact_slice_matches_v0_4_0a_visual_asset_eval_dry_run_asset_class_binding",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_4_0A_VISUAL_ASSET_EVAL_DRY_RUN_ASSET_CLASS_BINDING_SLICE
      )?.id === "v0_4_0a_visual_asset_eval_dry_run_asset_class_binding_slice"
    },
    {
      check: "exact_slice_matches_v0_4_1_visual_asset_review_pack",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_1_VISUAL_ASSET_REVIEW_PACK_SLICE)?.id
        === "v0_4_1_visual_asset_review_pack_slice"
    },
    {
      check: "exact_slice_matches_v0_4_2_visual_failure_taxonomy",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_2_VISUAL_FAILURE_TAXONOMY_SLICE)?.id
        === "v0_4_2_visual_failure_taxonomy_slice"
    },
    {
      check: "exact_slice_matches_v0_4_3_review_to_prompt_correction_hint",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_3_REVIEW_TO_PROMPT_CORRECTION_HINT_SLICE)?.id
        === "v0_4_3_review_to_prompt_correction_hint_slice"
    },
    {
      check: "exact_slice_matches_v0_4_4_sample_registry_dry_run",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_4_SAMPLE_REGISTRY_DRY_RUN_SLICE)?.id
        === "v0_4_4_sample_registry_dry_run_slice"
    },
    {
      check: "exact_slice_matches_v0_4_5_visual_eval_consistency_check",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_5_VISUAL_EVAL_CONSISTENCY_CHECK_SLICE)?.id
        === "v0_4_5_visual_eval_consistency_check_slice"
    },
    {
      check: "exact_slice_matches_v0_4_6_noop_visual_workflow_runner_plan",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_6_NOOP_VISUAL_WORKFLOW_RUNNER_PLAN_SLICE)?.id
        === "v0_4_6_noop_visual_workflow_runner_plan_slice"
    },
    {
      check: "exact_slice_matches_v0_4_7_seven_day_visual_workflow_checkpoint",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_7_SEVEN_DAY_VISUAL_WORKFLOW_CHECKPOINT_SLICE)?.id
        === "v0_4_7_seven_day_visual_workflow_checkpoint_slice"
    },
    {
      check: "exact_slice_matches_v0_4_7_review_findings_fix",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_7_REVIEW_FINDINGS_FIX_SLICE)?.id
        === "v0_4_7_review_findings_fix_slice"
    },
    {
      check: "exact_slice_matches_v0_4_8_visual_review_semantics_hardening",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_8_VISUAL_REVIEW_SEMANTICS_HARDENING_SLICE)?.id
        === "v0_4_8_visual_review_semantics_hardening_slice"
    },
    {
      check: "exact_slice_matches_v0_4_9_visual_evidence_consistency_hardening",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_4_9_VISUAL_EVIDENCE_CONSISTENCY_HARDENING_SLICE)?.id
        === "v0_4_9_visual_evidence_consistency_hardening_slice"
    },
    {
      check: "exact_slice_matches_v0_5_0_controlled_generation_readiness_packet",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_5_0_CONTROLLED_GENERATION_READINESS_PACKET_SLICE)?.id
        === "v0_5_0_controlled_generation_readiness_packet_slice"
    },
    {
      check: "exact_slice_matches_v0_5_1_prompt_package_preview",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_5_1_PROMPT_PACKAGE_PREVIEW_SLICE)?.id
        === "v0_5_1_prompt_package_preview_slice"
    },
    {
      check: "exact_slice_matches_v0_5_2_visual_review_replay_set",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_5_2_VISUAL_REVIEW_REPLAY_SET_SLICE)?.id
        === "v0_5_2_visual_review_replay_set_slice"
    },
    {
      check: "exact_slice_matches_v0_5_3_visual_memory_readonly_plan",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_5_3_VISUAL_MEMORY_READONLY_PLAN_SLICE)?.id
        === "v0_5_3_visual_memory_readonly_plan_slice"
    },
    {
      check: "exact_slice_matches_v0_5_4_next_15_day_visual_workflow_checkpoint",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_5_4_NEXT_15_DAY_VISUAL_WORKFLOW_CHECKPOINT_SLICE)?.id
        === "v0_5_4_next_15_day_visual_workflow_checkpoint_slice"
    },
    {
      check: "exact_slice_matches_v0_6_11_post_pull_cleanup",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_11_POST_PULL_CLEANUP_SLICE)?.id
        === "v0_6_11_post_pull_cleanup_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_local_preflight_only_gate",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_LOCAL_PREFLIGHT_ONLY_GATE_SLICE)?.id
        === "v0_6_12_local_preflight_only_gate_slice"
    },
    {
      check: "exact_slice_matches_v0_6_13_failed_provider_attempt_review",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_13_FAILED_PROVIDER_ATTEMPT_REVIEW_SLICE)?.id
        === "v0_6_13_failed_provider_attempt_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_and_v0_6_13_week1_preflight_and_failed_review",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_AND_V0_6_13_WEEK1_PREFLIGHT_AND_FAILED_REVIEW_SLICE)?.id
        === "v0_6_12_and_v0_6_13_week1_preflight_and_failed_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_14_exact_new_trial_action_packet_v0_1",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_14_EXACT_NEW_TRIAL_ACTION_PACKET_V0_1_SLICE)?.id
        === "v0_6_14_exact_new_trial_action_packet_v0_1_slice"
    },
    {
      check: "exact_slice_matches_v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_15_EXACT_NEW_TRIAL_NOOP_REHEARSAL_HUMAN_APPROVAL_GATE_SLICE)?.id
        === "v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate_slice"
    },
    {
      check: "exact_slice_matches_v0_6_16_exact_new_trial_human_approval_intake_validator",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_16_EXACT_NEW_TRIAL_HUMAN_APPROVAL_INTAKE_VALIDATOR_SLICE)?.id
        === "v0_6_16_exact_new_trial_human_approval_intake_validator_slice"
    },
    {
      check: "exact_slice_matches_v0_6_17_30_day_exact_new_trial_checkpoint",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_17_30_DAY_EXACT_NEW_TRIAL_CHECKPOINT_SLICE)?.id
        === "v0_6_17_30_day_exact_new_trial_checkpoint_slice"
    },
    {
      check: "exact_slice_matches_v0_6_18_single_generation_execution_preflight",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_18_SINGLE_GENERATION_EXECUTION_PREFLIGHT_SLICE)?.id
        === "v0_6_18_single_generation_execution_preflight_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_to_v0_6_14_exact_new_trial_prep",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_TO_V0_6_14_EXACT_NEW_TRIAL_PREP_SLICE)?.id
        === "v0_6_12_to_v0_6_14_exact_new_trial_prep_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_to_v0_6_15_exact_new_trial_preparation_loop",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_TO_V0_6_15_EXACT_NEW_TRIAL_PREPARATION_LOOP_SLICE)?.id
        === "v0_6_12_to_v0_6_15_exact_new_trial_preparation_loop_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_to_v0_6_16_exact_new_trial_auditable_preparation_loop",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_TO_V0_6_16_EXACT_NEW_TRIAL_AUDITABLE_PREPARATION_LOOP_SLICE)?.id
        === "v0_6_12_to_v0_6_16_exact_new_trial_auditable_preparation_loop_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_to_v0_6_17_exact_new_trial_30_day_closed_loop",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_TO_V0_6_17_EXACT_NEW_TRIAL_30_DAY_CLOSED_LOOP_SLICE)?.id
        === "v0_6_12_to_v0_6_17_exact_new_trial_30_day_closed_loop_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_to_v0_6_18_exact_new_trial_execution_preflight",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_TO_V0_6_18_EXACT_NEW_TRIAL_EXECUTION_PREFLIGHT_SLICE)?.id
        === "v0_6_12_to_v0_6_18_exact_new_trial_execution_preflight_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_to_v0_6_20_failed_no_image_post_run_review",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_TO_V0_6_20_FAILED_NO_IMAGE_POST_RUN_REVIEW_SLICE)?.id
        === "v0_6_12_to_v0_6_20_failed_no_image_post_run_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_to_v0_6_21_raw_provider_payload_capture_policy",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_TO_V0_6_21_RAW_PROVIDER_PAYLOAD_CAPTURE_POLICY_SLICE)?.id
        === "v0_6_12_to_v0_6_21_raw_provider_payload_capture_policy_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_to_v0_6_22_provider_payload_extraction_preflight",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_TO_V0_6_22_PROVIDER_PAYLOAD_EXTRACTION_PREFLIGHT_SLICE)?.id
        === "v0_6_12_to_v0_6_22_provider_payload_extraction_preflight_slice"
    },
    {
      check: "exact_slice_matches_v0_6_12_to_v0_6_23_single_generation_with_payload_trace",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_12_TO_V0_6_23_SINGLE_GENERATION_WITH_PAYLOAD_TRACE_SLICE)?.id
        === "v0_6_12_to_v0_6_23_single_generation_with_payload_trace_slice"
    },
    {
      check: "exact_slice_matches_v0_6_51_exact_new_trial_003_workflow_prerequisite_reconciliation_packet",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_51_EXACT_NEW_TRIAL_003_WORKFLOW_PREREQUISITE_RECONCILIATION_PACKET_SLICE)?.id
        === "v0_6_51_exact_new_trial_003_workflow_prerequisite_reconciliation_packet_slice"
    },
    {
      check: "exact_slice_matches_v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_52_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_PACKET_SLICE)?.id
        === "v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet_slice"
    },
    {
      check: "exact_slice_matches_v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_53_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_CAPTURE_SURFACE_STATIC_PANEL_SLICE)?.id
        === "v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel_slice"
    },
    {
      check: "exact_slice_matches_v0_6_54_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_54_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_INGESTION_PACKET_SLICE)?.id
        === "v0_6_54_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet_slice"
    },
    {
      check: "exact_slice_matches_v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_55_EXACT_NEW_TRIAL_003_USER_SUBMITTED_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_SLICE)?.id
        === "v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture_slice"
    },
    {
      check: "exact_slice_matches_v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_56_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_METADATA_REGISTRATION_SLICE)?.id
        === "v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration_slice"
    },
    {
      check: "exact_slice_matches_v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_57_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_METADATA_PREFLIGHT_AFTER_ACCEPTED_SAMPLE_REGISTRATION_SLICE)?.id
        === "v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration_slice"
    },
    {
      check: "exact_slice_matches_v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_58_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_AUTHORIZATION_PACKAGE_AFTER_METADATA_PREFLIGHT_SLICE)?.id
        === "v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight_slice"
    },
    {
      check: "exact_slice_matches_v0_6_59_exact_new_trial_003_durable_archive_write_execution_preflight_no_write",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_59_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_PREFLIGHT_NO_WRITE_SLICE)?.id
        === "v0_6_59_exact_new_trial_003_durable_archive_write_execution_preflight_no_write_slice"
    },
    {
      check: "exact_slice_matches_v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_6_60_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_RECEIPT_SLICE)?.id
        === "v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt_slice"
    },
    {
      check: "exact_slice_matches_v0_6_61_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_61_EXACT_NEW_TRIAL_003_CHINESE_MEMORY_ENTRY_READINESS_PREFLIGHT_NO_WRITE_SLICE
      )?.id === "v0_6_61_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write_slice"
    },
    {
      check: "exact_slice_matches_v0_6_62_exact_new_trial_003_amber_c_memory_write_target_resolution_blocked",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_62_EXACT_NEW_TRIAL_003_AMBER_C_MEMORY_WRITE_TARGET_RESOLUTION_BLOCKED_SLICE
      )?.id === "v0_6_62_exact_new_trial_003_amber_c_memory_write_target_resolution_blocked_slice"
    },
    {
      check: "exact_slice_matches_v0_6_63_vcp_agent_image_generation_tool_contract_v1",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_63_VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1_SLICE
      )?.id === "v0_6_63_vcp_agent_image_generation_tool_contract_v1_slice"
    },
    {
      check: "exact_slice_matches_v0_6_64_vcp_agent_image_generation_contract_mock_validation",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_64_VCP_AGENT_IMAGE_GENERATION_CONTRACT_MOCK_VALIDATION_SLICE
      )?.id === "v0_6_64_vcp_agent_image_generation_contract_mock_validation_slice"
    },
    {
      check: "exact_slice_matches_v0_6_65_vcp_agent_generation_route_selection_gate",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_65_VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE_SLICE
      )?.id === "v0_6_65_vcp_agent_generation_route_selection_gate_slice"
    },
    {
      check: "exact_slice_matches_v0_6_66_codex_session_image_import_preflight_only",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_66_CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT_ONLY_SLICE
      )?.id === "v0_6_66_codex_session_image_import_preflight_only_slice"
    },
    {
      check: "exact_slice_matches_v0_6_67_codex_session_image_import_record_contract",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_67_CODEX_SESSION_IMAGE_IMPORT_RECORD_CONTRACT_SLICE
      )?.id === "v0_6_67_codex_session_image_import_record_contract_slice"
    },
    {
      check: "exact_slice_matches_v0_6_68_codex_session_image_import_record_mock_validation",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_68_CODEX_SESSION_IMAGE_IMPORT_RECORD_MOCK_VALIDATION_SLICE
      )?.id === "v0_6_68_codex_session_image_import_record_mock_validation_slice"
    },
    {
      check: "exact_slice_matches_v0_6_69_codex_session_image_import_route_gap_review",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_69_CODEX_SESSION_IMAGE_IMPORT_ROUTE_GAP_REVIEW_SLICE
      )?.id === "v0_6_69_codex_session_image_import_route_gap_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_70_to_v0_6_72_real_vcp_agent_generation_preflight_blocked",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_70_TO_V0_6_72_REAL_VCP_AGENT_GENERATION_PREFLIGHT_BLOCKED_SLICE
      )?.id === "v0_6_70_to_v0_6_72_real_vcp_agent_generation_preflight_blocked_slice"
    },
    {
      check: "exact_slice_matches_mvp_legacy_debt_validator_repair",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_MVP_LEGACY_DEBT_VALIDATOR_REPAIR_SLICE
      )?.id === "mvp_legacy_debt_validator_repair_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73a_baseline_sync_and_route_state_check",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73A_BASELINE_SYNC_AND_ROUTE_STATE_CHECK_SLICE
      )?.id === "v0_6_73a_baseline_sync_and_route_state_check_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73b_native_doubao_secretless_binding_implementation_surface",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73B_NATIVE_DOUBAO_SECRETLESS_BINDING_IMPLEMENTATION_SURFACE_SLICE
      )?.id === "v0_6_73b_native_doubao_secretless_binding_implementation_surface_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73c_secretless_provider_receipt_contract",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT_SLICE
      )?.id === "v0_6_73c_secretless_provider_receipt_contract_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73d_real_generation_review_handoff_contract",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT_SLICE
      )?.id === "v0_6_73d_real_generation_review_handoff_contract_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73e_one_shot_execution_readiness_packet",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET_SLICE
      )?.id === "v0_6_73e_one_shot_execution_readiness_packet_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73f_exact_a5_execution_authorization_draft",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73F_EXACT_A5_EXECUTION_AUTHORIZATION_DRAFT_SLICE
      )?.id === "v0_6_73f_exact_a5_execution_authorization_draft_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73_execution_blocked_status_sync",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73_EXECUTION_BLOCKED_STATUS_SYNC_SLICE
      )?.id === "v0_6_73_execution_blocked_status_sync_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73_execution_blocked_status_sync_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73_EXECUTION_BLOCKED_STATUS_SYNC_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73_execution_blocked_status_sync_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73g_secretless_runtime_binding_implementation_surface",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73G_SECRETLESS_RUNTIME_BINDING_IMPLEMENTATION_SURFACE_SLICE
      )?.id === "v0_6_73g_secretless_runtime_binding_implementation_surface_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73g_secretless_runtime_binding_implementation_surface_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73G_SECRETLESS_RUNTIME_BINDING_IMPLEMENTATION_SURFACE_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73g_secretless_runtime_binding_implementation_surface_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73h_secretless_provider_runtime_bridge",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE_SLICE
      )?.id === "v0_6_73h_secretless_provider_runtime_bridge_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73h_secretless_provider_runtime_bridge_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73h_secretless_provider_runtime_bridge_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY_SLICE
      )?.id === "v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73l_bound_delegate_authorization_packet_draft",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE
      )?.id === "v0_6_73l_bound_delegate_authorization_packet_draft_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73l_bound_delegate_authorization_packet_draft_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73l_bound_delegate_authorization_packet_draft_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73m_bound_delegate_preflight_validator",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR_SLICE
      )?.id === "v0_6_73m_bound_delegate_preflight_validator_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73m_bound_delegate_preflight_validator_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73m_bound_delegate_preflight_validator_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73n_real_execution_go_no_go_review",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE
      )?.id === "v0_6_73n_real_execution_go_no_go_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73n_real_execution_go_no_go_review_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73n_real_execution_go_no_go_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73o_exact_real_execution_authorization_phrase_draft",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT_SLICE
      )?.id === "v0_6_73o_exact_real_execution_authorization_phrase_draft_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73o_exact_real_execution_authorization_phrase_draft_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73o_exact_real_execution_authorization_phrase_draft_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73p_local_aggregate_readiness_review",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73P_LOCAL_AGGREGATE_READINESS_REVIEW_SLICE
      )?.id === "v0_6_73p_local_aggregate_readiness_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73p_local_aggregate_readiness_review_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73P_LOCAL_AGGREGATE_READINESS_REVIEW_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73p_local_aggregate_readiness_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73q_push_safety_gate",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73Q_PUSH_SAFETY_GATE_SLICE
      )?.id === "v0_6_73q_push_safety_gate_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73q_push_safety_gate_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73Q_PUSH_SAFETY_GATE_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73q_push_safety_gate_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73r_remote_post_push_state_sync",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73R_REMOTE_POST_PUSH_STATE_SYNC_SLICE
      )?.id === "v0_6_73r_remote_post_push_state_sync_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73r_remote_post_push_state_sync_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73R_REMOTE_POST_PUSH_STATE_SYNC_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73r_remote_post_push_state_sync_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73s_final_real_execution_boundary_review",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW_SLICE
      )?.id === "v0_6_73s_final_real_execution_boundary_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73s_final_real_execution_boundary_review_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73s_final_real_execution_boundary_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73t_next_phase_selection_gate",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73T_NEXT_PHASE_SELECTION_GATE_SLICE
      )?.id === "v0_6_73t_next_phase_selection_gate_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73t_next_phase_selection_gate_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73T_NEXT_PHASE_SELECTION_GATE_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73t_next_phase_selection_gate_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73u_active_delegate_authorization_activation_preflight",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT_SLICE
      )?.id === "v0_6_73u_active_delegate_authorization_activation_preflight_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73u_active_delegate_authorization_activation_preflight_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73u_active_delegate_authorization_activation_preflight_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73u3_runtime_delegate_binding_test_harness_no_provider",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER_SLICE
      )?.id === "v0_6_73u3_runtime_delegate_binding_test_harness_no_provider_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73u3_runtime_delegate_binding_test_harness_no_provider_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73u3_runtime_delegate_binding_test_harness_no_provider_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73v_exact_active_delegate_authorization_packet_draft",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73V_EXACT_ACTIVE_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE
      )?.id === "v0_6_73v_exact_active_delegate_authorization_packet_draft_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73v_exact_active_delegate_authorization_packet_draft_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73V_EXACT_ACTIVE_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73v_exact_active_delegate_authorization_packet_draft_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73w_active_delegate_authorization_validator",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73W_ACTIVE_DELEGATE_AUTHORIZATION_VALIDATOR_SLICE
      )?.id === "v0_6_73w_active_delegate_authorization_validator_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73w_active_delegate_authorization_validator_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73W_ACTIVE_DELEGATE_AUTHORIZATION_VALIDATOR_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73w_active_delegate_authorization_validator_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73x_final_local_readiness_stop_line_review",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73X_FINAL_LOCAL_READINESS_STOP_LINE_REVIEW_SLICE
      )?.id === "v0_6_73x_final_local_readiness_stop_line_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73x_final_local_readiness_stop_line_review_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73X_FINAL_LOCAL_READINESS_STOP_LINE_REVIEW_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73x_final_local_readiness_stop_line_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73z_real_execution_authorization_boundary_review",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73Z_REAL_EXECUTION_AUTHORIZATION_BOUNDARY_REVIEW_SLICE
      )?.id === "v0_6_73z_real_execution_authorization_boundary_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73z_real_execution_authorization_boundary_review_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73Z_REAL_EXECUTION_AUTHORIZATION_BOUNDARY_REVIEW_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73z_real_execution_authorization_boundary_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73aa_active_delegate_authorization_activation_record",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD_SLICE
      )?.id === "v0_6_73aa_active_delegate_authorization_activation_record_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73aa_active_delegate_authorization_activation_record_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73aa_active_delegate_authorization_activation_record_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ab_post_activation_real_execution_go_no_go_review",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73AB_POST_ACTIVATION_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE
      )?.id === "v0_6_73ab_post_activation_real_execution_go_no_go_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ab_post_activation_real_execution_go_no_go_review_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73AB_POST_ACTIVATION_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73ab_post_activation_real_execution_go_no_go_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ad_remote_synced_final_execution_phrase_activation_review",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73AD_REMOTE_SYNCED_FINAL_EXECUTION_PHRASE_ACTIVATION_REVIEW_SLICE
      )?.id === "v0_6_73ad_remote_synced_final_execution_phrase_activation_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ad_remote_synced_final_execution_phrase_activation_review_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73AD_REMOTE_SYNCED_FINAL_EXECUTION_PHRASE_ACTIVATION_REVIEW_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73ad_remote_synced_final_execution_phrase_activation_review_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ae_exact_execution_phrase_active_for_execution_record",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73AE_EXACT_EXECUTION_PHRASE_ACTIVE_FOR_EXECUTION_RECORD_SLICE
      )?.id === "v0_6_73ae_exact_execution_phrase_active_for_execution_record_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ae_exact_execution_phrase_active_for_execution_record_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73AE_EXACT_EXECUTION_PHRASE_ACTIVE_FOR_EXECUTION_RECORD_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73ae_exact_execution_phrase_active_for_execution_record_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73af_final_pre_provider_execution_go_no_go",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73AF_FINAL_PRE_PROVIDER_EXECUTION_GO_NO_GO_SLICE
      )?.id === "v0_6_73af_final_pre_provider_execution_go_no_go_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73af_final_pre_provider_execution_go_no_go_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73AF_FINAL_PRE_PROVIDER_EXECUTION_GO_NO_GO_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73af_final_pre_provider_execution_go_no_go_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ag_remote_synced_phrase_activation_post_pull_verify",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73AG_REMOTE_SYNCED_PHRASE_ACTIVATION_POST_PULL_VERIFY_SLICE
      )?.id === "v0_6_73ag_remote_synced_phrase_activation_post_pull_verify_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ag_remote_synced_phrase_activation_post_pull_verify_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73AG_REMOTE_SYNCED_PHRASE_ACTIVATION_POST_PULL_VERIFY_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73ag_remote_synced_phrase_activation_post_pull_verify_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ah_current_head_final_pre_provider_go_no_go",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73AH_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO_NO_GO_SLICE
      )?.id === "v0_6_73ah_current_head_final_pre_provider_go_no_go_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ah_current_head_final_pre_provider_go_no_go_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73AH_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO_NO_GO_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73ah_current_head_final_pre_provider_go_no_go_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ag_to_ah_remote_sync_and_current_head_go_no_go",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73AG_TO_AH_REMOTE_SYNC_AND_CURRENT_HEAD_GO_NO_GO_SLICE
      )?.id === "v0_6_73ag_to_ah_remote_sync_and_current_head_go_no_go_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ag_to_ah_remote_sync_and_current_head_go_no_go_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73AG_TO_AH_REMOTE_SYNC_AND_CURRENT_HEAD_GO_NO_GO_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73ag_to_ah_remote_sync_and_current_head_go_no_go_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ag_to_ai_remote_sync_current_head_and_one_shot_blocked",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_V0_6_73AG_TO_AI_REMOTE_SYNC_CURRENT_HEAD_AND_ONE_SHOT_BLOCKED_SLICE
      )?.id === "v0_6_73ag_to_ai_remote_sync_current_head_and_one_shot_blocked_slice"
    },
    {
      check: "exact_slice_matches_v0_6_73ag_to_ai_remote_sync_current_head_and_one_shot_blocked_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_6_73AG_TO_AI_REMOTE_SYNC_CURRENT_HEAD_AND_ONE_SHOT_BLOCKED_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_6_73ag_to_ai_remote_sync_current_head_and_one_shot_blocked_slice"
    },
    {
      check: "exact_slice_rejects_missing_file",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE.slice(1)) === null
    },
    {
      check: "evidence_governance_slice_rejects_missing_file",
      passed: findMatchingGovernanceToolingSlice(
        EXPECTED_P1_1_EVIDENCE_GOVERNANCE_SANITIZATION_SLICE.slice(1)
      ) === null
    },
    {
      check: "package_allows_preview_script_only",
      passed: packageChangeIsPreviewScriptOnly(previewOnlyPackage, baselinePackage, ["package.json"]).allowed
    },
    {
      check: "package_rejects_dependency_change",
      passed: !packageChangeIsPreviewScriptOnly(dependencyChangedPackage, baselinePackage, ["package.json"]).allowed
    },
    {
      check: "package_rejects_arbitrary_script_change",
      passed: !packageChangeIsPreviewScriptOnly(arbitraryScriptPackage, baselinePackage, ["package.json"]).allowed
    },
    {
      check: "evidence_governance_package_allows_expected_validation_scripts_only",
      passed: packageChangeIsEvidenceGovernanceSanitizationOnly(
        evidenceGovernancePackage,
        baselinePackage,
        ["package.json"]
      ).allowed
    },
    {
      check: "evidence_governance_package_rejects_dependency_change",
      passed: !packageChangeIsEvidenceGovernanceSanitizationOnly(
        evidenceGovernanceDependencyChangedPackage,
        baselinePackage,
        ["package.json"]
      ).allowed
    },
    {
      check: "evidence_governance_package_rejects_arbitrary_script_change",
      passed: !packageChangeIsEvidenceGovernanceSanitizationOnly(
        evidenceGovernanceArbitraryScriptPackage,
        baselinePackage,
        ["package.json"]
      ).allowed
    },
    {
      check: "evidence_governance_package_rejects_unexpected_script_value",
      passed: !packageChangeIsEvidenceGovernanceSanitizationOnly(
        evidenceGovernanceUnexpectedScriptPackage,
        baselinePackage,
        ["package.json"]
      ).allowed
    }
  ];

  return {
    passed: checks.every((item) => item.passed),
    failures: checks.filter((item) => !item.passed),
    checks
  };
}

module.exports = {
  EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE,
  EXPECTED_V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN_SLICE,
  EXPECTED_V0_3_2_LIVE_CANDIDATE_ACTION_PACKET_SLICE,
  EXPECTED_V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE_SLICE,
  EXPECTED_PROVIDER_RECEIPT_ARTIFACT_REPAIR_SLICE,
  EXPECTED_V0_3_4_VISUAL_ASSET_GOVERNANCE_RECONCILIATION_SLICE,
  EXPECTED_V0_3_5_VISUAL_ASSET_PROMOTION_GATE_DESIGN_SLICE,
  EXPECTED_V0_3_6_BOUNDED_L4_AUTOPILOT_REQUIREMENTS_SLICE,
  EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE,
  EXPECTED_V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_SLICE,
  EXPECTED_V0_3_7A_PUSH_SAFETY_LANE_SLICE,
  EXPECTED_V0_3_7C_PUSH_L1_REGRESSION_USAGE_BOUNDARY_SLICE,
  EXPECTED_V0_3_7D_VISUAL_ASSET_EVAL_V0_1_SLICE,
  EXPECTED_V0_3_7E_VISUAL_SAMPLE_MEMORY_POLICY_SLICE,
  EXPECTED_V0_3_15_FIFTEEN_DAY_ARCHITECTURE_CHECKPOINT_SLICE,
  EXPECTED_V0_4_0_VISUAL_ASSET_EVAL_DRY_RUN_SLICE,
  EXPECTED_V0_4_0A_VISUAL_ASSET_EVAL_DRY_RUN_ASSET_CLASS_BINDING_SLICE,
  EXPECTED_V0_4_1_VISUAL_ASSET_REVIEW_PACK_SLICE,
  EXPECTED_V0_4_2_VISUAL_FAILURE_TAXONOMY_SLICE,
  EXPECTED_V0_4_3_REVIEW_TO_PROMPT_CORRECTION_HINT_SLICE,
  EXPECTED_V0_4_4_SAMPLE_REGISTRY_DRY_RUN_SLICE,
  EXPECTED_V0_4_5_VISUAL_EVAL_CONSISTENCY_CHECK_SLICE,
  EXPECTED_V0_4_6_NOOP_VISUAL_WORKFLOW_RUNNER_PLAN_SLICE,
  EXPECTED_V0_4_7_SEVEN_DAY_VISUAL_WORKFLOW_CHECKPOINT_SLICE,
  EXPECTED_V0_4_7_REVIEW_FINDINGS_FIX_SLICE,
  EXPECTED_V0_4_8_VISUAL_REVIEW_SEMANTICS_HARDENING_SLICE,
  EXPECTED_V0_4_9_VISUAL_EVIDENCE_CONSISTENCY_HARDENING_SLICE,
  EXPECTED_V0_5_0_CONTROLLED_GENERATION_READINESS_PACKET_SLICE,
  EXPECTED_V0_5_1_PROMPT_PACKAGE_PREVIEW_SLICE,
  EXPECTED_V0_5_2_VISUAL_REVIEW_REPLAY_SET_SLICE,
  EXPECTED_V0_5_3_VISUAL_MEMORY_READONLY_PLAN_SLICE,
  EXPECTED_V0_5_4_NEXT_15_DAY_VISUAL_WORKFLOW_CHECKPOINT_SLICE,
  EXPECTED_V0_5_5_CONTROLLED_GENERATION_READINESS_SEMANTICS_HARDENING_SLICE,
  EXPECTED_V0_5_6_HUMAN_REVIEW_GATE_PACKET_SLICE,
  EXPECTED_V0_5_7_NOOP_CONTROLLED_GENERATION_RUNNER_DRY_RUN_SLICE,
  EXPECTED_V0_5_8_CONTROLLED_GENERATION_EVIDENCE_CONTRACT_SLICE,
  EXPECTED_V0_5_9_VISUAL_MEMORY_READONLY_QUERY_CONTRACT_SLICE,
  EXPECTED_V0_6_0_FIRST_CONTROLLED_GENERATION_AUTHORIZATION_PACKET_SLICE,
  EXPECTED_V0_6_1_FIFTEEN_DAY_CONTROLLED_GENERATION_READINESS_CHECKPOINT_SLICE,
  EXPECTED_V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN_SLICE,
  EXPECTED_V0_6_3_FAILED_PROVIDER_ATTEMPT_INSPECTION_SLICE,
  EXPECTED_V0_6_4_EXACT_NEW_TRIAL_AUTHORIZATION_REFRESH_SLICE,
  EXPECTED_V0_6_5_READY_FOR_EXACT_NEW_TRIAL_AUTHORIZATION_CHECKPOINT_SLICE,
  EXPECTED_V0_6_6_EXACT_NEW_TRIAL_A5_REQUEST_DRAFT_SLICE,
  EXPECTED_V0_6_7_EXACT_NEW_TRIAL_AUTHORIZATION_INTAKE_PREFLIGHT_SLICE,
  EXPECTED_V0_6_8_EXACT_NEW_TRIAL_INTAKE_FIELD_RESOLUTION_SLICE,
  EXPECTED_V0_6_9_EXACT_NEW_TRIAL_REQUEST_TEXT_REGENERATED_SLICE,
  EXPECTED_V0_6_10_EXACT_NEW_TRIAL_HUMAN_DECISION_PREVIEW_GATE_SLICE,
  EXPECTED_V0_6_11_EXACT_NEW_TRIAL_PREFLIGHT_AUTHORIZATION_GATE_SLICE,
  EXPECTED_V0_6_11_POST_PULL_CLEANUP_SLICE,
  EXPECTED_V0_6_12_LOCAL_PREFLIGHT_ONLY_GATE_SLICE,
  EXPECTED_V0_6_13_FAILED_PROVIDER_ATTEMPT_REVIEW_SLICE,
  EXPECTED_V0_6_12_AND_V0_6_13_WEEK1_PREFLIGHT_AND_FAILED_REVIEW_SLICE,
  EXPECTED_V0_6_14_EXACT_NEW_TRIAL_ACTION_PACKET_V0_1_SLICE,
  EXPECTED_V0_6_12_TO_V0_6_14_EXACT_NEW_TRIAL_PREP_SLICE,
  EXPECTED_V0_6_15_EXACT_NEW_TRIAL_NOOP_REHEARSAL_HUMAN_APPROVAL_GATE_SLICE,
  EXPECTED_V0_6_12_TO_V0_6_15_EXACT_NEW_TRIAL_PREPARATION_LOOP_SLICE,
  EXPECTED_V0_6_16_EXACT_NEW_TRIAL_HUMAN_APPROVAL_INTAKE_VALIDATOR_SLICE,
  EXPECTED_V0_6_12_TO_V0_6_16_EXACT_NEW_TRIAL_AUDITABLE_PREPARATION_LOOP_SLICE,
  EXPECTED_V0_6_17_30_DAY_EXACT_NEW_TRIAL_CHECKPOINT_SLICE,
  EXPECTED_V0_6_12_TO_V0_6_17_EXACT_NEW_TRIAL_30_DAY_CLOSED_LOOP_SLICE,
  EXPECTED_V0_6_18_SINGLE_GENERATION_EXECUTION_PREFLIGHT_SLICE,
  EXPECTED_V0_6_12_TO_V0_6_18_EXACT_NEW_TRIAL_EXECUTION_PREFLIGHT_SLICE,
  EXPECTED_V0_6_12_TO_V0_6_20_FAILED_NO_IMAGE_POST_RUN_REVIEW_SLICE,
  EXPECTED_V0_6_12_TO_V0_6_21_RAW_PROVIDER_PAYLOAD_CAPTURE_POLICY_SLICE,
  EXPECTED_V0_6_12_TO_V0_6_22_PROVIDER_PAYLOAD_EXTRACTION_PREFLIGHT_SLICE,
  EXPECTED_V0_6_12_TO_V0_6_23_SINGLE_GENERATION_WITH_PAYLOAD_TRACE_SLICE,
  EXPECTED_V0_6_33_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_HUMAN_APPROVAL_INTAKE_PACKAGE_SLICE,
  EXPECTED_V0_6_34_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_POST_APPROVAL_GATE_ALIGNMENT_SLICE,
  EXPECTED_V0_6_35_EXACT_NEW_TRIAL_003_POST_APPROVAL_REGISTRATION_PREFLIGHT_DRAFT_SLICE,
  EXPECTED_V0_6_50_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_GO_NO_GO_CHECKPOINT_SLICE,
  EXPECTED_V0_6_51_EXACT_NEW_TRIAL_003_WORKFLOW_PREREQUISITE_RECONCILIATION_PACKET_SLICE,
  EXPECTED_V0_6_52_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_PACKET_SLICE,
  EXPECTED_V0_6_53_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_CAPTURE_SURFACE_STATIC_PANEL_SLICE,
  EXPECTED_V0_6_54_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_INGESTION_PACKET_SLICE,
  EXPECTED_V0_6_55_EXACT_NEW_TRIAL_003_USER_SUBMITTED_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_SLICE,
  EXPECTED_V0_6_56_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_METADATA_REGISTRATION_SLICE,
  EXPECTED_V0_6_57_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_METADATA_PREFLIGHT_AFTER_ACCEPTED_SAMPLE_REGISTRATION_SLICE,
  EXPECTED_V0_6_58_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_AUTHORIZATION_PACKAGE_AFTER_METADATA_PREFLIGHT_SLICE,
  EXPECTED_V0_6_59_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_PREFLIGHT_NO_WRITE_SLICE,
  EXPECTED_V0_6_60_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_RECEIPT_SLICE,
  EXPECTED_V0_6_61_EXACT_NEW_TRIAL_003_CHINESE_MEMORY_ENTRY_READINESS_PREFLIGHT_NO_WRITE_SLICE,
  EXPECTED_V0_6_62_EXACT_NEW_TRIAL_003_AMBER_C_MEMORY_WRITE_TARGET_RESOLUTION_BLOCKED_SLICE,
  EXPECTED_V0_6_63_VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1_SLICE,
  EXPECTED_V0_6_64_VCP_AGENT_IMAGE_GENERATION_CONTRACT_MOCK_VALIDATION_SLICE,
  EXPECTED_V0_6_65_VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE_SLICE,
  EXPECTED_V0_6_66_CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT_ONLY_SLICE,
  EXPECTED_V0_6_67_CODEX_SESSION_IMAGE_IMPORT_RECORD_CONTRACT_SLICE,
  EXPECTED_V0_6_68_CODEX_SESSION_IMAGE_IMPORT_RECORD_MOCK_VALIDATION_SLICE,
  EXPECTED_V0_6_69_CODEX_SESSION_IMAGE_IMPORT_ROUTE_GAP_REVIEW_SLICE,
  EXPECTED_V0_6_70_TO_V0_6_72_REAL_VCP_AGENT_GENERATION_PREFLIGHT_BLOCKED_SLICE,
  EXPECTED_MVP_LEGACY_DEBT_VALIDATOR_REPAIR_SLICE,
  EXPECTED_V0_6_73A_BASELINE_SYNC_AND_ROUTE_STATE_CHECK_SLICE,
  EXPECTED_V0_6_73B_NATIVE_DOUBAO_SECRETLESS_BINDING_IMPLEMENTATION_SURFACE_SLICE,
  EXPECTED_V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT_SLICE,
  EXPECTED_V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT_SLICE,
  EXPECTED_V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET_SLICE,
  EXPECTED_V0_6_73F_EXACT_A5_EXECUTION_AUTHORIZATION_DRAFT_SLICE,
  EXPECTED_V0_6_73_EXECUTION_BLOCKED_STATUS_SYNC_SLICE,
  EXPECTED_V0_6_73G_SECRETLESS_RUNTIME_BINDING_IMPLEMENTATION_SURFACE_SLICE,
  EXPECTED_V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE_SLICE,
  EXPECTED_V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY_SLICE,
  EXPECTED_V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE,
  EXPECTED_V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR_SLICE,
  EXPECTED_V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE,
  EXPECTED_V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT_SLICE,
  EXPECTED_V0_6_73P_LOCAL_AGGREGATE_READINESS_REVIEW_SLICE,
  EXPECTED_V0_6_73Q_PUSH_SAFETY_GATE_SLICE,
  EXPECTED_V0_6_73R_REMOTE_POST_PUSH_STATE_SYNC_SLICE,
  EXPECTED_V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW_SLICE,
  EXPECTED_V0_6_73T_NEXT_PHASE_SELECTION_GATE_SLICE,
  EXPECTED_V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT_SLICE,
  EXPECTED_V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER_SLICE,
  EXPECTED_V0_6_73V_EXACT_ACTIVE_DELEGATE_AUTHORIZATION_PACKET_DRAFT_SLICE,
  EXPECTED_V0_6_73W_ACTIVE_DELEGATE_AUTHORIZATION_VALIDATOR_SLICE,
  EXPECTED_V0_6_73X_FINAL_LOCAL_READINESS_STOP_LINE_REVIEW_SLICE,
  EXPECTED_V0_6_73Z_REAL_EXECUTION_AUTHORIZATION_BOUNDARY_REVIEW_SLICE,
  EXPECTED_V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD_SLICE,
  EXPECTED_V0_6_73AB_POST_ACTIVATION_REAL_EXECUTION_GO_NO_GO_REVIEW_SLICE,
  EXPECTED_V0_6_73AD_REMOTE_SYNCED_FINAL_EXECUTION_PHRASE_ACTIVATION_REVIEW_SLICE,
  EXPECTED_V0_6_73AE_EXACT_EXECUTION_PHRASE_ACTIVE_FOR_EXECUTION_RECORD_SLICE,
  EXPECTED_V0_6_73AF_FINAL_PRE_PROVIDER_EXECUTION_GO_NO_GO_SLICE,
  EXPECTED_V0_6_73AG_REMOTE_SYNCED_PHRASE_ACTIVATION_POST_PULL_VERIFY_SLICE,
  EXPECTED_V0_6_73AH_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO_NO_GO_SLICE,
  EXPECTED_V0_6_73AG_TO_AH_REMOTE_SYNC_AND_CURRENT_HEAD_GO_NO_GO_SLICE,
  EXPECTED_V0_6_73AG_TO_AI_REMOTE_SYNC_CURRENT_HEAD_AND_ONE_SHOT_BLOCKED_SLICE,
  EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PHASE_2_SLICE,
  EXPECTED_P2_1_PROVIDER_EVIDENCE_INTEGRITY_PACKAGE_SCRIPTS,
  EXPECTED_P2_0_VALIDATION_GATE_SEMANTICS_SLICE,
  EXPECTED_P1_8_GOVERNANCE_V14_212_BASELINE_RECONCILIATION_SLICE,
  EXPECTED_P1_1_EVIDENCE_GOVERNANCE_SANITIZATION_SLICE,
  EXPECTED_EVIDENCE_GOVERNANCE_SANITIZATION_PACKAGE_SCRIPTS,
  GOVERNANCE_TOOLING_ALLOWED_SLICES,
  buildGovernanceToolingMaintenanceSliceReport,
  fileAllowedInGovernanceToolingSlice,
  governanceToolingMaintenanceSliceSelfCheck,
  packageChangeIsPreviewScriptOnly,
  packageChangeIsEvidenceGovernanceSanitizationOnly
};
