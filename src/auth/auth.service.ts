import {
  Injectable,
  BadRequestException,
  NotFoundException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { IJwtSignPayload } from './jwt.strategy';
import { IRegisterRequestDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { authConstants } from '../constants';
import { differenceInMilliseconds } from 'date-fns';
import { getValidatorMessage, EMessageType } from '../messages';

export interface ILoginResult {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<IJwtSignPayload | undefined> {
    const user = await this.usersService.findByEmail(email, [
      'email',
      'passwordHash',
    ]);

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      return {
        userId: user.id,
      };
    }

    return undefined;
  }

  async register(dto: IRegisterRequestDto): Promise<ILoginResult | undefined> {
    const passwordHash = bcrypt.hashSync(dto.password, bcrypt.genSaltSync(10));
    const user = await this.usersService.add(dto.email, passwordHash);

    if (user) {
      return this.signUser({
        userId: user.id,
      });
    } else {
      throw new BadRequestException();
    }
  }

  signUser(user: IJwtSignPayload): ILoginResult {
    const payload: IJwtSignPayload = {
      userId: user.userId,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async requestPasswordReset(email: string) {
    const passwordResetCode = bcrypt.hashSync(
      `${Date.now().toString()}${email}`,
      bcrypt.genSaltSync(10),
    );

    const user = await this.usersService.findByEmail(email, [
      'id',
      'email',
      'passwordResetInterval',
    ]);

    if (user) {
      if (
        differenceInMilliseconds(user.passwordResetInterval, new Date()) > 0
      ) {
        throw new MethodNotAllowedException(
          getValidatorMessage(EMessageType.PasswordResetInterval),
        );
      }

      await this.usersService.update(user.id, {
        passwordResetCode,
        passwordResetInterval: new Date(
          Date.now() + authConstants.passwordResetInterval,
        ),
      });
    } else {
      throw new NotFoundException();
    }
  }
}
