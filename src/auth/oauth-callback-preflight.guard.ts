import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  buildOAuthFailureRedirect,
  frontendBaseUrl,
} from './oauth-redirect.util';

/**
 * OAuth providers must redirect here with ?code=... (and optionally ?state=...).
 * Hitting this path directly in the browser (no code) makes Passport build an
 * invalid authorization request → Google often responds with HTTP 400.
 */
@Injectable()
export class OAuthCodeCallbackPreflightGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const errorRaw = req.query['error'];
    const providerError = typeof errorRaw === 'string' ? errorRaw : undefined;

    if (providerError) {
      if (providerError === 'access_denied') {
        res.redirect(302, buildOAuthFailureRedirect(frontendBaseUrl()));
      } else {
        const base = frontendBaseUrl().replace(/\/$/, '');
        res.redirect(
          302,
          `${base}/login?error=oauth_provider&message=${encodeURIComponent(providerError)}`,
        );
      }
      return false;
    }

    const codeRaw = req.query['code'];
    const code = typeof codeRaw === 'string' ? codeRaw : undefined;
    if (!code) {
      const base = frontendBaseUrl().replace(/\/$/, '');
      res.redirect(302, `${base}/login?error=oauth_missing_code`);
      return false;
    }

    return true;
  }
}
