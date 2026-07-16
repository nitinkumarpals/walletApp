import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('p2p')
  async p2pTransfer(
    @Request() req,
    @Body() body: { email: string; amount: number },
  ) {
    return this.transferService.p2pTransfer(
      req.user.id,
      body.email,
      body.amount,
    );
  }
}
