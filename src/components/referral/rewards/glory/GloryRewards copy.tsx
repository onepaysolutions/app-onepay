import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from '@/lib/supabase/supabase';
import { checkAuth } from '@/lib/supabase/auth';
import styles from "./GloryRewards.module.css";

// 定义 Glory 等级配置
const GLORY_RANKS = {
  0: {
    name: 'Citizen',
    requirement: 0,
    commission: 0,
    minZoneVolume: '0',
    progress: 0,
    color: 'bg-gray-600'
  },
  1: {
    name: 'Knight',
    requirement: 10000,
    commission: 0.01,
    minZoneVolume: '10000000000000000000000', // 10000 * 10^18
    progress: 33,
    color: 'bg-purple-500'
  },
  2: {
    name: 'Baron',
    requirement: 30000,
    commission: 0.02,
    minZoneVolume: '30000000000000000000000', // 30000 * 10^18
    progress: 66,
    color: 'bg-pink-500'
  },
  3: {
    name: 'Count',
    requirement: 'Max',
    commission: 0.03,
    minZoneVolume: '50000000000000000000000', // 50000 * 10^18
    progress: 100,
    color: 'bg-yellow-500'
  }
};

// 定义接口
interface GloryRewardsProps {
  address: string;
}

interface GloryStats {
  gloryRank: number;
  minZoneVolume: string;
  zoneStats: ZoneStats[];
  pendingRewards: string;
  claimedRewards: string;
  totalRewards: string;
}

interface ZoneStats {
  zone: ZoneType;
  volume: string;
  rank: number;
  progress: number;
}

type ZoneType = 'LEFT' | 'MIDDLE' | 'RIGHT';

// 计算最小区域体量
function calculateMinZoneVolume(zoneStats: ZoneStats[]): string {
  if (!zoneStats || zoneStats.length === 0) return '0';
  const volumes = zoneStats.map(zone => BigInt(zone.volume));
  return volumes.reduce((min, curr) => curr < min ? curr : min, volumes[0]).toString();
}

export function GloryRewards({ address }: GloryRewardsProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<GloryStats>({
    gloryRank: 0,
    minZoneVolume: '0',
    zoneStats: [],
    pendingRewards: '0',
    claimedRewards: '0',
    totalRewards: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGloryRewards() {
      try {
        const session = await checkAuth();
        if (!session) {
          throw new Error('Not authenticated');
        }

        if (!address) return;

        // 获取用户区域统计
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select(`
            *,
            user:users!inner (
              id,
              zone_stats (
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
        
        // 处理数据并更新状态
        if (walletData?.user?.zone_stats) {
          const zoneStats = walletData.user.zone_stats.map((zone: any) => ({
            zone: zone.zone as ZoneType,
            volume: zone.team_volume,
            rank: calculateGloryRank([{
              zone: zone.zone as ZoneType,
              volume: zone.team_volume,
              rank: 0,
              progress: 0
            }]),
            progress: calculateProgress(zone.team_volume, 1)
          }));

          setStats(prev => ({
            ...prev,
            zoneStats,
            minZoneVolume: calculateMinZoneVolume(zoneStats)
          }));
        }

      } catch (error) {
        console.error('Error fetching glory rewards:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGloryRewards();
  }, [address]);

  // 计算荣耀等级
  const calculateGloryRank = (zones: ZoneStats[]): number => {
    if (zones.length < 3) return 0;
    
    // 检查是否有区域达到Baron
    const hasBaronZone = zones.some(zone => 
      BigInt(zone.volume) >= BigInt(30000) * BigInt(10**18)
    );
    if (hasBaronZone) return 3; // Count

    // 检查所有区域是否达到30000
    const allZonesReachBaron = zones.every(zone => 
      BigInt(zone.volume) >= BigInt(30000) * BigInt(10**18)
    );
    if (allZonesReachBaron) return 2; // Baron

    // 检查所有区域是否达到10000
    const allZonesReachKnight = zones.every(zone => 
      BigInt(zone.volume) >= BigInt(10000) * BigInt(10**18)
    );
    if (allZonesReachKnight) return 1; // Knight

    return 0; // Citizen
  };

  // 计算进度条
  const calculateProgress = (volume: string, targetRank: number): number => {
    const currentVolume = Number(volume) / 10**18;
    const requirement = GLORY_RANKS[targetRank as keyof typeof GLORY_RANKS].requirement;
    if (typeof requirement === 'string') return 0;
    return Math.min((currentVolume / requirement) * 100, 100);
  };

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className="text-lg font-semibold mb-4">
        {t("Glory Ranks")}
      </h3>

      {/* 当前等级和分佣信息 */}
      <div className="bg-purple-900/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">{t("Current Rank")}</p>
            <p className="text-2xl font-bold">
              {GLORY_RANKS[stats.gloryRank as keyof typeof GLORY_RANKS].name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">{t("Commission Rate")}</p>
            <p className={styles.commissionRate}>
              {(GLORY_RANKS[stats.gloryRank as keyof typeof GLORY_RANKS].commission * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* 区域进度信息 */}
      <div className={styles.zoneGrid}>
        {stats.zoneStats.map((zone) => {
          const isMinZone = zone.volume === stats.minZoneVolume;
          return (
            <div 
              key={zone.zone}
              className={`${styles.zoneCard} ${isMinZone ? styles.minZoneHighlight : ''}`}
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">
                  {t(zone.zone)}
                  {isMinZone && (
                    <span className="ml-2 text-red-400 text-xs">
                      ({t("Minimum Zone")})
                    </span>
                  )}
                </span>
                <span className="text-sm font-medium">
                  {GLORY_RANKS[zone.rank as keyof typeof GLORY_RANKS].name}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={`${styles.progressFill} ${GLORY_RANKS[zone.rank as keyof typeof GLORY_RANKS].color}`}
                  style={{ width: `${zone.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {(Number(zone.volume) / 10**18).toFixed(2)} USDC
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 
