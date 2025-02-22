import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MembershipsModule } from '../memberships/memberships.module';
import { PayosModule } from '../payos/payos.module';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [UsersModule, JwtUtilsModule, MembershipsModule, PayosModule],
  controllers: [PaymentController],
  providers: [PaymentService, DatabaseService],
})
export class PaymentModule {}
