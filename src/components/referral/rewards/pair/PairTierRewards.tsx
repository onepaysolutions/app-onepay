import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import styles from './PairTierRewards.module.css';

interface PairReward {
  walletaddress: string;
  referreraddress: string | null;
  placementarea: string | null;
  amount: number;
  createdat: string;
}

interface PairTierRewardsProps {
  address: string;
}

export function PairTierRewards({ address }: PairTierRewardsProps) {
  const { t } = useTranslation();
  const [rewards, setRewards] = useState<PairReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setIsLoading(true);
        
        // 获取配对奖励数据
        const { data, error } = await supabase
          .from('users')
          .select(`
            walletaddress,
            referreraddress,
            placementarea,
            rewards:pair_rewards(amount, createdat)
          `)
          .eq('referreraddress', address.toLowerCase())
          .order('createdat', { ascending: false });

        if (error) throw error;
        
        setRewards(data?.map((item: any) => ({
          walletaddress: item.walletaddress,
          referreraddress: item.referreraddress,
          placementarea: item.placementarea,
          amount: item.rewards[0].amount,
          createdat: item.rewards[0].createdat
        })) || []);
      } catch (error) {
        console.error('Error fetching pair rewards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchRewards();
    }
  }, [address]);

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('rewards.pair.title')}</h3>
      
      {rewards.length > 0 ? (
        <div className={styles.rewardsList}>
          {rewards.map((reward, index) => (
            <div key={index} className={styles.rewardItem}>
              <div className={styles.rewardInfo}>
                <p className={styles.address}>
                  {reward.walletaddress.slice(0, 6)}...{reward.walletaddress.slice(-4)}
                </p>
                <p className={styles.area}>
                  {reward.placementarea || 'No Area'}
                </p>
              </div>
              <div className={styles.rewardAmount}>
                {reward.amount} OPS
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noRewards}>{t('rewards.pair.noRewards')}</p>
      )}
    </div>
  );
} 
