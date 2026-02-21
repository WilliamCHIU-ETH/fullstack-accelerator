# 技術債紀錄

## TD-001：STEP.md 路徑策略

- **發現時間：** W0 建置完成後 review
- **現狀：** 各 step branch 的 STEP.md 放在 repo 根目錄（`/STEP.md`）
- **問題：** W1 起 monorepo 會有多個 week 目錄，根目錄的 STEP.md 無法區分是哪一週的
- **影響範圍：** walk.sh 的 `git show` 路徑、所有 step branch 的檔案結構
- **建議方案：** W1 建置時將 STEP.md 改放 `week-XX/STEP.md`，同步更新 walk.sh 的讀取路徑
- **決定時機：** W1 Ref Code 開發前
- **狀態：** 🟡 待決定
