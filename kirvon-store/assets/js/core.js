/* =====================================================================
   KIRVON — core
   Helpers · storage · cart · shared renderers · header / footer /
   cart drawer / search overlay · toasts · reveal-on-scroll
   (Plain scripts, no build step, works from file:// or any web host.)
   ===================================================================== */
(function () {
  'use strict';

  const STORE = window.STORE;
  const PRODUCTS = window.PRODUCTS;

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => STORE.currency + Math.round(n).toLocaleString(STORE.locale || 'en-NG');
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const catById = (id) => STORE.categories.find((c) => c.id === id);
  const discountPct = (p) => (p.compareAt && p.compareAt > p.price ? Math.round((1 - p.price / p.compareAt) * 100) : 0);
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Storage: localStorage, with a window.name fallback so the cart still
     survives page-to-page navigation inside sandboxed previews. */
  const WN = '__kirvon__';
  const wnRead = () => { try { return window.name.indexOf(WN) === 0 ? JSON.parse(window.name.slice(WN.length)) : {}; } catch (e) { return {}; } };
  const wnWrite = (o) => { try { window.name = WN + JSON.stringify(o); } catch (e) { /* ignore */ } };
  const storage = {
    get(k, d) {
      try { const v = window.localStorage.getItem(k); return v === null ? d : JSON.parse(v); }
      catch (e) { const o = wnRead(); return k in o ? o[k] : d; }
    },
    set(k, v) {
      try { window.localStorage.setItem(k, JSON.stringify(v)); }
      catch (e) { const o = wnRead(); o[k] = v; wnWrite(o); }
    },
    del(k) {
      try { window.localStorage.removeItem(k); }
      catch (e) { const o = wnRead(); delete o[k]; wnWrite(o); }
    }
  };

  /* ------------------------------------------------------------------
     Icons (Lucide-style, stroke based)
     ------------------------------------------------------------------ */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    return: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    watch: '<circle cx="12" cy="12" r="6"/><path d="M12 10v2l1 1"/><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.64h2.72a2 2 0 0 0 2-1.64l.8-4"/>',
    package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
    bank: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2 20 7H4Z"/>',
    cash: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    store: '<path d="m2 7 1.6-4h16.8L22 7"/><path d="M4 21V10.5"/><path d="M20 21V10.5"/><path d="M2 7a3.5 3.5 0 0 0 7 0 3.5 3.5 0 0 0 7 0 3.5 3.5 0 0 0 6 0"/><path d="M9 21v-6h6v6"/><path d="M3 21h18"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 3v4"/><path d="M17 5h4"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    'x-brand': '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>'
  };
  const FILLED = { 'x-brand': true };

  function iconSVG(name) { return '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">' + (ICONS[name] || '') + '</svg>'; }
  function icon(name, extra) { return '<span class="ico' + (FILLED[name] ? ' ico-fill' : '') + (extra ? ' ' + extra : '') + '" aria-hidden="true">' + iconSVG(name) + '</span>'; }
  function hydrateIcons(root) {
    $$('[data-icon]', root).forEach((el) => {
      if (el.dataset.iconDone) return;
      el.innerHTML = iconSVG(el.dataset.icon);
      el.classList.add('ico');
      if (FILLED[el.dataset.icon]) el.classList.add('ico-fill');
      el.setAttribute('aria-hidden', 'true');
      el.dataset.iconDone = '1';
    });
  }

  /* ------------------------------------------------------------------
     Cart
     ------------------------------------------------------------------ */
  const CART_KEY = 'kirvon.cart.v1';
  const COUPON_KEY = 'kirvon.coupon.v1';
  const MAX_QTY = 10;

  const Cart = {
    items: storage.get(CART_KEY, []),
    coupon: storage.get(COUPON_KEY, null),

    save(type) {
      storage.set(CART_KEY, this.items);
      storage.set(COUPON_KEY, this.coupon);
      document.dispatchEvent(new CustomEvent('cart:change', { detail: { type: type || 'update' } }));
    },
    lines() { return this.items.map((i) => ({ product: byId(i.id), qty: i.qty })).filter((l) => l.product); },
    count() { return this.lines().reduce((n, l) => n + l.qty, 0); },
    subtotal() { return this.lines().reduce((s, l) => s + l.product.price * l.qty, 0); },
    limit(p) { return Math.max(0, Math.min(p.stock, MAX_QTY)); },
    /* returns how many units were actually added */
    add(id, qty) {
      const p = byId(id);
      if (!p || p.stock <= 0) return 0;
      qty = qty || 1;
      const line = this.items.find((i) => i.id === id);
      const have = line ? line.qty : 0;
      const next = Math.min(have + qty, this.limit(p));
      if (next === have) return 0;
      if (line) line.qty = next; else this.items.push({ id, qty: next });
      this.save('add');
      return next - have;
    },
    setQty(id, qty) {
      const p = byId(id);
      const line = this.items.find((i) => i.id === id);
      if (!line || !p) return;
      if (qty <= 0) return this.remove(id);
      line.qty = Math.min(qty, this.limit(p));
      this.save();
    },
    remove(id) { this.items = this.items.filter((i) => i.id !== id); this.save(); },
    clear() { this.items = []; this.coupon = null; this.save(); },
    applyCoupon(code) {
      code = (code || '').trim().toUpperCase();
      if (!code) return { ok: false, msg: 'Enter a code first.' };
      const c = STORE.coupons[code];
      if (!c) return { ok: false, msg: 'That code isn’t valid. Try KIRVON10.' };
      this.coupon = code;
      this.save();
      return { ok: true, msg: c.label + ' applied.' };
    },
    removeCoupon() { this.coupon = null; this.save(); },
    discountAmount(sub) {
      const c = this.coupon && STORE.coupons[this.coupon];
      if (!c) return 0;
      return c.type === 'percent' ? Math.round(sub * c.value / 100) : Math.min(c.value, sub);
    }
  };
  /* Drop anything in storage that no longer exists in the catalogue */
  Cart.items = Cart.items.filter((i) => byId(i.id) && i.qty > 0);

  function totals(methodId) {
    const sub = Cart.subtotal();
    const disc = Cart.discountAmount(sub);
    const after = Math.max(0, sub - disc);
    const method = STORE.shipping.methods.find((m) => m.id === methodId) || STORE.shipping.methods[0];
    let ship = method.price;
    if (method.id === 'standard' && after >= STORE.shipping.freeOver) ship = 0;
    if (sub === 0) ship = 0;
    return { sub, disc, after, ship, method, total: after + ship, freeLeft: Math.max(0, STORE.shipping.freeOver - after) };
  }

  /* ------------------------------------------------------------------
     Shared renderers
     ------------------------------------------------------------------ */
  function stars(rating, size) {
    const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
    return '<span class="stars" style="--pct:' + pct + '%;--s:' + (size || 16) + 'px" role="img" aria-label="Rated ' + rating + ' out of 5"></span>';
  }

  function productCard(p, i) {
    const cat = catById(p.category);
    const off = discountPct(p);
    const sold = p.stock <= 0;
    const badges = [];
    if (sold) badges.push('<span class="pill">Sold out</span>');
    else {
      if (p.badge) badges.push('<span class="pill pill-accent">' + esc(p.badge) + '</span>');
      if (off) badges.push('<span class="pill">-' + off + '%</span>');
      if (p.stock <= 5) badges.push('<span class="pill pill-warn">Only ' + p.stock + ' left</span>');
    }
    return `<article class="product-card reveal" style="--d:${((i || 0) % 4) * 70}ms">
      <a class="pc-media" href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.image}" alt="${esc(p.name)}" width="600" height="600" loading="lazy" decoding="async"></a>
      <div class="pc-badges">${badges.join('')}</div>
      <div class="pc-body">
        <span class="pc-cat">${esc(cat ? cat.name : '')}</span>
        <h3 class="pc-title"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
        <div class="pc-meta">${stars(p.rating, 13)}<span>${p.rating.toFixed(1)}<span class="rev-count"> (${p.reviews})</span></span></div>
        <div class="pc-foot">
          <div class="price"><strong>${money(p.price)}</strong>${p.compareAt ? '<s>' + money(p.compareAt) + '</s>' : ''}</div>
          <button class="pc-add" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart"${sold ? ' disabled' : ''}>${icon('plus')}</button>
        </div>
      </div>
    </article>`;
  }

  function shipMeter(t) {
    const free = STORE.shipping.freeOver;
    const pct = Math.max(0, Math.min(100, Math.round((1 - t.freeLeft / free) * 100)));
    const msg = t.freeLeft > 0
      ? 'Add <b>' + money(t.freeLeft) + '</b> more for <b>free delivery</b>'
      : '<b>You’ve unlocked free delivery</b> on this order';
    return `<div class="ship-meter"><p>${msg}</p><div class="meter" role="progressbar" aria-label="Progress to free delivery" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="--w:${pct}%"></i></div></div>`;
  }

  function lineHTML(l, variant) {
    const p = l.product;
    const max = Cart.limit(p);
    const cat = catById(p.category);
    return `<div class="line${variant === 'lg' ? ' line-lg' : ''}" data-id="${p.id}">
      <a class="line-img" href="product.html?id=${p.id}"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy"></a>
      <div class="line-main">
        <div class="line-name"><a href="product.html?id=${p.id}">${esc(p.name)}</a></div>
        <div class="line-meta">${esc(cat ? cat.name : '')}${p.stock <= 5 ? ' · Only ' + p.stock + ' left' : ''}</div>
        <div class="line-actions">
          <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}">
            <button type="button" data-line-act="dec" data-id="${p.id}" aria-label="Decrease quantity">${icon('minus')}</button>
            <output aria-live="polite">${l.qty}</output>
            <button type="button" data-line-act="inc" data-id="${p.id}" aria-label="Increase quantity"${l.qty >= max ? ' disabled' : ''}>${icon('plus')}</button>
          </div>
          <button type="button" class="link-btn" data-line-act="remove" data-id="${p.id}">Remove</button>
        </div>
      </div>
      <div class="line-price">${money(p.price * l.qty)}${l.qty > 1 ? '<small>' + money(p.price) + ' each</small>' : ''}</div>
    </div>`;
  }

  /* Re-render a container but keep keyboard focus on the same stepper button */
  function keepFocus(container, fn) {
    const a = document.activeElement;
    const key = a && container.contains(a) && a.dataset && a.dataset.lineAct ? [a.dataset.lineAct, a.dataset.id] : null;
    fn();
    if (key) {
      const el = container.querySelector('[data-line-act="' + key[0] + '"][data-id="' + key[1] + '"]') ||
                 container.querySelector('[data-line-act="inc"][data-id="' + key[1] + '"]');
      if (el) el.focus({ preventScroll: true });
    }
  }

  function searchProducts(q) {
    const terms = (q || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return PRODUCTS.filter((p) => {
      const cat = catById(p.category);
      const hay = (p.name + ' ' + p.tagline + ' ' + (cat ? cat.name : '') + ' ' + p.description).toLowerCase();
      return terms.every((t) => hay.indexOf(t) !== -1);
    });
  }

  /* ------------------------------------------------------------------
     Toasts
     ------------------------------------------------------------------ */
  function toast(msg, opts) {
    opts = opts || {};
    const wrap = $('#toasts');
    if (!wrap) return;
    const el = document.createElement('div');
    el.className = 'toast' + (opts.type ? ' ' + opts.type : '');
    el.setAttribute('role', 'status');
    el.innerHTML = icon(opts.type === 'error' ? 'alert' : 'check') + '<span class="toast-msg">' + esc(msg) + '</span>' +
      (opts.action ? '<button type="button" class="toast-action">' + esc(opts.action.label) + '</button>' : '');
    wrap.appendChild(el);
    const dismiss = () => { el.classList.add('is-out'); setTimeout(() => el.remove(), 320); };
    if (opts.action) el.querySelector('.toast-action').addEventListener('click', () => { opts.action.run(); dismiss(); });
    setTimeout(dismiss, opts.duration || 3800);
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  let revealIO = null;
  function observeReveals(root) {
    const els = $$('.reveal', root || document);
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.remove('reveal')); return; }
    revealIO = revealIO || new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        revealIO.unobserve(el);
        el.classList.add('is-visible');
        const delay = parseInt(getComputedStyle(el).getPropertyValue('--d'), 10) || 0;
        /* Remove the helper classes afterwards so hover transitions on cards work normally */
        setTimeout(() => el.classList.remove('reveal', 'is-visible'), 950 + delay);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    els.forEach((el) => { if (!el.dataset.rv) { el.dataset.rv = '1'; revealIO.observe(el); } });
  }

  /* Fill [data-*] placeholders from config */
  function hydrate(root) {
    root = root || document;
    hydrateIcons(root);
    $$('[data-price-of]', root).forEach((el) => { const p = byId(el.dataset.priceOf); if (p) el.textContent = money(p.price); });
    $$('[data-name-of]', root).forEach((el) => { const p = byId(el.dataset.nameOf); if (p) el.textContent = p.name; });
    $$('[data-compare-of]', root).forEach((el) => { const p = byId(el.dataset.compareOf); if (p && p.compareAt) el.textContent = money(p.compareAt); else el.hidden = true; });
    $$('[data-save-of]', root).forEach((el) => { const p = byId(el.dataset.saveOf); if (p && p.compareAt) el.textContent = 'Save ' + money(p.compareAt - p.price); else el.hidden = true; });
    $$('[data-store]', root).forEach((el) => { const v = STORE[el.dataset.store]; if (v != null) el.textContent = v; });
    $$('[data-free-over]', root).forEach((el) => { el.textContent = money(STORE.shipping.freeOver); });
    $$('[data-store-href]', root).forEach((el) => {
      const k = el.dataset.storeHref;
      const wa = 'https://wa.me/' + STORE.whatsapp + '?text=' + encodeURIComponent('Hi ' + STORE.name + ', I have a question.');
      el.href = k === 'email' ? 'mailto:' + STORE.email : k === 'phone' ? 'tel:' + STORE.phone.replace(/\s/g, '') : wa;
      if (k === 'whatsapp') { el.target = '_blank'; el.rel = 'noopener'; }
    });
    observeReveals(root);
  }

  /* ------------------------------------------------------------------
     Layout: header, mobile nav, footer, drawer, search, toasts
     ------------------------------------------------------------------ */
  const LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#c6ff3d"/><path d="M10.5 8.5v15M22 8.5l-11.5 7.5 11.5 7.5" fill="none" stroke="#0a0f00" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function buildLayout() {
    const cur = document.body.dataset.nav || document.body.dataset.page;
    const nav = [['index.html', 'Home', 'home'], ['shop.html', 'Shop', 'shop'], ['about.html', 'About', 'about'], ['contact.html', 'Contact', 'contact']];
    const navLinks = nav.map((n) => `<a href="${n[0]}"${cur === n[2] ? ' aria-current="page"' : ''}>${n[1]}</a>`).join('');
    const mobileLinks = nav.map((n) => `<a href="${n[0]}"${cur === n[2] ? ' aria-current="page"' : ''}>${n[1]}${icon('arrow-up-right')}</a>`).join('');
    const social = STORE.social || {};
    const socialLinks = [['instagram', 'Instagram', 'instagram'], ['x', 'X (Twitter)', 'x-brand'], ['youtube', 'YouTube', 'youtube']]
      .filter((s) => social[s[0]])
      .map((s) => `<a href="${esc(social[s[0]])}" target="_blank" rel="noopener noreferrer" aria-label="${s[1]}">${icon(s[2])}</a>`).join('');

    const headerHost = $('#site-header');
    if (headerHost) {
      headerHost.outerHTML = `
      <div class="topbar"><div class="container topbar-inner">
        <span>${icon('truck')}Free delivery on orders over <b>${money(STORE.shipping.freeOver)}</b></span>
        <span class="hide-sm">Pay on delivery in Port Harcourt, Lagos &amp; Abuja</span>
      </div></div>
      <header class="site-header" id="header">
        <div class="container header-inner">
          <button class="icon-btn menu-btn" type="button" data-open-menu aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav"><span class="i-menu">${icon('menu')}</span><span class="i-close">${icon('x')}</span></button>
          <a class="logo" href="index.html" aria-label="${esc(STORE.name)} — home">${LOGO}<span>${esc(STORE.name)}</span></a>
          <nav class="nav" aria-label="Main">${navLinks}</nav>
          <div class="header-actions">
            <button class="icon-btn" type="button" data-open-search aria-label="Search products">${icon('search')}</button>
            <button class="icon-btn cart-btn" type="button" data-open-cart aria-label="Open cart">${icon('bag')}<span class="cart-count" id="cart-count" aria-hidden="true">0</span></button>
          </div>
        </div>
      </header>
      <div class="mobile-nav" id="mobile-nav" aria-hidden="true">
        ${mobileLinks}
        <div class="mn-foot">${esc(STORE.address)}<br>${esc(STORE.email)}</div>
      </div>`;
    }

    const footerHost = $('#site-footer');
    if (footerHost) {
      const cats = STORE.categories.map((c) => `<a href="shop.html?category=${c.id}">${esc(c.name)}</a>`).join('');
      footerHost.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a class="logo" href="index.html" aria-label="${esc(STORE.name)} — home">${LOGO}<span>${esc(STORE.name)}</span></a>
              <p>${esc(STORE.tagline)}. Thoughtfully chosen audio, wearables and power gear, delivered across Nigeria.</p>
              ${socialLinks ? `<div class="socials">${socialLinks}</div>` : ''}
            </div>
            <div class="footer-col"><h4>Shop</h4><a href="shop.html">All products</a>${cats}</div>
            <div class="footer-col"><h4>Company</h4><a href="about.html">About us</a><a href="contact.html">Contact</a><a href="contact.html#faq">FAQs</a></div>
            <div class="footer-col"><h4>Support</h4><a href="contact.html#faq">Delivery &amp; returns</a><a href="contact.html#faq">Warranty</a><a href="https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent('Hi ' + STORE.name + ', I’d like to track my order.')}" target="_blank" rel="noopener">Track an order</a></div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} ${esc(STORE.name)}. All rights reserved.</span>
            <div class="pay-badges" aria-label="Accepted payments"><span>Visa</span><span>Mastercard</span><span>Verve</span><span>Bank transfer</span><span>Pay on delivery</span></div>
          </div>
        </div>
      </footer>`;
    }

    document.body.insertAdjacentHTML('beforeend', `
      <div class="overlay" id="search-overlay" aria-hidden="true">
        <div class="search-modal" role="dialog" aria-modal="true" aria-label="Search products">
          <div class="search-input-row">${icon('search')}<input id="search-input" type="search" placeholder="Search headphones, watches, chargers…" autocomplete="off" aria-label="Search products"><span class="kbd">Esc</span></div>
          <div class="search-results" id="search-results"></div>
        </div>
      </div>
      <div class="drawer-backdrop" id="drawer-backdrop" data-close-cart></div>
      <aside class="drawer" id="drawer" aria-label="Shopping cart" aria-hidden="true">
        <div class="drawer-head"><h3>Your cart<span id="drawer-count"></span></h3><button class="icon-btn" type="button" data-close-cart aria-label="Close cart">${icon('x')}</button></div>
        <div class="drawer-body" id="drawer-body"></div>
        <div class="drawer-foot" id="drawer-foot" hidden></div>
      </aside>
      <div class="toasts" id="toasts" aria-live="polite"></div>`);

    const header = $('#header');
    if (header) {
      const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* ---- mobile menu ---- */
  function setMenu(open) {
    const nav = $('#mobile-nav'), btn = $('[data-open-menu]');
    if (!nav || !btn) return;
    nav.classList.toggle('is-open', open);
    nav.setAttribute('aria-hidden', String(!open));
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('no-scroll', open);
  }

  /* ---- cart drawer ---- */
  let lastFocus = null;
  function renderDrawer() {
    const body = $('#drawer-body'), foot = $('#drawer-foot'), count = $('#drawer-count');
    if (!body) return;
    const lines = Cart.lines();
    count.textContent = lines.length ? '(' + Cart.count() + ')' : '';
    keepFocus(body, () => {
      if (!lines.length) {
        body.innerHTML = `<div class="empty"><span class="empty-ico">${icon('bag')}</span><h3>Your cart is empty</h3><p>Nothing here yet. Let’s find something you’ll love.</p><a class="btn btn-primary" href="shop.html">Start shopping</a></div>`;
        foot.hidden = true;
        return;
      }
      const t = totals('standard');
      body.innerHTML = shipMeter(t) + lines.map((l) => lineHTML(l)).join('');
      foot.hidden = false;
      foot.innerHTML = `
        <div class="sum-row"><span>Subtotal</span><strong>${money(t.sub)}</strong></div>
        ${t.disc ? `<div class="sum-row"><span>Discount</span><span class="disc">-${money(t.disc)}</span></div>` : ''}
        <p class="muted" style="font-size:.82rem;margin:2px 0 16px">Delivery is calculated at checkout.</p>
        <a class="btn btn-primary btn-lg btn-block" href="checkout.html">Checkout ${icon('arrow-right')}</a>
        <a class="btn btn-ghost btn-block" href="cart.html">View full cart</a>`;
    });
  }
  function openDrawer() {
    const d = $('#drawer');
    if (!d) return;
    setMenu(false);
    closeSearch();
    renderDrawer();
    lastFocus = document.activeElement;
    d.classList.add('is-open');
    d.setAttribute('aria-hidden', 'false');
    $('#drawer-backdrop').classList.add('is-open');
    document.body.classList.add('no-scroll');
    setTimeout(() => { const c = $('[data-close-cart]', d); if (c) c.focus({ preventScroll: true }); }, 60);
  }
  function closeDrawer() {
    const d = $('#drawer');
    if (!d || !d.classList.contains('is-open')) return;
    d.classList.remove('is-open');
    d.setAttribute('aria-hidden', 'true');
    $('#drawer-backdrop').classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ---- search overlay ---- */
  let searchIdx = 0, searchNav = false;
  function renderSearch(q) {
    const box = $('#search-results');
    q = (q || '').trim();
    searchIdx = 0; searchNav = false;
    let list, label;
    if (!q) { list = PRODUCTS.filter((p) => p.featured).slice(0, 4); label = 'Popular right now'; }
    else { list = searchProducts(q).slice(0, 6); label = list.length + ' result' + (list.length === 1 ? '' : 's'); }
    if (!list.length) {
      box.innerHTML = `<div class="search-empty">No products match “${esc(q)}”.<br>Try “headphones”, “watch” or “charger”.</div>`;
      return;
    }
    box.innerHTML = `<div class="search-label">${label}</div>` + list.map((p, i) => {
      const cat = catById(p.category);
      return `<a class="search-item${i === 0 ? ' is-active' : ''}" href="product.html?id=${p.id}"><img src="${p.image}" alt=""><span><span class="si-name">${esc(p.name)}</span><br><span class="si-meta">${esc(cat ? cat.name : '')} · ${esc(p.tagline)}</span></span><span class="si-price">${money(p.price)}</span></a>`;
    }).join('') + (q ? `<div class="search-foot"><span>Press Enter to see all results</span><a href="shop.html?q=${encodeURIComponent(q)}">View all</a></div>` : '');
  }
  function openSearch() {
    const o = $('#search-overlay');
    if (!o) return;
    closeDrawer(); setMenu(false);
    lastFocus = document.activeElement;
    o.classList.add('is-open');
    o.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    const input = $('#search-input');
    input.value = '';
    renderSearch('');
    setTimeout(() => input.focus(), 60);
  }
  function closeSearch() {
    const o = $('#search-overlay');
    if (!o || !o.classList.contains('is-open')) return;
    o.classList.remove('is-open');
    o.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function moveSearch(dir) {
    const items = $$('#search-results .search-item');
    if (!items.length) return;
    searchNav = true;
    items[searchIdx].classList.remove('is-active');
    searchIdx = (searchIdx + dir + items.length) % items.length;
    items[searchIdx].classList.add('is-active');
    items[searchIdx].scrollIntoView({ block: 'nearest' });
  }

  function trapTab(e, container) {
    if (e.key !== 'Tab' || !container) return;
    const f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', container).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---- cart count badge ---- */
  function updateCount(bump) {
    const el = $('#cart-count');
    if (!el) return;
    const n = Cart.count();
    el.textContent = n > 99 ? '99+' : n;
    el.classList.toggle('has-items', n > 0);
    const btn = el.closest('button');
    if (btn) btn.setAttribute('aria-label', 'Open cart, ' + n + ' item' + (n === 1 ? '' : 's'));
    if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }

  /* ------------------------------------------------------------------
     Global events
     ------------------------------------------------------------------ */
  function bindEvents() {
    document.addEventListener('click', (e) => {
      const t = e.target;

      const add = t.closest('[data-add]');
      if (add) {
        e.preventDefault();
        const p = byId(add.dataset.add);
        if (!p) return;
        if (Cart.add(p.id, 1)) toast(p.name + ' added to cart', { action: { label: 'View cart', run: openDrawer } });
        else toast(p.stock <= 0 ? 'Sorry, that item is sold out.' : 'You’ve reached the maximum quantity for this item.', { type: 'error' });
        return;
      }

      const act = t.closest('[data-line-act]');
      if (act) {
        const id = act.dataset.id;
        const line = Cart.items.find((i) => i.id === id);
        if (!line) return;
        const a = act.dataset.lineAct;
        if (a === 'inc') Cart.setQty(id, line.qty + 1);
        else if (a === 'dec') Cart.setQty(id, line.qty - 1);
        else Cart.remove(id);
        return;
      }

      if (t.closest('[data-open-cart]')) { openDrawer(); return; }
      if (t.closest('[data-close-cart]')) { closeDrawer(); return; }
      if (t.closest('[data-open-search]')) { openSearch(); return; }
      if (t.id === 'search-overlay') { closeSearch(); return; }
      if (t.closest('[data-open-menu]')) { setMenu(!$('#mobile-nav').classList.contains('is-open')); return; }
      if (t.closest('#mobile-nav a')) { setMenu(false); return; }
      if (t.closest('#search-results a')) { closeSearch(); }
      if (t.closest('#drawer a')) { closeDrawer(); }
    });

    document.addEventListener('keydown', (e) => {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag);
      if (e.key === 'Escape') { closeSearch(); closeDrawer(); setMenu(false); return; }
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); openSearch(); return; }
      if ($('#drawer') && $('#drawer').classList.contains('is-open')) trapTab(e, $('#drawer'));
      if ($('#search-overlay') && $('#search-overlay').classList.contains('is-open')) {
        trapTab(e, $('.search-modal'));
        if (e.key === 'ArrowDown') { e.preventDefault(); moveSearch(1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); moveSearch(-1); }
        if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'search-input') {
          e.preventDefault();
          const q = $('#search-input').value.trim();
          const items = $$('#search-results .search-item');
          if (searchNav && items[searchIdx]) window.location.href = items[searchIdx].getAttribute('href');
          else if (q) window.location.href = 'shop.html?q=' + encodeURIComponent(q);
        }
      }
    });

    const si = $('#search-input');
    if (si) si.addEventListener('input', () => renderSearch(si.value));

    window.addEventListener('resize', () => { if (window.innerWidth > 860) setMenu(false); });

    document.addEventListener('cart:change', (e) => {
      updateCount(e.detail && e.detail.type === 'add');
      renderDrawer();
    });
    /* keep multiple tabs in sync */
    window.addEventListener('storage', (e) => {
      if (e.key === CART_KEY || e.key === COUPON_KEY) {
        Cart.items = storage.get(CART_KEY, []);
        Cart.coupon = storage.get(COUPON_KEY, null);
        document.dispatchEvent(new CustomEvent('cart:change', { detail: { type: 'sync' } }));
      }
    });
  }

  /* ------------------------------------------------------------------
     Init + public API for pages.js
     ------------------------------------------------------------------ */
  buildLayout();
  bindEvents();
  hydrate(document);
  updateCount(false);
  renderDrawer();

  window.Kirvon = {
    STORE, PRODUCTS, $, $$, esc, money, byId, catById, discountPct, storage, reduceMotion,
    icon, stars, productCard, lineHTML, shipMeter, totals, keepFocus, searchProducts,
    Cart, toast, openDrawer, closeDrawer, openSearch, hydrate, observeReveals
  };
})();
