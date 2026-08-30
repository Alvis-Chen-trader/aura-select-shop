/* ============================================================
   畫面模板：每個函式回傳一頁的 HTML 字串
   ============================================================ */

const Icon = {
  cart: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  menu: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  leaf: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  box: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  shield: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  chat: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
  check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  bag: '<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  party: '<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>',
};

const badgeClass = p =>
  p.status === 'soldout' ? 'tag tag--soon' :
  p.status === 'preorder' ? 'tag tag--soon' :
  p.compareAt ? 'tag tag--sale' : 'tag';

function card(p) {
  const label = p.badge || (p.compareAt ? '限時優惠' : '');
  return `
  <a class="card" href="#/product/${p.id}">
    <div class="card__media">
      ${label ? `<span class="${badgeClass(p)}">${esc(label)}</span>` : ''}
      <img src="${IMG(p.images[0])}" alt="${esc(p.name)}" loading="lazy" width="800" height="800">
    </div>
    <div class="card__body">
      <span class="card__cat">${esc(p.cat)}</span>
      <span class="card__name">${esc(p.name)}</span>
      <span class="card__price">
        <span class="price ${p.compareAt ? 'price--sale' : ''}">${fmt(p.price)}</span>
        ${p.compareAt ? `<span class="price--was">${fmt(p.compareAt)}</span>` : ''}
      </span>
    </div>
  </a>`;
}

const View = {
  /* ---------------- 首頁 ---------------- */
  home() {
    const hero = PRODUCTS[0];
    const picks = PRODUCTS.filter(p => p.id !== hero.id).slice(0, 4);
    return `
    <section class="wrap hero">
      <div>
        <p class="eyebrow">${COPY.heroEyebrow}</p>
        <h1 class="display">${COPY.heroTitle}</h1>
        <p class="lede" style="margin-top:16px;max-width:44ch">${esc(COPY.heroText)}</p>
        <div class="hero__cta">
          <a class="btn btn--primary btn--lg" href="#/product/${hero.id}">看看這片面膜</a>
          <a class="btn btn--ghost btn--lg" href="#/products">全部商品</a>
        </div>
        <div class="hero__meta">
          <div><b>7 樣</b>目前上架選品</div>
          <div><b>1,200+</b>累積出貨訂單</div>
          <div><b>4.9 / 5</b>顧客評分</div>
        </div>
      </div>
      <div class="hero__art">
        <span class="hero__badge">本月主打 · 限時 ${Math.round((1 - hero.price / hero.compareAt) * 100)}% OFF</span>
        <img src="${IMG('hero.svg')}" alt="${esc(hero.name)}" width="800" height="1000" style="width:100%;height:100%;object-fit:cover">
      </div>
    </section>

    <section class="sec sec--alt">
      <div class="wrap">
        <div class="values">
          ${COPY.values.map(v => `
            <div class="value">${Icon[v.icon]}<h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="sec__head">
          <div>
            <p class="eyebrow">THIS MONTH</p>
            <h2 class="h2">本月主打</h2>
            <p class="muted">${esc(hero.short)}</p>
          </div>
          <a class="btn btn--ghost" href="#/product/${hero.id}">看完整介紹</a>
        </div>
        <div class="split">
          <div class="split__art"><img src="${IMG(hero.images[3])}" alt="${esc(hero.name)} 情境" style="width:100%;height:100%;object-fit:cover"></div>
          <div>
            <h3 class="h3">${esc(hero.name)}</h3>
            <ul class="pdp__bullets">${hero.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
            <div class="pdp__price">
              <span class="price price--sale">${fmt(hero.price)}</span>
              <span class="price--was">${fmt(hero.compareAt)}</span>
              <span class="tiny">/ 5 片入</span>
            </div>
            <a class="btn btn--primary btn--lg" href="#/product/${hero.id}" style="margin-top:14px">選購</a>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--alt">
      <div class="wrap">
        <div class="sec__head">
          <div><p class="eyebrow">ALSO ON THE SHELF</p><h2 class="h2">架上其他選品</h2></div>
          <a class="btn btn--ghost" href="#/products">看全部</a>
        </div>
        <div class="grid">${picks.map(card).join('')}</div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap split">
        <div>
          <p class="eyebrow">ABOUT</p>
          <h2 class="h2">${esc(COPY.aboutTitle)}</h2>
          <p class="lede" style="margin-top:14px;white-space:pre-line">${esc(COPY.aboutBody)}</p>
          <a class="btn btn--ghost" href="#/about" style="margin-top:10px">更多關於我們</a>
        </div>
        <div class="split__art"><img src="${IMG('about.svg')}" alt="選品理念" style="width:100%;height:100%;object-fit:cover"></div>
      </div>
    </section>`;
  },

  /* ---------------- 全部商品 ---------------- */
  products(cat) {
    const cats = ['全部', ...new Set(PRODUCTS.map(p => p.cat))];
    const active = cat && cats.includes(cat) ? cat : '全部';
    const list = active === '全部' ? PRODUCTS : PRODUCTS.filter(p => p.cat === active);
    return `
    <div class="wrap">
      <p class="crumb"><a href="#/">首頁</a> / 全部商品</p>
      <section class="sec" style="padding-top:22px">
        <div class="sec__head">
          <div><p class="eyebrow">ALL PRODUCTS</p><h2 class="h2">全部商品</h2>
          <p class="muted">目前架上 ${PRODUCTS.length} 樣。每一樣都用過至少一個月。</p></div>
        </div>
        <div class="opt" style="margin-bottom:24px">
          ${cats.map(c => `<button data-cat="${esc(c)}" class="${c === active ? 'is-active' : ''}">${esc(c)}</button>`).join('')}
        </div>
        <div class="grid">${list.map(card).join('')}</div>
      </section>
    </div>`;
  },

  /* ---------------- 商品詳情 ---------------- */
  product(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return View.notFound();
    const buyable = p.status === 'onsale';
    const vs = p.variants || [];
    const startPrice = vs.length ? vs[0].price : p.price;
    const avg = p.reviews.length
      ? (p.reviews.reduce((n, r) => n + r.stars, 0) / p.reviews.length).toFixed(1) : null;

    return `
    <div class="wrap">
      <p class="crumb"><a href="#/">首頁</a> / <a href="#/products">全部商品</a> / ${esc(p.name)}</p>

      <section class="pdp">
        <div>
          <div class="gallery__main"><img id="galMain" src="${IMG(p.images[0])}" alt="${esc(p.name)}" width="800" height="800"></div>
          ${p.images.length > 1 ? `<div class="gallery__thumbs">
            ${p.images.map((f, i) => `<button data-img="${IMG(f)}" class="${i === 0 ? 'is-active' : ''}" aria-label="圖片 ${i + 1}"><img src="${IMG(f)}" alt="" width="200" height="200"></button>`).join('')}
          </div>` : ''}
        </div>

        <div>
          <p class="eyebrow">${esc(p.cat)}${avg ? ` · ★ ${avg}（${p.reviews.length} 則評價）` : ''}</p>
          <h1 class="h2">${esc(p.name)}</h1>
          <p class="tiny" style="letter-spacing:.14em;margin-top:4px">${esc(p.en)}</p>
          <div class="pdp__price">
            <span class="price ${p.compareAt ? 'price--sale' : ''}" id="pdpPrice">${fmt(startPrice)}</span>
            ${p.compareAt ? `<span class="price--was">${fmt(p.compareAt)}</span>` : ''}
            <span class="tiny">含稅</span>
          </div>
          <p class="lede" style="margin-top:12px">${esc(p.short)}</p>
          <ul class="pdp__bullets">${p.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>

          <div class="buybox" data-pid="${p.id}">
            ${vs.length ? `
              <label class="tiny" style="display:block;margin-bottom:8px;font-weight:700;letter-spacing:.08em">選擇組合</label>
              <div class="opt" id="variantOpts">
                ${vs.map((v, i) => `<button data-vid="${v.id}" data-price="${v.price}" class="${i === 0 ? 'is-active' : ''}">
                  ${esc(v.label)}<br><span class="tiny">${esc(v.note)}</span></button>`).join('')}
              </div>` : ''}
            <div class="buybox__row">
              <div class="qty">
                <button data-q="-1" aria-label="減少數量">−</button>
                <input id="qty" type="number" value="1" min="1" max="99" aria-label="數量">
                <button data-q="1" aria-label="增加數量">+</button>
              </div>
              <button class="btn btn--primary" id="addCart" style="flex:1" ${buyable ? '' : 'disabled'}>
                ${buyable ? '加入購物車' : p.status === 'preorder' ? '預購中，敬請期待' : '售完補貨中'}
              </button>
            </div>
            ${buyable ? `<button class="btn btn--ghost btn--block" id="buyNow">直接結帳</button>` : ''}
            <div class="trust">
              <div>${Icon.check}<span>單筆滿 ${fmt(SHOP.shipping.freeThreshold)} 免運費</span></div>
              <div>${Icon.check}<span>週一至週五 12:00 前付款完成，當日出貨</span></div>
              <div>${Icon.check}<span>台灣製造，可提供檢驗報告</span></div>
            </div>
          </div>
        </div>
      </section>

      <section style="padding-bottom:60px">
        <div class="tabs" id="pdpTabs">
          <button data-tab="story" class="is-active">商品介紹</button>
          <button data-tab="how">使用方式</button>
          <button data-tab="spec">規格</button>
          <button data-tab="ing">全成分</button>
          ${p.faq.length ? '<button data-tab="faq">常見問題</button>' : ''}
          ${p.reviews.length ? '<button data-tab="rev">顧客評價</button>' : ''}
        </div>

        <div class="tabpanel" data-panel="story">
          <p style="white-space:pre-line">${esc(p.story)}</p>
          <h4>使用注意事項</h4>
          <ul class="prose" style="padding-left:20px;color:var(--ink-2)">${p.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
        </div>
        <div class="tabpanel hide" data-panel="how">
          <ol style="padding-left:20px;color:var(--ink-2)">${p.how.map(h => `<li style="margin-bottom:8px">${esc(h)}</li>`).join('')}</ol>
        </div>
        <div class="tabpanel hide" data-panel="spec">
          <table class="spec"><tbody>
            ${Object.entries(p.spec).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
          </tbody></table>
        </div>
        <div class="tabpanel hide" data-panel="ing">
          <p style="white-space:pre-line;color:var(--ink-2)">${esc(p.ingredients)}</p>
        </div>
        ${p.faq.length ? `<div class="tabpanel hide" data-panel="faq">
          <div class="acc">${p.faq.map(f => `
            <div class="acc__item"><button class="acc__q">${esc(f.q)}</button><div class="acc__a">${esc(f.a)}</div></div>`).join('')}
          </div>
        </div>` : ''}
        ${p.reviews.length ? `<div class="tabpanel hide" data-panel="rev">
          <div class="reviews">${p.reviews.map(r => `
            <div class="review">
              <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
              <p>${esc(r.text)}</p>
              <footer>${esc(r.name)} · ${esc(r.date)}</footer>
            </div>`).join('')}
          </div>
          <p class="tiny" style="margin-top:14px">評價為實際購買者於出貨後留下，未經修改。</p>
        </div>` : ''}
      </section>

      <section class="sec" style="border-top:1px solid var(--line)">
        <div class="sec__head"><h2 class="h2">也許你也會喜歡</h2></div>
        <div class="grid">${PRODUCTS.filter(x => x.id !== p.id).slice(0, 4).map(card).join('')}</div>
      </section>
    </div>

    ${buyable ? `<div class="buybar" id="buybar">
      <span class="buybar__price"><small>${esc(p.name)}</small><b id="buybarPrice">${fmt(startPrice)}</b></span>
      <button class="btn btn--primary" id="buybarAdd">加入購物車</button>
    </div>` : ''}`;
  },

  /* ---------------- 購物車 ---------------- */
  cart() {
    const t = Cart.totals(null);
    if (!t.lines.length) return `
      <div class="wrap"><div class="empty">
        ${Icon.bag}
        <h2 class="h2">購物車還是空的</h2>
        <p class="muted">先去看看架上有什麼吧。</p>
        <a class="btn btn--primary" href="#/products" style="margin-top:10px">開始選購</a>
      </div></div>`;

    return `
    <div class="wrap">
      <p class="crumb"><a href="#/">首頁</a> / 購物車</p>
      <div class="cart-layout">
        <div>
          <h1 class="h2" style="margin-bottom:6px">購物車</h1>
          <p class="tiny" style="margin-bottom:10px">共 ${Cart.count()} 件商品</p>
          ${t.lines.map(l => `
            <div class="line" data-key="${esc(l.key)}">
              <a class="line__img" href="#/product/${l.product.id}"><img src="${IMG(l.product.images[0])}" alt="${esc(l.product.name)}"></a>
              <div>
                <a class="line__name" href="#/product/${l.product.id}">${esc(l.product.name)}</a>
                ${l.variant ? `<div class="line__opt">${esc(l.variant.label)}</div>` : ''}
                <div class="line__opt">單價 ${fmt(l.unit)}</div>
                <div class="qty" style="margin-top:8px">
                  <button data-cq="-1" aria-label="減少">−</button>
                  <input type="number" value="${l.qty}" min="1" max="99" data-cqty aria-label="數量">
                  <button data-cq="1" aria-label="增加">+</button>
                </div>
              </div>
              <div style="text-align:right">
                <div class="price">${fmt(l.sub)}</div>
                <button class="line__rm" data-rm>移除</button>
              </div>
            </div>`).join('')}
        </div>

        <aside class="summary">
          <h3 class="h3" style="margin-bottom:12px">訂單摘要</h3>
          ${View._freebar(t)}
          <div class="summary__row"><span>商品小計</span><span>${fmt(t.subtotal)}</span></div>
          <div class="summary__row"><span>運費</span><span>結帳時計算</span></div>
          <div class="summary__row summary__row--total"><span>小計</span><span>${fmt(t.subtotal)}</span></div>
          <a class="btn btn--primary btn--block btn--lg" href="#/checkout" style="margin-top:16px">前往結帳</a>
          <a class="btn btn--ghost btn--block" href="#/products" style="margin-top:10px">繼續選購</a>
        </aside>
      </div>
    </div>`;
  },

  _freebar(t) {
    if (t.subtotal <= 0) return '';
    if (t.toFree <= 0) return `<div class="freebar">已達免運門檻，這筆訂單免運費 🎉</div>`;
    const pct = Math.min(100, (t.subtotal / SHOP.shipping.freeThreshold) * 100);
    return `<div class="freebar">再買 <b>${fmt(t.toFree)}</b> 就免運費
      <div class="freebar__track"><div class="freebar__fill" style="width:${pct}%"></div></div></div>`;
  },

  /* ---------------- 結帳 ---------------- */
  checkout() {
    const t = Cart.totals(SHOP.shipping.methods[0].id);
    if (!t.lines.length) return View.cart();
    return `
    <div class="wrap">
      <p class="crumb"><a href="#/">首頁</a> / <a href="#/cart">購物車</a> / 結帳</p>
      <div class="cart-layout">
        <form id="coForm" novalidate>
          <h1 class="h2" style="margin-bottom:20px">結帳</h1>

          <fieldset class="fs">
            <legend>收件資訊</legend>
            <div class="field-row">
              <div class="field"><label for="f-name">收件人姓名 <span>*</span></label>
                <input id="f-name" name="name" autocomplete="name" placeholder="王小明">
                <div class="err">請填寫收件人姓名</div></div>
              <div class="field"><label for="f-phone">手機號碼 <span>*</span></label>
                <input id="f-phone" name="phone" inputmode="numeric" autocomplete="tel" placeholder="0912345678">
                <div class="err">請填寫正確的 10 碼手機號碼（09 開頭）</div></div>
            </div>
            <div class="field"><label for="f-email">Email <span>*</span>（訂單通知與電子發票寄送）</label>
              <input id="f-email" name="email" type="email" autocomplete="email" placeholder="you@example.com">
              <div class="err">請填寫正確的 Email</div></div>
          </fieldset>

          <fieldset class="fs">
            <legend>配送方式</legend>
            <div class="radio-cards" id="shipOpts">
              ${SHOP.shipping.methods.map((m, i) => `
                <label class="radio-card">
                  <input type="radio" name="ship" value="${m.id}" ${i === 0 ? 'checked' : ''}>
                  <span><b>${esc(m.name)} · ${fmt(m.fee)}</b><small>${esc(m.eta)}</small></span>
                </label>`).join('')}
            </div>
            <div class="field" style="margin-top:14px" id="addrField">
              <label for="f-addr">收件地址 / 取貨門市 <span>*</span></label>
              <input id="f-addr" name="addr" autocomplete="street-address" placeholder="例：7-11 中山門市，或 台北市中山區範例路 1 號">
              <div class="err">請填寫收件地址或指定取貨門市</div>
            </div>
          </fieldset>

          <fieldset class="fs">
            <legend>付款方式</legend>
            <div class="radio-cards" id="payOpts">
              ${SHOP.payments.map((p, i) => `
                <label class="radio-card">
                  <input type="radio" name="pay" value="${p.id}" ${i === 0 ? 'checked' : ''}>
                  <span><b>${esc(p.name)}</b><small>${esc(p.note)}</small></span>
                </label>`).join('')}
            </div>
          </fieldset>

          <fieldset class="fs">
            <legend>發票</legend>
            <div class="field-row">
              <div class="field"><label for="f-inv">發票類型</label>
                <select id="f-inv" name="inv">
                  <option value="member">電子發票（存入會員載具）</option>
                  <option value="mobile">電子發票（手機條碼載具）</option>
                  <option value="company">公司戶（三聯式）</option>
                </select></div>
              <div class="field hide" id="invExtra"><label for="f-invno" id="invLabel">手機條碼</label>
                <input id="f-invno" name="invno" placeholder="/ABC+123">
                <div class="err">請填寫發票資訊</div></div>
            </div>
            <div class="field"><label for="f-note">訂單備註（選填）</label>
              <textarea id="f-note" name="note" rows="2" placeholder="例：包裝請不要印商品名稱"></textarea></div>
          </fieldset>

          <label class="radio-card" style="margin-bottom:18px">
            <input type="checkbox" id="f-agree">
            <span><b>我已閱讀並同意購物須知與退換貨規定</b>
            <small>個人衛生用品拆封後除瑕疵外恕不接受退換貨。</small></span>
          </label>
          <div class="field is-hidden" id="agreeErr" style="display:none"><div class="err" style="display:block">請先勾選同意購物須知</div></div>

          <button class="btn btn--primary btn--block btn--lg" type="submit">送出訂單</button>
          <p class="tiny" style="margin-top:12px">這是展示用網站，不會真的扣款，也不會送出任何個人資料。</p>
        </form>

        <aside class="summary">
          <h3 class="h3" style="margin-bottom:12px">訂單明細</h3>
          ${t.lines.map(l => `
            <div class="summary__row">
              <span>${esc(l.product.name)}${l.variant ? ' · ' + esc(l.variant.label) : ''} × ${l.qty}</span>
              <span>${fmt(l.sub)}</span>
            </div>`).join('')}
          <div class="summary__row" style="border-top:1px solid var(--line);margin-top:8px;padding-top:12px"><span>商品小計</span><span>${fmt(t.subtotal)}</span></div>
          <div class="summary__row"><span>運費</span><span id="coShip">${t.ship === 0 ? '免運' : fmt(t.ship)}</span></div>
          <div class="summary__row summary__row--total"><span>應付總額</span><span id="coTotal">${fmt(t.total)}</span></div>
          ${View._freebar(t)}
          <a class="btn btn--ghost btn--block" href="#/cart" style="margin-top:12px">回購物車修改</a>
        </aside>
      </div>
    </div>`;
  },

  /* ---------------- 訂單完成 ---------------- */
  done(no) {
    return `
    <div class="wrap"><div class="done">
      ${Icon.party}
      <h1 class="h2" style="margin-top:10px">訂單成立，謝謝你！</h1>
      <p class="muted">我們已將訂單確認信寄到你填寫的 Email。出貨後會再寄一次含物流單號的通知。</p>
      <div class="done__no">訂單編號 ${esc(no)}</div>
      <p class="tiny">這是展示用網站，以上為模擬結果，沒有任何款項被收取。</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:20px">
        <a class="btn btn--primary" href="#/products">繼續逛逛</a>
        <a class="btn btn--ghost" href="#/faq">購物須知</a>
      </div>
    </div></div>`;
  },

  /* ---------------- 關於 ---------------- */
  about() {
    return `
    <div class="wrap">
      <p class="crumb"><a href="#/">首頁</a> / 關於我們</p>
      <section class="sec split" style="padding-top:24px">
        <div>
          <p class="eyebrow">ABOUT</p>
          <h1 class="h2">${esc(COPY.aboutTitle)}</h1>
          <p class="lede" style="margin-top:16px;white-space:pre-line">${esc(COPY.aboutBody)}</p>
        </div>
        <div class="split__art"><img src="${IMG('about.svg')}" alt="選品理念" style="width:100%;height:100%;object-fit:cover"></div>
      </section>
      <section class="sec sec--alt" style="margin-inline:calc(var(--gut) * -1)">
        <div class="wrap"><div class="values">
          ${COPY.values.map(v => `<div class="value">${Icon[v.icon]}<h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></div>`).join('')}
        </div></div>
      </section>
      <section class="sec">
        <h2 class="h2" style="margin-bottom:14px">聯絡我們</h2>
        <div class="prose muted">
          <p>LINE 官方帳號：${esc(SHOP.contact.line)}（最快）<br>
          Instagram：@${esc(SHOP.contact.ig)}<br>
          Email：${esc(SHOP.contact.email)}<br>
          客服時間：${esc(SHOP.contact.hours)}</p>
        </div>
      </section>
    </div>`;
  },

  /* ---------------- 購物須知 ---------------- */
  faq() {
    return `
    <div class="wrap">
      <p class="crumb"><a href="#/">首頁</a> / 購物須知</p>
      <section class="sec" style="padding-top:24px">
        <p class="eyebrow">HELP</p>
        <h1 class="h2" style="margin-bottom:20px">購物須知與常見問題</h1>
        <div class="acc" style="max-width:74ch">
          ${COPY.faq.map(f => `<div class="acc__item"><button class="acc__q">${esc(f.q)}</button><div class="acc__a">${esc(f.a)}</div></div>`).join('')}
        </div>
        <div class="prose" style="margin-top:40px">
          <h3>退換貨規定</h3>
          <ul>
            <li>依《消費者保護法》第 19 條，商品到貨後享有 7 天猶豫期（含例假日），此為鑑賞期非試用期。</li>
            <li>退貨商品須為全新未使用、包裝完整、可回復原狀之狀態，並附回所有配件與贈品。</li>
            <li>面膜、保養品等個人衛生用品，經拆封後除商品本身瑕疵外，恕無法接受退換貨。</li>
            <li>如需退貨，請於 7 日內透過 LINE 客服提出，我們會協助安排取件。</li>
          </ul>
          <h3>隱私權政策（摘要）</h3>
          <ul>
            <li>我們僅蒐集完成交易所必要之個人資料：姓名、電話、Email、配送地址。</li>
            <li>資料僅用於訂單處理、物流配送與客服聯繫，不會提供給無關第三方。</li>
            <li>你可隨時來信要求查閱、更正或刪除你的個人資料。</li>
          </ul>
          <h3>營業資訊</h3>
          <ul>
            <li>${esc(SHOP.legal.company)}　統一編號：${esc(SHOP.legal.taxId)}</li>
            <li>地址：${esc(SHOP.legal.address)}</li>
            <li>客服信箱：${esc(SHOP.contact.email)}</li>
          </ul>
        </div>
      </section>
    </div>`;
  },

  notFound() {
    return `<div class="wrap"><div class="empty">
      <h2 class="h2">找不到這個頁面</h2>
      <p class="muted">連結可能已經失效，或商品已下架。</p>
      <a class="btn btn--primary" href="#/" style="margin-top:10px">回首頁</a>
    </div></div>`;
  },
};
