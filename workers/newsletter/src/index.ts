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

const normalizeApiKey = (value?: string) => {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return '';
  // Support accidentally quoted secrets, e.g. "sk_xxx" or 'pk_xxx'.
  const unquoted = trimmed.replace(/^['"]+|['"]+$/g, '').trim();
  return unquoted;
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

    const rawPublicKey = normalizeApiKey(env.PLUNK_PUBLIC_KEY);
    const rawSecretKey = normalizeApiKey(env.PLUNK_SECRET_KEY);
    const publicKey = rawPublicKey.startsWith('pk_') ? rawPublicKey : '';
    const secretKey = rawSecretKey.startsWith('sk_') ? rawSecretKey : '';

    if (!publicKey && !secretKey) {
      return json(
        { ok: false, error: 'Server is not configured (missing Plunk API key).' },
        { status: 500, headers: corsHeaders },
      );
    }
    if (rawPublicKey && !publicKey && !secretKey) {
      return json(
        { ok: false, error: 'Server is not configured (invalid PLUNK_PUBLIC_KEY format).' },
        { status: 500, headers: corsHeaders },
      );
    }
    if (rawSecretKey && !secretKey && !publicKey) {
      return json(
        { ok: false, error: 'Server is not configured (invalid PLUNK_SECRET_KEY format).' },
        { status: 500, headers: corsHeaders },
      );
    }

    const payload = (await request.json().catch(() => null)) as { email?: unknown } | null;
    const email = typeof payload?.email === 'string' ? payload.email.trim() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'Please provide a valid email address.' }, { status: 400, headers: corsHeaders });
    }

    const trackBody = {
      email,
      event: 'newsletter_signup',
    };
    const contactsBody = {
      email,
      subscribed: true,
      data: {
        source: 'newsletter_modal',
      },
    };

    const sendToPlunk = async (url: string, key: string, body: unknown) =>
      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

    let plunkUrl = publicKey ? 'https://next-api.useplunk.com/v1/track' : 'https://next-api.useplunk.com/contacts';
    let plunkResponse = await sendToPlunk(plunkUrl, publicKey ?? secretKey!, publicKey ? trackBody : contactsBody);

    let rawText = await plunkResponse.text();
    let data = (() => {
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
      suggestion?: string;
      errors?: Array<{ field?: string; message?: string }>;
    };

    if (publicKey && secretKey && plunkResponse.status === 400 && !rawText) {
      plunkUrl = 'https://next-api.useplunk.com/contacts';
      plunkResponse = await sendToPlunk(plunkUrl, secretKey, contactsBody);
      const fallbackRawText = await plunkResponse.text();
      data = (() => {
        if (!fallbackRawText) return {};
        try {
          return JSON.parse(fallbackRawText);
        } catch {
          return {};
        }
      })() as typeof data;
      if (plunkResponse.ok && data.success !== false) {
        return json({ ok: true }, { status: 200, headers: corsHeaders });
      }
      if (!fallbackRawText) {
        // Keep best-known provider payload for logs below.
        rawText = '';
      } else {
        rawText = fallbackRawText;
      }
    }

    if (!plunkResponse.ok || data.success === false) {
      const firstFieldError = data.errors?.find((entry) => entry?.message)?.message;
      const providerMessage =
        typeof data.error === 'string'
          ? data.error
          : data.error?.message ??
            firstFieldError ??
            data.suggestion ??
            data.message ??
            (rawText && !rawText.startsWith('<') ? rawText : undefined);
      const normalized = (providerMessage ?? '').toLowerCase();
      const isAlreadySubscribed =
        normalized.includes('already') && (normalized.includes('exist') || normalized.includes('subscribed'));
      if (isAlreadySubscribed) {
        return json({ ok: true }, { status: 200, headers: corsHeaders });
      }
      // Keep provider diagnostics in Worker logs for faster issue triage.
      console.error('Plunk subscription failed', {
        url: plunkUrl,
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
