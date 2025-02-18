import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { CategorysModule } from './categorys/categorys.module';
import { CommentsModule } from './comments/comments.module';
import { FileModule } from './file/file.module';
import { HospitalModule } from './hosiptal/hospital.module';
import { MediaModule } from './media/media.module';
import { MembershipsModule } from './memberships/memberships.module';
import { MetricModule } from './metric/metric.module';
import { NoteModule } from './note/note.module';
import { PostsModule } from './posts/posts.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
