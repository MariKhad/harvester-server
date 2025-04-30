import { Inject, Injectable } from '@nestjs/common';
import { MmtSDK } from '@mmt-finance/clmm-sdk';

@Injectable()
export class MomentumService {
  private mmtSDK: MmtSDK;

  constructor(@Inject('MmtSDK') mmtSDK: MmtSDK) {
    this.mmtSDK = mmtSDK;
  }

  async getAllPools(): Promise<any[]> {
    try {
      const marketData = await this.mmtSDK.Pool.getAllPools();
      return marketData;
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
