import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface OPEInfoCardProps {
  address?: string;
}

interface RewardStats {
  totalRewards: string;
  claimRewards: string;
  referralRewards: string;
}

export function OPEInfoCard({ address }: OPEInfoCardProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<RewardStats>({
    totalRewards: '0',
    claimRewards: '0',
    referralRewards: '0'
  });

  useEffect(() => {
    async function fetchRewardStats() {
      if (!address) return;

      try {
        // Get total rewards from reward_distributions
        const { data: rewards } = await supabase
          .from('reward_distributions')
          .select('amount, reward_type')
          .eq('wallet_address', address)
          .eq('status', 'completed');

        if (rewards) {
          const claimRewards = rewards
            .filter((r: { reward_type: string; amount: string }) => r.reward_type === 'angel_nft_claim')
            .reduce((sum: number, r: { amount: string }) => sum + Number(r.amount), 0);
          const referralRewards = rewards
            .filter((r: { reward_type: string; amount: string }) => r.reward_type === 'referral')
            .reduce((sum: number, r: { amount: string }) => sum + Number(r.amount), 0);

          setStats({
            totalRewards: String(claimRewards + referralRewards),
            claimRewards: String(claimRewards),
            referralRewards: String(referralRewards)
          });
        }

      } catch (error) {
        console.error('Error fetching reward stats:', error);
      }
    }

    fetchRewardStats();
  }, [address]);

  return (
    <div className="bg-purple-800/30 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-semibold mb-2">OPE Balance</h3>
      <p className="text-3xl font-bold">
        {Number(stats.totalRewards) / 10**18} OPE
      </p>
      <div className="mt-2 text-sm text-gray-300">
        <p>Claim Rewards: {Number(stats.claimRewards) / 10**18} OPE</p>
        <p>Referral Rewards: {Number(stats.referralRewards) / 10**18} OPE</p>
      </div>
    </div>
  );
} 