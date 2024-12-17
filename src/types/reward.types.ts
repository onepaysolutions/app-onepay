export interface TierReward {
    tier: number;
    percentage: number;
  }
  
  export interface PairingReward {
    star: number;
    tier: number;
    percentage: number;
  }
  
  export const TIER_REWARDS: TierReward[] = [
    { tier: 1, percentage: 10 },
    { tier: 2, percentage: 5 },
    { tier: 3, percentage: 5 },
    { tier: 4, percentage: 2 },
    { tier: 5, percentage: 2 },
    { tier: 6, percentage: 2 },
    { tier: 7, percentage: 2 },
    { tier: 8, percentage: 2 },
    { tier: 9, percentage: 1 },
    { tier: 10, percentage: 1 },
    { tier: 11, percentage: 1 },
    { tier: 12, percentage: 1 },
    { tier: 13, percentage: 1 },
    { tier: 14, percentage: 2 },
    { tier: 15, percentage: 2 },
    { tier: 16, percentage: 2 },
    { tier: 17, percentage: 2 },
    { tier: 18, percentage: 2 },
    { tier: 19, percentage: 2 },
    { tier: 20, percentage: 2 }
  ];
  
  export const PAIRING_REWARDS: PairingReward[] = [
    { star: 2, tier: 1, percentage: 5 },
    { star: 3, tier: 1, percentage: 5 },
    { star: 3, tier: 2, percentage: 3 },
    { star: 4, tier: 1, percentage: 5 },
    { star: 4, tier: 2, percentage: 3 },
    { star: 4, tier: 3, percentage: 2 }
  ];