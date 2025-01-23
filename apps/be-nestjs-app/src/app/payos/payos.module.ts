
import { Module } from '@nestjs/common';
import { PayosService } from './payos.service';
import { PayosController } from './payos.controller';

@Module({
  controllers: [PayosController],
  providers: [PayosService],
})
export class PayosModule {}


