#!/bin/bash

# PostToolUse hook: Auto-run tests after writing to my-work/
# Receives JSON on stdin with tool_name and tool_input

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only run tests if file is in week-*/my-work/
if [[ ! "$FILE_PATH" =~ week-[0-9]+/my-work/ ]]; then
  exit 0
fi

# Extract week directory name (e.g., "week-00")
WEEK_DIR=$(echo "$FILE_PATH" | grep -o 'week-[0-9]\+')

if [ -z "$WEEK_DIR" ]; then
  exit 0
fi

# Run tests for this week
cd "$CLAUDE_PROJECT_DIR/$WEEK_DIR" 2>/dev/null || exit 0
npm test 2>&1 | tail -10
