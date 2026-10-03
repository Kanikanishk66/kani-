<#
.SYNOPSIS
  Starts the authenticated Kani Vision Studio application.
.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\server.ps1
#>

param(
  [int]$Port = 8787,
  [string]$Path = $PSScriptRoot
)

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Write-Error "Node.js 24 or newer is required. Install Node.js, then run this command again."
  exit 1
}

$nodeMajor = [int](& node -p "Number(process.versions.node.split('.')[0])")
if ($nodeMajor -lt 24) {
  Write-Error "Node.js 24 or newer is required. Current version: $(& node --version)"
  exit 1
}

& node -e "process.chdir(process.argv[1]); require.resolve('qrcode')" $Path 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Error "Application dependencies are missing. From this folder, run: npm.cmd install"
  exit 1
}

if (-not (Test-Path (Join-Path $Path "server.js") -PathType Leaf)) {
  Write-Error "The application server was not found at $Path."
  exit 1
}

Push-Location $Path
try {
  $env:PORT = "$Port"
  Write-Host "Starting the authenticated Kani Vision Studio platform..." -ForegroundColor Green
  Write-Host "Open http://127.0.0.1:$Port/ for the private sign-in screen." -ForegroundColor Cyan
  Write-Host "Press Ctrl+C to stop the server." -ForegroundColor DarkGray
  & node .\server.js
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
} finally {
  Pop-Location
}
