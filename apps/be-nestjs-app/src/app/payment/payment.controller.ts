import { Body, Controller, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { paymentContract, PaymentCreateRequestType } from '../../../../../libs/contract/src/lib/payment.contract';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(paymentContract.create)
  handleCreatePayment(@Body() paymentRequest: PaymentCreateRequestType, @Req() req: RequestWithJWT) {
    return tsRestHandler(paymentContract.create, async () => {
      const user = req.decoded_authorization;
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const payment = await this.paymentService.createPayment(paymentRequest, user.user_id);

      return { status: 200, body: payment };
    });
  }
}
