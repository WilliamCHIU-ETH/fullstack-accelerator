# Builder's Log — CLI 猜數字遊戲

## 為什麼從 CLI 遊戲開始？

你即將花 16 週學全端開發。你會寫出 Twitter Clone、Trello Clone、甚至 Notion Clone。

但在那之前，我們需要確認一件事：**你能不能跟著指引，一步一步把一個東西做出來。**

這個猜數字遊戲本身很簡單——重點不是遊戲，而是你在做這個遊戲的過程中會建立的工作習慣：

1. 讀指引，理解「要做什麼」
2. 在動手之前先預測「下一步大概要改什麼」
3. 用 Claude Code 幫你寫 code，但你決定架構
4. 跑測試，看到綠色 ✓

這四個步驟，從 W0 到 W16，每一週你都會重複。現在先練一次。

---

## 遊戲規格

- 程式隨機產生 1-100 的整數
- 玩家從 terminal 輸入猜測
- 程式回應「太高」「太低」或「猜對了！」
- 限制最多 7 次猜測
- 顯示猜了幾次
- 輸入非數字時提示錯誤（不算次數）

---

## 怎麼開始？

1. 先跑 `./walk.sh list` 看看有哪些步驟
2. 閱讀每個 step 的 **Before You Look** 提示
3. **先自己試**，卡住了再用 `./walk.sh look N` 看參考 code
4. 在 `my-work/` 裡寫你自己的版本
5. 每完成一個 step，跑 `npm test` 確認

---

## Step 總覽

| Step | 標題 | 你會學到 |
|------|------|----------|
| 1 | Hello Player | console.log, readline, 變數 |
| 2 | The Secret Number | Math.random, if/else, 比較 |
| 3 | Keep Guessing | while 迴圈, 計數器 |
| 4 | Playing It Safe | 輸入驗證, 次數限制 |
| 5 | Final Polish | function, 重玩, 歷史紀錄 |
| Challenge | 難度選擇 | 物件/陣列, 選單邏輯 |

---

## 提醒

- 不要急著看參考 code。先猜、先試、先犯錯，學習效果最好。
- 每個 step 的 code 都是**完整可執行的**，不是片段。
- 遇到 DECISION Point 時，沒有標準答案。記錄你的思考過程比答案本身更重要。
