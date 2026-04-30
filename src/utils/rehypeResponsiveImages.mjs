const INLINE_WIDTHS = [480, 720, 1000];
const INLINE_SIZES = '(min-width: 1024px) 720px, 100vw';

const buildVariantPath = (src, width) => src.replace(/\.webp$/i, `-w${width}.webp`);

const isInlinePostImage = (src) => typeof src === 'string' && src.startsWith('/images/') && src.endsWith('.webp');
const hasMeaningfulAlt = (alt) => typeof alt === 'string' && alt.trim().length > 0;

const toTitleCase = (value) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getFallbackAlt = (src) => {
  const postMatch = src.match(/^\/images\/posts\/([^/]+)\/inline-(\d+)-/i);
  if (postMatch) {
    const [, slug, index] = postMatch;
    return `${toTitleCase(slug)} - screenshot ${Number.parseInt(index, 10)}`;
  }

  const storyMatch = src.match(/^\/images\/storysume\/preview-(\d+)/i);
  if (storyMatch) {
    const [, index] = storyMatch;
    return `Storysume preview screenshot ${Number.parseInt(index, 10)}`;
  }

  return 'Inline article image';
};

const visit = (node, callback) => {
  if (!node || typeof node !== 'object') return;
  callback(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child, callback);
  }
};

export default function rehypeResponsiveImages() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'element' || node.tagName !== 'img') return;
      const src = node.properties?.src;
      if (!isInlinePostImage(src)) return;

      const srcset = INLINE_WIDTHS.map((width) => `${buildVariantPath(src, width)} ${width}w`).join(', ');
      node.properties = {
        ...node.properties,
        srcset,
        sizes: INLINE_SIZES,
        alt: hasMeaningfulAlt(node.properties?.alt) ? node.properties.alt : getFallbackAlt(src),
      };
    });
  };
}
