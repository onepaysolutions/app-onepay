import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NFTBadge } from '@/components/star/nft/NFTBadge';
import styles from './TierReward.module.css';

interface TierRewardProps {
  starLevel: number;
}

// Star NFT 等级对应的推荐层级配置
const STAR_LEVEL_TIERS = {
  1: { maxLevel: 3, color: 'text-amber-600' },
  2: { maxLevel: 8, color: 'text-gray-400' },
  3: { maxLevel: 15, color: 'text-yellow-500' },
  4: { maxLevel: 20, color: 'text-purple-400' }
};

// 每层的奖励比例配置
const LEVEL_REWARD_RATES = {
  1: 0.10, // 10%
  2: 0.05, // 5%
  3: 0.05, // 5%
  4: 0.02, // 2%
  5: 0.02, // 2%
  6: 0.02, // 2%
  7: 0.02, // 2%
  8: 0.02, // 2%
  9: 0.01, // 1%
  10: 0.01, // 1%
  11: 0.01, // 1%
  12: 0.01, // 1%
  13: 0.01, // 1%
  14: 0.005, // 0.5%
  15: 0.005, // 0.5%
  16: 0.005, // 0.5%
  17: 0.005, // 0.5%
  18: 0.005, // 0.5%
  19: 0.005, // 0.5%
  20: 0.005, // 0.5%
};

export function TierReward({ starLevel }: TierRewardProps) {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  const tierConfig = STAR_LEVEL_TIERS[starLevel as keyof typeof STAR_LEVEL_TIERS];
  if (!tierConfig) return null;

  return (
    <div className={styles.container}>
      {/* Star NFT 等级信息 */}
      <div className={styles.header}>
        <NFTBadge level={starLevel} />
        <div className={styles.tierInfo}>
          <h3 className={styles.title}>{t("Star NFT Level {{level}}", { level: starLevel })}</h3>
          <p className={styles.subtitle}>
            {t("Max Reward Level: {{level}}", { level: tierConfig.maxLevel })}
          </p>
        </div>
      </div>

      {/* 层级选择器 */}
      <div className={styles.levelSelector}>
        <div className={styles.levelGrid}>
          {Array.from({ length: tierConfig.maxLevel }, (_, i) => i + 1).map((level) => (
            <button
              key={level}
              className={`${styles.levelButton} ${
                selectedLevel === level ? styles.levelActive : styles.levelInactive
              }`}
              onClick={() => setSelectedLevel(level)}
            >
              <span className={styles.levelNumber}>{level}</span>
              <span className={styles.rewardRate}>
                {(LEVEL_REWARD_RATES[level as keyof typeof LEVEL_REWARD_RATES] * 100).toFixed(1)}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 层级详情 */}
      {selectedLevel && (
        <div className={styles.levelDetail}>
          <div className={styles.detailHeader}>
            <h4>{t("Level {{level}} Rewards", { level: selectedLevel })}</h4>
            <span className={styles.rate}>
              {(LEVEL_REWARD_RATES[selectedLevel as keyof typeof LEVEL_REWARD_RATES] * 100).toFixed(1)}%
            </span>
          </div>
          <div className={styles.benefits}>
            <div className={styles.benefit}>
              <span className={styles.label}>{t("Direct Commission")}</span>
              <span className={styles.value}>
                {(LEVEL_REWARD_RATES[selectedLevel as keyof typeof LEVEL_REWARD_RATES] * 100).toFixed(1)}%
              </span>
            </div>
            {selectedLevel <= 3 && (
              <div className={styles.benefit}>
                <span className={styles.label}>{t("Pair Reward")}</span>
                <span className={styles.value}>
                  {(LEVEL_REWARD_RATES[selectedLevel as keyof typeof LEVEL_REWARD_RATES] * 0.5 * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
