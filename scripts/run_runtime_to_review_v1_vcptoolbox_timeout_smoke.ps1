# Secret-safe one-shot timeout smoke through the VCPToolBox admin server.
# Prompts for Basic Auth B64, injects it only into the child Node process,
# and does not print env values or Authorization headers.

[CmdletBinding()]
param(
  [ValidateRange(1, 60)]
  [int]$PreflightTimeoutSec = 10
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function ConvertFrom-SecureStringToPlainText {
  param([securestring]$Secret)

  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secret)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  } finally {
    if ($bstr -ne [IntPtr]::Zero) {
      [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
  }
}

function Invoke-AuthPreflight {
  param(
    [string]$BasicAuthB64,
    [int]$TimeoutSeconds
  )

  $headers = @{ Authorization = "Basic $BasicAuthB64" }
  try {
    $response = Invoke-WebRequest `
      -Uri "http://127.0.0.1:6006/admin_api/check-auth" `
      -Method Get `
      -Headers $headers `
      -TimeoutSec $TimeoutSeconds `
      -UseBasicParsing

    return [int]$response.StatusCode
  } catch {
    $response = $_.Exception.Response
    if ($response -and $response.StatusCode) {
      return [int]$response.StatusCode
    }

    return "request_error"
  }
}

$secureInput = Read-Host "Admin Basic Auth B64" -AsSecureString
$basicAuthB64 = (ConvertFrom-SecureStringToPlainText -Secret $secureInput).Trim()

$preflightStatus = Invoke-AuthPreflight -BasicAuthB64 $basicAuthB64 -TimeoutSeconds $PreflightTimeoutSec
if ($preflightStatus -ne 200) {
  $summary = if ($preflightStatus -eq 401) {
    "route_rejected_header"
  } elseif ($preflightStatus -eq 404) {
    "route_not_found"
  } else {
    "check-auth preflight failed before timeout smoke"
  }

  $basicAuthB64 = $null
  [ordered]@{
    timeout_smoke_started = $false
    http_status = $preflightStatus
    safe_summary = $summary
    auth_preflight_passed = $false
    ready_for_timeout_smoke = $false
  } | ConvertTo-Json -Compress
  exit 2
}

$previousAuth = [Environment]::GetEnvironmentVariable("AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64", "Process")
try {
  [Environment]::SetEnvironmentVariable("AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64", $basicAuthB64, "Process")
  $basicAuthB64 = $null

  node scripts/run_runtime_to_review_v1_guarded_live_probe.js `
    --provider-delegate-module adapters/runtime/native_doubao_runtime_v1_provider_delegate.js `
    --owner-runtime-module adapters/runtime/native_doubao_runtime_v1_vcptoolbox_route_owner_runtime.js `
    --confirm-live-provider-probe RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE `
    --max-images 1
} finally {
  if ($null -eq $previousAuth) {
    [Environment]::SetEnvironmentVariable("AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64", $null, "Process")
  } else {
    [Environment]::SetEnvironmentVariable("AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64", $previousAuth, "Process")
  }
}
