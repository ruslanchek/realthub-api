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
import { IRegisterRequestDto } from './auth.dto';
import { IJwtSignPayload } from './jwt.strategy';
import { UsersService } from '../users/users.service';

interface IRequest {
  user: IJwtSignPayload;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() dto: IRegisterRequestDto) {
    return this.authService.register(dto);
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
