export enum EMessageType {
  IsEmail,
  EmptyPassword,
  UserNotFound,
  IsUserAlreadyExists,
  PasswordMinLength,
  PasswordMaxLength,
  PasswordResetInterval,
  EmailConfirmationCodeNotFound,
  ServerError,
  WrongCode,
  LoginIncorrect,
  InvalidUser,
  InvalidToken,
}

const MESSAGES_MAP: { [key: number]: string } = {
  [EMessageType.IsEmail]: 'NOT_AN_EMAIL',
  [EMessageType.EmptyPassword]: 'EMPTY_PASSWORD',
  [EMessageType.UserNotFound]: 'USER_NOT_FOUND',
  [EMessageType.IsUserAlreadyExists]: 'USER_EXISTS',
  [EMessageType.PasswordMinLength]: 'PASSWORD_MIN_LENGTH',
  [EMessageType.PasswordMaxLength]: 'PASSWORD_MAX_LENGTH',
  [EMessageType.PasswordResetInterval]: 'PASSWORD_RESET_INTERVAL',
  [EMessageType.EmailConfirmationCodeNotFound]: 'INVALID_CODE',
  [EMessageType.ServerError]: 'SERVER_ERROR',
  [EMessageType.WrongCode]: 'WRONG_CODE',
  [EMessageType.LoginIncorrect]: 'LOGIN_INCORRECT',
  [EMessageType.InvalidUser]: 'INVALID_USER',
  [EMessageType.InvalidToken]: 'INVALID_TOKEN',
};

export function getValidatorMessage(
  type: EMessageType,
  // values?: string[],
): string {
  return MESSAGES_MAP[type] || '';
}
