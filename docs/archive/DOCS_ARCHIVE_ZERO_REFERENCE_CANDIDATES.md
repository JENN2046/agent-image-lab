# Docs Archive Zero-Reference Candidates

Status: C1.2 dry-run candidate list
Mode: A4.8 local documentation only
Base policy: `docs/archive/DOCS_ARCHIVE_REFERENCE_POLICY.md`

This file lists the exact zero-external-reference archive candidates generated from the C1.1 reference policy. It is not a file-move authorization.

## Boundary

This C1.2 dry run did not:

- move docs
- delete files
- change validator behavior
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, or runtime
- read `.env`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Generation Method

Candidate set: top-level `docs/` files whose filenames start with `v[0-9]` or `[0-9]`.

Reference scan scope:

- `README.md`
- `PROJECT_MASTER_PLAN.md`
- `AGENTS.md`
- `.agent_board/`
- `scripts/`
- `tests/`
- `docs/`

C1.1 exact-reference rule: a candidate is zero-external-reference when no other scanned file references its `docs/<filename>` path under the C1.1 markdown-target reference pattern.

Important caveat: when `.yaml/.yml` target references are included in a stricter follow-up scan, the zero-reference count is lower. Therefore this list is only a C1a candidate list and still requires a separate C1 move authorization plus pre-move validation.

## Summary

| Metric | Count |
| --- | ---: |
| historical candidate files scanned | 1194 |
| zero-external-reference candidates under C1.1 rule | 460 |
| externally referenced candidates under C1.1 rule | 734 |
| stricter .md/.yaml/.yml zero-reference candidates observed | 276 |

## Future Target Rules

| Current path pattern | Future target pattern |
| --- | --- |
| `docs/vN_*` | `docs/archive/phases/vN/<same_filename>` |
| `docs/[0-9]*` | `docs/archive/numbered_legacy/<same_filename>` |

## Exact Candidate List

| # | Current path | Future target | Status |
| ---: | --- | --- | --- |
| 1 | `docs/13_public_private_trace_policy.md` | `docs/archive/numbered_legacy/13_public_private_trace_policy.md` | not moved |
| 2 | `docs/14_budget_policy.md` | `docs/archive/numbered_legacy/14_budget_policy.md` | not moved |
| 3 | `docs/15_security_notes.md` | `docs/archive/numbered_legacy/15_security_notes.md` | not moved |
| 4 | `docs/234_phase_g_baseline_hygiene_closeout.md` | `docs/archive/numbered_legacy/234_phase_g_baseline_hygiene_closeout.md` | not moved |
| 5 | `docs/235_final_program_closeout_after_phase_i.md` | `docs/archive/numbered_legacy/235_final_program_closeout_after_phase_i.md` | not moved |
| 6 | `docs/287_v7_32_accepted_sample_registry_update.md` | `docs/archive/numbered_legacy/287_v7_32_accepted_sample_registry_update.md` | not moved |
| 7 | `docs/40_v1_1_to_v2_0_task_plan.md` | `docs/archive/numbered_legacy/40_v1_1_to_v2_0_task_plan.md` | not moved |
| 8 | `docs/v10_016_post_push_status_sync_guard_improvement.md` | `docs/archive/phases/v10/v10_016_post_push_status_sync_guard_improvement.md` | not moved |
| 9 | `docs/v7_100_vcpchat_read_only_surface_runtime_closeout.yaml` | `docs/archive/phases/v7/v7_100_vcpchat_read_only_surface_runtime_closeout.yaml` | not moved |
| 10 | `docs/v7_101_vcpchat_read_only_surface_evidence_report_closeout.md` | `docs/archive/phases/v7/v7_101_vcpchat_read_only_surface_evidence_report_closeout.md` | not moved |
| 11 | `docs/v7_101_vcpchat_read_only_surface_evidence_report_closeout.yaml` | `docs/archive/phases/v7/v7_101_vcpchat_read_only_surface_evidence_report_closeout.yaml` | not moved |
| 12 | `docs/v7_101_vcpchat_read_only_surface_evidence_report.yaml` | `docs/archive/phases/v7/v7_101_vcpchat_read_only_surface_evidence_report.yaml` | not moved |
| 13 | `docs/v7_102_cross_repo_boundary_audit_closeout.md` | `docs/archive/phases/v7/v7_102_cross_repo_boundary_audit_closeout.md` | not moved |
| 14 | `docs/v7_102_cross_repo_boundary_audit_closeout.yaml` | `docs/archive/phases/v7/v7_102_cross_repo_boundary_audit_closeout.yaml` | not moved |
| 15 | `docs/v7_102_cross_repo_boundary_audit.yaml` | `docs/archive/phases/v7/v7_102_cross_repo_boundary_audit.yaml` | not moved |
| 16 | `docs/v7_103_boundary_matrix_hardening_redaction_validator_planning_closeout.md` | `docs/archive/phases/v7/v7_103_boundary_matrix_hardening_redaction_validator_planning_closeout.md` | not moved |
| 17 | `docs/v7_103_boundary_matrix_hardening_redaction_validator_planning_closeout.yaml` | `docs/archive/phases/v7/v7_103_boundary_matrix_hardening_redaction_validator_planning_closeout.yaml` | not moved |
| 18 | `docs/v7_103_boundary_matrix_hardening_redaction_validator_planning.yaml` | `docs/archive/phases/v7/v7_103_boundary_matrix_hardening_redaction_validator_planning.yaml` | not moved |
| 19 | `docs/v7_104_redaction_validator_spec_closeout.md` | `docs/archive/phases/v7/v7_104_redaction_validator_spec_closeout.md` | not moved |
| 20 | `docs/v7_104_redaction_validator_spec_closeout.yaml` | `docs/archive/phases/v7/v7_104_redaction_validator_spec_closeout.yaml` | not moved |
| 21 | `docs/v7_104_redaction_validator_spec.yaml` | `docs/archive/phases/v7/v7_104_redaction_validator_spec.yaml` | not moved |
| 22 | `docs/v7_105_boundary_matrix_schema_spec_closeout.md` | `docs/archive/phases/v7/v7_105_boundary_matrix_schema_spec_closeout.md` | not moved |
| 23 | `docs/v7_105_boundary_matrix_schema_spec_closeout.yaml` | `docs/archive/phases/v7/v7_105_boundary_matrix_schema_spec_closeout.yaml` | not moved |
| 24 | `docs/v7_105_boundary_matrix_schema_spec.yaml` | `docs/archive/phases/v7/v7_105_boundary_matrix_schema_spec.yaml` | not moved |
| 25 | `docs/v7_106_boundary_matrix_yaml_draft_closeout.md` | `docs/archive/phases/v7/v7_106_boundary_matrix_yaml_draft_closeout.md` | not moved |
| 26 | `docs/v7_106_boundary_matrix_yaml_draft_closeout.yaml` | `docs/archive/phases/v7/v7_106_boundary_matrix_yaml_draft_closeout.yaml` | not moved |
| 27 | `docs/v7_106_boundary_matrix_yaml_draft.yaml` | `docs/archive/phases/v7/v7_106_boundary_matrix_yaml_draft.yaml` | not moved |
| 28 | `docs/v7_107_boundary_matrix_yaml_static_review_closeout.md` | `docs/archive/phases/v7/v7_107_boundary_matrix_yaml_static_review_closeout.md` | not moved |
| 29 | `docs/v7_107_boundary_matrix_yaml_static_review_closeout.yaml` | `docs/archive/phases/v7/v7_107_boundary_matrix_yaml_static_review_closeout.yaml` | not moved |
| 30 | `docs/v7_107_boundary_matrix_yaml_static_review.yaml` | `docs/archive/phases/v7/v7_107_boundary_matrix_yaml_static_review.yaml` | not moved |
| 31 | `docs/v7_108_redaction_validator_skeleton_planning_closeout.md` | `docs/archive/phases/v7/v7_108_redaction_validator_skeleton_planning_closeout.md` | not moved |
| 32 | `docs/v7_108_redaction_validator_skeleton_planning_closeout.yaml` | `docs/archive/phases/v7/v7_108_redaction_validator_skeleton_planning_closeout.yaml` | not moved |
| 33 | `docs/v7_108_redaction_validator_skeleton_planning.yaml` | `docs/archive/phases/v7/v7_108_redaction_validator_skeleton_planning.yaml` | not moved |
| 34 | `docs/v7_109_redaction_validator_skeleton_implementation_gate_closeout.md` | `docs/archive/phases/v7/v7_109_redaction_validator_skeleton_implementation_gate_closeout.md` | not moved |
| 35 | `docs/v7_109_redaction_validator_skeleton_implementation_gate_closeout.yaml` | `docs/archive/phases/v7/v7_109_redaction_validator_skeleton_implementation_gate_closeout.yaml` | not moved |
| 36 | `docs/v7_109_redaction_validator_skeleton_implementation_gate.yaml` | `docs/archive/phases/v7/v7_109_redaction_validator_skeleton_implementation_gate.yaml` | not moved |
| 37 | `docs/v7_111_redaction_validator_skeleton_static_review_closeout.md` | `docs/archive/phases/v7/v7_111_redaction_validator_skeleton_static_review_closeout.md` | not moved |
| 38 | `docs/v7_111_redaction_validator_skeleton_static_review_closeout.yaml` | `docs/archive/phases/v7/v7_111_redaction_validator_skeleton_static_review_closeout.yaml` | not moved |
| 39 | `docs/v7_111_redaction_validator_skeleton_static_review.yaml` | `docs/archive/phases/v7/v7_111_redaction_validator_skeleton_static_review.yaml` | not moved |
| 40 | `docs/v7_112_validator_fixture_static_review_closeout.md` | `docs/archive/phases/v7/v7_112_validator_fixture_static_review_closeout.md` | not moved |
| 41 | `docs/v7_112_validator_fixture_static_review_closeout.yaml` | `docs/archive/phases/v7/v7_112_validator_fixture_static_review_closeout.yaml` | not moved |
| 42 | `docs/v7_112_validator_fixture_static_review.yaml` | `docs/archive/phases/v7/v7_112_validator_fixture_static_review.yaml` | not moved |
| 43 | `docs/v7_113_validator_fixture_dry_run_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_113_validator_fixture_dry_run_authorization_gate_closeout.md` | not moved |
| 44 | `docs/v7_113_validator_fixture_dry_run_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_113_validator_fixture_dry_run_authorization_gate_closeout.yaml` | not moved |
| 45 | `docs/v7_113_validator_fixture_dry_run_authorization_gate.yaml` | `docs/archive/phases/v7/v7_113_validator_fixture_dry_run_authorization_gate.yaml` | not moved |
| 46 | `docs/v7_114_validator_fixture_dry_run_execution_closeout.md` | `docs/archive/phases/v7/v7_114_validator_fixture_dry_run_execution_closeout.md` | not moved |
| 47 | `docs/v7_114_validator_fixture_dry_run_execution_closeout.yaml` | `docs/archive/phases/v7/v7_114_validator_fixture_dry_run_execution_closeout.yaml` | not moved |
| 48 | `docs/v7_115_validator_scan_loop_correction_planning_closeout.md` | `docs/archive/phases/v7/v7_115_validator_scan_loop_correction_planning_closeout.md` | not moved |
| 49 | `docs/v7_115_validator_scan_loop_correction_planning_closeout.yaml` | `docs/archive/phases/v7/v7_115_validator_scan_loop_correction_planning_closeout.yaml` | not moved |
| 50 | `docs/v7_115_validator_scan_loop_correction_planning.yaml` | `docs/archive/phases/v7/v7_115_validator_scan_loop_correction_planning.yaml` | not moved |
| 51 | `docs/v7_116_scan_loop_correction_implementation_gate_closeout.md` | `docs/archive/phases/v7/v7_116_scan_loop_correction_implementation_gate_closeout.md` | not moved |
| 52 | `docs/v7_116_scan_loop_correction_implementation_gate_closeout.yaml` | `docs/archive/phases/v7/v7_116_scan_loop_correction_implementation_gate_closeout.yaml` | not moved |
| 53 | `docs/v7_116_scan_loop_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_116_scan_loop_correction_implementation_gate.yaml` | not moved |
| 54 | `docs/v7_117a_scan_loop_correction_patch_planning_closeout.md` | `docs/archive/phases/v7/v7_117a_scan_loop_correction_patch_planning_closeout.md` | not moved |
| 55 | `docs/v7_117a_scan_loop_correction_patch_planning_closeout.yaml` | `docs/archive/phases/v7/v7_117a_scan_loop_correction_patch_planning_closeout.yaml` | not moved |
| 56 | `docs/v7_117a_scan_loop_correction_patch_planning.yaml` | `docs/archive/phases/v7/v7_117a_scan_loop_correction_patch_planning.yaml` | not moved |
| 57 | `docs/v7_117b_scan_loop_correction_patch_implementation_gate_closeout.md` | `docs/archive/phases/v7/v7_117b_scan_loop_correction_patch_implementation_gate_closeout.md` | not moved |
| 58 | `docs/v7_117b_scan_loop_correction_patch_implementation_gate_closeout.yaml` | `docs/archive/phases/v7/v7_117b_scan_loop_correction_patch_implementation_gate_closeout.yaml` | not moved |
| 59 | `docs/v7_117b_scan_loop_correction_patch_implementation_gate.yaml` | `docs/archive/phases/v7/v7_117b_scan_loop_correction_patch_implementation_gate.yaml` | not moved |
| 60 | `docs/v7_118_corrected_fixture_dry_run_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_118_corrected_fixture_dry_run_authorization_gate_closeout.md` | not moved |
| 61 | `docs/v7_118_corrected_fixture_dry_run_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_118_corrected_fixture_dry_run_authorization_gate_closeout.yaml` | not moved |
| 62 | `docs/v7_118_corrected_fixture_dry_run_authorization_gate.yaml` | `docs/archive/phases/v7/v7_118_corrected_fixture_dry_run_authorization_gate.yaml` | not moved |
| 63 | `docs/v7_119_corrected_fixture_dry_run_execution_closeout.yaml` | `docs/archive/phases/v7/v7_119_corrected_fixture_dry_run_execution_closeout.yaml` | not moved |
| 64 | `docs/v7_120_selected_docs_scan_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_120_selected_docs_scan_authorization_gate_closeout.md` | not moved |
| 65 | `docs/v7_120_selected_docs_scan_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_120_selected_docs_scan_authorization_gate_closeout.yaml` | not moved |
| 66 | `docs/v7_120_selected_docs_scan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_120_selected_docs_scan_authorization_gate.yaml` | not moved |
| 67 | `docs/v7_121_selected_docs_scan_execution_closeout.md` | `docs/archive/phases/v7/v7_121_selected_docs_scan_execution_closeout.md` | not moved |
| 68 | `docs/v7_121_selected_docs_scan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_121_selected_docs_scan_execution_closeout.yaml` | not moved |
| 69 | `docs/v7_122_selected_doc_closeout_integrity_correction_planning_closeout.md` | `docs/archive/phases/v7/v7_122_selected_doc_closeout_integrity_correction_planning_closeout.md` | not moved |
| 70 | `docs/v7_122_selected_doc_closeout_integrity_correction_planning_closeout.yaml` | `docs/archive/phases/v7/v7_122_selected_doc_closeout_integrity_correction_planning_closeout.yaml` | not moved |
| 71 | `docs/v7_122_selected_doc_closeout_integrity_correction_planning.yaml` | `docs/archive/phases/v7/v7_122_selected_doc_closeout_integrity_correction_planning.yaml` | not moved |
| 72 | `docs/v7_123_closeout_integrity_correction_implementation_gate_closeout.md` | `docs/archive/phases/v7/v7_123_closeout_integrity_correction_implementation_gate_closeout.md` | not moved |
| 73 | `docs/v7_123_closeout_integrity_correction_implementation_gate_closeout.yaml` | `docs/archive/phases/v7/v7_123_closeout_integrity_correction_implementation_gate_closeout.yaml` | not moved |
| 74 | `docs/v7_123_closeout_integrity_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_123_closeout_integrity_correction_implementation_gate.yaml` | not moved |
| 75 | `docs/v7_125_selected_docs_rescan_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_125_selected_docs_rescan_authorization_gate_closeout.md` | not moved |
| 76 | `docs/v7_125_selected_docs_rescan_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_125_selected_docs_rescan_authorization_gate_closeout.yaml` | not moved |
| 77 | `docs/v7_125_selected_docs_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_125_selected_docs_rescan_authorization_gate.yaml` | not moved |
| 78 | `docs/v7_126_selected_docs_rescan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_126_selected_docs_rescan_execution_closeout.yaml` | not moved |
| 79 | `docs/v7_127_controlled_long_task_chain_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_127_controlled_long_task_chain_authorization_gate_closeout.md` | not moved |
| 80 | `docs/v7_127_controlled_long_task_chain_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_127_controlled_long_task_chain_authorization_gate_closeout.yaml` | not moved |
| 81 | `docs/v7_127_controlled_long_task_chain_authorization_gate.yaml` | `docs/archive/phases/v7/v7_127_controlled_long_task_chain_authorization_gate.yaml` | not moved |
| 82 | `docs/v7_128_first_controlled_batch_execution_gate_closeout.md` | `docs/archive/phases/v7/v7_128_first_controlled_batch_execution_gate_closeout.md` | not moved |
| 83 | `docs/v7_128_first_controlled_batch_execution_gate_closeout.yaml` | `docs/archive/phases/v7/v7_128_first_controlled_batch_execution_gate_closeout.yaml` | not moved |
| 84 | `docs/v7_128_first_controlled_batch_execution_gate.yaml` | `docs/archive/phases/v7/v7_128_first_controlled_batch_execution_gate.yaml` | not moved |
| 85 | `docs/v7_129_first_controlled_batch_execution_closeout.md` | `docs/archive/phases/v7/v7_129_first_controlled_batch_execution_closeout.md` | not moved |
| 86 | `docs/v7_129_first_controlled_batch_execution_closeout.yaml` | `docs/archive/phases/v7/v7_129_first_controlled_batch_execution_closeout.yaml` | not moved |
| 87 | `docs/v7_130_batch_001_markdown_closeout_integrity_correction_planning_closeout.md` | `docs/archive/phases/v7/v7_130_batch_001_markdown_closeout_integrity_correction_planning_closeout.md` | not moved |
| 88 | `docs/v7_130_batch_001_markdown_closeout_integrity_correction_planning_closeout.yaml` | `docs/archive/phases/v7/v7_130_batch_001_markdown_closeout_integrity_correction_planning_closeout.yaml` | not moved |
| 89 | `docs/v7_130_batch_001_markdown_closeout_integrity_correction_planning.yaml` | `docs/archive/phases/v7/v7_130_batch_001_markdown_closeout_integrity_correction_planning.yaml` | not moved |
| 90 | `docs/v7_131_batch_001_markdown_correction_implementation_gate_closeout.md` | `docs/archive/phases/v7/v7_131_batch_001_markdown_correction_implementation_gate_closeout.md` | not moved |
| 91 | `docs/v7_131_batch_001_markdown_correction_implementation_gate_closeout.yaml` | `docs/archive/phases/v7/v7_131_batch_001_markdown_correction_implementation_gate_closeout.yaml` | not moved |
| 92 | `docs/v7_131_batch_001_markdown_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_131_batch_001_markdown_correction_implementation_gate.yaml` | not moved |
| 93 | `docs/v7_133_batch_001_rescan_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_133_batch_001_rescan_authorization_gate_closeout.md` | not moved |
| 94 | `docs/v7_133_batch_001_rescan_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_133_batch_001_rescan_authorization_gate_closeout.yaml` | not moved |
| 95 | `docs/v7_133_batch_001_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_133_batch_001_rescan_authorization_gate.yaml` | not moved |
| 96 | `docs/v7_134_batch_001_rescan_execution_closeout.md` | `docs/archive/phases/v7/v7_134_batch_001_rescan_execution_closeout.md` | not moved |
| 97 | `docs/v7_134_batch_001_rescan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_134_batch_001_rescan_execution_closeout.yaml` | not moved |
| 98 | `docs/v7_135_batch_001_residual_correction_planning_closeout.md` | `docs/archive/phases/v7/v7_135_batch_001_residual_correction_planning_closeout.md` | not moved |
| 99 | `docs/v7_135_batch_001_residual_correction_planning_closeout.yaml` | `docs/archive/phases/v7/v7_135_batch_001_residual_correction_planning_closeout.yaml` | not moved |
| 100 | `docs/v7_135_batch_001_residual_correction_planning.yaml` | `docs/archive/phases/v7/v7_135_batch_001_residual_correction_planning.yaml` | not moved |
| 101 | `docs/v7_136_batch_001_residual_correction_implementation_gate_closeout.md` | `docs/archive/phases/v7/v7_136_batch_001_residual_correction_implementation_gate_closeout.md` | not moved |
| 102 | `docs/v7_136_batch_001_residual_correction_implementation_gate_closeout.yaml` | `docs/archive/phases/v7/v7_136_batch_001_residual_correction_implementation_gate_closeout.yaml` | not moved |
| 103 | `docs/v7_136_batch_001_residual_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_136_batch_001_residual_correction_implementation_gate.yaml` | not moved |
| 104 | `docs/v7_138_batch_001_final_rescan_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_138_batch_001_final_rescan_authorization_gate_closeout.md` | not moved |
| 105 | `docs/v7_138_batch_001_final_rescan_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_138_batch_001_final_rescan_authorization_gate_closeout.yaml` | not moved |
| 106 | `docs/v7_138_batch_001_final_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_138_batch_001_final_rescan_authorization_gate.yaml` | not moved |
| 107 | `docs/v7_139_batch_001_final_rescan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_139_batch_001_final_rescan_execution_closeout.yaml` | not moved |
| 108 | `docs/v7_140_batch_002_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_140_batch_002_authorization_gate_closeout.md` | not moved |
| 109 | `docs/v7_140_batch_002_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_140_batch_002_authorization_gate_closeout.yaml` | not moved |
| 110 | `docs/v7_140_batch_002_authorization_gate.yaml` | `docs/archive/phases/v7/v7_140_batch_002_authorization_gate.yaml` | not moved |
| 111 | `docs/v7_141_batch_002_execution_closeout.md` | `docs/archive/phases/v7/v7_141_batch_002_execution_closeout.md` | not moved |
| 112 | `docs/v7_141_batch_002_execution_closeout.yaml` | `docs/archive/phases/v7/v7_141_batch_002_execution_closeout.yaml` | not moved |
| 113 | `docs/v7_142_batch_002_correction_planning_closeout.md` | `docs/archive/phases/v7/v7_142_batch_002_correction_planning_closeout.md` | not moved |
| 114 | `docs/v7_142_batch_002_correction_planning_closeout.yaml` | `docs/archive/phases/v7/v7_142_batch_002_correction_planning_closeout.yaml` | not moved |
| 115 | `docs/v7_142_batch_002_correction_planning.yaml` | `docs/archive/phases/v7/v7_142_batch_002_correction_planning.yaml` | not moved |
| 116 | `docs/v7_143_batch_002_permission_drift_analysis_gate_closeout.md` | `docs/archive/phases/v7/v7_143_batch_002_permission_drift_analysis_gate_closeout.md` | not moved |
| 117 | `docs/v7_143_batch_002_permission_drift_analysis_gate_closeout.yaml` | `docs/archive/phases/v7/v7_143_batch_002_permission_drift_analysis_gate_closeout.yaml` | not moved |
| 118 | `docs/v7_143_batch_002_permission_drift_analysis_gate.yaml` | `docs/archive/phases/v7/v7_143_batch_002_permission_drift_analysis_gate.yaml` | not moved |
| 119 | `docs/v7_144_batch_002_permission_drift_analysis_closeout.md` | `docs/archive/phases/v7/v7_144_batch_002_permission_drift_analysis_closeout.md` | not moved |
| 120 | `docs/v7_144_batch_002_permission_drift_analysis_closeout.yaml` | `docs/archive/phases/v7/v7_144_batch_002_permission_drift_analysis_closeout.yaml` | not moved |
| 121 | `docs/v7_144_batch_002_permission_drift_analysis.yaml` | `docs/archive/phases/v7/v7_144_batch_002_permission_drift_analysis.yaml` | not moved |
| 122 | `docs/v7_145_batch_002_correction_implementation_gate_closeout.md` | `docs/archive/phases/v7/v7_145_batch_002_correction_implementation_gate_closeout.md` | not moved |
| 123 | `docs/v7_145_batch_002_correction_implementation_gate_closeout.yaml` | `docs/archive/phases/v7/v7_145_batch_002_correction_implementation_gate_closeout.yaml` | not moved |
| 124 | `docs/v7_145_batch_002_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_145_batch_002_correction_implementation_gate.yaml` | not moved |
| 125 | `docs/v7_147_batch_002_rescan_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_147_batch_002_rescan_authorization_gate_closeout.md` | not moved |
| 126 | `docs/v7_147_batch_002_rescan_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_147_batch_002_rescan_authorization_gate_closeout.yaml` | not moved |
| 127 | `docs/v7_147_batch_002_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_147_batch_002_rescan_authorization_gate.yaml` | not moved |
| 128 | `docs/v7_148_batch_002_rescan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_148_batch_002_rescan_execution_closeout.yaml` | not moved |
| 129 | `docs/v7_149_batch_003_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_149_batch_003_authorization_gate_closeout.md` | not moved |
| 130 | `docs/v7_149_batch_003_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_149_batch_003_authorization_gate_closeout.yaml` | not moved |
| 131 | `docs/v7_149_batch_003_authorization_gate.yaml` | `docs/archive/phases/v7/v7_149_batch_003_authorization_gate.yaml` | not moved |
| 132 | `docs/v7_150_batch_003_execution_closeout.md` | `docs/archive/phases/v7/v7_150_batch_003_execution_closeout.md` | not moved |
| 133 | `docs/v7_150_batch_003_execution_closeout.yaml` | `docs/archive/phases/v7/v7_150_batch_003_execution_closeout.yaml` | not moved |
| 134 | `docs/v7_151_batch_003_correction_planning_closeout.md` | `docs/archive/phases/v7/v7_151_batch_003_correction_planning_closeout.md` | not moved |
| 135 | `docs/v7_151_batch_003_correction_planning_closeout.yaml` | `docs/archive/phases/v7/v7_151_batch_003_correction_planning_closeout.yaml` | not moved |
| 136 | `docs/v7_151_batch_003_correction_planning.yaml` | `docs/archive/phases/v7/v7_151_batch_003_correction_planning.yaml` | not moved |
| 137 | `docs/v7_152_batch_003_exact_finding_recovery_gate_closeout.md` | `docs/archive/phases/v7/v7_152_batch_003_exact_finding_recovery_gate_closeout.md` | not moved |
| 138 | `docs/v7_152_batch_003_exact_finding_recovery_gate_closeout.yaml` | `docs/archive/phases/v7/v7_152_batch_003_exact_finding_recovery_gate_closeout.yaml` | not moved |
| 139 | `docs/v7_152_batch_003_exact_finding_recovery_gate.yaml` | `docs/archive/phases/v7/v7_152_batch_003_exact_finding_recovery_gate.yaml` | not moved |
| 140 | `docs/v7_153_batch_003_exact_finding_recovery_closeout.md` | `docs/archive/phases/v7/v7_153_batch_003_exact_finding_recovery_closeout.md` | not moved |
| 141 | `docs/v7_153_batch_003_exact_finding_recovery_closeout.yaml` | `docs/archive/phases/v7/v7_153_batch_003_exact_finding_recovery_closeout.yaml` | not moved |
| 142 | `docs/v7_153_batch_003_exact_finding_recovery.yaml` | `docs/archive/phases/v7/v7_153_batch_003_exact_finding_recovery.yaml` | not moved |
| 143 | `docs/v7_154_batch_003_correction_implementation_gate_closeout.md` | `docs/archive/phases/v7/v7_154_batch_003_correction_implementation_gate_closeout.md` | not moved |
| 144 | `docs/v7_154_batch_003_correction_implementation_gate_closeout.yaml` | `docs/archive/phases/v7/v7_154_batch_003_correction_implementation_gate_closeout.yaml` | not moved |
| 145 | `docs/v7_154_batch_003_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_154_batch_003_correction_implementation_gate.yaml` | not moved |
| 146 | `docs/v7_156_batch_003_rescan_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_156_batch_003_rescan_authorization_gate_closeout.md` | not moved |
| 147 | `docs/v7_156_batch_003_rescan_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_156_batch_003_rescan_authorization_gate_closeout.yaml` | not moved |
| 148 | `docs/v7_156_batch_003_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_156_batch_003_rescan_authorization_gate.yaml` | not moved |
| 149 | `docs/v7_157_batch_003_rescan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_157_batch_003_rescan_execution_closeout.yaml` | not moved |
| 150 | `docs/v7_158_batch_004_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_158_batch_004_authorization_gate_closeout.md` | not moved |
| 151 | `docs/v7_158_batch_004_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_158_batch_004_authorization_gate_closeout.yaml` | not moved |
| 152 | `docs/v7_158_batch_004_authorization_gate.yaml` | `docs/archive/phases/v7/v7_158_batch_004_authorization_gate.yaml` | not moved |
| 153 | `docs/v7_159_batch_004_execution_closeout.md` | `docs/archive/phases/v7/v7_159_batch_004_execution_closeout.md` | not moved |
| 154 | `docs/v7_159_batch_004_execution_closeout.yaml` | `docs/archive/phases/v7/v7_159_batch_004_execution_closeout.yaml` | not moved |
| 155 | `docs/v7_160_batch_004_correction_planning_closeout.md` | `docs/archive/phases/v7/v7_160_batch_004_correction_planning_closeout.md` | not moved |
| 156 | `docs/v7_160_batch_004_correction_planning_closeout.yaml` | `docs/archive/phases/v7/v7_160_batch_004_correction_planning_closeout.yaml` | not moved |
| 157 | `docs/v7_160_batch_004_correction_planning.yaml` | `docs/archive/phases/v7/v7_160_batch_004_correction_planning.yaml` | not moved |
| 158 | `docs/v7_161_batch_004_correction_implementation_gate_closeout.md` | `docs/archive/phases/v7/v7_161_batch_004_correction_implementation_gate_closeout.md` | not moved |
| 159 | `docs/v7_161_batch_004_correction_implementation_gate_closeout.yaml` | `docs/archive/phases/v7/v7_161_batch_004_correction_implementation_gate_closeout.yaml` | not moved |
| 160 | `docs/v7_161_batch_004_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_161_batch_004_correction_implementation_gate.yaml` | not moved |
| 161 | `docs/v7_163_batch_004_rescan_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_163_batch_004_rescan_authorization_gate_closeout.md` | not moved |
| 162 | `docs/v7_163_batch_004_rescan_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_163_batch_004_rescan_authorization_gate_closeout.yaml` | not moved |
| 163 | `docs/v7_163_batch_004_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_163_batch_004_rescan_authorization_gate.yaml` | not moved |
| 164 | `docs/v7_164_batch_004_rescan_execution_closeout.md` | `docs/archive/phases/v7/v7_164_batch_004_rescan_execution_closeout.md` | not moved |
| 165 | `docs/v7_164_batch_004_rescan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_164_batch_004_rescan_execution_closeout.yaml` | not moved |
| 166 | `docs/v7_165_validator_governance_chain_v1_closeout_gate_closeout.md` | `docs/archive/phases/v7/v7_165_validator_governance_chain_v1_closeout_gate_closeout.md` | not moved |
| 167 | `docs/v7_165_validator_governance_chain_v1_closeout_gate_closeout.yaml` | `docs/archive/phases/v7/v7_165_validator_governance_chain_v1_closeout_gate_closeout.yaml` | not moved |
| 168 | `docs/v7_165_validator_governance_chain_v1_closeout_gate.yaml` | `docs/archive/phases/v7/v7_165_validator_governance_chain_v1_closeout_gate.yaml` | not moved |
| 169 | `docs/v7_166_validator_governance_chain_v1_final_closeout.md` | `docs/archive/phases/v7/v7_166_validator_governance_chain_v1_final_closeout.md` | not moved |
| 170 | `docs/v7_166_validator_governance_chain_v1_final_closeout.yaml` | `docs/archive/phases/v7/v7_166_validator_governance_chain_v1_final_closeout.yaml` | not moved |
| 171 | `docs/v7_169_agent_board_and_validator_patch_gate_closeout.yaml` | `docs/archive/phases/v7/v7_169_agent_board_and_validator_patch_gate_closeout.yaml` | not moved |
| 172 | `docs/v7_169_agent_board_and_validator_patch_gate.yaml` | `docs/archive/phases/v7/v7_169_agent_board_and_validator_patch_gate.yaml` | not moved |
| 173 | `docs/v7_174_post_validator_governance_route_selection_gate.md` | `docs/archive/phases/v7/v7_174_post_validator_governance_route_selection_gate.md` | not moved |
| 174 | `docs/v7_175_allowedSummaryFields_yaml_noise_hardening_gate.md` | `docs/archive/phases/v7/v7_175_allowedSummaryFields_yaml_noise_hardening_gate.md` | not moved |
| 175 | `docs/v7_177_post_governance_product_route_reopen_gate.md` | `docs/archive/phases/v7/v7_177_post_governance_product_route_reopen_gate.md` | not moved |
| 176 | `docs/v7_178_image_workflow_product_blueprint_gate.md` | `docs/archive/phases/v7/v7_178_image_workflow_product_blueprint_gate.md` | not moved |
| 177 | `docs/v7_179_prompt_package_registry_blueprint_gate.md` | `docs/archive/phases/v7/v7_179_prompt_package_registry_blueprint_gate.md` | not moved |
| 178 | `docs/v7_180_review_console_surface_blueprint_gate.md` | `docs/archive/phases/v7/v7_180_review_console_surface_blueprint_gate.md` | not moved |
| 179 | `docs/v7_183_product_workflow_package_index_gate.md` | `docs/archive/phases/v7/v7_183_product_workflow_package_index_gate.md` | not moved |
| 180 | `docs/v7_187_commander_worker_protocol_gate.md` | `docs/archive/phases/v7/v7_187_commander_worker_protocol_gate.md` | not moved |
| 181 | `docs/v7_188_single_worker_trial_closeout_protocol_gate.md` | `docs/archive/phases/v7/v7_188_single_worker_trial_closeout_protocol_gate.md` | not moved |
| 182 | `docs/v7_189_worker_scope_escalation_guard_gate.md` | `docs/archive/phases/v7/v7_189_worker_scope_escalation_guard_gate.md` | not moved |
| 183 | `docs/v7_190_commander_autonomy_rules_gate.md` | `docs/archive/phases/v7/v7_190_commander_autonomy_rules_gate.md` | not moved |
| 184 | `docs/v7_191_commander_mode_selection_autonomy_gate.md` | `docs/archive/phases/v7/v7_191_commander_mode_selection_autonomy_gate.md` | not moved |
| 185 | `docs/v7_192_smart_commander_continuation_policy_gate.md` | `docs/archive/phases/v7/v7_192_smart_commander_continuation_policy_gate.md` | not moved |
| 186 | `docs/v7_193_guarded_auto_push_and_review_policy_gate.md` | `docs/archive/phases/v7/v7_193_guarded_auto_push_and_review_policy_gate.md` | not moved |
| 187 | `docs/v7_194_smart_commander_maturity_gate.md` | `docs/archive/phases/v7/v7_194_smart_commander_maturity_gate.md` | not moved |
| 188 | `docs/v7_195_smart_commander_backlog_selection_gate.md` | `docs/archive/phases/v7/v7_195_smart_commander_backlog_selection_gate.md` | not moved |
| 189 | `docs/v7_196_smart_commander_scenario_training_gate.md` | `docs/archive/phases/v7/v7_196_smart_commander_scenario_training_gate.md` | not moved |
| 190 | `docs/v7_197_smart_commander_training_review_gate.md` | `docs/archive/phases/v7/v7_197_smart_commander_training_review_gate.md` | not moved |
| 191 | `docs/v7_198_smart_commander_consolidation_plan_gate.md` | `docs/archive/phases/v7/v7_198_smart_commander_consolidation_plan_gate.md` | not moved |
| 192 | `docs/v7_210_static_mockup_index_and_push_readiness_gate.md` | `docs/archive/phases/v7/v7_210_static_mockup_index_and_push_readiness_gate.md` | not moved |
| 193 | `docs/v7_213_static_mockup_index_and_quality_stop_gate.md` | `docs/archive/phases/v7/v7_213_static_mockup_index_and_quality_stop_gate.md` | not moved |
| 194 | `docs/v7_217_v10_12_provider_fingerprint_index_and_stop_gate.md` | `docs/archive/phases/v7/v7_217_v10_12_provider_fingerprint_index_and_stop_gate.md` | not moved |
| 195 | `docs/v7_218_mainline_post_provider_briefing_backlog_gate.md` | `docs/archive/phases/v7/v7_218_mainline_post_provider_briefing_backlog_gate.md` | not moved |
| 196 | `docs/v7_220_release_delta_index_and_quality_stop_gate.md` | `docs/archive/phases/v7/v7_220_release_delta_index_and_quality_stop_gate.md` | not moved |
| 197 | `docs/v7_221_mainline_quality_stop_and_next_authorization_options_gate.md` | `docs/archive/phases/v7/v7_221_mainline_quality_stop_and_next_authorization_options_gate.md` | not moved |
| 198 | `docs/v7_244_state_surface_reconciliation_after_repeated_quota_failure.md` | `docs/archive/phases/v7/v7_244_state_surface_reconciliation_after_repeated_quota_failure.md` | not moved |
| 199 | `docs/v7_245_native_doubao_syntax_and_sandbox_hardening.md` | `docs/archive/phases/v7/v7_245_native_doubao_syntax_and_sandbox_hardening.md` | not moved |
| 200 | `docs/v7_246_no_generation_quota_or_provider_path_diagnostic_readiness_gate.md` | `docs/archive/phases/v7/v7_246_no_generation_quota_or_provider_path_diagnostic_readiness_gate.md` | not moved |
| 201 | `docs/v7_247_provider_path_decision_package_gate.md` | `docs/archive/phases/v7/v7_247_provider_path_decision_package_gate.md` | not moved |
| 202 | `docs/v7_248_generation_stop_closeout_or_route_selection_request_gate.md` | `docs/archive/phases/v7/v7_248_generation_stop_closeout_or_route_selection_request_gate.md` | not moved |
| 203 | `docs/v7_249_static_review_surface_product_spec_gate.md` | `docs/archive/phases/v7/v7_249_static_review_surface_product_spec_gate.md` | not moved |
| 204 | `docs/v7_250_review_record_template_and_status_flow_gate.md` | `docs/archive/phases/v7/v7_250_review_record_template_and_status_flow_gate.md` | not moved |
| 205 | `docs/v7_251_static_review_surface_acceptance_checklist_gate.md` | `docs/archive/phases/v7/v7_251_static_review_surface_acceptance_checklist_gate.md` | not moved |
| 206 | `docs/v7_252_static_review_surface_mockup_readiness_review_gate.md` | `docs/archive/phases/v7/v7_252_static_review_surface_mockup_readiness_review_gate.md` | not moved |
| 207 | `docs/v7_253_static_review_surface_mockup_spec_gate.md` | `docs/archive/phases/v7/v7_253_static_review_surface_mockup_spec_gate.md` | not moved |
| 208 | `docs/v7_254_static_review_surface_mockup_file_gate.md` | `docs/archive/phases/v7/v7_254_static_review_surface_mockup_file_gate.md` | not moved |
| 209 | `docs/v7_255_static_review_surface_mockup_acceptance_review_gate.md` | `docs/archive/phases/v7/v7_255_static_review_surface_mockup_acceptance_review_gate.md` | not moved |
| 210 | `docs/v7_256_static_review_surface_acceptance_patch_gate.md` | `docs/archive/phases/v7/v7_256_static_review_surface_acceptance_patch_gate.md` | not moved |
| 211 | `docs/v7_257_static_review_surface_quality_stop_or_next_product_decision_gate.md` | `docs/archive/phases/v7/v7_257_static_review_surface_quality_stop_or_next_product_decision_gate.md` | not moved |
| 212 | `docs/v7_258_product_workflow_fixture_packet_gate.md` | `docs/archive/phases/v7/v7_258_product_workflow_fixture_packet_gate.md` | not moved |
| 213 | `docs/v7_259_product_workflow_fixture_packet_acceptance_review_gate.md` | `docs/archive/phases/v7/v7_259_product_workflow_fixture_packet_acceptance_review_gate.md` | not moved |
| 214 | `docs/v7_261_human_product_route_selection_request_gate.md` | `docs/archive/phases/v7/v7_261_human_product_route_selection_request_gate.md` | not moved |
| 215 | `docs/v7_262_project_plugin_route_authorization_planning_gate.md` | `docs/archive/phases/v7/v7_262_project_plugin_route_authorization_planning_gate.md` | not moved |
| 216 | `docs/v7_264_project_plugin_A5_authorization_draft_review_gate.md` | `docs/archive/phases/v7/v7_264_project_plugin_A5_authorization_draft_review_gate.md` | not moved |
| 217 | `docs/v7_265_true_A5_authorization_request_gate.md` | `docs/archive/phases/v7/v7_265_true_A5_authorization_request_gate.md` | not moved |
| 218 | `docs/v7_268b_true_A5_minimal_real_generation_authorization_gate.md` | `docs/archive/phases/v7/v7_268b_true_A5_minimal_real_generation_authorization_gate.md` | not moved |
| 219 | `docs/v7_270_human_review_of_real_outputs.md` | `docs/archive/phases/v7/v7_270_human_review_of_real_outputs.md` | not moved |
| 220 | `docs/v7_271_prompt_revision_plan_from_first_real_output.md` | `docs/archive/phases/v7/v7_271_prompt_revision_plan_from_first_real_output.md` | not moved |
| 221 | `docs/v7_273_second_minimal_generation_trial_authorization_gate.md` | `docs/archive/phases/v7/v7_273_second_minimal_generation_trial_authorization_gate.md` | not moved |
| 222 | `docs/v7_275_human_review_of_second_real_outputs.md` | `docs/archive/phases/v7/v7_275_human_review_of_second_real_outputs.md` | not moved |
| 223 | `docs/v7_276_prompt_v3_minor_refinement_and_third_trial_authorization_gate.md` | `docs/archive/phases/v7/v7_276_prompt_v3_minor_refinement_and_third_trial_authorization_gate.md` | not moved |
| 224 | `docs/v7_278_human_review_of_third_real_outputs.md` | `docs/archive/phases/v7/v7_278_human_review_of_third_real_outputs.md` | not moved |
| 225 | `docs/v7_279_best_candidate_selection_or_fourth_trial_decision_gate.md` | `docs/archive/phases/v7/v7_279_best_candidate_selection_or_fourth_trial_decision_gate.md` | not moved |
| 226 | `docs/v7_282_human_review_of_fourth_real_outputs.md` | `docs/archive/phases/v7/v7_282_human_review_of_fourth_real_outputs.md` | not moved |
| 227 | `docs/v7_283_candidate_acceptance_or_final_retouch_decision_gate.md` | `docs/archive/phases/v7/v7_283_candidate_acceptance_or_final_retouch_decision_gate.md` | not moved |
| 228 | `docs/v7_284_accepted_candidate_evidence_package.md` | `docs/archive/phases/v7/v7_284_accepted_candidate_evidence_package.md` | not moved |
| 229 | `docs/v7_285_v7_product_loop_closeout_and_v8_route_planning_gate.md` | `docs/archive/phases/v7/v7_285_v7_product_loop_closeout_and_v8_route_planning_gate.md` | not moved |
| 230 | `docs/v7_50_vcp_read_only_bridge_planning.md` | `docs/archive/phases/v7/v7_50_vcp_read_only_bridge_planning.md` | not moved |
| 231 | `docs/v7_50_vcp_read_only_bridge_validation_plan.md` | `docs/archive/phases/v7/v7_50_vcp_read_only_bridge_validation_plan.md` | not moved |
| 232 | `docs/v7_50a_vcp_read_only_bridge_local_schema_validation_execution_report.md` | `docs/archive/phases/v7/v7_50a_vcp_read_only_bridge_local_schema_validation_execution_report.md` | not moved |
| 233 | `docs/v7_50a_vcp_read_only_bridge_local_schema_validation_result.yaml` | `docs/archive/phases/v7/v7_50a_vcp_read_only_bridge_local_schema_validation_result.yaml` | not moved |
| 234 | `docs/v7_50ab_vcp_read_only_bridge_validation_cases.yaml` | `docs/archive/phases/v7/v7_50ab_vcp_read_only_bridge_validation_cases.yaml` | not moved |
| 235 | `docs/v7_50ab_vcp_read_only_bridge_validation_planning_index.md` | `docs/archive/phases/v7/v7_50ab_vcp_read_only_bridge_validation_planning_index.md` | not moved |
| 236 | `docs/v7_50b_vcp_read_only_bridge_mock_payload_validation_execution_report.md` | `docs/archive/phases/v7/v7_50b_vcp_read_only_bridge_mock_payload_validation_execution_report.md` | not moved |
| 237 | `docs/v7_50b_vcp_read_only_bridge_mock_payload_validation_result.yaml` | `docs/archive/phases/v7/v7_50b_vcp_read_only_bridge_mock_payload_validation_result.yaml` | not moved |
| 238 | `docs/v7_50c_vcp_read_only_bridge_dry_run_execution_report.md` | `docs/archive/phases/v7/v7_50c_vcp_read_only_bridge_dry_run_execution_report.md` | not moved |
| 239 | `docs/v7_50c_vcp_read_only_bridge_dry_run_execution_result.yaml` | `docs/archive/phases/v7/v7_50c_vcp_read_only_bridge_dry_run_execution_result.yaml` | not moved |
| 240 | `docs/v7_50c_vcp_read_only_bridge_dry_run_plan.yaml` | `docs/archive/phases/v7/v7_50c_vcp_read_only_bridge_dry_run_plan.yaml` | not moved |
| 241 | `docs/v7_50c_vcp_read_only_bridge_dry_run_planning.md` | `docs/archive/phases/v7/v7_50c_vcp_read_only_bridge_dry_run_planning.md` | not moved |
| 242 | `docs/v7_50d_vcpchat_review_console_surface_plan.yaml` | `docs/archive/phases/v7/v7_50d_vcpchat_review_console_surface_plan.yaml` | not moved |
| 243 | `docs/v7_50d_vcpchat_review_console_surface_planning.md` | `docs/archive/phases/v7/v7_50d_vcpchat_review_console_surface_planning.md` | not moved |
| 244 | `docs/v7_50d_vcpchat_review_console_surface_static_fixture_result.yaml` | `docs/archive/phases/v7/v7_50d_vcpchat_review_console_surface_static_fixture_result.yaml` | not moved |
| 245 | `docs/v7_51_french_summer_rattan_bag_v3_production_candidate_001_plan.md` | `docs/archive/phases/v7/v7_51_french_summer_rattan_bag_v3_production_candidate_001_plan.md` | not moved |
| 246 | `docs/v7_51a_agent_image_lab_read_only_evidence_index.yaml` | `docs/archive/phases/v7/v7_51a_agent_image_lab_read_only_evidence_index.yaml` | not moved |
| 247 | `docs/v7_51b_read_only_bridge_adapter_contract.yaml` | `docs/archive/phases/v7/v7_51b_read_only_bridge_adapter_contract.yaml` | not moved |
| 248 | `docs/v7_51c_read_only_bridge_adapter_implementation_plan.yaml` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_implementation_plan.yaml` | not moved |
| 249 | `docs/v7_51d_local_read_only_adapter_runtime_implementation_report.md` | `docs/archive/phases/v7/v7_51d_local_read_only_adapter_runtime_implementation_report.md` | not moved |
| 250 | `docs/v7_51d_local_read_only_adapter_runtime_implementation_result.yaml` | `docs/archive/phases/v7/v7_51d_local_read_only_adapter_runtime_implementation_result.yaml` | not moved |
| 251 | `docs/v7_51e_read_only_bridge_adapter_schema_validation_result.yaml` | `docs/archive/phases/v7/v7_51e_read_only_bridge_adapter_schema_validation_result.yaml` | not moved |
| 252 | `docs/v7_51f_read_only_bridge_adapter_security_gate_validation_result.yaml` | `docs/archive/phases/v7/v7_51f_read_only_bridge_adapter_security_gate_validation_result.yaml` | not moved |
| 253 | `docs/v7_51g_read_only_bridge_adapter_fixture_regression_result.yaml` | `docs/archive/phases/v7/v7_51g_read_only_bridge_adapter_fixture_regression_result.yaml` | not moved |
| 254 | `docs/v7_51i_adapter_quality_hardening_patch_report.md` | `docs/archive/phases/v7/v7_51i_adapter_quality_hardening_patch_report.md` | not moved |
| 255 | `docs/v7_51i_adapter_quality_hardening_patch_result.yaml` | `docs/archive/phases/v7/v7_51i_adapter_quality_hardening_patch_result.yaml` | not moved |
| 256 | `docs/v7_51j_adapter_pro_review_findings_patch_result.yaml` | `docs/archive/phases/v7/v7_51j_adapter_pro_review_findings_patch_result.yaml` | not moved |
| 257 | `docs/v7_52d_vcptoolbox_mock_ingestion_validation_result.yaml` | `docs/archive/phases/v7/v7_52d_vcptoolbox_mock_ingestion_validation_result.yaml` | not moved |
| 258 | `docs/v7_52f_vcptoolbox_read_only_ingestion_closeout.yaml` | `docs/archive/phases/v7/v7_52f_vcptoolbox_read_only_ingestion_closeout.yaml` | not moved |
| 259 | `docs/v7_52f1_vcptoolbox_mock_call_adapter_hardening_report.md` | `docs/archive/phases/v7/v7_52f1_vcptoolbox_mock_call_adapter_hardening_report.md` | not moved |
| 260 | `docs/v7_52f1_vcptoolbox_mock_call_adapter_hardening_result.yaml` | `docs/archive/phases/v7/v7_52f1_vcptoolbox_mock_call_adapter_hardening_result.yaml` | not moved |
| 261 | `docs/v7_53a_e2e_read_only_integration_plan.md` | `docs/archive/phases/v7/v7_53a_e2e_read_only_integration_plan.md` | not moved |
| 262 | `docs/v7_53a_e2e_read_only_integration_plan.yaml` | `docs/archive/phases/v7/v7_53a_e2e_read_only_integration_plan.yaml` | not moved |
| 263 | `docs/v7_53b_e2e_read_only_integration_fixture_validation_report.md` | `docs/archive/phases/v7/v7_53b_e2e_read_only_integration_fixture_validation_report.md` | not moved |
| 264 | `docs/v7_53b_e2e_read_only_integration_fixture_validation_result.yaml` | `docs/archive/phases/v7/v7_53b_e2e_read_only_integration_fixture_validation_result.yaml` | not moved |
| 265 | `docs/v7_53c_e2e_read_only_integration_security_audit.md` | `docs/archive/phases/v7/v7_53c_e2e_read_only_integration_security_audit.md` | not moved |
| 266 | `docs/v7_53d_e2e_read_only_integration_failure_mode_validation_report.md` | `docs/archive/phases/v7/v7_53d_e2e_read_only_integration_failure_mode_validation_report.md` | not moved |
| 267 | `docs/v7_53d_e2e_read_only_integration_failure_mode_validation_result.yaml` | `docs/archive/phases/v7/v7_53d_e2e_read_only_integration_failure_mode_validation_result.yaml` | not moved |
| 268 | `docs/v7_53e_e2e_read_only_integration_closeout.md` | `docs/archive/phases/v7/v7_53e_e2e_read_only_integration_closeout.md` | not moved |
| 269 | `docs/v7_53e_e2e_read_only_integration_closeout.yaml` | `docs/archive/phases/v7/v7_53e_e2e_read_only_integration_closeout.yaml` | not moved |
| 270 | `docs/v7_53f1_e2e_fixture_quality_hardening_report.md` | `docs/archive/phases/v7/v7_53f1_e2e_fixture_quality_hardening_report.md` | not moved |
| 271 | `docs/v7_53f1_e2e_fixture_quality_hardening_result.yaml` | `docs/archive/phases/v7/v7_53f1_e2e_fixture_quality_hardening_result.yaml` | not moved |
| 272 | `docs/v7_54a_lt06_real_vcptoolbox_read_only_dry_run_planning.md` | `docs/archive/phases/v7/v7_54a_lt06_real_vcptoolbox_read_only_dry_run_planning.md` | not moved |
| 273 | `docs/v7_54b_lt06_real_vcptoolbox_read_only_dry_run_contract.md` | `docs/archive/phases/v7/v7_54b_lt06_real_vcptoolbox_read_only_dry_run_contract.md` | not moved |
| 274 | `docs/v7_54c_lt06_a5_authorization_package_prepared.md` | `docs/archive/phases/v7/v7_54c_lt06_a5_authorization_package_prepared.md` | not moved |
| 275 | `docs/v7_54d_lt06_preflight_checklist.md` | `docs/archive/phases/v7/v7_54d_lt06_preflight_checklist.md` | not moved |
| 276 | `docs/v7_54e_lt06_execution_runbook.md` | `docs/archive/phases/v7/v7_54e_lt06_execution_runbook.md` | not moved |
| 277 | `docs/v7_54f_lt06_safety_gates.md` | `docs/archive/phases/v7/v7_54f_lt06_safety_gates.md` | not moved |
| 278 | `docs/v7_54g_lt06_planning_authorization_closeout.md` | `docs/archive/phases/v7/v7_54g_lt06_planning_authorization_closeout.md` | not moved |
| 279 | `docs/v7_54g_lt06_planning_authorization_closeout.yaml` | `docs/archive/phases/v7/v7_54g_lt06_planning_authorization_closeout.yaml` | not moved |
| 280 | `docs/v7_55a_cross_repo_read_only_boundary_review_plan.md` | `docs/archive/phases/v7/v7_55a_cross_repo_read_only_boundary_review_plan.md` | not moved |
| 281 | `docs/v7_55b_agent_image_lab_boundary_summary.md` | `docs/archive/phases/v7/v7_55b_agent_image_lab_boundary_summary.md` | not moved |
| 282 | `docs/v7_55c_vcptoolbox_read_only_boundary_review.md` | `docs/archive/phases/v7/v7_55c_vcptoolbox_read_only_boundary_review.md` | not moved |
| 283 | `docs/v7_55d_vcpchat_surface_boundary_review.md` | `docs/archive/phases/v7/v7_55d_vcpchat_surface_boundary_review.md` | not moved |
| 284 | `docs/v7_55e_cross_repo_risk_register.md` | `docs/archive/phases/v7/v7_55e_cross_repo_risk_register.md` | not moved |
| 285 | `docs/v7_55f_lt06_execution_prerequisite_gap_analysis.md` | `docs/archive/phases/v7/v7_55f_lt06_execution_prerequisite_gap_analysis.md` | not moved |
| 286 | `docs/v7_55g_cross_repo_review_decision_matrix.md` | `docs/archive/phases/v7/v7_55g_cross_repo_review_decision_matrix.md` | not moved |
| 287 | `docs/v7_55h_cross_repo_boundary_review_closeout.md` | `docs/archive/phases/v7/v7_55h_cross_repo_boundary_review_closeout.md` | not moved |
| 288 | `docs/v7_55h_cross_repo_boundary_review_closeout.yaml` | `docs/archive/phases/v7/v7_55h_cross_repo_boundary_review_closeout.yaml` | not moved |
| 289 | `docs/v7_55i_cross_repo_review_next_actions.md` | `docs/archive/phases/v7/v7_55i_cross_repo_review_next_actions.md` | not moved |
| 290 | `docs/v7_55i_evidence_gap_closure_closeout.md` | `docs/archive/phases/v7/v7_55i_evidence_gap_closure_closeout.md` | not moved |
| 291 | `docs/v7_55i_evidence_gap_closure_closeout.yaml` | `docs/archive/phases/v7/v7_55i_evidence_gap_closure_closeout.yaml` | not moved |
| 292 | `docs/v7_55i_evidence_gap_closure_source_availability_plan.md` | `docs/archive/phases/v7/v7_55i_evidence_gap_closure_source_availability_plan.md` | not moved |
| 293 | `docs/v7_55i_lt06_gap_closure_decision.md` | `docs/archive/phases/v7/v7_55i_lt06_gap_closure_decision.md` | not moved |
| 294 | `docs/v7_55i_vcpchat_source_availability_report.md` | `docs/archive/phases/v7/v7_55i_vcpchat_source_availability_report.md` | not moved |
| 295 | `docs/v7_55i_vcpchat_surface_boundary_evidence_map.md` | `docs/archive/phases/v7/v7_55i_vcpchat_surface_boundary_evidence_map.md` | not moved |
| 296 | `docs/v7_55i_vcptoolbox_read_only_boundary_evidence_map.md` | `docs/archive/phases/v7/v7_55i_vcptoolbox_read_only_boundary_evidence_map.md` | not moved |
| 297 | `docs/v7_55i_vcptoolbox_source_availability_report.md` | `docs/archive/phases/v7/v7_55i_vcptoolbox_source_availability_report.md` | not moved |
| 298 | `docs/v7_55j_lt06_execution_gate_update.md` | `docs/archive/phases/v7/v7_55j_lt06_execution_gate_update.md` | not moved |
| 299 | `docs/v7_55j_vcp_deep_boundary_probe_closeout.md` | `docs/archive/phases/v7/v7_55j_vcp_deep_boundary_probe_closeout.md` | not moved |
| 300 | `docs/v7_55j_vcp_deep_boundary_probe_closeout.yaml` | `docs/archive/phases/v7/v7_55j_vcp_deep_boundary_probe_closeout.yaml` | not moved |
| 301 | `docs/v7_55j_vcp_deep_boundary_probe_plan.md` | `docs/archive/phases/v7/v7_55j_vcp_deep_boundary_probe_plan.md` | not moved |
| 302 | `docs/v7_55j_vcp_security_risk_alignment.md` | `docs/archive/phases/v7/v7_55j_vcp_security_risk_alignment.md` | not moved |
| 303 | `docs/v7_55j_vcpchat_pr35_surface_probe.md` | `docs/archive/phases/v7/v7_55j_vcpchat_pr35_surface_probe.md` | not moved |
| 304 | `docs/v7_55j_vcpchat_secret_and_bridge_probe.md` | `docs/archive/phases/v7/v7_55j_vcpchat_secret_and_bridge_probe.md` | not moved |
| 305 | `docs/v7_55j_vcptoolbox_no_write_endpoint_probe.md` | `docs/archive/phases/v7/v7_55j_vcptoolbox_no_write_endpoint_probe.md` | not moved |
| 306 | `docs/v7_55j_vcptoolbox_writable_path_probe.md` | `docs/archive/phases/v7/v7_55j_vcptoolbox_writable_path_probe.md` | not moved |
| 307 | `docs/v7_56a_wording_harmonization_patch.md` | `docs/archive/phases/v7/v7_56a_wording_harmonization_patch.md` | not moved |
| 308 | `docs/v7_56a_wording_harmonization_patch.yaml` | `docs/archive/phases/v7/v7_56a_wording_harmonization_patch.yaml` | not moved |
| 309 | `docs/v7_57a_lt06_no_write_route_probe_plan.md` | `docs/archive/phases/v7/v7_57a_lt06_no_write_route_probe_plan.md` | not moved |
| 310 | `docs/v7_57b_exact_endpoint_or_command_candidate_matrix.md` | `docs/archive/phases/v7/v7_57b_exact_endpoint_or_command_candidate_matrix.md` | not moved |
| 311 | `docs/v7_57c_endpoint_level_allowlist_or_no_write_gate_analysis.md` | `docs/archive/phases/v7/v7_57c_endpoint_level_allowlist_or_no_write_gate_analysis.md` | not moved |
| 312 | `docs/v7_57d_dailynote_unreachable_proof_analysis.md` | `docs/archive/phases/v7/v7_57d_dailynote_unreachable_proof_analysis.md` | not moved |
| 313 | `docs/v7_57e_codexmemorybridge_unreachable_proof_analysis.md` | `docs/archive/phases/v7/v7_57e_codexmemorybridge_unreachable_proof_analysis.md` | not moved |
| 314 | `docs/v7_57f_plugin_callback_and_post_response_hook_analysis.md` | `docs/archive/phases/v7/v7_57f_plugin_callback_and_post_response_hook_analysis.md` | not moved |
| 315 | `docs/v7_57g_lt06_a5_blocking_gate_matrix.md` | `docs/archive/phases/v7/v7_57g_lt06_a5_blocking_gate_matrix.md` | not moved |
| 316 | `docs/v7_57h_no_write_route_unreachable_proof_closeout.md` | `docs/archive/phases/v7/v7_57h_no_write_route_unreachable_proof_closeout.md` | not moved |
| 317 | `docs/v7_57h_no_write_route_unreachable_proof_closeout.yaml` | `docs/archive/phases/v7/v7_57h_no_write_route_unreachable_proof_closeout.yaml` | not moved |
| 318 | `docs/v7_57i_next_action_recommendation.md` | `docs/archive/phases/v7/v7_57i_next_action_recommendation.md` | not moved |
| 319 | `docs/v7_57j_long_term_evolution_plan_update.md` | `docs/archive/phases/v7/v7_57j_long_term_evolution_plan_update.md` | not moved |
| 320 | `docs/v7_57j_long_term_evolution_plan_update.yaml` | `docs/archive/phases/v7/v7_57j_long_term_evolution_plan_update.yaml` | not moved |
| 321 | `docs/v7_58a_route_identity_clarification.md` | `docs/archive/phases/v7/v7_58a_route_identity_clarification.md` | not moved |
| 322 | `docs/v7_58b_record_memory_exclusion_proof.md` | `docs/archive/phases/v7/v7_58b_record_memory_exclusion_proof.md` | not moved |
| 323 | `docs/v7_58c_search_memory_recall_audit_side_effect_analysis.md` | `docs/archive/phases/v7/v7_58c_search_memory_recall_audit_side_effect_analysis.md` | not moved |
| 324 | `docs/v7_58d_memory_overview_zero_write_static_proof.md` | `docs/archive/phases/v7/v7_58d_memory_overview_zero_write_static_proof.md` | not moved |
| 325 | `docs/v7_58e_zero_write_vs_observe_only_policy_matrix.md` | `docs/archive/phases/v7/v7_58e_zero_write_vs_observe_only_policy_matrix.md` | not moved |
| 326 | `docs/v7_58f_lt06_route_recommendation.md` | `docs/archive/phases/v7/v7_58f_lt06_route_recommendation.md` | not moved |
| 327 | `docs/v7_58g_route_identity_no_write_probe_closeout.md` | `docs/archive/phases/v7/v7_58g_route_identity_no_write_probe_closeout.md` | not moved |
| 328 | `docs/v7_58h_zero_write_policy_decision_memory_overview_route_plan.md` | `docs/archive/phases/v7/v7_58h_zero_write_policy_decision_memory_overview_route_plan.md` | not moved |
| 329 | `docs/v7_58h_zero_write_policy_decision_memory_overview_route_plan.yaml` | `docs/archive/phases/v7/v7_58h_zero_write_policy_decision_memory_overview_route_plan.yaml` | not moved |
| 330 | `docs/v7_58i_memory_overview_a5_planning_closeout.md` | `docs/archive/phases/v7/v7_58i_memory_overview_a5_planning_closeout.md` | not moved |
| 331 | `docs/v7_58i_memory_overview_a5_planning_closeout.yaml` | `docs/archive/phases/v7/v7_58i_memory_overview_a5_planning_closeout.yaml` | not moved |
| 332 | `docs/v7_58i_memory_overview_a5_planning_package.md` | `docs/archive/phases/v7/v7_58i_memory_overview_a5_planning_package.md` | not moved |
| 333 | `docs/v7_58i_memory_overview_execution_runbook.md` | `docs/archive/phases/v7/v7_58i_memory_overview_execution_runbook.md` | not moved |
| 334 | `docs/v7_58i_memory_overview_go_no_go_matrix.md` | `docs/archive/phases/v7/v7_58i_memory_overview_go_no_go_matrix.md` | not moved |
| 335 | `docs/v7_58i_memory_overview_payload_contract.md` | `docs/archive/phases/v7/v7_58i_memory_overview_payload_contract.md` | not moved |
| 336 | `docs/v7_58i_memory_overview_preflight_checklist.md` | `docs/archive/phases/v7/v7_58i_memory_overview_preflight_checklist.md` | not moved |
| 337 | `docs/v7_58i_memory_overview_route_contract.md` | `docs/archive/phases/v7/v7_58i_memory_overview_route_contract.md` | not moved |
| 338 | `docs/v7_58i1_memory_overview_exact_payload_and_redaction_patch.md` | `docs/archive/phases/v7/v7_58i1_memory_overview_exact_payload_and_redaction_patch.md` | not moved |
| 339 | `docs/v7_58i1_memory_overview_exact_payload_and_redaction_patch.yaml` | `docs/archive/phases/v7/v7_58i1_memory_overview_exact_payload_and_redaction_patch.yaml` | not moved |
| 340 | `docs/v7_58j_memory_overview_independent_A5_request_text_closeout.md` | `docs/archive/phases/v7/v7_58j_memory_overview_independent_A5_request_text_closeout.md` | not moved |
| 341 | `docs/v7_58j_memory_overview_independent_A5_request_text_closeout.yaml` | `docs/archive/phases/v7/v7_58j_memory_overview_independent_A5_request_text_closeout.yaml` | not moved |
| 342 | `docs/v7_58j_memory_overview_independent_A5_request_text.yaml` | `docs/archive/phases/v7/v7_58j_memory_overview_independent_A5_request_text.yaml` | not moved |
| 343 | `docs/v7_58k_memory_overview_target_identity_base_url_lock.yaml` | `docs/archive/phases/v7/v7_58k_memory_overview_target_identity_base_url_lock.yaml` | not moved |
| 344 | `docs/v7_58k_memory_overview_target_identity_closeout.md` | `docs/archive/phases/v7/v7_58k_memory_overview_target_identity_closeout.md` | not moved |
| 345 | `docs/v7_58k_memory_overview_target_identity_closeout.yaml` | `docs/archive/phases/v7/v7_58k_memory_overview_target_identity_closeout.yaml` | not moved |
| 346 | `docs/v7_58l_memory_overview_base_url_patch_closeout.yaml` | `docs/archive/phases/v7/v7_58l_memory_overview_base_url_patch_closeout.yaml` | not moved |
| 347 | `docs/v7_58l_memory_overview_base_url_patch.yaml` | `docs/archive/phases/v7/v7_58l_memory_overview_base_url_patch.yaml` | not moved |
| 348 | `docs/v7_59_lt06_execution_closeout_seal.md` | `docs/archive/phases/v7/v7_59_lt06_execution_closeout_seal.md` | not moved |
| 349 | `docs/v7_59_lt06_execution_closeout_seal.yaml` | `docs/archive/phases/v7/v7_59_lt06_execution_closeout_seal.yaml` | not moved |
| 350 | `docs/v7_60_vcpchat_surface_check_planning_closeout.md` | `docs/archive/phases/v7/v7_60_vcpchat_surface_check_planning_closeout.md` | not moved |
| 351 | `docs/v7_60_vcpchat_surface_check_planning_closeout.yaml` | `docs/archive/phases/v7/v7_60_vcpchat_surface_check_planning_closeout.yaml` | not moved |
| 352 | `docs/v7_60_vcpchat_surface_check_planning.yaml` | `docs/archive/phases/v7/v7_60_vcpchat_surface_check_planning.yaml` | not moved |
| 353 | `docs/v7_61_vcpchat_surface_check_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_61_vcpchat_surface_check_authorization_package_closeout.md` | not moved |
| 354 | `docs/v7_61_vcpchat_surface_check_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_61_vcpchat_surface_check_authorization_package_closeout.yaml` | not moved |
| 355 | `docs/v7_61_vcpchat_surface_check_authorization_package.yaml` | `docs/archive/phases/v7/v7_61_vcpchat_surface_check_authorization_package.yaml` | not moved |
| 356 | `docs/v7_62_vcpchat_bridge_contract_static_review_planning_closeout.md` | `docs/archive/phases/v7/v7_62_vcpchat_bridge_contract_static_review_planning_closeout.md` | not moved |
| 357 | `docs/v7_62_vcpchat_bridge_contract_static_review_planning_closeout.yaml` | `docs/archive/phases/v7/v7_62_vcpchat_bridge_contract_static_review_planning_closeout.yaml` | not moved |
| 358 | `docs/v7_62_vcpchat_bridge_contract_static_review_planning.yaml` | `docs/archive/phases/v7/v7_62_vcpchat_bridge_contract_static_review_planning.yaml` | not moved |
| 359 | `docs/v7_63_vcpchat_bridge_contract_static_code_review_package_closeout.md` | `docs/archive/phases/v7/v7_63_vcpchat_bridge_contract_static_code_review_package_closeout.md` | not moved |
| 360 | `docs/v7_63_vcpchat_bridge_contract_static_code_review_package_closeout.yaml` | `docs/archive/phases/v7/v7_63_vcpchat_bridge_contract_static_code_review_package_closeout.yaml` | not moved |
| 361 | `docs/v7_63_vcpchat_bridge_contract_static_code_review_package.yaml` | `docs/archive/phases/v7/v7_63_vcpchat_bridge_contract_static_code_review_package.yaml` | not moved |
| 362 | `docs/v7_64_vcpchat_bridge_contract_static_code_review_execution_closeout.md` | `docs/archive/phases/v7/v7_64_vcpchat_bridge_contract_static_code_review_execution_closeout.md` | not moved |
| 363 | `docs/v7_64_vcpchat_bridge_contract_static_code_review_execution_closeout.yaml` | `docs/archive/phases/v7/v7_64_vcpchat_bridge_contract_static_code_review_execution_closeout.yaml` | not moved |
| 364 | `docs/v7_64_vcpchat_bridge_contract_static_code_review_execution.yaml` | `docs/archive/phases/v7/v7_64_vcpchat_bridge_contract_static_code_review_execution.yaml` | not moved |
| 365 | `docs/v7_65_vcpchat_surface_check_authorization_package_v2_closeout.md` | `docs/archive/phases/v7/v7_65_vcpchat_surface_check_authorization_package_v2_closeout.md` | not moved |
| 366 | `docs/v7_65_vcpchat_surface_check_authorization_package_v2_closeout.yaml` | `docs/archive/phases/v7/v7_65_vcpchat_surface_check_authorization_package_v2_closeout.yaml` | not moved |
| 367 | `docs/v7_65_vcpchat_surface_check_authorization_package_v2.yaml` | `docs/archive/phases/v7/v7_65_vcpchat_surface_check_authorization_package_v2.yaml` | not moved |
| 368 | `docs/v7_66_vcpchat_cancel_only_preflight_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_66_vcpchat_cancel_only_preflight_authorization_package_closeout.md` | not moved |
| 369 | `docs/v7_66_vcpchat_cancel_only_preflight_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_66_vcpchat_cancel_only_preflight_authorization_package_closeout.yaml` | not moved |
| 370 | `docs/v7_66_vcpchat_cancel_only_preflight_authorization_package.yaml` | `docs/archive/phases/v7/v7_66_vcpchat_cancel_only_preflight_authorization_package.yaml` | not moved |
| 371 | `docs/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate_closeout.md` | not moved |
| 372 | `docs/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate_closeout.yaml` | not moved |
| 373 | `docs/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate.yaml` | `docs/archive/phases/v7/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate.yaml` | not moved |
| 374 | `docs/v7_68_exact_port_selection_planning_closeout.md` | `docs/archive/phases/v7/v7_68_exact_port_selection_planning_closeout.md` | not moved |
| 375 | `docs/v7_68_exact_port_selection_planning_closeout.yaml` | `docs/archive/phases/v7/v7_68_exact_port_selection_planning_closeout.yaml` | not moved |
| 376 | `docs/v7_68_exact_port_selection_planning.yaml` | `docs/archive/phases/v7/v7_68_exact_port_selection_planning.yaml` | not moved |
| 377 | `docs/v7_69_port_check_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_69_port_check_authorization_package_closeout.md` | not moved |
| 378 | `docs/v7_69_port_check_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_69_port_check_authorization_package_closeout.yaml` | not moved |
| 379 | `docs/v7_69_port_check_authorization_package.yaml` | `docs/archive/phases/v7/v7_69_port_check_authorization_package.yaml` | not moved |
| 380 | `docs/v7_70_port_check_execution_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_70_port_check_execution_authorization_gate_closeout.md` | not moved |
| 381 | `docs/v7_70_port_check_execution_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_70_port_check_execution_authorization_gate_closeout.yaml` | not moved |
| 382 | `docs/v7_70_port_check_execution_authorization_gate.yaml` | `docs/archive/phases/v7/v7_70_port_check_execution_authorization_gate.yaml` | not moved |
| 383 | `docs/v7_71_port_check_execution_closeout.yaml` | `docs/archive/phases/v7/v7_71_port_check_execution_closeout.yaml` | not moved |
| 384 | `docs/v7_72_concrete_cdp_endpoint_lock_patch_closeout.md` | `docs/archive/phases/v7/v7_72_concrete_cdp_endpoint_lock_patch_closeout.md` | not moved |
| 385 | `docs/v7_72_concrete_cdp_endpoint_lock_patch_closeout.yaml` | `docs/archive/phases/v7/v7_72_concrete_cdp_endpoint_lock_patch_closeout.yaml` | not moved |
| 386 | `docs/v7_72_concrete_cdp_endpoint_lock_patch.yaml` | `docs/archive/phases/v7/v7_72_concrete_cdp_endpoint_lock_patch.yaml` | not moved |
| 387 | `docs/v7_73_electron_launch_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_73_electron_launch_authorization_package_closeout.md` | not moved |
| 388 | `docs/v7_73_electron_launch_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_73_electron_launch_authorization_package_closeout.yaml` | not moved |
| 389 | `docs/v7_73_electron_launch_authorization_package.yaml` | `docs/archive/phases/v7/v7_73_electron_launch_authorization_package.yaml` | not moved |
| 390 | `docs/v7_74_electron_launch_execution_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_74_electron_launch_execution_authorization_gate_closeout.md` | not moved |
| 391 | `docs/v7_74_electron_launch_execution_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_74_electron_launch_execution_authorization_gate_closeout.yaml` | not moved |
| 392 | `docs/v7_74_electron_launch_execution_authorization_gate.yaml` | `docs/archive/phases/v7/v7_74_electron_launch_execution_authorization_gate.yaml` | not moved |
| 393 | `docs/v7_75_electron_launch_runtime_state_closeout.yaml` | `docs/archive/phases/v7/v7_75_electron_launch_runtime_state_closeout.yaml` | not moved |
| 394 | `docs/v7_76_cdp_target_discovery_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_76_cdp_target_discovery_authorization_package_closeout.md` | not moved |
| 395 | `docs/v7_76_cdp_target_discovery_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_76_cdp_target_discovery_authorization_package_closeout.yaml` | not moved |
| 396 | `docs/v7_76_cdp_target_discovery_authorization_package.yaml` | `docs/archive/phases/v7/v7_76_cdp_target_discovery_authorization_package.yaml` | not moved |
| 397 | `docs/v7_77_cdp_target_discovery_execution_authorization_gate_closeout.md` | `docs/archive/phases/v7/v7_77_cdp_target_discovery_execution_authorization_gate_closeout.md` | not moved |
| 398 | `docs/v7_77_cdp_target_discovery_execution_authorization_gate_closeout.yaml` | `docs/archive/phases/v7/v7_77_cdp_target_discovery_execution_authorization_gate_closeout.yaml` | not moved |
| 399 | `docs/v7_77_cdp_target_discovery_execution_authorization_gate.yaml` | `docs/archive/phases/v7/v7_77_cdp_target_discovery_execution_authorization_gate.yaml` | not moved |
| 400 | `docs/v7_78_cdp_target_discovery_execution_closeout.yaml` | `docs/archive/phases/v7/v7_78_cdp_target_discovery_execution_closeout.yaml` | not moved |
| 401 | `docs/v7_79_cdp_target_candidate_lock_planning_closeout.md` | `docs/archive/phases/v7/v7_79_cdp_target_candidate_lock_planning_closeout.md` | not moved |
| 402 | `docs/v7_79_cdp_target_candidate_lock_planning_closeout.yaml` | `docs/archive/phases/v7/v7_79_cdp_target_candidate_lock_planning_closeout.yaml` | not moved |
| 403 | `docs/v7_79_cdp_target_candidate_lock_planning.yaml` | `docs/archive/phases/v7/v7_79_cdp_target_candidate_lock_planning.yaml` | not moved |
| 404 | `docs/v7_80_target_lock_route_decision_closeout.md` | `docs/archive/phases/v7/v7_80_target_lock_route_decision_closeout.md` | not moved |
| 405 | `docs/v7_80_target_lock_route_decision_closeout.yaml` | `docs/archive/phases/v7/v7_80_target_lock_route_decision_closeout.yaml` | not moved |
| 406 | `docs/v7_80_target_lock_route_decision.yaml` | `docs/archive/phases/v7/v7_80_target_lock_route_decision.yaml` | not moved |
| 407 | `docs/v7_81_second_json_exact_target_lock_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_81_second_json_exact_target_lock_authorization_package_closeout.md` | not moved |
| 408 | `docs/v7_81_second_json_exact_target_lock_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_81_second_json_exact_target_lock_authorization_package_closeout.yaml` | not moved |
| 409 | `docs/v7_81_second_json_exact_target_lock_authorization_package.yaml` | `docs/archive/phases/v7/v7_81_second_json_exact_target_lock_authorization_package.yaml` | not moved |
| 410 | `docs/v7_82_second_json_exact_target_lock_execution_gate_closeout.md` | `docs/archive/phases/v7/v7_82_second_json_exact_target_lock_execution_gate_closeout.md` | not moved |
| 411 | `docs/v7_82_second_json_exact_target_lock_execution_gate_closeout.yaml` | `docs/archive/phases/v7/v7_82_second_json_exact_target_lock_execution_gate_closeout.yaml` | not moved |
| 412 | `docs/v7_82_second_json_exact_target_lock_execution_gate.yaml` | `docs/archive/phases/v7/v7_82_second_json_exact_target_lock_execution_gate.yaml` | not moved |
| 413 | `docs/v7_83_second_json_exact_target_lock_execution_closeout.yaml` | `docs/archive/phases/v7/v7_83_second_json_exact_target_lock_execution_closeout.yaml` | not moved |
| 414 | `docs/v7_84_target_fingerprint_lock_planning_closeout.md` | `docs/archive/phases/v7/v7_84_target_fingerprint_lock_planning_closeout.md` | not moved |
| 415 | `docs/v7_84_target_fingerprint_lock_planning_closeout.yaml` | `docs/archive/phases/v7/v7_84_target_fingerprint_lock_planning_closeout.yaml` | not moved |
| 416 | `docs/v7_84_target_fingerprint_lock_planning.yaml` | `docs/archive/phases/v7/v7_84_target_fingerprint_lock_planning.yaml` | not moved |
| 417 | `docs/v7_85_cdp_websocket_connect_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_85_cdp_websocket_connect_authorization_package_closeout.md` | not moved |
| 418 | `docs/v7_85_cdp_websocket_connect_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_85_cdp_websocket_connect_authorization_package_closeout.yaml` | not moved |
| 419 | `docs/v7_85_cdp_websocket_connect_authorization_package.yaml` | `docs/archive/phases/v7/v7_85_cdp_websocket_connect_authorization_package.yaml` | not moved |
| 420 | `docs/v7_86_cdp_websocket_connect_execution_gate_closeout.md` | `docs/archive/phases/v7/v7_86_cdp_websocket_connect_execution_gate_closeout.md` | not moved |
| 421 | `docs/v7_86_cdp_websocket_connect_execution_gate_closeout.yaml` | `docs/archive/phases/v7/v7_86_cdp_websocket_connect_execution_gate_closeout.yaml` | not moved |
| 422 | `docs/v7_86_cdp_websocket_connect_execution_gate.yaml` | `docs/archive/phases/v7/v7_86_cdp_websocket_connect_execution_gate.yaml` | not moved |
| 423 | `docs/v7_87_cdp_websocket_connect_execution_closeout.yaml` | `docs/archive/phases/v7/v7_87_cdp_websocket_connect_execution_closeout.yaml` | not moved |
| 424 | `docs/v7_88_runtime_evaluate_surface_probe_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_88_runtime_evaluate_surface_probe_authorization_package_closeout.md` | not moved |
| 425 | `docs/v7_88_runtime_evaluate_surface_probe_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_88_runtime_evaluate_surface_probe_authorization_package_closeout.yaml` | not moved |
| 426 | `docs/v7_88_runtime_evaluate_surface_probe_authorization_package.yaml` | `docs/archive/phases/v7/v7_88_runtime_evaluate_surface_probe_authorization_package.yaml` | not moved |
| 427 | `docs/v7_89_runtime_evaluate_surface_probe_execution_gate_closeout.md` | `docs/archive/phases/v7/v7_89_runtime_evaluate_surface_probe_execution_gate_closeout.md` | not moved |
| 428 | `docs/v7_89_runtime_evaluate_surface_probe_execution_gate_closeout.yaml` | `docs/archive/phases/v7/v7_89_runtime_evaluate_surface_probe_execution_gate_closeout.yaml` | not moved |
| 429 | `docs/v7_89_runtime_evaluate_surface_probe_execution_gate.yaml` | `docs/archive/phases/v7/v7_89_runtime_evaluate_surface_probe_execution_gate.yaml` | not moved |
| 430 | `docs/v7_90_runtime_evaluate_surface_probe_execution_closeout.yaml` | `docs/archive/phases/v7/v7_90_runtime_evaluate_surface_probe_execution_closeout.yaml` | not moved |
| 431 | `docs/v7_91_cancel_only_preflight_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_91_cancel_only_preflight_authorization_package_closeout.md` | not moved |
| 432 | `docs/v7_91_cancel_only_preflight_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_91_cancel_only_preflight_authorization_package_closeout.yaml` | not moved |
| 433 | `docs/v7_91_cancel_only_preflight_authorization_package.yaml` | `docs/archive/phases/v7/v7_91_cancel_only_preflight_authorization_package.yaml` | not moved |
| 434 | `docs/v7_92_cancel_only_preflight_execution_gate_closeout.md` | `docs/archive/phases/v7/v7_92_cancel_only_preflight_execution_gate_closeout.md` | not moved |
| 435 | `docs/v7_92_cancel_only_preflight_execution_gate_closeout.yaml` | `docs/archive/phases/v7/v7_92_cancel_only_preflight_execution_gate_closeout.yaml` | not moved |
| 436 | `docs/v7_92_cancel_only_preflight_execution_gate.yaml` | `docs/archive/phases/v7/v7_92_cancel_only_preflight_execution_gate.yaml` | not moved |
| 437 | `docs/v7_93_cancel_only_preflight_execution_closeout.yaml` | `docs/archive/phases/v7/v7_93_cancel_only_preflight_execution_closeout.yaml` | not moved |
| 438 | `docs/v7_94_loadSession_read_only_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_94_loadSession_read_only_authorization_package_closeout.md` | not moved |
| 439 | `docs/v7_94_loadSession_read_only_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_94_loadSession_read_only_authorization_package_closeout.yaml` | not moved |
| 440 | `docs/v7_94_loadSession_read_only_authorization_package.yaml` | `docs/archive/phases/v7/v7_94_loadSession_read_only_authorization_package.yaml` | not moved |
| 441 | `docs/v7_95_loadSession_read_only_execution_gate_closeout.md` | `docs/archive/phases/v7/v7_95_loadSession_read_only_execution_gate_closeout.md` | not moved |
| 442 | `docs/v7_95_loadSession_read_only_execution_gate_closeout.yaml` | `docs/archive/phases/v7/v7_95_loadSession_read_only_execution_gate_closeout.yaml` | not moved |
| 443 | `docs/v7_95_loadSession_read_only_execution_gate.yaml` | `docs/archive/phases/v7/v7_95_loadSession_read_only_execution_gate.yaml` | not moved |
| 444 | `docs/v7_96_loadSession_read_only_execution_closeout.yaml` | `docs/archive/phases/v7/v7_96_loadSession_read_only_execution_closeout.yaml` | not moved |
| 445 | `docs/v7_97_previewDraft_read_only_authorization_package_closeout.md` | `docs/archive/phases/v7/v7_97_previewDraft_read_only_authorization_package_closeout.md` | not moved |
| 446 | `docs/v7_97_previewDraft_read_only_authorization_package_closeout.yaml` | `docs/archive/phases/v7/v7_97_previewDraft_read_only_authorization_package_closeout.yaml` | not moved |
| 447 | `docs/v7_97_previewDraft_read_only_authorization_package.yaml` | `docs/archive/phases/v7/v7_97_previewDraft_read_only_authorization_package.yaml` | not moved |
| 448 | `docs/v7_98_previewDraft_read_only_execution_gate_closeout.md` | `docs/archive/phases/v7/v7_98_previewDraft_read_only_execution_gate_closeout.md` | not moved |
| 449 | `docs/v7_98_previewDraft_read_only_execution_gate_closeout.yaml` | `docs/archive/phases/v7/v7_98_previewDraft_read_only_execution_gate_closeout.yaml` | not moved |
| 450 | `docs/v7_98_previewDraft_read_only_execution_gate.yaml` | `docs/archive/phases/v7/v7_98_previewDraft_read_only_execution_gate.yaml` | not moved |
| 451 | `docs/v7_99_previewDraft_read_only_execution_closeout.yaml` | `docs/archive/phases/v7/v7_99_previewDraft_read_only_execution_closeout.yaml` | not moved |
| 452 | `docs/v7_prompt_evolution_analysis_matte_ceramic_mug.md` | `docs/archive/phases/v7/v7_prompt_evolution_analysis_matte_ceramic_mug.md` | not moved |
| 453 | `docs/v7_real_generation_review_dataset_summary.md` | `docs/archive/phases/v7/v7_real_generation_review_dataset_summary.md` | not moved |
| 454 | `docs/v8_001_final_retouch_planning_gate.md` | `docs/archive/phases/v8/v8_001_final_retouch_planning_gate.md` | not moved |
| 455 | `docs/v8_002_retouch_acceptance_criteria_or_delivery_package_gate.md` | `docs/archive/phases/v8/v8_002_retouch_acceptance_criteria_or_delivery_package_gate.md` | not moved |
| 456 | `docs/v8_003_delivery_package_closeout_or_retouch_handoff_gate.md` | `docs/archive/phases/v8/v8_003_delivery_package_closeout_or_retouch_handoff_gate.md` | not moved |
| 457 | `docs/v8_004_final_retouch_route_closeout.md` | `docs/archive/phases/v8/v8_004_final_retouch_route_closeout.md` | not moved |
| 458 | `docs/v8_005_next_route_decision_gate.md` | `docs/archive/phases/v8/v8_005_next_route_decision_gate.md` | not moved |
| 459 | `docs/v8_route_options_after_v7_product_loop.md` | `docs/archive/phases/v8/v8_route_options_after_v7_product_loop.md` | not moved |
| 460 | `docs/v8_route_selection_human_decision_gate.md` | `docs/archive/phases/v8/v8_route_selection_human_decision_gate.md` | not moved |

## Required Before Any Future Move

- separate explicit C1a move authorization
- exact file allowlist copied from this list
- pre-move `git status --short --branch` review
- post-move reference scan
- `git diff --check`
- `node scripts\\validate_agent_board_state.js`
- `powershell -ExecutionPolicy Bypass -File scripts\\validate_mvp.ps1`

## Recommended Next

Do not move files yet. C1.3 has produced the stricter YAML-aware list in `docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md`; prefer that list before any C1a physical move authorization.
