import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BalanceModule } from './balance/balance.module';
import { UserModule } from './user/user.module';
import { TransferModule } from './transfer/transfer.module';
import { OnrampModule } from './onramp/onramp.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    PrismaModule,
    AuthModule,
    BalanceModule,
    UserModule,
    TransferModule,
    OnrampModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
