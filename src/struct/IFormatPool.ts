interface IFormatPool {
  pool_id: string | null;
  token1: string;
  token2: string | null;
  total_apr: string | number;
  reward1: string | null;
  reward2: string | null;
  reward1_apr: string | null;
  reward2_apr: string | null;
  protocol: string;
  type: 'impermanent loss' | 'lending';
  tvl: string | number;
  volume_24: string;
  fees_24: string;
}

export default IFormatPool;
