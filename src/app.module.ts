import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BluefinModule } from './bluefin/bluefin.module';
import { MomentumModule } from './momentum/momentum.module';
import { ScallopModule } from './scallop/scallop.module';
import { StablesModule } from './src/stables/stables/stables.module';
import { StablesModule } from './stables/stables.module';

@Module({
  imports: [BluefinModule, MomentumModule, ScallopModule, StablesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
