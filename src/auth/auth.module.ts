import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './facebook.strategy';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import {
  FacebookOAuthCallbackGuard,
  FacebookOAuthInitGuard,
  GoogleOAuthCallbackGuard,
  GoogleOAuthInitGuard,
} from './oauth.guards';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-only-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    GoogleOAuthInitGuard,
    GoogleOAuthCallbackGuard,
    FacebookOAuthInitGuard,
    FacebookOAuthCallbackGuard,
  ],
})
export class AuthModule {}
