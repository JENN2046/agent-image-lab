# Docs Archive C1k Docs-Only Reference Rewrite Authorization Package Dry Run

Status: C1k docs-only-reference rewrite authorization package dry-run completed validated
Mode: A4.8 local documentation and authorization-package dry-run only
Source rewrite package: `docs/archive/DOCS_ARCHIVE_C1J_DOCS_ONLY_REFERENCE_REWRITE_PACKAGE_DRY_RUN.md`

This package defines the narrow authorization shape for a future docs-only-reference rewrite execution. It does not execute rewrites, move files, create wrappers, stage, commit, push, tag, release, deploy, or authorize any A5 action.

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

## Authorization Package Summary

| Field | Value |
| --- | --- |
| target operation | docs-only-reference exact path rewrite |
| mode for future execution | A4.8 local docs rewrite execution only |
| source docs allowlist | 29 files |
| target replacement rules | 65 rules |
| expected replacement hits | 98 |
| zero-reference drift candidates excluded | 2 |
| physical file movement allowed | false |
| wrapper creation allowed | false |
| validator behavior change allowed | false |
| staging / commit / push allowed | false |

Excluded from future rewrite execution:

- `docs/v7_102_cross_repo_boundary_audit.md`
- `docs/v7_75_electron_launch_runtime_state_closeout.yaml`

These are zero-current-reference drift candidates and require a separate exact-move preflight if pursued.

## Exact Source Docs Allowlist

A future rewrite execution may modify only these 29 source docs:

```text
docs/00_project_roadmap.md
docs/product_image_generation_authorization_draft.md
docs/product_image_generation_plan_draft.md
docs/product_image_workflow_A5_readiness_review.md
docs/prompt_artifact_schema_inventory.md
docs/v7_125_selected_docs_rescan_authorization_gate.md
docs/v7_135_batch_001_residual_correction_planning.md
docs/v7_136_batch_001_residual_correction_implementation_gate.md
docs/v7_138_batch_001_final_rescan_authorization_gate.md
docs/v7_144_batch_002_permission_drift_analysis.md
docs/v7_145_batch_002_correction_implementation_gate.md
docs/v7_147_batch_002_rescan_authorization_gate.md
docs/v7_156_batch_003_rescan_authorization_gate.md
docs/v7_169_agent_board_and_validator_patch_gate.md
docs/v7_169_agent_board_and_validator_patch_gate.yaml
docs/v7_205_static_review_console_mockup_spec_gate.md
docs/v7_208_static_mockup_visual_polish_or_pause_decision_gate.md
docs/v7_236_product_image_workflow_A5_readiness_review_gate.md
docs/v7_237_product_image_generation_authorization_draft_gate.md
docs/v7_238_product_image_generation_authorization_draft_review_gate.md
docs/v7_239_product_image_generation_plan_draft_gate.md
docs/v7_48_project_state_sync_pack.md
docs/v7_49_vcp_integration_readiness_pack.md
docs/v7_50_vcp_read_only_bridge_contract.md
docs/v7_51j_adapter_pro_review_findings_patch_report.md
docs/v7_58l_memory_overview_base_url_patch_closeout.md
docs/v7_58l_memory_overview_base_url_patch.md
docs/vcp_integration/agent_image_lab_vcp_integration_full_execution_backlog_v2.md
docs/vcp_integration/agent_image_lab_vcp_integration_full_landing_plan_v1.md
```

Any source outside this allowlist is forbidden for the future rewrite execution.

## Exact Replacement Rules

A future rewrite execution may replace only these exact old path strings with their exact archive path strings.

| # | Old path | New archive path |
| ---: | --- | --- |
| 1 | `docs/251_v6_validator_quality_gate.md` | `docs/archive/numbered_legacy/251_v6_validator_quality_gate.md` |
| 2 | `docs/v6_8_plugin_dashboard_legacy_index.md` | `docs/archive/phases/v6/v6_8_plugin_dashboard_legacy_index.md` |
| 3 | `docs/v7_118_corrected_fixture_dry_run_authorization_gate.md` | `docs/archive/phases/v7/v7_118_corrected_fixture_dry_run_authorization_gate.md` |
| 4 | `docs/v7_118_corrected_fixture_dry_run_authorization_gate.yaml` | `docs/archive/phases/v7/v7_118_corrected_fixture_dry_run_authorization_gate.yaml` |
| 5 | `docs/v7_119_corrected_fixture_dry_run_execution_closeout.md` | `docs/archive/phases/v7/v7_119_corrected_fixture_dry_run_execution_closeout.md` |
| 6 | `docs/v7_125_selected_docs_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_125_selected_docs_rescan_authorization_gate.yaml` |
| 7 | `docs/v7_126_selected_docs_rescan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_126_selected_docs_rescan_execution_closeout.yaml` |
| 8 | `docs/v7_127_controlled_long_task_chain_authorization_gate.yaml` | `docs/archive/phases/v7/v7_127_controlled_long_task_chain_authorization_gate.yaml` |
| 9 | `docs/v7_135_batch_001_residual_correction_planning.md` | `docs/archive/phases/v7/v7_135_batch_001_residual_correction_planning.md` |
| 10 | `docs/v7_135_batch_001_residual_correction_planning.yaml` | `docs/archive/phases/v7/v7_135_batch_001_residual_correction_planning.yaml` |
| 11 | `docs/v7_136_batch_001_residual_correction_implementation_gate.md` | `docs/archive/phases/v7/v7_136_batch_001_residual_correction_implementation_gate.md` |
| 12 | `docs/v7_136_batch_001_residual_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_136_batch_001_residual_correction_implementation_gate.yaml` |
| 13 | `docs/v7_138_batch_001_final_rescan_authorization_gate.md` | `docs/archive/phases/v7/v7_138_batch_001_final_rescan_authorization_gate.md` |
| 14 | `docs/v7_138_batch_001_final_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_138_batch_001_final_rescan_authorization_gate.yaml` |
| 15 | `docs/v7_139_batch_001_final_rescan_execution_closeout.md` | `docs/archive/phases/v7/v7_139_batch_001_final_rescan_execution_closeout.md` |
| 16 | `docs/v7_139_batch_001_final_rescan_execution_closeout.yaml` | `docs/archive/phases/v7/v7_139_batch_001_final_rescan_execution_closeout.yaml` |
| 17 | `docs/v7_142_batch_002_correction_planning.md` | `docs/archive/phases/v7/v7_142_batch_002_correction_planning.md` |
| 18 | `docs/v7_142_batch_002_correction_planning.yaml` | `docs/archive/phases/v7/v7_142_batch_002_correction_planning.yaml` |
| 19 | `docs/v7_144_batch_002_permission_drift_analysis.md` | `docs/archive/phases/v7/v7_144_batch_002_permission_drift_analysis.md` |
| 20 | `docs/v7_145_batch_002_correction_implementation_gate.yaml` | `docs/archive/phases/v7/v7_145_batch_002_correction_implementation_gate.yaml` |
| 21 | `docs/v7_147_batch_002_rescan_authorization_gate.yaml` | `docs/archive/phases/v7/v7_147_batch_002_rescan_authorization_gate.yaml` |
| 22 | `docs/v7_148_batch_002_rescan_execution_closeout.md` | `docs/archive/phases/v7/v7_148_batch_002_rescan_execution_closeout.md` |
| 23 | `docs/v7_181_generation_plan_package_blueprint_gate.md` | `docs/archive/phases/v7/v7_181_generation_plan_package_blueprint_gate.md` |
| 24 | `docs/v7_182_generation_authorization_package_blueprint_gate.md` | `docs/archive/phases/v7/v7_182_generation_authorization_package_blueprint_gate.md` |
| 25 | `docs/v7_184_static_review_console_mockup_planning_gate.md` | `docs/archive/phases/v7/v7_184_static_review_console_mockup_planning_gate.md` |
| 26 | `docs/v7_185_core_independent_vcp_native_adr_gate.md` | `docs/archive/phases/v7/v7_185_core_independent_vcp_native_adr_gate.md` |
| 27 | `docs/v7_186_static_review_console_mockup_alignment_gate.md` | `docs/archive/phases/v7/v7_186_static_review_console_mockup_alignment_gate.md` |
| 28 | `docs/v7_207_static_mockup_review_and_index_gate.md` | `docs/archive/phases/v7/v7_207_static_mockup_review_and_index_gate.md` |
| 29 | `docs/v7_280_prompt_v4_handle_geometry_refinement_authorization_gate.md` | `docs/archive/phases/v7/v7_280_prompt_v4_handle_geometry_refinement_authorization_gate.md` |
| 30 | `docs/v7_44_french_summer_rattan_bag_v3_closeout_production_readiness.md` | `docs/archive/phases/v7/v7_44_french_summer_rattan_bag_v3_closeout_production_readiness.md` |
| 31 | `docs/v7_45_french_summer_rattan_bag_v3_production_usage_sop.md` | `docs/archive/phases/v7/v7_45_french_summer_rattan_bag_v3_production_usage_sop.md` |
| 32 | `docs/v7_46_french_summer_rattan_bag_v3_one_shot_a5_template.md` | `docs/archive/phases/v7/v7_46_french_summer_rattan_bag_v3_one_shot_a5_template.md` |
| 33 | `docs/v7_47_french_summer_rattan_bag_v3_human_review_checklist.md` | `docs/archive/phases/v7/v7_47_french_summer_rattan_bag_v3_human_review_checklist.md` |
| 34 | `docs/v7_48_project_state_sync_pack.md` | `docs/archive/phases/v7/v7_48_project_state_sync_pack.md` |
| 35 | `docs/v7_49_vcp_case_summary_schema.md` | `docs/archive/phases/v7/v7_49_vcp_case_summary_schema.md` |
| 36 | `docs/v7_49_vcp_integration_execution_roadmap.md` | `docs/archive/phases/v7/v7_49_vcp_integration_execution_roadmap.md` |
| 37 | `docs/v7_49_vcp_integration_readiness_pack.md` | `docs/archive/phases/v7/v7_49_vcp_integration_readiness_pack.md` |
| 38 | `docs/v7_50d_vcpchat_review_console_surface_static_fixture_execution_report.md` | `docs/archive/phases/v7/v7_50d_vcpchat_review_console_surface_static_fixture_execution_report.md` |
| 39 | `docs/v7_50e_real_vcpchat_surface_check_safety_gates.md` | `docs/archive/phases/v7/v7_50e_real_vcpchat_surface_check_safety_gates.md` |
| 40 | `docs/v7_51a_agent_image_lab_read_only_evidence_index_spec.md` | `docs/archive/phases/v7/v7_51a_agent_image_lab_read_only_evidence_index_spec.md` |
| 41 | `docs/v7_51a_agent_image_lab_read_only_evidence_index.yaml` | `docs/archive/phases/v7/v7_51a_agent_image_lab_read_only_evidence_index.yaml` |
| 42 | `docs/v7_51b_read_only_bridge_adapter_contract.yaml` | `docs/archive/phases/v7/v7_51b_read_only_bridge_adapter_contract.yaml` |
| 43 | `docs/v7_51b_read_only_bridge_adapter_skeleton_plan.md` | `docs/archive/phases/v7/v7_51b_read_only_bridge_adapter_skeleton_plan.md` |
| 44 | `docs/v7_51c_read_only_bridge_adapter_error_codes.md` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_error_codes.md` |
| 45 | `docs/v7_51c_read_only_bridge_adapter_file_layout.md` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_file_layout.md` |
| 46 | `docs/v7_51c_read_only_bridge_adapter_implementation_plan.yaml` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_implementation_plan.yaml` |
| 47 | `docs/v7_51c_read_only_bridge_adapter_implementation_planning.md` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_implementation_planning.md` |
| 48 | `docs/v7_51c_read_only_bridge_adapter_security_gate_plan.md` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_security_gate_plan.md` |
| 49 | `docs/v7_51c_read_only_bridge_adapter_test_plan.md` | `docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_test_plan.md` |
| 50 | `docs/v7_51j_adapter_pro_review_findings_patch_result.yaml` | `docs/archive/phases/v7/v7_51j_adapter_pro_review_findings_patch_result.yaml` |
| 51 | `docs/v7_52a_vcptoolbox_read_only_ingestion_planning.md` | `docs/archive/phases/v7/v7_52a_vcptoolbox_read_only_ingestion_planning.md` |
| 52 | `docs/v7_52b_vcp_package_schema_mapping.md` | `docs/archive/phases/v7/v7_52b_vcp_package_schema_mapping.md` |
| 53 | `docs/v7_52c_vcptoolbox_no_write_bridge_contract.md` | `docs/archive/phases/v7/v7_52c_vcptoolbox_no_write_bridge_contract.md` |
| 54 | `docs/v7_52d_vcptoolbox_mock_ingestion_validation_report.md` | `docs/archive/phases/v7/v7_52d_vcptoolbox_mock_ingestion_validation_report.md` |
| 55 | `docs/v7_52d_vcptoolbox_mock_ingestion_validation_result.yaml` | `docs/archive/phases/v7/v7_52d_vcptoolbox_mock_ingestion_validation_result.yaml` |
| 56 | `docs/v7_52e_vcptoolbox_real_read_only_dry_run_a5_planning.md` | `docs/archive/phases/v7/v7_52e_vcptoolbox_real_read_only_dry_run_a5_planning.md` |
| 57 | `docs/v7_52f_vcptoolbox_read_only_ingestion_closeout.md` | `docs/archive/phases/v7/v7_52f_vcptoolbox_read_only_ingestion_closeout.md` |
| 58 | `docs/v7_58j_memory_overview_A5_request_pre_submission_checklist.md` | `docs/archive/phases/v7/v7_58j_memory_overview_A5_request_pre_submission_checklist.md` |
| 59 | `docs/v7_58j_memory_overview_independent_A5_request_text.md` | `docs/archive/phases/v7/v7_58j_memory_overview_independent_A5_request_text.md` |
| 60 | `docs/v7_58j_memory_overview_independent_A5_request_text.yaml` | `docs/archive/phases/v7/v7_58j_memory_overview_independent_A5_request_text.yaml` |
| 61 | `docs/v7_58l_memory_overview_base_url_patch_closeout.md` | `docs/archive/phases/v7/v7_58l_memory_overview_base_url_patch_closeout.md` |
| 62 | `docs/v7_58l_memory_overview_base_url_patch_closeout.yaml` | `docs/archive/phases/v7/v7_58l_memory_overview_base_url_patch_closeout.yaml` |
| 63 | `docs/v7_58l_memory_overview_base_url_patch.md` | `docs/archive/phases/v7/v7_58l_memory_overview_base_url_patch.md` |
| 64 | `docs/v7_58l_memory_overview_base_url_patch.yaml` | `docs/archive/phases/v7/v7_58l_memory_overview_base_url_patch.yaml` |
| 65 | `docs/v7_product_loop_closeout_matte_ceramic_mug_v1.md` | `docs/archive/phases/v7/v7_product_loop_closeout_matte_ceramic_mug_v1.md` |

## Required Preflight For Future Rewrite Execution

A future execution must run these checks before editing:

```powershell
git status --short --branch
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
```

It must also verify:

- branch is not behind `origin/master`
- staged files are empty before execution
- only the 29 source docs are eligible for modification
- all 65 old path strings still exist only in the expected source allowlist
- the 2 zero-current-reference drift candidates are not included
- no `.env`, `.env.local`, secret, provider/API/plugin/MCP/image/DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox action is needed

## Required Postflight For Future Rewrite Execution

After a separately authorized rewrite execution, validate:

```powershell
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
```

The future execution record must prove:

- exactly 29 or fewer source docs changed
- no file outside the source allowlist changed except explicitly allowed status/index records
- all 65 old path strings have zero non-archive refs in the 29 source docs
- all 65 archive path strings appear where expected
- no docs were moved
- no wrappers were created
- no validator behavior changed
- no staging, commit, push, tag, release, or deploy occurred unless separately authorized

## Future Exact Approval Text

This is not active approval. It is the exact text to review if Jenn later wants to execute the rewrite:

```text
批准执行 C1k docs-only-reference exact rewrite execution：使用 docs/archive/DOCS_ARCHIVE_C1K_DOCS_ONLY_REFERENCE_REWRITE_AUTHORIZATION_PACKAGE_DRY_RUN.md 中的 29 个 exact source docs allowlist 和 65 条 exact replacement rules，将 source docs 中匹配的旧 docs/ 路径精确替换为对应 docs/archive/ 路径；不允许修改 allowlist 之外任何 source 文件，不允许移动文件，不允许删除文件，不允许创建 wrappers，不允许修改 validator 行为，不允许 split scripts，不允许处理 runs/，不允许 provider/API/plugin/MCP/image generation/DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox，不允许读取 .env/.env.local，不允许 staging/commit/push/tag/release/deploy；执行前后运行 git status --short --branch、git diff --check、node scripts/validate_agent_board_state.js、powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1、powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1，并生成 C1k rewrite execution record 后停止汇报；审批人 Jenn。
```

## Stop Conditions

Future execution must stop before any of:

- missing or changed source allowlist file
- old path match appears outside the 29 source docs
- replacement would change binary or non-doc file
- replacement would touch `.agent_board`, README, manifest, archive records, scripts, tests, or validators outside explicit scope
- validation fails before execution
- postflight old path refs remain unexpectedly
- any A5 action is needed
- any secret/env file read is needed
- branch is behind remote
- user-owned unrelated dirty changes are present

## Decision

C1k authorization package is ready for human review. Rewrite execution remains blocked until Jenn provides separate explicit approval using this package or a narrower replacement subset.
