import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { CategorysModule } from './categorys/categorys.module';
import { ChildModule } from './child/child.module';
import { CommentsModule } from './comments/comments.module';
import { FileModule } from './file/file.module';
import { HospitalModule } from './hosiptal/hospital.module';
import { MailModule } from './mail/mail.module';
import { MediaModule } from './media/media.module';
import { MembershipsModule } from './memberships/memberships.module';
import { MetricModule } from './metric/metric.module';
import { NoteModule } from './note/note.module';
import { PaymentModule } from './payment/payment.module';
import { PayosModule } from './payos/payos.module';
import { PostsModule } from './posts/posts.module';
import { ReactionModule } from './reaction/reaction.module';
import { RecordsModule } from './records/records.module';
import { ReminderModule } from './reminder/reminder.module';
import { StandardModule } from './standard/standard.module';
import { TagModule } from './tags/tag.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MembershipsModule,
    ReminderModule,
    TagModule,
    MetricModule,
    HospitalModule,
    CategorysModule,
    BlogsModule,
    FileModule,
    MediaModule,
    RecordsModule,
    NoteModule,
    StandardModule,
    PostsModule,
    CommentsModule,
    ReactionModule,
    MailModule,
    PayosModule,
    PaymentModule,
    AdminModule,
    ChildModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
