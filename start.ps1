# Requires: PowerShell 5+ on Windows
# One-touch starter for Offline AI Chat (Windows)
# - Installs Python deps
# - Starts Ollama (if needed) and pulls tinyllama (if missing)
# - Launches Flask on http://127.0.0.1:5000

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[*] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[!] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[x] $msg" -ForegroundColor Red }

# Move to script directory
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $PSScriptRoot

# 1) Python deps
if (Test-Path 'backend/requirements.txt') {
    Write-Info "Installing Python dependencies..."
    python -m pip install --upgrade pip | Out-Null
    python -m pip install --no-cache-dir -r 'backend/requirements.txt'
}

# 2) Ensure Ollama is running
$ollamaVersionUrl = 'http://127.0.0.1:11434/api/version'
$ollamaTagsUrl = 'http://127.0.0.1:11434/api/tags'

function Test-Ollama {
    try {
        $r = Invoke-RestMethod -Uri $ollamaVersionUrl -TimeoutSec 2 -Method GET
        return $true
    } catch { return $false }
}

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    Write-Warn "Ollama CLI not found. Install from https://ollama.com/download/windows, then re-run this script."
} else {
    if (-not (Test-Ollama)) {
        Write-Warn "Starting Ollama service..."
        Start-Process -WindowStyle Hidden -FilePath ollama -ArgumentList 'serve' | Out-Null
        Start-Sleep -Seconds 2
        # wait up to ~15s
        for ($i=0; $i -lt 15; $i++) {
            if (Test-Ollama) { break }
            Start-Sleep -Seconds 1
        }
    }

    try {
        $tags = Invoke-RestMethod -Uri $ollamaTagsUrl -TimeoutSec 5 -Method GET
        $hasTiny = $false
        if ($tags -and $tags.models) {
            foreach ($m in $tags.models) { if ($m.name -match 'tinyllama') { $hasTiny = $true; break } }
        }
        if (-not $hasTiny) {
            Write-Warn "Pulling tinyllama (first time only)..."
            & ollama pull tinyllama
        }
    } catch {
        Write-Warn "Could not query/pull models: $_"
    }
}

# 3) Start Flask
$env:FLASK_HOST = '127.0.0.1'
$env:FLASK_PORT = '5000'
$env:OLLAMA_HOST = '127.0.0.1'
$env:OLLAMA_PORT = '11434'
if (-not $env:SAVE_DIR -or $env:SAVE_DIR -eq '') {
    $env:SAVE_DIR = Join-Path $PSScriptRoot 'saves'
}

Write-Info "Saving chats to: $($env:SAVE_DIR)"
Write-Info "Starting Flask on http://$($env:FLASK_HOST):$($env:FLASK_PORT)"
python -m flask --app backend.app run --host $env:FLASK_HOST --port $env:FLASK_PORT
