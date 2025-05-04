import { Injectable } from '@nestjs/common';
import { BluefinService } from 'src/bluefin/bluefin.service';
import { MomentumService } from 'src/momentum/momentum.service';
import { ScallopService } from 'src/scallop/scallop.service';
import IsTokenStable from 'src/utils/IsTokenStable';

@Injectable()
export class StablesService {
  constructor(
    private readonly scallopService: ScallopService,
    private readonly bluefinService: BluefinService,
    private readonly momentumService: MomentumService,
  ) {}

  async getAllStablePools(): Promise<any> {
    const bluefinPools = await this.bluefinService.getAllStablePools();
    const scallopPools = await this.scallopService.getAllStablePools();
    const momentumPools = await this.momentumService.getAllStablePools();
    return {
      scallop: { ...scallopPools },
      mometum: { ...momentumPools },
      bluefin: { ...bluefinPools },
    };
  }

  async getAllStablePoolsByToken(token: string): Promise<string | any> {
    if (!IsTokenStable(token)) {
      return 'This token is not supported.';
    }
    const bluefinPools = (await this.bluefinService.getAllStablePoolsByToken(
      token,
    )) as any[];
    const scallopPools =
      await this.scallopService.getAllStablePoolsByToken(token);
    const momentumPools =
      await this.momentumService.getAllStablePoolsByToken(token);
    return {
      scallop: { ...scallopPools },
      mometum: { ...momentumPools },
      bluefin: { ...bluefinPools },
    };
  }
}
