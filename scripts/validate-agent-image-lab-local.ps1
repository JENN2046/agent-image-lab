# Agent Image Lab local validation helper
# Safe local validation only.
# Does not install dependencies, call APIs, call plugins, write DailyNote, push, tag, deploy, or read external repos.

$ErrorActionPreference = "Stop"

Write-Host "== Agent Image Lab local validation =="

$failed = $false
$warnings = @()

function Add-Warn($msg) {
  $script:warnings += $msg
  Write-Host "WARN: $msg"
}

Write-Host ""
Write-Host "== Git reality =="
try { git branch --show-current } catch { Add-Warn "git branch check unavailable" }
try { git status --short } catch { Add-Warn "git status unavailable" }
try { git diff --stat } catch { Add-Warn "git diff stat unavailable" }

Write-Host ""
Write-Host "== git diff --check =="
try {
  git diff --check
  if ($LASTEXITCODE -ne 0) { $failed = $true }
} catch {
  Add-Warn "git diff --check unavailable"
}

Write-Host ""
Write-Host "== Required project files =="
$required = @(
  "README.md",
  "AGENTS.md",
  "00_project_skeleton.md",
  "DECISIONS.md",
  "tests/validation_checklist.md"
)
foreach ($p in $required) {
  if (-not (Test-Path $p)) {
    Write-Host "MISSING: $p"
    $failed = $true
  } else {
    Write-Host "OK: $p"
  }
}

Write-Host ""
Write-Host "== Review Console prototype syntax =="
$proto = "review_console/static_prototype/app.js"
if (Test-Path $proto) {
  if (Get-Command node -ErrorAction SilentlyContinue) {
    node --check $proto
    if ($LASTEXITCODE -ne 0) { $failed = $true }
  } else {
    Add-Warn "node not found; skipped app.js syntax check"
  }
} else {
  Write-Host "Skip: $proto not present"
}

Write-Host ""
Write-Host "== Hard false flag scan =="
$strictPatterns = @(
  "api_called:\s*true",
  "vcp_plugin_called:\s*true",
  "daily_note_called:\s*true",
  "source_read_performed:\s*true",
  "real_manifest_read:\s*true",
  "real_execution_allowed:\s*true",
  "real_vcpchat_source_read:\s*true",
  "raw_source_copy_allowed:\s*true",
  "integration_code_creation_allowed:\s*true",
  "vcpchat_modification_allowed:\s*true",
  "vcp_toolbox_modification_allowed:\s*true"
)
$allowedHistoricalTrueFlagFiles = @(
  "docs/33_post_execution_checkpoint.md",
  "integrations/vcp/v0_7_photo_studio_os_real_execution_record.md",
  "integrations/vcp/v0_9_photo_studio_os_retry_real_execution_record.md",
  "integrations/vcp/v0_10_doubaogen_retry_real_execution_record.md",
  "integrations/vcp/v0_10_gptimagegen_gpt55_real_execution_record.md",
  "integrations/vcp/v0_10_gptimagegen_real_execution_record.md",
  "integrations/vcp/v0_10_gptimagegen_retry2_real_execution_record.md",
  "tests/schema_examples/v0_7_photo_studio_os_real_execution_record.example.yaml",
  "tests/schema_examples/v0_9_photo_studio_os_retry_real_execution_record.example.yaml",
  "tests/schema_examples/v0_9_post_execution_checkpoint.example.yaml",
  "tests/schema_examples/v0_10_doubaogen_retry_real_execution_record.example.yaml",
  "tests/schema_examples/v0_10_gptimagegen_gpt55_real_execution_record.example.yaml",
  "tests/schema_examples/v0_10_gptimagegen_real_execution_record.example.yaml",
  "tests/schema_examples/v0_10_gptimagegen_retry2_real_execution_record.example.yaml"
)
$allowedHistoricalTrueFlagSet = @{}
foreach ($p in $allowedHistoricalTrueFlagFiles) {
  $allowedHistoricalTrueFlagSet[[System.IO.Path]::GetFullPath((Join-Path (Get-Location) $p))] = $true
}
$files = Get-ChildItem -Recurse -File -Include *.md,*.yaml,*.yml,*.json,*.html,*.css,*.js -ErrorAction SilentlyContinue | Where-Object {
  $_.FullName -notmatch "\\.git\\" -and -not $allowedHistoricalTrueFlagSet.ContainsKey($_.FullName)
}
foreach ($pat in $strictPatterns) {
  $hits = $files | Select-String -Pattern $pat -CaseSensitive:$false
  if ($hits) {
    Write-Host "FAIL pattern: $pat"
    $hits | ForEach-Object { Write-Host "  $($_.Path):$($_.LineNumber): $($_.Line.Trim())" }
    $failed = $true
  }
}

Write-Host ""
Write-Host "== Warning scan: forbidden strings may be negative checklist items =="
$warnPatterns = @(
  "A:\\VCP\\",
  "C:\\Users\\",
  "index\.js",
  "\.exe",
  "\.ps1",
  "\.bat",
  "\.cmd",
  "\.sh",
  "\.png",
  "\.jpg",
  "\.jpeg",
  "\.webp",
  "token",
  "cookie",
  "password",
  "API key"
)
foreach ($pat in $warnPatterns) {
  $hits = $files | Select-String -Pattern $pat -CaseSensitive:$false
  if ($hits) {
    Add-Warn "Pattern '$pat' found; inspect whether it is only a negative/checklist reference."
  }
}

Write-Host ""
if ($warnings.Count -gt 0) {
  Write-Host "== Warnings =="
  $warnings | ForEach-Object { Write-Host "- $_" }
}

if ($failed) {
  Write-Host ""
  Write-Host "Result: FAILED"
  exit 1
}

Write-Host ""
Write-Host "Result: PASSED_WITH_WARNINGS_OK_FOR_MANUAL_REVIEW"
exit 0
