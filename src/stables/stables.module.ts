import { Module } from '@nestjs/common';
import { StablesController } from './stables/stables.controller';
import { StablesService } from './stables.service';

@Module({
  controllers: [StablesController],
  providers: [StablesService]
})
export class StablesModule {}
