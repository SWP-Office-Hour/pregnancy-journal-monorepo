import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';

@Module({
  controllers: [MembershipsController],
  providers: [MembershipsService, DatabaseService],
})
export class MembershipsModule {}
