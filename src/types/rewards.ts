// 奖励类型
export type RewardType = 'DIRECT' | 'PAIR' | 'GLORY';

// 区域类型
export type ZoneType = 'LEFT' | 'MIDDLE' | 'RIGHT';

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

