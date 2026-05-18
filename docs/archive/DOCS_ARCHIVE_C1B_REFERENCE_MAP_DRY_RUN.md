# Docs Archive C1b Reference Map Dry Run

Status: C1b dry-run reference map completed validated
Mode: A4.8 local documentation only
Source execution record: `docs/archive/DOCS_ARCHIVE_C1A_MOVE_EXECUTION_RECORD.md`
Source candidate list: `docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md`

This report maps the C1a moved paths after the physical move. It does not authorize additional file movement or reference rewriting.

## Boundary

This C1b dry run did not:

- move additional docs
- delete files
- rewrite operational references
- change validator behavior
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, or runtime
- read `.env`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Summary

| Metric | Count |
| --- | ---: |
| C1a moved candidate rows scanned | 276 |
| source paths still present | 0 |
| archive destinations present | 276 |
| old-path operational reference hits | 0 |
| old paths referenced by operational surfaces | 0 |
| archive-path operational reference hits | 0 |
| archive paths referenced by operational surfaces | 0 |

Operational scope for this dry run:

- `README.md`
- `PROJECT_MASTER_PLAN.md`
- `AGENTS.md`
- `.agent_board/`
- `scripts/`
- `tests/`
- `docs/`, excluding `docs/archive/` planning and archived records

## Bucket Distribution

| Bucket | Count |
| --- | ---: |
| numbered_legacy | 7 |
| phases/v10 | 1 |
| phases/v7 | 261 |
| phases/v8 | 7 |

## Extension Distribution

| Extension | Count |
| --- | ---: |
| .md | 239 |
| .yaml | 37 |

## Interpretation

The C1a moved files are now archive-only records. The old top-level `docs/` paths are absent as expected, all archive destinations exist, and no scanned operational surface still depends on the old paths.

Because archive-path operational references are also zero, C1b does not require immediate operational reference rewriting. Future readers should use the archive manifests and indexes rather than linking directly to individual moved historical records unless a specific audit task requires it.

## Reference Map

| # | Old path | Archive path | Bucket | Extension | Old path state | Archive path state | Old operational refs | Archive operational refs |
| ---: | --- | --- | --- | --- | --- | --- | ---: | ---: |
| 1 | docs/13_public_private_trace_policy.md | docs/archive/numbered_legacy/13_public_private_trace_policy.md | numbered_legacy | .md | absent as expected | present | 0 | 0 |
| 2 | docs/14_budget_policy.md | docs/archive/numbered_legacy/14_budget_policy.md | numbered_legacy | .md | absent as expected | present | 0 | 0 |
| 3 | docs/15_security_notes.md | docs/archive/numbered_legacy/15_security_notes.md | numbered_legacy | .md | absent as expected | present | 0 | 0 |
| 4 | docs/234_phase_g_baseline_hygiene_closeout.md | docs/archive/numbered_legacy/234_phase_g_baseline_hygiene_closeout.md | numbered_legacy | .md | absent as expected | present | 0 | 0 |
| 5 | docs/235_final_program_closeout_after_phase_i.md | docs/archive/numbered_legacy/235_final_program_closeout_after_phase_i.md | numbered_legacy | .md | absent as expected | present | 0 | 0 |
| 6 | docs/287_v7_32_accepted_sample_registry_update.md | docs/archive/numbered_legacy/287_v7_32_accepted_sample_registry_update.md | numbered_legacy | .md | absent as expected | present | 0 | 0 |
| 7 | docs/40_v1_1_to_v2_0_task_plan.md | docs/archive/numbered_legacy/40_v1_1_to_v2_0_task_plan.md | numbered_legacy | .md | absent as expected | present | 0 | 0 |
| 8 | docs/v10_016_post_push_status_sync_guard_improvement.md | docs/archive/phases/v10/v10_016_post_push_status_sync_guard_improvement.md | phases/v10 | .md | absent as expected | present | 0 | 0 |
| 9 | docs/v7_100_vcpchat_read_only_surface_runtime_closeout.yaml | docs/archive/phases/v7/v7_100_vcpchat_read_only_surface_runtime_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 10 | docs/v7_101_vcpchat_read_only_surface_evidence_report_closeout.md | docs/archive/phases/v7/v7_101_vcpchat_read_only_surface_evidence_report_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 11 | docs/v7_102_cross_repo_boundary_audit_closeout.md | docs/archive/phases/v7/v7_102_cross_repo_boundary_audit_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 12 | docs/v7_103_boundary_matrix_hardening_redaction_validator_planning_closeout.md | docs/archive/phases/v7/v7_103_boundary_matrix_hardening_redaction_validator_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 13 | docs/v7_104_redaction_validator_spec_closeout.md | docs/archive/phases/v7/v7_104_redaction_validator_spec_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 14 | docs/v7_105_boundary_matrix_schema_spec_closeout.md | docs/archive/phases/v7/v7_105_boundary_matrix_schema_spec_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 15 | docs/v7_106_boundary_matrix_yaml_draft_closeout.md | docs/archive/phases/v7/v7_106_boundary_matrix_yaml_draft_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 16 | docs/v7_107_boundary_matrix_yaml_static_review_closeout.md | docs/archive/phases/v7/v7_107_boundary_matrix_yaml_static_review_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 17 | docs/v7_108_redaction_validator_skeleton_planning_closeout.md | docs/archive/phases/v7/v7_108_redaction_validator_skeleton_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 18 | docs/v7_109_redaction_validator_skeleton_implementation_gate_closeout.md | docs/archive/phases/v7/v7_109_redaction_validator_skeleton_implementation_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 19 | docs/v7_111_redaction_validator_skeleton_static_review_closeout.md | docs/archive/phases/v7/v7_111_redaction_validator_skeleton_static_review_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 20 | docs/v7_112_validator_fixture_static_review_closeout.md | docs/archive/phases/v7/v7_112_validator_fixture_static_review_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 21 | docs/v7_113_validator_fixture_dry_run_authorization_gate_closeout.md | docs/archive/phases/v7/v7_113_validator_fixture_dry_run_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 22 | docs/v7_114_validator_fixture_dry_run_execution_closeout.md | docs/archive/phases/v7/v7_114_validator_fixture_dry_run_execution_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 23 | docs/v7_114_validator_fixture_dry_run_execution_closeout.yaml | docs/archive/phases/v7/v7_114_validator_fixture_dry_run_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 24 | docs/v7_115_validator_scan_loop_correction_planning_closeout.md | docs/archive/phases/v7/v7_115_validator_scan_loop_correction_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 25 | docs/v7_116_scan_loop_correction_implementation_gate_closeout.md | docs/archive/phases/v7/v7_116_scan_loop_correction_implementation_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 26 | docs/v7_117a_scan_loop_correction_patch_planning_closeout.md | docs/archive/phases/v7/v7_117a_scan_loop_correction_patch_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 27 | docs/v7_117b_scan_loop_correction_patch_implementation_gate_closeout.md | docs/archive/phases/v7/v7_117b_scan_loop_correction_patch_implementation_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 28 | docs/v7_118_corrected_fixture_dry_run_authorization_gate_closeout.md | docs/archive/phases/v7/v7_118_corrected_fixture_dry_run_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 29 | docs/v7_120_selected_docs_scan_authorization_gate_closeout.md | docs/archive/phases/v7/v7_120_selected_docs_scan_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 30 | docs/v7_121_selected_docs_scan_execution_closeout.md | docs/archive/phases/v7/v7_121_selected_docs_scan_execution_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 31 | docs/v7_121_selected_docs_scan_execution_closeout.yaml | docs/archive/phases/v7/v7_121_selected_docs_scan_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 32 | docs/v7_122_selected_doc_closeout_integrity_correction_planning_closeout.md | docs/archive/phases/v7/v7_122_selected_doc_closeout_integrity_correction_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 33 | docs/v7_123_closeout_integrity_correction_implementation_gate_closeout.md | docs/archive/phases/v7/v7_123_closeout_integrity_correction_implementation_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 34 | docs/v7_125_selected_docs_rescan_authorization_gate_closeout.md | docs/archive/phases/v7/v7_125_selected_docs_rescan_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 35 | docs/v7_127_controlled_long_task_chain_authorization_gate_closeout.md | docs/archive/phases/v7/v7_127_controlled_long_task_chain_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 36 | docs/v7_128_first_controlled_batch_execution_gate_closeout.md | docs/archive/phases/v7/v7_128_first_controlled_batch_execution_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 37 | docs/v7_129_first_controlled_batch_execution_closeout.md | docs/archive/phases/v7/v7_129_first_controlled_batch_execution_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 38 | docs/v7_129_first_controlled_batch_execution_closeout.yaml | docs/archive/phases/v7/v7_129_first_controlled_batch_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 39 | docs/v7_130_batch_001_markdown_closeout_integrity_correction_planning_closeout.md | docs/archive/phases/v7/v7_130_batch_001_markdown_closeout_integrity_correction_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 40 | docs/v7_131_batch_001_markdown_correction_implementation_gate_closeout.md | docs/archive/phases/v7/v7_131_batch_001_markdown_correction_implementation_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 41 | docs/v7_133_batch_001_rescan_authorization_gate_closeout.md | docs/archive/phases/v7/v7_133_batch_001_rescan_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 42 | docs/v7_134_batch_001_rescan_execution_closeout.md | docs/archive/phases/v7/v7_134_batch_001_rescan_execution_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 43 | docs/v7_134_batch_001_rescan_execution_closeout.yaml | docs/archive/phases/v7/v7_134_batch_001_rescan_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 44 | docs/v7_135_batch_001_residual_correction_planning_closeout.md | docs/archive/phases/v7/v7_135_batch_001_residual_correction_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 45 | docs/v7_136_batch_001_residual_correction_implementation_gate_closeout.md | docs/archive/phases/v7/v7_136_batch_001_residual_correction_implementation_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 46 | docs/v7_138_batch_001_final_rescan_authorization_gate_closeout.md | docs/archive/phases/v7/v7_138_batch_001_final_rescan_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 47 | docs/v7_140_batch_002_authorization_gate_closeout.md | docs/archive/phases/v7/v7_140_batch_002_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 48 | docs/v7_141_batch_002_execution_closeout.md | docs/archive/phases/v7/v7_141_batch_002_execution_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 49 | docs/v7_141_batch_002_execution_closeout.yaml | docs/archive/phases/v7/v7_141_batch_002_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 50 | docs/v7_142_batch_002_correction_planning_closeout.md | docs/archive/phases/v7/v7_142_batch_002_correction_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 51 | docs/v7_143_batch_002_permission_drift_analysis_gate_closeout.md | docs/archive/phases/v7/v7_143_batch_002_permission_drift_analysis_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 52 | docs/v7_144_batch_002_permission_drift_analysis_closeout.md | docs/archive/phases/v7/v7_144_batch_002_permission_drift_analysis_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 53 | docs/v7_145_batch_002_correction_implementation_gate_closeout.md | docs/archive/phases/v7/v7_145_batch_002_correction_implementation_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 54 | docs/v7_147_batch_002_rescan_authorization_gate_closeout.md | docs/archive/phases/v7/v7_147_batch_002_rescan_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 55 | docs/v7_149_batch_003_authorization_gate_closeout.md | docs/archive/phases/v7/v7_149_batch_003_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 56 | docs/v7_150_batch_003_execution_closeout.md | docs/archive/phases/v7/v7_150_batch_003_execution_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 57 | docs/v7_150_batch_003_execution_closeout.yaml | docs/archive/phases/v7/v7_150_batch_003_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 58 | docs/v7_151_batch_003_correction_planning_closeout.md | docs/archive/phases/v7/v7_151_batch_003_correction_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 59 | docs/v7_152_batch_003_exact_finding_recovery_gate_closeout.md | docs/archive/phases/v7/v7_152_batch_003_exact_finding_recovery_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 60 | docs/v7_153_batch_003_exact_finding_recovery_closeout.md | docs/archive/phases/v7/v7_153_batch_003_exact_finding_recovery_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 61 | docs/v7_154_batch_003_correction_implementation_gate_closeout.md | docs/archive/phases/v7/v7_154_batch_003_correction_implementation_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 62 | docs/v7_156_batch_003_rescan_authorization_gate_closeout.md | docs/archive/phases/v7/v7_156_batch_003_rescan_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 63 | docs/v7_158_batch_004_authorization_gate_closeout.md | docs/archive/phases/v7/v7_158_batch_004_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 64 | docs/v7_159_batch_004_execution_closeout.md | docs/archive/phases/v7/v7_159_batch_004_execution_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 65 | docs/v7_159_batch_004_execution_closeout.yaml | docs/archive/phases/v7/v7_159_batch_004_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 66 | docs/v7_160_batch_004_correction_planning_closeout.md | docs/archive/phases/v7/v7_160_batch_004_correction_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 67 | docs/v7_161_batch_004_correction_implementation_gate_closeout.md | docs/archive/phases/v7/v7_161_batch_004_correction_implementation_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 68 | docs/v7_163_batch_004_rescan_authorization_gate_closeout.md | docs/archive/phases/v7/v7_163_batch_004_rescan_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 69 | docs/v7_164_batch_004_rescan_execution_closeout.md | docs/archive/phases/v7/v7_164_batch_004_rescan_execution_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 70 | docs/v7_164_batch_004_rescan_execution_closeout.yaml | docs/archive/phases/v7/v7_164_batch_004_rescan_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 71 | docs/v7_165_validator_governance_chain_v1_closeout_gate_closeout.md | docs/archive/phases/v7/v7_165_validator_governance_chain_v1_closeout_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 72 | docs/v7_166_validator_governance_chain_v1_final_closeout.md | docs/archive/phases/v7/v7_166_validator_governance_chain_v1_final_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 73 | docs/v7_166_validator_governance_chain_v1_final_closeout.yaml | docs/archive/phases/v7/v7_166_validator_governance_chain_v1_final_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 74 | docs/v7_174_post_validator_governance_route_selection_gate.md | docs/archive/phases/v7/v7_174_post_validator_governance_route_selection_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 75 | docs/v7_175_allowedSummaryFields_yaml_noise_hardening_gate.md | docs/archive/phases/v7/v7_175_allowedSummaryFields_yaml_noise_hardening_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 76 | docs/v7_177_post_governance_product_route_reopen_gate.md | docs/archive/phases/v7/v7_177_post_governance_product_route_reopen_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 77 | docs/v7_178_image_workflow_product_blueprint_gate.md | docs/archive/phases/v7/v7_178_image_workflow_product_blueprint_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 78 | docs/v7_179_prompt_package_registry_blueprint_gate.md | docs/archive/phases/v7/v7_179_prompt_package_registry_blueprint_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 79 | docs/v7_180_review_console_surface_blueprint_gate.md | docs/archive/phases/v7/v7_180_review_console_surface_blueprint_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 80 | docs/v7_183_product_workflow_package_index_gate.md | docs/archive/phases/v7/v7_183_product_workflow_package_index_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 81 | docs/v7_187_commander_worker_protocol_gate.md | docs/archive/phases/v7/v7_187_commander_worker_protocol_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 82 | docs/v7_188_single_worker_trial_closeout_protocol_gate.md | docs/archive/phases/v7/v7_188_single_worker_trial_closeout_protocol_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 83 | docs/v7_189_worker_scope_escalation_guard_gate.md | docs/archive/phases/v7/v7_189_worker_scope_escalation_guard_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 84 | docs/v7_190_commander_autonomy_rules_gate.md | docs/archive/phases/v7/v7_190_commander_autonomy_rules_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 85 | docs/v7_191_commander_mode_selection_autonomy_gate.md | docs/archive/phases/v7/v7_191_commander_mode_selection_autonomy_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 86 | docs/v7_192_smart_commander_continuation_policy_gate.md | docs/archive/phases/v7/v7_192_smart_commander_continuation_policy_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 87 | docs/v7_193_guarded_auto_push_and_review_policy_gate.md | docs/archive/phases/v7/v7_193_guarded_auto_push_and_review_policy_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 88 | docs/v7_194_smart_commander_maturity_gate.md | docs/archive/phases/v7/v7_194_smart_commander_maturity_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 89 | docs/v7_195_smart_commander_backlog_selection_gate.md | docs/archive/phases/v7/v7_195_smart_commander_backlog_selection_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 90 | docs/v7_196_smart_commander_scenario_training_gate.md | docs/archive/phases/v7/v7_196_smart_commander_scenario_training_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 91 | docs/v7_197_smart_commander_training_review_gate.md | docs/archive/phases/v7/v7_197_smart_commander_training_review_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 92 | docs/v7_198_smart_commander_consolidation_plan_gate.md | docs/archive/phases/v7/v7_198_smart_commander_consolidation_plan_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 93 | docs/v7_210_static_mockup_index_and_push_readiness_gate.md | docs/archive/phases/v7/v7_210_static_mockup_index_and_push_readiness_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 94 | docs/v7_213_static_mockup_index_and_quality_stop_gate.md | docs/archive/phases/v7/v7_213_static_mockup_index_and_quality_stop_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 95 | docs/v7_217_v10_12_provider_fingerprint_index_and_stop_gate.md | docs/archive/phases/v7/v7_217_v10_12_provider_fingerprint_index_and_stop_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 96 | docs/v7_218_mainline_post_provider_briefing_backlog_gate.md | docs/archive/phases/v7/v7_218_mainline_post_provider_briefing_backlog_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 97 | docs/v7_220_release_delta_index_and_quality_stop_gate.md | docs/archive/phases/v7/v7_220_release_delta_index_and_quality_stop_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 98 | docs/v7_221_mainline_quality_stop_and_next_authorization_options_gate.md | docs/archive/phases/v7/v7_221_mainline_quality_stop_and_next_authorization_options_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 99 | docs/v7_244_state_surface_reconciliation_after_repeated_quota_failure.md | docs/archive/phases/v7/v7_244_state_surface_reconciliation_after_repeated_quota_failure.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 100 | docs/v7_245_native_doubao_syntax_and_sandbox_hardening.md | docs/archive/phases/v7/v7_245_native_doubao_syntax_and_sandbox_hardening.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 101 | docs/v7_246_no_generation_quota_or_provider_path_diagnostic_readiness_gate.md | docs/archive/phases/v7/v7_246_no_generation_quota_or_provider_path_diagnostic_readiness_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 102 | docs/v7_247_provider_path_decision_package_gate.md | docs/archive/phases/v7/v7_247_provider_path_decision_package_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 103 | docs/v7_248_generation_stop_closeout_or_route_selection_request_gate.md | docs/archive/phases/v7/v7_248_generation_stop_closeout_or_route_selection_request_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 104 | docs/v7_249_static_review_surface_product_spec_gate.md | docs/archive/phases/v7/v7_249_static_review_surface_product_spec_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 105 | docs/v7_250_review_record_template_and_status_flow_gate.md | docs/archive/phases/v7/v7_250_review_record_template_and_status_flow_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 106 | docs/v7_251_static_review_surface_acceptance_checklist_gate.md | docs/archive/phases/v7/v7_251_static_review_surface_acceptance_checklist_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 107 | docs/v7_252_static_review_surface_mockup_readiness_review_gate.md | docs/archive/phases/v7/v7_252_static_review_surface_mockup_readiness_review_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 108 | docs/v7_253_static_review_surface_mockup_spec_gate.md | docs/archive/phases/v7/v7_253_static_review_surface_mockup_spec_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 109 | docs/v7_254_static_review_surface_mockup_file_gate.md | docs/archive/phases/v7/v7_254_static_review_surface_mockup_file_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 110 | docs/v7_255_static_review_surface_mockup_acceptance_review_gate.md | docs/archive/phases/v7/v7_255_static_review_surface_mockup_acceptance_review_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 111 | docs/v7_256_static_review_surface_acceptance_patch_gate.md | docs/archive/phases/v7/v7_256_static_review_surface_acceptance_patch_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 112 | docs/v7_257_static_review_surface_quality_stop_or_next_product_decision_gate.md | docs/archive/phases/v7/v7_257_static_review_surface_quality_stop_or_next_product_decision_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 113 | docs/v7_258_product_workflow_fixture_packet_gate.md | docs/archive/phases/v7/v7_258_product_workflow_fixture_packet_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 114 | docs/v7_259_product_workflow_fixture_packet_acceptance_review_gate.md | docs/archive/phases/v7/v7_259_product_workflow_fixture_packet_acceptance_review_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 115 | docs/v7_261_human_product_route_selection_request_gate.md | docs/archive/phases/v7/v7_261_human_product_route_selection_request_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 116 | docs/v7_262_project_plugin_route_authorization_planning_gate.md | docs/archive/phases/v7/v7_262_project_plugin_route_authorization_planning_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 117 | docs/v7_264_project_plugin_A5_authorization_draft_review_gate.md | docs/archive/phases/v7/v7_264_project_plugin_A5_authorization_draft_review_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 118 | docs/v7_265_true_A5_authorization_request_gate.md | docs/archive/phases/v7/v7_265_true_A5_authorization_request_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 119 | docs/v7_268b_true_A5_minimal_real_generation_authorization_gate.md | docs/archive/phases/v7/v7_268b_true_A5_minimal_real_generation_authorization_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 120 | docs/v7_270_human_review_of_real_outputs.md | docs/archive/phases/v7/v7_270_human_review_of_real_outputs.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 121 | docs/v7_271_prompt_revision_plan_from_first_real_output.md | docs/archive/phases/v7/v7_271_prompt_revision_plan_from_first_real_output.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 122 | docs/v7_273_second_minimal_generation_trial_authorization_gate.md | docs/archive/phases/v7/v7_273_second_minimal_generation_trial_authorization_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 123 | docs/v7_275_human_review_of_second_real_outputs.md | docs/archive/phases/v7/v7_275_human_review_of_second_real_outputs.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 124 | docs/v7_276_prompt_v3_minor_refinement_and_third_trial_authorization_gate.md | docs/archive/phases/v7/v7_276_prompt_v3_minor_refinement_and_third_trial_authorization_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 125 | docs/v7_278_human_review_of_third_real_outputs.md | docs/archive/phases/v7/v7_278_human_review_of_third_real_outputs.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 126 | docs/v7_279_best_candidate_selection_or_fourth_trial_decision_gate.md | docs/archive/phases/v7/v7_279_best_candidate_selection_or_fourth_trial_decision_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 127 | docs/v7_282_human_review_of_fourth_real_outputs.md | docs/archive/phases/v7/v7_282_human_review_of_fourth_real_outputs.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 128 | docs/v7_283_candidate_acceptance_or_final_retouch_decision_gate.md | docs/archive/phases/v7/v7_283_candidate_acceptance_or_final_retouch_decision_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 129 | docs/v7_284_accepted_candidate_evidence_package.md | docs/archive/phases/v7/v7_284_accepted_candidate_evidence_package.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 130 | docs/v7_285_v7_product_loop_closeout_and_v8_route_planning_gate.md | docs/archive/phases/v7/v7_285_v7_product_loop_closeout_and_v8_route_planning_gate.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 131 | docs/v7_50_vcp_read_only_bridge_planning.md | docs/archive/phases/v7/v7_50_vcp_read_only_bridge_planning.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 132 | docs/v7_50_vcp_read_only_bridge_validation_plan.md | docs/archive/phases/v7/v7_50_vcp_read_only_bridge_validation_plan.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 133 | docs/v7_50a_vcp_read_only_bridge_local_schema_validation_execution_report.md | docs/archive/phases/v7/v7_50a_vcp_read_only_bridge_local_schema_validation_execution_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 134 | docs/v7_50ab_vcp_read_only_bridge_validation_planning_index.md | docs/archive/phases/v7/v7_50ab_vcp_read_only_bridge_validation_planning_index.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 135 | docs/v7_50b_vcp_read_only_bridge_mock_payload_validation_execution_report.md | docs/archive/phases/v7/v7_50b_vcp_read_only_bridge_mock_payload_validation_execution_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 136 | docs/v7_50c_vcp_read_only_bridge_dry_run_execution_report.md | docs/archive/phases/v7/v7_50c_vcp_read_only_bridge_dry_run_execution_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 137 | docs/v7_50c_vcp_read_only_bridge_dry_run_planning.md | docs/archive/phases/v7/v7_50c_vcp_read_only_bridge_dry_run_planning.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 138 | docs/v7_50d_vcpchat_review_console_surface_planning.md | docs/archive/phases/v7/v7_50d_vcpchat_review_console_surface_planning.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 139 | docs/v7_51_french_summer_rattan_bag_v3_production_candidate_001_plan.md | docs/archive/phases/v7/v7_51_french_summer_rattan_bag_v3_production_candidate_001_plan.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 140 | docs/v7_51d_local_read_only_adapter_runtime_implementation_report.md | docs/archive/phases/v7/v7_51d_local_read_only_adapter_runtime_implementation_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 141 | docs/v7_51d_local_read_only_adapter_runtime_implementation_result.yaml | docs/archive/phases/v7/v7_51d_local_read_only_adapter_runtime_implementation_result.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 142 | docs/v7_51i_adapter_quality_hardening_patch_report.md | docs/archive/phases/v7/v7_51i_adapter_quality_hardening_patch_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 143 | docs/v7_51i_adapter_quality_hardening_patch_result.yaml | docs/archive/phases/v7/v7_51i_adapter_quality_hardening_patch_result.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 144 | docs/v7_52f_vcptoolbox_read_only_ingestion_closeout.yaml | docs/archive/phases/v7/v7_52f_vcptoolbox_read_only_ingestion_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 145 | docs/v7_52f1_vcptoolbox_mock_call_adapter_hardening_report.md | docs/archive/phases/v7/v7_52f1_vcptoolbox_mock_call_adapter_hardening_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 146 | docs/v7_52f1_vcptoolbox_mock_call_adapter_hardening_result.yaml | docs/archive/phases/v7/v7_52f1_vcptoolbox_mock_call_adapter_hardening_result.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 147 | docs/v7_53a_e2e_read_only_integration_plan.md | docs/archive/phases/v7/v7_53a_e2e_read_only_integration_plan.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 148 | docs/v7_53a_e2e_read_only_integration_plan.yaml | docs/archive/phases/v7/v7_53a_e2e_read_only_integration_plan.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 149 | docs/v7_53b_e2e_read_only_integration_fixture_validation_report.md | docs/archive/phases/v7/v7_53b_e2e_read_only_integration_fixture_validation_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 150 | docs/v7_53b_e2e_read_only_integration_fixture_validation_result.yaml | docs/archive/phases/v7/v7_53b_e2e_read_only_integration_fixture_validation_result.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 151 | docs/v7_53c_e2e_read_only_integration_security_audit.md | docs/archive/phases/v7/v7_53c_e2e_read_only_integration_security_audit.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 152 | docs/v7_53d_e2e_read_only_integration_failure_mode_validation_report.md | docs/archive/phases/v7/v7_53d_e2e_read_only_integration_failure_mode_validation_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 153 | docs/v7_53d_e2e_read_only_integration_failure_mode_validation_result.yaml | docs/archive/phases/v7/v7_53d_e2e_read_only_integration_failure_mode_validation_result.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 154 | docs/v7_53e_e2e_read_only_integration_closeout.md | docs/archive/phases/v7/v7_53e_e2e_read_only_integration_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 155 | docs/v7_53e_e2e_read_only_integration_closeout.yaml | docs/archive/phases/v7/v7_53e_e2e_read_only_integration_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 156 | docs/v7_53f1_e2e_fixture_quality_hardening_report.md | docs/archive/phases/v7/v7_53f1_e2e_fixture_quality_hardening_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 157 | docs/v7_53f1_e2e_fixture_quality_hardening_result.yaml | docs/archive/phases/v7/v7_53f1_e2e_fixture_quality_hardening_result.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 158 | docs/v7_54a_lt06_real_vcptoolbox_read_only_dry_run_planning.md | docs/archive/phases/v7/v7_54a_lt06_real_vcptoolbox_read_only_dry_run_planning.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 159 | docs/v7_54b_lt06_real_vcptoolbox_read_only_dry_run_contract.md | docs/archive/phases/v7/v7_54b_lt06_real_vcptoolbox_read_only_dry_run_contract.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 160 | docs/v7_54c_lt06_a5_authorization_package_prepared.md | docs/archive/phases/v7/v7_54c_lt06_a5_authorization_package_prepared.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 161 | docs/v7_54d_lt06_preflight_checklist.md | docs/archive/phases/v7/v7_54d_lt06_preflight_checklist.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 162 | docs/v7_54e_lt06_execution_runbook.md | docs/archive/phases/v7/v7_54e_lt06_execution_runbook.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 163 | docs/v7_54f_lt06_safety_gates.md | docs/archive/phases/v7/v7_54f_lt06_safety_gates.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 164 | docs/v7_54g_lt06_planning_authorization_closeout.md | docs/archive/phases/v7/v7_54g_lt06_planning_authorization_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 165 | docs/v7_54g_lt06_planning_authorization_closeout.yaml | docs/archive/phases/v7/v7_54g_lt06_planning_authorization_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 166 | docs/v7_55a_cross_repo_read_only_boundary_review_plan.md | docs/archive/phases/v7/v7_55a_cross_repo_read_only_boundary_review_plan.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 167 | docs/v7_55b_agent_image_lab_boundary_summary.md | docs/archive/phases/v7/v7_55b_agent_image_lab_boundary_summary.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 168 | docs/v7_55c_vcptoolbox_read_only_boundary_review.md | docs/archive/phases/v7/v7_55c_vcptoolbox_read_only_boundary_review.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 169 | docs/v7_55d_vcpchat_surface_boundary_review.md | docs/archive/phases/v7/v7_55d_vcpchat_surface_boundary_review.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 170 | docs/v7_55e_cross_repo_risk_register.md | docs/archive/phases/v7/v7_55e_cross_repo_risk_register.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 171 | docs/v7_55f_lt06_execution_prerequisite_gap_analysis.md | docs/archive/phases/v7/v7_55f_lt06_execution_prerequisite_gap_analysis.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 172 | docs/v7_55g_cross_repo_review_decision_matrix.md | docs/archive/phases/v7/v7_55g_cross_repo_review_decision_matrix.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 173 | docs/v7_55h_cross_repo_boundary_review_closeout.md | docs/archive/phases/v7/v7_55h_cross_repo_boundary_review_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 174 | docs/v7_55h_cross_repo_boundary_review_closeout.yaml | docs/archive/phases/v7/v7_55h_cross_repo_boundary_review_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 175 | docs/v7_55i_cross_repo_review_next_actions.md | docs/archive/phases/v7/v7_55i_cross_repo_review_next_actions.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 176 | docs/v7_55i_evidence_gap_closure_closeout.md | docs/archive/phases/v7/v7_55i_evidence_gap_closure_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 177 | docs/v7_55i_evidence_gap_closure_closeout.yaml | docs/archive/phases/v7/v7_55i_evidence_gap_closure_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 178 | docs/v7_55i_evidence_gap_closure_source_availability_plan.md | docs/archive/phases/v7/v7_55i_evidence_gap_closure_source_availability_plan.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 179 | docs/v7_55i_lt06_gap_closure_decision.md | docs/archive/phases/v7/v7_55i_lt06_gap_closure_decision.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 180 | docs/v7_55i_vcpchat_source_availability_report.md | docs/archive/phases/v7/v7_55i_vcpchat_source_availability_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 181 | docs/v7_55i_vcpchat_surface_boundary_evidence_map.md | docs/archive/phases/v7/v7_55i_vcpchat_surface_boundary_evidence_map.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 182 | docs/v7_55i_vcptoolbox_read_only_boundary_evidence_map.md | docs/archive/phases/v7/v7_55i_vcptoolbox_read_only_boundary_evidence_map.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 183 | docs/v7_55i_vcptoolbox_source_availability_report.md | docs/archive/phases/v7/v7_55i_vcptoolbox_source_availability_report.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 184 | docs/v7_55j_lt06_execution_gate_update.md | docs/archive/phases/v7/v7_55j_lt06_execution_gate_update.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 185 | docs/v7_55j_vcp_deep_boundary_probe_closeout.md | docs/archive/phases/v7/v7_55j_vcp_deep_boundary_probe_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 186 | docs/v7_55j_vcp_deep_boundary_probe_closeout.yaml | docs/archive/phases/v7/v7_55j_vcp_deep_boundary_probe_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 187 | docs/v7_55j_vcp_deep_boundary_probe_plan.md | docs/archive/phases/v7/v7_55j_vcp_deep_boundary_probe_plan.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 188 | docs/v7_55j_vcp_security_risk_alignment.md | docs/archive/phases/v7/v7_55j_vcp_security_risk_alignment.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 189 | docs/v7_55j_vcpchat_pr35_surface_probe.md | docs/archive/phases/v7/v7_55j_vcpchat_pr35_surface_probe.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 190 | docs/v7_55j_vcpchat_secret_and_bridge_probe.md | docs/archive/phases/v7/v7_55j_vcpchat_secret_and_bridge_probe.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 191 | docs/v7_55j_vcptoolbox_no_write_endpoint_probe.md | docs/archive/phases/v7/v7_55j_vcptoolbox_no_write_endpoint_probe.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 192 | docs/v7_55j_vcptoolbox_writable_path_probe.md | docs/archive/phases/v7/v7_55j_vcptoolbox_writable_path_probe.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 193 | docs/v7_56a_wording_harmonization_patch.md | docs/archive/phases/v7/v7_56a_wording_harmonization_patch.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 194 | docs/v7_57a_lt06_no_write_route_probe_plan.md | docs/archive/phases/v7/v7_57a_lt06_no_write_route_probe_plan.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 195 | docs/v7_57b_exact_endpoint_or_command_candidate_matrix.md | docs/archive/phases/v7/v7_57b_exact_endpoint_or_command_candidate_matrix.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 196 | docs/v7_57c_endpoint_level_allowlist_or_no_write_gate_analysis.md | docs/archive/phases/v7/v7_57c_endpoint_level_allowlist_or_no_write_gate_analysis.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 197 | docs/v7_57d_dailynote_unreachable_proof_analysis.md | docs/archive/phases/v7/v7_57d_dailynote_unreachable_proof_analysis.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 198 | docs/v7_57e_codexmemorybridge_unreachable_proof_analysis.md | docs/archive/phases/v7/v7_57e_codexmemorybridge_unreachable_proof_analysis.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 199 | docs/v7_57f_plugin_callback_and_post_response_hook_analysis.md | docs/archive/phases/v7/v7_57f_plugin_callback_and_post_response_hook_analysis.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 200 | docs/v7_57g_lt06_a5_blocking_gate_matrix.md | docs/archive/phases/v7/v7_57g_lt06_a5_blocking_gate_matrix.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 201 | docs/v7_57h_no_write_route_unreachable_proof_closeout.md | docs/archive/phases/v7/v7_57h_no_write_route_unreachable_proof_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 202 | docs/v7_57h_no_write_route_unreachable_proof_closeout.yaml | docs/archive/phases/v7/v7_57h_no_write_route_unreachable_proof_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 203 | docs/v7_57i_next_action_recommendation.md | docs/archive/phases/v7/v7_57i_next_action_recommendation.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 204 | docs/v7_57j_long_term_evolution_plan_update.md | docs/archive/phases/v7/v7_57j_long_term_evolution_plan_update.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 205 | docs/v7_57j_long_term_evolution_plan_update.yaml | docs/archive/phases/v7/v7_57j_long_term_evolution_plan_update.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 206 | docs/v7_58a_route_identity_clarification.md | docs/archive/phases/v7/v7_58a_route_identity_clarification.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 207 | docs/v7_58b_record_memory_exclusion_proof.md | docs/archive/phases/v7/v7_58b_record_memory_exclusion_proof.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 208 | docs/v7_58c_search_memory_recall_audit_side_effect_analysis.md | docs/archive/phases/v7/v7_58c_search_memory_recall_audit_side_effect_analysis.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 209 | docs/v7_58d_memory_overview_zero_write_static_proof.md | docs/archive/phases/v7/v7_58d_memory_overview_zero_write_static_proof.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 210 | docs/v7_58e_zero_write_vs_observe_only_policy_matrix.md | docs/archive/phases/v7/v7_58e_zero_write_vs_observe_only_policy_matrix.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 211 | docs/v7_58f_lt06_route_recommendation.md | docs/archive/phases/v7/v7_58f_lt06_route_recommendation.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 212 | docs/v7_58g_route_identity_no_write_probe_closeout.md | docs/archive/phases/v7/v7_58g_route_identity_no_write_probe_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 213 | docs/v7_58h_zero_write_policy_decision_memory_overview_route_plan.md | docs/archive/phases/v7/v7_58h_zero_write_policy_decision_memory_overview_route_plan.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 214 | docs/v7_58h_zero_write_policy_decision_memory_overview_route_plan.yaml | docs/archive/phases/v7/v7_58h_zero_write_policy_decision_memory_overview_route_plan.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 215 | docs/v7_58i_memory_overview_a5_planning_closeout.md | docs/archive/phases/v7/v7_58i_memory_overview_a5_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 216 | docs/v7_58i_memory_overview_a5_planning_closeout.yaml | docs/archive/phases/v7/v7_58i_memory_overview_a5_planning_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 217 | docs/v7_58i_memory_overview_a5_planning_package.md | docs/archive/phases/v7/v7_58i_memory_overview_a5_planning_package.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 218 | docs/v7_58i_memory_overview_execution_runbook.md | docs/archive/phases/v7/v7_58i_memory_overview_execution_runbook.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 219 | docs/v7_58i_memory_overview_go_no_go_matrix.md | docs/archive/phases/v7/v7_58i_memory_overview_go_no_go_matrix.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 220 | docs/v7_58i_memory_overview_payload_contract.md | docs/archive/phases/v7/v7_58i_memory_overview_payload_contract.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 221 | docs/v7_58i_memory_overview_preflight_checklist.md | docs/archive/phases/v7/v7_58i_memory_overview_preflight_checklist.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 222 | docs/v7_58i_memory_overview_route_contract.md | docs/archive/phases/v7/v7_58i_memory_overview_route_contract.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 223 | docs/v7_58i1_memory_overview_exact_payload_and_redaction_patch.md | docs/archive/phases/v7/v7_58i1_memory_overview_exact_payload_and_redaction_patch.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 224 | docs/v7_58i1_memory_overview_exact_payload_and_redaction_patch.yaml | docs/archive/phases/v7/v7_58i1_memory_overview_exact_payload_and_redaction_patch.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 225 | docs/v7_58j_memory_overview_independent_A5_request_text_closeout.md | docs/archive/phases/v7/v7_58j_memory_overview_independent_A5_request_text_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 226 | docs/v7_58k_memory_overview_target_identity_closeout.md | docs/archive/phases/v7/v7_58k_memory_overview_target_identity_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 227 | docs/v7_59_lt06_execution_closeout_seal.md | docs/archive/phases/v7/v7_59_lt06_execution_closeout_seal.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 228 | docs/v7_59_lt06_execution_closeout_seal.yaml | docs/archive/phases/v7/v7_59_lt06_execution_closeout_seal.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 229 | docs/v7_60_vcpchat_surface_check_planning_closeout.md | docs/archive/phases/v7/v7_60_vcpchat_surface_check_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 230 | docs/v7_61_vcpchat_surface_check_authorization_package_closeout.md | docs/archive/phases/v7/v7_61_vcpchat_surface_check_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 231 | docs/v7_62_vcpchat_bridge_contract_static_review_planning_closeout.md | docs/archive/phases/v7/v7_62_vcpchat_bridge_contract_static_review_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 232 | docs/v7_63_vcpchat_bridge_contract_static_code_review_package_closeout.md | docs/archive/phases/v7/v7_63_vcpchat_bridge_contract_static_code_review_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 233 | docs/v7_64_vcpchat_bridge_contract_static_code_review_execution_closeout.md | docs/archive/phases/v7/v7_64_vcpchat_bridge_contract_static_code_review_execution_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 234 | docs/v7_65_vcpchat_surface_check_authorization_package_v2_closeout.md | docs/archive/phases/v7/v7_65_vcpchat_surface_check_authorization_package_v2_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 235 | docs/v7_66_vcpchat_cancel_only_preflight_authorization_package_closeout.md | docs/archive/phases/v7/v7_66_vcpchat_cancel_only_preflight_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 236 | docs/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate_closeout.md | docs/archive/phases/v7/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 237 | docs/v7_68_exact_port_selection_planning_closeout.md | docs/archive/phases/v7/v7_68_exact_port_selection_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 238 | docs/v7_69_port_check_authorization_package_closeout.md | docs/archive/phases/v7/v7_69_port_check_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 239 | docs/v7_70_port_check_execution_authorization_gate_closeout.md | docs/archive/phases/v7/v7_70_port_check_execution_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 240 | docs/v7_71_port_check_execution_closeout.yaml | docs/archive/phases/v7/v7_71_port_check_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 241 | docs/v7_72_concrete_cdp_endpoint_lock_patch_closeout.md | docs/archive/phases/v7/v7_72_concrete_cdp_endpoint_lock_patch_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 242 | docs/v7_73_electron_launch_authorization_package_closeout.md | docs/archive/phases/v7/v7_73_electron_launch_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 243 | docs/v7_74_electron_launch_execution_authorization_gate_closeout.md | docs/archive/phases/v7/v7_74_electron_launch_execution_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 244 | docs/v7_76_cdp_target_discovery_authorization_package_closeout.md | docs/archive/phases/v7/v7_76_cdp_target_discovery_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 245 | docs/v7_77_cdp_target_discovery_execution_authorization_gate_closeout.md | docs/archive/phases/v7/v7_77_cdp_target_discovery_execution_authorization_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 246 | docs/v7_78_cdp_target_discovery_execution_closeout.yaml | docs/archive/phases/v7/v7_78_cdp_target_discovery_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 247 | docs/v7_79_cdp_target_candidate_lock_planning_closeout.md | docs/archive/phases/v7/v7_79_cdp_target_candidate_lock_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 248 | docs/v7_80_target_lock_route_decision_closeout.md | docs/archive/phases/v7/v7_80_target_lock_route_decision_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 249 | docs/v7_81_second_json_exact_target_lock_authorization_package_closeout.md | docs/archive/phases/v7/v7_81_second_json_exact_target_lock_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 250 | docs/v7_82_second_json_exact_target_lock_execution_gate_closeout.md | docs/archive/phases/v7/v7_82_second_json_exact_target_lock_execution_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 251 | docs/v7_83_second_json_exact_target_lock_execution_closeout.yaml | docs/archive/phases/v7/v7_83_second_json_exact_target_lock_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 252 | docs/v7_84_target_fingerprint_lock_planning_closeout.md | docs/archive/phases/v7/v7_84_target_fingerprint_lock_planning_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 253 | docs/v7_85_cdp_websocket_connect_authorization_package_closeout.md | docs/archive/phases/v7/v7_85_cdp_websocket_connect_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 254 | docs/v7_86_cdp_websocket_connect_execution_gate_closeout.md | docs/archive/phases/v7/v7_86_cdp_websocket_connect_execution_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 255 | docs/v7_87_cdp_websocket_connect_execution_closeout.yaml | docs/archive/phases/v7/v7_87_cdp_websocket_connect_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 256 | docs/v7_88_runtime_evaluate_surface_probe_authorization_package_closeout.md | docs/archive/phases/v7/v7_88_runtime_evaluate_surface_probe_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 257 | docs/v7_89_runtime_evaluate_surface_probe_execution_gate_closeout.md | docs/archive/phases/v7/v7_89_runtime_evaluate_surface_probe_execution_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 258 | docs/v7_90_runtime_evaluate_surface_probe_execution_closeout.yaml | docs/archive/phases/v7/v7_90_runtime_evaluate_surface_probe_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 259 | docs/v7_91_cancel_only_preflight_authorization_package_closeout.md | docs/archive/phases/v7/v7_91_cancel_only_preflight_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 260 | docs/v7_92_cancel_only_preflight_execution_gate_closeout.md | docs/archive/phases/v7/v7_92_cancel_only_preflight_execution_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 261 | docs/v7_93_cancel_only_preflight_execution_closeout.yaml | docs/archive/phases/v7/v7_93_cancel_only_preflight_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 262 | docs/v7_94_loadSession_read_only_authorization_package_closeout.md | docs/archive/phases/v7/v7_94_loadSession_read_only_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 263 | docs/v7_95_loadSession_read_only_execution_gate_closeout.md | docs/archive/phases/v7/v7_95_loadSession_read_only_execution_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 264 | docs/v7_96_loadSession_read_only_execution_closeout.yaml | docs/archive/phases/v7/v7_96_loadSession_read_only_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 265 | docs/v7_97_previewDraft_read_only_authorization_package_closeout.md | docs/archive/phases/v7/v7_97_previewDraft_read_only_authorization_package_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 266 | docs/v7_98_previewDraft_read_only_execution_gate_closeout.md | docs/archive/phases/v7/v7_98_previewDraft_read_only_execution_gate_closeout.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 267 | docs/v7_99_previewDraft_read_only_execution_closeout.yaml | docs/archive/phases/v7/v7_99_previewDraft_read_only_execution_closeout.yaml | phases/v7 | .yaml | absent as expected | present | 0 | 0 |
| 268 | docs/v7_prompt_evolution_analysis_matte_ceramic_mug.md | docs/archive/phases/v7/v7_prompt_evolution_analysis_matte_ceramic_mug.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 269 | docs/v7_real_generation_review_dataset_summary.md | docs/archive/phases/v7/v7_real_generation_review_dataset_summary.md | phases/v7 | .md | absent as expected | present | 0 | 0 |
| 270 | docs/v8_001_final_retouch_planning_gate.md | docs/archive/phases/v8/v8_001_final_retouch_planning_gate.md | phases/v8 | .md | absent as expected | present | 0 | 0 |
| 271 | docs/v8_002_retouch_acceptance_criteria_or_delivery_package_gate.md | docs/archive/phases/v8/v8_002_retouch_acceptance_criteria_or_delivery_package_gate.md | phases/v8 | .md | absent as expected | present | 0 | 0 |
| 272 | docs/v8_003_delivery_package_closeout_or_retouch_handoff_gate.md | docs/archive/phases/v8/v8_003_delivery_package_closeout_or_retouch_handoff_gate.md | phases/v8 | .md | absent as expected | present | 0 | 0 |
| 273 | docs/v8_004_final_retouch_route_closeout.md | docs/archive/phases/v8/v8_004_final_retouch_route_closeout.md | phases/v8 | .md | absent as expected | present | 0 | 0 |
| 274 | docs/v8_005_next_route_decision_gate.md | docs/archive/phases/v8/v8_005_next_route_decision_gate.md | phases/v8 | .md | absent as expected | present | 0 | 0 |
| 275 | docs/v8_route_options_after_v7_product_loop.md | docs/archive/phases/v8/v8_route_options_after_v7_product_loop.md | phases/v8 | .md | absent as expected | present | 0 | 0 |
| 276 | docs/v8_route_selection_human_decision_gate.md | docs/archive/phases/v8/v8_route_selection_human_decision_gate.md | phases/v8 | .md | absent as expected | present | 0 | 0 |

## Stop Conditions For Future Work

Stop before any future step that requires:

- moving additional docs without an exact allowlist
- deleting old records or archive directories
- changing validator path behavior without a compatibility plan
- staging, committing, pushing, tagging, releasing, or deploying
- A5, provider/plugin/API/image generation/DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox access

## Recommended Next

C1c remaining-docs classification is recorded in `docs/archive/DOCS_ARCHIVE_C1C_REMAINING_DOCS_CLASSIFICATION_DRY_RUN.md`. Do not move additional files until a separate authorization names the next exact set.
