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
  'scripts/validate_local_checkpoint_manifest.js',
  'scripts/validate_local_commit_scope.js',
  'scripts/validate_post_push_state.js',
  'scripts/validate_v4_index_consistency.js',
  'scripts/validate_local_tag_push_readiness.js',
  'scripts/validate_v5_delivery_readiness.js',
  'scripts/validate_runtime_delivery_surface.js',
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
  'review_console/static_prototype/index.html',
  'review_console/static_prototype/app.js',
  'review_console/static_prototype/mock_data.js',
  'review_console/static_prototype/styles.css',
  'review_console/static_prototype/FIELD_MAPPING.md',
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
$mediaFiles = Get-ChildItem -LiteralPath $Root -Recurse -File -Force |
  Where-Object {
    $_.FullName -notlike '*\.git\*' -and
    $_.FullName -notlike '*\runs\*' -and
    $_.FullName -notlike '*\release_packages\*' -and
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
  'tests/schema_examples/v4_3_autopilot_overlay_installation.example.yaml',
  '.agent_board/RUN_STATE.md',
  '.agent_board/CHECKPOINT.md',
  '.agent_board/HANDOFF.md',
  '.agent_board/VALIDATION_LOG.md',
  '.agent_board/TASK_QUEUE.md'
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

  $runHistoricalCurrentStateValidators = $false
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
    if ($reviewConsoleAdapterHandoff.review_console_adapter_handoff.file_write_performed -ne $false) {
      Add-Failure "Review Console Adapter handoff validation must not write files"
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
      'docs/',
      'integrations/vcp/',
      'review_console/embed_contract/',
      'review_console/runtime_prototype/',
      'scripts/',
      'tests/schema_examples/'
    )
    $allowedCurrentA4ChangeFiles = @(
      '.gitignore',
      'AGENTS.md',
      'CLAUDE.md',
      'README.md',
      'MANIFEST.md',
      'RELEASE_NOTES.md',
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
