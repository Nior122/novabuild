/* =====================================================================
   KIRVON — page controllers
   One small function per page, chosen by <body data-page="…">.
   Shared pieces (cart, header, drawer …) live in core.js.
   ===================================================================== */
(function () {
  'use strict';

  const V = window.Kirvon;
  const { STORE, PRODUCTS, $, $$, esc, money, byId, catById, discountPct, storage, icon, stars,
          productCard, lineHTML, shipMeter, totals, keepFocus, searchProducts, Cart, toast, openDrawer, hydrate } = V;

  const page = document.body.dataset.page;
  const qs = new URLSearchParams(window.location.search);
  const go = (url) => { window.location.href = url; };
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ==================================================================
     HOME
     ================================================================== */
  function home() {
    /* categories */
    $('#cat-grid').innerHTML = STORE.categories.map((c, i) => {
      const n = PRODUCTS.filter((p) => p.category === c.id).length;
      return `<a class="cat-card reveal" style="--d:${i * 90}ms" href="shop.html?category=${c.id}" aria-label="${esc(c.name)}, ${n} products">
        <img src="${c.image}" alt="" loading="lazy" width="800" height="800">
        <span class="cat-arrow">${icon('arrow-up-right')}</span>
        <div class="cat-info">
          <span class="cat-icon">${icon(c.icon)}</span>
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.blurb)}</p>
          <span class="cat-count">${n} product${n === 1 ? '' : 's'}</span>
        </div>
      </a>`;
    }).join('');

    /* best sellers */
    $('#featured-grid').innerHTML = PRODUCTS.filter((p) => p.featured).slice(0, 4).map(productCard).join('');

    /* new arrivals (horizontal scroller) */
    const sc = $('#new-scroller');
    sc.innerHTML = PRODUCTS.slice().sort((a, b) => b.added.localeCompare(a.added)).slice(0, 6).map(productCard).join('');
    $$('[data-scroll]').forEach((btn) => btn.addEventListener('click', () => {
      const dir = btn.dataset.scroll === 'next' ? 1 : -1;
      sc.scrollBy({ left: dir * Math.min(sc.clientWidth * 0.85, 620), behavior: 'smooth' });
    }));

    /* marquee: duplicate the content for a seamless loop */
    $$('.marquee-track').forEach((t) => { t.innerHTML += t.innerHTML; });

    /* newsletter (demo: nothing is sent anywhere) */
    const nl = $('#newsletter');
    nl.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#nl-email'), note = $('#nl-note');
      if (!EMAIL_RE.test(input.value.trim())) {
        note.textContent = 'Please enter a valid email address.';
        input.focus();
        return;
      }
      const code = Object.keys(STORE.coupons)[0];
      note.innerHTML = '<b>You’re in!</b> Use code <b>' + esc(code) + '</b> at checkout for your welcome discount.';
      input.value = ''; input.disabled = true;
      $('button', nl).disabled = true;
      toast('Subscribed. Check the note below for your code.');
    });

    hydrate(document);
  }

  /* ==================================================================
     SHOP
     ================================================================== */
  function shop() {
    const sorters = {
      featured: (a, b) => (Number(b.featured) - Number(a.featured)) || (PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b)),
      newest: (a, b) => b.added.localeCompare(a.added),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => (b.rating - a.rating) || (b.reviews - a.reviews)
    };
    const state = { cat: qs.get('category') || 'all', q: (qs.get('q') || '').trim(), sort: qs.get('sort') || 'featured' };
    if (state.cat !== 'all' && !catById(state.cat)) state.cat = 'all';
    if (!sorters[state.sort]) state.sort = 'featured';

    const chipsEl = $('#cat-chips'), grid = $('#shop-grid'), empty = $('#shop-empty'), count = $('#result-count');
    const title = $('#shop-title'), sub = $('#shop-sub'), crumbs = $('#crumbs'), search = $('#shop-search'), sortSel = $('#shop-sort');
    search.value = state.q;
    sortSel.value = state.sort;

    function renderChips() {
      const all = [{ id: 'all', name: 'All', n: PRODUCTS.length }]
        .concat(STORE.categories.map((c) => ({ id: c.id, name: c.name, n: PRODUCTS.filter((p) => p.category === c.id).length })));
      chipsEl.innerHTML = all.map((c) =>
        `<button type="button" class="chip${state.cat === c.id ? ' is-active' : ''}" data-cat="${c.id}" aria-pressed="${state.cat === c.id}">${esc(c.name)} <small>${c.n}</small></button>`).join('');
    }

    function apply() {
      let list = state.q ? searchProducts(state.q) : PRODUCTS.slice();
      if (state.cat !== 'all') list = list.filter((p) => p.category === state.cat);
      list.sort(sorters[state.sort]);

      const cat = state.cat === 'all' ? null : catById(state.cat);
      title.textContent = cat ? cat.name : 'All products';
      sub.textContent = cat ? cat.blurb + '.' : 'Premium audio, wearables and power gear, all in one place.';
      document.title = (cat ? cat.name : 'Shop') + ' — ' + STORE.name;
      crumbs.innerHTML = '<a href="index.html">Home</a><span class="sep">/</span>' + (cat
        ? '<a href="shop.html">Shop</a><span class="sep">/</span><span aria-current="page">' + esc(cat.name) + '</span>'
        : '<span aria-current="page">Shop</span>');
      count.textContent = list.length + (list.length === 1 ? ' product' : ' products') + (state.q ? ' for “' + state.q + '”' : '');

      grid.innerHTML = list.map(productCard).join('');
      grid.hidden = !list.length;
      empty.hidden = !!list.length;
      hydrate(grid);

      const hadFocus = chipsEl.contains(document.activeElement);
      renderChips();
      if (hadFocus) { const a = $('.is-active', chipsEl); if (a) a.focus({ preventScroll: true }); }

      const p = new URLSearchParams();
      if (state.cat !== 'all') p.set('category', state.cat);
      if (state.q) p.set('q', state.q);
      if (state.sort !== 'featured') p.set('sort', state.sort);
      try { window.history.replaceState(null, '', p.toString() ? '?' + p.toString() : window.location.pathname); } catch (e) { /* ignore */ }
    }

    chipsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      state.cat = b.dataset.cat;
      apply();
    });
    let timer;
    search.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => { state.q = search.value.trim(); apply(); }, 140);
    });
    sortSel.addEventListener('change', () => { state.sort = sortSel.value; apply(); });
    $('#clear-filters').addEventListener('click', () => {
      state.cat = 'all'; state.q = ''; state.sort = 'featured';
      search.value = ''; sortSel.value = 'featured';
      apply();
    });
    apply();
  }

  /* ==================================================================
     PRODUCT
     ================================================================== */
  function product() {
    const root = $('#product-root');
    const p = byId(qs.get('id'));

    if (!p) {
      document.title = 'Product not found — ' + STORE.name;
      root.innerHTML = `<div class="empty"><span class="empty-ico">${icon('search')}</span><h3>We couldn’t find that product</h3><p>It may have been removed, or the link might be incorrect.</p><a class="btn btn-primary" href="shop.html">Browse all products</a></div>`;
      $('#related-section').hidden = true;
      return;
    }

    document.title = p.name + ' — ' + STORE.name;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', p.tagline + ' ' + p.description.slice(0, 120) + '…');

    const cat = catById(p.category);
    const off = discountPct(p);
    const sold = p.stock <= 0;
    const max = Cart.limit(p);
    const badges = [];
    if (sold) badges.push('<span class="pill">Sold out</span>');
    else {
      if (p.badge) badges.push('<span class="pill pill-accent">' + esc(p.badge) + '</span>');
      if (off) badges.push('<span class="pill">-' + off + '%</span>');
    }
    const stock = sold ? '<span class="dot out"></span> Sold out'
      : p.stock <= 5 ? '<span class="dot warn"></span> Only ' + p.stock + ' left, order soon'
      : '<span class="dot"></span> In stock, ships within 24 hours';
    const specRows = Object.keys(p.specs).map((k) => `<tr><th scope="row">${esc(k)}</th><td>${esc(p.specs[k])}</td></tr>`).join('');

    root.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span class="sep">/</span><a href="shop.html">Shop</a><span class="sep">/</span><a href="shop.html?category=${cat.id}">${esc(cat.name)}</a><span class="sep">/</span><span aria-current="page">${esc(p.name)}</span></nav>
      <div class="pdp">
        <div class="pdp-gallery">
          <div class="pdp-image" id="pdp-image">
            <img src="${p.image}" alt="${esc(p.name)}" width="900" height="900">
            <div class="pc-badges">${badges.join('')}</div>
          </div>
          <div class="pdp-perks">
            <div class="perk">${icon('shield')}<span>12-month warranty</span></div>
            <div class="perk">${icon('truck')}<span>Nationwide delivery</span></div>
            <div class="perk">${icon('return')}<span>7-day easy returns</span></div>
          </div>
        </div>

        <div class="pdp-info">
          <a class="eyebrow" href="shop.html?category=${cat.id}">${esc(cat.name)}</a>
          <h1>${esc(p.name)}</h1>
          <p class="pdp-tagline">${esc(p.tagline)}</p>
          <div class="pdp-rating">${stars(p.rating, 18)}<span><strong>${p.rating.toFixed(1)}</strong> · ${p.reviews} reviews</span></div>
          <div class="pdp-price"><strong>${money(p.price)}</strong>${p.compareAt ? `<s>${money(p.compareAt)}</s><span class="save-pill">Save ${money(p.compareAt - p.price)}</span>` : ''}</div>
          <p class="pdp-desc">${esc(p.description)}</p>
          <ul class="check-list">${p.features.map((f) => `<li>${icon('check')}<span>${esc(f)}</span></li>`).join('')}</ul>
          <div class="stock-line">${stock}</div>

          <div class="buy-row" id="buy-row">
            <div class="qty" role="group" aria-label="Quantity">
              <button type="button" id="q-dec" aria-label="Decrease quantity">${icon('minus')}</button>
              <output id="q-val" aria-live="polite">1</output>
              <button type="button" id="q-inc" aria-label="Increase quantity">${icon('plus')}</button>
            </div>
            <button class="btn btn-primary btn-lg" id="add-btn" type="button"${sold ? ' disabled' : ''}>${sold ? 'Sold out' : 'Add to cart'}</button>
          </div>
          <button class="btn btn-ghost btn-lg btn-block" id="buy-now" type="button"${sold ? ' disabled' : ''}>Buy it now</button>

          <div class="delivery-box">
            <h4>${icon('truck')} Estimated delivery</h4>
            <div class="delivery-row"><span>Port Harcourt</span><span>1–2 business days</span></div>
            <div class="delivery-row"><span>Lagos &amp; Abuja</span><span>2–3 business days</span></div>
            <div class="delivery-row"><span>Other states</span><span>3–5 business days</span></div>
          </div>
        </div>
      </div>

      <div class="acc-group">
        <details class="acc" open>
          <summary>Specifications ${icon('chevron-down')}</summary>
          <div class="acc-body"><table class="spec-table"><tbody>${specRows}</tbody></table></div>
        </details>
        <details class="acc">
          <summary>Delivery ${icon('chevron-down')}</summary>
          <div class="acc-body">Orders are packed and dispatched within 24 hours on business days. Standard delivery takes 2–5 business days nationwide, and express delivery arrives the next business day in major cities. Delivery is free on orders over ${money(STORE.shipping.freeOver)}. You can also collect your order from our Port Harcourt pickup point.</div>
        </details>
        <details class="acc">
          <summary>Returns &amp; warranty ${icon('chevron-down')}</summary>
          <div class="acc-body">Return unused items in their original packaging within 7 days for a refund or exchange. Every ${esc(STORE.name)} product is covered by a 12-month warranty against manufacturing defects. Message us with your order number and we’ll repair or replace it.</div>
        </details>
      </div>

      <div class="sticky-buy" id="sticky-buy">
        <div class="sb-info"><div class="sb-name">${esc(p.name)}</div><div class="sb-price">${money(p.price)}</div></div>
        <button class="btn btn-primary" id="sticky-add" type="button"${sold ? ' disabled' : ''}>${sold ? 'Sold out' : 'Add to cart'}</button>
      </div>`;

    /* quantity + buy buttons */
    let qty = 1;
    const qVal = $('#q-val'), qDec = $('#q-dec'), qInc = $('#q-inc');
    const syncQty = () => { qVal.textContent = qty; qDec.disabled = qty <= 1; qInc.disabled = qty >= max; };
    qDec.addEventListener('click', () => { qty = Math.max(1, qty - 1); syncQty(); });
    qInc.addEventListener('click', () => { qty = Math.min(max, qty + 1); syncQty(); });
    syncQty();

    const addToCart = () => {
      const n = Cart.add(p.id, qty);
      if (!n) toast('You already have the maximum quantity of this item in your cart.', { type: 'error' });
      return n;
    };
    $('#add-btn').addEventListener('click', () => { if (addToCart()) openDrawer(); });
    $('#sticky-add').addEventListener('click', () => { if (addToCart()) openDrawer(); });
    $('#buy-now').addEventListener('click', () => { Cart.add(p.id, qty); go('checkout.html'); });

    /* sticky mobile buy bar: shown whenever the main buy row is off-screen (above or below),
       except right at the top of the page. (It's display:none on desktop.) */
    const sticky = $('#sticky-buy'), buyRow = $('#buy-row');
    if (!sold) {
      let ticking = false;
      const updateSticky = () => {
        ticking = false;
        const r = buyRow.getBoundingClientRect();
        const off = r.bottom < 0 || r.top > window.innerHeight;
        sticky.classList.toggle('is-visible', off && window.scrollY > 320);
      };
      const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateSticky); } };
      window.addEventListener('scroll', queue, { passive: true });
      window.addEventListener('resize', queue);
      updateSticky();
    }

    /* hover zoom (mouse devices only) */
    const zoom = $('#pdp-image');
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      zoom.addEventListener('mouseenter', () => zoom.classList.add('is-zoom'));
      zoom.addEventListener('mouseleave', () => zoom.classList.remove('is-zoom'));
      zoom.addEventListener('mousemove', (e) => {
        const r = zoom.getBoundingClientRect();
        zoom.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        zoom.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    }

    /* related products */
    const same = PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category);
    const other = PRODUCTS.filter((x) => x.id !== p.id && x.category !== p.category);
    $('#related-grid').innerHTML = same.concat(other).slice(0, 4).map(productCard).join('');
    hydrate(document);
  }

  /* ==================================================================
     CART
     ================================================================== */
  function cart() {
    const root = $('#cart-root');
    let msg = null;
    const hint = Object.keys(STORE.coupons)[0];

    function render() {
      keepFocus(root, () => {
        const lines = Cart.lines();
        if (!lines.length) {
          root.innerHTML = `<div class="panel"><div class="empty"><span class="empty-ico">${icon('bag')}</span><h3>Your cart is empty</h3><p>Looks like you haven’t added anything yet. Browse the collection and find something you’ll love.</p><a class="btn btn-primary btn-lg" href="shop.html">Start shopping</a></div></div>`;
          return;
        }
        const t = totals('standard');
        const n = Cart.count();
        const applied = Cart.coupon && STORE.coupons[Cart.coupon];
        root.innerHTML = `
        <div class="cart-layout">
          <div class="panel">
            ${shipMeter(t)}
            ${lines.map((l) => lineHTML(l, 'lg')).join('')}
            <div class="cart-foot">
              <a class="link-arrow" href="shop.html">${icon('arrow-left')} Continue shopping</a>
              <button type="button" class="link-btn" data-clear-cart>Clear cart</button>
            </div>
          </div>
          <aside class="panel summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <div class="sum-row"><span>Subtotal (${n} item${n === 1 ? '' : 's'})</span><span>${money(t.sub)}</span></div>
            ${applied ? `<div class="sum-row"><span>Discount <b>${esc(Cart.coupon)}</b> · <button type="button" class="link-btn" data-remove-coupon>remove</button></span><span class="disc">-${money(t.disc)}</span></div>` : ''}
            <div class="sum-row"><span>Delivery</span>${t.after >= STORE.shipping.freeOver ? '<span class="free">Free</span>' : '<span class="muted">Calculated at checkout</span>'}</div>
            <form class="coupon" id="coupon-form" novalidate>
              <label class="sr-only" for="coupon-input">Discount code</label>
              <input class="input" id="coupon-input" placeholder="Discount code" autocomplete="off" spellcheck="false">
              <button class="btn btn-ghost" type="submit">Apply</button>
            </form>
            <p class="coupon-msg${msg ? ' err' : ''}" role="status">${msg ? esc(msg) : 'Try <b>' + esc(hint) + '</b> for a discount.'}</p>
            <div class="sum-row total"><span>Estimated total</span><span>${money(t.after)}</span></div>
            <a class="btn btn-primary btn-lg btn-block" style="margin-top:18px" href="checkout.html">Proceed to checkout ${icon('arrow-right')}</a>
            <p class="secure-note">${icon('lock')} Secure checkout · Card, transfer or pay on delivery</p>
          </aside>
        </div>`;
      });
    }

    root.addEventListener('submit', (e) => {
      if (e.target.id !== 'coupon-form') return;
      e.preventDefault();
      const r = Cart.applyCoupon($('#coupon-input').value);
      if (r.ok) toast(r.msg);               /* cart:change triggers the re-render */
      else { msg = r.msg; render(); const i = $('#coupon-input'); if (i) i.focus(); }
    });
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-clear-cart]')) Cart.clear();
      if (e.target.closest('[data-remove-coupon]')) Cart.removeCoupon();
    });
    document.addEventListener('cart:change', () => { msg = null; render(); });
    render();
  }

  /* ==================================================================
     CHECKOUT
     ================================================================== */
  function checkout() {
    const form = $('#checkout-form'), emptyEl = $('#checkout-empty');
    if (!Cart.lines().length) { form.hidden = true; emptyEl.hidden = false; return; }

    if (STORE.demoMode) $('#demo-banner').hidden = false;

    /* states */
    const stateSel = $('#state');
    stateSel.insertAdjacentHTML('beforeend', STORE.states.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join(''));

    /* delivery methods */
    $('#ship-choices').innerHTML = STORE.shipping.methods.map((m, i) => `
      <label class="choice">
        <input type="radio" name="shipping" value="${m.id}"${i === 0 ? ' checked' : ''}>
        <span class="radio"></span>
        <span class="choice-ico">${icon(m.id === 'pickup' ? 'store' : m.id === 'express' ? 'zap' : 'truck')}</span>
        <span class="choice-body"><strong>${esc(m.label)}</strong><span>${esc(m.eta)}</span></span>
        <span class="choice-price" data-ship-price="${m.id}"></span>
      </label>`).join('');

    /* payment methods */
    const PAY = [
      { id: 'card', ico: 'card', title: 'Pay online with card', note: 'Visa, Mastercard or Verve' },
      { id: 'transfer', ico: 'bank', title: 'Bank transfer', note: 'Account details are shown after you place your order' },
      { id: 'cod', ico: 'cash', title: 'Pay on delivery', note: '' }
    ];
    const payBox = $('#pay-choices');
    payBox.innerHTML = PAY.map((m, i) => `
      <label class="choice" data-pay="${m.id}">
        <input type="radio" name="payment" value="${m.id}"${i === 0 ? ' checked' : ''}>
        <span class="radio"></span>
        <span class="choice-ico">${icon(m.ico)}</span>
        <span class="choice-body"><strong>${m.title}</strong><span>${m.note}</span></span>
      </label>`).join('');

    const isPickup = () => form.elements.shipping.value === 'pickup';

    function syncDelivery() {
      const pickup = isPickup();
      $('#address-fields').hidden = pickup;
      $('#pickup-note').hidden = !pickup;
      $('#pickup-address').textContent = STORE.address;
      /* pay on delivery availability */
      const label = $('[data-pay="cod"]', payBox), input = $('input', label), note = $('.choice-body span', label);
      const st = stateSel.value;
      const ok = pickup || STORE.codStates.indexOf(st) !== -1;
      label.classList.toggle('is-disabled', !ok);
      input.disabled = !ok;
      if (!ok && input.checked) form.elements.payment.value = 'card';
      note.textContent = pickup ? 'Pay at the store when you collect your order'
        : ok ? 'Pay the rider in cash or by transfer when your order arrives'
        : st ? 'Not available in ' + st + ' (offered in ' + STORE.codStates.join(', ') + ')'
        : 'Select your state to check availability';
    }

    function renderSummary() {
      const t = totals(form.elements.shipping.value);
      $('#sum-items').innerHTML = Cart.lines().map((l) => `
        <div class="sum-item">
          <div class="sum-thumb"><img src="${l.product.image}" alt=""><b>${l.qty}</b></div>
          <div class="nm">${esc(l.product.name)}</div>
          <div class="pr">${money(l.product.price * l.qty)}</div>
        </div>`).join('');
      $('#sum-sub').textContent = money(t.sub);
      $('#sum-disc-row').hidden = !t.disc;
      $('#sum-disc').textContent = '-' + money(t.disc);
      $('#sum-code').textContent = Cart.coupon || '';
      $('#sum-ship').innerHTML = t.ship === 0 ? '<span class="free">Free</span>' : money(t.ship);
      $('#sum-total').textContent = money(t.total);
      $('#place-total').textContent = money(t.total);
      STORE.shipping.methods.forEach((m) => {
        const el = $('[data-ship-price="' + m.id + '"]');
        if (el) { const tt = totals(m.id); el.innerHTML = tt.ship === 0 ? '<span style="color:var(--accent)">Free</span>' : money(tt.ship); }
      });
    }

    /* validation */
    const rules = {
      email: (v) => EMAIL_RE.test(v.trim()) || 'Enter a valid email address.',
      phone: (v) => /^(\+?234|0)[789][01]\d{8}$/.test(v.replace(/[\s\-()]/g, '')) || 'Enter a valid Nigerian phone number, e.g. 0803 123 4567.',
      firstName: (v) => v.trim().length > 1 || 'Please enter your first name.',
      lastName: (v) => v.trim().length > 1 || 'Please enter your last name.',
      address: (v) => v.trim().length > 5 || 'Please enter your delivery address.',
      city: (v) => v.trim().length > 1 || 'Please enter your city or town.',
      state: (v) => !!v || 'Please select your state.'
    };
    const ADDRESS_FIELDS = ['address', 'city', 'state'];
    function setError(name, message) {
      const el = form.elements[name];
      const field = el.closest('.field');
      field.classList.toggle('has-error', !!message);
      $('.field-error', field).textContent = message || '';
      el.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
    function checkField(name) {
      if (isPickup() && ADDRESS_FIELDS.indexOf(name) !== -1) { setError(name, ''); return true; }
      const r = rules[name](form.elements[name].value);
      setError(name, r === true ? '' : r);
      return r === true;
    }
    function validate() {
      let first = null;
      Object.keys(rules).forEach((name) => { if (!checkField(name) && !first) first = form.elements[name]; });
      if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus({ preventScroll: true }); }
      return !first;
    }
    form.addEventListener('focusout', (e) => { if (e.target.name && rules[e.target.name] && e.target.value) checkField(e.target.name); });
    form.addEventListener('input', (e) => { if (e.target.name && rules[e.target.name] && e.target.closest('.field').classList.contains('has-error')) checkField(e.target.name); });
    form.addEventListener('change', (e) => { if (e.target.name === 'shipping' || e.target.name === 'state') { syncDelivery(); renderSummary(); } });

    /* Payment hook. In demo mode it just waits a moment.
       To take real payments, call your gateway here (e.g. Paystack's inline popup:
       https://paystack.com/docs/payments/accept-payments/) and resolve once the
       payment succeeds, reject if it fails or is cancelled. */
    function processPayment(/* order */) {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    }

    const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const orderId = () => 'KRV-' + Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');

    let placing = false;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (placing) return;
      if (!validate()) { toast('Please fix the highlighted fields.', { type: 'error' }); return; }

      const f = form.elements;
      const method = STORE.shipping.methods.find((m) => m.id === f.shipping.value);
      const t = totals(method.id);
      const pickup = method.id === 'pickup';
      const order = {
        id: orderId(),
        placedAt: new Date().toISOString(),
        customer: { firstName: f.firstName.value.trim(), lastName: f.lastName.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim() },
        delivery: {
          method: method.id, label: method.label, eta: method.eta,
          address: pickup ? STORE.address : f.address.value.trim(),
          city: pickup ? '' : f.city.value.trim(),
          state: pickup ? '' : f.state.value,
          notes: f.notes.value.trim()
        },
        payment: f.payment.value,
        coupon: Cart.coupon,
        lines: Cart.lines().map((l) => ({ id: l.product.id, name: l.product.name, image: l.product.image, qty: l.qty, price: l.product.price })),
        totals: { sub: t.sub, disc: t.disc, ship: t.ship, total: t.total }
      };

      placing = true;
      const btn = $('#place-btn');
      btn.classList.add('is-loading');
      $('.lbl', btn).textContent = 'Placing your order…';
      processPayment(order).then(() => {
        storage.set('kirvon.lastOrder', order);
        Cart.clear();
        go('success.html');
      }).catch(() => {
        placing = false;
        btn.classList.remove('is-loading');
        $('.lbl', btn).textContent = 'Place order';
        toast('Payment didn’t go through. Please try again.', { type: 'error' });
      });
    });

    document.addEventListener('cart:change', () => {
      if (placing) return;
      if (!Cart.lines().length) { form.hidden = true; emptyEl.hidden = false; return; }
      renderSummary();
    });

    syncDelivery();
    renderSummary();
  }

  /* ==================================================================
     SUCCESS
     ================================================================== */
  function success() {
    const root = $('#success-root');
    const o = storage.get('kirvon.lastOrder', null);
    if (STORE.demoMode) $('#demo-banner').hidden = false;

    if (!o) {
      root.innerHTML = `<div class="empty"><span class="empty-ico">${icon('package')}</span><h3>No recent order found</h3><p>Once you place an order, your confirmation will appear here.</p><a class="btn btn-primary" href="shop.html">Browse products</a></div>`;
      return;
    }

    const payLabel = { card: 'Card payment', transfer: 'Bank transfer', cod: 'Pay on delivery' }[o.payment];
    const when = new Date(o.placedAt).toLocaleDateString(STORE.locale || 'en-NG', { day: 'numeric', month: 'long', year: 'numeric' });
    const d = o.delivery;
    const where = d.method === 'pickup' ? 'Store pickup, ' + d.address : d.address + ', ' + d.city + ', ' + d.state;

    let payNote = '';
    if (o.payment === 'transfer') {
      payNote = `<div class="bank-box"><strong>Complete your payment by transfer</strong>
        <dl><dt>Bank</dt><dd>${esc(STORE.bank.name)}</dd><dt>Account name</dt><dd>${esc(STORE.bank.holder)}</dd><dt>Account number</dt><dd>${esc(STORE.bank.account)}</dd><dt>Amount</dt><dd>${money(o.totals.total)}</dd><dt>Reference</dt><dd>${esc(o.id)}</dd></dl>
        <p class="muted" style="margin-top:10px;font-size:.85rem">Send proof of payment on WhatsApp so we can dispatch your order straight away.</p></div>`;
    } else if (o.payment === 'cod') {
      payNote = `<div class="bank-box"><strong>Pay on delivery</strong><p style="margin-top:6px">Please have <b>${money(o.totals.total)}</b> ready when your order arrives.</p></div>`;
    }

    root.innerHTML = `
      <div class="success-wrap">
        <div class="check-ring">${icon('check')}</div>
        <h1>Thank you, ${esc(o.customer.firstName)}!</h1>
        <p class="lead" style="margin:14px auto 0">Your order has been placed. A confirmation will be sent to <b style="color:var(--text)">${esc(o.customer.email)}</b>.</p>
        <span class="order-no">${esc(o.id)}</span>

        <div class="panel order-card">
          <div class="order-meta">
            <div><small>Date</small><span>${esc(when)}</span></div>
            <div><small>Payment</small><span>${esc(payLabel)}</span></div>
            <div><small>Delivery</small><span>${esc(d.label)} · ${esc(d.eta)}</span></div>
          </div>
          <div class="order-meta" style="grid-template-columns:1fr"><div><small>${d.method === 'pickup' ? 'Pickup point' : 'Deliver to'}</small><span>${esc(o.customer.firstName)} ${esc(o.customer.lastName)} · ${esc(where)}</span></div></div>
          <div class="sum-list">${o.lines.map((l) => `
            <div class="sum-item">
              <div class="sum-thumb"><img src="${l.image}" alt=""><b>${l.qty}</b></div>
              <div class="nm">${esc(l.name)}</div>
              <div class="pr">${money(l.price * l.qty)}</div>
            </div>`).join('')}</div>
          <div class="sum-row"><span>Subtotal</span><span>${money(o.totals.sub)}</span></div>
          ${o.totals.disc ? `<div class="sum-row"><span>Discount${o.coupon ? ' (' + esc(o.coupon) + ')' : ''}</span><span class="disc">-${money(o.totals.disc)}</span></div>` : ''}
          <div class="sum-row"><span>Delivery</span><span>${o.totals.ship === 0 ? '<span class="free">Free</span>' : money(o.totals.ship)}</span></div>
          <div class="sum-row total"><span>Total</span><span>${money(o.totals.total)}</span></div>
          ${payNote}
        </div>

        <div class="next-steps">
          <div class="value"><span class="value-ico">${icon('package')}</span><h3>We pack it</h3><p>Your order is packed and dispatched within 24 hours.</p></div>
          <div class="value"><span class="value-ico">${icon('chat')}</span><h3>We keep you posted</h3><p>Updates and tracking details come via WhatsApp and email.</p></div>
          <div class="value"><span class="value-ico">${icon('truck')}</span><h3>It arrives</h3><p>${esc(d.method === 'pickup' ? 'Ready for collection ' + d.eta.toLowerCase() + '.' : 'Estimated delivery: ' + d.eta + '.')}</p></div>
        </div>

        <div class="hero-cta" style="justify-content:center;margin-top:36px">
          <a class="btn btn-primary btn-lg" href="shop.html">Continue shopping</a>
          <a class="btn btn-ghost btn-lg" href="contact.html">Need help?</a>
        </div>
      </div>`;
  }

  /* ==================================================================
     ABOUT — animated counters
     ================================================================== */
  function about() {
    function run(el) {
      const end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || '0', 10), suffix = el.dataset.suffix || '';
      const fmt = (v) => v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      if (V.reduceMotion) { el.textContent = fmt(end); return; }
      const t0 = performance.now(), dur = 1500;
      (function tick(t) {
        const k = Math.min(1, (t - t0) / dur);
        el.textContent = fmt(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    }
    const els = $$('[data-count]');
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); run(en.target); } });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  }

  /* ==================================================================
     CONTACT (demo: the form doesn't send anything anywhere)
     ================================================================== */
  function contact() {
    const form = $('#contact-form');
    const rules = {
      name: (v) => v.trim().length > 1 || 'Please tell us your name.',
      email: (v) => EMAIL_RE.test(v.trim()) || 'Enter a valid email address.',
      message: (v) => v.trim().length > 9 || 'Please write a short message (at least 10 characters).'
    };
    function check(name) {
      const el = form.elements[name], field = el.closest('.field');
      const r = rules[name](el.value);
      field.classList.toggle('has-error', r !== true);
      $('.field-error', field).textContent = r === true ? '' : r;
      return r === true;
    }
    form.addEventListener('input', (e) => { if (rules[e.target.name] && e.target.closest('.field').classList.contains('has-error')) check(e.target.name); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let first = null;
      Object.keys(rules).forEach((n) => { if (!check(n) && !first) first = form.elements[n]; });
      if (first) { first.focus(); toast('Please complete the highlighted fields.', { type: 'error' }); return; }
      form.reset();
      toast('Message sent! We’ll reply within one business day.');
    });
  }

  /* ------------------------------------------------------------------ */
  const pages = { home, shop, product, cart, checkout, success, about, contact };
  if (pages[page]) pages[page]();
})();
