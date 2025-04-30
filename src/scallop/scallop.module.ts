import { Module } from '@nestjs/common';
import { ScallopController } from './scallop.controller';
import { ScallopService } from './scallop.service';
import { Scallop } from '@scallop-io/sui-scallop-sdk';

@Module({
  controllers: [ScallopController],
  providers: [
    ScallopService,
    {
      provide: 'ScallopSDK',
      useFactory: () => {
        return new Scallop({
          addressId: '67c44a103fe1b8c454eb9699',
          networkType: 'mainnet',
        });
      },
    },
  ],
  exports: [ScallopService],
})
export class ScallopModule {}
