import { Module } from '@nestjs/common';
import { MomentumController } from './momentum.controller';
import { MomentumService } from './momentum.service';
import { MmtSDK } from '@mmt-finance/clmm-sdk';

@Module({
  controllers: [MomentumController],
  providers: [
    MomentumService,
    {
      provide: 'MmtSDK',
      useFactory: () => {
        return MmtSDK.NEW({ network: 'mainnet' });
      },
    },
  ],
  exports: [MomentumService],
})
export class MomentumModule {}
