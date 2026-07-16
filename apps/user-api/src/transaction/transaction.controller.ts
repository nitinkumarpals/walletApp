import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getTransactions(@Request() req) {
    return this.transactionService.getTransactions(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('p2p-count')
  async getP2pCount(@Request() req) {
    return this.transactionService.getP2pCount(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('p2p-recipients')
  async getP2pRecipients(@Request() req) {
    return this.transactionService.getP2pRecipients(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('analytics')
  async getAnalytics(@Request() req) {
    return this.transactionService.getAnalytics(req.user.id);
  }
}
