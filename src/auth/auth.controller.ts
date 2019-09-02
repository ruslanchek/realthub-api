import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ILoginDto } from '../meta/interfaces';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() dto: ILoginDto) {
    return { a: dto.password };
  }
}
