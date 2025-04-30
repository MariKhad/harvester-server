import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { MomentumService } from './momentum.service';

ApiTags('Momentum');
@Controller('momentum')
export class MomentumController {
  constructor(private readonly momentumService: MomentumService) {}

  @ApiOperation({ summary: 'Show all momentum pools' })
  @Get('pools')
  async getPools() {
    return await this.momentumService.getAllPools();
  }

  @ApiOperation({ summary: 'Show all momentum tokens' })
  @Get('tokens')
  async getTokens() {
    return await this.momentumService.getAllPools();
  }

  @ApiOperation({ summary: 'Show user portfolio on momentum by address' })
  @Get('balance/:address')
  @ApiParam({
    name: 'address',
    type: 'string',
    description: 'User address',
    example:
      '0x298d88a5819930540d10503ca722c2a82d431bf0b36391b84a11079f925412fa', // Пример дефолтного адреса
    required: false,
  })
  async getUserBalance(@Param('address') address: string) {
    return await this.momentumService.getUserBalance(address);
  }
}
