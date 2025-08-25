import { Controller, Post, Body, Req, Get, Param, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { OnboardBusinessDto } from './dto/onboard-business.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @UseGuards(JwtAuthGuard)
  @Post('onboard')
  async onboard(@Body() dto: OnboardBusinessDto, @Req() req: any) {
    const ownerId = req.user?.userId;
    return this.businessService.onboardBusiness(dto, ownerId);
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.businessService.getBusinessProfile(id);
  }
}
