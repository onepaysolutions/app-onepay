import { TIER_REWARDS } from '../config/rewards';

export interface TierData {
  level: number;
  reward: number;
  walletCount: number;
}

export function generateMockTierData(baseReward: number, maxLevel: number): TierData[] {
  return TIER_REWARDS
    .filter(({ tier }) => tier <= maxLevel)
    .map((tier) => ({
      level: tier.tier,
      reward: baseReward * (tier.percentage / 100),
      walletCount: Math.floor(Math.random() * 10) + 1,
    }));
}

/**
 * 格式化奖励金额
 * @param amount - 奖励金额
 * @returns string - 格式化后的金额字符串
 */
export function formatRewardAmount(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K`;
  }
  return amount.toFixed(2);
} 