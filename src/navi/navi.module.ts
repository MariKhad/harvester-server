import { Module } from '@nestjs/common';
import { NaviService } from './navi.service';
import { NAVISDKClient } from 'navi-sdk';
import { NaviController } from './navi.controller';

@Module({
  controllers: [NaviController],
  providers: [
    NaviService,
    {
      provide: 'NAVISDKClient',
      useFactory: () => {
        return new NAVISDKClient({
          mnemonic: process.env.mnemonic || '',
          networkType: 'mainnet',
          numberOfAccounts: 5,
        });
      },
    },
  ],
  exports: [NaviService],
})
export class NaviModule {}
