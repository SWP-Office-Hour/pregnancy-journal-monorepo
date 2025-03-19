import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CategorysController } from './categorys.controller';
import { CategorysService } from './categorys.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategorysController],
  providers: [CategorysService],
})
export class CategorysModule {}
