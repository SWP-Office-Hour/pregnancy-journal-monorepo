import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserResponseType } from '@pregnancy-journal-monorepo/contract';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async resetPassword(user: UserResponseType) {
    const uuid = uuidv4().replace(/[^0-9]/g, '');
    const code = parseInt(uuid.slice(0, 6), 10);

    await this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: 'noreply@gmail.com', // sender address
      subject: 'Reset Password', // Subject line
      text: 'reset password', // plaintext body
      template: 'reset-password',
      context: {
        name: user.name,
        resetCode: code,
      },
    });

    return code;
  }
}
