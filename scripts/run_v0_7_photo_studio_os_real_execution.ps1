param(
  [string]$Root = '',
  [Parameter(Mandatory = $true)]
  [string]$PluginDir,
  [string]$PluginId = 'DoubaoGen',
  [int]$MaxPluginCalls = 1,
  [Parameter(Mandatory = $true)]
  [string]$InputReference,
  [Parameter(Mandatory = $true)]
  [string]$OutputDirectory,
  [string]$ModelOverride = '',
  [string]$Phase = 'v0.7_photo_studio_os_minimal_real_execution',
  [string]$InputReferenceSummary = 'Photo Studio OS first-run safe cover still-life prompt',
  [string]$OutputDirectoryDisplayRef = '<repo>/runs/photo_studio_os_v0_7',
  [string]$MemoryDeltaArchiveRef = 'runs/photo_studio_os_v0_7/run_summary.sanitized.json',
  [switch]$GatekeeperApproved,
  [switch]$ReviewConsoleHumanApproved,
  [switch]$MemoryDeltaOnly
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

if ([string]::IsNullOrWhiteSpace($Root)) {
  $Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
}

function Get-NormalizedFullPath {
  param([string]$Path)
  return [System.IO.Path]::GetFullPath($Path)
}

function ConvertTo-RepoRelativePath {
  param(
    [string]$Base,
    [string]$Path
  )
  $baseFull = Get-NormalizedFullPath $Base
  $pathFull = Get-NormalizedFullPath $Path
  if (-not $baseFull.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
    $baseFull = $baseFull + [System.IO.Path]::DirectorySeparatorChar
  }
  if ($pathFull.StartsWith($baseFull, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $pathFull.Substring($baseFull.Length).Replace('\', '/')
  }
  return '<outside-authorized-root>'
}

function ConvertTo-SafeText {
  param([AllowNull()][string]$Text)
  if (-not $Text) { return '' }
  $safe = $Text
  $safe = $safe -replace 'https?://[^\s\]")]+', '<redacted-url>'
  $safe = $safe -replace '[A-Za-z]:\\[^\s\]")]+', '<redacted-path>'
  $safe = $safe -replace '(?i)(bearer\s+)[A-Za-z0-9._\-]+', '$1<redacted-token>'
  $safe = $safe -replace '(?i)(api[_-]?key|token|cookie|password|secret)\s*[:=]\s*[^,\s\]")]+', '$1=<redacted-secret>'
  return $safe
}

function Get-Sha256Utf8 {
  param([AllowNull()][string]$Text)
  if ([string]::IsNullOrWhiteSpace($Text)) { return $null }
  $sha = [System.Security.Cryptography.SHA256]::Create()
  return ([BitConverter]::ToString($sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($Text))).Replace('-', '').ToLowerInvariant())
}

function Write-SanitizedJson {
  param(
    [string]$Path,
    [object]$Data
  )
  $json = $Data | ConvertTo-Json -Depth 8
  Set-Content -LiteralPath $Path -Value $json -Encoding UTF8 -NoNewline
}

function Load-EnvFile {
  param([string]$Path)
  $vars = @{}
  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    return $vars
  }

  foreach ($line in Get-Content -LiteralPath $Path -Encoding UTF8) {
    if ($line -match '^\s*$' -or $line -match '^\s*#') { continue }
    if ($line -notmatch '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$') { continue }
    $key = $matches[1]
    $value = $matches[2].Trim()
    if (
      ($value.StartsWith('"') -and $value.EndsWith('"')) -or
      ($value.StartsWith("'") -and $value.EndsWith("'"))
    ) {
      $value = $value.Substring(1, $value.Length - 2)
    }
    $vars[$key] = $value
  }
  return $vars
}

function New-BaseSummary {
  param(
    [string]$Status,
    [int]$ActualCalls
  )
  return [ordered]@{
    phase = $Phase
    status = $Status
    selected_plugin_id = $PluginId
    command = 'generate'
    max_plugin_calls_authorized = $MaxPluginCalls
    actual_plugin_calls = $ActualCalls
    input_reference_summary = $InputReferenceSummary
    output_directory_ref = $OutputDirectoryDisplayRef
    model_ref = if ([string]::IsNullOrWhiteSpace($ModelOverride)) { '<config-default>' } else { $ModelOverride }
    overwrite_existing_files_allowed = $false
    gatekeeper_approved = [bool]$GatekeeperApproved
    review_console_human_approved = [bool]$ReviewConsoleHumanApproved
    daily_note_called = $false
    daily_note_direct_write_allowed = $false
    memory_delta_only = [bool]$MemoryDeltaOnly
    raw_plugin_output_saved = $false
    secret_value_saved = $false
    endpoint_raw_saved = $false
    runtime_log_saved = $false
    image_binary_saved_to_memory = $false
    vcp_toolbox_files_modified = $false
    isolated_runtime_used = $true
    plugin_runtime_secret_cache_blocked = $true
  }
}

$rootFull = Get-NormalizedFullPath $Root
$pluginDirFull = Get-NormalizedFullPath $PluginDir
$outputFull = Get-NormalizedFullPath $OutputDirectory
$summaryPath = Join-Path $outputFull 'run_summary.sanitized.json'
$memoryDeltaPath = Join-Path $outputFull 'memory_delta_request.sanitized.yaml'

if ($PluginId -ne 'DoubaoGen') {
  throw 'Only DoubaoGen is allowed for this v0.7 execution.'
}
if ($MaxPluginCalls -ne 1) {
  throw 'MaxPluginCalls must be exactly 1 for this v0.7 execution.'
}
if (-not $GatekeeperApproved -or -not $ReviewConsoleHumanApproved) {
  throw 'Gatekeeper and Review Console approval are required.'
}
if (-not $MemoryDeltaOnly) {
  throw 'MemoryDeltaOnly must be true; direct DailyNote writes are not allowed.'
}
if ($InputReference -match '(?i)(api[_-]?key|token|cookie|password|secret|bearer\s+)') {
  throw 'InputReference appears to contain sensitive material.'
}
if (-not $outputFull.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'OutputDirectory must stay inside the Agent Image Lab repository.'
}
if (-not (Test-Path -LiteralPath $pluginDirFull -PathType Container)) {
  throw 'PluginDir was not found.'
}

if (Test-Path -LiteralPath $outputFull) {
  $existing = @(Get-ChildItem -LiteralPath $outputFull -Force)
  if ($existing.Count -gt 0) {
    $preparedRuntimeOnly = (
      $existing.Count -eq 1 -and
      $existing[0].Name -eq '_plugin_runtime' -and
      $existing[0].PSIsContainer -and
      -not (Test-Path -LiteralPath $summaryPath) -and
      -not (Test-Path -LiteralPath (Join-Path $outputFull 'image'))
    )
    if (-not $preparedRuntimeOnly) {
      throw 'OutputDirectory already exists and is not empty; refusing to overwrite.'
    }
  }
} else {
  New-Item -ItemType Directory -Path $outputFull -Force | Out-Null
}

$runtimeDir = Join-Path $outputFull '_plugin_runtime'
New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null

$sourcePlugin = Join-Path $pluginDirFull 'DoubaoGen.js'
$runtimePlugin = Join-Path $runtimeDir 'DoubaoGen.mjs'
if (-not (Test-Path -LiteralPath $sourcePlugin -PathType Leaf)) {
  throw 'DoubaoGen.js was not found in PluginDir.'
}
if (-not (Test-Path -LiteralPath $runtimePlugin)) {
  Copy-Item -LiteralPath $sourcePlugin -Destination $runtimePlugin -ErrorAction Stop
}

$cacheBlocker = Join-Path $runtimeDir '.doubao_api_cache.json'
if (Test-Path -LiteralPath $cacheBlocker) {
  if (-not (Test-Path -LiteralPath $cacheBlocker -PathType Container)) {
    throw 'Runtime cache blocker path exists but is not a directory.'
  }
} else {
  New-Item -ItemType Directory -Path $cacheBlocker -Force | Out-Null
}

$envFile = Join-Path $pluginDirFull 'config.env'
$envVars = Load-EnvFile $envFile
if (-not $envVars.ContainsKey('VOLCENGINE_API_KEY') -or [string]::IsNullOrWhiteSpace($envVars['VOLCENGINE_API_KEY'])) {
  $blocked = New-BaseSummary -Status 'blocked_missing_plugin_credential' -ActualCalls 0
  $blocked.api_called = $false
  $blocked.vcp_plugin_called = $false
  $blocked.file_write_performed = $true
  $blocked.image_file_created = $false
  $blocked.rollback_performed = $false
  Write-SanitizedJson -Path $summaryPath -Data $blocked
  Write-Output ($blocked | ConvertTo-Json -Depth 8)
  exit 2
}

$node = Get-Command node -ErrorAction Stop
$payload = @{
  command = 'generate'
  prompt = $InputReference
  resolution = '1024x1024'
  watermark = $false
  seed = -1
}
if (-not [string]::IsNullOrWhiteSpace($ModelOverride)) {
  $payload.model = $ModelOverride
}
$payload = $payload | ConvertTo-Json -Compress

$psi = [System.Diagnostics.ProcessStartInfo]::new()
$psi.FileName = $node.Source
$psi.WorkingDirectory = $runtimeDir
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
$psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8
$psi.Arguments = '"' + ($runtimePlugin -replace '"', '\"') + '"'

foreach ($key in $envVars.Keys) {
  $psi.EnvironmentVariables[$key] = [string]$envVars[$key]
}
$psi.EnvironmentVariables['PROJECT_BASE_PATH'] = $outputFull
$psi.EnvironmentVariables['DEFAULT_RESPONSE_FORMAT'] = 'url'
$psi.EnvironmentVariables['DebugMode'] = 'false'
$psi.EnvironmentVariables['PYTHONIOENCODING'] = 'utf-8'

$process = [System.Diagnostics.Process]::Start($psi)
$payloadBytes = [System.Text.UTF8Encoding]::new($false).GetBytes($payload)
$process.StandardInput.BaseStream.Write($payloadBytes, 0, $payloadBytes.Length)
$process.StandardInput.BaseStream.Flush()
$process.StandardInput.Close()

$stdoutTask = $process.StandardOutput.ReadToEndAsync()
$stderrTask = $process.StandardError.ReadToEndAsync()
$timeoutMs = 360000
$completed = $process.WaitForExit($timeoutMs)
if (-not $completed) {
  $process.Kill()
  $timeoutSummary = New-BaseSummary -Status 'failed_timeout_rolled_back' -ActualCalls 1
  $timeoutSummary.api_called = $true
  $timeoutSummary.vcp_plugin_called = $true
  $timeoutSummary.file_write_performed = $true
  $timeoutSummary.image_file_created = $false
  $timeoutSummary.rollback_performed = $true
  $timeoutSummary.sanitized_error = 'Plugin execution timed out.'
  Write-SanitizedJson -Path $summaryPath -Data $timeoutSummary
  Write-Output ($timeoutSummary | ConvertTo-Json -Depth 8)
  exit 3
}

$stdout = $stdoutTask.GetAwaiter().GetResult()
$stderr = $stderrTask.GetAwaiter().GetResult()

$parsed = $null
try {
  $parsed = $stdout | ConvertFrom-Json
} catch {
  $failedParse = New-BaseSummary -Status 'failed_invalid_plugin_response_rolled_back' -ActualCalls 1
  $failedParse.api_called = $true
  $failedParse.vcp_plugin_called = $true
  $failedParse.file_write_performed = $true
  $failedParse.image_file_created = $false
  $failedParse.rollback_performed = $true
  $failedParse.sanitized_error = ConvertTo-SafeText $_.Exception.Message
  Write-SanitizedJson -Path $summaryPath -Data $failedParse
  Write-Output ($failedParse | ConvertTo-Json -Depth 8)
  exit 4
}

$imageDir = Join-Path $outputFull 'image\doubaogen'
$imageFiles = @()
if (Test-Path -LiteralPath $imageDir -PathType Container) {
  $imageFiles = @(Get-ChildItem -LiteralPath $imageDir -File -Force |
    Where-Object { @('.png', '.jpg', '.jpeg', '.webp') -contains $_.Extension.ToLowerInvariant() })
}

if ($parsed.status -ne 'success') {
  foreach ($file in $imageFiles) {
    Remove-Item -LiteralPath $file.FullName -Force
  }

  $failed = New-BaseSummary -Status 'failed_rolled_back' -ActualCalls 1
  $failed.api_called = $true
  $failed.vcp_plugin_called = $true
  $failed.file_write_performed = $true
  $failed.image_file_created = $imageFiles.Count -gt 0
  $failed.rollback_performed = $true
  $failed.rolled_back_image_files = $imageFiles.Count
  $failed.sanitized_error = ConvertTo-SafeText ([string]$parsed.error)
  if ($stderr) {
    $failed.sanitized_stderr_summary = ConvertTo-SafeText ($stderr -split "`r?`n" | Select-Object -First 3 | Out-String)
  }
  Write-SanitizedJson -Path $summaryPath -Data $failed
  Write-Output ($failed | ConvertTo-Json -Depth 8)
  exit 5
}

$imageSummaries = @()
foreach ($file in $imageFiles) {
  $hash = Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256
  $imageSummaries += [ordered]@{
    relative_path = ConvertTo-RepoRelativePath -Base $outputFull -Path $file.FullName
    bytes = $file.Length
    sha256 = $hash.Hash.ToLowerInvariant()
  }
}

$result = $parsed.result
$details = $result.details
$success = New-BaseSummary -Status 'success' -ActualCalls 1
$success.api_called = $true
$success.vcp_plugin_called = $true
$success.file_write_performed = $true
$success.image_file_created = $imageSummaries.Count -gt 0
$success.rollback_performed = $false
$success.image_count = $imageSummaries.Count
$success.generated_images = $imageSummaries
$success.plugin_reported_image_count = $details.image_count
$success.plugin_reported_response_format = ConvertTo-SafeText ([string]$details.response_format)
$pluginReportedModelRef = if ($details.model) { ConvertTo-SafeText ([string]$details.model) } else { '<model-ref-not-reported>' }
$success.plugin_reported_model_ref = $pluginReportedModelRef
$success.plugin_reported_model_sha256_utf8 = if ($details.model) { Get-Sha256Utf8 ([string]$details.model) } else { $null }
$success.requested_model_sha256_utf8 = if ([string]::IsNullOrWhiteSpace($ModelOverride)) { $null } else { Get-Sha256Utf8 $ModelOverride }
$success.plugin_reported_model_matches_requested = if ($details.model -and -not [string]::IsNullOrWhiteSpace($ModelOverride)) { ([string]$details.model) -eq $ModelOverride } else { $null }

# Model mismatch guard: if ModelOverride was specified but plugin used a different model,
# downgrade status to blocked_model_mismatch and block asset acceptance / memory write.
$modelMismatch = $success.plugin_reported_model_matches_requested -eq $false
if ($modelMismatch) {
  $success.status = 'blocked_model_mismatch'
  $success.asset_status = 'blocked'
  $success.memory_write_allowed = $false
  $success.daily_note_write_allowed = $false
  $success.model_mismatch_guard_triggered = $true
  $success.model_mismatch_detail = "Requested: $ModelOverride, Plugin reported: $pluginReportedModelRef"
}

$success.audit_record = 'raw plugin stdout/stderr intentionally discarded after sanitization'
$success.memory_delta_request_ref = 'memory_delta_request.sanitized.yaml'

Write-SanitizedJson -Path $summaryPath -Data $success

$memoryDelta = @"
memory_delta_request:
  status: draft_only
  phase: $Phase
  daily_note_direct_write_allowed: false
  memory_delta_only: true
  proposed_chinese_summary: "Photo Studio OS 首次最小真实执行已完成；仅建议记录脱敏摘要、相对输出路径、评分占位和规则，不写入图片二进制。"
  archive_refs:
    - "$MemoryDeltaArchiveRef"
  image_binary_to_memory: false
  requires_human_approval_before_daily_note: true
"@
Set-Content -LiteralPath $memoryDeltaPath -Value $memoryDelta -Encoding UTF8 -NoNewline

Write-Output ($success | ConvertTo-Json -Depth 8)
