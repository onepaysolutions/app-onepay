import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { truncateAddress } from "@/utils/address";
import { NFTBadge } from "@/components/star/nft/NFTBadge";

interface UserRankCardProps {
  address: string;
}

interface RankData {
  rank: number;
  starLevel: number;
  teamVolume: string;
  directCount: number;
  teamCount: number;
}

export function UserRankCard({ address }: UserRankCardProps) {
  const { t } = useTranslation();
  const [rankData, setRankData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRankData() {
      if (!address) return;

      try {
        // 获取用户数据
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select(`
            *,
            user:users (
              id,
              nickname,
              star_nfts (
                star_level
              ),
              zone_stats (
                direct_count,
                team_count,
                team_volume
              )
            )
          `)
          .eq('address', address.toLowerCase())
          .single();

        if (walletError) throw walletError;
        if (!walletData?.user) return;

        // 获取所有用户的团队业绩进行排名
        const { data: allUsers, error: rankError } = await supabase
          .from('users')
          .select(`
            id,
            zone_stats (
              team_volume
            )
          `);

        if (rankError) throw rankError;

        // 计算排名
        const volumes = allUsers
          .map((user: { id: string; zone_stats: { team_volume: string }[] }) => ({
            id: user.id,
            volume: BigInt(user.zone_stats[0]?.team_volume || '0')
          }))
          .sort((a: { volume: BigInt }, b: { volume: BigInt }) => (b.volume > a.volume ? 1 : -1));

        const userRank = volumes.findIndex((v: { id: string }) => v.id === walletData.user.id) + 1;

        setRankData({
          rank: userRank,
          starLevel: walletData.user.star_nfts[0]?.star_level || 0,
          teamVolume: walletData.user.zone_stats[0]?.team_volume || '0',
          directCount: walletData.user.zone_stats[0]?.direct_count || 0,
          teamCount: walletData.user.zone_stats[0]?.team_count || 0
        });
      } catch (error) {
        console.error('Error fetching rank data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRankData();
  }, [address]);

  if (loading) {
    return (
      <div className="animate-pulse bg-purple-900/30 rounded-xl p-6">
        <div className="h-6 bg-purple-900/30 rounded w-1/4 mb-4" />
        <div className="space-y-3">
          <div className="h-16 bg-purple-900/30 rounded" />
          <div className="h-16 bg-purple-900/30 rounded" />
        </div>
      </div>
    );
  }

  if (!rankData) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{t("Your Rank")}</h3>
        <NFTBadge level={rankData.starLevel} />
      </div>

      <div className="grid gap-4">
        {/* 排名信息 */}
        <div className="bg-purple-900/20 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">{t("Global Rank")}</span>
            <span className="text-2xl font-bold text-purple-400">#{rankData.rank}</span>
          </div>
        </div>

        {/* 业绩信息 */}
        <div className="bg-purple-900/20 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">{t("Team Volume")}</span>
            <span className="text-lg font-bold">
              {(Number(rankData.teamVolume) / 10**18).toFixed(2)} USDC
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">{t("Direct Members")}</span>
            <span>{rankData.directCount}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">{t("Team Size")}</span>
            <span>{rankData.teamCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}