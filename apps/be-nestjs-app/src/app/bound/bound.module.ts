import { Module } from '@nestjs/common';
import { BoundService } from './bound.service';
import { BoundController } from './bound.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [BoundController],
  providers: [BoundService, DatabaseService],
})
export class BoundModule {}
