import {
  Injectable,
  BadRequestException,
  NotFoundException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { IJwtSignPayload } from './jwt.strategy';
import {
  IRegisterRequestDto,
  IConfirmEmailDto,
  IPasswordResetRequestDto,
  IPasswordResetConfirmDto,
} from './auth.dto';
import * as bcrypt from 'bcrypt';
import { authConstants } from '../constants';
import { differenceInMilliseconds } from 'date-fns';
import { getValidatorMessage, EMessageType } from '../messages';
import { EmailService } from '../email/email.service';

export interface ILoginResult {
  token: string;
}

export interface IValidateEmailRequest {
  success: boolean;
}

export interface IConfirmEmailResult {
  success: boolean;
}

export interface IRequestPasswordResetRequestResult {
  success: boolean;
}

export interface IRequestPasswordResetConfirmResult {
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

  async validateEmailConfirm(
    dto: IConfirmEmailDto,
  ): Promise<IConfirmEmailResult | undefined> {
    const user = await this.usersService.findByWhere(
      {
        emailConfirmationCode: dto.code,
      },
      ['id', 'email'],
    );

    if (user) {
      await this.usersService.update(user.id, {
        isEmailConfirmed: true,
        emailConfirmationCode: undefined,
      });

      await this.emailService.sendEmailConfirmed({
        userName: user.email,
        userEmail: user.email,
        userId: user.id,
      });

      return {
        success: true,
      };
    }

    throw new NotFoundException(getValidatorMessage(EMessageType.WrongCode));
  }

  async validateEmailRequest(
    signPayload: IJwtSignPayload,
  ): Promise<IValidateEmailRequest | undefined> {
    const { userId } = signPayload;
    const emailConfirmationCode = bcrypt.hashSync(
      `${userId}${Date.now()}`,
      bcrypt.genSaltSync(10),
    );

    const user = await this.usersService.update(userId, {
      emailConfirmationCode,
    });

    if (user) {
      await this.emailService.sendWelcome({
        emailConfirmationCode,
        userName: user.email,
        userEmail: user.email,
        userId: user.id,
      });

      return {
        success: true,
      };
    }

    throw new BadRequestException(
      getValidatorMessage(EMessageType.ServerError),
    );
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

  signUser(signPayload: IJwtSignPayload): ILoginResult {
    const { userId } = signPayload;
    const payload: IJwtSignPayload = {
      userId,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async passwordResetConfirm(
    dto: IPasswordResetConfirmDto,
  ): Promise<IRequestPasswordResetConfirmResult | undefined> {
    const user = await this.usersService.findByWhere(
      {
        passwordResetCode: dto.code,
      },
      ['id', 'passwordResetCodeExpires'],
    );

    if (
      user &&
      differenceInMilliseconds(user.passwordResetCodeExpires, new Date()) > 0
    ) {
      const passwordHash = bcrypt.hashSync(
        dto.password,
        bcrypt.genSaltSync(10),
      );

      await this.usersService.update(user.id, {
        passwordHash,
        passwordResetCode: undefined,
        passwordResetCodeExpires: undefined,
        passwordResetInterval: undefined,
        passwordChangedDate: new Date(),
      });

      return {
        token: passwordHash,
      };
    }

    throw new BadRequestException(getValidatorMessage(EMessageType.WrongCode));
  }

  async passwordResetRequest(
    dto: IPasswordResetRequestDto,
  ): Promise<IRequestPasswordResetRequestResult | undefined> {
    const passwordResetCode = bcrypt.hashSync(
      `${Date.now()}${dto.email}`,
      bcrypt.genSaltSync(10),
    );

    const user = await this.usersService.findByEmail(dto.email, [
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
        passwordResetCodeExpires: new Date(
          Date.now() + authConstants.passwordResetExpires,
        ),
      });

      await this.emailService.sendPasswordReset({
        passwordResetCode,
        userName: user.email,
        userEmail: user.email,
        userId: user.id,
      });

      return {
        success: true,
      };
    }

    throw new NotFoundException();
  }
}
