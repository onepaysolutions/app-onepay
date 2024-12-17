import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from '@/lib/supabase';

interface ReferralRewardsProps {
  address: string;
}

interface RewardTransaction {
  id: string;
  wallet_address: string;
  type: string;
  amount: string;
  status: 'PENDING' | 'CLAIMED';
  created_at: string;
  updated_at: string;
}

export function ReferralRewards({ address }: ReferralRewardsProps) {
  const { t } = useTranslation();
  const [rewards, setRewards] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRewards() {
      try {
        if (!address) return;

        const { data: rewardData, error } = await supabase
          .from('reward_transactions')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching rewards:', error);
          return;
        }

        setRewards(rewardData || []);
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
    <div className="space-y-6">
      {rewards.map((reward) => (
        <div 
          key={reward.id}
          className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">{t(reward.type)}</p>
              <p className="text-lg font-bold">
                {(Number(reward.amount) / 10**18).toFixed(2)} OPE
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">
                {new Date(reward.created_at).toLocaleDateString()}
              </p>
              <p className={`text-sm ${
                reward.status === 'PENDING' 
                  ? 'text-yellow-400' 
                  : 'text-green-400'
              }`}>
                {t(reward.status)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 