// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeResponsiveImages from './src/utils/rehypeResponsiveImages.mjs';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://cluelessfounder.com',
  redirects: {
    '/p/10-things-i-ve-learned-about-hiring': '/blog/10-things-i-ve-learned-about-hiring/',
    '/p/bank-accounts-for-business-thailand': '/blog/bank-accounts-for-business-thailand/',
    '/p/do-you-still-read-books-in-2025': '/blog/do-you-still-read-books-in-2025/',
    '/p/dumbest-ways-to-get-hacked': '/blog/dumbest-ways-to-get-hacked/',
    '/p/ended-using-google-tasks': '/blog/ended-using-google-tasks/',
    '/p/finding-the-right-home-for-n8n': '/blog/finding-the-right-home-for-n8n/',
    '/p/google-workspace-vs-microsoft-365': '/blog/google-workspace-vs-microsoft-365/',
    '/p/how-i-achieve-inbox-zero': '/blog/how-i-achieve-inbox-zero/',
    '/p/how-i-grow-a-facebook-group-from-0-to-100k-without-ads':
      '/blog/how-i-grow-a-facebook-group-from-0-to-100k-without-ads/',
    '/p/how-to-design-a-good-enough-logo': '/blog/how-to-design-a-good-enough-logo/',
    '/p/how-to-get-business-emails-for-free': '/blog/how-to-get-business-emails-for-free/',
    '/p/i-built-a-job-board-using-no-code-tools': '/blog/i-built-a-job-board-using-no-code-tools/',
    '/p/my-tech-stack-in-2025': '/blog/my-tech-stack-in-2025/',
    '/p/never-miss-a-meeting-again': '/blog/never-miss-a-meeting-again/',
    '/p/rank-tracking-on-a-budget': '/blog/rank-tracking-on-a-budget/',
    '/p/stop-using-line-at-work-use-these-instead': '/blog/stop-using-line-at-work-use-these-instead/',
    '/p/stop-using-wordpress-in-2024': '/blog/stop-using-wordpress-in-2024/',
    '/p/storysume': '/blog/storysume/',
    '/p/telepath-one-year-later': '/blog/telepath-one-year-later/',
    '/p/vibe-coding-as-a-no-coder': '/blog/vibe-coding-as-a-no-coder/',
    '/p/what-i-learned-from-posting-on-social-media': '/blog/what-i-learned-from-posting-on-social-media/',
    '/p/what-i-learned-from-running-a-digital-agency-for-7-years':
      '/blog/what-i-learned-from-running-a-digital-agency-for-7-years/',
    '/p/where-to-buy-a-domain-name-in-2024': '/blog/where-to-buy-a-domain-name-in-2024/',
  },
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    rehypePlugins: [rehypeResponsiveImages],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});