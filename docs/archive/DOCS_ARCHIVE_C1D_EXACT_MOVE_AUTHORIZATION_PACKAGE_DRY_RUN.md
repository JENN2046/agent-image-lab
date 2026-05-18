# Docs Archive C1d Exact-Move Authorization Package Dry Run

Status: C1d exact-move authorization package dry-run completed validated
Mode: A4.8 local documentation only
Source classification: docs/archive/DOCS_ARCHIVE_C1C_REMAINING_DOCS_CLASSIFICATION_DRY_RUN.md
Scope basis: future exact-move candidates only

This package defines the narrow authorization shape for a future C1d exact-file move. It is not itself a move authorization and does not move files.

Execution follow-up: after this package was reviewed, C1d exact-file physical movement was separately authorized and recorded in `docs/archive/DOCS_ARCHIVE_C1D_MOVE_EXECUTION_RECORD.md`.

## Boundary

This C1d dry run did not:

- move docs
- delete files
- create wrappers
- rewrite references
- change validator behavior
- split scripts
- process runs/
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, or runtime
- read .env, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Proposed Future Move Scope

Future C1d may move only the exact 208 files listed in this package.

Explicitly excluded from C1d:

- all validator-blocked records from C1c
- all wrapper-required records from C1c
- all docs-only-reference records from C1c
- current authority docs
- docs/archive planning records
- docs/00_project_roadmap.md
- any file outside the exact allowlist below
- runs/, asset binaries, secrets, env files, caches, logs, DB files

## Preflight Snapshot

| Check | Count |
| --- | ---: |
| exact future candidates | 208 |
| missing source files | 0 |
| destinations already existing | 0 |
| missing destination parent directories | 0 |
| duplicate source paths | 0 |
| duplicate destination paths | 0 |
| invalid source path boundaries | 0 |
| invalid destination path boundaries | 0 |

## Bucket Distribution

| Bucket | Count |
| --- | ---: |
| phases/v7 | 208 |

## Extension Distribution

| Extension | Count |
| --- | ---: |
| .md | 63 |
| .yaml | 145 |

## Destination Parent Directories

| Destination parent | Count |
| --- | ---: |
| docs/archive/phases/v7 | 208 |

## Future Authorization Requirements

A later physical C1d move must be separately authorized and must name:

- this exact package file
- the exact 208-file allowlist below
- exact-file move only
- no glob movement
- no deletion
- no overwrite
- no wrapper creation unless separately authorized
- no reference rewrite unless separately authorized
- rollback by reversing this same allowlist
- validation commands before and after the move
- stop conditions

## Required Validation For Future Physical Move

Before and after a separately authorized physical move:

```powershell
git status --short --branch
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

A future move executor must also verify that all 208 source paths exist before moving, all 208 archive targets exist after moving, and old operational references remain clean for this allowlist.

## Rollback Plan

Rollback must reverse the exact allowlist:

```text
for each moved row:
  move Archive path back to Current path
```

Do not delete archive directories during rollback unless a separate cleanup task is authorized.

## Exact C1d Future Move Allowlist

| # | Current path | Archive target | Bucket | Extension | Source exists now | Destination exists now | Destination parent exists |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | docs/v7_101_vcpchat_read_only_surface_evidence_report_closeout.yaml | docs/archive/phases/v7/v7_101_vcpchat_read_only_surface_evidence_report_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 2 | docs/v7_101_vcpchat_read_only_surface_evidence_report.md | docs/archive/phases/v7/v7_101_vcpchat_read_only_surface_evidence_report.md | phases/v7 | .md | true | false | true |
| 3 | docs/v7_101_vcpchat_read_only_surface_evidence_report.yaml | docs/archive/phases/v7/v7_101_vcpchat_read_only_surface_evidence_report.yaml | phases/v7 | .yaml | true | false | true |
| 4 | docs/v7_102_cross_repo_boundary_audit_closeout.yaml | docs/archive/phases/v7/v7_102_cross_repo_boundary_audit_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 5 | docs/v7_102_cross_repo_boundary_audit.yaml | docs/archive/phases/v7/v7_102_cross_repo_boundary_audit.yaml | phases/v7 | .yaml | true | false | true |
| 6 | docs/v7_103_boundary_matrix_hardening_redaction_validator_planning_closeout.yaml | docs/archive/phases/v7/v7_103_boundary_matrix_hardening_redaction_validator_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 7 | docs/v7_103_boundary_matrix_hardening_redaction_validator_planning.yaml | docs/archive/phases/v7/v7_103_boundary_matrix_hardening_redaction_validator_planning.yaml | phases/v7 | .yaml | true | false | true |
| 8 | docs/v7_104_redaction_validator_spec_closeout.yaml | docs/archive/phases/v7/v7_104_redaction_validator_spec_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 9 | docs/v7_104_redaction_validator_spec.md | docs/archive/phases/v7/v7_104_redaction_validator_spec.md | phases/v7 | .md | true | false | true |
| 10 | docs/v7_104_redaction_validator_spec.yaml | docs/archive/phases/v7/v7_104_redaction_validator_spec.yaml | phases/v7 | .yaml | true | false | true |
| 11 | docs/v7_105_boundary_matrix_schema_spec_closeout.yaml | docs/archive/phases/v7/v7_105_boundary_matrix_schema_spec_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 12 | docs/v7_105_boundary_matrix_schema_spec.md | docs/archive/phases/v7/v7_105_boundary_matrix_schema_spec.md | phases/v7 | .md | true | false | true |
| 13 | docs/v7_105_boundary_matrix_schema_spec.yaml | docs/archive/phases/v7/v7_105_boundary_matrix_schema_spec.yaml | phases/v7 | .yaml | true | false | true |
| 14 | docs/v7_106_boundary_matrix_yaml_draft_closeout.yaml | docs/archive/phases/v7/v7_106_boundary_matrix_yaml_draft_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 15 | docs/v7_106_boundary_matrix_yaml_draft.md | docs/archive/phases/v7/v7_106_boundary_matrix_yaml_draft.md | phases/v7 | .md | true | false | true |
| 16 | docs/v7_107_boundary_matrix_yaml_static_review_closeout.yaml | docs/archive/phases/v7/v7_107_boundary_matrix_yaml_static_review_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 17 | docs/v7_107_boundary_matrix_yaml_static_review.md | docs/archive/phases/v7/v7_107_boundary_matrix_yaml_static_review.md | phases/v7 | .md | true | false | true |
| 18 | docs/v7_107_boundary_matrix_yaml_static_review.yaml | docs/archive/phases/v7/v7_107_boundary_matrix_yaml_static_review.yaml | phases/v7 | .yaml | true | false | true |
| 19 | docs/v7_108_redaction_validator_skeleton_planning_closeout.yaml | docs/archive/phases/v7/v7_108_redaction_validator_skeleton_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 20 | docs/v7_108_redaction_validator_skeleton_planning.md | docs/archive/phases/v7/v7_108_redaction_validator_skeleton_planning.md | phases/v7 | .md | true | false | true |
| 21 | docs/v7_108_redaction_validator_skeleton_planning.yaml | docs/archive/phases/v7/v7_108_redaction_validator_skeleton_planning.yaml | phases/v7 | .yaml | true | false | true |
| 22 | docs/v7_109_redaction_validator_skeleton_implementation_gate_closeout.yaml | docs/archive/phases/v7/v7_109_redaction_validator_skeleton_implementation_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 23 | docs/v7_109_redaction_validator_skeleton_implementation_gate.md | docs/archive/phases/v7/v7_109_redaction_validator_skeleton_implementation_gate.md | phases/v7 | .md | true | false | true |
| 24 | docs/v7_109_redaction_validator_skeleton_implementation_gate.yaml | docs/archive/phases/v7/v7_109_redaction_validator_skeleton_implementation_gate.yaml | phases/v7 | .yaml | true | false | true |
| 25 | docs/v7_111_redaction_validator_skeleton_static_review_closeout.yaml | docs/archive/phases/v7/v7_111_redaction_validator_skeleton_static_review_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 26 | docs/v7_111_redaction_validator_skeleton_static_review.md | docs/archive/phases/v7/v7_111_redaction_validator_skeleton_static_review.md | phases/v7 | .md | true | false | true |
| 27 | docs/v7_111_redaction_validator_skeleton_static_review.yaml | docs/archive/phases/v7/v7_111_redaction_validator_skeleton_static_review.yaml | phases/v7 | .yaml | true | false | true |
| 28 | docs/v7_112_validator_fixture_static_review_closeout.yaml | docs/archive/phases/v7/v7_112_validator_fixture_static_review_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 29 | docs/v7_112_validator_fixture_static_review.md | docs/archive/phases/v7/v7_112_validator_fixture_static_review.md | phases/v7 | .md | true | false | true |
| 30 | docs/v7_112_validator_fixture_static_review.yaml | docs/archive/phases/v7/v7_112_validator_fixture_static_review.yaml | phases/v7 | .yaml | true | false | true |
| 31 | docs/v7_113_validator_fixture_dry_run_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_113_validator_fixture_dry_run_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 32 | docs/v7_113_validator_fixture_dry_run_authorization_gate.md | docs/archive/phases/v7/v7_113_validator_fixture_dry_run_authorization_gate.md | phases/v7 | .md | true | false | true |
| 33 | docs/v7_113_validator_fixture_dry_run_authorization_gate.yaml | docs/archive/phases/v7/v7_113_validator_fixture_dry_run_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 34 | docs/v7_115_validator_scan_loop_correction_planning_closeout.yaml | docs/archive/phases/v7/v7_115_validator_scan_loop_correction_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 35 | docs/v7_115_validator_scan_loop_correction_planning.md | docs/archive/phases/v7/v7_115_validator_scan_loop_correction_planning.md | phases/v7 | .md | true | false | true |
| 36 | docs/v7_115_validator_scan_loop_correction_planning.yaml | docs/archive/phases/v7/v7_115_validator_scan_loop_correction_planning.yaml | phases/v7 | .yaml | true | false | true |
| 37 | docs/v7_116_scan_loop_correction_implementation_gate_closeout.yaml | docs/archive/phases/v7/v7_116_scan_loop_correction_implementation_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 38 | docs/v7_116_scan_loop_correction_implementation_gate.md | docs/archive/phases/v7/v7_116_scan_loop_correction_implementation_gate.md | phases/v7 | .md | true | false | true |
| 39 | docs/v7_116_scan_loop_correction_implementation_gate.yaml | docs/archive/phases/v7/v7_116_scan_loop_correction_implementation_gate.yaml | phases/v7 | .yaml | true | false | true |
| 40 | docs/v7_117a_scan_loop_correction_patch_planning_closeout.yaml | docs/archive/phases/v7/v7_117a_scan_loop_correction_patch_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 41 | docs/v7_117a_scan_loop_correction_patch_planning.md | docs/archive/phases/v7/v7_117a_scan_loop_correction_patch_planning.md | phases/v7 | .md | true | false | true |
| 42 | docs/v7_117a_scan_loop_correction_patch_planning.yaml | docs/archive/phases/v7/v7_117a_scan_loop_correction_patch_planning.yaml | phases/v7 | .yaml | true | false | true |
| 43 | docs/v7_117b_scan_loop_correction_patch_implementation_gate_closeout.yaml | docs/archive/phases/v7/v7_117b_scan_loop_correction_patch_implementation_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 44 | docs/v7_117b_scan_loop_correction_patch_implementation_gate.md | docs/archive/phases/v7/v7_117b_scan_loop_correction_patch_implementation_gate.md | phases/v7 | .md | true | false | true |
| 45 | docs/v7_117b_scan_loop_correction_patch_implementation_gate.yaml | docs/archive/phases/v7/v7_117b_scan_loop_correction_patch_implementation_gate.yaml | phases/v7 | .yaml | true | false | true |
| 46 | docs/v7_118_corrected_fixture_dry_run_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_118_corrected_fixture_dry_run_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 47 | docs/v7_120_selected_docs_scan_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_120_selected_docs_scan_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 48 | docs/v7_120_selected_docs_scan_authorization_gate.md | docs/archive/phases/v7/v7_120_selected_docs_scan_authorization_gate.md | phases/v7 | .md | true | false | true |
| 49 | docs/v7_120_selected_docs_scan_authorization_gate.yaml | docs/archive/phases/v7/v7_120_selected_docs_scan_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 50 | docs/v7_122_selected_doc_closeout_integrity_correction_planning_closeout.yaml | docs/archive/phases/v7/v7_122_selected_doc_closeout_integrity_correction_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 51 | docs/v7_122_selected_doc_closeout_integrity_correction_planning.md | docs/archive/phases/v7/v7_122_selected_doc_closeout_integrity_correction_planning.md | phases/v7 | .md | true | false | true |
| 52 | docs/v7_122_selected_doc_closeout_integrity_correction_planning.yaml | docs/archive/phases/v7/v7_122_selected_doc_closeout_integrity_correction_planning.yaml | phases/v7 | .yaml | true | false | true |
| 53 | docs/v7_123_closeout_integrity_correction_implementation_gate_closeout.yaml | docs/archive/phases/v7/v7_123_closeout_integrity_correction_implementation_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 54 | docs/v7_123_closeout_integrity_correction_implementation_gate.yaml | docs/archive/phases/v7/v7_123_closeout_integrity_correction_implementation_gate.yaml | phases/v7 | .yaml | true | false | true |
| 55 | docs/v7_125_selected_docs_rescan_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_125_selected_docs_rescan_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 56 | docs/v7_127_controlled_long_task_chain_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_127_controlled_long_task_chain_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 57 | docs/v7_128_first_controlled_batch_execution_gate_closeout.yaml | docs/archive/phases/v7/v7_128_first_controlled_batch_execution_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 58 | docs/v7_128_first_controlled_batch_execution_gate.md | docs/archive/phases/v7/v7_128_first_controlled_batch_execution_gate.md | phases/v7 | .md | true | false | true |
| 59 | docs/v7_128_first_controlled_batch_execution_gate.yaml | docs/archive/phases/v7/v7_128_first_controlled_batch_execution_gate.yaml | phases/v7 | .yaml | true | false | true |
| 60 | docs/v7_130_batch_001_markdown_closeout_integrity_correction_planning_closeout.yaml | docs/archive/phases/v7/v7_130_batch_001_markdown_closeout_integrity_correction_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 61 | docs/v7_130_batch_001_markdown_closeout_integrity_correction_planning.md | docs/archive/phases/v7/v7_130_batch_001_markdown_closeout_integrity_correction_planning.md | phases/v7 | .md | true | false | true |
| 62 | docs/v7_130_batch_001_markdown_closeout_integrity_correction_planning.yaml | docs/archive/phases/v7/v7_130_batch_001_markdown_closeout_integrity_correction_planning.yaml | phases/v7 | .yaml | true | false | true |
| 63 | docs/v7_131_batch_001_markdown_correction_implementation_gate_closeout.yaml | docs/archive/phases/v7/v7_131_batch_001_markdown_correction_implementation_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 64 | docs/v7_131_batch_001_markdown_correction_implementation_gate.md | docs/archive/phases/v7/v7_131_batch_001_markdown_correction_implementation_gate.md | phases/v7 | .md | true | false | true |
| 65 | docs/v7_131_batch_001_markdown_correction_implementation_gate.yaml | docs/archive/phases/v7/v7_131_batch_001_markdown_correction_implementation_gate.yaml | phases/v7 | .yaml | true | false | true |
| 66 | docs/v7_133_batch_001_rescan_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_133_batch_001_rescan_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 67 | docs/v7_133_batch_001_rescan_authorization_gate.md | docs/archive/phases/v7/v7_133_batch_001_rescan_authorization_gate.md | phases/v7 | .md | true | false | true |
| 68 | docs/v7_133_batch_001_rescan_authorization_gate.yaml | docs/archive/phases/v7/v7_133_batch_001_rescan_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 69 | docs/v7_135_batch_001_residual_correction_planning_closeout.yaml | docs/archive/phases/v7/v7_135_batch_001_residual_correction_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 70 | docs/v7_136_batch_001_residual_correction_implementation_gate_closeout.yaml | docs/archive/phases/v7/v7_136_batch_001_residual_correction_implementation_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 71 | docs/v7_138_batch_001_final_rescan_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_138_batch_001_final_rescan_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 72 | docs/v7_140_batch_002_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_140_batch_002_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 73 | docs/v7_140_batch_002_authorization_gate.md | docs/archive/phases/v7/v7_140_batch_002_authorization_gate.md | phases/v7 | .md | true | false | true |
| 74 | docs/v7_140_batch_002_authorization_gate.yaml | docs/archive/phases/v7/v7_140_batch_002_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 75 | docs/v7_142_batch_002_correction_planning_closeout.yaml | docs/archive/phases/v7/v7_142_batch_002_correction_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 76 | docs/v7_143_batch_002_permission_drift_analysis_gate_closeout.yaml | docs/archive/phases/v7/v7_143_batch_002_permission_drift_analysis_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 77 | docs/v7_143_batch_002_permission_drift_analysis_gate.md | docs/archive/phases/v7/v7_143_batch_002_permission_drift_analysis_gate.md | phases/v7 | .md | true | false | true |
| 78 | docs/v7_143_batch_002_permission_drift_analysis_gate.yaml | docs/archive/phases/v7/v7_143_batch_002_permission_drift_analysis_gate.yaml | phases/v7 | .yaml | true | false | true |
| 79 | docs/v7_144_batch_002_permission_drift_analysis_closeout.yaml | docs/archive/phases/v7/v7_144_batch_002_permission_drift_analysis_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 80 | docs/v7_144_batch_002_permission_drift_analysis.yaml | docs/archive/phases/v7/v7_144_batch_002_permission_drift_analysis.yaml | phases/v7 | .yaml | true | false | true |
| 81 | docs/v7_145_batch_002_correction_implementation_gate_closeout.yaml | docs/archive/phases/v7/v7_145_batch_002_correction_implementation_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 82 | docs/v7_147_batch_002_rescan_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_147_batch_002_rescan_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 83 | docs/v7_149_batch_003_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_149_batch_003_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 84 | docs/v7_149_batch_003_authorization_gate.md | docs/archive/phases/v7/v7_149_batch_003_authorization_gate.md | phases/v7 | .md | true | false | true |
| 85 | docs/v7_149_batch_003_authorization_gate.yaml | docs/archive/phases/v7/v7_149_batch_003_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 86 | docs/v7_151_batch_003_correction_planning_closeout.yaml | docs/archive/phases/v7/v7_151_batch_003_correction_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 87 | docs/v7_151_batch_003_correction_planning.md | docs/archive/phases/v7/v7_151_batch_003_correction_planning.md | phases/v7 | .md | true | false | true |
| 88 | docs/v7_151_batch_003_correction_planning.yaml | docs/archive/phases/v7/v7_151_batch_003_correction_planning.yaml | phases/v7 | .yaml | true | false | true |
| 89 | docs/v7_152_batch_003_exact_finding_recovery_gate_closeout.yaml | docs/archive/phases/v7/v7_152_batch_003_exact_finding_recovery_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 90 | docs/v7_152_batch_003_exact_finding_recovery_gate.md | docs/archive/phases/v7/v7_152_batch_003_exact_finding_recovery_gate.md | phases/v7 | .md | true | false | true |
| 91 | docs/v7_152_batch_003_exact_finding_recovery_gate.yaml | docs/archive/phases/v7/v7_152_batch_003_exact_finding_recovery_gate.yaml | phases/v7 | .yaml | true | false | true |
| 92 | docs/v7_153_batch_003_exact_finding_recovery_closeout.yaml | docs/archive/phases/v7/v7_153_batch_003_exact_finding_recovery_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 93 | docs/v7_154_batch_003_correction_implementation_gate_closeout.yaml | docs/archive/phases/v7/v7_154_batch_003_correction_implementation_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 94 | docs/v7_156_batch_003_rescan_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_156_batch_003_rescan_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 95 | docs/v7_158_batch_004_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_158_batch_004_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 96 | docs/v7_158_batch_004_authorization_gate.md | docs/archive/phases/v7/v7_158_batch_004_authorization_gate.md | phases/v7 | .md | true | false | true |
| 97 | docs/v7_158_batch_004_authorization_gate.yaml | docs/archive/phases/v7/v7_158_batch_004_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 98 | docs/v7_160_batch_004_correction_planning_closeout.yaml | docs/archive/phases/v7/v7_160_batch_004_correction_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 99 | docs/v7_160_batch_004_correction_planning.md | docs/archive/phases/v7/v7_160_batch_004_correction_planning.md | phases/v7 | .md | true | false | true |
| 100 | docs/v7_160_batch_004_correction_planning.yaml | docs/archive/phases/v7/v7_160_batch_004_correction_planning.yaml | phases/v7 | .yaml | true | false | true |
| 101 | docs/v7_161_batch_004_correction_implementation_gate_closeout.yaml | docs/archive/phases/v7/v7_161_batch_004_correction_implementation_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 102 | docs/v7_161_batch_004_correction_implementation_gate.md | docs/archive/phases/v7/v7_161_batch_004_correction_implementation_gate.md | phases/v7 | .md | true | false | true |
| 103 | docs/v7_161_batch_004_correction_implementation_gate.yaml | docs/archive/phases/v7/v7_161_batch_004_correction_implementation_gate.yaml | phases/v7 | .yaml | true | false | true |
| 104 | docs/v7_163_batch_004_rescan_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_163_batch_004_rescan_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 105 | docs/v7_163_batch_004_rescan_authorization_gate.md | docs/archive/phases/v7/v7_163_batch_004_rescan_authorization_gate.md | phases/v7 | .md | true | false | true |
| 106 | docs/v7_163_batch_004_rescan_authorization_gate.yaml | docs/archive/phases/v7/v7_163_batch_004_rescan_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 107 | docs/v7_165_validator_governance_chain_v1_closeout_gate_closeout.yaml | docs/archive/phases/v7/v7_165_validator_governance_chain_v1_closeout_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 108 | docs/v7_165_validator_governance_chain_v1_closeout_gate.md | docs/archive/phases/v7/v7_165_validator_governance_chain_v1_closeout_gate.md | phases/v7 | .md | true | false | true |
| 109 | docs/v7_165_validator_governance_chain_v1_closeout_gate.yaml | docs/archive/phases/v7/v7_165_validator_governance_chain_v1_closeout_gate.yaml | phases/v7 | .yaml | true | false | true |
| 110 | docs/v7_263_project_plugin_A5_authorization_package_draft_gate.md | docs/archive/phases/v7/v7_263_project_plugin_A5_authorization_package_draft_gate.md | phases/v7 | .md | true | false | true |
| 111 | docs/v7_56_lt06_execution_package_finalization.md | docs/archive/phases/v7/v7_56_lt06_execution_package_finalization.md | phases/v7 | .md | true | false | true |
| 112 | docs/v7_56a_wording_harmonization_patch.yaml | docs/archive/phases/v7/v7_56a_wording_harmonization_patch.yaml | phases/v7 | .yaml | true | false | true |
| 113 | docs/v7_58j_memory_overview_independent_A5_request_text_closeout.yaml | docs/archive/phases/v7/v7_58j_memory_overview_independent_A5_request_text_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 114 | docs/v7_58j_memory_overview_redacted_summary_template.md | docs/archive/phases/v7/v7_58j_memory_overview_redacted_summary_template.md | phases/v7 | .md | true | false | true |
| 115 | docs/v7_58k_memory_overview_A5_request_text_target_patch_plan.md | docs/archive/phases/v7/v7_58k_memory_overview_A5_request_text_target_patch_plan.md | phases/v7 | .md | true | false | true |
| 116 | docs/v7_58k_memory_overview_target_identity_base_url_lock.md | docs/archive/phases/v7/v7_58k_memory_overview_target_identity_base_url_lock.md | phases/v7 | .md | true | false | true |
| 117 | docs/v7_58k_memory_overview_target_identity_base_url_lock.yaml | docs/archive/phases/v7/v7_58k_memory_overview_target_identity_base_url_lock.yaml | phases/v7 | .yaml | true | false | true |
| 118 | docs/v7_58k_memory_overview_target_identity_closeout.yaml | docs/archive/phases/v7/v7_58k_memory_overview_target_identity_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 119 | docs/v7_60_vcpchat_surface_check_planning_closeout.yaml | docs/archive/phases/v7/v7_60_vcpchat_surface_check_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 120 | docs/v7_60_vcpchat_surface_check_planning.md | docs/archive/phases/v7/v7_60_vcpchat_surface_check_planning.md | phases/v7 | .md | true | false | true |
| 121 | docs/v7_60_vcpchat_surface_check_planning.yaml | docs/archive/phases/v7/v7_60_vcpchat_surface_check_planning.yaml | phases/v7 | .yaml | true | false | true |
| 122 | docs/v7_61_vcpchat_surface_check_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_61_vcpchat_surface_check_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 123 | docs/v7_61_vcpchat_surface_check_authorization_package.md | docs/archive/phases/v7/v7_61_vcpchat_surface_check_authorization_package.md | phases/v7 | .md | true | false | true |
| 124 | docs/v7_61_vcpchat_surface_check_authorization_package.yaml | docs/archive/phases/v7/v7_61_vcpchat_surface_check_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 125 | docs/v7_62_vcpchat_bridge_contract_static_review_planning_closeout.yaml | docs/archive/phases/v7/v7_62_vcpchat_bridge_contract_static_review_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 126 | docs/v7_62_vcpchat_bridge_contract_static_review_planning.md | docs/archive/phases/v7/v7_62_vcpchat_bridge_contract_static_review_planning.md | phases/v7 | .md | true | false | true |
| 127 | docs/v7_62_vcpchat_bridge_contract_static_review_planning.yaml | docs/archive/phases/v7/v7_62_vcpchat_bridge_contract_static_review_planning.yaml | phases/v7 | .yaml | true | false | true |
| 128 | docs/v7_63_vcpchat_bridge_contract_static_code_review_package_closeout.yaml | docs/archive/phases/v7/v7_63_vcpchat_bridge_contract_static_code_review_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 129 | docs/v7_63_vcpchat_bridge_contract_static_code_review_package.md | docs/archive/phases/v7/v7_63_vcpchat_bridge_contract_static_code_review_package.md | phases/v7 | .md | true | false | true |
| 130 | docs/v7_63_vcpchat_bridge_contract_static_code_review_package.yaml | docs/archive/phases/v7/v7_63_vcpchat_bridge_contract_static_code_review_package.yaml | phases/v7 | .yaml | true | false | true |
| 131 | docs/v7_64_vcpchat_bridge_contract_static_code_review_execution_closeout.yaml | docs/archive/phases/v7/v7_64_vcpchat_bridge_contract_static_code_review_execution_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 132 | docs/v7_64_vcpchat_bridge_contract_static_code_review_execution.yaml | docs/archive/phases/v7/v7_64_vcpchat_bridge_contract_static_code_review_execution.yaml | phases/v7 | .yaml | true | false | true |
| 133 | docs/v7_65_vcpchat_surface_check_authorization_package_v2_closeout.yaml | docs/archive/phases/v7/v7_65_vcpchat_surface_check_authorization_package_v2_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 134 | docs/v7_65_vcpchat_surface_check_authorization_package_v2.md | docs/archive/phases/v7/v7_65_vcpchat_surface_check_authorization_package_v2.md | phases/v7 | .md | true | false | true |
| 135 | docs/v7_65_vcpchat_surface_check_authorization_package_v2.yaml | docs/archive/phases/v7/v7_65_vcpchat_surface_check_authorization_package_v2.yaml | phases/v7 | .yaml | true | false | true |
| 136 | docs/v7_66_vcpchat_cancel_only_preflight_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_66_vcpchat_cancel_only_preflight_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 137 | docs/v7_66_vcpchat_cancel_only_preflight_authorization_package.md | docs/archive/phases/v7/v7_66_vcpchat_cancel_only_preflight_authorization_package.md | phases/v7 | .md | true | false | true |
| 138 | docs/v7_66_vcpchat_cancel_only_preflight_authorization_package.yaml | docs/archive/phases/v7/v7_66_vcpchat_cancel_only_preflight_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 139 | docs/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 140 | docs/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate.md | docs/archive/phases/v7/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate.md | phases/v7 | .md | true | false | true |
| 141 | docs/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate.yaml | docs/archive/phases/v7/v7_67_cancel_preflight_endpoint_lock_and_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 142 | docs/v7_68_exact_port_selection_planning_closeout.yaml | docs/archive/phases/v7/v7_68_exact_port_selection_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 143 | docs/v7_68_exact_port_selection_planning.md | docs/archive/phases/v7/v7_68_exact_port_selection_planning.md | phases/v7 | .md | true | false | true |
| 144 | docs/v7_68_exact_port_selection_planning.yaml | docs/archive/phases/v7/v7_68_exact_port_selection_planning.yaml | phases/v7 | .yaml | true | false | true |
| 145 | docs/v7_69_port_check_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_69_port_check_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 146 | docs/v7_69_port_check_authorization_package.md | docs/archive/phases/v7/v7_69_port_check_authorization_package.md | phases/v7 | .md | true | false | true |
| 147 | docs/v7_69_port_check_authorization_package.yaml | docs/archive/phases/v7/v7_69_port_check_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 148 | docs/v7_70_port_check_execution_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_70_port_check_execution_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 149 | docs/v7_70_port_check_execution_authorization_gate.md | docs/archive/phases/v7/v7_70_port_check_execution_authorization_gate.md | phases/v7 | .md | true | false | true |
| 150 | docs/v7_70_port_check_execution_authorization_gate.yaml | docs/archive/phases/v7/v7_70_port_check_execution_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 151 | docs/v7_72_concrete_cdp_endpoint_lock_patch_closeout.yaml | docs/archive/phases/v7/v7_72_concrete_cdp_endpoint_lock_patch_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 152 | docs/v7_72_concrete_cdp_endpoint_lock_patch.yaml | docs/archive/phases/v7/v7_72_concrete_cdp_endpoint_lock_patch.yaml | phases/v7 | .yaml | true | false | true |
| 153 | docs/v7_73_electron_launch_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_73_electron_launch_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 154 | docs/v7_73_electron_launch_authorization_package.md | docs/archive/phases/v7/v7_73_electron_launch_authorization_package.md | phases/v7 | .md | true | false | true |
| 155 | docs/v7_73_electron_launch_authorization_package.yaml | docs/archive/phases/v7/v7_73_electron_launch_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 156 | docs/v7_74_electron_launch_execution_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_74_electron_launch_execution_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 157 | docs/v7_74_electron_launch_execution_authorization_gate.md | docs/archive/phases/v7/v7_74_electron_launch_execution_authorization_gate.md | phases/v7 | .md | true | false | true |
| 158 | docs/v7_74_electron_launch_execution_authorization_gate.yaml | docs/archive/phases/v7/v7_74_electron_launch_execution_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 159 | docs/v7_76_cdp_target_discovery_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_76_cdp_target_discovery_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 160 | docs/v7_76_cdp_target_discovery_authorization_package.md | docs/archive/phases/v7/v7_76_cdp_target_discovery_authorization_package.md | phases/v7 | .md | true | false | true |
| 161 | docs/v7_76_cdp_target_discovery_authorization_package.yaml | docs/archive/phases/v7/v7_76_cdp_target_discovery_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 162 | docs/v7_77_cdp_target_discovery_execution_authorization_gate_closeout.yaml | docs/archive/phases/v7/v7_77_cdp_target_discovery_execution_authorization_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 163 | docs/v7_77_cdp_target_discovery_execution_authorization_gate.md | docs/archive/phases/v7/v7_77_cdp_target_discovery_execution_authorization_gate.md | phases/v7 | .md | true | false | true |
| 164 | docs/v7_77_cdp_target_discovery_execution_authorization_gate.yaml | docs/archive/phases/v7/v7_77_cdp_target_discovery_execution_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 165 | docs/v7_79_cdp_target_candidate_lock_planning_closeout.yaml | docs/archive/phases/v7/v7_79_cdp_target_candidate_lock_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 166 | docs/v7_79_cdp_target_candidate_lock_planning.md | docs/archive/phases/v7/v7_79_cdp_target_candidate_lock_planning.md | phases/v7 | .md | true | false | true |
| 167 | docs/v7_79_cdp_target_candidate_lock_planning.yaml | docs/archive/phases/v7/v7_79_cdp_target_candidate_lock_planning.yaml | phases/v7 | .yaml | true | false | true |
| 168 | docs/v7_80_target_lock_route_decision_closeout.yaml | docs/archive/phases/v7/v7_80_target_lock_route_decision_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 169 | docs/v7_80_target_lock_route_decision.md | docs/archive/phases/v7/v7_80_target_lock_route_decision.md | phases/v7 | .md | true | false | true |
| 170 | docs/v7_80_target_lock_route_decision.yaml | docs/archive/phases/v7/v7_80_target_lock_route_decision.yaml | phases/v7 | .yaml | true | false | true |
| 171 | docs/v7_81_second_json_exact_target_lock_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_81_second_json_exact_target_lock_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 172 | docs/v7_81_second_json_exact_target_lock_authorization_package.md | docs/archive/phases/v7/v7_81_second_json_exact_target_lock_authorization_package.md | phases/v7 | .md | true | false | true |
| 173 | docs/v7_81_second_json_exact_target_lock_authorization_package.yaml | docs/archive/phases/v7/v7_81_second_json_exact_target_lock_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 174 | docs/v7_82_second_json_exact_target_lock_execution_gate_closeout.yaml | docs/archive/phases/v7/v7_82_second_json_exact_target_lock_execution_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 175 | docs/v7_82_second_json_exact_target_lock_execution_gate.md | docs/archive/phases/v7/v7_82_second_json_exact_target_lock_execution_gate.md | phases/v7 | .md | true | false | true |
| 176 | docs/v7_82_second_json_exact_target_lock_execution_gate.yaml | docs/archive/phases/v7/v7_82_second_json_exact_target_lock_execution_gate.yaml | phases/v7 | .yaml | true | false | true |
| 177 | docs/v7_84_target_fingerprint_lock_planning_closeout.yaml | docs/archive/phases/v7/v7_84_target_fingerprint_lock_planning_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 178 | docs/v7_84_target_fingerprint_lock_planning.yaml | docs/archive/phases/v7/v7_84_target_fingerprint_lock_planning.yaml | phases/v7 | .yaml | true | false | true |
| 179 | docs/v7_85_cdp_websocket_connect_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_85_cdp_websocket_connect_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 180 | docs/v7_85_cdp_websocket_connect_authorization_package.md | docs/archive/phases/v7/v7_85_cdp_websocket_connect_authorization_package.md | phases/v7 | .md | true | false | true |
| 181 | docs/v7_85_cdp_websocket_connect_authorization_package.yaml | docs/archive/phases/v7/v7_85_cdp_websocket_connect_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 182 | docs/v7_86_cdp_websocket_connect_execution_gate_closeout.yaml | docs/archive/phases/v7/v7_86_cdp_websocket_connect_execution_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 183 | docs/v7_86_cdp_websocket_connect_execution_gate.md | docs/archive/phases/v7/v7_86_cdp_websocket_connect_execution_gate.md | phases/v7 | .md | true | false | true |
| 184 | docs/v7_86_cdp_websocket_connect_execution_gate.yaml | docs/archive/phases/v7/v7_86_cdp_websocket_connect_execution_gate.yaml | phases/v7 | .yaml | true | false | true |
| 185 | docs/v7_88_runtime_evaluate_surface_probe_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_88_runtime_evaluate_surface_probe_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 186 | docs/v7_88_runtime_evaluate_surface_probe_authorization_package.md | docs/archive/phases/v7/v7_88_runtime_evaluate_surface_probe_authorization_package.md | phases/v7 | .md | true | false | true |
| 187 | docs/v7_88_runtime_evaluate_surface_probe_authorization_package.yaml | docs/archive/phases/v7/v7_88_runtime_evaluate_surface_probe_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 188 | docs/v7_89_runtime_evaluate_surface_probe_execution_gate_closeout.yaml | docs/archive/phases/v7/v7_89_runtime_evaluate_surface_probe_execution_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 189 | docs/v7_89_runtime_evaluate_surface_probe_execution_gate.md | docs/archive/phases/v7/v7_89_runtime_evaluate_surface_probe_execution_gate.md | phases/v7 | .md | true | false | true |
| 190 | docs/v7_89_runtime_evaluate_surface_probe_execution_gate.yaml | docs/archive/phases/v7/v7_89_runtime_evaluate_surface_probe_execution_gate.yaml | phases/v7 | .yaml | true | false | true |
| 191 | docs/v7_91_cancel_only_preflight_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_91_cancel_only_preflight_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 192 | docs/v7_91_cancel_only_preflight_authorization_package.md | docs/archive/phases/v7/v7_91_cancel_only_preflight_authorization_package.md | phases/v7 | .md | true | false | true |
| 193 | docs/v7_91_cancel_only_preflight_authorization_package.yaml | docs/archive/phases/v7/v7_91_cancel_only_preflight_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 194 | docs/v7_92_cancel_only_preflight_execution_gate_closeout.yaml | docs/archive/phases/v7/v7_92_cancel_only_preflight_execution_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 195 | docs/v7_92_cancel_only_preflight_execution_gate.md | docs/archive/phases/v7/v7_92_cancel_only_preflight_execution_gate.md | phases/v7 | .md | true | false | true |
| 196 | docs/v7_92_cancel_only_preflight_execution_gate.yaml | docs/archive/phases/v7/v7_92_cancel_only_preflight_execution_gate.yaml | phases/v7 | .yaml | true | false | true |
| 197 | docs/v7_94_loadSession_read_only_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_94_loadSession_read_only_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 198 | docs/v7_94_loadSession_read_only_authorization_package.md | docs/archive/phases/v7/v7_94_loadSession_read_only_authorization_package.md | phases/v7 | .md | true | false | true |
| 199 | docs/v7_94_loadSession_read_only_authorization_package.yaml | docs/archive/phases/v7/v7_94_loadSession_read_only_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 200 | docs/v7_95_loadSession_read_only_execution_gate_closeout.yaml | docs/archive/phases/v7/v7_95_loadSession_read_only_execution_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 201 | docs/v7_95_loadSession_read_only_execution_gate.md | docs/archive/phases/v7/v7_95_loadSession_read_only_execution_gate.md | phases/v7 | .md | true | false | true |
| 202 | docs/v7_95_loadSession_read_only_execution_gate.yaml | docs/archive/phases/v7/v7_95_loadSession_read_only_execution_gate.yaml | phases/v7 | .yaml | true | false | true |
| 203 | docs/v7_97_previewDraft_read_only_authorization_package_closeout.yaml | docs/archive/phases/v7/v7_97_previewDraft_read_only_authorization_package_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 204 | docs/v7_97_previewDraft_read_only_authorization_package.md | docs/archive/phases/v7/v7_97_previewDraft_read_only_authorization_package.md | phases/v7 | .md | true | false | true |
| 205 | docs/v7_97_previewDraft_read_only_authorization_package.yaml | docs/archive/phases/v7/v7_97_previewDraft_read_only_authorization_package.yaml | phases/v7 | .yaml | true | false | true |
| 206 | docs/v7_98_previewDraft_read_only_execution_gate_closeout.yaml | docs/archive/phases/v7/v7_98_previewDraft_read_only_execution_gate_closeout.yaml | phases/v7 | .yaml | true | false | true |
| 207 | docs/v7_98_previewDraft_read_only_execution_gate.md | docs/archive/phases/v7/v7_98_previewDraft_read_only_execution_gate.md | phases/v7 | .md | true | false | true |
| 208 | docs/v7_98_previewDraft_read_only_execution_gate.yaml | docs/archive/phases/v7/v7_98_previewDraft_read_only_execution_gate.yaml | phases/v7 | .yaml | true | false | true |

## Stop Conditions

Stop before any future step if:

- the candidate count is not exactly 208
- any source path is missing
- any destination already exists
- any source path falls outside top-level docs/
- any destination falls outside docs/archive/
- a move would touch validator-blocked, wrapper-required, docs-only-reference, current authority, or docs/archive planning records
- a task asks for deletion, overwrite, stage, commit, push, tag, release, deploy, A5, provider/plugin/API/image generation/DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox access

## Recommended Next

Human review this dry-run package. If accepted, issue a separate explicit C1d physical move authorization naming this package and preserving the exact-file/no-delete/no-overwrite/no-stage/no-commit/no-push boundary.
