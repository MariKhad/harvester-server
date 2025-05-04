import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BluefinService } from './bluefin.service';

@ApiTags('Bluefin')
@Controller('bluefin')
export class BluefinController {
  constructor(private readonly bluefinService: BluefinService) {}

  @ApiOperation({ summary: 'Show all Bluefin pools on stables' })
  @Get('stables')
  async getStablePools() {
    return await this.bluefinService.getAllStablePools();
  }

  @ApiOperation({ summary: 'Show all Bluefin pools for stable coin' })
  @Get('stables/:token')
  @ApiParam({
    name: 'token',
    type: 'string',
    description: 'token',
    example: 'usdc',
    required: false,
  })
  async getStablePoolsByToken(@Param('token') token: string) {
    return await this.bluefinService.getAllStablePoolsByToken(token);
  }

  @ApiOperation({ summary: 'Show all Bluefin tokens' })
  @Get('tokens')
  async getTokens() {
    return await this.bluefinService.getAllTokens();
  }

  @ApiOperation({ summary: 'Show user portfolio on Bluefin by address' })
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
    return await this.bluefinService.getUserBalance(address);
  }
}
