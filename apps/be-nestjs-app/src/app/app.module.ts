import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MembershipsModule } from './memberships/memberships.module';
import { ReminderModule } from './reminder/reminder.module';
import { TagModule } from './tags/tag.module';
import { HospitalModule } from './hosiptal/hospitalModule';
import { MetricModule } from './metric/metric.module';
import { CategorysModule } from './categorys/categorys.module';
import { BlogsModule } from './blogs/blogs.module';
import { FileModule } from './file/file.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
