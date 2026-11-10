# ====================================================================
# MindSprint AI - Script dung Self-Host tren Laptop (PowerShell)
# Issues: #105, #111, #116
# ====================================================================

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "Dung cac container MindSprint Self-Host..." -ForegroundColor Yellow
docker compose -f docker-compose.selfhost.yml down

Write-Host "Cac container da dung. Volume PostgreSQL duoc giu nguyen de bao toan du lieu." -ForegroundColor Green
