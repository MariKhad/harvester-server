import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Hello message' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Show all pools' })
  @Get('/pools')
  async getAllFormatPools(@Query('search') search: string): Promise<any> {
    const pools = await this.appService.getAllFormatPools(search);
    return pools;
  }

  @ApiOperation({ summary: 'Show all stable pools' })
  @Get('/stables')
  async getAllStablePools(): Promise<any> {
    const pools = await this.appService.getAllStablePools();
    return pools;
  }
}
