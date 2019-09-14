export interface IEmailData {
  to: string;
  subject: string;
  userName: string;
  pre: string;
  title: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
}

export interface IEmailDataFor {
  userName: string;
  userEmail: string;
  userId: string;
}

export interface IEmailDataForNotification extends IEmailDataFor {
  subject: string;
  body: string;
  title: string;
  buttonText: string;
  buttonUrl: string;
}

export interface IEmailDataForAuth extends IEmailDataFor {
  emailConfirmationCode: string;
}

export interface IEmailDataForPasswordReset extends IEmailDataFor {
  passwordResetCode: string;
}
