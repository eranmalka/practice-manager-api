import './load-env';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { googleOAuthCallbackUrl } from './auth/oauth-redirect.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:4200'];
  app.enableCors({
    origin: corsOrigins,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const googleOk =
    Boolean(process.env.GOOGLE_CLIENT_ID?.trim()) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim());
  const facebookOk =
    Boolean(process.env.FACEBOOK_APP_ID?.trim()) &&
    Boolean(process.env.FACEBOOK_APP_SECRET?.trim());

  logger.log(
    googleOk
      ? `Google OAuth: credentials loaded. Callback URL must match Google Console exactly: ${googleOAuthCallbackUrl()}`
      : 'Google OAuth: NOT configured — set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env (see .env.example), then restart.',
  );
  logger.log(
    facebookOk
      ? 'Facebook OAuth: credentials loaded.'
      : 'Facebook OAuth: not configured (optional).',
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
