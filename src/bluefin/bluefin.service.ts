import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import SerializeObject from 'src/utils/Serialize';
import { QueryChain } from '@firefly-exchange/library-sui/dist/src/spot';
import { mainnet } from '../../config';
import { SuiClient } from '@firefly-exchange/library-sui';
import IsTokenStable from 'src/utils/IsTokenStable';
import IFormatPool from 'src/struct/IFormatPool';
import { SearchFilter } from 'src/utils/SearchFilter';

@Injectable()
export class BluefinService {
  private readonly client: SuiClient;

  constructor(@Inject('SuiClient') client: SuiClient) {
    this.client = client;
  }

  async getAllPools(): Promise<any[]> {
    try {
      const { data } = await axios.get(
        'https://swap.api.sui-prod.bluefin.io/api/v1/pools/info',
      );

      const serializedData = data.map((item) => SerializeObject(item));

      return serializedData;
    } catch (error) {
      console.error('Error in BluefinService.getAllPools():', error);
      return [];
    }
  }

  async getAllFormatPools(search?: string): Promise<any[]> {
    try {
      const { data } = await axios.get(
        'https://swap.api.sui-prod.bluefin.io/api/v1/pools/info',
      );

      const sData = data.map((item) => SerializeObject(item));

      if (!sData) {
        return [];
      }

      const formatData: IFormatPool[] = sData.map((pool) => {
        const reward1 =
          pool?.rewards && pool.rewards.length > 0
            ? pool.rewards[0]?.token?.name
            : null;
        const reward2 =
          pool?.rewards && pool.rewards.length > 1
            ? pool.rewards[1]?.token?.name
            : null;
        return {
          pool_id: pool?.address ?? null,
          token1: pool?.tokenA?.info?.symbol ?? null,
          token2: pool?.tokenB?.info?.symbol ?? null,
          total_apr: pool?.day?.apr?.total ?? null,
          reward1: reward1,
          reward2: reward2,
          reward1_apr: reward1 ? pool?.day?.apr?.rewardApr : null,
          reward2_apr: null,
          protocol: 'bluefin',
          type: pool?.tokenB?.info?.symbol ? 'il' : 'lend',
          tvl: pool?.tvl ?? null,
          volume_24: pool?.day?.volume ?? null,
          fees_24: pool?.day?.fee ?? null,
        };
      });

      return search ? SearchFilter(formatData, search) : formatData;
    } catch (error) {
      console.error('Error in BluefinService.getAllFormatPools():', error);
      return [];
    }
  }

  async getAllStablePools(): Promise<any[]> {
    try {
      const data = await this.getAllFormatPools();
      const stablePoolsData = data.filter((pool) => {
        const { token1, token2 } = pool;
        const usdMatch = IsTokenStable(token1) && IsTokenStable(token2);
        return usdMatch;
      });
      return stablePoolsData;
    } catch (error) {
      console.error('Error in BluefinService.getAllPools():', error);
      return [];
    }
  }

  async getAllStablePoolsByToken(token: string): Promise<string | any[]> {
    try {
      if (!IsTokenStable) {
        return 'This token is not supported.';
      }
      const formatToken = token.toUpperCase();
      const poolsData = await this.getAllStablePools();
      const tokenPoolsData = poolsData.filter((pool) => {
        const { token1, token2 } = pool;

        const tokenMatch =
          token1.toUpperCase() === formatToken ||
          token2.toUpperCase() === formatToken;
        return tokenMatch;
      });
      return tokenPoolsData;
    } catch (error) {
      console.error('Error in BluefinService.getAllTokenPools():', error);
      return [];
    }
  }

  async getAllTokens(): Promise<any[]> {
    try {
      const { data } = await axios.get(
        'https://swap.api.sui-prod.bluefin.io/api/v1/tokens/info',
      );

      const serializedTokenData = data.map((item) => SerializeObject(item));

      return serializedTokenData;
    } catch (error) {
      console.error('Error in BluefinService.getAllTokens():', error);
      return [];
    }
  }
  async getUserBalance(address: string): Promise<any[]> {
    try {
      const qc = new QueryChain(this.client);
      const balance = await qc.getUserPositions(mainnet.BasePackage, address);
      return balance;
    } catch (error) {
      console.error('Error in BluefinService.getUserBalance():', error);
      return [];
    }
  }
}
