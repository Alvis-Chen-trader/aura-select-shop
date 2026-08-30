# AURA 選物 — 電商網站樣板

一個給「個人選品電商」用的前端樣板。以面膜作為主打商品做完整示範：首頁、商品列表、商品詳情、購物車、結帳表單、關於我們、購物須知。

- **技術**：純 HTML / CSS / JavaScript，沒有框架、沒有 build step、沒有 npm 依賴。
- **為什麼這樣選**：改一個字不用重新編譯，非工程師也能自己維護文案跟商品；丟到任何靜態主機都能跑。
- **重要**：這是**前端展示樣板**，不會真的收錢。要真的開店請看 [`docs/OPERATIONS.md`](docs/OPERATIONS.md)。

---

## 馬上看

```bash
# 方法一：任何靜態伺服器
python3 -m http.server 8000
# 打開 http://localhost:8000

# 方法二：直接用瀏覽器開 index.html 也可以（純檔案就能跑）

# 方法三：產生單一 HTML 檔，方便傳給別人看
node scripts/build-single.js   # 產出 dist/aura-shop.html
```

---

## 放到網路上（最快的方式）

repo 是 public，用 GitHub Pages 免費、不用註冊任何服務：

1. repo 頁面 → **Settings** → 左側 **Pages**
2. **Source** 選 `Deploy from a branch`
3. **Branch** 選 `main`，資料夾選 `/ (root)` → **Save**
4. 等一到兩分鐘，網址會是
   `https://alvis-chen-trader.github.io/aura-select-shop/`

之後每次 push 到 `main` 都會自動更新。

`robots.txt` 目前設為不讓搜尋引擎收錄（樣板階段）。正式上線時把它改掉。

想接自訂網域或要 PR 預覽網址，改用 Cloudflare Pages / Vercel，見
[`docs/OPERATIONS.md`](docs/OPERATIONS.md)。

---

## 檔案在哪

```
shop/
├── index.html                  外殼（meta / OG / 字體），內容都是 JS 產生的
├── assets/
│   ├── css/style.css           全站樣式。最上面是 design tokens，改品牌色只要動那幾行
│   └── js/
│       ├── data.js    ← 90% 的日常修改都在這裡（商品、價格、運費、文案）
│       ├── store.js            購物車狀態（存在瀏覽器 localStorage）
│       ├── views.js            每一頁的 HTML 模板
│       └── app.js              路由與互動事件
├── assets/img/                 商品圖（目前是 SVG 佔位圖，換成實拍圖即可）
├── scripts/build-single.js     打包成單一 HTML
└── docs/
    ├── OPERATIONS.md           上線、維護、伺服器、法遵（先讀這份）
    └── WORKING-WITH-CLAUDE.md  之後怎麼跟 Claude 一起改這個網站
```

---

## 常見修改

### 改品牌顏色

`assets/css/style.css` 最上面：

```css
--brand:      #B4614A;   /* 主色（按鈕、重點） */
--brand-deep: #8E4735;   /* 主色 hover */
--brand-soft: #F3E4DC;   /* 主色的淡底 */
```

深色模式的對應色在同一個檔案的 `@media (prefers-color-scheme: dark)` 區塊，一起改。

### 改商店資訊（店名、運費、免運門檻、客服）

`assets/js/data.js` 最上面的 `SHOP` 物件。

```js
shipping: {
  freeThreshold: 1200,          // 免運門檻
  methods: [ { id:'cvs', name:'超商取貨…', fee:60, eta:'…' }, … ],
},
```

### 新增一個商品

`assets/js/data.js` 的 `PRODUCTS` 陣列，複製一段既有商品改內容。必要欄位：

| 欄位 | 說明 |
|---|---|
| `id` | 網址用的英數代號，不可重複（`#/product/你的id`） |
| `name` / `en` / `cat` | 中文名 / 英文名 / 分類（分類會自動出現在篩選列） |
| `price` / `compareAt` | 售價 / 原價（`null` 代表不打折） |
| `status` | `onsale` 可買 / `preorder` 預購 / `soldout` 售完 |
| `images` | `assets/img/` 底下的檔名陣列，第一張是封面 |
| `variants` | 規格選項（單盒／三盒組…），沒有就寫 `null` |
| `spec` / `story` / `how` / `ingredients` / `notes` | 商品頁各分頁的內容 |
| `faq` / `reviews` | 沒有就給空陣列 `[]` |

### 換商品圖

把圖片放進 `assets/img/`，再把 `data.js` 裡的 `images: ['mask-1.svg']` 改成你的檔名。
建議 **1:1 正方形、1200×1200 以上、存成 WebP**，單張控制在 200KB 以內。

---

## 這個樣板做了什麼 / 沒做什麼

**做了**

- 響應式版面（手機 / 平板 / 桌機）與深色模式
- 商品規格選擇、數量、加入購物車（重新整理不會消失）
- 免運進度條、運費依配送方式計算
- 結帳表單：台灣格式的手機驗證、超商取貨／宅配／貨到付款連動、電子發票載具與統編欄位
- 商品頁分頁籤（介紹／使用方式／規格／全成分／QA／評價）
- 化粧品法規要求的「非醫療用品，不具療效」標示與退換貨說明

**沒做（也不該由前端做）**

- 真正的金流（信用卡授權、ATM 銷帳）
- 庫存扣減與超賣控制
- 訂單資料庫、後台、出貨單、物流串接
- 會員登入
- 電子發票開立

這些都必須由後端或開店平台處理 —— 原因與選項寫在 `docs/OPERATIONS.md`。

---

## 授權

自用專案，內容與圖片為示範用途，可自由修改。
