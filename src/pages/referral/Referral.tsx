import React from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveAccount } from 'thirdweb/react';
import { ReferralLink } from 'ReferralLink';
import { DirectRewards } from '@/components/referral/rewards/direct/DirectRewards';
import { GloryRewards } from '@/components/referral/rewards/glory/GloryRewards copy';
import { PairTierRewards } from '@/components/referral/rewards/pair/PairTierRewards';

export function Referral() {
  const { t } = useTranslation();
  const address = useActiveAccount();

  if (!address) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">{t("Please connect your wallet")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 推荐链接 */}
      <ReferralLink address={address.toString()} />

      {/* 奖励卡片网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DirectRewards address={address.toString()} />
        <PairTierRewards address={address.toString()} />
        <GloryRewards address={address.toString()} />
      </div>
    </div>
  );
}

export default Referral; 