import { Module } from '@nestjs/common';
import { BluefinController } from './bluefin.controller';
import { BluefinService } from './bluefin.service';
import { SuiClient } from '@firefly-exchange/library-sui';

@Module({
  controllers: [BluefinController],
  providers: [
    BluefinService,
    {
      provide: 'SuiClient',
      useFactory: () => {
        return new SuiClient({ url: 'https://fullnode.mainnet.sui.io:443' });
      },
    },
  ],
  exports: [BluefinService],
})
export class BluefinModule {}
