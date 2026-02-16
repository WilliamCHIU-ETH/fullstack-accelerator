#!/usr/bin/env bash
set -euo pipefail

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

pass=0
fail=0
optional_fail=0

detect_os() {
  case "$(uname -s)" in
    Darwin*) echo "macos" ;;
    Linux*)
      if grep -qi microsoft /proc/version 2>/dev/null; then
        echo "wsl"
      else
        echo "linux"
      fi
      ;;
    *) echo "unknown" ;;
  esac
}

OS=$(detect_os)

check_pass() {
  echo -e "  ${GREEN}[✓]${NC} $1"
  pass=$((pass + 1))
}

check_fail() {
  echo -e "  ${RED}[✗]${NC} $1"
  fail=$((fail + 1))
}

check_optional() {
  echo -e "  ${YELLOW}[○]${NC} $1"
  optional_fail=$((optional_fail + 1))
}

install_hint() {
  echo ""
  echo -e "    ${BOLD}安裝方式：${NC}"
  case "$OS" in
    macos)
      echo "    $1"
      ;;
    linux)
      echo "    $2"
      ;;
    wsl)
      echo "    $3"
      ;;
    *)
      echo "    請參考官方文件安裝"
      ;;
  esac
  echo ""
}

echo ""
echo -e "${BOLD}🔍 檢查開發環境...${NC}"
echo ""

# --- Node.js ---
if command -v node &>/dev/null; then
  NODE_VERSION=$(node -v)
  NODE_MAJOR=$(echo "$NODE_VERSION" | sed 's/v\([0-9]*\).*/\1/')
  if [[ "$NODE_MAJOR" -ge 20 ]]; then
    check_pass "Node.js $NODE_VERSION"
  else
    check_fail "Node.js $NODE_VERSION（需要 v20 以上）"
    install_hint \
      "brew install node@20  或  nvm install 20" \
      "nvm install 20  （先安裝 nvm: https://github.com/nvm-sh/nvm）" \
      "nvm install 20  （先安裝 nvm: https://github.com/nvm-sh/nvm）"
  fi
else
  check_fail "Node.js 未找到"
  install_hint \
    "brew install node@20  或  安裝 nvm: https://github.com/nvm-sh/nvm" \
    "安裝 nvm: https://github.com/nvm-sh/nvm → nvm install 20" \
    "安裝 nvm: https://github.com/nvm-sh/nvm → nvm install 20"
fi

# --- npm ---
if command -v npm &>/dev/null; then
  NPM_VERSION=$(npm -v)
  NPM_MAJOR=$(echo "$NPM_VERSION" | sed 's/\([0-9]*\).*/\1/')
  if [[ "$NPM_MAJOR" -ge 10 ]]; then
    check_pass "npm v$NPM_VERSION"
  else
    check_fail "npm v$NPM_VERSION（需要 v10 以上）"
    install_hint \
      "npm 隨 Node.js 安裝，請更新 Node.js" \
      "npm 隨 Node.js 安裝，請更新 Node.js" \
      "npm 隨 Node.js 安裝，請更新 Node.js"
  fi
else
  check_fail "npm 未找到"
  install_hint \
    "npm 隨 Node.js 安裝，請先安裝 Node.js" \
    "npm 隨 Node.js 安裝，請先安裝 Node.js" \
    "npm 隨 Node.js 安裝，請先安裝 Node.js"
fi

# --- Git ---
if command -v git &>/dev/null; then
  GIT_VERSION=$(git --version | sed 's/git version //')
  GIT_MAJOR=$(echo "$GIT_VERSION" | sed 's/\([0-9]*\).*/\1/')
  if [[ "$GIT_MAJOR" -ge 2 ]]; then
    check_pass "Git v$GIT_VERSION"
  else
    check_fail "Git v$GIT_VERSION（需要 v2 以上）"
    install_hint \
      "brew install git" \
      "sudo apt-get install git" \
      "sudo apt-get install git"
  fi
else
  check_fail "Git 未找到"
  install_hint \
    "brew install git  或  xcode-select --install" \
    "sudo apt-get install git" \
    "sudo apt-get install git"
fi

# --- Claude Code CLI ---
if command -v claude &>/dev/null; then
  CLAUDE_VERSION=$(claude -v 2>/dev/null || echo "已安裝")
  check_pass "Claude Code CLI $CLAUDE_VERSION"
else
  check_fail "Claude Code CLI 未找到"
  install_hint \
    "npm install -g @anthropic-ai/claude-code" \
    "npm install -g @anthropic-ai/claude-code" \
    "npm install -g @anthropic-ai/claude-code"
fi

# --- VS Code (optional) ---
if command -v code &>/dev/null; then
  VSCODE_VERSION=$(code -v 2>/dev/null | head -1 || echo "已安裝")
  check_optional "VS Code v$VSCODE_VERSION（選用，已安裝）"
else
  check_optional "VS Code 未安裝（選用，不影響課程）"
  echo -e "    下載：https://code.visualstudio.com/"
  echo ""
fi

# --- Summary ---
echo ""
if [[ "$fail" -eq 0 ]]; then
  echo -e "${GREEN}${BOLD}✅ 環境就緒！你可以開始 Week 0 了。${NC}"
else
  echo -e "${RED}${BOLD}💡 有 ${fail} 個項目需要安裝。請依照上方指示操作。${NC}"
  echo -e "   安裝完成後，重新執行此腳本確認："
  echo -e "   ${BOLD}./scripts/verify-env.sh${NC}"
fi
echo ""
