import { Injectable } from '@nestjs/common';
import { MailtrapTransport } from 'mailtrap';
import * as Nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transport;

  private name = 'Thành';
  // constructor() {
  //   const apiKey = '81931bab4f5e3fc81e22adae19289b5b-1654a412-431d1184';
  //   if (!apiKey) {
  //     throw new Error('Mailgun API key is not set');
  //   }
  //   const mailgun = new Mailgun(FormData);
  //   this.mg = mailgun.client({ username: 'api', key: apiKey });
  // }
  //
  // async sendMail() {
  //   try {
  //     const result = await this.mg.messages.create('sandbox-123.mailgun.org', {
  //       from: 'Excited User <mailgun@sandbox2e0c563d05c741c3aa90c5a48a32b350.mailgun.org>',
  //       to: ['test@example.com'],
  //       subject: 'Hello',
  //       text: 'Testing some Mailgun awesomeness!',
  //       html: '<h1>Testing some Mailgun awesomeness!</h1>',
  //     });
  //     console.log(result);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  constructor() {
    const TOKEN = '949f7fdcc4de2e04233d8ea464b9df8b';
    this.transport = Nodemailer.createTransport(
      MailtrapTransport({
        token: TOKEN,
      }),
    );
  }

  async sendMail() {
    const sender = {
      email: 'hello@demomailtrap.com',
      name: 'Mailtrap Test',
    };
    const recipients = ['thanhtran190304@gmail.com'];

    try {
      const result = await this.transport.sendMail({
        from: sender,
        to: recipients,
        subject: 'You are awesome!',
        text: 'hello thành nhé',
        category: 'phát test',
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}
