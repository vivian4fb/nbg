# Oxyniti — Nano-Bubble Aeration Website

Marketing site for **Oxyniti**, a nano-bubble generator that raises and holds
dissolved oxygen in fish ponds — built for South Indian aquaculture.

**Tagline:** Infinite Oxygen. Infinite Yield. · எல்லையற்ற ஆக்ஸிஜன், எல்லையற்ற மகசூல்.

## Stack

Pure static HTML/CSS/JS — no build step, no dependencies (Google Fonts is the
only external resource). Deploy the folder as-is to any static host
(GitHub Pages, Netlify, Vercel, any shared host).

```
index.html        # single-page site (all sections)
css/style.css     # "Deep Lagoon" design system
js/main.js        # bubbles canvas, parallax, counters, gallery, ROI slider
assets/           # logo/favicon SVG, web-encoded field videos, posters
```

## Before going live

1. **Contact details** — fill the `CONTACT` object at the top of
   [`js/main.js`](js/main.js) (phone, WhatsApp number, email). The lead form
   and the Call/WhatsApp buttons are placeholders until then.
2. **ROI calculator** — assumptions (baseline yield, uplift range) are marked
   illustrative in `js/main.js`; update once real device specs are final.

## Run with Docker

```bash
docker compose up -d --build     # serves on http://localhost:8080
```

or manually:

```bash
docker build -t oxyniti-website .
docker run -d -p 8080:80 --name oxyniti-web oxyniti-website
```

The image is nginx-alpine (~50 MB + assets) with gzip and cache headers
pre-configured ([nginx.conf](nginx.conf)). Deploy it to any container host
(Cloud Run, Fly.io, Azure Container Apps, a ₹300/mo VPS…).

## Dev notes

- Append `?shot=1` to the URL to disable the preloader and reveal animations
  (used for automated screenshots).
- Videos are muted, `faststart`-encoded MP4s (~15 MB total) re-encoded from
  field footage with ffmpeg.
