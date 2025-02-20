import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public send(): void {
    this.mailerService
      .sendMail({
        to: 'phatcanlez@gmail.com', // list of receivers
        from: 'noreply@gmail.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'register',
        context: {
          name: 'phatcanlez',
          activationCode: '123456',
        },
      })
      .then(() => {
        console.log('Email sent');
      })
      .catch(() => {
        console.log('Error sending email');
      });
  }
}
