// 区域类型
export type ZoneType = 'LEFT' | 'MIDDLE' | 'RIGHT';

// 奖励类型
export type RewardType = 'DIRECT' | 'PAIR' | 'GLORY';

// 交易状态
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

// Star NFT 信息
export interface StarNFT {
  id: string;
  star_level: number;
  status: 'ACTIVE' | 'INACTIVE';
}

// 推荐关系
export interface ReferralRelation {
  level: number;
  referee: {
    wallets: { address: string }[];
    star_nfts: { star_level?: number }[];
  };
}

// 用户信息
export interface UserInfo {
  id: string;
  referral_relations: ReferralRelation[];
}

// 钱包信息
export interface WalletInfo {
  user: UserInfo;
}

// 奖励交易记录
export interface RewardTransaction {
  id: string;
  walletaddress: string;
  amount: string;
  type: RewardType;
  status: TransactionStatus;
  createdat: string;
}

// 荣耀等级
export interface GloryRank {
  name: string;
  requirement: number | 'Max';
  commission: number;
  minZoneVolume: string;
  progress: number;
  color: string;
}

// 荣耀统计
export interface GloryStats {
  gloryRank: number;
  minZoneVolume: string;
  zoneStats: ZoneStats[];
  pendingRewards: string;
  claimedRewards: string;
  totalRewards: string;
}

// 区域统计
export interface ZoneStats {
  zone: ZoneType;
  volume: string;
  rank: number;
  progress: number;
  directCount: number;
  teamCount: number;
  directVolume: string;
  teamVolume: string;
} 