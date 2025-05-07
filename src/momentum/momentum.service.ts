import { Inject, Injectable } from '@nestjs/common';
import { MmtSDK } from '@mmt-finance/clmm-sdk';
import IsTokenStable from 'src/utils/IsTokenStable';
import Pool from 'src/struct/IFormatPool';
import { TokenSchema } from '@mmt-finance/clmm-sdk/dist/types';
import { SearchFilter } from 'src/utils/SearchFilter';

@Injectable()
export class MomentumService {
  private mmtSDK: MmtSDK;

  constructor(@Inject('MmtSDK') mmtSDK: MmtSDK) {
    this.mmtSDK = mmtSDK;
  }

  async getAllPools() {
    const marketData = await this.mmtSDK.Pool.getAllPools();
    return marketData;
  }

  async getAllFormatPools(search?: string): Promise<any[]> {
    try {
      const marketData = await this.mmtSDK.Pool.getAllPools();
      const formatData: Pool[] = await Promise.all(
        marketData.map((pool) =>
          this.processPool(
            pool,
            this.rewardCoin.bind(this),
            this.getTokenByTicker.bind(this),
          ),
        ),
      );
      return search ? SearchFilter(formatData, search) : formatData;
    } catch (error) {
      console.error('Error in MomentumService.getAllPools():', error);
      return [];
    }
  }

  async getAllStablePools(): Promise<any[]> {
    try {
      const marketData = await this.getAllPools();
      const stablePools = marketData.filter((pool) => {
        return pool.isStable === true;
      });

      const formatStablePools = await Promise.all(
        stablePools.map((pool) =>
          this.processPool(
            pool,
            this.rewardCoin.bind(this),
            this.getTokenByTicker.bind(this),
          ),
        ),
      );

      return formatStablePools;
    } catch (error) {
      console.error('Error in MomentumService.getAllPools():', error);
      return [];
    }
  }

  async getAllTokens(): Promise<TokenSchema[]> {
    try {
      const marketData = await this.getAllTokens();
      return marketData;
    } catch (error) {
      console.error('Error in MomentumService.getAllTokens():', error);
      return [];
    }
  }

  async getTokenByTicker(ticker: string): Promise<TokenSchema[]> {
    try {
      const marketData = await this.mmtSDK.Pool.getAllTokens();
      const result = marketData.filter((token) => {
        return token.ticker === ticker;
      });

      return result;
    } catch (error) {
      console.error('Error in MomentumService.getAllTokens():', error);
      return [];
    }
  }

  async getAllStablePoolsByToken(token: string): Promise<string | any> {
    try {
      const formatToken = token.toUpperCase();
      const poolsData = this.getAllStablePools();
      const tokenPoolsData = (await poolsData).filter((pool) => {
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
      console.error('Error in ScallopService.getAllTokenPools():', error);
      return [];
    }
  }

  async getUserBalance(address: string): Promise<any[]> {
    try {
      const balance = await this.mmtSDK.Position.getAllUserPositions(address);
      return balance;
    } catch (error) {
      console.error('Error in MomentumService.getUserBalance():', error);
      return [];
    }
  }

  rewardCoin = (str: string) => {
    const parts = str.split('::');
    return parts.length < 3 ? null : parts.pop()?.match(/[A-Z]+/)?.[0] || null;
  };

  async processPool(
    pool: any,
    rewardCoin: (coinType: string) => string,
    getTokenByTicker: (ticker: string) => Promise<any>,
  ): Promise<Pool> {
    let reward1: IReward = {};

    let reward2: IReward = {};

    if (pool.rewarders && pool.rewarders[0]) {
      const reward1_name = rewardCoin(pool.rewarders[0]?.coin_type);
      const reward1_token = await getTokenByTicker(reward1_name);
      reward1.decimals = reward1_token[0]?.decimals;
      reward1.apr = reward1.decimals ? pool.aprBreakdown.rewards[0]?.apr : null;
      reward1.hasEnded = pool.rewarders[0].hasEnded;
      reward1.name = reward1_name;
    }

    if (pool.rewarders && pool.rewarders[1]) {
      const reward2_name = rewardCoin(pool.rewarders[1]?.coin_type);
      const reward2_token = await getTokenByTicker(reward2_name);
      reward2.decimals = reward2_token[0]?.decimals;
      reward2.apr = reward2.decimals ? pool.aprBreakdown.rewards[1]?.apr : null;
      reward2.hasEnded = pool.rewarders[1].hasEnded;
      reward2.name = reward2_name;
    }

    return {
      pool_id: pool?.poolId,
      token1: pool?.tokenX.ticker,
      token2: pool?.tokenY.ticker || null,
      total_apr: pool?.aprBreakdown.total,
      reward1: reward1.hasEnded ? null : reward1.name || null,
      reward2: reward2.hasEnded ? null : reward2.name || null,
      reward1_apr: reward1.apr || null,
      reward2_apr: reward2.apr || null,
      protocol: 'momentum',
      type: pool?.tokenY.name ? 'impermanent loss' : 'lending',
      tvl: pool.tvl,
      volume_24: pool.volume24h,
      fees_24: pool.fees24h,
    };
  }
}
