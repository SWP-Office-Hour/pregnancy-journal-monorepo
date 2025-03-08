import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly databaseService: DatabaseService) {}

  // async maxAndMinPaymentMonth(): Promise<{
  //   highestPaymentMonth: string;
  //   lowestPaymentMonth: string;
  //   currentPaymentMonth: number;
  // }> {
  //   const paymentsByMonth = await this.databaseService.Payment.groupBy({
  //     by: ['created_at'],
  //     _sum: {
  //       value: true,
  //     },
  //   });
  //
  //   const paymentsByMonthGrouped = paymentsByMonth.map((payment) => ({
  //     month: DateTime.fromJSDate(payment.created_at).toFormat('yyyy-MM'),
  //     totalValue: payment._sum.value ?? 0,
  //   }));
  //
  //   const highestPaymentMonth = paymentsByMonthGrouped.reduce((prev, current) => {
  //     return prev.totalValue > current.totalValue ? prev : current;
  //   });
  //   const lowestPaymentMonth = paymentsByMonthGrouped.reduce((prev, current) => {
  //     return prev.totalValue < current.totalValue ? prev : current;
  //   });
  //
  //   const currentMonth = DateTime.now().toFormat('yyyy-MM');
  //   const currentPaymentMonth = paymentsByMonthGrouped
  //     .filter((payment) => payment.month === currentMonth)
  //     .reduce((sum, payment) => sum + payment.totalValue, 0);
  //
  //   return {
  //     highestPaymentMonth: highestPaymentMonth.month,
  //     lowestPaymentMonth: lowestPaymentMonth.month,
  //     currentPaymentMonth: currentPaymentMonth,
  //   };
  // }
  //
  // async getDashboard(): Promise<{
  //   totalUsers: number;
  //   totalRevenue: number;
  //   totalSubscribers: number;
  //   totalBuyers: number;
  // }> {
  //   const totalUsers = await this.databaseService.User.count();
  //
  //   const userMembership = await this.databaseService.User.findMany({
  //     select: {
  //       user_id: true,
  //       name: true,
  //       payment_history: {
  //         where: {
  //           status: 1, // Chỉ lấy giao dịch thành công
  //         },
  //         orderBy: {
  //           created_at: 'desc', // Lấy gói mới nhất
  //         },
  //         take: 1, // Lấy một giao dịch mới nhất
  //         select: {
  //           membership: {
  //             select: {
  //               title: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //
  //   const totalRevenue = await this.databaseService.Payment.findMany({});
  //
  //   return {
  //     totalUsers,
  //     totalRevenue: totalRevenue._sum.value ?? 0,
  //     totalSubscribers: userMembership.filter((user) => user.payment_history.length > 0).length,
  //     totalBuyers: userMembership.length,
  //   };
  // }
}
