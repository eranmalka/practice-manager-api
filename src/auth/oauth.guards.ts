import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import type { AuthenticateOptions } from 'passport';

import { buildOAuthFailureRedirect, frontendBaseUrl } from './oauth-redirect.util';

@Injectable()
export class GoogleOAuthInitGuard extends AuthGuard('google') {
  override canActivate(context: ExecutionContext) {
    if (
      !process.env.GOOGLE_CLIENT_ID?.trim() ||
      !process.env.GOOGLE_CLIENT_SECRET?.trim()
    ) {
      const res = context.switchToHttp().getResponse<Response>();
      res.redirect(
        302,
        `${frontendBaseUrl()}/login?error=oauth_google_unconfigured`,
      );
      return false;
    }
    return super.canActivate(context);
  }

  getAuthenticateOptions(_context: ExecutionContext): AuthenticateOptions {
    return {
      session: false,
      scope: ['email', 'profile'],
      prompt: 'select_account',
    };
  }
}

@Injectable()
export class GoogleOAuthCallbackGuard extends AuthGuard('google') {
  getAuthenticateOptions(_context: ExecutionContext): AuthenticateOptions {
    return {
      session: false,
      failureRedirect: buildOAuthFailureRedirect(frontendBaseUrl()),
    };
  }
}

@Injectable()
export class FacebookOAuthInitGuard extends AuthGuard('facebook') {
  override canActivate(context: ExecutionContext) {
    if (
      !process.env.FACEBOOK_APP_ID?.trim() ||
      !process.env.FACEBOOK_APP_SECRET?.trim()
    ) {
      const res = context.switchToHttp().getResponse<Response>();
      res.redirect(
        302,
        `${frontendBaseUrl()}/login?error=oauth_facebook_unconfigured`,
      );
      return false;
    }
    return super.canActivate(context);
  }

  getAuthenticateOptions(_context: ExecutionContext): AuthenticateOptions {
    return {
      session: false,
      scope: ['email', 'public_profile'],
    };
  }
}

@Injectable()
export class FacebookOAuthCallbackGuard extends AuthGuard('facebook') {
  getAuthenticateOptions(_context: ExecutionContext): AuthenticateOptions {
    return {
      session: false,
      failureRedirect: buildOAuthFailureRedirect(frontendBaseUrl()),
    };
  }
}
