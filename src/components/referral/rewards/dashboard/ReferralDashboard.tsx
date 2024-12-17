import { useTranslation } from "react-i18next";
import { useActiveAccount } from "thirdweb/react";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { DirectRewards } from "../direct/DirectRewards";
import { PairTierRewards } from "../pair/PairTierRewards";
import { GloryRewards } from "../glory/GloryRewards";
import { UserGloryCard } from "../glory/UserGloryCard";
import { ReferralLink } from "../../../../../ReferralLink";
import { ReferralTree } from "../tree/ReferralTree";
import { ZoneProgress } from "../glory/ZoneProgress";
import { generateMockTierData } from '@/utils/rewardUtils';
  import styles from './ReferralDashboard.module.css';
import { UserRankCard } from "../glory/UserRankCard";

type RewardTab = 'direct' | 'pair' | 'glory';

export function ReferralDashboard() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [activeTab, setActiveTab] = useState<RewardTab>('direct');
  const [zoneVolumes, setZoneVolumes] = useState({ 
    leftZoneVolume: 0, 
    middleZoneVolume: 0, 
    rightZoneVolume: 0 
  });
  // 定义TierData类型
  type TierData = {
    id: string;
    name: string;
    description: string;
    rewards: string[];
  };
  const [tierData, setTierData] = useState<TierData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  if (!account) {
    return <div className="text-center py-8">{t("Connect Wallet")}</div>;
  }

  const renderRewardContent = () => {
    switch (activeTab) {
      case 'direct':
        return <DirectRewards address={account.address} />;
      case 'pair':
        return <PairTierRewards address={account.address} />;
      case 'glory':
        return <GloryRewards address={account.address} />;
      default:
        return null;
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* 推荐链接 */}
      <ReferralLink address={account.address} />

      {/* 用户荣耀卡片 */}
      <UserGloryCard
        leftZoneVolume={zoneVolumes.leftZoneVolume}
        middleZoneVolume={zoneVolumes.middleZoneVolume}
        rightZoneVolume={zoneVolumes.rightZoneVolume}
      />

      {/* 用户排名卡片 */}
      <UserRankCard address={account.address} />

      {/* 奖励标签页 */}
      <div className="bg-gradient-to-br from-purple-900/30 to-black/30 rounded-xl backdrop-blur-sm border border-purple-500/20">
        {/* 标签导航 */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-purple-500/20">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'direct' 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-purple-300'}`}
          >
            {t("Direct Rewards")}
          </button>
          <button
            onClick={() => setActiveTab('pair')}
            className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'pair' 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-purple-300'}`}
          >
            {t("Pair Rewards")}
          </button>
          <button
            onClick={() => setActiveTab('glory')}
            className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'glory' 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-purple-300'}`}
          >
            {t("Glory Rewards")}
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-4">
          {renderRewardContent()}
        </div>
      </div>

      {/* 区域进度 */}
      <ZoneProgress address={account.address} />

      {/* 推荐树 */}
      {account && <ReferralTree address={account.address} />}
    </div>
  );
} 
