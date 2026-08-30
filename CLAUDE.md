# 專案慣例（給之後接手的 Claude session 讀）

## 這是什麼

個人選品電商的前端樣板。純 HTML/CSS/JS，**沒有 build step、沒有 npm 依賴**。
唯一的 node 腳本是 `scripts/build-single.js`（打包成單一 HTML，用內建模組即可執行）。

## 硬規則

1. **不要引入框架或 npm 套件。** React、Vue、Tailwind、bundler 都不要。這個專案的核心價值是「非工程師能自己維護」，加了依賴就毀了。
2. **不要在前端做金流、庫存或訂單持久化。** 結帳流程是展示用的 mock。如果使用者要求「真的收錢」，先說明必須有後端或開店平台，見 `docs/OPERATIONS.md`。
3. **不要移除法規標示。** 頁尾與商品頁的「本產品為化粧品，非醫療用品，不具療效」、退換貨與猶豫期說明，是台灣法規要求，不可刪。
4. **文案一律繁體中文（台灣用語）。** 不要用簡體中文詞彙（如「質量」→「品質」、「軟件」→「軟體」、「屏幕」→「螢幕」）。
5. **不要在商品文案寫療效宣稱。** 「治療」「修復受損」「美白」「除皺」這類詞會踩到化粧品廣告法規。往「使用感受」寫。
6. **金鑰、密碼、API token 絕不進 repo。**

## 改東西的原則

- 商品、價格、運費、店名、首頁文案 → 一律改 `assets/js/data.js`，不要寫死在 `views.js`。
- 顏色、間距、圓角 → 用 `style.css` 最上面的 CSS 變數，不要在 HTML 裡寫 inline 色碼。
- 新增頁面 → 在 `views.js` 加一個回傳 HTML 字串的函式，在 `app.js` 的 `route()` 加一個 case。
- 任何使用者輸入或資料檔內容輸出到 HTML 時，用 `esc()` 包起來。

## 樣式規範

- 深色模式必須同步維護：`:root`、`@media (prefers-color-scheme: dark)`、`:root[data-theme="dark"]` 三處的 token 要一致。
- 版面斷點：820px（導覽列變漢堡選單）、880px（商品頁與購物車變單欄）、560px。
- 手機的導覽選單用 `position: absolute; top: 100%` 掛在 `.hdr` 底下，**不要改回 `position: fixed`**（`.hdr` 有 `backdrop-filter`，會建立 containing block，行為不穩定）。

## 改完要驗證

```bash
python3 -m http.server 8000     # 手動看一遍
node scripts/build-single.js    # 單檔版也要能跑，且無 console error
```

至少走過：首頁 → 商品頁（切規格、加入購物車）→ 購物車（改數量、移除）→ 結帳（空白送出要擋、填完要成功）。
手機寬度（390px）與深色模式各看一次。

## 注意事項

- `scripts/build-single.js` 裡的字串替換**一律用 function replacer**。程式碼含 `'NT$'`，直接傳字串會被 `String.replace` 當成 `$'` 特殊樣式而吃掉內容。
- `dist/aura-shop.html` 是產生物，改完程式碼記得重新產生再一起 commit。
