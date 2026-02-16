#!/usr/bin/env bash
set -euo pipefail

# Configuration
WEEK="w00"
REPO_ROOT=$(git -C "$(dirname "$0")" rev-parse --show-toplevel 2>/dev/null)
REF_DIR="$REPO_ROOT/.ref"
STEPS=("step-01" "step-02" "step-03" "step-04" "step-05" "challenge")
STEP_TITLES=(
  "Hello Player — 基本 I/O"
  "The Secret Number — 隨機數 + 比較"
  "Keep Guessing — 迴圈"
  "Playing It Safe — 驗證 + 限制"
  "Final Polish — 遊戲體驗優化"
  "Challenge — 難度選擇"
)

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

ensure_branches() {
  echo -e "${DIM}正在取得參考 code...${NC}"
  # Fetch w00/* branches from remote if remote exists
  if git -C "$REPO_ROOT" remote | grep -q origin 2>/dev/null; then
    git -C "$REPO_ROOT" fetch origin "${WEEK}/*:refs/remotes/origin/${WEEK}/*" 2>/dev/null || true
    # Create local tracking branches
    for step in "${STEPS[@]}"; do
      local branch="${WEEK}/${step}"
      if git -C "$REPO_ROOT" show-ref --verify --quiet "refs/remotes/origin/${branch}" 2>/dev/null; then
        if ! git -C "$REPO_ROOT" show-ref --verify --quiet "refs/heads/${branch}" 2>/dev/null; then
          git -C "$REPO_ROOT" branch "${branch}" "origin/${branch}" 2>/dev/null || true
        fi
      fi
    done
  fi
}

step_index() {
  local input="$1"
  # Accept: 1, 01, step-01, challenge
  if [[ "$input" == "challenge" ]]; then
    echo 5
    return
  fi
  # Strip leading zeros and "step-" prefix
  local num="${input#step-}"
  num="${num#0}"
  if [[ -z "$num" ]]; then num=0; fi
  if [[ "$num" -ge 1 && "$num" -le 5 ]]; then
    echo $((num - 1))
  elif [[ "$num" -eq 6 ]]; then
    echo 5
  else
    echo -1
  fi
}

branch_name() {
  local idx="$1"
  echo "${WEEK}/${STEPS[$idx]}"
}

branch_exists() {
  local branch="$1"
  git -C "$REPO_ROOT" show-ref --verify --quiet "refs/heads/${branch}" 2>/dev/null
}

cmd_list() {
  ensure_branches
  echo ""
  echo -e "${BOLD}Week 0 — 猜數字遊戲 Steps${NC}"
  echo ""
  for i in "${!STEPS[@]}"; do
    local branch
    branch=$(branch_name "$i")
    local num=$((i + 1))
    if [[ "$i" -eq 5 ]]; then
      local label="C"
    else
      local label="$num"
    fi
    if branch_exists "$branch"; then
      echo -e "  ${GREEN}[$label]${NC} ${STEP_TITLES[$i]}"
    else
      echo -e "  ${DIM}[$label] ${STEP_TITLES[$i]}（branch 不存在）${NC}"
    fi
  done
  echo ""
  echo -e "${DIM}使用方式：./walk.sh look <N>  |  ./walk.sh diff <N> <M>  |  ./walk.sh clean${NC}"
  echo ""
}

cmd_look() {
  local input="${1:-}"
  if [[ -z "$input" ]]; then
    echo "用法：./walk.sh look <step-number>"
    echo "範例：./walk.sh look 1"
    exit 1
  fi

  ensure_branches

  local idx
  idx=$(step_index "$input")
  if [[ "$idx" -eq -1 ]]; then
    echo "無效的 step：$input"
    exit 1
  fi

  local branch
  branch=$(branch_name "$idx")

  if ! branch_exists "$branch"; then
    echo "Branch $branch 不存在。請確認已正確設定。"
    exit 1
  fi

  # Show STEP.md first (Before You Look)
  local step_md
  step_md=$(git -C "$REPO_ROOT" show "${branch}:STEP.md" 2>/dev/null || echo "")

  if [[ -n "$step_md" ]]; then
    # Extract Before You Look section
    local before_section
    before_section=$(echo "$step_md" | sed -n '/## Before You Look/,/^## /p' | head -n -1)
    if [[ -n "$before_section" ]]; then
      echo ""
      echo -e "${YELLOW}${BOLD}⚠️  先想一想再看 code！${NC}"
      echo ""
      echo "$before_section"
      echo ""
      echo -e "${DIM}───────────────────────────────────────${NC}"
      read -rp "準備好了嗎？按 Enter 查看 code..."
      echo ""
    fi
  fi

  # Expand to .ref/ using worktree
  local worktree_dir="$REF_DIR/${STEPS[$idx]}"

  # Clean existing worktree if present
  if [[ -d "$worktree_dir" ]]; then
    git -C "$REPO_ROOT" worktree remove "$worktree_dir" --force 2>/dev/null || rm -rf "$worktree_dir"
  fi

  mkdir -p "$REF_DIR"
  git -C "$REPO_ROOT" worktree add "$worktree_dir" "$branch" 2>/dev/null

  echo -e "${CYAN}${BOLD}Step ${STEPS[$idx]}：${STEP_TITLES[$idx]}${NC}"
  echo ""

  # Show STEP.md fully
  if [[ -f "$worktree_dir/STEP.md" ]]; then
    cat "$worktree_dir/STEP.md"
    echo ""
    echo -e "${DIM}───────────────────────────────────────${NC}"
    echo ""
  fi

  # Show game.js
  if [[ -f "$worktree_dir/game.js" ]]; then
    echo -e "${BOLD}game.js：${NC}"
    echo ""
    cat -n "$worktree_dir/game.js"
  fi

  echo ""
  echo -e "${DIM}參考 code 已展開到：.ref/${STEPS[$idx]}/${NC}"
  echo ""
}

cmd_diff() {
  local from="${1:-}"
  local to="${2:-}"

  if [[ -z "$from" || -z "$to" ]]; then
    echo "用法：./walk.sh diff <step-from> <step-to>"
    echo "範例：./walk.sh diff 1 2"
    exit 1
  fi

  ensure_branches

  local idx_from idx_to
  idx_from=$(step_index "$from")
  idx_to=$(step_index "$to")

  if [[ "$idx_from" -eq -1 || "$idx_to" -eq -1 ]]; then
    echo "無效的 step 編號"
    exit 1
  fi

  local branch_from branch_to
  branch_from=$(branch_name "$idx_from")
  branch_to=$(branch_name "$idx_to")

  if ! branch_exists "$branch_from" || ! branch_exists "$branch_to"; then
    echo "一個或多個 branch 不存在"
    exit 1
  fi

  echo ""
  echo -e "${BOLD}Diff: ${STEPS[$idx_from]} → ${STEPS[$idx_to]}${NC}"
  echo ""
  git -C "$REPO_ROOT" diff "${branch_from}" "${branch_to}" -- game.js || true
  echo ""
}

cmd_clean() {
  if [[ -d "$REF_DIR" ]]; then
    # Remove all worktrees under .ref/
    for step in "${STEPS[@]}"; do
      local wt="$REF_DIR/$step"
      if [[ -d "$wt" ]]; then
        git -C "$REPO_ROOT" worktree remove "$wt" --force 2>/dev/null || rm -rf "$wt"
      fi
    done
    rm -rf "$REF_DIR"
    echo "已清除參考 code。"
  else
    echo "沒有需要清除的參考 code。"
  fi
}

# --- Main ---
CMD="${1:-}"
shift || true

case "$CMD" in
  list)   cmd_list ;;
  look)   cmd_look "$@" ;;
  diff)   cmd_diff "$@" ;;
  clean)  cmd_clean ;;
  *)
    echo ""
    echo -e "${BOLD}Walk.sh — Step Walker${NC}"
    echo ""
    echo "用法："
    echo "  ./walk.sh list          列出所有步驟"
    echo "  ./walk.sh look <N>      查看第 N 步的參考 code"
    echo "  ./walk.sh diff <N> <M>  比較兩個步驟的差異"
    echo "  ./walk.sh clean         清除展開的參考 code"
    echo ""
    ;;
esac
