#!/bin/bash

# PreToolUse hook: Block writes to locked weeks and test files
# Receives JSON on stdin with tool_name and tool_input

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Block modifications to week-00 (locked)
if [[ "$FILE_PATH" =~ week-00/ ]]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Week-00 is locked. Use unlock procedure in CLAUDE.md first."
    }
  }'
  exit 0
fi

# Block modifications to test files
if [[ "$FILE_PATH" =~ week-[0-9]+/tests/ ]]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Test files are read-only. Do not modify week-XX/tests/."
    }
  }'
  exit 0
fi

# Block modifications to walk.sh
if [[ "$FILE_PATH" =~ walk\.sh ]]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "walk.sh is read-only and must not be modified."
    }
  }'
  exit 0
fi

# Block modifications to verify-env.sh
if [[ "$FILE_PATH" =~ verify-env\.sh ]]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "verify-env.sh is read-only and must not be modified."
    }
  }'
  exit 0
fi

# Allow everything else
exit 0
