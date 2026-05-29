# Secret-safe VCPToolBox admin auth preflight.
# Does not read .env/config.env/PM2 env, print env values, print Authorization,
# call providers/plugins/image APIs, write files, commit, or push.

[CmdletBinding()]
param(
  [string]$BaseUrl = "",
  [string]$AuthPath = "/admin_api/check-auth",
  [ValidateRange(1, 60)]
  [int]$TimeoutSec = 10,
  [switch]$PromptForBasicAuthB64
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-FirstProcessEnvValue {
  param([string[]]$Names)

  foreach ($name in $Names) {
    $value = [Environment]::GetEnvironmentVariable($name, "Process")
    if (-not [string]::IsNullOrWhiteSpace($value)) {
      return $value
    }
  }

  return $null
}

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

function Invoke-AuthCheck {
  param(
    [string]$Uri,
    [string]$AuthorizationHeader,
    [int]$TimeoutSeconds
  )

  $headers = @{ Authorization = $AuthorizationHeader }
  try {
    $response = Invoke-WebRequest `
      -Uri $Uri `
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

    throw
  }
}

$authVarNames = @(
  "VCPTOOLBOX_ADMIN_BASIC_AUTH_B64",
  "VCP_TOOLBOX_ADMIN_BASIC_AUTH_B64",
  "ADMIN_BASIC_AUTH_B64",
  "BASIC_AUTH_B64"
)

$baseUrlValue = $BaseUrl
if ([string]::IsNullOrWhiteSpace($baseUrlValue)) {
  $baseUrlValue = Get-FirstProcessEnvValue -Names @(
    "VCPTOOLBOX_ADMIN_BASE_URL",
    "VCP_TOOLBOX_ADMIN_BASE_URL"
  )
}
if ([string]::IsNullOrWhiteSpace($baseUrlValue)) {
  $baseUrlValue = "http://127.0.0.1:6006"
}

$basicAuthB64 = Get-FirstProcessEnvValue -Names $authVarNames
if ([string]::IsNullOrWhiteSpace($basicAuthB64) -and $PromptForBasicAuthB64) {
  $secureInput = Read-Host "Admin Basic Auth B64" -AsSecureString
  $basicAuthB64 = (ConvertFrom-SecureStringToPlainText -Secret $secureInput).Trim()
}

$httpStatus = "not_called"
$safeSummary = "basic auth b64 missing or header not constructible; no request sent"
$authPreflightPassed = $false

if (-not [string]::IsNullOrWhiteSpace($basicAuthB64)) {
  $authHeader = "Basic " + $basicAuthB64
  try {
    $uri = $baseUrlValue.TrimEnd("/") + "/" + $AuthPath.TrimStart("/")
    $httpStatus = Invoke-AuthCheck -Uri $uri -AuthorizationHeader $authHeader -TimeoutSeconds $TimeoutSec

    if ($httpStatus -eq 200) {
      $safeSummary = "check-auth accepted constructed Basic header"
      $authPreflightPassed = $true
    } elseif ($httpStatus -eq 401) {
      $safeSummary = "route_rejected_header"
    } elseif ($httpStatus -eq 404) {
      $safeSummary = "route_not_found"
    } else {
      $safeSummary = "check-auth returned non-200/non-401 status"
    }
  } catch {
    $httpStatus = "request_error"
    $safeSummary = "check-auth request failed without exposing secret material"
  } finally {
    $authHeader = $null
  }
}

$basicAuthB64 = $null

[ordered]@{
  http_status = $httpStatus
  safe_summary = $safeSummary
  auth_preflight_passed = $authPreflightPassed
  ready_for_timeout_smoke = $authPreflightPassed
} | ConvertTo-Json -Compress
