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
  IPasswordResetDto,
  IConfirmEmailDto,
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

  @Post('confirm-email')
  async confirmEmail(@Body() dto: IConfirmEmailDto) {
    return this.authService.confirmEmail(dto);
  }

  @Post('password-reset')
  async passwordReset(@Body() dto: IPasswordResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: IRequest) {
    return this.authService.signUser(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Request() req: IRequest) {
    return await this.userService.findById(req.user.userId);
  }
}
