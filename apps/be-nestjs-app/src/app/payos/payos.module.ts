import { Module } from '@nestjs/common';
import { PayosController } from './payos.controller';
import { PayosService } from './payos.service';

@Module({
  controllers: [PayosController],
  providers: [PayosService],
  exports: [PayosService],
})
export class PayosModule {}
