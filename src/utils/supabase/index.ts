import { supabase as supabaseClient } from '@/lib/supabase';

// 导出 supabase 实例
export const supabase = supabaseClient;

// 定义服务类型
interface UserService {
  getProfile: (address: string) => Promise<any>;
  updateProfile: (address: string, updates: any) => Promise<any>;
}

interface NFTService {
  getNFTs(arg0: string): unknown;
  mintNFT: (ownerAddress: string, tokenId: number, metadata: any) => Promise<any>;
}

interface ReferralService {
  getReferrals: (address: string) => Promise<any>;
}

interface RewardService {
  claimReward: (address: string, amount: string, rewardType: string, tokenAddress: string) => Promise<any>;
}

interface ZoneService {
  updateZone: (address: string, zone: string, updates: any) => Promise<any>;
}

interface ReferralUtils {
  createReferral: (referrerAddress: string, refereeAddress: string, zone: string) => Promise<any>;
}

// 实现服务
const userServiceImpl: UserService = {
  getProfile: async (address: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single();
    
    if (error) throw error;
    return data;
  },

  updateProfile: async (address: string, updates: any) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('wallet_address', address.toLowerCase())
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

const nftServiceImpl: NFTService = {
  mintNFT: async (ownerAddress: string, tokenId: number, metadata: any) => {
    const { data, error } = await supabase
      .from('nfts')
      .insert({
        owner_address: ownerAddress.toLowerCase(),
        token_id: tokenId,
        ...metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  getNFTs: function (arg0: string): unknown {
    throw new Error('Function not implemented.');
  }
};

const referralServiceImpl: ReferralService = {
  getReferrals: async (address: string) => {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_address', address.toLowerCase());
    
    if (error) throw error;
    return data;
  }
};

const rewardServiceImpl: RewardService = {
  claimReward: async (address: string, amount: string, rewardType: string, tokenAddress: string) => {
    const { data, error } = await supabase
      .from('rewards')
      .insert({
        wallet_address: address.toLowerCase(),
        amount,
        reward_type: rewardType,
        token_address: tokenAddress,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

const zoneServiceImpl: ZoneService = {
  updateZone: async (address: string, zone: string, updates: any) => {
    const { data, error } = await supabase
      .from('zones')
      .update(updates)
      .eq('wallet_address', address.toLowerCase())
      .eq('zone', zone)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

const referralUtilsImpl: ReferralUtils = {
  createReferral: async (referrerAddress: string, refereeAddress: string, zone: string) => {
    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referrer_address: referrerAddress.toLowerCase(),
        referee_address: refereeAddress.toLowerCase(),
        zone,
        status: 'active'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// 导出服务实现
export const userService = userServiceImpl;
export const nftService = nftServiceImpl;
export const referralService = referralServiceImpl;
export const rewardService = rewardServiceImpl;
export const zoneService = zoneServiceImpl;
export const referralUtils = referralUtilsImpl; 