import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { truncateAddress } from "@/utils/address";
import { NFTBadge } from "@/components/star/nft/NFTBadge";
import { supabase } from '@/lib/supabase/supabase';

interface DirectRewardsProps {
  address: string;
}

// 定义每层的奖励比例
const LEVEL_REWARD_RATES = {
  1: 0.10, // 10%
  2: 0.05, // 5%
  3: 0.05, // 5%
  4: 0.02, // 2%
  5: 0.02,
  6: 0.02,
  7: 0.02,
  8: 0.02,
  9: 0.01, // 1%
  10: 0.01,
  11: 0.01,
  12: 0.01,
  13: 0.01,
  14: 0.02, // 2%
  15: 0.02,
  16: 0.02,
  17: 0.02,
  18: 0.02,
  19: 0.02,
  20: 0.02
};

interface TierReward {
  starLevel: number;
  maxLevels: number;
  directRewards: {
    [level: number]: string;  
  };
  rollupRewards: string;     // 汇总的 rollup 奖励
  totalRewards: string;
}

interface RewardStats {
  tier: TierReward | null;
  pending: string;
  claimed: string;
}

interface WalletData {
  user: {
    id: string;
    nickname: string;
    star_nfts: {
      id: string;
      star_level: number;
    }[];
    referrals: {
      id: string;
      level: number;
      referee: {
        id: string;
        wallets: {
          address: string;
        }[];
      };
    }[];
  };
}

interface Referral {
  id: string;
  level: number;
  referee: {
    id: string;
    wallets: {
      address: string;
    }[];
  };
}

// 添加类型定义
interface Transaction {
  status: string;
  amount: string;
  from_address: string;
}

export function DirectRewards({ address }: DirectRewardsProps) {
  const { t } = useTranslation();
  const [rewards, setRewards] = useState<RewardStats>({
    tier: null,
    pending: '0',
    claimed: '0'
  });
  const [loading, setLoading] = useState(true);

  // 获取等级对应的最大层数
  const getMaxLevelsByTier = (starLevel: number): number => {
    switch (starLevel) {
      case 1: return 3;
      case 2: return 8;
      case 3: return 13;
      case 4: return 20;
      default: return 0;
    }
  };

  useEffect(() => {
    async function fetchRewards() {
      try {
        if (!address) return;

        // 使用 Supabase 查询
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select(`
            *,
            user:users!inner (
              id,
              nickname,
              referrals!referrer_id (
                id,
                level,
                referee:users!referee_id (
                  id,
                  wallets (
                    address
                  )
                )
              )
            )
          `)
          .eq('address', address.toLowerCase())
          .single();

        if (walletError) throw walletError;
        if (!walletData?.user) return;

        const highestStarNFT = walletData.star_nfts[0];
        const maxLevels = getMaxLevelsByTier(highestStarNFT.starLevel);
        // 获取所有下线的 OPS 预售交易
        const referralSales = await supabase
          .from('transactions')
          .select(`
            id,
            amount,
            from_address,
            type,
            status,
            created_at
          `)
          .eq('type', 'OPS_PRESALE')
          .eq('status', 'SUCCESS')
          .in('from_address', walletData.user.referrals.map((ref: Referral) => 
            ref.referee.wallets[0].address.toLowerCase()
          ));

        // 计算每层的奖励
        const directRewards: { [level: number]: string } = {};
        let rollupRewards = BigInt(0);
        let totalRewards = BigInt(0);

        // 遍历 20 层
        for (let level = 1; level <= 20; level++) {
          const levelSales = referralSales.data?.filter((sale: Transaction) => {
            const referral = walletData.user.referrals.find((ref: Referral) => 
              ref.referee.wallets[0].address.toLowerCase() === sale.from_address.toLowerCase()
            );
            return referral && referral.level === level;
          }) || [];

          const levelAmount = levelSales.reduce((sum: bigint, sale: Transaction) => {
            const saleAmount = BigInt(sale.amount);
            const rewardRate = LEVEL_REWARD_RATES[level as keyof typeof LEVEL_REWARD_RATES] || 0;
            return sum + (saleAmount * BigInt(Math.floor(rewardRate * 100))) / BigInt(100);
          }, BigInt(0));

          if (level <= maxLevels) {
            directRewards[level] = levelAmount.toString();
            totalRewards += levelAmount;
          } else {
            rollupRewards += levelAmount;
            totalRewards += levelAmount;
          }
        }

        // 获取奖励交易记录
        const { data: rewardData, error: rewardError } = await supabase
          .from('reward_transactions')
          .select('amount, status')
          .eq('wallet_address', address.toLowerCase())
          .eq('type', 'DIRECT_REWARD')
          .in('status', ['PENDING', 'SUCCESS']);

        if (rewardError) {
          console.error('Error fetching rewards:', rewardError);
        }

        const pending = (rewardData || [])
          .filter((tx: { status: string }) => tx.status === 'PENDING')
          .reduce((sum: bigint, tx: { amount: string }) => sum + BigInt(tx.amount), BigInt(0));

        const claimed = (rewardData || [])
          .filter((tx: { status: string }) => tx.status === 'SUCCESS')
          .reduce((sum: bigint, tx: { amount: string }) => sum + BigInt(tx.amount), BigInt(0));

        setRewards({
          tier: {
            starLevel: highestStarNFT.starLevel,
            maxLevels,
            directRewards,
            rollupRewards: rollupRewards.toString(),
            totalRewards: totalRewards.toString()
          },
          pending: pending.toString(),
          claimed: claimed.toString()
        });
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRewards();
  }, [address]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="bg-purple-900/30 rounded-xl p-6">
      <div className="grid gap-6">
        {/* Tier 信息 */}
        {rewards.tier && (
          <div className="border-b border-purple-500/20 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NFTBadge level={rewards.tier.starLevel} />
                <div>
                  <p className="text-sm text-gray-400">{t("Current Tier")}</p>
                  <p className="text-lg font-bold">Level {rewards.tier.starLevel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{t("Max Reward Levels")}</p>
                <p className="text-lg font-bold">{rewards.tier.maxLevels}</p>
              </div>
            </div>
          </div>
        )}

        {/* 层级奖励明细 */}
        {rewards.tier && (
          <div className="space-y-2">
            {Array.from({ length: 20 }, (_, i) => i + 1).map(level => (
              <div key={level} className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {t("Level")} {level}
                </span>
                <span className="text-sm font-medium">
                  {level <= rewards.tier!.maxLevels ? (
                    // 显示直接奖励
                    `${(Number(rewards.tier!.directRewards[level] || '0') / 10**18).toFixed(2)} OPE`
                  ) : (
                    // 显示 Roll Up 标记
                    <span className="text-purple-400">Roll Up ↑</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 汇总信息 */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-purple-500/20">
          <div>
            <p className="text-sm text-gray-400">{t("Direct Rewards")}</p>
            <p className="text-xl font-bold">
              {rewards.tier ? (
                Object.values(rewards.tier.directRewards)
                  .reduce((sum, amount) => sum + Number(amount), 0) / 10**18
              ).toFixed(2) : '0'} OPE
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">{t("Roll Up Rewards")}</p>
            <p className="text-xl font-bold">
              {rewards.tier ? (Number(rewards.tier.rollupRewards) / 10**18).toFixed(2) : '0'} OPE
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">{t("Total Rewards")}</p>
            <p className="text-xl font-bold">
              {rewards.tier ? (Number(rewards.tier.totalRewards) / 10**18).toFixed(2) : '0'} OPE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 