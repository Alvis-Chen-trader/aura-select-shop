/* ============================================================
   路由 + 互動。整站是單頁式（hash routing），
   丟到任何靜態主機都能跑，不需要伺服器端程式。
   ============================================================ */

const app = document.getElementById('app');

/* ---------- Header / Footer ---------- */
function renderChrome() {
  document.getElementById('announce').textContent = SHOP.announce;

  document.getElementById('hdr').innerHTML = `
    <div class="wrap hdr__in">
      <button class="icon-btn burger" id="burger" aria-label="開啟選單" aria-expanded="false">${Icon.menu}</button>
      <a class="logo" href="#/">${SHOP.logoZh}<span> ${SHOP.logoAccent}</span></a>
      <nav class="nav" id="nav">
        <a href="#/">首頁</a>
        <a href="#/products">全部商品</a>
        <a href="#/product/${PRODUCTS[0].id}">本月主打</a>
        <a href="#/about">關於我們</a>
        <a href="#/faq">購物須知</a>
      </nav>
      <div class="hdr__actions">
        <a class="icon-btn" href="#/cart" aria-label="購物車">${Icon.cart}<span class="cart-dot hide" id="cartDot">0</span></a>
      </div>
    </div>`;

  document.getElementById('ftr').innerHTML = `
    <div class="wrap">
      <div class="ftr__grid">
        <div class="ftr__brand">
          <div class="logo" style="margin-bottom:10px">${SHOP.logoZh}<span> ${SHOP.logoAccent}</span></div>
          <p>${esc(SHOP.intro)}</p>
        </div>
        <div><h4>選購</h4><ul>
          <li><a href="#/products">全部商品</a></li>
          <li><a href="#/product/${PRODUCTS[0].id}">本月主打</a></li>
          <li><a href="#/cart">購物車</a></li>
        </ul></div>
        <div><h4>服務</h4><ul>
          <li><a href="#/faq">購物須知</a></li>
          <li><a href="#/faq">退換貨規定</a></li>
          <li><a href="#/about">關於我們</a></li>
        </ul></div>
        <div><h4>聯絡</h4><ul>
          <li><a href="#/about">LINE ${esc(SHOP.contact.line)}</a></li>
          <li><a href="#/about">IG @${esc(SHOP.contact.ig)}</a></li>
          <li><a href="mailto:${esc(SHOP.contact.email)}">${esc(SHOP.contact.email)}</a></li>
        </ul></div>
      </div>
      <div class="ftr__bottom">
        <span>© ${new Date().getFullYear()} ${esc(SHOP.legal.company)}　統編 ${esc(SHOP.legal.taxId)}</span>
        <span>本站商品為化粧品，非醫療用品，不具療效。</span>
      </div>
    </div>`;

  document.getElementById('burger').addEventListener('click', e => {
    const nav = document.getElementById('nav');
    const open = nav.classList.toggle('is-open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });
}

function syncCartDot() {
  const n = Cart.count();
  const dot = document.getElementById('cartDot');
  dot.textContent = n;
  dot.classList.toggle('hide', n === 0);
}

function syncNav(path) {
  document.querySelectorAll('#nav a').forEach(a => {
    const href = a.getAttribute('href').slice(1);
    a.classList.toggle('is-active', href === path || (href !== '/' && path.startsWith(href)));
  });
}

/* ---------- Router ---------- */
function route() {
  const path = (location.hash || '#/').slice(1);
  const [, seg1, seg2] = path.split('/');
  document.getElementById('nav').classList.remove('is-open');

  let html, title = SHOP.name;
  switch (seg1) {
    case '':          html = View.home();  title = `${SHOP.name}｜${SHOP.tagline}`; break;
    case 'products':  html = View.products(seg2 && decodeURIComponent(seg2)); title = `全部商品｜${SHOP.name}`; break;
    case 'product': {
      const p = PRODUCTS.find(x => x.id === seg2);
      html = View.product(seg2); title = p ? `${p.name}｜${SHOP.name}` : title; break;
    }
    case 'cart':      html = View.cart();     title = `購物車｜${SHOP.name}`; break;
    case 'checkout':  html = View.checkout(); title = `結帳｜${SHOP.name}`; break;
    case 'done':      html = View.done(decodeURIComponent(seg2 || '')); title = `訂單完成｜${SHOP.name}`; break;
    case 'about':     html = View.about();    title = `關於我們｜${SHOP.name}`; break;
    case 'faq':       html = View.faq();      title = `購物須知｜${SHOP.name}`; break;
    default:          html = View.notFound(); title = `找不到頁面｜${SHOP.name}`;
  }

  app.innerHTML = html;
  document.title = title;
  syncNav(path);
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  if (seg1 === 'product') bindProduct(seg2);
  if (seg1 === 'products') bindProducts();
  if (seg1 === 'cart') bindCart();
  if (seg1 === 'checkout') bindCheckout();
  bindAccordions();
}

/* ---------- 共用：手風琴 ---------- */
function bindAccordions() {
  app.querySelectorAll('.acc__q').forEach(btn => {
    btn.addEventListener('click', () => btn.parentElement.classList.toggle('is-open'));
  });
}

/* ---------- 全部商品：分類篩選 ---------- */
function bindProducts() {
  app.querySelectorAll('[data-cat]').forEach(b => {
    b.addEventListener('click', () => {
      const c = b.dataset.cat;
      location.hash = c === '全部' ? '#/products' : '#/products/' + encodeURIComponent(c);
    });
  });
}

/* ---------- 商品頁 ---------- */
function bindProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  // 圖片切換
  app.querySelectorAll('.gallery__thumbs button').forEach(b => {
    b.addEventListener('click', () => {
      app.querySelector('#galMain').src = b.dataset.img;
      app.querySelectorAll('.gallery__thumbs button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
    });
  });

  // 規格選擇
  let variantId = p.variants ? p.variants[0].id : null;
  app.querySelectorAll('#variantOpts button').forEach(b => {
    b.addEventListener('click', () => {
      app.querySelectorAll('#variantOpts button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      variantId = b.dataset.vid;
      app.querySelector('#pdpPrice').textContent = fmt(b.dataset.price);
    });
  });

  // 數量
  const qtyEl = app.querySelector('#qty');
  app.querySelectorAll('[data-q]').forEach(b => {
    b.addEventListener('click', () => {
      const next = Math.min(99, Math.max(1, (parseInt(qtyEl.value, 10) || 1) + Number(b.dataset.q)));
      qtyEl.value = next;
    });
  });
  qtyEl?.addEventListener('change', () => {
    qtyEl.value = Math.min(99, Math.max(1, parseInt(qtyEl.value, 10) || 1));
  });

  const add = () => Cart.add(p.id, variantId, parseInt(qtyEl.value, 10) || 1);
  app.querySelector('#addCart')?.addEventListener('click', () => {
    add(); toast(`已加入購物車：${p.name}`);
  });
  app.querySelector('#buyNow')?.addEventListener('click', () => { add(); location.hash = '#/checkout'; });

  // 手機底部購買列：捲過主要購買區之後才出現
  const bar = app.querySelector('#buybar');
  const box = app.querySelector('.buybox');
  if (bar && box) {
    app.querySelectorAll('#variantOpts button').forEach(b =>
      b.addEventListener('click', () => { bar.querySelector('#buybarPrice').textContent = fmt(b.dataset.price); }));
    bar.querySelector('#buybarAdd').addEventListener('click', () => { add(); toast(`已加入購物車：${p.name}`); });
    const io = new IntersectionObserver(
      ([e]) => bar.classList.toggle('is-on', !e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 });
    io.observe(box);
  }

  // 分頁籤
  app.querySelectorAll('#pdpTabs button').forEach(b => {
    b.addEventListener('click', () => {
      app.querySelectorAll('#pdpTabs button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      app.querySelectorAll('[data-panel]').forEach(pl =>
        pl.classList.toggle('hide', pl.dataset.panel !== b.dataset.tab));
    });
  });
}

/* ---------- 購物車頁 ---------- */
function bindCart() {
  app.querySelectorAll('.line').forEach(line => {
    const key = line.dataset.key;
    const input = line.querySelector('[data-cqty]');
    line.querySelectorAll('[data-cq]').forEach(b => b.addEventListener('click', () => {
      Cart.setQty(key, (parseInt(input.value, 10) || 1) + Number(b.dataset.cq));
      route();
    }));
    input.addEventListener('change', () => { Cart.setQty(key, parseInt(input.value, 10) || 1); route(); });
    line.querySelector('[data-rm]').addEventListener('click', () => {
      Cart.remove(key); toast('已從購物車移除'); route();
    });
  });
}

/* ---------- 結帳頁 ---------- */
function bindCheckout() {
  const form = app.querySelector('#coForm');
  if (!form) return;

  const recalc = () => {
    const shipId = form.querySelector('input[name="ship"]:checked').value;
    const t = Cart.totals(shipId);
    app.querySelector('#coShip').textContent = t.ship === 0 ? '免運' : fmt(t.ship);
    app.querySelector('#coTotal').textContent = fmt(t.total);

    // 貨到付款只在「超商取貨付款」時可選
    const codRadio = form.querySelector('input[name="pay"][value="cod"]');
    const codLabel = codRadio.closest('.radio-card');
    const allowCod = shipId === 'cvspay';
    codRadio.disabled = !allowCod;
    codLabel.style.opacity = allowCod ? '1' : '.45';
    if (!allowCod && codRadio.checked) form.querySelector('input[name="pay"][value="card"]').checked = true;
  };
  form.querySelectorAll('input[name="ship"]').forEach(r => r.addEventListener('change', recalc));
  recalc();

  // 發票欄位連動
  const inv = form.querySelector('#f-inv');
  inv.addEventListener('change', () => {
    const extra = app.querySelector('#invExtra');
    const label = app.querySelector('#invLabel');
    const input = app.querySelector('#f-invno');
    if (inv.value === 'member') { extra.classList.add('hide'); return; }
    extra.classList.remove('hide');
    if (inv.value === 'mobile') { label.textContent = '手機條碼'; input.placeholder = '/ABC+123'; }
    else { label.textContent = '統一編號 / 抬頭'; input.placeholder = '12345678 範例有限公司'; }
  });

  const fail = (id, on) => app.querySelector(id).closest('.field').classList.toggle('is-err', on);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = k => form.querySelector('#f-' + k).value.trim();
    let ok = true;
    const bad = (id, cond) => { fail(id, cond); if (cond) ok = false; };

    bad('#f-name', v('name').length < 1);
    bad('#f-phone', !/^09\d{8}$/.test(v('phone').replace(/[\s-]/g, '')));
    bad('#f-email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email')));
    bad('#f-addr', v('addr').length < 4);
    if (inv.value !== 'member') bad('#f-invno', v('invno').length < 3);

    const agree = form.querySelector('#f-agree').checked;
    app.querySelector('#agreeErr').style.display = agree ? 'none' : 'block';
    if (!agree) ok = false;

    if (!ok) {
      const first = form.querySelector('.is-err, #agreeErr[style*="block"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast('有欄位還沒填好，請往上檢查');
      return;
    }

    const no = 'AS' + new Date().toISOString().slice(2, 10).replace(/-/g, '') +
               '-' + String(Math.floor(Math.random() * 9000) + 1000);
    Cart.clear();
    location.hash = '#/done/' + no;
  });
}

/* ---------- 回到頂部 ---------- */
function mountToTop() {
  const b = document.createElement('button');
  b.className = 'totop';
  b.type = 'button';
  b.setAttribute('aria-label', '回到頂部');
  b.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
  b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(b);
  const sync = () => b.classList.toggle('is-on', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ---------- Boot ---------- */
renderChrome();
mountToTop();
syncCartDot();
document.addEventListener('cart:change', syncCartDot);
window.addEventListener('hashchange', route);
route();
