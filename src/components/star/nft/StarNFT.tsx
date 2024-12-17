import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StarNFT.module.css';
import { OPSSale } from '../ops/OPSSale';

interface StarNFTProps {
  starLevel?: number;
}

export function StarNFT({ starLevel = 1 }: StarNFTProps) {
  const { t } = useTranslation();
  const [currentCycle] = useState(1);
  const [currentStage] = useState(1);
  const [progress] = useState(45); // 初始进度设为45%

  // Star NFT 等级对应的倍数
  const STAR_MULTIPLIERS = {
    1: 1,
    2: 2,
    3: 5,
    4: 10
  };

  // 基础价格 0.3
  const basePrice = 0.3;
  const multiplier = STAR_MULTIPLIERS[starLevel as keyof typeof STAR_MULTIPLIERS] || 1;
  const price = basePrice * multiplier;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {t("Star NFT Digital Asset Growth Plan")}
        </h2>
        <p className={styles.subtitle}>
          {t("Choose and claim your Star NFT")}
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.nftCard}>
          <div className={styles.nftHeader}>
            <span className={styles.starLevel}>
              {t("Star")} {starLevel}
            </span>
            <span className={styles.multiplier}>
              {multiplier}x
            </span>
          </div>

          <div className={styles.priceDisplay}>
            <div className={styles.priceLabel}>
              {t("Contract Value")}
            </div>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>{price.toFixed(2)}</span>
            </div>
            <div className={styles.priceInfo}>
              {t("Base")} ${basePrice.toFixed(2)} × {multiplier}
            </div>
          </div>

          <button className={styles.claimButton}>
            {t("Claim Now")}
          </button>
        </div>

        <OPSSale 
          currentCycle={currentCycle}
          currentStage={currentStage}
          totalStages={20}
          progress={progress}
        />
      </div>
    </div>
  );
} 