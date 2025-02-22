import { Injectable, NotFoundException } from '@nestjs/common';
import { CheckoutRequestType } from '@payos/node/lib/type';
import { PaymentCreateRequestType, PaymentResponseType, PayMethod, PayStatus } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { MembershipsService } from '../memberships/memberships.service';
import { PayosService } from '../payos/payos.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly payosService: PayosService,
    private readonly userService: UsersService,
    private readonly membershipService: MembershipsService,
  ) {}

  async createPayment(paymentRequest: PaymentCreateRequestType, userId: string): Promise<PaymentResponseType> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const membership = await this.membershipService.findOne(paymentRequest.membership_id);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    const payment = await this.databaseService.Payment.create({
      data: {
        user: { connect: { user_id: user.user_id } },
        membership: { connect: { membership_id: membership.membership_id } },
        value: membership.price,
        status: PayStatus.FAILED,
        payment_method: PayMethod.PAYOS,
        created_at: new Date(),
      },

      include: {
        user: {
          select: { user_id: true, email: true, name: true },
        },
        membership: true,
      },
    });

    const payRequest: CheckoutRequestType = {
      orderCode: Number(new Date()),
      amount: membership.price,
      returnUrl: 'http://localhost:3000/payment/success',
      cancelUrl: 'http://localhost:3000/payment/cancel',
      description: 'Payment for membership',
    };

    const paymentUrl = await this.payosService.createLinkPayment(payRequest);

    return { payment, payment_url: paymentUrl.checkoutUrl };
  }
}
