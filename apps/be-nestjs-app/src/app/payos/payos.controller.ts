import { Body, Controller } from '@nestjs/common';
import { CheckoutRequestType } from '@payos/node/lib/type';
import { payosContract, PayosCreateRequest } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { PayosService } from './payos.service';

@Controller()
export class PayosController {
  constructor(private readonly payosService: PayosService) {}

  @TsRestHandler(payosContract.create)
  async create(@Body() body: PayosCreateRequest) {
    return tsRestHandler(payosContract.create, async ({ body }) => {
      // body.userId = Number(String(Date.now()).slice(-6));
      const payOsCreateRequest = body as CheckoutRequestType;
      payOsCreateRequest.returnUrl = `http://localhost:3000/payos/return`;
      payOsCreateRequest.cancelUrl = `http://localhost:3000/payos/cancel`;
      const payOsCreateResponse = await this.payosService.createLinkPayment(payOsCreateRequest);
      return { status: 201, body: payOsCreateResponse };
    });
  }
}
