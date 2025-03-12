import { Injectable } from '@nestjs/common';
import { DashboardOverviewType, DashboardType, DashboardUserType } from '@pregnancy-journal-monorepo/contract';
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
    return {
      overview,
      user,
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
}
