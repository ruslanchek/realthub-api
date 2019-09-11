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
import { EmailService } from '../email/email.service';

export interface ILoginResult {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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
    const emailConfirmationCode = bcrypt.hashSync(
      `${dto.email}${Date.now()}`,
      bcrypt.genSaltSync(10),
    );
    const user = await this.usersService.add(
      dto.email,
      passwordHash,
      emailConfirmationCode,
    );

    if (user) {
      await this.emailService.sendWelcome({
        emailConfirmationCode,
        userName: user.email,
        userEmail: user.email,
        userId: user.id,
      });

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
      `${Date.now()}${email}`,
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
          undefined,
          getValidatorMessage(EMessageType.PasswordResetInterval),
        );
      }

      await this.usersService.update(user.id, {
        passwordResetCode,
        passwordResetInterval: new Date(
          Date.now() + authConstants.passwordResetInterval,
        ),
      });

      return {
        data: {
          passwordResetCode,
        },
      };
    } else {
      throw new NotFoundException();
    }
  }
}
