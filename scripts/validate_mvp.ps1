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
  'scripts/validate_runtime_guard_unit.js',
  'scripts/validate_runtime_prototype_smoke.js',
  'scripts/validate_runtime_prototype_suite.js',
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
  'review_console/embed_contract/first_runtime_code_patch_authorization.md'
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
    if ($content -match 'fetch\(|XMLHttpRequest|localStorage|sessionStorage|writeFile|appendFile|child_process|exec\(|spawn\(|require\(|fs\.|https\.|http\.|navigator\.clipboard|eval\(|Function\(') {
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
  'review_console/runtime_prototype/README.md',
  'scripts/validate_local_commit_scope.js',
  'scripts/validate_mvp.ps1',
  'scripts/validate_v4_index_consistency.js',
  'scripts/validate_v5_delivery_readiness.js',
  'scripts/validate_adapter_delivery_surface.js',
  'scripts/validate_runtime_delivery_surface.js',
  'scripts/validate_runtime_prototype_suite.js',
  'scripts/validate_runtime_prototype_smoke.js',
  'tests/schema_examples/v4_8_v4_index_consistency_validation.example.yaml',
  'tests/schema_examples/v5_1_runtime_delivery_surface.example.yaml',
  'tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml',
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
  'scripts/validate-agent-image-lab-local.ps1',
  'scripts/validate-agent-image-lab-local.sh',
  'scripts/validate_agent_board_state.js',
  'scripts/validate_local_checkpoint_manifest.js',
  'scripts/validate_post_push_state.js',
  'scripts/validate_v4_index_consistency.js',
  'scripts/validate_local_tag_push_readiness.js',
  'scripts/validate_v5_delivery_readiness.js',
  'scripts/validate_adapter_delivery_surface.js',
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
  'tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml'
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

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Add-Failure "Node.js is required to validate adapter_dry_run_lab"
} else {
  & node --check (Join-Path $Root 'adapter_dry_run_lab/adapter_dry_run.js') | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "adapter_dry_run_lab/adapter_dry_run.js failed node --check"
  }

  $acceptedOutput = & node (Join-Path $Root 'adapter_dry_run_lab/adapter_dry_run.js') (Join-Path $Root 'adapter_dry_run_lab/fixtures/accepted_request.json')
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

  $rejectedOutput = & node (Join-Path $Root 'adapter_dry_run_lab/adapter_dry_run.js') (Join-Path $Root 'adapter_dry_run_lab/fixtures/rejected_request.json')
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

  $git = Get-Command git -ErrorAction SilentlyContinue
  if (-not $git) {
    Add-Failure "git is required to validate local commit scope against current worktree"
  } else {
    $currentBranch = ((& git branch --show-current) -join "`n").Trim()
    if ($LASTEXITCODE -ne 0) {
      Add-Failure "git branch --show-current failed during local commit scope validation"
    } elseif ($currentBranch -ne 'master') {
      Add-Failure "local commit scope expected branch master, got $currentBranch"
    }

    $localTagCommit = ((& git rev-parse --short v4.8-local-validation-checkpoint) -join "`n").Trim()
    if ($LASTEXITCODE -ne 0) {
      Add-Failure "git rev-parse --short v4.8-local-validation-checkpoint failed during local tag readiness validation"
    } elseif ($localTagCommit -ne '6d4253f') {
      Add-Failure "local tag v4.8-local-validation-checkpoint expected commit 6d4253f, got $localTagCommit"
    }

    $actualModifiedFiles = @(& git diff --name-only | Where-Object { $_.Trim() -ne '' } | ForEach-Object { $_.Trim() })
    if ($LASTEXITCODE -ne 0) {
      Add-Failure "git diff --name-only failed during local commit scope validation"
    }
    $unexpectedModifiedFiles = @($actualModifiedFiles | Where-Object { $allowedV46ModifiedFiles -notcontains $_ })
    if ($unexpectedModifiedFiles.Count -gt 0) {
      Add-Failure "local commit scope found unexpected modified files: $($unexpectedModifiedFiles -join ', ')"
    }

    $actualUntrackedFiles = @(& git ls-files --others --exclude-standard | Where-Object { $_.Trim() -ne '' } | ForEach-Object { $_.Trim() })
    if ($LASTEXITCODE -ne 0) {
      Add-Failure "git ls-files --others --exclude-standard failed during local commit scope validation"
    }
    $unexpectedUntrackedFiles = @($actualUntrackedFiles | Where-Object { $allowedV46UntrackedFiles -notcontains $_ })
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

  $adapterCliPath = Join-Path $Root 'exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js'
  $acceptedCliInput = Get-Content -Raw -Encoding UTF8 (Join-Path $Root 'adapter_dry_run_lab/fixtures/accepted_request.json')
  $acceptedCliOutput = $acceptedCliInput | & node $adapterCliPath
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

  $rejectedCliInput = Get-Content -Raw -Encoding UTF8 (Join-Path $Root 'adapter_dry_run_lab/fixtures/rejected_request.json')
  $rejectedCliOutput = $rejectedCliInput | & node $adapterCliPath
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
  $v07RehearsalOutput = & node (Join-Path $Root 'adapter_dry_run_lab/adapter_dry_run.js') $v07RehearsalPath
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
}

if ($failures.Count -gt 0) {
  Write-Host "Agent Image Lab validation failed:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Agent Image Lab validation passed." -ForegroundColor Green
