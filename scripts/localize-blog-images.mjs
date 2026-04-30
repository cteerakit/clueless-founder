import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(ROOT, 'public');
const POSTS_IMAGE_DIR = path.join(PUBLIC_DIR, 'images', 'posts');

const COVER_WIDTH = 1200;
const INLINE_WIDTH = 1000;

const toPosix = (value) => value.replaceAll('\\', '/');
const ensureDir = async (dir) => fs.mkdir(dir, { recursive: true });

const optimizeUrl = (originalUrl, width) => {
  if (originalUrl.includes('beehiiv.com/cdn-cgi/image/')) {
    const marker = '/uploads/';
    const idx = originalUrl.indexOf(marker);
    if (idx !== -1) {
      const tail = originalUrl.slice(idx);
      return `https://media.beehiiv.com/cdn-cgi/image/width=${width},quality=70,format=webp,onerror=redirect${tail}`;
    }
  }

  if (originalUrl.includes('miro.medium.com/')) {
    return originalUrl.replace(/\/resize:fit:\d+\//, `/resize:fit:${width}/`);
  }

  return originalUrl;
};

const hashUrl = (url) => crypto.createHash('sha1').update(url).digest('hex').slice(0, 10);

const downloadImage = async (url, targetPath) => {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; localize-blog-images/1.0)',
      accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Non-image response (${contentType}) for ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(targetPath, buffer);
};

const mdFiles = (await fs.readdir(BLOG_DIR)).filter((entry) => entry.endsWith('.md'));
let updatedFiles = 0;
let downloaded = 0;
const downloadedUrls = new Map();

for (const fileName of mdFiles) {
  const slug = fileName.replace(/\.md$/i, '');
  const filePath = path.join(BLOG_DIR, fileName);
  const fileDir = path.join(POSTS_IMAGE_DIR, slug);
  await ensureDir(fileDir);

  const original = await fs.readFile(filePath, 'utf8');
  let next = original;
  let changed = false;

  const coverMatch = next.match(/^coverImage:\s*"([^"]+)"/m);
  if (coverMatch && /^https?:\/\//.test(coverMatch[1])) {
    const source = coverMatch[1];
    const optimized = optimizeUrl(source, COVER_WIDTH);
    const targetName = `cover-${hashUrl(source)}.webp`;
    const targetPath = path.join(fileDir, targetName);
    const publicPath = toPosix(path.join('/images', 'posts', slug, targetName));

    if (!downloadedUrls.has(source)) {
      await downloadImage(optimized, targetPath);
      downloadedUrls.set(source, publicPath);
      downloaded += 1;
    } else if (!(await fs.stat(targetPath).catch(() => null))) {
      const cachedPublic = downloadedUrls.get(source);
      const cachedAbs = path.join(PUBLIC_DIR, cachedPublic.replace(/^\//, '').replaceAll('/', path.sep));
      const cachedData = await fs.readFile(cachedAbs);
      await fs.writeFile(targetPath, cachedData);
    }

    next = next.replace(coverMatch[0], `coverImage: "${publicPath}"`);
    changed = true;
  }

  const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  let inlineIndex = 0;
  const replacements = [];
  for (const match of next.matchAll(markdownImageRegex)) {
    const full = match[0];
    const alt = match[1] ?? '';
    const source = match[2];
    const optimized = optimizeUrl(source, INLINE_WIDTH);
    const targetName = `inline-${String(inlineIndex + 1).padStart(2, '0')}-${hashUrl(source)}.webp`;
    const targetPath = path.join(fileDir, targetName);
    const publicPath = toPosix(path.join('/images', 'posts', slug, targetName));

    if (!downloadedUrls.has(source)) {
      await downloadImage(optimized, targetPath);
      downloadedUrls.set(source, publicPath);
      downloaded += 1;
    } else if (!(await fs.stat(targetPath).catch(() => null))) {
      const cachedPublic = downloadedUrls.get(source);
      const cachedAbs = path.join(PUBLIC_DIR, cachedPublic.replace(/^\//, '').replaceAll('/', path.sep));
      const cachedData = await fs.readFile(cachedAbs);
      await fs.writeFile(targetPath, cachedData);
    }

    replacements.push({
      from: full,
      to: `![${alt}](${publicPath})`,
    });
    inlineIndex += 1;
    changed = true;
  }

  for (const { from, to } of replacements) {
    next = next.replace(from, to);
  }

  if (changed && next !== original) {
    await fs.writeFile(filePath, next, 'utf8');
    updatedFiles += 1;
  }
}

console.log(`Updated files: ${updatedFiles}`);
console.log(`Downloaded images: ${downloaded}`);
