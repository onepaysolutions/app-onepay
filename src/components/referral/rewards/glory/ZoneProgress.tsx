import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { supabase } from '@/lib/supabase';
import { truncateAddress } from '@/utils/address';

interface ZoneProgressProps {
  address: string;
}

interface ZoneStats {
  zone: 'left' | 'middle' | 'right';
  direct_count: number;
  team_count: number;
  direct_volume: number;
  team_volume: number;
}

export function ZoneProgress({ address }: ZoneProgressProps) {
  const { t } = useTranslation();
  const [zoneStats, setZoneStats] = useState<ZoneStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const formattedAddress = truncateAddress(address);
        if (!formattedAddress) return;

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('wallet', formattedAddress)
          .single();

        if (userError) {
          if (userError.code === 'PGRST116') {
            console.log('No user found');
            return;
          }
          console.error('Error fetching user:', userError);
          return;
        }

        if (!userData?.id) {
          console.log('No user found for address:', formattedAddress);
          return;
        }

        const { data, error } = await supabase
          .from('referral_stats')
          .select(`
            zone,
            direct_count,
            team_count,
            direct_volume,
            team_volume
          `)
          .eq('user_id', userData.id);

        if (error) throw error;
        const allZones = ['left', 'middle', 'right'].map(zone => {
          const stats = data?.find((s: ZoneStats) => s.zone === zone) || {
            zone,
            direct_count: 0,
            team_count: 0,
            direct_volume: 0,
            team_volume: 0
          };
          return stats;
        });
        setZoneStats(allZones);
      } catch (error) {
        console.error('Error fetching zone stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (address) {
      fetchStats();
    }
  }, [address]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { key: 'left', label: 'Left Zone' },
        { key: 'middle', label: 'Middle Zone' },
        { key: 'right', label: 'Right Zone' }
      ].map(({ key, label }) => {
        const stats = zoneStats.find(s => s.zone === key) || {
          direct_count: 0,
          team_count: 0,
          direct_volume: 0,
          team_volume: 0
        };

        return (
          <div key={key} className="bg-purple-900/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t(label)}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">{t("Direct Members")}</p>
                <p className="text-xl font-bold">{stats.direct_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">{t("Team Members")}</p>
                <p className="text-xl font-bold">{stats.team_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">{t("Direct Volume")}</p>
                <p className="text-xl font-bold">${stats.direct_volume.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">{t("Team Volume")}</p>
                <p className="text-xl font-bold">${stats.team_volume.toLocaleString()}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 