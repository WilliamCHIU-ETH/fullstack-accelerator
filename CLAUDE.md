# Fullstack Accelerator — AI 協作規則

## 程式碼慣例
- 使用 ES Module（import/export），除非該週明確指定 CommonJS
- 變數命名：camelCase
- 檔案命名：kebab-case
- 縮排：2 spaces
- 字串：單引號

## 專案結構約束
- 每週的學生 code 只能放在 `week-XX/my-work/` 中
- 不要修改 `week-XX/tests/` 中的測試檔案
- 不要修改 `walk.sh` 或 `verify-env.sh`

## 禁止清單
- 不要直接給出完整解答，引導學生思考
- 不要跳過步驟，每次只處理一個 step
- 不要安裝未在該週教材中提到的 npm 套件

## 回應風格
- 繁體中文回應
- 每次回應不超過 30 行 code
- 先解釋「為什麼」，再給「怎麼做」
- 用類比幫助理解抽象概念
