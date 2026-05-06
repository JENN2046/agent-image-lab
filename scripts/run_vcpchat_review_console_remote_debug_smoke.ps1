# Agent Image Lab external remote-debug smoke preflight.
# Creation-phase script: emits sanitized dry-run JSON only.

[CmdletBinding()]
param(
  [string]$VcpChatRoot = "",
  [string]$ExpectedHead = "",
  [ValidateRange(1024, 65535)]
  [int]$RemoteDebugPort = 9222,
  [bool]$DryRun = $true,
  [bool]$Execute = $false,
  [string]$OutputJson = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Test-ShortHash {
  param([string]$Value)

  return -not [string]::IsNullOrWhiteSpace($Value) -and $Value -match '^[0-9a-fA-F]{6,40}$'
}

$warnings = New-Object System.Collections.Generic.List[string]

if ($Execute) {
  $warnings.Add("Execute was requested, but this creation-phase script is blocked from launching VCPChat or accessing CDP.")
}

if (-not $DryRun) {
  $warnings.Add("DryRun was set to false, but v7.43 forces dry-run behavior.")
}

if (-not [string]::IsNullOrWhiteSpace($OutputJson)) {
  $warnings.Add("OutputJson was provided, but v7.43 does not write result files.")
}

$result = [ordered]@{
  schema_name = "v7_43_external_remote_debug_verification_script_creation_result"
  script_name = "run_vcpchat_review_console_remote_debug_smoke"
  script_version = "v7.43"
  dry_run = $true
  execute_requested = [bool]$Execute
  execution_blocked = $true
  app_launch_performed = $false
  remote_debug_used = $false
  cdp_access_performed = $false
  runtime_evaluate_performed = $false
  bridge_method_invocation_performed = $false
  plugin_called = $false
  api_called = $false
  daily_note_called = $false
  vcp_memory_written = $false
  image_created = $false
  dependency_changed = $false
  vcpchat_source_read = $false
  vcpchat_source_modified = $false
  vcptoolbox_source_read = $false
  vcptoolbox_source_modified = $false
  writes_outside_workspace = $false
  output_file_written = $false
  parameters_summary = [ordered]@{
    vcpchat_root_supplied = -not [string]::IsNullOrWhiteSpace($VcpChatRoot)
    expected_head_supplied = -not [string]::IsNullOrWhiteSpace($ExpectedHead)
    expected_head_format_valid = Test-ShortHash -Value $ExpectedHead
    remote_debug_port = $RemoteDebugPort
    output_json_requested = -not [string]::IsNullOrWhiteSpace($OutputJson)
  }
  blocked_reason_cn = "v7.43 creation-phase script only emits a sanitized dry-run summary; it does not launch VCPChat, access CDP, call bridge methods, or read or modify VCPChat/VCPToolBox."
  sanitized_audit_summary_cn = "This output does not include raw local paths, CDP endpoints, source, secrets, tokens, cookies, passwords, config.env values, or customer data."
  warnings = $warnings.ToArray()
}

$result | ConvertTo-Json -Depth 8

if ($Execute) {
  exit 2
}

exit 0
