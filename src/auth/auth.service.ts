import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IJwtSignPayload } from './jwt.strategy';
import { IRegisterRequestDto, ILoginResultDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

export interface IAuthValudateResult {
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
  ): Promise<IAuthValudateResult | undefined> {
    const user = await this.usersService.findOne(username);

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      return {
        userId: user.id,
        username: user.username,
      };
    }

    return undefined;
  }

  async register(
    dto: IRegisterRequestDto,
  ): Promise<ILoginResultDto | undefined> {
    const passwordHash = bcrypt.hashSync(dto.password, bcrypt.genSaltSync(10));

    const user = await this.usersService.add(dto.username, passwordHash);

    if (user) {
      return this.signUser({
        userId: user.id,
        username: user.username,
      });
    }

    return undefined;
  }

  signUser(user: IAuthValudateResult): ILoginResultDto {
    const payload: IJwtSignPayload = {
      username: user.username,
      sub: user.userId,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
