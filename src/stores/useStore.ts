import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  nickname: string;
  email: string;
  is_activated: boolean;
  status: string;
  referral_code?: string;
}

interface NFT {
  id: string;
  token_id: number;
  type: 'STAR' | 'ANGEL';
  star_level?: number;
  power?: number;
}

interface NFTStats {
  starNFTs: number;
  angelNFTs: number;
  totalValue: string;
}

interface ReferralRelation {
  id: string;
  level: number;
  referee: {
    id: string;
    wallets: {
      address: string;
    }[];
    star_nfts: {
      id: string;
      star_level: number;
      status: string;
    }[];
  };
}

interface UserWithReferrals {
  id: string;
  referral_relations: ReferralRelation[];
}

interface WalletWithUser {
  user: UserWithReferrals;
}

interface State {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  membershipVerified: boolean;
  isVerifyingMembership: boolean;
  currentUser: User | null;
  nftStats: NFTStats | null;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  fetchUser: (address: string) => Promise<void>;
  createNFT: (address: string, type: 'STAR' | 'ANGEL') => Promise<void>;
  updateUserStatus: (userId: string, status: string) => Promise<void>;
  verifyWallet: (address: string) => Promise<boolean>;
  verifyMembership: (address: string) => Promise<boolean>;
  fetchNFTStats: (address: string) => Promise<void>;
}

export const useStore = create<State>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  membershipVerified: false,
  isVerifyingMembership: false,
  currentUser: null,
  nftStats: null,

  setCurrentUser: (user) => set({ user }),

  fetchUser: async (address: string) => {
    try {
      set({ isLoading: true });
      
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select(`
          *,
          user:users!inner (
            id,
            nickname,
            email,
            is_activated,
            status,
            referral_code,
            referral_relations!referrer_id (
              id,
              level,
              referee:users!referee_id (
                id,
                wallets (
                  address
                ),
                star_nfts (
                  id,
                  star_level,
                  status
                )
              )
            )
          )
        `)
        .eq('address', address.toLowerCase())
        .single();

      if (walletError) throw walletError;
      
      set({ 
        user: walletData.user,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message,
        isLoading: false 
      });
    }
  },

  createNFT: async (address: string, type: 'STAR' | 'ANGEL') => {
    try {
      set({ isLoading: true });

      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('user_id')
        .eq('address', address.toLowerCase())
        .single();

      if (walletError) throw walletError;

      if (type === 'STAR') {
        const { error: nftError } = await supabase
          .from('star_nfts')
          .insert({
            wallet_address: address.toLowerCase(),
            user_id: walletData.user_id,
            star_level: 1,
            status: 'ACTIVE'
          });

        if (nftError) throw nftError;
      } else {
        const { error: nftError } = await supabase
          .from('angel_nfts')
          .insert({
            wallet_address: address.toLowerCase(),
            user_id: walletData.user_id,
            power: 1000,
            status: 'ACTIVE'
          });

        if (nftError) throw nftError;
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message,
        isLoading: false 
      });
    }
  },

  updateUserStatus: async (userId: string, status: string) => {
    try {
      set({ isLoading: true });

      const { error } = await supabase
        .from('users')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false
      });
    }
  },

  verifyWallet: async (address: string) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('address', address.toLowerCase())
        .single();

      if (error) throw error;
      return !!data;
    } catch (error) {
      return false;
    }
  },

  verifyMembership: async (address: string) => {
    try {
      set({ isVerifyingMembership: true });
      const { data, error } = await supabase
        .from('wallets')
        .select(`
          *,
          user:users!inner (
            is_activated,
            status
          )
        `)
        .eq('address', address.toLowerCase())
        .single();

      if (error) throw error;
      
      const isVerified = data?.user?.is_activated && data?.user?.status === 'ACTIVE';
      set({ membershipVerified: isVerified });
      return isVerified;
    } catch (error) {
      return false;
    } finally {
      set({ isVerifyingMembership: false });
    }
  },

  fetchNFTStats: async (address: string) => {
    try {
      set({ isLoading: true });

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

      const totalValue = (starNFTs.data || []).reduce((sum, nft) => 
        sum + BigInt(nft.contract_value), BigInt(0)
      ).toString();

      set({
        nftStats: {
          starNFTs: starNFTs.data?.length || 0,
          angelNFTs: angelNFTs.data?.length || 0,
          totalValue
        },
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false
      });
    }
  }
})); 