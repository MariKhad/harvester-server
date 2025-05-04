import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ScallopService } from './scallop.service';

ApiTags('Scallop');
@Controller('scallop')
export class ScallopController {
  constructor(private readonly scallopService: ScallopService) {}

  @ApiOperation({ summary: 'Show all scallop pools on stables' })
  @Get('stables')
  async getStablePools() {
    return await this.scallopService.getAllStablePools();
  }

  @ApiOperation({ summary: 'Show all Scallop pools for a stable coin' })
  @Get('stables/:token')
  @ApiParam({
    name: 'token',
    type: 'string',
    description: 'token',
    example: 'usdc',
    required: false,
  })
  async getStablePoolsByToken(@Param('token') token: string) {
    return await this.scallopService.getAllStablePoolsByToken(token);
  }

  @ApiOperation({ summary: 'Show all scallop tokens' })
  @Get('tokens')
  async getTokens() {
    return await this.scallopService.getAllStablePools();
  }

  @ApiOperation({ summary: 'Show user portfolio on scallop by address' })
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
    return await this.scallopService.getUserBalance(address);
  }
}
