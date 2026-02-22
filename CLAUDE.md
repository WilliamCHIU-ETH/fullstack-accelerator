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

## CI / 自動化

- GitHub Actions CI 在 push main/dev 和 PR 時自動執行
- CI 檢查項目：ESLint、Prettier、lock guard、convention checker、測試
- 本地驗證指令：
  - `npm run lint` — ESLint 檢查
  - `npm run format` — Prettier 格式檢查
  - `npm test` — 透過 Turborepo 跑所有 week 測試
  - `bash scripts/check-locks.sh` — 鎖定週次檢查
  - `bash scripts/check-conventions.sh` — 慣例檢查

## 已鎖定週次（DO NOT MODIFY）

以下週次的教材已通過審查，未經明確指示不得修改任何檔案：
- week-00/（W0 課前作業）— 鎖定於 CI lock guard

如需修改已鎖定週次，必須：
1. 我明確說「解鎖 W0」
2. 說明要改什麼、為什麼
3. 改完後重新鎖定
