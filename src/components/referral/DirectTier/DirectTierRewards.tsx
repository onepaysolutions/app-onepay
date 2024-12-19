import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUsers, FiStar, FiAward } from 'react-icons/fi';
import styles from './DirectTierRewards.module.css';

interface DirectMember {
  address: string;
  isActive: boolean;
  earnings: string;
  generation: number;
}

export function DirectTierRewards() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(1);

  // 模拟数据 - 实际应该从API获取
  const stats = {
    totalDirects: 0,
    activeDirects: 0,
    totalEarnings: "0.00"
  };

  // 模拟会员数据 - 实际应该从API获取
  const members: DirectMember[] = [
    // 一代会员
    {
      address: "0x1234...5678",
      isActive: true,
      earnings: "100.00",
      generation: 1
    },
    {
      address: "0x8765...4321",
      isActive: false,
      earnings: "0.00",
      generation: 1
    },
    // 二代会员
    {
      address: "0xabcd...efgh",
      isActive: true,
      earnings: "50.00",
      generation: 2
    },
    // 三代会员
    {
      address: "0xijkl...mnop",
      isActive: false,
      earnings: "0.00",
      generation: 3
    }
  ];

  const generations = [
    { id: 1, label: "First Gen", rate: "5%" },
    { id: 2, label: "Second Gen", rate: "3%" },
    { id: 3, label: "Third Gen", rate: "1%" }
  ];

  return (
    <div className={styles.container}>
      {/* 统计概览 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FiUsers className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{stats.totalDirects}</span>
            <span className={styles.statLabel}>{t("Total Directs")}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <FiStar className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{stats.activeDirects}</span>
            <span className={styles.statLabel}>{t("Active Members")}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <FiAward className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>${stats.totalEarnings}</span>
            <span className={styles.statLabel}>{t("Total Earnings")}</span>
          </div>
        </div>
      </div>

      {/* 代数选择器 */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {generations.map(gen => (
            <button
              key={gen.id}
              className={`${styles.tab} ${activeTab === gen.id ? styles.active : ''}`}
              onClick={() => setActiveTab(gen.id)}
            >
              <span className={styles.tabLabel}>{t(gen.label)}</span>
              <span className={styles.tabRate}>{gen.rate}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 会员列表 */}
      <div className={styles.membersList}>
        {members
          .filter(member => member.generation === activeTab)
          .map((member, index) => (
            <div key={index} className={styles.memberCard}>
              <div className={styles.memberInfo}>
                <div className={styles.memberStatus}>
                  <span className={`${styles.statusDot} ${member.isActive ? styles.active : ''}`} />
                  <span className={styles.memberAddress}>{member.address}</span>
                </div>
                <div className={styles.memberEarnings}>
                  <span className={styles.earningsLabel}>{t("Earnings")}</span>
                  <span className={styles.earningsValue}>${member.earnings}</span>
                </div>
              </div>
              {!member.isActive && (
                <div className={styles.inactiveOverlay}>
                  <span className={styles.inactiveLabel}>{t("Inactive")}</span>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default DirectTierRewards;