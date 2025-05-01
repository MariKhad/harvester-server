import { Inject, Injectable } from '@nestjs/common';
import { Scallop, ScallopQuery } from '@scallop-io/sui-scallop-sdk';
import { readJsonFromFile, writeJsonToFile } from 'src/utils/fsUtils';
import IsTokenStable from 'src/utils/IsTokenStable';

@Injectable()
export class ScallopService {
  private scallopSDK: Scallop;
  private scallopQuery: ScallopQuery;

  constructor(@Inject('ScallopSDK') scallopSDK: Scallop) {
    this.scallopSDK = scallopSDK;
  }

  async onModuleInit() {
    await this.initializedScallopQuery();
    await this.getAllPools();
  }

  async initializedScallopQuery() {
    try {
      this.scallopQuery = await this.scallopSDK.createScallopQuery();
      console.log('ScallopQuery initialized');
      return;
    } catch (error) {
      console.error('Error initializing ScallopQuery:', error);
      return;
    }
  }

  async getAllPools(): Promise<any> {
    try {
      const marketData = await this.scallopQuery.getMarketPools();
      const stablePools = {};
      if (marketData && marketData.pools) {
        for (const poolKey in marketData.pools) {
          if (marketData.pools.hasOwnProperty(poolKey)) {
            if (poolKey.toLowerCase().includes('usd')) {
              stablePools[poolKey] = marketData.pools[poolKey];
            }
          }
        }

        await writeJsonToFile('./src/scallop/scallop.cash.json', marketData);
        return stablePools;
      } else {
        const cashData = await readJsonFromFile(
          './src/scallop/scallop.cash.json',
        );
        return cashData;
      }
    } catch (error) {
      console.error('Error in ScallopService.getAllPools():', error);
      const cashData = await readJsonFromFile(
        './src/scallop/scallop.cash.json',
      );
      return cashData;
    }
  }

  async getAllTokenPools(token: string): Promise<string | any> {
    try {
      if (!IsTokenStable(token)) {
        return 'This token is not supported.';
      }
      const tokenPoolsData = await this.scallopQuery.getMarketPool(token);

      if (!tokenPoolsData) {
        return await this.getTokenPoolsFromCash(token);
      }

      return tokenPoolsData;
    } catch (error) {
      console.error('Error in ScallopService.getAllTokenPools():', error);
      return await this.getTokenPoolsFromCash(token);
    }
  }

  async getTokenPoolsFromCash(token: string) {
    const marketData = await this.getAllPools();
    const stableTokenPools = {};
    if (marketData && marketData.pools) {
      for (const poolKey in marketData.pools) {
        if (marketData.pools.hasOwnProperty(poolKey)) {
          if (poolKey.toUpperCase() === token.toUpperCase()) {
            stableTokenPools[poolKey] = marketData.pools[poolKey];
          }
        }
      }
      return stableTokenPools;
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
