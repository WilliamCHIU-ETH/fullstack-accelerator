Check all locked weeks for unauthorized modifications.

Follow these steps:
1. Read the root `CLAUDE.md` and find the "已鎖定週次" section
2. For each locked week, identify its lock tag (e.g., `w0-locked` for week-00)
3. Run `git diff <lock-tag> -- <week-dir>/` to check for changes since the lock
4. Report results:
   - If no changes: "✅ week-XX: clean, matches lock tag"
   - If changes found: "❌ week-XX: modified files detected" and list the changed files
5. Summarize the overall status
