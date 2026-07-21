# NaapBook — explainer site

A standalone marketing/explainer page for **NaapBook**, the measurement vault and
stitching-order delivery tracker for small Indian tailors and boutiques.

> **Every naap saved. Every order on time.** — pricing on discovery, subscription basis

This is *not* the product UI. It is a polished, self-contained landing page that
makes the idea instantly clear to a non-technical shop owner and to an investor
skimming for 30 seconds.

## What the product does

Every small tailor keeps two things in their head — each customer's measurements and
which order is promised for which day — and both get lost. NaapBook saves the
measurements once and tracks every stitching order from taken to delivered:

- **Measurement vault** — each customer's measurements saved once, per garment, reused forever.
- **Order with a promised date** — garment, qty, order/delivery/trial dates, amount, advance.
- **Six-stage order machine** — taken → cutting → stitching → trial → ready → delivered.
- **Auto-WhatsApp** — a "trial ready" message on trial, a "ready for pickup" message on ready.
- **Overdue-flagged delivery board** — pending orders sorted by delivery date, late ones in red.
- **Advance & balance ledger** — record advances; the pickup balance is always correct.
- **Dashboard** — overdue / due-this-week / ready-for-pickup / in-progress counts at a glance.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — all sections, inline SVG only. |
| `styles.css` | All styling. Palette built around the violet accent `#7c3aed`. |
| `app.js` | Sticky-nav highlight, smooth scroll, and the animated hero "delivery board" where a finished order moves to ready and its pickup message queues. No dependencies. |
| `favicon.svg` | Order-book mark. |
| `og.svg` / `og.png` | 1200×630 social preview (SVG source + rendered PNG). |

## Design notes

- Palette: violet accent `#7c3aed`, deep violet-black ink, soft violet-tinted paper,
  a muted lilac tint, and a burnt-orange warning colour for overdue orders.
- **Signature:** numbers, dates and stages are set in tabular monospace, so the page
  reads like a tailor's order book. The hero widget is a live delivery board where a
  finished order visibly moves stitched → ready → pickup message sent.
- Fully self-contained: no CDNs, no external fonts, images or scripts. System font
  stack only. Renders correctly opened as a local `file://` and deploys to any
  static host unchanged.
- Responsive down to mobile with no horizontal page scroll; the wide delivery-board
  table scrolls inside its own container.
- Respects `prefers-reduced-motion` (the hero animation freezes on its end-state).

## Run it

Just open `index.html` in a browser. No build step. To serve locally:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Pushed to `main`, GitHub Actions (`.github/workflows/deploy-pages.yml`) publishes the
folder to GitHub Pages verbatim (`.nojekyll` is present). Works unchanged on any
static host (Netlify, Cloudflare Pages, S3).

---

A **KARYA** studio build · sreeni.nintendo@gmail.com
