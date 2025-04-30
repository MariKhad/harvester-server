import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import SerializeObject from 'src/utils/Serialize';
import { QueryChain } from '@firefly-exchange/library-sui/dist/src/spot';
import { mainnet } from '../../config';
import { SuiClient } from '@firefly-exchange/library-sui';

@Injectable()
export class BluefinService {
  private readonly client: SuiClient;

  constructor(@Inject('SuiClient') client: SuiClient) {
    this.client = client;
  }

  async getAllPools(): Promise<any[]> {
    try {
      const { data } = await axios.get(
        process.env['BLUEFIN_URL'] + '/pools/info',
      );

      const serializedPoolData = data.map((item) => SerializeObject(item));
      return serializedPoolData;
    } catch (error) {
      console.error('Error in BluefinService.getAllPools():', error);
      return [];
    }
  }
  async getAllTokens(): Promise<any[]> {
    try {
      const { data } = await axios.get(
        process.env['BLUEFIN_URL'] + '/tokens/info',
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
