import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BalanceService } from './balance.service';

@Controller('balance')
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getBalance(@Request() req) {
    return this.balanceService.getBalance(Number(req.user.id));
  }
}
