import {
  Injectable,
  BadRequestException,
  NotFoundException,
  MethodNotAllowedException,
  ForbiddenException,
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
import {
  IConfirmEmailResult,
  IValidateEmailRequest,
  IAuthSuccessResponse,
  IRequestPasswordResetRequestResult,
} from './auth.interfaces';
import { IApiResponse, IApiRequest } from 'src/interfaces/common';
import { User } from 'src/entries/user.entity';

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
    const user = await this.usersService.findByEmail(email, ['passwordHash']);

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      return {
        userId: user.id,
      };
    } else {
      return undefined;
    }
  }

  async validateEmailConfirm(
    dto: IConfirmEmailDto,
  ): Promise<IApiResponse<IConfirmEmailResult>> {
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
        data: {
          success: true,
        },
      };
    } else {
      throw new NotFoundException(getValidatorMessage(EMessageType.WrongCode));
    }
  }

  async validateEmailRequest(
    req: IApiRequest,
  ): Promise<IApiResponse<IValidateEmailRequest>> {
    if (!req.user) {
      throw new ForbiddenException(
        getValidatorMessage(EMessageType.InvalidToken),
      );
    }

    const { userId } = req.user;
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
        data: {
          success: true,
        },
      };
    } else {
      throw new BadRequestException(
        getValidatorMessage(EMessageType.ServerError),
      );
    }
  }

  async login(
    dto: IRegisterRequestDto,
  ): Promise<IApiResponse<IAuthSuccessResponse>> {
    const validatedUser = await this.validateUser(dto.email, dto.password);

    if (validatedUser) {
      const data = this.signUser(validatedUser);

      return {
        data,
      };
    } else {
      throw new ForbiddenException(
        getValidatorMessage(EMessageType.LoginIncorrect),
      );
    }
  }

  async register(
    dto: IRegisterRequestDto,
  ): Promise<IApiResponse<IAuthSuccessResponse>> {
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

      const data = this.signUser({
        userId: user.id,
      });

      return {
        data,
      };
    } else {
      throw new BadRequestException(
        getValidatorMessage(EMessageType.ServerError),
      );
    }
  }

  signUser(signPayload: IJwtSignPayload): IAuthSuccessResponse {
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
  ): Promise<IApiResponse<IAuthSuccessResponse>> {
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
        data: {
          token: passwordHash,
        },
      };
    } else {
      throw new BadRequestException(
        getValidatorMessage(EMessageType.WrongCode),
      );
    }
  }

  async passwordResetRequest(
    dto: IPasswordResetRequestDto,
  ): Promise<IApiResponse<IRequestPasswordResetRequestResult>> {
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
        data: {
          success: true,
        },
      };
    } else {
      throw new NotFoundException(
        getValidatorMessage(EMessageType.InvalidUser),
      );
    }
  }

  async me(req: IApiRequest): Promise<IApiResponse<Partial<User>>> {
    if (!req.user) {
      throw new ForbiddenException(
        getValidatorMessage(EMessageType.InvalidToken),
      );
    }

    const user = await this.usersService.findById(req.user.userId);

    if (user) {
      return {
        data: user,
      };
    } else {
      throw new NotFoundException(
        getValidatorMessage(EMessageType.InvalidUser),
      );
    }
  }
}
