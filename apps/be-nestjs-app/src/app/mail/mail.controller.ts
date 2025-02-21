import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  handleMail() {
    return this.mailService.resetPassword('940ccb81-ed13-11ef-9d96-0242ac110002');
  }
}
