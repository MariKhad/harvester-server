import { Module } from '@nestjs/common';
import { BluefinModule } from 'src/bluefin/bluefin.module';
import { ScallopModule } from 'src/scallop/scallop.module';
import { MomentumModule } from 'src/momentum/momentum.module';
import { StablesController } from './stables.controller';
import { StablesService } from './stables.service';
import { NaviModule } from 'src/navi/navi.module';

@Module({
  imports: [BluefinModule, MomentumModule, ScallopModule, NaviModule],
  controllers: [StablesController],
  providers: [StablesService],
})
export class StablesModule {}
