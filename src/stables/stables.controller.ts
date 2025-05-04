import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { StablesService } from './stables.service';

@ApiTags('Stables')
@Controller('stables')
export class StablesController {
  constructor(private readonly stablesService: StablesService) {}

  @ApiOperation({ summary: 'Show all pools on stables' })
  @Get('/pools')
  async getAllStablePools(): Promise<any> {
    const pools = await this.stablesService.getAllStablePools();
    return pools;
  }

  @ApiOperation({ summary: 'Show all pools for a stable coin' })
  @Get('/pools/:token')
  @ApiParam({
    name: 'token',
    type: 'string',
    description: 'token',
    example: 'usdc',
    required: false,
  })
  async getAllStablePoolsByToken(@Param('token') token: string): Promise<any> {
    return this.stablesService.getAllStablePoolsByToken(token);
  }
}
