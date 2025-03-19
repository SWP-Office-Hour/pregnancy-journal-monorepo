import { forwardRef, Module } from '@nestjs/common';
import { ChildModule } from '../child/child.module';
import { DatabaseModule } from '../database/database.module';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { PaymentModule } from '../payment/payment.module';
import { PostsModule } from '../posts/posts.module';
import { ReminderModule } from '../reminder/reminder.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [JwtUtilsModule, MailModule, PaymentModule, DatabaseModule, ChildModule, forwardRef(() => PostsModule), forwardRef(() => ReminderModule)],
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
