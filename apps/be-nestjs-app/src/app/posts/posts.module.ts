import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [UsersModule, JwtUtilsModule],
  controllers: [PostsController],
  providers: [PostsService, DatabaseService],
  exports: [PostsService],
})
export class PostsModule {}
