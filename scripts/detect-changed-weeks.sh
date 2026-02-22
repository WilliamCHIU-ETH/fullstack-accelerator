#!/usr/bin/env bash
set -euo pipefail

# Changed Weeks Detector — 輸出 JSON array 給 GitHub Actions matrix
# 用法：WEEKS=$(bash scripts/detect-changed-weeks.sh)

if [ -n "${GITHUB_BASE_REF:-}" ]; then
  git fetch origin "$GITHUB_BASE_REF" --depth=1 2>/dev/null || true
  CHANGED_FILES=$(git diff --name-only "origin/$GITHUB_BASE_REF"...HEAD)
elif [ -n "${GITHUB_SHA:-}" ]; then
  CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")
else
  CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")
fi

# 提取不重複的 week-XX 目錄名
CHANGED_WEEKS=$(echo "$CHANGED_FILES" | grep -oE "^week-[0-9]+" | sort -u || true)

if [ -z "$CHANGED_WEEKS" ]; then
  echo "[]"
else
  # 轉成 JSON array：["week-00", "week-01"]
  JSON="["
  FIRST=true
  while IFS= read -r week; do
    if [ "$FIRST" = true ]; then
      FIRST=false
    else
      JSON="${JSON},"
    fi
    JSON="${JSON}\"${week}\""
  done <<< "$CHANGED_WEEKS"
  JSON="${JSON}]"
  echo "$JSON"
fi
