import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { OAuthCodeCallbackPreflightGuard } from './oauth-callback-preflight.guard';
import {
  FacebookOAuthCallbackGuard,
  FacebookOAuthInitGuard,
  GoogleOAuthCallbackGuard,
  GoogleOAuthInitGuard,
} from './oauth.guards';
import {
  buildOAuthSuccessRedirect,
  frontendBaseUrl,
} from './oauth-redirect.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('google')
  @UseGuards(GoogleOAuthInitGuard)
  googleAuth(): void {
    /* Passport redirects to Google */
  }

  @Get('google/callback')
  @UseGuards(OAuthCodeCallbackPreflightGuard, GoogleOAuthCallbackGuard)
  async googleCallback(
    @Req() req: Request & { user: { id: number; email: string } },
    @Res() res: Response,
  ): Promise<void> {
    const { access_token } = await this.authService.issueAccessToken(req.user);
    const url = buildOAuthSuccessRedirect(frontendBaseUrl(), access_token);
    res.redirect(302, url);
  }

  @Get('facebook')
  @UseGuards(FacebookOAuthInitGuard)
  facebookAuth(): void {
    /* Passport redirects to Facebook */
  }

  @Get('facebook/callback')
  @UseGuards(OAuthCodeCallbackPreflightGuard, FacebookOAuthCallbackGuard)
  async facebookCallback(
    @Req() req: Request & { user: { id: number; email: string } },
    @Res() res: Response,
  ): Promise<void> {
    const { access_token } = await this.authService.issueAccessToken(req.user);
    const url = buildOAuthSuccessRedirect(frontendBaseUrl(), access_token);
    res.redirect(302, url);
  }
}
