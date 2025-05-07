import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BluefinModule } from './bluefin/bluefin.module';
import { MomentumModule } from './momentum/momentum.module';
import { ScallopModule } from './scallop/scallop.module';
import { StablesModule } from './stables/stables.module';
import { NaviModule } from './navi/navi.module';

@Module({
  imports: [
    BluefinModule,
    MomentumModule,
    ScallopModule,
    StablesModule,
    NaviModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
