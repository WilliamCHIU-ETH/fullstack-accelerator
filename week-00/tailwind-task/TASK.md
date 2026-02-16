# Tailwind CSS Playground 任務

## 目標

在 [Tailwind Play](https://play.tailwindcss.com/) 上臨摹一張「使用者個人檔案卡片」(Profile Card)。

不需要任何本地安裝——打開瀏覽器就能做。

## 目標卡片規格

| 元素 | 說明 |
|------|------|
| 容器 | 白色背景、圓角、陰影、固定寬度（~320px） |
| 頭像區 | 頂部色塊（藍色漸層）+ 圓形頭像（可用 placeholder） |
| 名字 | 粗體、較大字 |
| 職稱 | 灰色、較小字 |
| 簡介 | 1-2 行灰色文字 |
| 統計列 | 三欄並排（Posts / Followers / Following），數字粗體 |
| 按鈕 | 「Follow」按鈕，藍色背景、白色字、圓角、hover 變深 |

## 必須練到的 Tailwind 概念

- **佈局：** `flex`, `items-center`, `justify-between`, `justify-center`
- **間距：** `p-4`, `px-6`, `py-2`, `mt-4`, `mb-2`, `gap-4`
- **尺寸：** `w-80`, `w-24`, `h-24`, `rounded-full`, `rounded-xl`
- **顏色：** `bg-white`, `bg-blue-500`, `text-gray-600`, `text-white`
- **字體：** `text-lg`, `text-sm`, `font-bold`, `font-medium`
- **效果：** `shadow-lg`, `hover:bg-blue-600`, `transition`
- **漸層：** `bg-gradient-to-r`, `from-blue-400`, `to-blue-600`

## 完成標準

- 視覺上 80% 相似就算過——不需要完美像素對齊
- 能說出至少 5 個你用到的 Tailwind class 分別在做什麼
- 截圖放進 W0 的提交中

## 不需要做的事

- 不需要用 JavaScript
- 不需要本地安裝 Tailwind
- 不需要 responsive（只做桌面版就好）
- 不需要「真的」頭像圖片（用 placeholder div 即可）

## 參考

打開 `reference.html` 可以看到目標卡片的樣子。
