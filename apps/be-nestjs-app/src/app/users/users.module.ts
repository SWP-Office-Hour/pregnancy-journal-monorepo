import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseService } from '../database/database.service';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { UsersService } from './users.service';

@Module({
  imports: [JwtUtilsModule],
  controllers: [UsersController],
  providers: [UsersService, DatabaseService],
})
export class UsersModule {}
