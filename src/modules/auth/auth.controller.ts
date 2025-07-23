import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import {
  ChnagePasswordDTO,
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  RegisterWithSSODTO,
  ResetPasswordDTO,
  UpdateProfile,
  VerifyOtpDTO,
} from 'src/dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseUtil } from 'src/utils/response.utils';
import { Messages } from 'src/utils/messages';
import { AuthGuard } from '@nestjs/passport';
import Utils from 'src/utils';
import { RedisCacheService } from '../common/cache.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private redisCacheService: RedisCacheService
  ) { }

  // @Get('/clear-cache')
  // clearCache() {
  //   return this.redisCacheService.delCache();
  // }
  @Post('register')
  async register(@Body() payload: RegisterDTO) {
    return this.authService.register(payload);
  }

  @Get('login/sso')
  async ssoLogin(
    @Query('token') token: string,
    @Query('email') email: string,
    @Query('username') username: string,
    @Query('application_code') application_code: string,
    @Response() response: ExpressResponse,
  ) {
    try {
      const ssoToken = await this.authService.loginSSO(
        token,
        email,
        application_code,
        username,
      );
      response.redirect(`${process.env.WEB_APP_URL}?email=${email}&appToken=${token}&token=${ssoToken}`);
    } catch (error) {
      response.redirect(process.env.PORTAL_URL);
    }
  }

  @Post('login')
  async login(@Body() payload: LoginDTO, @Response() res: ExpressResponse) {
    const result = await this.authService.login(
      payload.email,
      payload.password,
    );

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return res
      .status(HttpStatus.OK)
      .send(ResponseUtil.success(result, Messages.loginSuccess, HttpStatus.OK));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-profile')
  async getProfile(@Request() req: any, @Response() res: ExpressResponse) {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.authService.getProfile(req.user.userId);

    return res
      .status(HttpStatus.OK)
      .send(
        ResponseUtil.success(user, Messages.getSuccessfully, HttpStatus.OK),
      );
  }
  @Get('get-profile/:email')
  async getProfileWithEmail(@Param('email') email: string) {
    const user = await this.authService.getProfileWithEmail(email);
    return user;
  }

  @Post('register/sso')
  async registerWithSSO(@Body() payload: RegisterWithSSODTO) {
    return this.authService.registerWithSSO(payload);
  }

  @Post('update-profile')
  async updateProfile(@Body() payload: UpdateProfile) {
    return payload;
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDTO) {
    return payload;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDTO) {
    return payload.email;
  }

  @Post('verify-otp')
  async verifyOtp(@Body() payload: VerifyOtpDTO) {
    return payload.otp;
  }

  @Post('change-password')
  async changePassword(@Body() payload: ChnagePasswordDTO) {
    return payload;
  }

  @Post('logout')
  async logout(@Response() res: ExpressResponse) {
    res.clearCookie('access_token', {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
    });
    await this.redisCacheService.delCache()

    return res.send(
      ResponseUtil.success(
        { url: process.env.LOGOUT_REDIRECT },
        Messages.logoutSuccess,
      ),
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete-account')
  async deleteAccount(@Request() req: any, @Response() res: ExpressResponse) {
    console.log("req.user", req.user)
    const { userId } = req.user

    await this.authService.deleteAccount(userId, res)
    await this.redisCacheService.delCache()

    console.log("user deleted successfully")
    return res.status(HttpStatus.NO_CONTENT).send(
      ResponseUtil.success(
        { url: process.env.LOGOUT_REDIRECT },
        Messages.deletedSuccessfully,
      ),
    );
  }
}