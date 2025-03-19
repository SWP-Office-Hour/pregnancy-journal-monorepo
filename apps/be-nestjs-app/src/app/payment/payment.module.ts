import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { PayosModule } from '../payos/payos.module';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [forwardRef(() => UsersModule), JwtUtilsModule, MembershipsModule, PayosModule, DatabaseModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
