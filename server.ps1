<#
.SYNOPSIS
  Lightweight local static HTTP development server for Kani Vision Studio.
  No external dependencies required (uses built-in .NET HttpListener).
.EXAMPLE
  .\server.ps1 -Port 8080
#>

param(
  [int]$Port = 8080,
  [string]$Path = $PSScriptRoot
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
  $listener.Start()
  Write-Host "==========================================================" -ForegroundColor Cyan
  Write-Host "  KANI VISION STUDIO - LOCAL DEVELOPMENT SERVER" -ForegroundColor Green
  Write-Host "==========================================================" -ForegroundColor Cyan
  Write-Host "  URL: http://localhost:$Port/" -ForegroundColor Yellow
  Write-Host "  Root: $Path" -ForegroundColor Gray
  Write-Host "  Press Ctrl+C to terminate the server." -ForegroundColor DarkGray
  Write-Host "==========================================================" -ForegroundColor Cyan

  Start-Process "http://localhost:$Port/"

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = $request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($urlPath)) {
      $urlPath = "index.html"
    }

    $filePath = Join-Path $Path $urlPath

    if (Test-Path $filePath -PathType Leaf) {
      $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
      $contentType = switch ($extension) {
        ".html" { "text/html; charset=utf-8" }
        ".css"  { "text/css; charset=utf-8" }
        ".js"   { "application/javascript; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".svg"  { "image/svg+xml" }
        ".png"  { "image/png" }
        ".jpg"  { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".webp" { "image/webp" }
        ".ico"  { "image/x-icon" }
        default { "application/octet-stream" }
      }

      $response.ContentType = $contentType
      $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $notFoundPage = Join-Path $Path "404.html"
      if (Test-Path $notFoundPage) {
        $bytes = [System.IO.File]::ReadAllBytes($notFoundPage)
        $response.ContentType = "text/html; charset=utf-8"
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.OutputStream.Write($msg, 0, $msg.Length)
      }
    }

    $response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
