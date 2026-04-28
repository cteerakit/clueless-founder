# Clueless Founder

Minimal blog built with **Astro 6** and **Tailwind CSS v4**. The site is fully pre-rendered and deployed on **Cloudflare Pages**. Newsletter signups are handled by a tiny standalone **Cloudflare Worker** that forwards to [Plunk](https://www.useplunk.com/) (`/v1/track`).

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

Typecheck:

```bash
npx astro check
```

## Configuration

### Site URL

[`astro.config.mjs`](astro.config.mjs) sets `site` for canonical URLs, RSS, and the sitemap. Change `https://cluelessfounder.com` to your domain before going live.

### Plunk — newsletter form (Worker endpoint)

The newsletter modal calls `PUBLIC_NEWSLETTER_ENDPOINT`, which should point to your deployed newsletter Worker URL.

1. Deploy the Worker from [`workers/newsletter/`](workers/newsletter/).
2. Add secret `PLUNK_PUBLIC_KEY` to that Worker:

```bash
wrangler secret put PLUNK_PUBLIC_KEY --config workers/newsletter/wrangler.jsonc
```

3. Set `ALLOWED_ORIGIN` in [`workers/newsletter/wrangler.jsonc`](workers/newsletter/wrangler.jsonc) to your site domain.
4. In your site environment (Pages), set:
   - `PUBLIC_NEWSLETTER_ENDPOINT=https://<your-worker-subdomain>.workers.dev`

### Plunk — broadcast drafts (GitHub Actions)

[`scripts/broadcast.js`](scripts/broadcast.js) creates **draft** campaigns via `POST https://next-api.useplunk.com/campaigns` for Markdown files under `src/content/blog/` where `newsletter: true` and `draft: false`, and only if the post id is not already listed in [`.broadcasts/log.json`](.broadcasts/log.json).

1. Add a **repository secret** `PLUNK_SECRET_KEY` with your Plunk **secret** key (`sk_*`).
2. Push to `main` (or run the workflow manually). The workflow runs `scripts/broadcast.js` and commits updates to `.broadcasts/log.json` when new drafts are created.
3. Open the Plunk dashboard, review each draft campaign, then send when ready.

## Content

- Posts live in [`src/content/blog/`](src/content/blog/).
- Schema is defined in [`src/content.config.ts`](src/content.config.ts): `title`, `description`, `pubDate`, `category`, `newsletter`, `draft`.

## Deploy (Cloudflare)

### 1) Deploy static site to Pages

```bash
npm run deploy:pages
```

Or configure Cloudflare Pages CI:
- Build command: `npm run build`
- Build output directory: `dist`

### 2) Deploy newsletter Worker

```bash
npm run deploy:newsletter-worker
```
