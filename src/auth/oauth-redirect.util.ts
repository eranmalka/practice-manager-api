/**
 * Builds SPA URL after successful OAuth. Query form matches the SPA contract
 * (see project docs): `access_token` or optional `token` synonym on the client.
 */
export function buildOAuthSuccessRedirect(frontendBase: string, jwt: string): string {
  const base = frontendBase.replace(/\/$/, '');
  const token = encodeURIComponent(jwt);
  return `${base}/auth/callback?access_token=${token}`;
}

/**
 * OAuth failed or user cancelled — stable code for the SPA (`access_denied`).
 */
export function buildOAuthFailureRedirect(frontendBase: string): string {
  const base = frontendBase.replace(/\/$/, '');
  return `${base}/auth/callback?error=access_denied`;
}

export function frontendBaseUrl(): string {
  return process.env.FRONTEND_URL ?? 'http://localhost:4200';
}

/** Must match Google Cloud "Authorized redirect URIs" exactly (no trailing slash). */
export const DEFAULT_GOOGLE_CALLBACK_URL =
  'http://localhost:3000/auth/google/callback';

export const DEFAULT_FACEBOOK_CALLBACK_URL =
  'http://localhost:3000/auth/facebook/callback';

export function normalizeOAuthCallbackUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

export function googleOAuthCallbackUrl(): string {
  return normalizeOAuthCallbackUrl(
    process.env.GOOGLE_CALLBACK_URL?.trim() || DEFAULT_GOOGLE_CALLBACK_URL,
  );
}

export function facebookOAuthCallbackUrl(): string {
  return normalizeOAuthCallbackUrl(
    process.env.FACEBOOK_CALLBACK_URL?.trim() ||
      DEFAULT_FACEBOOK_CALLBACK_URL,
  );
}
