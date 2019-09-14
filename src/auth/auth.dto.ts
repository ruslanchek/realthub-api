import {
  IsEmail,
  Validate,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';
import { IsUserAlreadyExist } from '../user/user.validators';
import { getValidatorMessage, EMessageType } from '../messages';

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

export class IPasswordResetDto {
  @IsEmail(undefined, {
    message: getValidatorMessage(EMessageType.IsEmail),
  })
  email!: string;
}
