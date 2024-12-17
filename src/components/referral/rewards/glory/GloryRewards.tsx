import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from '@/lib/supabase';
import { checkAuth } from '@/lib/supabase/auth';
import { truncateAddress } from "@/utils/address";

interface GloryRewardsProps {
  address: string;
}

// 定义荣耀等级的奖励比例
const GLORY_REWARD_RATES = {
  1: 0.05, // 1%
  2: 0.10, // 2%
  3: 0.15, // 3%
  4: 0.20,  // 5%
  5: 0.25, // 10%
  6: 0.30, // 15%
};

interface ZoneStats {
  zone: 'LEFT' | 'MIDDLE' | 'RIGHT';
  direct_count: number;
  team_count: number;
  direct_volume: string;
  team_volume: string;
}

interface GloryStats {
  gloryLevel: number;
  minZoneVolume: string;
  zoneStats: ZoneStats[];
  pendingRewards: string;
  claimedRewards: string;
  totalRewards: string;
}

export function GloryRewards({ address }: GloryRewardsProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<GloryStats>({
    gloryLevel: 0,
    minZoneVolume: '0',
    zoneStats: [],
    pendingRewards: '0',
    claimedRewards: '0',
    totalRewards: '0'
  });
  const [loading, setLoading] = useState(true);

  // 计算荣耀等级
  const calculateGloryLevel = (zoneStats: ZoneStats[]): number => {
    if (zoneStats.length < 3) return 0;
    
    // 获取每个区域的团队业绩
    const volumes = zoneStats.map(stat => BigInt(stat.team_volume));
    
    // 按业绩从小到大排序
    volumes.sort((a, b) => (a < b ? -1 : 1));
    
    // 根据最小区域业绩判断等级
    const minVolume = volumes[0];
    if (minVolume >= BigInt(1000000) * BigInt(10**18)) return 4;      // 100万以上
    if (minVolume >= BigInt(500000) * BigInt(10**18)) return 3;       // 50万以上
    if (minVolume >= BigInt(100000) * BigInt(10**18)) return 2;       // 10万以上
    if (minVolume >= BigInt(10000) * BigInt(10**18)) return 1;        // 1万以上
    return 0;
  };

  // 计算最小区域业绩
  const calculateMinZoneVolume = (zoneStats: ZoneStats[]): string => {
    if (zoneStats.length < 3) return '0';
    
    const volumes = zoneStats.map(stat => BigInt(stat.team_volume));
    volumes.sort((a, b) => (a < b ? -1 : 1));
    
    return volumes[0].toString();
  };

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
        if (!walletData?.user?.zone_stats) {
          setStats({
            gloryLevel: 0,
            minZoneVolume: '0',
            zoneStats: [],
            pendingRewards: '0',
            claimedRewards: '0',
            totalRewards: '0'
          });
          return;
        }

        // 获取奖励交易记录
        const { data: rewardData, error: rewardError } = await supabase
          .from('reward_transactions')
          .select('amount, status')
          .eq('wallet_address', address.toLowerCase())
          .eq('type', 'GLORY_REWARD')
          .in('status', ['PENDING', 'SUCCESS'])
          .order('created_at', { ascending: false });

        if (rewardError) {
          console.error('Error fetching rewards:', rewardError);
        }
        const pending = (rewardData || [])
          .filter((tx: { status: string; amount: string }) => tx.status === 'PENDING')
          .reduce((sum: bigint, tx: { amount: string }) => sum + BigInt(tx.amount), BigInt(0));

        const claimed = (rewardData || [])
          .filter((tx: { status: string; amount: string }) => tx.status === 'SUCCESS')
          .reduce((sum: bigint, tx: { amount: string }) => sum + BigInt(tx.amount), BigInt(0));

        // 设置状态
        setStats({
          gloryLevel: calculateGloryLevel(walletData.user.zone_stats),
          minZoneVolume: calculateMinZoneVolume(walletData.user.zone_stats),
          zoneStats: walletData.user.zone_stats,
          pendingRewards: pending.toString(),
          claimedRewards: claimed.toString(),
          totalRewards: (pending + claimed).toString()
        });
      } catch (error) {
        console.error('Error fetching glory rewards:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGloryRewards();
  }, [address]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="bg-purple-900/30 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t("Glory Rewards")}
      </h3>

      {/* 荣耀等级信息 */}
      <div className="bg-purple-900/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">{t("Glory Level")}</p>
            <p className="text-2xl font-bold">Level {stats.gloryLevel}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">{t("Reward Rate")}</p>
            <p className="text-2xl font-bold text-purple-400">
              {(GLORY_REWARD_RATES[stats.gloryLevel as keyof typeof GLORY_REWARD_RATES] * 100 || 0)}%
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400">{t("Minimum Zone Volume")}</p>
          <p className="text-lg font-bold">
            {(Number(stats.minZoneVolume) / 10**18).toFixed(2)} USDC
          </p>
        </div>
      </div>

      {/* 区域业绩信息 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.zoneStats.map((zoneStat) => (
          <div key={zoneStat.zone} className="bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-400">{t(zoneStat.zone)}</p>
            <p className="text-lg font-bold">
              {(Number(zoneStat.team_volume) / 10**18).toFixed(2)} USDC
            </p>
            <div className="text-sm text-gray-400 mt-2">
              <p>{t("Direct")}: {zoneStat.direct_count}</p>
              <p>{t("Team")}: {zoneStat.team_count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 奖励信息 */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-500/20">
        <div>
          <p className="text-sm text-gray-400">{t("Pending Rewards")}</p>
          <p className="text-xl font-bold">
            {(Number(stats.pendingRewards) / 10**18).toFixed(2)} USDC
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">{t("Claimed Rewards")}</p>
          <p className="text-xl font-bold">
            {(Number(stats.claimedRewards) / 10**18).toFixed(2)} USDC
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">{t("Total Rewards")}</p>
          <p className="text-xl font-bold">
            {(Number(stats.totalRewards) / 10**18).toFixed(2)} USDC
          </p>
        </div>
      </div>
    </div>
  );
} 