import { Controller, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('logs')
  getSystemLogs() {
    return this.adminService.getSystemLogs();
  }

  @Get('businesses')
  getAllBusinesses() {
    return this.adminService.getAllBusinesses();
  }

  @Patch('business/:id/suspend')
  suspendBusiness(@Param('id') id: string) {
    return this.adminService.suspendBusiness(id);
  }

  @Patch('business/:id/reactivate')
  reactivateBusiness(@Param('id') id: string) {
    return this.adminService.reactivateBusiness(id);
  }

  // List withdrawal requests
  @Get('withdrawals')
  getWithdrawalRequests(@Query('status') status?: string) {
    return this.adminService.getWithdrawalRequests(status);
  }

  // Approve withdrawal
  @Patch('withdrawal/:id/approve')
  approveWithdrawal(@Param('id') id: string, @Body('adminId') adminId: string) {
    return this.adminService.approveWithdrawal(id, adminId);
  }

  // Reject withdrawal
  @Patch('withdrawal/:id/reject')
  rejectWithdrawal(@Param('id') id: string, @Body('adminId') adminId: string, @Body('reason') reason?: string) {
    return this.adminService.rejectWithdrawal(id, adminId, reason);
  }
}
