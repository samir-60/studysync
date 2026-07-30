# StudySync AI - PowerShell HTTP Server
# Serves the current directory on http://localhost:3000

$port = 3000
$root = $PSScriptRoot
$url  = "http://localhost:$port/"

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.woff2'= 'font/woff2'
    '.woff' = 'font/woff'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host ""
Write-Host "  ==========================================" -ForegroundColor Cyan
Write-Host "   StudySync AI - Local HTTP Server" -ForegroundColor Yellow
Write-Host "  ==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Running at: http://localhost:$port/" -ForegroundColor Green
Write-Host "  Root dir  : $root" -ForegroundColor Gray
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Open browser automatically
Start-Process "http://localhost:$port/"

while ($listener.IsListening) {
    try {
        $context  = $listener.GetContext()
        $request  = $context.Request
        $response = $context.Response

        $rawPath  = $request.Url.AbsolutePath
        $filePath = Join-Path $root ($rawPath.TrimStart('/').Replace('/', '\'))

        # Default to index.html for root
        if ($rawPath -eq '/' -or $rawPath -eq '') {
            $filePath = Join-Path $root 'index.html'
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext  = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { 'application/octet-stream' }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType   = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode    = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)

            Write-Host "  200 $rawPath" -ForegroundColor Green
        } else {
            $body  = [System.Text.Encoding]::UTF8.GetBytes("<h2>404 Not Found: $rawPath</h2>")
            $response.StatusCode    = 404
            $response.ContentType   = 'text/html'
            $response.ContentLength64 = $body.Length
            $response.OutputStream.Write($body, 0, $body.Length)

            Write-Host "  404 $rawPath" -ForegroundColor Red
        }

        $response.OutputStream.Close()
    } catch {
        # Graceful exit on Ctrl+C
        if ($listener.IsListening) {
            Write-Host "  Error: $_" -ForegroundColor Red
        }
    }
}

$listener.Stop()
Write-Host "`n  Server stopped." -ForegroundColor Yellow
