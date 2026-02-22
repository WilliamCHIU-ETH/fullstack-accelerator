# Fullstack Accelerator — AI 協作規則

## 專案架構速覽
- Monorepo（npm workspaces），每個 `week-XX/` 是獨立子專案
- 測試：Node.js 內建 test runner（`node --test`），不使用 jest/mocha
- 學習腳本：`week-XX/walk.sh`（不可修改）
- 環境檢查：`scripts/verify-env.sh`（不可修改）
- 學生作業區：`week-XX/my-work/`（唯一可修改的目錄）
- 參考解答：`week-XX/complete/`（唯讀）

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
## 驗證標準
- 每次修改 `week-XX/my-work/` 後，在該 week 目錄執行 `npm test` 確認測試通過
- 新增的 code 必須通過該週的 smoke.test.js
- 不確定時，先跑測試再回應學生

## 常見錯誤防範
- ❌ 不要用 `require()`，本專案全面使用 ESM（`import/export`）
- ❌ 不要在 `my-work/` 以外建立新檔案
- ❌ 不要建議安裝 jest、mocha、vitest 等，本專案用 `node --test`
- ❌ 不要修改 `package.json` 的 `type: "module"` 設定

## 已鎖定週次（DO NOT MODIFY）

以下週次的教材已通過審查，未經明確指示不得修改任何檔案：
- week-00/（W0 課前作業）— 鎖定於 CI lock guard

如需修改已鎖定週次，必須：
1. 我明確說「解鎖 W0」
2. 說明要改什麼、為什麼
3. 改完後重新鎖定
