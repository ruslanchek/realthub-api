import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IJwtSignPayload } from './jwt.strategy';
import { IRegisterDto } from './auth.dto';

export interface ILoginResult {
  userId: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ILoginResult | null> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      return {
        userId: user.id,
        username: user.username,
      };
    }

    return null;
  }

  async register(dto: IRegisterDto) {
    console.log(dto);
  }

  login(user: any) {
    const payload: IJwtSignPayload = {
      username: user.username,
      sub: user.userId,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
