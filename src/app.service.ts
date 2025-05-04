import { Injectable } from '@nestjs/common';
import { BluefinService } from './bluefin/bluefin.service';
import { ScallopService } from './scallop/scallop.service';
import { MomentumService } from './momentum/momentum.service';
import IsTokenStable from './utils/IsTokenStable';

@Injectable()
export class AppService {
  constructor(
    private readonly scallopService: ScallopService,
    private readonly bluefinService: BluefinService,
    private readonly momentumService: MomentumService,
  ) {}

  getHello(): string {
    return 'This is Harvester Server';
  }

  async getAllPools(): Promise<any> {
    const bluefinPools = await this.bluefinService.getAllPools();
    const scallopPools = await this.scallopService.getAllStablePools();
    const momentumPools = await this.momentumService.getAllPools();
    return {
      scallop: { ...scallopPools },
      mometum: { ...momentumPools },
      bluefin: { ...bluefinPools },
    };
  }

  async getAllTokenPools(token: string): Promise<string | any> {
    if (!IsTokenStable(token)) {
      return 'This token is not supported.';
    }
    const bluefinPools = (await this.bluefinService.getAllTokenPools(
      token,
    )) as any[];
    const scallopPools = await this.scallopService.getAllTokenPools(token);
    const momentumPools = await this.momentumService.getAllTokenPools(token);
    return {
      scallop: { ...scallopPools },
      mometum: { ...momentumPools },
      bluefin: { ...bluefinPools },
    };
  }
}
