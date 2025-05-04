import { Inject, Injectable } from '@nestjs/common';
import { MmtSDK } from '@mmt-finance/clmm-sdk';
import IsTokenStable from 'src/utils/IsTokenStable';

@Injectable()
export class MomentumService {
  private mmtSDK: MmtSDK;

  constructor(@Inject('MmtSDK') mmtSDK: MmtSDK) {
    this.mmtSDK = mmtSDK;
  }

  async getAllStablePools(): Promise<any[]> {
    try {
      const marketData = await this.mmtSDK.Pool.getAllPools();
      const stablePools = marketData.filter((pool) => {
        const tokenXTicker = pool.tokenX?.ticker.toUpperCase();
        const tokenYTicker = pool.tokenY?.ticker.toUpperCase();
        const usdMatch =
          IsTokenStable(tokenXTicker) && IsTokenStable(tokenYTicker);
        return usdMatch;
      });
      return stablePools;
    } catch (error) {
      console.error('Error in MomentumService.getAllPools():', error);
      return [];
    }
  }

  async getAllTokens(): Promise<any[]> {
    try {
      const marketData = await this.mmtSDK.Pool.getAllTokens();
      return marketData;
    } catch (error) {
      console.error('Error in MomentumService.getAllTokens():', error);
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
        const tokenXTicker = pool.tokenX?.ticker.toUpperCase();
        const tokenYTicker = pool.tokenY?.ticker.toUpperCase();
        return tokenXTicker === formatToken || tokenYTicker === formatToken;
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
}
