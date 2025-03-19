import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';

@Module({
  imports: [JwtUtilsModule, DatabaseModule],
  controllers: [ReactionController],
  providers: [ReactionService],
})
export class ReactionModule {}
