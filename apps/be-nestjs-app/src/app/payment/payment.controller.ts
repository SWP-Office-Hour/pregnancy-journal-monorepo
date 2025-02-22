import { Body, Controller, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { paymentContract, PaymentCreateRequestType, PaymentUpdateRequestType } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
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

  @TsRestHandler(paymentContract.update)
  handleUpdatePayment(@Body() paymentRequest: PaymentUpdateRequestType) {
    return tsRestHandler(paymentContract.update, async () => {
      const payment = await this.paymentService.updatePayment(paymentRequest);
      return { status: 200, body: payment };
    });
  }
}
