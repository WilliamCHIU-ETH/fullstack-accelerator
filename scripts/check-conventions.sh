#!/usr/bin/env bash
set -euo pipefail

# Convention Checker — 檢查專案慣例是否被遵守
# 用法：在 CI 或本地執行 bash scripts/check-conventions.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo "📐 Checking project conventions..."

VIOLATIONS=0

# ── 取得變更檔案清單 ──────────────────────────────
if [ -n "${GITHUB_BASE_REF:-}" ]; then
  git fetch origin "$GITHUB_BASE_REF" --depth=1 2>/dev/null || true
  CHANGED_FILES=$(git diff --name-only "origin/$GITHUB_BASE_REF"...HEAD)
elif [ -n "${GITHUB_SHA:-}" ]; then
  CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")
else
  CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")
fi

# ── Check 1：每個 week package.json 必須有 "type": "module" ──
echo "  Checking ES Module configuration..."
for week_pkg in week-*/package.json; do
  if [ -f "$week_pkg" ]; then
    if ! grep -q '"type"' "$week_pkg"; then
      echo -e "${RED}❌ Missing \"type\": \"module\" in ${week_pkg}${NC}"
      VIOLATIONS=$((VIOLATIONS + 1))
    fi
  fi
done

# ── Check 2：受保護腳本不可修改 ──────────────────
echo "  Checking protected scripts..."
PROTECTED_CHANGES=$(echo "$CHANGED_FILES" | grep -E "(walk\.sh|scripts/verify-env\.sh)" || true)
if [ -n "$PROTECTED_CHANGES" ]; then
  echo -e "${RED}❌ Protected scripts modified:${NC}"
  echo "$PROTECTED_CHANGES" | sed 's/^/     - /'
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# ── Check 3：學生不應修改 tests/ 或 complete/ ────
echo "  Checking forbidden directories..."
TEST_CHANGES=$(echo "$CHANGED_FILES" | grep -E "^week-[0-9]+/tests/" || true)
COMPLETE_CHANGES=$(echo "$CHANGED_FILES" | grep -E "^week-[0-9]+/complete/" || true)

if [ -n "$TEST_CHANGES" ]; then
  echo -e "${YELLOW}⚠️  Test files modified (should only be done by instructors):${NC}"
  echo "$TEST_CHANGES" | sed 's/^/     - /'
  # Warning only — instructors may legitimately modify tests
fi

if [ -n "$COMPLETE_CHANGES" ]; then
  echo -e "${YELLOW}⚠️  Complete directory modified:${NC}"
  echo "$COMPLETE_CHANGES" | sed 's/^/     - /'
fi

# ── 結果 ─────────────────────────────────────────
if [ "$VIOLATIONS" -gt 0 ]; then
  echo -e "${RED}🚫 Found ${VIOLATIONS} convention violation(s)${NC}"
  exit 1
else
  echo -e "${GREEN}✅ All conventions followed${NC}"
fi
