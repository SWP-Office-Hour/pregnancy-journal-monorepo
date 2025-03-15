import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';

@Module({
  imports: [JwtUtilsModule],
  controllers: [ReactionController],
  providers: [ReactionService, DatabaseService],
})
export class ReactionModule {}
