import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [UsersModule, PostsModule, JwtUtilsModule, DatabaseModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
