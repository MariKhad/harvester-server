import { Inject, Injectable } from '@nestjs/common';
import { Scallop, ScallopQuery } from '@scallop-io/sui-scallop-sdk';

@Injectable()
export class ScallopService {
  private scallopSDK: Scallop;
  private scallopQuery: ScallopQuery;

  constructor(@Inject('ScallopSDK') scallopSDK: Scallop) {
    this.scallopSDK = scallopSDK;
  }

  async onModuleInit() {
    try {
      this.scallopQuery = await this.scallopSDK.createScallopQuery();
      console.log('ScallopQuery initialized');
    } catch (error) {
      console.error('Error initializing ScallopQuery:', error);
      throw new Error('Failed to initialize ScallopQuery'); // Re-throw
    }
  }

  async getAllPools(): Promise<any> {
    try {
      const marketData = await this.scallopQuery.getMarketPools();
      return marketData;
    } catch (error) {
      console.error('Error in ScallopService.getAllPools():', error);
      return [];
    }
  }

  async getAllTokens(): Promise<any> {
    try {
      const marketData = await this.scallopQuery.getCoinAmounts();
      return marketData;
    } catch (error) {
      console.error('Error in ScallopService.getAllTokens():', error);
      return [];
    }
  }

  async getUserBalance(address: string): Promise<any> {
    const balance = await this.scallopQuery.getUserPortfolio({
      walletAddress: address,
    });
    return balance;
  }
  catch(error) {
    console.error('Error in ScallopService.getUserBalance():', error);
    return [];
  }
}
