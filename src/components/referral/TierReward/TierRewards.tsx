import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiChevronRight, FiLock, FiStar } from 'react-icons/fi';
import styles from './TierRewards.module.css';

interface TierRewardsProps {
  address: string;
}

interface TierGroup {
  id: number;
  name: string;
  levels: Array<{
    level: number;
    rate: string;
  }>;
  starNFTRequired: number;
  isActive: boolean;
}

export function TierRewards({ address }: TierRewardsProps) {
  const { t } = useTranslation();
  const [expandedGroups, setExpandedGroups] = useState<number[]>([1]);
  const [hasStarNFT, setHasStarNFT] = useState(false);

  // 修改后的分组定义
  const tierGroups: TierGroup[] = [
    {
      id: 1,
      name: "Primary Tier Rewards",
      levels: [
        { level: 1, rate: "10%" },
        { level: 2, rate: "5%" },
        { level: 3, rate: "5%" }
      ],
      starNFTRequired: 1,
      isActive: true
    },
    {
      id: 2,
      name: "Growth Tier Rewards",
      levels: [
        { level: 4, rate: "2%" },
        { level: 5, rate: "2%" },
        { level: 6, rate: "2%" },
        { level: 7, rate: "2%" },
        { level: 8, rate: "2%" }
      ],
      starNFTRequired: 2,
      isActive: false
    },
    {
      id: 3,
      name: "Advanced Tier Rewards",
      levels: [
        { level: 9, rate: "1%" },
        { level: 10, rate: "1%" },
        { level: 11, rate: "1%" },
        { level: 12, rate: "1%" },
        { level: 13, rate: "1%" }
      ],
      starNFTRequired: 3,
      isActive: false
    },
    {
      id: 4,
      name: "Elite Tier Rewards",
      levels: [
        { level: 14, rate: "2%" },
        { level: 15, rate: "2%" },
        { level: 16, rate: "2%" },
        { level: 17, rate: "2%" },
        { level: 18, rate: "2%" },
        { level: 19, rate: "2%" },
        { level: 20, rate: "2%" }
      ],
      starNFTRequired: 4,
      isActive: false
    }
  ];

  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div className={styles.container}>
      {/* 层级组列表 */}
      <div className={styles.tierGroups}>
        {tierGroups.map(group => (
          <div 
            key={group.id}
            className={`${styles.tierGroup} ${!group.isActive && styles.inactive}`}
          >
            <button
              onClick={() => toggleGroup(group.id)}
              className={styles.groupHeader}
            >
              <div className={styles.groupInfo}>
                {group.isActive ? (
                  <FiStar className={styles.groupIcon} />
                ) : (
                  <FiLock className={styles.groupIcon} />
                )}
                <div className={styles.groupMeta}>
                  <h4 className={styles.groupName}>{t(group.name)}</h4>
                  <span className={styles.groupRequirement}>
                    {t("Requires Star NFT Level {{level}}", { level: group.starNFTRequired })}
                  </span>
                </div>
              </div>
              {expandedGroups.includes(group.id) ? (
                <FiChevronDown className={styles.chevron} />
              ) : (
                <FiChevronRight className={styles.chevron} />
              )}
            </button>

            {expandedGroups.includes(group.id) && (
              <div className={styles.levelGrid}>
                {group.levels.map(({ level, rate }) => (
                  <div 
                    key={level}
                    className={`${styles.levelCard} ${!group.isActive && styles.inactive}`}
                  >
                    <div className={styles.levelHeader}>
                      <span className={styles.levelNumber}>L{level}</span>
                      <span className={styles.levelRate}>{rate}</span>
                    </div>
                    <div className={styles.levelStats}>
                      <div className={styles.levelStat}>
                        <span className={styles.statLabel}>{t("Active")}</span>
                        <span className={styles.statValue}>0</span>
                      </div>
                      <div className={styles.levelStat}>
                        <span className={styles.statLabel}>{t("Roll-ups")}</span>
                        <span className={styles.statValue}>$0.00</span>
                      </div>
                    </div>
                    {!group.isActive && (
                      <div className={styles.lockOverlay}>
                        <FiLock className={styles.lockIcon} />
                        <span>{t("Locked")}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 