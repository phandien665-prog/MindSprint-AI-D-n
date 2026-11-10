# ====================================================================
# MindSprint AI - Script khoi dong Self-Host tren Laptop (PowerShell)
# Issues: #105, #112, #116, #118
# ====================================================================

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "=== Khoi dong MindSprint AI Self-Host ===" -ForegroundColor Cyan

# 1. Kiem tra tep cau hinh .env.selfhost
$EnvFile = Join-Path $Root ".env.selfhost"
$ExampleFile = Join-Path $Root ".env.selfhost.example"

if (-not (Test-Path $EnvFile)) {
    if (Test-Path $ExampleFile) {
        Write-Host "Tao .env.selfhost tu .env.selfhost.example..." -ForegroundColor Yellow
        Copy-Item $ExampleFile $EnvFile
    } else {
        Write-Error "Khong tim thay .env.selfhost.example!"
        exit 1
    }
}

# 2. Kiem tra Docker
try {
    $null = docker --version
} catch {
    Write-Error "Docker chua duoc cai dat hoac chua duoc them vao PATH! Vui long bat Docker Desktop."
    exit 1
}

# 3. Build va khoi dong container
Write-Host "Build va chay Docker Compose..." -ForegroundColor Cyan
docker compose -f docker-compose.selfhost.yml --env-file .env.selfhost up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Khoi dong Docker Compose that bai."
    exit $LASTEXITCODE
}

# 4. Cho den khi web va database san sang (Readiness check)
Write-Host "Cho service san sang tai http://127.0.0.1:8080/readyz..." -ForegroundColor Yellow
$MaxAttempts = 30
$Ready = $false

for ($i = 1; $i -le $MaxAttempts; $i++) {
    try {
        $res = Invoke-RestMethod -Uri "http://127.0.0.1:8080/readyz" -TimeoutSec 3 -ErrorAction Stop
        if ($res.status -eq "ready") {
            $Ready = $true
            break
        }
    } catch {
        # Cho khoi dong
    }
    Start-Sleep -Seconds 2
    Write-Host "." -NoNewline
}
Write-Host ""

if ($Ready) {
    Write-Host "=== Self-Host da san sang tai http://127.0.0.1:8080 ===" -ForegroundColor Green
    Write-Host "Frontend & API cung origin: http://127.0.0.1:8080" -ForegroundColor Green
    Write-Host "Liveness check:  http://127.0.0.1:8080/healthz" -ForegroundColor Green
    Write-Host "Readiness check: http://127.0.0.1:8080/readyz" -ForegroundColor Green
} else {
    Write-Warning "Web service chua bao ready sau $($MaxAttempts * 2) giay. Kiem tra log: docker compose -f docker-compose.selfhost.yml logs"
}
