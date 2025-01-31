import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [MembershipsController],
  providers: [MembershipsService, DatabaseService],
})
export class MembershipsModule {}
