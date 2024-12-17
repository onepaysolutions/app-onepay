import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { supabase } from '@/lib/supabase';
import { ReferralStats } from '../common/ReferralStats';
import { ReferralTree } from '../rewards/tree/ReferralTree';
import { RewardTransaction } from '@/types/supabase';
import styles from './ReferralDashboard.module.css';

interface DashboardProps {
  address: string;
}

interface RewardData {
  date: string;
  amount: number;
  type: string;
}

export function ReferralDashboard({ address }: DashboardProps) {
  const { t } = useTranslation();
  const [rewardsData, setRewardsData] = useState<RewardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data, error } = await supabase
          .from('reward_records')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .order('created_at', { ascending: true });

        if (error) throw error;

        const processedData: RewardData[] = (data || []).map(tx => ({
          date: new Date(tx.created_at).toLocaleDateString(),
          amount: Number(tx.amount) / 10**18,
          type: tx.type
        }));

        setRewardsData(processedData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [address]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* 统计数据 */}
      <ReferralStats />

      {/* 奖励趋势图表 */}
      <div className={styles.chart}>
        <h3 className={styles.chartTitle}>{t("Rewards Trend")}</h3>
        <LineChart width={800} height={400} data={rewardsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </div>

      {/* 推荐树 */}
      <div className={styles.treeSection}>
        <h3 className={styles.sectionTitle}>{t("Referral Network")}</h3>
        <ReferralTree address={address} />
      </div>
    </div>
  );
} 