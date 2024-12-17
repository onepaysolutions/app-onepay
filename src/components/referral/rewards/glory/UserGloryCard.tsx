import React from 'react';
import styles from './UserGloryCard.module.css';
import { useTranslation } from "react-i18next";

interface GloryRequirement {
  level: number;
  name: string;
  color: string;
  minVolume: number;  // 最小区域业绩要求(USDC)
  rewardRate: number; // 奖励比例
}

// 荣耀等级配置
const GLORY_LEVELS: GloryRequirement[] = [
  { level: 0, name: "Citizn", color: "#64B5F6", minVolume: 0, rewardRate: 0 },
  { level: 1, name: "Knight", color: "#CD7F32", minVolume: 10000, rewardRate: 0.05 },
  { level: 2, name: "Baron", color: "#C0C0C0", minVolume: 30000, rewardRate: 0.10 },
  { level: 3, name: "Count", color: "#FFD700", minVolume: 0, rewardRate: 0.15 },
  { level: 4, name: "Marquis", color: "#B9F2FF", minVolume: 0, rewardRate: 0.20 },
  { level: 5, name: "Duke", color: "#B9F2FF", minVolume: 0, rewardRate: 0.25 },
  { level: 6, name: "Grand Sovereign", color: "#B9F2FF", minVolume: 0, rewardRate: 0.30 }
];

interface UserGloryCardProps {
  leftZoneVolume: number;
  middleZoneVolume: number;
  rightZoneVolume: number;
  onZoneClick?: (zone: string) => void;
}

export function UserGloryCard({
  leftZoneVolume,
  middleZoneVolume,
  rightZoneVolume,
  onZoneClick
}: UserGloryCardProps) {
  const { t } = useTranslation();

  const getCurrentGloryLevel = () => {
    const minVolume = Math.min(leftZoneVolume, middleZoneVolume, rightZoneVolume);
    for (let i = GLORY_LEVELS.length - 1; i >= 0; i--) {
      if (minVolume >= GLORY_LEVELS[i].minVolume) {
        return GLORY_LEVELS[i];
      }
    }
    return GLORY_LEVELS[0];
  };

  const currentGlory = getCurrentGloryLevel();
  const nextGlory = GLORY_LEVELS[currentGlory.level + 1];

  const calculateProgress = (volume: number) => {
    if (!nextGlory) return 100;
    const progress = (volume / nextGlory.minVolume) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("Glory Progress")}</h2>

      <div className={styles.gloryLevel}>
        <div className={styles.gloryName} style={{ color: currentGlory.color }}>
          {t(currentGlory.name)}
        </div>
        <div className={styles.rewardRate}>
          {t("Reward Rate")}: {(currentGlory.rewardRate * 100)}%
        </div>
      </div>

      {nextGlory && (
        <div className={styles.nextLevel}>
          <span>{t("Next Level")}:</span>
          <span>{t(nextGlory.name)} ({(nextGlory.rewardRate * 100)}%)</span>
          <span>{t("Required")}: {nextGlory.minVolume.toLocaleString()} USDC</span>
        </div>
      )}

      <div className={styles.zonesContainer}>
        {[
          { name: t('Left Zone'), volume: leftZoneVolume },
          { name: t('Middle Zone'), volume: middleZoneVolume },
          { name: t('Right Zone'), volume: rightZoneVolume }
        ].map((zone) => (
          <div 
            key={zone.name} 
            className={`${styles.zoneProgress} ${onZoneClick ? styles.clickable : ''}`}
            onClick={() => onZoneClick?.(zone.name)}
          >
            <div className={styles.zoneHeader}>
              <span className={styles.zoneName}>{zone.name}</span>
              <span className={styles.zoneVolume}>
                {(zone.volume / 10**18).toFixed(2)} USDC
              </span>
            </div>
            <div className={styles.zoneBar}>
              <div 
                className={styles.zoneProgressFill}
                style={{ 
                  width: `${calculateProgress(zone.volume)}%`,
                  backgroundColor: currentGlory.color
                }}
              />
            </div>
            {nextGlory && (
              <span className={styles.progressText}>
                {calculateProgress(zone.volume).toFixed(1)}%
              </span>
            )}
          </div>
        ))}
      </div>

      <div className={styles.minVolume}>
        <span>{t("Minimum Zone Volume")}:</span>
        <span>
          {(Math.min(leftZoneVolume, middleZoneVolume, rightZoneVolume) / 10**18).toFixed(2)} USDC
        </span>
      </div>
    </div>
  );
} 