#!/usr/bin/env bash
# ====================================================================
# MindSprint AI - Script dung Self-Host tren Laptop (Bash)
# Issues: #105, #111, #116
# ====================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Dung cac container MindSprint Self-Host..."
docker compose -f docker-compose.selfhost.yml down
echo "Cac container da dung. Volume duoc giu nguyen de bao toan du lieu."
