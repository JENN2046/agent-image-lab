# Docs Archive C1j Docs-Only Reference Rewrite Package Dry Run

Status: C1j docs-only-reference rewrite package dry-run completed validated
Mode: A4.8 local documentation and rewrite-package dry-run only
Source link graph: `docs/archive/DOCS_ARCHIVE_C1I_DOCS_ONLY_REFERENCE_LINK_GRAPH_DRY_RUN.md`
Source classification: `docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md`

This dry run defines the exact shape of a future docs-only-reference rewrite package. It does not edit references, move files, create wrappers, stage, commit, push, tag, release, deploy, or authorize any A5 action.

## Boundary

This dry run did not:

- move docs
- delete files
- create wrappers
- rewrite references
- change validator behavior
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, MCP, or runtime
- read `.env`, `.env.local`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Rewrite Package Summary

The package was generated from a current filesystem scan of non-archive docs.

| Metric | Count |
| --- | ---: |
| docs-only-reference targets from C1i | 67 |
| targets requiring rewrite package | 65 |
| zero-current-reference drift candidates excluded | 2 |
| source docs in rewrite allowlist | 29 |
| exact rewrite edge records | 96 |
| exact replacement hits | 98 |
| target replacement rules | 65 |

The two zero-current-reference drift candidates remain excluded from this rewrite package:

- `docs/v7_102_cross_repo_boundary_audit.md`
- `docs/v7_75_electron_launch_runtime_state_closeout.yaml`

They should be handled by a later tiny exact-move preflight, not by this rewrite package.

## Source Class Summary

| Source class | Edge records | Hits | Source files |
| --- | ---: | ---: | ---: |
| current named product/prompt docs | 5 | 5 | 4 |
| current named VCP integration docs | 24 | 24 | 2 |
| historical phase docs | 66 | 68 | 22 |
| numbered legacy source docs | 1 | 1 | 1 |

## Source Rewrite Allowlist

A future rewrite execution may touch only these 29 source docs, and only for exact target replacement rules listed in this package.

| Source doc | Source class | Target records | Hits |
| --- | --- | ---: | ---: |
| `docs/00_project_roadmap.md` | numbered_legacy_source | 1 | 1 |
| `docs/product_image_generation_authorization_draft.md` | current_named_product_prompt | 1 | 1 |
| `docs/product_image_generation_plan_draft.md` | current_named_product_prompt | 1 | 1 |
| `docs/product_image_workflow_A5_readiness_review.md` | current_named_product_prompt | 1 | 1 |
| `docs/prompt_artifact_schema_inventory.md` | current_named_product_prompt | 2 | 2 |
| `docs/v7_125_selected_docs_rescan_authorization_gate.md` | historical_phase_source | 3 | 3 |
| `docs/v7_135_batch_001_residual_correction_planning.md` | historical_phase_source | 1 | 2 |
| `docs/v7_136_batch_001_residual_correction_implementation_gate.md` | historical_phase_source | 1 | 1 |
| `docs/v7_138_batch_001_final_rescan_authorization_gate.md` | historical_phase_source | 3 | 3 |
| `docs/v7_144_batch_002_permission_drift_analysis.md` | historical_phase_source | 4 | 4 |
| `docs/v7_145_batch_002_correction_implementation_gate.md` | historical_phase_source | 7 | 7 |
| `docs/v7_147_batch_002_rescan_authorization_gate.md` | historical_phase_source | 7 | 7 |
| `docs/v7_156_batch_003_rescan_authorization_gate.md` | historical_phase_source | 4 | 4 |
| `docs/v7_169_agent_board_and_validator_patch_gate.md` | historical_phase_source | 1 | 1 |
| `docs/v7_169_agent_board_and_validator_patch_gate.yaml` | historical_phase_source | 1 | 1 |
| `docs/v7_205_static_review_console_mockup_spec_gate.md` | historical_phase_source | 3 | 3 |
| `docs/v7_208_static_mockup_visual_polish_or_pause_decision_gate.md` | historical_phase_source | 1 | 1 |
| `docs/v7_236_product_image_workflow_A5_readiness_review_gate.md` | historical_phase_source | 1 | 1 |
| `docs/v7_237_product_image_generation_authorization_draft_gate.md` | historical_phase_source | 1 | 1 |
| `docs/v7_238_product_image_generation_authorization_draft_review_gate.md` | historical_phase_source | 1 | 1 |
| `docs/v7_239_product_image_generation_plan_draft_gate.md` | historical_phase_source | 1 | 1 |
| `docs/v7_48_project_state_sync_pack.md` | historical_phase_source | 4 | 5 |
| `docs/v7_49_vcp_integration_readiness_pack.md` | historical_phase_source | 1 | 1 |
| `docs/v7_50_vcp_read_only_bridge_contract.md` | historical_phase_source | 8 | 8 |
| `docs/v7_51j_adapter_pro_review_findings_patch_report.md` | historical_phase_source | 1 | 1 |
| `docs/v7_58l_memory_overview_base_url_patch_closeout.md` | historical_phase_source | 6 | 6 |
| `docs/v7_58l_memory_overview_base_url_patch.md` | historical_phase_source | 6 | 6 |
| `docs/vcp_integration/agent_image_lab_vcp_integration_full_execution_backlog_v2.md` | current_named_vcp_integration | 13 | 13 |
| `docs/vcp_integration/agent_image_lab_vcp_integration_full_landing_plan_v1.md` | current_named_vcp_integration | 11 | 11 |

## Target Replacement Allowlist

These 65 exact old path strings may be replaced with their exact archive path strings in the 29 source docs above.

| Old path | New archive path | Source records | Hits |
| --- | --- | ---: | ---: |
| `docs/251_v6_validator_quality_gate.md` | `docs/archive/numbered_legacy/251_v6_validator_quality_gate.md` | 1 | 1 |
| `docs/v6_8_plugin_dashboard_legacy_index.md` | `docs/archive/phases/v6/v6_8_plugin_dashboard_legacy_index.md` | 2 | 2 |
| `docs/v7_118_corrected_fixture_dry_run_authorization_gate.md` | `docs/archive/phases/v7/v7_118_corrected_fixture_dry_run_authorization_gate.md` | 1 | 1 |
| `docs/v7_118_corrected_fixture_dry_run_authorization_gate.yaml` | `docs/archive/phases/v7/v7_118_corrected_fixture_dry_run_authorization_gate.yaml` | 1 | 1 |
| `docs/v7_119_corrected_fixture_dry_run_execution_closeout.md` | `docs/archive/phases/v7/v7_119_corrected_fixture_dry_run_execution_closeout.md` | 1 | 1 |
| `docs/v7_125_selected_docs_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_125_selected_docs_rescan_authorization_gate.yaml` | 1 | 1 |
| `docs/v7_126_selected_docs_rescan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_126_selected_docs_rescan_execution_closeout.yaml` | 3 | 4 |
| `docs/v7_127_controlled_long_task_chain_authorization_gate.yaml` | `docs/archive/phases/v7/v7_127_controlled_long_task_chain_authorization_gate.yaml` | 1 | 1 |
| `docs/v7_135_batch_001_residual_correction_planning.md` | `docs/archive/phases/v7/v7_135_batch_001_residual_correction_planning.md` | 3 | 3 |
| `docs/v7_135_batch_001_residual_correction_planning.yaml` | `docs/archive/phases/v7/v7_135_batch_001_residual_correction_planning.yaml` | 1 | 1 |
| `docs/v7_136_batch_001_residual_correction_implementation_gate.md` | `docs/archive/phases/v7/v7_136_batch_001_residual_correction_implementation_gate.md` | 2 | 2 |
| `docs/v7_136_batch_001_residual_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_136_batch_001_residual_correction_implementation_gate.yaml` | 2 | 2 |
| `docs/v7_138_batch_001_final_rescan_authorization_gate.md` | `docs/archive/phases/v7/v7_138_batch_001_final_rescan_authorization_gate.md` | 2 | 2 |
| `docs/v7_138_batch_001_final_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_138_batch_001_final_rescan_authorization_gate.yaml` | 2 | 2 |
| `docs/v7_139_batch_001_final_rescan_execution_closeout.md` | `docs/archive/phases/v7/v7_139_batch_001_final_rescan_execution_closeout.md` | 2 | 2 |
| `docs/v7_139_batch_001_final_rescan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_139_batch_001_final_rescan_execution_closeout.yaml` | 2 | 2 |
| `docs/v7_142_batch_002_correction_planning.md` | `docs/archive/phases/v7/v7_142_batch_002_correction_planning.md` | 1 | 1 |
| `docs/v7_142_batch_002_correction_planning.yaml` | `docs/archive/phases/v7/v7_142_batch_002_correction_planning.yaml` | 1 | 1 |
| `docs/v7_144_batch_002_permission_drift_analysis.md` | `docs/archive/phases/v7/v7_144_batch_002_permission_drift_analysis.md` | 1 | 1 |
| `docs/v7_145_batch_002_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_145_batch_002_correction_implementation_gate.yaml` | 1 | 1 |
| `docs/v7_147_batch_002_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_147_batch_002_rescan_authorization_gate.yaml` | 1 | 1 |
| `docs/v7_148_batch_002_rescan_execution_closeout.md` | `docs/archive/phases/v7/v7_148_batch_002_rescan_execution_closeout.md` | 1 | 1 |
| `docs/v7_181_generation_plan_package_blueprint_gate.md` | `docs/archive/phases/v7/v7_181_generation_plan_package_blueprint_gate.md` | 2 | 2 |
| `docs/v7_182_generation_authorization_package_blueprint_gate.md` | `docs/archive/phases/v7/v7_182_generation_authorization_package_blueprint_gate.md` | 5 | 5 |
| `docs/v7_184_static_review_console_mockup_planning_gate.md` | `docs/archive/phases/v7/v7_184_static_review_console_mockup_planning_gate.md` | 1 | 1 |
| `docs/v7_185_core_independent_vcp_native_adr_gate.md` | `docs/archive/phases/v7/v7_185_core_independent_vcp_native_adr_gate.md` | 1 | 1 |
| `docs/v7_186_static_review_console_mockup_alignment_gate.md` | `docs/archive/phases/v7/v7_186_static_review_console_mockup_alignment_gate.md` | 1 | 1 |
| `docs/v7_207_static_mockup_review_and_index_gate.md` | `docs/archive/phases/v7/v7_207_static_mockup_review_and_index_gate.md` | 1 | 1 |
| `docs/v7_280_prompt_v4_handle_geometry_refinement_authorization_gate.md` | `docs/archive/phases/v7/v7_280_prompt_v4_handle_geometry_refinement_authorization_gate.md` | 1 | 1 |
| `docs/v7_44_french_summer_rattan_bag_v3_closeout_production_readiness.md` | `docs/archive/phases/v7/v7_44_french_summer_rattan_bag_v3_closeout_production_readiness.md` | 2 | 2 |
| `docs/v7_45_french_summer_rattan_bag_v3_production_usage_sop.md` | `docs/archive/phases/v7/v7_45_french_summer_rattan_bag_v3_production_usage_sop.md` | 2 | 2 |
| `docs/v7_46_french_summer_rattan_bag_v3_one_shot_a5_template.md` | `docs/archive/phases/v7/v7_46_french_summer_rattan_bag_v3_one_shot_a5_template.md` | 2 | 3 |
| `docs/v7_47_french_summer_rattan_bag_v3_human_review_checklist.md` | `docs/archive/phases/v7/v7_47_french_summer_rattan_bag_v3_human_review_checklist.md` | 2 | 2 |
| `docs/v7_48_project_state_sync_pack.md` | `docs/archive/phases/v7/v7_48_project_state_sync_pack.md` | 1 | 1 |
| `docs/v7_49_vcp_case_summary_schema.md` | `docs/archive/phases/v7/v7_49_vcp_case_summary_schema.md` | 2 | 2 |
| `docs/v7_49_vcp_integration_execution_roadmap.md` | `docs/archive/phases/v7/v7_49_vcp_integration_execution_roadmap.md` | 1 | 1 |
| `docs/v7_49_vcp_integration_readiness_pack.md` | `docs/archive/phases/v7/v7_49_vcp_integration_readiness_pack.md` | 1 | 1 |
| `docs/v7_50d_vcpchat_review_console_surface_static_fixture_execution_report.md` | `docs/archive/phases/v7/v7_50d_vcpchat_review_console_surface_static_fixture_execution_report.md` | 1 | 1 |
| `docs/v7_50e_real_vcpchat_surface_check_safety_gates.md` | `docs/archive/phases/v7/v7_50e_real_vcpchat_surface_check_safety_gates.md` | 1 | 1 |
| `docs/v7_51a_agent_image_lab_read_only_evidence_index_spec.md` | `docs/archive/phases/v7/v7_51a_agent_image_lab_read_only_evidence_index_spec.md` | 1 | 1 |
| `docs/v7_51a_agent_image_lab_read_only_evidence_index.yaml` | `docs/archive/phases/v7/v7_51a_agent_image_lab_read_only_evidence_index.yaml` | 1 | 1 |
| `docs/v7_51b_read_only_bridge_adapter_contract.yaml` | `docs/archive/phases/v7/v7_51b_read_only_bridge_adapter_contract.yaml` | 1 | 1 |
| `docs/v7_51b_read_only_bridge_adapter_skeleton_plan.md` | `docs/archive/phases/v7/v7_51b_read_only_bridge_adapter_skeleton_plan.md` | 1 | 1 |
| `docs/v7_51c_read_only_bridge_adapter_error_codes.md` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_error_codes.md` | 1 | 1 |
| `docs/v7_51c_read_only_bridge_adapter_file_layout.md` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_file_layout.md` | 1 | 1 |
| `docs/v7_51c_read_only_bridge_adapter_implementation_plan.yaml` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_implementation_plan.yaml` | 1 | 1 |
| `docs/v7_51c_read_only_bridge_adapter_implementation_planning.md` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_implementation_planning.md` | 1 | 1 |
| `docs/v7_51c_read_only_bridge_adapter_security_gate_plan.md` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_security_gate_plan.md` | 1 | 1 |
| `docs/v7_51c_read_only_bridge_adapter_test_plan.md` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_test_plan.md` | 1 | 1 |
| `docs/v7_51j_adapter_pro_review_findings_patch_result.yaml` | `docs/archive/phases/v7/v7_51j_adapter_pro_review_findings_patch_result.yaml` | 1 | 1 |
| `docs/v7_52a_vcptoolbox_read_only_ingestion_planning.md` | `docs/archive/phases/v7/v7_52a_vcptoolbox_read_only_ingestion_planning.md` | 2 | 2 |
| `docs/v7_52b_vcp_package_schema_mapping.md` | `docs/archive/phases/v7/v7_52b_vcp_package_schema_mapping.md` | 2 | 2 |
| `docs/v7_52c_vcptoolbox_no_write_bridge_contract.md` | `docs/archive/phases/v7/v7_52c_vcptoolbox_no_write_bridge_contract.md` | 2 | 2 |
| `docs/v7_52d_vcptoolbox_mock_ingestion_validation_report.md` | `docs/archive/phases/v7/v7_52d_vcptoolbox_mock_ingestion_validation_report.md` | 2 | 2 |
| `docs/v7_52d_vcptoolbox_mock_ingestion_validation_result.yaml` | `docs/archive/phases/v7/v7_52d_vcptoolbox_mock_ingestion_validation_result.yaml` | 2 | 2 |
| `docs/v7_52e_vcptoolbox_real_read_only_dry_run_a5_planning.md` | `docs/archive/phases/v7/v7_52e_vcptoolbox_real_read_only_dry_run_a5_planning.md` | 1 | 1 |
| `docs/v7_52f_vcptoolbox_read_only_ingestion_closeout.md` | `docs/archive/phases/v7/v7_52f_vcptoolbox_read_only_ingestion_closeout.md` | 1 | 1 |
| `docs/v7_58j_memory_overview_A5_request_pre_submission_checklist.md` | `docs/archive/phases/v7/v7_58j_memory_overview_A5_request_pre_submission_checklist.md` | 2 | 2 |
| `docs/v7_58j_memory_overview_independent_A5_request_text.md` | `docs/archive/phases/v7/v7_58j_memory_overview_independent_A5_request_text.md` | 2 | 2 |
| `docs/v7_58j_memory_overview_independent_A5_request_text.yaml` | `docs/archive/phases/v7/v7_58j_memory_overview_independent_A5_request_text.yaml` | 2 | 2 |
| `docs/v7_58l_memory_overview_base_url_patch_closeout.md` | `docs/archive/phases/v7/v7_58l_memory_overview_base_url_patch_closeout.md` | 1 | 1 |
| `docs/v7_58l_memory_overview_base_url_patch_closeout.yaml` | `docs/archive/phases/v7/v7_58l_memory_overview_base_url_patch_closeout.yaml` | 2 | 2 |
| `docs/v7_58l_memory_overview_base_url_patch.md` | `docs/archive/phases/v7/v7_58l_memory_overview_base_url_patch.md` | 1 | 1 |
| `docs/v7_58l_memory_overview_base_url_patch.yaml` | `docs/archive/phases/v7/v7_58l_memory_overview_base_url_patch.yaml` | 2 | 2 |
| `docs/v7_product_loop_closeout_matte_ceramic_mug_v1.md` | `docs/archive/phases/v7/v7_product_loop_closeout_matte_ceramic_mug_v1.md` | 1 | 1 |

## Future Execution Shape

A future rewrite execution, if separately authorized, should:

1. Rescan the 29 source docs before editing.
2. Replace only exact old path strings from the 65-rule target allowlist.
3. Verify the rewritten source docs contain zero old path hits for these 65 targets.
4. Verify no source outside the 29-doc allowlist changed.
5. Keep the 2 zero-current-reference drift candidates out of the rewrite batch.

## Decision

C1j confirms a future docs-only-reference rewrite is bounded enough to prepare for execution, but execution remains blocked.

Recommended next safe task:

```text
C1k docs-only-reference rewrite authorization package dry-run
```

That package should name the 29 source docs, 65 target replacement rules, required pre/post scans, validation commands, and stop conditions. It still must not perform the rewrite.

Do not proceed to physical movement until the rewrite package is reviewed and a separate rewrite execution is explicitly authorized and validated.
