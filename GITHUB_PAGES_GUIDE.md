# 🏫 學校 IT 服務台系統 (School IT Service Desk)

一個專為香港學校設計的 IT 服務台系統，採用繁體中文介面。

## 🌐 GitHub Pages 部署指南

### 方法一：使用 GitHub Actions（推薦）

1. **啟用 GitHub Pages**
   - 前往你的 GitHub 倉庫
   - 點擊 **Settings** → **Pages**
   - 在 **Source** 選擇 `GitHub Actions`

2. **自動部署**
   - 本專案已包含 `.github/workflows/deploy.yml`
   - 每次推送到 main 分支都會自動部署
   - 部署後會提供訪問連結

### 方法二：使用 gh-pages 分支

1. **創建 gh-pages 分支**
```bash
git checkout --orphan gh-pages
git reset --hard
cp frontend-github-pages/index.html .
git add index.html
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

2. **啟用 GitHub Pages**
   - Settings → Pages
   - Source 選擇 `gh-pages` 分支
   - Save 後等待幾分鐘

3. **訪問網址**
   ```
   https://你的GitHub用戶名.github.io/你的倉庫名稱/
   ```

## ✨ 系統功能

### 📊 儀表板
- 實時統計工單數量
- 按狀態分類顯示（待處理、處理中、已解決）

### 🎫 工單管理
- 創建新工單
- 查看工單詳情
- 更新工單狀態
- 搜尋和篩選功能

### 🔍 篩選選項
- 按狀態篩選
- 按優先級篩選
- 關鍵字搜尋

## 🚀 本地開發

### 直接打開前端
```bash
# 直接用瀏覽器打開
open frontend-github-pages/index.html
```

### 或使用本地伺服器
```bash
cd frontend-github-pages
python3 -m http.server 8080
# 訪問 http://localhost:8080
```

## 📁 檔案結構

```
/workspace/
├── README.md                 # 專案說明
├── backend/                  # 後端 API (Node.js + Express)
│   ├── package.json
│   └── server.js
├── frontend/                 # 前端 (連接後端 API)
│   └── index.html
└── frontend-github-pages/    # 靜態版本 (可直接部署到 GitHub Pages)
    └── index.html
```

## 🎯 特色

- ✅ **繁體中文介面** - 符合香港學校使用習慣
- ✅ **響應式設計** - 支援桌面和移動設備
- ✅ **無需後端** - GitHub Pages 版本使用本地數據
- ✅ **即時更新** - 工單狀態即時反映在儀表板
- ✅ **學校場景** - 內建學校科組、部門等元素

## 🛠️ 技術棧

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **後端** (可選): Node.js, Express
- **部署**: GitHub Pages

## 📝 使用示例

1. **創建工單**: 填寫右側表單，點擊提交
2. **查看工單**: 點擊工單卡片查看詳情
3. **更新狀態**: 在詳情頁面點擊「開始處理」或「標記為解決」
4. **篩選搜尋**: 使用上方篩選器快速找到工單

---

© 2024 學校 IT 服務台系統 | 僅供示範用途
