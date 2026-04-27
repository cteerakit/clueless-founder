# Clueless Founder

Minimal blog built with **Astro 6**, **Tailwind CSS v4**, and **Cloudflare Workers**. Newsletter signups go through [Plunk](https://www.useplunk.com/) (`/v1/track`). Optional GitHub Actions workflow drafts **campaigns** in Plunk when you publish eligible posts (see below).

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

### Plunk — newsletter form (Workers)

The subscribe action calls Plunk’s **public** API with your **public** key (`pk_*`).

1. Create a Plunk project and copy the **public** API key.
2. Set **`PLUNK_PUBLIC_KEY`** where Cloudflare/W Workers read env vars:
   - **Local:** add to [`wrangler.jsonc`](wrangler.jsonc) under `vars`, or use `wrangler secret` / `.dev.vars` per [Wrangler docs](https://developers.cloudflare.com/workers/configuration/environment-variables/).
   - **Production:** set the variable in the Cloudflare dashboard for your Worker, or via `wrangler deploy` with vars.

After changing bindings, run `npm run generate-types` so `worker-configuration.d.ts` stays in sync.

### Plunk — broadcast drafts (GitHub Actions)

[`scripts/broadcast.js`](scripts/broadcast.js) creates **draft** campaigns via `POST https://next-api.useplunk.com/campaigns` for Markdown files under `src/content/blog/` where `newsletter: true` and `draft: false`, and only if the post id is not already listed in [`.broadcasts/log.json`](.broadcasts/log.json).

1. Add a **repository secret** `PLUNK_SECRET_KEY` with your Plunk **secret** key (`sk_*`).
2. Push to `main` (or run the workflow manually). The workflow runs `scripts/broadcast.js` and commits updates to `.broadcasts/log.json` when new drafts are created.
3. Open the Plunk dashboard, review each draft campaign, then send when ready.

## Content

- Posts live in [`src/content/blog/`](src/content/blog/).
- Schema is defined in [`src/content.config.ts`](src/content.config.ts): `title`, `description`, `pubDate`, `category`, `newsletter`, `draft`.

## Deploy (Cloudflare)

Use the generated [`wrangler.jsonc`](wrangler.jsonc) and the [Astro Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/). Example:

```bash
npx wrangler deploy
```

Ensure production env includes `PLUNK_PUBLIC_KEY` if you use the newsletter form.
