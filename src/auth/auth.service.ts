import {
  Injectable,
  BadRequestException,
  NotFoundException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { IJwtSignPayload } from './jwt.strategy';
import { IRegisterRequestDto, IConfirmEmailDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { authConstants } from '../constants';
import { differenceInMilliseconds } from 'date-fns';
import { getValidatorMessage, EMessageType } from '../messages';
import { EmailService } from '../email/email.service';

export interface ILoginResult {
  data: {
    token: string;
  };
}

export interface IConfirmEmailResult {
  data: {
    success: boolean;
  };
}

export interface IRequestPasswordResetResult {
  data: {
    success: boolean;
  };
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

  async confirmEmail(
    dto: IConfirmEmailDto,
  ): Promise<IConfirmEmailResult | undefined> {
    const user = await this.usersService.findByWhere(
      {
        emailConfirmationCode: dto.code,
      },
      ['id'],
    );

    if (user) {
      await this.usersService.update(user.id, {
        isEmailConfirmed: true,
        emailConfirmationCode: undefined,
      });

      return {
        data: {
          success: true,
        },
      };
    }

    throw new NotFoundException(getValidatorMessage(EMessageType.WrongCode));
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
    }

    throw new BadRequestException(
      getValidatorMessage(EMessageType.ServerError),
    );
  }

  signUser(user: IJwtSignPayload): ILoginResult {
    const payload: IJwtSignPayload = {
      userId: user.userId,
    };

    return {
      data: {
        token: this.jwtService.sign(payload),
      },
    };
  }

  async requestPasswordReset(
    email: string,
  ): Promise<IRequestPasswordResetResult | undefined> {
    const passwordResetCode = bcrypt.hashSync(
      `${Date.now()}${email}`,
      bcrypt.genSaltSync(10),
    );

    const user = await this.usersService.findByEmail(email, [
      'id',
      'email',
      'passwordResetExpires',
    ]);

    if (user) {
      if (differenceInMilliseconds(user.passwordResetExpires, new Date()) > 0) {
        throw new MethodNotAllowedException(
          undefined,
          getValidatorMessage(EMessageType.PasswordResetInterval),
        );
      }

      await this.usersService.update(user.id, {
        passwordResetCode,
        passwordResetExpires: new Date(
          Date.now() + authConstants.passwordResetExpires,
        ),
      });

      return {
        data: {
          success: true,
        },
      };
    }

    throw new NotFoundException();
  }
}
