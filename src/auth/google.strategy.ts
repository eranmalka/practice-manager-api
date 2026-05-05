import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UsersService } from '../users/users.service';
import { googleOAuthCallbackUrl } from './oauth-redirect.util';

/** Passport throws if clientID is empty; use placeholder when OAuth is not configured (app can still boot). */
const GOOGLE_OAUTH_PLACEHOLDER = '__google_oauth_not_configured__';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || GOOGLE_OAUTH_PLACEHOLDER,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || GOOGLE_OAUTH_PLACEHOLDER,
      callbackURL: googleOAuthCallbackUrl(),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<{ id: number; email: string }> {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }
    const given = [profile.name?.givenName, profile.name?.familyName]
      .filter(Boolean)
      .join(' ')
      .trim();
    const name = profile.displayName?.trim() || given || '';
    const user = await this.usersService.findOrCreateOAuthUser(
      'google',
      profile.id,
      email,
      name,
    );
    return { id: user.id, email: user.email };
  }
}
