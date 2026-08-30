/* ============================================================
   購物車狀態：存在瀏覽器 localStorage，重新整理不會消失
   注意：這是「前端 demo」用的。真的要收錢時，價格與庫存
   必須由後端重算，不能相信瀏覽器送上來的數字。
   ============================================================ */

const CART_KEY = 'aura_cart_v1';

const Cart = {
  read() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  },
  write(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
    document.dispatchEvent(new CustomEvent('cart:change'));
  },
  key(productId, variantId) { return productId + '::' + (variantId || '-'); },

  add(productId, variantId, qty = 1) {
    const items = this.read();
    const k = this.key(productId, variantId);
    const hit = items.find(i => i.key === k);
    if (hit) hit.qty = Math.min(99, hit.qty + qty);
    else items.push({ key: k, productId, variantId, qty });
    this.write(items);
  },
  setQty(key, qty) {
    const items = this.read();
    const hit = items.find(i => i.key === key);
    if (!hit) return;
    if (qty <= 0) return this.remove(key);
    hit.qty = Math.min(99, qty);
    this.write(items);
  },
  remove(key) { this.write(this.read().filter(i => i.key !== key)); },
  clear() { this.write([]); },
  count() { return this.read().reduce((n, i) => n + i.qty, 0); },

  /** 把購物車展開成含商品資料與金額的完整列表 */
  detailed() {
    return this.read().map(i => {
      const p = PRODUCTS.find(x => x.id === i.productId);
      if (!p) return null;
      const v = p.variants ? p.variants.find(x => x.id === i.variantId) : null;
      const unit = v ? v.price : p.price;
      return { ...i, product: p, variant: v, unit, sub: unit * i.qty };
    }).filter(Boolean);
  },

  totals(shippingId) {
    const lines = this.detailed();
    const subtotal = lines.reduce((n, l) => n + l.sub, 0);
    const method = SHOP.shipping.methods.find(m => m.id === shippingId);
    let ship = 0;
    if (subtotal > 0 && method) ship = subtotal >= SHOP.shipping.freeThreshold ? 0 : method.fee;
    return { lines, subtotal, ship, method, total: subtotal + ship,
             toFree: Math.max(0, SHOP.shipping.freeThreshold - subtotal) };
  },
};

/* --- 小工具 ---------------------------------------------- */
const fmt = n => 'NT$' + Number(n).toLocaleString('zh-TW');
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const IMG = f => 'assets/img/' + f;

function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  requestAnimationFrame(() => el.classList.add('is-on'));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('is-on'), 2400);
}
