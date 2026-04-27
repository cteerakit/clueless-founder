import { ActionError, defineAction } from 'astro:actions';
import * as z from 'zod';
import { env } from 'cloudflare:workers';

export const server = {
  subscribe: defineAction({
    input: z.object({
      email: z.email(),
    }),
    handler: async ({ email }) => {
      const key = env.PLUNK_PUBLIC_KEY;
      if (!key || key === '') {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Newsletter signup is not configured (PLUNK_PUBLIC_KEY).',
        });
      }

      const res = await fetch('https://next-api.useplunk.com/v1/track', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          event: 'newsletter_signup',
          subscribed: true,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: { message?: string };
      };

      if (!res.ok || data.success === false) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: data.error?.message ?? 'Could not subscribe. Try again later.',
        });
      }

      return { ok: true as const };
    },
  }),
};
