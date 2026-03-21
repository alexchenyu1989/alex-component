# iBestDev - UI Block 特效平台

類似 21st.dev 的 UI 元件/特效蒐集平台。

## 技術棧
- **後端**: Laravel 11 + Laravel Sanctum
- **前端**: React 18 + Vite + TailwindCSS 4
- **資料庫**: MySQL

---

## 🚀 啟動步驟

### 前置需求
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL

---

### 1. 後端設定

```bash
cd backend

# 安裝依賴
composer install

# 複製環境設定
cp .env.example .env

# 生成 APP_KEY
php artisan key:generate

# 設定 .env 中的資料庫資訊
# DB_DATABASE=ibest_dev
# DB_USERNAME=root
# DB_PASSWORD=你的密碼

# 建立資料庫 (MySQL)
mysql -u root -p -e "CREATE DATABASE ibest_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 執行 Migration
php artisan migrate

# 建立預設管理員帳號
php artisan db:seed

# 建立 storage 連結（圖片上傳用）
php artisan storage:link

# 啟動後端
php artisan serve
# → http://localhost:8000
```

**預設管理員帳號:**
- Email: `admin@ibest.dev`
- 密碼: `password`

---

### 2. 前端設定

```bash
cd frontend

# 依賴已安裝，直接啟動
npm run dev
# → http://localhost:5173
```

---

## 📁 專案結構

```
ibest-dev/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Api/           # 公開 API
│   │   │   └── Admin/         # 管理員 API
│   │   └── Models/
│   │       ├── Component.php
│   │       ├── Category.php
│   │       ├── Tag.php
│   │       └── Admin.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env.example
└── frontend/
    └── src/
        ├── pages/
        │   ├── HomePage.jsx          # 首頁（元件瀏覽）
        │   ├── ComponentDetailPage.jsx
        │   └── admin/
        │       ├── LoginPage.jsx
        │       ├── DashboardPage.jsx
        │       ├── ComponentsPage.jsx
        │       ├── ComponentFormPage.jsx  # 新增/編輯元件
        │       ├── CategoriesPage.jsx
        │       └── TagsPage.jsx
        ├── api/                      # Axios API calls
        └── store/authStore.js        # Zustand auth state
```

## 🔑 API 端點

### 公開 API（無需認證）
| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /api/components | 元件列表（支援 search/category_id/page） |
| GET | /api/components/:slug | 元件詳情 |
| GET | /api/categories | 分類列表 |
| POST | /api/components/:id/view | 記錄瀏覽 |
| POST | /api/components/:id/download | 記錄下載，回傳 MD 內容 |

### 管理員 API（需要 Bearer Token）
| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | /api/admin/login | 登入 |
| POST | /api/admin/logout | 登出 |
| GET | /api/admin/dashboard/stats | 統計數據 |
| CRUD | /api/admin/components | 元件管理 |
| CRUD | /api/admin/categories | 分類管理 |
| CRUD | /api/admin/tags | 標籤管理 |
| POST | /api/admin/upload/thumbnail | 上傳縮圖 |
