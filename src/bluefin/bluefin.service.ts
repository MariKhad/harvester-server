import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import SerializeObject from 'src/utils/Serialize';
import { QueryChain } from '@firefly-exchange/library-sui/dist/src/spot';
import { mainnet } from '../../config';
import { SuiClient } from '@firefly-exchange/library-sui';
import IsTokenStable from 'src/utils/IsTokenStable';
import IFormatPool from 'src/struct/IFormatPool';
import { SearchFilter } from 'src/utils/SearchFilter';
import {
  TickMath,
  ClmmPoolUtil,
} from '@firefly-exchange/library-sui/dist/src/spot/clmm';
import { BN } from 'bn.js';

@Injectable()
export class BluefinService {
  private readonly client: SuiClient;
  private readonly wrappedCurrencies = ['SUI', 'BTC', 'ETH', 'USDC', 'SOL'];

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
          type: pool?.tokenB?.info?.symbol ? 'impermanent loss' : 'lending',
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
        return usdMatch || this.isPoolStable(token1, token2);
      });
      return stablePoolsData;
    } catch (error) {
      console.error('Error in BluefinService.getAllPools():', error);
      return [];
    }
  }

  async getAllStablePoolsByToken(token: string): Promise<any[]> {
    try {
      const formatToken = token.toUpperCase();
      const poolsData = await this.getAllStablePools();
      const tokenPoolsData = poolsData.filter((pool) => {
        const { token1, token2 } = pool;

        const includesMatch =
          token1.includes(formatToken) || token2.includes(formatToken);

        const tokenMatch =
          token1.toUpperCase() === formatToken ||
          token2.toUpperCase() === formatToken;
        return tokenMatch || includesMatch;
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
  async getUserBalance(address: string): Promise<any> {
    try {
      const qc = new QueryChain(this.client);
      const positions = await qc.getUserPositions(mainnet.BasePackage, address);
      const formatPos: any[] = [];

      for (const pos of positions) {
        const amounts = await this.getCoinAmountsFromPositionID(
          pos.position_id,
          qc,
        );

        const pool = await qc.getPool(pos.pool_id);
        const [coinA, coinB] = pool.name.split('-');
        const decimalsA = pool.coin_a.decimals;
        const decimalsB = pool.coin_b.decimals;

        const { coinAAmount, coinBAmount } = amounts;

        formatPos.push({
          coinA: {
            name: coinA,
            amount: Number(coinAAmount) / Math.pow(10, decimalsA),
          },
          coinB: {
            name: coinB,
            amount: Number(coinBAmount) / Math.pow(10, decimalsB),
          },
        });
      }
      return formatPos;
    } catch (error) {
      console.error('Error in BluefinService.getUserBalance():', error);
      return [];
    }
  }

  async getCoinAmountsFromPositionID(posID: string, qc) {
    let pos = await qc.getPositionDetails(posID);
    let pool = await qc.getPool(pos.pool_id);

    let lowerSqrtPrice = TickMath.tickIndexToSqrtPriceX64(pos.lower_tick);
    let upperSqrtPrice = TickMath.tickIndexToSqrtPriceX64(pos.upper_tick);

    const coinAmounts = ClmmPoolUtil.getCoinAmountFromLiquidity(
      new BN(pos.liquidity),
      new BN(pool.current_sqrt_price),
      lowerSqrtPrice,
      upperSqrtPrice,
      false,
    );

    return {
      coinAAmount: coinAmounts.coinA.toString(),
      coinBAmount: coinAmounts.coinB.toString(),
    };
  }

  isPoolStable(token1: string, token2: string): boolean {
    for (let coin of this.wrappedCurrencies) {
      if (token1.includes(coin) && token2.includes(coin)) return true;
    }
    return false;
  }
}
