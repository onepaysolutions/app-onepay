import { useTranslation } from 'react-i18next';
import { TierRewards } from '../TierReward/TierRewards';
import { DirectTierRewards } from '../DirectTier/DirectTierRewards';
import { ReferralTree } from '../tree/ReferralTree';
import { FloatingReferralLink } from '../link/FloatingReferralLink';
import { ReferralLink } from '../link/ReferralLink';
import { ClaimRewards } from '../claim/ClaimRewards';
import styles from './ReferralDashboard.module.css';

interface DashboardProps {
  walletaddress: string;
}

export function ReferralDashboard({ walletaddress }: DashboardProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* 顶部推荐链接区域 */}
      <div className={styles.linkSection}>
        <ReferralLink address={walletaddress} />
      </div>

      {/* 主要内容区域 - 网格布局 */}
      <div className={styles.mainGrid}>
        {/* 左侧：直推奖励和层级奖励 */}
        <div className={styles.leftColumn}>
          {/* 直推奖励 */}
          <div className={styles.rewardCard}>
            <h3 className={styles.cardTitle}>{t("Direct Tier Rewards")}</h3>
            <DirectTierRewards />
          </div>

          {/* 层级奖励 */}
          <div className={styles.rewardCard}>
            <h3 className={styles.cardTitle}>{t("Tier Rewards")}</h3>
            <TierRewards address={walletaddress} />
          </div>
        </div>

        {/* 右侧：推荐树和荣耀奖励 */}
        <div className={styles.rightColumn}>
          {/* 推荐树 */}
          <div className={styles.treeCard}>
            <h3 className={styles.cardTitle}>{t("Referral Network")}</h3>
            <ReferralTree walletAddress={walletaddress} />
          </div>

          {/* 荣耀奖励 */}
          <div className={styles.gloryCard}>
            <h3 className={styles.cardTitle}>{t("Glory Rewards")}</h3>
            <div className={styles.gloryContent}>
              <div className={styles.gloryStats}>
                <div className={styles.gloryStat}>
                  <span className={styles.gloryLabel}>{t("Total Glory Points")}</span>
                  <span className={styles.gloryValue}>0</span>
                </div>
                <div className={styles.gloryStat}>
                  <span className={styles.gloryLabel}>{t("Current Rank")}</span>
                  <span className={styles.gloryValue}>-</span>
                </div>
              </div>

              {/* 三区进度 */}
              <div className={styles.zoneProgress}>
                <div className={styles.zoneCard}>
                  <div className={styles.zoneHeader}>
                    <span className={styles.zoneLabel}>{t("Left Zone")}</span>
                    <span className={styles.zoneValue}>$0 / $1000</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '0%' }} />
                  </div>
                </div>

                <div className={styles.zoneCard}>
                  <div className={styles.zoneHeader}>
                    <span className={styles.zoneLabel}>{t("Middle Zone")}</span>
                    <span className={styles.zoneValue}>$0 / $1000</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '0%' }} />
                  </div>
                </div>

                <div className={styles.zoneCard}>
                  <div className={styles.zoneHeader}>
                    <span className={styles.zoneLabel}>{t("Right Zone")}</span>
                    <span className={styles.zoneValue}>$0 / $1000</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '0%' }} />
                  </div>
                </div>

                {/* 最小区域提示 */}
                <div className={styles.minZoneInfo}>
                  <span className={styles.minZoneLabel}>{t("Minimum Zone Progress")}</span>
                  <span className={styles.minZoneValue}>0%</span>
                </div>
              </div>

              {/* 荣耀等级进度 */}
              <div className={styles.gloryProgress}>
                <div className={styles.progressLabel}>
                  <span>{t("Progress to Next Rank")}</span>
                  <span>0/1000</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部：领取奖励区域 */}
      <div className={styles.claimSection}>
        <ClaimRewards address={walletaddress} />
      </div>
    </div>
  );
} 