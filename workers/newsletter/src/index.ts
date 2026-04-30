export interface Env {
  PLUNK_PUBLIC_KEY: string;
  PLUNK_SECRET_KEY?: string;
  ALLOWED_ORIGIN?: string;
  ALLOWED_ORIGINS?: string;
}

const json = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

const parseAllowedOrigins = (env: Env): string[] => {
  const origins = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (env.ALLOWED_ORIGIN?.trim()) origins.push(env.ALLOWED_ORIGIN.trim());
  return Array.from(new Set(origins));
};

const getCorsHeaders = (origin: string | null, allowedOrigins: string[]) => {
  const allowOrigin =
    allowedOrigins.length === 0
      ? origin ?? '*'
      : origin && allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const allowedOrigins = parseAllowedOrigins(env);
    const isOriginAllowed = allowedOrigins.length === 0 || (origin !== null && allowedOrigins.includes(origin));
    const corsHeaders = getCorsHeaders(origin, allowedOrigins);

    if (request.method === 'OPTIONS') {
      if (!isOriginAllowed) {
        return json({ ok: false, error: 'Origin not allowed' }, { status: 403, headers: corsHeaders });
      }
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
    }
    if (!isOriginAllowed) {
      return json({ ok: false, error: 'Origin not allowed' }, { status: 403, headers: corsHeaders });
    }

    const key = env.PLUNK_SECRET_KEY?.trim() || env.PLUNK_PUBLIC_KEY?.trim();
    if (!key) {
      return json(
        { ok: false, error: 'Server is not configured (missing Plunk API key).' },
        { status: 500, headers: corsHeaders },
      );
    }

    const payload = (await request.json().catch(() => null)) as { email?: unknown } | null;
    const email = typeof payload?.email === 'string' ? payload.email.trim() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'Please provide a valid email address.' }, { status: 400, headers: corsHeaders });
    }

    const plunkResponse = await fetch('https://next-api.useplunk.com/v1/track', {
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

    const rawText = await plunkResponse.text();
    const data = (() => {
      if (!rawText) return {};
      try {
        return JSON.parse(rawText);
      } catch {
        return {};
      }
    })() as {
      success?: boolean;
      error?: { message?: string } | string;
      message?: string;
    };

    if (!plunkResponse.ok || data.success === false) {
      const providerMessage =
        typeof data.error === 'string'
          ? data.error
          : data.error?.message ?? data.message ?? (rawText && !rawText.startsWith('<') ? rawText : undefined);
      // Keep provider diagnostics in Worker logs for faster issue triage.
      console.error('Plunk subscription failed', {
        status: plunkResponse.status,
        body: rawText,
      });
      return json(
        { ok: false, error: providerMessage ?? 'Could not subscribe right now.' },
        { status: plunkResponse.status || 400, headers: corsHeaders },
      );
    }

    return json({ ok: true }, { status: 200, headers: corsHeaders });
  },
};
