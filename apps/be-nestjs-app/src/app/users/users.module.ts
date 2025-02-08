import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [JwtUtilsModule],
  controllers: [UsersController],
  providers: [UsersService, DatabaseService],
})
export class UsersModule {}
