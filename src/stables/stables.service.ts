import { Injectable } from '@nestjs/common';
import { BluefinService } from 'src/bluefin/bluefin.service';
import { MomentumService } from 'src/momentum/momentum.service';
import { NaviService } from 'src/navi/navi.service';
import { ScallopService } from 'src/scallop/scallop.service';
import IsTokenStable from 'src/utils/IsTokenStable';

@Injectable()
export class StablesService {
  constructor(
    private readonly scallopService: ScallopService,
    private readonly bluefinService: BluefinService,
    private readonly momentumService: MomentumService,
    private readonly naviService: NaviService,
  ) {}

  async getAllStablePools(): Promise<any> {
    const bluefinPools = await this.bluefinService.getAllStablePools();
    const scallopPools = await this.scallopService.getAllStablePools();
    const momentumPools = await this.momentumService.getAllStablePools();
    const naviPools = await this.naviService.getAllStablePools();
    return {
      scallop: { ...scallopPools },
      momentum: { ...momentumPools },
      bluefin: { ...bluefinPools },
      navi: { ...naviPools },
    };
  }

  async getAllStablePoolsByToken(token: string): Promise<any> {
    const bluefinPools = (await this.bluefinService.getAllStablePoolsByToken(
      token,
    )) as any[];
    const scallopPools =
      await this.scallopService.getAllStablePoolsByToken(token);
    const momentumPools =
      await this.momentumService.getAllStablePoolsByToken(token);
    const naviPools = await this.naviService.getAllStablePoolsByToken(token);
    return {
      scallop: { ...scallopPools },
      momentum: { ...momentumPools },
      bluefin: { ...bluefinPools },
      navi: { ...naviPools },
    };
  }
}
