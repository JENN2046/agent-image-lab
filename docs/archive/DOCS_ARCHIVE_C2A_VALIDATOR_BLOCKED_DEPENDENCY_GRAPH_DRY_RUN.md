# C2a Validator-Blocked Dependency Graph Dry Run

base_contract: AGENTS.md
mode: A4.8 local docs-only read-only dependency graph
status: completed_dry_run_no_execution

## Scope

Source: docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md
Validator-blocked records scanned: 423
CSV evidence: docs/archive/DOCS_ARCHIVE_C2A_VALIDATOR_BLOCKED_DEPENDENCY_GRAPH_DRY_RUN.csv

## Live Dependency Buckets

- scripts_and_tests: 192
- scripts_only: 197
- tests_only: 34
- c1e_stale_or_nonlive_dependency: 0

## Top Live Script Ref Files

- scripts\validate_mvp.ps1: 170
- scripts\validate_local_commit_scope.js: 40
- scripts\validate_v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.js: 16
- scripts\validate_v5_index_consistency.js: 14
- scripts\validate_v4_index_consistency.js: 11
- scripts\validate_v5_12_release_candidate_readiness.js: 9
- scripts\agent_image_lab_read_only_adapter.js: 8
- scripts\validate_v5_true_loop_candidate_delivery.js: 8
- scripts\validate_local_checkpoint_manifest.js: 7
- scripts\validate_v14_129_current_goal_completion_audit_gap_map.js: 6
- scripts\validate_v14_142_multi_accepted_sample_matrix.js: 6
- scripts\validate_v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.js: 6

## Top Live Test Ref Files

- tests\validation_checklist.md: 186
- tests\schema_examples\v14_225_review_console_six_month_goal_gap_static_panel.example.json: 13
- tests\schema_examples\v14_212_six_month_goal_prompt_to_artifact_completion_audit.example.json: 13
- tests\schema_examples\v5_9_expanded_v5_index_consistency.example.yaml: 10
- tests\schema_examples\v5_12_release_candidate_readiness.example.yaml: 8
- tests\schema_examples\v5_6_v5_index_consistency_validation.example.yaml: 7
- tests\schema_examples\v4_5_local_checkpoint_readiness.example.yaml: 6
- tests\schema_examples\v5_10_local_true_loop_candidate_delivery.example.yaml: 5
- tests\schema_examples\v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.example.json: 5
- tests\schema_examples\v6_1_runtime_product_surface_audit.example.yaml: 4
- tests\schema_examples\v5_7_local_batch_commit_readiness.example.yaml: 4
- tests\schema_examples\v14_184_review_console_artifact_evidence_review_notes_panel.example.json: 3

## Decision

C2a is a dependency graph only. It does not move validator-blocked files and does not change validator behavior. The next safe step is C2b strategy package: split the 423 records by live dependency type into keep original path, possible fixture/validator compatibility work, possible wrapper, and long-term retain buckets.

## Non-Authorization

- no file movement
- no reference rewrite
- no wrapper creation
- no scripts/tests runtime logic change
- no provider/API/plugin/MCP/image generation/.env/real manifest/VCPChat/VCPToolBox/DailyNote/VCP memory/production_candidate/failure_samples action
- no push/tag/release/deploy
