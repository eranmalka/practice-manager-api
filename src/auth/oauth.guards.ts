import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticateOptions } from 'passport';

@Injectable()
export class GoogleOAuthInitGuard extends AuthGuard('google') {
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
    const fe = process.env.FRONTEND_URL ?? 'http://localhost:4200';
    return {
      session: false,
      failureRedirect: `${fe}/login?error=oauth_google`,
    };
  }
}

@Injectable()
export class FacebookOAuthInitGuard extends AuthGuard('facebook') {
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
    const fe = process.env.FRONTEND_URL ?? 'http://localhost:4200';
    return {
      session: false,
      failureRedirect: `${fe}/login?error=oauth_facebook`,
    };
  }
}
