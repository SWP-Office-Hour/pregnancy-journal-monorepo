import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @TsRestHandler(dashboardContract.getDashboard)
  // handleGetDashboard() {
  //   return tsRestHandler(dashboardContract.getDashboard, async () => {
  //     const dashboard = await this.adminService.getDashboard();
  //     return { status: 200, body: dashboard };
  //   });
  // }
}
