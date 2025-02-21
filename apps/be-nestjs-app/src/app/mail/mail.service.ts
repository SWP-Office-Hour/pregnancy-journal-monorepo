import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}

  async resetPassword(userId: string) {
    const user = await this.userService.getUserById(userId);

    const uuid = uuidv4().replace(/[^0-9]/g, '');
    const code = parseInt(uuid.slice(0, 6), 10);

    await this.mailerService.sendMail({
      to: 'hoangyen7592sg@gmail.com', // list of receivers
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
