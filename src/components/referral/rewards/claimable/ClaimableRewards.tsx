import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface ClaimableRewardsProps {
  address?: string;
  mockData?: Reward[];
}

interface Reward {
  id: string;
  type: 'DIRECT' | 'PAIR' | 'GLORY';
  amount: string;
  created_at: string;
}

export function ClaimableRewards({ address, mockData }: ClaimableRewardsProps) {
  const { t } = useTranslation();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (mockData) {
      setRewards(mockData);
      setLoading(false);
      return;
    }
    fetchRewards();
  }, [address, mockData]);

  async function fetchRewards() {
    if (!address) return;

    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast.error(t('errors.fetchRewards'));
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim(rewardId: string) {
    if (!address || claiming) return;

    try {
      setClaiming(true);
      const { error } = await supabase
        .from('reward_transactions')
        .update({
          status: 'CLAIMED',
          claimed_at: new Date().toISOString()
        })
        .eq('id', rewardId);

      if (error) throw error;
      
      toast.success(t('rewards.claim.success'));
      await fetchRewards();
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error(t('rewards.claim.error'));
    } finally {
      setClaiming(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-purple-900/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!rewards.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        {t('rewards.claim.noRewards')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rewards.map(reward => (
        <div 
          key={reward.id}
          className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">{t(`rewards.types.${reward.type.toLowerCase()}`)}</p>
              <p className="text-lg font-bold">
                {(Number(reward.amount) / 10**18).toFixed(2)} OPE
              </p>
            </div>
            <button
              onClick={() => handleClaim(reward.id)}
              disabled={claiming}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${claiming 
                  ? 'bg-purple-900/50 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
                }
              `}
            >
              {claiming ? t('rewards.claim.claiming') : t('rewards.claim.claim')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 