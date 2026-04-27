/**
 * Creates draft Plunk campaigns for posts with newsletter: true (and draft: false).
 * Idempotent via .broadcasts/log.json — skips post ids already recorded.
 * Does not auto-send; review and send from the Plunk dashboard.
 *
 * Env: PLUNK_SECRET_KEY (sk_*)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const LOG_PATH = path.join(ROOT, '.broadcasts', 'log.json');

const PLUNK_BASE = 'https://next-api.useplunk.com';

function wrapEmailHtml(title, innerHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;font-family:Inter,system-ui,sans-serif;background:#ffffff;color:#18181b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
<tr><td style="font-family:Georgia,'Instrument Serif',serif;font-size:22px;font-weight:400;padding-bottom:16px;color:#18181b;">${escapeHtml(title)}</td></tr>
<tr><td style="font-family:Inter,system-ui,sans-serif;font-size:17px;line-height:1.65;color:#3f3f46;">${innerHtml}</td></tr>
<tr><td style="padding-top:32px;font-size:13px;color:#a1a1aa;font-family:Inter,system-ui,sans-serif;">Sent from Clueless Founder · <a href="https://cluelessfounder.com" style="color:#71717a;">Website</a></td></tr>
</table></td></tr></table></body></html>`;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

async function readLog() {
  try {
    const raw = await fs.readFile(LOG_PATH, 'utf8');
    const data = JSON.parse(raw);
    const ids = new Set((data.broadcasts ?? []).map((b) => b.id));
    return { data, ids };
  } catch {
    return {
      data: { broadcasts: [] },
      ids: new Set(),
    };
  }
}

async function main() {
  const secret = process.env.PLUNK_SECRET_KEY;
  if (!secret || secret.startsWith('your_')) {
    console.error('Missing PLUNK_SECRET_KEY (secret key sk_*).');
    process.exitCode = 1;
    return;
  }

  const entries = await fs.readdir(BLOG_DIR);
  const mdFiles = entries.filter((f) => f.endsWith('.md'));

  const { data: logData, ids: loggedIds } = await readLog();
  let drafted = 0;

  for (const file of mdFiles) {
    const id = path.basename(file, '.md');
    const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf8');
    const { data: fm, content } = matter(raw);

    const newsletter = Boolean(fm.newsletter);
    const draft = Boolean(fm.draft);
    const title = typeof fm.title === 'string' ? fm.title : id;

    if (!newsletter || draft || loggedIds.has(id)) continue;

    const inner = await marked.parse(content.trim() || '');
    const body = wrapEmailHtml(title, inner);

    const res = await fetch(`${PLUNK_BASE}/campaigns`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: title,
        body,
        recipients: 'all',
        style: 'HTML',
      }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json.success === false) {
      console.error(`Plunk POST /campaigns failed for "${id}"`, res.status, JSON.stringify(json));
      process.exitCode = 1;
      return;
    }

    /** @type {{ id?: string } | undefined} */
    const payload = json.data;
    const campaignId =
      typeof payload?.id === 'string'
        ? payload.id
        : typeof payload?.campaignId === 'string'
          ? payload.campaignId
          : undefined;

    logData.broadcasts.push({
      id,
      campaignId: campaignId ?? null,
      createdAt: new Date().toISOString(),
    });
    loggedIds.add(id);
    drafted += 1;
  }

  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
  await fs.writeFile(LOG_PATH, `${JSON.stringify(logData, null, 2)}\n`, 'utf8');

  console.log(
    drafted === 0
      ? 'No new newsletter posts to draft (all eligible posts already logged or none match).'
      : `Drafted ${drafted} campaign(s). Review and send from the Plunk dashboard.`,
  );
}

await main();
