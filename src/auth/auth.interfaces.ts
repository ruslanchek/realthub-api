export interface IAuthSuccessResponse {
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
