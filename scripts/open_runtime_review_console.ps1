param(
  [switch]$PrintOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function ConvertFrom-Base64Utf8 {
  param([Parameter(Mandatory = $true)][string]$Value)
  return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($Value))
}

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$ConsolePath = Join-Path $ProjectRoot 'review_console\runtime_prototype\index.html'

if (-not (Test-Path -LiteralPath $ConsolePath -PathType Leaf)) {
  throw "$(ConvertFrom-Base64Utf8 '5om+5LiN5Yiw6K+E5a6h5Y+w5YWl5Y+j77ya')$ConsolePath"
}

Write-Host "$(ConvertFrom-Base64Utf8 '6K+E5a6h5Y+w5YWl5Y+j77ya')$ConsolePath"
Write-Host (ConvertFrom-Base64Utf8 '5a6J5YWo6L6555WM77ya5Y+q5omT5byA5pys5ZywIEhUTUzvvIzkuI3osIPnlKggVkNQ44CB5o+S5Lu244CBQVBJ44CBRGFpbHlOb3Rl77yM5Lmf5LiN5YaZ5YWl6K6w5b+G44CC')

if (-not $PrintOnly) {
  Start-Process -FilePath $ConsolePath
}
