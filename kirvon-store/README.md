# KIRVON — dark, modern online store (static site)

A complete multi-page e-commerce front end: plain HTML, CSS and JavaScript, **no build step, no dependencies**.
The catalogue (12 tech & gear products) is placeholder content. Swap it for your own in minutes.

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Hero, categories, best sellers, spotlight, new arrivals, promo banner, trust points, testimonials, newsletter |
| Shop | `shop.html` | Category chips, live search, sorting. Filters live in the URL (`?category=audio&sort=price-asc&q=watch`) |
| Product | `product.html?id=…` | Gallery with hover-zoom, quantity, add to cart / buy now, specs, delivery, related items, sticky mobile buy bar |
| Cart | `cart.html` | Quantity controls, free-delivery progress, discount codes |
| Checkout | `checkout.html` | Validated form, delivery + payment choices, live totals |
| Order confirmed | `success.html` | Order summary, bank details (for transfer orders) |
| About / Contact | `about.html`, `contact.html` | Story, animated stats, contact cards, form, FAQ |
| Not found | `404.html` | Branded error page. Netlify, Cloudflare Pages and GitHub Pages use it automatically |

Also included: slide-out cart drawer, `/`-to-search overlay, toast messages, mobile menu, keyboard focus styles,
skip link, reduced-motion support, and a cart that survives page reloads (saved in `localStorage`).

---

## Run it

```bash
cd kirvon-store
python3 dev-server.py 8000        # then open http://localhost:8000
```

Any static server works (`npx serve .`, VS Code Live Server, …). Just open the folder over HTTP rather than double-clicking the file.

## Make it yours

**1. Store details and products: `assets/js/data.js`**
Everything lives here: name, tagline, currency, locale, contact details, bank details, categories, delivery prices,
free-delivery threshold, coupon codes, list of states, and all products.

```js
{
  id: 'my-new-product',              // used in the URL: product.html?id=my-new-product
  name: 'My New Product',
  tagline: 'One line that sells it.',
  category: 'audio',                 // must match a category id
  price: 45000, compareAt: 52000,    // compareAt is optional (shows the strikethrough + % off)
  rating: 4.7, reviews: 120,         // sample numbers: replace with real ones, or remove the rating UI
  badge: 'New', featured: true,      // featured = shown in "Best sellers" on the home page
  added: '2026-10-01', stock: 20,    // stock: 0 shows "Sold out". Low stock (≤5) shows "Only N left"
  image: 'assets/img/products/my-new-product.jpg',
  description: '…', features: ['…', '…'], specs: { 'Battery': '40 h' }
}
```

**2. Images:** drop files in `assets/img/products/` (square, ~1200 px works best; WebP is fine) and point `image` at them.
Two wide (16:9) banner photos are used too: `assets/img/promo.jpg` (home-page promo banner, headphones on the right, empty space on the left for the text) and `assets/img/about.jpg` (About page header). Replace them with your own. The promo's product and price come from `data.js` (see the `data-*-of` attributes in `index.html`).

**3. Look and feel:** the colour tokens are at the top of `assets/css/styles.css` (`--accent` is the lime; change it and the whole site follows).
Fonts (Inter + Space Grotesk) are self-hosted in `assets/fonts/`, so there are no external requests.

**4. Copy:** hero, promo banner and testimonials in `index.html`, story/stats in `about.html`, FAQ and hours in `contact.html`,
the top-bar message in `core.js` (search for `topbar`).

**5. Logo:** the "K" mark is an inline SVG in `core.js` (`LOGO`) plus `favicon.svg`.

### Other country or currency?
Set `currency` and `locale` in `data.js`, replace the `states` list, `codStates` and the shipping prices, and update the
Nigeria-specific copy ("Port Harcourt", "36 states and the FCT", Naira mentions). The phone-number check is the `phone`
rule in `checkout()` inside `assets/js/pages.js`.

## Payments, orders and forms (important)

This is a **front end**. As shipped, checkout is a **simulation**: it validates the form, waits about a second, saves the
order in the visitor's browser and shows the confirmation page. **No money moves and no order is sent to you.**
`demoMode: true` shows a "Demo store" banner for that reason. Set it to `false` when you've wired up the real thing.

To go live you need a small backend (or a service that provides one):

1. **Take payment.** The hook is `processPayment(order)` in `assets/js/pages.js` (it must return a Promise: resolve on
   success, reject on failure or cancel). Example sketch with Paystack's inline popup (add
   `<script src="https://js.paystack.co/v1/inline.js"></script>` to `checkout.html`):

   ```js
   function processPayment(order) {
     return new Promise((resolve, reject) => {
       PaystackPop.setup({
         key: 'pk_live_xxxxxxxx',
         email: order.customer.email,
         amount: order.totals.total * 100,          // kobo
         ref: order.id,
         onClose: () => reject(new Error('cancelled')),
         callback: () => resolve()
       }).openIframe();
     });
   }
   ```
   Flutterwave, Stripe Checkout and others follow the same pattern. Check the provider's current docs.
2. **Record the order and confirm payment on the server.** Receive the provider's webhook, verify the transaction, and
   re-calculate prices server-side. Never trust totals sent from the browser. Then email yourself and the customer.
3. **Contact form and newsletter** (`contact()` and `home()` in `pages.js`) currently only show a success message.
   Replace the toast with a `fetch()` to Formspree, Netlify Forms, your own API, or your email-marketing provider.
4. **Bank details** shown after a transfer order are placeholders in `data.js` (`bank`).

## Deploy

The folder *is* the site. Drag it into Netlify Drop, or use Cloudflare Pages, Vercel, GitHub Pages or any web host.
`dev-server.py` and this README aren't needed in production.

## Before you launch: checklist

- [ ] Replace placeholder contact info, address, WhatsApp number, bank details and social links (`data.js`)
- [ ] Replace **sample** content: ratings and review counts, the three testimonials, and the stats ("2,400+ customers", "4.8 average", "36 states")
- [ ] Replace the product photos, the two banner images (`promo.jpg`, `about.jpg`) and the prices with your real ones
- [ ] Wire real payments and form handling (see above), then set `demoMode: false`
- [ ] Check the delivery, returns (7 days) and warranty (12 months) wording against your real policies
- [ ] Add Privacy / Terms pages and link them from the footer
- [ ] Add a `<link rel="canonical">`, Open Graph image and analytics if you want them

## Credits and licences

- **Fonts:** Inter and Space Grotesk are bundled in `assets/fonts/` under the SIL Open Font License 1.1 (see `OFL-Inter.txt` and `OFL-SpaceGrotesk.txt` in the same folder).
- **Images:** the product photos and the promo and About banners are AI-generated placeholders for fictional products. Replace them with photos of your real products (keep the file names, or update the `image` paths in `assets/js/data.js`).
- **Code:** this repository has no licence file yet, so by default all rights are reserved. Add one (for example MIT) if you want others to reuse it.

## Project map

```
index.html shop.html product.html cart.html checkout.html success.html about.html contact.html 404.html
favicon.svg  dev-server.py
assets/
  css/styles.css        theme tokens + every component
  js/data.js            ← store settings + products (edit this)
  js/core.js            cart, header/footer/drawer/search injection, toasts, shared helpers
  js/pages.js           one small controller per page
  fonts/                Inter + Space Grotesk (self-hosted)
  img/products/         product photography (12 images)
  img/promo.jpg         home-page promo banner (16:9)
  img/about.jpg         About page header (16:9)
```
