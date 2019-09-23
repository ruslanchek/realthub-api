import {
  IsEmail,
  Validate,
  MinLength,
  MaxLength,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { IsUserAlreadyExist } from '../user/user.validators';
import { getValidatorMessage, EMessageType } from '../messages';

export class ILoginRequestDto {
  @IsEmail(undefined, {
    message: getValidatorMessage(EMessageType.IsEmail),
  })
  email!: string;

  @IsNotEmpty({
    message: getValidatorMessage(EMessageType.EmptyPassword),
  })
  password!: string;
}

export class IRegisterRequestDto {
  @IsEmail(undefined, {
    message: getValidatorMessage(EMessageType.IsEmail),
  })
  @Validate(IsUserAlreadyExist, {
    message: getValidatorMessage(EMessageType.IsUserAlreadyExists),
  })
  email!: string;

  @MinLength(6, {
    message: getValidatorMessage(EMessageType.PasswordMinLength),
  })
  @MaxLength(32, {
    message: getValidatorMessage(EMessageType.PasswordMaxLength),
  })
  password!: string;
}

export class IConfirmEmailDto {
  @IsString({
    message: getValidatorMessage(EMessageType.WrongCode),
  })
  code!: string;
}

export class IPasswordResetRequestDto {
  @IsEmail(undefined, {
    message: getValidatorMessage(EMessageType.IsEmail),
  })
  email!: string;
}

export class IPasswordResetConfirmDto {
  @MinLength(6, {
    message: getValidatorMessage(EMessageType.PasswordMinLength),
  })
  @MaxLength(32, {
    message: getValidatorMessage(EMessageType.PasswordMaxLength),
  })
  password!: string;

  @IsString({
    message: getValidatorMessage(EMessageType.WrongCode),
  })
  code!: string;
}
