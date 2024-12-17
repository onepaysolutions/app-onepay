import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type ZoneStatsRow = Tables['zone_stats']['Row'];

export const api = {
  // 获取用户信息
  async getUser(address: string) {
    const { data, error } = await supabase
      .from('wallets')
      .select(`
        *,
        user:users!inner (
          id,
          nickname,
          email,
          is_activated,
          status,
          referral_relations (
            id,
            level,
            referee:users (
              id,
              wallets (address),
              star_nfts (
                id,
                level,
                pair_rewards (
                  generation,
                  amount,
                  status
                )
              )
            )
          )
        )
      `)
      .eq('address', address.toLowerCase())
      .single();

    if (error) throw error;
    return data;
  },

  // 获取用户的 NFTs
  async getUserNFTs(address: string) {
    const [starNFTs, angelNFTs] = await Promise.all([
      supabase
        .from('star_nfts')
        .select('*')
        .eq('wallet_address', address.toLowerCase()),
      supabase
        .from('angel_nfts')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
    ]);

    return {
      starNFTs: starNFTs.data || [],
      angelNFTs: angelNFTs.data || []
    };
  },

  // 获取用户的区域统计
  

  // 获取用户的奖励记录
  async getRewardTransactions(address: string) {
    const { data, error } = await supabase
      .from('reward_transactions')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}; 

