# ====================================================================
# MindSprint AI - Smoke Test Self-Host tren Laptop (PowerShell)
# Issues: #105, #107, #108, #109, #112
# ====================================================================

param(
    [string]$BaseUrl = "http://127.0.0.1:8080"
)

$ErrorActionPreference = "Continue"
$Passed = 0
$Failed = 0

function Assert-Test([bool]$Condition, [string]$Message) {
    if ($Condition) {
        Write-Host "  [PASS] $Message" -ForegroundColor Green
        $script:Passed++
    } else {
        Write-Host "  [FAIL] $Message" -ForegroundColor Red
        $script:Failed++
    }
}

Write-Host "=== Bat dau Smoke Test tren $BaseUrl ===" -ForegroundColor Cyan

# 1. Kiem tra Liveness (/healthz)
try {
    $res = Invoke-RestMethod -Uri "$BaseUrl/healthz" -TimeoutSec 5
    Assert-Test ($res.status -eq "ok") "Liveness check /healthz tra ve status ok"
} catch {
    Assert-Test $false "Liveness check /healthz that bai: $_"
}

# 2. Kiem tra Readiness (/readyz)
try {
    $res = Invoke-RestMethod -Uri "$BaseUrl/readyz" -TimeoutSec 5
    Assert-Test ($res.status -eq "ready" -and $res.database -eq "connected") "Readiness check /readyz ket noi database thanh cong"
} catch {
    Assert-Test $false "Readiness check /readyz that bai: $_"
}

# 3. Kiem tra Frontend HTML tai root (/)
try {
    $res = Invoke-WebRequest -Uri "$BaseUrl/" -UseBasicParsing -TimeoutSec 5
    $hasMindSprint = $res.Content -like "*MindSprint*"
    Assert-Test ($res.StatusCode -eq 200 -and $hasMindSprint) "Frontend root (/) tra ve ma 200 va chua MindSprint"
} catch {
    Assert-Test $false "Frontend root (/) that bai: $_"
}

# 4. Kiem tra Asset JavaScript (api.js)
try {
    $res = Invoke-WebRequest -Uri "$BaseUrl/api.js" -UseBasicParsing -TimeoutSec 5
    $isJs = $res.Content -like "*MindSprint API*" -or $res.Content -like "*fetchWithFallback*"
    Assert-Test ($res.StatusCode -eq 200 -and $isJs) "Asset /api.js tra ve ma 200 dung noi dung"
} catch {
    Assert-Test $false "Tai asset /api.js that bai: $_"
}

# 5. Kiem tra Asset CSS (style.css)
try {
    $res = Invoke-WebRequest -Uri "$BaseUrl/style.css" -UseBasicParsing -TimeoutSec 5
    Assert-Test ($res.StatusCode -eq 200 -and $res.Content.Length -gt 100) "Asset /style.css tra ve ma 200"
} catch {
    Assert-Test $false "Tai asset /style.css that bai: $_"
}

# 6. Kiem tra Route API khong ton tai tra ve 404 (khong bien thanh HTML index)
try {
    $res = Invoke-WebRequest -Uri "$BaseUrl/api/nonexistent-route-for-testing" -UseBasicParsing -TimeoutSec 5
    Assert-Test $false "API route khong ton tai phai tra ve 404, nhan ma $($res.StatusCode)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Assert-Test ($statusCode -eq 404) "API route khong ton tai tra ve ma 404 (khong tra ve HTML)"
}

# 7. Kiem tra API Flashcards (yeu cau Auth tra ve 401 chu khong tra ve 404/500/HTML)
try {
    $res = Invoke-WebRequest -Uri "$BaseUrl/api/flashcards" -UseBasicParsing -TimeoutSec 5
    Assert-Test $false "Goi API khong co token phai tra ve 401"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Assert-Test ($statusCode -eq 401) "API /api/flashcards bao ve dung chuan Auth (ma 401)"
}

Write-Host "-------------------------------------------"
Write-Host "Ket qua: $Passed pass, $Failed fail" -ForegroundColor $(if ($Failed -eq 0) { "Green" } else { "Red" })

if ($Failed -gt 0) {
    exit 1
} else {
    exit 0
}
