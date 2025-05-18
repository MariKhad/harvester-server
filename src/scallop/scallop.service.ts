import { Inject, Injectable } from '@nestjs/common';
import { Scallop, ScallopQuery } from '@scallop-io/sui-scallop-sdk';
import { readJsonFromFile, writeJsonToFile } from 'src/utils/fsUtils';
import IsTokenStable from 'src/utils/IsTokenStable';
import { SearchFilter } from 'src/utils/SearchFilter';
import IFormatPool from 'src/struct/IFormatPool';

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

  async getAllPools() {
    try {
      const marketData = await this.scallopQuery.getMarketPools();

      if (marketData && marketData.pools) {
        await writeJsonToFile('./src/scallop/scallop.cash.json', marketData);

        return marketData;
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

  async getAllFormatPools(search?: string): Promise<any> {
    try {
      let data;
      const marketData = await this.scallopQuery?.getMarketPools();
      if (marketData && marketData.pools) {
        await writeJsonToFile('./src/scallop/scallop.cash.json', marketData);
        data = marketData;
      } else {
        const cashData = await readJsonFromFile(
          './src/scallop/scallop.cash.json',
        );
        data = cashData;
      }

      const formatData: IFormatPool[] = this.formatPool(data);

      return search ? SearchFilter(formatData, search) : formatData;
    } catch (error) {
      console.error('Error in ScallopService.getAllFormatPools():', error);
      const cashData = await readJsonFromFile(
        './src/scallop/scallop.cash.json',
      );

      const formatData: IFormatPool[] = this.formatPool(cashData);
      return search ? SearchFilter(formatData, search) : formatData;
    }
  }

  async getAllStablePools(): Promise<any> {
    try {
      const marketData = await this.getAllFormatPools();
      const stablePools = marketData.filter((pool) => {
        const { token1, token2 } = pool;
        let isToken2Stable: boolean;
        const isToken1Stable = IsTokenStable(token1);
        if (token2) {
          isToken2Stable = IsTokenStable(token2);
          return isToken1Stable && isToken2Stable;
        } else return isToken1Stable;
      });
      return stablePools;
    } catch (error) {
      console.error('Error in ScallopService.getAllStablePools():', error);
      return [];
    }
  }

  async getAllStablePoolsByToken(token: string): Promise<string | any> {
    try {
      const formatToken = token.toUpperCase();
      const poolsData = this.getAllStablePools();

      if (!poolsData) {
        return [];
      }
      const tokenPoolsData = (await poolsData).filter((pool) => {
        const { token1, token2 } = pool;
        return token1 === formatToken || token2 === formatToken;
      });
      return tokenPoolsData;
    } catch (error) {
      console.error('Error in ScallopService.getAllTokenPools():', error);
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
    try {
      const balance = await this.scallopQuery.getUserPortfolio({
        walletAddress: address,
      });
      return balance;
    } catch (error) {
      console.error('Error in ScallopService.getUserBalance():', error);
      return [];
    }
  }

  formatPool(data: any | undefined): IFormatPool[] {
    const formatData: IFormatPool[] = [];

    if (data && data.pools) {
      for (const poolName in data.pools) {
        if (data.pools.hasOwnProperty(poolName)) {
          const pool = data.pools[poolName];
          if (pool.maxSupplyCoin > 0 && pool.maxBorrowCoin > 0) {
            const formatPool: IFormatPool = {
              pool_id: null, // Use poolId as the ID
              token1: pool.symbol,
              token2: null,
              total_apr: pool.supplyApr,
              reward1: null,
              reward2: null,
              reward1_apr: null,
              reward2_apr: null,
              protocol: 'scallop',
              type: 'lending',
              tvl: pool.supplyAmount,
              volume_24: '',
              fees_24: '',
            };

            formatData.push(formatPool);
          }
        }
      }
    }
    return formatData;
  }
}
