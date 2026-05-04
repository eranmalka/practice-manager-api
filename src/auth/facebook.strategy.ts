import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { UsersService } from '../users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID ?? '',
      clientSecret: process.env.FACEBOOK_APP_SECRET ?? '',
      callbackURL:
        process.env.FACEBOOK_CALLBACK_URL ??
        'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
      enableProof: true,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<{ id: number; email: string }> {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException(
        'Facebook did not return email — grant email permission or use another sign-in method.',
      );
    }
    const user = await this.usersService.findOrCreateOAuthUser(
      'facebook',
      profile.id,
      email,
      profile.displayName ?? '',
    );
    return { id: user.id, email: user.email };
  }
}
