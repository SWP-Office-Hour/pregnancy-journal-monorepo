import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [UsersModule, PostsModule, JwtUtilsModule],
  controllers: [CommentsController],
  providers: [CommentsService, DatabaseService],
})
export class CommentsModule {}
