import {
  Controller,
  UseGuards,
  Post,
  Get,
  Request,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  IRegisterRequestDto,
  IPasswordResetRequestDto,
  IConfirmEmailDto,
  IPasswordResetConfirmDto,
  ILoginRequestDto,
} from './auth.dto';
import { IApiRequest } from 'src/interfaces/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: IRegisterRequestDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: ILoginRequestDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Request() req: IApiRequest) {
    return await this.authService.me(req);
  }

  @Get('validate-email/request')
  @UseGuards(AuthGuard('jwt'))
  async validateEmailRequest(@Request() req: IApiRequest) {
    return await this.authService.validateEmailRequest(req);
  }

  @Post('validate-email/confirm')
  async validateEmailConfirm(@Body() dto: IConfirmEmailDto) {
    return await this.authService.validateEmailConfirm(dto);
  }

  @Post('password-reset/request')
  async passwordResetRequest(@Body() dto: IPasswordResetRequestDto) {
    return await this.authService.passwordResetRequest(dto);
  }

  @Post('password-reset/confirm')
  async passwordResetConfirm(@Body() dto: IPasswordResetConfirmDto) {
    return await this.authService.passwordResetConfirm(dto);
  }
}
