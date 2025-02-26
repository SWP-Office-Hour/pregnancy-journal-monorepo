import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [JwtUtilsModule, MailModule],
  controllers: [UsersController],
  providers: [UsersService, DatabaseService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
