# Step 4: Playing It Safe — 驗證 + 限制

## Before You Look

現在遊戲可以一直猜了，但有兩個問題：

1. 如果玩家輸入「abc」會怎樣？試試看。
2. 如果玩家很爛，猜了 100 次還沒猜到，遊戲永遠不會結束。

你覺得要怎麼處理這兩種情況？先列出你的想法再看 code。

## This Step Introduces

- `Number()` / `parseInt`（字串轉數字）
- `isNaN`（檢查是否為有效數字）
- 最大次數限制（`maxAttempts = 7`）
- 遊戲結束邏輯（贏 / 輸兩種結局）

## DECISION POINT

> 輸入驗證失敗時，要不要算一次猜測？
>
> 選項 A：算次數（懲罰亂輸入的玩家）
> 選項 B：不算次數（只懲罰猜錯，不懲罰打字錯誤）
>
> 想想看：如果你是玩家，哪個體驗比較好？如果你是遊戲設計師，哪個更「公平」？
>
> 記錄在你的 DECISIONS.md 裡。

## After You Look

- 驗證邏輯為什麼放在 `attempts++` 前面？如果放在後面會怎樣？
- 你同意這個 Ref Code 的 DECISION 選擇嗎？
