#!/usr/bin/env bash
set -euo pipefail

# Lock Guard — 檢查已鎖定週次是否被非法修改
# 用法：在 CI 或本地執行 bash scripts/check-locks.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "🔒 Checking locked weeks..."

# ── 鎖定週次定義 ──────────────────────────────────
# 格式：week-XX
LOCKED_WEEKS=("week-00")

# ── 取得變更檔案清單 ──────────────────────────────
if [ -n "${GITHUB_BASE_REF:-}" ]; then
  # CI 環境（PR）：比較 base branch
  git fetch origin "$GITHUB_BASE_REF" --depth=1 2>/dev/null || true
  CHANGED_FILES=$(git diff --name-only "origin/$GITHUB_BASE_REF"...HEAD)
elif [ -n "${GITHUB_SHA:-}" ]; then
  # CI 環境（push）：比較前一個 commit
  CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")
else
  # 本地：比較前一個 commit
  CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")
fi

VIOLATIONS=0

for week in "${LOCKED_WEEKS[@]}"; do
  # 篩選出修改了鎖定週次的檔案（排除 my-work/）
  LOCKED_CHANGES=$(echo "$CHANGED_FILES" | grep "^${week}/" | grep -v "^${week}/my-work/" || true)

  if [ -n "$LOCKED_CHANGES" ]; then
    echo -e "${RED}❌ Locked week modified: ${week}${NC}"
    echo "   Modified files:"
    echo "$LOCKED_CHANGES" | sed 's/^/     - /'
    echo ""
    echo "   ⚠️  This week is locked. To modify:"
    echo "   1. Get explicit permission in CLAUDE.md"
    echo "   2. Update the lock status after changes"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done

if [ "$VIOLATIONS" -gt 0 ]; then
  echo -e "${RED}🚫 Found ${VIOLATIONS} locked week violation(s)${NC}"
  exit 1
else
  echo -e "${GREEN}✅ No locked weeks modified${NC}"
fi
