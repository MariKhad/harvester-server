import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import SerializeObject from 'src/utils/Serialize';
import { QueryChain } from '@firefly-exchange/library-sui/dist/src/spot';
import { mainnet } from '../../config';
import { SuiClient } from '@firefly-exchange/library-sui';
import IsTokenStable from 'src/utils/IsTokenStable';

@Injectable()
export class BluefinService {
  private readonly client: SuiClient;

  constructor(@Inject('SuiClient') client: SuiClient) {
    this.client = client;
  }

  async getAllStablePools(): Promise<any[]> {
    try {
      const { data } = await axios.get(
        'https://swap.api.sui-prod.bluefin.io/api/v1/pools/info',
      );

      const serializedPoolData = data.map((item) => SerializeObject(item));
      const stablePoolsData = serializedPoolData.filter((pool) => {
        const [token1, token2] = pool.symbol.split('/');
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
        const [token1, token2] = pool.symbol.split('/');

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
