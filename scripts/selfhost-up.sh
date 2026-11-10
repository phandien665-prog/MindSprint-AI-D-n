#!/usr/bin/env bash
# ====================================================================
# MindSprint AI - Script khoi dong Self-Host tren Laptop (Bash)
# Issues: #105, #112, #116, #118
# ====================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "=== Khoi dong MindSprint AI Self-Host ==="

if [ ! -f .env.selfhost ]; then
  if [ -f .env.selfhost.example ]; then
    echo "Tao .env.selfhost tu .env.selfhost.example..."
    cp .env.selfhost.example .env.selfhost
  else
    echo "Khong tim thay .env.selfhost.example!" >&2
    exit 1
  fi
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker chua duoc cai dat hoac chua co trong PATH!" >&2
  exit 1
fi

echo "Build va chay Docker Compose..."
docker compose -f docker-compose.selfhost.yml --env-file .env.selfhost up -d --build

echo "Cho service san sang tai http://127.0.0.1:8080/readyz..."
READY=0
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:8080/readyz | grep -q '"ready"'; then
    READY=1
    break
  fi
  sleep 2
  printf "."
done
echo ""

if [ "$READY" -eq 1 ]; then
  echo "=== Self-Host da san sang tai http://127.0.0.1:8080 ==="
else
  echo "Canh bao: Web service chua san sang sau 60s. Kiem tra: docker compose -f docker-compose.selfhost.yml logs" >&2
fi
