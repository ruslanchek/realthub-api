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
} from './auth.dto';
import { IJwtSignPayload } from './jwt.strategy';
import { UserService } from '../user/user.service';

interface IRequest {
  user: IJwtSignPayload;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() dto: IRegisterRequestDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Request() req: IRequest) {
    return await this.userService.findById(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('validate-email/request')
  async validateEmailRequest(@Request() req: IRequest) {
    return await this.authService.validateEmailRequest(req.user);
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
  login(@Request() req: IRequest) {
    return this.authService.signUser(req.user);
  }
}
