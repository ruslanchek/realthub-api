export enum EMessageType {
  IsEmail,
  IsUserAlreadyExists,
  PasswordMinLength,
  PasswordMaxLength,
  PasswordResetInterval,
  EmailConfirmationCodeNotFound,
  ServerError,
}

const MESSAGES_MAP: { [key: number]: string } = {
  [EMessageType.IsEmail]: 'NOT_AN_EMAIL',
  [EMessageType.IsUserAlreadyExists]: 'USER_EXISTS',
  [EMessageType.PasswordMinLength]: 'PASSWORD_MIN_LENGTH',
  [EMessageType.PasswordMaxLength]: 'PASSWORD_MAX_LENGTH',
  [EMessageType.PasswordResetInterval]: 'PASSWORD_RESET_INTERVAL',
  [EMessageType.EmailConfirmationCodeNotFound]: 'INVALID_CODE',
  [EMessageType.ServerError]: 'SERVER_ERROR',
};

export function getValidatorMessage(
  type: EMessageType,
  // values?: string[],
): string {
  return MESSAGES_MAP[type] || '';
}
