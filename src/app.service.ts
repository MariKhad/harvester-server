import { Injectable } from '@nestjs/common';
import { ScallopService } from './scallop/scallop.service';
import { BluefinService } from './bluefin/bluefin.service';
import { MomentumService } from './momentum/momentum.service';

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

  async getAllFormatPools(search?: string): Promise<any> {
    const bluefinPools = await this.bluefinService.getAllFormatPools(search);
    const scallopPools = await this.scallopService.getAllFormatPools(search);
    const momentumPools = await this.momentumService.getAllFormatPools(search);
    return {
      scallop: { ...scallopPools },
      mometum: { ...momentumPools },
      bluefin: { ...bluefinPools },
    };
  }

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
}
