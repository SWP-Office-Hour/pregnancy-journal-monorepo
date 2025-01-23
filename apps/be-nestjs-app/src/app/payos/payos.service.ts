import { Injectable } from '@nestjs/common';
import PayOS from "@payos/node";
import {CheckoutRequestType} from "@payos/node/lib/type";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class PayosService {
  constructor( private configService: ConfigService) {}
  async createLinkPayment(payosCreateRequest: CheckoutRequestType) {
    const payOS = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);
    console.log(this.configService.get<string>('PAYOS_CLIENT_ID'));
    // console.log(payOS)
    // return await payOS.createPaymentLink(payosCreateRequest);
  }
}
