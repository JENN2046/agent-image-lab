param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'
$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure {
  param([string]$Message)
  $failures.Add($Message) | Out-Null
}

function Test-RequiredFile {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath (Join-Path $Root $Path) -PathType Leaf)) {
    Add-Failure "Missing required file: $Path"
  }
}

function Test-RequiredDirectory {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath (Join-Path $Root $Path) -PathType Container)) {
    Add-Failure "Missing required directory: $Path"
  }
}

$requiredFiles = @(
  'README.md',
  'AGENTS.md',
  'AGENTS.autopilot-overlay.md',
  'README_AGENT_IMAGE_LAB_AUTOPILOT.md',
  'AUTOPILOT_REFACTOR_REPORT.md',
  '00_project_skeleton.md',
  'DECISIONS.md',
  'MANIFEST.md',
  'RELEASE_NOTES.md',
  '.agent_board/BLOCKERS.md',
  '.agent_board/CHECKPOINT.md',
  '.agent_board/DECISIONS.md',
  '.agent_board/HANDOFF.md',
  '.agent_board/RUN_STATE.md',
  '.agent_board/TASK_QUEUE.md',
  '.agent_board/VALIDATION_LOG.md',
  'codex/AGENT_IMAGE_LAB_AUTOPILOT_PROMPT.md',
  'adapter_dry_run_lab/README.md',
  'adapter_dry_run_lab/adapter_dry_run.js',
  'adapter_dry_run_lab/fixtures/accepted_request.json',
  'adapter_dry_run_lab/fixtures/rejected_request.json',
  'adapter_dry_run_lab/fixtures/photo_studio_os_v0_7_rehearsal_request.json',
  'exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js',
  'exports/vcptoolbox/Plugin/AgentImageLabAdapter/plugin-manifest.json',
  'exports/vcptoolbox/Plugin/AgentImageLabAdapter/README.md',
  'exports/vcptoolbox/Plugin/AgentImageLabAdapter/config.env.example',
  'scripts/run_v0_7_photo_studio_os_real_execution.ps1',
  'scripts/run_v0_10_gptimagegen_real_execution.ps1',
  'scripts/validate-agent-image-lab-local.ps1',
  'scripts/validate-agent-image-lab-local.sh',
  'scripts/validate_agent_board_state.js',
  'scripts/validate_autopilot_governance_kernel.js',
  'scripts/validate_autopilot_goal_compiler.js',
  'scripts/materialize_autopilot_goal_decomposition.js',
  'scripts/reconcile_agent_board_queue.js',
  'scripts/validate_agent_board_queue_reconciliation.js',
  'scripts/orchestrate_next_safe_task.js',
  'scripts/validate_next_safe_task_orchestrator.js',
  'scripts/simulate_amber_dry_run_execution_loop.js',
  'scripts/validate_amber_dry_run_execution_loop.js',
  'scripts/detect_autopilot_evolution_gaps.js',
  'scripts/validate_autopilot_evolution_engine.js',
  'scripts/validate_complete_autopilot_readiness_gate.js',
  'scripts/validate_local_checkpoint_manifest.js',
  'scripts/validate_local_commit_scope.js',
  'scripts/validate_post_push_state.js',
  'scripts/validate_v4_index_consistency.js',
  'scripts/validate_local_tag_push_readiness.js',
  'scripts/validate_v5_delivery_readiness.js',
  'scripts/validate_runtime_delivery_surface.js',
  'scripts/validate_adapter_delivery_surface.js',
  'scripts/validate_review_console_adapter_handoff.js',
  'scripts/validate_review_console_blocker_arbiter_regression_matrix.js',
  'scripts/validate_review_report_negative_guard_regression_matrix.js',
  'scripts/validate_review_report_route_summary.js',
  'scripts/validate_review_report_admission_control_matrix.js',
  'scripts/validate_review_report_production_exclusion_register.js',
  'scripts/validate_review_report_memory_admission_register.js',
  'scripts/validate_review_report_memory_delta_draft_register.js',
  'scripts/validate_review_report_protocol_final_closeout.js',
  'scripts/validate_review_blocker_arbiter_route_summary.js',
  'scripts/validate_review_memory_admission_control.js',
  'scripts/validate_review_production_admission_control.js',
  'scripts/validate_review_admission_control_matrix.js',
  'scripts/validate_review_report_contract.js',
  'scripts/validate_review_console_blocker_arbiter_boundary_scan.js',
  'scripts/validate_v5_local_sync_readiness.js',
  'scripts/validate_v5_post_commit_reconciliation.js',
  'scripts/validate_v5_index_consistency.js',
  'scripts/validate_v5_local_batch_commit_readiness.js',
  'scripts/validate_v5_handoff_freshness.js',
  'scripts/validate_v5_true_loop_candidate_delivery.js',
  'scripts/validate_v5_post_merge_reconciliation.js',
  'scripts/validate_v5_12_release_candidate_readiness.js',
  'scripts/validate_v7_40_local_a4_a5_autonomy_alignment.js',
  'scripts/validate_v7_41_external_remote_debug_verification_script_creation_record.js',
  'scripts/validate_v7_42_external_remote_debug_verification_script_creation_authorization_package.js',
  'scripts/validate_v7_43_external_remote_debug_verification_script_creation_execution_record.js',
  'scripts/validate_v7_44_remote_debug_script_run_and_vcpchat_launch_record.js',
  'scripts/validate_v7_45_cdp_read_only_attempt_record.js',
  'scripts/validate_v7_46_remote_debug_relaunch_runtime_verification_record.js',
  'scripts/validate_v10_0_a5_end_to_end_activation_package.js',
  'scripts/validate_v10_1_a5_resume_after_external_worktree_reconciliation.js',
  'scripts/validate_v10_2_a5_bridge_smoke_blocked_record.js',
  'scripts/validate_v10_3_a5_bridge_integration_smoke_record.js',
  'scripts/validate_v10_4_a5_doubaogen_single_generation_rejected_asset_record.js',
  'scripts/validate_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.js',
  'scripts/validate_v10_6_a5_prompt_failure_analysis_and_safer_strategy.js',
  'scripts/validate_v10_7_a5_safer_prompt_review_package.js',
  'scripts/validate_v10_8_a5_positive_still_life_generation_preflight_gate.js',
  'scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js',
  'scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js',
  'scripts/validate_v10_11_a5_prompt_handoff_diagnostic_result.js',
  'scripts/validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js',
  'scripts/validate_v10_15_runner_utf8_no_bom_transport.js',
  'scripts/validate_v10_20_plugin_reported_model_recording.js',
  'scripts/validate_v10_26_real_dailynote_write_closeout.js',
  'scripts/validate_v10_27_dailynotewrite_root_path_correction.js',
  'scripts/validate_v10_28_dailynote_canonical_location_guard.js',
  'scripts/run_vcpchat_review_console_remote_debug_smoke.ps1',
  'scripts/validate_runtime_guard_unit.js',
  'scripts/validate_runtime_prototype_smoke.js',
  'scripts/validate_runtime_prototype_suite.js',
  'scripts/validate_v6_0_product_runtime_kickoff.js',
  'scripts/validate_v6_1_task_panel_interaction.js',
  'scripts/validate_v6_2_asset_index_interaction.js',
  'scripts/validate_v6_3_session_store_interaction.js',
  'scripts/validate_v6_4_memory_queue_interaction.js',
  'scripts/validate_v6_5_review_console_product_shell.js',
  'scripts/validate_v6_6_product_shell_qa.js',
  'scripts/validate_v6_7_product_runtime_final_acceptance.js',
  'scripts/validate_v6_8_plugin_dashboard.js',
  'scripts/validate_v6_8b_plugin_dashboard_guard_hardening.js',
  'scripts/validate_v6_9_release_panel_plan.js',
  'scripts/validate_v6_9a_release_panel_draft_surface.js',
  'scripts/validate_v6_9b_release_panel_guard_hardening.js',
  'scripts/validate_v6_10_product_runtime_rc_readiness_matrix.js',
  'scripts/validate_v6_validator_quality_gate.js',
  'scripts/validate_v6_operator_runbook_and_resume_capsule.js',
  'scripts/validate_v7_0_real_production_landing_preflight.js',
  'scripts/validate_v7_1_single_real_generation_controlled_run_package.js',
  'scripts/validate_v7_2_generation_failure_taxonomy_and_retry_policy.js',
  'scripts/validate_v7_3_asset_acceptance_gate.js',
  'scripts/validate_v7_4_memory_write_gate_package.js',
  'scripts/validate_v7_5_production_run_dry_run_prep.js',
  'scripts/validate_v7_6_single_real_generation_activation_package.js',
  'scripts/validate_v7_7_single_real_generation_activation_readiness_check.js',
  'scripts/validate_v7_8_a5_template_prompt_library.js',
  'scripts/validate_v7_9_prompt_library_activation_ux.js',
  'scripts/validate_v7_10_image_generation_plugin_call_library.js',
  'scripts/validate_v7_11_prompt_correction.js',
  'scripts/validate_v7_12_runner_model_override_preflight.js',
  'scripts/validate_v7_13_post_run_review_correction_loop.js',
  'scripts/validate_v7_14_doubaogen_model_lock_enforcement.js',
  'scripts/validate_v7_15_native_doubao_image_plugin.js',
  'scripts/validate_v7_16_native_doubao_real_api_activation_preflight.js',
  'scripts/validate_v7_17_native_doubao_real_api_implementation_draft.js',
  'scripts/validate_v7_18_local_native_doubao_env_setup.js',
  'scripts/validate_v7_19_native_doubao_a5_runner_preflight.js',
  'scripts/validate_v7_20_native_doubao_real_runner_implementation.js',
  'scripts/validate_v7_21_native_doubao_first_real_generation_post_run_review.js',
  'scripts/validate_v7_22_prompt_correction_no_watermark_unobstructed_product_v3.js',
  'scripts/validate_v7_23_prompt_quality_gate_v1.js',
  'scripts/validate_v7_24_native_doubao_v3_post_run_review_accepted_candidate.js',
  'scripts/validate_v7_25_french_summer_rattan_bucket_bag_prompt_package.js',
  'scripts/validate_v7_27_watermark_provenance_diagnostic.js',
  'scripts/validate_v7_28_french_summer_watermark_control_prompt_correction.js',
  'scripts/validate_v7_30_native_doubao_watermark_parameter_enforcement.js',
  'scripts/validate_v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_post_run_review_accepted_candidate.js',
  'scripts/validate_v7_32_accepted_sample_registry_update.js',
  'scripts/validate_v7_33_failure_registry.js',
  'scripts/validate_v7_34_3_shot_stability_test_plan.js',
  'scripts/validate_prompt_package_library.js',
  'scripts/validate_a5_generation_template.js',
  'scripts/validate_visual_eval_seed_record_schema.js',
  'scripts/validate_visual_eval_seed_registry_schema.js',
  'scripts/validate_pvos_kernel_minimal.js',
  'scripts/validate_pvos_kernel_dry_run_adapter.js',
  'scripts/validate_pvos_evidence_collector_blocker_pipeline.js',
  'scripts/validate_v14_081_pvos_exact_a5_authorization_package.js',
  'scripts/validate_v14_082_pvos_metadata_only_preflight_authorization_correction.js',
  'scripts/validate_v14_111_codex_session_memory_delta_draft.js',
  'scripts/validate_v14_112_production_candidate_gate_policy.js',
  'scripts/validate_v14_113_failure_samples_authorization_boundary.js',
  'scripts/validate_v14_114_review_console_handoff_taxonomy_alignment.js',
  'scripts/validate_v14_115_dry_run_vcp_adapter_current_goal_alignment.js',
  'scripts/validate_v14_116_manifest_read_authorization_current_goal_alignment.js',
  'scripts/validate_v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.js',
  'scripts/validate_v14_118_rollback_audit_validation_package_current_goal_alignment.js',
  'scripts/validate_v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.js',
  'scripts/validate_v14_120_visual_series_taxonomy_review_scorecard_alignment.js',
  'scripts/validate_v14_121_codex_session_prompt_package_library_governance.js',
  'scripts/validate_v14_122_local_review_record_schema_refresh.js',
  'scripts/validate_v14_123_memory_delta_draft_schema_alignment_for_codex_reviews.js',
  'scripts/validate_v14_124_context_load_guide_and_historical_docs_compaction.js',
  'scripts/validate_v14_125_review_console_memory_delta_handoff_refresh.js',
  'scripts/validate_v14_126_accepted_failure_metadata_cross_index_gap_review.js',
  'scripts/validate_v14_127_production_exclusion_draft_current_goal_gap_review.js',
  'scripts/validate_v14_128_failure_samples_authorization_template_current_goal_gap_review.js',
  'scripts/validate_v14_129_current_goal_completion_audit_gap_map.js',
  'scripts/validate_v14_130_legacy_docs_context_quarantine_refresh.js',
  'scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js',
  'scripts/validate_v14_132_state_scope_canonicalization.js',
  'scripts/validate_v14_133_main_validator_real_import_record_wiring.js',
  'scripts/validate_v14_134_review_console_static_import_record_reader.js',
  'scripts/validate_v14_135_review_console_import_reader_safety_review.js',
  'scripts/validate_v14_136_accepted_samples_recoverability_metadata_patch.js',
  'scripts/validate_v14_137_project_master_plan_quarantine_status_demotion.js',
  'scripts/validate_v14_138_dashboard_alignment_from_real_artifact_evidence.js',
  'scripts/validate_v14_139_durable_archive_production_candidate_memory_write_authorization_split_planning.js',
  'scripts/validate_v14_140_two_week_regression_closeout.js',
  'scripts/lib/artifact_recoverability_core.js',
  'scripts/validate_v14_141_recoverability_core_extraction.js',
  'scripts/validate_v14_142_multi_accepted_sample_matrix.js',
  'scripts/validate_v14_143_import_review_registry_schema_hardening.js',
  'scripts/validate_v14_144_review_console_schema_binding.js',
  'scripts/validate_v14_145_sample_lifecycle_state_machine.js',
  'scripts/validate_v14_146_durable_archive_dry_run_manifest.js',
  'scripts/validate_v14_147_production_candidate_eligibility_preflight.js',
  'scripts/validate_v14_148_memory_delta_draft_package.js',
  'scripts/compile_v14_149_authorization_packages.js',
  'scripts/validate_v14_149_authorization_package_compiler.js',
  'scripts/run_v14_local_regression_suite.js',
  'scripts/validate_v14_150_local_regression_suite_consolidation.js',
  'scripts/validate_v14_151_dry_run_vcp_adapter_contract_v1.js',
  'scripts/validate_v14_152_review_console_handoff_contract.js',
  'scripts/validate_v14_153_manifest_read_authorization_gate_package.js',
  'scripts/validate_v14_159_end_to_end_audit_rollback_package.js',
  'scripts/validate_v14_160_two_month_product_capability_closeout.js',
  'scripts/validate_v14_161_codex_session_generated_candidate_readiness.js',
  'scripts/validate_v14_162_lamp_prompt_revision_after_v14_161_review.js',
  'scripts/validate_v14_163_lamp_v2_generated_candidate_readiness.js',
  'scripts/validate_v14_164_bag_accepted_samples_metadata_registration_preflight.js',
  'scripts/validate_v14_165_bag_accepted_samples_metadata_registration.js',
  'scripts/validate_v14_166_lamp_v3_generated_candidate_readiness.js',
  'scripts/validate_v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.js',
  'scripts/validate_v14_168_three_sample_dashboard_evidence_alignment.js',
  'scripts/validate_v14_214_lamp_third_sample_human_approval_intake_validator.js',
  'scripts/validate_v14_215_third_sample_accepted_samples_post_approval_gate_alignment.js',
  'scripts/validate_v14_216_review_console_post_approval_gate_static_panel.js',
  'scripts/validate_v14_217_review_console_post_approval_gate_snapshot_static_regression.js',
  'scripts/validate_v14_218_review_console_human_approval_blocker_queue_static_panel.js',
  'scripts/validate_v14_219_review_console_human_approval_blocker_queue_snapshot_static_regression.js',
  'scripts/validate_v14_220_agent_board_current_recommendation_alignment.js',
  'scripts/validate_v14_221_review_console_recoverability_matrix_static_workbench.js',
  'scripts/validate_v14_222_review_console_recoverability_matrix_snapshot_static_regression.js',
  'scripts/validate_v14_223_review_console_schema_binding_coverage_static_panel.js',
  'scripts/validate_v14_224_review_console_schema_binding_coverage_snapshot_static_regression.js',
  'scripts/validate_v14_225_review_console_six_month_goal_gap_static_panel.js',
  'scripts/validate_v14_226_review_console_six_month_goal_gap_snapshot_static_regression.js',
  'scripts/validate_v14_227_review_console_failure_state_static_workbench.js',
  'scripts/validate_v14_228_review_console_failure_state_snapshot_static_regression.js',
  'docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md',
  'docs/AUTOPILOT_GOAL_COMPILER_V1.md',
  'docs/AUTOPILOT_GOAL_DECOMPOSITION_RUNTIME.md',
  'docs/AUTOPILOT_NEXT_SAFE_TASK_ORCHESTRATOR.md',
  'docs/AUTOPILOT_AMBER_DRY_RUN_EXECUTION_LOOP.md',
  'docs/AUTOPILOT_EVOLUTION_ENGINE.md',
  'docs/AUTOPILOT_COMPLETE_READINESS_GATE.md',
  'schemas/autopilot_autonomy_envelope.schema.yaml',
  'schemas/autopilot_execution_receipt.schema.yaml',
  'schemas/autopilot_goal.schema.yaml',
  'schemas/autopilot_route_plan.schema.yaml',
  'schemas/autopilot_task_queue.schema.yaml',
  'tests/schema_examples/autopilot_autonomy_envelope.example.json',
  'tests/schema_examples/autopilot_execution_receipt.example.json',
  'tests/schema_examples/autopilot_goal.example.json',
  'tests/schema_examples/autopilot_route_plan.example.json',
  'tests/schema_examples/autopilot_task_queue.example.json',
  'tests/schema_examples/autopilot_goal_decomposition_runtime.example.json',
  'tests/schema_examples/autopilot_goal_decomposition_materialized.example.json',
  'tests/schema_examples/agent_board_queue_reconciliation.example.json',
  'tests/schema_examples/next_safe_task_orchestration.example.json',
  'tests/schema_examples/amber_dry_run_execution_loop.example.json',
  'tests/schema_examples/autopilot_execution_receipt.amber_dry_run_loop.example.json',
  'tests/schema_examples/autopilot_evolution_backlog.example.json',
  'tests/schema_examples/complete_autopilot_readiness_gate.example.json',
  'scripts/validate_codex_session_image_import.js',
  'scripts/validate_review_result_protocol.js',
  'scripts/validate_review_decision_package.js',
  'scripts/validate_evidence_blocker_contract.js',
  'scripts/validate_review_blocker_arbiter.js',
  'kernel/pvos_kernel.js',
  'kernel/pvos_evidence_collector_blocker_pipeline.js',
  'kernel/README.md',
  'kernel/review_result_protocol.js',
  'kernel/review_decision_package.js',
  'kernel/evidence_blocker_contract.js',
  'kernel/review_blocker_arbiter.js',
  'kernel/review_report_contract.js',
  'adapters/pvos_kernel_dry_run_adapter.js',
  'schemas/pvos_kernel_run.schema.yaml',
  'schemas/pvos_kernel_dry_run_adapter.schema.yaml',
  'schemas/pvos_evidence_collector_blocker_pipeline.schema.yaml',
  'schemas/codex_session_image_import.schema.yaml',
  'schemas/local_review_record.schema.yaml',
  'schemas/accepted_sample_registry.schema.yaml',
  'schemas/sample_lifecycle_state_machine.schema.yaml',
  'schemas/review_result_protocol.schema.yaml',
  'schemas/review_decision_package.schema.yaml',
  'schemas/evidence_blocker_contract.schema.yaml',
  'schemas/review_blocker_arbiter.schema.yaml',
  'tests/schema_examples/pvos_kernel_input.example.json',
  'tests/schema_examples/pvos_kernel_run.example.json',
  'tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json',
  'tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json',
  'tests/schema_examples/pvos_evidence_collector_blocker_pipeline.example.json',
  'tests/schema_examples/codex_session_image_import.example.json',
  'tests/schema_examples/artifact_recoverability_dashboard_evidence.example.json',
  'tests/schema_examples/v14_139_authorization_split_package.example.yaml',
  'tests/schema_examples/v14_111_codex_session_memory_delta_draft.example.yaml',
  'tests/schema_examples/review_console_adapter_negative_fixture_draft_output_snapshot.example.json',
  'tests/schema_examples/review_console_blocker_arbiter_draft_output_snapshot.example.json',
  'tests/schema_examples/review_console_review_report_draft_output_snapshot.example.json',
  'tests/schema_examples/review_console_review_report_negative_guard_draft_output_snapshot.example.json',
  'tests/schema_examples/review_report_negative_guard_regression_matrix.example.json',
  'tests/schema_examples/review_report_route_summary.example.json',
  'tests/schema_examples/review_report_admission_control_matrix.example.json',
  'tests/schema_examples/review_report_production_exclusion_register.example.json',
  'tests/schema_examples/review_report_memory_admission_register.example.json',
  'tests/schema_examples/review_report_memory_delta_draft_register.example.json',
  'tests/schema_examples/review_report_protocol_final_closeout.example.json',
  'tests/schema_examples/review_console_blocker_arbiter_regression_matrix.example.json',
  'tests/schema_examples/review_console_blocker_arbiter_regression_matrix_v14_062.example.json',
  'tests/schema_examples/review_blocker_arbiter_route_summary.example.json',
  'tests/schema_examples/review_memory_admission_control.example.json',
  'tests/schema_examples/review_production_admission_control.example.json',
  'tests/schema_examples/review_admission_control_matrix.example.json',
  'tests/schema_examples/review_report_contract.example.json',
  'tests/schema_examples/review_console_blocker_arbiter_boundary_scan.example.json',
  'tests/schema_examples/review_result_protocol_input.example.json',
  'tests/schema_examples/review_result_protocol_report.example.json',
  'tests/schema_examples/review_result_protocol_negative_guard_input.example.json',
  'tests/schema_examples/review_decision_package.example.json',
  'tests/schema_examples/evidence_blocker_contract.example.json',
  'tests/schema_examples/evidence_blocker_contract_negative_guard.example.json',
  'tests/schema_examples/review_blocker_arbiter.example.json',
  'tests/schema_examples/review_blocker_arbiter_negative_guard.example.json',
  'tests/schema_examples/pvos_kernel_negative_guard_input.example.json',
  'docs/v14_037_pvos_kernel_minimal_implementation_gate.md',
  'docs/v14_038_pvos_kernel_dry_run_adapter_gate.md',
  'docs/v14_039_review_result_protocol_hardening_gate.md',
  'docs/v14_040_review_protocol_adapter_binding_gate.md',
  'docs/v14_041_review_console_protocol_static_contract_gate.md',
  'docs/v14_042_review_console_protocol_ui_affordance_gate.md',
  'docs/v14_043_review_protocol_fixture_negative_guard_gate.md',
  'docs/v14_044_review_protocol_negative_guard_adapter_handoff_gate.md',
  'docs/v14_045_review_console_negative_guard_ui_affordance_gate.md',
  'docs/v14_046_review_decision_package_gate.md',
  'docs/v14_047_review_decision_package_adapter_binding_gate.md',
  'docs/v14_048_review_console_decision_package_ui_binding_gate.md',
  'docs/v14_049_evidence_record_and_blocker_decision_contract_gate.md',
  'docs/v14_050_evidence_blocker_adapter_handoff_gate.md',
  'docs/v14_051_review_console_evidence_blocker_ui_binding_gate.md',
  'docs/v14_052_evidence_blocker_contract_negative_fixture_gate.md',
  'docs/v14_053_evidence_blocker_adapter_negative_fixture_handoff_gate.md',
  'docs/v14_054_review_console_adapter_negative_fixture_ui_binding_gate.md',
  'docs/v14_055_review_console_adapter_negative_fixture_draft_output_snapshot_gate.md',
  'docs/v14_056_review_console_blocker_arbiter_regression_matrix_gate.md',
  'docs/v14_057_review_console_blocker_arbiter_boundary_scan_gate.md',
  'docs/v14_058_review_blocker_arbiter_local_kernel_gate.md',
  'docs/v14_059_review_blocker_arbiter_adapter_handoff_gate.md',
  'docs/v14_060_review_console_blocker_arbiter_ui_binding_gate.md',
  'docs/v14_061_review_console_blocker_arbiter_draft_output_snapshot_gate.md',
  'docs/v14_062_review_console_blocker_arbiter_regression_matrix_refresh_gate.md',
  'docs/v14_063_review_blocker_arbiter_route_summary_gate.md',
  'docs/v14_064_review_memory_admission_control_gate.md',
  'docs/v14_065_review_production_admission_control_gate.md',
  'docs/v14_066_review_admission_control_matrix_gate.md',
  'docs/v14_067_review_report_contract_gate.md',
  'docs/v14_068_review_report_adapter_handoff_gate.md',
  'docs/v14_069_review_report_console_binding_gate.md',
  'docs/v14_070_review_report_draft_output_snapshot_gate.md',
  'docs/v14_071_review_report_negative_guard_static_handoff_gate.md',
  'docs/v14_072_review_report_negative_guard_draft_output_snapshot_gate.md',
  'docs/v14_073_review_report_negative_guard_regression_matrix_gate.md',
  'docs/v14_074_review_report_route_summary_gate.md',
  'docs/v14_075_review_report_admission_control_matrix_gate.md',
  'docs/v14_076_review_report_production_exclusion_register_gate.md',
  'docs/v14_077_review_report_memory_admission_register_gate.md',
  'docs/v14_078_review_report_memory_delta_draft_register_gate.md',
  'docs/v14_079_review_report_final_local_closeout_gate.md',
  'docs/v14_080_pvos_evidence_collector_blocker_A5_authorization_package_draft_gate.md',
  'docs/v14_081_pvos_evidence_collector_blocker_exact_A5_authorization_package_gate.md',
  'docs/v14_082_pvos_metadata_only_preflight_authorization_correction_gate.md',
  'docs/codex_session_image_provider_minimal_contract.md',
  'docs/v14_115_dry_run_vcp_adapter_current_goal_alignment.md',
  'docs/v14_116_manifest_read_authorization_current_goal_alignment.md',
  'docs/v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.md',
  'docs/v14_118_rollback_audit_validation_package_current_goal_alignment.md',
  'docs/v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.md',
  'docs/v14_120_visual_series_taxonomy_review_scorecard_alignment.md',
  'docs/v14_121_codex_session_prompt_package_library_governance.md',
  'docs/v14_122_local_review_record_schema_refresh.md',
  'docs/v14_123_memory_delta_draft_schema_alignment_for_codex_reviews.md',
  'docs/CONTEXT_LOAD_GUIDE.md',
  'docs/HISTORICAL_DOCS_COMPACTION_INDEX.md',
  'docs/LEGACY_DOCS_CONTEXT_QUARANTINE.md',
  'docs/v14_124_context_load_guide_and_historical_docs_compaction.md',
  'docs/v14_125_review_console_memory_delta_handoff_refresh.md',
  'docs/v14_126_accepted_failure_metadata_cross_index_gap_review.md',
  'docs/v14_127_production_exclusion_draft_current_goal_gap_review.md',
  'docs/v14_128_failure_samples_authorization_template_current_goal_gap_review.md',
  'docs/v14_129_current_goal_completion_audit_gap_map.md',
  'docs/v14_130_legacy_docs_context_quarantine_refresh.md',
  'docs/v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate.md',
  'docs/v14_132_state_scope_canonicalization.md',
  'docs/v14_133_main_validator_real_import_record_wiring.md',
  'docs/v14_134_review_console_static_import_record_reader.md',
  'docs/v14_135_review_console_import_reader_safety_review.md',
  'docs/v14_136_accepted_samples_recoverability_metadata_patch.md',
  'docs/v14_137_project_master_plan_quarantine_status_demotion.md',
  'docs/v14_138_dashboard_alignment_from_real_artifact_evidence.md',
  'docs/v14_139_durable_archive_production_candidate_memory_write_authorization_split_planning.md',
  'docs/v14_140_two_week_regression_closeout.md',
  'docs/v14_141_recoverability_core_extraction.md',
  'docs/v14_142_multi_accepted_sample_matrix.md',
  'docs/v14_143_import_review_registry_schema_hardening.md',
  'docs/v14_144_review_console_schema_binding.md',
  'docs/v14_145_sample_lifecycle_state_machine.md',
  'docs/v14_146_durable_archive_dry_run_manifest.md',
  'schemas/durable_archive_dry_run_manifest.schema.yaml',
  'tests/schema_examples/v14_146_durable_archive_dry_run_manifest.example.yaml',
  'docs/v14_147_production_candidate_eligibility_preflight.md',
  'schemas/production_candidate_eligibility_preflight.schema.yaml',
  'tests/schema_examples/v14_147_production_candidate_eligibility_preflight.example.yaml',
  'docs/v14_148_memory_delta_draft_package.md',
  'schemas/memory_delta_draft_package.schema.yaml',
  'tests/schema_examples/v14_148_memory_delta_draft_package.example.yaml',
  'docs/v14_149_authorization_package_compiler.md',
  'schemas/authorization_package_compiler.schema.yaml',
  'tests/schema_examples/v14_149_authorization_package_compiler_input.example.yaml',
  'docs/v14_150_local_regression_suite_consolidation.md',
  'schemas/local_regression_suite.schema.yaml',
  'tests/schema_examples/v14_150_local_regression_suite_manifest.example.yaml',
  'docs/v14_151_dry_run_vcp_adapter_contract_v1.md',
  'integrations/vcp/dry_run_vcp_adapter_contract_v1.yaml',
  'schemas/dry_run_vcp_adapter_contract_v1.schema.yaml',
  'tests/schema_examples/v14_151_dry_run_vcp_adapter_contract_v1.example.yaml',
  'docs/v14_152_review_console_handoff_contract.md',
  'review_console/static_prototype/HANDOFF_CONTRACT.md',
  'schemas/review_console_handoff_contract.schema.yaml',
  'tests/schema_examples/v14_152_review_console_handoff_contract.example.yaml',
  'docs/v14_153_manifest_read_authorization_gate_package.md',
  'integrations/vcp/manifest_read_authorization_gate_package_v1.yaml',
  'schemas/manifest_read_authorization_gate_package.schema.yaml',
  'tests/schema_examples/v14_153_manifest_read_authorization_gate_package.example.yaml',
  'docs/v14_159_end_to_end_audit_and_rollback_package.md',
  'schemas/end_to_end_audit_rollback_package.schema.yaml',
  'tests/schema_examples/v14_159_end_to_end_audit_rollback_package.example.yaml',
  'docs/v14_160_two_month_product_capability_closeout.md',
  'schemas/two_month_product_capability_closeout.schema.yaml',
  'tests/schema_examples/v14_160_two_month_product_capability_closeout.example.yaml',
  'docs/v14_161_codex_session_generated_candidate_readiness.md',
  'schemas/codex_session_generated_candidate_readiness.schema.yaml',
  'tests/schema_examples/v14_161_codex_session_generated_candidate_readiness.example.json',
  'tests/schema_examples/v14_161_product_still_life_smart_desk_lamp_import_record.json',
  'tests/schema_examples/v14_161_fashion_lifestyle_woven_crossbody_bag_import_record.json',
  'docs/v14_162_lamp_prompt_revision_after_v14_161_review.md',
  'prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v2.yaml',
  'tests/schema_examples/v14_162_lamp_prompt_revision_after_v14_161_review.example.json',
  'docs/v14_163_lamp_v2_generated_candidate_readiness.md',
  'tests/schema_examples/v14_163_lamp_v2_generated_candidate_readiness.example.json',
  'tests/schema_examples/v14_163_lamp_v2_generated_candidate_import_record.json',
  'docs/v14_164_bag_accepted_samples_metadata_registration_preflight.md',
  'tests/schema_examples/v14_164_bag_accepted_samples_metadata_registration_preflight.example.json',
  'docs/v14_165_bag_accepted_samples_metadata_registration.md',
  'tests/schema_examples/v14_165_bag_accepted_samples_metadata_registration.example.json',
  'tests/schema_examples/v14_165_bag_accepted_samples_metadata_registration_negative_missing_registry_sample.example.json',
  'docs/v14_166_lamp_v3_generated_candidate_readiness.md',
  'tests/schema_examples/v14_166_lamp_v3_generated_candidate_readiness.example.json',
  'tests/schema_examples/v14_166_lamp_v3_generated_candidate_import_record.json',
  'docs/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.md',
  'tests/schema_examples/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.example.json',
  'docs/v14_168_three_sample_dashboard_evidence_alignment.md',
  'tests/schema_examples/v14_168_three_sample_dashboard_evidence_alignment.example.json',
  'docs/00_project_roadmap.md',
  'docs/20_real_loop_completion_plan.md',
  'docs/30_release_readiness_report.md',
  'docs/31_install_and_operation_guide.md',
  'docs/32_final_acceptance_report.md',
  'docs/33_post_execution_checkpoint.md',
  'docs/34_v1_0_true_loop_closeout.md',
  'docs/113_v3_6_first_runtime_code_patch_authorization.md',
  'docs/114_v3_7_first_runtime_patch_execution_record.md',
  'docs/115_v3_8_runtime_prototype_smoke_test.md',
  'docs/116_v3_9_runtime_guard_extraction.md',
  'docs/117_v4_0_runtime_contract_smoke_hardening.md',
  'docs/118_v4_1_runtime_guard_unit_validation.md',
  'docs/119_v4_2_runtime_validation_suite.md',
  'docs/120_v4_3_autopilot_overlay_installation.md',
  'docs/121_v4_4_agent_board_state_validation.md',
  'docs/122_v4_5_local_checkpoint_readiness.md',
  'docs/123_v4_6_local_commit_scope_manifest.md',
  'docs/124_v4_7_post_push_state_reconciliation.md',
  'docs/125_v4_8_v4_index_consistency_validation.md',
  'docs/126_v4_9_local_tag_push_readiness.md',
  'docs/127_v5_0_delivery_readiness_index.md',
  'docs/128_v5_1_runtime_delivery_surface.md',
  'docs/129_v5_2_adapter_delivery_surface.md',
  'docs/130_v5_3_review_console_adapter_handoff.md',
  'docs/131_v5_4_local_sync_readiness.md',
  'docs/132_v5_5_post_commit_reconciliation.md',
  'docs/133_v5_6_v5_index_consistency_validation.md',
  'docs/134_v5_7_local_batch_commit_readiness.md',
  'docs/135_v5_8_handoff_freshness_validation.md',
  'docs/136_v5_9_expanded_v5_index_consistency.md',
  'docs/137_v5_10_local_true_loop_candidate_delivery.md',
  'docs/138_v5_11_post_merge_reconciliation.md',
  'docs/139_v5_12_release_candidate_readiness.md',
  'docs/192_v7_40_local_a4_a5_autonomy_alignment.md',
  'docs/193_v7_41_external_remote_debug_verification_script_creation_record.md',
  'docs/194_v7_42_external_remote_debug_verification_script_creation_authorization_package.md',
  'docs/195_v7_43_external_remote_debug_verification_script_creation_execution_record.md',
  'docs/196_v7_44_remote_debug_script_run_and_vcpchat_launch_record.md',
  'docs/197_v7_45_cdp_read_only_attempt_record.md',
  'docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md',
  'docs/199_v10_0_a5_end_to_end_activation_package_readiness.md',
  'docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md',
  'docs/201_v10_2_a5_bridge_smoke_blocked_record.md',
  'docs/202_v10_3_a5_bridge_integration_smoke_record.md',
  'docs/203_v10_4_a5_doubaogen_single_generation_rejected_asset_record.md',
  'docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md',
  'docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md',
  'docs/206_v10_7_a5_safer_prompt_review_package.md',
  'docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md',
  'docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md',
  'docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md',
  'docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md',
  'docs/211_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md',
  'docs/212_v10_26_real_dailynote_write_closeout.md',
  'docs/213_v10_27_dailynotewrite_root_path_correction.md',
  'docs/214_v10_28_dailynote_canonical_location_guard.md',
  'docs/v14_025_visual_eval_seed_record_schema_planning_gate.md',
  'docs/v14_026_visual_eval_seed_record_schema_draft_gate.md',
  'docs/v14_027_visual_eval_seed_record_validator_planning_gate.md',
  'docs/v14_028_visual_eval_seed_record_validator_implementation_gate.md',
  'docs/v14_029_visual_eval_rejected_seed_fixture_planning_gate.md',
  'docs/v14_030_visual_eval_rejected_seed_fixture_implementation_gate.md',
  'docs/v14_031_visual_eval_seed_registry_planning_gate.md',
  'docs/v14_032_visual_eval_seed_registry_schema_draft_gate.md',
  'docs/v14_033_visual_eval_seed_registry_validator_planning_gate.md',
  'docs/v14_034_visual_eval_seed_registry_validator_implementation_gate.md',
  'integrations/vcp/v0_3_authorization_closeout.md',
  'integrations/vcp/phase_c_manifest_sanitized_read_contract.md',
  'integrations/vcp/phase_c_manifest_sanitized_review_record.md',
  'integrations/vcp/phase_d_adapter_dry_run_minimal_contract.md',
  'integrations/vcp/v0_5_adapter_install_authorization.md',
  'integrations/vcp/v0_5_adapter_install_verification.md',
  'integrations/vcp/v0_6_real_plugin_manifest_authorization.md',
  'integrations/vcp/v0_6_real_plugin_manifest_sanitized_review.md',
  'integrations/vcp/v0_7_gatekeeper_risk_boundary.md',
  'integrations/vcp/v0_7_real_execution_authorization_gate.md',
  'integrations/vcp/v0_7_photo_studio_os_dry_run_rehearsal.md',
  'integrations/vcp/v0_7_photo_studio_os_real_execution_record.md',
  'integrations/vcp/v0_9_photo_studio_os_retry_real_execution_record.md',
  'integrations/vcp/v0_9_generation_plugin_candidate_scan.md',
  'integrations/vcp/v0_10_gptimagegen_real_execution_record.md',
  'integrations/vcp/v0_10_gptimagegen_retry2_real_execution_record.md',
  'integrations/vcp/v0_10_gptimagegen_gpt55_real_execution_record.md',
  'integrations/vcp/v0_10_doubaogen_retry_real_execution_record.md',
  'integrations/vcp/v10_10_prompt_handoff_diagnostic_authorization_template.md',
  'integrations/vcp/v10_12_provider_side_prompt_fingerprint_capture_authorization_package.md',
  'review_console/v0_7_human_approval_preflight.md',
  'workflows/photo_studio_os_real_loop_runbook.md',
  'workflows/v0_7_real_execution_preflight_confirmation.md',
  'workflows/v0_9_photo_studio_os_retry_authorization_gate.md',
  'docs/01_project_definition.md',
  'docs/02_workflow_sop.md',
  'docs/03_agent_roles.md',
  'docs/04_review_scorecard.md',
  'docs/07_vcp_memory_adaptation_plan.md',
  'docs/08_photo_studio_os_visual_rules.md',
  'docs/11_review_console_design.md',
  'docs/12_mvp_acceptance.md',
  'schemas/task_envelope.schema.yaml',
  'schemas/prompt_package.schema.yaml',
  'schemas/review_score.schema.yaml',
  'schemas/image_case.schema.yaml',
  'schemas/memory_delta.schema.yaml',
  'schemas/dispatch_plan.schema.yaml',
  'schemas/review_session.schema.yaml',
  'schemas/visual_eval_seed_record.schema.yaml',
  'schemas/visual_eval_seed_registry.schema.yaml',
  'tests/validation_checklist.md',
  'tests/schema_examples/task_envelope.example.yaml',
  'tests/schema_examples/review_score.example.yaml',
  'tests/schema_examples/memory_delta.example.yaml',
  'tests/schema_examples/v0_5_adapter_install_verification.example.yaml',
  'tests/schema_examples/v0_6_real_plugin_manifest_sanitized_review.example.yaml',
  'tests/schema_examples/v0_7_gatekeeper_risk_boundary.example.yaml',
  'tests/schema_examples/v0_7_review_console_human_approval_preflight.example.yaml',
  'tests/schema_examples/v0_7_real_execution_preflight_confirmation.example.yaml',
  'tests/schema_examples/v0_7_real_execution_authorization_gate.example.yaml',
  'tests/schema_examples/v0_7_photo_studio_os_dry_run_rehearsal.example.yaml',
  'tests/schema_examples/v0_7_photo_studio_os_real_execution_record.example.yaml',
  'tests/schema_examples/v0_8_release_readiness.example.yaml',
  'tests/schema_examples/v0_9_post_execution_checkpoint.example.yaml',
  'tests/schema_examples/v0_9_photo_studio_os_retry_authorization_gate.example.yaml',
  'tests/schema_examples/v0_9_photo_studio_os_retry_real_execution_record.example.yaml',
  'tests/schema_examples/v0_10_gptimagegen_real_execution_record.example.yaml',
  'tests/schema_examples/v0_10_gptimagegen_retry2_real_execution_record.example.yaml',
  'tests/schema_examples/v0_10_gptimagegen_gpt55_real_execution_record.example.yaml',
  'tests/schema_examples/v0_10_doubaogen_retry_real_execution_record.example.yaml',
  'tests/schema_examples/v1_0_true_loop_closeout.example.yaml',
  'tests/schema_examples/v3_6_first_runtime_code_patch_authorization.example.yaml',
  'tests/schema_examples/v3_7_first_runtime_patch_execution_record.example.yaml',
  'tests/schema_examples/v3_8_runtime_prototype_smoke_test.example.yaml',
  'tests/schema_examples/v3_9_runtime_guard_extraction.example.yaml',
  'tests/schema_examples/v4_0_runtime_contract_smoke_hardening.example.yaml',
  'tests/schema_examples/v4_1_runtime_guard_unit_validation.example.yaml',
  'tests/schema_examples/v4_2_runtime_validation_suite.example.yaml',
  'tests/schema_examples/v4_3_autopilot_overlay_installation.example.yaml',
  'tests/schema_examples/v4_4_agent_board_state_validation.example.yaml',
  'tests/schema_examples/v4_5_local_checkpoint_readiness.example.yaml',
  'tests/schema_examples/v4_6_local_commit_scope_manifest.example.yaml',
  'tests/schema_examples/v4_7_post_push_state_reconciliation.example.yaml',
  'tests/schema_examples/v4_8_v4_index_consistency_validation.example.yaml',
  'tests/schema_examples/v4_9_local_tag_push_readiness.example.yaml',
  'tests/schema_examples/v5_0_delivery_readiness.example.yaml',
  'tests/schema_examples/v5_1_runtime_delivery_surface.example.yaml',
  'tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml',
  'tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml',
  'tests/schema_examples/v5_4_local_sync_readiness.example.yaml',
  'tests/schema_examples/v5_5_post_commit_reconciliation.example.yaml',
  'tests/schema_examples/v5_6_v5_index_consistency_validation.example.yaml',
  'tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml',
  'tests/schema_examples/v5_8_handoff_freshness_validation.example.yaml',
  'tests/schema_examples/v5_9_expanded_v5_index_consistency.example.yaml',
  'tests/schema_examples/v5_10_local_true_loop_candidate_delivery.example.yaml',
  'tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml',
  'tests/schema_examples/v5_12_release_candidate_readiness.example.yaml',
  'tests/schema_examples/v7_40_local_a4_a5_autonomy_alignment.example.yaml',
  'tests/schema_examples/v7_41_external_remote_debug_verification_script_creation_record.example.yaml',
  'tests/schema_examples/v7_42_external_remote_debug_verification_script_creation_authorization_package.example.yaml',
  'tests/schema_examples/v7_43_external_remote_debug_verification_script_creation_execution_record.example.yaml',
  'tests/schema_examples/v7_44_remote_debug_script_run_and_vcpchat_launch_record.example.yaml',
  'tests/schema_examples/v7_45_cdp_read_only_attempt_record.example.yaml',
  'tests/schema_examples/v7_46_remote_debug_relaunch_runtime_verification_record.example.yaml',
  'tests/schema_examples/v10_0_a5_end_to_end_activation_package.example.yaml',
  'tests/schema_examples/v10_1_a5_resume_after_external_worktree_reconciliation.example.yaml',
  'tests/schema_examples/v10_2_a5_bridge_smoke_blocked_record.example.yaml',
  'tests/schema_examples/v10_3_a5_bridge_integration_smoke_record.example.yaml',
  'tests/schema_examples/v10_4_a5_doubaogen_single_generation_rejected_asset_record.example.yaml',
  'tests/schema_examples/v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.example.yaml',
  'tests/schema_examples/v10_6_a5_prompt_failure_analysis_and_safer_strategy.example.yaml',
  'tests/schema_examples/v10_7_a5_safer_prompt_review_package.example.yaml',
  'tests/schema_examples/v10_8_a5_positive_still_life_generation_preflight_gate.example.yaml',
  'tests/schema_examples/v10_9_a5_positive_still_life_generation_rejected_asset_record.example.yaml',
  'tests/schema_examples/v10_10_a5_prompt_handoff_diagnostic_preflight.example.yaml',
  'tests/schema_examples/v10_11_a5_prompt_handoff_diagnostic_result.example.yaml',
  'tests/schema_examples/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.example.yaml',
  'tests/schema_examples/v10_26_real_dailynote_write_closeout.example.yaml',
  'tests/schema_examples/v10_27_dailynotewrite_root_path_correction.example.yaml',
  'tests/schema_examples/v10_28_dailynote_canonical_location_guard.example.yaml',
  'tests/schema_examples/visual_eval_seed_record.example.yaml',
  'tests/schema_examples/visual_eval_seed_record.rejected.example.yaml',
  'tests/schema_examples/visual_eval_seed_registry.example.yaml',
  'review_console/static_prototype/index.html',
  'review_console/static_prototype/app.js',
  'review_console/static_prototype/mock_data.js',
  'review_console/static_prototype/styles.css',
  'review_console/static_prototype/FIELD_MAPPING.md',
  'review_console/static_prototype/SCHEMA_BINDING.md',
  'review_console/runtime_prototype/index.html',
  'review_console/runtime_prototype/runtime_guard.js',
  'review_console/runtime_prototype/app.js',
  'review_console/runtime_prototype/host_bridge_mock.js',
  'review_console/runtime_prototype/styles.css',
  'review_console/runtime_prototype/README.md',
  'review_console/runtime_prototype/FIELD_MAPPING.md',
  'review_console/embed_contract/first_runtime_code_patch_authorization.md',
  'review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_record.md',
  'review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_authorization_package.md',
  'review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_execution_record.md',
  'review_console/embed_contract/vcpchat_remote_debug_script_run_and_launch_record.md',
  'review_console/embed_contract/vcpchat_cdp_read_only_attempt_record.md',
  'review_console/embed_contract/vcpchat_remote_debug_relaunch_runtime_verification_record.md',
  'review_console/embed_contract/v10_0_a5_end_to_end_activation_package.md',
  'review_console/embed_contract/v10_1_a5_resume_after_external_worktree_reconciliation.md',
  'review_console/embed_contract/v10_2_a5_bridge_smoke_blocked_record.md',
  'review_console/embed_contract/v10_3_a5_bridge_integration_smoke_record.md',
  'review_console/embed_contract/v10_4_a5_doubaogen_single_generation_rejected_asset_record.md',
  'review_console/embed_contract/v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md',
  'review_console/embed_contract/v10_6_a5_prompt_failure_analysis_and_safer_strategy.md',
  'review_console/embed_contract/v10_7_a5_safer_prompt_review_package.md',
  'review_console/embed_contract/v10_8_a5_positive_still_life_generation_preflight_gate.md',
  'review_console/embed_contract/v10_9_a5_positive_still_life_generation_rejected_asset_record.md',
  'review_console/embed_contract/v10_10_a5_prompt_handoff_diagnostic_preflight.md',
  'review_console/embed_contract/v10_11_a5_prompt_handoff_diagnostic_result.md',
  'review_console/embed_contract/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md',
  'review_console/embed_contract/v10_26_real_dailynote_write_closeout.md',
  'review_console/embed_contract/v10_27_dailynotewrite_root_path_correction.md',
  'review_console/embed_contract/v10_28_dailynote_canonical_location_guard.md'
)

$requiredDirectories = @(
  'agents',
  'adapter_dry_run_lab',
  'asset_archive',
  'case_studies',
  'codex',
  'docs',
  'exports',
  'integrations/vcp',
  'memory_policy',
  'prompt_templates',
  'review_console',
  'schemas',
  'style_memory_seed',
  'tests/schema_examples',
  'workflows'
)

foreach ($path in $requiredFiles) { Test-RequiredFile $path }
foreach ($path in $requiredDirectories) { Test-RequiredDirectory $path }

if (Test-Path -LiteralPath (Join-Path $Root 'agent-image-lab') -PathType Container) {
  Add-Failure "Nested project directory found: agent-image-lab"
}

$mediaExtensions = @('.png', '.jpg', '.jpeg', '.webp', '.gif', '.psd', '.zip')
$verifiedDurableOriginalAssetFiles = @()
$durableArchiveExecutionReportPathForMediaGate = Join-Path $Root 'reports/durable_archive_copy_execution/2026-05-20_durable_archive_copy_A5_execution_report.json'
if (Test-Path $durableArchiveExecutionReportPathForMediaGate) {
  $durableArchiveExecutionReportForMediaGate = Get-Content $durableArchiveExecutionReportPathForMediaGate -Raw | ConvertFrom-Json
  if ($durableArchiveExecutionReportForMediaGate.status -eq 'completed_validated' -and $durableArchiveExecutionReportForMediaGate.copied_count -eq 14 -and $durableArchiveExecutionReportForMediaGate.failed_count -eq 0 -and $durableArchiveExecutionReportForMediaGate.runs_mutation_performed -eq $false -and $durableArchiveExecutionReportForMediaGate.production_candidate_write_performed -eq $false) {
    $verifiedDurableOriginalAssetFiles = @($durableArchiveExecutionReportForMediaGate.results | Where-Object { $_.post_copy_verified -eq $true } | ForEach-Object { $_.target_archive_path })
  }
}
$mediaFiles = Get-ChildItem -LiteralPath $Root -Recurse -File -Force |
  Where-Object {
    $relativePath = $_.FullName.Substring($Root.Length + 1).Replace('\', '/')
    $isGitPortablePreviewCapsule = $relativePath -match '^asset_archive/(accepted_samples|failure_samples)/[^/]+/preview\.webp$'
    $isVerifiedDurableOriginalAsset = $verifiedDurableOriginalAssetFiles -contains $relativePath
    $isLocalOnlyValidationCopy = $relativePath -match '^\.agent_private/'
    $_.FullName -notlike '*\.git\*' -and
    $_.FullName -notlike '*\runs\*' -and
    $_.FullName -notlike '*\release_packages\*' -and
    -not $isLocalOnlyValidationCopy -and
    -not $isGitPortablePreviewCapsule -and
    -not $isVerifiedDurableOriginalAsset -and
    $mediaExtensions -contains $_.Extension.ToLowerInvariant()
  }
foreach ($file in $mediaFiles) {
  Add-Failure "Forbidden media/archive file in repository: $($file.FullName.Substring($Root.Length + 1))"
}

$adapterPath = Join-Path $Root 'exports/vcptoolbox/Plugin/AgentImageLabAdapter'
if (Test-Path -LiteralPath $adapterPath) {
  $adapterExecutableFiles = Get-ChildItem -LiteralPath $adapterPath -Recurse -File -Force |
    Where-Object { $_.Name -in @('index.js') -or $_.Extension.ToLowerInvariant() -in @('.exe', '.ps1', '.bat', '.cmd') }
  foreach ($file in $adapterExecutableFiles) {
    Add-Failure "Adapter must not contain executable entry: $($file.FullName.Substring($Root.Length + 1))"
  }
}

$remoteDebugSmokeScript = Join-Path $Root 'scripts/run_vcpchat_review_console_remote_debug_smoke.ps1'
if (Test-Path -LiteralPath $remoteDebugSmokeScript) {
  $tokens = $null
  $parseErrors = $null
  [System.Management.Automation.Language.Parser]::ParseFile($remoteDebugSmokeScript, [ref]$tokens, [ref]$parseErrors) | Out-Null
  if ($parseErrors -and $parseErrors.Count -gt 0) {
    Add-Failure "Remote-debug smoke script has PowerShell parse errors"
  }
  $remoteDebugSmokeContent = Get-Content -Raw -Encoding UTF8 $remoteDebugSmokeScript
  foreach ($pattern in @(
    'Start-Process',
    'Invoke-WebRequest',
    'Invoke-RestMethod',
    'System\.Net\.WebClient',
    'System\.Net\.Http',
    'TcpClient',
    'WebSocket',
    'Set-Content',
    'Out-File',
    'New-Item',
    'Remove-Item',
    'loadSession',
    'previewDraft',
    'submitDraft',
    'http://',
    'https://',
    'ws://',
    '127\.0\.0\.1',
    'localhost'
  )) {
    if ($remoteDebugSmokeContent -match $pattern) {
      Add-Failure "Remote-debug smoke script contains forbidden creation-phase pattern: $pattern"
    }
  }
}

$staticPrototypeFiles = @(
  'review_console/static_prototype/app.js',
  'review_console/static_prototype/mock_data.js'
)
foreach ($path in $staticPrototypeFiles) {
  $fullPath = Join-Path $Root $path
  if (Test-Path -LiteralPath $fullPath) {
    $content = Get-Content -Raw -Encoding UTF8 $fullPath
    if ($content -match 'fetch\(|XMLHttpRequest|writeFile|fs\.|eval\(|Function\(') {
      Add-Failure "Static prototype contains forbidden runtime pattern: $path"
    }
  }
}

$runtimePrototypeFiles = @(
  'review_console/runtime_prototype/runtime_guard.js',
  'review_console/runtime_prototype/app.js',
  'review_console/runtime_prototype/host_bridge_mock.js'
)
foreach ($path in $runtimePrototypeFiles) {
  $fullPath = Join-Path $Root $path
  if (Test-Path -LiteralPath $fullPath) {
    $content = Get-Content -Raw -Encoding UTF8 $fullPath
    if ($content -match '\bfetch\(|XMLHttpRequest|\blocalStorage\b|\bsessionStorage\b|writeFile|appendFile|child_process|\bexec\(|\bspawn\(|\brequire\(|\bfs\.|\bhttps\.|\bhttp\.|navigator\.clipboard|\beval\(|\bFunction\(') {
      Add-Failure "Runtime prototype contains forbidden runtime pattern: $path"
    }
  }
}

$labSource = Join-Path $Root 'adapter_dry_run_lab/adapter_dry_run.js'
if (Test-Path -LiteralPath $labSource) {
  $content = Get-Content -Raw -Encoding UTF8 $labSource
  if ($content -match 'fetch\(|XMLHttpRequest|writeFile|appendFile|child_process|exec\(|spawn\(|https\.|http\.|net\.') {
    Add-Failure "Adapter dry-run lab contains forbidden runtime pattern"
  }
}

$exportAdapterSource = Join-Path $Root 'exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js'
if (Test-Path -LiteralPath $exportAdapterSource) {
  $content = Get-Content -Raw -Encoding UTF8 $exportAdapterSource
  if ($content -match 'fs\.|fetch\(|XMLHttpRequest|writeFile|appendFile|child_process|exec\(|spawn\(|https\.|http\.|net\.') {
    Add-Failure "Export adapter dry-run candidate contains forbidden runtime pattern"
  }
}

$agentFiles = Get-ChildItem -LiteralPath (Join-Path $Root 'agents') -Filter '*.md' -File -ErrorAction SilentlyContinue
foreach ($file in $agentFiles) {
  $content = Get-Content -Raw -Encoding UTF8 $file.FullName
  if ($content -notmatch 'memory_delta') {
    Add-Failure "Agent file does not mention memory_delta: $($file.Name)"
  }
}

$exampleMemory = Join-Path $Root 'tests/schema_examples/memory_delta.example.yaml'
if (Test-Path -LiteralPath $exampleMemory) {
  $content = Get-Content -Raw -Encoding UTF8 $exampleMemory
  foreach ($field in @('agent_name', 'target_notebook', 'write_mode', 'approval_required', 'chinese_diary_content', 'tags', 'memory_safety')) {
    if ($content -notmatch [regex]::Escape($field)) {
      Add-Failure "memory_delta example missing field: $field"
    }
  }
}

$manifestPath = Join-Path $Root 'exports/vcptoolbox/Plugin/AgentImageLabAdapter/plugin-manifest.json'
if (Test-Path -LiteralPath $manifestPath) {
  $manifest = Get-Content -Raw -Encoding UTF8 $manifestPath | ConvertFrom-Json
  if ($manifest.dryRunContract.external_api_allowed -ne $false) {
    Add-Failure "Adapter manifest external_api_allowed must be false"
  }
  if ($manifest.dryRunContract.execution_blocked -ne $true) {
    Add-Failure "Adapter manifest execution_blocked must be true"
  }
  if ($manifest.dryRunContract.max_plugin_calls -ne 0) {
    Add-Failure "Adapter manifest max_plugin_calls must be 0"
  }
  if ($manifest.pluginType -ne 'synchronous') {
    Add-Failure "Adapter manifest pluginType must be synchronous"
  }
  if ($manifest.entryPoint.command -ne 'node dry-run-adapter.js') {
    Add-Failure "Adapter manifest entryPoint command must be node dry-run-adapter.js"
  }
  $allowedCommands = @($manifest.allowedCommands)
  if ($allowedCommands.Count -ne 1 -or $allowedCommands[0] -ne 'dry_run') {
    Add-Failure "Adapter manifest must only allow dry_run"
  }
}

$v03Files = @(
  'integrations/vcp/adapter_recon_plan.md',
  'integrations/vcp/manifest_read_authorization_gate.md',
  'integrations/vcp/manifest_sanitized_read_preflight.md',
  'integrations/vcp/v0_3_authorization_closeout.md',
  'tests/schema_examples/v0_3_adapter_recon_authorization.example.yaml',
  'tests/schema_examples/v0_3_manifest_read_authorization_gate.example.yaml',
  'tests/schema_examples/v0_3_manifest_sanitized_read_preflight.example.yaml',
  'tests/schema_examples/phase_c_manifest_read_authorization_request.example.yaml',
  'tests/schema_examples/phase_d_adapter_dry_run_minimal.example.yaml',
  'tests/schema_examples/v0_4_export_adapter_dry_run_handoff.example.json'
)

$forbiddenV03Patterns = @(
  'user_authorized:\s+true',
  'source_authorized:\s+true',
  'source_read_performed:\s+true',
  'real_manifest_read:\s+true',
  'real_execution_allowed:\s+true',
  'selected_plugin:\s+(?!null\b)\S+',
  'max_plugin_calls:\s+[1-9]',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'external_repo_access_allowed:\s+true',
  'read_authorized:\s+true',
  'read_performed:\s+true',
  'read_execution_authorized:\s+true',
  'read_execution_started:\s+true',
  'read_completed:\s+true',
  'raw_manifest_copied:\s+true',
  'raw_manifest_copy_allowed:\s+true'
)

foreach ($path in $v03Files) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.3 authorization file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $forbiddenV03Patterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.3 authorization boundary violation in ${path}: $pattern"
    }
  }
}

$phaseCReviewFiles = @(
  'integrations/vcp/phase_c_manifest_sanitized_review_record.md',
  'tests/schema_examples/phase_c_manifest_sanitized_review_record.example.yaml'
)

$forbiddenPhaseCReviewPatterns = @(
  'raw_manifest_copied:\s+true',
  'raw_manifest_saved:\s+true',
  'raw_manifest_copy_allowed:\s+true',
  'contains_secret:\s+true',
  'contains_private_path:\s+true',
  'contains_customer_private_data:\s+true',
  'contains_endpoint_raw:\s+true',
  'contains_image_binary:\s+true',
  'contains_real_plugin_output:\s+true',
  'real_execution_allowed:\s+true',
  'dry_run_allowed:\s+true',
  'plugin_selected:\s+true',
  'selected_plugin:\s+(?!null\b)\S+',
  'max_plugin_calls:\s+[1-9]',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'file_write_performed:\s+true',
  'image_file_created:\s+true'
)

foreach ($path in $phaseCReviewFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing Phase C review record file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $forbiddenPhaseCReviewPatterns) {
    if ($content -match $pattern) {
      Add-Failure "Phase C review boundary violation in ${path}: $pattern"
    }
  }
}

$v06ReviewFiles = @(
  'integrations/vcp/v0_6_real_plugin_manifest_sanitized_review.md',
  'tests/schema_examples/v0_6_real_plugin_manifest_sanitized_review.example.yaml'
)

$forbiddenV06ReviewPatterns = @(
  'raw_manifest_copied:\s+true',
  'raw_manifest_saved:\s+true',
  'secret_value_copied:\s+true',
  'credential_field_name_copied:\s+true',
  'endpoint_raw_copied:\s+true',
  'private_path_copied:\s+true',
  'customer_private_data_copied:\s+true',
  'runtime_log_copied:\s+true',
  'real_plugin_output_copied:\s+true',
  'image_binary_copied:\s+true',
  'real_execution_authorized:\s+true',
  'real_execution_allowed:\s+true',
  'plugin_selected_for_real_execution:\s+true',
  'dry_run_completed:\s+true',
  'tested:\s+true',
  'selected_plugin:\s+(?!null\b)\S+',
  'max_plugin_calls:\s+[1-9]',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'file_write_performed:\s+true',
  'image_file_created:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v06ReviewFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.6 manifest review record file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $forbiddenV06ReviewPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.6 manifest review boundary violation in ${path}: $pattern"
    }
  }
}

$v07PreflightExamples = @(
  'tests/schema_examples/v0_7_gatekeeper_risk_boundary.example.yaml',
  'tests/schema_examples/v0_7_review_console_human_approval_preflight.example.yaml',
  'tests/schema_examples/v0_7_real_execution_preflight_confirmation.example.yaml',
  'tests/schema_examples/v0_7_real_execution_authorization_gate.example.yaml',
  'tests/schema_examples/v0_7_photo_studio_os_dry_run_rehearsal.example.yaml'
)

$requiredV07GuardPatterns = @(
  'phase:\s+v0\.7_',
  'real_execution_allowed:\s+false',
  'daily_note_called:\s+false'
)

$forbiddenV07ExamplePatterns = @(
  'real_execution_allowed:\s+true',
  'real_execution_authorized:\s+true',
  'selected_plugin_for_execution:\s+(?!null\b)\S+',
  'max_plugin_calls_authorized:\s+[1-9]',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'file_write_performed:\s+true',
  'image_file_created:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v07PreflightExamples) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.7 preflight example file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV07GuardPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v0.7 preflight example missing required guard in ${path}: $pattern"
    }
  }
  if ($content -notmatch 'max_plugin_calls_authorized:\s+0' -and $content -notmatch 'max_plugin_calls:\s+0') {
    Add-Failure "v0.7 preflight example missing zero-call guard in ${path}"
  }
  foreach ($pattern in $forbiddenV07ExamplePatterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.7 preflight boundary violation in ${path}: $pattern"
    }
  }
}

$v07RealExecutionFiles = @(
  'integrations/vcp/v0_7_photo_studio_os_real_execution_record.md',
  'tests/schema_examples/v0_7_photo_studio_os_real_execution_record.example.yaml'
)

$requiredV07RealExecutionPatterns = @(
  'phase:\s+v0\.7_photo_studio_os_minimal_real_execution',
  'status:\s+completed_validated_with_visual_rejection',
  'selected_plugin_id:\s+DoubaoGen',
  'max_plugin_calls_authorized:\s+1',
  'actual_plugin_calls:\s+1',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'file_write_performed:\s+true',
  'image_file_created:\s+true',
  'daily_note_called:\s+false',
  'daily_note_direct_write_allowed:\s+false',
  'memory_delta_only:\s+true',
  'raw_plugin_output_saved:\s+false',
  'secret_value_saved:\s+false',
  'endpoint_raw_saved:\s+false',
  'runtime_log_saved:\s+false',
  'image_binary_saved_to_memory:\s+false',
  'vcp_toolbox_files_modified:\s+false',
  'visual_review:',
  'status:\s+rejected_for_prompt_mismatch'
)

$forbiddenV07RealExecutionPatterns = @(
  'raw_plugin_output_saved:\s+true',
  'secret_value_saved:\s+true',
  'endpoint_raw_saved:\s+true',
  'runtime_log_saved:\s+true',
  'image_binary_saved_to_memory:\s+true',
  'daily_note_called:\s+true',
  'daily_note_direct_write_allowed:\s+true',
  'vcp_toolbox_files_modified:\s+true',
  'additional_plugin_call_authorized:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v07RealExecutionFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.7 real execution record file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV07RealExecutionPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v0.7 real execution record missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV07RealExecutionPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.7 real execution record boundary violation in ${path}: $pattern"
    }
  }
}

$v09PostExecutionFiles = @(
  'docs/33_post_execution_checkpoint.md',
  'workflows/v0_9_photo_studio_os_retry_authorization_gate.md',
  'tests/schema_examples/v0_9_post_execution_checkpoint.example.yaml',
  'tests/schema_examples/v0_9_photo_studio_os_retry_authorization_gate.example.yaml'
)

$requiredV09Patterns = @(
  'v0\.9_',
  'daily_note_direct_write_allowed:\s+false',
  'memory_delta_only:\s+true'
)

$forbiddenV09Patterns = @(
  'raw_plugin_output_saved:\s+true',
  'secret_value_saved:\s+true',
  'endpoint_raw_saved:\s+true',
  'runtime_log_saved:\s+true',
  'image_binary_saved_to_memory:\s+true',
  'daily_note_called:\s+true',
  'daily_note_direct_write_allowed:\s+true',
  'vcp_toolbox_files_modified:\s+true',
  'generated_asset_accepted:\s+true',
  'final_v1_0_ready:\s+true',
  'retry_allowed_without_new_authorization:\s+true',
  'real_execution_allowed:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v09PostExecutionFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.9 post-execution file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV09Patterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v0.9 post-execution file missing required guard in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV09Patterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.9 post-execution boundary violation in ${path}: $pattern"
    }
  }
}

$v09RetryExecutionFiles = @(
  'integrations/vcp/v0_9_photo_studio_os_retry_real_execution_record.md',
  'tests/schema_examples/v0_9_photo_studio_os_retry_real_execution_record.example.yaml'
)

$requiredV09RetryExecutionPatterns = @(
  'phase:\s+v0\.9_photo_studio_os_retry_real_execution',
  'status:\s+completed_validated_with_visual_rejection',
  'selected_plugin_id:\s+DoubaoGen',
  'max_plugin_calls_authorized:\s+1',
  'actual_plugin_calls:\s+1',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'file_write_performed:\s+true',
  'image_file_created:\s+true',
  'daily_note_called:\s+false',
  'daily_note_direct_write_allowed:\s+false',
  'memory_delta_only:\s+true',
  'raw_plugin_output_saved:\s+false',
  'secret_value_saved:\s+false',
  'endpoint_raw_saved:\s+false',
  'runtime_log_saved:\s+false',
  'image_binary_saved_to_memory:\s+false',
  'vcp_toolbox_files_modified:\s+false',
  'visual_review:',
  'status:\s+rejected_for_prompt_mismatch',
  'additional_plugin_call_authorized:\s+false',
  'next_action_requires_new_user_authorization:\s+true'
)

$forbiddenV09RetryExecutionPatterns = @(
  'raw_plugin_output_saved:\s+true',
  'secret_value_saved:\s+true',
  'endpoint_raw_saved:\s+true',
  'runtime_log_saved:\s+true',
  'image_binary_saved_to_memory:\s+true',
  'daily_note_called:\s+true',
  'daily_note_direct_write_allowed:\s+true',
  'vcp_toolbox_files_modified:\s+true',
  'accepted_as_project_cover:\s+true',
  'additional_plugin_call_authorized:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v09RetryExecutionFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.9 retry execution record file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV09RetryExecutionPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v0.9 retry execution record missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV09RetryExecutionPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.9 retry execution record boundary violation in ${path}: $pattern"
    }
  }
}

$v09CandidateScanFiles = @(
  'integrations/vcp/v0_9_generation_plugin_candidate_scan.md'
)

$requiredV09CandidateScanPatterns = @(
  'mode:\s+local_read_only_candidate_discovery',
  'plugin_execution_performed:\s+false',
  'config_values_output:\s+false',
  'raw_manifest_output:\s+false',
  'endpoint_raw_output:\s+false',
  'secret_value_output:\s+false',
  'daily_note_called:\s+false',
  'image_file_created_by_scan:\s+false',
  'primary_candidate:\s+ComfyUIGen',
  'real_execution_allowed_now:\s+false',
  'real_execution_authorized:\s+false'
)

$forbiddenV09CandidateScanPatterns = @(
  'plugin_execution_performed:\s+true',
  'config_values_output:\s+true',
  'raw_manifest_output:\s+true',
  'endpoint_raw_output:\s+true',
  'secret_value_output:\s+true',
  'daily_note_called:\s+true',
  'image_file_created_by_scan:\s+true',
  'real_execution_allowed_now:\s+true',
  'real_execution_authorized:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v09CandidateScanFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.9 candidate scan file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV09CandidateScanPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v0.9 candidate scan missing required guard in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV09CandidateScanPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.9 candidate scan boundary violation in ${path}: $pattern"
    }
  }
}

$v10GptImageExecutionFiles = @(
  'integrations/vcp/v0_10_gptimagegen_real_execution_record.md',
  'tests/schema_examples/v0_10_gptimagegen_real_execution_record.example.yaml'
)

$requiredV10GptImagePatterns = @(
  'phase:\s+v0\.10_gptimagegen_real_execution',
  'status:\s+failed_auth_rolled_back',
  'selected_plugin_id:\s+GPTImageGen',
  'command:\s+GPTGenerateImage',
  'max_plugin_calls_authorized:\s+1',
  'actual_plugin_calls:\s+1',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'file_write_performed:\s+true',
  'image_file_created:\s+false',
  'rollback_performed:\s+true',
  'daily_note_called:\s+false',
  'daily_note_direct_write_allowed:\s+false',
  'memory_delta_only:\s+true',
  'raw_plugin_output_saved:\s+false',
  'secret_value_saved:\s+false',
  'endpoint_raw_saved:\s+false',
  'runtime_log_saved:\s+false',
  'request_identifier_saved:\s+false',
  'image_binary_saved_to_memory:\s+false',
  'vcp_toolbox_files_modified:\s+false',
  'failure_review:',
  'status:\s+blocked_by_plugin_credential',
  'additional_plugin_call_authorized:\s+false',
  'next_action_requires_new_user_authorization:\s+true'
)

$forbiddenV10GptImagePatterns = @(
  'raw_plugin_output_saved:\s+true',
  'secret_value_saved:\s+true',
  'endpoint_raw_saved:\s+true',
  'runtime_log_saved:\s+true',
  'request_identifier_saved:\s+true',
  'image_binary_saved_to_memory:\s+true',
  'daily_note_called:\s+true',
  'daily_note_direct_write_allowed:\s+true',
  'vcp_toolbox_files_modified:\s+true',
  'image_asset_available_for_review:\s+true',
  'additional_plugin_call_authorized:\s+true',
  'OPENAI_API_KEY\s*[:=]',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v10GptImageExecutionFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.10 GPTImageGen execution record file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV10GptImagePatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v0.10 GPTImageGen record missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV10GptImagePatterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.10 GPTImageGen record boundary violation in ${path}: $pattern"
    }
  }
}

$v10GptImageRetry2Files = @(
  'integrations/vcp/v0_10_gptimagegen_retry2_real_execution_record.md',
  'tests/schema_examples/v0_10_gptimagegen_retry2_real_execution_record.example.yaml'
)

$requiredV10GptImageRetry2Patterns = @(
  'phase:\s+v0\.10_gptimagegen_retry2_real_execution',
  'status:\s+failed_auth_rolled_back',
  'selected_plugin_id:\s+GPTImageGen',
  'command:\s+GPTGenerateImage',
  'model_ref:\s+gpt-image-2',
  'max_plugin_calls_authorized:\s+1',
  'actual_plugin_calls:\s+1',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'file_write_performed:\s+true',
  'image_file_created:\s+false',
  'rollback_performed:\s+true',
  'daily_note_called:\s+false',
  'daily_note_direct_write_allowed:\s+false',
  'memory_delta_only:\s+true',
  'raw_plugin_output_saved:\s+false',
  'secret_value_saved:\s+false',
  'endpoint_raw_saved:\s+false',
  'runtime_log_saved:\s+false',
  'request_identifier_saved:\s+false',
  'image_binary_saved_to_memory:\s+false',
  'vcp_toolbox_files_modified:\s+false',
  'failure_review:',
  'status:\s+blocked_by_plugin_credential',
  'additional_plugin_call_authorized:\s+false',
  'next_action_requires_new_user_authorization:\s+true'
)

$forbiddenV10GptImageRetry2Patterns = @(
  'raw_plugin_output_saved:\s+true',
  'secret_value_saved:\s+true',
  'endpoint_raw_saved:\s+true',
  'runtime_log_saved:\s+true',
  'request_identifier_saved:\s+true',
  'image_binary_saved_to_memory:\s+true',
  'daily_note_called:\s+true',
  'daily_note_direct_write_allowed:\s+true',
  'vcp_toolbox_files_modified:\s+true',
  'image_asset_available_for_review:\s+true',
  'additional_plugin_call_authorized:\s+true',
  'OPENAI_API_KEY\s*[:=]',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v10GptImageRetry2Files) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.10 GPTImageGen retry2 record file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV10GptImageRetry2Patterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v0.10 GPTImageGen retry2 record missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV10GptImageRetry2Patterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.10 GPTImageGen retry2 record boundary violation in ${path}: $pattern"
    }
  }
}

$v10GptImageGpt55Files = @(
  'integrations/vcp/v0_10_gptimagegen_gpt55_real_execution_record.md',
  'tests/schema_examples/v0_10_gptimagegen_gpt55_real_execution_record.example.yaml'
)

$requiredV10GptImageGpt55Patterns = @(
  'phase:\s+v0\.10_gptimagegen_gpt55_real_execution',
  'status:\s+failed_auth_rolled_back',
  'selected_plugin_id:\s+GPTImageGen',
  'command:\s+GPTGenerateImage',
  'model_ref:\s+gpt-5\.5',
  'model_override_applied:\s+true',
  'config_model_modified:\s+false',
  'max_plugin_calls_authorized:\s+1',
  'actual_plugin_calls:\s+1',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'file_write_performed:\s+true',
  'image_file_created:\s+false',
  'rollback_performed:\s+true',
  'daily_note_called:\s+false',
  'daily_note_direct_write_allowed:\s+false',
  'memory_delta_only:\s+true',
  'raw_plugin_output_saved:\s+false',
  'secret_value_saved:\s+false',
  'endpoint_raw_saved:\s+false',
  'runtime_log_saved:\s+false',
  'request_identifier_saved:\s+false',
  'image_binary_saved_to_memory:\s+false',
  'vcp_toolbox_files_modified:\s+false',
  'failure_review:',
  'status:\s+blocked_by_plugin_credential',
  'model_compatibility_verified:\s+false',
  'additional_plugin_call_authorized:\s+false',
  'next_action_requires_new_user_authorization:\s+true'
)

$forbiddenV10GptImageGpt55Patterns = @(
  'raw_plugin_output_saved:\s+true',
  'secret_value_saved:\s+true',
  'endpoint_raw_saved:\s+true',
  'runtime_log_saved:\s+true',
  'request_identifier_saved:\s+true',
  'image_binary_saved_to_memory:\s+true',
  'daily_note_called:\s+true',
  'daily_note_direct_write_allowed:\s+true',
  'vcp_toolbox_files_modified:\s+true',
  'config_model_modified:\s+true',
  'image_asset_available_for_review:\s+true',
  'additional_plugin_call_authorized:\s+true',
  'OPENAI_API_KEY\s*[:=]',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v10GptImageGpt55Files) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.10 GPTImageGen gpt-5.5 record file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV10GptImageGpt55Patterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v0.10 GPTImageGen gpt-5.5 record missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV10GptImageGpt55Patterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.10 GPTImageGen gpt-5.5 record boundary violation in ${path}: $pattern"
    }
  }
}

$v10DoubaoRetryFiles = @(
  'integrations/vcp/v0_10_doubaogen_retry_real_execution_record.md',
  'tests/schema_examples/v0_10_doubaogen_retry_real_execution_record.example.yaml'
)

$requiredV10DoubaoRetryPatterns = @(
  'phase:\s+v0\.10_doubaogen_retry_real_execution',
  'status:\s+completed_validated_with_human_acceptance',
  'selected_plugin_id:\s+DoubaoGen',
  'command:\s+generate',
  'model_ref:\s+doubao-seedream-5-0-260128',
  'max_plugin_calls_authorized:\s+1',
  'actual_plugin_calls:\s+1',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'file_write_performed:\s+true',
  'image_file_created:\s+true',
  'rollback_performed:\s+false',
  'daily_note_called:\s+false',
  'daily_note_direct_write_allowed:\s+false',
  'memory_delta_only:\s+true',
  'generated_image_count:\s+1',
  'generated_image_sha256:\s+b162fab50e6a5bf95b8f761441149ee27d498a3b136eafe6322f05c5499d06f0',
  'raw_plugin_output_saved:\s+false',
  'secret_value_saved:\s+false',
  'endpoint_raw_saved:\s+false',
  'runtime_log_saved:\s+false',
  'image_binary_saved_to_memory:\s+false',
  'vcp_toolbox_files_modified:\s+false',
  'visual_review:',
  'status:\s+accepted_by_human_override',
  'human_acceptance_override:\s+true',
  'usable_for_next_phase:\s+true',
  'prompt_compliance_perfect:\s+false',
  'no_people_observed:\s+true',
  'accepted_as_project_cover:\s+true',
  'additional_plugin_call_authorized:\s+false',
  'next_action_requires_new_user_authorization:\s+true'
)

$forbiddenV10DoubaoRetryPatterns = @(
  'raw_plugin_output_saved:\s+true',
  'secret_value_saved:\s+true',
  'endpoint_raw_saved:\s+true',
  'runtime_log_saved:\s+true',
  'image_binary_saved_to_memory:\s+true',
  'daily_note_called:\s+true',
  'daily_note_direct_write_allowed:\s+true',
  'vcp_toolbox_files_modified:\s+true',
  'prompt_compliance_perfect:\s+true',
  'additional_plugin_call_authorized:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v10DoubaoRetryFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.10 DoubaoGen retry record file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV10DoubaoRetryPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v0.10 DoubaoGen retry record missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV10DoubaoRetryPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.10 DoubaoGen retry record boundary violation in ${path}: $pattern"
    }
  }
}

$v08ReleaseReadinessFiles = @(
  'tests/schema_examples/v0_8_release_readiness.example.yaml'
)

$requiredV08Patterns = @(
  'v0\.8_release_readiness',
  'real_execution_allowed:\s+false',
  'max_plugin_calls_authorized:\s+0'
)

$forbiddenV08Patterns = @(
  'can_release_as_true_real_loop_final:\s+true',
  'final_v1_0_ready:\s+true',
  'real_execution_allowed:\s+true',
  'real_execution_complete:\s+true',
  'selected_plugin_for_execution:\s+(?!null\b)\S+',
  'max_plugin_calls_authorized:\s+[1-9]',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'file_write_performed:\s+true',
  'image_file_created:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v08ReleaseReadinessFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v0.8 release readiness file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV08Patterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v0.8 release readiness missing required guard in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV08Patterns) {
    if ($content -match $pattern) {
      Add-Failure "v0.8 release readiness boundary violation in ${path}: $pattern"
    }
  }
}

$v10TrueLoopCloseoutFiles = @(
  'docs/30_release_readiness_report.md',
  'docs/32_final_acceptance_report.md',
  'docs/34_v1_0_true_loop_closeout.md',
  'tests/schema_examples/v1_0_true_loop_closeout.example.yaml'
)

$requiredV10TrueLoopCloseoutPatterns = @(
  'checkpoint:\s+v1\.0_true_loop_closeout',
  'real_execution_complete:\s+true',
  'generated_asset_accepted:\s+true',
  'human_acceptance_override:\s+true',
  'prompt_compliance_perfect:\s+false',
  'final_v1_0_ready:\s+true',
  'release_publish_authorized:\s+false',
  'commit_or_tag_authorized:\s+false',
  'daily_note_called:\s+false',
  'image_binary_saved_to_memory:\s+false',
  'raw_plugin_output_saved:\s+false',
  'secret_value_saved:\s+false',
  'endpoint_raw_saved:\s+false',
  'vcp_toolbox_files_modified:\s+false',
  'additional_plugin_call_authorized:\s+false'
)

$forbiddenV10TrueLoopCloseoutPatterns = @(
  'release_publish_authorized:\s+true',
  'commit_or_tag_authorized:\s+true',
  'daily_note_called:\s+true',
  'daily_note_direct_write_allowed:\s+true',
  'image_binary_saved_to_memory:\s+true',
  'raw_plugin_output_saved:\s+true',
  'secret_value_saved:\s+true',
  'endpoint_raw_saved:\s+true',
  'runtime_log_saved:\s+true',
  'vcp_toolbox_files_modified:\s+true',
  'additional_plugin_call_authorized:\s+true',
  'prompt_compliance_perfect:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v10TrueLoopCloseoutFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v1.0 true-loop closeout file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV10TrueLoopCloseoutPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v1.0 true-loop closeout missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV10TrueLoopCloseoutPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v1.0 true-loop closeout boundary violation in ${path}: $pattern"
    }
  }
}

$v36RuntimeCodePatchAuthorizationFiles = @(
  'docs/113_v3_6_first_runtime_code_patch_authorization.md',
  'review_console/embed_contract/first_runtime_code_patch_authorization.md',
  'tests/schema_examples/v3_6_first_runtime_code_patch_authorization.example.yaml'
)

$requiredV36RuntimeCodePatchAuthorizationPatterns = @(
  'status:\s+first_runtime_code_patch_authorization_template_only',
  'final_preflight_passed:\s+false',
  'code_patch_authorization_requested:\s+false',
  'code_patch_authorization_completed:\s+false',
  'code_patch_authorization_granted:\s+false',
  'code_patch_execution_authorized:\s+false',
  'implementation_code_creation_authorized:\s+false',
  'planned_commands:\s+\[\]',
  'planned_validation_commands:\s+\[\]',
  'rollback_commands:\s+\[\]',
  'allowed_modify_files:\s+\[\]',
  'allowed_create_files:\s+\[\]',
  'allowed_ipc_channels:\s+\[\]',
  'allowed_preload_api_names:\s+\[\]',
  'allowed_renderer_entry_points:\s+\[\]',
  'electron_boundary_confirmed:\s+false',
  'real_execution_allowed:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false'
)

$forbiddenV36RuntimeCodePatchAuthorizationPatterns = @(
  'final_preflight_passed:\s+true',
  'code_patch_authorization_requested:\s+true',
  'code_patch_authorization_completed:\s+true',
  'code_patch_authorization_granted:\s+true',
  'code_patch_execution_authorized:\s+true',
  'implementation_code_creation_authorized:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v36RuntimeCodePatchAuthorizationFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v3.6 runtime code patch authorization file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV36RuntimeCodePatchAuthorizationPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v3.6 runtime code patch authorization missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV36RuntimeCodePatchAuthorizationPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v3.6 runtime code patch authorization boundary violation in ${path}: $pattern"
    }
  }
}

$v37RuntimePatchExecutionFiles = @(
  'docs/114_v3_7_first_runtime_patch_execution_record.md',
  'tests/schema_examples/v3_7_first_runtime_patch_execution_record.example.yaml'
)

$requiredV37RuntimePatchExecutionPatterns = @(
  'status:\s+completed_validated_project_runtime_patch',
  'user_runtime_code_authorization_received:\s+true',
  'scope_limited_by_codex:\s+true',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'project_runtime_prototype_modified:\s+true',
  'project_runtime_guard_added:\s+true',
  'host_bridge_ack_added:\s+true',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'runtime_disk_write_performed:\s+false',
  'image_file_created:\s+false',
  'raw_source_copied_from_external_repo:\s+false',
  'secret_value_saved:\s+false',
  'endpoint_raw_saved:\s+false',
  'runtime_log_saved:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV37RuntimePatchExecutionPatterns = @(
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'runtime_disk_write_performed:\s+true',
  'image_file_created:\s+true',
  'raw_source_copied_from_external_repo:\s+true',
  'secret_value_saved:\s+true',
  'endpoint_raw_saved:\s+true',
  'runtime_log_saved:\s+true',
  'commit_tag_push_authorized:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v37RuntimePatchExecutionFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v3.7 runtime patch execution record file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV37RuntimePatchExecutionPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v3.7 runtime patch execution record missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV37RuntimePatchExecutionPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v3.7 runtime patch execution record boundary violation in ${path}: $pattern"
    }
  }
}

$v38RuntimePrototypeSmokeTestFiles = @(
  'docs/115_v3_8_runtime_prototype_smoke_test.md',
  'tests/schema_examples/v3_8_runtime_prototype_smoke_test.example.yaml'
)

$requiredV38RuntimePrototypeSmokeTestPatterns = @(
  'status:\s+completed_validated_project_local_smoke_test',
  'project_runtime_smoke_test_added:\s+true',
  'node_smoke_test_added:\s+true',
  'headless_browser_required:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'runtime_disk_write_performed:\s+false',
  'image_file_created:\s+false',
  'dirty_guard_rejected:\s+true',
  'accepted_without_approval_rejected:\s+true',
  'node_smoke_test:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV38RuntimePrototypeSmokeTestPatterns = @(
  'headless_browser_required:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'runtime_disk_write_performed:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v38RuntimePrototypeSmokeTestFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v3.8 runtime prototype smoke test file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV38RuntimePrototypeSmokeTestPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v3.8 runtime prototype smoke test missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV38RuntimePrototypeSmokeTestPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v3.8 runtime prototype smoke test boundary violation in ${path}: $pattern"
    }
  }
}

$v39RuntimeGuardExtractionFiles = @(
  'docs/116_v3_9_runtime_guard_extraction.md',
  'tests/schema_examples/v3_9_runtime_guard_extraction.example.yaml'
)

$requiredV39RuntimeGuardExtractionPatterns = @(
  'status:\s+completed_validated_project_local_runtime_guard_extraction',
  'shared_runtime_guard_added:\s+true',
  'app_uses_shared_runtime_guard:\s+true',
  'host_bridge_uses_shared_runtime_guard:\s+true',
  'smoke_test_uses_shared_runtime_guard:\s+true',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'runtime_disk_write_performed:\s+false',
  'image_file_created:\s+false',
  'dirty_guard_rejected:\s+true',
  'dirty_audit_guard_rejected:\s+true',
  'accepted_without_approval_rejected:\s+true',
  'node_smoke_test:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV39RuntimeGuardExtractionPatterns = @(
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'runtime_disk_write_performed:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v39RuntimeGuardExtractionFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v3.9 runtime guard extraction file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV39RuntimeGuardExtractionPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v3.9 runtime guard extraction missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV39RuntimeGuardExtractionPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v3.9 runtime guard extraction boundary violation in ${path}: $pattern"
    }
  }
}

$v40RuntimeContractSmokeHardeningFiles = @(
  'docs/117_v4_0_runtime_contract_smoke_hardening.md',
  'tests/schema_examples/v4_0_runtime_contract_smoke_hardening.example.yaml'
)

$requiredV40RuntimeContractSmokeHardeningPatterns = @(
  'status:\s+completed_validated_project_local_runtime_contract_smoke_hardening',
  'index_script_order_smoke_added:\s+true',
  'runtime_guard_api_smoke_added:\s+true',
  'smoke_test_uses_index_script_order:\s+true',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'runtime_disk_write_performed:\s+false',
  'image_file_created:\s+false',
  'script_order_verified:\s+true',
  'runtime_guard_api_verified:\s+true',
  'dirty_guard_rejected:\s+true',
  'dirty_audit_guard_rejected:\s+true',
  'accepted_without_approval_rejected:\s+true',
  'node_smoke_test:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV40RuntimeContractSmokeHardeningPatterns = @(
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'runtime_disk_write_performed:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v40RuntimeContractSmokeHardeningFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v4.0 runtime contract smoke hardening file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV40RuntimeContractSmokeHardeningPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v4.0 runtime contract smoke hardening missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV40RuntimeContractSmokeHardeningPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v4.0 runtime contract smoke hardening boundary violation in ${path}: $pattern"
    }
  }
}

$v41RuntimeGuardUnitValidationFiles = @(
  'docs/118_v4_1_runtime_guard_unit_validation.md',
  'tests/schema_examples/v4_1_runtime_guard_unit_validation.example.yaml'
)

$requiredV41RuntimeGuardUnitValidationPatterns = @(
  'status:\s+completed_validated_project_local_runtime_guard_unit_validation',
  'runtime_guard_unit_harness_added:\s+true',
  'clean_guard_passed:\s+true',
  'dirty_guard_rejected:\s+true',
  'extra_key_guard_rejected:\s+true',
  'clone_deep_copy_verified:\s+true',
  'normalize_session_defaults_verified:\s+true',
  'accepted_without_approval_rejected:\s+true',
  'memory_write_without_approval_rejected:\s+true',
  'memory_write_with_approval_allowed_as_request:\s+true',
  'dirty_audit_guard_rejected:\s+true',
  'missing_required_section_rejected:\s+true',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'runtime_disk_write_performed:\s+false',
  'image_file_created:\s+false',
  'node_runtime_guard_unit:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV41RuntimeGuardUnitValidationPatterns = @(
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'runtime_disk_write_performed:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v41RuntimeGuardUnitValidationFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v4.1 runtime guard unit validation file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV41RuntimeGuardUnitValidationPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v4.1 runtime guard unit validation missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV41RuntimeGuardUnitValidationPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v4.1 runtime guard unit validation boundary violation in ${path}: $pattern"
    }
  }
}

$v42RuntimeValidationSuiteFiles = @(
  'docs/119_v4_2_runtime_validation_suite.md',
  'tests/schema_examples/v4_2_runtime_validation_suite.example.yaml'
)

$requiredV42RuntimeValidationSuitePatterns = @(
  'status:\s+completed_validated_project_local_runtime_validation_suite',
  'runtime_validation_suite_added:\s+true',
  'runtime_guard_syntax:\s+true',
  'host_bridge_mock_syntax:\s+true',
  'runtime_app_syntax:\s+true',
  'runtime_guard_unit_syntax:\s+true',
  'runtime_guard_unit:\s+true',
  'runtime_guard_unit_output_passed:\s+true',
  'runtime_smoke_syntax:\s+true',
  'runtime_smoke:\s+true',
  'runtime_smoke_output_passed:\s+true',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'node_runtime_prototype_suite:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV42RuntimeValidationSuitePatterns = @(
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  '[A-Za-z]:\\',
  'https?://'
)

foreach ($path in $v42RuntimeValidationSuiteFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v4.2 runtime validation suite file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV42RuntimeValidationSuitePatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v4.2 runtime validation suite missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV42RuntimeValidationSuitePatterns) {
    if ($content -match $pattern) {
      Add-Failure "v4.2 runtime validation suite boundary violation in ${path}: $pattern"
    }
  }
}

$v43AutopilotOverlayInstallationFiles = @(
  'docs/120_v4_3_autopilot_overlay_installation.md',
  'tests/schema_examples/v4_3_autopilot_overlay_installation.example.yaml'
)

$requiredV43AutopilotOverlayInstallationPatterns = @(
  'status:\s+completed_validated_project_local_autopilot_overlay_installation',
  'autopilot_overlay_installed:\s+true',
  'agent_board_installed:\s+true',
  'agent_board_synchronized:\s+true',
  'existing_files_overwritten:\s+false',
  'root_agents_overwritten:\s+false',
  'overlay_kept_separate:\s+true',
  'validation_helper_adjusted_for_historical_records:\s+true',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'runtime_disk_write_performed:\s+false',
  'image_file_created:\s+false',
  'validate_mvp:\s+passed_after_integration',
  'validate_agent_image_lab_local_ps1:\s+passed_with_manual_review_warnings',
  'runtime_validation_suite:\s+passed',
  'git_diff_check:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV43AutopilotOverlayInstallationPatterns = @(
  'existing_files_overwritten:\s+true',
  'root_agents_overwritten:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'runtime_disk_write_performed:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v43AutopilotOverlayInstallationFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v4.3 autopilot overlay installation file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $forbiddenV43AutopilotOverlayInstallationPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v4.3 autopilot overlay installation boundary violation in ${path}: $pattern"
    }
  }
}

foreach ($path in @('docs/120_v4_3_autopilot_overlay_installation.md', 'tests/schema_examples/v4_3_autopilot_overlay_installation.example.yaml')) {
  $fullPath = Join-Path $Root $path
  if (Test-Path -LiteralPath $fullPath) {
    $content = Get-Content -Raw -Encoding UTF8 $fullPath
    foreach ($pattern in $requiredV43AutopilotOverlayInstallationPatterns) {
      if ($content -notmatch $pattern) {
        Add-Failure "v4.3 autopilot overlay installation missing required field in ${path}: $pattern"
      }
    }
  }
}

$v44AgentBoardStateValidationFiles = @(
  'docs/121_v4_4_agent_board_state_validation.md',
  'tests/schema_examples/v4_4_agent_board_state_validation.example.yaml'
)

$requiredV44AgentBoardStateValidationPatterns = @(
  'status:\s+completed_validated_project_local_agent_board_state_validation',
  'agent_board_state_validation_added:\s+true',
  'required_files_present:\s+true',
  'current_mode_declared:\s+true',
  'no_external_read_gate_declared:\s+true',
  'real_execution_gate_declared:\s+true',
  'remote_action_gate_declared:\s+true',
  'validation_snapshot_present:\s+true',
  'handoff_resume_prompt_present:\s+true',
  'overlay_separation_decision_present:\s+true',
  'local_uncommitted_state_declared:\s+true',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'node_agent_board_state:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV44AgentBoardStateValidationPatterns = @(
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v44AgentBoardStateValidationFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v4.4 agent board state validation file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV44AgentBoardStateValidationPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v4.4 agent board state validation missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV44AgentBoardStateValidationPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v4.4 agent board state validation boundary violation in ${path}: $pattern"
    }
  }
}

$v45LocalCheckpointReadinessFiles = @(
  'docs/122_v4_5_local_checkpoint_readiness.md',
  'tests/schema_examples/v4_5_local_checkpoint_readiness.example.yaml'
)

$requiredV45LocalCheckpointReadinessPatterns = @(
  'status:\s+completed_validated_project_local_checkpoint_readiness',
  'local_checkpoint_manifest_added:\s+true',
  'checkpoint_files_present:\s+true',
  'overlay_files_present:\s+true',
  'validation_files_present:\s+true',
  'local_uncommitted_state_declared:\s+true',
  'commit_tag_push_not_authorized:\s+true',
  'validation_snapshot_present:\s+true',
  'roadmap_current_state_updated:\s+true',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'node_local_checkpoint_manifest:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV45LocalCheckpointReadinessPatterns = @(
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v45LocalCheckpointReadinessFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v4.5 local checkpoint readiness file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV45LocalCheckpointReadinessPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v4.5 local checkpoint readiness missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV45LocalCheckpointReadinessPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v4.5 local checkpoint readiness boundary violation in ${path}: $pattern"
    }
  }
}

$v46LocalCommitScopeManifestFiles = @(
  'docs/123_v4_6_local_commit_scope_manifest.md',
  'tests/schema_examples/v4_6_local_commit_scope_manifest.example.yaml'
)

$requiredV46LocalCommitScopeManifestPatterns = @(
  'status:\s+completed_validated_project_local_commit_scope_manifest',
  'local_commit_scope_manifest_added:\s+true',
  'changed_file_allowlist_added:\s+true',
  'modified_files_allowed:\s+true',
  'untracked_files_allowed:\s+true',
  'staged_changes_present:\s+false',
  'commit_allowed:\s+false',
  'tag_allowed:\s+false',
  'push_allowed:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'node_local_commit_scope:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV46LocalCommitScopeManifestPatterns = @(
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_allowed:\s+true',
  'tag_allowed:\s+true',
  'push_allowed:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

$allowedV46ModifiedFiles = @(
  'AGENTS.md',
  'MANIFEST.md',
  'README.md',
  'RELEASE_NOTES.md',
  '.agent_board/BLOCKERS.md',
  '.agent_board/CHECKPOINT.md',
  '.agent_board/DECISIONS.md',
  '.agent_board/HANDOFF.md',
  '.agent_board/RUN_STATE.md',
  '.agent_board/TASK_QUEUE.md',
  '.agent_board/VALIDATION_LOG.md',
  'adapter_dry_run_lab/adapter_dry_run.js',
  'adapter_dry_run_lab/README.md',
  'docs/00_project_roadmap.md',
  'docs/125_v4_8_v4_index_consistency_validation.md',
  'exports/vcptoolbox/Plugin/AgentImageLabAdapter/README.md',
  'review_console/static_prototype/FIELD_MAPPING.md',
  'review_console/static_prototype/app.js',
  'review_console/static_prototype/mock_data.js',
  'review_console/runtime_prototype/README.md',
  'scripts/validate_local_commit_scope.js',
  'scripts/validate-agent-image-lab-local.ps1',
  'scripts/validate_mvp.ps1',
  'scripts/validate_v4_index_consistency.js',
  'scripts/validate_v5_delivery_readiness.js',
  'scripts/validate_adapter_delivery_surface.js',
  'scripts/validate_review_console_adapter_handoff.js',
  'scripts/validate_v5_local_sync_readiness.js',
  'scripts/validate_v5_post_commit_reconciliation.js',
  'scripts/validate_v5_index_consistency.js',
  'scripts/validate_v5_local_batch_commit_readiness.js',
  'scripts/validate_v5_handoff_freshness.js',
  'scripts/validate_v5_true_loop_candidate_delivery.js',
  'scripts/validate_v5_post_merge_reconciliation.js',
  'scripts/validate_v5_12_release_candidate_readiness.js',
  'scripts/validate_runtime_delivery_surface.js',
  'scripts/validate_runtime_prototype_suite.js',
  'scripts/validate_runtime_prototype_smoke.js',
  'tests/schema_examples/v4_8_v4_index_consistency_validation.example.yaml',
  'tests/schema_examples/v5_1_runtime_delivery_surface.example.yaml',
  'tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml',
  'tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml',
  'tests/schema_examples/v5_4_local_sync_readiness.example.yaml',
  'tests/schema_examples/v5_5_post_commit_reconciliation.example.yaml',
  'docs/132_v5_5_post_commit_reconciliation.md',
  'tests/schema_examples/v5_6_v5_index_consistency_validation.example.yaml',
  'docs/133_v5_6_v5_index_consistency_validation.md',
  'tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml',
  'docs/134_v5_7_local_batch_commit_readiness.md',
  'tests/schema_examples/v5_8_handoff_freshness_validation.example.yaml',
  'docs/135_v5_8_handoff_freshness_validation.md',
  'tests/schema_examples/v5_9_expanded_v5_index_consistency.example.yaml',
  'docs/136_v5_9_expanded_v5_index_consistency.md',
  'tests/schema_examples/v5_10_local_true_loop_candidate_delivery.example.yaml',
  'docs/137_v5_10_local_true_loop_candidate_delivery.md',
  'tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml',
  'docs/138_v5_11_post_merge_reconciliation.md',
  'tests/schema_examples/v5_12_release_candidate_readiness.example.yaml',
  'docs/139_v5_12_release_candidate_readiness.md',
  'tests/validation_checklist.md'
)

$allowedV46UntrackedFiles = @(
  '.agent_board/BLOCKERS.md',
  '.agent_board/CHECKPOINT.md',
  '.agent_board/DECISIONS.md',
  '.agent_board/HANDOFF.md',
  '.agent_board/RUN_STATE.md',
  '.agent_board/TASK_QUEUE.md',
  '.agent_board/VALIDATION_LOG.md',
  'AGENTS.autopilot-overlay.md',
  'AUTOPILOT_REFACTOR_REPORT.md',
  'README_AGENT_IMAGE_LAB_AUTOPILOT.md',
  'codex/AGENT_IMAGE_LAB_AUTOPILOT_PROMPT.md',
  'docs/117_v4_0_runtime_contract_smoke_hardening.md',
  'docs/118_v4_1_runtime_guard_unit_validation.md',
  'docs/119_v4_2_runtime_validation_suite.md',
  'docs/120_v4_3_autopilot_overlay_installation.md',
  'docs/121_v4_4_agent_board_state_validation.md',
  'docs/122_v4_5_local_checkpoint_readiness.md',
  'docs/123_v4_6_local_commit_scope_manifest.md',
  'docs/124_v4_7_post_push_state_reconciliation.md',
  'docs/125_v4_8_v4_index_consistency_validation.md',
  'docs/126_v4_9_local_tag_push_readiness.md',
  'docs/127_v5_0_delivery_readiness_index.md',
  'docs/128_v5_1_runtime_delivery_surface.md',
  'docs/129_v5_2_adapter_delivery_surface.md',
  'docs/130_v5_3_review_console_adapter_handoff.md',
  'docs/131_v5_4_local_sync_readiness.md',
  'docs/132_v5_5_post_commit_reconciliation.md',
  'docs/133_v5_6_v5_index_consistency_validation.md',
  'docs/134_v5_7_local_batch_commit_readiness.md',
  'docs/135_v5_8_handoff_freshness_validation.md',
  'docs/136_v5_9_expanded_v5_index_consistency.md',
  'docs/137_v5_10_local_true_loop_candidate_delivery.md',
  'docs/138_v5_11_post_merge_reconciliation.md',
  'docs/139_v5_12_release_candidate_readiness.md',
  'scripts/validate-agent-image-lab-local.ps1',
  'scripts/validate-agent-image-lab-local.sh',
  'scripts/validate_agent_board_state.js',
  'scripts/validate_local_checkpoint_manifest.js',
  'scripts/validate_post_push_state.js',
  'scripts/validate_v4_index_consistency.js',
  'scripts/validate_local_tag_push_readiness.js',
  'scripts/validate_v5_delivery_readiness.js',
  'scripts/validate_adapter_delivery_surface.js',
  'scripts/validate_review_console_adapter_handoff.js',
  'scripts/validate_v5_local_sync_readiness.js',
  'scripts/validate_v5_post_commit_reconciliation.js',
  'scripts/validate_v5_index_consistency.js',
  'scripts/validate_v5_local_batch_commit_readiness.js',
  'scripts/validate_v5_handoff_freshness.js',
  'scripts/validate_v5_true_loop_candidate_delivery.js',
  'scripts/validate_v5_post_merge_reconciliation.js',
  'scripts/validate_v5_12_release_candidate_readiness.js',
  'scripts/validate_runtime_delivery_surface.js',
  'scripts/validate_runtime_guard_unit.js',
  'scripts/validate_runtime_prototype_suite.js',
  'tests/schema_examples/v4_0_runtime_contract_smoke_hardening.example.yaml',
  'tests/schema_examples/v4_1_runtime_guard_unit_validation.example.yaml',
  'tests/schema_examples/v4_2_runtime_validation_suite.example.yaml',
  'tests/schema_examples/v4_3_autopilot_overlay_installation.example.yaml',
  'tests/schema_examples/v4_4_agent_board_state_validation.example.yaml',
  'tests/schema_examples/v4_5_local_checkpoint_readiness.example.yaml',
  'tests/schema_examples/v4_6_local_commit_scope_manifest.example.yaml',
  'tests/schema_examples/v4_7_post_push_state_reconciliation.example.yaml',
  'tests/schema_examples/v4_8_v4_index_consistency_validation.example.yaml',
  'tests/schema_examples/v4_9_local_tag_push_readiness.example.yaml',
  'tests/schema_examples/v5_0_delivery_readiness.example.yaml',
  'tests/schema_examples/v5_1_runtime_delivery_surface.example.yaml',
  'tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml',
  'tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml',
  'tests/schema_examples/v5_4_local_sync_readiness.example.yaml',
  'tests/schema_examples/v5_5_post_commit_reconciliation.example.yaml',
  'tests/schema_examples/v5_6_v5_index_consistency_validation.example.yaml',
  'tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml',
  'tests/schema_examples/v5_8_handoff_freshness_validation.example.yaml',
  'tests/schema_examples/v5_9_expanded_v5_index_consistency.example.yaml',
  'tests/schema_examples/v5_10_local_true_loop_candidate_delivery.example.yaml',
  'tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml',
  'tests/schema_examples/v5_12_release_candidate_readiness.example.yaml'
)

foreach ($path in $v46LocalCommitScopeManifestFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v4.6 local commit scope manifest file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV46LocalCommitScopeManifestPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v4.6 local commit scope manifest missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV46LocalCommitScopeManifestPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v4.6 local commit scope manifest boundary violation in ${path}: $pattern"
    }
  }
}

$v47PostPushStateReconciliationFiles = @(
  'docs/124_v4_7_post_push_state_reconciliation.md',
  'tests/schema_examples/v4_7_post_push_state_reconciliation.example.yaml'
)

$requiredV47PostPushStateReconciliationPatterns = @(
  'status:\s+completed_validated_project_local_post_push_state_reconciliation',
  'pushed_baseline_recorded:\s+true',
  'pushed_commit_short:\s+7f58408',
  'pushed_tag:\s+v4\.6-guarded-autopilot-commit-scope',
  'current_phase_updated:\s+true',
  'new_local_batch_declared:\s+true',
  'remote_gate_preserved:\s+true',
  'validation_snapshot_updated:\s+true',
  'roadmap_updated:\s+true',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'node_post_push_state:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV47PostPushStateReconciliationPatterns = @(
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v47PostPushStateReconciliationFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v4.7 post-push state reconciliation file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV47PostPushStateReconciliationPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v4.7 post-push state reconciliation missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV47PostPushStateReconciliationPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v4.7 post-push state reconciliation boundary violation in ${path}: $pattern"
    }
  }
}

$v48V4IndexConsistencyValidationFiles = @(
  'docs/125_v4_8_v4_index_consistency_validation.md',
  'tests/schema_examples/v4_8_v4_index_consistency_validation.example.yaml'
)

$requiredV48V4IndexConsistencyValidationPatterns = @(
  'status:\s+completed_validated_project_local_v4_index_consistency_validation',
  'v4_index_consistency_validation_added:\s+true',
  'v4_record_count:\s+10',
  'docs_present:\s+true',
  'schema_examples_present:\s+true',
  'validation_scripts_present:\s+true',
  'readme_index_current:\s+true',
  'manifest_index_current:\s+true',
  'release_notes_current:\s+true',
  'roadmap_current:\s+true',
  'checklist_current:\s+true',
  'validate_mvp_current:\s+true',
  'agent_board_current:\s+true',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'node_v4_index_consistency:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV48V4IndexConsistencyValidationPatterns = @(
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v48V4IndexConsistencyValidationFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v4.8 v4 index consistency validation file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV48V4IndexConsistencyValidationPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v4.8 v4 index consistency validation missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV48V4IndexConsistencyValidationPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v4.8 v4 index consistency validation boundary violation in ${path}: $pattern"
    }
  }
}

$v49LocalTagPushReadinessFiles = @(
  'docs/126_v4_9_local_tag_push_readiness.md',
  'tests/schema_examples/v4_9_local_tag_push_readiness.example.yaml'
)

$requiredV49LocalTagPushReadinessPatterns = @(
  'status:\s+completed_validated_project_local_tag_push_readiness',
  'local_tag_push_readiness_added:\s+true',
  'local_commit_short:\s+6d4253f',
  'local_tag:\s+v4\.8-local-validation-checkpoint',
  'last_pushed_commit_short:\s+7f58408',
  'last_pushed_tag:\s+v4\.6-guarded-autopilot-commit-scope',
  'local_tag_recorded:\s+true',
  'last_pushed_baseline_recorded:\s+true',
  'push_pending_declared:\s+true',
  'push_authorized:\s+false',
  'remote_gate_preserved:\s+true',
  'validation_snapshot_updated:\s+true',
  'top_indexes_updated:\s+true',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'node_local_tag_push_readiness:\s+passed',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV49LocalTagPushReadinessPatterns = @(
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'push_authorized:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v49LocalTagPushReadinessFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v4.9 local tag push-readiness file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV49LocalTagPushReadinessPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v4.9 local tag push-readiness missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV49LocalTagPushReadinessPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v4.9 local tag push-readiness boundary violation in ${path}: $pattern"
    }
  }
}

$v50DeliveryReadinessFiles = @(
  'docs/127_v5_0_delivery_readiness_index.md',
  'tests/schema_examples/v5_0_delivery_readiness.example.yaml'
)

$requiredV50DeliveryReadinessPatterns = @(
  'status:\s+completed_validated_project_local_v5_delivery_readiness_index',
  'version:\s+v5\.0',
  'pr_number:\s+1',
  'pr_merged:\s+true',
  'merge_commit_short:\s+367d3c9',
  'merged_head_commit_short:\s+b595851',
  'base_branch:\s+master',
  'local_master_synced:\s+true',
  'remote_master_synced:\s+true',
  'checkpoint_tag_pushed:\s+true',
  'checkpoint_tag:\s+v4\.8-local-validation-checkpoint',
  'checkpoint_commit_short:\s+6d4253f',
  'delivery_entry_current:\s+true',
  'validation_command_surface_current:\s+true',
  'agent_board_post_merge_current:\s+true',
  'handoff_post_merge_current:\s+true',
  'task_queue_current:\s+true',
  'release_notes_current:\s+true',
  'roadmap_current:\s+true',
  'checklist_current:\s+true',
  'validate_mvp_current:\s+true',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV50DeliveryReadinessPatterns = @(
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v50DeliveryReadinessFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.0 delivery readiness file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV50DeliveryReadinessPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.0 delivery readiness missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV50DeliveryReadinessPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.0 delivery readiness boundary violation in ${path}: $pattern"
    }
  }
}

$v51RuntimeDeliverySurfaceFiles = @(
  'docs/128_v5_1_runtime_delivery_surface.md',
  'tests/schema_examples/v5_1_runtime_delivery_surface.example.yaml'
)

$requiredV51RuntimeDeliverySurfacePatterns = @(
  'status:\s+completed_validated_project_local_v5_1_runtime_delivery_surface',
  'version:\s+v5\.1',
  'validation_file:\s+scripts/validate_runtime_delivery_surface\.js',
  'runtime_file_count:\s+7',
  'runtime_files_present:\s+true',
  'script_order_verified:\s+true',
  'stylesheet_present:\s+true',
  'dom_surface_id_count:\s+14',
  'dom_surface_present:\s+true',
  'host_ack_surface_present:\s+true',
  'field_mapping_current:\s+true',
  'readme_boundary_current:\s+true',
  'validation_command_current:\s+true',
  'suite_integrated:\s+true',
  'validate_mvp_current:\s+true',
  'external_assets_loaded:\s+false',
  'forbidden_runtime_calls_present:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV51RuntimeDeliverySurfacePatterns = @(
  'external_assets_loaded:\s+true',
  'forbidden_runtime_calls_present:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v51RuntimeDeliverySurfaceFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.1 runtime delivery surface file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV51RuntimeDeliverySurfacePatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.1 runtime delivery surface missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV51RuntimeDeliverySurfacePatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.1 runtime delivery surface boundary violation in ${path}: $pattern"
    }
  }
}

$v52AdapterDeliverySurfaceFiles = @(
  'docs/129_v5_2_adapter_delivery_surface.md',
  'tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml'
)

$requiredV52AdapterDeliverySurfacePatterns = @(
  'status:\s+completed_validated_project_local_v5_2_adapter_delivery_surface',
  'version:\s+v5\.2',
  'validation_file:\s+scripts/validate_adapter_delivery_surface\.js',
  'adapter_file_count:\s+9',
  'adapter_files_present:\s+true',
  'manifest_dry_run_only:\s+true',
  'allowed_command_dry_run_only:\s+true',
  'forbidden_commands_declared:\s+true',
  'dry_run_contract_current:\s+true',
  'lab_accepted_fixture_passed:\s+true',
  'lab_rejected_fixture_passed:\s+true',
  'export_accepted_stdio_passed:\s+true',
  'export_rejected_stdio_passed:\s+true',
  'no_execution_guard_verified:\s+true',
  'readme_boundary_current:\s+true',
  'config_example_secret_free:\s+true',
  'forbidden_runtime_calls_present:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV52AdapterDeliverySurfacePatterns = @(
  'manifest_dry_run_only:\s+false',
  'allowed_command_dry_run_only:\s+false',
  'dry_run_contract_current:\s+false',
  'lab_accepted_fixture_passed:\s+false',
  'lab_rejected_fixture_passed:\s+false',
  'export_accepted_stdio_passed:\s+false',
  'export_rejected_stdio_passed:\s+false',
  'no_execution_guard_verified:\s+false',
  'config_example_secret_free:\s+false',
  'forbidden_runtime_calls_present:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v52AdapterDeliverySurfaceFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.2 adapter delivery surface file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV52AdapterDeliverySurfacePatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.2 adapter delivery surface missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV52AdapterDeliverySurfacePatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.2 adapter delivery surface boundary violation in ${path}: $pattern"
    }
  }
}

$v53ReviewConsoleAdapterHandoffFiles = @(
  'docs/130_v5_3_review_console_adapter_handoff.md',
  'tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml'
)

$requiredV53ReviewConsoleAdapterHandoffPatterns = @(
  'status:\s+completed_validated_project_local_v5_3_review_console_adapter_handoff',
  'version:\s+v5\.3',
  'validation_file:\s+scripts/validate_review_console_adapter_handoff\.js',
  'static_handoff_fixture_present:\s+true',
  'adapter_fixture_compared:\s+true',
  'accepted_draft_status_verified:\s+true',
  'dispatch_plan_mapped:\s+true',
  'gatekeeper_handoff_mapped:\s+true',
  'review_console_handoff_mapped:\s+true',
  'audit_record_mapped:\s+true',
  'no_execution_guard_verified:\s+true',
  'allowed_actions_verified:\s+true',
  'forbidden_actions_verified:\s+true',
  'static_app_draft_output_current:\s+true',
  'field_mapping_current:\s+true',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV53ReviewConsoleAdapterHandoffPatterns = @(
  'static_handoff_fixture_present:\s+false',
  'adapter_fixture_compared:\s+false',
  'accepted_draft_status_verified:\s+false',
  'dispatch_plan_mapped:\s+false',
  'gatekeeper_handoff_mapped:\s+false',
  'review_console_handoff_mapped:\s+false',
  'audit_record_mapped:\s+false',
  'no_execution_guard_verified:\s+false',
  'allowed_actions_verified:\s+false',
  'forbidden_actions_verified:\s+false',
  'static_app_draft_output_current:\s+false',
  'field_mapping_current:\s+false',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v53ReviewConsoleAdapterHandoffFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.3 Review Console Adapter handoff file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV53ReviewConsoleAdapterHandoffPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.3 Review Console Adapter handoff missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV53ReviewConsoleAdapterHandoffPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.3 Review Console Adapter handoff boundary violation in ${path}: $pattern"
    }
  }
}

$v54LocalSyncReadinessFiles = @(
  'docs/131_v5_4_local_sync_readiness.md',
  'tests/schema_examples/v5_4_local_sync_readiness.example.yaml'
)

$requiredV54LocalSyncReadinessPatterns = @(
  'status:\s+completed_validated_project_local_v5_4_local_sync_readiness',
  'version:\s+v5\.4',
  'validation_file:\s+scripts/validate_v5_local_sync_readiness\.js',
  'origin_master_short:\s+367d3c9',
  'local_head_short:\s+b04e253',
  'pending_local_commit_count:\s+3',
  'local_commit_chain_ordered:\s+true',
  'local_commit_messages_recorded:\s+true',
  'board_commit_chain_current:\s+true',
  'top_indexes_updated:\s+true',
  'validation_surface_current:\s+true',
  'push_authorized:\s+false',
  'tag_authorized:\s+false',
  'pr_authorized:\s+false',
  'release_authorized:\s+false',
  'remote_write_performed:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV54LocalSyncReadinessPatterns = @(
  'local_commit_chain_ordered:\s+false',
  'local_commit_messages_recorded:\s+false',
  'board_commit_chain_current:\s+false',
  'top_indexes_updated:\s+false',
  'validation_surface_current:\s+false',
  'push_authorized:\s+true',
  'tag_authorized:\s+true',
  'pr_authorized:\s+true',
  'release_authorized:\s+true',
  'remote_write_performed:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v54LocalSyncReadinessFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.4 local sync readiness file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV54LocalSyncReadinessPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.4 local sync readiness missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV54LocalSyncReadinessPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.4 local sync readiness boundary violation in ${path}: $pattern"
    }
  }
}

$v55PostCommitReconciliationFiles = @(
  'docs/132_v5_5_post_commit_reconciliation.md',
  'tests/schema_examples/v5_5_post_commit_reconciliation.example.yaml'
)

$requiredV55PostCommitReconciliationPatterns = @(
  'status:\s+completed_validated_project_local_v5_5_post_commit_reconciliation',
  'version:\s+v5\.5',
  'validation_file:\s+scripts/validate_v5_post_commit_reconciliation\.js',
  'origin_master_short:\s+367d3c9',
  'committed_checkpoint_short:\s+a2ae539',
  'committed_checkpoint_message:\s+"chore: add v5\.4 local sync readiness preflight"',
  'pending_local_commit_count:\s+4',
  'local_commit_chain_ordered:\s+true',
  'v5_4_commit_recorded:\s+true',
  'post_commit_board_reconciled:\s+true',
  'top_indexes_updated:\s+true',
  'validation_surface_current:\s+true',
  'current_local_batch_open:\s+true',
  'current_batch_uncommitted_changes_expected:\s+true',
  'push_authorized:\s+false',
  'tag_authorized:\s+false',
  'pr_authorized:\s+false',
  'release_authorized:\s+false',
  'remote_write_performed:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV55PostCommitReconciliationPatterns = @(
  'local_commit_chain_ordered:\s+false',
  'v5_4_commit_recorded:\s+false',
  'post_commit_board_reconciled:\s+false',
  'top_indexes_updated:\s+false',
  'validation_surface_current:\s+false',
  'current_local_batch_open:\s+false',
  'current_batch_uncommitted_changes_expected:\s+false',
  'push_authorized:\s+true',
  'tag_authorized:\s+true',
  'pr_authorized:\s+true',
  'release_authorized:\s+true',
  'remote_write_performed:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v55PostCommitReconciliationFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.5 post-commit reconciliation file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV55PostCommitReconciliationPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.5 post-commit reconciliation missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV55PostCommitReconciliationPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.5 post-commit reconciliation boundary violation in ${path}: $pattern"
    }
  }
}

$v56V5IndexConsistencyFiles = @(
  'docs/133_v5_6_v5_index_consistency_validation.md',
  'tests/schema_examples/v5_6_v5_index_consistency_validation.example.yaml'
)

$requiredV56V5IndexConsistencyPatterns = @(
  'status:\s+completed_validated_project_local_v5_6_v5_index_consistency',
  'version:\s+v5\.6',
  'validation_file:\s+scripts/validate_v5_index_consistency\.js',
  'v5_record_count:\s+7',
  'docs_present:\s+true',
  'schema_examples_present:\s+true',
  'validation_scripts_present:\s+true',
  'readme_index_current:\s+true',
  'manifest_index_current:\s+true',
  'release_notes_current:\s+true',
  'roadmap_current:\s+true',
  'checklist_current:\s+true',
  'validate_mvp_current:\s+true',
  'agent_board_current:\s+true',
  'push_authorized:\s+false',
  'tag_authorized:\s+false',
  'pr_authorized:\s+false',
  'release_authorized:\s+false',
  'remote_write_performed:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV56V5IndexConsistencyPatterns = @(
  'docs_present:\s+false',
  'schema_examples_present:\s+false',
  'validation_scripts_present:\s+false',
  'readme_index_current:\s+false',
  'manifest_index_current:\s+false',
  'release_notes_current:\s+false',
  'roadmap_current:\s+false',
  'checklist_current:\s+false',
  'validate_mvp_current:\s+false',
  'agent_board_current:\s+false',
  'push_authorized:\s+true',
  'tag_authorized:\s+true',
  'pr_authorized:\s+true',
  'release_authorized:\s+true',
  'remote_write_performed:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v56V5IndexConsistencyFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.6 v5 index consistency file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV56V5IndexConsistencyPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.6 v5 index consistency missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV56V5IndexConsistencyPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.6 v5 index consistency boundary violation in ${path}: $pattern"
    }
  }
}

$v57LocalBatchCommitReadinessFiles = @(
  'docs/134_v5_7_local_batch_commit_readiness.md',
  'tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml'
)

$requiredV57LocalBatchCommitReadinessPatterns = @(
  'status:\s+completed_validated_project_local_v5_7_local_batch_commit_readiness',
  'version:\s+v5\.7',
  'validation_file:\s+scripts/validate_v5_local_batch_commit_readiness\.js',
  'base_head_short:\s+a2ae539',
  'expected_modified_count:\s+13',
  'expected_untracked_count:\s+9',
  'actual_modified_count:\s+null',
  'actual_untracked_count:\s+null',
  'unexpected_modified_count:\s+0',
  'unexpected_untracked_count:\s+0',
  'staged_changes_present:\s+false',
  'tracked_changes_allowed:\s+true',
  'untracked_changes_allowed:\s+true',
  'live_git_status_checked:\s+false',
  'live_git_status_validator:\s+scripts/validate_mvp\.ps1',
  'commit_authorized:\s+false',
  'push_authorized:\s+false',
  'tag_authorized:\s+false',
  'pr_authorized:\s+false',
  'release_authorized:\s+false',
  'remote_write_performed:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV57LocalBatchCommitReadinessPatterns = @(
  'unexpected_modified_count:\s+[1-9]',
  'unexpected_untracked_count:\s+[1-9]',
  'staged_changes_present:\s+true',
  'tracked_changes_allowed:\s+false',
  'untracked_changes_allowed:\s+false',
  'commit_authorized:\s+true',
  'push_authorized:\s+true',
  'tag_authorized:\s+true',
  'pr_authorized:\s+true',
  'release_authorized:\s+true',
  'remote_write_performed:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v57LocalBatchCommitReadinessFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.7 local batch commit-readiness file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV57LocalBatchCommitReadinessPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.7 local batch commit-readiness missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV57LocalBatchCommitReadinessPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.7 local batch commit-readiness boundary violation in ${path}: $pattern"
    }
  }
}

$v58HandoffFreshnessFiles = @(
  'docs/135_v5_8_handoff_freshness_validation.md',
  'tests/schema_examples/v5_8_handoff_freshness_validation.example.yaml'
)

$requiredV58HandoffFreshnessPatterns = @(
  'status:\s+completed_validated_project_local_v5_8_handoff_freshness',
  'version:\s+v5\.8',
  'validation_file:\s+scripts/validate_v5_handoff_freshness\.js',
  'current_phase:\s+"v5\.8 handoff freshness validation"',
  'agent_board_files_present:\s+true',
  'run_state_current:\s+true',
  'handoff_current:\s+true',
  'task_queue_current:\s+true',
  'checkpoint_current:\s+true',
  'validation_log_current:\s+true',
  'resume_prompt_present:\s+true',
  'hard_stop_gates_present:\s+true',
  'no_execution_boundary_present:\s+true',
  'remote_action_gate_present:\s+true',
  'external_read_gate_present:\s+true',
  'blocked_state_clear:\s+true',
  'commit_authorized:\s+false',
  'push_authorized:\s+false',
  'tag_authorized:\s+false',
  'pr_authorized:\s+false',
  'release_authorized:\s+false',
  'remote_write_performed:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV58HandoffFreshnessPatterns = @(
  'agent_board_files_present:\s+false',
  'run_state_current:\s+false',
  'handoff_current:\s+false',
  'task_queue_current:\s+false',
  'checkpoint_current:\s+false',
  'validation_log_current:\s+false',
  'resume_prompt_present:\s+false',
  'hard_stop_gates_present:\s+false',
  'no_execution_boundary_present:\s+false',
  'remote_action_gate_present:\s+false',
  'external_read_gate_present:\s+false',
  'blocked_state_clear:\s+false',
  'commit_authorized:\s+true',
  'push_authorized:\s+true',
  'tag_authorized:\s+true',
  'pr_authorized:\s+true',
  'release_authorized:\s+true',
  'remote_write_performed:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v58HandoffFreshnessFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.8 handoff freshness file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV58HandoffFreshnessPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.8 handoff freshness missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV58HandoffFreshnessPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.8 handoff freshness boundary violation in ${path}: $pattern"
    }
  }
}

$v59ExpandedV5IndexConsistencyFiles = @(
  'docs/136_v5_9_expanded_v5_index_consistency.md',
  'tests/schema_examples/v5_9_expanded_v5_index_consistency.example.yaml'
)

$requiredV59ExpandedV5IndexConsistencyPatterns = @(
  'status:\s+completed_validated_project_local_v5_9_expanded_v5_index_consistency',
  'version:\s+v5\.9',
  'validation_file:\s+scripts/validate_v5_index_consistency\.js',
  'v5_record_count:\s+10',
  'docs_present:\s+true',
  'schema_examples_present:\s+true',
  'validation_scripts_present:\s+true',
  'readme_index_current:\s+true',
  'manifest_index_current:\s+true',
  'release_notes_current:\s+true',
  'roadmap_current:\s+true',
  'checklist_current:\s+true',
  'validate_mvp_current:\s+true',
  'local_commit_scope_current:\s+true',
  'agent_board_current:\s+true',
  'commit_authorized:\s+false',
  'push_authorized:\s+false',
  'tag_authorized:\s+false',
  'pr_authorized:\s+false',
  'release_authorized:\s+false',
  'remote_write_performed:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV59ExpandedV5IndexConsistencyPatterns = @(
  'docs_present:\s+false',
  'schema_examples_present:\s+false',
  'validation_scripts_present:\s+false',
  'readme_index_current:\s+false',
  'manifest_index_current:\s+false',
  'release_notes_current:\s+false',
  'roadmap_current:\s+false',
  'checklist_current:\s+false',
  'validate_mvp_current:\s+false',
  'local_commit_scope_current:\s+false',
  'agent_board_current:\s+false',
  'commit_authorized:\s+true',
  'push_authorized:\s+true',
  'tag_authorized:\s+true',
  'pr_authorized:\s+true',
  'release_authorized:\s+true',
  'remote_write_performed:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v59ExpandedV5IndexConsistencyFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.9 expanded v5 index consistency file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV59ExpandedV5IndexConsistencyPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.9 expanded v5 index consistency missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV59ExpandedV5IndexConsistencyPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.9 expanded v5 index consistency boundary violation in ${path}: $pattern"
    }
  }
}

$v510LocalTrueLoopCandidateDeliveryFiles = @(
  'docs/137_v5_10_local_true_loop_candidate_delivery.md',
  'tests/schema_examples/v5_10_local_true_loop_candidate_delivery.example.yaml'
)

$requiredV510LocalTrueLoopCandidateDeliveryPatterns = @(
  'status:\s+completed_validated_project_local_v5_10_true_loop_candidate_delivery',
  'version:\s+v5\.10',
  'current_phase:\s+"v5\.10 local true-loop candidate delivery closeout"',
  'validation_file:\s+scripts/validate_v5_true_loop_candidate_delivery\.js',
  'local_head_short:\s+9ac4ca8',
  'pending_local_commit_count:\s+5',
  'true_loop_candidate_ready:\s+true',
  'local_delivery_complete:\s+true',
  'closeout_docs_ready:\s+true',
  'review_finding_fixed:\s+true',
  'handoff_freshness_current_phase_parsed:\s+true',
  'formal_release_published:\s+false',
  'commit_authorized:\s+false',
  'push_authorized:\s+false',
  'tag_authorized:\s+false',
  'pr_authorized:\s+false',
  'release_authorized:\s+false',
  'remote_write_performed:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV510LocalTrueLoopCandidateDeliveryPatterns = @(
  'true_loop_candidate_ready:\s+false',
  'local_delivery_complete:\s+false',
  'closeout_docs_ready:\s+false',
  'review_finding_fixed:\s+false',
  'handoff_freshness_current_phase_parsed:\s+false',
  'formal_release_published:\s+true',
  'commit_authorized:\s+true',
  'push_authorized:\s+true',
  'tag_authorized:\s+true',
  'pr_authorized:\s+true',
  'release_authorized:\s+true',
  'remote_write_performed:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v510LocalTrueLoopCandidateDeliveryFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.10 local true-loop candidate delivery file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV510LocalTrueLoopCandidateDeliveryPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.10 local true-loop candidate delivery missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV510LocalTrueLoopCandidateDeliveryPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.10 local true-loop candidate delivery boundary violation in ${path}: $pattern"
    }
  }
}

$v511PostMergeReconciliationFiles = @(
  'docs/138_v5_11_post_merge_reconciliation.md',
  'tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml'
)

$requiredV511PostMergeReconciliationPatterns = @(
  'status:\s+completed_validated_project_local_v5_11_post_merge_reconciliation',
  'version:\s+v5\.11',
  'current_phase:\s+"v5\.11 post-merge reconciliation"',
  'validation_file:\s+scripts/validate_v5_post_merge_reconciliation\.js',
  'pr_number:\s+2',
  'pr_merged:\s+true',
  'pr_merge_commit_short:\s+3e3405e',
  'pr_head_commit_short:\s+5ccf059',
  'tag_name:\s+v5\.10-local-delivery-agents-merge',
  'tag_pushed:\s+true',
  'local_master_synced:\s+true',
  'origin_master_short:\s+3e3405e',
  'local_head_short:\s+3e3405e',
  'master_origin_divergence:\s+"0 0"',
  'post_merge_reconciled:\s+true',
  'commit_authorized:\s+false',
  'push_authorized:\s+false',
  'tag_authorized:\s+false',
  'pr_authorized:\s+false',
  'release_authorized:\s+false',
  'remote_write_performed_in_this_batch:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV511PostMergeReconciliationPatterns = @(
  'pr_merged:\s+false',
  'tag_pushed:\s+false',
  'local_master_synced:\s+false',
  'post_merge_reconciled:\s+false',
  'commit_authorized:\s+true',
  'push_authorized:\s+true',
  'tag_authorized:\s+true',
  'pr_authorized:\s+true',
  'release_authorized:\s+true',
  'remote_write_performed_in_this_batch:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v511PostMergeReconciliationFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.11 post-merge reconciliation file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV511PostMergeReconciliationPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.11 post-merge reconciliation missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV511PostMergeReconciliationPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.11 post-merge reconciliation boundary violation in ${path}: $pattern"
    }
  }
}

$v512ReleaseCandidateReadinessFiles = @(
  'docs/139_v5_12_release_candidate_readiness.md',
  'tests/schema_examples/v5_12_release_candidate_readiness.example.yaml'
)

$requiredV512ReleaseCandidateReadinessPatterns = @(
  'status:\s+completed_validated_project_local_v5_12_release_candidate_readiness',
  'version:\s+v5\.12',
  'current_phase:\s+"v5\.12 release candidate readiness"',
  'validation_file:\s+scripts/validate_v5_12_release_candidate_readiness\.js',
  'release_candidate_ready:\s+true',
  'final_delivery_candidate_package_ready:\s+true',
  'true_loop_candidate_ready:\s+true',
  'formal_release_published:\s+false',
  'github_release_published_observed:\s+false',
  'pr_number:\s+3',
  'pr_merged:\s+true',
  'pr_merge_commit_short:\s+b3731bf',
  'pr_head_commit_short:\s+46bf42b',
  'tag_name:\s+v5\.11-post-merge-reconciliation',
  'tag_pushed:\s+true',
  'local_master_synced:\s+true',
  'origin_master_short:\s+b3731bf',
  'local_head_short:\s+b3731bf',
  'master_origin_divergence:\s+"0 0"',
  'generated_asset_accepted:\s+true',
  'acceptance_mode:\s+human_override',
  'prompt_compliance_perfect:\s+false',
  'accepted_asset_sha256:\s+b162fab50e6a5bf95b8f761441149ee27d498a3b136eafe6322f05c5499d06f0',
  'commit_authorized:\s+false',
  'push_authorized:\s+false',
  'tag_authorized:\s+false',
  'pr_authorized:\s+false',
  'merge_authorized:\s+false',
  'release_authorized:\s+false',
  'release_publish_authorized:\s+false',
  'package_release_authorized:\s+false',
  'remote_write_performed_in_this_batch:\s+false',
  'external_network_required:\s+false',
  'external_service_required:\s+false',
  'file_write_performed:\s+false',
  'real_vcpchat_source_read:\s+false',
  'real_vcpchat_modified:\s+false',
  'real_vcptoolbox_source_read:\s+false',
  'real_vcptoolbox_modified:\s+false',
  'real_manifest_read:\s+false',
  'api_called:\s+false',
  'vcp_plugin_called:\s+false',
  'daily_note_called:\s+false',
  'daily_note_direct_write_allowed:\s+false',
  'vcp_memory_written:\s+false',
  'image_file_created:\s+false',
  'image_binary_saved_to_git:\s+false',
  'image_binary_saved_to_memory:\s+false',
  'raw_plugin_output_saved:\s+false',
  'secret_value_saved:\s+false',
  'endpoint_raw_saved:\s+false',
  'runtime_log_saved:\s+false',
  'additional_real_generation_authorized:\s+false',
  'commit_tag_push_authorized:\s+false'
)

$forbiddenV512ReleaseCandidateReadinessPatterns = @(
  'release_candidate_ready:\s+false',
  'final_delivery_candidate_package_ready:\s+false',
  'true_loop_candidate_ready:\s+false',
  'formal_release_published:\s+true',
  'github_release_published_observed:\s+true',
  'pr_merged:\s+false',
  'tag_pushed:\s+false',
  'local_master_synced:\s+false',
  'generated_asset_accepted:\s+false',
  'commit_authorized:\s+true',
  'push_authorized:\s+true',
  'tag_authorized:\s+true',
  'pr_authorized:\s+true',
  'merge_authorized:\s+true',
  'release_authorized:\s+true',
  'release_publish_authorized:\s+true',
  'package_release_authorized:\s+true',
  'remote_write_performed_in_this_batch:\s+true',
  'external_network_required:\s+true',
  'external_service_required:\s+true',
  'file_write_performed:\s+true',
  'real_vcpchat_source_read:\s+true',
  'real_vcpchat_modified:\s+true',
  'real_vcptoolbox_source_read:\s+true',
  'real_vcptoolbox_modified:\s+true',
  'real_manifest_read:\s+true',
  'api_called:\s+true',
  'vcp_plugin_called:\s+true',
  'daily_note_called:\s+true',
  'daily_note_direct_write_allowed:\s+true',
  'vcp_memory_written:\s+true',
  'image_file_created:\s+true',
  'image_binary_saved_to_git:\s+true',
  'image_binary_saved_to_memory:\s+true',
  'raw_plugin_output_saved:\s+true',
  'secret_value_saved:\s+true',
  'endpoint_raw_saved:\s+true',
  'runtime_log_saved:\s+true',
  'additional_real_generation_authorized:\s+true',
  'commit_tag_push_authorized:\s+true',
  'https?://'
)

foreach ($path in $v512ReleaseCandidateReadinessFiles) {
  $fullPath = Join-Path $Root $path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Add-Failure "Missing v5.12 release candidate readiness file: $path"
    continue
  }

  $content = Get-Content -Raw -Encoding UTF8 $fullPath
  foreach ($pattern in $requiredV512ReleaseCandidateReadinessPatterns) {
    if ($content -notmatch $pattern) {
      Add-Failure "v5.12 release candidate readiness missing required field in ${path}: $pattern"
    }
  }
  foreach ($pattern in $forbiddenV512ReleaseCandidateReadinessPatterns) {
    if ($content -match $pattern) {
      Add-Failure "v5.12 release candidate readiness boundary violation in ${path}: $pattern"
    }
  }
}

function Invoke-NodeScriptWithFileArg {
  param(
    [string]$ScriptPath,
    [string]$FixturePath
  )
  $tempOut = [System.IO.Path]::GetTempFileName()
  try {
    $runner = @'
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const scriptPath = process.argv[2];
const fixturePath = process.argv[3];
const outPath = process.argv[4];
const child = spawnSync(process.execPath, [scriptPath, fixturePath], {
  encoding: "utf8",
});
fs.writeFileSync(outPath, child.stdout, "utf8");
if (child.stderr) process.stderr.write(child.stderr);
process.exit(child.status || 0);
'@
    $runner | & node - $ScriptPath $FixturePath $tempOut | Out-Null
    Get-Content -Path $tempOut -Raw -Encoding UTF8
  } finally {
    Remove-Item -Path $tempOut -ErrorAction SilentlyContinue
  }
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Add-Failure "Node.js is required to validate adapter_dry_run_lab"
} else {
  $prevOutputEncoding = [Console]::OutputEncoding
  [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
  & node --check (Join-Path $Root 'adapter_dry_run_lab/adapter_dry_run.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "adapter_dry_run_lab/adapter_dry_run.js failed node --check"
  }

  $acceptedOutput = Invoke-NodeScriptWithFileArg -ScriptPath (Join-Path $Root 'adapter_dry_run_lab/adapter_dry_run.js') -FixturePath (Join-Path $Root 'adapter_dry_run_lab/fixtures/accepted_request.json')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "adapter dry-run lab accepted fixture exited with failure"
  } else {
    $accepted = ($acceptedOutput -join "`n") | ConvertFrom-Json
    $response = $accepted.adapter_dry_run_response
    if ($response.status -ne 'accepted_draft') {
      Add-Failure "accepted fixture must return accepted_draft"
    }
    if ($response.dispatch_plan_draft.selected_plugin -ne $null) {
      Add-Failure "accepted fixture must keep selected_plugin null"
    }
    if ($response.dispatch_plan_draft.max_plugin_calls -ne 0) {
      Add-Failure "accepted fixture must keep max_plugin_calls 0"
    }
    if ($response.dispatch_plan_draft.execution_blocked -ne $true) {
      Add-Failure "accepted fixture must keep execution_blocked true"
    }
  }

  $rejectedOutput = Invoke-NodeScriptWithFileArg -ScriptPath (Join-Path $Root 'adapter_dry_run_lab/adapter_dry_run.js') -FixturePath (Join-Path $Root 'adapter_dry_run_lab/fixtures/rejected_request.json')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "adapter dry-run lab rejected fixture exited with failure"
  } else {
    $rejected = ($rejectedOutput -join "`n") | ConvertFrom-Json
    $response = $rejected.adapter_dry_run_response
    if ($response.status -ne 'rejected') {
      Add-Failure "rejected fixture must return rejected"
    }
    if ($response.selected_plugin -ne $null) {
      Add-Failure "rejected fixture must keep selected_plugin null"
    }
    if ($response.max_plugin_calls -ne 0) {
      Add-Failure "rejected fixture must keep max_plugin_calls 0"
    }
    if ($response.execution_blocked -ne $true) {
      Add-Failure "rejected fixture must keep execution_blocked true"
    }
  }

  & node --check (Join-Path $Root 'exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js failed node --check"
  }

  & node --check (Join-Path $Root 'review_console/runtime_prototype/runtime_guard.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "review_console/runtime_prototype/runtime_guard.js failed node --check"
  }

  & node --check (Join-Path $Root 'review_console/runtime_prototype/app.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "review_console/runtime_prototype/app.js failed node --check"
  }

  & node --check (Join-Path $Root 'review_console/runtime_prototype/host_bridge_mock.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "review_console/runtime_prototype/host_bridge_mock.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_runtime_guard_unit.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_runtime_guard_unit.js failed node --check"
  }

  $runtimeGuardUnitOutput = & node (Join-Path $Root 'scripts/validate_runtime_guard_unit.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "runtime guard unit validation exited with failure"
  } else {
    $runtimeGuardUnit = ($runtimeGuardUnitOutput -join "`n") | ConvertFrom-Json
    if ($runtimeGuardUnit.passed -ne $true) {
      Add-Failure "runtime guard unit validation must report passed true"
    }
    if ($runtimeGuardUnit.runtime_guard_unit.clean_guard_passed -ne $true) {
      Add-Failure "runtime guard unit validation must pass clean guard"
    }
    if ($runtimeGuardUnit.runtime_guard_unit.dirty_guard_rejected -ne $true) {
      Add-Failure "runtime guard unit validation must reject dirty guard"
    }
    if ($runtimeGuardUnit.runtime_guard_unit.extra_key_guard_rejected -ne $true) {
      Add-Failure "runtime guard unit validation must reject guard with extra keys"
    }
    if ($runtimeGuardUnit.runtime_guard_unit.clone_deep_copy_verified -ne $true) {
      Add-Failure "runtime guard unit validation must verify clone deep copy"
    }
    if ($runtimeGuardUnit.runtime_guard_unit.normalize_session_defaults_verified -ne $true) {
      Add-Failure "runtime guard unit validation must verify normalizeSession defaults"
    }
    if ($runtimeGuardUnit.runtime_guard_unit.accepted_without_approval_rejected -ne $true) {
      Add-Failure "runtime guard unit validation must reject accepted without approval"
    }
    if ($runtimeGuardUnit.runtime_guard_unit.memory_write_without_approval_rejected -ne $true) {
      Add-Failure "runtime guard unit validation must reject memory write without approval"
    }
    if ($runtimeGuardUnit.runtime_guard_unit.memory_write_with_approval_allowed_as_request -ne $true) {
      Add-Failure "runtime guard unit validation must allow approved memory write request"
    }
    if ($runtimeGuardUnit.runtime_guard_unit.dirty_audit_guard_rejected -ne $true) {
      Add-Failure "runtime guard unit validation must reject dirty audit guard"
    }
    if ($runtimeGuardUnit.runtime_guard_unit.missing_required_section_rejected -ne $true) {
      Add-Failure "runtime guard unit validation must reject missing required section"
    }
  }

  & node --check (Join-Path $Root 'scripts/validate_runtime_prototype_smoke.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_runtime_prototype_smoke.js failed node --check"
  }

  $runtimeSmokeOutput = & node (Join-Path $Root 'scripts/validate_runtime_prototype_smoke.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "runtime prototype smoke test exited with failure"
  } else {
    $runtimeSmoke = ($runtimeSmokeOutput -join "`n") | ConvertFrom-Json
    if ($runtimeSmoke.passed -ne $true) {
      Add-Failure "runtime prototype smoke test must report passed true"
    }
    if ($runtimeSmoke.initial.asset_status -ne 'candidate') {
      Add-Failure "runtime prototype smoke test initial asset_status must be candidate"
    }
    if ($runtimeSmoke.initial.memory_write_mode -ne 'draft') {
      Add-Failure "runtime prototype smoke test initial memory_write_mode must be draft"
    }
    if ($runtimeSmoke.approved.asset_status -ne 'accepted') {
      Add-Failure "runtime prototype smoke test approved asset_status must be accepted"
    }
    if ($runtimeSmoke.approved.memory_write_mode -ne 'confirmed') {
      Add-Failure "runtime prototype smoke test approved memory_write_mode must be confirmed"
    }
    if ($runtimeSmoke.approved.should_write_to_vcp -ne $true) {
      Add-Failure "runtime prototype smoke test approved should_write_to_vcp must be true"
    }
    if ($runtimeSmoke.rejection_checks.dirty_guard_rejected -ne $true) {
      Add-Failure "runtime prototype smoke test must reject dirty guard"
    }
    if ($runtimeSmoke.rejection_checks.dirty_audit_guard_rejected -ne $true) {
      Add-Failure "runtime prototype smoke test must reject dirty audit guard"
    }
    if ($runtimeSmoke.rejection_checks.accepted_without_approval_rejected -ne $true) {
      Add-Failure "runtime prototype smoke test must reject accepted asset without approval"
    }
    if ($runtimeSmoke.runtime_contract.script_order_verified -ne $true) {
      Add-Failure "runtime prototype smoke test must verify index.html script order"
    }
    if ($runtimeSmoke.runtime_contract.runtime_guard_api_verified -ne $true) {
      Add-Failure "runtime prototype smoke test must verify runtime guard API"
    }
    if ($runtimeSmoke.prototype_guard_clean -ne $true) {
      Add-Failure "runtime prototype smoke test final guard must remain clean"
    }
  }

  & node --check (Join-Path $Root 'scripts/validate_runtime_prototype_suite.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_runtime_prototype_suite.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_runtime_delivery_surface.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_runtime_delivery_surface.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_adapter_delivery_surface.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_adapter_delivery_surface.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_console_adapter_handoff.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_console_adapter_handoff.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_console_blocker_arbiter_regression_matrix.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_console_blocker_arbiter_regression_matrix.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_report_negative_guard_regression_matrix.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_report_negative_guard_regression_matrix.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_report_route_summary.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_report_route_summary.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_report_admission_control_matrix.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_report_admission_control_matrix.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_report_production_exclusion_register.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_report_production_exclusion_register.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_report_memory_admission_register.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_report_memory_admission_register.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_report_memory_delta_draft_register.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_report_memory_delta_draft_register.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_report_protocol_final_closeout.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_report_protocol_final_closeout.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_blocker_arbiter_route_summary.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_blocker_arbiter_route_summary.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_memory_admission_control.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_memory_admission_control.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_production_admission_control.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_production_admission_control.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_admission_control_matrix.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_admission_control_matrix.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_report_contract.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_report_contract.js failed node --check"
  }

  & node --check (Join-Path $Root 'kernel/review_report_contract.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "kernel/review_report_contract.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_console_blocker_arbiter_boundary_scan.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_console_blocker_arbiter_boundary_scan.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v5_local_sync_readiness.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v5_local_sync_readiness.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v5_post_commit_reconciliation.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v5_post_commit_reconciliation.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v5_index_consistency.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v5_index_consistency.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v5_local_batch_commit_readiness.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v5_local_batch_commit_readiness.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v5_handoff_freshness.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v5_handoff_freshness.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v5_true_loop_candidate_delivery.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v5_true_loop_candidate_delivery.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v5_post_merge_reconciliation.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v5_post_merge_reconciliation.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v5_12_release_candidate_readiness.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v5_12_release_candidate_readiness.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v7_40_local_a4_a5_autonomy_alignment.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v7_40_local_a4_a5_autonomy_alignment.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v7_41_external_remote_debug_verification_script_creation_record.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v7_41_external_remote_debug_verification_script_creation_record.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v7_42_external_remote_debug_verification_script_creation_authorization_package.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v7_42_external_remote_debug_verification_script_creation_authorization_package.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v7_43_external_remote_debug_verification_script_creation_execution_record.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v7_43_external_remote_debug_verification_script_creation_execution_record.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v7_44_remote_debug_script_run_and_vcpchat_launch_record.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v7_44_remote_debug_script_run_and_vcpchat_launch_record.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v7_45_cdp_read_only_attempt_record.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v7_45_cdp_read_only_attempt_record.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v7_46_remote_debug_relaunch_runtime_verification_record.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v7_46_remote_debug_relaunch_runtime_verification_record.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_agent_board_state.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_agent_board_state.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_visual_eval_seed_record_schema.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_visual_eval_seed_record_schema.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_visual_eval_seed_registry_schema.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_visual_eval_seed_registry_schema.js failed node --check"
  }

  & node --check (Join-Path $Root 'kernel/pvos_kernel.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "kernel/pvos_kernel.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_pvos_kernel_minimal.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_pvos_kernel_minimal.js failed node --check"
  }

  & node --check (Join-Path $Root 'adapters/pvos_kernel_dry_run_adapter.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "adapters/pvos_kernel_dry_run_adapter.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_pvos_kernel_dry_run_adapter.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_pvos_kernel_dry_run_adapter.js failed node --check"
  }

  & node --check (Join-Path $Root 'kernel/pvos_evidence_collector_blocker_pipeline.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "kernel/pvos_evidence_collector_blocker_pipeline.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_pvos_evidence_collector_blocker_pipeline.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_pvos_evidence_collector_blocker_pipeline.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v14_081_pvos_exact_a5_authorization_package.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v14_081_pvos_exact_a5_authorization_package.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v14_082_pvos_metadata_only_preflight_authorization_correction.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v14_082_pvos_metadata_only_preflight_authorization_correction.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_codex_session_image_import.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_codex_session_image_import.js failed node --check"
  }

  & node --check (Join-Path $Root 'kernel/review_result_protocol.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "kernel/review_result_protocol.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_result_protocol.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_result_protocol.js failed node --check"
  }

  & node --check (Join-Path $Root 'kernel/review_decision_package.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "kernel/review_decision_package.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_decision_package.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_decision_package.js failed node --check"
  }

  & node --check (Join-Path $Root 'kernel/evidence_blocker_contract.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "kernel/evidence_blocker_contract.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_evidence_blocker_contract.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_evidence_blocker_contract.js failed node --check"
  }

  & node --check (Join-Path $Root 'kernel/review_blocker_arbiter.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "kernel/review_blocker_arbiter.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_review_blocker_arbiter.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_review_blocker_arbiter.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_local_checkpoint_manifest.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_local_checkpoint_manifest.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_local_commit_scope.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_local_commit_scope.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_post_push_state.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_post_push_state.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v4_index_consistency.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v4_index_consistency.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_local_tag_push_readiness.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_local_tag_push_readiness.js failed node --check"
  }

  & node --check (Join-Path $Root 'scripts/validate_v5_delivery_readiness.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "scripts/validate_v5_delivery_readiness.js failed node --check"
  }

  $agentBoardStateOutput = & node (Join-Path $Root 'scripts/validate_agent_board_state.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "agent board state validation exited with failure"
  } else {
    $agentBoardState = ($agentBoardStateOutput -join "`n") | ConvertFrom-Json
    if ($agentBoardState.passed -ne $true) {
      Add-Failure "agent board state validation must report passed true"
    }
    if ($agentBoardState.agent_board_state.required_files_present -ne $true) {
      Add-Failure "agent board state validation must verify required files"
    }
    if ($agentBoardState.agent_board_state.no_external_read_gate_declared -ne $true) {
      Add-Failure "agent board state validation must verify external-read gates"
    }
    if ($agentBoardState.agent_board_state.real_execution_gate_declared -ne $true) {
      Add-Failure "agent board state validation must verify real-execution gates"
    }
    if ($agentBoardState.agent_board_state.remote_action_gate_declared -ne $true) {
      Add-Failure "agent board state validation must verify remote-action gates"
    }
    if ($agentBoardState.agent_board_state.a5_gate_declared -ne $true) {
      Add-Failure "agent board state validation must verify A5 production-execution gate"
    }
    if ($agentBoardState.agent_board_state.validation_snapshot_present -ne $true) {
      Add-Failure "agent board state validation must verify validation snapshot"
    }
    if ($agentBoardState.agent_board_state.handoff_resume_prompt_present -ne $true) {
      Add-Failure "agent board state validation must verify handoff resume prompt"
    }
    if ($agentBoardState.agent_board_state.file_write_performed -ne $false) {
      Add-Failure "agent board state validation must not write files"
    }
  }

  $visualEvalSeedRecordOutput = & node (Join-Path $Root 'scripts/validate_visual_eval_seed_record_schema.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "visual eval seed record schema validation exited with failure"
  } else {
    $visualEvalSeedRecord = ($visualEvalSeedRecordOutput -join "`n") | ConvertFrom-Json
    if ($visualEvalSeedRecord.passed -ne $true) {
      Add-Failure "visual eval seed record schema validation must report passed true"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.schema_file_present -ne $true) {
      Add-Failure "visual eval seed record schema validation must verify schema file"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.example_file_present -ne $true) {
      Add-Failure "visual eval seed record schema validation must verify example file"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.accepted_example_present -ne $true) {
      Add-Failure "visual eval seed record schema validation must verify accepted example file"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.rejected_example_present -ne $true) {
      Add-Failure "visual eval seed record schema validation must verify rejected example file"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.metadata_only_verified -ne $true) {
      Add-Failure "visual eval seed record schema validation must verify metadata-only boundary"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.external_network_required -ne $false) {
      Add-Failure "visual eval seed record schema validation must not require external network"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.provider_contact_performed -ne $false) {
      Add-Failure "visual eval seed record schema validation must not perform provider contact"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.plugin_call_performed -ne $false) {
      Add-Failure "visual eval seed record schema validation must not call plugins"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.image_generation_performed -ne $false) {
      Add-Failure "visual eval seed record schema validation must not generate images"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.memory_write_performed -ne $false) {
      Add-Failure "visual eval seed record schema validation must not write memory"
    }
    if ($visualEvalSeedRecord.visual_eval_seed_record_schema.file_write_performed -ne $false) {
      Add-Failure "visual eval seed record schema validation must not write files"
    }
  }

  $visualEvalSeedRegistryOutput = & node (Join-Path $Root 'scripts/validate_visual_eval_seed_registry_schema.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "visual eval seed registry schema validation exited with failure"
  } else {
    $visualEvalSeedRegistry = ($visualEvalSeedRegistryOutput -join "`n") | ConvertFrom-Json
    if ($visualEvalSeedRegistry.passed -ne $true) {
      Add-Failure "visual eval seed registry schema validation must report passed true"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.schema_file_present -ne $true) {
      Add-Failure "visual eval seed registry schema validation must verify schema file"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.example_file_present -ne $true) {
      Add-Failure "visual eval seed registry schema validation must verify registry example file"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.accepted_seed_fixture_present -ne $true) {
      Add-Failure "visual eval seed registry schema validation must verify accepted seed fixture"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.rejected_seed_fixture_present -ne $true) {
      Add-Failure "visual eval seed registry schema validation must verify rejected seed fixture"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.fixture_refs_verified -ne $true) {
      Add-Failure "visual eval seed registry schema validation must verify fixture refs"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.seed_id_cross_references_verified -ne $true) {
      Add-Failure "visual eval seed registry schema validation must verify seed id cross references"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.metadata_only_verified -ne $true) {
      Add-Failure "visual eval seed registry schema validation must verify metadata-only boundary"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.external_network_required -ne $false) {
      Add-Failure "visual eval seed registry schema validation must not require external network"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.provider_contact_performed -ne $false) {
      Add-Failure "visual eval seed registry schema validation must not perform provider contact"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.plugin_call_performed -ne $false) {
      Add-Failure "visual eval seed registry schema validation must not call plugins"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.image_generation_performed -ne $false) {
      Add-Failure "visual eval seed registry schema validation must not generate images"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.memory_write_performed -ne $false) {
      Add-Failure "visual eval seed registry schema validation must not write memory"
    }
    if ($visualEvalSeedRegistry.visual_eval_seed_registry_schema.file_write_performed -ne $false) {
      Add-Failure "visual eval seed registry schema validation must not write files"
    }
  }

  $pvosKernelOutput = & node (Join-Path $Root 'scripts/validate_pvos_kernel_minimal.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "PVOS kernel minimal validation exited with failure"
  } else {
    $pvosKernel = ($pvosKernelOutput -join "`n") | ConvertFrom-Json
    if ($pvosKernel.passed -ne $true) {
      Add-Failure "PVOS kernel minimal validation must report passed true"
    }
    if ($pvosKernel.pvos_kernel.kernel_cli_present -ne $true) {
      Add-Failure "PVOS kernel validation must verify kernel CLI"
    }
    if ($pvosKernel.pvos_kernel.schema_present -ne $true) {
      Add-Failure "PVOS kernel validation must verify schema"
    }
    if ($pvosKernel.pvos_kernel.input_fixture_present -ne $true) {
      Add-Failure "PVOS kernel validation must verify input fixture"
    }
    if ($pvosKernel.pvos_kernel.output_example_present -ne $true) {
      Add-Failure "PVOS kernel validation must verify output example"
    }
    if ($pvosKernel.pvos_kernel.stdout_only -ne $true) {
      Add-Failure "PVOS kernel validation must verify stdout-only boundary"
    }
    if ($pvosKernel.pvos_kernel.external_network_required -ne $false) {
      Add-Failure "PVOS kernel validation must not require external network"
    }
    if ($pvosKernel.pvos_kernel.provider_contact_performed -ne $false) {
      Add-Failure "PVOS kernel validation must not perform provider contact"
    }
    if ($pvosKernel.pvos_kernel.plugin_call_performed -ne $false) {
      Add-Failure "PVOS kernel validation must not call plugins"
    }
    if ($pvosKernel.pvos_kernel.api_call_performed -ne $false) {
      Add-Failure "PVOS kernel validation must not call APIs"
    }
    if ($pvosKernel.pvos_kernel.image_generation_performed -ne $false) {
      Add-Failure "PVOS kernel validation must not generate images"
    }
    if ($pvosKernel.pvos_kernel.daily_note_write_performed -ne $false) {
      Add-Failure "PVOS kernel validation must not write DailyNote"
    }
    if ($pvosKernel.pvos_kernel.vcp_memory_write_performed -ne $false) {
      Add-Failure "PVOS kernel validation must not write VCP memory"
    }
    if ($pvosKernel.pvos_kernel.disk_write_performed -ne $false) {
      Add-Failure "PVOS kernel validation must not write output files"
    }
  }

  $pvosAdapterOutput = & node (Join-Path $Root 'scripts/validate_pvos_kernel_dry_run_adapter.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "PVOS kernel dry-run adapter validation exited with failure"
  } else {
    $pvosAdapter = ($pvosAdapterOutput -join "`n") | ConvertFrom-Json
    if ($pvosAdapter.passed -ne $true) {
      Add-Failure "PVOS kernel dry-run adapter validation must report passed true"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.adapter_cli_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify adapter CLI"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.schema_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify schema"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.example_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify example"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_adapter_example_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard adapter example"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_evidence_blocker_example_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard evidence blocker example"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.kernel_dependency_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify kernel dependency"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_report_kernel_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify review report kernel"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_result_protocol_binding_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify review result protocol binding"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_console_protocol_handoff_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify Review Console protocol handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_decision_package_binding_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify review decision package binding"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_decision_package_handoff_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify review decision package handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_console_decision_package_handoff_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify Review Console decision package handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.evidence_blocker_contract_binding_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify evidence blocker contract binding"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.evidence_blocker_contract_handoff_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify evidence blocker contract handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_console_evidence_blocker_contract_handoff_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify Review Console evidence blocker contract handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_blocker_arbiter_binding_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify review blocker arbiter binding"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_blocker_arbiter_handoff_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify review blocker arbiter handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_console_blocker_arbiter_handoff_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify Review Console blocker arbiter handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_report_contract_binding_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify review report contract binding"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_report_handoff_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify review report handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_console_review_report_handoff_present -ne $true) {
      Add-Failure "PVOS adapter validation must verify Review Console review report handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.evidence_blocker_contract_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify evidence blocker contract"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.evidence_blocker_pass_candidate_human_review_blocked_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify pass candidate remains blocked until human review"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.evidence_blocker_reject_candidate_never_production_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify reject candidate is never_production"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_blocker_arbiter_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify review blocker arbiter"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_blocker_arbiter_pass_candidate_human_review_blocked_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify arbiter blocks pass candidate until human review"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_blocker_arbiter_reject_candidate_never_production_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify arbiter keeps reject candidate never_production"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_report_contract_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify review report contract"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_report_pass_candidate_explained_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify review report explains pass candidate"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_report_reject_candidate_explained_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify review report explains reject candidate"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_report_memory_entry_blocked_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify review report blocks memory entry"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_report_production_blocked_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify review report blocks production"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.review_report_never_production_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify review report never-production route"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.never_production_contract_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify never-production contract"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_adapter_handoff_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard adapter handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_review_console_handoff_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard Review Console handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_decision_package_handoff_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard decision package handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_memory_forbidden_package_binding_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard memory-forbidden package binding"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_production_exclusion_register_binding_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard production exclusion register binding"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_evidence_blocker_contract_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard evidence blocker contract"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_evidence_blocker_contract_handoff_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard evidence blocker contract handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_review_console_evidence_blocker_contract_handoff_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard Review Console evidence blocker contract handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_review_blocker_arbiter_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard review blocker arbiter"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_review_blocker_arbiter_handoff_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard review blocker arbiter handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_review_console_blocker_arbiter_handoff_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard Review Console blocker arbiter handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_review_report_contract_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard review report contract"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_review_report_handoff_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard review report handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_review_console_review_report_handoff_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard Review Console review report handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_review_report_memory_forbidden_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard review report memory-forbidden route"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_arbiter_memory_forbidden_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard arbiter memory-forbidden route"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_arbiter_all_rejected_never_production_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard arbiter keeps all rejected candidates never_production"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_adapter_example_matches_cli_output -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard adapter example matches CLI output"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_adapter_embeds_evidence_blocker_fixture -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard adapter embeds evidence blocker fixture"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_adapter_memory_forbidden_handoff_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard adapter memory-forbidden handoff"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_adapter_unknown_candidate_never_production_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard adapter unknown candidate remains never_production"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_memory_forbidden_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard forbidden memory route"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_all_rejected_never_production_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify all negative guard candidates are never_production"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_no_production_candidate_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard production candidate creation is false"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.negative_guard_no_direct_memory_write_verified -ne $true) {
      Add-Failure "PVOS adapter validation must verify negative guard direct memory write is false"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.stdout_only -ne $true) {
      Add-Failure "PVOS adapter validation must verify stdout-only boundary"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.external_network_required -ne $false) {
      Add-Failure "PVOS adapter validation must not require external network"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.provider_contact_performed -ne $false) {
      Add-Failure "PVOS adapter validation must not perform provider contact"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.plugin_call_performed -ne $false) {
      Add-Failure "PVOS adapter validation must not call plugins"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.api_call_performed -ne $false) {
      Add-Failure "PVOS adapter validation must not call APIs"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.image_generation_performed -ne $false) {
      Add-Failure "PVOS adapter validation must not generate images"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.daily_note_write_performed -ne $false) {
      Add-Failure "PVOS adapter validation must not write DailyNote"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.vcp_memory_write_performed -ne $false) {
      Add-Failure "PVOS adapter validation must not write VCP memory"
    }
    if ($pvosAdapter.pvos_kernel_dry_run_adapter.output_file_write_performed -ne $false) {
      Add-Failure "PVOS adapter validation must not write output files"
    }
  }

  $pvosEvidencePipelineOutput = & node (Join-Path $Root 'scripts/validate_pvos_evidence_collector_blocker_pipeline.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "PVOS evidence collector blocker pipeline validation exited with failure"
  } else {
    $pvosEvidencePipeline = ($pvosEvidencePipelineOutput -join "`n") | ConvertFrom-Json
    if ($pvosEvidencePipeline.passed -ne $true) {
      Add-Failure "PVOS evidence collector blocker pipeline validation must report passed true"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.pipeline_cli_present -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify pipeline CLI"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.schema_present -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify schema"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.example_present -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify example fixture"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.approved_fixture_allowlist_verified -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify approved fixture allowlist"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.evidence_records_verified -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify EvidenceRecord output"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.blocker_decisions_verified -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify BlockerDecision output"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.review_report_verified -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify ReviewReport output"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.memory_delta_drafts_verified -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify memory_delta drafts"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.production_exclusion_drafts_verified -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify production exclusion drafts"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.review_console_handoff_verified -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify Review Console handoff"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.negative_guard_memory_forbidden_verified -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify negative guard memory-forbidden route"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.negative_guard_never_production_verified -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify negative guard never-production route"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.stdout_only -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify stdout-only boundary"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.local_only -ne $true) {
      Add-Failure "PVOS evidence pipeline validation must verify local-only boundary"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.external_network_required -ne $false) {
      Add-Failure "PVOS evidence pipeline validation must not require external network"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.provider_contact_performed -ne $false) {
      Add-Failure "PVOS evidence pipeline validation must not perform provider contact"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.plugin_call_performed -ne $false) {
      Add-Failure "PVOS evidence pipeline validation must not call plugins"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.api_call_performed -ne $false) {
      Add-Failure "PVOS evidence pipeline validation must not call APIs"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.image_generation_performed -ne $false) {
      Add-Failure "PVOS evidence pipeline validation must not generate images"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.daily_note_write_performed -ne $false) {
      Add-Failure "PVOS evidence pipeline validation must not write DailyNote"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.vcp_memory_write_performed -ne $false) {
      Add-Failure "PVOS evidence pipeline validation must not write VCP memory"
    }
    if ($pvosEvidencePipeline.pvos_evidence_collector_blocker_pipeline.output_file_write_performed -ne $false) {
      Add-Failure "PVOS evidence pipeline validation must not write output files"
    }
  }

  $v14081ExactA5Output = & node (Join-Path $Root 'scripts/validate_v14_081_pvos_exact_a5_authorization_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v14.081 exact A5 authorization package validation exited with failure"
  } else {
    $v14081ExactA5 = ($v14081ExactA5Output -join "`n") | ConvertFrom-Json
    if ($v14081ExactA5.passed -ne $true) {
      Add-Failure "v14.081 exact A5 authorization package validation must report passed true"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.authorization_package_id -ne 'AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001') {
      Add-Failure "v14.081 exact A5 authorization package must keep package id stable"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.authorization_status -ne 'pending_human_preflight_approval') {
      Add-Failure "v14.081 exact A5 authorization package must remain pending human preflight approval"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.active -ne $false) {
      Add-Failure "v14.081 exact A5 authorization package must not be active"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.execute_now -ne $false) {
      Add-Failure "v14.081 exact A5 authorization package must not execute now"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.selected_plugin_id -ne 'NativeDoubaoImage') {
      Add-Failure "v14.081 exact A5 authorization package must select NativeDoubaoImage"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.selected_plugin_model -ne 'doubao-seedream-5-0-260128') {
      Add-Failure "v14.081 exact A5 authorization package must lock doubao-seedream-5-0-260128"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.max_plugin_calls -ne 1) {
      Add-Failure "v14.081 exact A5 authorization package must limit max_plugin_calls to 1"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.max_images_created -ne 1) {
      Add-Failure "v14.081 exact A5 authorization package must limit max_images_created to 1"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.retry_limit -ne 0) {
      Add-Failure "v14.081 exact A5 authorization package must keep retry_limit 0"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.output_directory_state_compatible -ne $true) {
      Add-Failure "v14.081 exact A5 authorization package output directory must be absent, empty, or contain only the known authorized post-run output"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.external_network_required -ne $false) {
      Add-Failure "v14.081 exact A5 package validation must not require external network"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.provider_contact_performed -ne $false) {
      Add-Failure "v14.081 exact A5 package validation must not perform provider contact"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.plugin_call_performed -ne $false) {
      Add-Failure "v14.081 exact A5 package validation must not call plugins"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.api_call_performed -ne $false) {
      Add-Failure "v14.081 exact A5 package validation must not call APIs"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.image_generation_performed -ne $false) {
      Add-Failure "v14.081 exact A5 package validation must not generate images"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.env_value_read_performed -ne $false) {
      Add-Failure "v14.081 exact A5 package validation must not read env secret values"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.daily_note_write_performed -ne $false) {
      Add-Failure "v14.081 exact A5 package validation must not write DailyNote"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.081 exact A5 package validation must not write VCP memory"
    }
    if ($v14081ExactA5.v14_081_pvos_exact_a5_authorization_package.file_write_performed -ne $false) {
      Add-Failure "v14.081 exact A5 package validation must not write files"
    }
  }

  $v14082MetadataPreflightOutput = & node (Join-Path $Root 'scripts/validate_v14_082_pvos_metadata_only_preflight_authorization_correction.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v14.082 metadata-only preflight authorization correction validation exited with failure"
  } else {
    $v14082MetadataPreflight = ($v14082MetadataPreflightOutput -join "`n") | ConvertFrom-Json
    if ($v14082MetadataPreflight.passed -ne $true) {
      Add-Failure "v14.082 metadata-only preflight authorization correction validation must report passed true"
    }
    if ($v14082MetadataPreflight.v14_082_pvos_metadata_only_preflight_authorization_correction.authorization_package_id -ne 'AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001') {
      Add-Failure "v14.082 metadata-only preflight correction must keep package id stable"
    }
    if ($v14082MetadataPreflight.v14_082_pvos_metadata_only_preflight_authorization_correction.env_local_metadata_only_allowed -ne $true) {
      Add-Failure "v14.082 must allow .env.local metadata-only preflight"
    }
    if ($v14082MetadataPreflight.v14_082_pvos_metadata_only_preflight_authorization_correction.env_value_read_allowed -ne $false) {
      Add-Failure "v14.082 must not allow env value reads"
    }
    if ($v14082MetadataPreflight.v14_082_pvos_metadata_only_preflight_authorization_correction.provider_contact_allowed -ne $false) {
      Add-Failure "v14.082 must not allow provider contact"
    }
    if ($v14082MetadataPreflight.v14_082_pvos_metadata_only_preflight_authorization_correction.plugin_call_allowed -ne $false) {
      Add-Failure "v14.082 must not allow plugin calls"
    }
    if ($v14082MetadataPreflight.v14_082_pvos_metadata_only_preflight_authorization_correction.api_call_allowed -ne $false) {
      Add-Failure "v14.082 must not allow API calls"
    }
    if ($v14082MetadataPreflight.v14_082_pvos_metadata_only_preflight_authorization_correction.image_generation_allowed -ne $false) {
      Add-Failure "v14.082 must not allow image generation"
    }
    if ($v14082MetadataPreflight.v14_082_pvos_metadata_only_preflight_authorization_correction.output_directory_creation_allowed -ne $false) {
      Add-Failure "v14.082 must not allow output directory creation"
    }
    if ($v14082MetadataPreflight.v14_082_pvos_metadata_only_preflight_authorization_correction.output_write_allowed -ne $false) {
      Add-Failure "v14.082 must not allow output writes"
    }
    if ($v14082MetadataPreflight.v14_082_pvos_metadata_only_preflight_authorization_correction.file_write_performed -ne $false) {
      Add-Failure "v14.082 validator must not write files"
    }
  }

  $codexSessionImageImportOutput = & node (Join-Path $Root 'scripts/validate_codex_session_image_import.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Codex session image import validation exited with failure"
  } else {
    $codexSessionImageImport = ($codexSessionImageImportOutput -join "`n") | ConvertFrom-Json
    if ($codexSessionImageImport.passed -ne $true) {
      Add-Failure "Codex session image import validation must report passed true"
    }
    if ($codexSessionImageImport.codex_session_image_import.manual_import_only -ne $true) {
      Add-Failure "Codex session image import must stay manual import only"
    }
    if ($codexSessionImageImport.codex_session_image_import.codex_image_direct_call_allowed -ne $false) {
      Add-Failure "Codex session image import must not allow direct Codex image calls"
    }
    if ($codexSessionImageImport.codex_session_image_import.mcp_runtime_allowed -ne $false) {
      Add-Failure "Codex session image import must not allow MCP runtime"
    }
    if ($codexSessionImageImport.codex_session_image_import.provider_api_call_allowed -ne $false) {
      Add-Failure "Codex session image import must not allow provider API calls"
    }
    if ($codexSessionImageImport.codex_session_image_import.image_generation_by_script -ne $false) {
      Add-Failure "Codex session image import must not allow image generation by project script"
    }
    if ($codexSessionImageImport.codex_session_image_import.daily_note_write_allowed -ne $false) {
      Add-Failure "Codex session image import must not allow DailyNote writes"
    }
    if ($codexSessionImageImport.codex_session_image_import.vcp_memory_write_allowed -ne $false) {
      Add-Failure "Codex session image import must not allow VCP memory writes"
    }
    if ($codexSessionImageImport.codex_session_image_import.accepted_samples_write_allowed -ne $false) {
      Add-Failure "Codex session image import must not allow accepted_samples writes"
    }
    if ($codexSessionImageImport.codex_session_image_import.production_candidate_write_allowed -ne $false) {
      Add-Failure "Codex session image import must not allow production candidate writes"
    }
    if ($codexSessionImageImport.codex_session_image_import.file_write_performed -ne $false) {
      Add-Failure "Codex session image import validator must not write files"
    }
  }

  $reviewResultProtocolOutput = & node (Join-Path $Root 'scripts/validate_review_result_protocol.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review result protocol validation exited with failure"
  } else {
    $reviewResultProtocol = ($reviewResultProtocolOutput -join "`n") | ConvertFrom-Json
    if ($reviewResultProtocol.passed -ne $true) {
      Add-Failure "Review result protocol validation must report passed true"
    }
    if ($reviewResultProtocol.review_result_protocol.protocol_cli_present -ne $true) {
      Add-Failure "Review result protocol validation must verify protocol CLI"
    }
    if ($reviewResultProtocol.review_result_protocol.schema_present -ne $true) {
      Add-Failure "Review result protocol validation must verify schema"
    }
    if ($reviewResultProtocol.review_result_protocol.input_fixture_present -ne $true) {
      Add-Failure "Review result protocol validation must verify input fixture"
    }
    if ($reviewResultProtocol.review_result_protocol.report_example_present -ne $true) {
      Add-Failure "Review result protocol validation must verify report example"
    }
    if ($reviewResultProtocol.review_result_protocol.stdout_only -ne $true) {
      Add-Failure "Review result protocol validation must verify stdout-only boundary"
    }
    if ($reviewResultProtocol.review_result_protocol.pass_reason_contract_verified -ne $true) {
      Add-Failure "Review result protocol validation must verify pass reasons"
    }
    if ($reviewResultProtocol.review_result_protocol.reject_reason_contract_verified -ne $true) {
      Add-Failure "Review result protocol validation must verify reject reasons"
    }
    if ($reviewResultProtocol.review_result_protocol.memory_route_contract_verified -ne $true) {
      Add-Failure "Review result protocol validation must verify memory routes"
    }
    if ($reviewResultProtocol.review_result_protocol.never_production_contract_verified -ne $true) {
      Add-Failure "Review result protocol validation must verify never-production route"
    }
    if ($reviewResultProtocol.review_result_protocol.negative_guard_input_fixture_present -ne $true) {
      Add-Failure "Review result protocol validation must verify negative guard input fixture"
    }
    if ($reviewResultProtocol.review_result_protocol.negative_guard_kernel_fixture_present -ne $true) {
      Add-Failure "Review result protocol validation must verify negative guard kernel fixture"
    }
    if ($reviewResultProtocol.review_result_protocol.negative_guard_cli_verified -ne $true) {
      Add-Failure "Review result protocol validation must verify negative guard CLI"
    }
    if ($reviewResultProtocol.review_result_protocol.negative_guard_all_rejected_never_production_verified -ne $true) {
      Add-Failure "Review result protocol validation must verify all negative guard candidates are never_production"
    }
    if ($reviewResultProtocol.review_result_protocol.negative_guard_forbidden_memory_route_verified -ne $true) {
      Add-Failure "Review result protocol validation must verify forbidden memory route for unmapped failure"
    }
    if ($reviewResultProtocol.review_result_protocol.negative_guard_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review result protocol validation must verify negative guard direct memory write is false"
    }
    if ($reviewResultProtocol.review_result_protocol.negative_guard_no_production_candidate_verified -ne $true) {
      Add-Failure "Review result protocol validation must verify negative guard production candidate creation is false"
    }
    if ($reviewResultProtocol.review_result_protocol.provider_contact_performed -ne $false) {
      Add-Failure "Review result protocol validation must not perform provider contact"
    }
    if ($reviewResultProtocol.review_result_protocol.plugin_call_performed -ne $false) {
      Add-Failure "Review result protocol validation must not call plugins"
    }
    if ($reviewResultProtocol.review_result_protocol.api_call_performed -ne $false) {
      Add-Failure "Review result protocol validation must not call APIs"
    }
    if ($reviewResultProtocol.review_result_protocol.image_generation_performed -ne $false) {
      Add-Failure "Review result protocol validation must not generate images"
    }
    if ($reviewResultProtocol.review_result_protocol.daily_note_write_performed -ne $false) {
      Add-Failure "Review result protocol validation must not write DailyNote"
    }
    if ($reviewResultProtocol.review_result_protocol.vcp_memory_write_performed -ne $false) {
      Add-Failure "Review result protocol validation must not write VCP memory"
    }
    if ($reviewResultProtocol.review_result_protocol.output_file_write_performed -ne $false) {
      Add-Failure "Review result protocol validation must not write output files"
    }
    if ($reviewResultProtocol.review_result_protocol.production_candidate_created -ne $false) {
      Add-Failure "Review result protocol validation must not create production candidates"
    }
  }

  $reviewDecisionPackageOutput = & node (Join-Path $Root 'scripts/validate_review_decision_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review decision package validation exited with failure"
  } else {
    $reviewDecisionPackage = ($reviewDecisionPackageOutput -join "`n") | ConvertFrom-Json
    if ($reviewDecisionPackage.passed -ne $true) {
      Add-Failure "Review decision package validation must report passed true"
    }
    if ($reviewDecisionPackage.review_decision_package.package_cli_present -ne $true) {
      Add-Failure "Review decision package validation must verify package CLI"
    }
    if ($reviewDecisionPackage.review_decision_package.schema_present -ne $true) {
      Add-Failure "Review decision package validation must verify schema"
    }
    if ($reviewDecisionPackage.review_decision_package.example_present -ne $true) {
      Add-Failure "Review decision package validation must verify example"
    }
    if ($reviewDecisionPackage.review_decision_package.stdout_only -ne $true) {
      Add-Failure "Review decision package validation must verify stdout-only boundary"
    }
    if ($reviewDecisionPackage.review_decision_package.accepted_sample_drafts_verified -ne $true) {
      Add-Failure "Review decision package validation must verify accepted sample drafts"
    }
    if ($reviewDecisionPackage.review_decision_package.rejected_sample_drafts_verified -ne $true) {
      Add-Failure "Review decision package validation must verify rejected sample drafts"
    }
    if ($reviewDecisionPackage.review_decision_package.memory_delta_drafts_verified -ne $true) {
      Add-Failure "Review decision package validation must verify memory delta drafts"
    }
    if ($reviewDecisionPackage.review_decision_package.memory_forbidden_records_verified -ne $true) {
      Add-Failure "Review decision package validation must verify memory-forbidden records"
    }
    if ($reviewDecisionPackage.review_decision_package.production_exclusion_register_verified -ne $true) {
      Add-Failure "Review decision package validation must verify production exclusion register"
    }
    if ($reviewDecisionPackage.review_decision_package.negative_guard_memory_forbidden_verified -ne $true) {
      Add-Failure "Review decision package validation must verify negative guard memory-forbidden record"
    }
    if ($reviewDecisionPackage.review_decision_package.negative_guard_never_production_register_verified -ne $true) {
      Add-Failure "Review decision package validation must verify negative guard never-production register"
    }
    if ($reviewDecisionPackage.review_decision_package.no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review decision package validation must verify direct memory write is false"
    }
    if ($reviewDecisionPackage.review_decision_package.no_production_candidate_created_verified -ne $true) {
      Add-Failure "Review decision package validation must verify production candidate creation is false"
    }
    if ($reviewDecisionPackage.review_decision_package.provider_contact_performed -ne $false) {
      Add-Failure "Review decision package validation must not perform provider contact"
    }
    if ($reviewDecisionPackage.review_decision_package.plugin_call_performed -ne $false) {
      Add-Failure "Review decision package validation must not call plugins"
    }
    if ($reviewDecisionPackage.review_decision_package.api_call_performed -ne $false) {
      Add-Failure "Review decision package validation must not call APIs"
    }
    if ($reviewDecisionPackage.review_decision_package.image_generation_performed -ne $false) {
      Add-Failure "Review decision package validation must not generate images"
    }
    if ($reviewDecisionPackage.review_decision_package.daily_note_write_performed -ne $false) {
      Add-Failure "Review decision package validation must not write DailyNote"
    }
    if ($reviewDecisionPackage.review_decision_package.vcp_memory_write_performed -ne $false) {
      Add-Failure "Review decision package validation must not write VCP memory"
    }
    if ($reviewDecisionPackage.review_decision_package.output_file_write_performed -ne $false) {
      Add-Failure "Review decision package validation must not write output files"
    }
  }

  $evidenceBlockerContractOutput = & node (Join-Path $Root 'scripts/validate_evidence_blocker_contract.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Evidence blocker contract validation exited with failure"
  } else {
    $evidenceBlockerContract = ($evidenceBlockerContractOutput -join "`n") | ConvertFrom-Json
    if ($evidenceBlockerContract.passed -ne $true) {
      Add-Failure "Evidence blocker contract validation must report passed true"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.contract_cli_present -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify contract CLI"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.schema_present -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify schema"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.example_present -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify example"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.negative_guard_example_present -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify negative guard example"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.stdout_only -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify stdout-only boundary"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.evidence_records_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify evidence records"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.blocker_decisions_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify blocker decisions"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.production_exclusion_register_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify production exclusion register"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.pass_candidate_blocked_until_human_review_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify pass candidate remains blocked until human review"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.reject_candidate_never_production_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify reject candidate is never_production"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.negative_guard_memory_forbidden_block_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify negative guard memory-forbidden blocker"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.negative_guard_memory_forbidden_route_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify negative guard memory-forbidden route"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.negative_guard_memory_forbidden_candidate_never_production_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify memory-forbidden candidate remains never_production"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.negative_guard_unknown_candidate_production_blocker_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify unknown-failure candidate production blocker"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.negative_guard_production_exclusion_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify negative guard production exclusions"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.negative_guard_example_matches_cli_output -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify negative guard example matches CLI output"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.no_direct_memory_write_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify direct memory write is false"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.no_production_candidate_created_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify production candidate creation is false"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Evidence blocker contract validation must verify accepted_samples write is false"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.provider_contact_performed -ne $false) {
      Add-Failure "Evidence blocker contract validation must not perform provider contact"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.plugin_call_performed -ne $false) {
      Add-Failure "Evidence blocker contract validation must not call plugins"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.api_call_performed -ne $false) {
      Add-Failure "Evidence blocker contract validation must not call APIs"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.image_generation_performed -ne $false) {
      Add-Failure "Evidence blocker contract validation must not generate images"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.daily_note_write_performed -ne $false) {
      Add-Failure "Evidence blocker contract validation must not write DailyNote"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.vcp_memory_write_performed -ne $false) {
      Add-Failure "Evidence blocker contract validation must not write VCP memory"
    }
    if ($evidenceBlockerContract.evidence_blocker_contract.output_file_write_performed -ne $false) {
      Add-Failure "Evidence blocker contract validation must not write output files"
    }
  }

  $reviewBlockerArbiterOutput = & node (Join-Path $Root 'scripts/validate_review_blocker_arbiter.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review blocker arbiter validation exited with failure"
  } else {
    $reviewBlockerArbiter = ($reviewBlockerArbiterOutput -join "`n") | ConvertFrom-Json
    if ($reviewBlockerArbiter.passed -ne $true) {
      Add-Failure "Review blocker arbiter validation must report passed true"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.arbiter_cli_present -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify arbiter CLI"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.schema_present -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify schema"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.example_present -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify example"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.negative_guard_example_present -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify negative guard example"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.stdout_only -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify stdout-only boundary"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.candidate_arbitrations_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify candidate arbitrations"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.evidence_contract_trace_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify evidence contract trace"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.default_pass_candidate_human_review_blocked_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify pass candidate remains blocked pending human review"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.default_reject_candidate_never_production_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify rejected candidate is never_production"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.negative_guard_memory_forbidden_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify negative guard memory forbidden"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.negative_guard_never_production_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify negative guard never production"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.negative_guard_memory_forbidden_prevents_memory_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify memory-forbidden candidate cannot enter memory"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.production_promotion_blocked_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify production promotion is blocked"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.default_arbiter_example_matches_cli_output -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify default example matches CLI output"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.negative_guard_arbiter_example_matches_cli_output -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify negative guard example matches CLI output"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify no direct memory write"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.no_production_candidate_created_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify no production candidate creation"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review blocker arbiter validation must verify no accepted_samples write"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.provider_contact_performed -ne $false) {
      Add-Failure "Review blocker arbiter validation must not perform provider contact"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.plugin_call_performed -ne $false) {
      Add-Failure "Review blocker arbiter validation must not call plugins"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.api_call_performed -ne $false) {
      Add-Failure "Review blocker arbiter validation must not call APIs"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.image_generation_performed -ne $false) {
      Add-Failure "Review blocker arbiter validation must not generate images"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.daily_note_write_performed -ne $false) {
      Add-Failure "Review blocker arbiter validation must not write DailyNote"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.vcp_memory_write_performed -ne $false) {
      Add-Failure "Review blocker arbiter validation must not write VCP memory"
    }
    if ($reviewBlockerArbiter.review_blocker_arbiter.output_file_write_performed -ne $false) {
      Add-Failure "Review blocker arbiter validation must not write output files"
    }
  }

  # These historical validators assert that .agent_board is synchronized to their
  # old phase. Current .agent_board is intentionally synchronized to the latest
  # mainline phase, so the aggregate MVP validator only syntax-checks these
  # scripts above and skips their current-state assertions by default.
  $runHistoricalCurrentStateValidators = $false
  if ($runHistoricalCurrentStateValidators) {
  $v740AutonomyAlignmentOutput = & node (Join-Path $Root 'scripts/validate_v7_40_local_a4_a5_autonomy_alignment.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v7.40 local A4/A5 autonomy alignment validation exited with failure"
  } else {
    $v740AutonomyAlignment = ($v740AutonomyAlignmentOutput -join "`n") | ConvertFrom-Json
    if ($v740AutonomyAlignment.passed -ne $true) {
      Add-Failure "v7.40 local A4/A5 autonomy alignment validation must report passed true"
    }
    if ($v740AutonomyAlignment.v7_40_local_a4_a5_autonomy_alignment.a4_default_recorded -ne $true) {
      Add-Failure "v7.40 local A4/A5 autonomy alignment must verify A4 default"
    }
    if ($v740AutonomyAlignment.v7_40_local_a4_a5_autonomy_alignment.a5_production_recorded -ne $true) {
      Add-Failure "v7.40 local A4/A5 autonomy alignment must verify A5 production mode"
    }
    if ($v740AutonomyAlignment.v7_40_local_a4_a5_autonomy_alignment.required_a5_package_recorded -ne $true) {
      Add-Failure "v7.40 local A4/A5 autonomy alignment must verify required A5 authorization package"
    }
    if ($v740AutonomyAlignment.v7_40_local_a4_a5_autonomy_alignment.a5_actions_authorized_now -ne $false) {
      Add-Failure "v7.40 local A4/A5 autonomy alignment must not authorize A5 actions"
    }
  }

  $v741ScriptCreationRecordOutput = & node (Join-Path $Root 'scripts/validate_v7_41_external_remote_debug_verification_script_creation_record.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v7.41 external remote-debug verification script creation record validation exited with failure"
  } else {
    $v741ScriptCreationRecord = ($v741ScriptCreationRecordOutput -join "`n") | ConvertFrom-Json
    if ($v741ScriptCreationRecord.passed -ne $true) {
      Add-Failure "v7.41 external remote-debug verification script creation record validation must report passed true"
    }
    if ($v741ScriptCreationRecord.v7_41_external_remote_debug_verification_script_creation_record.remote_debug_script_created -ne $false) {
      Add-Failure "v7.41 must not create the remote-debug verification script"
    }
    if ($v741ScriptCreationRecord.v7_41_external_remote_debug_verification_script_creation_record.script_creation_deferred -ne $true) {
      Add-Failure "v7.41 must record script creation deferral"
    }
    if ($v741ScriptCreationRecord.v7_41_external_remote_debug_verification_script_creation_record.future_package_recorded -ne $true) {
      Add-Failure "v7.41 must record future script creation authorization package"
    }
  }

  $v742AuthorizationPackageOutput = & node (Join-Path $Root 'scripts/validate_v7_42_external_remote_debug_verification_script_creation_authorization_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v7.42 external remote-debug verification script creation authorization package validation exited with failure"
  } else {
    $v742AuthorizationPackage = ($v742AuthorizationPackageOutput -join "`n") | ConvertFrom-Json
    if ($v742AuthorizationPackage.passed -ne $true) {
      Add-Failure "v7.42 external remote-debug verification script creation authorization package validation must report passed true"
    }
    if ($v742AuthorizationPackage.v7_42_external_remote_debug_verification_script_creation_authorization_package.package_active -ne $false) {
      Add-Failure "v7.42 authorization package must remain inactive"
    }
    if ($v742AuthorizationPackage.v7_42_external_remote_debug_verification_script_creation_authorization_package.script_creation_authorized_by_this_phase -ne $false) {
      Add-Failure "v7.42 must not authorize script creation"
    }
    if ($v742AuthorizationPackage.v7_42_external_remote_debug_verification_script_creation_authorization_package.remote_debug_script_created -ne $false) {
      Add-Failure "v7.42 must not create the remote-debug verification script"
    }
  }

  $v743ScriptCreationExecutionOutput = & node (Join-Path $Root 'scripts/validate_v7_43_external_remote_debug_verification_script_creation_execution_record.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v7.43 external remote-debug verification script creation execution record validation exited with failure"
  } else {
    $v743ScriptCreationExecution = ($v743ScriptCreationExecutionOutput -join "`n") | ConvertFrom-Json
    if ($v743ScriptCreationExecution.passed -ne $true) {
      Add-Failure "v7.43 external remote-debug verification script creation execution record validation must report passed true"
    }
    if ($v743ScriptCreationExecution.v7_43_external_remote_debug_verification_script_creation_execution_record.remote_debug_script_created -ne $true) {
      Add-Failure "v7.43 must create the remote-debug smoke script"
    }
    if ($v743ScriptCreationExecution.v7_43_external_remote_debug_verification_script_creation_execution_record.script_run_by_this_phase -ne $false) {
      Add-Failure "v7.43 must not run the remote-debug smoke script"
    }
    if ($v743ScriptCreationExecution.v7_43_external_remote_debug_verification_script_creation_execution_record.script_has_no_forbidden_runtime -ne $true) {
      Add-Failure "v7.43 script must not include forbidden runtime operations"
    }
  }

  $v744ScriptRunAndLaunchOutput = & node (Join-Path $Root 'scripts/validate_v7_44_remote_debug_script_run_and_vcpchat_launch_record.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v7.44 remote-debug script run and VCPChat launch record validation exited with failure"
  } else {
    $v744ScriptRunAndLaunch = ($v744ScriptRunAndLaunchOutput -join "`n") | ConvertFrom-Json
    if ($v744ScriptRunAndLaunch.passed -ne $true) {
      Add-Failure "v7.44 remote-debug script run and VCPChat launch record validation must report passed true"
    }
    if ($v744ScriptRunAndLaunch.v7_44_remote_debug_script_run_and_vcpchat_launch_record.script_run_by_this_phase -ne $true) {
      Add-Failure "v7.44 must record that the remote-debug smoke script was run"
    }
    if ($v744ScriptRunAndLaunch.v7_44_remote_debug_script_run_and_vcpchat_launch_record.app_launch_performed_by_this_phase -ne $true) {
      Add-Failure "v7.44 must record that VCPChat launch was performed"
    }
    if ($v744ScriptRunAndLaunch.v7_44_remote_debug_script_run_and_vcpchat_launch_record.cdp_endpoint_accessed_by_this_phase -ne $false) {
      Add-Failure "v7.44 must not access CDP"
    }
    if ($v744ScriptRunAndLaunch.v7_44_remote_debug_script_run_and_vcpchat_launch_record.bridge_method_invocation_performed -ne $false) {
      Add-Failure "v7.44 must not invoke bridge methods"
    }
  }

  $v745CdpReadOnlyAttemptOutput = & node (Join-Path $Root 'scripts/validate_v7_45_cdp_read_only_attempt_record.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v7.45 CDP read-only attempt record validation exited with failure"
  } else {
    $v745CdpReadOnlyAttempt = ($v745CdpReadOnlyAttemptOutput -join "`n") | ConvertFrom-Json
    if ($v745CdpReadOnlyAttempt.passed -ne $true) {
      Add-Failure "v7.45 CDP read-only attempt record validation must report passed true"
    }
    if ($v745CdpReadOnlyAttempt.v7_45_cdp_read_only_attempt_record.cdp_endpoint_access_attempted_by_this_phase -ne $true) {
      Add-Failure "v7.45 must record that CDP endpoint access was attempted"
    }
    if ($v745CdpReadOnlyAttempt.v7_45_cdp_read_only_attempt_record.cdp_endpoint_access_succeeded_by_this_phase -ne $false) {
      Add-Failure "v7.45 must record that CDP endpoint access did not succeed"
    }
    if ($v745CdpReadOnlyAttempt.v7_45_cdp_read_only_attempt_record.runtime_evaluate_performed_by_this_phase -ne $false) {
      Add-Failure "v7.45 must not perform Runtime.evaluate without an available CDP target"
    }
    if ($v745CdpReadOnlyAttempt.v7_45_cdp_read_only_attempt_record.bridge_method_invocation_performed -ne $false) {
      Add-Failure "v7.45 must not invoke bridge methods"
    }
  }

  $v746RuntimeVerificationOutput = & node (Join-Path $Root 'scripts/validate_v7_46_remote_debug_relaunch_runtime_verification_record.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v7.46 remote-debug relaunch runtime verification validation exited with failure"
  } else {
    $v746RuntimeVerification = ($v746RuntimeVerificationOutput -join "`n") | ConvertFrom-Json
    if ($v746RuntimeVerification.passed -ne $true) {
      Add-Failure "v7.46 remote-debug relaunch runtime verification validation must report passed true"
    }
    if ($v746RuntimeVerification.v7_46_remote_debug_relaunch_runtime_verification_record.remote_debug_relaunch_performed_by_this_phase -ne $true) {
      Add-Failure "v7.46 must record remote-debug relaunch"
    }
    if ($v746RuntimeVerification.v7_46_remote_debug_relaunch_runtime_verification_record.cdp_endpoint_access_succeeded_by_this_phase -ne $true) {
      Add-Failure "v7.46 must record successful CDP endpoint access"
    }
    if ($v746RuntimeVerification.v7_46_remote_debug_relaunch_runtime_verification_record.runtime_evaluate_performed_by_this_phase -ne $true) {
      Add-Failure "v7.46 must record Runtime.evaluate surface verification"
    }
    if ($v746RuntimeVerification.v7_46_remote_debug_relaunch_runtime_verification_record.bridge_method_invocation_performed -ne $false) {
      Add-Failure "v7.46 must not invoke bridge methods"
    }
  }

  $v100A5ActivationOutput = & node (Join-Path $Root 'scripts/validate_v10_0_a5_end_to_end_activation_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.0 A5 end-to-end activation package validation exited with failure"
  } else {
    $v100A5Activation = ($v100A5ActivationOutput -join "`n") | ConvertFrom-Json
    if ($v100A5Activation.passed -ne $true) {
      Add-Failure "v10.0 A5 end-to-end activation package validation must report passed true"
    }
    if ($v100A5Activation.v10_0_a5_end_to_end_activation_package.active_a5_authorization_package_present -ne $true) {
      Add-Failure "v10.0 must record active A5 authorization package presence"
    }
    if ($v100A5Activation.v10_0_a5_end_to_end_activation_package.activation_ready -ne $false) {
      Add-Failure "v10.0 must keep activation_ready false after blocked preflight"
    }
    if ($v100A5Activation.v10_0_a5_end_to_end_activation_package.a5_preflight_blocked -ne $true) {
      Add-Failure "v10.0 must record blocked A5 preflight"
    }
    if ($v100A5Activation.v10_0_a5_end_to_end_activation_package.a5_execution_started -ne $false) {
      Add-Failure "v10.0 must not start A5 production execution"
    }
    if ($v100A5Activation.v10_0_a5_end_to_end_activation_package.github_release_allowed -ne $false) {
      Add-Failure "v10.0 must keep GitHub Release disallowed"
    }
  }

  $v101A5ResumeOutput = & node (Join-Path $Root 'scripts/validate_v10_1_a5_resume_after_external_worktree_reconciliation.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.1 A5 resume after external worktree reconciliation validation exited with failure"
  } else {
    $v101A5Resume = ($v101A5ResumeOutput -join "`n") | ConvertFrom-Json
    if ($v101A5Resume.passed -ne $true) {
      Add-Failure "v10.1 A5 resume after external worktree reconciliation validation must report passed true"
    }
    if ($v101A5Resume.v10_1_a5_resume_after_external_worktree_reconciliation.user_reported_external_worktrees_clean -ne $true) {
      Add-Failure "v10.1 must record user-reported external worktree reconciliation"
    }
    if ($v101A5Resume.v10_1_a5_resume_after_external_worktree_reconciliation.a5_preflight_rerun_required -ne $true) {
      Add-Failure "v10.1 must require A5 preflight rerun"
    }
    if ($v101A5Resume.v10_1_a5_resume_after_external_worktree_reconciliation.a5_resume_ready -ne $false) {
      Add-Failure "v10.1 must keep a5_resume_ready false before machine recheck"
    }
    if ($v101A5Resume.v10_1_a5_resume_after_external_worktree_reconciliation.a5_execution_started -ne $false) {
      Add-Failure "v10.1 must not start A5 production execution"
    }
    if ($v101A5Resume.v10_1_a5_resume_after_external_worktree_reconciliation.github_release_allowed -ne $false) {
      Add-Failure "v10.1 must keep GitHub Release disallowed"
    }
  }

  $v102A5BridgeSmokeOutput = & node (Join-Path $Root 'scripts/validate_v10_2_a5_bridge_smoke_blocked_record.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.2 A5 bridge smoke blocked record validation exited with failure"
  } else {
    $v102A5BridgeSmoke = ($v102A5BridgeSmokeOutput -join "`n") | ConvertFrom-Json
    if ($v102A5BridgeSmoke.passed -ne $true) {
      Add-Failure "v10.2 A5 bridge smoke blocked record validation must report passed true"
    }
    if ($v102A5BridgeSmoke.v10_2_a5_bridge_smoke_blocked_record.preflight_recheck_performed -ne $true) {
      Add-Failure "v10.2 must record A5 preflight recheck"
    }
    if ($v102A5BridgeSmoke.v10_2_a5_bridge_smoke_blocked_record.external_target_worktrees_clean_current -ne $true) {
      Add-Failure "v10.2 must record clean external target worktrees"
    }
    if ($v102A5BridgeSmoke.v10_2_a5_bridge_smoke_blocked_record.bridge_calls_observed -ne 0) {
      Add-Failure "v10.2 must keep bridge call count at zero when surface is missing"
    }
    if ($v102A5BridgeSmoke.v10_2_a5_bridge_smoke_blocked_record.bridge_surface_missing -ne $true) {
      Add-Failure "v10.2 must record missing bridge surface"
    }
    if ($v102A5BridgeSmoke.v10_2_a5_bridge_smoke_blocked_record.plugin_called -ne $false) {
      Add-Failure "v10.2 must not call plugins after bridge smoke block"
    }
    if ($v102A5BridgeSmoke.v10_2_a5_bridge_smoke_blocked_record.github_release_allowed -ne $false) {
      Add-Failure "v10.2 must keep GitHub Release disallowed"
    }
  }

  $v103A5BridgeIntegrationOutput = & node (Join-Path $Root 'scripts/validate_v10_3_a5_bridge_integration_smoke_record.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.3 A5 bridge integration smoke record validation exited with failure"
  } else {
    $v103A5BridgeIntegration = ($v103A5BridgeIntegrationOutput -join "`n") | ConvertFrom-Json
    if ($v103A5BridgeIntegration.passed -ne $true) {
      Add-Failure "v10.3 A5 bridge integration smoke record validation must report passed true"
    }
    if ($v103A5BridgeIntegration.v10_3_a5_bridge_integration_smoke_record.no_write_bridge_exposed -ne $true) {
      Add-Failure "v10.3 must record no-write bridge exposure"
    }
    if ($v103A5BridgeIntegration.v10_3_a5_bridge_integration_smoke_record.strict_allowlist_smoke_performed -ne $true) {
      Add-Failure "v10.3 must record strict allowlist smoke"
    }
    if ($v103A5BridgeIntegration.v10_3_a5_bridge_integration_smoke_record.bridge_calls_observed -ne 3) {
      Add-Failure "v10.3 must record three allowlist bridge calls"
    }
    if ($v103A5BridgeIntegration.v10_3_a5_bridge_integration_smoke_record.submitDraft_called -ne $false) {
      Add-Failure "v10.3 strict allowlist smoke must not call submitDraft"
    }
    if ($v103A5BridgeIntegration.v10_3_a5_bridge_integration_smoke_record.human_review_required_before_production_continuation -ne $true) {
      Add-Failure "v10.3 must require human review before production continuation"
    }
    if ($v103A5BridgeIntegration.v10_3_a5_bridge_integration_smoke_record.doubaogen_continuation_blocked -ne $true) {
      Add-Failure "v10.3 must block DoubaoGen continuation pending human review"
    }
  }

  $v104A5DoubaoGenOutput = & node (Join-Path $Root 'scripts/validate_v10_4_a5_doubaogen_single_generation_rejected_asset_record.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.4 A5 DoubaoGen single generation rejected asset record validation exited with failure"
  } else {
    $v104A5DoubaoGen = ($v104A5DoubaoGenOutput -join "`n") | ConvertFrom-Json
    if ($v104A5DoubaoGen.passed -ne $true) {
      Add-Failure "v10.4 A5 DoubaoGen rejected asset validation must report passed true"
    }
    if ($v104A5DoubaoGen.v10_4_a5_doubaogen_single_generation_rejected_asset_record.actual_plugin_calls -ne 1) {
      Add-Failure "v10.4 must record exactly one DoubaoGen plugin call"
    }
    if ($v104A5DoubaoGen.v10_4_a5_doubaogen_single_generation_rejected_asset_record.generated_asset_count -ne 1) {
      Add-Failure "v10.4 must record exactly one generated asset"
    }
    if ($v104A5DoubaoGen.v10_4_a5_doubaogen_single_generation_rejected_asset_record.asset_status -ne "rejected") {
      Add-Failure "v10.4 generated asset must be rejected by safety review"
    }
    if ($v104A5DoubaoGen.v10_4_a5_doubaogen_single_generation_rejected_asset_record.memory_write_blocked_by_asset_review -ne $true) {
      Add-Failure "v10.4 must block memory writes after rejected asset review"
    }
    if ($v104A5DoubaoGen.v10_4_a5_doubaogen_single_generation_rejected_asset_record.daily_note_write_performed -ne $false) {
      Add-Failure "v10.4 must not write DailyNote after rejected asset review"
    }
    if ($v104A5DoubaoGen.v10_4_a5_doubaogen_single_generation_rejected_asset_record.vcp_memory_write_performed -ne $false) {
      Add-Failure "v10.4 must not write VCP memory after rejected asset review"
    }
  }

  $v105A5DoubaoGenRetryOutput = & node (Join-Path $Root 'scripts/validate_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.5 A5 DoubaoGen no-text retry rejected asset record validation exited with failure"
  } else {
    $v105A5DoubaoGenRetry = ($v105A5DoubaoGenRetryOutput -join "`n") | ConvertFrom-Json
    if ($v105A5DoubaoGenRetry.passed -ne $true) {
      Add-Failure "v10.5 A5 DoubaoGen retry validation must report passed true"
    }
    if ($v105A5DoubaoGenRetry.v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.actual_plugin_calls -ne 1) {
      Add-Failure "v10.5 must record exactly one DoubaoGen retry plugin call"
    }
    if ($v105A5DoubaoGenRetry.v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.generated_asset_count -ne 1) {
      Add-Failure "v10.5 must record exactly one generated retry asset"
    }
    if ($v105A5DoubaoGenRetry.v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.asset_status -ne "rejected") {
      Add-Failure "v10.5 generated asset must be rejected by safety review"
    }
    if ($v105A5DoubaoGenRetry.v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.person_or_face_detected -ne $true) {
      Add-Failure "v10.5 must record person or face risk"
    }
    if ($v105A5DoubaoGenRetry.v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.readable_text_or_logo_detected -ne $true) {
      Add-Failure "v10.5 must record readable text or logo risk"
    }
    if ($v105A5DoubaoGenRetry.v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.daily_note_write_performed -ne $false) {
      Add-Failure "v10.5 must not write DailyNote after rejected retry asset review"
    }
    if ($v105A5DoubaoGenRetry.v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.vcp_memory_write_performed -ne $false) {
      Add-Failure "v10.5 must not write VCP memory after rejected retry asset review"
    }
  }

  $v106A5PromptStrategyOutput = & node (Join-Path $Root 'scripts/validate_v10_6_a5_prompt_failure_analysis_and_safer_strategy.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.6 A5 prompt failure analysis and safer strategy validation exited with failure"
  } else {
    $v106A5PromptStrategy = ($v106A5PromptStrategyOutput -join "`n") | ConvertFrom-Json
    if ($v106A5PromptStrategy.passed -ne $true) {
      Add-Failure "v10.6 A5 prompt strategy validation must report passed true"
    }
    if ($v106A5PromptStrategy.v10_6_a5_prompt_failure_analysis_and_safer_strategy.prompt_design_failure_acknowledged -ne $true) {
      Add-Failure "v10.6 must acknowledge prompt design failure"
    }
    if ($v106A5PromptStrategy.v10_6_a5_prompt_failure_analysis_and_safer_strategy.next_real_generation_allowed_by_this_record -ne $false) {
      Add-Failure "v10.6 must not authorize a new real generation"
    }
    if ($v106A5PromptStrategy.v10_6_a5_prompt_failure_analysis_and_safer_strategy.next_prompt_preview_required_before_execution -ne $true) {
      Add-Failure "v10.6 must require prompt preview before execution"
    }
    if ($v106A5PromptStrategy.v10_6_a5_prompt_failure_analysis_and_safer_strategy.no_forbidden_true_execution -ne $true) {
      Add-Failure "v10.6 must not record new real execution or version action"
    }
  }

  $v107A5PromptReviewOutput = & node (Join-Path $Root 'scripts/validate_v10_7_a5_safer_prompt_review_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.7 A5 safer prompt review package validation exited with failure"
  } else {
    $v107A5PromptReview = ($v107A5PromptReviewOutput -join "`n") | ConvertFrom-Json
    if ($v107A5PromptReview.passed -ne $true) {
      Add-Failure "v10.7 A5 prompt review validation must report passed true"
    }
    if ($v107A5PromptReview.v10_7_a5_safer_prompt_review_package.prompt_risky_terms_absent -ne $true) {
      Add-Failure "v10.7 prompt must not include risky trigger terms"
    }
    if ($v107A5PromptReview.v10_7_a5_safer_prompt_review_package.next_real_generation_allowed_by_this_record -ne $false) {
      Add-Failure "v10.7 must not authorize a new real generation"
    }
    if ($v107A5PromptReview.v10_7_a5_safer_prompt_review_package.user_prompt_approval_required -ne $true) {
      Add-Failure "v10.7 must require user prompt approval"
    }
    if ($v107A5PromptReview.v10_7_a5_safer_prompt_review_package.no_forbidden_true_execution -ne $true) {
      Add-Failure "v10.7 must not record new real execution or version action"
    }
  }

  $v108A5PreflightGateOutput = & node (Join-Path $Root 'scripts/validate_v10_8_a5_positive_still_life_generation_preflight_gate.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.8 A5 positive still-life generation preflight gate validation exited with failure"
  } else {
    $v108A5PreflightGate = ($v108A5PreflightGateOutput -join "`n") | ConvertFrom-Json
    if ($v108A5PreflightGate.passed -ne $true) {
      Add-Failure "v10.8 A5 preflight gate validation must report passed true"
    }
    if ($v108A5PreflightGate.v10_8_a5_positive_still_life_generation_preflight_gate.prompt_locked_for_future_authorization -ne $true) {
      Add-Failure "v10.8 must lock the reviewed prompt for future authorization"
    }
    if ($v108A5PreflightGate.v10_8_a5_positive_still_life_generation_preflight_gate.next_real_generation_allowed_by_this_record -ne $false) {
      Add-Failure "v10.8 must not authorize a new real generation"
    }
    if ($v108A5PreflightGate.v10_8_a5_positive_still_life_generation_preflight_gate.separate_real_generation_authorization_required -ne $true) {
      Add-Failure "v10.8 must require separate real generation authorization"
    }
    if ($v108A5PreflightGate.v10_8_a5_positive_still_life_generation_preflight_gate.no_forbidden_true_execution -ne $true) {
      Add-Failure "v10.8 must not record real execution or version action"
    }
  }

  $v109A5RejectedAssetOutput = & node (Join-Path $Root 'scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.9 A5 positive still-life rejected asset validation exited with failure"
  } else {
    $v109A5RejectedAsset = ($v109A5RejectedAssetOutput -join "`n") | ConvertFrom-Json
    if ($v109A5RejectedAsset.passed -ne $true) {
      Add-Failure "v10.9 A5 rejected asset validation must report passed true"
    }
    if ($v109A5RejectedAsset.v10_9_a5_positive_still_life_generation_rejected_asset_record.actual_plugin_calls -ne 1) {
      Add-Failure "v10.9 must record exactly one plugin call"
    }
    if ($v109A5RejectedAsset.v10_9_a5_positive_still_life_generation_rejected_asset_record.asset_status -ne 'rejected') {
      Add-Failure "v10.9 must record rejected asset status"
    }
    if ($v109A5RejectedAsset.v10_9_a5_positive_still_life_generation_rejected_asset_record.person_or_face_detected -ne $true) {
      Add-Failure "v10.9 must record person/face detection"
    }
    if ($v109A5RejectedAsset.v10_9_a5_positive_still_life_generation_rejected_asset_record.prompt_subject_match -ne $false) {
      Add-Failure "v10.9 must record prompt subject mismatch"
    }
    if ($v109A5RejectedAsset.v10_9_a5_positive_still_life_generation_rejected_asset_record.daily_note_write_performed -ne $false) {
      Add-Failure "v10.9 must not perform DailyNote write"
    }
    if ($v109A5RejectedAsset.v10_9_a5_positive_still_life_generation_rejected_asset_record.vcp_memory_write_performed -ne $false) {
      Add-Failure "v10.9 must not perform VCP memory write"
    }
  }

  $v1010A5DiagnosticPreflightOutput = & node (Join-Path $Root 'scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.10 A5 prompt handoff diagnostic preflight validation exited with failure"
  } else {
    $v1010A5DiagnosticPreflight = ($v1010A5DiagnosticPreflightOutput -join "`n") | ConvertFrom-Json
    if ($v1010A5DiagnosticPreflight.passed -ne $true) {
      Add-Failure "v10.10 A5 diagnostic preflight validation must report passed true"
    }
    if ($v1010A5DiagnosticPreflight.v10_10_a5_prompt_handoff_diagnostic_preflight.prompt_sha256_matches_expected -ne $true) {
      Add-Failure "v10.10 must record the expected prompt fingerprint"
    }
    if ($v1010A5DiagnosticPreflight.v10_10_a5_prompt_handoff_diagnostic_preflight.diagnostic_authorization_active -ne $false) {
      Add-Failure "v10.10 diagnostic authorization must remain inactive"
    }
    if ($v1010A5DiagnosticPreflight.v10_10_a5_prompt_handoff_diagnostic_preflight.max_plugin_calls_allowed -ne 0) {
      Add-Failure "v10.10 must keep max plugin calls at 0"
    }
    if ($v1010A5DiagnosticPreflight.v10_10_a5_prompt_handoff_diagnostic_preflight.api_call_allowed -ne $false) {
      Add-Failure "v10.10 must not allow API calls"
    }
    if ($v1010A5DiagnosticPreflight.v10_10_a5_prompt_handoff_diagnostic_preflight.image_creation_allowed -ne $false) {
      Add-Failure "v10.10 must not allow image creation"
    }
    if ($v1010A5DiagnosticPreflight.v10_10_a5_prompt_handoff_diagnostic_preflight.no_forbidden_true_execution -ne $true) {
      Add-Failure "v10.10 must not record real execution or version action"
    }
  }

  $v1011A5DiagnosticResultOutput = & node (Join-Path $Root 'scripts/validate_v10_11_a5_prompt_handoff_diagnostic_result.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.11 A5 prompt handoff diagnostic result validation exited with failure"
  } else {
    $v1011A5DiagnosticResult = ($v1011A5DiagnosticResultOutput -join "`n") | ConvertFrom-Json
    if ($v1011A5DiagnosticResult.passed -ne $true) {
      Add-Failure "v10.11 A5 diagnostic result validation must report passed true"
    }
    if ($v1011A5DiagnosticResult.v10_11_a5_prompt_handoff_diagnostic_result.prompt_hash_matches_expected -ne $true) {
      Add-Failure "v10.11 must verify prompt hash"
    }
    if ($v1011A5DiagnosticResult.v10_11_a5_prompt_handoff_diagnostic_result.local_runner_prompt_rewrite_detected -ne $false) {
      Add-Failure "v10.11 must not detect local runner prompt rewrite"
    }
    if ($v1011A5DiagnosticResult.v10_11_a5_prompt_handoff_diagnostic_result.actual_plugin_calls -ne 0) {
      Add-Failure "v10.11 must keep actual plugin calls at 0"
    }
    if ($v1011A5DiagnosticResult.v10_11_a5_prompt_handoff_diagnostic_result.api_called -ne $false) {
      Add-Failure "v10.11 must not call API"
    }
    if ($v1011A5DiagnosticResult.v10_11_a5_prompt_handoff_diagnostic_result.image_created -ne $false) {
      Add-Failure "v10.11 must not create image"
    }
    if ($v1011A5DiagnosticResult.v10_11_a5_prompt_handoff_diagnostic_result.provider_side_request_observed -ne $false) {
      Add-Failure "v10.11 must record provider-side request as unobserved"
    }
  }

  $v1012A5ProviderSideCaptureOutput = & node (Join-Path $Root 'scripts/validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.12 A5 provider-side prompt fingerprint capture authorization package validation exited with failure"
  } else {
    $v1012A5ProviderSideCapture = ($v1012A5ProviderSideCaptureOutput -join "`n") | ConvertFrom-Json
    if ($v1012A5ProviderSideCapture.passed -ne $true) {
      Add-Failure "v10.12 provider-side prompt fingerprint capture validation must report passed true"
    }
    if ($v1012A5ProviderSideCapture.v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.authorization_status -ne 'inactive_package') {
      Add-Failure "v10.12 provider-side prompt fingerprint capture authorization package must remain inactive"
    }
    if ($v1012A5ProviderSideCapture.v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.execution_authorized_by_this_record -ne $false) {
      Add-Failure "v10.12 provider-side prompt fingerprint capture package must not authorize execution by itself"
    }
    if ($v1012A5ProviderSideCapture.v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.max_generation_calls_allowed -ne 0) {
      Add-Failure "v10.12 provider-side prompt fingerprint capture package must keep generation calls at 0"
    }
    if ($v1012A5ProviderSideCapture.v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.provider_side_capture_performed -ne $false) {
      Add-Failure "v10.12 provider-side prompt fingerprint capture package must not perform provider-side capture before activation"
    }
    if ($v1012A5ProviderSideCapture.v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.no_forbidden_current_execution -ne $true) {
      Add-Failure "v10.12 provider-side prompt fingerprint capture package must not record active execution or version action"
    }
  }

  $v1015RunnerUtf8Output = & node (Join-Path $Root 'scripts/validate_v10_15_runner_utf8_no_bom_transport.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.15 runner UTF-8 no BOM transport validation exited with failure"
  } else {
    $v1015RunnerUtf8 = ($v1015RunnerUtf8Output -join "`n") | ConvertFrom-Json
    if ($v1015RunnerUtf8.passed -ne $true) {
      Add-Failure "v10.15 runner UTF-8 no BOM transport validation must report passed true"
    }
    if ($v1015RunnerUtf8.v10_15_runner_utf8_no_bom_transport.generation_performed -ne $false) {
      Add-Failure "v10.15 runner transport validation must not perform generation"
    }
    if ($v1015RunnerUtf8.v10_15_runner_utf8_no_bom_transport.api_called -ne $false) {
      Add-Failure "v10.15 runner transport validation must not call API"
    }
    if ($v1015RunnerUtf8.v10_15_runner_utf8_no_bom_transport.image_created -ne $false) {
      Add-Failure "v10.15 runner transport validation must not create images"
    }
  }

  $v1020PluginReportedModelOutput = & node (Join-Path $Root 'scripts/validate_v10_20_plugin_reported_model_recording.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.20 plugin reported model recording validation exited with failure"
  } else {
    $v1020PluginReportedModel = ($v1020PluginReportedModelOutput -join "`n") | ConvertFrom-Json
    if ($v1020PluginReportedModel.passed -ne $true) {
      Add-Failure "v10.20 plugin reported model recording validation must report passed true"
    }
    if ($v1020PluginReportedModel.v10_20_plugin_reported_model_recording.records_plugin_reported_model_ref -ne $true) {
      Add-Failure "v10.20 runner must record plugin reported model ref"
    }
    if ($v1020PluginReportedModel.v10_20_plugin_reported_model_recording.records_model_match_boolean -ne $true) {
      Add-Failure "v10.20 runner must record reported/requested model match boolean"
    }
    if ($v1020PluginReportedModel.v10_20_plugin_reported_model_recording.generation_performed -ne $false) {
      Add-Failure "v10.20 validation must not perform generation"
    }
  }

  $v1026RealWriteCloseoutOutput = & node (Join-Path $Root 'scripts/validate_v10_26_real_dailynote_write_closeout.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.26 real DailyNote/VCP memory write closeout validation exited with failure"
  } else {
    $v1026RealWriteCloseout = ($v1026RealWriteCloseoutOutput -join "`n") | ConvertFrom-Json
    if ($v1026RealWriteCloseout.passed -ne $true) {
      Add-Failure "v10.26 real write closeout validation must report passed true"
    }
    if ($v1026RealWriteCloseout.v10_26_real_dailynote_write_closeout.actual_write_calls -ne 1) {
      Add-Failure "v10.26 closeout must record exactly one actual write call"
    }
    if ($v1026RealWriteCloseout.v10_26_real_dailynote_write_closeout.raw_path_recorded -ne $false) {
      Add-Failure "v10.26 closeout must not record raw saved path"
    }
    if ($v1026RealWriteCloseout.v10_26_real_dailynote_write_closeout.second_write_performed -ne $false) {
      Add-Failure "v10.26 closeout must not record a second write"
    }
  }

  $v1027RootPathCorrectionOutput = & node (Join-Path $Root 'scripts/validate_v10_27_dailynotewrite_root_path_correction.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.27 DailyNoteWrite root path correction validation exited with failure"
  } else {
    $v1027RootPathCorrection = ($v1027RootPathCorrectionOutput -join "`n") | ConvertFrom-Json
    if ($v1027RootPathCorrection.passed -ne $true) {
      Add-Failure "v10.27 root path correction validation must report passed true"
    }
    if ($v1027RootPathCorrection.v10_27_dailynotewrite_root_path_correction.corrected_root_class -ne 'vcp_root_dailynote') {
      Add-Failure "v10.27 correction must record vcp_root_dailynote"
    }
    if ($v1027RootPathCorrection.v10_27_dailynotewrite_root_path_correction.dailynotewrite_rerun_performed -ne $false) {
      Add-Failure "v10.27 correction must not rerun DailyNoteWrite"
    }
    if ($v1027RootPathCorrection.v10_27_dailynotewrite_root_path_correction.daily_note_write_performed_in_v10_27 -ne $false) {
      Add-Failure "v10.27 correction must not perform another DailyNote write"
    }
    if ($v1027RootPathCorrection.v10_27_dailynotewrite_root_path_correction.raw_config_value_recorded -ne $false) {
      Add-Failure "v10.27 correction must not record raw config values"
    }
  }

  $v1028CanonicalLocationGuardOutput = & node (Join-Path $Root 'scripts/validate_v10_28_dailynote_canonical_location_guard.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v10.28 DailyNote canonical location guard validation exited with failure"
  } else {
    $v1028CanonicalLocationGuard = ($v1028CanonicalLocationGuardOutput -join "`n") | ConvertFrom-Json
    if ($v1028CanonicalLocationGuard.passed -ne $true) {
      Add-Failure "v10.28 canonical location guard validation must report passed true"
    }
    if ($v1028CanonicalLocationGuard.v10_28_dailynote_canonical_location_guard.plugin_success_sufficient -ne $false) {
      Add-Failure "v10.28 guard must record plugin success as insufficient"
    }
    if ($v1028CanonicalLocationGuard.v10_28_dailynote_canonical_location_guard.writer_root_class_required_before_write -ne 'vcp_root_dailynote') {
      Add-Failure "v10.28 guard must require vcp_root_dailynote before write"
    }
    if ($v1028CanonicalLocationGuard.v10_28_dailynote_canonical_location_guard.canonical_target_hash_match_required -ne $true) {
      Add-Failure "v10.28 guard must require canonical target hash match"
    }
    if ($v1028CanonicalLocationGuard.v10_28_dailynote_canonical_location_guard.daily_note_write_performed_in_v10_28 -ne $false) {
      Add-Failure "v10.28 guard must not perform another DailyNote write"
    }
  }

  }

  $reviewConsoleBlockerArbiterBoundaryScanOutput = & node (Join-Path $Root 'scripts/validate_review_console_blocker_arbiter_boundary_scan.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console blocker arbiter boundary scan validation exited with failure"
  } else {
    $reviewConsoleBlockerArbiterBoundaryScan = ($reviewConsoleBlockerArbiterBoundaryScanOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleBlockerArbiterBoundaryScan.passed -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan validation must report passed true"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.blocker_arbiter_boundary_scan_present -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan must be present"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.blocker_arbiter_boundary_targets_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan must verify exact targets"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.blocker_arbiter_no_env_reference_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan must verify no env references"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.blocker_arbiter_no_real_manifest_reference_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan must verify no real manifest references"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.blocker_arbiter_no_vcp_source_reference_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan must verify no VCP source references"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.blocker_arbiter_no_runs_or_accepted_samples_path_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan must verify no runs or accepted_samples paths"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.blocker_arbiter_no_image_binary_reference_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan must verify no image binary references"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.blocker_arbiter_no_network_or_process_execution_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan must verify no network or process execution"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.blocker_arbiter_no_write_api_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan must verify no write APIs"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.blocker_arbiter_regression_matrix_validator_rechecked -ne $true) {
      Add-Failure "Review Console blocker arbiter boundary scan must recheck regression matrix invariants"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.external_network_required -ne $false) {
      Add-Failure "Review Console blocker arbiter boundary scan must not require external network"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.external_service_required -ne $false) {
      Add-Failure "Review Console blocker arbiter boundary scan must not require external service"
    }
    if ($reviewConsoleBlockerArbiterBoundaryScan.review_console_blocker_arbiter_boundary_scan.file_write_performed -ne $false) {
      Add-Failure "Review Console blocker arbiter boundary scan validation must not write files"
    }
  }

  if ($runHistoricalCurrentStateValidators) {
  $localCheckpointOutput = & node (Join-Path $Root 'scripts/validate_local_checkpoint_manifest.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "local checkpoint manifest validation exited with failure"
  } else {
    $localCheckpoint = ($localCheckpointOutput -join "`n") | ConvertFrom-Json
    if ($localCheckpoint.passed -ne $true) {
      Add-Failure "local checkpoint manifest validation must report passed true"
    }
    if ($localCheckpoint.local_checkpoint_manifest.checkpoint_files_present -ne $true) {
      Add-Failure "local checkpoint manifest must verify checkpoint files"
    }
    if ($localCheckpoint.local_checkpoint_manifest.overlay_files_present -ne $true) {
      Add-Failure "local checkpoint manifest must verify overlay files"
    }
    if ($localCheckpoint.local_checkpoint_manifest.validation_files_present -ne $true) {
      Add-Failure "local checkpoint manifest must verify validation files"
    }
    if ($localCheckpoint.local_checkpoint_manifest.local_uncommitted_state_declared -ne $true) {
      Add-Failure "local checkpoint manifest must verify local uncommitted state"
    }
    if ($localCheckpoint.local_checkpoint_manifest.commit_tag_push_not_authorized -ne $true) {
      Add-Failure "local checkpoint manifest must verify commit/tag/push gate"
    }
    if ($localCheckpoint.local_checkpoint_manifest.validation_snapshot_present -ne $true) {
      Add-Failure "local checkpoint manifest must verify validation snapshot"
    }
    if ($localCheckpoint.local_checkpoint_manifest.roadmap_current_state_updated -ne $true) {
      Add-Failure "local checkpoint manifest must verify roadmap current state"
    }
    if ($localCheckpoint.local_checkpoint_manifest.file_write_performed -ne $false) {
      Add-Failure "local checkpoint manifest must not write files"
    }
  }

  $localCommitScopeOutput = & node (Join-Path $Root 'scripts/validate_local_commit_scope.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "local commit scope validation exited with failure"
  } else {
    $localCommitScope = ($localCommitScopeOutput -join "`n") | ConvertFrom-Json
    if ($localCommitScope.passed -ne $true) {
      Add-Failure "local commit scope validation must report passed true"
    }
    if ($localCommitScope.local_commit_scope.modified_files_allowed -ne $true) {
      Add-Failure "local commit scope must verify modified files are allowed"
    }
    if ($localCommitScope.local_commit_scope.untracked_files_allowed -ne $true) {
      Add-Failure "local commit scope must verify untracked files are allowed"
    }
    if ($localCommitScope.local_commit_scope.unexpected_modified_count -ne 0) {
      Add-Failure "local commit scope unexpected_modified_count must be 0"
    }
    if ($localCommitScope.local_commit_scope.unexpected_untracked_count -ne 0) {
      Add-Failure "local commit scope unexpected_untracked_count must be 0"
    }
    if ($localCommitScope.local_commit_scope.staged_changes_present -ne $false) {
      Add-Failure "local commit scope must verify no staged changes"
    }
    if ($localCommitScope.local_commit_scope.commit_allowed -ne $false) {
      Add-Failure "local commit scope must not authorize commit"
    }
    if ($localCommitScope.local_commit_scope.tag_allowed -ne $false) {
      Add-Failure "local commit scope must not authorize tag"
    }
    if ($localCommitScope.local_commit_scope.push_allowed -ne $false) {
      Add-Failure "local commit scope must not authorize push"
    }
    if ($localCommitScope.local_commit_scope.file_write_performed -ne $false) {
      Add-Failure "local commit scope must not write files"
    }

    # Push Safety Gate: image/runs staged check
    $pushSafetyImageExts = @('.jpg', '.jpeg', '.png', '.webp')
    $stagedFiles = @(& git diff --cached --name-only | Where-Object { $_.Trim() -ne '' } | ForEach-Object { $_.Trim() })
    $untrackedFiles = @(& git ls-files --others --exclude-standard | Where-Object { $_.Trim() -ne '' } | ForEach-Object { $_.Trim() })
    $allCandidateFiles = $stagedFiles + $untrackedFiles
    $verifiedArchiveImageFiles = @()
    $durableArchiveExecutionReportPath = Join-Path $Root 'reports/durable_archive_copy_execution/2026-05-20_durable_archive_copy_A5_execution_report.json'
    if (Test-Path $durableArchiveExecutionReportPath) {
      $durableArchiveExecutionReport = Get-Content $durableArchiveExecutionReportPath -Raw | ConvertFrom-Json
      if ($durableArchiveExecutionReport.status -eq 'completed_validated' -and $durableArchiveExecutionReport.copied_count -eq 14 -and $durableArchiveExecutionReport.failed_count -eq 0 -and $durableArchiveExecutionReport.runs_mutation_performed -eq $false -and $durableArchiveExecutionReport.production_candidate_write_performed -eq $false) {
        $verifiedArchiveImageFiles = @($durableArchiveExecutionReport.results | Where-Object { $_.post_copy_verified -eq $true } | ForEach-Object { $_.target_archive_path })
      }
    }
    $stagedImages = @($allCandidateFiles | Where-Object {
      ($pushSafetyImageExts -contains [System.IO.Path]::GetExtension($_).ToLower()) -and
      -not ($verifiedArchiveImageFiles -contains $_)
    })
    $stagedRuns = @($allCandidateFiles | Where-Object { $_.StartsWith('runs/') })
    if ($stagedImages.Count -gt 0) {
      Add-Failure "Push Safety Gate: image files must not be staged: $($stagedImages -join ', ')"
    }
    if ($stagedRuns.Count -gt 0) {
      Add-Failure "Push Safety Gate: runs/ paths must not be staged: $($stagedRuns -join ', ')"
    }
    if ($localCommitScope.push_safety_gate.image_files_in_allowlist -eq $true) {
      Add-Failure "Push Safety Gate: image files must not appear in commit scope allowlists"
    }
    if ($localCommitScope.push_safety_gate.runs_path_in_allowlist -eq $true) {
      Add-Failure "Push Safety Gate: runs/ paths must not appear in commit scope allowlists"
    }
  }

  $postPushStateOutput = & node (Join-Path $Root 'scripts/validate_post_push_state.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "post-push state validation exited with failure"
  } else {
    $postPushState = ($postPushStateOutput -join "`n") | ConvertFrom-Json
    if ($postPushState.passed -ne $true) {
      Add-Failure "post-push state validation must report passed true"
    }
    if ($postPushState.post_push_state.pushed_commit_short -ne '7f58408') {
      Add-Failure "post-push state must record pushed commit 7f58408"
    }
    if ($postPushState.post_push_state.pushed_tag -ne 'v4.6-guarded-autopilot-commit-scope') {
      Add-Failure "post-push state must record v4.6 pushed tag"
    }
    if ($postPushState.post_push_state.current_phase_updated -ne $true) {
      Add-Failure "post-push state must verify current phase update"
    }
    if ($postPushState.post_push_state.pushed_baseline_recorded -ne $true) {
      Add-Failure "post-push state must verify pushed baseline record"
    }
    if ($postPushState.post_push_state.remote_gate_preserved -ne $true) {
      Add-Failure "post-push state must preserve remote gate"
    }
    if ($postPushState.post_push_state.validation_snapshot_updated -ne $true) {
      Add-Failure "post-push state must verify validation snapshot"
    }
    if ($postPushState.post_push_state.file_write_performed -ne $false) {
      Add-Failure "post-push state validation must not write files"
    }
  }

  $v4IndexOutput = & node (Join-Path $Root 'scripts/validate_v4_index_consistency.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v4 index consistency validation exited with failure"
  } else {
    $v4Index = ($v4IndexOutput -join "`n") | ConvertFrom-Json
    if ($v4Index.passed -ne $true) {
      Add-Failure "v4 index consistency validation must report passed true"
    }
    if ($v4Index.v4_index_consistency.v4_record_count -ne 10) {
      Add-Failure "v4 index consistency validation must cover 10 v4 records"
    }
    if ($v4Index.v4_index_consistency.docs_present -ne $true) {
      Add-Failure "v4 index consistency validation must verify docs"
    }
    if ($v4Index.v4_index_consistency.schema_examples_present -ne $true) {
      Add-Failure "v4 index consistency validation must verify schema examples"
    }
    if ($v4Index.v4_index_consistency.validation_scripts_present -ne $true) {
      Add-Failure "v4 index consistency validation must verify validation scripts"
    }
    if ($v4Index.v4_index_consistency.readme_index_current -ne $true) {
      Add-Failure "v4 index consistency validation must verify README index"
    }
    if ($v4Index.v4_index_consistency.manifest_index_current -ne $true) {
      Add-Failure "v4 index consistency validation must verify MANIFEST index"
    }
    if ($v4Index.v4_index_consistency.validate_mvp_current -ne $true) {
      Add-Failure "v4 index consistency validation must verify validate_mvp index"
    }
    if ($v4Index.v4_index_consistency.agent_board_current -ne $true) {
      Add-Failure "v4 index consistency validation must verify agent board index"
    }
    if ($v4Index.v4_index_consistency.file_write_performed -ne $false) {
      Add-Failure "v4 index consistency validation must not write files"
    }
  }

  $localTagPushReadinessOutput = & node (Join-Path $Root 'scripts/validate_local_tag_push_readiness.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "local tag push-readiness validation exited with failure"
  } else {
    $localTagPushReadiness = ($localTagPushReadinessOutput -join "`n") | ConvertFrom-Json
    if ($localTagPushReadiness.passed -ne $true) {
      Add-Failure "local tag push-readiness validation must report passed true"
    }
    if ($localTagPushReadiness.local_tag_push_readiness.local_commit_short -ne '6d4253f') {
      Add-Failure "local tag push-readiness must record local commit 6d4253f"
    }
    if ($localTagPushReadiness.local_tag_push_readiness.local_tag -ne 'v4.8-local-validation-checkpoint') {
      Add-Failure "local tag push-readiness must record v4.8 local tag"
    }
    if ($localTagPushReadiness.local_tag_push_readiness.last_pushed_commit_short -ne '7f58408') {
      Add-Failure "local tag push-readiness must record last pushed commit 7f58408"
    }
    if ($localTagPushReadiness.local_tag_push_readiness.last_pushed_tag -ne 'v4.6-guarded-autopilot-commit-scope') {
      Add-Failure "local tag push-readiness must record v4.6 pushed tag"
    }
    if ($localTagPushReadiness.local_tag_push_readiness.push_pending_declared -ne $true) {
      Add-Failure "local tag push-readiness must declare push pending"
    }
    if ($localTagPushReadiness.local_tag_push_readiness.push_authorized -ne $false) {
      Add-Failure "local tag push-readiness must not authorize push"
    }
    if ($localTagPushReadiness.local_tag_push_readiness.remote_gate_preserved -ne $true) {
      Add-Failure "local tag push-readiness must preserve remote gate"
    }
    if ($localTagPushReadiness.local_tag_push_readiness.file_write_performed -ne $false) {
      Add-Failure "local tag push-readiness validation must not write files"
    }
  }
  }

  $runtimeDeliverySurfaceOutput = & node (Join-Path $Root 'scripts/validate_runtime_delivery_surface.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "runtime delivery surface validation exited with failure"
  } else {
    $runtimeDeliverySurface = ($runtimeDeliverySurfaceOutput -join "`n") | ConvertFrom-Json
    if ($runtimeDeliverySurface.passed -ne $true) {
      Add-Failure "runtime delivery surface validation must report passed true"
    }
    if ($runtimeDeliverySurface.runtime_delivery_surface.runtime_files_present -ne $true) {
      Add-Failure "runtime delivery surface must verify runtime files"
    }
    if ($runtimeDeliverySurface.runtime_delivery_surface.script_order_verified -ne $true) {
      Add-Failure "runtime delivery surface must verify script order"
    }
    if ($runtimeDeliverySurface.runtime_delivery_surface.dom_surface_present -ne $true) {
      Add-Failure "runtime delivery surface must verify DOM surface"
    }
    if ($runtimeDeliverySurface.runtime_delivery_surface.host_ack_surface_present -ne $true) {
      Add-Failure "runtime delivery surface must verify host ack surface"
    }
    if ($runtimeDeliverySurface.runtime_delivery_surface.field_mapping_current -ne $true) {
      Add-Failure "runtime delivery surface must verify field mapping"
    }
    if ($runtimeDeliverySurface.runtime_delivery_surface.readme_boundary_current -ne $true) {
      Add-Failure "runtime delivery surface must verify README boundary"
    }
    if ($runtimeDeliverySurface.runtime_delivery_surface.validation_command_current -ne $true) {
      Add-Failure "runtime delivery surface must verify validation command"
    }
    if ($runtimeDeliverySurface.runtime_delivery_surface.external_assets_loaded -ne $false) {
      Add-Failure "runtime delivery surface must not load external assets"
    }
    if ($runtimeDeliverySurface.runtime_delivery_surface.forbidden_runtime_calls_present -ne $false) {
      Add-Failure "runtime delivery surface must not include forbidden runtime calls"
    }
    if ($runtimeDeliverySurface.runtime_delivery_surface.file_write_performed -ne $false) {
      Add-Failure "runtime delivery surface validation must not write files"
    }
  }

  $adapterDeliverySurfaceOutput = & node (Join-Path $Root 'scripts/validate_adapter_delivery_surface.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "adapter delivery surface validation exited with failure"
  } else {
    $adapterDeliverySurface = ($adapterDeliverySurfaceOutput -join "`n") | ConvertFrom-Json
    if ($adapterDeliverySurface.passed -ne $true) {
      Add-Failure "adapter delivery surface validation must report passed true"
    }
    if ($adapterDeliverySurface.adapter_delivery_surface.adapter_files_present -ne $true) {
      Add-Failure "adapter delivery surface must verify adapter files"
    }
    if ($adapterDeliverySurface.adapter_delivery_surface.manifest_dry_run_only -ne $true) {
      Add-Failure "adapter delivery surface must verify manifest dry-run only"
    }
    if ($adapterDeliverySurface.adapter_delivery_surface.allowed_command_dry_run_only -ne $true) {
      Add-Failure "adapter delivery surface must verify dry_run as the only allowed command"
    }
    if ($adapterDeliverySurface.adapter_delivery_surface.lab_accepted_fixture_passed -ne $true) {
      Add-Failure "adapter delivery surface must verify lab accepted fixture"
    }
    if ($adapterDeliverySurface.adapter_delivery_surface.lab_rejected_fixture_passed -ne $true) {
      Add-Failure "adapter delivery surface must verify lab rejected fixture"
    }
    if ($adapterDeliverySurface.adapter_delivery_surface.export_accepted_stdio_passed -ne $true) {
      Add-Failure "adapter delivery surface must verify export accepted stdio"
    }
    if ($adapterDeliverySurface.adapter_delivery_surface.export_rejected_stdio_passed -ne $true) {
      Add-Failure "adapter delivery surface must verify export rejected stdio"
    }
    if ($adapterDeliverySurface.adapter_delivery_surface.no_execution_guard_verified -ne $true) {
      Add-Failure "adapter delivery surface must verify no-execution guard"
    }
    if ($adapterDeliverySurface.adapter_delivery_surface.forbidden_runtime_calls_present -ne $false) {
      Add-Failure "adapter delivery surface must not include forbidden runtime calls"
    }
    if ($adapterDeliverySurface.adapter_delivery_surface.file_write_performed -ne $false) {
      Add-Failure "adapter delivery surface validation must not write files"
    }
  }

  $reviewConsoleAdapterHandoffOutput = & node (Join-Path $Root 'scripts/validate_review_console_adapter_handoff.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console Adapter handoff validation exited with failure"
  } else {
    $reviewConsoleAdapterHandoff = ($reviewConsoleAdapterHandoffOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleAdapterHandoff.passed -ne $true) {
      Add-Failure "Review Console Adapter handoff validation must report passed true"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.static_handoff_fixture_present -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify static handoff fixture"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_fixture_compared -ne $true) {
      Add-Failure "Review Console Adapter handoff must compare Adapter fixture"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.accepted_draft_status_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify accepted_draft status"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.dispatch_plan_mapped -ne $true) {
      Add-Failure "Review Console Adapter handoff must map dispatch plan"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.gatekeeper_handoff_mapped -ne $true) {
      Add-Failure "Review Console Adapter handoff must map Gatekeeper handoff"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_console_handoff_mapped -ne $true) {
      Add-Failure "Review Console Adapter handoff must map Review Console handoff"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.no_execution_guard_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify no-execution guard"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.forbidden_actions_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify forbidden actions"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_result_protocol_static_handoff_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify review result protocol static handoff"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_pass_reasons_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify pass reasons"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_reject_reasons_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify reject reasons"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_memory_route_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify memory routes"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_never_production_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify never_production"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_production_candidate_blocked -ne $true) {
      Add-Failure "Review Console Adapter handoff must block production candidate creation"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_visible_ui_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify visible protocol UI"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_candidate_cards_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify protocol candidate cards"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_guard_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify protocol guard visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_guard_summary_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify protocol guard summary"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_memory_forbidden_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify memory-forbidden visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_negative_guard_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify negative guard visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_production_blocked_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify production-blocked visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_protocol_never_production_ids_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify never-production id visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_decision_package_static_handoff_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify review decision package static handoff"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_decision_package_guard_summary_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify review decision package guard summary"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_decision_package_accepted_drafts_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify accepted sample draft visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_decision_package_rejected_drafts_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify rejected sample draft visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_decision_package_memory_delta_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify memory delta draft visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_decision_package_production_exclusion_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify production exclusion visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_decision_package_no_production_candidate_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify decision package creates no production candidate"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_decision_package_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify decision package performs no direct memory write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_decision_package_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify decision package performs no accepted_samples write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_evidence_blocker_contract_static_handoff_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify evidence blocker contract static handoff"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_evidence_blocker_contract_guard_summary_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify evidence blocker guard summary"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.evidence_blocker_evidence_records_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify evidence record visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.evidence_blocker_blocker_decisions_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker decision visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.evidence_blocker_production_exclusion_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify evidence blocker production exclusion visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.evidence_blocker_human_review_block_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify evidence blocker human review block visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.evidence_blocker_never_production_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify evidence blocker never-production visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.evidence_blocker_arbitration_guard_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify evidence blocker arbitration guard visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.evidence_blocker_no_production_candidate_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify evidence blocker creates no production candidate"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.evidence_blocker_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify evidence blocker performs no direct memory write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.evidence_blocker_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify evidence blocker performs no accepted_samples write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_blocker_arbiter_static_handoff_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify review blocker arbiter static handoff"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_blocker_arbiter_guard_summary_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter guard summary"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_candidate_routes_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter candidate route visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_pass_route_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter pass route visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_reject_never_production_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter reject never-production visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_production_blocked_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter production blocked visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_memory_entry_blocked_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter memory entry blocked visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_no_production_candidate_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter creates no production candidate"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter performs no direct memory write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter performs no accepted_samples write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_draft_output_snapshot_present -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter draft output snapshot is present"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_draft_output_snapshot_matches_static_mock -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter draft output snapshot matches static mock"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_draft_output_snapshot_matches_adapter_fixture -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter draft output snapshot matches adapter fixture"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_snapshot_final_routes_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter snapshot final routes"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_snapshot_production_block_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter snapshot production block"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_snapshot_memory_entry_block_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter snapshot memory entry block"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_snapshot_no_production_candidate_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter snapshot creates no production candidate"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_snapshot_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter snapshot performs no direct memory write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.blocker_arbiter_snapshot_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify blocker arbiter snapshot performs no accepted_samples write"
    }
    foreach ($reviewReportCheck in @(
      @{ Flag = 'review_report_static_handoff_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport static handoff' },
      @{ Flag = 'review_report_guard_summary_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport guard summary' },
      @{ Flag = 'review_report_candidate_items_visible'; Message = 'Review Console Adapter handoff must verify ReviewReport candidate items are visible' },
      @{ Flag = 'review_report_pass_item_explained'; Message = 'Review Console Adapter handoff must verify ReviewReport pass item explanation' },
      @{ Flag = 'review_report_reject_item_explained'; Message = 'Review Console Adapter handoff must verify ReviewReport reject item explanation' },
      @{ Flag = 'review_report_memory_entry_blocked_visible'; Message = 'Review Console Adapter handoff must verify ReviewReport memory entry block visibility' },
      @{ Flag = 'review_report_production_promotion_blocked_visible'; Message = 'Review Console Adapter handoff must verify ReviewReport production promotion block visibility' },
      @{ Flag = 'review_report_never_production_visible'; Message = 'Review Console Adapter handoff must verify ReviewReport never-production visibility' },
      @{ Flag = 'review_report_draft_output_matches_static_mock'; Message = 'Review Console Adapter handoff must verify ReviewReport draft output matches static mock' },
      @{ Flag = 'review_report_no_daily_note_write_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport performs no DailyNote write' },
      @{ Flag = 'review_report_no_vcp_memory_write_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport performs no VCP memory write' },
      @{ Flag = 'review_report_no_accepted_samples_write_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport performs no accepted_samples write' },
      @{ Flag = 'review_report_no_production_candidate_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport creates no production candidate' },
      @{ Flag = 'review_report_no_provider_execution_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport performs no provider execution' },
      @{ Flag = 'review_report_draft_output_snapshot_present'; Message = 'Review Console Adapter handoff must verify ReviewReport draft output snapshot is present' },
      @{ Flag = 'review_report_draft_output_snapshot_matches_static_mock'; Message = 'Review Console Adapter handoff must verify ReviewReport draft output snapshot matches static mock' },
      @{ Flag = 'review_report_draft_output_snapshot_matches_adapter_fixture'; Message = 'Review Console Adapter handoff must verify ReviewReport draft output snapshot matches adapter fixture' },
      @{ Flag = 'review_report_snapshot_candidate_ids_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport snapshot candidate IDs' },
      @{ Flag = 'review_report_snapshot_pass_reject_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport snapshot pass/reject IDs' },
      @{ Flag = 'review_report_snapshot_memory_entry_block_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport snapshot memory entry block' },
      @{ Flag = 'review_report_snapshot_production_promotion_block_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport snapshot production promotion block' },
      @{ Flag = 'review_report_snapshot_writes_blocked_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport snapshot write block' },
      @{ Flag = 'review_report_snapshot_no_daily_note_write_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport snapshot performs no DailyNote write' },
      @{ Flag = 'review_report_snapshot_no_vcp_memory_write_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport snapshot performs no VCP memory write' },
      @{ Flag = 'review_report_snapshot_no_accepted_samples_write_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport snapshot performs no accepted_samples write' },
      @{ Flag = 'review_report_snapshot_no_production_candidate_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport snapshot creates no production candidate' },
      @{ Flag = 'review_report_snapshot_no_provider_execution_verified'; Message = 'Review Console Adapter handoff must verify ReviewReport snapshot performs no provider execution' }
    )) {
      if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.($reviewReportCheck.Flag) -ne $true) {
        Add-Failure $reviewReportCheck.Message
      }
    }
    foreach ($negativeReviewReportCheck in @(
      @{ Flag = 'review_report_negative_guard_static_handoff_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport static handoff' },
      @{ Flag = 'review_report_negative_guard_guard_summary_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport guard summary' },
      @{ Flag = 'review_report_negative_guard_memory_forbidden_visible'; Message = 'Review Console Adapter handoff must verify negative ReviewReport memory-forbidden visibility' },
      @{ Flag = 'review_report_negative_guard_never_production_visible'; Message = 'Review Console Adapter handoff must verify negative ReviewReport never-production visibility' },
      @{ Flag = 'review_report_negative_guard_unknown_failure_visible'; Message = 'Review Console Adapter handoff must verify negative ReviewReport unknown failure visibility' },
      @{ Flag = 'review_report_negative_guard_draft_output_matches_static_mock'; Message = 'Review Console Adapter handoff must verify negative ReviewReport draft output matches static mock' },
      @{ Flag = 'review_report_negative_guard_no_daily_note_write_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport performs no DailyNote write' },
      @{ Flag = 'review_report_negative_guard_no_vcp_memory_write_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport performs no VCP memory write' },
      @{ Flag = 'review_report_negative_guard_no_accepted_samples_write_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport performs no accepted_samples write' },
      @{ Flag = 'review_report_negative_guard_no_production_candidate_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport creates no production candidate' },
      @{ Flag = 'review_report_negative_guard_no_provider_execution_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport performs no provider execution' }
    )) {
      if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.($negativeReviewReportCheck.Flag) -ne $true) {
        Add-Failure $negativeReviewReportCheck.Message
      }
    }
    foreach ($negativeReviewReportSnapshotCheck in @(
      @{ Flag = 'review_report_negative_guard_draft_output_snapshot_present'; Message = 'Review Console Adapter handoff must verify negative ReviewReport draft output snapshot is present' },
      @{ Flag = 'review_report_negative_guard_draft_output_snapshot_matches_static_mock'; Message = 'Review Console Adapter handoff must verify negative ReviewReport draft output snapshot matches static mock' },
      @{ Flag = 'review_report_negative_guard_draft_output_snapshot_matches_adapter_fixture'; Message = 'Review Console Adapter handoff must verify negative ReviewReport draft output snapshot matches adapter fixture' },
      @{ Flag = 'review_report_negative_guard_snapshot_candidate_ids_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport snapshot candidate IDs' },
      @{ Flag = 'review_report_negative_guard_snapshot_reject_routes_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport snapshot reject routes' },
      @{ Flag = 'review_report_negative_guard_snapshot_memory_forbidden_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport snapshot memory-forbidden candidate' },
      @{ Flag = 'review_report_negative_guard_snapshot_never_production_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport snapshot never-production candidates' },
      @{ Flag = 'review_report_negative_guard_snapshot_no_daily_note_write_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport snapshot performs no DailyNote write' },
      @{ Flag = 'review_report_negative_guard_snapshot_no_vcp_memory_write_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport snapshot performs no VCP memory write' },
      @{ Flag = 'review_report_negative_guard_snapshot_no_accepted_samples_write_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport snapshot performs no accepted_samples write' },
      @{ Flag = 'review_report_negative_guard_snapshot_no_production_candidate_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport snapshot creates no production candidate' },
      @{ Flag = 'review_report_negative_guard_snapshot_no_provider_execution_verified'; Message = 'Review Console Adapter handoff must verify negative ReviewReport snapshot performs no provider execution' }
    )) {
      if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.($negativeReviewReportSnapshotCheck.Flag) -ne $true) {
        Add-Failure $negativeReviewReportSnapshotCheck.Message
      }
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.review_evidence_blocker_adapter_negative_static_handoff_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative static handoff"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_fixture_guard_summary_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative guard summary"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_memory_forbidden_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative memory-forbidden visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_never_production_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative never-production visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_fixture_match_visible -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative fixture match visibility"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_no_production_candidate_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative creates no production candidate"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative performs no direct memory write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative performs no accepted_samples write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_draft_output_snapshot_present -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative draft output snapshot is present"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_draft_output_snapshot_matches_static_mock -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative draft output snapshot matches static mock"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_draft_output_snapshot_matches_adapter_fixture -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative draft output snapshot matches adapter fixture"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_snapshot_memory_forbidden_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative snapshot memory-forbidden candidate"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_snapshot_never_production_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative snapshot never-production candidates"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_snapshot_no_production_candidate_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative snapshot creates no production candidate"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_snapshot_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative snapshot performs no direct memory write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.adapter_negative_snapshot_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review Console Adapter handoff must verify adapter negative snapshot performs no accepted_samples write"
    }
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.file_write_performed -ne $false) {
      Add-Failure "Review Console Adapter handoff validation must not write files"
    }
  }

  $reviewReportNegativeGuardMatrixOutput = & node (Join-Path $Root 'scripts/validate_review_report_negative_guard_regression_matrix.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "ReviewReport negative guard regression matrix validation exited with failure"
  } else {
    $reviewReportNegativeGuardMatrix = ($reviewReportNegativeGuardMatrixOutput -join "`n") | ConvertFrom-Json
    if ($reviewReportNegativeGuardMatrix.passed -ne $true) {
      Add-Failure "ReviewReport negative guard regression matrix validation must report passed true"
    }
    foreach ($reviewReportNegativeGuardMatrixCheck in @(
      @{ Flag = 'review_report_negative_guard_matrix_present'; Message = 'ReviewReport negative guard regression matrix must be present' },
      @{ Flag = 'review_report_negative_guard_surface_consensus_verified'; Message = 'ReviewReport negative guard regression matrix must verify surface consensus' },
      @{ Flag = 'review_report_negative_guard_adapter_contract_surface_verified'; Message = 'ReviewReport negative guard regression matrix must verify adapter contract surface' },
      @{ Flag = 'review_report_negative_guard_console_guard_surface_verified'; Message = 'ReviewReport negative guard regression matrix must verify console guard surface' },
      @{ Flag = 'review_report_negative_guard_static_mock_surface_verified'; Message = 'ReviewReport negative guard regression matrix must verify static mock surface' },
      @{ Flag = 'review_report_negative_guard_draft_snapshot_surface_verified'; Message = 'ReviewReport negative guard regression matrix must verify draft snapshot surface' },
      @{ Flag = 'review_report_negative_guard_reject_routes_verified'; Message = 'ReviewReport negative guard regression matrix must verify reject routes' },
      @{ Flag = 'review_report_negative_guard_memory_forbidden_verified'; Message = 'ReviewReport negative guard regression matrix must verify memory forbidden' },
      @{ Flag = 'review_report_negative_guard_never_production_verified'; Message = 'ReviewReport negative guard regression matrix must verify never production' },
      @{ Flag = 'review_report_negative_guard_unknown_failure_verified'; Message = 'ReviewReport negative guard regression matrix must verify unknown failure tags' },
      @{ Flag = 'review_report_negative_guard_no_daily_note_write_verified'; Message = 'ReviewReport negative guard regression matrix must verify no DailyNote write' },
      @{ Flag = 'review_report_negative_guard_no_vcp_memory_write_verified'; Message = 'ReviewReport negative guard regression matrix must verify no VCP memory write' },
      @{ Flag = 'review_report_negative_guard_no_accepted_samples_write_verified'; Message = 'ReviewReport negative guard regression matrix must verify no accepted_samples write' },
      @{ Flag = 'review_report_negative_guard_no_production_candidate_verified'; Message = 'ReviewReport negative guard regression matrix must verify no production candidate' },
      @{ Flag = 'review_report_negative_guard_no_provider_plugin_api_image_verified'; Message = 'ReviewReport negative guard regression matrix must verify no provider/plugin/API/image effects' }
    )) {
      if ($reviewReportNegativeGuardMatrix.review_report_negative_guard_regression_matrix.($reviewReportNegativeGuardMatrixCheck.Flag) -ne $true) {
        Add-Failure $reviewReportNegativeGuardMatrixCheck.Message
      }
    }
    if ($reviewReportNegativeGuardMatrix.review_report_negative_guard_regression_matrix.file_write_performed -ne $false) {
      Add-Failure "ReviewReport negative guard regression matrix validation must not write files"
    }
  }

  $reviewReportRouteSummaryOutput = & node (Join-Path $Root 'scripts/validate_review_report_route_summary.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "ReviewReport route summary validation exited with failure"
  } else {
    $reviewReportRouteSummary = ($reviewReportRouteSummaryOutput -join "`n") | ConvertFrom-Json
    if ($reviewReportRouteSummary.passed -ne $true) {
      Add-Failure "ReviewReport route summary validation must report passed true"
    }
    foreach ($reviewReportRouteSummaryCheck in @(
      @{ Flag = 'review_report_route_summary_present'; Message = 'ReviewReport route summary must be present' },
      @{ Flag = 'review_report_route_summary_matches_positive_review_report'; Message = 'ReviewReport route summary must match positive ReviewReport' },
      @{ Flag = 'review_report_route_summary_matches_negative_review_report'; Message = 'ReviewReport route summary must match negative ReviewReport' },
      @{ Flag = 'review_report_route_summary_matches_negative_matrix'; Message = 'ReviewReport route summary must match negative matrix' },
      @{ Flag = 'review_report_route_summary_groups_verified'; Message = 'ReviewReport route summary must verify route groups' },
      @{ Flag = 'review_report_route_summary_pass_route_verified'; Message = 'ReviewReport route summary must verify pass route' },
      @{ Flag = 'review_report_route_summary_reject_failure_learning_route_verified'; Message = 'ReviewReport route summary must verify reject failure-learning route' },
      @{ Flag = 'review_report_route_summary_memory_forbidden_route_verified'; Message = 'ReviewReport route summary must verify memory-forbidden route' },
      @{ Flag = 'review_report_route_summary_unknown_failure_verified'; Message = 'ReviewReport route summary must verify unknown failure' },
      @{ Flag = 'review_report_route_summary_memory_entry_blocked'; Message = 'ReviewReport route summary must block memory entry' },
      @{ Flag = 'review_report_route_summary_production_blocked'; Message = 'ReviewReport route summary must block production' },
      @{ Flag = 'review_report_route_summary_never_production_verified'; Message = 'ReviewReport route summary must verify never-production' },
      @{ Flag = 'review_report_route_summary_no_daily_note_write_verified'; Message = 'ReviewReport route summary must verify no DailyNote write' },
      @{ Flag = 'review_report_route_summary_no_vcp_memory_write_verified'; Message = 'ReviewReport route summary must verify no VCP memory write' },
      @{ Flag = 'review_report_route_summary_no_accepted_samples_write_verified'; Message = 'ReviewReport route summary must verify no accepted_samples write' },
      @{ Flag = 'review_report_route_summary_no_production_candidate_verified'; Message = 'ReviewReport route summary must verify no production candidate' },
      @{ Flag = 'review_report_route_summary_no_provider_plugin_api_image_verified'; Message = 'ReviewReport route summary must verify no provider/plugin/API/image effects' }
    )) {
      if ($reviewReportRouteSummary.review_report_route_summary.($reviewReportRouteSummaryCheck.Flag) -ne $true) {
        Add-Failure $reviewReportRouteSummaryCheck.Message
      }
    }
    if ($reviewReportRouteSummary.review_report_route_summary.file_write_performed -ne $false) {
      Add-Failure "ReviewReport route summary validation must not write files"
    }
  }

  $reviewReportAdmissionMatrixOutput = & node (Join-Path $Root 'scripts/validate_review_report_admission_control_matrix.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "ReviewReport admission control matrix validation exited with failure"
  } else {
    $reviewReportAdmissionMatrix = ($reviewReportAdmissionMatrixOutput -join "`n") | ConvertFrom-Json
    if ($reviewReportAdmissionMatrix.passed -ne $true) {
      Add-Failure "ReviewReport admission control matrix validation must report passed true"
    }
    foreach ($reviewReportAdmissionMatrixCheck in @(
      @{ Flag = 'review_report_admission_matrix_present'; Message = 'ReviewReport admission matrix must be present' },
      @{ Flag = 'review_report_admission_matrix_matches_route_summary'; Message = 'ReviewReport admission matrix must match route summary' },
      @{ Flag = 'review_report_admission_pass_draft_review_only_verified'; Message = 'ReviewReport admission matrix must verify pass draft-review route' },
      @{ Flag = 'review_report_admission_reject_failure_learning_verified'; Message = 'ReviewReport admission matrix must verify reject failure-learning route' },
      @{ Flag = 'review_report_admission_unknown_memory_forbidden_verified'; Message = 'ReviewReport admission matrix must verify unknown memory-forbidden route' },
      @{ Flag = 'review_report_admission_memory_entry_blocked_now'; Message = 'ReviewReport admission matrix must block memory entry now' },
      @{ Flag = 'review_report_admission_production_blocked_now'; Message = 'ReviewReport admission matrix must block production now' },
      @{ Flag = 'review_report_admission_accepted_samples_blocked_now'; Message = 'ReviewReport admission matrix must block accepted_samples now' },
      @{ Flag = 'review_report_admission_never_production_verified'; Message = 'ReviewReport admission matrix must verify never-production' },
      @{ Flag = 'review_report_admission_no_daily_note_write_verified'; Message = 'ReviewReport admission matrix must verify no DailyNote write' },
      @{ Flag = 'review_report_admission_no_vcp_memory_write_verified'; Message = 'ReviewReport admission matrix must verify no VCP memory write' },
      @{ Flag = 'review_report_admission_no_accepted_samples_write_verified'; Message = 'ReviewReport admission matrix must verify no accepted_samples write' },
      @{ Flag = 'review_report_admission_no_production_candidate_verified'; Message = 'ReviewReport admission matrix must verify no production candidate' },
      @{ Flag = 'review_report_admission_no_provider_plugin_api_image_verified'; Message = 'ReviewReport admission matrix must verify no provider/plugin/API/image effects' }
    )) {
      if ($reviewReportAdmissionMatrix.review_report_admission_control_matrix.($reviewReportAdmissionMatrixCheck.Flag) -ne $true) {
        Add-Failure $reviewReportAdmissionMatrixCheck.Message
      }
    }
    if ($reviewReportAdmissionMatrix.review_report_admission_control_matrix.file_write_performed -ne $false) {
      Add-Failure "ReviewReport admission control matrix validation must not write files"
    }
  }

  $reviewReportProductionExclusionOutput = & node (Join-Path $Root 'scripts/validate_review_report_production_exclusion_register.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "ReviewReport production exclusion register validation exited with failure"
  } else {
    $reviewReportProductionExclusion = ($reviewReportProductionExclusionOutput -join "`n") | ConvertFrom-Json
    if ($reviewReportProductionExclusion.passed -ne $true) {
      Add-Failure "ReviewReport production exclusion register validation must report passed true"
    }
    foreach ($reviewReportProductionExclusionCheck in @(
      @{ Flag = 'review_report_production_exclusion_register_present'; Message = 'ReviewReport production exclusion register must be present' },
      @{ Flag = 'review_report_production_exclusion_matches_admission_matrix'; Message = 'ReviewReport production exclusion register must match admission matrix' },
      @{ Flag = 'review_report_production_exclusion_matches_route_summary'; Message = 'ReviewReport production exclusion register must match route summary' },
      @{ Flag = 'review_report_production_exclusion_all_rejects_registered'; Message = 'ReviewReport production exclusion register must register all rejects' },
      @{ Flag = 'review_report_production_exclusion_no_pass_registered'; Message = 'ReviewReport production exclusion register must not register pass candidates' },
      @{ Flag = 'review_report_production_exclusion_never_production_verified'; Message = 'ReviewReport production exclusion register must verify never-production' },
      @{ Flag = 'review_report_production_exclusion_unknown_memory_forbidden_verified'; Message = 'ReviewReport production exclusion register must verify unknown memory-forbidden exclusion' },
      @{ Flag = 'review_report_production_exclusion_removal_blocked'; Message = 'ReviewReport production exclusion register must block exclusion removal' },
      @{ Flag = 'review_report_production_exclusion_no_daily_note_write_verified'; Message = 'ReviewReport production exclusion register must verify no DailyNote write' },
      @{ Flag = 'review_report_production_exclusion_no_vcp_memory_write_verified'; Message = 'ReviewReport production exclusion register must verify no VCP memory write' },
      @{ Flag = 'review_report_production_exclusion_no_accepted_samples_write_verified'; Message = 'ReviewReport production exclusion register must verify no accepted_samples write' },
      @{ Flag = 'review_report_production_exclusion_no_production_candidate_verified'; Message = 'ReviewReport production exclusion register must verify no production candidate' },
      @{ Flag = 'review_report_production_exclusion_no_provider_plugin_api_image_verified'; Message = 'ReviewReport production exclusion register must verify no provider/plugin/API/image effects' }
    )) {
      if ($reviewReportProductionExclusion.review_report_production_exclusion_register.($reviewReportProductionExclusionCheck.Flag) -ne $true) {
        Add-Failure $reviewReportProductionExclusionCheck.Message
      }
    }
    if ($reviewReportProductionExclusion.review_report_production_exclusion_register.file_write_performed -ne $false) {
      Add-Failure "ReviewReport production exclusion register validation must not write files"
    }
  }

  $reviewReportMemoryAdmissionOutput = & node (Join-Path $Root 'scripts/validate_review_report_memory_admission_register.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "ReviewReport memory admission register validation exited with failure"
  } else {
    $reviewReportMemoryAdmission = ($reviewReportMemoryAdmissionOutput -join "`n") | ConvertFrom-Json
    if ($reviewReportMemoryAdmission.passed -ne $true) {
      Add-Failure "ReviewReport memory admission register validation must report passed true"
    }
    foreach ($reviewReportMemoryAdmissionCheck in @(
      @{ Flag = 'review_report_memory_admission_register_present'; Message = 'ReviewReport memory admission register must be present' },
      @{ Flag = 'review_report_memory_admission_candidate_ids_unique'; Message = 'ReviewReport memory admission register must have unique candidate ids' },
      @{ Flag = 'review_report_memory_admission_exact_candidate_set_verified'; Message = 'ReviewReport memory admission register must verify exact candidate set' },
      @{ Flag = 'review_report_memory_admission_matches_admission_matrix'; Message = 'ReviewReport memory admission register must match admission matrix' },
      @{ Flag = 'review_report_memory_admission_matches_route_summary'; Message = 'ReviewReport memory admission register must match route summary' },
      @{ Flag = 'review_report_memory_admission_matches_production_exclusion_register'; Message = 'ReviewReport memory admission register must match production exclusion register' },
      @{ Flag = 'review_report_memory_admission_memory_delta_draft_only_verified'; Message = 'ReviewReport memory admission register must verify memory_delta draft only' },
      @{ Flag = 'review_report_memory_admission_failure_lesson_draft_only_verified'; Message = 'ReviewReport memory admission register must verify failure lesson draft only' },
      @{ Flag = 'review_report_memory_admission_unknown_failure_memory_forbidden_verified'; Message = 'ReviewReport memory admission register must verify unknown failure memory-forbidden' },
      @{ Flag = 'review_report_memory_admission_memory_entry_blocked_now'; Message = 'ReviewReport memory admission register must block memory entries now' },
      @{ Flag = 'review_report_memory_admission_all_drafts_require_human_approval'; Message = 'ReviewReport memory admission register drafts must require human approval' },
      @{ Flag = 'review_report_memory_admission_no_direct_memory_write_verified'; Message = 'ReviewReport memory admission register must verify no direct memory write' },
      @{ Flag = 'review_report_memory_admission_no_daily_note_write_verified'; Message = 'ReviewReport memory admission register must verify no DailyNote write' },
      @{ Flag = 'review_report_memory_admission_no_vcp_memory_write_verified'; Message = 'ReviewReport memory admission register must verify no VCP memory write' },
      @{ Flag = 'review_report_memory_admission_no_accepted_samples_write_verified'; Message = 'ReviewReport memory admission register must verify no accepted_samples write' },
      @{ Flag = 'review_report_memory_admission_no_production_candidate_verified'; Message = 'ReviewReport memory admission register must verify no production candidate' },
      @{ Flag = 'review_report_memory_admission_no_provider_plugin_api_image_verified'; Message = 'ReviewReport memory admission register must verify no provider/plugin/API/image effects' }
    )) {
      if ($reviewReportMemoryAdmission.review_report_memory_admission_register.($reviewReportMemoryAdmissionCheck.Flag) -ne $true) {
        Add-Failure $reviewReportMemoryAdmissionCheck.Message
      }
    }
    if ($reviewReportMemoryAdmission.review_report_memory_admission_register.file_write_performed -ne $false) {
      Add-Failure "ReviewReport memory admission register validation must not write files"
    }
  }

  $reviewReportMemoryDeltaDraftOutput = & node (Join-Path $Root 'scripts/validate_review_report_memory_delta_draft_register.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "ReviewReport memory delta draft register validation exited with failure"
  } else {
    $reviewReportMemoryDeltaDraft = ($reviewReportMemoryDeltaDraftOutput -join "`n") | ConvertFrom-Json
    if ($reviewReportMemoryDeltaDraft.passed -ne $true) {
      Add-Failure "ReviewReport memory delta draft register validation must report passed true"
    }
    foreach ($reviewReportMemoryDeltaDraftCheck in @(
      @{ Flag = 'review_report_memory_delta_draft_register_present'; Message = 'ReviewReport memory delta draft register must be present' },
      @{ Flag = 'review_report_memory_delta_draft_candidate_ids_unique'; Message = 'ReviewReport memory delta draft register must have unique candidate ids' },
      @{ Flag = 'review_report_memory_delta_draft_exact_candidate_set_verified'; Message = 'ReviewReport memory delta draft register must verify exact draft candidate set' },
      @{ Flag = 'review_report_memory_delta_draft_forbidden_candidate_set_verified'; Message = 'ReviewReport memory delta draft register must verify forbidden candidate set' },
      @{ Flag = 'review_report_memory_delta_draft_matches_memory_admission_register'; Message = 'ReviewReport memory delta draft register must match memory admission register' },
      @{ Flag = 'review_report_memory_delta_draft_accepted_candidate_draft_verified'; Message = 'ReviewReport memory delta draft register must verify accepted candidate draft' },
      @{ Flag = 'review_report_memory_delta_draft_failure_lesson_draft_verified'; Message = 'ReviewReport memory delta draft register must verify failure lesson draft' },
      @{ Flag = 'review_report_memory_delta_draft_unknown_failure_forbidden_verified'; Message = 'ReviewReport memory delta draft register must verify unknown failure forbidden' },
      @{ Flag = 'review_report_memory_delta_draft_chinese_body_verified'; Message = 'ReviewReport memory delta draft register must verify Chinese draft body' },
      @{ Flag = 'review_report_memory_delta_draft_human_approval_required'; Message = 'ReviewReport memory delta draft register must require human approval' },
      @{ Flag = 'review_report_memory_delta_draft_no_memory_entry_created'; Message = 'ReviewReport memory delta draft register must not create memory entry' },
      @{ Flag = 'review_report_memory_delta_draft_no_direct_memory_write_verified'; Message = 'ReviewReport memory delta draft register must verify no direct memory write' },
      @{ Flag = 'review_report_memory_delta_draft_no_daily_note_write_verified'; Message = 'ReviewReport memory delta draft register must verify no DailyNote write' },
      @{ Flag = 'review_report_memory_delta_draft_no_vcp_memory_write_verified'; Message = 'ReviewReport memory delta draft register must verify no VCP memory write' },
      @{ Flag = 'review_report_memory_delta_draft_no_accepted_samples_write_verified'; Message = 'ReviewReport memory delta draft register must verify no accepted_samples write' },
      @{ Flag = 'review_report_memory_delta_draft_no_production_candidate_verified'; Message = 'ReviewReport memory delta draft register must verify no production candidate' },
      @{ Flag = 'review_report_memory_delta_draft_no_provider_plugin_api_image_verified'; Message = 'ReviewReport memory delta draft register must verify no provider/plugin/API/image effects' }
    )) {
      if ($reviewReportMemoryDeltaDraft.review_report_memory_delta_draft_register.($reviewReportMemoryDeltaDraftCheck.Flag) -ne $true) {
        Add-Failure $reviewReportMemoryDeltaDraftCheck.Message
      }
    }
    if ($reviewReportMemoryDeltaDraft.review_report_memory_delta_draft_register.file_write_performed -ne $false) {
      Add-Failure "ReviewReport memory delta draft register validation must not write files"
    }
  }

  $reviewReportProtocolCloseoutOutput = & node (Join-Path $Root 'scripts/validate_review_report_protocol_final_closeout.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "ReviewReport protocol final closeout validation exited with failure"
  } else {
    $reviewReportProtocolCloseout = ($reviewReportProtocolCloseoutOutput -join "`n") | ConvertFrom-Json
    if ($reviewReportProtocolCloseout.passed -ne $true) {
      Add-Failure "ReviewReport protocol final closeout validation must report passed true"
    }
    foreach ($reviewReportProtocolCloseoutCheck in @(
      @{ Flag = 'review_report_protocol_final_closeout_present'; Message = 'ReviewReport protocol final closeout must be present' },
      @{ Flag = 'review_report_protocol_final_closeout_candidate_ids_unique'; Message = 'ReviewReport protocol final closeout must have unique candidate ids' },
      @{ Flag = 'review_report_protocol_final_closeout_exact_candidate_set_verified'; Message = 'ReviewReport protocol final closeout must verify exact candidate set' },
      @{ Flag = 'review_report_protocol_final_closeout_route_summary_binding_verified'; Message = 'ReviewReport protocol final closeout must verify route summary binding' },
      @{ Flag = 'review_report_protocol_final_closeout_admission_binding_verified'; Message = 'ReviewReport protocol final closeout must verify admission binding' },
      @{ Flag = 'review_report_protocol_final_closeout_production_exclusion_binding_verified'; Message = 'ReviewReport protocol final closeout must verify production exclusion binding' },
      @{ Flag = 'review_report_protocol_final_closeout_memory_admission_binding_verified'; Message = 'ReviewReport protocol final closeout must verify memory admission binding' },
      @{ Flag = 'review_report_protocol_final_closeout_memory_delta_draft_binding_verified'; Message = 'ReviewReport protocol final closeout must verify memory delta draft binding' },
      @{ Flag = 'review_report_protocol_final_closeout_pass_path_verified'; Message = 'ReviewReport protocol final closeout must verify pass path' },
      @{ Flag = 'review_report_protocol_final_closeout_mapped_reject_path_verified'; Message = 'ReviewReport protocol final closeout must verify mapped reject path' },
      @{ Flag = 'review_report_protocol_final_closeout_unknown_failure_path_verified'; Message = 'ReviewReport protocol final closeout must verify unknown failure path' },
      @{ Flag = 'review_report_protocol_final_closeout_no_memory_write_verified'; Message = 'ReviewReport protocol final closeout must verify no memory write' },
      @{ Flag = 'review_report_protocol_final_closeout_no_production_write_verified'; Message = 'ReviewReport protocol final closeout must verify no production write' },
      @{ Flag = 'review_report_protocol_final_closeout_no_provider_plugin_api_image_verified'; Message = 'ReviewReport protocol final closeout must verify no provider/plugin/API/image effects' },
      @{ Flag = 'review_report_protocol_final_closeout_local_only_verified'; Message = 'ReviewReport protocol final closeout must be local only' }
    )) {
      if ($reviewReportProtocolCloseout.review_report_protocol_final_closeout.($reviewReportProtocolCloseoutCheck.Flag) -ne $true) {
        Add-Failure $reviewReportProtocolCloseoutCheck.Message
      }
    }
    if ($reviewReportProtocolCloseout.review_report_protocol_final_closeout.file_write_performed -ne $false) {
      Add-Failure "ReviewReport protocol final closeout validation must not write files"
    }
  }

  $reviewConsoleBlockerArbiterMatrixOutput = & node (Join-Path $Root 'scripts/validate_review_console_blocker_arbiter_regression_matrix.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console blocker arbiter regression matrix validation exited with failure"
  } else {
    $reviewConsoleBlockerArbiterMatrix = ($reviewConsoleBlockerArbiterMatrixOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleBlockerArbiterMatrix.passed -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix validation must report passed true"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_matrix_present -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must be present"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_regression_matrix_refreshed_v14_062 -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify v14.062 refresh"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_surface_consensus_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify surface consensus"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_protocol_surface_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify protocol surface"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_decision_package_surface_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify decision package surface"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_evidence_blocker_surface_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify evidence blocker surface"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_adapter_negative_surface_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify adapter negative surface"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_draft_output_snapshot_surface_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify draft output snapshot surface"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_route_snapshot_surface_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify route snapshot surface"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_route_snapshot_final_routes_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify route snapshot final routes"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_route_snapshot_production_block_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify route snapshot production block"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_route_snapshot_memory_block_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify route snapshot memory block"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_memory_forbidden_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify memory-forbidden consensus"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_never_production_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify never-production consensus"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_production_exclusion_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify production-exclusion consensus"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_no_production_candidate_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify no production candidate"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify no direct memory write"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify no accepted_samples write"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.blocker_arbiter_no_provider_plugin_api_image_verified -ne $true) {
      Add-Failure "Review Console blocker arbiter regression matrix must verify no provider/plugin/API/image effects"
    }
    if ($reviewConsoleBlockerArbiterMatrix.review_console_blocker_arbiter_regression_matrix.file_write_performed -ne $false) {
      Add-Failure "Review Console blocker arbiter regression matrix validation must not write files"
    }
  }

  $reviewBlockerArbiterRouteSummaryOutput = & node (Join-Path $Root 'scripts/validate_review_blocker_arbiter_route_summary.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review blocker arbiter route summary validation exited with failure"
  } else {
    $reviewBlockerArbiterRouteSummary = ($reviewBlockerArbiterRouteSummaryOutput -join "`n") | ConvertFrom-Json
    if ($reviewBlockerArbiterRouteSummary.passed -ne $true) {
      Add-Failure "Review blocker arbiter route summary validation must report passed true"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_present -ne $true) {
      Add-Failure "Review blocker arbiter route summary must be present"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_matches_snapshot -ne $true) {
      Add-Failure "Review blocker arbiter route summary must match snapshot"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_matches_adapter_arbiter -ne $true) {
      Add-Failure "Review blocker arbiter route summary must match adapter arbiter"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_pass_reason_verified -ne $true) {
      Add-Failure "Review blocker arbiter route summary must verify pass reasons"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_reject_reason_verified -ne $true) {
      Add-Failure "Review blocker arbiter route summary must verify reject reasons"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_memory_rules_verified -ne $true) {
      Add-Failure "Review blocker arbiter route summary must verify memory rules"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_production_rules_verified -ne $true) {
      Add-Failure "Review blocker arbiter route summary must verify production rules"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_never_production_verified -ne $true) {
      Add-Failure "Review blocker arbiter route summary must verify never-production route"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_no_production_candidate_verified -ne $true) {
      Add-Failure "Review blocker arbiter route summary must verify no production candidate"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review blocker arbiter route summary must verify no direct memory write"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.route_summary_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review blocker arbiter route summary must verify no accepted_samples write"
    }
    if ($reviewBlockerArbiterRouteSummary.review_blocker_arbiter_route_summary.file_write_performed -ne $false) {
      Add-Failure "Review blocker arbiter route summary validation must not write files"
    }
  }

  $reviewMemoryAdmissionControlOutput = & node (Join-Path $Root 'scripts/validate_review_memory_admission_control.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review memory admission control validation exited with failure"
  } else {
    $reviewMemoryAdmissionControl = ($reviewMemoryAdmissionControlOutput -join "`n") | ConvertFrom-Json
    if ($reviewMemoryAdmissionControl.passed -ne $true) {
      Add-Failure "Review memory admission control validation must report passed true"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.memory_admission_control_present -ne $true) {
      Add-Failure "Review memory admission control must be present"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.memory_admission_matches_route_summary -ne $true) {
      Add-Failure "Review memory admission control must match route summary"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.memory_admission_pass_draft_verified -ne $true) {
      Add-Failure "Review memory admission control must verify pass draft route"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.memory_admission_reject_failure_learning_verified -ne $true) {
      Add-Failure "Review memory admission control must verify reject failure-learning route"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.memory_admission_human_approval_required -ne $true) {
      Add-Failure "Review memory admission control must require human memory approval"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.memory_admission_daily_note_blocked -ne $true) {
      Add-Failure "Review memory admission control must block DailyNote writes"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.memory_admission_vcp_memory_blocked -ne $true) {
      Add-Failure "Review memory admission control must block VCP memory writes"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.memory_admission_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review memory admission control must verify no direct memory write"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.memory_admission_no_production_candidate_verified -ne $true) {
      Add-Failure "Review memory admission control must verify no production candidate"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.memory_admission_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review memory admission control must verify no accepted_samples write"
    }
    if ($reviewMemoryAdmissionControl.review_memory_admission_control.file_write_performed -ne $false) {
      Add-Failure "Review memory admission control validation must not write files"
    }
  }

  $reviewProductionAdmissionControlOutput = & node (Join-Path $Root 'scripts/validate_review_production_admission_control.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review production admission control validation exited with failure"
  } else {
    $reviewProductionAdmissionControl = ($reviewProductionAdmissionControlOutput -join "`n") | ConvertFrom-Json
    if ($reviewProductionAdmissionControl.passed -ne $true) {
      Add-Failure "Review production admission control validation must report passed true"
    }
    if ($reviewProductionAdmissionControl.review_production_admission_control.production_admission_control_present -ne $true) {
      Add-Failure "Review production admission control must be present"
    }
    if ($reviewProductionAdmissionControl.review_production_admission_control.production_admission_matches_route_summary -ne $true) {
      Add-Failure "Review production admission control must match route summary"
    }
    if ($reviewProductionAdmissionControl.review_production_admission_control.production_admission_matches_memory_admission -ne $true) {
      Add-Failure "Review production admission control must match memory admission"
    }
    if ($reviewProductionAdmissionControl.review_production_admission_control.production_admission_pass_blocked_until_human_review_verified -ne $true) {
      Add-Failure "Review production admission control must verify pass candidate human-review block"
    }
    if ($reviewProductionAdmissionControl.review_production_admission_control.production_admission_reject_never_production_verified -ne $true) {
      Add-Failure "Review production admission control must verify reject candidate never-production"
    }
    if ($reviewProductionAdmissionControl.review_production_admission_control.production_admission_no_production_candidate_verified -ne $true) {
      Add-Failure "Review production admission control must verify no production candidate"
    }
    if ($reviewProductionAdmissionControl.review_production_admission_control.production_admission_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review production admission control must verify no accepted_samples write"
    }
    if ($reviewProductionAdmissionControl.review_production_admission_control.production_admission_provider_execution_blocked -ne $true) {
      Add-Failure "Review production admission control must block provider execution"
    }
    if ($reviewProductionAdmissionControl.review_production_admission_control.file_write_performed -ne $false) {
      Add-Failure "Review production admission control validation must not write files"
    }
  }

  $reviewAdmissionControlMatrixOutput = & node (Join-Path $Root 'scripts/validate_review_admission_control_matrix.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review admission control matrix validation exited with failure"
  } else {
    $reviewAdmissionControlMatrix = ($reviewAdmissionControlMatrixOutput -join "`n") | ConvertFrom-Json
    if ($reviewAdmissionControlMatrix.passed -ne $true) {
      Add-Failure "Review admission control matrix validation must report passed true"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.admission_matrix_present -ne $true) {
      Add-Failure "Review admission control matrix must be present"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.admission_matrix_matches_memory_admission -ne $true) {
      Add-Failure "Review admission control matrix must match memory admission"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.admission_matrix_matches_production_admission -ne $true) {
      Add-Failure "Review admission control matrix must match production admission"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.admission_matrix_pass_candidate_draft_only_verified -ne $true) {
      Add-Failure "Review admission control matrix must verify pass candidate draft-only route"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.admission_matrix_reject_candidate_failure_learning_never_production_verified -ne $true) {
      Add-Failure "Review admission control matrix must verify reject candidate failure-learning never-production route"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.admission_matrix_all_memory_writes_blocked -ne $true) {
      Add-Failure "Review admission control matrix must block all memory writes"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.admission_matrix_all_production_writes_blocked -ne $true) {
      Add-Failure "Review admission control matrix must block all production writes"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.admission_matrix_no_provider_execution_verified -ne $true) {
      Add-Failure "Review admission control matrix must block provider execution"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.admission_matrix_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review admission control matrix must verify no accepted_samples write"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.admission_matrix_no_production_candidate_verified -ne $true) {
      Add-Failure "Review admission control matrix must verify no production candidate"
    }
    if ($reviewAdmissionControlMatrix.review_admission_control_matrix.file_write_performed -ne $false) {
      Add-Failure "Review admission control matrix validation must not write files"
    }
  }

  $reviewReportContractOutput = & node (Join-Path $Root 'scripts/validate_review_report_contract.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review report contract validation exited with failure"
  } else {
    $reviewReportContract = ($reviewReportContractOutput -join "`n") | ConvertFrom-Json
    if ($reviewReportContract.passed -ne $true) {
      Add-Failure "Review report contract validation must report passed true"
    }
    if ($reviewReportContract.review_report_contract.review_report_contract_present -ne $true) {
      Add-Failure "Review report contract must be present"
    }
    if ($reviewReportContract.review_report_contract.review_report_matches_route_summary -ne $true) {
      Add-Failure "Review report contract must match route summary"
    }
    if ($reviewReportContract.review_report_contract.review_report_matches_admission_matrix -ne $true) {
      Add-Failure "Review report contract must match admission matrix"
    }
    if ($reviewReportContract.review_report_contract.review_report_pass_candidate_explained -ne $true) {
      Add-Failure "Review report contract must explain pass candidate"
    }
    if ($reviewReportContract.review_report_contract.review_report_reject_candidate_explained -ne $true) {
      Add-Failure "Review report contract must explain reject candidate"
    }
    if ($reviewReportContract.review_report_contract.review_report_memory_entry_blocked -ne $true) {
      Add-Failure "Review report contract must block memory entry"
    }
    if ($reviewReportContract.review_report_contract.review_report_production_blocked -ne $true) {
      Add-Failure "Review report contract must block production"
    }
    if ($reviewReportContract.review_report_contract.review_report_never_production_verified -ne $true) {
      Add-Failure "Review report contract must verify never-production"
    }
    if ($reviewReportContract.review_report_contract.review_report_no_direct_memory_write_verified -ne $true) {
      Add-Failure "Review report contract must verify no direct memory write"
    }
    if ($reviewReportContract.review_report_contract.review_report_no_accepted_samples_write_verified -ne $true) {
      Add-Failure "Review report contract must verify no accepted_samples write"
    }
    if ($reviewReportContract.review_report_contract.review_report_no_production_candidate_verified -ne $true) {
      Add-Failure "Review report contract must verify no production candidate"
    }
    if ($reviewReportContract.review_report_contract.file_write_performed -ne $false) {
      Add-Failure "Review report contract validation must not write files"
    }
  }

  if ($runHistoricalCurrentStateValidators) {
  $v5LocalSyncReadinessOutput = & node (Join-Path $Root 'scripts/validate_v5_local_sync_readiness.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v5.4 local sync readiness validation exited with failure"
  } else {
    $v5LocalSyncReadiness = ($v5LocalSyncReadinessOutput -join "`n") | ConvertFrom-Json
    if ($v5LocalSyncReadiness.passed -ne $true) {
      Add-Failure "v5.4 local sync readiness validation must report passed true"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.origin_master_short -ne '367d3c9') {
      Add-Failure "v5.4 local sync readiness must record origin master baseline 367d3c9"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.local_head_short -ne 'b04e253') {
      Add-Failure "v5.4 local sync readiness must record local head b04e253"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.pending_local_commit_count -ne 3) {
      Add-Failure "v5.4 local sync readiness must record 3 pending local commits"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.local_commit_chain_ordered -ne $true) {
      Add-Failure "v5.4 local sync readiness must verify ordered commit chain"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.board_commit_chain_current -ne $true) {
      Add-Failure "v5.4 local sync readiness must verify agent board commit chain"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.push_authorized -ne $false) {
      Add-Failure "v5.4 local sync readiness must not authorize push"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.tag_authorized -ne $false) {
      Add-Failure "v5.4 local sync readiness must not authorize tag"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.pr_authorized -ne $false) {
      Add-Failure "v5.4 local sync readiness must not authorize PR"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.release_authorized -ne $false) {
      Add-Failure "v5.4 local sync readiness must not authorize release"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.remote_write_performed -ne $false) {
      Add-Failure "v5.4 local sync readiness must not perform remote write"
    }
    if ($v5LocalSyncReadiness.local_sync_readiness.file_write_performed -ne $false) {
      Add-Failure "v5.4 local sync readiness validation must not write files"
    }
  }

  $v5PostCommitReconciliationOutput = & node (Join-Path $Root 'scripts/validate_v5_post_commit_reconciliation.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v5.5 post-commit reconciliation validation exited with failure"
  } else {
    $v5PostCommitReconciliation = ($v5PostCommitReconciliationOutput -join "`n") | ConvertFrom-Json
    if ($v5PostCommitReconciliation.passed -ne $true) {
      Add-Failure "v5.5 post-commit reconciliation validation must report passed true"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.origin_master_short -ne '367d3c9') {
      Add-Failure "v5.5 post-commit reconciliation must record origin master baseline 367d3c9"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.committed_checkpoint_short -ne 'a2ae539') {
      Add-Failure "v5.5 post-commit reconciliation must record committed checkpoint a2ae539"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.pending_local_commit_count -ne 4) {
      Add-Failure "v5.5 post-commit reconciliation must record 4 pending local commits"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.local_commit_chain_ordered -ne $true) {
      Add-Failure "v5.5 post-commit reconciliation must verify ordered commit chain"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.v5_4_commit_recorded -ne $true) {
      Add-Failure "v5.5 post-commit reconciliation must record v5.4 commit"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.post_commit_board_reconciled -ne $true) {
      Add-Failure "v5.5 post-commit reconciliation must verify agent board state"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.current_batch_uncommitted_changes_expected -ne $true) {
      Add-Failure "v5.5 post-commit reconciliation must declare current local uncommitted batch"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.push_authorized -ne $false) {
      Add-Failure "v5.5 post-commit reconciliation must not authorize push"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.tag_authorized -ne $false) {
      Add-Failure "v5.5 post-commit reconciliation must not authorize tag"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.pr_authorized -ne $false) {
      Add-Failure "v5.5 post-commit reconciliation must not authorize PR"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.release_authorized -ne $false) {
      Add-Failure "v5.5 post-commit reconciliation must not authorize release"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.remote_write_performed -ne $false) {
      Add-Failure "v5.5 post-commit reconciliation must not perform remote write"
    }
    if ($v5PostCommitReconciliation.post_commit_reconciliation.file_write_performed -ne $false) {
      Add-Failure "v5.5 post-commit reconciliation validation must not write files"
    }
  }

  $v5IndexConsistencyOutput = & node (Join-Path $Root 'scripts/validate_v5_index_consistency.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v5.9 expanded v5 index consistency validation exited with failure"
  } else {
    $v5IndexConsistency = ($v5IndexConsistencyOutput -join "`n") | ConvertFrom-Json
    if ($v5IndexConsistency.passed -ne $true) {
      Add-Failure "v5.9 expanded v5 index consistency validation must report passed true"
    }
    if ($v5IndexConsistency.v5_index_consistency.v5_record_count -ne 13) {
      Add-Failure "v5 index consistency must cover 13 v5 records"
    }
    if ($v5IndexConsistency.v5_index_consistency.docs_present -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify docs"
    }
    if ($v5IndexConsistency.v5_index_consistency.schema_examples_present -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify schema examples"
    }
    if ($v5IndexConsistency.v5_index_consistency.validation_scripts_present -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify validation scripts"
    }
    if ($v5IndexConsistency.v5_index_consistency.readme_index_current -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify README"
    }
    if ($v5IndexConsistency.v5_index_consistency.manifest_index_current -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify MANIFEST"
    }
    if ($v5IndexConsistency.v5_index_consistency.release_notes_current -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify release notes"
    }
    if ($v5IndexConsistency.v5_index_consistency.roadmap_current -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify roadmap"
    }
    if ($v5IndexConsistency.v5_index_consistency.checklist_current -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify validation checklist"
    }
    if ($v5IndexConsistency.v5_index_consistency.validate_mvp_current -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify validate_mvp"
    }
    if ($v5IndexConsistency.v5_index_consistency.local_commit_scope_current -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify local commit scope"
    }
    if ($v5IndexConsistency.v5_index_consistency.agent_board_current -ne $true) {
      Add-Failure "v5.6 v5 index consistency must verify agent board"
    }
    if ($v5IndexConsistency.v5_index_consistency.push_authorized -ne $false) {
      Add-Failure "v5.6 v5 index consistency must not authorize push"
    }
    if ($v5IndexConsistency.v5_index_consistency.tag_authorized -ne $false) {
      Add-Failure "v5.6 v5 index consistency must not authorize tag"
    }
    if ($v5IndexConsistency.v5_index_consistency.pr_authorized -ne $false) {
      Add-Failure "v5.6 v5 index consistency must not authorize PR"
    }
    if ($v5IndexConsistency.v5_index_consistency.release_authorized -ne $false) {
      Add-Failure "v5.6 v5 index consistency must not authorize release"
    }
    if ($v5IndexConsistency.v5_index_consistency.remote_write_performed -ne $false) {
      Add-Failure "v5.6 v5 index consistency must not perform remote write"
    }
    if ($v5IndexConsistency.v5_index_consistency.file_write_performed -ne $false) {
      Add-Failure "v5.6 v5 index consistency validation must not write files"
    }
  }

  $v5LocalBatchCommitReadinessOutput = & node (Join-Path $Root 'scripts/validate_v5_local_batch_commit_readiness.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v5.7 local batch commit-readiness validation exited with failure"
  } else {
    $v5LocalBatchCommitReadiness = ($v5LocalBatchCommitReadinessOutput -join "`n") | ConvertFrom-Json
    if ($v5LocalBatchCommitReadiness.passed -ne $true) {
      Add-Failure "v5.7 local batch commit-readiness validation must report passed true"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.base_head_short -ne 'a2ae539') {
      Add-Failure "v5.7 local batch commit-readiness must record base head a2ae539"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.expected_modified_count -ne 13) {
      Add-Failure "v5.7 local batch commit-readiness must expect 13 modified files"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.expected_untracked_count -ne 9) {
      Add-Failure "v5.7 local batch commit-readiness must expect 9 untracked files"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.unexpected_modified_count -ne 0) {
      Add-Failure "v5.7 local batch commit-readiness must not find unexpected modified files"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.unexpected_untracked_count -ne 0) {
      Add-Failure "v5.7 local batch commit-readiness must not find unexpected untracked files"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.staged_changes_present -ne $false) {
      Add-Failure "v5.7 local batch commit-readiness must verify no staged changes"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.top_indexes_updated -ne $true) {
      Add-Failure "v5.7 local batch commit-readiness must verify top indexes"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.validation_surface_current -ne $true) {
      Add-Failure "v5.7 local batch commit-readiness must verify validation surface"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.agent_board_current -ne $true) {
      Add-Failure "v5.7 local batch commit-readiness must verify agent board"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.commit_authorized -ne $false) {
      Add-Failure "v5.7 local batch commit-readiness must not authorize commit"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.push_authorized -ne $false) {
      Add-Failure "v5.7 local batch commit-readiness must not authorize push"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.tag_authorized -ne $false) {
      Add-Failure "v5.7 local batch commit-readiness must not authorize tag"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.pr_authorized -ne $false) {
      Add-Failure "v5.7 local batch commit-readiness must not authorize PR"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.release_authorized -ne $false) {
      Add-Failure "v5.7 local batch commit-readiness must not authorize release"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.remote_write_performed -ne $false) {
      Add-Failure "v5.7 local batch commit-readiness must not perform remote write"
    }
    if ($v5LocalBatchCommitReadiness.local_batch_commit_readiness.file_write_performed -ne $false) {
      Add-Failure "v5.7 local batch commit-readiness validation must not write files"
    }
  }

  $v5HandoffFreshnessOutput = & node (Join-Path $Root 'scripts/validate_v5_handoff_freshness.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v5.8 handoff freshness validation exited with failure"
  } else {
    $v5HandoffFreshness = ($v5HandoffFreshnessOutput -join "`n") | ConvertFrom-Json
    if ($v5HandoffFreshness.passed -ne $true) {
      Add-Failure "v5.8 handoff freshness validation must report passed true"
    }
    if ($v5HandoffFreshness.handoff_freshness.record_phase -ne 'v5.8 handoff freshness validation') {
      Add-Failure "v5.8 handoff freshness must record its historical record phase"
    }
    if ($v5HandoffFreshness.handoff_freshness.current_phase -ne 'v5.12 release candidate readiness') {
      Add-Failure "v5.8 handoff freshness must verify the actual current phase"
    }
    if ($v5HandoffFreshness.handoff_freshness.run_state_current_phase -ne 'v5.12 release candidate readiness') {
      Add-Failure "v5.8 handoff freshness must parse RUN_STATE current phase"
    }
    if ($v5HandoffFreshness.handoff_freshness.agent_board_files_present -ne $true) {
      Add-Failure "v5.8 handoff freshness must verify agent board files"
    }
    if ($v5HandoffFreshness.handoff_freshness.run_state_current -ne $true) {
      Add-Failure "v5.8 handoff freshness must verify RUN_STATE"
    }
    if ($v5HandoffFreshness.handoff_freshness.handoff_current -ne $true) {
      Add-Failure "v5.8 handoff freshness must verify HANDOFF"
    }
    if ($v5HandoffFreshness.handoff_freshness.task_queue_current -ne $true) {
      Add-Failure "v5.8 handoff freshness must verify TASK_QUEUE"
    }
    if ($v5HandoffFreshness.handoff_freshness.checkpoint_current -ne $true) {
      Add-Failure "v5.8 handoff freshness must verify CHECKPOINT"
    }
    if ($v5HandoffFreshness.handoff_freshness.validation_log_current -ne $true) {
      Add-Failure "v5.8 handoff freshness must verify VALIDATION_LOG"
    }
    if ($v5HandoffFreshness.handoff_freshness.resume_prompt_present -ne $true) {
      Add-Failure "v5.8 handoff freshness must preserve resume prompt"
    }
    if ($v5HandoffFreshness.handoff_freshness.hard_stop_gates_present -ne $true) {
      Add-Failure "v5.8 handoff freshness must preserve hard stop gates"
    }
    if ($v5HandoffFreshness.handoff_freshness.no_execution_boundary_present -ne $true) {
      Add-Failure "v5.8 handoff freshness must preserve no-execution boundary"
    }
    if ($v5HandoffFreshness.handoff_freshness.remote_action_gate_present -ne $true) {
      Add-Failure "v5.8 handoff freshness must preserve remote action gate"
    }
    if ($v5HandoffFreshness.handoff_freshness.external_read_gate_present -ne $true) {
      Add-Failure "v5.8 handoff freshness must preserve external read gate"
    }
    if ($v5HandoffFreshness.handoff_freshness.blocked_state_clear -ne $true) {
      Add-Failure "v5.8 handoff freshness must verify clear blocked state"
    }
    if ($v5HandoffFreshness.handoff_freshness.commit_authorized -ne $false) {
      Add-Failure "v5.8 handoff freshness must not authorize commit"
    }
    if ($v5HandoffFreshness.handoff_freshness.push_authorized -ne $false) {
      Add-Failure "v5.8 handoff freshness must not authorize push"
    }
    if ($v5HandoffFreshness.handoff_freshness.tag_authorized -ne $false) {
      Add-Failure "v5.8 handoff freshness must not authorize tag"
    }
    if ($v5HandoffFreshness.handoff_freshness.pr_authorized -ne $false) {
      Add-Failure "v5.8 handoff freshness must not authorize PR"
    }
    if ($v5HandoffFreshness.handoff_freshness.release_authorized -ne $false) {
      Add-Failure "v5.8 handoff freshness must not authorize release"
    }
    if ($v5HandoffFreshness.handoff_freshness.remote_write_performed -ne $false) {
      Add-Failure "v5.8 handoff freshness must not perform remote write"
    }
    if ($v5HandoffFreshness.handoff_freshness.file_write_performed -ne $false) {
      Add-Failure "v5.8 handoff freshness validation must not write files"
    }
  }

  $v5TrueLoopCandidateDeliveryOutput = & node (Join-Path $Root 'scripts/validate_v5_true_loop_candidate_delivery.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v5.10 local true-loop candidate delivery validation exited with failure"
  } else {
    $v5TrueLoopCandidateDelivery = ($v5TrueLoopCandidateDeliveryOutput -join "`n") | ConvertFrom-Json
    if ($v5TrueLoopCandidateDelivery.passed -ne $true) {
      Add-Failure "v5.10 local true-loop candidate delivery validation must report passed true"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.current_phase -ne 'v5.10 local true-loop candidate delivery closeout') {
      Add-Failure "v5.10 local true-loop candidate delivery must record current phase"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.run_state_current_phase -ne 'v5.12 release candidate readiness') {
      Add-Failure "v5.10 local true-loop candidate delivery must verify v5.12 as current RUN_STATE phase"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.local_head_short -ne '9ac4ca8') {
      Add-Failure "v5.10 local true-loop candidate delivery must record local head 9ac4ca8"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.pending_local_commit_count -ne 5) {
      Add-Failure "v5.10 local true-loop candidate delivery must record 5 pending local commits"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.true_loop_candidate_ready -ne $true) {
      Add-Failure "v5.10 local true-loop candidate delivery must mark true-loop candidate ready"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.local_delivery_complete -ne $true) {
      Add-Failure "v5.10 local true-loop candidate delivery must mark local delivery complete"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.closeout_docs_ready -ne $true) {
      Add-Failure "v5.10 local true-loop candidate delivery must verify closeout docs"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.review_finding_fixed -ne $true) {
      Add-Failure "v5.10 local true-loop candidate delivery must verify review finding fix"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.indexes_current -ne $true) {
      Add-Failure "v5.10 local true-loop candidate delivery must verify indexes"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.agent_board_current -ne $true) {
      Add-Failure "v5.10 local true-loop candidate delivery must verify agent board"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.push_authorized -ne $false) {
      Add-Failure "v5.10 local true-loop candidate delivery must not authorize push"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.release_authorized -ne $false) {
      Add-Failure "v5.10 local true-loop candidate delivery must not authorize release"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.remote_write_performed -ne $false) {
      Add-Failure "v5.10 local true-loop candidate delivery must not perform remote write"
    }
    if ($v5TrueLoopCandidateDelivery.local_true_loop_candidate_delivery.file_write_performed -ne $false) {
      Add-Failure "v5.10 local true-loop candidate delivery validation must not write files"
    }
  }

  $v5PostMergeReconciliationOutput = & node (Join-Path $Root 'scripts/validate_v5_post_merge_reconciliation.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v5.11 post-merge reconciliation validation exited with failure"
  } else {
    $v5PostMergeReconciliation = ($v5PostMergeReconciliationOutput -join "`n") | ConvertFrom-Json
    if ($v5PostMergeReconciliation.passed -ne $true) {
      Add-Failure "v5.11 post-merge reconciliation validation must report passed true"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.current_phase -ne 'v5.11 post-merge reconciliation') {
      Add-Failure "v5.11 post-merge reconciliation must record current phase"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.run_state_current_phase -ne 'v5.12 release candidate readiness') {
      Add-Failure "v5.11 post-merge reconciliation must verify v5.12 as current RUN_STATE phase"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.pr_number -ne 2) {
      Add-Failure "v5.11 post-merge reconciliation must record PR #2"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.pr_merged -ne $true) {
      Add-Failure "v5.11 post-merge reconciliation must record PR merged"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.pr_merge_commit_short -ne '3e3405e') {
      Add-Failure "v5.11 post-merge reconciliation must record merge commit 3e3405e"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.pr_head_commit_short -ne '5ccf059') {
      Add-Failure "v5.11 post-merge reconciliation must record PR head 5ccf059"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.tag_name -ne 'v5.10-local-delivery-agents-merge') {
      Add-Failure "v5.11 post-merge reconciliation must record v5.10 tag"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.local_master_synced -ne $true) {
      Add-Failure "v5.11 post-merge reconciliation must record local master synced"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.master_origin_divergence -ne '0 0') {
      Add-Failure "v5.11 post-merge reconciliation must record master...origin/master 0 0"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.indexes_current -ne $true) {
      Add-Failure "v5.11 post-merge reconciliation must verify indexes"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.validators_current -ne $true) {
      Add-Failure "v5.11 post-merge reconciliation must verify validators"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.agent_board_current -ne $true) {
      Add-Failure "v5.11 post-merge reconciliation must verify agent board"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.push_authorized -ne $false) {
      Add-Failure "v5.11 post-merge reconciliation must not authorize push"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.release_authorized -ne $false) {
      Add-Failure "v5.11 post-merge reconciliation must not authorize release"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.remote_write_performed_in_this_batch -ne $false) {
      Add-Failure "v5.11 post-merge reconciliation must not perform remote write in this batch"
    }
    if ($v5PostMergeReconciliation.post_merge_reconciliation.file_write_performed -ne $false) {
      Add-Failure "v5.11 post-merge reconciliation validation must not write files"
    }
  }

  $v512ReleaseCandidateReadinessOutput = & node (Join-Path $Root 'scripts/validate_v5_12_release_candidate_readiness.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v5.12 release candidate readiness validation exited with failure"
  } else {
    $v512ReleaseCandidateReadiness = ($v512ReleaseCandidateReadinessOutput -join "`n") | ConvertFrom-Json
    if ($v512ReleaseCandidateReadiness.passed -ne $true) {
      Add-Failure "v5.12 release candidate readiness validation must report passed true"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.current_phase -ne 'v5.12 release candidate readiness') {
      Add-Failure "v5.12 release candidate readiness must record current phase"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.pr_number -ne 3) {
      Add-Failure "v5.12 release candidate readiness must record PR #3"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.pr_merge_commit_short -ne 'b3731bf') {
      Add-Failure "v5.12 release candidate readiness must record merge commit b3731bf"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.pr_head_commit_short -ne '46bf42b') {
      Add-Failure "v5.12 release candidate readiness must record PR head 46bf42b"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.tag_name -ne 'v5.11-post-merge-reconciliation') {
      Add-Failure "v5.12 release candidate readiness must record v5.11 tag"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.true_loop_tag -ne 'v1.0.0-true-loop-closeout') {
      Add-Failure "v5.12 release candidate readiness must record v1.0 true-loop tag"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.master_origin_divergence -ne '0 0') {
      Add-Failure "v5.12 release candidate readiness must record master...origin/master 0 0"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.release_candidate_ready -ne $true) {
      Add-Failure "v5.12 release candidate readiness must mark release candidate ready"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.final_delivery_candidate_package_ready -ne $true) {
      Add-Failure "v5.12 release candidate readiness must mark final delivery candidate package ready"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.true_loop_candidate_ready -ne $true) {
      Add-Failure "v5.12 release candidate readiness must mark true-loop candidate ready"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.candidate_evidence_present -ne $true) {
      Add-Failure "v5.12 release candidate readiness must verify candidate evidence files"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.true_loop_evidence_ready -ne $true) {
      Add-Failure "v5.12 release candidate readiness must verify true-loop evidence"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.indexes_current -ne $true) {
      Add-Failure "v5.12 release candidate readiness must verify indexes"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.validators_current -ne $true) {
      Add-Failure "v5.12 release candidate readiness must verify validators"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.agent_board_current -ne $true) {
      Add-Failure "v5.12 release candidate readiness must verify agent board"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.push_authorized -ne $false) {
      Add-Failure "v5.12 release candidate readiness must not authorize push"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.release_publish_authorized -ne $false) {
      Add-Failure "v5.12 release candidate readiness must not authorize release publication"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.remote_write_performed_in_this_batch -ne $false) {
      Add-Failure "v5.12 release candidate readiness must not perform remote write in this batch"
    }
    if ($v512ReleaseCandidateReadiness.release_candidate_readiness.file_write_performed -ne $false) {
      Add-Failure "v5.12 release candidate readiness validation must not write files"
    }
  }

  $v5DeliveryReadinessOutput = & node (Join-Path $Root 'scripts/validate_v5_delivery_readiness.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v5.0 delivery readiness validation exited with failure"
  } else {
    $v5DeliveryReadiness = ($v5DeliveryReadinessOutput -join "`n") | ConvertFrom-Json
    if ($v5DeliveryReadiness.passed -ne $true) {
      Add-Failure "v5.0 delivery readiness validation must report passed true"
    }
    if ($v5DeliveryReadiness.delivery_readiness.pr_number -ne 1) {
      Add-Failure "v5.0 delivery readiness must record PR #1"
    }
    if ($v5DeliveryReadiness.delivery_readiness.pr_merged -ne $true) {
      Add-Failure "v5.0 delivery readiness must record merged PR"
    }
    if ($v5DeliveryReadiness.delivery_readiness.merge_commit_short -ne '367d3c9') {
      Add-Failure "v5.0 delivery readiness must record merge commit 367d3c9"
    }
    if ($v5DeliveryReadiness.delivery_readiness.merged_head_commit_short -ne 'b595851') {
      Add-Failure "v5.0 delivery readiness must record merged head b595851"
    }
    if ($v5DeliveryReadiness.delivery_readiness.checkpoint_tag -ne 'v4.8-local-validation-checkpoint') {
      Add-Failure "v5.0 delivery readiness must record v4.8 checkpoint tag"
    }
    if ($v5DeliveryReadiness.delivery_readiness.checkpoint_commit_short -ne '6d4253f') {
      Add-Failure "v5.0 delivery readiness must record checkpoint commit 6d4253f"
    }
    if ($v5DeliveryReadiness.delivery_readiness.local_master_synced -ne $true) {
      Add-Failure "v5.0 delivery readiness must record local master sync"
    }
    if ($v5DeliveryReadiness.delivery_readiness.delivery_entry_current -ne $true) {
      Add-Failure "v5.0 delivery readiness must verify delivery entry"
    }
    if ($v5DeliveryReadiness.delivery_readiness.validation_command_surface_current -ne $true) {
      Add-Failure "v5.0 delivery readiness must verify validation command surface"
    }
    if ($v5DeliveryReadiness.delivery_readiness.task_queue_current -ne $true) {
      Add-Failure "v5.0 delivery readiness must verify task queue state"
    }
    if ($v5DeliveryReadiness.delivery_readiness.file_write_performed -ne $false) {
      Add-Failure "v5.0 delivery readiness validation must not write files"
    }
  }
  }

  $git = Get-Command git -ErrorAction SilentlyContinue
  if (-not $git) {
    Add-Failure "git is required to validate local commit scope against current worktree"
  } else {
    $currentBranch = ((& git branch --show-current) -join "`n").Trim()
    if ($LASTEXITCODE -ne 0) {
      Add-Failure "git branch --show-current failed during local commit scope validation"
    } elseif ($currentBranch -notin @('master', 'codex/v5.11-post-merge-reconciliation', 'codex/v5.12-release-candidate-readiness', 'codex/a5-complete-delivery-20260507', 'codex/runtime-review-followup')) {
      Add-Failure "local commit scope expected branch master, codex/v5.11-post-merge-reconciliation, codex/v5.12-release-candidate-readiness, codex/a5-complete-delivery-20260507, or codex/runtime-review-followup, got $currentBranch"
    }

    $localTagCommit = ((& git rev-parse --short v4.8-local-validation-checkpoint) -join "`n").Trim()
    if ($LASTEXITCODE -ne 0) {
      Add-Failure "git rev-parse --short v4.8-local-validation-checkpoint failed during local tag readiness validation"
    } elseif ($localTagCommit -ne '6d4253f') {
      Add-Failure "local tag v4.8-local-validation-checkpoint expected commit 6d4253f, got $localTagCommit"
    }

    $allowedCurrentA4ChangePrefixes = @(
      '.agent_board/',
      'accepted_samples/',
      'asset_archive/',
      'adapters/',
      'configs/local_paths/',
      'docs/',
      'failure_samples/',
      'integrations/vcp/',
      'kernel/',
      'plugin_calls/',
      'plugins/',
      'prompts/',
      'review_console/embed_contract/',
      'review_console/runtime_prototype/',
      'review_console/static_prototype/',
      'reports/',
      'schemas/',
      'scripts/',
      'stability_tests/',
      'tests/schema_examples/'
    )
    $allowedCurrentA4ChangeFiles = @(
      '.env.example',
      '.env.local.example',
      '.gitignore',
      'AGENTS.md',
      'AGENTS.autopilot-overlay.md',
      'CLAUDE.md',
      'README.md',
      'README_AGENT_IMAGE_LAB_AUTOPILOT.md',
      'MANIFEST.md',
      'package.json',
      'package-lock.json',
      'PROJECT_MASTER_PLAN.md',
      'production/plans/french_summer_rattan_bag_v3_production_candidate_001_plan.yaml',
      'production/plans/accepted_product_still_life_tennis_wallet_001_production_candidate_001_plan.yaml',
      'production/reviews/accepted_product_still_life_tennis_wallet_001_production_candidate_001_review.md',
      'RELEASE_NOTES.md',
      'docs_registry/README.md',
      'docs_registry/document_registry_schema_v1.yaml',
      'docs_registry/generated/c1ak_agent_board_only_01_registry_evidence.csv',
      'docs_registry/generated/c1am_agent_board_only_02_registry_evidence.csv',
      'docs_registry/generated/c1am_agent_board_only_03_registry_evidence.csv',
      'docs_registry/generated/c1am_agent_board_only_04_registry_evidence.csv',
      'docs_registry/generated/c1am_agent_board_only_05_registry_evidence.csv',
      'docs_registry/generated/c1am_agent_board_plus_docs_01_registry_evidence.csv',
      'docs_registry/generated/c1am_agent_board_plus_docs_02_registry_evidence.csv',
      'docs_registry/generated/c1am_agent_board_plus_docs_03_registry_evidence.csv',
      'docs_registry/generated/c1am_agent_board_plus_docs_04_registry_evidence.csv',
      'docs_registry/generated/c1am_agent_board_plus_docs_05_registry_evidence.csv',
      'docs_registry/registry_scanner_dry_run.md',
      'docs_registry/registry_validator_dry_run.md',
      'docs/00_project_roadmap.md',
      'tests/validation_checklist.md'
    )

    function Test-CurrentA4ChangeAllowed {
      param([string]$Path)

      if ($allowedCurrentA4ChangeFiles -contains $Path) {
        return $true
      }
      foreach ($prefix in $allowedCurrentA4ChangePrefixes) {
        if ($Path.StartsWith($prefix, [System.StringComparison]::Ordinal)) {
          return $true
        }
      }
      return $false
    }

    $actualModifiedFiles = @(& git diff --name-only | Where-Object { $_.Trim() -ne '' } | ForEach-Object { $_.Trim() })
    if ($LASTEXITCODE -ne 0) {
      Add-Failure "git diff --name-only failed during local commit scope validation"
    }
    $unexpectedModifiedFiles = @($actualModifiedFiles | Where-Object { -not (Test-CurrentA4ChangeAllowed $_) })
    if ($unexpectedModifiedFiles.Count -gt 0) {
      Add-Failure "local commit scope found unexpected modified files: $($unexpectedModifiedFiles -join ', ')"
    }

    $actualUntrackedFiles = @(& git ls-files --others --exclude-standard | Where-Object { $_.Trim() -ne '' } | ForEach-Object { $_.Trim() })
    if ($LASTEXITCODE -ne 0) {
      Add-Failure "git ls-files --others --exclude-standard failed during local commit scope validation"
    }
    $unexpectedUntrackedFiles = @($actualUntrackedFiles | Where-Object { -not (Test-CurrentA4ChangeAllowed $_) })
    if ($unexpectedUntrackedFiles.Count -gt 0) {
      Add-Failure "local commit scope found unexpected untracked files: $($unexpectedUntrackedFiles -join ', ')"
    }

    $actualStagedFiles = @(& git diff --cached --name-only | Where-Object { $_.Trim() -ne '' } | ForEach-Object { $_.Trim() })
    if ($LASTEXITCODE -ne 0) {
      Add-Failure "git diff --cached --name-only failed during local commit scope validation"
    } elseif ($actualStagedFiles.Count -gt 0) {
      Add-Failure "local commit scope expected no staged files, got: $($actualStagedFiles -join ', ')"
    }
  }

  $runtimeSuiteOutput = & node (Join-Path $Root 'scripts/validate_runtime_prototype_suite.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "runtime prototype validation suite exited with failure"
  } else {
    $runtimeSuite = ($runtimeSuiteOutput -join "`n") | ConvertFrom-Json
    if ($runtimeSuite.passed -ne $true) {
      Add-Failure "runtime prototype validation suite must report passed true"
    }
    if ($runtimeSuite.runtime_validation_suite.failed_count -ne 0) {
      Add-Failure "runtime prototype validation suite failed_count must be 0"
    }
    if ($runtimeSuite.runtime_validation_suite.runtime_guard_syntax -ne $true) {
      Add-Failure "runtime prototype validation suite must pass runtime guard syntax"
    }
    if ($runtimeSuite.runtime_validation_suite.host_bridge_mock_syntax -ne $true) {
      Add-Failure "runtime prototype validation suite must pass host bridge mock syntax"
    }
    if ($runtimeSuite.runtime_validation_suite.runtime_app_syntax -ne $true) {
      Add-Failure "runtime prototype validation suite must pass runtime app syntax"
    }
    if ($runtimeSuite.runtime_validation_suite.runtime_guard_unit -ne $true) {
      Add-Failure "runtime prototype validation suite must pass runtime guard unit"
    }
    if ($runtimeSuite.runtime_validation_suite.runtime_guard_unit_output_passed -ne $true) {
      Add-Failure "runtime prototype validation suite must verify runtime guard unit output"
    }
    if ($runtimeSuite.runtime_validation_suite.runtime_smoke -ne $true) {
      Add-Failure "runtime prototype validation suite must pass runtime smoke"
    }
    if ($runtimeSuite.runtime_validation_suite.runtime_smoke_output_passed -ne $true) {
      Add-Failure "runtime prototype validation suite must verify runtime smoke output"
    }
    if ($runtimeSuite.runtime_validation_suite.runtime_delivery_surface -ne $true) {
      Add-Failure "runtime prototype validation suite must pass runtime delivery surface"
    }
    if ($runtimeSuite.runtime_validation_suite.runtime_delivery_surface_output_passed -ne $true) {
      Add-Failure "runtime prototype validation suite must verify runtime delivery surface output"
    }
    if ($runtimeSuite.runtime_validation_suite.external_network_required -ne $false) {
      Add-Failure "runtime prototype validation suite must not require external network"
    }
    if ($runtimeSuite.runtime_validation_suite.file_write_performed -ne $false) {
      Add-Failure "runtime prototype validation suite must not write files"
    }
  }

  $exportCheckScript = @"
const adapter = require('./exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js');
const input = require('./adapter_dry_run_lab/fixtures/accepted_request.json');
const response = adapter.dryRun(input).adapter_dry_run_response;
if (response.status !== 'accepted_draft') process.exit(1);
if (response.dispatch_plan_draft.selected_plugin !== null) process.exit(2);
if (response.dispatch_plan_draft.max_plugin_calls !== 0) process.exit(3);
if (response.dispatch_plan_draft.execution_blocked !== true) process.exit(4);
"@
  $exportCheckOutput = $exportCheckScript | node
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "export dry-run adapter accepted fixture check failed"
  }

  function Invoke-NodeCliWithFixtureStdin {
    param(
      [string]$ScriptPath,
      [string]$FixturePath
    )

    $runner = @'
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const scriptPath = process.argv[2];
const fixturePath = process.argv[3];
const child = spawnSync(process.execPath, [scriptPath], {
  input: fs.readFileSync(fixturePath),
  encoding: "utf8",
});
if (child.stdout) process.stdout.write(child.stdout);
if (child.stderr) process.stderr.write(child.stderr);
process.exit(child.status || 0);
'@

    $runner | & node - $ScriptPath $FixturePath
  }

  $adapterCliPath = Join-Path $Root 'exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js'
  $acceptedCliFixture = Join-Path $Root 'adapter_dry_run_lab/fixtures/accepted_request.json'
  $acceptedCliOutput = Invoke-NodeCliWithFixtureStdin -ScriptPath $adapterCliPath -FixturePath $acceptedCliFixture
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "export dry-run adapter CLI accepted fixture exited with failure"
  } else {
    $acceptedCli = ($acceptedCliOutput -join "`n") | ConvertFrom-Json
    $response = $acceptedCli.result.adapter_dry_run_response
    if ($acceptedCli.status -ne 'success') {
      Add-Failure "export dry-run adapter CLI accepted fixture must return VCP status success"
    }
    if ($response.status -ne 'accepted_draft') {
      Add-Failure "export dry-run adapter CLI accepted fixture must return accepted_draft"
    }
    if ($response.dispatch_plan_draft.selected_plugin -ne $null) {
      Add-Failure "export dry-run adapter CLI accepted fixture must keep selected_plugin null"
    }
    if ($response.dispatch_plan_draft.max_plugin_calls -ne 0) {
      Add-Failure "export dry-run adapter CLI accepted fixture must keep max_plugin_calls 0"
    }
    if ($response.dispatch_plan_draft.execution_blocked -ne $true) {
      Add-Failure "export dry-run adapter CLI accepted fixture must keep execution_blocked true"
    }
    if (
      $response.no_execution_guard.api_called -ne $false -or
      $response.no_execution_guard.vcp_plugin_called -ne $false -or
      $response.no_execution_guard.daily_note_called -ne $false -or
      $response.no_execution_guard.file_write_performed -ne $false -or
      $response.no_execution_guard.image_file_created -ne $false
    ) {
      Add-Failure "export dry-run adapter CLI accepted fixture violated no-execution guard"
    }
  }

  $rejectedCliFixture = Join-Path $Root 'adapter_dry_run_lab/fixtures/rejected_request.json'
  $rejectedCliOutput = Invoke-NodeCliWithFixtureStdin -ScriptPath $adapterCliPath -FixturePath $rejectedCliFixture
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "export dry-run adapter CLI rejected fixture exited with failure"
  } else {
    $rejectedCli = ($rejectedCliOutput -join "`n") | ConvertFrom-Json
    $response = $rejectedCli.result.adapter_dry_run_response
    if ($rejectedCli.status -ne 'success') {
      Add-Failure "export dry-run adapter CLI rejected fixture must return VCP status success"
    }
    if ($response.status -ne 'rejected') {
      Add-Failure "export dry-run adapter CLI rejected fixture must return rejected"
    }
    if ($response.selected_plugin -ne $null) {
      Add-Failure "export dry-run adapter CLI rejected fixture must keep selected_plugin null"
    }
    if ($response.max_plugin_calls -ne 0) {
      Add-Failure "export dry-run adapter CLI rejected fixture must keep max_plugin_calls 0"
    }
    if ($response.execution_blocked -ne $true) {
      Add-Failure "export dry-run adapter CLI rejected fixture must keep execution_blocked true"
    }
    if (
      $response.api_called -ne $false -or
      $response.vcp_plugin_called -ne $false -or
      $response.daily_note_called -ne $false -or
      $response.file_write_performed -ne $false -or
      $response.image_file_created -ne $false
    ) {
      Add-Failure "export dry-run adapter CLI rejected fixture violated no-execution guard"
    }
  }

  $v07RehearsalPath = Join-Path $Root 'adapter_dry_run_lab/fixtures/photo_studio_os_v0_7_rehearsal_request.json'
  $v07RehearsalOutput = Invoke-NodeScriptWithFileArg -ScriptPath (Join-Path $Root 'adapter_dry_run_lab/adapter_dry_run.js') -FixturePath $v07RehearsalPath
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "v0.7 Photo Studio OS dry-run rehearsal fixture exited with failure"
  } else {
    $v07Rehearsal = ($v07RehearsalOutput -join "`n") | ConvertFrom-Json
    $response = $v07Rehearsal.adapter_dry_run_response
    if ($response.status -ne 'accepted_draft') {
      Add-Failure "v0.7 Photo Studio OS dry-run rehearsal must return accepted_draft"
    }
    if ($response.dispatch_plan_draft.selected_plugin -ne $null) {
      Add-Failure "v0.7 Photo Studio OS dry-run rehearsal must keep selected_plugin null"
    }
    if ($response.dispatch_plan_draft.max_plugin_calls -ne 0) {
      Add-Failure "v0.7 Photo Studio OS dry-run rehearsal must keep max_plugin_calls 0"
    }
    if ($response.no_execution_guard.real_execution_allowed -ne $false) {
      Add-Failure "v0.7 Photo Studio OS dry-run rehearsal must not allow real execution"
    }
  }

  $acceptedSampleRegistryOutput = & node (Join-Path $Root 'scripts/validate_v7_32_accepted_sample_registry_update.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "accepted sample registry metadata validation exited with failure"
  } else {
    $acceptedSampleRegistry = ($acceptedSampleRegistryOutput -join "`n") | ConvertFrom-Json
    if ($acceptedSampleRegistry.passed -ne $true) {
      Add-Failure "accepted sample registry metadata validation must pass"
    }
    if ($acceptedSampleRegistry.metadata_only -ne $true) {
      Add-Failure "accepted sample registry validation must be metadata-only"
    }
    if ($acceptedSampleRegistry.image_files_committed_to_git -ne $false) {
      Add-Failure "accepted sample registry validation must verify no image files are committed"
    }
    if ($acceptedSampleRegistry.runs_source_image_modification_allowed -ne $false) {
      Add-Failure "accepted sample registry validation must block runs source image modification"
    }
    if ($acceptedSampleRegistry.production_candidate_write_allowed -ne $false) {
      Add-Failure "accepted sample registry validation must block production candidate writes"
    }
    if ($acceptedSampleRegistry.daily_note_write_allowed -ne $false) {
      Add-Failure "accepted sample registry validation must block DailyNote writes"
    }
    if ($acceptedSampleRegistry.vcp_memory_write_allowed -ne $false) {
      Add-Failure "accepted sample registry validation must block VCP memory writes"
    }
    if ($acceptedSampleRegistry.file_write_performed -ne $false) {
      Add-Failure "accepted sample registry validation must not write files"
    }
  }

  $codexSessionMemoryDeltaDraftOutput = & node (Join-Path $Root 'scripts/validate_v14_111_codex_session_memory_delta_draft.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Codex session memory_delta draft validation exited with failure"
  } else {
    $codexSessionMemoryDeltaDraft = ($codexSessionMemoryDeltaDraftOutput -join "`n") | ConvertFrom-Json
    if ($codexSessionMemoryDeltaDraft.passed -ne $true) {
      Add-Failure "Codex session memory_delta draft validation must pass"
    }
    if ($codexSessionMemoryDeltaDraft.memory_delta_draft.write_mode -ne 'draft') {
      Add-Failure "Codex session memory_delta must remain draft"
    }
    if ($codexSessionMemoryDeltaDraft.memory_delta_draft.should_write_to_vcp -ne $false) {
      Add-Failure "Codex session memory_delta draft must not write to VCP"
    }
    if ($codexSessionMemoryDeltaDraft.memory_delta_draft.daily_note_write_performed -ne $false) {
      Add-Failure "Codex session memory_delta draft must not write DailyNote"
    }
    if ($codexSessionMemoryDeltaDraft.memory_delta_draft.vcp_memory_write_performed -ne $false) {
      Add-Failure "Codex session memory_delta draft must not write VCP memory"
    }
    if ($codexSessionMemoryDeltaDraft.memory_delta_draft.image_binary_included -ne $false) {
      Add-Failure "Codex session memory_delta draft must not include image binary"
    }
    if ($codexSessionMemoryDeltaDraft.memory_delta_draft.file_write_performed -ne $false) {
      Add-Failure "Codex session memory_delta draft validation must not write files"
    }
  }

  $productionCandidateGateOutput = & node (Join-Path $Root 'scripts/validate_v14_112_production_candidate_gate_policy.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "production candidate gate policy validation exited with failure"
  } else {
    $productionCandidateGate = ($productionCandidateGateOutput -join "`n") | ConvertFrom-Json
    if ($productionCandidateGate.passed -ne $true) {
      Add-Failure "production candidate gate policy validation must pass"
    }
    if ($productionCandidateGate.accepted_samples_auto_promote_to_production_candidate -ne $false) {
      Add-Failure "accepted_samples metadata must not auto-promote to production_candidate"
    }
    if ($productionCandidateGate.production_candidate_write_allowed -ne $false) {
      Add-Failure "production candidate gate must keep write allowance false"
    }
    if ($productionCandidateGate.production_candidate_write_performed -ne $false) {
      Add-Failure "production candidate gate validation must not write production_candidate"
    }
    if ($productionCandidateGate.production_directory_write_performed -ne $false) {
      Add-Failure "production candidate gate validation must not write production directory"
    }
    if ($productionCandidateGate.provider_contact_performed -ne $false -or $productionCandidateGate.plugin_call_performed -ne $false -or $productionCandidateGate.api_call_performed -ne $false -or $productionCandidateGate.mcp_runtime_performed -ne $false) {
      Add-Failure "production candidate gate validation must not call provider/plugin/API/MCP"
    }
    if ($productionCandidateGate.daily_note_write_performed -ne $false -or $productionCandidateGate.vcp_memory_write_performed -ne $false) {
      Add-Failure "production candidate gate validation must not write DailyNote or VCP memory"
    }
  }

  $failureSamplesBoundaryOutput = & node (Join-Path $Root 'scripts/validate_v14_113_failure_samples_authorization_boundary.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "failure_samples authorization boundary validation exited with failure"
  } else {
    $failureSamplesBoundary = ($failureSamplesBoundaryOutput -join "`n") | ConvertFrom-Json
    if ($failureSamplesBoundary.passed -ne $true) {
      Add-Failure "failure_samples authorization boundary validation must pass"
    }
    if ($failureSamplesBoundary.failure_samples_write_allowed_without_separate_authorization -ne $false) {
      Add-Failure "failure_samples writes must require separate authorization"
    }
    if ($failureSamplesBoundary.failure_samples_write_performed -ne $false) {
      Add-Failure "failure_samples boundary validation must not write failure_samples"
    }
    if ($failureSamplesBoundary.failure_samples_registry_write_performed -ne $false -or $failureSamplesBoundary.failure_samples_taxonomy_write_performed -ne $false) {
      Add-Failure "failure_samples boundary validation must not write registry or taxonomy"
    }
    if ($failureSamplesBoundary.codex_accepted_sample_written_to_failure_registry -ne $false) {
      Add-Failure "Codex accepted sample must not be written to failure registry"
    }
  }

  $reviewConsoleHandoffTaxonomyOutput = & node (Join-Path $Root 'scripts/validate_v14_114_review_console_handoff_taxonomy_alignment.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console handoff taxonomy alignment validation exited with failure"
  } else {
    $reviewConsoleHandoffTaxonomy = ($reviewConsoleHandoffTaxonomyOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleHandoffTaxonomy.passed -ne $true) {
      Add-Failure "Review Console handoff taxonomy alignment validation must pass"
    }
    if ($reviewConsoleHandoffTaxonomy.review_console_display_only -ne $true) {
      Add-Failure "Review Console handoff taxonomy must remain display-only"
    }
    if ($reviewConsoleHandoffTaxonomy.runtime_integration_performed -ne $false -or $reviewConsoleHandoffTaxonomy.real_vcpchat_read_performed -ne $false -or $reviewConsoleHandoffTaxonomy.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "Review Console handoff taxonomy validation must not perform runtime or real VCP reads"
    }
    if ($reviewConsoleHandoffTaxonomy.accepted_samples_write_performed -ne $false -or $reviewConsoleHandoffTaxonomy.failure_samples_write_performed -ne $false -or $reviewConsoleHandoffTaxonomy.production_candidate_created -ne $false) {
      Add-Failure "Review Console handoff taxonomy validation must not write accepted/failure samples or production candidates"
    }
    if ($reviewConsoleHandoffTaxonomy.daily_note_write_performed -ne $false -or $reviewConsoleHandoffTaxonomy.vcp_memory_write_performed -ne $false) {
      Add-Failure "Review Console handoff taxonomy validation must not write DailyNote or VCP memory"
    }
  }

  $dryRunVcpAdapterGoalAlignmentOutput = & node (Join-Path $Root 'scripts/validate_v14_115_dry_run_vcp_adapter_current_goal_alignment.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "dry-run VCP adapter current goal alignment validation exited with failure"
  } else {
    $dryRunVcpAdapterGoalAlignment = ($dryRunVcpAdapterGoalAlignmentOutput -join "`n") | ConvertFrom-Json
    if ($dryRunVcpAdapterGoalAlignment.passed -ne $true) {
      Add-Failure "dry-run VCP adapter current goal alignment validation must pass"
    }
    if ($dryRunVcpAdapterGoalAlignment.dry_run_vcp_adapter_contract_aligned -ne $true) {
      Add-Failure "dry-run VCP adapter contract must stay aligned with current goal"
    }
    if ($dryRunVcpAdapterGoalAlignment.codex_session_default_route_preserved -ne $true) {
      Add-Failure "Codex session image route must remain the default generation route"
    }
    if ($dryRunVcpAdapterGoalAlignment.selected_plugin -ne $null) {
      Add-Failure "dry-run VCP adapter goal alignment must keep selected_plugin null"
    }
    if ($dryRunVcpAdapterGoalAlignment.max_plugin_calls -ne 0) {
      Add-Failure "dry-run VCP adapter goal alignment must keep max_plugin_calls 0"
    }
    if ($dryRunVcpAdapterGoalAlignment.provider_contact_performed -ne $false -or $dryRunVcpAdapterGoalAlignment.plugin_call_performed -ne $false -or $dryRunVcpAdapterGoalAlignment.api_call_performed -ne $false -or $dryRunVcpAdapterGoalAlignment.mcp_runtime_performed -ne $false) {
      Add-Failure "dry-run VCP adapter goal alignment validation must not call provider/plugin/API/MCP"
    }
    if ($dryRunVcpAdapterGoalAlignment.real_manifest_read_performed -ne $false -or $dryRunVcpAdapterGoalAlignment.real_vcpchat_read_performed -ne $false -or $dryRunVcpAdapterGoalAlignment.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "dry-run VCP adapter goal alignment validation must not read real manifest/VCPChat/VCPToolBox"
    }
    if ($dryRunVcpAdapterGoalAlignment.image_generation_performed -ne $false -or $dryRunVcpAdapterGoalAlignment.output_file_write_performed -ne $false -or $dryRunVcpAdapterGoalAlignment.file_write_performed -ne $false) {
      Add-Failure "dry-run VCP adapter goal alignment validation must not generate images or write files"
    }
    if ($dryRunVcpAdapterGoalAlignment.daily_note_write_performed -ne $false -or $dryRunVcpAdapterGoalAlignment.vcp_memory_write_performed -ne $false) {
      Add-Failure "dry-run VCP adapter goal alignment validation must not write DailyNote or VCP memory"
    }
    if ($dryRunVcpAdapterGoalAlignment.accepted_samples_write_performed -ne $false -or $dryRunVcpAdapterGoalAlignment.failure_samples_write_performed -ne $false -or $dryRunVcpAdapterGoalAlignment.production_candidate_created -ne $false) {
      Add-Failure "dry-run VCP adapter goal alignment validation must not write samples or production candidates"
    }
  }

  $manifestReadAuthorizationGoalOutput = & node (Join-Path $Root 'scripts/validate_v14_116_manifest_read_authorization_current_goal_alignment.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "manifest read authorization current goal alignment validation exited with failure"
  } else {
    $manifestReadAuthorizationGoal = ($manifestReadAuthorizationGoalOutput -join "`n") | ConvertFrom-Json
    if ($manifestReadAuthorizationGoal.passed -ne $true) {
      Add-Failure "manifest read authorization current goal alignment validation must pass"
    }
    if ($manifestReadAuthorizationGoal.manifest_read_authorization_package_aligned -ne $true -or $manifestReadAuthorizationGoal.vcpchat_read_authorization_package_aligned -ne $true) {
      Add-Failure "manifest and VCPChat read authorization packages must remain aligned"
    }
    if ($manifestReadAuthorizationGoal.codex_session_default_route_preserved -ne $true) {
      Add-Failure "manifest read authorization alignment must preserve Codex session default route"
    }
    if ($manifestReadAuthorizationGoal.user_authorized -ne $false -or $manifestReadAuthorizationGoal.read_authorized -ne $false -or $manifestReadAuthorizationGoal.source_read_authorized -ne $false) {
      Add-Failure "manifest read authorization alignment must not authorize real reads"
    }
    if ($manifestReadAuthorizationGoal.source_read_performed -ne $false -or $manifestReadAuthorizationGoal.real_manifest_read_performed -ne $false -or $manifestReadAuthorizationGoal.real_vcpchat_read_performed -ne $false -or $manifestReadAuthorizationGoal.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "manifest read authorization alignment must not perform real source reads"
    }
    if ($manifestReadAuthorizationGoal.raw_source_copy_allowed -ne $false -or $manifestReadAuthorizationGoal.raw_manifest_copy_allowed -ne $false) {
      Add-Failure "manifest read authorization alignment must not allow raw source or manifest copying"
    }
    if ($manifestReadAuthorizationGoal.allowed_source_paths_empty -ne $true -or $manifestReadAuthorizationGoal.exact_real_paths_empty -ne $true -or $manifestReadAuthorizationGoal.target_repository_root_stored -ne $false) {
      Add-Failure "manifest read authorization alignment must keep real path fields empty or unstored"
    }
    if ($manifestReadAuthorizationGoal.read_command_permission -ne $false) {
      Add-Failure "manifest read authorization alignment must not grant read command permission"
    }
    if ($manifestReadAuthorizationGoal.selected_plugin -ne $null -or $manifestReadAuthorizationGoal.max_plugin_calls -ne 0) {
      Add-Failure "manifest read authorization alignment must not select a plugin or allow plugin calls"
    }
    if ($manifestReadAuthorizationGoal.provider_contact_performed -ne $false -or $manifestReadAuthorizationGoal.plugin_call_performed -ne $false -or $manifestReadAuthorizationGoal.api_call_performed -ne $false -or $manifestReadAuthorizationGoal.mcp_runtime_performed -ne $false) {
      Add-Failure "manifest read authorization alignment must not call provider/plugin/API/MCP"
    }
    if ($manifestReadAuthorizationGoal.image_generation_performed -ne $false -or $manifestReadAuthorizationGoal.output_file_write_performed -ne $false -or $manifestReadAuthorizationGoal.file_write_performed -ne $false) {
      Add-Failure "manifest read authorization alignment must not generate images or write files"
    }
    if ($manifestReadAuthorizationGoal.daily_note_write_performed -ne $false -or $manifestReadAuthorizationGoal.vcp_memory_write_performed -ne $false -or $manifestReadAuthorizationGoal.production_candidate_created -ne $false) {
      Add-Failure "manifest read authorization alignment must not write memory or create production candidates"
    }
  }

  $dailyNoteMemoryGoalOutput = & node (Join-Path $Root 'scripts/validate_v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "DailyNote/VCP memory authorization current goal alignment validation exited with failure"
  } else {
    $dailyNoteMemoryGoal = ($dailyNoteMemoryGoalOutput -join "`n") | ConvertFrom-Json
    if ($dailyNoteMemoryGoal.passed -ne $true) {
      Add-Failure "DailyNote/VCP memory authorization current goal alignment validation must pass"
    }
    if ($dailyNoteMemoryGoal.daily_note_vcp_memory_authorization_chain_aligned -ne $true -or $dailyNoteMemoryGoal.codex_memory_delta_draft_preserved -ne $true) {
      Add-Failure "DailyNote/VCP memory authorization chain and Codex memory delta draft must remain aligned"
    }
    if ($dailyNoteMemoryGoal.accepted_samples_metadata_does_not_authorize_memory -ne $true) {
      Add-Failure "accepted_samples metadata must not authorize memory writes"
    }
    if ($dailyNoteMemoryGoal.codex_session_default_route_preserved -ne $true) {
      Add-Failure "DailyNote/VCP memory alignment must preserve Codex session default route"
    }
    if ($dailyNoteMemoryGoal.write_mode -ne 'draft' -or $dailyNoteMemoryGoal.approval_required -ne $true -or $dailyNoteMemoryGoal.approval_status -ne 'pending') {
      Add-Failure "Codex memory delta must remain a pending draft"
    }
    if ($dailyNoteMemoryGoal.should_write_to_vcp -ne $false -or $dailyNoteMemoryGoal.daily_note_write_authorized -ne $false) {
      Add-Failure "Codex memory delta must not authorize VCP or DailyNote writes"
    }
    if ($dailyNoteMemoryGoal.daily_note_write_performed -ne $false -or $dailyNoteMemoryGoal.vcp_memory_write_performed -ne $false -or $dailyNoteMemoryGoal.direct_memory_write_performed -ne $false -or $dailyNoteMemoryGoal.actual_write_performed -ne $false -or $dailyNoteMemoryGoal.vcp_memory_written -ne $false) {
      Add-Failure "DailyNote/VCP memory alignment must not perform memory writes"
    }
    if ($dailyNoteMemoryGoal.image_binary_saved_to_memory -ne $false -or $dailyNoteMemoryGoal.raw_sensitive_content_saved -ne $false) {
      Add-Failure "DailyNote/VCP memory alignment must not save image binaries or raw sensitive content"
    }
    if ($dailyNoteMemoryGoal.accepted_samples_write_performed -ne $false -or $dailyNoteMemoryGoal.production_candidate_created -ne $false) {
      Add-Failure "DailyNote/VCP memory alignment must not write accepted_samples or create production candidates"
    }
    if ($dailyNoteMemoryGoal.provider_contact_performed -ne $false -or $dailyNoteMemoryGoal.plugin_call_performed -ne $false -or $dailyNoteMemoryGoal.api_call_performed -ne $false -or $dailyNoteMemoryGoal.mcp_runtime_performed -ne $false) {
      Add-Failure "DailyNote/VCP memory alignment must not call provider/plugin/API/MCP"
    }
    if ($dailyNoteMemoryGoal.image_generation_performed -ne $false -or $dailyNoteMemoryGoal.output_file_write_performed -ne $false -or $dailyNoteMemoryGoal.file_write_performed -ne $false) {
      Add-Failure "DailyNote/VCP memory alignment must not generate images or write files"
    }
  }

  $rollbackAuditValidationGoalOutput = & node (Join-Path $Root 'scripts/validate_v14_118_rollback_audit_validation_package_current_goal_alignment.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "rollback/audit/validation package current goal alignment validation exited with failure"
  } else {
    $rollbackAuditValidationGoal = ($rollbackAuditValidationGoalOutput -join "`n") | ConvertFrom-Json
    if ($rollbackAuditValidationGoal.passed -ne $true) {
      Add-Failure "rollback/audit/validation package current goal alignment validation must pass"
    }
    if ($rollbackAuditValidationGoal.rollback_audit_validation_package_aligned -ne $true -or $rollbackAuditValidationGoal.continuous_stage_evidence_present -ne $true) {
      Add-Failure "rollback/audit/validation package must include continuous stage evidence"
    }
    if ($rollbackAuditValidationGoal.validation_selection_matrix_present -ne $true -or $rollbackAuditValidationGoal.validation_log_stage_chain_present -ne $true -or $rollbackAuditValidationGoal.mvp_validator_wired -ne $true) {
      Add-Failure "rollback/audit/validation package must wire matrix, validation log, and MVP validator"
    }
    if ($rollbackAuditValidationGoal.local_validation_helper_present -ne $true -or $rollbackAuditValidationGoal.agent_board_validator_present -ne $true) {
      Add-Failure "rollback/audit/validation package must include local and agent board validators"
    }
    if ($rollbackAuditValidationGoal.codex_session_default_route_preserved -ne $true) {
      Add-Failure "rollback/audit/validation package must preserve Codex session default route"
    }
    if ($rollbackAuditValidationGoal.provider_contact_performed -ne $false -or $rollbackAuditValidationGoal.plugin_call_performed -ne $false -or $rollbackAuditValidationGoal.api_call_performed -ne $false -or $rollbackAuditValidationGoal.mcp_runtime_performed -ne $false) {
      Add-Failure "rollback/audit/validation package validation must not call provider/plugin/API/MCP"
    }
    if ($rollbackAuditValidationGoal.image_generation_performed -ne $false -or $rollbackAuditValidationGoal.output_file_write_performed -ne $false -or $rollbackAuditValidationGoal.file_write_performed -ne $false) {
      Add-Failure "rollback/audit/validation package validation must not generate images or write files"
    }
    if ($rollbackAuditValidationGoal.daily_note_write_performed -ne $false -or $rollbackAuditValidationGoal.vcp_memory_write_performed -ne $false) {
      Add-Failure "rollback/audit/validation package validation must not write DailyNote or VCP memory"
    }
    if ($rollbackAuditValidationGoal.real_manifest_read_performed -ne $false -or $rollbackAuditValidationGoal.real_vcpchat_read_performed -ne $false -or $rollbackAuditValidationGoal.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "rollback/audit/validation package validation must not read real manifest/VCPChat/VCPToolBox"
    }
    if ($rollbackAuditValidationGoal.accepted_samples_write_performed -ne $false -or $rollbackAuditValidationGoal.failure_samples_write_performed -ne $false -or $rollbackAuditValidationGoal.production_candidate_created -ne $false) {
      Add-Failure "rollback/audit/validation package validation must not write samples or production candidates"
    }
  }

  $promptToArtifactAuditOutput = & node (Join-Path $Root 'scripts/validate_v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "prompt-to-artifact completion audit current goal refresh validation exited with failure"
  } else {
    $promptToArtifactAudit = ($promptToArtifactAuditOutput -join "`n") | ConvertFrom-Json
    if ($promptToArtifactAudit.passed -ne $true) {
      Add-Failure "prompt-to-artifact completion audit current goal refresh validation must pass"
    }
    $promptToArtifactAuditMigratedPending = $promptToArtifactAudit.migration_status -eq 'legacy_runs_missing_git_preview_capsule_pending'
    if ($promptToArtifactAudit.prompt_to_artifact_completion_audit_aligned -ne $true -or $promptToArtifactAudit.goal_to_artifact_trace_complete -ne $true) {
      Add-Failure "prompt-to-artifact completion audit must trace the active goal to concrete artifacts"
    }
    if (-not $promptToArtifactAuditMigratedPending -and ($promptToArtifactAudit.codex_session_generation_route_preserved -ne $true -or $promptToArtifactAudit.import_review_registry_chain_verified -ne $true)) {
      Add-Failure "prompt-to-artifact completion audit must preserve Codex session route and import/review/registry chain"
    }
    if ($promptToArtifactAuditMigratedPending -and ($promptToArtifactAudit.preview_capsule_chain_required -ne $true -or $promptToArtifactAudit.preview_capsule_present -ne $false)) {
      Add-Failure "migrated prompt-to-artifact audit must require the Git preview capsule without claiming it is present"
    }
    if ($promptToArtifactAudit.review_to_memory_and_production_boundaries_verified -ne $true -or $promptToArtifactAudit.rollback_audit_validation_chain_verified -ne $true) {
      Add-Failure "prompt-to-artifact completion audit must verify memory/production boundaries and rollback/audit validation chain"
    }
    if ($promptToArtifactAudit.prompt_to_artifact_completion_audit_not_proxy_only -ne $true) {
      Add-Failure "prompt-to-artifact completion audit must not be proxy-only"
    }
    if ($promptToArtifactAudit.provider_contact_performed -ne $false -or $promptToArtifactAudit.plugin_call_performed -ne $false -or $promptToArtifactAudit.api_call_performed -ne $false -or $promptToArtifactAudit.mcp_runtime_performed -ne $false) {
      Add-Failure "prompt-to-artifact completion audit validation must not call provider/plugin/API/MCP"
    }
    if ($promptToArtifactAudit.image_generation_performed -ne $false -or $promptToArtifactAudit.output_file_write_performed -ne $false -or $promptToArtifactAudit.file_write_performed -ne $false) {
      Add-Failure "prompt-to-artifact completion audit validation must not generate images or write files"
    }
    if ($promptToArtifactAudit.daily_note_write_performed -ne $false -or $promptToArtifactAudit.vcp_memory_write_performed -ne $false) {
      Add-Failure "prompt-to-artifact completion audit validation must not write DailyNote or VCP memory"
    }
    if ($promptToArtifactAudit.real_manifest_read_performed -ne $false -or $promptToArtifactAudit.real_vcpchat_read_performed -ne $false -or $promptToArtifactAudit.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "prompt-to-artifact completion audit validation must not read real manifest/VCPChat/VCPToolBox"
    }
    if ($promptToArtifactAudit.accepted_samples_write_performed -ne $false -or $promptToArtifactAudit.failure_samples_write_performed -ne $false -or $promptToArtifactAudit.production_candidate_created -ne $false) {
      Add-Failure "prompt-to-artifact completion audit validation must not write samples or production candidates"
    }
  }

  $visualSeriesScorecardOutput = & node (Join-Path $Root 'scripts/validate_v14_120_visual_series_taxonomy_review_scorecard_alignment.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "visual series taxonomy review scorecard alignment validation exited with failure"
  } else {
    $visualSeriesScorecard = ($visualSeriesScorecardOutput -join "`n") | ConvertFrom-Json
    if ($visualSeriesScorecard.passed -ne $true) {
      Add-Failure "visual series taxonomy review scorecard alignment validation must pass"
    }
    if ($visualSeriesScorecard.visual_series_taxonomy_review_scorecard_aligned -ne $true -or $visualSeriesScorecard.fashion_lookbook_portrait_scorecard_fields_verified -ne $true) {
      Add-Failure "visual series taxonomy and fashion lookbook scorecard fields must remain aligned"
    }
    if ($visualSeriesScorecard.product_hero_prompt_review_checklist_verified -ne $true -or $visualSeriesScorecard.accepted_samples_acceptance_summary_mapped -ne $true) {
      Add-Failure "product hero prompt checklist and accepted_samples acceptance summary must remain mapped"
    }
    if ($visualSeriesScorecard.review_console_asset_status_taxonomy_verified -ne $true) {
      Add-Failure "Review Console asset status taxonomy must remain verified"
    }
    if ($visualSeriesScorecard.provider_contact_performed -ne $false -or $visualSeriesScorecard.plugin_call_performed -ne $false -or $visualSeriesScorecard.api_call_performed -ne $false -or $visualSeriesScorecard.mcp_runtime_performed -ne $false) {
      Add-Failure "visual series scorecard validation must not call provider/plugin/API/MCP"
    }
    if ($visualSeriesScorecard.image_generation_performed -ne $false -or $visualSeriesScorecard.output_file_write_performed -ne $false -or $visualSeriesScorecard.file_write_performed -ne $false) {
      Add-Failure "visual series scorecard validation must not generate images or write files"
    }
    if ($visualSeriesScorecard.daily_note_write_performed -ne $false -or $visualSeriesScorecard.vcp_memory_write_performed -ne $false) {
      Add-Failure "visual series scorecard validation must not write DailyNote or VCP memory"
    }
    if ($visualSeriesScorecard.real_manifest_read_performed -ne $false -or $visualSeriesScorecard.real_vcpchat_read_performed -ne $false -or $visualSeriesScorecard.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "visual series scorecard validation must not read real manifest/VCPChat/VCPToolBox"
    }
    if ($visualSeriesScorecard.accepted_samples_write_performed -ne $false -or $visualSeriesScorecard.failure_samples_write_performed -ne $false -or $visualSeriesScorecard.production_candidate_created -ne $false) {
      Add-Failure "visual series scorecard validation must not write samples or production candidates"
    }
  }

  $codexPromptGovernanceOutput = & node (Join-Path $Root 'scripts/validate_v14_121_codex_session_prompt_package_library_governance.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Codex session prompt package library governance validation exited with failure"
  } else {
    $codexPromptGovernance = ($codexPromptGovernanceOutput -join "`n") | ConvertFrom-Json
    if ($codexPromptGovernance.passed -ne $true) {
      Add-Failure "Codex session prompt package library governance validation must pass"
    }
    if ($codexPromptGovernance.codex_session_prompt_package_library_governance_aligned -ne $true -or $codexPromptGovernance.codex_prompt_schema_validation_passed -ne $true) {
      Add-Failure "Codex session prompt package governance and schema validation must remain aligned"
    }
    if ($codexPromptGovernance.codex_prompt_not_execution_authorization -ne $true -or $codexPromptGovernance.codex_prompt_project_script_generation_blocked -ne $true) {
      Add-Failure "Codex session prompt package must not authorize execution or project-script generation"
    }
    if ($codexPromptGovernance.codex_prompt_review_chain_linked -ne $true) {
      Add-Failure "Codex session prompt package must remain linked to review/import chain"
    }
    if ($codexPromptGovernance.provider_contact_performed -ne $false -or $codexPromptGovernance.plugin_call_performed -ne $false -or $codexPromptGovernance.api_call_performed -ne $false -or $codexPromptGovernance.mcp_runtime_performed -ne $false) {
      Add-Failure "Codex session prompt governance validation must not call provider/plugin/API/MCP"
    }
    if ($codexPromptGovernance.image_generation_performed -ne $false -or $codexPromptGovernance.output_file_write_performed -ne $false -or $codexPromptGovernance.file_write_performed -ne $false) {
      Add-Failure "Codex session prompt governance validation must not generate images or write files"
    }
    if ($codexPromptGovernance.daily_note_write_performed -ne $false -or $codexPromptGovernance.vcp_memory_write_performed -ne $false) {
      Add-Failure "Codex session prompt governance validation must not write DailyNote or VCP memory"
    }
    if ($codexPromptGovernance.real_manifest_read_performed -ne $false -or $codexPromptGovernance.real_vcpchat_read_performed -ne $false -or $codexPromptGovernance.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "Codex session prompt governance validation must not read real manifest/VCPChat/VCPToolBox"
    }
    if ($codexPromptGovernance.accepted_samples_write_performed -ne $false -or $codexPromptGovernance.failure_samples_write_performed -ne $false -or $codexPromptGovernance.production_candidate_created -ne $false) {
      Add-Failure "Codex session prompt governance validation must not write samples or production candidates"
    }
  }

  $localReviewRecordSchemaOutput = & node (Join-Path $Root 'scripts/validate_v14_122_local_review_record_schema_refresh.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "local review record schema refresh validation exited with failure"
  } else {
    $localReviewRecordSchema = ($localReviewRecordSchemaOutput -join "`n") | ConvertFrom-Json
    if ($localReviewRecordSchema.passed -ne $true) {
      Add-Failure "local review record schema refresh validation must pass"
    }
    if ($localReviewRecordSchema.local_review_record_schema_aligned -ne $true -or $localReviewRecordSchema.codex_session_review_records_verified -ne $true) {
      Add-Failure "local review record schema and Codex session review records must remain aligned"
    }
    if ($localReviewRecordSchema.review_record_boundary_fields_verified -ne $true -or $localReviewRecordSchema.review_record_next_gate_authorization_fields_verified -ne $true) {
      Add-Failure "local review records must include boundary and next-gate authorization fields"
    }
    if ($localReviewRecordSchema.review_record_schema_no_execution -ne $true) {
      Add-Failure "local review record schema must remain no-execution"
    }
    if ($localReviewRecordSchema.provider_contact_performed -ne $false -or $localReviewRecordSchema.plugin_call_performed -ne $false -or $localReviewRecordSchema.api_call_performed -ne $false -or $localReviewRecordSchema.mcp_runtime_performed -ne $false) {
      Add-Failure "local review record schema validation must not call provider/plugin/API/MCP"
    }
    if ($localReviewRecordSchema.image_generation_performed -ne $false -or $localReviewRecordSchema.output_file_write_performed -ne $false -or $localReviewRecordSchema.file_write_performed -ne $false) {
      Add-Failure "local review record schema validation must not generate images or write files"
    }
    if ($localReviewRecordSchema.daily_note_write_performed -ne $false -or $localReviewRecordSchema.vcp_memory_write_performed -ne $false) {
      Add-Failure "local review record schema validation must not write DailyNote or VCP memory"
    }
    if ($localReviewRecordSchema.real_manifest_read_performed -ne $false -or $localReviewRecordSchema.real_vcpchat_read_performed -ne $false -or $localReviewRecordSchema.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "local review record schema validation must not read real manifest/VCPChat/VCPToolBox"
    }
    if ($localReviewRecordSchema.accepted_samples_write_performed -ne $false -or $localReviewRecordSchema.failure_samples_write_performed -ne $false -or $localReviewRecordSchema.production_candidate_created -ne $false) {
      Add-Failure "local review record schema validation must not write samples or production candidates"
    }
  }

  $memoryDeltaDraftAlignmentOutput = & node (Join-Path $Root 'scripts/validate_v14_123_memory_delta_draft_schema_alignment_for_codex_reviews.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "memory_delta draft schema alignment for Codex reviews validation exited with failure"
  } else {
    $memoryDeltaDraftAlignment = ($memoryDeltaDraftAlignmentOutput -join "`n") | ConvertFrom-Json
    if ($memoryDeltaDraftAlignment.passed -ne $true) {
      Add-Failure "memory_delta draft schema alignment for Codex reviews validation must pass"
    }
    if ($memoryDeltaDraftAlignment.memory_delta_draft_schema_aligned_for_codex_reviews -ne $true -or $memoryDeltaDraftAlignment.review_record_to_memory_delta_mapping_verified -ne $true) {
      Add-Failure "memory_delta draft schema must remain mapped to Codex review records"
    }
    if ($memoryDeltaDraftAlignment.memory_delta_draft_only_verified -ne $true -or $memoryDeltaDraftAlignment.daily_note_vcp_memory_write_blocked -ne $true) {
      Add-Failure "memory_delta alignment must stay draft-only and block DailyNote/VCP memory writes"
    }
    if ($memoryDeltaDraftAlignment.provider_contact_performed -ne $false -or $memoryDeltaDraftAlignment.plugin_call_performed -ne $false -or $memoryDeltaDraftAlignment.api_call_performed -ne $false -or $memoryDeltaDraftAlignment.mcp_runtime_performed -ne $false) {
      Add-Failure "memory_delta draft alignment validation must not call provider/plugin/API/MCP"
    }
    if ($memoryDeltaDraftAlignment.image_generation_performed -ne $false -or $memoryDeltaDraftAlignment.output_file_write_performed -ne $false -or $memoryDeltaDraftAlignment.file_write_performed -ne $false) {
      Add-Failure "memory_delta draft alignment validation must not generate images or write files"
    }
    if ($memoryDeltaDraftAlignment.daily_note_write_performed -ne $false -or $memoryDeltaDraftAlignment.vcp_memory_write_performed -ne $false) {
      Add-Failure "memory_delta draft alignment validation must not write DailyNote or VCP memory"
    }
    if ($memoryDeltaDraftAlignment.real_manifest_read_performed -ne $false -or $memoryDeltaDraftAlignment.real_vcpchat_read_performed -ne $false -or $memoryDeltaDraftAlignment.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "memory_delta draft alignment validation must not read real manifest/VCPChat/VCPToolBox"
    }
    if ($memoryDeltaDraftAlignment.accepted_samples_write_performed -ne $false -or $memoryDeltaDraftAlignment.failure_samples_write_performed -ne $false -or $memoryDeltaDraftAlignment.production_candidate_created -ne $false) {
      Add-Failure "memory_delta draft alignment validation must not write samples or production candidates"
    }
  }

  $contextLoadCompactionOutput = & node (Join-Path $Root 'scripts/validate_v14_124_context_load_guide_and_historical_docs_compaction.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "context load guide and historical docs compaction validation exited with failure"
  } else {
    $contextLoadCompaction = ($contextLoadCompactionOutput -join "`n") | ConvertFrom-Json
    if ($contextLoadCompaction.passed -ne $true) {
      Add-Failure "context load guide and historical docs compaction validation must pass"
    }
    if ($contextLoadCompaction.default_context_packet_defined -ne $true -or $contextLoadCompaction.historical_docs_demoted_to_targeted_lookup -ne $true) {
      Add-Failure "context compaction must define default context and demote old docs to targeted lookup"
    }
    if ($contextLoadCompaction.old_authorization_records_not_current_authorization -ne $true) {
      Add-Failure "context compaction must keep old authorization records from becoming current authorization"
    }
    if ($contextLoadCompaction.historical_docs_deleted -ne $false -or $contextLoadCompaction.historical_docs_moved -ne $false -or $contextLoadCompaction.historical_docs_rewritten -ne $false) {
      Add-Failure "context compaction validation must not delete, move, or rewrite historical docs"
    }
    if ($contextLoadCompaction.provider_contact_performed -ne $false -or $contextLoadCompaction.plugin_call_performed -ne $false -or $contextLoadCompaction.api_call_performed -ne $false -or $contextLoadCompaction.mcp_runtime_performed -ne $false) {
      Add-Failure "context compaction validation must not call provider/plugin/API/MCP"
    }
    if ($contextLoadCompaction.image_generation_performed -ne $false -or $contextLoadCompaction.output_file_write_performed -ne $false -or $contextLoadCompaction.file_write_performed -ne $false) {
      Add-Failure "context compaction validation must not generate images or write output files"
    }
    if ($contextLoadCompaction.daily_note_write_performed -ne $false -or $contextLoadCompaction.vcp_memory_write_performed -ne $false) {
      Add-Failure "context compaction validation must not write DailyNote or VCP memory"
    }
    if ($contextLoadCompaction.real_manifest_read_performed -ne $false -or $contextLoadCompaction.real_vcpchat_read_performed -ne $false -or $contextLoadCompaction.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "context compaction validation must not read real manifest/VCPChat/VCPToolBox"
    }
    if ($contextLoadCompaction.accepted_samples_write_performed -ne $false -or $contextLoadCompaction.failure_samples_write_performed -ne $false -or $contextLoadCompaction.production_candidate_created -ne $false) {
      Add-Failure "context compaction validation must not write samples or production candidates"
    }
  }

  $reviewConsoleMemoryDeltaHandoffOutput = & node (Join-Path $Root 'scripts/validate_v14_125_review_console_memory_delta_handoff_refresh.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console memory_delta handoff refresh validation exited with failure"
  } else {
    $reviewConsoleMemoryDeltaHandoff = ($reviewConsoleMemoryDeltaHandoffOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleMemoryDeltaHandoff.passed -ne $true) {
      Add-Failure "Review Console memory_delta handoff refresh validation must pass"
    }
    if ($reviewConsoleMemoryDeltaHandoff.review_console_memory_delta_handoff_refreshed -ne $true -or $reviewConsoleMemoryDeltaHandoff.codex_session_memory_delta_draft_visible_in_review_console -ne $true) {
      Add-Failure "Review Console memory_delta handoff must expose the Codex-session memory_delta draft"
    }
    if ($reviewConsoleMemoryDeltaHandoff.memory_delta_write_mode_remains_draft -ne $true -or $reviewConsoleMemoryDeltaHandoff.memory_delta_approval_status_remains_pending -ne $true -or $reviewConsoleMemoryDeltaHandoff.memory_delta_should_write_to_vcp_false -ne $true) {
      Add-Failure "Review Console memory_delta handoff must keep draft/pending/no-write memory controls"
    }
    if ($reviewConsoleMemoryDeltaHandoff.review_console_memory_handoff_display_only -ne $true -or $reviewConsoleMemoryDeltaHandoff.daily_note_vcp_memory_write_blocked -ne $true) {
      Add-Failure "Review Console memory_delta handoff must remain display-only and block memory writes"
    }
    if ($reviewConsoleMemoryDeltaHandoff.provider_contact_performed -ne $false -or $reviewConsoleMemoryDeltaHandoff.plugin_call_performed -ne $false -or $reviewConsoleMemoryDeltaHandoff.api_call_performed -ne $false -or $reviewConsoleMemoryDeltaHandoff.mcp_runtime_performed -ne $false) {
      Add-Failure "Review Console memory_delta handoff validation must not call provider/plugin/API/MCP"
    }
    if ($reviewConsoleMemoryDeltaHandoff.image_generation_performed -ne $false -or $reviewConsoleMemoryDeltaHandoff.output_file_write_performed -ne $false -or $reviewConsoleMemoryDeltaHandoff.file_write_performed -ne $false) {
      Add-Failure "Review Console memory_delta handoff validation must not generate images or write output files"
    }
    if ($reviewConsoleMemoryDeltaHandoff.daily_note_write_performed -ne $false -or $reviewConsoleMemoryDeltaHandoff.vcp_memory_write_performed -ne $false) {
      Add-Failure "Review Console memory_delta handoff validation must not write DailyNote or VCP memory"
    }
    if ($reviewConsoleMemoryDeltaHandoff.real_manifest_read_performed -ne $false -or $reviewConsoleMemoryDeltaHandoff.real_vcpchat_read_performed -ne $false -or $reviewConsoleMemoryDeltaHandoff.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "Review Console memory_delta handoff validation must not read real manifest/VCPChat/VCPToolBox"
    }
    if ($reviewConsoleMemoryDeltaHandoff.accepted_samples_write_performed -ne $false -or $reviewConsoleMemoryDeltaHandoff.failure_samples_write_performed -ne $false -or $reviewConsoleMemoryDeltaHandoff.production_candidate_created -ne $false) {
      Add-Failure "Review Console memory_delta handoff validation must not write samples or production candidates"
    }
  }

  $acceptedFailureMetadataGapOutput = & node (Join-Path $Root 'scripts/validate_v14_126_accepted_failure_metadata_cross_index_gap_review.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "accepted/failure metadata cross-index gap validation exited with failure"
  } else {
    $acceptedFailureMetadataGap = ($acceptedFailureMetadataGapOutput -join "`n") | ConvertFrom-Json
    if ($acceptedFailureMetadataGap.passed -ne $true) {
      Add-Failure "accepted/failure metadata cross-index gap validation must pass"
    }
    if ($acceptedFailureMetadataGap.codex_session_accepted_sample_registered -ne $true -or $acceptedFailureMetadataGap.codex_session_failure_sample_registered -ne $false) {
      Add-Failure "accepted/failure metadata gap validation must preserve Codex accepted sample and no Codex failure sample"
    }
    if ($acceptedFailureMetadataGap.failure_samples_gap_is_authorization_blocked -ne $true -or $acceptedFailureMetadataGap.failure_samples_write_requires_separate_authorization -ne $true) {
      Add-Failure "accepted/failure metadata gap must remain blocked by failure_samples authorization"
    }
    if ($acceptedFailureMetadataGap.failure_samples_write_performed -ne $false -or $acceptedFailureMetadataGap.failure_samples_registry_write_performed -ne $false -or $acceptedFailureMetadataGap.failure_samples_taxonomy_write_performed -ne $false) {
      Add-Failure "accepted/failure metadata gap validation must not write failure_samples"
    }
    if ($acceptedFailureMetadataGap.accepted_samples_write_performed -ne $false -or $acceptedFailureMetadataGap.production_candidate_created -ne $false) {
      Add-Failure "accepted/failure metadata gap validation must not write accepted_samples or production candidates"
    }
    if ($acceptedFailureMetadataGap.provider_contact_performed -ne $false -or $acceptedFailureMetadataGap.plugin_call_performed -ne $false -or $acceptedFailureMetadataGap.api_call_performed -ne $false -or $acceptedFailureMetadataGap.mcp_runtime_performed -ne $false) {
      Add-Failure "accepted/failure metadata gap validation must not call provider/plugin/API/MCP"
    }
    if ($acceptedFailureMetadataGap.image_generation_performed -ne $false -or $acceptedFailureMetadataGap.output_file_write_performed -ne $false -or $acceptedFailureMetadataGap.file_write_performed -ne $false) {
      Add-Failure "accepted/failure metadata gap validation must not generate images or write output files"
    }
    if ($acceptedFailureMetadataGap.daily_note_write_performed -ne $false -or $acceptedFailureMetadataGap.vcp_memory_write_performed -ne $false) {
      Add-Failure "accepted/failure metadata gap validation must not write DailyNote or VCP memory"
    }
    if ($acceptedFailureMetadataGap.real_manifest_read_performed -ne $false -or $acceptedFailureMetadataGap.real_vcpchat_read_performed -ne $false -or $acceptedFailureMetadataGap.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "accepted/failure metadata gap validation must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $productionExclusionCurrentGoalGapOutput = & node (Join-Path $Root 'scripts/validate_v14_127_production_exclusion_draft_current_goal_gap_review.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "production exclusion current-goal gap validation exited with failure"
  } else {
    $productionExclusionCurrentGoalGap = ($productionExclusionCurrentGoalGapOutput -join "`n") | ConvertFrom-Json
    if ($productionExclusionCurrentGoalGap.passed -ne $true) {
      Add-Failure "production exclusion current-goal gap validation must pass"
    }
    if ($productionExclusionCurrentGoalGap.production_exclusion_register_present -ne $true -or $productionExclusionCurrentGoalGap.codex_session_accepted_sample_in_production_exclusion_register -ne $false) {
      Add-Failure "production exclusion current-goal gap must preserve register presence and keep Codex accepted sample out of exclusion register"
    }
    if ($productionExclusionCurrentGoalGap.current_codex_sample_production_exclusion_gap_is_expected -ne $true -or $productionExclusionCurrentGoalGap.production_candidate_gate_still_blocks_upgrade -ne $true) {
      Add-Failure "production exclusion current-goal gap must remain expected and production-candidate gated"
    }
    if ($productionExclusionCurrentGoalGap.production_exclusion_draft_write_performed -ne $false -or $productionExclusionCurrentGoalGap.production_exclusion_register_modified -ne $false) {
      Add-Failure "production exclusion current-goal gap validation must not write production exclusion artifacts"
    }
    if ($productionExclusionCurrentGoalGap.accepted_samples_write_performed -ne $false -or $productionExclusionCurrentGoalGap.failure_samples_write_performed -ne $false -or $productionExclusionCurrentGoalGap.production_candidate_created -ne $false) {
      Add-Failure "production exclusion current-goal gap validation must not write samples or production candidates"
    }
    if ($productionExclusionCurrentGoalGap.provider_contact_performed -ne $false -or $productionExclusionCurrentGoalGap.plugin_call_performed -ne $false -or $productionExclusionCurrentGoalGap.api_call_performed -ne $false -or $productionExclusionCurrentGoalGap.mcp_runtime_performed -ne $false) {
      Add-Failure "production exclusion current-goal gap validation must not call provider/plugin/API/MCP"
    }
    if ($productionExclusionCurrentGoalGap.image_generation_performed -ne $false -or $productionExclusionCurrentGoalGap.output_file_write_performed -ne $false -or $productionExclusionCurrentGoalGap.file_write_performed -ne $false) {
      Add-Failure "production exclusion current-goal gap validation must not generate images or write output files"
    }
    if ($productionExclusionCurrentGoalGap.daily_note_write_performed -ne $false -or $productionExclusionCurrentGoalGap.vcp_memory_write_performed -ne $false) {
      Add-Failure "production exclusion current-goal gap validation must not write DailyNote or VCP memory"
    }
    if ($productionExclusionCurrentGoalGap.real_manifest_read_performed -ne $false -or $productionExclusionCurrentGoalGap.real_vcpchat_read_performed -ne $false -or $productionExclusionCurrentGoalGap.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "production exclusion current-goal gap validation must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $failureSamplesAuthorizationTemplateOutput = & node (Join-Path $Root 'scripts/validate_v14_128_failure_samples_authorization_template_current_goal_gap_review.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "failure_samples authorization template validation exited with failure"
  } else {
    $failureSamplesAuthorizationTemplate = ($failureSamplesAuthorizationTemplateOutput -join "`n") | ConvertFrom-Json
    if ($failureSamplesAuthorizationTemplate.passed -ne $true) {
      Add-Failure "failure_samples authorization template validation must pass"
    }
    if ($failureSamplesAuthorizationTemplate.failure_samples_authorization_template_created -ne $true -or $failureSamplesAuthorizationTemplate.failure_samples_authorization_template_active -ne $false) {
      Add-Failure "failure_samples authorization template must exist and remain inactive"
    }
    if ($failureSamplesAuthorizationTemplate.authorization_granted_by_this_record -ne $false -or $failureSamplesAuthorizationTemplate.actual_failure_samples_write_blocked_until_separate_exact_a5_authorization -ne $true) {
      Add-Failure "failure_samples authorization template must not grant authorization and must block actual writes"
    }
    if ($failureSamplesAuthorizationTemplate.failure_samples_write_performed -ne $false -or $failureSamplesAuthorizationTemplate.failure_samples_registry_write_performed -ne $false -or $failureSamplesAuthorizationTemplate.failure_samples_taxonomy_write_performed -ne $false) {
      Add-Failure "failure_samples authorization template validation must not write failure_samples"
    }
    if ($failureSamplesAuthorizationTemplate.accepted_samples_write_performed -ne $false -or $failureSamplesAuthorizationTemplate.production_candidate_created -ne $false) {
      Add-Failure "failure_samples authorization template validation must not write accepted_samples or production candidates"
    }
    if ($failureSamplesAuthorizationTemplate.provider_contact_performed -ne $false -or $failureSamplesAuthorizationTemplate.plugin_call_performed -ne $false -or $failureSamplesAuthorizationTemplate.api_call_performed -ne $false -or $failureSamplesAuthorizationTemplate.mcp_runtime_performed -ne $false) {
      Add-Failure "failure_samples authorization template validation must not call provider/plugin/API/MCP"
    }
    if ($failureSamplesAuthorizationTemplate.image_generation_performed -ne $false -or $failureSamplesAuthorizationTemplate.output_file_write_performed -ne $false -or $failureSamplesAuthorizationTemplate.file_write_performed -ne $false) {
      Add-Failure "failure_samples authorization template validation must not generate images or write output files"
    }
    if ($failureSamplesAuthorizationTemplate.daily_note_write_performed -ne $false -or $failureSamplesAuthorizationTemplate.vcp_memory_write_performed -ne $false) {
      Add-Failure "failure_samples authorization template validation must not write DailyNote or VCP memory"
    }
    if ($failureSamplesAuthorizationTemplate.real_manifest_read_performed -ne $false -or $failureSamplesAuthorizationTemplate.real_vcpchat_read_performed -ne $false -or $failureSamplesAuthorizationTemplate.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "failure_samples authorization template validation must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $currentGoalCompletionAuditOutput = & node (Join-Path $Root 'scripts/validate_v14_129_current_goal_completion_audit_gap_map.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "current goal completion audit gap map validation exited with failure"
  } else {
    $currentGoalCompletionAudit = ($currentGoalCompletionAuditOutput -join "`n") | ConvertFrom-Json
    if ($currentGoalCompletionAudit.passed -ne $true) {
      Add-Failure "current goal completion audit gap map validation must pass"
    }
    if ($currentGoalCompletionAudit.objective_restated -ne $true -or $currentGoalCompletionAudit.prompt_to_artifact_checklist_created -ne $true) {
      Add-Failure "current goal completion audit must restate objective and create prompt-to-artifact checklist"
    }
    if ($currentGoalCompletionAudit.goal_complete_now -ne $false -or $currentGoalCompletionAudit.update_goal_called -ne $false) {
      Add-Failure "current goal completion audit must not mark the active goal complete"
    }
    if ($currentGoalCompletionAudit.missing_or_incomplete_items_present -ne $true -or $currentGoalCompletionAudit.authorization_blocked_items_count -lt 1) {
      Add-Failure "current goal completion audit must identify missing or authorization-blocked items"
    }
    if ($currentGoalCompletionAudit.proxy_signal_only -ne $false -or $currentGoalCompletionAudit.completion_audit_uses_real_artifacts -ne $true) {
      Add-Failure "current goal completion audit must rely on real artifacts, not proxy signals only"
    }
    if ($currentGoalCompletionAudit.provider_contact_performed -ne $false -or $currentGoalCompletionAudit.plugin_call_performed -ne $false -or $currentGoalCompletionAudit.api_call_performed -ne $false -or $currentGoalCompletionAudit.mcp_runtime_performed -ne $false) {
      Add-Failure "current goal completion audit must not call provider/plugin/API/MCP"
    }
    if ($currentGoalCompletionAudit.image_generation_performed -ne $false -or $currentGoalCompletionAudit.output_file_write_performed -ne $false -or $currentGoalCompletionAudit.file_write_performed -ne $false) {
      Add-Failure "current goal completion audit must not generate images or write output files"
    }
    if ($currentGoalCompletionAudit.daily_note_write_performed -ne $false -or $currentGoalCompletionAudit.vcp_memory_write_performed -ne $false) {
      Add-Failure "current goal completion audit must not write DailyNote or VCP memory"
    }
    if ($currentGoalCompletionAudit.accepted_samples_write_performed -ne $false -or $currentGoalCompletionAudit.failure_samples_write_performed -ne $false -or $currentGoalCompletionAudit.production_candidate_created -ne $false) {
      Add-Failure "current goal completion audit must not write samples or production candidates"
    }
    if ($currentGoalCompletionAudit.real_manifest_read_performed -ne $false -or $currentGoalCompletionAudit.real_vcpchat_read_performed -ne $false -or $currentGoalCompletionAudit.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "current goal completion audit must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $legacyDocsContextQuarantineOutput = & node (Join-Path $Root 'scripts/validate_v14_130_legacy_docs_context_quarantine_refresh.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "legacy docs context quarantine refresh validation exited with failure"
  } else {
    $legacyDocsContextQuarantine = ($legacyDocsContextQuarantineOutput -join "`n") | ConvertFrom-Json
    if ($legacyDocsContextQuarantine.passed -ne $true) {
      Add-Failure "legacy docs context quarantine refresh validation must pass"
    }
    if ($legacyDocsContextQuarantine.legacy_docs_context_quarantine_created -ne $true -or $legacyDocsContextQuarantine.context_load_guide_hot_packet_refreshed -ne $true) {
      Add-Failure "legacy docs context quarantine must create quarantine map and refresh the hot context packet"
    }
    if ($legacyDocsContextQuarantine.historical_compaction_index_quarantine_refreshed -ne $true -or $legacyDocsContextQuarantine.current_goal_audit_is_hot_context -ne $true) {
      Add-Failure "legacy docs context quarantine must refresh historical index and route to current goal audit"
    }
    if ($legacyDocsContextQuarantine.bulk_historical_load_allowed -ne $false -or $legacyDocsContextQuarantine.targeted_lookup_required_for_legacy_docs -ne $true) {
      Add-Failure "legacy docs context quarantine must block bulk historical load and require targeted lookup"
    }
    if ($legacyDocsContextQuarantine.goal_complete_now -ne $false -or $legacyDocsContextQuarantine.update_goal_called -ne $false) {
      Add-Failure "legacy docs context quarantine must not mark the active goal complete"
    }
    if ($legacyDocsContextQuarantine.historical_docs_deleted -ne $false -or $legacyDocsContextQuarantine.historical_docs_moved -ne $false -or $legacyDocsContextQuarantine.historical_docs_rewritten -ne $false) {
      Add-Failure "legacy docs context quarantine must not delete, move, or rewrite historical docs"
    }
    if ($legacyDocsContextQuarantine.provider_contact_performed -ne $false -or $legacyDocsContextQuarantine.plugin_call_performed -ne $false -or $legacyDocsContextQuarantine.api_call_performed -ne $false -or $legacyDocsContextQuarantine.mcp_runtime_performed -ne $false) {
      Add-Failure "legacy docs context quarantine must not call provider/plugin/API/MCP"
    }
    if ($legacyDocsContextQuarantine.image_generation_performed -ne $false -or $legacyDocsContextQuarantine.output_file_write_performed -ne $false -or $legacyDocsContextQuarantine.file_write_performed -ne $false) {
      Add-Failure "legacy docs context quarantine must not generate images or write output files"
    }
    if ($legacyDocsContextQuarantine.daily_note_write_performed -ne $false -or $legacyDocsContextQuarantine.vcp_memory_write_performed -ne $false) {
      Add-Failure "legacy docs context quarantine must not write DailyNote or VCP memory"
    }
    if ($legacyDocsContextQuarantine.accepted_samples_write_performed -ne $false -or $legacyDocsContextQuarantine.failure_samples_write_performed -ne $false -or $legacyDocsContextQuarantine.production_candidate_created -ne $false) {
      Add-Failure "legacy docs context quarantine must not write samples or production candidates"
    }
    if ($legacyDocsContextQuarantine.real_manifest_read_performed -ne $false -or $legacyDocsContextQuarantine.real_vcpchat_read_performed -ne $false -or $legacyDocsContextQuarantine.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "legacy docs context quarantine must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $artifactRecoverabilityOutput = & node (Join-Path $Root 'scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "real artifact recoverability validation exited with failure"
  } else {
    $artifactRecoverability = ($artifactRecoverabilityOutput -join "`n") | ConvertFrom-Json
    if ($artifactRecoverability.passed -ne $true) {
      Add-Failure "real artifact recoverability validation must pass"
    }
    $artifactRecoverabilityMigratedPending = $artifactRecoverability.migration_status -eq 'legacy_runs_missing_git_preview_capsule_pending'
    if (-not $artifactRecoverabilityMigratedPending -and ($artifactRecoverability.real_import_record_parsed -ne $true -or $artifactRecoverability.real_artifact_file_exists -ne $true)) {
      Add-Failure "real artifact recoverability must parse the real import record and find the real artifact"
    }
    if (-not $artifactRecoverabilityMigratedPending -and ($artifactRecoverability.artifact_hash_validation -ne "local_file_hash_passed" -or $artifactRecoverability.artifact_dimensions_validation -ne "png_header_dimensions_passed")) {
      Add-Failure "real artifact recoverability must verify real local hash and PNG dimensions"
    }
    if (-not $artifactRecoverabilityMigratedPending -and $artifactRecoverability.registry_import_review_category_chain_verified -ne $true) {
      Add-Failure "real artifact recoverability must verify registry/import/review/category chain"
    }
    if ($artifactRecoverability.negative_case_hash_mismatch_fails -ne $true -or $artifactRecoverability.negative_case_missing_artifact_fails -ne $true -or $artifactRecoverability.negative_case_missing_human_approval_fails -ne $true) {
      Add-Failure "real artifact recoverability must include negative case coverage"
    }
    if (-not $artifactRecoverabilityMigratedPending -and ($artifactRecoverability.recoverability_status -ne "workspace_local_verified" -or $artifactRecoverability.portable_after_clone -ne $false)) {
      Add-Failure "real artifact recoverability must report workspace-local verification without claiming clone portability"
    }
    if ($artifactRecoverabilityMigratedPending -and ($artifactRecoverability.preview_capsule_required -ne $true -or $artifactRecoverability.preview_capsule_present -ne $false -or $artifactRecoverability.evidence_source -ne 'asset_archive/accepted_samples/<sample_id>/manifest.json + preview.webp')) {
      Add-Failure "migrated artifact recoverability must require the Git preview capsule without claiming it is present"
    }
    if ($artifactRecoverability.vcp_runtime_integration_proven -ne $false -or $artifactRecoverability.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "real artifact recoverability must not claim VCP runtime integration"
    }
    if ($artifactRecoverability.provider_contact_performed -ne $false -or $artifactRecoverability.plugin_call_performed -ne $false -or $artifactRecoverability.api_call_performed -ne $false -or $artifactRecoverability.mcp_runtime_performed -ne $false) {
      Add-Failure "real artifact recoverability must not call provider/plugin/API/MCP"
    }
    if ($artifactRecoverability.image_generation_performed -ne $false -or $artifactRecoverability.output_file_write_performed -ne $false -or $artifactRecoverability.file_write_performed -ne $false) {
      Add-Failure "real artifact recoverability must not generate or write image/output files"
    }
    if ($artifactRecoverability.daily_note_write_performed -ne $false -or $artifactRecoverability.vcp_memory_write_performed -ne $false) {
      Add-Failure "real artifact recoverability must not write DailyNote or VCP memory"
    }
    if ($artifactRecoverability.failure_samples_write_performed -ne $false -or $artifactRecoverability.production_candidate_created -ne $false) {
      Add-Failure "real artifact recoverability must not write failure_samples or production candidates"
    }
    if ($artifactRecoverability.real_manifest_read_performed -ne $false -or $artifactRecoverability.real_vcpchat_read_performed -ne $false -or $artifactRecoverability.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "real artifact recoverability must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $stateScopeCanonicalizationOutput = & node (Join-Path $Root 'scripts/validate_v14_132_state_scope_canonicalization.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "state scope canonicalization validation exited with failure"
  } else {
    $stateScopeCanonicalization = ($stateScopeCanonicalizationOutput -join "`n") | ConvertFrom-Json
    if ($stateScopeCanonicalization.passed -ne $true) {
      Add-Failure "state scope canonicalization validation must pass"
    }
    if ($stateScopeCanonicalization.active_scope_defined -ne $true -or $stateScopeCanonicalization.artifact_scope_defined -ne $true) {
      Add-Failure "state scope canonicalization must define active and artifact scopes"
    }
    if ($stateScopeCanonicalization.authorization_scope_defined -ne $true -or $stateScopeCanonicalization.side_effect_scope_defined -ne $true -or $stateScopeCanonicalization.history_scope_defined -ne $true) {
      Add-Failure "state scope canonicalization must define authorization, side-effect, and history scopes"
    }
    if ($stateScopeCanonicalization.phase_current_project_history_separated -ne $true -or $stateScopeCanonicalization.progress_percentage_requires_scope_split -ne $true) {
      Add-Failure "state scope canonicalization must separate phase-current facts from project history and scoped progress"
    }
    if ($stateScopeCanonicalization.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "state scope canonicalization must keep artifact recoverability separate from VCP runtime integration"
    }
    if ($stateScopeCanonicalization.provider_contact_performed -ne $false -or $stateScopeCanonicalization.plugin_call_performed -ne $false -or $stateScopeCanonicalization.api_call_performed -ne $false -or $stateScopeCanonicalization.mcp_runtime_performed -ne $false) {
      Add-Failure "state scope canonicalization must not call provider/plugin/API/MCP"
    }
    if ($stateScopeCanonicalization.image_generation_performed -ne $false -or $stateScopeCanonicalization.daily_note_write_performed -ne $false -or $stateScopeCanonicalization.vcp_memory_write_performed -ne $false) {
      Add-Failure "state scope canonicalization must not generate images or write DailyNote/VCP memory"
    }
    if ($stateScopeCanonicalization.failure_samples_write_performed -ne $false -or $stateScopeCanonicalization.production_candidate_created -ne $false) {
      Add-Failure "state scope canonicalization must not write failure_samples or production candidates"
    }
    if ($stateScopeCanonicalization.real_manifest_read_performed -ne $false -or $stateScopeCanonicalization.real_vcpchat_read_performed -ne $false -or $stateScopeCanonicalization.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "state scope canonicalization must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $mainValidatorRealImportRecordWiringOutput = & node (Join-Path $Root 'scripts/validate_v14_133_main_validator_real_import_record_wiring.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "main validator real import record wiring validation exited with failure"
  } else {
    $mainValidatorRealImportRecordWiring = ($mainValidatorRealImportRecordWiringOutput -join "`n") | ConvertFrom-Json
    if ($mainValidatorRealImportRecordWiring.passed -ne $true) {
      Add-Failure "main validator real import record wiring validation must pass"
    }
    $mainValidatorRealImportRecordWiringMigratedPending = $mainValidatorRealImportRecordWiring.migration_status -eq 'legacy_runs_missing_git_preview_capsule_pending'
    if (-not $mainValidatorRealImportRecordWiringMigratedPending -and ($mainValidatorRealImportRecordWiring.mvp_invokes_real_artifact_validator -ne $true -or $mainValidatorRealImportRecordWiring.real_v14_105_import_record_in_main_validation_chain -ne $true)) {
      Add-Failure "main validator must invoke the real artifact validator and include the real v14.105 import record"
    }
    if ($mainValidatorRealImportRecordWiringMigratedPending -and ($mainValidatorRealImportRecordWiring.preview_capsule_required_in_main_validation_chain -ne $true -or $mainValidatorRealImportRecordWiring.preview_capsule_present -ne $false)) {
      Add-Failure "migrated main validator wiring must require the Git preview capsule without claiming it is present"
    }
    if ($mainValidatorRealImportRecordWiring.mvp_still_runs_fixture_validator -ne $true -or $mainValidatorRealImportRecordWiring.fixture_validator_not_sole_import_evidence -ne $true) {
      Add-Failure "main validator must keep fixture validation but not treat fixtures as sole import evidence"
    }
    if ($mainValidatorRealImportRecordWiring.artifact_hash_negative_case_covered_by_main_validator -ne $true -or $mainValidatorRealImportRecordWiring.missing_artifact_negative_case_covered_by_main_validator -ne $true -or $mainValidatorRealImportRecordWiring.missing_human_approval_negative_case_covered_by_main_validator -ne $true) {
      Add-Failure "main validator real import record wiring must cover hash mismatch, missing artifact, and missing human approval negative cases"
    }
    if ($mainValidatorRealImportRecordWiring.main_validator_requires_workspace_local_not_clone_portable_claim -ne $true) {
      Add-Failure "main validator must preserve workspace-local verification without claiming clone portability"
    }
    if ($mainValidatorRealImportRecordWiring.provider_contact_performed -ne $false -or $mainValidatorRealImportRecordWiring.plugin_call_performed -ne $false -or $mainValidatorRealImportRecordWiring.api_call_performed -ne $false -or $mainValidatorRealImportRecordWiring.mcp_runtime_performed -ne $false) {
      Add-Failure "main validator real import record wiring must not call provider/plugin/API/MCP"
    }
    if ($mainValidatorRealImportRecordWiring.image_generation_performed -ne $false -or $mainValidatorRealImportRecordWiring.file_write_performed -ne $false) {
      Add-Failure "main validator real import record wiring must not generate images or write output files"
    }
    if ($mainValidatorRealImportRecordWiring.daily_note_write_performed -ne $false -or $mainValidatorRealImportRecordWiring.vcp_memory_write_performed -ne $false) {
      Add-Failure "main validator real import record wiring must not write DailyNote or VCP memory"
    }
    if ($mainValidatorRealImportRecordWiring.failure_samples_write_performed -ne $false -or $mainValidatorRealImportRecordWiring.production_candidate_created -ne $false) {
      Add-Failure "main validator real import record wiring must not write failure_samples or production candidates"
    }
    if ($mainValidatorRealImportRecordWiring.real_manifest_read_performed -ne $false -or $mainValidatorRealImportRecordWiring.real_vcpchat_read_performed -ne $false -or $mainValidatorRealImportRecordWiring.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "main validator real import record wiring must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $reviewConsoleStaticImportRecordReaderOutput = & node (Join-Path $Root 'scripts/validate_v14_134_review_console_static_import_record_reader.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console static import record reader validation exited with failure"
  } else {
    $reviewConsoleStaticImportRecordReader = ($reviewConsoleStaticImportRecordReaderOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleStaticImportRecordReader.passed -ne $true) {
      Add-Failure "Review Console static import record reader validation must pass"
    }
    if ($reviewConsoleStaticImportRecordReader.review_console_static_import_record_reader_created -ne $true -or $reviewConsoleStaticImportRecordReader.draft_output_carries_import_record_reader -ne $true) {
      Add-Failure "Review Console must create the static import record reader and carry it in draft output"
    }
    $reviewConsoleStaticImportRecordReaderMigratedPending = $reviewConsoleStaticImportRecordReader.migration_status -eq 'legacy_runs_missing_git_preview_capsule_pending'
    if (-not $reviewConsoleStaticImportRecordReaderMigratedPending -and ($reviewConsoleStaticImportRecordReader.import_record_project_seed_available -ne $true -or $reviewConsoleStaticImportRecordReader.user_selected_file_reader_available -ne $true -or $reviewConsoleStaticImportRecordReader.textarea_import_record_parse_available -ne $true)) {
      Add-Failure "Review Console import reader must support project seed, user-selected file, and textarea parsing"
    }
    if ($reviewConsoleStaticImportRecordReaderMigratedPending -and ($reviewConsoleStaticImportRecordReader.preview_capsule_seed_required -ne $true -or $reviewConsoleStaticImportRecordReader.preview_capsule_present -ne $false -or $reviewConsoleStaticImportRecordReader.user_selected_file_reader_available -ne $true -or $reviewConsoleStaticImportRecordReader.textarea_import_record_parse_available -ne $true)) {
      Add-Failure "migrated Review Console import reader must require preview capsule seed while preserving in-memory reader paths"
    }
    if ($reviewConsoleStaticImportRecordReader.parsed_in_memory_only -ne $true -or $reviewConsoleStaticImportRecordReader.fetch_performed -ne $false -or $reviewConsoleStaticImportRecordReader.file_write_performed -ne $false) {
      Add-Failure "Review Console import reader must parse in memory only without fetch or file writes"
    }
    if ($reviewConsoleStaticImportRecordReader.runtime_vcp_integration_performed -ne $false) {
      Add-Failure "Review Console import reader must not claim VCP runtime integration"
    }
    if ($reviewConsoleStaticImportRecordReader.provider_contact_performed -ne $false -or $reviewConsoleStaticImportRecordReader.plugin_call_performed -ne $false -or $reviewConsoleStaticImportRecordReader.api_call_performed -ne $false -or $reviewConsoleStaticImportRecordReader.mcp_runtime_performed -ne $false) {
      Add-Failure "Review Console import reader must not call provider/plugin/API/MCP"
    }
    if ($reviewConsoleStaticImportRecordReader.image_generation_performed -ne $false -or $reviewConsoleStaticImportRecordReader.daily_note_write_performed -ne $false -or $reviewConsoleStaticImportRecordReader.vcp_memory_write_performed -ne $false) {
      Add-Failure "Review Console import reader must not generate images or write DailyNote/VCP memory"
    }
    if ($reviewConsoleStaticImportRecordReader.failure_samples_write_performed -ne $false -or $reviewConsoleStaticImportRecordReader.production_candidate_created -ne $false) {
      Add-Failure "Review Console import reader must not write failure_samples or production candidates"
    }
    if ($reviewConsoleStaticImportRecordReader.real_manifest_read_performed -ne $false -or $reviewConsoleStaticImportRecordReader.real_vcpchat_read_performed -ne $false -or $reviewConsoleStaticImportRecordReader.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "Review Console import reader must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $reviewConsoleImportReaderSafetyReviewOutput = & node (Join-Path $Root 'scripts/validate_v14_135_review_console_import_reader_safety_review.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console import reader safety review validation exited with failure"
  } else {
    $reviewConsoleImportReaderSafetyReview = ($reviewConsoleImportReaderSafetyReviewOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleImportReaderSafetyReview.passed -ne $true) {
      Add-Failure "Review Console import reader safety review validation must pass"
    }
    if ($reviewConsoleImportReaderSafetyReview.no_fetch_or_network_path_verified -ne $true -or $reviewConsoleImportReaderSafetyReview.no_file_write_path_verified -ne $true) {
      Add-Failure "Review Console import reader safety review must verify no fetch/network or file write path"
    }
    if ($reviewConsoleImportReaderSafetyReview.no_plugin_or_provider_path_verified -ne $true -or $reviewConsoleImportReaderSafetyReview.no_vcp_runtime_path_verified -ne $true) {
      Add-Failure "Review Console import reader safety review must verify no plugin/provider or VCP runtime path"
    }
    if ($reviewConsoleImportReaderSafetyReview.no_dailynote_or_vcp_memory_path_verified -ne $true -or $reviewConsoleImportReaderSafetyReview.review_console_static_reader_remains_in_memory_only -ne $true) {
      Add-Failure "Review Console import reader safety review must verify no DailyNote/VCP memory and in-memory-only behavior"
    }
    if ($reviewConsoleImportReaderSafetyReview.provider_contact_performed -ne $false -or $reviewConsoleImportReaderSafetyReview.plugin_call_performed -ne $false -or $reviewConsoleImportReaderSafetyReview.api_call_performed -ne $false -or $reviewConsoleImportReaderSafetyReview.mcp_runtime_performed -ne $false) {
      Add-Failure "Review Console import reader safety review must not call provider/plugin/API/MCP"
    }
    if ($reviewConsoleImportReaderSafetyReview.image_generation_performed -ne $false -or $reviewConsoleImportReaderSafetyReview.daily_note_write_performed -ne $false -or $reviewConsoleImportReaderSafetyReview.vcp_memory_write_performed -ne $false) {
      Add-Failure "Review Console import reader safety review must not generate images or write DailyNote/VCP memory"
    }
    if ($reviewConsoleImportReaderSafetyReview.failure_samples_write_performed -ne $false -or $reviewConsoleImportReaderSafetyReview.production_candidate_created -ne $false) {
      Add-Failure "Review Console import reader safety review must not write failure_samples or production candidates"
    }
    if ($reviewConsoleImportReaderSafetyReview.real_manifest_read_performed -ne $false -or $reviewConsoleImportReaderSafetyReview.real_vcpchat_read_performed -ne $false -or $reviewConsoleImportReaderSafetyReview.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "Review Console import reader safety review must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $acceptedSamplesRecoverabilityMetadataOutput = & node (Join-Path $Root 'scripts/validate_v14_136_accepted_samples_recoverability_metadata_patch.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "accepted samples recoverability metadata validation exited with failure"
  } else {
    $acceptedSamplesRecoverabilityMetadata = ($acceptedSamplesRecoverabilityMetadataOutput -join "`n") | ConvertFrom-Json
    if ($acceptedSamplesRecoverabilityMetadata.passed -ne $true) {
      Add-Failure "accepted samples recoverability metadata validation must pass"
    }
    if ($acceptedSamplesRecoverabilityMetadata.accepted_samples_registry_metadata_patched -ne $true -or $acceptedSamplesRecoverabilityMetadata.category_index_recoverability_metadata_patched -ne $true) {
      Add-Failure "accepted sample recoverability metadata must be present in registry and category index"
    }
    $acceptedSamplesRecoverabilityMetadataMigratedPending = $acceptedSamplesRecoverabilityMetadata.migration_status -eq 'legacy_runs_missing_git_preview_capsule_pending'
    if (-not $acceptedSamplesRecoverabilityMetadataMigratedPending -and ($acceptedSamplesRecoverabilityMetadata.recoverability_status -ne "workspace_local_verified" -or $acceptedSamplesRecoverabilityMetadata.verification_mode -ne "local_file_hash")) {
      Add-Failure "accepted sample recoverability metadata must preserve workspace-local hash verification"
    }
    if ($acceptedSamplesRecoverabilityMetadataMigratedPending -and ($acceptedSamplesRecoverabilityMetadata.preview_capsule_required -ne $true -or $acceptedSamplesRecoverabilityMetadata.preview_capsule_present -ne $false -or $acceptedSamplesRecoverabilityMetadata.verification_mode -ne "git_portable_preview_capsule_pending")) {
      Add-Failure "migrated accepted sample metadata must point to pending Git preview capsule evidence"
    }
    if ($acceptedSamplesRecoverabilityMetadata.portable_after_clone -ne $false) {
      Add-Failure "accepted sample recoverability metadata must not claim clone portability"
    }
    if ($acceptedSamplesRecoverabilityMetadata.image_binary_copy_performed -ne $false -or $acceptedSamplesRecoverabilityMetadata.runs_source_image_modified -ne $false) {
      Add-Failure "accepted sample recoverability metadata patch must not copy image binaries or modify runs source images"
    }
    if ($acceptedSamplesRecoverabilityMetadata.provider_contact_performed -ne $false -or $acceptedSamplesRecoverabilityMetadata.plugin_call_performed -ne $false -or $acceptedSamplesRecoverabilityMetadata.api_call_performed -ne $false -or $acceptedSamplesRecoverabilityMetadata.mcp_runtime_performed -ne $false) {
      Add-Failure "accepted sample recoverability metadata patch must not call provider/plugin/API/MCP"
    }
    if ($acceptedSamplesRecoverabilityMetadata.image_generation_performed -ne $false -or $acceptedSamplesRecoverabilityMetadata.daily_note_write_performed -ne $false -or $acceptedSamplesRecoverabilityMetadata.vcp_memory_write_performed -ne $false) {
      Add-Failure "accepted sample recoverability metadata patch must not generate images or write DailyNote/VCP memory"
    }
    if ($acceptedSamplesRecoverabilityMetadata.failure_samples_write_performed -ne $false -or $acceptedSamplesRecoverabilityMetadata.production_candidate_created -ne $false) {
      Add-Failure "accepted sample recoverability metadata patch must not write failure_samples or production candidates"
    }
    if ($acceptedSamplesRecoverabilityMetadata.real_manifest_read_performed -ne $false -or $acceptedSamplesRecoverabilityMetadata.real_vcpchat_read_performed -ne $false -or $acceptedSamplesRecoverabilityMetadata.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "accepted sample recoverability metadata patch must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $projectMasterPlanQuarantineOutput = & node (Join-Path $Root 'scripts/validate_v14_137_project_master_plan_quarantine_status_demotion.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "PROJECT_MASTER_PLAN quarantine/status demotion validation exited with failure"
  } else {
    $projectMasterPlanQuarantine = ($projectMasterPlanQuarantineOutput -join "`n") | ConvertFrom-Json
    if ($projectMasterPlanQuarantine.passed -ne $true) {
      Add-Failure "PROJECT_MASTER_PLAN quarantine/status demotion validation must pass"
    }
    if ($projectMasterPlanQuarantine.project_master_plan_quarantined -ne $true -or $projectMasterPlanQuarantine.project_master_plan_status_demoted -ne $true) {
      Add-Failure "PROJECT_MASTER_PLAN must be quarantined and status-demoted"
    }
    if ($projectMasterPlanQuarantine.project_master_plan_default_authority -ne $false -or $projectMasterPlanQuarantine.default_routing_authority -ne $false) {
      Add-Failure "PROJECT_MASTER_PLAN must not be the default routing authority"
    }
    if ($projectMasterPlanQuarantine.legacy_ledger_progress_promotion_blocked -ne $true -or $projectMasterPlanQuarantine.dashboard_progress_from_project_master_plan_allowed -ne $false) {
      Add-Failure "PROJECT_MASTER_PLAN legacy ledger must not promote product or dashboard progress"
    }
    if ($projectMasterPlanQuarantine.current_route_remains_artifact_recoverability_chain -ne $true) {
      Add-Failure "Current route must remain anchored to the artifact recoverability chain"
    }
    if ($projectMasterPlanQuarantine.vcp_runtime_integration_proven -ne $false -or $projectMasterPlanQuarantine.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "PROJECT_MASTER_PLAN demotion must not claim VCP runtime integration"
    }
    if ($projectMasterPlanQuarantine.provider_contact_performed -ne $false -or $projectMasterPlanQuarantine.plugin_call_performed -ne $false -or $projectMasterPlanQuarantine.api_call_performed -ne $false -or $projectMasterPlanQuarantine.mcp_runtime_performed -ne $false) {
      Add-Failure "PROJECT_MASTER_PLAN demotion must not call provider/plugin/API/MCP"
    }
    if ($projectMasterPlanQuarantine.image_generation_performed -ne $false -or $projectMasterPlanQuarantine.daily_note_write_performed -ne $false -or $projectMasterPlanQuarantine.vcp_memory_write_performed -ne $false) {
      Add-Failure "PROJECT_MASTER_PLAN demotion must not generate images or write DailyNote/VCP memory"
    }
    if ($projectMasterPlanQuarantine.failure_samples_write_performed -ne $false -or $projectMasterPlanQuarantine.production_candidate_created -ne $false) {
      Add-Failure "PROJECT_MASTER_PLAN demotion must not write failure_samples or production candidates"
    }
    if ($projectMasterPlanQuarantine.real_manifest_read_performed -ne $false -or $projectMasterPlanQuarantine.real_vcpchat_read_performed -ne $false -or $projectMasterPlanQuarantine.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "PROJECT_MASTER_PLAN demotion must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $dashboardArtifactEvidenceOutput = & node (Join-Path $Root 'scripts/validate_v14_138_dashboard_alignment_from_real_artifact_evidence.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "dashboard alignment from real artifact evidence validation exited with failure"
  } else {
    $dashboardArtifactEvidence = ($dashboardArtifactEvidenceOutput -join "`n") | ConvertFrom-Json
    if ($dashboardArtifactEvidence.passed -ne $true) {
      Add-Failure "dashboard alignment from real artifact evidence validation must pass"
    }
    if ($dashboardArtifactEvidence.artifact_recoverability_dashboard_evidence_created -ne $true -or $dashboardArtifactEvidence.dashboard_uses_real_v14_131_recoverability_evidence -ne $true) {
      Add-Failure "dashboard must carry real v14.131 artifact recoverability evidence"
    }
    if ($dashboardArtifactEvidence.dashboard_uses_project_master_plan_progress -ne $false -or $dashboardArtifactEvidence.dashboard_uses_document_token_progress -ne $false) {
      Add-Failure "dashboard must not use PROJECT_MASTER_PLAN or document/token progress as product evidence"
    }
    if ($dashboardArtifactEvidence.dashboard_promotes_product_status -ne $false) {
      Add-Failure "dashboard evidence must not promote product status"
    }
    if ($dashboardArtifactEvidence.vcp_runtime_integration_proven -ne $false -or $dashboardArtifactEvidence.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "dashboard evidence must not claim VCP runtime integration"
    }
    if ($dashboardArtifactEvidence.provider_contact_performed -ne $false -or $dashboardArtifactEvidence.plugin_call_performed -ne $false -or $dashboardArtifactEvidence.api_call_performed -ne $false -or $dashboardArtifactEvidence.mcp_runtime_performed -ne $false) {
      Add-Failure "dashboard evidence must not call provider/plugin/API/MCP"
    }
    if ($dashboardArtifactEvidence.image_generation_performed -ne $false -or $dashboardArtifactEvidence.file_write_performed -ne $false) {
      Add-Failure "dashboard evidence must not generate images or write files"
    }
    if ($dashboardArtifactEvidence.daily_note_write_performed -ne $false -or $dashboardArtifactEvidence.vcp_memory_write_performed -ne $false) {
      Add-Failure "dashboard evidence must not write DailyNote or VCP memory"
    }
    if ($dashboardArtifactEvidence.failure_samples_write_performed -ne $false -or $dashboardArtifactEvidence.production_candidate_created -ne $false) {
      Add-Failure "dashboard evidence must not write failure_samples or production candidates"
    }
    if ($dashboardArtifactEvidence.real_manifest_read_performed -ne $false -or $dashboardArtifactEvidence.real_vcpchat_read_performed -ne $false -or $dashboardArtifactEvidence.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "dashboard evidence must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $authorizationSplitOutput = & node (Join-Path $Root 'scripts/validate_v14_139_durable_archive_production_candidate_memory_write_authorization_split_planning.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "durable archive / production candidate / memory write authorization split validation exited with failure"
  } else {
    $authorizationSplit = ($authorizationSplitOutput -join "`n") | ConvertFrom-Json
    if ($authorizationSplit.passed -ne $true) {
      Add-Failure "authorization split planning validation must pass"
    }
    if ($authorizationSplit.durable_archive_authorization_prepared -ne $true -or $authorizationSplit.production_candidate_authorization_prepared -ne $true -or $authorizationSplit.memory_write_authorization_prepared -ne $true) {
      Add-Failure "authorization split planning must prepare durable archive, production candidate, and memory write packages"
    }
    if ($authorizationSplit.authorization_packages_split -ne $true -or $authorizationSplit.authorization_granted_by_this_record -ne $false) {
      Add-Failure "authorization packages must remain split and not granted by this record"
    }
    if ($authorizationSplit.durable_archive_executed -ne $false -or $authorizationSplit.archive_manifest_written -ne $false -or $authorizationSplit.image_binary_copy_performed -ne $false) {
      Add-Failure "authorization split planning must not execute durable archive or copy binaries"
    }
    if ($authorizationSplit.production_candidate_created -ne $false -or $authorizationSplit.production_candidate_write_performed -ne $false) {
      Add-Failure "authorization split planning must not create or write production candidates"
    }
    if ($authorizationSplit.daily_note_write_performed -ne $false -or $authorizationSplit.vcp_memory_write_performed -ne $false) {
      Add-Failure "authorization split planning must not write DailyNote or VCP memory"
    }
    if ($authorizationSplit.provider_contact_performed -ne $false -or $authorizationSplit.plugin_call_performed -ne $false -or $authorizationSplit.api_call_performed -ne $false -or $authorizationSplit.mcp_runtime_performed -ne $false) {
      Add-Failure "authorization split planning must not call provider/plugin/API/MCP"
    }
    if ($authorizationSplit.image_generation_performed -ne $false) {
      Add-Failure "authorization split planning must not generate images"
    }
    if ($authorizationSplit.real_manifest_read_performed -ne $false -or $authorizationSplit.real_vcpchat_read_performed -ne $false -or $authorizationSplit.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "authorization split planning must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $twoWeekRegressionCloseoutOutput = & node (Join-Path $Root 'scripts/validate_v14_140_two_week_regression_closeout.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "two-week regression closeout validation exited with failure"
  } else {
    $twoWeekRegressionCloseout = ($twoWeekRegressionCloseoutOutput -join "`n") | ConvertFrom-Json
    if ($twoWeekRegressionCloseout.passed -ne $true) {
      Add-Failure "two-week regression closeout validation must pass"
    }
    $twoWeekRegressionCloseoutMigratedPending = $twoWeekRegressionCloseout.migration_status -eq 'legacy_runs_missing_git_preview_capsule_pending'
    if (-not $twoWeekRegressionCloseoutMigratedPending -and ($twoWeekRegressionCloseout.accepted_sample_traceability_hard_acceptance_met -ne $true -or $twoWeekRegressionCloseout.negative_cases_fail_as_expected -ne $true)) {
      Add-Failure "two-week closeout must meet traceability hard acceptance and negative-case requirements"
    }
    if ($twoWeekRegressionCloseoutMigratedPending -and ($twoWeekRegressionCloseout.preview_capsule_required -ne $true -or $twoWeekRegressionCloseout.preview_capsule_present -ne $false -or $twoWeekRegressionCloseout.accepted_sample_traceability_hard_acceptance_met -ne $false)) {
      Add-Failure "migrated two-week closeout must mark traceability pending on Git preview capsule evidence"
    }
    if ($twoWeekRegressionCloseout.review_console_static_reader_only -ne $true) {
      Add-Failure "two-week closeout must keep Review Console as a static reader only"
    }
    if ($twoWeekRegressionCloseout.vcp_runtime_integration_proven -ne $false -or $twoWeekRegressionCloseout.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "two-week closeout must not claim VCP runtime integration"
    }
    if ($twoWeekRegressionCloseout.provider_contact_performed -ne $false -or $twoWeekRegressionCloseout.plugin_call_performed -ne $false -or $twoWeekRegressionCloseout.api_call_performed -ne $false -or $twoWeekRegressionCloseout.mcp_runtime_performed -ne $false) {
      Add-Failure "two-week closeout must not call provider/plugin/API/MCP"
    }
    if ($twoWeekRegressionCloseout.image_generation_performed -ne $false -or $twoWeekRegressionCloseout.image_binary_copy_performed -ne $false) {
      Add-Failure "two-week closeout must not generate images or copy image binaries"
    }
    if ($twoWeekRegressionCloseout.production_candidate_created -ne $false -or $twoWeekRegressionCloseout.daily_note_write_performed -ne $false -or $twoWeekRegressionCloseout.vcp_memory_write_performed -ne $false) {
      Add-Failure "two-week closeout must not create production candidates or write memory"
    }
    if ($twoWeekRegressionCloseout.real_manifest_read_performed -ne $false -or $twoWeekRegressionCloseout.real_vcpchat_read_performed -ne $false -or $twoWeekRegressionCloseout.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "two-week closeout must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $recoverabilityCoreExtractionOutput = & node (Join-Path $Root 'scripts/validate_v14_141_recoverability_core_extraction.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "recoverability core extraction validation exited with failure"
  } else {
    $recoverabilityCoreExtraction = ($recoverabilityCoreExtractionOutput -join "`n") | ConvertFrom-Json
    if ($recoverabilityCoreExtraction.passed -ne $true) {
      Add-Failure "recoverability core extraction validation must pass"
    }
    if ($recoverabilityCoreExtraction.recoverability_core_extracted -ne $true -or $recoverabilityCoreExtraction.v14_131_validator_uses_recoverability_core -ne $true) {
      Add-Failure "v14.141 must extract and use the recoverability core"
    }
    $recoverabilityCoreMigratedPending = $recoverabilityCoreExtraction.migration_status -eq 'legacy_runs_missing_git_preview_capsule_core_ready'
    if (-not $recoverabilityCoreMigratedPending -and ($recoverabilityCoreExtraction.core_positive_chain_passes -ne $true -or $recoverabilityCoreExtraction.core_negative_hash_mismatch_fails -ne $true -or $recoverabilityCoreExtraction.core_negative_missing_artifact_fails -ne $true -or $recoverabilityCoreExtraction.core_negative_missing_human_approval_fails -ne $true)) {
      Add-Failure "recoverability core must pass the positive chain and fail the required negative cases"
    }
    if ($recoverabilityCoreMigratedPending -and ($recoverabilityCoreExtraction.preview_capsule_core_extracted -ne $true -or $recoverabilityCoreExtraction.v14_131_validator_uses_preview_capsule_core -ne $true -or $recoverabilityCoreExtraction.core_positive_preview_capsule_pending -ne $true)) {
      Add-Failure "v14.141 migrated recoverability core must expose preview capsule validation and pending state"
    }
    if ($recoverabilityCoreExtraction.vcp_runtime_integration_proven -ne $false -or $recoverabilityCoreExtraction.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "recoverability core extraction must not claim VCP runtime integration"
    }
    if ($recoverabilityCoreExtraction.provider_contact_performed -ne $false -or $recoverabilityCoreExtraction.plugin_call_performed -ne $false -or $recoverabilityCoreExtraction.api_call_performed -ne $false -or $recoverabilityCoreExtraction.mcp_runtime_performed -ne $false) {
      Add-Failure "recoverability core extraction must not call provider/plugin/API/MCP"
    }
    if ($recoverabilityCoreExtraction.image_generation_performed -ne $false -or $recoverabilityCoreExtraction.production_candidate_created -ne $false -or $recoverabilityCoreExtraction.daily_note_write_performed -ne $false -or $recoverabilityCoreExtraction.vcp_memory_write_performed -ne $false) {
      Add-Failure "recoverability core extraction must not generate images, create production candidates, or write memory"
    }
  }

  $multiAcceptedSampleMatrixOutput = & node (Join-Path $Root 'scripts/validate_v14_142_multi_accepted_sample_matrix.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "multi accepted sample matrix validation exited with failure"
  } else {
    $multiAcceptedSampleMatrix = ($multiAcceptedSampleMatrixOutput -join "`n") | ConvertFrom-Json
    if ($multiAcceptedSampleMatrix.passed -ne $true) {
      Add-Failure "multi accepted sample matrix validation must pass"
    }
    if ($multiAcceptedSampleMatrix.multi_sample_matrix_created -ne $true -or $multiAcceptedSampleMatrix.matrix_row_count -lt 3 -or $multiAcceptedSampleMatrix.category_count -lt 3) {
      Add-Failure "v14.142 must create a multi-sample, multi-category matrix"
    }
    $multiAcceptedSampleMatrixMigratedPending = $multiAcceptedSampleMatrix.migration_status -eq 'legacy_runs_missing_git_preview_capsule_pending'
    if (-not $multiAcceptedSampleMatrixMigratedPending -and ($multiAcceptedSampleMatrix.complete_recoverable_sample_count -ne 3 -or $multiAcceptedSampleMatrix.full_recoverability_count_is_currently_three -ne $true)) {
      Add-Failure "v14.142 must preserve the current three fully recoverable samples truth"
    }
    if (-not $multiAcceptedSampleMatrixMigratedPending -and ($multiAcceptedSampleMatrix.legacy_partial_artifact_sample_count -lt 3 -or $multiAcceptedSampleMatrix.local_artifact_sample_count -lt 4)) {
      Add-Failure "v14.142 must detect legacy local artifact rows without promoting them"
    }
    if ($multiAcceptedSampleMatrixMigratedPending -and ($multiAcceptedSampleMatrix.preview_capsule_pending_count -lt 1 -or $multiAcceptedSampleMatrix.git_portable_preview_capsule_baseline_active -ne $true)) {
      Add-Failure "v14.142 migrated matrix must report pending Git preview capsules instead of legacy runs evidence"
    }
    if ($multiAcceptedSampleMatrix.negative_case_artifact_missing_fails -ne $true -or $multiAcceptedSampleMatrix.negative_case_hash_mismatch_fails -ne $true -or $multiAcceptedSampleMatrix.negative_case_dimensions_mismatch_fails -ne $true -or $multiAcceptedSampleMatrix.negative_case_mime_mismatch_fails -ne $true) {
      Add-Failure "v14.142 must fail artifact missing/hash/dimensions/mime negative cases"
    }
    if ($multiAcceptedSampleMatrix.negative_case_review_record_missing_fails -ne $true -or $multiAcceptedSampleMatrix.negative_case_human_approval_missing_fails -ne $true -or $multiAcceptedSampleMatrix.negative_case_category_index_missing_fails -ne $true -or $multiAcceptedSampleMatrix.negative_case_registry_category_mismatch_fails -ne $true) {
      Add-Failure "v14.142 must fail review/approval/category negative cases"
    }
    if ($multiAcceptedSampleMatrix.vcp_runtime_integration_proven -ne $false -or $multiAcceptedSampleMatrix.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "multi accepted sample matrix must not claim VCP runtime integration"
    }
    if ($multiAcceptedSampleMatrix.provider_contact_performed -ne $false -or $multiAcceptedSampleMatrix.plugin_call_performed -ne $false -or $multiAcceptedSampleMatrix.api_call_performed -ne $false -or $multiAcceptedSampleMatrix.mcp_runtime_performed -ne $false) {
      Add-Failure "multi accepted sample matrix must not call provider/plugin/API/MCP"
    }
    if ($multiAcceptedSampleMatrix.image_generation_performed -ne $false -or $multiAcceptedSampleMatrix.image_binary_copy_performed -ne $false -or $multiAcceptedSampleMatrix.accepted_samples_write_performed -ne $false) {
      Add-Failure "multi accepted sample matrix must not generate images, copy binaries, or write accepted_samples"
    }
    if ($multiAcceptedSampleMatrix.production_candidate_created -ne $false -or $multiAcceptedSampleMatrix.failure_samples_write_performed -ne $false -or $multiAcceptedSampleMatrix.daily_note_write_performed -ne $false -or $multiAcceptedSampleMatrix.vcp_memory_write_performed -ne $false) {
      Add-Failure "multi accepted sample matrix must not write production candidates, failure samples, or memory"
    }
    if ($multiAcceptedSampleMatrix.real_manifest_read_performed -ne $false -or $multiAcceptedSampleMatrix.real_vcpchat_read_performed -ne $false -or $multiAcceptedSampleMatrix.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "multi accepted sample matrix must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $schemaHardeningOutput = & node (Join-Path $Root 'scripts/validate_v14_143_import_review_registry_schema_hardening.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "import/review/registry schema hardening validation exited with failure"
  } else {
    $schemaHardening = ($schemaHardeningOutput -join "`n") | ConvertFrom-Json
    if ($schemaHardening.passed -ne $true) {
      Add-Failure "import/review/registry schema hardening validation must pass"
    }
    if ($schemaHardening.import_schema_recoverability_contract_hardened -ne $true -or $schemaHardening.review_schema_artifact_link_fields_hardened -ne $true -or $schemaHardening.accepted_registry_schema_created -ne $true) {
      Add-Failure "v14.143 must harden import/review/accepted registry schemas"
    }
    $schemaHardeningMigratedPending = $schemaHardening.migration_status -eq 'legacy_runs_missing_git_preview_capsule_pending'
    if (-not $schemaHardeningMigratedPending -and ($schemaHardening.real_import_record_contract_verified -ne $true -or $schemaHardening.real_review_record_contract_verified -ne $true)) {
      Add-Failure "v14.143 must verify the real import and review records against the hardened contract"
    }
    if (-not $schemaHardeningMigratedPending -and ($schemaHardening.registry_full_recoverability_metadata_verified -ne $true -or $schemaHardening.category_index_full_recoverability_metadata_verified -ne $true)) {
      Add-Failure "v14.143 must verify registry and category full recoverability metadata"
    }
    if ($schemaHardeningMigratedPending -and ($schemaHardening.preview_capsule_schema_contract_required -ne $true -or $schemaHardening.preview_capsule_present -ne $false -or $schemaHardening.v14_142_matrix_validator_still_passes -ne $true)) {
      Add-Failure "migrated schema hardening must require the Git preview capsule contract without claiming current evidence"
    }
    if ($schemaHardening.v14_142_matrix_validator_still_passes -ne $true -or $schemaHardening.v14_142_negative_matrix_still_covers_schema_failures -ne $true) {
      Add-Failure "v14.143 must preserve v14.142 matrix and negative-case coverage"
    }
    if ($schemaHardening.vcp_runtime_integration_proven -ne $false -or $schemaHardening.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "schema hardening must not claim VCP runtime integration"
    }
    if ($schemaHardening.provider_contact_performed -ne $false -or $schemaHardening.plugin_call_performed -ne $false -or $schemaHardening.api_call_performed -ne $false -or $schemaHardening.mcp_runtime_performed -ne $false) {
      Add-Failure "schema hardening must not call provider/plugin/API/MCP"
    }
    if ($schemaHardening.image_generation_performed -ne $false -or $schemaHardening.image_binary_copy_performed -ne $false -or $schemaHardening.accepted_samples_write_performed -ne $false) {
      Add-Failure "schema hardening must not generate images, copy binaries, or write accepted_samples"
    }
    if ($schemaHardening.production_candidate_created -ne $false -or $schemaHardening.failure_samples_write_performed -ne $false -or $schemaHardening.daily_note_write_performed -ne $false -or $schemaHardening.vcp_memory_write_performed -ne $false) {
      Add-Failure "schema hardening must not write production candidates, failure samples, or memory"
    }
    if ($schemaHardening.real_manifest_read_performed -ne $false -or $schemaHardening.real_vcpchat_read_performed -ne $false -or $schemaHardening.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "schema hardening must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $reviewConsoleSchemaBindingOutput = & node (Join-Path $Root 'scripts/validate_v14_144_review_console_schema_binding.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console schema binding validation exited with failure"
  } else {
    $reviewConsoleSchemaBinding = ($reviewConsoleSchemaBindingOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleSchemaBinding.passed -ne $true) {
      Add-Failure "Review Console schema binding validation must pass"
    }
    if ($reviewConsoleSchemaBinding.review_console_static_schema_binding_created -ne $true -or $reviewConsoleSchemaBinding.import_record_reader_bound_to_import_schema -ne $true -or $reviewConsoleSchemaBinding.artifact_evidence_bound_to_accepted_registry_schema -ne $true -or $reviewConsoleSchemaBinding.review_record_bound_to_local_review_schema -ne $true) {
      Add-Failure "v14.144 must bind static Review Console fields to import/review/accepted schemas"
    }
    if ($reviewConsoleSchemaBinding.v14_134_static_import_reader_still_passes -ne $true -or $reviewConsoleSchemaBinding.v14_135_import_reader_safety_still_passes -ne $true -or $reviewConsoleSchemaBinding.v14_143_schema_hardening_still_passes -ne $true) {
      Add-Failure "v14.144 must preserve v14.134, v14.135, and v14.143 validation"
    }
    if ($reviewConsoleSchemaBinding.vcp_runtime_integration_proven -ne $false -or $reviewConsoleSchemaBinding.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "Review Console schema binding must not claim VCP runtime integration"
    }
    if ($reviewConsoleSchemaBinding.fetch_performed -ne $false -or $reviewConsoleSchemaBinding.file_write_performed -ne $false -or $reviewConsoleSchemaBinding.runtime_vcp_integration_performed -ne $false) {
      Add-Failure "Review Console schema binding must remain static, in-memory, and no-runtime"
    }
    if ($reviewConsoleSchemaBinding.provider_contact_performed -ne $false -or $reviewConsoleSchemaBinding.plugin_call_performed -ne $false -or $reviewConsoleSchemaBinding.api_call_performed -ne $false -or $reviewConsoleSchemaBinding.mcp_runtime_performed -ne $false) {
      Add-Failure "Review Console schema binding must not call provider/plugin/API/MCP"
    }
    if ($reviewConsoleSchemaBinding.image_generation_performed -ne $false -or $reviewConsoleSchemaBinding.image_binary_copy_performed -ne $false -or $reviewConsoleSchemaBinding.accepted_samples_write_performed -ne $false) {
      Add-Failure "Review Console schema binding must not generate images, copy binaries, or write accepted_samples"
    }
    if ($reviewConsoleSchemaBinding.production_candidate_created -ne $false -or $reviewConsoleSchemaBinding.failure_samples_write_performed -ne $false -or $reviewConsoleSchemaBinding.daily_note_write_performed -ne $false -or $reviewConsoleSchemaBinding.vcp_memory_write_performed -ne $false) {
      Add-Failure "Review Console schema binding must not write production candidates, failure samples, or memory"
    }
    if ($reviewConsoleSchemaBinding.real_manifest_read_performed -ne $false -or $reviewConsoleSchemaBinding.real_vcpchat_read_performed -ne $false -or $reviewConsoleSchemaBinding.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "Review Console schema binding must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $sampleLifecycleOutput = & node (Join-Path $Root 'scripts/validate_v14_145_sample_lifecycle_state_machine.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "sample lifecycle state machine validation exited with failure"
  } else {
    $sampleLifecycle = ($sampleLifecycleOutput -join "`n") | ConvertFrom-Json
    if ($sampleLifecycle.passed -ne $true) {
      Add-Failure "sample lifecycle state machine validation must pass"
    }
    $sampleLifecycleMigratedPending = $sampleLifecycle.migration_status -eq 'legacy_runs_missing_git_preview_capsule_pending'
    if (-not $sampleLifecycleMigratedPending -and ($sampleLifecycle.sample_lifecycle_state_machine_created -ne $true -or $sampleLifecycle.current_sample_state -ne 'recoverable')) {
      Add-Failure "v14.145 must create the lifecycle state machine and classify the current sample as recoverable"
    }
    if ($sampleLifecycleMigratedPending -and ($sampleLifecycle.sample_lifecycle_state_machine_created -ne $true -or $sampleLifecycle.current_sample_state -ne 'preview_capsule_pending' -or $sampleLifecycle.preview_capsule_present -ne $false)) {
      Add-Failure "migrated sample lifecycle must classify current sample as preview_capsule_pending until evidence exists"
    }
    if ($sampleLifecycle.archive_ready -ne $false -or $sampleLifecycle.production_candidate_pending -ne $false -or $sampleLifecycle.accepted_sample_is_not_production_candidate -ne $true) {
      Add-Failure "v14.145 must block archive-ready and production-candidate states until authorized"
    }
    if ($sampleLifecycle.negative_case_missing_human_approval_blocks_accepted_metadata_registered -ne $true -or $sampleLifecycle.negative_case_missing_recoverability_blocks_archive_ready -ne $true -or $sampleLifecycle.negative_case_skip_archive_to_production_candidate_fails -ne $true) {
      Add-Failure "v14.145 must fail lifecycle negative cases"
    }
    if ($sampleLifecycle.vcp_runtime_integration_proven -ne $false -or $sampleLifecycle.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "sample lifecycle must not claim VCP runtime integration"
    }
    if ($sampleLifecycle.provider_contact_performed -ne $false -or $sampleLifecycle.plugin_call_performed -ne $false -or $sampleLifecycle.api_call_performed -ne $false -or $sampleLifecycle.mcp_runtime_performed -ne $false) {
      Add-Failure "sample lifecycle must not call provider/plugin/API/MCP"
    }
    if ($sampleLifecycle.image_generation_performed -ne $false -or $sampleLifecycle.image_binary_copy_performed -ne $false -or $sampleLifecycle.accepted_samples_write_performed -ne $false) {
      Add-Failure "sample lifecycle must not generate images, copy binaries, or write accepted_samples"
    }
    if ($sampleLifecycle.production_candidate_created -ne $false -or $sampleLifecycle.failure_samples_write_performed -ne $false -or $sampleLifecycle.daily_note_write_performed -ne $false -or $sampleLifecycle.vcp_memory_write_performed -ne $false) {
      Add-Failure "sample lifecycle must not write production candidates, failure samples, or memory"
    }
    if ($sampleLifecycle.real_manifest_read_performed -ne $false -or $sampleLifecycle.real_vcpchat_read_performed -ne $false -or $sampleLifecycle.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "sample lifecycle must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $durableArchiveDryRunOutput = & node (Join-Path $Root 'scripts/validate_v14_146_durable_archive_dry_run_manifest.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "durable archive dry-run manifest validation exited with failure"
  } else {
    $durableArchiveDryRun = ($durableArchiveDryRunOutput -join "`n") | ConvertFrom-Json
    if ($durableArchiveDryRun.passed -ne $true) {
      Add-Failure "durable archive dry-run manifest validation must pass"
    }
    $durableArchiveDryRunMigratedPending = $durableArchiveDryRun.migration_status -eq 'legacy_durable_archive_dry_run_superseded_by_preview_capsule'
    if (-not $durableArchiveDryRunMigratedPending -and ($durableArchiveDryRun.durable_archive_dry_run_manifest_created -ne $true -or $durableArchiveDryRun.archive_dry_run_ready -ne $true -or $durableArchiveDryRun.archive_ready -ne $false)) {
      Add-Failure "v14.146 must create a dry-run archive manifest without marking the sample archive-ready"
    }
    if (-not $durableArchiveDryRunMigratedPending -and ($durableArchiveDryRun.registry_to_import_record_verified -ne $true -or $durableArchiveDryRun.registry_to_review_record_verified -ne $true -or $durableArchiveDryRun.registry_to_category_index_verified -ne $true -or $durableArchiveDryRun.human_approval_verified -ne $true)) {
      Add-Failure "v14.146 must verify the registry/import/review/category/approval evidence chain"
    }
    if (-not $durableArchiveDryRunMigratedPending -and ($durableArchiveDryRun.artifact_sha256_verified -ne $true -or $durableArchiveDryRun.artifact_dimensions_verified -ne $true -or $durableArchiveDryRun.artifact_mime_verified -ne $true)) {
      Add-Failure "v14.146 must verify artifact hash, dimensions, and mime"
    }
    if ($durableArchiveDryRun.target_path_project_relative -ne $true -or $durableArchiveDryRun.target_path_inside_asset_archive -ne $true -or $durableArchiveDryRun.target_archive_does_not_exist -ne $true) {
      Add-Failure "v14.146 dry-run target path must be project-relative, inside asset_archive, and not already created"
    }
    if ($durableArchiveDryRun.negative_case_missing_recoverability_blocks_manifest -ne $true -or $durableArchiveDryRun.negative_case_hash_mismatch_blocks_manifest -ne $true -or $durableArchiveDryRun.negative_case_target_path_escape_blocks_manifest -ne $true -or $durableArchiveDryRun.negative_case_absolute_target_path_blocks_manifest -ne $true -or $durableArchiveDryRun.negative_case_existing_archive_target_requires_A5_review -ne $true) {
      Add-Failure "v14.146 must fail dry-run archive manifest negative cases"
    }
    if (-not $durableArchiveDryRunMigratedPending -and $durableArchiveDryRun.v14_145_lifecycle_validator_still_passes -ne $true) {
      Add-Failure "v14.146 must preserve v14.145 lifecycle validation"
    }
    if ($durableArchiveDryRunMigratedPending -and ($durableArchiveDryRun.preview_capsule_required -ne $true -or $durableArchiveDryRun.preview_capsule_present -ne $false)) {
      Add-Failure "v14.146 migrated dry-run must require the preview capsule without claiming it is present"
    }
    if ($durableArchiveDryRun.vcp_runtime_integration_proven -ne $false -or $durableArchiveDryRun.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "durable archive dry-run manifest must not claim VCP runtime integration"
    }
    if ($durableArchiveDryRun.authorization_granted_by_this_record -ne $false -or $durableArchiveDryRun.archive_manifest_written -ne $false -or $durableArchiveDryRun.image_binary_copy_performed -ne $false) {
      Add-Failure "durable archive dry-run manifest must not authorize or execute archive writes"
    }
    if ($durableArchiveDryRun.target_archive_directory_created -ne $false -or $durableArchiveDryRun.target_archive_artifact_created -ne $false -or $durableArchiveDryRun.runs_source_image_modified -ne $false) {
      Add-Failure "durable archive dry-run manifest must not create archive targets or modify runs source images"
    }
    if ($durableArchiveDryRun.provider_contact_performed -ne $false -or $durableArchiveDryRun.plugin_call_performed -ne $false -or $durableArchiveDryRun.api_call_performed -ne $false -or $durableArchiveDryRun.mcp_runtime_performed -ne $false) {
      Add-Failure "durable archive dry-run manifest must not call provider/plugin/API/MCP"
    }
    if ($durableArchiveDryRun.image_generation_performed -ne $false -or $durableArchiveDryRun.accepted_samples_write_performed -ne $false -or $durableArchiveDryRun.failure_samples_write_performed -ne $false) {
      Add-Failure "durable archive dry-run manifest must not generate images or write accepted/failure sample registries"
    }
    if ($durableArchiveDryRun.production_candidate_created -ne $false -or $durableArchiveDryRun.production_candidate_write_performed -ne $false -or $durableArchiveDryRun.daily_note_write_performed -ne $false -or $durableArchiveDryRun.vcp_memory_write_performed -ne $false) {
      Add-Failure "durable archive dry-run manifest must not write production candidates, DailyNote, or VCP memory"
    }
    if ($durableArchiveDryRun.real_manifest_read_performed -ne $false -or $durableArchiveDryRun.real_vcpchat_read_performed -ne $false -or $durableArchiveDryRun.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "durable archive dry-run manifest must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $productionCandidatePreflightOutput = & node (Join-Path $Root 'scripts/validate_v14_147_production_candidate_eligibility_preflight.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "production candidate eligibility preflight validation exited with failure"
  } else {
    $productionCandidatePreflight = ($productionCandidatePreflightOutput -join "`n") | ConvertFrom-Json
    if ($productionCandidatePreflight.passed -ne $true) {
      Add-Failure "production candidate eligibility preflight validation must pass"
    }
    $productionCandidatePreflightMigratedPending = $productionCandidatePreflight.migration_status -eq 'production_candidate_preflight_blocked_pending_preview_capsule'
    if (-not $productionCandidatePreflightMigratedPending -and ($productionCandidatePreflight.production_candidate_eligibility_preflight_created -ne $true -or $productionCandidatePreflight.eligible_for_preflight -ne $true -or $productionCandidatePreflight.ready_for_A5_authorization_package -ne $true)) {
      Add-Failure "v14.147 must create a production candidate eligibility preflight ready for A5 authorization drafting"
    }
    if ($productionCandidatePreflight.blocked_for_execution_now -ne $true -or $productionCandidatePreflight.production_candidate_write_allowed_now -ne $false) {
      Add-Failure "v14.147 must keep production candidate execution blocked"
    }
    if ($productionCandidatePreflight.durable_archive_execution_not_performed -ne $true -or $productionCandidatePreflight.production_candidate_A5_authorization_not_granted -ne $true) {
      Add-Failure "v14.147 must preserve durable archive and A5 authorization blockers"
    }
    if (-not $productionCandidatePreflightMigratedPending -and ($productionCandidatePreflight.registry_to_import_record_verified -ne $true -or $productionCandidatePreflight.registry_to_review_record_verified -ne $true -or $productionCandidatePreflight.registry_to_category_index_verified -ne $true -or $productionCandidatePreflight.human_approval_verified -ne $true)) {
      Add-Failure "v14.147 must verify registry/import/review/category/approval evidence"
    }
    if (-not $productionCandidatePreflightMigratedPending -and ($productionCandidatePreflight.artifact_sha256_verified -ne $true -or $productionCandidatePreflight.artifact_dimensions_verified -ne $true -or $productionCandidatePreflight.artifact_mime_verified -ne $true -or $productionCandidatePreflight.durable_archive_dry_run_manifest_verified -ne $true)) {
      Add-Failure "v14.147 must verify artifact evidence and durable archive dry-run manifest"
    }
    if (-not $productionCandidatePreflightMigratedPending -and ($productionCandidatePreflight.v14_146_dry_run_validator_still_passes -ne $true -or $productionCandidatePreflight.v14_112_production_candidate_gate_still_passes -ne $true)) {
      Add-Failure "v14.147 must preserve v14.146 and v14.112 validation"
    }
    if ($productionCandidatePreflightMigratedPending -and ($productionCandidatePreflight.preview_capsule_required -ne $true -or $productionCandidatePreflight.preview_capsule_present -ne $false -or $productionCandidatePreflight.ready_for_A5_authorization_package -ne $false)) {
      Add-Failure "v14.147 migrated production preflight must remain blocked pending preview capsule evidence"
    }
    if ($productionCandidatePreflight.negative_case_missing_human_approval_blocks_eligibility -ne $true -or $productionCandidatePreflight.negative_case_missing_recoverability_blocks_eligibility -ne $true -or $productionCandidatePreflight.negative_case_missing_archive_dry_run_blocks_authorization_readiness -ne $true -or $productionCandidatePreflight.negative_case_existing_production_candidate_blocks_new_candidate -ne $true -or $productionCandidatePreflight.negative_case_missing_A5_authorization_blocks_write -ne $true) {
      Add-Failure "v14.147 must fail production candidate eligibility negative cases"
    }
    if ($productionCandidatePreflight.vcp_runtime_integration_proven -ne $false -or $productionCandidatePreflight.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "production candidate eligibility preflight must not claim VCP runtime integration"
    }
    if ($productionCandidatePreflight.authorization_granted_by_this_record -ne $false -or $productionCandidatePreflight.authorization_granted_by_this_preflight -ne $false) {
      Add-Failure "production candidate eligibility preflight must not grant authorization"
    }
    if ($productionCandidatePreflight.production_directory_write_performed -ne $false -or $productionCandidatePreflight.production_candidate_created -ne $false -or $productionCandidatePreflight.production_candidate_write_performed -ne $false) {
      Add-Failure "production candidate eligibility preflight must not write production candidate files"
    }
    if ($productionCandidatePreflight.provider_contact_performed -ne $false -or $productionCandidatePreflight.plugin_call_performed -ne $false -or $productionCandidatePreflight.api_call_performed -ne $false -or $productionCandidatePreflight.mcp_runtime_performed -ne $false) {
      Add-Failure "production candidate eligibility preflight must not call provider/plugin/API/MCP"
    }
    if ($productionCandidatePreflight.image_generation_performed -ne $false -or $productionCandidatePreflight.image_binary_copy_performed -ne $false -or $productionCandidatePreflight.runs_source_image_modified -ne $false) {
      Add-Failure "production candidate eligibility preflight must not generate images, copy binaries, or modify runs"
    }
    if ($productionCandidatePreflight.accepted_samples_write_performed -ne $false -or $productionCandidatePreflight.failure_samples_write_performed -ne $false -or $productionCandidatePreflight.daily_note_write_performed -ne $false -or $productionCandidatePreflight.vcp_memory_write_performed -ne $false) {
      Add-Failure "production candidate eligibility preflight must not write accepted/failure samples, DailyNote, or VCP memory"
    }
    if ($productionCandidatePreflight.real_manifest_read_performed -ne $false -or $productionCandidatePreflight.real_vcpchat_read_performed -ne $false -or $productionCandidatePreflight.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "production candidate eligibility preflight must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $memoryDeltaDraftPackageOutput = & node (Join-Path $Root 'scripts/validate_v14_148_memory_delta_draft_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "memory delta draft package validation exited with failure"
  } else {
    $memoryDeltaDraftPackage = ($memoryDeltaDraftPackageOutput -join "`n") | ConvertFrom-Json
    if ($memoryDeltaDraftPackage.passed -ne $true) {
      Add-Failure "memory delta draft package validation must pass"
    }
    if ($memoryDeltaDraftPackage.memory_delta_draft_package_created -ne $true -or $memoryDeltaDraftPackage.daily_note_draft_cn_present -ne $true -or $memoryDeltaDraftPackage.vcp_memory_draft_cn_present -ne $true) {
      Add-Failure "v14.148 must create Chinese DailyNote and VCP memory drafts"
    }
    if ($memoryDeltaDraftPackage.write_mode -ne 'draft' -or $memoryDeltaDraftPackage.approval_required -ne $true -or $memoryDeltaDraftPackage.approval_status -ne 'pending' -or $memoryDeltaDraftPackage.should_write_to_vcp -ne $false) {
      Add-Failure "v14.148 memory package must remain draft-only and pending"
    }
    if ($memoryDeltaDraftPackage.memory_delta_source_ref_verified -ne $true -or $memoryDeltaDraftPackage.review_record_ref_verified -ne $true -or $memoryDeltaDraftPackage.accepted_registry_ref_verified -ne $true -or $memoryDeltaDraftPackage.production_candidate_preflight_ref_verified -ne $true) {
      Add-Failure "v14.148 must verify memory source, review, registry, and production candidate preflight refs"
    }
    if ($memoryDeltaDraftPackage.v14_111_memory_delta_validator_still_passes -ne $true -or $memoryDeltaDraftPackage.v14_117_memory_authorization_validator_still_passes -ne $true -or $memoryDeltaDraftPackage.v14_147_production_candidate_preflight_still_passes -ne $true) {
      Add-Failure "v14.148 must preserve v14.111, v14.117, and v14.147 validation"
    }
    if ($memoryDeltaDraftPackage.negative_case_non_chinese_daily_note_body_blocks_package -ne $true -or $memoryDeltaDraftPackage.negative_case_approval_granted_without_A5_blocks_package -ne $true -or $memoryDeltaDraftPackage.negative_case_should_write_to_vcp_true_without_authorization_blocks_package -ne $true -or $memoryDeltaDraftPackage.negative_case_raw_sensitive_content_blocks_package -ne $true -or $memoryDeltaDraftPackage.negative_case_image_binary_reference_blocks_package -ne $true) {
      Add-Failure "v14.148 must fail memory draft package negative cases"
    }
    if ($memoryDeltaDraftPackage.vcp_runtime_integration_proven -ne $false -or $memoryDeltaDraftPackage.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "memory delta draft package must not claim VCP runtime integration"
    }
    if ($memoryDeltaDraftPackage.authorization_granted_by_this_record -ne $false -or $memoryDeltaDraftPackage.authorization_granted_by_this_package -ne $false) {
      Add-Failure "memory delta draft package must not grant authorization"
    }
    if ($memoryDeltaDraftPackage.daily_note_write_performed -ne $false -or $memoryDeltaDraftPackage.vcp_memory_write_performed -ne $false -or $memoryDeltaDraftPackage.direct_memory_write_performed -ne $false) {
      Add-Failure "memory delta draft package must not write DailyNote or VCP memory"
    }
    if ($memoryDeltaDraftPackage.accepted_samples_write_performed -ne $false -or $memoryDeltaDraftPackage.failure_samples_write_performed -ne $false -or $memoryDeltaDraftPackage.production_candidate_write_performed -ne $false) {
      Add-Failure "memory delta draft package must not write accepted/failure samples or production candidates"
    }
    if ($memoryDeltaDraftPackage.provider_contact_performed -ne $false -or $memoryDeltaDraftPackage.plugin_call_performed -ne $false -or $memoryDeltaDraftPackage.api_call_performed -ne $false -or $memoryDeltaDraftPackage.mcp_runtime_performed -ne $false) {
      Add-Failure "memory delta draft package must not call provider/plugin/API/MCP"
    }
    if ($memoryDeltaDraftPackage.image_generation_performed -ne $false -or $memoryDeltaDraftPackage.image_binary_included -ne $false) {
      Add-Failure "memory delta draft package must not generate or include image binaries"
    }
    if ($memoryDeltaDraftPackage.real_manifest_read_performed -ne $false -or $memoryDeltaDraftPackage.real_vcpchat_read_performed -ne $false -or $memoryDeltaDraftPackage.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "memory delta draft package must not read real manifest/VCPChat/VCPToolBox"
    }
  }

  $authorizationPackageCompilerOutput = & node (Join-Path $Root 'scripts/validate_v14_149_authorization_package_compiler.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "authorization package compiler validation exited with failure"
  } else {
    $authorizationPackageCompiler = ($authorizationPackageCompilerOutput -join "`n") | ConvertFrom-Json
    if ($authorizationPackageCompiler.passed -ne $true) {
      Add-Failure "authorization package compiler validation must pass"
    }
    if ($authorizationPackageCompiler.authorization_package_compiler_created -ne $true -or $authorizationPackageCompiler.compiled_package_count -ne 4) {
      Add-Failure "v14.149 must compile four inactive A5 authorization package drafts"
    }
    if ($authorizationPackageCompiler.durable_archive_package_status -ne 'prepared_not_granted' -or $authorizationPackageCompiler.production_candidate_package_status -ne 'prepared_not_granted' -or $authorizationPackageCompiler.memory_write_package_status -ne 'prepared_not_granted') {
      Add-Failure "v14.149 archive, production, and memory packages must be prepared_not_granted"
    }
    if ($authorizationPackageCompiler.manifest_read_package_status -ne 'prepared_incomplete_not_granted' -or $authorizationPackageCompiler.manifest_read_missing_exact_real_manifest_path -ne $true) {
      Add-Failure "v14.149 manifest read package must stay incomplete until Jenn provides an exact real manifest path"
    }
    if ($authorizationPackageCompiler.output_file_write_performed -ne $false -or $authorizationPackageCompiler.authorization_granted_by_compiler -ne $false) {
      Add-Failure "v14.149 compiler must be stdout-only and must not grant authorization"
    }
    if ($authorizationPackageCompiler.v14_146_durable_archive_dry_run_still_passes -ne $true -or $authorizationPackageCompiler.v14_147_production_candidate_preflight_still_passes -ne $true -or $authorizationPackageCompiler.v14_148_memory_delta_draft_package_still_passes -ne $true) {
      Add-Failure "v14.149 must preserve v14.146, v14.147, and v14.148 validation"
    }
    if ($authorizationPackageCompiler.negative_case_granted_package_blocks_compiler -ne $true -or $authorizationPackageCompiler.negative_case_merged_archive_and_production_candidate_blocks_compiler -ne $true -or $authorizationPackageCompiler.negative_case_missing_validation_command_blocks_package -ne $true -or $authorizationPackageCompiler.negative_case_manifest_read_without_exact_path_stays_incomplete -ne $true -or $authorizationPackageCompiler.negative_case_external_execution_operation_blocks_compiler -ne $true) {
      Add-Failure "v14.149 must fail authorization package compiler negative cases"
    }
    if ($authorizationPackageCompiler.vcp_runtime_integration_proven -ne $false -or $authorizationPackageCompiler.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "authorization package compiler must not claim VCP runtime integration"
    }
    if ($authorizationPackageCompiler.provider_contact_performed -ne $false -or $authorizationPackageCompiler.plugin_call_performed -ne $false -or $authorizationPackageCompiler.api_call_performed -ne $false -or $authorizationPackageCompiler.mcp_runtime_performed -ne $false) {
      Add-Failure "authorization package compiler must not call provider/plugin/API/MCP"
    }
    if ($authorizationPackageCompiler.image_generation_performed -ne $false -or $authorizationPackageCompiler.real_manifest_read_performed -ne $false -or $authorizationPackageCompiler.real_vcpchat_read_performed -ne $false -or $authorizationPackageCompiler.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "authorization package compiler must not generate images or read real manifest/VCP systems"
    }
    if ($authorizationPackageCompiler.archive_manifest_written -ne $false -or $authorizationPackageCompiler.image_binary_copy_performed -ne $false -or $authorizationPackageCompiler.production_candidate_write_performed -ne $false -or $authorizationPackageCompiler.daily_note_write_performed -ne $false -or $authorizationPackageCompiler.vcp_memory_write_performed -ne $false) {
      Add-Failure "authorization package compiler must not write archive, production candidate, DailyNote, or VCP memory"
    }
  }

  $localRegressionSuiteOutput = & node (Join-Path $Root 'scripts/validate_v14_150_local_regression_suite_consolidation.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "local regression suite consolidation validation exited with failure"
  } else {
    $localRegressionSuite = ($localRegressionSuiteOutput -join "`n") | ConvertFrom-Json
    if ($localRegressionSuite.passed -ne $true) {
      Add-Failure "local regression suite consolidation validation must pass"
    }
    if ($localRegressionSuite.local_regression_suite_consolidated -ne $true -or $localRegressionSuite.validator_count -ne 9 -or $localRegressionSuite.child_failed_count -ne 0) {
      Add-Failure "v14.150 must consolidate a nine-validator passing local regression suite"
    }
    if ($localRegressionSuite.suite_runner_passed -ne $true) {
      Add-Failure "v14.150 suite runner must pass"
    }
    if ($localRegressionSuite.negative_case_missing_validator_blocks_suite -ne $true -or $localRegressionSuite.negative_case_child_failure_blocks_suite -ne $true -or $localRegressionSuite.negative_case_output_file_write_blocks_suite -ne $true -or $localRegressionSuite.negative_case_external_action_flag_blocks_suite -ne $true) {
      Add-Failure "v14.150 must fail local regression suite negative cases"
    }
    if ($localRegressionSuite.vcp_runtime_integration_proven -ne $false -or $localRegressionSuite.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "local regression suite must not claim VCP runtime integration"
    }
    if ($localRegressionSuite.provider_contact_performed -ne $false -or $localRegressionSuite.plugin_call_performed -ne $false -or $localRegressionSuite.api_call_performed -ne $false -or $localRegressionSuite.mcp_runtime_performed -ne $false) {
      Add-Failure "local regression suite must not call provider/plugin/API/MCP"
    }
    if ($localRegressionSuite.image_generation_performed -ne $false -or $localRegressionSuite.real_manifest_read_performed -ne $false -or $localRegressionSuite.real_vcpchat_read_performed -ne $false -or $localRegressionSuite.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "local regression suite must not generate images or read real manifest/VCP systems"
    }
    if ($localRegressionSuite.accepted_samples_write_performed -ne $false -or $localRegressionSuite.failure_samples_write_performed -ne $false -or $localRegressionSuite.production_candidate_write_performed -ne $false -or $localRegressionSuite.daily_note_write_performed -ne $false -or $localRegressionSuite.vcp_memory_write_performed -ne $false) {
      Add-Failure "local regression suite must not write samples, production candidates, DailyNote, or VCP memory"
    }
  }

  $dryRunVcpAdapterContractOutput = & node (Join-Path $Root 'scripts/validate_v14_151_dry_run_vcp_adapter_contract_v1.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "dry-run VCP adapter contract validation exited with failure"
  } else {
    $dryRunVcpAdapterContract = ($dryRunVcpAdapterContractOutput -join "`n") | ConvertFrom-Json
    if ($dryRunVcpAdapterContract.passed -ne $true) {
      Add-Failure "dry-run VCP adapter contract validation must pass"
    }
    if ($dryRunVcpAdapterContract.dry_run_vcp_adapter_contract_v1_created -ne $true -or $dryRunVcpAdapterContract.vcpchat_static_handoff_defined -ne $true -or $dryRunVcpAdapterContract.vcptoolbox_static_handoff_defined -ne $true -or $dryRunVcpAdapterContract.manifest_authorization_handoff_defined -ne $true) {
      Add-Failure "v14.151 must define dry-run VCPChat, VCPToolBox, and manifest handoff channels"
    }
    if ($dryRunVcpAdapterContract.v14_115_dry_run_vcp_adapter_alignment_still_passes -ne $true -or $dryRunVcpAdapterContract.v14_150_local_regression_suite_still_passes -ne $true) {
      Add-Failure "v14.151 must preserve v14.115 and v14.150 validation"
    }
    if ($dryRunVcpAdapterContract.negative_case_vcpchat_runtime_channel_enabled_blocks_contract -ne $true -or $dryRunVcpAdapterContract.negative_case_vcptoolbox_plugin_call_allowed_blocks_contract -ne $true -or $dryRunVcpAdapterContract.negative_case_manifest_read_performed_blocks_contract -ne $true -or $dryRunVcpAdapterContract.negative_case_exact_manifest_path_without_A5_stays_blocked -ne $true -or $dryRunVcpAdapterContract.negative_case_runtime_integration_claim_blocks_contract -ne $true) {
      Add-Failure "v14.151 must fail dry-run VCP adapter contract negative cases"
    }
    if ($dryRunVcpAdapterContract.vcp_runtime_integration_proven -ne $false -or $dryRunVcpAdapterContract.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "dry-run VCP adapter contract must not claim VCP runtime integration"
    }
    if ($dryRunVcpAdapterContract.provider_contact_performed -ne $false -or $dryRunVcpAdapterContract.plugin_call_performed -ne $false -or $dryRunVcpAdapterContract.api_call_performed -ne $false -or $dryRunVcpAdapterContract.mcp_runtime_performed -ne $false) {
      Add-Failure "dry-run VCP adapter contract must not call provider/plugin/API/MCP"
    }
    if ($dryRunVcpAdapterContract.image_generation_performed -ne $false -or $dryRunVcpAdapterContract.real_manifest_read_performed -ne $false -or $dryRunVcpAdapterContract.real_vcpchat_read_performed -ne $false -or $dryRunVcpAdapterContract.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "dry-run VCP adapter contract must not generate images or read real VCP systems"
    }
    if ($dryRunVcpAdapterContract.ipc_preload_renderer_integration_performed -ne $false -or $dryRunVcpAdapterContract.production_candidate_write_performed -ne $false -or $dryRunVcpAdapterContract.daily_note_write_performed -ne $false -or $dryRunVcpAdapterContract.vcp_memory_write_performed -ne $false) {
      Add-Failure "dry-run VCP adapter contract must not create runtime integration or write production/memory outputs"
    }
  }

  $reviewConsoleHandoffOutput = & node (Join-Path $Root 'scripts/validate_v14_152_review_console_handoff_contract.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console handoff contract validation exited with failure"
  } else {
    $reviewConsoleHandoff = ($reviewConsoleHandoffOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleHandoff.passed -ne $true) {
      Add-Failure "Review Console handoff contract validation must pass"
    }
    if ($reviewConsoleHandoff.review_console_handoff_contract_created -ne $true -or $reviewConsoleHandoff.static_child_window_data_contract_defined -ne $true -or $reviewConsoleHandoff.review_console_display_only_fields_defined -ne $true -or $reviewConsoleHandoff.future_runtime_boundary_defined -ne $true) {
      Add-Failure "v14.152 must define static Review Console handoff data contract and runtime boundary"
    }
    if ($reviewConsoleHandoff.v14_144_review_console_schema_binding_still_passes -ne $true -or $reviewConsoleHandoff.v14_151_dry_run_vcp_adapter_contract_still_passes -ne $true) {
      Add-Failure "v14.152 must preserve v14.144 and v14.151 validation"
    }
    if ($reviewConsoleHandoff.negative_case_ipc_channel_created_blocks_contract -ne $true -or $reviewConsoleHandoff.negative_case_preload_script_created_blocks_contract -ne $true -or $reviewConsoleHandoff.negative_case_renderer_integration_created_blocks_contract -ne $true -or $reviewConsoleHandoff.negative_case_fetch_performed_blocks_contract -ne $true -or $reviewConsoleHandoff.negative_case_real_vcpchat_read_blocks_contract -ne $true -or $reviewConsoleHandoff.negative_case_dailynote_write_blocks_contract -ne $true) {
      Add-Failure "v14.152 must fail Review Console runtime/read/write negative cases"
    }
    if ($reviewConsoleHandoff.vcp_runtime_integration_proven -ne $false -or $reviewConsoleHandoff.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "Review Console handoff contract must not claim VCP runtime integration"
    }
    if ($reviewConsoleHandoff.provider_contact_performed -ne $false -or $reviewConsoleHandoff.plugin_call_performed -ne $false -or $reviewConsoleHandoff.api_call_performed -ne $false -or $reviewConsoleHandoff.mcp_runtime_performed -ne $false) {
      Add-Failure "Review Console handoff contract must not call provider/plugin/API/MCP"
    }
    if ($reviewConsoleHandoff.image_generation_performed -ne $false -or $reviewConsoleHandoff.real_manifest_read_performed -ne $false -or $reviewConsoleHandoff.real_vcpchat_read_performed -ne $false -or $reviewConsoleHandoff.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "Review Console handoff contract must not generate images or read real VCP systems"
    }
    if ($reviewConsoleHandoff.ipc_channel_created -ne $false -or $reviewConsoleHandoff.preload_script_created -ne $false -or $reviewConsoleHandoff.renderer_integration_created -ne $false -or $reviewConsoleHandoff.production_candidate_write_performed -ne $false -or $reviewConsoleHandoff.daily_note_write_performed -ne $false -or $reviewConsoleHandoff.vcp_memory_write_performed -ne $false) {
      Add-Failure "Review Console handoff contract must not create runtime integration or write production/memory outputs"
    }
  }

  $manifestReadAuthorizationGateOutput = & node (Join-Path $Root 'scripts/validate_v14_153_manifest_read_authorization_gate_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "manifest read authorization gate package validation exited with failure"
  } else {
    $manifestReadAuthorizationGate = ($manifestReadAuthorizationGateOutput -join "`n") | ConvertFrom-Json
    if ($manifestReadAuthorizationGate.passed -ne $true) {
      Add-Failure "manifest read authorization gate package validation must pass"
    }
    if ($manifestReadAuthorizationGate.manifest_read_authorization_gate_package_created -ne $true -or $manifestReadAuthorizationGate.package_status -ne 'prepared_incomplete_not_granted' -or $manifestReadAuthorizationGate.exact_real_manifest_path_provided -ne $false -or $manifestReadAuthorizationGate.manifest_read_authorization_ready -ne $false) {
      Add-Failure "v14.153 must create an incomplete, not granted manifest read authorization gate package"
    }
    if ($manifestReadAuthorizationGate.v14_116_manifest_read_authorization_alignment_still_passes -ne $true -or $manifestReadAuthorizationGate.v14_152_review_console_handoff_contract_still_passes -ne $true) {
      Add-Failure "v14.153 must preserve v14.116 and v14.152 validation"
    }
    if ($manifestReadAuthorizationGate.negative_case_exact_manifest_path_missing_keeps_package_incomplete -ne $true -or $manifestReadAuthorizationGate.negative_case_read_performed_blocks_package -ne $true -or $manifestReadAuthorizationGate.negative_case_source_path_allowed_without_A5_blocks_package -ne $true -or $manifestReadAuthorizationGate.negative_case_raw_manifest_copy_allowed_blocks_package -ne $true -or $manifestReadAuthorizationGate.negative_case_runtime_integration_allowed_blocks_package -ne $true -or $manifestReadAuthorizationGate.negative_case_real_vcpchat_read_blocks_package -ne $true) {
      Add-Failure "v14.153 must fail manifest read authorization negative cases"
    }
    if ($manifestReadAuthorizationGate.vcp_runtime_integration_proven -ne $false -or $manifestReadAuthorizationGate.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "manifest read authorization gate package must not claim VCP runtime integration"
    }
    if ($manifestReadAuthorizationGate.read_authorized -ne $false -or $manifestReadAuthorizationGate.read_performed -ne $false -or $manifestReadAuthorizationGate.source_authorized -ne $false -or $manifestReadAuthorizationGate.source_read_performed -ne $false) {
      Add-Failure "manifest read authorization gate package must not authorize or perform reads"
    }
    if ($manifestReadAuthorizationGate.real_manifest_read_performed -ne $false -or $manifestReadAuthorizationGate.real_vcpchat_read_performed -ne $false -or $manifestReadAuthorizationGate.real_vcptoolbox_read_performed -ne $false -or $manifestReadAuthorizationGate.raw_manifest_copy_allowed -ne $false -or $manifestReadAuthorizationGate.read_command_permission -ne $false) {
      Add-Failure "manifest read authorization gate package must not read real VCP systems or allow raw manifest copy"
    }
    if ($manifestReadAuthorizationGate.provider_contact_performed -ne $false -or $manifestReadAuthorizationGate.plugin_call_performed -ne $false -or $manifestReadAuthorizationGate.api_call_performed -ne $false -or $manifestReadAuthorizationGate.mcp_runtime_performed -ne $false -or $manifestReadAuthorizationGate.image_generation_performed -ne $false) {
      Add-Failure "manifest read authorization gate package must not call provider/plugin/API/MCP or generate images"
    }
    if ($manifestReadAuthorizationGate.runtime_integration_performed -ne $false -or $manifestReadAuthorizationGate.production_candidate_write_performed -ne $false -or $manifestReadAuthorizationGate.daily_note_write_performed -ne $false -or $manifestReadAuthorizationGate.vcp_memory_write_performed -ne $false) {
      Add-Failure "manifest read authorization gate package must not create runtime integration or write production/memory outputs"
    }
  }

  $endToEndAuditRollbackOutput = & node (Join-Path $Root 'scripts/validate_v14_159_end_to_end_audit_rollback_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "end-to-end audit and rollback package validation exited with failure"
  } else {
    $endToEndAuditRollback = ($endToEndAuditRollbackOutput -join "`n") | ConvertFrom-Json
    if ($endToEndAuditRollback.passed -ne $true) {
      Add-Failure "end-to-end audit and rollback package validation must pass"
    }
    if ($endToEndAuditRollback.end_to_end_audit_and_rollback_package_created -ne $true -or $endToEndAuditRollback.audited_local_stage_count -ne 13 -or $endToEndAuditRollback.required_validator_chain_passed -ne $true -or $endToEndAuditRollback.a5_execution_slots_skipped_without_authorization -ne $true) {
      Add-Failure "v14.159 must audit all v14.141-v14.153 local stages and mark A5 slots skipped"
    }
    if ($endToEndAuditRollback.negative_case_missing_stage_validator_blocks_audit -ne $true -or $endToEndAuditRollback.negative_case_external_action_flag_blocks_rollback -ne $true -or $endToEndAuditRollback.negative_case_image_binary_copy_in_rollback_blocks_package -ne $true -or $endToEndAuditRollback.negative_case_recoverability_claimed_as_vcp_runtime_blocks_package -ne $true -or $endToEndAuditRollback.negative_case_skipped_a5_marked_complete_blocks_package -ne $true) {
      Add-Failure "v14.159 must fail audit and rollback negative cases"
    }
    if ($endToEndAuditRollback.rollback_scope -ne 'local_draft_metadata_only' -or $endToEndAuditRollback.rollback_external_action_allowed -ne $false) {
      Add-Failure "v14.159 rollback scope must remain local draft metadata only"
    }
    if ($endToEndAuditRollback.vcp_runtime_integration_proven -ne $false -or $endToEndAuditRollback.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "end-to-end audit and rollback package must not claim VCP runtime integration"
    }
    if ($endToEndAuditRollback.provider_contact_performed -ne $false -or $endToEndAuditRollback.plugin_call_performed -ne $false -or $endToEndAuditRollback.api_call_performed -ne $false -or $endToEndAuditRollback.mcp_runtime_performed -ne $false -or $endToEndAuditRollback.image_generation_performed -ne $false) {
      Add-Failure "end-to-end audit and rollback package must not call provider/plugin/API/MCP or generate images"
    }
    if ($endToEndAuditRollback.real_manifest_read_performed -ne $false -or $endToEndAuditRollback.real_vcpchat_read_performed -ne $false -or $endToEndAuditRollback.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "end-to-end audit and rollback package must not read real VCP systems"
    }
    if ($endToEndAuditRollback.image_binary_copy_performed -ne $false -or $endToEndAuditRollback.production_candidate_write_performed -ne $false -or $endToEndAuditRollback.failure_samples_write_performed -ne $false -or $endToEndAuditRollback.daily_note_write_performed -ne $false -or $endToEndAuditRollback.vcp_memory_write_performed -ne $false) {
      Add-Failure "end-to-end audit and rollback package must not copy images or write production/memory/failure outputs"
    }
  }

  $twoMonthCloseoutOutput = & node (Join-Path $Root 'scripts/validate_v14_160_two_month_product_capability_closeout.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "two-month product capability closeout validation exited with failure"
  } else {
    $twoMonthCloseout = ($twoMonthCloseoutOutput -join "`n") | ConvertFrom-Json
    if ($twoMonthCloseout.passed -ne $true) {
      Add-Failure "two-month product capability closeout validation must pass"
    }
    if ($twoMonthCloseout.two_month_product_capability_closeout_created -ne $true -or $twoMonthCloseout.local_lifecycle_chain_completed_validated -ne $true -or $twoMonthCloseout.audited_local_stage_count -ne 13) {
      Add-Failure "v14.160 must close out the local lifecycle chain"
    }
    $twoMonthCloseoutMigratedPending = $twoMonthCloseout.migration_status -eq 'legacy_runs_missing_git_preview_capsule_pending'
    if (-not $twoMonthCloseoutMigratedPending -and ($twoMonthCloseout.registry_sample_count -ne 8 -or $twoMonthCloseout.registry_category_count -ne 3 -or $twoMonthCloseout.local_artifact_sample_count -lt 6 -or $twoMonthCloseout.full_recoverable_sample_count -ne 3)) {
      Add-Failure "v14.160 must reflect observed accepted sample matrix counts"
    }
    if (-not $twoMonthCloseoutMigratedPending -and ($twoMonthCloseout.hard_acceptance_three_full_samples_met -ne $true -or $twoMonthCloseout.remaining_full_recoverable_sample_gap -ne 0 -or $twoMonthCloseout.two_month_goal_fully_complete -ne $false -or $twoMonthCloseout.goal_status -ne 'active_not_complete')) {
      Add-Failure "v14.160 must meet the local three-sample recoverability baseline without marking the two-month goal complete"
    }
    if ($twoMonthCloseoutMigratedPending -and ($twoMonthCloseout.preview_capsule_required -ne $true -or $twoMonthCloseout.preview_capsule_present -ne $false -or $twoMonthCloseout.hard_acceptance_three_full_samples_met -ne $false -or $twoMonthCloseout.two_month_goal_fully_complete -ne $false)) {
      Add-Failure "migrated v14.160 must keep the two-month goal active pending Git preview capsule evidence"
    }
    if ($twoMonthCloseout.negative_case_local_recoverability_must_not_complete_two_month_goal -ne $true -or $twoMonthCloseout.negative_case_skipped_a5_marked_complete_blocks_closeout -ne $true -or $twoMonthCloseout.negative_case_vcp_runtime_claim_blocks_closeout -ne $true -or $twoMonthCloseout.negative_case_dashboard_token_progress_blocks_closeout -ne $true -or $twoMonthCloseout.negative_case_external_action_flag_blocks_closeout -ne $true) {
      Add-Failure "v14.160 must fail closeout negative cases"
    }
    if ($twoMonthCloseout.vcp_runtime_integration_proven -ne $false -or $twoMonthCloseout.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "two-month closeout must not claim VCP runtime integration"
    }
    if ($twoMonthCloseout.provider_contact_performed -ne $false -or $twoMonthCloseout.plugin_call_performed -ne $false -or $twoMonthCloseout.api_call_performed -ne $false -or $twoMonthCloseout.mcp_runtime_performed -ne $false -or $twoMonthCloseout.image_generation_performed -ne $false) {
      Add-Failure "two-month closeout must not call provider/plugin/API/MCP or generate images"
    }
    if ($twoMonthCloseout.real_manifest_read_performed -ne $false -or $twoMonthCloseout.real_vcpchat_read_performed -ne $false -or $twoMonthCloseout.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "two-month closeout must not read real VCP systems"
    }
    if ($twoMonthCloseout.image_binary_copy_performed -ne $false -or $twoMonthCloseout.production_candidate_write_performed -ne $false -or $twoMonthCloseout.failure_samples_write_performed -ne $false -or $twoMonthCloseout.daily_note_write_performed -ne $false -or $twoMonthCloseout.vcp_memory_write_performed -ne $false) {
      Add-Failure "two-month closeout must not copy images or write production/memory/failure outputs"
    }
  }

  $codexGeneratedCandidateReadinessOutput = & node (Join-Path $Root 'scripts/validate_v14_161_codex_session_generated_candidate_readiness.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Codex generated candidate readiness validation exited with failure"
  } else {
    $codexGeneratedCandidateReadiness = ($codexGeneratedCandidateReadinessOutput -join "`n") | ConvertFrom-Json
    if ($codexGeneratedCandidateReadiness.passed -ne $true) {
      Add-Failure "Codex generated candidate readiness validation must pass"
    }
    if ($codexGeneratedCandidateReadiness.generated_candidate_count -ne 2 -or $codexGeneratedCandidateReadiness.different_visual_task_count -ne 2) {
      Add-Failure "v14.161 must verify two candidates across two different visual tasks"
    }
    if ($codexGeneratedCandidateReadiness.lamp_candidate_status -ne 'needs_revision' -or $codexGeneratedCandidateReadiness.lamp_candidate_accepted -ne $false) {
      Add-Failure "v14.161 must hold back the first lamp candidate for revision"
    }
    if ($codexGeneratedCandidateReadiness.bag_candidate_status -ne 'accepted_candidate_with_human_approval' -or $codexGeneratedCandidateReadiness.bag_candidate_approved_by -ne 'Jenn' -or $codexGeneratedCandidateReadiness.bag_candidate_accepted -ne $true) {
      Add-Failure "v14.161 must record Jenn approval for the second bag candidate only"
    }
    if ($codexGeneratedCandidateReadiness.negative_case_missing_artifact_fails -ne $true -or $codexGeneratedCandidateReadiness.negative_case_hash_mismatch_fails -ne $true -or $codexGeneratedCandidateReadiness.negative_case_dimensions_mismatch_fails -ne $true -or $codexGeneratedCandidateReadiness.negative_case_mime_mismatch_fails -ne $true -or $codexGeneratedCandidateReadiness.negative_case_human_approval_missing_for_passed_candidate_fails -ne $true -or $codexGeneratedCandidateReadiness.negative_case_unapproved_candidate_marked_accepted_fails -ne $true -or $codexGeneratedCandidateReadiness.negative_case_accepted_samples_write_flag_blocks_readiness -ne $true -or $codexGeneratedCandidateReadiness.negative_case_vcp_runtime_claim_blocks_readiness -ne $true) {
      Add-Failure "v14.161 must fail generated candidate readiness negative cases"
    }
    if ($codexGeneratedCandidateReadiness.accepted_samples_write_performed -ne $false -or $codexGeneratedCandidateReadiness.failure_samples_write_performed -ne $false -or $codexGeneratedCandidateReadiness.production_candidate_write_performed -ne $false -or $codexGeneratedCandidateReadiness.daily_note_write_performed -ne $false -or $codexGeneratedCandidateReadiness.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.161 must not write accepted/failure/production/memory outputs"
    }
    if ($codexGeneratedCandidateReadiness.provider_contact_performed_by_project -ne $false -or $codexGeneratedCandidateReadiness.plugin_call_performed_by_project -ne $false -or $codexGeneratedCandidateReadiness.api_call_performed_by_project -ne $false -or $codexGeneratedCandidateReadiness.mcp_runtime_performed_by_project -ne $false -or $codexGeneratedCandidateReadiness.image_generation_performed_by_project_script -ne $false) {
      Add-Failure "v14.161 must not call provider/plugin/API/MCP or generate by project script"
    }
    if ($codexGeneratedCandidateReadiness.real_manifest_read_performed -ne $false -or $codexGeneratedCandidateReadiness.real_vcpchat_read_performed -ne $false -or $codexGeneratedCandidateReadiness.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.161 must not read real manifest or VCP systems"
    }
    if ($codexGeneratedCandidateReadiness.durable_archive_copy_performed -ne $false -or $codexGeneratedCandidateReadiness.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.161 must not copy to durable archive or push/tag/release/deploy"
    }
    if ($codexGeneratedCandidateReadiness.vcp_runtime_integration_proven -ne $false -or $codexGeneratedCandidateReadiness.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.161 must not claim VCP runtime integration"
    }
  }

  $lampPromptRevisionOutput = & node (Join-Path $Root 'scripts/validate_v14_162_lamp_prompt_revision_after_v14_161_review.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "lamp prompt revision validation exited with failure"
  } else {
    $lampPromptRevision = ($lampPromptRevisionOutput -join "`n") | ConvertFrom-Json
    if ($lampPromptRevision.passed -ne $true) {
      Add-Failure "lamp prompt revision validation must pass"
    }
    if ($lampPromptRevision.prompt_package_created -ne $true -or $lampPromptRevision.source_candidate_status -ne 'needs_revision' -or $lampPromptRevision.fixes_indoor_desk_lamp_drift -ne $true -or $lampPromptRevision.clarifies_portable_led_camping_lantern_identity -ne $true) {
      Add-Failure "v14.162 must create a prompt package that fixes the lamp candidate positioning problem"
    }
    if ($lampPromptRevision.negative_case_generation_flag_blocks_prompt_readiness -ne $true -or $lampPromptRevision.negative_case_accepted_samples_write_flag_blocks_prompt_readiness -ne $true -or $lampPromptRevision.negative_case_vcp_runtime_claim_blocks_prompt_readiness -ne $true -or $lampPromptRevision.negative_case_missing_prompt_ref_blocks_prompt_readiness -ne $true) {
      Add-Failure "v14.162 must fail prompt revision negative cases"
    }
    if ($lampPromptRevision.generation_authorized_by_this_record -ne $false -or $lampPromptRevision.image_generation_performed -ne $false -or $lampPromptRevision.provider_contact_performed -ne $false -or $lampPromptRevision.plugin_call_performed -ne $false -or $lampPromptRevision.api_call_performed -ne $false -or $lampPromptRevision.mcp_runtime_performed -ne $false) {
      Add-Failure "v14.162 prompt revision record must not authorize or perform generation/provider/plugin/API/MCP actions"
    }
    if ($lampPromptRevision.accepted_samples_write_performed -ne $false -or $lampPromptRevision.failure_samples_write_performed -ne $false -or $lampPromptRevision.production_candidate_write_performed -ne $false -or $lampPromptRevision.daily_note_write_performed -ne $false -or $lampPromptRevision.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.162 prompt revision must not write accepted/failure/production/memory outputs"
    }
    if ($lampPromptRevision.durable_archive_copy_performed -ne $false -or $lampPromptRevision.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.162 prompt revision must not copy to durable archive or push/tag/release/deploy"
    }
    if ($lampPromptRevision.vcp_runtime_integration_proven -ne $false -or $lampPromptRevision.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.162 prompt revision must not claim VCP runtime integration"
    }
  }

  $lampV2ReadinessOutput = & node (Join-Path $Root 'scripts/validate_v14_163_lamp_v2_generated_candidate_readiness.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "lamp v2 generated candidate readiness validation exited with failure"
  } else {
    $lampV2Readiness = ($lampV2ReadinessOutput -join "`n") | ConvertFrom-Json
    if ($lampV2Readiness.passed -ne $true) {
      Add-Failure "lamp v2 generated candidate readiness validation must pass"
    }
    $lampV2ReadinessMigratedPending = $lampV2Readiness.migration_status -eq 'legacy_candidate_artifact_missing_git_preview_capsule_pending'
    if ($lampV2Readiness.review_status -ne 'pending_human_review' -or $lampV2Readiness.human_approval_status -ne 'pending' -or $lampV2Readiness.accepted_candidate -ne $false -or $lampV2Readiness.commercial_delivery_ready -ne $false) {
      Add-Failure "v14.163 lamp v2 candidate must remain pending human review and not accepted"
    }
    if (-not $lampV2ReadinessMigratedPending -and ($lampV2Readiness.artifact_sha256 -ne 'ba55bae4cbddc7233545b1d6822d77f0c4048266c9d5fb3b0be3ab1aa328178b' -or $lampV2Readiness.artifact_dimensions -ne '1254x1254' -or $lampV2Readiness.artifact_mime -ne 'image/png')) {
      Add-Failure "v14.163 must verify the real lamp v2 artifact hash, dimensions, and mime"
    }
    if ($lampV2ReadinessMigratedPending -and ($lampV2Readiness.preview_capsule_required -ne $true -or $lampV2Readiness.preview_capsule_present -ne $false -or $null -ne $lampV2Readiness.artifact_sha256)) {
      Add-Failure "migrated v14.163 must require preview capsule evidence without preserving old artifact sha256"
    }
    if ($lampV2Readiness.negative_case_missing_artifact_ref_fails -ne $true -or $lampV2Readiness.negative_case_hash_mismatch_fails -ne $true -or $lampV2Readiness.negative_case_dimensions_mismatch_fails -ne $true -or $lampV2Readiness.negative_case_mime_mismatch_fails -ne $true -or $lampV2Readiness.negative_case_premature_human_approval_blocks_readiness -ne $true -or $lampV2Readiness.negative_case_accepted_samples_write_flag_blocks_readiness -ne $true -or $lampV2Readiness.negative_case_vcp_runtime_claim_blocks_readiness -ne $true) {
      Add-Failure "v14.163 must fail lamp v2 readiness negative cases"
    }
    if ($lampV2Readiness.accepted_samples_write_performed -ne $false -or $lampV2Readiness.failure_samples_write_performed -ne $false -or $lampV2Readiness.production_candidate_write_performed -ne $false -or $lampV2Readiness.daily_note_write_performed -ne $false -or $lampV2Readiness.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.163 must not write accepted/failure/production/memory outputs"
    }
    if ($lampV2Readiness.durable_archive_copy_performed -ne $false -or $lampV2Readiness.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.163 must not copy to durable archive or push/tag/release/deploy"
    }
    if ($lampV2Readiness.vcp_runtime_integration_proven -ne $false -or $lampV2Readiness.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.163 must not claim VCP runtime integration"
    }
  }

  $bagAcceptedSamplesPreflightOutput = & node (Join-Path $Root 'scripts/validate_v14_164_bag_accepted_samples_metadata_registration_preflight.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "bag accepted_samples metadata registration preflight validation exited with failure"
  } else {
    $bagAcceptedSamplesPreflight = ($bagAcceptedSamplesPreflightOutput -join "`n") | ConvertFrom-Json
    if ($bagAcceptedSamplesPreflight.passed -ne $true) {
      Add-Failure "bag accepted_samples metadata registration preflight validation must pass"
    }
    $bagAcceptedSamplesPreflightMigratedPending = $bagAcceptedSamplesPreflight.migration_status -eq 'legacy_accepted_sample_artifact_missing_git_preview_capsule_pending'
    if (-not $bagAcceptedSamplesPreflightMigratedPending -and ($bagAcceptedSamplesPreflight.accepted_samples_registration_eligible -ne $true -or $bagAcceptedSamplesPreflight.human_approval_status -ne 'approved' -or $bagAcceptedSamplesPreflight.approved_by -ne 'Jenn')) {
      Add-Failure "v14.164 must prove the v14.161 bag candidate has Jenn approval and is registration-eligible"
    }
    if ($bagAcceptedSamplesPreflightMigratedPending -and ($bagAcceptedSamplesPreflight.human_approval_status -ne 'approved' -or $bagAcceptedSamplesPreflight.approved_by -ne 'Jenn' -or $bagAcceptedSamplesPreflight.preview_capsule_required -ne $true -or $bagAcceptedSamplesPreflight.preview_capsule_present -ne $false -or $bagAcceptedSamplesPreflight.accepted_samples_registration_eligible -ne $false)) {
      Add-Failure "migrated v14.164 must keep human approval but block registration until preview capsule evidence exists"
    }
    if (-not $bagAcceptedSamplesPreflightMigratedPending -and ($bagAcceptedSamplesPreflight.artifact_sha256 -ne '3422671f95e9b218829966ae46f4b284ae619875e080c473a295cf9e65432ba3' -or $bagAcceptedSamplesPreflight.artifact_dimensions -ne '1254x1254' -or $bagAcceptedSamplesPreflight.artifact_mime -ne 'image/png')) {
      Add-Failure "v14.164 must verify the real bag artifact hash, dimensions, and mime"
    }
    if ($bagAcceptedSamplesPreflight.negative_case_missing_artifact_fails -ne $true -or $bagAcceptedSamplesPreflight.negative_case_hash_mismatch_fails -ne $true -or $bagAcceptedSamplesPreflight.negative_case_dimensions_mismatch_fails -ne $true -or $bagAcceptedSamplesPreflight.negative_case_mime_mismatch_fails -ne $true -or $bagAcceptedSamplesPreflight.negative_case_review_record_missing_fails -ne $true -or $bagAcceptedSamplesPreflight.negative_case_human_approval_missing_fails -ne $true -or $bagAcceptedSamplesPreflight.negative_case_category_index_missing_fails -ne $true -or $bagAcceptedSamplesPreflight.negative_case_existing_registry_duplicate_fails -ne $true -or $bagAcceptedSamplesPreflight.negative_case_registry_write_flag_blocks_preflight -ne $true -or $bagAcceptedSamplesPreflight.negative_case_vcp_runtime_claim_blocks_preflight -ne $true) {
      Add-Failure "v14.164 must fail bag accepted_samples registration preflight negative cases"
    }
    if ($bagAcceptedSamplesPreflight.accepted_samples_write_performed -ne $false -or $bagAcceptedSamplesPreflight.category_index_write_performed -ne $false -or $bagAcceptedSamplesPreflight.image_file_copy_performed -ne $false) {
      Add-Failure "v14.164 must not write accepted_samples/category index or copy image files"
    }
    if ($bagAcceptedSamplesPreflight.failure_samples_write_performed -ne $false -or $bagAcceptedSamplesPreflight.production_candidate_write_performed -ne $false -or $bagAcceptedSamplesPreflight.daily_note_write_performed -ne $false -or $bagAcceptedSamplesPreflight.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.164 must not write failure/production/memory outputs"
    }
    if ($bagAcceptedSamplesPreflight.provider_contact_performed -ne $false -or $bagAcceptedSamplesPreflight.plugin_call_performed -ne $false -or $bagAcceptedSamplesPreflight.api_call_performed -ne $false -or $bagAcceptedSamplesPreflight.mcp_runtime_performed -ne $false -or $bagAcceptedSamplesPreflight.real_manifest_read_performed -ne $false -or $bagAcceptedSamplesPreflight.real_vcpchat_read_performed -ne $false -or $bagAcceptedSamplesPreflight.real_vcptoolbox_read_performed -ne $false -or $bagAcceptedSamplesPreflight.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.164 must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($bagAcceptedSamplesPreflight.vcp_runtime_integration_proven -ne $false -or $bagAcceptedSamplesPreflight.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.164 must not claim VCP runtime integration"
    }
  }

  $bagAcceptedSamplesRegistrationOutput = & node (Join-Path $Root 'scripts/validate_v14_165_bag_accepted_samples_metadata_registration.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "bag accepted_samples metadata registration validation exited with failure"
  } else {
    $bagAcceptedSamplesRegistration = ($bagAcceptedSamplesRegistrationOutput -join "`n") | ConvertFrom-Json
    if ($bagAcceptedSamplesRegistration.passed -ne $true) {
      Add-Failure "bag accepted_samples metadata registration validation must pass"
    }
    if ($bagAcceptedSamplesRegistration.registry_metadata_write_performed -ne $true -or $bagAcceptedSamplesRegistration.category_index_write_performed -ne $true) {
      Add-Failure "v14.165 must perform accepted_samples registry/category metadata writes"
    }
    $bagAcceptedSamplesRegistrationMigratedPending = $bagAcceptedSamplesRegistration.migration_status -eq 'legacy_accepted_sample_artifact_missing_git_preview_capsule_pending'
    if ($bagAcceptedSamplesRegistration.image_file_copy_performed -ne $false -or $bagAcceptedSamplesRegistration.runs_source_image_modified -ne $false) {
      Add-Failure "v14.165 must not copy image files or modify runs source images"
    }
    if (-not $bagAcceptedSamplesRegistrationMigratedPending -and ($bagAcceptedSamplesRegistration.accepted_sample_full_recoverability_count_after_this_phase -ne 2 -or $bagAcceptedSamplesRegistration.third_full_recoverable_sample_still_required -ne $true)) {
      Add-Failure "v14.165 must not overclaim the three-sample hard acceptance target"
    }
    if ($bagAcceptedSamplesRegistrationMigratedPending -and ($bagAcceptedSamplesRegistration.preview_capsule_required -ne $true -or $bagAcceptedSamplesRegistration.preview_capsule_present -ne $false -or $null -ne $bagAcceptedSamplesRegistration.artifact_sha256)) {
      Add-Failure "migrated v14.165 must require preview capsule evidence without preserving old artifact sha256"
    }
    if ($bagAcceptedSamplesRegistration.negative_case_registry_sample_missing_fails -ne $true -or $bagAcceptedSamplesRegistration.negative_case_category_index_missing_fails -ne $true -or $bagAcceptedSamplesRegistration.negative_case_hash_mismatch_fails -ne $true -or $bagAcceptedSamplesRegistration.negative_case_dimensions_mismatch_fails -ne $true -or $bagAcceptedSamplesRegistration.negative_case_mime_mismatch_fails -ne $true -or $bagAcceptedSamplesRegistration.negative_case_human_approval_missing_fails -ne $true -or $bagAcceptedSamplesRegistration.negative_case_image_file_committed_flag_fails -ne $true -or $bagAcceptedSamplesRegistration.negative_case_absolute_artifact_locator_fails -ne $true -or $bagAcceptedSamplesRegistration.negative_case_production_candidate_flag_fails -ne $true -or $bagAcceptedSamplesRegistration.negative_case_vcp_runtime_claim_blocks_registration -ne $true) {
      Add-Failure "v14.165 must fail accepted_samples metadata registration negative cases"
    }
    if ($bagAcceptedSamplesRegistration.failure_samples_write_performed -ne $false -or $bagAcceptedSamplesRegistration.production_candidate_write_performed -ne $false -or $bagAcceptedSamplesRegistration.daily_note_write_performed -ne $false -or $bagAcceptedSamplesRegistration.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.165 must not write failure/production/memory outputs"
    }
    if ($bagAcceptedSamplesRegistration.provider_contact_performed -ne $false -or $bagAcceptedSamplesRegistration.plugin_call_performed -ne $false -or $bagAcceptedSamplesRegistration.api_call_performed -ne $false -or $bagAcceptedSamplesRegistration.mcp_runtime_performed -ne $false -or $bagAcceptedSamplesRegistration.real_manifest_read_performed -ne $false -or $bagAcceptedSamplesRegistration.real_vcpchat_read_performed -ne $false -or $bagAcceptedSamplesRegistration.real_vcptoolbox_read_performed -ne $false -or $bagAcceptedSamplesRegistration.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.165 must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($bagAcceptedSamplesRegistration.vcp_runtime_integration_proven -ne $false -or $bagAcceptedSamplesRegistration.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.165 must not claim VCP runtime integration"
    }
  }

  $lampV3ReadinessOutput = & node (Join-Path $Root 'scripts/validate_v14_166_lamp_v3_generated_candidate_readiness.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "lamp v3 generated candidate readiness validation exited with failure"
  } else {
    $lampV3Readiness = ($lampV3ReadinessOutput -join "`n") | ConvertFrom-Json
    if ($lampV3Readiness.passed -ne $true) {
      Add-Failure "lamp v3 generated candidate readiness validation must pass"
    }
    $lampV3ReadinessMigratedPending = $lampV3Readiness.migration_status -eq 'legacy_candidate_artifact_missing_git_preview_capsule_pending'
    if ($lampV3Readiness.review_status -ne 'pending_human_review' -or $lampV3Readiness.human_approval_status -ne 'pending' -or $lampV3Readiness.accepted_candidate -ne $false -or $lampV3Readiness.commercial_delivery_ready -ne $false) {
      Add-Failure "v14.166 lamp v3 candidate must remain pending human review and not accepted"
    }
    if (-not $lampV3ReadinessMigratedPending -and ($lampV3Readiness.artifact_sha256 -ne 'eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c' -or $lampV3Readiness.artifact_dimensions -ne '1254x1254' -or $lampV3Readiness.artifact_mime -ne 'image/png')) {
      Add-Failure "v14.166 must verify the real lamp v3 artifact hash, dimensions, and mime"
    }
    if ($lampV3ReadinessMigratedPending -and ($lampV3Readiness.preview_capsule_required -ne $true -or $lampV3Readiness.preview_capsule_present -ne $false -or $null -ne $lampV3Readiness.artifact_sha256)) {
      Add-Failure "migrated v14.166 must require preview capsule evidence without preserving old artifact sha256"
    }
    if ($lampV3Readiness.third_full_recoverable_sample_candidate_created -ne $true -or $lampV3Readiness.third_full_recoverable_sample_still_requires_human_approval -ne $true) {
      Add-Failure "v14.166 must create a third-sample candidate without overclaiming acceptance"
    }
    if ($lampV3Readiness.negative_case_missing_artifact_ref_fails -ne $true -or $lampV3Readiness.negative_case_hash_mismatch_fails -ne $true -or $lampV3Readiness.negative_case_dimensions_mismatch_fails -ne $true -or $lampV3Readiness.negative_case_mime_mismatch_fails -ne $true -or $lampV3Readiness.negative_case_premature_human_approval_blocks_readiness -ne $true -or $lampV3Readiness.negative_case_accepted_samples_write_flag_blocks_readiness -ne $true -or $lampV3Readiness.negative_case_vcp_runtime_claim_blocks_readiness -ne $true -or $lampV3Readiness.negative_case_third_sample_overclaim_blocks_readiness -ne $true) {
      Add-Failure "v14.166 must fail lamp v3 readiness negative cases"
    }
    if ($lampV3Readiness.accepted_samples_write_performed -ne $false -or $lampV3Readiness.failure_samples_write_performed -ne $false -or $lampV3Readiness.production_candidate_write_performed -ne $false -or $lampV3Readiness.daily_note_write_performed -ne $false -or $lampV3Readiness.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.166 must not write accepted/failure/production/memory outputs"
    }
    if ($lampV3Readiness.durable_archive_copy_performed -ne $false -or $lampV3Readiness.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.166 must not copy to durable archive or push/tag/release/deploy"
    }
    if ($lampV3Readiness.vcp_runtime_integration_proven -ne $false -or $lampV3Readiness.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.166 must not claim VCP runtime integration"
    }
  }

  $lampV3RegistrationBlockerOutput = & node (Join-Path $Root 'scripts/validate_v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "lamp v3 accepted_samples registration blocker preflight validation exited with failure"
  } else {
    $lampV3RegistrationBlocker = ($lampV3RegistrationBlockerOutput -join "`n") | ConvertFrom-Json
    if ($lampV3RegistrationBlocker.passed -ne $true) {
      Add-Failure "lamp v3 accepted_samples registration blocker preflight validation must pass"
    }
    $lampV3RegistrationBlockerMigratedPending = $lampV3RegistrationBlocker.migration_status -eq 'legacy_accepted_sample_artifact_missing_git_preview_capsule_pending'
    if (-not $lampV3RegistrationBlockerMigratedPending -and ($lampV3RegistrationBlocker.accepted_samples_registration_eligible -ne $true -or $null -ne $lampV3RegistrationBlocker.registration_blocker -or $lampV3RegistrationBlocker.human_approval_status -ne 'approved')) {
      Add-Failure "v14.167 must reflect Jenn-approved lamp v3 accepted_samples registration readiness"
    }
    if ($lampV3RegistrationBlockerMigratedPending -and ($lampV3RegistrationBlocker.accepted_samples_registration_eligible -ne $false -or $lampV3RegistrationBlocker.registration_blocker -ne 'preview_capsule_missing' -or $lampV3RegistrationBlocker.preview_capsule_required -ne $true -or $lampV3RegistrationBlocker.preview_capsule_present -ne $false)) {
      Add-Failure "migrated v14.167 must block accepted_samples registration until preview capsule evidence exists"
    }
    if (-not $lampV3RegistrationBlockerMigratedPending -and ($lampV3RegistrationBlocker.artifact_sha256 -ne 'eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c' -or $lampV3RegistrationBlocker.artifact_dimensions -ne '1254x1254' -or $lampV3RegistrationBlocker.artifact_mime -ne 'image/png')) {
      Add-Failure "v14.167 must verify the real lamp v3 artifact hash, dimensions, and mime"
    }
    if ($lampV3RegistrationBlocker.negative_case_missing_artifact_fails -ne $true -or $lampV3RegistrationBlocker.negative_case_hash_mismatch_fails -ne $true -or $lampV3RegistrationBlocker.negative_case_dimensions_mismatch_fails -ne $true -or $lampV3RegistrationBlocker.negative_case_mime_mismatch_fails -ne $true -or $lampV3RegistrationBlocker.negative_case_review_record_missing_fails -ne $true -or $lampV3RegistrationBlocker.negative_case_human_approval_missing_blocks_registration -ne $true -or $lampV3RegistrationBlocker.negative_case_category_index_missing_fails -ne $true -or $lampV3RegistrationBlocker.negative_case_registry_entry_missing_fails -ne $true -or $lampV3RegistrationBlocker.negative_case_registry_write_flag_blocks_preflight -ne $true -or $lampV3RegistrationBlocker.negative_case_vcp_runtime_claim_blocks_preflight -ne $true -or $lampV3RegistrationBlocker.negative_case_pending_status_blocks_post_registration -ne $true) {
      Add-Failure "v14.167 must fail lamp v3 accepted_samples blocker negative cases"
    }
    if ($lampV3RegistrationBlocker.accepted_samples_write_performed -ne $false -or $lampV3RegistrationBlocker.category_index_write_performed -ne $false -or $lampV3RegistrationBlocker.image_file_copy_performed -ne $false) {
      Add-Failure "v14.167 must not write accepted_samples/category index or copy image files"
    }
    if ($lampV3RegistrationBlocker.failure_samples_write_performed -ne $false -or $lampV3RegistrationBlocker.production_candidate_write_performed -ne $false -or $lampV3RegistrationBlocker.daily_note_write_performed -ne $false -or $lampV3RegistrationBlocker.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.167 must not write failure/production/memory outputs"
    }
    if ($lampV3RegistrationBlocker.provider_contact_performed -ne $false -or $lampV3RegistrationBlocker.plugin_call_performed -ne $false -or $lampV3RegistrationBlocker.api_call_performed -ne $false -or $lampV3RegistrationBlocker.mcp_runtime_performed -ne $false -or $lampV3RegistrationBlocker.real_manifest_read_performed -ne $false -or $lampV3RegistrationBlocker.real_vcpchat_read_performed -ne $false -or $lampV3RegistrationBlocker.real_vcptoolbox_read_performed -ne $false -or $lampV3RegistrationBlocker.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.167 must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($lampV3RegistrationBlocker.vcp_runtime_integration_proven -ne $false -or $lampV3RegistrationBlocker.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.167 must not claim VCP runtime integration"
    }
  }

  $threeSampleDashboardOutput = & node (Join-Path $Root 'scripts/validate_v14_168_three_sample_dashboard_evidence_alignment.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "three-sample dashboard evidence alignment validation exited with failure"
  } else {
    $threeSampleDashboard = ($threeSampleDashboardOutput -join "`n") | ConvertFrom-Json
    if ($threeSampleDashboard.passed -ne $true) {
      Add-Failure "three-sample dashboard evidence alignment validation must pass"
    }
    $threeSampleDashboardMigratedPending = $threeSampleDashboard.migration_status -eq 'legacy_dashboard_artifacts_missing_git_preview_capsule_pending'
    if (-not $threeSampleDashboardMigratedPending -and ($threeSampleDashboard.full_recoverable_accepted_sample_count -ne 3 -or $threeSampleDashboard.blocked_third_candidate_count -ne 0 -or $threeSampleDashboard.hard_acceptance_three_full_samples_met -ne $true -or $threeSampleDashboard.remaining_full_recoverable_sample_gap -ne 0)) {
      Add-Failure "v14.168 dashboard evidence must show three full accepted samples and no blocked third candidate"
    }
    if ($threeSampleDashboardMigratedPending -and ($threeSampleDashboard.preview_capsule_required -ne $true -or $threeSampleDashboard.preview_capsule_present -ne $false -or $threeSampleDashboard.hard_acceptance_three_full_samples_met -ne $false)) {
      Add-Failure "migrated v14.168 dashboard must mark preview capsules pending and avoid three-sample completion overclaim"
    }
    if (-not $threeSampleDashboardMigratedPending -and ($threeSampleDashboard.dashboard_progress_basis -ne 'validator_outputs_real_artifact_evidence' -or $threeSampleDashboard.dashboard_uses_project_master_plan_progress -ne $false -or $threeSampleDashboard.dashboard_uses_document_token_progress -ne $false -or $threeSampleDashboard.dashboard_promotes_product_status -ne $false)) {
      Add-Failure "v14.168 dashboard evidence must use validator output, not project plan/docs token progress"
    }
    if ($threeSampleDashboard.negative_case_dashboard_drops_registered_lamp_fails -ne $true -or $threeSampleDashboard.negative_case_three_sample_goal_marked_incomplete_fails -ne $true -or $threeSampleDashboard.negative_case_project_master_plan_progress_fails -ne $true -or $threeSampleDashboard.negative_case_document_token_progress_fails -ne $true -or $threeSampleDashboard.negative_case_runtime_claim_blocks_dashboard -ne $true -or $threeSampleDashboard.negative_case_external_action_flag_blocks_dashboard -ne $true -or $threeSampleDashboard.negative_case_accepted_samples_write_flag_blocks_dashboard -ne $true) {
      Add-Failure "v14.168 must fail dashboard evidence negative cases"
    }
    if ($threeSampleDashboard.accepted_samples_write_performed -ne $false -or $threeSampleDashboard.category_index_write_performed -ne $false -or $threeSampleDashboard.image_file_copy_performed -ne $false) {
      Add-Failure "v14.168 must not write accepted_samples/category index or copy image files"
    }
    if ($threeSampleDashboard.failure_samples_write_performed -ne $false -or $threeSampleDashboard.production_candidate_write_performed -ne $false -or $threeSampleDashboard.daily_note_write_performed -ne $false -or $threeSampleDashboard.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.168 must not write failure/production/memory outputs"
    }
    if ($threeSampleDashboard.provider_contact_performed -ne $false -or $threeSampleDashboard.plugin_call_performed -ne $false -or $threeSampleDashboard.api_call_performed -ne $false -or $threeSampleDashboard.mcp_runtime_performed -ne $false -or $threeSampleDashboard.real_manifest_read_performed -ne $false -or $threeSampleDashboard.real_vcpchat_read_performed -ne $false -or $threeSampleDashboard.real_vcptoolbox_read_performed -ne $false -or $threeSampleDashboard.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.168 must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($threeSampleDashboard.vcp_runtime_integration_proven -ne $false -or $threeSampleDashboard.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.168 must not claim VCP runtime integration"
    }
  }

  $reviewConsoleLifecycleReaderOutput = & node (Join-Path $Root 'scripts/validate_v14_169_review_console_artifact_lifecycle_state_reader.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact lifecycle state reader validation exited with failure"
  } else {
    $reviewConsoleLifecycleReader = ($reviewConsoleLifecycleReaderOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleLifecycleReader.passed -ne $true) {
      Add-Failure "Review Console artifact lifecycle state reader validation must pass"
    }
    if ($reviewConsoleLifecycleReader.parse_status -ne 'parsed' -or $reviewConsoleLifecycleReader.recoverable_accepted_sample_count -ne 2 -or $reviewConsoleLifecycleReader.blocked_registration_candidate_count -ne 1 -or $reviewConsoleLifecycleReader.remaining_full_recoverable_sample_gap -ne 1 -or $reviewConsoleLifecycleReader.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.169 lifecycle reader must show two recoverable accepted samples plus one blocked third candidate"
    }
    if ($reviewConsoleLifecycleReader.negative_case_pending_candidate_counted_as_accepted_fails -ne $true -or $reviewConsoleLifecycleReader.negative_case_three_sample_goal_overclaim_fails -ne $true -or $reviewConsoleLifecycleReader.negative_case_fetch_guard_flag_blocks_reader -ne $true -or $reviewConsoleLifecycleReader.negative_case_file_write_guard_flag_blocks_reader -ne $true -or $reviewConsoleLifecycleReader.negative_case_accepted_samples_write_guard_flag_blocks_reader -ne $true -or $reviewConsoleLifecycleReader.negative_case_production_candidate_guard_flag_blocks_reader -ne $true -or $reviewConsoleLifecycleReader.negative_case_runtime_claim_blocks_reader -ne $true -or $reviewConsoleLifecycleReader.negative_case_missing_human_approval_keeps_lamp_blocked -ne $true) {
      Add-Failure "v14.169 must fail lifecycle reader negative cases"
    }
    if ($reviewConsoleLifecycleReader.fetch_performed -ne $false -or $reviewConsoleLifecycleReader.file_write_performed -ne $false -or $reviewConsoleLifecycleReader.accepted_samples_write_performed -ne $false -or $reviewConsoleLifecycleReader.failure_samples_write_performed -ne $false -or $reviewConsoleLifecycleReader.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.169 lifecycle reader must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleLifecycleReader.provider_contact_performed -ne $false -or $reviewConsoleLifecycleReader.plugin_call_performed -ne $false -or $reviewConsoleLifecycleReader.api_call_performed -ne $false -or $reviewConsoleLifecycleReader.mcp_runtime_performed -ne $false -or $reviewConsoleLifecycleReader.real_manifest_read_performed -ne $false -or $reviewConsoleLifecycleReader.real_vcpchat_read_performed -ne $false -or $reviewConsoleLifecycleReader.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleLifecycleReader.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.169 lifecycle reader must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleLifecycleReader.vcp_runtime_integration_proven -ne $false -or $reviewConsoleLifecycleReader.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.169 lifecycle reader must not claim VCP runtime integration"
    }
  }

  $reviewConsoleLifecycleSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact lifecycle state reader snapshot validation exited with failure"
  } else {
    $reviewConsoleLifecycleSnapshot = ($reviewConsoleLifecycleSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleLifecycleSnapshot.passed -ne $true) {
      Add-Failure "Review Console artifact lifecycle state reader snapshot validation must pass"
    }
    if ($reviewConsoleLifecycleSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleLifecycleSnapshot.draft_output_key -ne 'artifact_lifecycle_state_reader') {
      Add-Failure "v14.170 must validate the artifact_lifecycle_state_reader draft output snapshot"
    }
    if ($reviewConsoleLifecycleSnapshot.recoverable_accepted_sample_count -ne 2 -or $reviewConsoleLifecycleSnapshot.blocked_registration_candidate_count -ne 1 -or $reviewConsoleLifecycleSnapshot.remaining_full_recoverable_sample_gap -ne 1 -or $reviewConsoleLifecycleSnapshot.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.170 lifecycle snapshot must preserve two recoverable accepted samples plus one blocked third candidate"
    }
    if ($reviewConsoleLifecycleSnapshot.negative_case_missing_snapshot_key_fails -ne $true -or $reviewConsoleLifecycleSnapshot.negative_case_counts_mismatch_fails -ne $true -or $reviewConsoleLifecycleSnapshot.negative_case_lamp_marked_recoverable_fails -ne $true -or $reviewConsoleLifecycleSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleLifecycleSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.170 must fail lifecycle snapshot negative cases"
    }
    if ($reviewConsoleLifecycleSnapshot.fetch_performed -ne $false -or $reviewConsoleLifecycleSnapshot.file_write_performed -ne $false -or $reviewConsoleLifecycleSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsoleLifecycleSnapshot.failure_samples_write_performed -ne $false -or $reviewConsoleLifecycleSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.170 lifecycle snapshot must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleLifecycleSnapshot.provider_contact_performed -ne $false -or $reviewConsoleLifecycleSnapshot.plugin_call_performed -ne $false -or $reviewConsoleLifecycleSnapshot.api_call_performed -ne $false -or $reviewConsoleLifecycleSnapshot.mcp_runtime_performed -ne $false -or $reviewConsoleLifecycleSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleLifecycleSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleLifecycleSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleLifecycleSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.170 lifecycle snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleLifecycleSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsoleLifecycleSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.170 lifecycle snapshot must not claim VCP runtime integration"
    }
  }

  $reviewConsoleLifecycleFilterOutput = & node (Join-Path $Root 'scripts/validate_v14_171_review_console_lifecycle_state_local_filter_controls.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console lifecycle state local filter controls validation exited with failure"
  } else {
    $reviewConsoleLifecycleFilter = ($reviewConsoleLifecycleFilterOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleLifecycleFilter.passed -ne $true) {
      Add-Failure "Review Console lifecycle state local filter controls validation must pass"
    }
    if ($reviewConsoleLifecycleFilter.visible_count_all -ne 3 -or $reviewConsoleLifecycleFilter.visible_count_recoverable -ne 2 -or $reviewConsoleLifecycleFilter.visible_count_blocked -ne 1 -or $reviewConsoleLifecycleFilter.filter_is_local_ui_only -ne $true) {
      Add-Failure "v14.171 lifecycle filters must be local-only and preserve all/recoverable/blocked counts"
    }
    if ($reviewConsoleLifecycleFilter.negative_case_unknown_filter_falls_back_to_all -ne $true -or $reviewConsoleLifecycleFilter.negative_case_recoverable_filter_must_not_show_blocked_lamp -ne $true -or $reviewConsoleLifecycleFilter.negative_case_blocked_filter_must_show_only_lamp -ne $true -or $reviewConsoleLifecycleFilter.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleLifecycleFilter.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.171 must fail lifecycle filter negative cases"
    }
    if ($reviewConsoleLifecycleFilter.fetch_performed -ne $false -or $reviewConsoleLifecycleFilter.file_write_performed -ne $false -or $reviewConsoleLifecycleFilter.accepted_samples_write_performed -ne $false -or $reviewConsoleLifecycleFilter.failure_samples_write_performed -ne $false -or $reviewConsoleLifecycleFilter.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.171 lifecycle filters must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleLifecycleFilter.provider_contact_performed -ne $false -or $reviewConsoleLifecycleFilter.plugin_call_performed -ne $false -or $reviewConsoleLifecycleFilter.api_call_performed -ne $false -or $reviewConsoleLifecycleFilter.mcp_runtime_performed -ne $false -or $reviewConsoleLifecycleFilter.real_manifest_read_performed -ne $false -or $reviewConsoleLifecycleFilter.real_vcpchat_read_performed -ne $false -or $reviewConsoleLifecycleFilter.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleLifecycleFilter.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.171 lifecycle filters must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleLifecycleFilter.vcp_runtime_integration_proven -ne $false -or $reviewConsoleLifecycleFilter.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.171 lifecycle filters must not claim VCP runtime integration"
    }
  }

  $reviewConsolePromptCompletionOutput = & node (Join-Path $Root 'scripts/validate_v14_172_review_console_prompt_to_artifact_completion_static_panel.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console prompt-to-artifact completion static panel validation exited with failure"
  } else {
    $reviewConsolePromptCompletion = ($reviewConsolePromptCompletionOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsolePromptCompletion.passed -ne $true) {
      Add-Failure "Review Console prompt-to-artifact completion static panel validation must pass"
    }
    if ($reviewConsolePromptCompletion.record_count -ne 3 -or $reviewConsolePromptCompletion.review_complete_count -ne 2 -or $reviewConsolePromptCompletion.blocked_count -ne 1 -or $reviewConsolePromptCompletion.average_completion_score -ne 84 -or $reviewConsolePromptCompletion.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.172 prompt completion panel must show two complete records plus one blocked lamp candidate"
    }
    if ($reviewConsolePromptCompletion.negative_case_missing_prompt_ref_fails -ne $true -or $reviewConsolePromptCompletion.negative_case_missing_completion_status_fails -ne $true -or $reviewConsolePromptCompletion.negative_case_lamp_without_blocker_fails -ne $true -or $reviewConsolePromptCompletion.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsolePromptCompletion.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.172 must fail prompt completion panel negative cases"
    }
    if ($reviewConsolePromptCompletion.fetch_performed -ne $false -or $reviewConsolePromptCompletion.file_write_performed -ne $false -or $reviewConsolePromptCompletion.accepted_samples_write_performed -ne $false -or $reviewConsolePromptCompletion.failure_samples_write_performed -ne $false -or $reviewConsolePromptCompletion.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.172 prompt completion panel must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsolePromptCompletion.provider_contact_performed -ne $false -or $reviewConsolePromptCompletion.plugin_call_performed -ne $false -or $reviewConsolePromptCompletion.api_call_performed -ne $false -or $reviewConsolePromptCompletion.mcp_runtime_performed -ne $false -or $reviewConsolePromptCompletion.real_manifest_read_performed -ne $false -or $reviewConsolePromptCompletion.real_vcpchat_read_performed -ne $false -or $reviewConsolePromptCompletion.real_vcptoolbox_read_performed -ne $false -or $reviewConsolePromptCompletion.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.172 prompt completion panel must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsolePromptCompletion.vcp_runtime_integration_proven -ne $false -or $reviewConsolePromptCompletion.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.172 prompt completion panel must not claim VCP runtime integration"
    }
  }

  $reviewConsolePromptCompletionSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_173_review_console_prompt_completion_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console prompt completion snapshot static regression validation exited with failure"
  } else {
    $reviewConsolePromptCompletionSnapshot = ($reviewConsolePromptCompletionSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsolePromptCompletionSnapshot.passed -ne $true) {
      Add-Failure "Review Console prompt completion snapshot static regression validation must pass"
    }
    if ($reviewConsolePromptCompletionSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsolePromptCompletionSnapshot.draft_output_key -ne 'artifact_prompt_completion_state') {
      Add-Failure "v14.173 must validate the artifact_prompt_completion_state golden snapshot"
    }
    if ($reviewConsolePromptCompletionSnapshot.record_count -ne 3 -or $reviewConsolePromptCompletionSnapshot.review_complete_count -ne 2 -or $reviewConsolePromptCompletionSnapshot.blocked_count -ne 1 -or $reviewConsolePromptCompletionSnapshot.average_completion_score -ne 84 -or $reviewConsolePromptCompletionSnapshot.hard_acceptance_three_full_samples_met -ne $false -or $reviewConsolePromptCompletionSnapshot.lamp_blocker -ne 'human_approval_missing') {
      Add-Failure "v14.173 prompt completion snapshot must preserve the static completion evidence and lamp blocker"
    }
    if ($reviewConsolePromptCompletionSnapshot.negative_case_missing_lamp_blocker_fails -ne $true -or $reviewConsolePromptCompletionSnapshot.negative_case_average_score_mismatch_fails -ne $true -or $reviewConsolePromptCompletionSnapshot.negative_case_three_sample_overclaim_fails -ne $true -or $reviewConsolePromptCompletionSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsolePromptCompletionSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.173 must fail prompt completion snapshot negative cases"
    }
    if ($reviewConsolePromptCompletionSnapshot.fetch_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.file_write_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.failure_samples_write_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.173 prompt completion snapshot must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsolePromptCompletionSnapshot.provider_contact_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.plugin_call_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.api_call_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.mcp_runtime_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.real_manifest_read_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsolePromptCompletionSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.173 prompt completion snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsolePromptCompletionSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsolePromptCompletionSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.173 prompt completion snapshot must not claim VCP runtime integration"
    }
  }

  $reviewConsoleArtifactDetailDrawerOutput = & node (Join-Path $Root 'scripts/validate_v14_174_review_console_local_artifact_detail_drawer.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console local artifact detail drawer validation exited with failure"
  } else {
    $reviewConsoleArtifactDetailDrawer = ($reviewConsoleArtifactDetailDrawerOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleArtifactDetailDrawer.passed -ne $true) {
      Add-Failure "Review Console local artifact detail drawer validation must pass"
    }
    if ($reviewConsoleArtifactDetailDrawer.expected_selectable_count -ne 3 -or $reviewConsoleArtifactDetailDrawer.static_detail_only -ne $true) {
      Add-Failure "v14.174 artifact detail drawer must be static-only and expose three selectable lifecycle records"
    }
    if ($reviewConsoleArtifactDetailDrawer.negative_case_missing_artifact_ref_fails -ne $true -or $reviewConsoleArtifactDetailDrawer.negative_case_missing_hash_fails -ne $true -or $reviewConsoleArtifactDetailDrawer.negative_case_unknown_selected_artifact_falls_back_to_first -ne $true -or $reviewConsoleArtifactDetailDrawer.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleArtifactDetailDrawer.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.174 must fail artifact detail drawer negative cases"
    }
    if ($reviewConsoleArtifactDetailDrawer.fetch_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.file_write_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.accepted_samples_write_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.failure_samples_write_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.174 artifact detail drawer must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleArtifactDetailDrawer.provider_contact_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.plugin_call_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.api_call_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.mcp_runtime_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.real_manifest_read_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.real_vcpchat_read_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleArtifactDetailDrawer.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.174 artifact detail drawer must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleArtifactDetailDrawer.vcp_runtime_integration_proven -ne $false -or $reviewConsoleArtifactDetailDrawer.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.174 artifact detail drawer must not claim VCP runtime integration"
    }
  }

  $reviewConsoleArtifactDetailDrawerSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_175_review_console_artifact_detail_drawer_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact detail drawer snapshot validation exited with failure"
  } else {
    $reviewConsoleArtifactDetailDrawerSnapshot = ($reviewConsoleArtifactDetailDrawerSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleArtifactDetailDrawerSnapshot.passed -ne $true) {
      Add-Failure "Review Console artifact detail drawer snapshot validation must pass"
    }
    if ($reviewConsoleArtifactDetailDrawerSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleArtifactDetailDrawerSnapshot.draft_output_key -ne 'artifact_detail_drawer_state') {
      Add-Failure "v14.175 must validate the artifact_detail_drawer_state golden snapshot"
    }
    if ($reviewConsoleArtifactDetailDrawerSnapshot.selected_artifact_id -ne 'accepted_womens_resort_relaxed_knit_codex_v2_001' -or $reviewConsoleArtifactDetailDrawerSnapshot.detail_field_count -ne 10 -or $reviewConsoleArtifactDetailDrawerSnapshot.expected_selectable_count -ne 3 -or $reviewConsoleArtifactDetailDrawerSnapshot.lamp_blocker -ne 'human_approval_missing' -or $reviewConsoleArtifactDetailDrawerSnapshot.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.175 detail drawer snapshot must preserve selected artifact details and lamp blocker"
    }
    if ($reviewConsoleArtifactDetailDrawerSnapshot.negative_case_selected_hash_mismatch_fails -ne $true -or $reviewConsoleArtifactDetailDrawerSnapshot.negative_case_detail_field_count_mismatch_fails -ne $true -or $reviewConsoleArtifactDetailDrawerSnapshot.negative_case_lamp_blocker_missing_fails -ne $true -or $reviewConsoleArtifactDetailDrawerSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleArtifactDetailDrawerSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.175 must fail artifact detail drawer snapshot negative cases"
    }
    if ($reviewConsoleArtifactDetailDrawerSnapshot.fetch_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.file_write_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.failure_samples_write_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.175 artifact detail drawer snapshot must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleArtifactDetailDrawerSnapshot.provider_contact_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.plugin_call_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.api_call_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.mcp_runtime_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.175 artifact detail drawer snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleArtifactDetailDrawerSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsoleArtifactDetailDrawerSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.175 artifact detail drawer snapshot must not claim VCP runtime integration"
    }
  }

  $reviewConsoleArtifactEvidenceCompareOutput = & node (Join-Path $Root 'scripts/validate_v14_176_review_console_artifact_evidence_side_by_side_compare.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact evidence side-by-side compare validation exited with failure"
  } else {
    $reviewConsoleArtifactEvidenceCompare = ($reviewConsoleArtifactEvidenceCompareOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleArtifactEvidenceCompare.passed -ne $true) {
      Add-Failure "Review Console artifact evidence side-by-side compare validation must pass"
    }
    if ($reviewConsoleArtifactEvidenceCompare.primary_artifact_id -ne 'accepted_womens_resort_relaxed_knit_codex_v2_001' -or $reviewConsoleArtifactEvidenceCompare.comparison_artifact_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleArtifactEvidenceCompare.compared_field_count -ne 10) {
      Add-Failure "v14.176 artifact evidence compare must preserve the selected accepted sample and blocked lamp candidate pair"
    }
    if ($reviewConsoleArtifactEvidenceCompare.primary_recoverable -ne $true -or $reviewConsoleArtifactEvidenceCompare.comparison_blocked -ne $true -or $reviewConsoleArtifactEvidenceCompare.lamp_blocker -ne 'human_approval_missing' -or $reviewConsoleArtifactEvidenceCompare.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.176 artifact evidence compare must preserve recoverable-vs-blocked state and avoid three-sample overclaim"
    }
    if ($reviewConsoleArtifactEvidenceCompare.negative_case_missing_comparison_blocker_fails -ne $true -or $reviewConsoleArtifactEvidenceCompare.negative_case_primary_not_recoverable_fails -ne $true -or $reviewConsoleArtifactEvidenceCompare.negative_case_compare_field_count_mismatch_fails -ne $true -or $reviewConsoleArtifactEvidenceCompare.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleArtifactEvidenceCompare.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.176 must fail artifact evidence compare negative cases"
    }
    if ($reviewConsoleArtifactEvidenceCompare.fetch_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.file_write_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.accepted_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.failure_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.176 artifact evidence compare must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleArtifactEvidenceCompare.provider_contact_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.plugin_call_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.api_call_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.mcp_runtime_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.real_manifest_read_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.real_vcpchat_read_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleArtifactEvidenceCompare.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.176 artifact evidence compare must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleArtifactEvidenceCompare.vcp_runtime_integration_proven -ne $false -or $reviewConsoleArtifactEvidenceCompare.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.176 artifact evidence compare must not claim VCP runtime integration"
    }
  }

  $reviewConsoleCompareSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_177_review_console_compare_state_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console compare state snapshot validation exited with failure"
  } else {
    $reviewConsoleCompareSnapshot = ($reviewConsoleCompareSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleCompareSnapshot.passed -ne $true) {
      Add-Failure "Review Console compare state snapshot validation must pass"
    }
    if ($reviewConsoleCompareSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleCompareSnapshot.draft_output_key -ne 'artifact_evidence_compare_state') {
      Add-Failure "v14.177 must validate the artifact_evidence_compare_state golden snapshot"
    }
    if ($reviewConsoleCompareSnapshot.primary_artifact_id -ne 'accepted_womens_resort_relaxed_knit_codex_v2_001' -or $reviewConsoleCompareSnapshot.comparison_artifact_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleCompareSnapshot.compare_pair_status -ne 'recoverable_vs_blocked_registration' -or $reviewConsoleCompareSnapshot.compared_field_count -ne 10) {
      Add-Failure "v14.177 compare snapshot must preserve the recoverable-vs-blocked artifact pair and field count"
    }
    if ($reviewConsoleCompareSnapshot.primary_recoverable -ne $true -or $reviewConsoleCompareSnapshot.comparison_blocked -ne $true -or $reviewConsoleCompareSnapshot.lamp_blocker -ne 'human_approval_missing' -or $reviewConsoleCompareSnapshot.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.177 compare snapshot must preserve blocker state and avoid three-sample overclaim"
    }
    if ($reviewConsoleCompareSnapshot.negative_case_comparison_id_mismatch_fails -ne $true -or $reviewConsoleCompareSnapshot.negative_case_compare_field_count_mismatch_fails -ne $true -or $reviewConsoleCompareSnapshot.negative_case_three_sample_overclaim_fails -ne $true -or $reviewConsoleCompareSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleCompareSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.177 must fail compare state snapshot negative cases"
    }
    if ($reviewConsoleCompareSnapshot.fetch_performed -ne $false -or $reviewConsoleCompareSnapshot.file_write_performed -ne $false -or $reviewConsoleCompareSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsoleCompareSnapshot.failure_samples_write_performed -ne $false -or $reviewConsoleCompareSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.177 compare snapshot must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleCompareSnapshot.provider_contact_performed -ne $false -or $reviewConsoleCompareSnapshot.plugin_call_performed -ne $false -or $reviewConsoleCompareSnapshot.api_call_performed -ne $false -or $reviewConsoleCompareSnapshot.mcp_runtime_performed -ne $false -or $reviewConsoleCompareSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleCompareSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleCompareSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleCompareSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.177 compare snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleCompareSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsoleCompareSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.177 compare snapshot must not claim VCP runtime integration"
    }
  }

  $reviewConsoleCompareFilterLockOutput = & node (Join-Path $Root 'scripts/validate_v14_178_review_console_artifact_evidence_compare_filter_lock.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact evidence compare filter lock validation exited with failure"
  } else {
    $reviewConsoleCompareFilterLock = ($reviewConsoleCompareFilterLockOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleCompareFilterLock.passed -ne $true) {
      Add-Failure "Review Console artifact evidence compare filter lock validation must pass"
    }
    if ($reviewConsoleCompareFilterLock.draft_output_key -ne 'artifact_evidence_compare_state' -or $reviewConsoleCompareFilterLock.static_filter_lock_only -ne $true) {
      Add-Failure "v14.178 must validate a static artifact_evidence_compare_state filter lock"
    }
    if ($reviewConsoleCompareFilterLock.primary_artifact_id -ne 'accepted_womens_resort_relaxed_knit_codex_v2_001' -or $reviewConsoleCompareFilterLock.comparison_artifact_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001') {
      Add-Failure "v14.178 compare filter lock must preserve the recoverable-vs-blocked artifact pair"
    }
    if ($reviewConsoleCompareFilterLock.locked_to_blocked_candidate -ne $true -or $reviewConsoleCompareFilterLock.locked_blocker -ne 'human_approval_missing' -or $reviewConsoleCompareFilterLock.ignores_lifecycle_filter -ne $true -or $reviewConsoleCompareFilterLock.comparison_source -ne 'blocked_registration_candidate') {
      Add-Failure "v14.178 compare filter lock must stay locked to the blocked lamp candidate and ignore local lifecycle filters"
    }
    if ($reviewConsoleCompareFilterLock.locked_comparison_artifact_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleCompareFilterLock.comparison_blocked -ne $true -or $reviewConsoleCompareFilterLock.lamp_blocker -ne 'human_approval_missing' -or $reviewConsoleCompareFilterLock.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.178 compare filter lock must preserve blocker state and avoid three-sample overclaim"
    }
    if ($reviewConsoleCompareFilterLock.negative_case_locked_to_blocked_candidate_false_fails -ne $true -or $reviewConsoleCompareFilterLock.negative_case_locked_blocker_mismatch_fails -ne $true -or $reviewConsoleCompareFilterLock.negative_case_filter_lock_missing_fails -ne $true -or $reviewConsoleCompareFilterLock.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleCompareFilterLock.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.178 must fail compare filter lock negative cases"
    }
    if ($reviewConsoleCompareFilterLock.fetch_performed -ne $false -or $reviewConsoleCompareFilterLock.file_write_performed -ne $false -or $reviewConsoleCompareFilterLock.accepted_samples_write_performed -ne $false -or $reviewConsoleCompareFilterLock.failure_samples_write_performed -ne $false -or $reviewConsoleCompareFilterLock.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.178 compare filter lock must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleCompareFilterLock.provider_contact_performed -ne $false -or $reviewConsoleCompareFilterLock.plugin_call_performed -ne $false -or $reviewConsoleCompareFilterLock.api_call_performed -ne $false -or $reviewConsoleCompareFilterLock.mcp_runtime_performed -ne $false -or $reviewConsoleCompareFilterLock.real_manifest_read_performed -ne $false -or $reviewConsoleCompareFilterLock.real_vcpchat_read_performed -ne $false -or $reviewConsoleCompareFilterLock.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleCompareFilterLock.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.178 compare filter lock must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleCompareFilterLock.vcp_runtime_integration_proven -ne $false -or $reviewConsoleCompareFilterLock.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.178 compare filter lock must not claim VCP runtime integration"
    }
  }

  $reviewConsoleCompareFilterLockSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_179_review_console_compare_filter_lock_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console compare filter lock snapshot validation exited with failure"
  } else {
    $reviewConsoleCompareFilterLockSnapshot = ($reviewConsoleCompareFilterLockSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleCompareFilterLockSnapshot.passed -ne $true) {
      Add-Failure "Review Console compare filter lock snapshot validation must pass"
    }
    if ($reviewConsoleCompareFilterLockSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleCompareFilterLockSnapshot.draft_output_key -ne 'artifact_evidence_compare_state') {
      Add-Failure "v14.179 must validate the compare filter lock golden snapshot"
    }
    if ($reviewConsoleCompareFilterLockSnapshot.primary_artifact_id -ne 'accepted_womens_resort_relaxed_knit_codex_v2_001' -or $reviewConsoleCompareFilterLockSnapshot.comparison_artifact_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001') {
      Add-Failure "v14.179 compare filter lock snapshot must preserve the recoverable-vs-blocked artifact pair"
    }
    if ($reviewConsoleCompareFilterLockSnapshot.locked_to_blocked_candidate -ne $true -or $reviewConsoleCompareFilterLockSnapshot.locked_blocker -ne 'human_approval_missing' -or $reviewConsoleCompareFilterLockSnapshot.ignores_lifecycle_filter -ne $true -or $reviewConsoleCompareFilterLockSnapshot.locked_comparison_artifact_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001') {
      Add-Failure "v14.179 compare filter lock snapshot must preserve the locked blocked lamp candidate"
    }
    if ($reviewConsoleCompareFilterLockSnapshot.comparison_blocked -ne $true -or $reviewConsoleCompareFilterLockSnapshot.lamp_blocker -ne 'human_approval_missing' -or $reviewConsoleCompareFilterLockSnapshot.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.179 compare filter lock snapshot must preserve blocker state and avoid three-sample overclaim"
    }
    if ($reviewConsoleCompareFilterLockSnapshot.negative_case_locked_comparison_artifact_id_mismatch_fails -ne $true -or $reviewConsoleCompareFilterLockSnapshot.negative_case_locked_blocker_mismatch_fails -ne $true -or $reviewConsoleCompareFilterLockSnapshot.negative_case_filter_lock_overclaim_fails -ne $true -or $reviewConsoleCompareFilterLockSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleCompareFilterLockSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.179 must fail compare filter lock snapshot negative cases"
    }
    if ($reviewConsoleCompareFilterLockSnapshot.fetch_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.file_write_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.failure_samples_write_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.179 compare filter lock snapshot must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleCompareFilterLockSnapshot.provider_contact_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.plugin_call_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.api_call_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.mcp_runtime_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleCompareFilterLockSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.179 compare filter lock snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleCompareFilterLockSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsoleCompareFilterLockSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.179 compare filter lock snapshot must not claim VCP runtime integration"
    }
  }

  $reviewConsoleArtifactEvidenceStatusSortOutput = & node (Join-Path $Root 'scripts/validate_v14_180_review_console_artifact_evidence_status_sort.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact evidence status sort validation exited with failure"
  } else {
    $reviewConsoleArtifactEvidenceStatusSort = ($reviewConsoleArtifactEvidenceStatusSortOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleArtifactEvidenceStatusSort.passed -ne $true) {
      Add-Failure "Review Console artifact evidence status sort validation must pass"
    }
    if ($reviewConsoleArtifactEvidenceStatusSort.draft_output_key -ne 'artifact_evidence_status_sort_state' -or $reviewConsoleArtifactEvidenceStatusSort.sort_mode -ne 'blocked_candidates_first') {
      Add-Failure "v14.180 must validate artifact evidence blocked-candidates-first status sort"
    }
    if ($reviewConsoleArtifactEvidenceStatusSort.blocked_candidate_first -ne $true -or $reviewConsoleArtifactEvidenceStatusSort.blocked_candidate_artifact_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleArtifactEvidenceStatusSort.blocked_candidate_blocker -ne 'human_approval_missing') {
      Add-Failure "v14.180 status sort must keep the blocked lamp candidate first"
    }
    if ($reviewConsoleArtifactEvidenceStatusSort.recoverable_count -ne 2 -or $reviewConsoleArtifactEvidenceStatusSort.blocked_count -ne 1 -or $reviewConsoleArtifactEvidenceStatusSort.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.180 status sort must preserve two recoverable samples, one blocked candidate, and no three-sample overclaim"
    }
    if ($reviewConsoleArtifactEvidenceStatusSort.negative_case_blocked_candidate_not_first_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSort.negative_case_missing_lamp_blocker_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSort.negative_case_three_sample_overclaim_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSort.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSort.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.180 must fail artifact evidence status sort negative cases"
    }
    if ($reviewConsoleArtifactEvidenceStatusSort.fetch_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.file_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.accepted_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.failure_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.180 status sort must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleArtifactEvidenceStatusSort.provider_contact_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.plugin_call_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.api_call_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.mcp_runtime_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.real_manifest_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.real_vcpchat_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.180 status sort must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleArtifactEvidenceStatusSort.vcp_runtime_integration_proven -ne $false -or $reviewConsoleArtifactEvidenceStatusSort.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.180 status sort must not claim VCP runtime integration"
    }
  }

  $reviewConsoleArtifactEvidenceStatusSortSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_181_review_console_artifact_evidence_status_sort_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact evidence status sort snapshot validation exited with failure"
  } else {
    $reviewConsoleArtifactEvidenceStatusSortSnapshot = ($reviewConsoleArtifactEvidenceStatusSortSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleArtifactEvidenceStatusSortSnapshot.passed -ne $true) {
      Add-Failure "Review Console artifact evidence status sort snapshot validation must pass"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.draft_output_key -ne 'artifact_evidence_status_sort_state') {
      Add-Failure "v14.181 must validate the artifact evidence status sort golden snapshot"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortSnapshot.sort_mode -ne 'blocked_candidates_first' -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.blocked_candidate_first -ne $true) {
      Add-Failure "v14.181 status sort snapshot must preserve blocked-candidates-first order"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortSnapshot.blocked_candidate_artifact_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.blocked_candidate_blocker -ne 'human_approval_missing') {
      Add-Failure "v14.181 status sort snapshot must preserve the blocked lamp candidate"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortSnapshot.recoverable_count -ne 2 -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.blocked_count -ne 1 -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.181 status sort snapshot must preserve two recoverable samples, one blocked candidate, and no three-sample overclaim"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortSnapshot.negative_case_sorted_artifact_order_mismatch_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.negative_case_blocked_candidate_not_first_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.negative_case_three_sample_overclaim_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.181 must fail artifact evidence status sort snapshot negative cases"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortSnapshot.fetch_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.file_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.failure_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.181 status sort snapshot must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortSnapshot.provider_contact_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.plugin_call_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.api_call_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.mcp_runtime_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.181 status sort snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsoleArtifactEvidenceStatusSortSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.181 status sort snapshot must not claim VCP runtime integration"
    }
  }

  $reviewConsoleArtifactEvidenceStatusSortFilterOutput = & node (Join-Path $Root 'scripts/validate_v14_182_review_console_artifact_evidence_status_sort_filter_interaction.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact evidence status sort/filter interaction validation exited with failure"
  } else {
    $reviewConsoleArtifactEvidenceStatusSortFilter = ($reviewConsoleArtifactEvidenceStatusSortFilterOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleArtifactEvidenceStatusSortFilter.passed -ne $true) {
      Add-Failure "Review Console artifact evidence status sort/filter interaction validation must pass"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilter.draft_output_key -ne 'artifact_evidence_status_sort_filter_interaction_state' -or $reviewConsoleArtifactEvidenceStatusSortFilter.source_sort_key -ne 'artifact_evidence_status_sort_state') {
      Add-Failure "v14.182 must validate artifact evidence status sort/filter interaction state"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilter.sort_mode -ne 'blocked_candidates_first' -or $reviewConsoleArtifactEvidenceStatusSortFilter.local_filter_only -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilter.static_interaction_only -ne $true) {
      Add-Failure "v14.182 filter interaction must remain local static blocked-candidates-first UI state"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilter.all_filter_blocked_candidate_first -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilter.recoverable_filter_excludes_blocked_candidate -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilter.blocked_filter_only_blocked_candidate -ne $true) {
      Add-Failure "v14.182 filter interaction must preserve all/recoverable/blocked visibility semantics"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilter.negative_case_all_filter_blocked_candidate_not_first_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilter.negative_case_recoverable_filter_includes_blocked_candidate_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilter.negative_case_blocked_filter_extra_artifact_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilter.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilter.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.182 must fail artifact evidence status sort/filter interaction negative cases"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilter.fetch_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.file_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.accepted_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.failure_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.182 sort/filter interaction must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilter.provider_contact_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.plugin_call_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.api_call_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.mcp_runtime_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.real_manifest_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.real_vcpchat_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.182 sort/filter interaction must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilter.vcp_runtime_integration_proven -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilter.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.182 sort/filter interaction must not claim VCP runtime integration"
    }
  }

  $reviewConsoleArtifactEvidenceStatusSortFilterSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_183_review_console_artifact_evidence_status_sort_filter_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact evidence status sort/filter snapshot validation exited with failure"
  } else {
    $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot = ($reviewConsoleArtifactEvidenceStatusSortFilterSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.passed -ne $true) {
      Add-Failure "Review Console artifact evidence status sort/filter snapshot validation must pass"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.draft_output_key -ne 'artifact_evidence_status_sort_filter_interaction_state') {
      Add-Failure "v14.183 must validate the artifact evidence status sort/filter golden snapshot"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.sort_mode -ne 'blocked_candidates_first' -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.local_filter_only -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.static_snapshot_only -ne $true) {
      Add-Failure "v14.183 filter snapshot must remain local static blocked-candidates-first UI state"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.all_filter_blocked_candidate_first -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.recoverable_filter_excludes_blocked_candidate -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.blocked_filter_only_blocked_candidate -ne $true) {
      Add-Failure "v14.183 filter snapshot must preserve all/recoverable/blocked visibility semantics"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.all_visible_count -ne 3 -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.recoverable_visible_count -ne 2 -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.blocked_visible_count -ne 1 -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.blocked_candidate_artifact_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001') {
      Add-Failure "v14.183 filter snapshot must preserve visible counts and the blocked lamp candidate"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.negative_case_all_filter_blocked_candidate_not_first_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.negative_case_recoverable_filter_includes_blocked_candidate_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.negative_case_blocked_filter_extra_artifact_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.183 must fail artifact evidence status sort/filter snapshot negative cases"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.fetch_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.file_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.failure_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.183 sort/filter snapshot must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.provider_contact_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.plugin_call_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.api_call_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.mcp_runtime_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.183 sort/filter snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsoleArtifactEvidenceStatusSortFilterSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.183 sort/filter snapshot must not claim VCP runtime integration"
    }
  }

  $reviewConsoleArtifactEvidenceReviewNotesOutput = & node (Join-Path $Root 'scripts/validate_v14_184_review_console_artifact_evidence_review_notes_panel.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact evidence review notes panel validation exited with failure"
  } else {
    $reviewConsoleArtifactEvidenceReviewNotes = ($reviewConsoleArtifactEvidenceReviewNotesOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleArtifactEvidenceReviewNotes.passed -ne $true) {
      Add-Failure "Review Console artifact evidence review notes panel validation must pass"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotes.draft_output_key -ne 'artifact_evidence_review_notes_state' -or $reviewConsoleArtifactEvidenceReviewNotes.static_notes_only -ne $true) {
      Add-Failure "v14.184 must validate static artifact evidence review notes state"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotes.note_count -ne 3 -or $reviewConsoleArtifactEvidenceReviewNotes.approved_note_count -ne 2 -or $reviewConsoleArtifactEvidenceReviewNotes.pending_note_count -ne 1 -or $reviewConsoleArtifactEvidenceReviewNotes.blocked_note_count -ne 1) {
      Add-Failure "v14.184 review notes must preserve 2 approved notes, 1 pending note, and 1 blocked note"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotes.lamp_blocker -ne 'human_approval_missing') {
      Add-Failure "v14.184 review notes must preserve the lamp human approval blocker"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotes.negative_case_missing_review_record_ref_fails -ne $true -or $reviewConsoleArtifactEvidenceReviewNotes.negative_case_lamp_blocker_missing_fails -ne $true -or $reviewConsoleArtifactEvidenceReviewNotes.negative_case_approved_note_count_mismatch_fails -ne $true -or $reviewConsoleArtifactEvidenceReviewNotes.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleArtifactEvidenceReviewNotes.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.184 must fail artifact evidence review notes negative cases"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotes.fetch_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.file_write_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.accepted_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.failure_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.184 review notes must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotes.provider_contact_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.plugin_call_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.api_call_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.mcp_runtime_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.real_manifest_read_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.real_vcpchat_read_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.184 review notes must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotes.vcp_runtime_integration_proven -ne $false -or $reviewConsoleArtifactEvidenceReviewNotes.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.184 review notes must not claim VCP runtime integration"
    }
  }

  $reviewConsoleArtifactEvidenceReviewNotesSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_185_review_console_artifact_evidence_review_notes_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console artifact evidence review notes snapshot validation exited with failure"
  } else {
    $reviewConsoleArtifactEvidenceReviewNotesSnapshot = ($reviewConsoleArtifactEvidenceReviewNotesSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleArtifactEvidenceReviewNotesSnapshot.passed -ne $true) {
      Add-Failure "Review Console artifact evidence review notes snapshot validation must pass"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotesSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.draft_output_key -ne 'artifact_evidence_review_notes_state') {
      Add-Failure "v14.185 must validate the artifact evidence review notes golden snapshot"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotesSnapshot.note_count -ne 3 -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.approved_note_count -ne 2 -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.pending_note_count -ne 1 -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.blocked_note_count -ne 1) {
      Add-Failure "v14.185 review notes snapshot must preserve 2 approved notes, 1 pending note, and 1 blocked note"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotesSnapshot.blocked_artifact_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.lamp_blocker -ne 'human_approval_missing' -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.blocked_accepted_samples_metadata_registered -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.blocked_production_candidate_status -ne 'not_created') {
      Add-Failure "v14.185 review notes snapshot must preserve the blocked unregistered lamp candidate"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotesSnapshot.negative_case_approved_artifact_ids_mismatch_fails -ne $true -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.negative_case_blocked_artifact_id_mismatch_fails -ne $true -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.negative_case_lamp_blocker_missing_fails -ne $true -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.185 must fail artifact evidence review notes snapshot negative cases"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotesSnapshot.fetch_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.file_write_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.failure_samples_write_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.185 review notes snapshot must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotesSnapshot.provider_contact_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.plugin_call_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.api_call_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.mcp_runtime_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.185 review notes snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleArtifactEvidenceReviewNotesSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsoleArtifactEvidenceReviewNotesSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.185 review notes snapshot must not claim VCP runtime integration"
    }
  }

  $reviewConsoleThreeSampleGapOutput = & node (Join-Path $Root 'scripts/validate_v14_186_review_console_three_sample_gap_summary_panel.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console three-sample gap summary panel validation exited with failure"
  } else {
    $reviewConsoleThreeSampleGap = ($reviewConsoleThreeSampleGapOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleThreeSampleGap.passed -ne $true) {
      Add-Failure "Review Console three-sample gap summary panel validation must pass"
    }
    if ($reviewConsoleThreeSampleGap.draft_output_key -ne 'three_sample_gap_summary_state' -or $reviewConsoleThreeSampleGap.local_summary_only -ne $true) {
      Add-Failure "v14.186 must validate static three-sample gap summary state"
    }
    if ($reviewConsoleThreeSampleGap.required_full_recoverable_sample_count -ne 3 -or $reviewConsoleThreeSampleGap.recoverable_accepted_sample_count -ne 2 -or $reviewConsoleThreeSampleGap.blocked_registration_candidate_count -ne 1 -or $reviewConsoleThreeSampleGap.remaining_full_recoverable_sample_gap -ne 1) {
      Add-Failure "v14.186 gap summary must preserve required=3, recoverable=2, blocked=1, remaining=1"
    }
    if ($reviewConsoleThreeSampleGap.hard_acceptance_three_full_samples_met -ne $false -or $reviewConsoleThreeSampleGap.pending_candidate_counted_as_accepted -ne $false -or $reviewConsoleThreeSampleGap.gap_status -ne 'blocked_by_human_approval_missing') {
      Add-Failure "v14.186 gap summary must not overclaim three-sample completion"
    }
    if ($reviewConsoleThreeSampleGap.blocker_candidate_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleThreeSampleGap.blocker_reason -ne 'human_approval_missing') {
      Add-Failure "v14.186 gap summary must preserve the blocked lamp candidate"
    }
    if ($reviewConsoleThreeSampleGap.negative_case_gap_zero_overclaim_fails -ne $true -or $reviewConsoleThreeSampleGap.negative_case_pending_counted_as_accepted_fails -ne $true -or $reviewConsoleThreeSampleGap.negative_case_blocker_candidate_missing_fails -ne $true -or $reviewConsoleThreeSampleGap.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleThreeSampleGap.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.186 must fail three-sample gap negative cases"
    }
    if ($reviewConsoleThreeSampleGap.fetch_performed -ne $false -or $reviewConsoleThreeSampleGap.file_write_performed -ne $false -or $reviewConsoleThreeSampleGap.accepted_samples_write_performed -ne $false -or $reviewConsoleThreeSampleGap.failure_samples_write_performed -ne $false -or $reviewConsoleThreeSampleGap.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.186 gap summary must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleThreeSampleGap.provider_contact_performed -ne $false -or $reviewConsoleThreeSampleGap.plugin_call_performed -ne $false -or $reviewConsoleThreeSampleGap.api_call_performed -ne $false -or $reviewConsoleThreeSampleGap.mcp_runtime_performed -ne $false -or $reviewConsoleThreeSampleGap.real_manifest_read_performed -ne $false -or $reviewConsoleThreeSampleGap.real_vcpchat_read_performed -ne $false -or $reviewConsoleThreeSampleGap.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleThreeSampleGap.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.186 gap summary must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleThreeSampleGap.vcp_runtime_integration_proven -ne $false -or $reviewConsoleThreeSampleGap.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.186 gap summary must not claim VCP runtime integration"
    }
  }

  $reviewConsoleThreeSampleGapSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_187_review_console_three_sample_gap_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console three-sample gap snapshot validation exited with failure"
  } else {
    $reviewConsoleThreeSampleGapSnapshot = ($reviewConsoleThreeSampleGapSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleThreeSampleGapSnapshot.passed -ne $true) {
      Add-Failure "Review Console three-sample gap snapshot validation must pass"
    }
    if ($reviewConsoleThreeSampleGapSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleThreeSampleGapSnapshot.draft_output_key -ne 'three_sample_gap_summary_state' -or $reviewConsoleThreeSampleGapSnapshot.static_snapshot_only -ne $true) {
      Add-Failure "v14.187 must validate static three-sample gap golden snapshot state"
    }
    if ($reviewConsoleThreeSampleGapSnapshot.required_full_recoverable_sample_count -ne 3 -or $reviewConsoleThreeSampleGapSnapshot.recoverable_accepted_sample_count -ne 2 -or $reviewConsoleThreeSampleGapSnapshot.blocked_registration_candidate_count -ne 1 -or $reviewConsoleThreeSampleGapSnapshot.remaining_full_recoverable_sample_gap -ne 1) {
      Add-Failure "v14.187 gap snapshot must preserve required=3, recoverable=2, blocked=1, remaining=1"
    }
    if ($reviewConsoleThreeSampleGapSnapshot.hard_acceptance_three_full_samples_met -ne $false -or $reviewConsoleThreeSampleGapSnapshot.pending_candidate_counted_as_accepted -ne $false -or $reviewConsoleThreeSampleGapSnapshot.gap_status -ne 'blocked_by_human_approval_missing') {
      Add-Failure "v14.187 gap snapshot must not overclaim three-sample completion"
    }
    if ($reviewConsoleThreeSampleGapSnapshot.blocker_candidate_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleThreeSampleGapSnapshot.blocker_reason -ne 'human_approval_missing' -or $reviewConsoleThreeSampleGapSnapshot.blocker_accepted_samples_metadata_registered -ne $false -or $reviewConsoleThreeSampleGapSnapshot.blocker_production_candidate_status -ne 'not_created') {
      Add-Failure "v14.187 gap snapshot must preserve the blocked unregistered lamp candidate"
    }
    if ($reviewConsoleThreeSampleGapSnapshot.negative_case_gap_zero_overclaim_fails -ne $true -or $reviewConsoleThreeSampleGapSnapshot.negative_case_pending_counted_as_accepted_fails -ne $true -or $reviewConsoleThreeSampleGapSnapshot.negative_case_blocker_candidate_mismatch_fails -ne $true -or $reviewConsoleThreeSampleGapSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleThreeSampleGapSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.187 must fail three-sample gap snapshot negative cases"
    }
    if ($reviewConsoleThreeSampleGapSnapshot.fetch_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.file_write_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.failure_samples_write_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.187 gap snapshot must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleThreeSampleGapSnapshot.provider_contact_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.plugin_call_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.api_call_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.mcp_runtime_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleThreeSampleGapSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.187 gap snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleThreeSampleGapSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsoleThreeSampleGapSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.187 gap snapshot must not claim VCP runtime integration"
    }
  }

  $reviewConsoleThirdSampleReadinessOutput = & node (Join-Path $Root 'scripts/validate_v14_188_review_console_third_sample_acceptance_readiness.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console third-sample acceptance readiness validation exited with failure"
  } else {
    $reviewConsoleThirdSampleReadiness = ($reviewConsoleThirdSampleReadinessOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleThirdSampleReadiness.passed -ne $true) {
      Add-Failure "Review Console third-sample acceptance readiness validation must pass"
    }
    if ($reviewConsoleThirdSampleReadiness.draft_output_key -ne 'third_sample_acceptance_readiness_state' -or $reviewConsoleThirdSampleReadiness.local_readiness_only -ne $true) {
      Add-Failure "v14.188 must validate static third-sample acceptance readiness state"
    }
    if ($reviewConsoleThirdSampleReadiness.target_sample_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleThirdSampleReadiness.target_candidate_id -ne 'v14_166_lamp_v3_generated_candidate_001') {
      Add-Failure "v14.188 readiness must target the blocked lamp candidate"
    }
    if ($reviewConsoleThirdSampleReadiness.readiness_status -ne 'blocked_missing_human_approval' -or $reviewConsoleThirdSampleReadiness.required_approval_by -ne 'Jenn' -or $reviewConsoleThirdSampleReadiness.human_approval_status -ne 'pending' -or $null -ne $reviewConsoleThirdSampleReadiness.approved_by) {
      Add-Failure "v14.188 readiness must preserve missing Jenn human approval"
    }
    if ($reviewConsoleThirdSampleReadiness.registration_ready -ne $false -or $reviewConsoleThirdSampleReadiness.accepted_samples_registration_eligible -ne $false -or $reviewConsoleThirdSampleReadiness.accepted_samples_metadata_registered -ne $false) {
      Add-Failure "v14.188 readiness must not mark the third sample as registration ready"
    }
    if ($reviewConsoleThirdSampleReadiness.accepted_samples_write_allowed -ne $false -or $reviewConsoleThirdSampleReadiness.production_candidate_write_allowed -ne $false -or $reviewConsoleThirdSampleReadiness.failure_samples_write_allowed -ne $false) {
      Add-Failure "v14.188 readiness must not allow accepted_samples, production_candidate, or failure_samples writes"
    }
    if ($reviewConsoleThirdSampleReadiness.present_evidence_count -ne 9 -or $reviewConsoleThirdSampleReadiness.missing_requirement_count -ne 2 -or $reviewConsoleThirdSampleReadiness.next_allowed_local_action -ne 'wait_for_jenn_human_approval') {
      Add-Failure "v14.188 readiness must preserve evidence count, missing requirements, and next local action"
    }
    if ($reviewConsoleThirdSampleReadiness.negative_case_approval_overclaim_fails -ne $true -or $reviewConsoleThirdSampleReadiness.negative_case_missing_requirements_empty_fails -ne $true -or $reviewConsoleThirdSampleReadiness.negative_case_target_candidate_mismatch_fails -ne $true -or $reviewConsoleThirdSampleReadiness.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleThirdSampleReadiness.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.188 must fail third-sample acceptance readiness negative cases"
    }
    if ($reviewConsoleThirdSampleReadiness.fetch_performed -ne $false -or $reviewConsoleThirdSampleReadiness.file_write_performed -ne $false -or $reviewConsoleThirdSampleReadiness.accepted_samples_write_performed -ne $false -or $reviewConsoleThirdSampleReadiness.failure_samples_write_performed -ne $false -or $reviewConsoleThirdSampleReadiness.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.188 readiness must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleThirdSampleReadiness.provider_contact_performed -ne $false -or $reviewConsoleThirdSampleReadiness.plugin_call_performed -ne $false -or $reviewConsoleThirdSampleReadiness.api_call_performed -ne $false -or $reviewConsoleThirdSampleReadiness.mcp_runtime_performed -ne $false -or $reviewConsoleThirdSampleReadiness.real_manifest_read_performed -ne $false -or $reviewConsoleThirdSampleReadiness.real_vcpchat_read_performed -ne $false -or $reviewConsoleThirdSampleReadiness.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleThirdSampleReadiness.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.188 readiness must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleThirdSampleReadiness.vcp_runtime_integration_proven -ne $false -or $reviewConsoleThirdSampleReadiness.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.188 readiness must not claim VCP runtime integration"
    }
  }

  $reviewConsoleThirdSampleReadinessSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_189_review_console_third_sample_acceptance_readiness_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console third-sample acceptance readiness snapshot validation exited with failure"
  } else {
    $reviewConsoleThirdSampleReadinessSnapshot = ($reviewConsoleThirdSampleReadinessSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleThirdSampleReadinessSnapshot.passed -ne $true) {
      Add-Failure "Review Console third-sample acceptance readiness snapshot validation must pass"
    }
    if ($reviewConsoleThirdSampleReadinessSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleThirdSampleReadinessSnapshot.draft_output_key -ne 'third_sample_acceptance_readiness_state' -or $reviewConsoleThirdSampleReadinessSnapshot.static_snapshot_only -ne $true) {
      Add-Failure "v14.189 must validate static third-sample readiness golden snapshot state"
    }
    if ($reviewConsoleThirdSampleReadinessSnapshot.target_sample_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleThirdSampleReadinessSnapshot.target_candidate_id -ne 'v14_166_lamp_v3_generated_candidate_001') {
      Add-Failure "v14.189 readiness snapshot must target the blocked lamp candidate"
    }
    if ($reviewConsoleThirdSampleReadinessSnapshot.readiness_status -ne 'blocked_missing_human_approval' -or $reviewConsoleThirdSampleReadinessSnapshot.required_approval_by -ne 'Jenn' -or $reviewConsoleThirdSampleReadinessSnapshot.human_approval_status -ne 'pending' -or $null -ne $reviewConsoleThirdSampleReadinessSnapshot.approved_by) {
      Add-Failure "v14.189 readiness snapshot must preserve missing Jenn human approval"
    }
    if ($reviewConsoleThirdSampleReadinessSnapshot.registration_ready -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.accepted_samples_registration_eligible -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.accepted_samples_metadata_registered -ne $false) {
      Add-Failure "v14.189 readiness snapshot must not mark the third sample as registration ready"
    }
    if ($reviewConsoleThirdSampleReadinessSnapshot.accepted_samples_write_allowed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.production_candidate_write_allowed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.failure_samples_write_allowed -ne $false) {
      Add-Failure "v14.189 readiness snapshot must not allow accepted_samples, production_candidate, or failure_samples writes"
    }
    if ($reviewConsoleThirdSampleReadinessSnapshot.present_evidence_count -ne 9 -or $reviewConsoleThirdSampleReadinessSnapshot.missing_requirement_count -ne 2 -or $reviewConsoleThirdSampleReadinessSnapshot.next_allowed_local_action -ne 'wait_for_jenn_human_approval') {
      Add-Failure "v14.189 readiness snapshot must preserve evidence count, missing requirements, and next local action"
    }
    if ($reviewConsoleThirdSampleReadinessSnapshot.negative_case_approval_overclaim_fails -ne $true -or $reviewConsoleThirdSampleReadinessSnapshot.negative_case_registration_ready_overclaim_fails -ne $true -or $reviewConsoleThirdSampleReadinessSnapshot.negative_case_target_candidate_mismatch_fails -ne $true -or $reviewConsoleThirdSampleReadinessSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleThirdSampleReadinessSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.189 must fail third-sample readiness snapshot negative cases"
    }
    if ($reviewConsoleThirdSampleReadinessSnapshot.fetch_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.file_write_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.failure_samples_write_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.189 readiness snapshot must not fetch, write files, accepted_samples, failure_samples, or production_candidate"
    }
    if ($reviewConsoleThirdSampleReadinessSnapshot.provider_contact_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.plugin_call_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.api_call_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.mcp_runtime_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.189 readiness snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleThirdSampleReadinessSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsoleThirdSampleReadinessSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.189 readiness snapshot must not claim VCP runtime integration"
    }
  }

  $thirdSampleAcceptedSamplesAuthorizationDraftOutput = & node (Join-Path $Root 'scripts/validate_v14_190_third_sample_accepted_samples_registration_authorization_package_draft.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Third-sample accepted_samples registration authorization package draft validation exited with failure"
  } else {
    $thirdSampleAcceptedSamplesAuthorizationDraft = ($thirdSampleAcceptedSamplesAuthorizationDraftOutput -join "`n") | ConvertFrom-Json
    if ($thirdSampleAcceptedSamplesAuthorizationDraft.passed -ne $true) {
      Add-Failure "Third-sample accepted_samples registration authorization package draft validation must pass"
    }
    if ($thirdSampleAcceptedSamplesAuthorizationDraft.authorization_package_status -ne 'prepared_blocked_not_granted' -or $thirdSampleAcceptedSamplesAuthorizationDraft.authorization_granted_by_this_record -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.execution_ready -ne $false) {
      Add-Failure "v14.190 authorization package must remain prepared, blocked, and not granted"
    }
    if ($thirdSampleAcceptedSamplesAuthorizationDraft.blocker -ne 'human_approval_missing' -or $thirdSampleAcceptedSamplesAuthorizationDraft.human_approval_status -ne 'pending' -or $null -ne $thirdSampleAcceptedSamplesAuthorizationDraft.approved_by -or $thirdSampleAcceptedSamplesAuthorizationDraft.registration_ready -ne $false) {
      Add-Failure "v14.190 authorization package must preserve missing Jenn approval"
    }
    if ($thirdSampleAcceptedSamplesAuthorizationDraft.target_sample_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $thirdSampleAcceptedSamplesAuthorizationDraft.target_candidate_id -ne 'v14_166_lamp_v3_generated_candidate_001') {
      Add-Failure "v14.190 authorization package must target the blocked lamp candidate"
    }
    if ($thirdSampleAcceptedSamplesAuthorizationDraft.allowed_file_count -ne 2 -or $thirdSampleAcceptedSamplesAuthorizationDraft.validation_command_count -lt 5 -or $thirdSampleAcceptedSamplesAuthorizationDraft.draft_only -ne $true) {
      Add-Failure "v14.190 authorization package must keep exact write scope, validation, and draft-only status"
    }
    if ($thirdSampleAcceptedSamplesAuthorizationDraft.accepted_samples_write_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.category_index_write_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.image_file_copy_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.failure_samples_write_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.190 authorization package draft must not perform accepted_samples, category, image copy, failure, or production writes"
    }
    if ($thirdSampleAcceptedSamplesAuthorizationDraft.provider_contact_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.plugin_call_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.api_call_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.mcp_runtime_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.real_manifest_read_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.real_vcpchat_read_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.real_vcptoolbox_read_performed -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.190 authorization package draft must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($thirdSampleAcceptedSamplesAuthorizationDraft.vcp_runtime_integration_proven -ne $false -or $thirdSampleAcceptedSamplesAuthorizationDraft.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.190 authorization package draft must not claim VCP runtime integration"
    }
    if ($thirdSampleAcceptedSamplesAuthorizationDraft.negative_case_granted_package_fails -ne $true -or $thirdSampleAcceptedSamplesAuthorizationDraft.negative_case_execution_ready_without_approval_fails -ne $true -or $thirdSampleAcceptedSamplesAuthorizationDraft.negative_case_missing_exact_statement_fails -ne $true -or $thirdSampleAcceptedSamplesAuthorizationDraft.negative_case_broad_write_scope_fails -ne $true -or $thirdSampleAcceptedSamplesAuthorizationDraft.negative_case_accepted_samples_write_flag_fails -ne $true -or $thirdSampleAcceptedSamplesAuthorizationDraft.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.190 authorization package draft must fail authorization, scope, write, and runtime negative cases"
    }
  }

  $reviewConsoleAuthorizationPackagePanelOutput = & node (Join-Path $Root 'scripts/validate_v14_191_review_console_accepted_samples_authorization_package_panel.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console accepted_samples authorization package panel validation exited with failure"
  } else {
    $reviewConsoleAuthorizationPackagePanel = ($reviewConsoleAuthorizationPackagePanelOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleAuthorizationPackagePanel.passed -ne $true) {
      Add-Failure "Review Console accepted_samples authorization package panel validation must pass"
    }
    if ($reviewConsoleAuthorizationPackagePanel.draft_output_key -ne 'third_sample_accepted_samples_authorization_package_state') {
      Add-Failure "v14.191 authorization package panel must expose the expected draft output key"
    }
    if ($reviewConsoleAuthorizationPackagePanel.authorization_package_status -ne 'prepared_blocked_not_granted' -or $reviewConsoleAuthorizationPackagePanel.authorization_granted_by_this_record -ne $false -or $reviewConsoleAuthorizationPackagePanel.execution_ready -ne $false) {
      Add-Failure "v14.191 authorization package panel must remain prepared, blocked, not granted, and not execution ready"
    }
    if ($reviewConsoleAuthorizationPackagePanel.blocker -ne 'human_approval_missing' -or $reviewConsoleAuthorizationPackagePanel.human_approval_status -ne 'pending' -or $null -ne $reviewConsoleAuthorizationPackagePanel.approved_by -or $reviewConsoleAuthorizationPackagePanel.registration_ready -ne $false) {
      Add-Failure "v14.191 authorization package panel must preserve missing Jenn approval"
    }
    if ($reviewConsoleAuthorizationPackagePanel.target_sample_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleAuthorizationPackagePanel.target_candidate_id -ne 'v14_166_lamp_v3_generated_candidate_001') {
      Add-Failure "v14.191 authorization package panel must target the blocked lamp candidate"
    }
    if ($reviewConsoleAuthorizationPackagePanel.exact_allowed_file_count -ne 2 -or $reviewConsoleAuthorizationPackagePanel.missing_requirement_count -ne 3 -or $reviewConsoleAuthorizationPackagePanel.exact_approval_statement_draft_present -ne $true -or $reviewConsoleAuthorizationPackagePanel.static_panel_only -ne $true) {
      Add-Failure "v14.191 authorization package panel must keep exact scope, missing requirements, statement visibility, and static-only status"
    }
    if ($reviewConsoleAuthorizationPackagePanel.accepted_samples_write_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.category_index_write_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.image_file_copy_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.failure_samples_write_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.191 authorization package panel must not perform accepted_samples, category, image copy, failure, or production writes"
    }
    if ($reviewConsoleAuthorizationPackagePanel.provider_contact_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.plugin_call_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.api_call_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.mcp_runtime_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.real_manifest_read_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.real_vcpchat_read_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleAuthorizationPackagePanel.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.191 authorization package panel must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleAuthorizationPackagePanel.vcp_runtime_integration_proven -ne $false -or $reviewConsoleAuthorizationPackagePanel.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.191 authorization package panel must not claim VCP runtime integration"
    }
    if ($reviewConsoleAuthorizationPackagePanel.negative_case_authorization_granted_overclaim_fails -ne $true -or $reviewConsoleAuthorizationPackagePanel.negative_case_execution_ready_overclaim_fails -ne $true -or $reviewConsoleAuthorizationPackagePanel.negative_case_missing_statement_fails -ne $true -or $reviewConsoleAuthorizationPackagePanel.negative_case_broad_allowed_files_fails -ne $true -or $reviewConsoleAuthorizationPackagePanel.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleAuthorizationPackagePanel.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.191 authorization package panel must fail authorization, execution, statement, scope, write, and runtime negative cases"
    }
  }

  $reviewConsoleAuthorizationPackageSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_192_review_console_accepted_samples_authorization_package_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console accepted_samples authorization package snapshot validation exited with failure"
  } else {
    $reviewConsoleAuthorizationPackageSnapshot = ($reviewConsoleAuthorizationPackageSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleAuthorizationPackageSnapshot.passed -ne $true) {
      Add-Failure "Review Console accepted_samples authorization package snapshot validation must pass"
    }
    if ($reviewConsoleAuthorizationPackageSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleAuthorizationPackageSnapshot.draft_output_key -ne 'third_sample_accepted_samples_authorization_package_state') {
      Add-Failure "v14.192 authorization package snapshot must preserve the golden snapshot and draft output key"
    }
    if ($reviewConsoleAuthorizationPackageSnapshot.authorization_package_status -ne 'prepared_blocked_not_granted' -or $reviewConsoleAuthorizationPackageSnapshot.authorization_granted_by_this_record -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.execution_ready -ne $false) {
      Add-Failure "v14.192 authorization package snapshot must remain prepared, blocked, not granted, and not execution ready"
    }
    if ($reviewConsoleAuthorizationPackageSnapshot.blocker -ne 'human_approval_missing' -or $reviewConsoleAuthorizationPackageSnapshot.human_approval_status -ne 'pending' -or $null -ne $reviewConsoleAuthorizationPackageSnapshot.approved_by -or $reviewConsoleAuthorizationPackageSnapshot.registration_ready -ne $false) {
      Add-Failure "v14.192 authorization package snapshot must preserve missing Jenn approval"
    }
    if ($reviewConsoleAuthorizationPackageSnapshot.target_sample_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $reviewConsoleAuthorizationPackageSnapshot.target_candidate_id -ne 'v14_166_lamp_v3_generated_candidate_001') {
      Add-Failure "v14.192 authorization package snapshot must target the blocked lamp candidate"
    }
    if ($reviewConsoleAuthorizationPackageSnapshot.exact_allowed_file_count -ne 2 -or $reviewConsoleAuthorizationPackageSnapshot.forbidden_operation_count -ne 10 -or $reviewConsoleAuthorizationPackageSnapshot.missing_requirement_count -ne 3 -or $reviewConsoleAuthorizationPackageSnapshot.exact_approval_statement_draft_present -ne $true -or $reviewConsoleAuthorizationPackageSnapshot.static_panel_only -ne $true -or $reviewConsoleAuthorizationPackageSnapshot.static_snapshot_only -ne $true) {
      Add-Failure "v14.192 authorization package snapshot must freeze exact scope, blocker counts, statement visibility, panel-only, and snapshot-only status"
    }
    if ($reviewConsoleAuthorizationPackageSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.category_index_write_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.image_file_copy_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.failure_samples_write_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.192 authorization package snapshot must not perform accepted_samples, category, image copy, failure, or production writes"
    }
    if ($reviewConsoleAuthorizationPackageSnapshot.provider_contact_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.plugin_call_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.api_call_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.mcp_runtime_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.192 authorization package snapshot must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($reviewConsoleAuthorizationPackageSnapshot.vcp_runtime_integration_proven -ne $false -or $reviewConsoleAuthorizationPackageSnapshot.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.192 authorization package snapshot must not claim VCP runtime integration"
    }
    if ($reviewConsoleAuthorizationPackageSnapshot.negative_case_authorization_granted_overclaim_fails -ne $true -or $reviewConsoleAuthorizationPackageSnapshot.negative_case_execution_ready_overclaim_fails -ne $true -or $reviewConsoleAuthorizationPackageSnapshot.negative_case_missing_statement_fails -ne $true -or $reviewConsoleAuthorizationPackageSnapshot.negative_case_allowed_file_count_drift_fails -ne $true -or $reviewConsoleAuthorizationPackageSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsoleAuthorizationPackageSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.192 authorization package snapshot must fail authorization, execution, statement, scope, write, and runtime negative cases"
    }
  }

  $thirdSampleAcceptedSamplesDryRunPatchOutput = & node (Join-Path $Root 'scripts/validate_v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Third-sample accepted_samples registration dry-run patch preview validation exited with failure"
  } else {
    $thirdSampleAcceptedSamplesDryRunPatch = ($thirdSampleAcceptedSamplesDryRunPatchOutput -join "`n") | ConvertFrom-Json
    if ($thirdSampleAcceptedSamplesDryRunPatch.passed -ne $true) {
      Add-Failure "Third-sample accepted_samples registration dry-run patch preview validation must pass"
    }
    if ($thirdSampleAcceptedSamplesDryRunPatch.dry_run_status -ne 'blocked_pending_human_approval' -or $thirdSampleAcceptedSamplesDryRunPatch.registration_executable_now -ne $false) {
      Add-Failure "v14.193 dry-run patch preview must stay blocked and non-executable"
    }
    if ($thirdSampleAcceptedSamplesDryRunPatch.target_sample_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $thirdSampleAcceptedSamplesDryRunPatch.target_candidate_id -ne 'v14_166_lamp_v3_generated_candidate_001' -or $thirdSampleAcceptedSamplesDryRunPatch.category -ne 'product_still_life') {
      Add-Failure "v14.193 dry-run patch preview must target the lamp candidate and product_still_life category"
    }
    if ($thirdSampleAcceptedSamplesDryRunPatch.human_approval_status -ne 'pending' -or $null -ne $thirdSampleAcceptedSamplesDryRunPatch.approved_by) {
      Add-Failure "v14.193 dry-run patch preview must preserve missing Jenn approval"
    }
    if ($thirdSampleAcceptedSamplesDryRunPatch.proposed_registry_sample_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $thirdSampleAcceptedSamplesDryRunPatch.proposed_category_index_ref -ne 'accepted_samples/categories/product_still_life.yaml' -or $thirdSampleAcceptedSamplesDryRunPatch.sample_count_delta_after_execution -ne 1 -or $thirdSampleAcceptedSamplesDryRunPatch.sample_count_after_execution -ne 2) {
      Add-Failure "v14.193 dry-run patch preview must preserve the exact proposed registry/category patch"
    }
    if ($thirdSampleAcceptedSamplesDryRunPatch.dry_run_only -ne $true -or $thirdSampleAcceptedSamplesDryRunPatch.accepted_samples_write_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.category_index_write_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.image_file_copy_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.runs_source_image_modified -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.failure_samples_write_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.193 dry-run patch preview must not perform registry, category, image, runs, failure, or production writes"
    }
    if ($thirdSampleAcceptedSamplesDryRunPatch.provider_contact_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.plugin_call_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.api_call_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.mcp_runtime_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.real_manifest_read_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.real_vcpchat_read_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.real_vcptoolbox_read_performed -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.193 dry-run patch preview must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($thirdSampleAcceptedSamplesDryRunPatch.vcp_runtime_integration_proven -ne $false -or $thirdSampleAcceptedSamplesDryRunPatch.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.193 dry-run patch preview must not claim VCP runtime integration"
    }
    if ($thirdSampleAcceptedSamplesDryRunPatch.negative_case_human_approval_overclaim_fails -ne $true -or $thirdSampleAcceptedSamplesDryRunPatch.negative_case_hash_mismatch_fails -ne $true -or $thirdSampleAcceptedSamplesDryRunPatch.negative_case_absolute_artifact_locator_fails -ne $true -or $thirdSampleAcceptedSamplesDryRunPatch.negative_case_category_mismatch_fails -ne $true -or $thirdSampleAcceptedSamplesDryRunPatch.negative_case_accepted_samples_write_flag_fails -ne $true -or $thirdSampleAcceptedSamplesDryRunPatch.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.193 dry-run patch preview must fail approval, hash, locator, category, write, and runtime negative cases"
    }
  }

  $thirdSampleAcceptedSamplesExecutionPreflightOutput = & node (Join-Path $Root 'scripts/validate_v14_194_third_sample_accepted_samples_registration_execution_preflight.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Third-sample accepted_samples registration execution preflight validation exited with failure"
  } else {
    $thirdSampleAcceptedSamplesExecutionPreflight = ($thirdSampleAcceptedSamplesExecutionPreflightOutput -join "`n") | ConvertFrom-Json
    if ($thirdSampleAcceptedSamplesExecutionPreflight.passed -ne $true) {
      Add-Failure "Third-sample accepted_samples registration execution preflight validation must pass"
    }
    if ($thirdSampleAcceptedSamplesExecutionPreflight.preflight_status -ne 'blocked' -or $thirdSampleAcceptedSamplesExecutionPreflight.blocker -ne 'missing_human_approval_and_exact_authorization' -or $thirdSampleAcceptedSamplesExecutionPreflight.execution_allowed_now -ne $false) {
      Add-Failure "v14.194 execution preflight must remain blocked and not execution allowed"
    }
    if ($thirdSampleAcceptedSamplesExecutionPreflight.target_sample_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $thirdSampleAcceptedSamplesExecutionPreflight.target_candidate_id -ne 'v14_166_lamp_v3_generated_candidate_001' -or $thirdSampleAcceptedSamplesExecutionPreflight.category -ne 'product_still_life') {
      Add-Failure "v14.194 execution preflight must target the lamp candidate and product_still_life category"
    }
    if ($thirdSampleAcceptedSamplesExecutionPreflight.human_approval_status -ne 'pending' -or $null -ne $thirdSampleAcceptedSamplesExecutionPreflight.approved_by -or $thirdSampleAcceptedSamplesExecutionPreflight.authorization_package_status -ne 'prepared_blocked_not_granted' -or $thirdSampleAcceptedSamplesExecutionPreflight.authorization_granted_by_this_record -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.dry_run_patch_ready -ne $true) {
      Add-Failure "v14.194 execution preflight must preserve missing approval, ungranted authorization, and ready dry-run patch"
    }
    if ($thirdSampleAcceptedSamplesExecutionPreflight.allowed_file_count_after_approval -ne 2 -or $thirdSampleAcceptedSamplesExecutionPreflight.required_before_execution_count -lt 4 -or $thirdSampleAcceptedSamplesExecutionPreflight.validation_required_before_execution_count -lt 5) {
      Add-Failure "v14.194 execution preflight must preserve exact write scope and required validation chain"
    }
    if ($thirdSampleAcceptedSamplesExecutionPreflight.preflight_only -ne $true -or $thirdSampleAcceptedSamplesExecutionPreflight.accepted_samples_write_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.category_index_write_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.image_file_copy_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.runs_source_image_modified -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.failure_samples_write_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.194 execution preflight must not perform registry, category, image, runs, failure, or production writes"
    }
    if ($thirdSampleAcceptedSamplesExecutionPreflight.provider_contact_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.plugin_call_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.api_call_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.mcp_runtime_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.real_manifest_read_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.real_vcpchat_read_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.real_vcptoolbox_read_performed -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.194 execution preflight must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($thirdSampleAcceptedSamplesExecutionPreflight.vcp_runtime_integration_proven -ne $false -or $thirdSampleAcceptedSamplesExecutionPreflight.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.194 execution preflight must not claim VCP runtime integration"
    }
    if ($thirdSampleAcceptedSamplesExecutionPreflight.negative_case_human_approval_overclaim_fails -ne $true -or $thirdSampleAcceptedSamplesExecutionPreflight.negative_case_authorization_granted_overclaim_fails -ne $true -or $thirdSampleAcceptedSamplesExecutionPreflight.negative_case_dry_run_target_mismatch_fails -ne $true -or $thirdSampleAcceptedSamplesExecutionPreflight.negative_case_broad_allowed_files_fails -ne $true -or $thirdSampleAcceptedSamplesExecutionPreflight.negative_case_accepted_samples_write_flag_fails -ne $true -or $thirdSampleAcceptedSamplesExecutionPreflight.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.194 execution preflight must fail approval, authorization, target, scope, write, and runtime negative cases"
    }
  }

  $acceptedSamplesAuthorizationPackageCompilerContractOutput = & node (Join-Path $Root 'scripts/validate_v14_195_authorization_package_compiler_contract_accepted_samples_registration.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "accepted_samples authorization package compiler contract validation exited with failure"
  } else {
    $acceptedSamplesAuthorizationPackageCompilerContract = ($acceptedSamplesAuthorizationPackageCompilerContractOutput -join "`n") | ConvertFrom-Json
    if ($acceptedSamplesAuthorizationPackageCompilerContract.passed -ne $true) {
      Add-Failure "accepted_samples authorization package compiler contract validation must pass"
    }
    if ($acceptedSamplesAuthorizationPackageCompilerContract.compiler_status -ne 'contract_ready_execution_blocked' -or $acceptedSamplesAuthorizationPackageCompilerContract.package_type -ne 'accepted_samples_metadata_registration' -or $acceptedSamplesAuthorizationPackageCompilerContract.compiled_package_status -ne 'blocked_not_granted') {
      Add-Failure "v14.195 compiler contract must remain contract-ready, accepted_samples-scoped, and blocked"
    }
    if ($acceptedSamplesAuthorizationPackageCompilerContract.compiled_package_id -ne 'AUTH-PENDING-LAMP-V14-166-ACCEPTED-SAMPLES-REGISTRATION-20260518-001') {
      Add-Failure "v14.195 compiler contract must preserve the exact pending package id"
    }
    if ($acceptedSamplesAuthorizationPackageCompilerContract.target_sample_id -ne 'accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001' -or $acceptedSamplesAuthorizationPackageCompilerContract.target_candidate_id -ne 'v14_166_lamp_v3_generated_candidate_001' -or $acceptedSamplesAuthorizationPackageCompilerContract.category -ne 'product_still_life') {
      Add-Failure "v14.195 compiler contract must target the lamp candidate and product_still_life category"
    }
    if ($acceptedSamplesAuthorizationPackageCompilerContract.human_approval_status -ne 'pending' -or $null -ne $acceptedSamplesAuthorizationPackageCompilerContract.approved_by -or $acceptedSamplesAuthorizationPackageCompilerContract.authorization_granted_by_this_record -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.execution_allowed_now -ne $false) {
      Add-Failure "v14.195 compiler contract must not overclaim approval, authorization, or execution readiness"
    }
    if ($acceptedSamplesAuthorizationPackageCompilerContract.allowed_file_count_after_approval -ne 2 -or $acceptedSamplesAuthorizationPackageCompilerContract.forbidden_operation_count -lt 10 -or $acceptedSamplesAuthorizationPackageCompilerContract.required_before_execution_count -lt 5 -or $acceptedSamplesAuthorizationPackageCompilerContract.validation_required_count -lt 6) {
      Add-Failure "v14.195 compiler contract must preserve exact file scope, forbidden operations, requirements, and validation chain"
    }
    if ($acceptedSamplesAuthorizationPackageCompilerContract.compiler_only -ne $true -or $acceptedSamplesAuthorizationPackageCompilerContract.accepted_samples_write_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.category_index_write_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.image_file_copy_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.runs_source_image_modified -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.failure_samples_write_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.195 compiler contract must not perform registry, category, image, runs, failure, or production writes"
    }
    if ($acceptedSamplesAuthorizationPackageCompilerContract.provider_contact_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.plugin_call_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.api_call_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.mcp_runtime_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.real_manifest_read_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.real_vcpchat_read_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.real_vcptoolbox_read_performed -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.195 compiler contract must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($acceptedSamplesAuthorizationPackageCompilerContract.vcp_runtime_integration_proven -ne $false -or $acceptedSamplesAuthorizationPackageCompilerContract.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.195 compiler contract must not claim VCP runtime integration"
    }
    if ($acceptedSamplesAuthorizationPackageCompilerContract.negative_case_missing_source_preflight_fails -ne $true -or $acceptedSamplesAuthorizationPackageCompilerContract.negative_case_human_approval_overclaim_fails -ne $true -or $acceptedSamplesAuthorizationPackageCompilerContract.negative_case_authorization_granted_overclaim_fails -ne $true -or $acceptedSamplesAuthorizationPackageCompilerContract.negative_case_broad_allowed_file_scope_fails -ne $true -or $acceptedSamplesAuthorizationPackageCompilerContract.negative_case_forbidden_operation_missing_fails -ne $true -or $acceptedSamplesAuthorizationPackageCompilerContract.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.195 compiler contract must fail source, approval, authorization, scope, forbidden-operation, and runtime negative cases"
    }
  }

  $authorizationPackageCompilerTypeMatrixOutput = & node (Join-Path $Root 'scripts/validate_v14_196_authorization_package_compiler_type_matrix.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Authorization package compiler type matrix validation exited with failure"
  } else {
    $authorizationPackageCompilerTypeMatrix = ($authorizationPackageCompilerTypeMatrixOutput -join "`n") | ConvertFrom-Json
    if ($authorizationPackageCompilerTypeMatrix.passed -ne $true) {
      Add-Failure "Authorization package compiler type matrix validation must pass"
    }
    if ($authorizationPackageCompilerTypeMatrix.compiler_matrix_status -ne 'local_contract_ready_execution_blocked' -or $authorizationPackageCompilerTypeMatrix.execution_allowed_now -ne $false) {
      Add-Failure "v14.196 compiler type matrix must remain local, contract-ready, and execution blocked"
    }
    if ($authorizationPackageCompilerTypeMatrix.package_type_count -ne 5) {
      Add-Failure "v14.196 compiler type matrix must cover five authorization package types"
    }
    foreach ($requiredType in @('accepted_samples_metadata_registration', 'manifest_read', 'durable_archive', 'production_candidate', 'daily_note_vcp_memory')) {
      if ($authorizationPackageCompilerTypeMatrix.package_types -notcontains $requiredType) {
        Add-Failure "v14.196 compiler type matrix missing package type: $requiredType"
      }
    }
    if ($authorizationPackageCompilerTypeMatrix.shared_required_field_count -lt 11 -or $authorizationPackageCompilerTypeMatrix.validation_required_count -lt 5) {
      Add-Failure "v14.196 compiler type matrix must preserve shared required fields and validation chain"
    }
    if ($authorizationPackageCompilerTypeMatrix.type_matrix_only -ne $true -or $authorizationPackageCompilerTypeMatrix.authorization_execution_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.accepted_samples_write_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.manifest_read_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.durable_archive_copy_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.196 compiler type matrix must not execute authorization, accepted_samples, manifest, archive, or production candidate actions"
    }
    if ($authorizationPackageCompilerTypeMatrix.daily_note_write_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.vcp_memory_write_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.provider_contact_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.plugin_call_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.api_call_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.mcp_runtime_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.real_vcpchat_read_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.real_vcptoolbox_read_performed -ne $false -or $authorizationPackageCompilerTypeMatrix.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.196 compiler type matrix must not perform DailyNote/VCP memory/provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($authorizationPackageCompilerTypeMatrix.vcp_runtime_integration_proven -ne $false -or $authorizationPackageCompilerTypeMatrix.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.196 compiler type matrix must not claim VCP runtime integration"
    }
    if ($authorizationPackageCompilerTypeMatrix.negative_case_missing_package_type_fails -ne $true -or $authorizationPackageCompilerTypeMatrix.negative_case_direct_execution_allowed_fails -ne $true -or $authorizationPackageCompilerTypeMatrix.negative_case_accepted_samples_broad_scope_fails -ne $true -or $authorizationPackageCompilerTypeMatrix.negative_case_manifest_read_execution_allowed_fails -ne $true -or $authorizationPackageCompilerTypeMatrix.negative_case_memory_write_without_blocker_fails -ne $true -or $authorizationPackageCompilerTypeMatrix.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.196 compiler type matrix must fail package type, execution, scope, manifest, memory, and runtime negative cases"
    }
  }

  $manifestReadAuthorizationCompilerOutputPreflightOutput = & node (Join-Path $Root 'scripts/validate_v14_197_manifest_read_authorization_compiler_output_preflight.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Manifest read authorization compiler output preflight validation exited with failure"
  } else {
    $manifestReadAuthorizationCompilerOutputPreflight = ($manifestReadAuthorizationCompilerOutputPreflightOutput -join "`n") | ConvertFrom-Json
    if ($manifestReadAuthorizationCompilerOutputPreflight.passed -ne $true) {
      Add-Failure "Manifest read authorization compiler output preflight validation must pass"
    }
    if ($manifestReadAuthorizationCompilerOutputPreflight.package_type -ne 'manifest_read' -or $manifestReadAuthorizationCompilerOutputPreflight.package_status -ne 'draft_blocked_missing_exact_manifest_authorization') {
      Add-Failure "v14.197 manifest read preflight must stay manifest_read and blocked"
    }
    if ($manifestReadAuthorizationCompilerOutputPreflight.source_read_authorized -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.source_read_performed -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.real_manifest_path_provided -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.read_command_permission -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.execution_allowed_now -ne $false) {
      Add-Failure "v14.197 manifest read preflight must not authorize or perform source reads"
    }
    if ($manifestReadAuthorizationCompilerOutputPreflight.exact_allowed_read_path_count -ne 0 -or $manifestReadAuthorizationCompilerOutputPreflight.required_before_execution_count -lt 7 -or $manifestReadAuthorizationCompilerOutputPreflight.validation_required_count -lt 5) {
      Add-Failure "v14.197 manifest read preflight must keep empty read paths and full requirements"
    }
    if ($manifestReadAuthorizationCompilerOutputPreflight.preflight_only -ne $true -or $manifestReadAuthorizationCompilerOutputPreflight.real_manifest_read_performed -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.real_vcpchat_read_performed -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.real_vcptoolbox_read_performed -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.file_write_performed -ne $false) {
      Add-Failure "v14.197 manifest read preflight must not read real sources or write files"
    }
    if ($manifestReadAuthorizationCompilerOutputPreflight.daily_note_write_performed -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.vcp_memory_write_performed -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.provider_contact_performed -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.plugin_call_performed -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.api_call_performed -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.mcp_runtime_performed -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.197 manifest read preflight must not perform DailyNote/VCP memory/provider/plugin/API/MCP/remote actions"
    }
    if ($manifestReadAuthorizationCompilerOutputPreflight.vcp_runtime_integration_proven -ne $false -or $manifestReadAuthorizationCompilerOutputPreflight.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.197 manifest read preflight must not claim VCP runtime integration"
    }
    if ($manifestReadAuthorizationCompilerOutputPreflight.negative_case_real_manifest_path_filled_without_authorization_fails -ne $true -or $manifestReadAuthorizationCompilerOutputPreflight.negative_case_source_read_performed_fails -ne $true -or $manifestReadAuthorizationCompilerOutputPreflight.negative_case_read_command_permission_fails -ne $true -or $manifestReadAuthorizationCompilerOutputPreflight.negative_case_broad_allowed_read_path_fails -ne $true -or $manifestReadAuthorizationCompilerOutputPreflight.negative_case_missing_reviewer_requirement_fails -ne $true -or $manifestReadAuthorizationCompilerOutputPreflight.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.197 manifest read preflight must fail path, read, permission, broad path, reviewer, and runtime negative cases"
    }
  }

  $durableArchiveAuthorizationCompilerOutputPreflightOutput = & node (Join-Path $Root 'scripts/validate_v14_198_durable_archive_authorization_compiler_output_preflight.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Durable archive authorization compiler output preflight validation exited with failure"
  } else {
    $durableArchiveAuthorizationCompilerOutputPreflight = ($durableArchiveAuthorizationCompilerOutputPreflightOutput -join "`n") | ConvertFrom-Json
    if ($durableArchiveAuthorizationCompilerOutputPreflight.passed -ne $true) {
      Add-Failure "Durable archive authorization compiler output preflight validation must pass"
    }
    if ($durableArchiveAuthorizationCompilerOutputPreflight.package_type -ne 'durable_archive' -or $durableArchiveAuthorizationCompilerOutputPreflight.package_status -ne 'draft_blocked_missing_archive_copy_authorization') {
      Add-Failure "v14.198 durable archive preflight must stay durable_archive and blocked"
    }
    if ($durableArchiveAuthorizationCompilerOutputPreflight.archive_copy_authorized -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.archive_copy_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.target_archive_path_provided -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.write_command_permission -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.execution_allowed_now -ne $false) {
      Add-Failure "v14.198 durable archive preflight must not authorize or perform archive copy"
    }
    if ($durableArchiveAuthorizationCompilerOutputPreflight.exact_allowed_write_path_count -ne 0 -or $durableArchiveAuthorizationCompilerOutputPreflight.hash_verification_required -ne $true -or $durableArchiveAuthorizationCompilerOutputPreflight.required_before_execution_count -lt 7 -or $durableArchiveAuthorizationCompilerOutputPreflight.validation_required_count -lt 5) {
      Add-Failure "v14.198 durable archive preflight must keep empty write paths, hash verification, and full requirements"
    }
    if ($durableArchiveAuthorizationCompilerOutputPreflight.preflight_only -ne $true -or $durableArchiveAuthorizationCompilerOutputPreflight.durable_archive_copy_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.image_file_copy_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.runs_source_image_modified -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.accepted_samples_write_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.failure_samples_write_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.production_candidate_write_performed -ne $false) {
      Add-Failure "v14.198 durable archive preflight must not copy images or write runs/accepted/failure/production surfaces"
    }
    if ($durableArchiveAuthorizationCompilerOutputPreflight.daily_note_write_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.vcp_memory_write_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.provider_contact_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.plugin_call_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.api_call_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.mcp_runtime_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.real_manifest_read_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.real_vcpchat_read_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.real_vcptoolbox_read_performed -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.198 durable archive preflight must not perform DailyNote/VCP memory/provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($durableArchiveAuthorizationCompilerOutputPreflight.vcp_runtime_integration_proven -ne $false -or $durableArchiveAuthorizationCompilerOutputPreflight.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.198 durable archive preflight must not claim VCP runtime integration"
    }
    if ($durableArchiveAuthorizationCompilerOutputPreflight.negative_case_target_archive_path_filled_without_authorization_fails -ne $true -or $durableArchiveAuthorizationCompilerOutputPreflight.negative_case_archive_copy_performed_fails -ne $true -or $durableArchiveAuthorizationCompilerOutputPreflight.negative_case_broad_allowed_write_path_fails -ne $true -or $durableArchiveAuthorizationCompilerOutputPreflight.negative_case_missing_hash_verification_fails -ne $true -or $durableArchiveAuthorizationCompilerOutputPreflight.negative_case_production_candidate_write_flag_fails -ne $true -or $durableArchiveAuthorizationCompilerOutputPreflight.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.198 durable archive preflight must fail path, copy, broad path, hash, production, and runtime negative cases"
    }
  }

  $productionCandidateAuthorizationCompilerOutputPreflightOutput = & node (Join-Path $Root 'scripts/validate_v14_199_production_candidate_authorization_compiler_output_preflight.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Production candidate authorization compiler output preflight validation exited with failure"
  } else {
    $productionCandidateAuthorizationCompilerOutputPreflight = ($productionCandidateAuthorizationCompilerOutputPreflightOutput -join "`n") | ConvertFrom-Json
    if ($productionCandidateAuthorizationCompilerOutputPreflight.passed -ne $true) {
      Add-Failure "Production candidate authorization compiler output preflight validation must pass"
    }
    if ($productionCandidateAuthorizationCompilerOutputPreflight.package_type -ne 'production_candidate' -or $productionCandidateAuthorizationCompilerOutputPreflight.package_status -ne 'draft_blocked_missing_production_candidate_authorization') {
      Add-Failure "v14.199 production candidate preflight must stay production_candidate and blocked"
    }
    if ($productionCandidateAuthorizationCompilerOutputPreflight.production_candidate_authorized -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.production_candidate_write_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.eligibility_preflight_present -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.write_command_permission -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.execution_allowed_now -ne $false) {
      Add-Failure "v14.199 production candidate preflight must not authorize or perform production_candidate write"
    }
    if ($productionCandidateAuthorizationCompilerOutputPreflight.exact_allowed_write_path_count -ne 0 -or $productionCandidateAuthorizationCompilerOutputPreflight.required_before_execution_count -lt 8 -or $productionCandidateAuthorizationCompilerOutputPreflight.validation_required_count -lt 5) {
      Add-Failure "v14.199 production candidate preflight must keep empty write paths and full requirements"
    }
    if ($productionCandidateAuthorizationCompilerOutputPreflight.preflight_only -ne $true -or $productionCandidateAuthorizationCompilerOutputPreflight.durable_archive_copy_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.image_file_copy_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.runs_source_image_modified -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.accepted_samples_write_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.failure_samples_write_performed -ne $false) {
      Add-Failure "v14.199 production candidate preflight must not copy images or write runs/accepted/failure surfaces"
    }
    if ($productionCandidateAuthorizationCompilerOutputPreflight.daily_note_write_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.vcp_memory_write_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.provider_contact_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.plugin_call_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.api_call_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.mcp_runtime_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.real_manifest_read_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.real_vcpchat_read_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.real_vcptoolbox_read_performed -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.199 production candidate preflight must not perform DailyNote/VCP memory/provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($productionCandidateAuthorizationCompilerOutputPreflight.vcp_runtime_integration_proven -ne $false -or $productionCandidateAuthorizationCompilerOutputPreflight.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.199 production candidate preflight must not claim VCP runtime integration"
    }
    if ($productionCandidateAuthorizationCompilerOutputPreflight.negative_case_accepted_sample_ref_without_eligibility_fails -ne $true -or $productionCandidateAuthorizationCompilerOutputPreflight.negative_case_production_candidate_write_performed_fails -ne $true -or $productionCandidateAuthorizationCompilerOutputPreflight.negative_case_broad_allowed_write_path_fails -ne $true -or $productionCandidateAuthorizationCompilerOutputPreflight.negative_case_blocker_missing_fails -ne $true -or $productionCandidateAuthorizationCompilerOutputPreflight.negative_case_memory_write_flag_fails -ne $true -or $productionCandidateAuthorizationCompilerOutputPreflight.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.199 production candidate preflight must fail sample, write, scope, blocker, memory, and runtime negative cases"
    }
  }

  $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflightOutput = & node (Join-Path $Root 'scripts/validate_v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "DailyNote/VCP memory authorization compiler output preflight validation exited with failure"
  } else {
    $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight = ($dailyNoteVcpMemoryAuthorizationCompilerOutputPreflightOutput -join "`n") | ConvertFrom-Json
    if ($dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.passed -ne $true) {
      Add-Failure "DailyNote/VCP memory authorization compiler output preflight validation must pass"
    }
    if ($dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.package_type -ne 'daily_note_vcp_memory' -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.package_status -ne 'draft_blocked_missing_daily_note_vcp_memory_write_authorization') {
      Add-Failure "v14.200 DailyNote/VCP memory preflight must stay daily_note_vcp_memory and blocked"
    }
    if ($dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.daily_note_write_authorized -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.vcp_memory_write_authorized -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.memory_delta_draft_present -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.sensitive_data_scan_present -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.write_command_permission -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.execution_allowed_now -ne $false) {
      Add-Failure "v14.200 DailyNote/VCP memory preflight must not authorize or perform memory writes"
    }
    if ($dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.exact_allowed_memory_target_count -ne 0 -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.required_before_execution_count -lt 8 -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.validation_required_count -lt 5) {
      Add-Failure "v14.200 DailyNote/VCP memory preflight must keep empty memory targets and full requirements"
    }
    if ($dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.preflight_only -ne $true -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.daily_note_write_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.vcp_memory_write_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.memory_delta_written_to_runtime -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.secret_or_private_path_included -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.image_binary_included -ne $false) {
      Add-Failure "v14.200 DailyNote/VCP memory preflight must not write memory, include secrets/private paths, or include image binaries"
    }
    if ($dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.production_candidate_write_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.durable_archive_copy_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.image_file_copy_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.runs_source_image_modified -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.accepted_samples_write_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.failure_samples_write_performed -ne $false) {
      Add-Failure "v14.200 DailyNote/VCP memory preflight must not copy images or write runs/accepted/failure/production surfaces"
    }
    if ($dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.provider_contact_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.plugin_call_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.api_call_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.mcp_runtime_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.real_manifest_read_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.real_vcpchat_read_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.real_vcptoolbox_read_performed -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.200 DailyNote/VCP memory preflight must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.vcp_runtime_integration_proven -ne $false -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.200 DailyNote/VCP memory preflight must not claim VCP runtime integration"
    }
    if ($dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.negative_case_memory_delta_ref_without_scan_fails -ne $true -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.negative_case_daily_note_write_performed_fails -ne $true -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.negative_case_vcp_memory_write_performed_fails -ne $true -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.negative_case_broad_allowed_memory_target_fails -ne $true -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.negative_case_blocker_missing_fails -ne $true -or $dailyNoteVcpMemoryAuthorizationCompilerOutputPreflight.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.200 DailyNote/VCP memory preflight must fail draft, write, target, blocker, and runtime negative cases"
    }
  }

  $authorizationPackageCompilerCoverageCloseoutOutput = & node (Join-Path $Root 'scripts/validate_v14_201_authorization_package_compiler_coverage_closeout.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Authorization package compiler coverage closeout validation exited with failure"
  } else {
    $authorizationPackageCompilerCoverageCloseout = ($authorizationPackageCompilerCoverageCloseoutOutput -join "`n") | ConvertFrom-Json
    if ($authorizationPackageCompilerCoverageCloseout.passed -ne $true) {
      Add-Failure "Authorization package compiler coverage closeout validation must pass"
    }
    if ($authorizationPackageCompilerCoverageCloseout.coverage_status -ne 'complete_local_blocked_coverage' -or $authorizationPackageCompilerCoverageCloseout.package_type_count_expected -ne 5 -or $authorizationPackageCompilerCoverageCloseout.package_type_count_covered -ne 5 -or $authorizationPackageCompilerCoverageCloseout.validator_pass_count -ne 5) {
      Add-Failure "v14.201 authorization compiler coverage closeout must cover all five package types and validators"
    }
    if ($authorizationPackageCompilerCoverageCloseout.coverage_closeout_only -ne $true -or $authorizationPackageCompilerCoverageCloseout.authorization_execution_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.accepted_samples_write_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.manifest_read_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.durable_archive_copy_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.production_candidate_write_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.daily_note_write_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.201 authorization compiler coverage closeout must not execute any package action"
    }
    if ($authorizationPackageCompilerCoverageCloseout.provider_contact_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.plugin_call_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.api_call_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.mcp_runtime_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.real_manifest_read_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.real_vcpchat_read_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.real_vcptoolbox_read_performed -ne $false -or $authorizationPackageCompilerCoverageCloseout.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.201 authorization compiler coverage closeout must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($authorizationPackageCompilerCoverageCloseout.vcp_runtime_integration_proven -ne $false -or $authorizationPackageCompilerCoverageCloseout.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.201 authorization compiler coverage closeout must not claim VCP runtime integration"
    }
    if ($authorizationPackageCompilerCoverageCloseout.negative_case_missing_package_coverage_fails -ne $true -or $authorizationPackageCompilerCoverageCloseout.negative_case_execution_allowed_package_fails -ne $true -or $authorizationPackageCompilerCoverageCloseout.negative_case_validator_missing_fails -ne $true -or $authorizationPackageCompilerCoverageCloseout.negative_case_wrong_blocked_status_fails -ne $true -or $authorizationPackageCompilerCoverageCloseout.negative_case_memory_write_flag_fails -ne $true -or $authorizationPackageCompilerCoverageCloseout.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.201 authorization compiler coverage closeout must fail coverage, execution, validator, status, memory, and runtime negative cases"
    }
  }

  $authorizationPackageBlockerArbiterContractOutput = & node (Join-Path $Root 'scripts/validate_v14_202_authorization_package_blocker_arbiter_contract.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Authorization package blocker arbiter contract validation exited with failure"
  } else {
    $authorizationPackageBlockerArbiterContract = ($authorizationPackageBlockerArbiterContractOutput -join "`n") | ConvertFrom-Json
    if ($authorizationPackageBlockerArbiterContract.passed -ne $true) {
      Add-Failure "Authorization package blocker arbiter contract validation must pass"
    }
    if ($authorizationPackageBlockerArbiterContract.arbiter_status -ne 'all_package_types_blocked_pending_exact_authorization' -or $authorizationPackageBlockerArbiterContract.package_type_count -ne 5 -or $authorizationPackageBlockerArbiterContract.blocker_decision_count -ne 5 -or $authorizationPackageBlockerArbiterContract.all_execution_allowed_now -ne $false) {
      Add-Failure "v14.202 blocker arbiter must keep all five package types blocked"
    }
    if ($authorizationPackageBlockerArbiterContract.blocker_arbiter_contract_only -ne $true -or $authorizationPackageBlockerArbiterContract.authorization_execution_performed -ne $false -or $authorizationPackageBlockerArbiterContract.accepted_samples_write_performed -ne $false -or $authorizationPackageBlockerArbiterContract.manifest_read_performed -ne $false -or $authorizationPackageBlockerArbiterContract.durable_archive_copy_performed -ne $false -or $authorizationPackageBlockerArbiterContract.production_candidate_write_performed -ne $false -or $authorizationPackageBlockerArbiterContract.daily_note_write_performed -ne $false -or $authorizationPackageBlockerArbiterContract.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.202 blocker arbiter must not execute any package action"
    }
    if ($authorizationPackageBlockerArbiterContract.provider_contact_performed -ne $false -or $authorizationPackageBlockerArbiterContract.plugin_call_performed -ne $false -or $authorizationPackageBlockerArbiterContract.api_call_performed -ne $false -or $authorizationPackageBlockerArbiterContract.mcp_runtime_performed -ne $false -or $authorizationPackageBlockerArbiterContract.real_manifest_read_performed -ne $false -or $authorizationPackageBlockerArbiterContract.real_vcpchat_read_performed -ne $false -or $authorizationPackageBlockerArbiterContract.real_vcptoolbox_read_performed -ne $false -or $authorizationPackageBlockerArbiterContract.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.202 blocker arbiter must not perform provider/plugin/API/MCP/VCP/remote actions"
    }
    if ($authorizationPackageBlockerArbiterContract.vcp_runtime_integration_proven -ne $false -or $authorizationPackageBlockerArbiterContract.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.202 blocker arbiter must not claim VCP runtime integration"
    }
    if ($authorizationPackageBlockerArbiterContract.negative_case_missing_blocker_decision_fails -ne $true -or $authorizationPackageBlockerArbiterContract.negative_case_execution_allowed_package_fails -ne $true -or $authorizationPackageBlockerArbiterContract.negative_case_unknown_package_type_fails -ne $true -or $authorizationPackageBlockerArbiterContract.negative_case_missing_exact_scope_requirement_fails -ne $true -or $authorizationPackageBlockerArbiterContract.negative_case_memory_write_flag_fails -ne $true -or $authorizationPackageBlockerArbiterContract.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.202 blocker arbiter must fail missing decision, execution, unknown type, scope, memory, and runtime negative cases"
    }
  }

  $authorizationCompilerReviewConsoleHandoffStateOutput = & node (Join-Path $Root 'scripts/validate_v14_203_authorization_compiler_review_console_handoff_state.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Authorization compiler Review Console handoff state validation exited with failure"
  } else {
    $authorizationCompilerReviewConsoleHandoffState = ($authorizationCompilerReviewConsoleHandoffStateOutput -join "`n") | ConvertFrom-Json
    if ($authorizationCompilerReviewConsoleHandoffState.passed -ne $true) {
      Add-Failure "Authorization compiler Review Console handoff state validation must pass"
    }
    if ($authorizationCompilerReviewConsoleHandoffState.handoff_state_status -ne 'static_ready_no_runtime' -or $authorizationCompilerReviewConsoleHandoffState.package_card_count -ne 5 -or $authorizationCompilerReviewConsoleHandoffState.runtime_integration_allowed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.package_execution_allowed -ne $false) {
      Add-Failure "v14.203 Review Console handoff state must expose five blocked static cards with no runtime or package execution"
    }
    if ($authorizationCompilerReviewConsoleHandoffState.review_console_handoff_state_only -ne $true -or $authorizationCompilerReviewConsoleHandoffState.authorization_execution_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.package_execution_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.accepted_samples_write_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.manifest_read_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.durable_archive_copy_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.production_candidate_write_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.failure_samples_write_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.daily_note_write_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.203 Review Console handoff state must not execute or write package outputs"
    }
    if ($authorizationCompilerReviewConsoleHandoffState.provider_contact_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.plugin_call_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.api_call_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.mcp_runtime_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.fetch_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.file_write_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.review_console_runtime_integration_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.ipc_preload_renderer_integration_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.real_manifest_read_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.real_vcpchat_read_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.real_vcptoolbox_read_performed -ne $false -or $authorizationCompilerReviewConsoleHandoffState.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.203 Review Console handoff state must not perform provider/plugin/API/MCP/fetch/file/VCP/runtime/remote actions"
    }
    if ($authorizationCompilerReviewConsoleHandoffState.vcp_runtime_integration_proven -ne $false -or $authorizationCompilerReviewConsoleHandoffState.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.203 Review Console handoff state must not claim VCP runtime integration"
    }
    if ($authorizationCompilerReviewConsoleHandoffState.negative_case_missing_package_card_fails -ne $true -or $authorizationCompilerReviewConsoleHandoffState.negative_case_execution_allowed_card_fails -ne $true -or $authorizationCompilerReviewConsoleHandoffState.negative_case_missing_source_contract_fails -ne $true -or $authorizationCompilerReviewConsoleHandoffState.negative_case_runtime_flag_fails -ne $true -or $authorizationCompilerReviewConsoleHandoffState.negative_case_vcpchat_read_flag_fails -ne $true -or $authorizationCompilerReviewConsoleHandoffState.negative_case_memory_write_flag_fails -ne $true) {
      Add-Failure "v14.203 Review Console handoff state must fail card, source, runtime, VCPChat, and memory negative cases"
    }
  }

  $reviewConsoleRuntimeGapDashboardContractOutput = & node (Join-Path $Root 'scripts/validate_v14_204_review_console_runtime_gap_dashboard_contract.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console runtime gap dashboard contract validation exited with failure"
  } else {
    $reviewConsoleRuntimeGapDashboardContract = ($reviewConsoleRuntimeGapDashboardContractOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleRuntimeGapDashboardContract.passed -ne $true) {
      Add-Failure "Review Console runtime gap dashboard contract validation must pass"
    }
    if ($reviewConsoleRuntimeGapDashboardContract.dashboard_contract_status -ne 'static_runtime_gap_contract_ready' -or $reviewConsoleRuntimeGapDashboardContract.dashboard_progress_basis -ne 'validator_outputs_and_static_fixtures_only' -or $reviewConsoleRuntimeGapDashboardContract.runtime_gap_row_count -ne 7 -or $reviewConsoleRuntimeGapDashboardContract.local_capability_row_count -ne 3 -or $reviewConsoleRuntimeGapDashboardContract.a5_boundary_row_count -ne 4 -or $reviewConsoleRuntimeGapDashboardContract.runtime_claim_allowed -ne $false) {
      Add-Failure "v14.204 runtime gap dashboard must separate local capabilities from A5 runtime boundaries"
    }
    if ($reviewConsoleRuntimeGapDashboardContract.runtime_gap_dashboard_contract_only -ne $true -or $reviewConsoleRuntimeGapDashboardContract.dashboard_uses_project_master_plan_progress -ne $false -or $reviewConsoleRuntimeGapDashboardContract.dashboard_uses_document_token_progress -ne $false -or $reviewConsoleRuntimeGapDashboardContract.dashboard_promotes_product_status -ne $false) {
      Add-Failure "v14.204 runtime gap dashboard must use validator/static evidence only and must not promote product status"
    }
    if ($reviewConsoleRuntimeGapDashboardContract.authorization_execution_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.package_execution_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.accepted_samples_write_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.manifest_read_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.durable_archive_copy_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.production_candidate_write_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.failure_samples_write_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.daily_note_write_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.204 runtime gap dashboard must not execute or write package outputs"
    }
    if ($reviewConsoleRuntimeGapDashboardContract.provider_contact_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.plugin_call_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.api_call_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.mcp_runtime_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.fetch_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.file_write_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.review_console_runtime_integration_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.ipc_preload_renderer_integration_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.real_manifest_read_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.real_vcpchat_read_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleRuntimeGapDashboardContract.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.204 runtime gap dashboard must not perform provider/plugin/API/MCP/fetch/file/VCP/runtime/remote actions"
    }
    if ($reviewConsoleRuntimeGapDashboardContract.vcp_runtime_integration_proven -ne $false -or $reviewConsoleRuntimeGapDashboardContract.artifact_recoverability_is_not_vcp_runtime_integration -ne $true) {
      Add-Failure "v14.204 runtime gap dashboard must not claim VCP runtime integration"
    }
    if ($reviewConsoleRuntimeGapDashboardContract.negative_case_missing_gap_row_fails -ne $true -or $reviewConsoleRuntimeGapDashboardContract.negative_case_docs_progress_basis_fails -ne $true -or $reviewConsoleRuntimeGapDashboardContract.negative_case_runtime_claim_fails -ne $true -or $reviewConsoleRuntimeGapDashboardContract.negative_case_manifest_read_flag_fails -ne $true -or $reviewConsoleRuntimeGapDashboardContract.negative_case_package_execution_flag_fails -ne $true -or $reviewConsoleRuntimeGapDashboardContract.negative_case_memory_write_flag_fails -ne $true) {
      Add-Failure "v14.204 runtime gap dashboard must fail missing row, docs progress, runtime, manifest, package execution, and memory negative cases"
    }
  }

  $reviewConsoleRuntimeGapStaticUiPanelOutput = & node (Join-Path $Root 'scripts/validate_v14_205_review_console_runtime_gap_static_ui_panel.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console runtime gap static UI panel validation exited with failure"
  } else {
    $reviewConsoleRuntimeGapStaticUiPanel = ($reviewConsoleRuntimeGapStaticUiPanelOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleRuntimeGapStaticUiPanel.passed -ne $true) {
      Add-Failure "Review Console runtime gap static UI panel validation must pass"
    }
    if ($reviewConsoleRuntimeGapStaticUiPanel.static_ui_panel_status -ne 'wired_static_only' -or $reviewConsoleRuntimeGapStaticUiPanel.runtime_gap_row_count -ne 7 -or $reviewConsoleRuntimeGapStaticUiPanel.local_capability_row_count -ne 3 -or $reviewConsoleRuntimeGapStaticUiPanel.a5_boundary_row_count -ne 4 -or $reviewConsoleRuntimeGapStaticUiPanel.runtime_claim_allowed -ne $false) {
      Add-Failure "v14.205 runtime gap static UI panel must display seven rows split into local capabilities and A5 boundaries"
    }
    if ($reviewConsoleRuntimeGapStaticUiPanel.runtime_gap_dashboard_static_ui_only -ne $true -or $reviewConsoleRuntimeGapStaticUiPanel.fetch_performed -ne $false -or $reviewConsoleRuntimeGapStaticUiPanel.file_write_performed -ne $false -or $reviewConsoleRuntimeGapStaticUiPanel.package_execution_performed -ne $false -or $reviewConsoleRuntimeGapStaticUiPanel.real_manifest_read_performed -ne $false -or $reviewConsoleRuntimeGapStaticUiPanel.real_vcpchat_read_performed -ne $false -or $reviewConsoleRuntimeGapStaticUiPanel.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleRuntimeGapStaticUiPanel.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.205 runtime gap static UI panel must remain static with no fetch/write/package/VCP/runtime action"
    }
  }

  $reviewConsoleRuntimeGapDraftOutputSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console runtime gap draft output snapshot static regression validation exited with failure"
  } else {
    $reviewConsoleRuntimeGapDraftOutputSnapshot = ($reviewConsoleRuntimeGapDraftOutputSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleRuntimeGapDraftOutputSnapshot.passed -ne $true) {
      Add-Failure "Review Console runtime gap draft output snapshot static regression validation must pass"
    }
    if ($reviewConsoleRuntimeGapDraftOutputSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsoleRuntimeGapDraftOutputSnapshot.draft_output_key -ne 'review_console_runtime_gap_dashboard_state' -or $reviewConsoleRuntimeGapDraftOutputSnapshot.runtime_gap_row_count -ne 7 -or $reviewConsoleRuntimeGapDraftOutputSnapshot.local_capability_row_count -ne 3 -or $reviewConsoleRuntimeGapDraftOutputSnapshot.a5_boundary_row_count -ne 4 -or $reviewConsoleRuntimeGapDraftOutputSnapshot.runtime_claim_allowed -ne $false) {
      Add-Failure "v14.206 runtime gap draft output snapshot must preserve seven static rows and no runtime claim"
    }
    if ($reviewConsoleRuntimeGapDraftOutputSnapshot.dashboard_progress_basis -ne 'validator_outputs_and_static_fixtures_only' -or $reviewConsoleRuntimeGapDraftOutputSnapshot.runtime_gap_dashboard_static_ui_only -ne $true -or $reviewConsoleRuntimeGapDraftOutputSnapshot.package_execution_performed -ne $false -or $reviewConsoleRuntimeGapDraftOutputSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleRuntimeGapDraftOutputSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleRuntimeGapDraftOutputSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleRuntimeGapDraftOutputSnapshot.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.206 runtime gap draft output snapshot must remain validator/static-only with no package/VCP/runtime action"
    }
    if ($reviewConsoleRuntimeGapDraftOutputSnapshot.negative_case_missing_draft_output_key_fails -ne $true -or $reviewConsoleRuntimeGapDraftOutputSnapshot.negative_case_missing_gap_row_fails -ne $true -or $reviewConsoleRuntimeGapDraftOutputSnapshot.negative_case_docs_progress_basis_fails -ne $true -or $reviewConsoleRuntimeGapDraftOutputSnapshot.negative_case_runtime_claim_fails -ne $true -or $reviewConsoleRuntimeGapDraftOutputSnapshot.negative_case_package_execution_flag_fails -ne $true -or $reviewConsoleRuntimeGapDraftOutputSnapshot.negative_case_manifest_read_flag_fails -ne $true -or $reviewConsoleRuntimeGapDraftOutputSnapshot.negative_case_memory_write_flag_fails -ne $true) {
      Add-Failure "v14.206 runtime gap draft output snapshot must fail missing key, row, docs-basis, runtime, package, manifest, and memory negative cases"
    }
  }

  $reviewConsoleRuntimeGapTraceMatrixOutput = & node (Join-Path $Root 'scripts/validate_v14_207_review_console_runtime_gap_trace_matrix_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console runtime gap trace matrix static regression validation exited with failure"
  } else {
    $reviewConsoleRuntimeGapTraceMatrix = ($reviewConsoleRuntimeGapTraceMatrixOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleRuntimeGapTraceMatrix.passed -ne $true) {
      Add-Failure "Review Console runtime gap trace matrix static regression validation must pass"
    }
    if ($reviewConsoleRuntimeGapTraceMatrix.trace_status -ne 'contract_ui_draft_trace_locked' -or $reviewConsoleRuntimeGapTraceMatrix.surface_count -ne 3 -or $reviewConsoleRuntimeGapTraceMatrix.runtime_gap_row_count -ne 7 -or $reviewConsoleRuntimeGapTraceMatrix.local_capability_row_count -ne 3 -or $reviewConsoleRuntimeGapTraceMatrix.a5_boundary_row_count -ne 4 -or $reviewConsoleRuntimeGapTraceMatrix.runtime_claim_allowed -ne $false) {
      Add-Failure "v14.207 runtime gap trace matrix must link three surfaces and seven rows without runtime claim"
    }
    if ($reviewConsoleRuntimeGapTraceMatrix.all_rows_present_in_contract -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.all_rows_present_in_static_ui_seed -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.all_rows_present_in_draft_snapshot -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.dashboard_progress_basis -ne 'validator_outputs_and_static_fixtures_only') {
      Add-Failure "v14.207 runtime gap trace matrix must prove row continuity across contract, UI seed, and draft snapshot using validator/static evidence"
    }
    if ($reviewConsoleRuntimeGapTraceMatrix.static_trace_matrix_only -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.package_execution_performed -ne $false -or $reviewConsoleRuntimeGapTraceMatrix.real_manifest_read_performed -ne $false -or $reviewConsoleRuntimeGapTraceMatrix.real_vcpchat_read_performed -ne $false -or $reviewConsoleRuntimeGapTraceMatrix.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleRuntimeGapTraceMatrix.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.207 runtime gap trace matrix must remain static-only with no package/VCP/runtime action"
    }
    if ($reviewConsoleRuntimeGapTraceMatrix.negative_case_missing_surface_fails -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.negative_case_missing_row_trace_fails -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.negative_case_row_missing_from_static_ui_seed_fails -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.negative_case_row_missing_from_draft_snapshot_fails -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.negative_case_docs_progress_basis_fails -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.negative_case_runtime_claim_fails -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.negative_case_package_execution_flag_fails -ne $true -or $reviewConsoleRuntimeGapTraceMatrix.negative_case_memory_write_flag_fails -ne $true) {
      Add-Failure "v14.207 runtime gap trace matrix must fail surface, row, basis, runtime, package, and memory negative cases"
    }
  }

  $reviewConsoleBrowserStaticReviewBlockerOutput = & node (Join-Path $Root 'scripts/validate_v14_208_review_console_browser_static_review_blocker_handoff.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console browser static review blocker handoff validation exited with failure"
  } else {
    $reviewConsoleBrowserStaticReviewBlocker = ($reviewConsoleBrowserStaticReviewBlockerOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleBrowserStaticReviewBlocker.passed -ne $true) {
      Add-Failure "Review Console browser static review blocker handoff validation must pass"
    }
    if ($reviewConsoleBrowserStaticReviewBlocker.blocker_status -ne 'active' -or $reviewConsoleBrowserStaticReviewBlocker.browser_static_review_status -ne 'blocked_unavailable' -or $reviewConsoleBrowserStaticReviewBlocker.browser_static_review_passed -ne $false -or $reviewConsoleBrowserStaticReviewBlocker.browser_static_review_claim_allowed -ne $false -or $reviewConsoleBrowserStaticReviewBlocker.static_regression_substitute_is_browser_review -ne $false) {
      Add-Failure "v14.208 browser blocker must keep browser review blocked and prevent static regressions from being claimed as browser review"
    }
    if ($reviewConsoleBrowserStaticReviewBlocker.static_regression_ref_count -ne 3 -or $reviewConsoleBrowserStaticReviewBlocker.covered_surface_count -ne 3 -or $reviewConsoleBrowserStaticReviewBlocker.static_html_present -ne $true) {
      Add-Failure "v14.208 browser blocker must reference the three static regression surfaces and the static HTML surface"
    }
    if ($reviewConsoleBrowserStaticReviewBlocker.dependency_install_allowed -ne $false -or $reviewConsoleBrowserStaticReviewBlocker.package_json_modified -ne $false -or $reviewConsoleBrowserStaticReviewBlocker.package_lock_modified -ne $false -or $reviewConsoleBrowserStaticReviewBlocker.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.208 browser blocker must not allow dependency changes or VCP runtime claims"
    }
    if ($reviewConsoleBrowserStaticReviewBlocker.negative_case_browser_review_marked_passed_fails -ne $true -or $reviewConsoleBrowserStaticReviewBlocker.negative_case_static_regression_claimed_as_browser_review_fails -ne $true -or $reviewConsoleBrowserStaticReviewBlocker.negative_case_missing_static_regression_ref_fails -ne $true -or $reviewConsoleBrowserStaticReviewBlocker.negative_case_missing_html_surface_fails -ne $true -or $reviewConsoleBrowserStaticReviewBlocker.negative_case_dependency_install_allowed_fails -ne $true -or $reviewConsoleBrowserStaticReviewBlocker.negative_case_package_json_modified_fails -ne $true -or $reviewConsoleBrowserStaticReviewBlocker.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.208 browser blocker must fail browser-pass, static-substitute, missing-ref, missing-html, dependency, package, and runtime negative cases"
    }
  }

  $uncommittedWorktreeRecoveryAuditOutput = & node (Join-Path $Root 'scripts/validate_v14_209_uncommitted_worktree_recovery_audit.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Uncommitted worktree recovery audit validation exited with failure"
  } else {
    $uncommittedWorktreeRecoveryAudit = ($uncommittedWorktreeRecoveryAuditOutput -join "`n") | ConvertFrom-Json
    if ($uncommittedWorktreeRecoveryAudit.passed -ne $true) {
      Add-Failure "Uncommitted worktree recovery audit validation must pass"
    }
    if ($uncommittedWorktreeRecoveryAudit.worktree_audit_only -ne $true -or $uncommittedWorktreeRecoveryAudit.commit_readiness_claimed -ne $false -or $uncommittedWorktreeRecoveryAudit.push_readiness_claimed -ne $false) {
      Add-Failure "v14.209 worktree recovery audit must remain audit-only and must not claim commit or push readiness"
    }
    if ($uncommittedWorktreeRecoveryAudit.staged_file_count -ne 0 -or $uncommittedWorktreeRecoveryAudit.git_add_dot_used -ne $false -or $uncommittedWorktreeRecoveryAudit.commit_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.209 worktree recovery audit must prove no staged files, no git add dot, no commit, and no push/tag/release/deploy"
    }
    if ($uncommittedWorktreeRecoveryAudit.ahead_count -lt 0 -or $uncommittedWorktreeRecoveryAudit.behind_count -ne 0 -or $uncommittedWorktreeRecoveryAudit.tracked_modified_file_count -lt 0 -or $uncommittedWorktreeRecoveryAudit.untracked_v14_165_to_v14_208_file_count -ne 0) {
      Add-Failure "v14.209 worktree recovery audit must match the current branch ahead/behind and v14.165-v14.208 dirty-tree counts"
    }
    if ($uncommittedWorktreeRecoveryAudit.untracked_phase_doc_count -ne 0 -or $uncommittedWorktreeRecoveryAudit.untracked_phase_validator_count -ne 0 -or $uncommittedWorktreeRecoveryAudit.untracked_schema_example_count -ne 0 -or $uncommittedWorktreeRecoveryAudit.change_group_count -ne 4) {
      Add-Failure "v14.209 worktree recovery audit must preserve the four exact-file groups and doc/validator/fixture counts"
    }
    if ($uncommittedWorktreeRecoveryAudit.provider_contact_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.plugin_call_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.api_call_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.mcp_runtime_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.image_generation_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.env_or_secret_read_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.real_manifest_read_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.real_vcpchat_read_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.209 worktree recovery audit must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($uncommittedWorktreeRecoveryAudit.failure_samples_write_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.production_candidate_write_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.daily_note_write_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.vcp_memory_write_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.dependency_change_performed -ne $false -or $uncommittedWorktreeRecoveryAudit.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.209 worktree recovery audit must not write failure/production/memory surfaces, change dependencies, or claim VCP runtime integration"
    }
    if ($uncommittedWorktreeRecoveryAudit.negative_case_staged_file_present_fails -ne $true -or $uncommittedWorktreeRecoveryAudit.negative_case_untracked_v14_count_mismatch_fails -ne $true -or $uncommittedWorktreeRecoveryAudit.negative_case_group_count_mismatch_fails -ne $true -or $uncommittedWorktreeRecoveryAudit.negative_case_package_change_flag_fails -ne $true -or $uncommittedWorktreeRecoveryAudit.negative_case_runtime_claim_fails -ne $true -or $uncommittedWorktreeRecoveryAudit.negative_case_push_claim_fails -ne $true) {
      Add-Failure "v14.209 worktree recovery audit must fail staged, count, group, package, runtime, and push negative cases"
    }
  }

  $exactFileCommitReadinessReviewOutput = & node (Join-Path $Root 'scripts/validate_v14_210_exact_file_commit_readiness_review.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Exact-file commit readiness review validation exited with failure"
  } else {
    $exactFileCommitReadinessReview = ($exactFileCommitReadinessReviewOutput -join "`n") | ConvertFrom-Json
    if ($exactFileCommitReadinessReview.passed -ne $true) {
      Add-Failure "Exact-file commit readiness review validation must pass"
    }
    if ($exactFileCommitReadinessReview.exact_file_commit_readiness_review_only -ne $true -or $exactFileCommitReadinessReview.auto_commit_allowed_now -ne $false -or $exactFileCommitReadinessReview.staging_allowed_now -ne $false -or $exactFileCommitReadinessReview.push_allowed_now -ne $false) {
      Add-Failure "v14.210 exact-file commit readiness review must remain review-only and must not allow auto commit, staging, or push"
    }
    if ($exactFileCommitReadinessReview.staged_file_count -ne 0 -or $exactFileCommitReadinessReview.git_add_dot_used -ne $false -or $exactFileCommitReadinessReview.commit_performed -ne $false -or $exactFileCommitReadinessReview.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.210 exact-file commit readiness review must prove no staged files, no git add dot, no commit, and no push/tag/release/deploy"
    }
    if ($exactFileCommitReadinessReview.ahead_count -lt 0 -or $exactFileCommitReadinessReview.behind_count -ne 0 -or $exactFileCommitReadinessReview.tracked_modified_file_count -lt 0 -or $exactFileCommitReadinessReview.untracked_v14_165_to_v14_210_file_count -ne 0 -or $exactFileCommitReadinessReview.future_exact_file_candidate_total -ne 0) {
      Add-Failure "v14.210 exact-file commit readiness review must match current dirty-tree counts and future candidate total"
    }
    if ($exactFileCommitReadinessReview.untracked_phase_doc_count -ne 0 -or $exactFileCommitReadinessReview.untracked_phase_validator_count -ne 0 -or $exactFileCommitReadinessReview.untracked_schema_example_count -ne 0 -or $exactFileCommitReadinessReview.non_phase_untracked_review_console_file_count -ne 0 -or $exactFileCommitReadinessReview.candidate_group_count -ne 7) {
      Add-Failure "v14.210 exact-file commit readiness review must preserve candidate group and phase file counts"
    }
    if ($exactFileCommitReadinessReview.provider_contact_performed -ne $false -or $exactFileCommitReadinessReview.plugin_call_performed -ne $false -or $exactFileCommitReadinessReview.api_call_performed -ne $false -or $exactFileCommitReadinessReview.mcp_runtime_performed -ne $false -or $exactFileCommitReadinessReview.image_generation_performed -ne $false -or $exactFileCommitReadinessReview.env_or_secret_read_performed -ne $false -or $exactFileCommitReadinessReview.real_manifest_read_performed -ne $false -or $exactFileCommitReadinessReview.real_vcpchat_read_performed -ne $false -or $exactFileCommitReadinessReview.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.210 exact-file commit readiness review must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($exactFileCommitReadinessReview.failure_samples_write_performed -ne $false -or $exactFileCommitReadinessReview.production_candidate_write_performed -ne $false -or $exactFileCommitReadinessReview.daily_note_write_performed -ne $false -or $exactFileCommitReadinessReview.vcp_memory_write_performed -ne $false -or $exactFileCommitReadinessReview.dependency_change_performed -ne $false -or $exactFileCommitReadinessReview.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.210 exact-file commit readiness review must not write failure/production/memory surfaces, change dependencies, or claim VCP runtime integration"
    }
    if ($exactFileCommitReadinessReview.negative_case_auto_commit_allowed_fails -ne $true -or $exactFileCommitReadinessReview.negative_case_staging_allowed_fails -ne $true -or $exactFileCommitReadinessReview.negative_case_staged_file_present_fails -ne $true -or $exactFileCommitReadinessReview.negative_case_candidate_total_mismatch_fails -ne $true -or $exactFileCommitReadinessReview.negative_case_group_count_mismatch_fails -ne $true -or $exactFileCommitReadinessReview.negative_case_runtime_claim_fails -ne $true -or $exactFileCommitReadinessReview.negative_case_push_claim_fails -ne $true) {
      Add-Failure "v14.210 exact-file commit readiness review must fail auto-commit, staging, staged-file, total, group, runtime, and push negative cases"
    }
  }

  $recoverabilityBaselineExactFileStagingAuthorizationPackageDraftOutput = & node (Join-Path $Root 'scripts/validate_v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Recoverability baseline exact-file staging authorization package draft validation exited with failure"
  } else {
    $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft = ($recoverabilityBaselineExactFileStagingAuthorizationPackageDraftOutput -join "`n") | ConvertFrom-Json
    if ($recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.passed -ne $true) {
      Add-Failure "Recoverability baseline exact-file staging authorization package draft validation must pass"
    }
    if ($recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.draft_only -ne $true -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.authorization_granted_by_this_record -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.execution_ready -ne $false) {
      Add-Failure "v14.211 exact-file staging authorization package must remain draft-only and blocked"
    }
    if ($recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.exact_stage_file_count -ne 14 -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.source_group_id -ne 'recoverability_three_sample_baseline' -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.source_group_count -ne 0) {
      Add-Failure "v14.211 exact-file staging authorization package must target the 14-file recoverability_three_sample_baseline group"
    }
    if ($recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.staged_file_count -ne 0 -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.git_add_dot_used -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.staged_files_created -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.commit_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "v14.211 exact-file staging authorization package draft must prove no staged files, no git add dot, no staging, no commit, and no push/tag/release/deploy"
    }
    if ($recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.provider_contact_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.plugin_call_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.api_call_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.mcp_runtime_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.image_generation_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.env_or_secret_read_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.real_manifest_read_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.real_vcpchat_read_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.211 exact-file staging authorization package draft must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.accepted_samples_write_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.failure_samples_write_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.production_candidate_write_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.daily_note_write_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.vcp_memory_write_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.dependency_change_performed -ne $false -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.211 exact-file staging authorization package draft must not write accepted/failure/production/memory surfaces, change dependencies, or claim VCP runtime integration"
    }
    if ($recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.negative_case_missing_exact_file_fails -ne $true -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.negative_case_extra_exact_file_fails -ne $true -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.negative_case_staging_allowed_fails -ne $true -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.negative_case_git_add_dot_allowed_fails -ne $true -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.negative_case_commit_performed_fails -ne $true -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.negative_case_push_claim_fails -ne $true -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.negative_case_missing_commit_trailer_fails -ne $true -or $recoverabilityBaselineExactFileStagingAuthorizationPackageDraft.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.211 exact-file staging authorization package draft must fail missing-file, extra-file, staging, git-add-dot, commit, push, trailer, and runtime negative cases"
    }
  }

  $sixMonthGoalPromptToArtifactCompletionAuditOutput = & node (Join-Path $Root 'scripts/validate_v14_212_six_month_goal_prompt_to_artifact_completion_audit.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Six-month goal prompt-to-artifact completion audit validation exited with failure"
  } else {
    $sixMonthGoalPromptToArtifactCompletionAudit = ($sixMonthGoalPromptToArtifactCompletionAuditOutput -join "`n") | ConvertFrom-Json
    if ($sixMonthGoalPromptToArtifactCompletionAudit.passed -ne $true) {
      Add-Failure "Six-month goal prompt-to-artifact completion audit validation must pass"
    }
    if ($sixMonthGoalPromptToArtifactCompletionAudit.goal_complete -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.prompt_to_artifact_audit_only -ne $true) {
      Add-Failure "v14.212 six-month goal audit must remain incomplete and audit-only"
    }
    if ($sixMonthGoalPromptToArtifactCompletionAudit.recoverable_accepted_sample_count -ne 3 -or $sixMonthGoalPromptToArtifactCompletionAudit.blocked_third_candidate_count -ne 0 -or $sixMonthGoalPromptToArtifactCompletionAudit.remaining_full_recoverable_sample_gap -ne 0) {
      Add-Failure "v14.212 six-month goal audit must preserve the current three-sample local recoverability baseline"
    }
    if ($sixMonthGoalPromptToArtifactCompletionAudit.success_criteria_count -ne 8 -or $sixMonthGoalPromptToArtifactCompletionAudit.met_count -ne 3 -or $sixMonthGoalPromptToArtifactCompletionAudit.partial_count -ne 3 -or $sixMonthGoalPromptToArtifactCompletionAudit.not_met_count -ne 2 -or $sixMonthGoalPromptToArtifactCompletionAudit.blocked_by_a5_count -ne 1) {
      Add-Failure "v14.212 six-month goal audit must preserve the prompt-to-artifact checklist counts"
    }
    if ($sixMonthGoalPromptToArtifactCompletionAudit.provider_contact_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.plugin_call_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.api_call_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.mcp_runtime_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.image_generation_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.env_or_secret_read_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.real_manifest_read_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.real_vcpchat_read_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.212 six-month goal audit must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($sixMonthGoalPromptToArtifactCompletionAudit.accepted_samples_write_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.failure_samples_write_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.production_candidate_write_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.daily_note_write_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.vcp_memory_write_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.commit_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.push_tag_release_deploy_performed -ne $false -or $sixMonthGoalPromptToArtifactCompletionAudit.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.212 six-month goal audit must not write accepted/failure/production/memory surfaces, commit, push, or claim VCP runtime integration"
    }
    if ($sixMonthGoalPromptToArtifactCompletionAudit.negative_case_goal_complete_true_fails -ne $true -or $sixMonthGoalPromptToArtifactCompletionAudit.negative_case_three_sample_goal_marked_missing_fails -ne $true -or $sixMonthGoalPromptToArtifactCompletionAudit.negative_case_local_recoverability_marked_goal_complete_fails -ne $true -or $sixMonthGoalPromptToArtifactCompletionAudit.negative_case_missing_evidence_ref_fails -ne $true -or $sixMonthGoalPromptToArtifactCompletionAudit.negative_case_runtime_claim_fails -ne $true -or $sixMonthGoalPromptToArtifactCompletionAudit.negative_case_external_action_flag_fails -ne $true) {
      Add-Failure "v14.212 six-month goal audit must fail completion, missing-three-sample, local-recoverability-overclaim, missing-evidence, runtime, and external-action negative cases"
    }
  }

  $lampThirdSampleHumanApprovalRequestPackageOutput = & node (Join-Path $Root 'scripts/validate_v14_213_lamp_third_sample_human_approval_request_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Lamp third sample human approval request package validation exited with failure"
  } else {
    $lampThirdSampleHumanApprovalRequestPackage = ($lampThirdSampleHumanApprovalRequestPackageOutput -join "`n") | ConvertFrom-Json
    if ($lampThirdSampleHumanApprovalRequestPackage.passed -ne $true) {
      Add-Failure "Lamp third sample human approval request package validation must pass"
    }
    if ($lampThirdSampleHumanApprovalRequestPackage.current_human_approval_status -ne 'pending' -or $lampThirdSampleHumanApprovalRequestPackage.current_registration_blocker -ne 'human_approval_missing') {
      Add-Failure "v14.213 must preserve the current lamp human approval blocker"
    }
    if ($lampThirdSampleHumanApprovalRequestPackage.human_approval_granted_by_this_record -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.accepted_samples_registration_ready_now -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.human_approval_request_package_only -ne $true) {
      Add-Failure "v14.213 must remain a request package and must not grant approval or registration readiness"
    }
    if ($lampThirdSampleHumanApprovalRequestPackage.accepted_samples_write_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.category_index_write_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.failure_samples_write_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.production_candidate_write_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.daily_note_write_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.213 must not write accepted/category/failure/production/memory surfaces"
    }
    if ($lampThirdSampleHumanApprovalRequestPackage.provider_contact_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.plugin_call_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.api_call_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.mcp_runtime_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.image_generation_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.env_or_secret_read_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.real_manifest_read_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.real_vcpchat_read_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.213 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($lampThirdSampleHumanApprovalRequestPackage.commit_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.push_tag_release_deploy_performed -ne $false -or $lampThirdSampleHumanApprovalRequestPackage.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.213 must not commit, push, deploy, or claim VCP runtime integration"
    }
    if ($lampThirdSampleHumanApprovalRequestPackage.negative_case_approval_granted_by_record_fails -ne $true -or $lampThirdSampleHumanApprovalRequestPackage.negative_case_registration_ready_now_fails -ne $true -or $lampThirdSampleHumanApprovalRequestPackage.negative_case_missing_jenn_fails -ne $true -or $lampThirdSampleHumanApprovalRequestPackage.negative_case_missing_candidate_id_fails -ne $true -or $lampThirdSampleHumanApprovalRequestPackage.negative_case_missing_artifact_hash_fails -ne $true -or $lampThirdSampleHumanApprovalRequestPackage.negative_case_broad_write_scope_fails -ne $true -or $lampThirdSampleHumanApprovalRequestPackage.negative_case_external_action_flag_fails -ne $true -or $lampThirdSampleHumanApprovalRequestPackage.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.213 must fail approval-granted, registration-ready, missing-Jenn, missing-candidate, missing-hash, broad-scope, external-action, and runtime negative cases"
    }
  }

  $lampThirdSampleHumanApprovalIntakeValidatorOutput = & node (Join-Path $Root 'scripts/validate_v14_214_lamp_third_sample_human_approval_intake_validator.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Lamp third sample human approval intake validator validation exited with failure"
  } else {
    $lampThirdSampleHumanApprovalIntakeValidator = ($lampThirdSampleHumanApprovalIntakeValidatorOutput -join "`n") | ConvertFrom-Json
    if ($lampThirdSampleHumanApprovalIntakeValidator.passed -ne $true) {
      Add-Failure "Lamp third sample human approval intake validator validation must pass"
    }
    if ($lampThirdSampleHumanApprovalIntakeValidator.approval_statement_matches_required_form -ne $true -or $lampThirdSampleHumanApprovalIntakeValidator.approval_statement_source_is_user_submission -ne $false) {
      Add-Failure "v14.214 must validate the exact approval form without treating the fixture as a user submission"
    }
    if ($lampThirdSampleHumanApprovalIntakeValidator.human_approval_captured_now -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.accepted_samples_registration_ready_now -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.current_registration_blocker -ne 'human_approval_missing') {
      Add-Failure "v14.214 must preserve the current lamp human approval blocker until real Jenn approval is captured"
    }
    if ($lampThirdSampleHumanApprovalIntakeValidator.registration_unlocks_only_after_external_user_approval -ne $true -or $lampThirdSampleHumanApprovalIntakeValidator.approval_intake_validator_only -ne $true) {
      Add-Failure "v14.214 must remain an approval intake validator only"
    }
    if ($lampThirdSampleHumanApprovalIntakeValidator.accepted_samples_write_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.category_index_write_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.failure_samples_write_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.production_candidate_write_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.daily_note_write_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.214 must not write accepted/category/failure/production/memory surfaces"
    }
    if ($lampThirdSampleHumanApprovalIntakeValidator.provider_contact_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.plugin_call_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.api_call_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.mcp_runtime_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.image_generation_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.env_or_secret_read_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.real_manifest_read_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.real_vcpchat_read_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.214 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($lampThirdSampleHumanApprovalIntakeValidator.commit_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.push_tag_release_deploy_performed -ne $false -or $lampThirdSampleHumanApprovalIntakeValidator.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.214 must not commit, push, deploy, or claim VCP runtime integration"
    }
    if ($lampThirdSampleHumanApprovalIntakeValidator.negative_case_missing_reviewer_fails -ne $true -or $lampThirdSampleHumanApprovalIntakeValidator.negative_case_missing_candidate_id_fails -ne $true -or $lampThirdSampleHumanApprovalIntakeValidator.negative_case_missing_artifact_hash_fails -ne $true -or $lampThirdSampleHumanApprovalIntakeValidator.negative_case_wrong_category_fails -ne $true -or $lampThirdSampleHumanApprovalIntakeValidator.negative_case_broad_write_scope_fails -ne $true -or $lampThirdSampleHumanApprovalIntakeValidator.negative_case_external_action_flag_fails -ne $true -or $lampThirdSampleHumanApprovalIntakeValidator.negative_case_premature_registration_ready_fails -ne $true -or $lampThirdSampleHumanApprovalIntakeValidator.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.214 must fail missing-reviewer, missing-candidate, missing-hash, wrong-category, broad-scope, external-action, premature-ready, and runtime negative cases"
    }
  }

  $thirdSampleAcceptedSamplesPostApprovalGateAlignmentOutput = & node (Join-Path $Root 'scripts/validate_v14_215_third_sample_accepted_samples_post_approval_gate_alignment.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Third sample accepted_samples post-approval gate alignment validation exited with failure"
  } else {
    $thirdSampleAcceptedSamplesPostApprovalGateAlignment = ($thirdSampleAcceptedSamplesPostApprovalGateAlignmentOutput -join "`n") | ConvertFrom-Json
    if ($thirdSampleAcceptedSamplesPostApprovalGateAlignment.passed -ne $true) {
      Add-Failure "Third sample accepted_samples post-approval gate alignment validation must pass"
    }
    if ($thirdSampleAcceptedSamplesPostApprovalGateAlignment.v14_214_intake_validator_passed -ne $true -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.future_registration_requires_v14_214_user_submission -ne $true) {
      Add-Failure "v14.215 must require the v14.214 intake validator before future registration"
    }
    if ($thirdSampleAcceptedSamplesPostApprovalGateAlignment.gate_status -ne 'blocked' -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.current_registration_blocker -ne 'human_approval_missing') {
      Add-Failure "v14.215 must preserve the current human approval blocker"
    }
    if ($thirdSampleAcceptedSamplesPostApprovalGateAlignment.approval_statement_source_is_user_submission -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.human_approval_captured_now -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.accepted_samples_registration_ready_now -ne $false) {
      Add-Failure "v14.215 must not overclaim user-submitted approval, captured approval, or registration readiness"
    }
    if ($thirdSampleAcceptedSamplesPostApprovalGateAlignment.post_approval_gate_alignment_only -ne $true -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.staged_file_count -ne 0) {
      Add-Failure "v14.215 must remain a gate-alignment-only local validation with no staged files"
    }
    if ($thirdSampleAcceptedSamplesPostApprovalGateAlignment.accepted_samples_write_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.category_index_write_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.failure_samples_write_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.production_candidate_write_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.daily_note_write_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.215 must not write accepted/category/failure/production/memory surfaces"
    }
    if ($thirdSampleAcceptedSamplesPostApprovalGateAlignment.provider_contact_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.plugin_call_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.api_call_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.mcp_runtime_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.image_generation_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.env_or_secret_read_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.real_manifest_read_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.real_vcpchat_read_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.215 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($thirdSampleAcceptedSamplesPostApprovalGateAlignment.commit_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.push_tag_release_deploy_performed -ne $false -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.215 must not commit, push, deploy, or claim VCP runtime integration"
    }
    if ($thirdSampleAcceptedSamplesPostApprovalGateAlignment.negative_case_missing_v14_214_requirement_fails -ne $true -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.negative_case_user_submission_overclaim_fails -ne $true -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.negative_case_human_approval_overclaim_fails -ne $true -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.negative_case_registration_ready_overclaim_fails -ne $true -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.negative_case_broad_allowed_files_fails -ne $true -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.negative_case_accepted_samples_write_flag_fails -ne $true -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.negative_case_external_action_flag_fails -ne $true -or $thirdSampleAcceptedSamplesPostApprovalGateAlignment.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.215 must fail missing-v14.214-requirement, overclaim, broad-scope, write, external-action, and runtime negative cases"
    }
  }

  $reviewConsolePostApprovalGateStaticPanelOutput = & node (Join-Path $Root 'scripts/validate_v14_216_review_console_post_approval_gate_static_panel.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console post-approval gate static panel validation exited with failure"
  } else {
    $reviewConsolePostApprovalGateStaticPanel = ($reviewConsolePostApprovalGateStaticPanelOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsolePostApprovalGateStaticPanel.passed -ne $true) {
      Add-Failure "Review Console post-approval gate static panel validation must pass"
    }
    if ($reviewConsolePostApprovalGateStaticPanel.draft_output_key -ne 'third_sample_post_approval_gate_state' -or $reviewConsolePostApprovalGateStaticPanel.static_panel_only -ne $true) {
      Add-Failure "v14.216 must expose only the static third_sample_post_approval_gate_state"
    }
    if ($reviewConsolePostApprovalGateStaticPanel.gate_status -ne 'blocked' -or $reviewConsolePostApprovalGateStaticPanel.blocker -ne 'human_approval_missing' -or $reviewConsolePostApprovalGateStaticPanel.future_registration_requires_v14_214_user_submission -ne $true) {
      Add-Failure "v14.216 must preserve the v14.215 human approval blocker and v14.214 intake requirement"
    }
    if ($reviewConsolePostApprovalGateStaticPanel.approval_statement_source_is_user_submission -ne $false -or $reviewConsolePostApprovalGateStaticPanel.human_approval_captured_now -ne $false -or $reviewConsolePostApprovalGateStaticPanel.accepted_samples_registration_ready_now -ne $false) {
      Add-Failure "v14.216 must not overclaim user-submitted approval, captured approval, or registration readiness"
    }
    if ($reviewConsolePostApprovalGateStaticPanel.accepted_samples_write_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.category_index_write_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.failure_samples_write_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.production_candidate_write_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.daily_note_write_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.216 must not write accepted/category/failure/production/memory surfaces"
    }
    if ($reviewConsolePostApprovalGateStaticPanel.provider_contact_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.plugin_call_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.api_call_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.mcp_runtime_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.image_generation_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.env_or_secret_read_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.real_manifest_read_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.real_vcpchat_read_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.216 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($reviewConsolePostApprovalGateStaticPanel.push_tag_release_deploy_performed -ne $false -or $reviewConsolePostApprovalGateStaticPanel.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.216 must not push, deploy, or claim VCP runtime integration"
    }
    if ($reviewConsolePostApprovalGateStaticPanel.negative_case_missing_v14_215_source_fails -ne $true -or $reviewConsolePostApprovalGateStaticPanel.negative_case_user_submission_overclaim_fails -ne $true -or $reviewConsolePostApprovalGateStaticPanel.negative_case_human_approval_overclaim_fails -ne $true -or $reviewConsolePostApprovalGateStaticPanel.negative_case_registration_ready_overclaim_fails -ne $true -or $reviewConsolePostApprovalGateStaticPanel.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsolePostApprovalGateStaticPanel.negative_case_external_action_flag_fails -ne $true -or $reviewConsolePostApprovalGateStaticPanel.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.216 must fail missing-source, approval-overclaim, registration-ready, write, external-action, and runtime negative cases"
    }
  }

  $reviewConsolePostApprovalGateSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_217_review_console_post_approval_gate_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console post-approval gate snapshot validation exited with failure"
  } else {
    $reviewConsolePostApprovalGateSnapshot = ($reviewConsolePostApprovalGateSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsolePostApprovalGateSnapshot.passed -ne $true) {
      Add-Failure "Review Console post-approval gate snapshot validation must pass"
    }
    if ($reviewConsolePostApprovalGateSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $reviewConsolePostApprovalGateSnapshot.draft_output_key -ne 'third_sample_post_approval_gate_state' -or $reviewConsolePostApprovalGateSnapshot.static_snapshot_only -ne $true) {
      Add-Failure "v14.217 must preserve the golden static snapshot for third_sample_post_approval_gate_state"
    }
    if ($reviewConsolePostApprovalGateSnapshot.gate_status -ne 'blocked' -or $reviewConsolePostApprovalGateSnapshot.blocker -ne 'human_approval_missing' -or $reviewConsolePostApprovalGateSnapshot.future_registration_requires_v14_214_user_submission -ne $true) {
      Add-Failure "v14.217 must keep the post-approval gate blocked on v14.214 user-submission approval"
    }
    if ($reviewConsolePostApprovalGateSnapshot.approval_statement_source_is_user_submission -ne $false -or $reviewConsolePostApprovalGateSnapshot.human_approval_captured_now -ne $false -or $reviewConsolePostApprovalGateSnapshot.accepted_samples_registration_ready_now -ne $false) {
      Add-Failure "v14.217 must not overclaim approval source, captured approval, or registration readiness"
    }
    if ($reviewConsolePostApprovalGateSnapshot.accepted_samples_write_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.category_index_write_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.failure_samples_write_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.production_candidate_write_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.daily_note_write_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.217 must not write accepted/category/failure/production/memory surfaces"
    }
    if ($reviewConsolePostApprovalGateSnapshot.provider_contact_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.plugin_call_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.api_call_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.mcp_runtime_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.image_generation_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.env_or_secret_read_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.real_manifest_read_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.217 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($reviewConsolePostApprovalGateSnapshot.push_tag_release_deploy_performed -ne $false -or $reviewConsolePostApprovalGateSnapshot.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.217 must not push, deploy, or claim VCP runtime integration"
    }
    if ($reviewConsolePostApprovalGateSnapshot.negative_case_missing_v14_216_source_fails -ne $true -or $reviewConsolePostApprovalGateSnapshot.negative_case_user_submission_overclaim_fails -ne $true -or $reviewConsolePostApprovalGateSnapshot.negative_case_human_approval_overclaim_fails -ne $true -or $reviewConsolePostApprovalGateSnapshot.negative_case_registration_ready_overclaim_fails -ne $true -or $reviewConsolePostApprovalGateSnapshot.negative_case_required_count_drift_fails -ne $true -or $reviewConsolePostApprovalGateSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $reviewConsolePostApprovalGateSnapshot.negative_case_external_action_flag_fails -ne $true -or $reviewConsolePostApprovalGateSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.217 must fail missing-source, approval-overclaim, count-drift, write, external-action, and runtime negative cases"
    }
  }

  $humanApprovalBlockerQueueOutput = & node (Join-Path $Root 'scripts/validate_v14_218_review_console_human_approval_blocker_queue_static_panel.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console human approval blocker queue validation exited with failure"
  } else {
    $humanApprovalBlockerQueue = ($humanApprovalBlockerQueueOutput -join "`n") | ConvertFrom-Json
    if ($humanApprovalBlockerQueue.passed -ne $true) {
      Add-Failure "Review Console human approval blocker queue validation must pass"
    }
    if ($humanApprovalBlockerQueue.draft_output_key -ne 'human_approval_blocker_queue_state' -or $humanApprovalBlockerQueue.queue_status -ne 'active_blocker_queue' -or $humanApprovalBlockerQueue.total_blockers -ne 1) {
      Add-Failure "v14.218 must expose exactly one active human approval blocker queue state"
    }
    if ($humanApprovalBlockerQueue.blocker_type -ne 'human_approval_missing' -or $humanApprovalBlockerQueue.target_candidate_id -ne 'v14_166_lamp_v3_generated_candidate_001') {
      Add-Failure "v14.218 must keep the lamp third sample blocked on human_approval_missing"
    }
    if ($humanApprovalBlockerQueue.approval_statement_source_is_user_submission -ne $false -or $humanApprovalBlockerQueue.human_approval_captured_now -ne $false -or $humanApprovalBlockerQueue.accepted_samples_registration_ready_now -ne $false -or $humanApprovalBlockerQueue.next_write_action_allowed_now -ne $false) {
      Add-Failure "v14.218 must not overclaim approval, registration readiness, or write permission"
    }
    if ($humanApprovalBlockerQueue.static_panel_only -ne $true -or $humanApprovalBlockerQueue.read_only_queue -ne $true -or $humanApprovalBlockerQueue.approval_capture_performed -ne $false) {
      Add-Failure "v14.218 must remain a read-only static queue and must not capture approval"
    }
    if ($humanApprovalBlockerQueue.accepted_samples_write_performed -ne $false -or $humanApprovalBlockerQueue.category_index_write_performed -ne $false -or $humanApprovalBlockerQueue.failure_samples_write_performed -ne $false -or $humanApprovalBlockerQueue.production_candidate_write_performed -ne $false -or $humanApprovalBlockerQueue.daily_note_write_performed -ne $false -or $humanApprovalBlockerQueue.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.218 must not write accepted/category/failure/production/memory surfaces"
    }
    if ($humanApprovalBlockerQueue.provider_contact_performed -ne $false -or $humanApprovalBlockerQueue.plugin_call_performed -ne $false -or $humanApprovalBlockerQueue.api_call_performed -ne $false -or $humanApprovalBlockerQueue.mcp_runtime_performed -ne $false -or $humanApprovalBlockerQueue.image_generation_performed -ne $false -or $humanApprovalBlockerQueue.env_or_secret_read_performed -ne $false -or $humanApprovalBlockerQueue.real_manifest_read_performed -ne $false -or $humanApprovalBlockerQueue.real_vcpchat_read_performed -ne $false -or $humanApprovalBlockerQueue.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.218 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($humanApprovalBlockerQueue.push_tag_release_deploy_performed -ne $false -or $humanApprovalBlockerQueue.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.218 must not push, deploy, or claim VCP runtime integration"
    }
    if ($humanApprovalBlockerQueue.negative_case_missing_v14_217_source_fails -ne $true -or $humanApprovalBlockerQueue.negative_case_blocker_count_mismatch_fails -ne $true -or $humanApprovalBlockerQueue.negative_case_approval_capture_overclaim_fails -ne $true -or $humanApprovalBlockerQueue.negative_case_human_approval_overclaim_fails -ne $true -or $humanApprovalBlockerQueue.negative_case_registration_ready_overclaim_fails -ne $true -or $humanApprovalBlockerQueue.negative_case_next_write_action_allowed_fails -ne $true -or $humanApprovalBlockerQueue.negative_case_accepted_samples_write_flag_fails -ne $true -or $humanApprovalBlockerQueue.negative_case_external_action_flag_fails -ne $true -or $humanApprovalBlockerQueue.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.218 must fail missing-source, count mismatch, approval-overclaim, write, external-action, and runtime negative cases"
    }
  }

  $humanApprovalBlockerQueueSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_219_review_console_human_approval_blocker_queue_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console human approval blocker queue snapshot validation exited with failure"
  } else {
    $humanApprovalBlockerQueueSnapshot = ($humanApprovalBlockerQueueSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($humanApprovalBlockerQueueSnapshot.passed -ne $true) {
      Add-Failure "Review Console human approval blocker queue snapshot validation must pass"
    }
    if ($humanApprovalBlockerQueueSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $humanApprovalBlockerQueueSnapshot.draft_output_key -ne 'human_approval_blocker_queue_state' -or $humanApprovalBlockerQueueSnapshot.queue_status -ne 'active_blocker_queue' -or $humanApprovalBlockerQueueSnapshot.total_blockers -ne 1) {
      Add-Failure "v14.219 must preserve the golden static snapshot for human_approval_blocker_queue_state"
    }
    if ($humanApprovalBlockerQueueSnapshot.blocker_type -ne 'human_approval_missing' -or $humanApprovalBlockerQueueSnapshot.target_candidate_id -ne 'v14_166_lamp_v3_generated_candidate_001') {
      Add-Failure "v14.219 must keep the lamp third sample blocked on human_approval_missing"
    }
    if ($humanApprovalBlockerQueueSnapshot.approval_statement_source_is_user_submission -ne $false -or $humanApprovalBlockerQueueSnapshot.human_approval_captured_now -ne $false -or $humanApprovalBlockerQueueSnapshot.accepted_samples_registration_ready_now -ne $false -or $humanApprovalBlockerQueueSnapshot.next_write_action_allowed_now -ne $false) {
      Add-Failure "v14.219 must not overclaim approval, registration readiness, or write permission"
    }
    if ($humanApprovalBlockerQueueSnapshot.static_snapshot_only -ne $true -or $humanApprovalBlockerQueueSnapshot.read_only_queue -ne $true -or $humanApprovalBlockerQueueSnapshot.approval_capture_performed -ne $false) {
      Add-Failure "v14.219 must remain a read-only static snapshot and must not capture approval"
    }
    if ($humanApprovalBlockerQueueSnapshot.accepted_samples_write_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.category_index_write_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.failure_samples_write_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.production_candidate_write_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.daily_note_write_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.219 must not write accepted/category/failure/production/memory surfaces"
    }
    if ($humanApprovalBlockerQueueSnapshot.provider_contact_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.plugin_call_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.api_call_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.mcp_runtime_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.image_generation_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.env_or_secret_read_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.real_manifest_read_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.real_vcpchat_read_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.219 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($humanApprovalBlockerQueueSnapshot.push_tag_release_deploy_performed -ne $false -or $humanApprovalBlockerQueueSnapshot.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.219 must not push, deploy, or claim VCP runtime integration"
    }
    if ($humanApprovalBlockerQueueSnapshot.negative_case_missing_v14_218_source_fails -ne $true -or $humanApprovalBlockerQueueSnapshot.negative_case_blocker_count_mismatch_fails -ne $true -or $humanApprovalBlockerQueueSnapshot.negative_case_approval_capture_overclaim_fails -ne $true -or $humanApprovalBlockerQueueSnapshot.negative_case_human_approval_overclaim_fails -ne $true -or $humanApprovalBlockerQueueSnapshot.negative_case_registration_ready_overclaim_fails -ne $true -or $humanApprovalBlockerQueueSnapshot.negative_case_next_write_action_allowed_fails -ne $true -or $humanApprovalBlockerQueueSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $humanApprovalBlockerQueueSnapshot.negative_case_external_action_flag_fails -ne $true -or $humanApprovalBlockerQueueSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.219 must fail missing-source, count mismatch, approval-overclaim, write, external-action, and runtime negative cases"
    }
  }

  $agentBoardCurrentRecommendationAlignmentOutput = & node (Join-Path $Root 'scripts/validate_v14_220_agent_board_current_recommendation_alignment.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Agent board current recommendation alignment validation exited with failure"
  } else {
    $agentBoardCurrentRecommendationAlignment = ($agentBoardCurrentRecommendationAlignmentOutput -join "`n") | ConvertFrom-Json
    if ($agentBoardCurrentRecommendationAlignment.passed -ne $true) {
      Add-Failure "Agent board current recommendation alignment validation must pass"
    }
    if ($agentBoardCurrentRecommendationAlignment.phase -ne 'v14_220_agent_board_current_recommendation_alignment' -or $agentBoardCurrentRecommendationAlignment.source_completed_phase -ne 'v14_219_review_console_human_approval_blocker_queue_snapshot_static_regression') {
      Add-Failure "v14.220 must align from the completed v14.219 snapshot phase"
    }
    if ($agentBoardCurrentRecommendationAlignment.recommended_next -ne 'wait_for_jenn_human_approval_or_continue_review_console_static_productization') {
      Add-Failure "v14.220 must replace stale v14.218 recommended_next with the current human approval/static productization route"
    }
    if ($agentBoardCurrentRecommendationAlignment.human_approval_captured_now -ne $false -or $agentBoardCurrentRecommendationAlignment.accepted_samples_write_allowed_now -ne $false) {
      Add-Failure "v14.220 must not overclaim human approval or accepted_samples write permission"
    }
    if ($agentBoardCurrentRecommendationAlignment.agent_board_alignment_only -ne $true -or $agentBoardCurrentRecommendationAlignment.accepted_samples_write_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.daily_note_write_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.220 must remain board alignment only and must not write accepted_samples or memory surfaces"
    }
    if ($agentBoardCurrentRecommendationAlignment.provider_contact_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.plugin_call_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.api_call_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.mcp_runtime_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.image_generation_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.env_or_secret_read_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.real_manifest_read_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.real_vcpchat_read_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.220 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($agentBoardCurrentRecommendationAlignment.push_tag_release_deploy_performed -ne $false -or $agentBoardCurrentRecommendationAlignment.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.220 must not push, deploy, or claim VCP runtime integration"
    }
    if ($agentBoardCurrentRecommendationAlignment.negative_case_stale_v14_218_recommendation_fails -ne $true -or $agentBoardCurrentRecommendationAlignment.negative_case_approval_capture_overclaim_fails -ne $true -or $agentBoardCurrentRecommendationAlignment.negative_case_accepted_samples_write_allowed_fails -ne $true -or $agentBoardCurrentRecommendationAlignment.negative_case_runtime_claim_fails -ne $true -or $agentBoardCurrentRecommendationAlignment.negative_case_external_action_flag_fails -ne $true) {
      Add-Failure "v14.220 must fail stale recommendation, approval/write overclaim, runtime, and external-action negative cases"
    }
  }

  $recoverabilityMatrixOutput = & node (Join-Path $Root 'scripts/validate_v14_221_review_console_recoverability_matrix_static_workbench.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console recoverability matrix validation exited with failure"
  } else {
    $recoverabilityMatrix = ($recoverabilityMatrixOutput -join "`n") | ConvertFrom-Json
    if ($recoverabilityMatrix.passed -ne $true) {
      Add-Failure "Review Console recoverability matrix validation must pass"
    }
    if ($recoverabilityMatrix.phase -ne 'v14_221_review_console_recoverability_matrix_static_workbench' -or $recoverabilityMatrix.draft_output_key -ne 'recoverability_matrix_state') {
      Add-Failure "v14.221 must expose the recoverability_matrix_state draft output"
    }
    if ($recoverabilityMatrix.row_count -ne 3 -or $recoverabilityMatrix.complete_recoverable_sample_count -ne 2 -or $recoverabilityMatrix.blocked_registration_candidate_count -ne 1 -or $recoverabilityMatrix.remaining_full_recoverable_sample_gap -ne 1) {
      Add-Failure "v14.221 must show 2 complete recoverable samples, 1 blocked candidate, and 1 remaining gap"
    }
    if ($recoverabilityMatrix.matrix_status -ne 'blocked_by_human_approval_missing' -or $recoverabilityMatrix.pending_candidate_counted_as_accepted -ne $false) {
      Add-Failure "v14.221 must keep the lamp pending candidate out of accepted sample count"
    }
    if ($recoverabilityMatrix.accepted_samples_write_performed -ne $false -or $recoverabilityMatrix.production_candidate_write_performed -ne $false -or $recoverabilityMatrix.daily_note_write_performed -ne $false -or $recoverabilityMatrix.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.221 must not write accepted_samples, production candidate, DailyNote, or VCP memory"
    }
    if ($recoverabilityMatrix.provider_contact_performed -ne $false -or $recoverabilityMatrix.plugin_call_performed -ne $false -or $recoverabilityMatrix.api_call_performed -ne $false -or $recoverabilityMatrix.mcp_runtime_performed -ne $false -or $recoverabilityMatrix.image_generation_performed -ne $false -or $recoverabilityMatrix.env_or_secret_read_performed -ne $false -or $recoverabilityMatrix.real_manifest_read_performed -ne $false -or $recoverabilityMatrix.real_vcpchat_read_performed -ne $false -or $recoverabilityMatrix.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.221 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($recoverabilityMatrix.push_tag_release_deploy_performed -ne $false -or $recoverabilityMatrix.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.221 must not push, deploy, or claim VCP runtime integration"
    }
    if ($recoverabilityMatrix.negative_case_missing_required_field_fails -ne $true -or $recoverabilityMatrix.negative_case_pending_candidate_counted_as_accepted_fails -ne $true -or $recoverabilityMatrix.negative_case_human_approval_overclaim_fails -ne $true -or $recoverabilityMatrix.negative_case_accepted_samples_write_flag_fails -ne $true -or $recoverabilityMatrix.negative_case_external_action_flag_fails -ne $true -or $recoverabilityMatrix.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.221 must fail field, pending-count, approval, write, external-action, and runtime negative cases"
    }
  }

  $recoverabilityMatrixSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_222_review_console_recoverability_matrix_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console recoverability matrix snapshot validation exited with failure"
  } else {
    $recoverabilityMatrixSnapshot = ($recoverabilityMatrixSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($recoverabilityMatrixSnapshot.passed -ne $true) {
      Add-Failure "Review Console recoverability matrix snapshot validation must pass"
    }
    if ($recoverabilityMatrixSnapshot.phase -ne 'v14_222_review_console_recoverability_matrix_snapshot_static_regression' -or $recoverabilityMatrixSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $recoverabilityMatrixSnapshot.draft_output_key -ne 'recoverability_matrix_state') {
      Add-Failure "v14.222 must freeze recoverability_matrix_state as a golden static snapshot"
    }
    if ($recoverabilityMatrixSnapshot.row_count -ne 3 -or $recoverabilityMatrixSnapshot.complete_recoverable_sample_count -ne 2 -or $recoverabilityMatrixSnapshot.blocked_registration_candidate_count -ne 1 -or $recoverabilityMatrixSnapshot.remaining_full_recoverable_sample_gap -ne 1) {
      Add-Failure "v14.222 must preserve the 2 complete plus 1 blocked recoverability matrix"
    }
    if ($recoverabilityMatrixSnapshot.matrix_status -ne 'blocked_by_human_approval_missing' -or $recoverabilityMatrixSnapshot.pending_candidate_counted_as_accepted -ne $false -or $recoverabilityMatrixSnapshot.blocker -ne 'human_approval_missing') {
      Add-Failure "v14.222 must preserve the lamp human approval blocker and prevent pending candidate acceptance overclaim"
    }
    if ($recoverabilityMatrixSnapshot.accepted_samples_write_performed -ne $false -or $recoverabilityMatrixSnapshot.production_candidate_write_performed -ne $false -or $recoverabilityMatrixSnapshot.daily_note_write_performed -ne $false -or $recoverabilityMatrixSnapshot.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.222 must not write accepted_samples, production candidate, DailyNote, or VCP memory"
    }
    if ($recoverabilityMatrixSnapshot.provider_contact_performed -ne $false -or $recoverabilityMatrixSnapshot.plugin_call_performed -ne $false -or $recoverabilityMatrixSnapshot.api_call_performed -ne $false -or $recoverabilityMatrixSnapshot.mcp_runtime_performed -ne $false -or $recoverabilityMatrixSnapshot.image_generation_performed -ne $false -or $recoverabilityMatrixSnapshot.env_or_secret_read_performed -ne $false -or $recoverabilityMatrixSnapshot.real_manifest_read_performed -ne $false -or $recoverabilityMatrixSnapshot.real_vcpchat_read_performed -ne $false -or $recoverabilityMatrixSnapshot.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.222 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($recoverabilityMatrixSnapshot.push_tag_release_deploy_performed -ne $false -or $recoverabilityMatrixSnapshot.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.222 must not push, deploy, or claim VCP runtime integration"
    }
    if ($recoverabilityMatrixSnapshot.negative_case_three_sample_overclaim_fails -ne $true -or $recoverabilityMatrixSnapshot.negative_case_pending_candidate_counted_as_accepted_fails -ne $true -or $recoverabilityMatrixSnapshot.negative_case_human_approval_overclaim_fails -ne $true -or $recoverabilityMatrixSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $recoverabilityMatrixSnapshot.negative_case_external_action_flag_fails -ne $true -or $recoverabilityMatrixSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.222 must fail count, pending-count, approval, write, external-action, and runtime negative cases"
    }
  }

  $schemaBindingCoverageOutput = & node (Join-Path $Root 'scripts/validate_v14_223_review_console_schema_binding_coverage_static_panel.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console schema binding coverage validation exited with failure"
  } else {
    $schemaBindingCoverage = ($schemaBindingCoverageOutput -join "`n") | ConvertFrom-Json
    if ($schemaBindingCoverage.passed -ne $true) {
      Add-Failure "Review Console schema binding coverage validation must pass"
    }
    if ($schemaBindingCoverage.phase -ne 'v14_223_review_console_schema_binding_coverage_static_panel' -or $schemaBindingCoverage.draft_output_key -ne 'review_console_schema_binding_coverage_state' -or $schemaBindingCoverage.execution_mode -ne 'review_console_static_schema_binding_coverage_only') {
      Add-Failure "v14.223 must expose review_console_schema_binding_coverage_state as a static-only panel"
    }
    if ($schemaBindingCoverage.bound_schema_count -ne 3 -or $schemaBindingCoverage.matrix_required_field_count -ne 10 -or $schemaBindingCoverage.covered_matrix_required_field_count -ne 10 -or $schemaBindingCoverage.schema_binding_coverage_complete -ne $true) {
      Add-Failure "v14.223 must cover three schemas and all ten recoverability matrix fields"
    }
    if ($schemaBindingCoverage.binding_status -ne 'covered_static_read_only' -or $schemaBindingCoverage.pending_candidate_counted_as_accepted -ne $false -or $schemaBindingCoverage.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.223 must remain static read-only and must not count the pending lamp candidate as accepted"
    }
    if ($schemaBindingCoverage.accepted_samples_write_performed -ne $false -or $schemaBindingCoverage.production_candidate_write_performed -ne $false -or $schemaBindingCoverage.daily_note_write_performed -ne $false -or $schemaBindingCoverage.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.223 must not write accepted_samples, production candidate, DailyNote, or VCP memory"
    }
    if ($schemaBindingCoverage.provider_contact_performed -ne $false -or $schemaBindingCoverage.plugin_call_performed -ne $false -or $schemaBindingCoverage.api_call_performed -ne $false -or $schemaBindingCoverage.mcp_runtime_performed -ne $false -or $schemaBindingCoverage.image_generation_performed -ne $false -or $schemaBindingCoverage.env_or_secret_read_performed -ne $false -or $schemaBindingCoverage.real_manifest_read_performed -ne $false -or $schemaBindingCoverage.real_vcpchat_read_performed -ne $false -or $schemaBindingCoverage.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.223 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($schemaBindingCoverage.push_tag_release_deploy_performed -ne $false -or $schemaBindingCoverage.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.223 must not push, deploy, or claim VCP runtime integration"
    }
    if ($schemaBindingCoverage.negative_case_missing_bound_schema_fails -ne $true -or $schemaBindingCoverage.negative_case_missing_matrix_field_coverage_fails -ne $true -or $schemaBindingCoverage.negative_case_accepted_samples_write_flag_fails -ne $true -or $schemaBindingCoverage.negative_case_external_action_flag_fails -ne $true -or $schemaBindingCoverage.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.223 must fail missing schema, missing field coverage, write, external-action, and runtime negative cases"
    }
  }

  $schemaBindingCoverageSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_224_review_console_schema_binding_coverage_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console schema binding coverage snapshot validation exited with failure"
  } else {
    $schemaBindingCoverageSnapshot = ($schemaBindingCoverageSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($schemaBindingCoverageSnapshot.passed -ne $true) {
      Add-Failure "Review Console schema binding coverage snapshot validation must pass"
    }
    if ($schemaBindingCoverageSnapshot.phase -ne 'v14_224_review_console_schema_binding_coverage_snapshot_static_regression' -or $schemaBindingCoverageSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $schemaBindingCoverageSnapshot.draft_output_key -ne 'review_console_schema_binding_coverage_state') {
      Add-Failure "v14.224 must freeze review_console_schema_binding_coverage_state as a golden static snapshot"
    }
    if ($schemaBindingCoverageSnapshot.bound_schema_count -ne 3 -or $schemaBindingCoverageSnapshot.matrix_required_field_count -ne 10 -or $schemaBindingCoverageSnapshot.covered_matrix_required_field_count -ne 10 -or $schemaBindingCoverageSnapshot.schema_binding_coverage_complete -ne $true) {
      Add-Failure "v14.224 must preserve three schemas and full ten-field schema coverage"
    }
    if ($schemaBindingCoverageSnapshot.binding_status -ne 'covered_static_read_only' -or $schemaBindingCoverageSnapshot.pending_candidate_counted_as_accepted -ne $false -or $schemaBindingCoverageSnapshot.hard_acceptance_three_full_samples_met -ne $false) {
      Add-Failure "v14.224 must preserve static read-only coverage and prevent pending candidate acceptance overclaim"
    }
    if ($schemaBindingCoverageSnapshot.accepted_samples_write_performed -ne $false -or $schemaBindingCoverageSnapshot.production_candidate_write_performed -ne $false -or $schemaBindingCoverageSnapshot.daily_note_write_performed -ne $false -or $schemaBindingCoverageSnapshot.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.224 must not write accepted_samples, production candidate, DailyNote, or VCP memory"
    }
    if ($schemaBindingCoverageSnapshot.provider_contact_performed -ne $false -or $schemaBindingCoverageSnapshot.plugin_call_performed -ne $false -or $schemaBindingCoverageSnapshot.api_call_performed -ne $false -or $schemaBindingCoverageSnapshot.mcp_runtime_performed -ne $false -or $schemaBindingCoverageSnapshot.image_generation_performed -ne $false -or $schemaBindingCoverageSnapshot.env_or_secret_read_performed -ne $false -or $schemaBindingCoverageSnapshot.real_manifest_read_performed -ne $false -or $schemaBindingCoverageSnapshot.real_vcpchat_read_performed -ne $false -or $schemaBindingCoverageSnapshot.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.224 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($schemaBindingCoverageSnapshot.push_tag_release_deploy_performed -ne $false -or $schemaBindingCoverageSnapshot.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.224 must not push, deploy, or claim VCP runtime integration"
    }
    if ($schemaBindingCoverageSnapshot.negative_case_schema_count_drift_fails -ne $true -or $schemaBindingCoverageSnapshot.negative_case_field_coverage_drift_fails -ne $true -or $schemaBindingCoverageSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $schemaBindingCoverageSnapshot.negative_case_external_action_flag_fails -ne $true -or $schemaBindingCoverageSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.224 must fail schema-count, field-coverage, write, external-action, and runtime negative cases"
    }
  }

  $sixMonthGoalGapOutput = & node (Join-Path $Root 'scripts/validate_v14_225_review_console_six_month_goal_gap_static_panel.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console six-month goal gap validation exited with failure"
  } else {
    $sixMonthGoalGap = ($sixMonthGoalGapOutput -join "`n") | ConvertFrom-Json
    if ($sixMonthGoalGap.passed -ne $true) {
      Add-Failure "Review Console six-month goal gap validation must pass"
    }
    if ($sixMonthGoalGap.phase -ne 'v14_225_review_console_six_month_goal_gap_static_panel' -or $sixMonthGoalGap.draft_output_key -ne 'six_month_goal_gap_state' -or $sixMonthGoalGap.execution_mode -ne 'review_console_static_six_month_goal_gap_only') {
      Add-Failure "v14.225 must expose six_month_goal_gap_state as a static-only panel"
    }
    if ($sixMonthGoalGap.month_count -ne 6 -or $sixMonthGoalGap.complete_recoverable_sample_count -ne 2 -or $sixMonthGoalGap.required_full_recoverable_sample_count -ne 3 -or $sixMonthGoalGap.remaining_full_recoverable_sample_gap -ne 1) {
      Add-Failure "v14.225 must preserve the six-month map and the current 2 of 3 recoverable sample gap"
    }
    if ($sixMonthGoalGap.hard_acceptance_three_full_samples_met -ne $false -or $sixMonthGoalGap.pending_candidate_counted_as_accepted -ne $false -or $sixMonthGoalGap.overall_status -ne 'month_1_blocked_by_third_sample_human_approval') {
      Add-Failure "v14.225 must not count the pending lamp candidate or overclaim Month 1 completion"
    }
    if ($sixMonthGoalGap.accepted_samples_write_performed -ne $false -or $sixMonthGoalGap.production_candidate_write_performed -ne $false -or $sixMonthGoalGap.daily_note_write_performed -ne $false -or $sixMonthGoalGap.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.225 must not write accepted_samples, production candidate, DailyNote, or VCP memory"
    }
    if ($sixMonthGoalGap.provider_contact_performed -ne $false -or $sixMonthGoalGap.plugin_call_performed -ne $false -or $sixMonthGoalGap.api_call_performed -ne $false -or $sixMonthGoalGap.mcp_runtime_performed -ne $false -or $sixMonthGoalGap.image_generation_performed -ne $false -or $sixMonthGoalGap.env_or_secret_read_performed -ne $false -or $sixMonthGoalGap.real_manifest_read_performed -ne $false -or $sixMonthGoalGap.real_vcpchat_read_performed -ne $false -or $sixMonthGoalGap.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.225 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($sixMonthGoalGap.push_tag_release_deploy_performed -ne $false -or $sixMonthGoalGap.vcp_runtime_integration_proven -ne $false -or $sixMonthGoalGap.vcp_runtime_integration_proven_month_count -ne 0) {
      Add-Failure "v14.225 must not push, deploy, or claim VCP runtime integration"
    }
    if ($sixMonthGoalGap.negative_case_month_1_overclaim_fails -ne $true -or $sixMonthGoalGap.negative_case_pending_candidate_counted_as_accepted_fails -ne $true -or $sixMonthGoalGap.negative_case_accepted_samples_write_flag_fails -ne $true -or $sixMonthGoalGap.negative_case_external_action_flag_fails -ne $true -or $sixMonthGoalGap.negative_case_runtime_claim_fails -ne $true -or $sixMonthGoalGap.negative_case_missing_month_record_fails -ne $true) {
      Add-Failure "v14.225 must fail Month 1 overclaim, pending-count, write, external-action, runtime, and missing-month negative cases"
    }
  }

  $sixMonthGoalGapSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_226_review_console_six_month_goal_gap_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console six-month goal gap snapshot validation exited with failure"
  } else {
    $sixMonthGoalGapSnapshot = ($sixMonthGoalGapSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($sixMonthGoalGapSnapshot.passed -ne $true) {
      Add-Failure "Review Console six-month goal gap snapshot validation must pass"
    }
    if ($sixMonthGoalGapSnapshot.phase -ne 'v14_226_review_console_six_month_goal_gap_snapshot_static_regression' -or $sixMonthGoalGapSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $sixMonthGoalGapSnapshot.draft_output_key -ne 'six_month_goal_gap_state') {
      Add-Failure "v14.226 must freeze six_month_goal_gap_state as a golden static snapshot"
    }
    if ($sixMonthGoalGapSnapshot.month_count -ne 6 -or $sixMonthGoalGapSnapshot.complete_recoverable_sample_count -ne 2 -or $sixMonthGoalGapSnapshot.required_full_recoverable_sample_count -ne 3 -or $sixMonthGoalGapSnapshot.remaining_full_recoverable_sample_gap -ne 1) {
      Add-Failure "v14.226 must preserve the six-month map and current 2 of 3 recoverable sample gap"
    }
    if ($sixMonthGoalGapSnapshot.month_1_status -ne 'blocked_by_human_approval_missing' -or $sixMonthGoalGapSnapshot.month_5_status -ne 'blocked_requires_jenn_A5' -or $sixMonthGoalGapSnapshot.hard_acceptance_three_full_samples_met -ne $false -or $sixMonthGoalGapSnapshot.pending_candidate_counted_as_accepted -ne $false) {
      Add-Failure "v14.226 must preserve Month 1 human-approval blocker, Month 5 A5 blocker, and no pending accepted overclaim"
    }
    if ($sixMonthGoalGapSnapshot.accepted_samples_write_performed -ne $false -or $sixMonthGoalGapSnapshot.production_candidate_write_performed -ne $false -or $sixMonthGoalGapSnapshot.daily_note_write_performed -ne $false -or $sixMonthGoalGapSnapshot.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.226 must not write accepted_samples, production candidate, DailyNote, or VCP memory"
    }
    if ($sixMonthGoalGapSnapshot.provider_contact_performed -ne $false -or $sixMonthGoalGapSnapshot.plugin_call_performed -ne $false -or $sixMonthGoalGapSnapshot.api_call_performed -ne $false -or $sixMonthGoalGapSnapshot.mcp_runtime_performed -ne $false -or $sixMonthGoalGapSnapshot.image_generation_performed -ne $false -or $sixMonthGoalGapSnapshot.env_or_secret_read_performed -ne $false -or $sixMonthGoalGapSnapshot.real_manifest_read_performed -ne $false -or $sixMonthGoalGapSnapshot.real_vcpchat_read_performed -ne $false -or $sixMonthGoalGapSnapshot.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.226 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($sixMonthGoalGapSnapshot.push_tag_release_deploy_performed -ne $false -or $sixMonthGoalGapSnapshot.vcp_runtime_integration_proven -ne $false -or $sixMonthGoalGapSnapshot.vcp_runtime_integration_proven_month_count -ne 0) {
      Add-Failure "v14.226 must not push, deploy, or claim VCP runtime integration"
    }
    if ($sixMonthGoalGapSnapshot.negative_case_month_1_overclaim_fails -ne $true -or $sixMonthGoalGapSnapshot.negative_case_pending_candidate_counted_as_accepted_fails -ne $true -or $sixMonthGoalGapSnapshot.negative_case_accepted_samples_write_flag_fails -ne $true -or $sixMonthGoalGapSnapshot.negative_case_external_action_flag_fails -ne $true -or $sixMonthGoalGapSnapshot.negative_case_runtime_claim_fails -ne $true -or $sixMonthGoalGapSnapshot.negative_case_missing_month_count_fails -ne $true) {
      Add-Failure "v14.226 must fail Month 1 overclaim, pending-count, write, external-action, runtime, and missing-month negative cases"
    }
  }

  $failureStateWorkbenchOutput = & node (Join-Path $Root 'scripts/validate_v14_227_review_console_failure_state_static_workbench.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console failure state workbench validation exited with failure"
  } else {
    $failureStateWorkbench = ($failureStateWorkbenchOutput -join "`n") | ConvertFrom-Json
    if ($failureStateWorkbench.passed -ne $true) {
      Add-Failure "Review Console failure state workbench validation must pass"
    }
    if ($failureStateWorkbench.phase -ne 'v14_227_review_console_failure_state_static_workbench' -or $failureStateWorkbench.draft_output_key -ne 'failure_state_static_workbench_state' -or $failureStateWorkbench.execution_mode -ne 'review_console_static_failure_state_only') {
      Add-Failure "v14.227 must expose failure_state_static_workbench_state as a static-only panel"
    }
    if ($failureStateWorkbench.failure_candidate_count -ne 2 -or $failureStateWorkbench.memory_forbidden_count -ne 1 -or $failureStateWorkbench.never_production_count -ne 2 -or $failureStateWorkbench.production_exclusion_count -ne 2) {
      Add-Failure "v14.227 must preserve the negative ReviewReport failure counts"
    }
    if ($failureStateWorkbench.failure_samples_write_allowed -ne $false -or $failureStateWorkbench.failure_samples_write_performed -ne $false) {
      Add-Failure "v14.227 must not allow or perform failure_samples writes"
    }
    if ($failureStateWorkbench.production_candidate_write_performed -ne $false -or $failureStateWorkbench.daily_note_write_performed -ne $false -or $failureStateWorkbench.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.227 must not write production candidate, DailyNote, or VCP memory"
    }
    if ($failureStateWorkbench.provider_contact_performed -ne $false -or $failureStateWorkbench.plugin_call_performed -ne $false -or $failureStateWorkbench.api_call_performed -ne $false -or $failureStateWorkbench.mcp_runtime_performed -ne $false -or $failureStateWorkbench.image_generation_performed -ne $false -or $failureStateWorkbench.env_or_secret_read_performed -ne $false -or $failureStateWorkbench.real_manifest_read_performed -ne $false -or $failureStateWorkbench.real_vcpchat_read_performed -ne $false -or $failureStateWorkbench.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.227 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($failureStateWorkbench.push_tag_release_deploy_performed -ne $false -or $failureStateWorkbench.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.227 must not push, deploy, or claim VCP runtime integration"
    }
    if ($failureStateWorkbench.negative_case_missing_failure_record_fails -ne $true -or $failureStateWorkbench.negative_case_missing_memory_forbidden_fails -ne $true -or $failureStateWorkbench.negative_case_failure_samples_write_flag_fails -ne $true -or $failureStateWorkbench.negative_case_production_write_flag_fails -ne $true -or $failureStateWorkbench.negative_case_external_action_flag_fails -ne $true -or $failureStateWorkbench.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.227 must fail missing failure, missing memory-forbidden, failure write, production write, external-action, and runtime negative cases"
    }
  }

  $failureStateSnapshotOutput = & node (Join-Path $Root 'scripts/validate_v14_228_review_console_failure_state_snapshot_static_regression.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Review Console failure state snapshot validation exited with failure"
  } else {
    $failureStateSnapshot = ($failureStateSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($failureStateSnapshot.passed -ne $true) {
      Add-Failure "Review Console failure state snapshot validation must pass"
    }
    if ($failureStateSnapshot.phase -ne 'v14_228_review_console_failure_state_snapshot_static_regression' -or $failureStateSnapshot.snapshot_status -ne 'golden_static_snapshot' -or $failureStateSnapshot.draft_output_key -ne 'failure_state_static_workbench_state') {
      Add-Failure "v14.228 must freeze failure_state_static_workbench_state as a golden static snapshot"
    }
    if ($failureStateSnapshot.failure_candidate_count -ne 2 -or $failureStateSnapshot.memory_forbidden_count -ne 1 -or $failureStateSnapshot.never_production_count -ne 2 -or $failureStateSnapshot.production_exclusion_count -ne 2) {
      Add-Failure "v14.228 must preserve the negative ReviewReport failure counts"
    }
    if ($failureStateSnapshot.failure_samples_write_allowed -ne $false -or $failureStateSnapshot.failure_samples_write_performed -ne $false) {
      Add-Failure "v14.228 must not allow or perform failure_samples writes"
    }
    if ($failureStateSnapshot.production_candidate_write_performed -ne $false -or $failureStateSnapshot.daily_note_write_performed -ne $false -or $failureStateSnapshot.vcp_memory_write_performed -ne $false) {
      Add-Failure "v14.228 must not write production candidate, DailyNote, or VCP memory"
    }
    if ($failureStateSnapshot.provider_contact_performed -ne $false -or $failureStateSnapshot.plugin_call_performed -ne $false -or $failureStateSnapshot.api_call_performed -ne $false -or $failureStateSnapshot.mcp_runtime_performed -ne $false -or $failureStateSnapshot.image_generation_performed -ne $false -or $failureStateSnapshot.env_or_secret_read_performed -ne $false -or $failureStateSnapshot.real_manifest_read_performed -ne $false -or $failureStateSnapshot.real_vcpchat_read_performed -ne $false -or $failureStateSnapshot.real_vcptoolbox_read_performed -ne $false) {
      Add-Failure "v14.228 must not perform provider, plugin, API, MCP, image, secret, manifest, VCPChat, or VCPToolBox actions"
    }
    if ($failureStateSnapshot.push_tag_release_deploy_performed -ne $false -or $failureStateSnapshot.vcp_runtime_integration_proven -ne $false) {
      Add-Failure "v14.228 must not push, deploy, or claim VCP runtime integration"
    }
    if ($failureStateSnapshot.negative_case_failure_count_drift_fails -ne $true -or $failureStateSnapshot.negative_case_memory_forbidden_drift_fails -ne $true -or $failureStateSnapshot.negative_case_failure_samples_write_flag_fails -ne $true -or $failureStateSnapshot.negative_case_production_write_flag_fails -ne $true -or $failureStateSnapshot.negative_case_external_action_flag_fails -ne $true -or $failureStateSnapshot.negative_case_runtime_claim_fails -ne $true) {
      Add-Failure "v14.228 must fail failure-count drift, memory-forbidden drift, failure write, production write, external-action, and runtime negative cases"
    }
  }

  $autopilotGovernanceKernelOutput = & node (Join-Path $Root 'scripts/validate_autopilot_governance_kernel.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Smart Autopilot governance kernel validation exited with failure"
  } else {
    $autopilotGovernanceKernel = ($autopilotGovernanceKernelOutput -join "`n") | ConvertFrom-Json
    if ($autopilotGovernanceKernel.passed -ne $true -or $autopilotGovernanceKernel.phase -ne 'smart_autopilot_governance_kernel') {
      Add-Failure "Smart Autopilot governance kernel validation must pass"
    }
    if ($autopilotGovernanceKernel.default_budget_verified -ne $true -or $autopilotGovernanceKernel.amber_receipt_required -ne $true -or $autopilotGovernanceKernel.kernel_components_verified -lt 6) {
      Add-Failure "Smart Autopilot governance kernel must verify default budget, Amber receipts, and six kernel components"
    }
    if ($autopilotGovernanceKernel.receipt_registry_verified -ne $true -or $autopilotGovernanceKernel.receipt_registry_count -lt 3 -or $autopilotGovernanceKernel.cost_budget_hardening_verified -ne $true -or $autopilotGovernanceKernel.rollback_structure_verified -ne $true) {
      Add-Failure "Smart Autopilot governance kernel must verify receipt registry, cost budget hardening, and structured rollback"
    }
    if ($autopilotGovernanceKernel.no_real_a5_execution_signals -ne $true) {
      Add-Failure "Smart Autopilot governance kernel must not record real A5 execution signals"
    }
    if ($autopilotGovernanceKernel.startup_default_v3_verified -ne $true -or $autopilotGovernanceKernel.a4_8_green_lane_substrate_verified -ne $true -or $autopilotGovernanceKernel.red_lane_hard_stops_verified -ne $true) {
      Add-Failure "Smart Autopilot governance kernel must verify v3 startup default, A4.8 Green Lane substrate, and Red Lane hard stops"
    }
    if ($autopilotGovernanceKernel.provider_contact_performed -ne $false -or $autopilotGovernanceKernel.plugin_call_performed -ne $false -or $autopilotGovernanceKernel.api_call_performed -ne $false -or $autopilotGovernanceKernel.image_generation_performed -ne $false -or $autopilotGovernanceKernel.DailyNote_write_performed -ne $false -or $autopilotGovernanceKernel.VCP_memory_write_performed -ne $false) {
      Add-Failure "Smart Autopilot governance kernel must not perform provider, plugin, API, image, DailyNote, or VCP memory actions"
    }
    if ($autopilotGovernanceKernel.real_manifest_read_performed -ne $false -or $autopilotGovernanceKernel.real_vcpchat_read_performed -ne $false -or $autopilotGovernanceKernel.real_vcptoolbox_read_performed -ne $false -or $autopilotGovernanceKernel.dependency_change_performed -ne $false -or $autopilotGovernanceKernel.runtime_probe_performed -ne $false -or $autopilotGovernanceKernel.secret_value_read_performed -ne $false -or $autopilotGovernanceKernel.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "Smart Autopilot governance kernel must not perform source read, dependency, runtime, secret, push, tag, release, or deploy actions"
    }
  }

  $autopilotGoalCompilerOutput = & node (Join-Path $Root 'scripts/validate_autopilot_goal_compiler.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Autopilot Goal Compiler validation exited with failure"
  } else {
    $autopilotGoalCompiler = ($autopilotGoalCompilerOutput -join "`n") | ConvertFrom-Json
    if ($autopilotGoalCompiler.passed -ne $true -or $autopilotGoalCompiler.phase -ne 'autopilot_goal_compiler_v1') {
      Add-Failure "Autopilot Goal Compiler v1 validation must pass"
    }
    if ($autopilotGoalCompiler.doc_components_verified -lt 11 -or $autopilotGoalCompiler.task_count -lt 3 -or $autopilotGoalCompiler.validation_strategy_present -ne $true -or $autopilotGoalCompiler.stop_conditions_present -ne $true) {
      Add-Failure "Autopilot Goal Compiler v1 must verify components, at least three tasks, validation strategy, and stop conditions"
    }
    if ($autopilotGoalCompiler.amber_tasks_with_receipts_verified -lt 1 -or $autopilotGoalCompiler.rejected_red_routes_verified -lt 1 -or $autopilotGoalCompiler.red_routes_excluded_from_executable_tasks -ne $true) {
      Add-Failure "Autopilot Goal Compiler v1 must keep Amber receipts required and rejected Red routes non-executable"
    }
    if ($autopilotGoalCompiler.runtime_decomposition_verified -ne $true -or $autopilotGoalCompiler.blocked_red_items_verified -lt 1 -or $autopilotGoalCompiler.executable_task_queue_verified -ne $true -or $autopilotGoalCompiler.at_most_one_in_progress_verified -ne $true -or -not $autopilotGoalCompiler.next_safe_task_verified -or $autopilotGoalCompiler.agent_board_sync_required -ne $true) {
      Add-Failure "Autopilot Goal Compiler runtime must verify blocked Red items, executable queue, next safe task, and agent board sync"
    }
    if ($autopilotGoalCompiler.materializer_verified -ne $true -or $autopilotGoalCompiler.materialized_snapshot_verified -ne $true -or -not $autopilotGoalCompiler.materialized_snapshot_path) {
      Add-Failure "Autopilot Goal Compiler runtime must verify deterministic materializer and materialized snapshot"
    }
    if ($autopilotGoalCompiler.push_allowed_default_false -ne $true -or $autopilotGoalCompiler.no_current_external_execution_signals -ne $true) {
      Add-Failure "Autopilot Goal Compiler v1 must keep push disabled and external execution signals false"
    }
    if ($autopilotGoalCompiler.startup_default_v3_verified -ne $true -or $autopilotGoalCompiler.a4_8_green_lane_substrate_verified -ne $true -or $autopilotGoalCompiler.red_lane_hard_stops_verified -ne $true) {
      Add-Failure "Autopilot Goal Compiler v1 must verify v3 startup default, A4.8 Green Lane substrate, and Red Lane hard stops"
    }
    if ($autopilotGoalCompiler.provider_contact_performed -ne $false -or $autopilotGoalCompiler.plugin_call_performed -ne $false -or $autopilotGoalCompiler.api_call_performed -ne $false -or $autopilotGoalCompiler.image_generation_performed -ne $false -or $autopilotGoalCompiler.DailyNote_write_performed -ne $false -or $autopilotGoalCompiler.VCP_memory_write_performed -ne $false) {
      Add-Failure "Autopilot Goal Compiler v1 must not perform provider, plugin, API, image, DailyNote, or VCP memory actions"
    }
    if ($autopilotGoalCompiler.real_manifest_read_performed -ne $false -or $autopilotGoalCompiler.real_vcpchat_read_performed -ne $false -or $autopilotGoalCompiler.real_vcptoolbox_read_performed -ne $false -or $autopilotGoalCompiler.dependency_change_performed -ne $false -or $autopilotGoalCompiler.runtime_probe_performed -ne $false -or $autopilotGoalCompiler.secret_value_read_performed -ne $false -or $autopilotGoalCompiler.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "Autopilot Goal Compiler v1 must not perform source read, dependency, runtime, secret, push, tag, release, or deploy actions"
    }
  }

  $agentBoardQueueReconciliationOutput = & node (Join-Path $Root 'scripts/validate_agent_board_queue_reconciliation.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Agent board queue reconciliation validation exited with failure"
  } else {
    $agentBoardQueueReconciliation = ($agentBoardQueueReconciliationOutput -join "`n") | ConvertFrom-Json
    if ($agentBoardQueueReconciliation.passed -ne $true -or $agentBoardQueueReconciliation.phase -ne 'agent_board_queue_reconciler_v1') {
      Add-Failure "Agent board queue reconciliation must pass"
    }
    if ($agentBoardQueueReconciliation.queue_drift_detected -ne $false -or $agentBoardQueueReconciliation.result -ne 'passed' -or $agentBoardQueueReconciliation.matched_goal_id -ne $true -or -not $agentBoardQueueReconciliation.matched_next_safe_task) {
      Add-Failure "Agent board queue reconciliation must verify no drift, goal id, and next safe task"
    }
    if ($agentBoardQueueReconciliation.matched_blocked_red_items -lt 1 -or $agentBoardQueueReconciliation.missing_required_surfaces.Count -ne 0) {
      Add-Failure "Agent board queue reconciliation must verify blocked Red items and required surfaces"
    }
    if ($agentBoardQueueReconciliation.provider_contact_performed -ne $false -or $agentBoardQueueReconciliation.plugin_call_performed -ne $false -or $agentBoardQueueReconciliation.api_call_performed -ne $false -or $agentBoardQueueReconciliation.image_generation_performed -ne $false -or $agentBoardQueueReconciliation.DailyNote_write_performed -ne $false -or $agentBoardQueueReconciliation.VCP_memory_write_performed -ne $false) {
      Add-Failure "Agent board queue reconciliation must not perform provider, plugin, API, image, DailyNote, or VCP memory actions"
    }
    if ($agentBoardQueueReconciliation.real_manifest_read_performed -ne $false -or $agentBoardQueueReconciliation.real_vcpchat_read_performed -ne $false -or $agentBoardQueueReconciliation.real_vcptoolbox_read_performed -ne $false -or $agentBoardQueueReconciliation.dependency_change_performed -ne $false -or $agentBoardQueueReconciliation.runtime_probe_performed -ne $false -or $agentBoardQueueReconciliation.secret_value_read_performed -ne $false -or $agentBoardQueueReconciliation.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "Agent board queue reconciliation must not perform source read, dependency, runtime, secret, push, tag, release, or deploy actions"
    }
  }

  $nextSafeTaskOrchestratorOutput = & node (Join-Path $Root 'scripts/validate_next_safe_task_orchestrator.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Next Safe Task Orchestrator validation exited with failure"
  } else {
    $nextSafeTaskOrchestrator = ($nextSafeTaskOrchestratorOutput -join "`n") | ConvertFrom-Json
    if ($nextSafeTaskOrchestrator.passed -ne $true -or $nextSafeTaskOrchestrator.phase -ne 'next_safe_task_orchestrator_v1') {
      Add-Failure "Next Safe Task Orchestrator v1 validation must pass"
    }
    if (-not $nextSafeTaskOrchestrator.selected_next_safe_task -or $nextSafeTaskOrchestrator.eligible_executable_task_count -lt 1 -or $nextSafeTaskOrchestrator.blocked_red_items_preserved -lt 1) {
      Add-Failure "Next Safe Task Orchestrator must select a task, preserve executable tasks, and keep Red items blocked"
    }
    if ($nextSafeTaskOrchestrator.deterministic_output_verified -ne $true -or $nextSafeTaskOrchestrator.fixture_verified -ne $true -or $nextSafeTaskOrchestrator.no_real_state_write -ne $true) {
      Add-Failure "Next Safe Task Orchestrator must verify deterministic fixture output and avoid real state writes"
    }
    if ($nextSafeTaskOrchestrator.provider_contact_performed -ne $false -or $nextSafeTaskOrchestrator.plugin_call_performed -ne $false -or $nextSafeTaskOrchestrator.api_call_performed -ne $false -or $nextSafeTaskOrchestrator.image_generation_performed -ne $false -or $nextSafeTaskOrchestrator.DailyNote_write_performed -ne $false -or $nextSafeTaskOrchestrator.VCP_memory_write_performed -ne $false) {
      Add-Failure "Next Safe Task Orchestrator must not perform provider, plugin, API, image, DailyNote, or VCP memory actions"
    }
    if ($nextSafeTaskOrchestrator.real_manifest_read_performed -ne $false -or $nextSafeTaskOrchestrator.real_vcpchat_read_performed -ne $false -or $nextSafeTaskOrchestrator.real_vcptoolbox_read_performed -ne $false -or $nextSafeTaskOrchestrator.dependency_change_performed -ne $false -or $nextSafeTaskOrchestrator.runtime_probe_performed -ne $false -or $nextSafeTaskOrchestrator.secret_value_read_performed -ne $false -or $nextSafeTaskOrchestrator.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "Next Safe Task Orchestrator must not perform source read, dependency, runtime, secret, push, tag, release, or deploy actions"
    }
  }

  $amberDryRunExecutionLoopOutput = & node (Join-Path $Root 'scripts/validate_amber_dry_run_execution_loop.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Amber dry-run execution loop validation exited with failure"
  } else {
    $amberDryRunExecutionLoop = ($amberDryRunExecutionLoopOutput -join "`n") | ConvertFrom-Json
    if ($amberDryRunExecutionLoop.passed -ne $true -or $amberDryRunExecutionLoop.phase -ne 'amber_dry_run_execution_loop_v1') {
      Add-Failure "Amber dry-run execution loop v1 validation must pass"
    }
    if ($amberDryRunExecutionLoop.action_packet_verified -ne $true -or $amberDryRunExecutionLoop.receipt_verified -ne $true -or $amberDryRunExecutionLoop.registry_entry_verified -ne $true) {
      Add-Failure "Amber dry-run execution loop must verify action packet, receipt, and registry entry"
    }
    if ($amberDryRunExecutionLoop.cost_known_zero -ne $true -or $amberDryRunExecutionLoop.rollback_structured -ne $true -or $amberDryRunExecutionLoop.continuation_allowed -ne $true) {
      Add-Failure "Amber dry-run execution loop must prove known zero cost, structured rollback, and continuation"
    }
    if ($amberDryRunExecutionLoop.dry_run_scope -ne 'future_budgeted_amber_task_fixture' -or $amberDryRunExecutionLoop.amber_dry_run_matches_current_next_safe_task -ne $false -or $amberDryRunExecutionLoop.readiness_claim -ne 'future_amber_loop_fixture_validated_not_current_task_execution') {
      Add-Failure "Amber dry-run execution loop must clearly identify future fixture scope and not claim current next_safe_task execution"
    }
    if ($amberDryRunExecutionLoop.provider_contact_performed -ne $false -or $amberDryRunExecutionLoop.plugin_call_performed -ne $false -or $amberDryRunExecutionLoop.api_call_performed -ne $false -or $amberDryRunExecutionLoop.image_generation_performed -ne $false -or $amberDryRunExecutionLoop.DailyNote_write_performed -ne $false -or $amberDryRunExecutionLoop.VCP_memory_write_performed -ne $false) {
      Add-Failure "Amber dry-run execution loop must not perform provider, plugin, API, image, DailyNote, or VCP memory actions"
    }
    if ($amberDryRunExecutionLoop.real_manifest_read_performed -ne $false -or $amberDryRunExecutionLoop.real_vcpchat_read_performed -ne $false -or $amberDryRunExecutionLoop.real_vcptoolbox_read_performed -ne $false -or $amberDryRunExecutionLoop.dependency_change_performed -ne $false -or $amberDryRunExecutionLoop.runtime_probe_performed -ne $false -or $amberDryRunExecutionLoop.secret_value_read_performed -ne $false -or $amberDryRunExecutionLoop.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "Amber dry-run execution loop must not perform source read, dependency, runtime, secret, push, tag, release, or deploy actions"
    }
  }

  $autopilotEvolutionEngineOutput = & node (Join-Path $Root 'scripts/validate_autopilot_evolution_engine.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Autopilot Evolution Engine validation exited with failure"
  } else {
    $autopilotEvolutionEngine = ($autopilotEvolutionEngineOutput -join "`n") | ConvertFrom-Json
    if ($autopilotEvolutionEngine.passed -ne $true -or $autopilotEvolutionEngine.phase -ne 'autopilot_evolution_engine_v1') {
      Add-Failure "Autopilot Evolution Engine v1 validation must pass"
    }
    if ($autopilotEvolutionEngine.deterministic_output_verified -ne $true -or $autopilotEvolutionEngine.fixture_verified -ne $true -or $autopilotEvolutionEngine.detected_gap_count -lt 4) {
      Add-Failure "Autopilot Evolution Engine must verify deterministic fixture output and multiple proposals"
    }
    if ($autopilotEvolutionEngine.next_recommended_task -eq 'complete_autopilot_readiness_gate_v1' -or $autopilotEvolutionEngine.next_recommended_task_lane -notin @('Green', 'Amber') -or $autopilotEvolutionEngine.local_write_targets_only -ne $true -or $autopilotEvolutionEngine.red_lane_self_authorized -ne $false) {
      Add-Failure "Autopilot Evolution Engine must advance beyond completed readiness gate, stay local, and avoid Red self-authorization"
    }
    if ($autopilotEvolutionEngine.provider_contact_performed -ne $false -or $autopilotEvolutionEngine.plugin_call_performed -ne $false -or $autopilotEvolutionEngine.api_call_performed -ne $false -or $autopilotEvolutionEngine.image_generation_performed -ne $false -or $autopilotEvolutionEngine.DailyNote_write_performed -ne $false -or $autopilotEvolutionEngine.VCP_memory_write_performed -ne $false) {
      Add-Failure "Autopilot Evolution Engine must not perform provider, plugin, API, image, DailyNote, or VCP memory actions"
    }
    if ($autopilotEvolutionEngine.real_manifest_read_performed -ne $false -or $autopilotEvolutionEngine.real_vcpchat_read_performed -ne $false -or $autopilotEvolutionEngine.real_vcptoolbox_read_performed -ne $false -or $autopilotEvolutionEngine.dependency_change_performed -ne $false -or $autopilotEvolutionEngine.runtime_probe_performed -ne $false -or $autopilotEvolutionEngine.secret_value_read_performed -ne $false -or $autopilotEvolutionEngine.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "Autopilot Evolution Engine must not perform source read, dependency, runtime, secret, push, tag, release, or deploy actions"
    }
  }

  $completeAutopilotReadinessGateOutput = & node (Join-Path $Root 'scripts/validate_complete_autopilot_readiness_gate.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Complete Autopilot Readiness Gate validation exited with failure"
  } else {
    $completeAutopilotReadinessGate = ($completeAutopilotReadinessGateOutput -join "`n") | ConvertFrom-Json
    if ($completeAutopilotReadinessGate.passed -ne $true -or $completeAutopilotReadinessGate.phase -ne 'complete_autopilot_readiness_gate_v1') {
      Add-Failure "Complete Autopilot Readiness Gate v1 validation must pass"
    }
    if ($completeAutopilotReadinessGate.deterministic_output_verified -ne $true -or $completeAutopilotReadinessGate.fixture_verified -ne $true -or $completeAutopilotReadinessGate.invariants_verified -ne $true) {
      Add-Failure "Complete Autopilot Readiness Gate must verify deterministic fixture output and invariants"
    }
    if (-not $completeAutopilotReadinessGate.goal_id -or -not $completeAutopilotReadinessGate.route_plan_id -or -not $completeAutopilotReadinessGate.task_queue_id -or -not $completeAutopilotReadinessGate.selected_next_safe_task) {
      Add-Failure "Complete Autopilot Readiness Gate must include goal, route plan, task queue, and next safe task"
    }
    if (-not $completeAutopilotReadinessGate.amber_dry_run_receipt_id -or $completeAutopilotReadinessGate.receipt_registry_count -lt 4 -or $completeAutopilotReadinessGate.evolution_backlog_next_task -eq 'complete_autopilot_readiness_gate_v1') {
      Add-Failure "Complete Autopilot Readiness Gate must include Amber receipt, registry, and an evolution backlog that advances beyond completed readiness"
    }
    if ($completeAutopilotReadinessGate.readiness_result -ne 'passed_local_full_autopilot_ready_no_push' -or $completeAutopilotReadinessGate.amber_dry_run_matches_current_next_safe_task -ne $false -or $completeAutopilotReadinessGate.amber_readiness_claim -ne 'future_amber_loop_fixture_validated_not_current_task_execution') {
      Add-Failure "Complete Autopilot Readiness Gate must validate final closeout and scoped Amber fixture semantics"
    }
    if ($completeAutopilotReadinessGate.provider_contact_performed -ne $false -or $completeAutopilotReadinessGate.plugin_call_performed -ne $false -or $completeAutopilotReadinessGate.api_call_performed -ne $false -or $completeAutopilotReadinessGate.image_generation_performed -ne $false -or $completeAutopilotReadinessGate.DailyNote_write_performed -ne $false -or $completeAutopilotReadinessGate.VCP_memory_write_performed -ne $false) {
      Add-Failure "Complete Autopilot Readiness Gate must not perform provider, plugin, API, image, DailyNote, or VCP memory actions"
    }
    if ($completeAutopilotReadinessGate.real_manifest_read_performed -ne $false -or $completeAutopilotReadinessGate.real_vcpchat_read_performed -ne $false -or $completeAutopilotReadinessGate.real_vcptoolbox_read_performed -ne $false -or $completeAutopilotReadinessGate.dependency_change_performed -ne $false -or $completeAutopilotReadinessGate.runtime_probe_performed -ne $false -or $completeAutopilotReadinessGate.secret_value_read_performed -ne $false -or $completeAutopilotReadinessGate.push_tag_release_deploy_performed -ne $false) {
      Add-Failure "Complete Autopilot Readiness Gate must not perform source read, dependency, runtime, secret, push, tag, release, or deploy actions"
    }
  }

  . (Join-Path $PSScriptRoot 'validate_mvp_capsule_product_core.ps1')
  $capsuleProductCoreAddFailure = {
    param([string]$Message)
    Add-Failure $Message
  }
  Invoke-CapsuleProductCoreValidation -Root $Root -AddFailure $capsuleProductCoreAddFailure -Section PreRuns
  $runsBackupManifestSchemaOutput = & node (Join-Path $Root 'scripts/validate_runs_backup_manifest_schema.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Runs backup manifest schema validation exited with failure"
  } else {
    $runsBackupManifestSchema = ($runsBackupManifestSchemaOutput -join "`n") | ConvertFrom-Json
    if ($runsBackupManifestSchema.passed -ne $true -or $runsBackupManifestSchema.status -ne 'runs_backup_manifest_schema_verified') {
      Add-Failure "Runs backup manifest schema must pass"
    }
    if ($runsBackupManifestSchema.actual_runs_scan_performed -ne $false -or $runsBackupManifestSchema.runs_mutation_performed -ne $false -or $runsBackupManifestSchema.image_binary_read_performed -ne $false -or $runsBackupManifestSchema.real_image_hashing_performed -ne $false -or $runsBackupManifestSchema.preview_generation_performed -ne $false -or $runsBackupManifestSchema.cloud_drive_read_performed -ne $false -or $runsBackupManifestSchema.cloud_drive_write_performed -ne $false -or $runsBackupManifestSchema.provider_contact_performed -ne $false -or $runsBackupManifestSchema.plugin_call_performed -ne $false -or $runsBackupManifestSchema.api_call_performed -ne $false -or $runsBackupManifestSchema.DailyNote_write_performed -ne $false -or $runsBackupManifestSchema.VCP_memory_write_performed -ne $false -or $runsBackupManifestSchema.production_candidate_write_performed -ne $false) {
      Add-Failure "Runs backup manifest schema must not perform runs scan/mutation, image binary read, hashing, preview, cloud, provider/API, memory, or production actions"
    }
  }
  $runsRestoreReportDryRunSchemaOutput = & node (Join-Path $Root 'scripts/validate_runs_restore_report_dry_run_schema.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Runs restore report dry-run schema validation exited with failure"
  } else {
    $runsRestoreReportDryRunSchema = ($runsRestoreReportDryRunSchemaOutput -join "`n") | ConvertFrom-Json
    if ($runsRestoreReportDryRunSchema.passed -ne $true -or $runsRestoreReportDryRunSchema.status -ne 'runs_restore_report_dry_run_schema_verified') {
      Add-Failure "Runs restore report dry-run schema must pass"
    }
    if ($runsRestoreReportDryRunSchema.actual_runs_scan_performed -ne $false -or $runsRestoreReportDryRunSchema.runs_mutation_performed -ne $false -or $runsRestoreReportDryRunSchema.image_binary_read_performed -ne $false -or $runsRestoreReportDryRunSchema.hash_extraction_performed -ne $false -or $runsRestoreReportDryRunSchema.dimensions_extraction_performed -ne $false -or $runsRestoreReportDryRunSchema.preview_generation_performed -ne $false -or $runsRestoreReportDryRunSchema.cloud_drive_read_performed -ne $false -or $runsRestoreReportDryRunSchema.cloud_drive_write_performed -ne $false -or $runsRestoreReportDryRunSchema.provider_contact_performed -ne $false -or $runsRestoreReportDryRunSchema.plugin_call_performed -ne $false -or $runsRestoreReportDryRunSchema.api_call_performed -ne $false -or $runsRestoreReportDryRunSchema.DailyNote_write_performed -ne $false -or $runsRestoreReportDryRunSchema.VCP_memory_write_performed -ne $false -or $runsRestoreReportDryRunSchema.production_candidate_write_performed -ne $false) {
      Add-Failure "Runs restore report dry-run schema must not perform runs scan/mutation, image binary read, hash/dimensions extraction, preview, cloud, provider/API, memory, or production actions"
    }
  }
  $runsAssetVerificationReportOutput = & node (Join-Path $Root 'scripts/validate_runs_asset_verification_report.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Runs asset verification report validation exited with failure"
  } else {
    $runsAssetVerificationReport = ($runsAssetVerificationReportOutput -join "`n") | ConvertFrom-Json
    if ($runsAssetVerificationReport.passed -ne $true -or $runsAssetVerificationReport.status -ne 'runs_asset_verification_report_verified') {
      Add-Failure "Runs asset verification report must pass"
    }
    if ($runsAssetVerificationReport.exact_allowed_path_count -ne 14 -or $runsAssetVerificationReport.verified_file_count -ne 14 -or $runsAssetVerificationReport.failed_count -ne 0) {
      Add-Failure "Runs asset verification report must preserve the verified 14-image result set"
    }
    if ($runsAssetVerificationReport.image_binary_read_performed -ne $true -or $runsAssetVerificationReport.hash_extraction_performed -ne $true -or $runsAssetVerificationReport.dimensions_extraction_performed -ne $true) {
      Add-Failure "Runs asset verification report must record the authorized A5 image binary, hash, and dimensions verification"
    }
    if ($runsAssetVerificationReport.preview_generation_performed -ne $false -or $runsAssetVerificationReport.runs_mutation_performed -ne $false -or $runsAssetVerificationReport.provider_contact_performed -ne $false -or $runsAssetVerificationReport.plugin_call_performed -ne $false -or $runsAssetVerificationReport.api_call_performed -ne $false -or $runsAssetVerificationReport.DailyNote_write_performed -ne $false -or $runsAssetVerificationReport.VCP_memory_write_performed -ne $false -or $runsAssetVerificationReport.production_candidate_write_performed -ne $false) {
      Add-Failure "Runs asset verification report must not perform preview generation, runs mutation, provider/API, memory, or production actions"
    }
  }
  $fullAssetArchiveDryRunManifestOutput = & node (Join-Path $Root 'scripts/validate_full_asset_archive_dry_run_manifest.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Full asset archive dry-run manifest validation exited with failure"
  } else {
    $fullAssetArchiveDryRunManifest = ($fullAssetArchiveDryRunManifestOutput -join "`n") | ConvertFrom-Json
    if ($fullAssetArchiveDryRunManifest.passed -ne $true -or $fullAssetArchiveDryRunManifest.status -ne 'full_asset_archive_dry_run_manifest_verified') {
      Add-Failure "Full asset archive dry-run manifest must pass"
    }
    if ($fullAssetArchiveDryRunManifest.asset_count -ne 14 -or $fullAssetArchiveDryRunManifest.dry_run_only -ne $true) {
      Add-Failure "Full asset archive dry-run manifest must preserve the 14-image dry-run mapping"
    }
    if ($fullAssetArchiveDryRunManifest.dry_run_image_binary_read_performed -ne $false -or $fullAssetArchiveDryRunManifest.dry_run_hash_extraction_performed -ne $false -or $fullAssetArchiveDryRunManifest.dry_run_dimensions_extraction_performed -ne $false) {
      Add-Failure "Full asset archive dry-run manifest must not read image binaries or extract hash/dimensions during the dry run"
    }
    if ($fullAssetArchiveDryRunManifest.archive_copy_performed -ne $false -or $fullAssetArchiveDryRunManifest.runs_mutation_performed -ne $false -or $fullAssetArchiveDryRunManifest.preview_generation_performed -ne $false -or $fullAssetArchiveDryRunManifest.provider_contact_performed -ne $false -or $fullAssetArchiveDryRunManifest.plugin_call_performed -ne $false -or $fullAssetArchiveDryRunManifest.api_call_performed -ne $false -or $fullAssetArchiveDryRunManifest.DailyNote_write_performed -ne $false -or $fullAssetArchiveDryRunManifest.VCP_memory_write_performed -ne $false -or $fullAssetArchiveDryRunManifest.production_candidate_write_performed -ne $false) {
      Add-Failure "Full asset archive dry-run manifest must not copy/archive assets, mutate runs, preview-generate, call provider/API, write memory, or write production candidate"
    }
    if ($fullAssetArchiveDryRunManifest.negative_case_missing_hash_fails -ne $true -or $fullAssetArchiveDryRunManifest.negative_case_missing_dimensions_fails -ne $true -or $fullAssetArchiveDryRunManifest.negative_case_path_escape_fails -ne $true -or $fullAssetArchiveDryRunManifest.negative_case_mime_mismatch_fails -ne $true) {
      Add-Failure "Full asset archive dry-run manifest must fail missing hash, missing dimensions, path escape, and MIME mismatch cases"
    }
  }
  $durableArchiveCopyAuthorizationOutput = & node (Join-Path $Root 'scripts/validate_durable_archive_copy_authorization_package.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Durable archive copy authorization package validation exited with failure"
  } else {
    $durableArchiveCopyAuthorization = ($durableArchiveCopyAuthorizationOutput -join "`n") | ConvertFrom-Json
    if ($durableArchiveCopyAuthorization.passed -ne $true -or $durableArchiveCopyAuthorization.status -ne 'durable_archive_copy_authorization_package_verified') {
      Add-Failure "Durable archive copy authorization package must pass"
    }
    if ($durableArchiveCopyAuthorization.authorization_state -ne 'draft_not_active' -or $durableArchiveCopyAuthorization.exact_copy_pair_count -ne 14 -or $durableArchiveCopyAuthorization.max_file_count -ne 14) {
      Add-Failure "Durable archive copy authorization package must remain inactive with the exact 14-copy-pair scope"
    }
    if ($durableArchiveCopyAuthorization.durable_archive_copy_performed -ne $false -or $durableArchiveCopyAuthorization.runs_mutation_performed -ne $false -or $durableArchiveCopyAuthorization.preview_generation_performed -ne $false) {
      Add-Failure "Durable archive copy authorization package must not perform copy, runs mutation, or preview generation"
    }
    if ($durableArchiveCopyAuthorization.provider_contact_performed -ne $false -or $durableArchiveCopyAuthorization.plugin_call_performed -ne $false -or $durableArchiveCopyAuthorization.api_call_performed -ne $false -or $durableArchiveCopyAuthorization.DailyNote_write_performed -ne $false -or $durableArchiveCopyAuthorization.VCP_memory_write_performed -ne $false -or $durableArchiveCopyAuthorization.production_candidate_write_performed -ne $false) {
      Add-Failure "Durable archive copy authorization package must not perform provider/API, memory, or production actions"
    }
  }
  $durableArchiveCopyExecutionOutput = & node (Join-Path $Root 'scripts/validate_durable_archive_copy_execution_report.js')
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "Durable archive copy execution report validation exited with failure"
  } else {
    $durableArchiveCopyExecution = ($durableArchiveCopyExecutionOutput -join "`n") | ConvertFrom-Json
    if ($durableArchiveCopyExecution.passed -ne $true -or $durableArchiveCopyExecution.status -ne 'durable_archive_copy_execution_report_verified') {
      Add-Failure "Durable archive copy execution report must pass"
    }
    if ($durableArchiveCopyExecution.copied_count -ne 14 -or $durableArchiveCopyExecution.post_copy_verified_count -ne 14 -or $durableArchiveCopyExecution.failed_count -ne 0) {
      Add-Failure "Durable archive copy execution report must preserve the verified 14-image copy result set"
    }
    if ($durableArchiveCopyExecution.durable_archive_copy_performed -ne $true) {
      Add-Failure "Durable archive copy execution report must record the authorized A5 copy execution"
    }
    if ($durableArchiveCopyExecution.runs_mutation_performed -ne $false -or $durableArchiveCopyExecution.preview_generation_performed -ne $false -or $durableArchiveCopyExecution.provider_contact_performed -ne $false -or $durableArchiveCopyExecution.plugin_call_performed -ne $false -or $durableArchiveCopyExecution.api_call_performed -ne $false -or $durableArchiveCopyExecution.DailyNote_write_performed -ne $false -or $durableArchiveCopyExecution.VCP_memory_write_performed -ne $false -or $durableArchiveCopyExecution.production_candidate_write_performed -ne $false) {
      Add-Failure "Durable archive copy execution report must not perform runs mutation, preview generation, provider/API, memory, or production actions"
    }
  }
  Invoke-CapsuleProductCoreValidation -Root $Root -AddFailure $capsuleProductCoreAddFailure -Section PostRuns
  [Console]::OutputEncoding = $prevOutputEncoding
}

if ($failures.Count -gt 0) {
  Write-Host "Agent Image Lab validation failed:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Agent Image Lab validation passed." -ForegroundColor Green
