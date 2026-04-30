import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(ROOT, 'public');
const COVER_WIDTHS = [448, 672, 896, 1120];
const INLINE_WIDTHS = [480, 720, 1000];

const toAbsolutePublicPath = (publicPath) => {
  const relative = publicPath.replace(/^\//, '').replaceAll('/', path.sep);
  return path.join(PUBLIC_DIR, relative);
};

const buildVariantPath = (publicPath, width) => publicPath.replace(/\.webp$/i, `-w${width}.webp`);
const markdownImageRegex = /!\[[^\]]*]\((\/images\/[^)\s]+\.webp)\)/g;

const generateVariants = async (publicPath, widths) => {
  const sourcePath = toAbsolutePublicPath(publicPath);
  const sourceStats = await fs.stat(sourcePath).catch(() => null);
  if (!sourceStats) {
    console.warn(`Missing source image: ${publicPath}`);
    return false;
  }

  const source = sharp(sourcePath, { failOn: 'none' });
  const metadata = await source.metadata();
  if (!metadata.width) {
    console.warn(`Missing width metadata: ${publicPath}`);
    return false;
  }

  for (const width of widths) {
    const targetPath = toAbsolutePublicPath(buildVariantPath(publicPath, width));
    const targetWidth = Math.min(width, metadata.width);
    await source
      .clone()
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: 68, effort: 6 })
      .toFile(targetPath);
    generatedCount += 1;
  }
  return true;
};

const mdFiles = (await fs.readdir(BLOG_DIR)).filter((entry) => entry.endsWith('.md'));
let generatedCount = 0;
let skippedCount = 0;

for (const fileName of mdFiles) {
  const filePath = path.join(BLOG_DIR, fileName);
  const raw = await fs.readFile(filePath, 'utf8');
  const { data } = matter(raw);
  const coverImage = data?.coverImage;

  let processedAny = false;
  if (typeof coverImage === 'string' && coverImage.startsWith('/images/') && coverImage.endsWith('.webp')) {
    const ok = await generateVariants(coverImage, COVER_WIDTHS);
    processedAny = processedAny || ok;
  }

  const seenInline = new Set();
  for (const match of raw.matchAll(markdownImageRegex)) {
    const inlineImage = match[1];
    if (!inlineImage || seenInline.has(inlineImage)) continue;
    seenInline.add(inlineImage);
    const ok = await generateVariants(inlineImage, INLINE_WIDTHS);
    processedAny = processedAny || ok;
  }

  if (!processedAny) {
    skippedCount += 1;
  }
}

console.log(`Generated variants: ${generatedCount}`);
console.log(`Skipped entries: ${skippedCount}`);
