import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('Authentication', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { success: true, message: 'Logged in successfully' };
  }

  @Post('sign-up')
  async signUp(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.signUp(body);
    res.cookie('Authentication', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { success: true, message: 'Signed up successfully' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('Authentication', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return res.redirect('http://localhost:3000/dashboard');
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication');
    return { success: true, message: 'Logged out successfully' };
  }
}
