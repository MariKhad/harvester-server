import { Module } from '@nestjs/common';
import { BluefinModule } from 'src/bluefin/bluefin.module';
import { ScallopModule } from 'src/scallop/scallop.module';
import { MomentumModule } from 'src/momentum/momentum.module';
import { StablesController } from './stables.controller';
import { StablesService } from './stables.service';

@Module({
  imports: [BluefinModule, MomentumModule, ScallopModule],
  controllers: [StablesController],
  providers: [StablesService],
})
export class StablesModule {}
