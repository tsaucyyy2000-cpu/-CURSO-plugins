# Fuji Card Shop (clone)

A clean rebuild of [www.fujicardshop.com](https://www.fujicardshop.com/) for the Fuji Card Project.

Japanese sealed TCG storefront (Pokémon, ONE PIECE, and other titles) with catalog, category pages, product detail, policies, contact, and a **local cart/checkout stub**.

## Stack

- Next.js (App Router) + TypeScript
- CSS (no Tailwind) with a Fuji mist / vermillion brand system
- Client-side cart via `localStorage` (no payment backend)

## Start locally

```bash
cd fuji-card-shop
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
```

## What’s included

- Home (hero, releases, story, featured/sale products, announcements, why Fuji)
- Store + category routes (`pokemon`, `one-piece`, `other-tcg`, Weiss, UNION ARENA, hololive, Gundam)
- Product detail pages with add-to-cart
- Cart + checkout stub (no real payments)
- Shipping / taxes, right to cancel, terms, privacy, Specified Commercial Transaction Act, fake-accounts advisory
- About + contact (forms do not send email)

## Gaps vs the live shop

| Live shop | This rebuild |
| --- | --- |
| WooCommerce cart, payments (card / Google Pay / Apple Pay / PayPal), tariffs at checkout | Local cart + checkout stub only |
| Full WP product catalog + pagination + variants | Curated inventory pulled from crawled pages |
| Hosted product photography | Stylized product art (live CDN blocked from this environment; image URLs noted where known) |
| Account / My Account | Not implemented |
| Live contact inbox | Front-end form stub |

Source inventory and plan: Project doc `docs/fuji-card-shop-clone.md`.
