import { Injectable, NotFoundException } from '@nestjs/common';
import { CheckoutRequestType } from '@payos/node/lib/type';
import {
  PayIncludeUserInfo,
  PaymentCreateRequestType,
  PaymentResponseWithLinkType,
  PaymentUpdateRequestType,
  PayMethod,
  PayStatus,
} from '@pregnancy-journal-monorepo/contract';
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

  async createPayment(paymentRequest: PaymentCreateRequestType, userId: string): Promise<PaymentResponseWithLinkType> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const membership = await this.membershipService.findOne(paymentRequest.membership_id);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    const membershipExisted = await this.userService.checkAccountMembership(user.user_id);

    if (membershipExisted) {
      throw new NotFoundException('User already has a membership');
    }

    const payOsOrderCode = Number(new Date(Date.now()));
    const payment = await this.databaseService.Payment.create({
      data: {
        user: { connect: { user_id: user.user_id } },
        membership: { connect: { membership_id: membership.membership_id } },
        value: membership.price,
        status: PayStatus.FAILED,
        payment_method: PayMethod.PAYOS,
        created_at: new Date(Date.now()),
        payos_order_code: String(payOsOrderCode),
      },

      include: {
        membership: true,
      },
    });

    const payRequest: CheckoutRequestType = {
      orderCode: payOsOrderCode,
      amount: membership.price,
      returnUrl: 'https://pregnancy-journal-monorepo.pages.dev/membership',
      cancelUrl: 'https://pregnancy-journal-monorepo.pages.dev/membership',
      description: 'Payment for ' + membership.title,
    };

    const paymentUrl = await this.payosService.createLinkPayment(payRequest);

    return { payment, payment_url: paymentUrl.checkoutUrl };
  }

  async updatePayment(paymentRequest: PaymentUpdateRequestType) {
    const payment = await this.databaseService.Payment.findFirst({
      where: { payos_order_code: paymentRequest.payos_order_code },
      include: {
        membership: true,
      },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return await this.databaseService.Payment.update({
      where: { payment_history_id: payment.payment_history_id },
      data: {
        status: PayStatus.SUCCESS,
        expired_at: new Date(Date.now() + payment.membership.duration_days * 24 * 60 * 60 * 1000),
      },
      include: {
        membership: true,
      },
    });
  }

  async getAllPayments(): Promise<PayIncludeUserInfo[]> {
    return await this.databaseService.Payment.findMany({
      include: {
        membership: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }
}
