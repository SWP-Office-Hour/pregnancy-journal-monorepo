import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PayOS from '@payos/node';
import { CheckoutRequestType } from '@payos/node/lib/type';

@Injectable()
export class PayosService {
  constructor(private configService: ConfigService) {}
  async createLinkPayment(payosCreateRequest: CheckoutRequestType) {
    const PAYOS_CLIENT_ID = this.configService.get<string>('PAYOS_CLIENT_ID');
    const PAYOS_API_KEY = this.configService.get<string>('PAYOS_API_KEY');
    const PAYOS_CHECKSUM_KEY = this.configService.get<string>('PAYOS_CHECKSUM_KEY');

    if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
      throw new NotFoundException('Please provide PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY in .env file');
    }

    const payOS = new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY);
    console.log(this.configService.get<string>('PAYOS_CLIENT_ID'));
    console.log(payOS);
    return await payOS.createPaymentLink(payosCreateRequest);
  }
}
