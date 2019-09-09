export enum EMessageType {
  IsEmail,
  IsUserAlreadyExists,
  PasswordMinLength,
  PasswordMaxLength,
}

const MESSAGES_MAP: { [key: number]: string } = {
  [EMessageType.IsEmail]: 'NOT_AN_EMAIL',
  [EMessageType.IsUserAlreadyExists]: 'USER_EXISTS',
  [EMessageType.PasswordMinLength]: 'PASSWORD_MIN_LENGTH',
  [EMessageType.PasswordMaxLength]: 'PASSWORD_MAX_LENGTH',
};

export function getValidatorMessage(
  type: EMessageType,
  // values?: string[],
): string {
  return MESSAGES_MAP[type] || '';
}
