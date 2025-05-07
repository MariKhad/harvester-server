import { CoinStruct, SuiClient } from '@firefly-exchange/library-sui';
import { Inject, Injectable } from '@nestjs/common';
import { AccountManager, getPoolsApy, NAVISDKClient } from 'navi-sdk';
import IFormatPool from 'src/struct/IFormatPool';
import IsTokenStable from 'src/utils/IsTokenStable';
import { SearchFilter } from 'src/utils/SearchFilter';

@Injectable()
export class NaviService {
  private readonly suiClient: SuiClient;
  private readonly client: NAVISDKClient;
  private account: AccountManager;
  private readonly coinMap: {};

  constructor(@Inject('NAVISDKClient') naviSDK: NAVISDKClient) {
    this.client = naviSDK;
    this.account = this.client.accounts[0];
    this.coinMap = {
      // Инициализация в конструкторе
      '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT':
        'vSUI',
      '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN':
        'wUSDC',
    };
  }

  async getAllPools() {
    const poolData = await this.client.getPoolInfo();
    const apyData = await getPoolsApy(this.suiClient);
    const marketData = this.combineData(poolData, apyData);
    return marketData;
  }

  async getAllApy() {
    const marketData = await getPoolsApy(this.suiClient);
    return marketData;
  }

  async getAllFormatPools(search?: string): Promise<any[]> {
    try {
      const marketData = await this.getAllPools();
      const formatData = this.formatPool(marketData);
      return search ? SearchFilter(formatData, search) : formatData;
    } catch (error) {
      console.error('Error in NaviService.getAllPools():', error);
      return [];
    }
  }

  async getAllStablePools(): Promise<any[]> {
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
      console.error('Error in Navi.getAllPools():', error);
      return [];
    }
  }

  async getAllStablePoolsByToken(token: string): Promise<string | any> {
    try {
      if (!IsTokenStable(token)) {
        return 'This token is not supported.';
      }
      const formatToken = token.toUpperCase();
      const poolsData = this.getAllStablePools();
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

  async getAllTokens(): Promise<readonly CoinStruct[]> {
    try {
      const marketData = await this.account.getAllCoins();
      return marketData;
    } catch (error) {
      console.error('Error in NaviService.getAllTokens():', error);
      return [];
    }
  }

  /*  async getTokenByTicker(ticker: string): Promise<[]> {
    try {
      const marketData = await this.mmtSDK.Pool.getAllTokens();
      const result = marketData.filter((token) => {
        return token.ticker === ticker;
      });

      return result;
    } catch (error) {
      console.error('Error in NaviService.getAllTokens():', error);
      return [];
    }
  } */

  async getUserBalance(address: string): Promise<any> {
    try {
      const balance = await this.account.getNAVIPortfolio(address);
      return balance;
    } catch (error) {
      console.error('Error in NaviService.getUserBalance():', error);
      return {};
    }
  }

  formatPool(data: any | undefined): IFormatPool[] {
    const formatData: IFormatPool[] = [];

    if (data) {
      Object.keys(data).map((key) => {
        const pool = data[key];
        const base_apr = parseFloat(pool.base_supply_rate);
        const reward_apr = pool.supplyIncentiveApyInfo?.apy;

        const formatPool: IFormatPool = {
          pool_id: null, // Use poolId as the ID
          token1: this.coinMap[pool.coin_type] || pool.symbol,
          token2: null,
          total_apr: base_apr + reward_apr,
          reward1:
            this.rewardCoin(pool.supplyIncentiveApyInfo?.rewardCoin[0]) || null,
          reward2:
            this.rewardCoin(pool.supplyIncentiveApyInfo?.rewardCoin[1]) || null,
          reward1_apr: reward_apr || null,
          reward2_apr: null,
          protocol: 'navi',
          type: 'lending',
          tvl: pool.total_supply,
          volume_24: '',
          fees_24: '',
        };
        formatData.push(formatPool);
      });
    }

    return formatData;
  }

  combineData(data1: any, data2: any) {
    const combinedArray: any[] = [];

    for (const key1 in data1) {
      if (data1.hasOwnProperty(key1)) {
        const assetId = parseInt(key1); // Преобразуем ключ объекта data1 в число
        const obj1 = data1[key1];

        for (const key2 in data2) {
          if (data2.hasOwnProperty(key2)) {
            const obj2 = data2[key2];

            if (obj2.asset === assetId) {
              // Совпадение найдено, объединяем объекты
              const combinedObj = { ...obj1, ...obj2 }; // Объединяем свойства объектов
              combinedArray.push(combinedObj);
            }
          }
        }
      }
    }

    return combinedArray;
  }

  rewardCoin = (str: string) => {
    if (!str) {
      return null;
    }

    if (this.coinMap[str]) {
      return this.coinMap[str];
    }

    const parts = str.split('::');
    return parts.length < 3 ? null : parts.pop()?.match(/[A-Z]+/)?.[0] || null;
  };
}
