import { Injectable } from '@nestjs/common';
import { DashboardOverviewType, DashboardPaymentType, DashboardType, DashboardUserType } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async getDashboard(): Promise<DashboardType> {
    const overview = await this.getDashboardOverview();
    const user = await this.getDashboardUser();
    const payment = await this.getDashboardPayment();
    return {
      overview,
      user,
      payment,
    };
  }

  async getDashboardOverview(): Promise<DashboardOverviewType> {
    const users = await this.usersService.users();

    // Get all successful payments
    const totalPayments = await this.databaseService.Payment.findMany({
      where: {
        status: 1,
      },
    });

    // Get current month users and payments
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthUsers = users.filter((user) => {
      const createDate = new Date(user.created_at);
      return createDate.getMonth() === currentMonth && createDate.getFullYear() === currentYear;
    });

    // Calculate subscriber metrics
    const totalSubscribers = users.filter((user) => this.usersService.checkAccountMembership(user.user_id)).length;
    const currentMonthSubscribers = currentMonthUsers.filter((user) => this.usersService.checkAccountMembership(user.user_id)).length;

    // Calculate package purchase metrics
    const totalPackages = totalPayments.length;
    const currentMonthPackages = totalPayments.filter((payment) => {
      const paymentDate = new Date(payment.created_at);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    }).length;

    // Calculate revenue metrics
    const totalRevenue = totalPayments.reduce((sum, payment) => sum + (payment.value || 0), 0);
    const currentMonthRevenue = totalPayments
      .filter((payment) => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + (payment.value || 0), 0);

    return {
      data: [
        {
          label: 'Total Users',
          total: users.length,
          currentMonth: currentMonthUsers.length,
        },
        {
          label: 'Subscribers',
          total: totalSubscribers,
          currentMonth: currentMonthSubscribers,
        },
        {
          label: 'Packages Purchased',
          total: totalPackages,
          currentMonth: currentMonthPackages,
        },
        {
          label: 'Revenue',
          total: totalRevenue,
          currentMonth: currentMonthRevenue,
        },
      ],
    };
  }

  async getDashboardUser(): Promise<DashboardUserType> {
    // Initialize arrays with zeros for all 12 months
    const memberData = new Array(12).fill(0);
    const subscriberData = new Array(12).fill(0);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Get all users once to prevent multiple database queries
    const users = await this.usersService.users();

    // Count users for each month of current year
    for (const user of users) {
      const createDate = new Date(user.created_at);
      if (createDate.getFullYear() === currentYear) {
        const month = createDate.getMonth();

        // Since we only have memberData and subscriberData in the schema,
        // we'll use subscriberData to track total new users per month
        memberData[month]++;

        // If needed, we can still track premium subscribers in memberData
        if (await this.usersService.checkAccountMembership(user.user_id)) {
          subscriberData[month]++;
        }
      }
    }

    return {
      memberData,
      subscriberData,
    };
  }

  async getDashboardPayment(): Promise<DashboardPaymentType> {
    // Initialize arrays with zeros for all 12 months
    const monthlyRevenue: number[] = new Array(12).fill(0);
    const membership = new Array(12).fill(0);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Get all successful payments once to prevent multiple database queries
    const payments = await this.databaseService.Payment.findMany({
      where: {
        status: 1,
      },
    });

    // Count payments for each month of current year
    for (const payment of payments) {
      const paymentDate = new Date(payment.created_at);
      if (paymentDate.getFullYear() === currentYear) {
        const month = paymentDate.getMonth();

        // Since we only have payment and membership in the schema,
        // we'll use payment to track total payments per month
        console.log(payment.value);
        monthlyRevenue[month] += payment.value || 0;
        console.log(payment[month]);
        // If needed, we can still track membership payments in membership
        if (await this.usersService.checkAccountMembership(payment.user_id)) {
          membership[month]++;
        }
      }
    }

    return {
      payment: monthlyRevenue,
      membership: membership,
    };
  }
}
