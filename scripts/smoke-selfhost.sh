#!/usr/bin/env bash
# ====================================================================
# MindSprint AI - Smoke Test Self-Host tren Laptop (Bash)
# Issues: #105, #107, #108, #109, #112
# ====================================================================
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:8080}"
PASSED=0
FAILED=0

assert_test() {
  local cond="$1"
  local desc="$2"
  if [ "$cond" -eq 0 ]; then
    echo "  [PASS] $desc"
    PASSED=$((PASSED + 1))
  else
    echo "  [FAIL] $desc"
    FAILED=$((FAILED + 1))
  fi
}

echo "=== Bat dau Smoke Test tren $BASE_URL ==="

# 1. /healthz
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/healthz" || echo "000")
[ "$status_code" = "200" ] && c=0 || c=1
assert_test $c "Liveness check /healthz tra ve ma 200"

# 2. /readyz
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/readyz" || echo "000")
[ "$status_code" = "200" ] && c=0 || c=1
assert_test $c "Readiness check /readyz tra ve ma 200"

# 3. Frontend root (/)
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/" || echo "000")
[ "$status_code" = "200" ] && c=0 || c=1
assert_test $c "Frontend root (/) tra ve ma 200"

# 4. JavaScript /api.js
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api.js" || echo "000")
[ "$status_code" = "200" ] && c=0 || c=1
assert_test $c "Asset /api.js tra ve ma 200"

# 5. CSS /style.css
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/style.css" || echo "000")
[ "$status_code" = "200" ] && c=0 || c=1
assert_test $c "Asset /style.css tra ve ma 200"

# 6. Invalid API route returns 404
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/nonexistent-route-for-testing" || echo "000")
[ "$status_code" = "404" ] && c=0 || c=1
assert_test $c "API route khong ton tai tra ve ma 404"

# 7. Protected route returns 401
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/flashcards" || echo "000")
[ "$status_code" = "401" ] && c=0 || c=1
assert_test $c "API /api/flashcards bao ve Auth tra ve ma 401"

echo "-------------------------------------------"
echo "Ket qua: $PASSED pass, $FAILED fail"
if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
