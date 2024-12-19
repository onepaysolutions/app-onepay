import { supabase } from '@/lib/supabase';

interface StarNFTTransaction {
  wallet_address: string;
  transaction_hash: string;
  token_id: number;
  star_level: number;
  created_at?: string;
}

export class StarNFTService {
  static claimNFT: any;
  static async recordTransaction(walletAddress: string, transactionHash: string, tokenId: number) {
    const transaction: StarNFTTransaction = {
      wallet_address: walletAddress,
      transaction_hash: transactionHash,
      token_id: tokenId,
      star_level: 1 // 初始 star level
    };

    const { data, error } = await supabase
      .from('star_nft_transactions')
      .insert(transaction);

    if (error) {
      throw error;
    }

    return data;
  }

  static async getStarLevel(walletAddress: string) {
    const { data, error } = await supabase
      .from('star_nft_transactions')
      .select('star_level')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      console.error('Error getting star level:', error);
      return 0;
    }

    return data?.star_level || 0;
  }

  static async updateStarLevel(walletAddress: string, newLevel: number) {
    const { error } = await supabase
      .from('star_nft_transactions')
      .update({ star_level: newLevel })
      .eq('wallet_address', walletAddress);

    if (error) {
      throw error;
    }
  }

  static async getTransactionHistory(walletAddress: string) {
    const { data, error } = await supabase
      .from('star_nft_transactions')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as StarNFTTransaction[];
  }

  static async getTotalStars(walletAddress: string) {
    const { data, error } = await supabase
      .from('star_nft_transactions')
      .select('token_id')
      .eq('wallet_address', walletAddress);

    if (error) {
      console.error('Error getting total stars:', error);
      return 0;
    }

    return data?.length || 0;
  }
} 