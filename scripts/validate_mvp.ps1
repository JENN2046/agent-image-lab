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
  '00_project_skeleton.md',
  'DECISIONS.md',
  'MANIFEST.md',
  'RELEASE_NOTES.md',
  'adapter_dry_run_lab/README.md',
  'adapter_dry_run_lab/adapter_dry_run.js',
  'adapter_dry_run_lab/fixtures/accepted_request.json',
  'adapter_dry_run_lab/fixtures/rejected_request.json',
  'exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js',
  'docs/00_project_roadmap.md',
  'docs/20_real_loop_completion_plan.md',
  'integrations/vcp/v0_3_authorization_closeout.md',
  'integrations/vcp/phase_c_manifest_sanitized_read_contract.md',
  'integrations/vcp/phase_c_manifest_sanitized_review_record.md',
  'integrations/vcp/phase_d_adapter_dry_run_minimal_contract.md',
  'integrations/vcp/v0_5_adapter_install_authorization.md',
  'integrations/vcp/v0_5_adapter_install_verification.md',
  'integrations/vcp/v0_6_real_plugin_manifest_authorization.md',
  'workflows/photo_studio_os_real_loop_runbook.md',
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
  'review_console/static_prototype/index.html',
  'review_console/static_prototype/app.js',
  'review_console/static_prototype/mock_data.js',
  'review_console/static_prototype/styles.css',
  'review_console/static_prototype/FIELD_MAPPING.md'
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
}

if ($failures.Count -gt 0) {
  Write-Host "Agent Image Lab validation failed:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Agent Image Lab validation passed." -ForegroundColor Green
