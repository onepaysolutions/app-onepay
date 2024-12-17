import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { FiUsers, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useDBConnection } from '@/hooks/useDBConnection';

interface ReferralStatsProps {
  address: string;
}

interface StatsData {
  directCount: number;
  teamCount: number;
  activeCount: number;
  totalVolume: number;
  level: number;
}

export default function ReferralStats({ address }: ReferralStatsProps) {
  const { t } = useTranslation();
  const isConnected = useDBConnection();
  const [stats, setStats] = useState<StatsData>({
    directCount: 0,
    teamCount: 0,
    activeCount: 0,
    totalVolume: 0,
    level: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      // 使用模拟数据
      setStats({
        directCount: 12,
        teamCount: 45,
        activeCount: 8,
        totalVolume: 25000,
        level: 2
      });
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('referral_stats')
        .select('*')
        .eq('address', address)
        .single();

      if (error) {
        console.error('Error fetching stats:', error);
        return;
      }

      setStats(data);
      setLoading(false);
    };

    fetchStats();
  }, [address, isConnected]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-purple-900/20 rounded-lg" />
        ))}
      </div>
    );
  }

  const statItems = [
    {
      icon: FiUsers,
      label: t('referral.stats.direct'),
      value: stats.directCount,
      subValue: `${stats.activeCount} ${t('referral.stats.active')}`
    },
    {
      icon: FiStar,
      label: t('referral.stats.level'),
      value: `Level ${stats.level}`,
      subValue: `${stats.teamCount} ${t('referral.stats.team')}`
    },
    {
      icon: FiTrendingUp,
      label: t('referral.stats.volume'),
      value: `$${stats.totalVolume.toLocaleString()}`,
      subValue: t('referral.stats.total')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className="bg-purple-900/20 rounded-lg p-4 backdrop-blur-sm border border-purple-500/20"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
              <p className="text-sm text-gray-400 mt-1">{item.subValue}</p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <item.icon className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 