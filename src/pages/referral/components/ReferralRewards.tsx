import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveAccount } from 'thirdweb/react';
import { DirectRewards } from '@/components/referral/rewards/direct/DirectRewards';
import { PairTierRewards } from '@/components/referral/rewards/pair/PairTierRewards';
import { GloryRewards } from '@/components/referral/rewards/glory/GloryRewards';
import { ReferralStats } from '@/components/referral/common/ReferralStats';
// Removed the import statement for UserRankCard due to the error
import styles from '../styles/ReferralRewards.module.css';
import { RewardType } from '@/types/rewards';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { UserRankCard } from '@/components/referral/rewards/glory/UserRankCard';

export function ReferralRewards() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [activeTab, setActiveTab] = useState<RewardType>('DIRECT');

  if (!account) {
    return <div className="text-center py-8">{t("Connect Wallet")}</div>;
  }

  const renderRewardContent = () => {
    switch (activeTab) {
      case 'DIRECT':
        return <DirectRewards address={account.address} />;
      case 'PAIR':
        return <PairTierRewards address={account.address} />;
      case 'GLORY':
        return <GloryRewards address={account.address} />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {/* 统计信息 */}
        <ReferralStats />

        {/* 用户排名卡片 */}
        <UserRankCard address={account.address} />

        {/* 奖励标签页 */}
        <div className={styles.card}>
          <div className={styles.tabNav}>
            <button
              onClick={() => setActiveTab('DIRECT')}
              className={`${styles.tabButton} ${
                activeTab === 'DIRECT' ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
            >
              {t("Direct & Tier Rewards")}
            </button>
            <button
              onClick={() => setActiveTab('PAIR')}
              className={`${styles.tabButton} ${
                activeTab === 'PAIR' ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
            >
              {t("Pair Tier Rewards")}
            </button>
            <button
              onClick={() => setActiveTab('GLORY')}
              className={`${styles.tabButton} ${
                activeTab === 'GLORY' ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
            >
              {t("Glory Rewards")}
            </button>
          </div>

          <div className={styles.content}>
            {renderRewardContent()}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 