import { Controller } from '@nestjs/common';
import { PayosService } from './payos.service';

@Controller()
export class PayosController {
  constructor(private readonly payosService: PayosService) {}

  // @TsRestHandler(payosContract.create)
  // async create(@Body() body: PayosCreateRequest) {
  //   return tsRestHandler(payosContract.create, async ({ body }) => {
  //     const payOsCreateRequest: CheckoutRequestType = {
  //       ...body,
  //       orderCode: Number(Date.now()),
  //       cancelUrl: 'http://localhost:3000/payos/cancel',
  //       returnUrl: 'http://localhost:3000/payos/return',
  //     };
  //     const payOsCreateResponse = await this.payosService.createLinkPayment(payOsCreateRequest);
  //     return { status: 201, body: payOsCreateResponse };
  //   });
  // }
}
