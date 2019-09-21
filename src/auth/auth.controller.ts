import {
  Controller,
  UseGuards,
  Post,
  Get,
  Request,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  IRegisterRequestDto,
  IPasswordResetRequestDto,
  IConfirmEmailDto,
  IPasswordResetConfirmDto,
} from './auth.dto';
import { UserService } from '../user/user.service';
import { IApiRequest } from 'src/interfaces/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: IRegisterRequestDto) {
    return await this.authService.register(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Request() req: IApiRequest) {
    return await this.authService.me(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('validate-email/request')
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

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: IApiRequest) {
    if (req.user) {
      return this.authService.signUser(req.user);
    } else {
      throw new BadRequestException();
    }
  }
}
