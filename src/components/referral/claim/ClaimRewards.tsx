import { useState } from 'react';
import { useTranslation } from "react-i18next";
import styles from './ClaimRewards.module.css';

interface ClaimRewardsProps {
  address: string;
}

export function ClaimRewards({ address }: ClaimRewardsProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    try {
      // 实现领取奖励的逻辑
    } catch (error) {
      console.error('Error claiming rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className="text-lg font-semibold mb-6">{t("Claim Rewards")}</h3>
      
      <div className="grid gap-6">
        {/* 可领取的奖励列表 */}
        <div className="space-y-4">
          {/* 直推奖励 */}
          <div className={styles.rewardCard}>
            <div className="flex justify-between items-center">
              <span>{t("Direct Rewards")}</span>
              <span className="text-xl font-bold">0.00 OPE</span>
            </div>
          </div>

          {/* 配对奖励 */}
          <div className={styles.rewardCard}>
            <div className="flex justify-between items-center">
              <span>{t("Pair Rewards")}</span>
              <span className="text-xl font-bold">0.00 OPE</span>
            </div>
          </div>

          {/* 荣耀奖励 */}
          <div className={styles.rewardCard}>
            <div className="flex justify-between items-center">
              <span>{t("Glory Rewards")}</span>
              <span className="text-xl font-bold">0.00 OPE</span>
            </div>
          </div>
        </div>

        {/* 总计和领取按钮 */}
        <div className={`flex justify-between items-center pt-4 ${styles.divider}`}>
          <div>
            <p className="text-sm text-gray-400">{t("Total Claimable")}</p>
            <p className="text-2xl font-bold">0.00 OPE</p>
          </div>
          <button
            onClick={handleClaim}
            disabled={loading}
            className={styles.claimButton}
          >
            {loading ? t("Claiming...") : t("Claim All")}
          </button>
        </div>
      </div>
    </div>
  );
} 