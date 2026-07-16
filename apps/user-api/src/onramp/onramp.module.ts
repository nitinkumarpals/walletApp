import { Module } from '@nestjs/common';
import { OnrampService } from './onramp.service';
import { OnrampController } from './onramp.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OnrampController],
  providers: [OnrampService],
})
export class OnrampModule {}
