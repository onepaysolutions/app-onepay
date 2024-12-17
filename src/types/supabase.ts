type Tables = Database['public']['Tables']

export interface User {
  id: string;
  nickname: string;
  email: string;
  is_activated: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  referral_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  address: string;
  user_id: string;
  is_primary: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  level: number;
  zone: 'LEFT' | 'MIDDLE' | 'RIGHT';
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface StarNFT {
  id: string;
  token_id: number;
  wallet_address: string;
  user_id: string;
  star_level: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BURNED';
  created_at: string;
  updated_at: string;
}

export interface Reward {
  id: string;
  user_id: string;
  type: 'DIRECT' | 'PAIR' | 'GLORY' | 'OPS';
  amount: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  created_at: string;
  updated_at: string;
}

export interface OPSCycle {
  id: string;
  cycle_number: number;
  stage_number: number;
  price: string;
  total_amount: string;
  sold_amount: string;
  start_time: string;
  end_time: string;
  status: 'ACTIVE' | 'COMPLETED';
  created_at: string;
  updated_at: string;
}

// 自定义类型
export interface TeamStructure {
  member_wallet: string;
  referrer_wallet: string;
  level: number;
  zone: string;
  personal_ops: number;
  team_ops: number;
}

export interface LevelReward {
  level: number;
  reward_rate: number;
  reward_amount: number;
  recipient_wallet: string;
}

// 常量
export const REWARD_TYPES = {
  DIRECT: 'DIRECT',
  PAIR: 'PAIR', 
  GLORY: 'GLORY',
  OPS: 'OPS'
} as const

export const REWARD_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
} as const

export const ZONES = {
  LEFT: 'LEFT',
  MIDDLE: 'MIDDLE', 
  RIGHT: 'RIGHT'
} as const

export const NFT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BURNED: 'BURNED'
} as const

export interface Database {
  public: {
    Tables: {
      ops_presale_stages: {
        Row: {
          id: number;
          cycle: number;
          stage: number;
          price: number;
          total_amount: number;
          sold_amount: number;
          status: string;
          start_time: string | null;
          end_time: string | null;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ops_presale_stages']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['ops_presale_stages']['Row']>;
      };
      tier_rewards: {
        Row: {
          id: number;
          nft_id: number;
          presale_id: number;
          level: number;
          amount: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tier_rewards']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['tier_rewards']['Row']>;
      };
      pair_rewards: {
        Row: {
          id: number;
          nft_id: number;
          tier_reward_id: number;
          generation: number;
          amount: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pair_rewards']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['pair_rewards']['Row']>;
      };
      zone_stats: {
        Row: {
          id: number;
          user_id: string;
          zone: string;
          direct_count: number;
          team_count: number;
          direct_volume: string;
          team_volume: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['zone_stats']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['zone_stats']['Row']>;
      };
    };
  };
} 

export interface RewardTransaction {
  id: string;
  wallet_address: string;
  amount: string;
  type: 'DIRECT' | 'PAIR' | 'GLORY';
  status: 'PENDING' | 'SUCCESS';
  created_at: string;
} 

export interface ReferralRelation {
  id: string;
  referrer_id: string;
  referee_id: string;
  level: number;
  created_at: string;
}

export interface RewardRecord {
  id: string;
  wallet_address: string;
  amount: string;
  type: 'DIRECT' | 'PAIR' | 'GLORY';
  status: 'PENDING' | 'SUCCESS';
  created_at: string;
} 