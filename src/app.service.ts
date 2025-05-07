import { Injectable } from '@nestjs/common';
import { ScallopService } from './scallop/scallop.service';
import { BluefinService } from './bluefin/bluefin.service';
import { MomentumService } from './momentum/momentum.service';
import { NaviService } from './navi/navi.service';

@Injectable()
export class AppService {
  constructor(
    private readonly scallopService: ScallopService,
    private readonly bluefinService: BluefinService,
    private readonly momentumService: MomentumService,
    private readonly naviService: NaviService,
  ) {}
  getHello(): string {
    return 'This is Harvester Server';
  }

  async getAllFormatPools(search?: string): Promise<any> {
    const bluefinPools = await this.bluefinService.getAllFormatPools(search);
    const scallopPools = await this.scallopService.getAllFormatPools(search);
    const momentumPools = await this.momentumService.getAllFormatPools(search);
    const naviPools = await this.naviService.getAllFormatPools(search);
    return {
      scallop: { ...scallopPools },
      mometum: { ...momentumPools },
      bluefin: { ...bluefinPools },
      navi: { ...naviPools },
    };
  }
}
