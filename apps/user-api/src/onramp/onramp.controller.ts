import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { OnrampService, OnRampStatusEnum } from './onramp.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('onramp')
export class OnrampController {
  constructor(private readonly onrampService: OnrampService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('razorpay')
  async createRazorpayOrder(@Body() body: { amount: number }) {
    return this.onrampService.createRazorpayOrder(body.amount);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createOnrampTransaction(
    @Request() req,
    @Body()
    body: {
      amount: number;
      status: OnRampStatusEnum;
      provider: string;
      token: string;
    },
  ) {
    return this.onrampService.createOnrampTransaction(
      Number(req.user.id),
      body.amount,
      body.status,
      body.provider,
      body.token,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('history')
  async getOnrampHistory(@Request() req) {
    return this.onrampService.getOnrampHistory(Number(req.user.id));
  }
}
