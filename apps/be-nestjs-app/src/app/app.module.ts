import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { ReminderModule } from './reminder/reminder.module';
import { TagModule } from './tag/tag.module';
import { NoteModule } from './note/note.module';
import { CommentModule } from './comment/comment.module';
import { HosiptalModule } from './hosiptal/hosiptal.module';
import { MetricModule } from './metric/metric.module';
import { MembershipsModule } from './memberships/memberships.module';

// import { StandardModule } from './standard/standard.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FileModule,
    ReminderModule,
    TagModule,
    NoteModule,
    CommentModule,
    HosiptalModule,
    MetricModule,
    MembershipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
