import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BluefinService } from './bluefin/bluefin.service';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
  async getAllPoolsByToken(@Param('token') token: string): Promise<any> {
    return this.appService.getAllTokenPools(token);
  }

  @ApiOperation({ summary: 'Show all pools on stables' })
  @Get('/pools')
  async getAllPools(): Promise<any> {
    const pools = await this.appService.getAllPools();
    return pools;
  }
}
