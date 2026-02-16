# Step 3: Keep Guessing — 迴圈

## Before You Look

現在的程式只能猜一次就結束了，很不過癮。

- 你覺得要怎麼讓程式「重複問問題」直到猜對為止？
- 想想看：在現實生活中，「一直做某件事直到條件達成」這件事叫什麼？

## This Step Introduces

- 遞迴呼叫實現重複提問（readline 的非同步特性讓傳統 while 不適用）
- 迴圈終止條件（猜對了就停）
- 計數器（猜了幾次）

## After You Look

- 為什麼這裡用 function 自己呼叫自己，而不是用 while 迴圈？
- `attempts` 變數放在 function 外面，這是為什麼？
