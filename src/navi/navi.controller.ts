import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { NaviService } from './navi.service';

@ApiTags('Navi')
@Controller('navi')
export class NaviController {
  constructor(private readonly naviService: NaviService) {}

  @ApiOperation({ summary: 'Show all Navi pools + apy, not formated' })
  @Get('no-format')
  async getPools() {
    return await this.naviService.getAllPools();
  }

  @ApiOperation({ summary: 'Show all Navi apy, not formated' })
  @Get('apy')
  async getPoolsApy() {
    return await this.naviService.getAllApy();
  }

  @ApiOperation({ summary: 'Show all Navi pools' })
  @Get('pools')
  @ApiParam({
    name: 'token',
    type: 'string',
    description: 'search',
    example: 'btc',
    required: false,
  })
  async getFormatPools(@Query('search') search: string) {
    return await this.naviService.getAllFormatPools(search);
  }

  @ApiOperation({ summary: 'Show all Navi pools on stables' })
  @Get('stables')
  async getStablePools() {
    return await this.naviService.getAllStablePools();
  }

  @ApiOperation({
    summary: 'Show all Navi pools for a particular stable coin',
  })
  @Get('stables/:token')
  @ApiParam({
    name: 'token',
    type: 'string',
    description: 'token',
    example: 'usdc',
    required: false,
  })
  async getStablePoolsByToken(@Param('token') token: string) {
    return await this.naviService.getAllStablePoolsByToken(token);
  }

  //! Не работает
  @ApiOperation({ summary: 'Show all Navi tokens, temporary not working' })
  @Get('tokens')
  async getTokens() {
    return await this.naviService.getAllTokens();
  }

  @ApiOperation({ summary: 'Show user portfolio on Navi by address' })
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
    return await this.naviService.getUserBalance(address);
  }
}
