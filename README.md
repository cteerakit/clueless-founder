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

### Giscus — blog comments

Comments use [Giscus](https://giscus.app/) with GitHub Discussions as the backend.

1. Create or choose a GitHub repository for discussions.
2. Enable **Discussions** in that repository.
3. In Giscus, choose your repo + category and copy the generated values.
4. Set these environment variables in Cloudflare Pages:
   - `PUBLIC_GISCUS_REPO=owner/repo`
   - `PUBLIC_GISCUS_REPO_ID=<repo_id>`
   - `PUBLIC_GISCUS_CATEGORY=<category_name>`
   - `PUBLIC_GISCUS_CATEGORY_ID=<category_id>`
5. Optional overrides:
   - `PUBLIC_GISCUS_MAPPING=pathname` (default)
   - `PUBLIC_GISCUS_THEME=preferred_color_scheme` (default)
   - `PUBLIC_GISCUS_LANG=en` (default)
   - `PUBLIC_GISCUS_INPUT_POSITION=top` (default)
   - `PUBLIC_GISCUS_REACTIONS_ENABLED=1` (default)
   - `PUBLIC_GISCUS_STRICT=0` (default)
   - `PUBLIC_GISCUS_EMIT_METADATA=0` (default)

If required variables are missing, the comments section renders a fallback message instead of the embed.

### Plunk — broadcast drafts (GitHub Actions)

[`scripts/broadcast.js`](scripts/broadcast.js) creates **draft** campaigns via `POST https://next-api.useplunk.com/campaigns` for Markdown files under `src/content/blog/` where `newsletter: true` and `draft: false`, and only if the post id is not already listed in [`.broadcasts/log.json`](.broadcasts/log.json).

1. Add a **repository secret** `PLUNK_SECRET_KEY` with your Plunk **secret** key (`sk_*`).
2. Push to `main` (or run the workflow manually). The workflow runs `scripts/broadcast.js` and commits updates to `.broadcasts/log.json` when new drafts are created.
3. Open the Plunk dashboard, review each draft campaign, then send when ready.

## Content

- Posts live in [`src/content/blog/`](src/content/blog/).
- Schema is defined in [`src/content.config.ts`](src/content.config.ts): `title`, `description`, `pubDate`, `category`, `newsletter`, `draft`.

## Comments policy baseline

- **Identity model**: GitHub account required (managed by Giscus/GitHub).
- **Moderation**: moderate via GitHub Discussions (lock, hide, delete, or block users).
- **Anti-spam**: rely on GitHub account friction + discussion moderation tooling.
- **Privacy**: comments are hosted on GitHub Discussions; update your site privacy page/policy to disclose this third-party processing.

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
