// @ts-ignore
import * as sgTransport from 'nodemailer-sendgrid-transport';
import { Injectable } from '@nestjs/common';
import { transactional } from './templates/transactional';
import * as nodemailer from 'nodemailer';
import * as Mustache from 'mustache';
import { SENDGRID_API_KEY } from '../env';
import {
  IEmailData,
  IEmailDataForNotification,
  IEmailDataForAuth,
  IEmailDataFor,
  IEmailDataForPasswordReset,
} from './email.interfaces';
import { MailOptions } from 'nodemailer/lib/json-transport';
import * as Mail from 'nodemailer/lib/mailer';

const FROM_ADDRESS: string = 'mail@email.realthub.com';
const FROM_NAME: string = 'Realthub';

const templates = {
  transactional,
};

@Injectable()
export class EmailService {
  private readonly transport: nodemailer.Transporter;

  private render(template: string, data: any): string {
    return Mustache.render(template, data);
  }

  constructor() {
    this.transport = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: SENDGRID_API_KEY,
        },
      }),
    );
  }

  private createMailOptions(data: IEmailData): MailOptions {
    const dataLocal = {
      siteUrl: `https://realthub.com?from=email`,
      linkUnderLogoUrl: `https://realthub.com?from=email`,
      linkUnderLogoText: `realthub.com`,
      pre: data.pre,
      title: data.title,
      body: data.body,
      buttonText: data.buttonText,
      post: `If you received this email by mistake, simply delete it.`,
      buttonUrl: `https://realthub.com`,
      copyright: `Copyright © 2018–${new Date().getFullYear()} Realthub All rights reserved.`,
      nav: [
        {
          title: `Contacts`,
          url: `https://realthub.com/about/contacts?from=email`,
        },
        {
          title: `Advertise`,
          url: `https://realthub.com/about/advertise?from=email`,
        },
        { title: `Terms`, url: `https://realthub.com/about/terms?from=email` },
        {
          title: `Privacy`,
          url: `https://realthub.com/about/privacy?from=email`,
        },
      ],
      unsubscribeLinkText: `Unsubscribe`,
      unsubscribeLinkUrl: `https://realthub.com/unsubscribe?from=email`,
      ...data,
    };

    const html: string = this.render(templates.transactional, dataLocal);

    return {
      from: `${FROM_NAME} <${FROM_ADDRESS}>`,
      to: dataLocal.to,
      subject: dataLocal.subject,
      text: '',
      html,
    };
  }

  public async sendNotification(
    data: IEmailDataForNotification,
  ): Promise<boolean> {
    const dataProcessed: IEmailData = {
      to: data.userEmail,
      subject: data.subject,
      userName: data.userName,
      pre: `Hi ${data.userName},`,
      title: data.title,
      body: data.body,
      buttonText: data.buttonText,
      buttonUrl: data.buttonUrl,
    };

    return await this.send(this.createMailOptions(dataProcessed));
  }

  public async sendWelcome(data: IEmailDataForAuth): Promise<boolean> {
    const dataProcessed: IEmailData = {
      to: data.userEmail,
      subject: `Welcome to Realthub`,
      userName: data.userName,
      pre: `Hi ${data.userName},`,
      title: `Registration almost complete...`,
      body: `Thank you for your registration! Please confirm your email to verify your account.`,
      buttonText: `Verify email`,
      buttonUrl: `https://realthub.com/verification/email/${
        data.emailConfirmationCode
      }`,
    };

    return await this.send(this.createMailOptions(dataProcessed));
  }

  public async sendEmailConfirmed(data: IEmailDataFor): Promise<boolean> {
    const dataProcessed: IEmailData = {
      to: data.userEmail,
      subject: `Your email address confirmed`,
      userName: data.userName,
      pre: `Hi ${data.userName},`,
      title: `Your email address confirmed`,
      body: `Congratulations, you have successfully confirmed your email!`,
      buttonText: `Explore`,
      buttonUrl: `https://realthub.com`,
    };

    return await this.send(this.createMailOptions(dataProcessed));
  }

  public async sendPasswordChanged(data: IEmailDataFor): Promise<boolean> {
    const dataProcessed: IEmailData = {
      to: data.userEmail,
      subject: `Your password has changed`,
      userName: data.userName,
      pre: `Hi ${data.userName},`,
      title: `Your password has changed`,
      body: `Congratulations, you have successfully changed your password!`,
      buttonText: `Welcome back`,
      buttonUrl: `https://realthub.com`,
    };

    return await this.send(this.createMailOptions(dataProcessed));
  }

  public async sendPasswordReset(
    data: IEmailDataForPasswordReset,
  ): Promise<boolean> {
    const dataProcessed: IEmailData = {
      to: data.userEmail,
      subject: `You just requested password reset`,
      userName: data.userName,
      pre: `Hi ${data.userName},`,
      title: `You just requested password reset`,
      body: `Follow the link below to set new password`,
      buttonText: `Set new password`,
      buttonUrl: `https://realthub.com/auth/password-reset-confirm/?token=${
        data.passwordResetCode
      }`,
    };

    return await this.send(this.createMailOptions(dataProcessed));
  }

  public send(data: Mail.Options): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('Sending email...');

      this.transport.sendMail(data, (error, response) => {
        if (error) {
          console.error(error);
          reject(false);
        } else {
          resolve(true);
          console.info('Message sent', response);
        }
      });
    });
  }
}
