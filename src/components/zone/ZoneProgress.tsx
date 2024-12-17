import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';

interface ZoneProgressProps {
  address: string;
}

interface ZoneStats {
  zone: 'LEFT' | 'MIDDLE' | 'RIGHT';
  direct_count: number;
  team_count: number;
  direct_volume: string;
  team_volume: string;
}

interface WalletData {
  user: {
    id: string;
    zone_stats: ZoneStats[];
  };
}

export function ZoneProgress({ address }: ZoneProgressProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<ZoneStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!address) return;
      
      try {
        // 使用 Supabase 查询
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select(`
            *,
            user:users!inner (
              id,
              zone_stats!inner (
                zone,
                direct_count,
                team_count,
                direct_volume,
                team_volume
              )
            )
          `)
          .eq('address', address.toLowerCase())
          .single();

        if (walletError) throw walletError;
        if (!walletData?.user) return;

        // 格式化数据
        const zoneStats = walletData.user.zone_stats.map((stat: ZoneStats) => ({
          zone: stat.zone,
          direct_count: stat.direct_count || 0,
          team_count: stat.team_count || 0,
          direct_volume: stat.direct_volume || '0',
          team_volume: stat.team_volume || '0'
        }));

        setStats(zoneStats);
      } catch (error) {
        console.error('Error fetching zone stats:', error);
        setError(t('Failed to load zone data'));
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [address, t]);

  if (loading) {
    return (
      <div className="animate-pulse bg-purple-900/30 rounded-xl p-6">
        <div className="h-6 bg-purple-900/30 rounded w-1/4 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-purple-900/30 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 text-red-400 rounded-xl p-6">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20">
      <h3 className="text-lg font-semibold mb-6">{t("Zone Progress")}</h3>

      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.zone}
            className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20"
          >
            <div className="mb-4">
              <h4 className="text-sm text-gray-400">{t(stat.zone)}</h4>
              <p className="text-xl font-bold">
                {(Number(stat.team_volume) / 10**18).toFixed(2)} USDC
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{t("Direct Members")}</span>
                <span>{stat.direct_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t("Team Members")}</span>
                <span>{stat.team_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t("Direct Volume")}</span>
                <span>{(Number(stat.direct_volume) / 10**18).toFixed(2)} USDC</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 