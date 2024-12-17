import { useActiveAccount } from 'thirdweb/react';
import { useTranslation } from 'react-i18next';
import { ReferralStats } from '@/components/referral/common/ReferralStats';
import ReferralLink from '@/components/referral/rewards/link/ReferralLink';
import { ReferralRewards } from './components/ReferralRewards';

export function ReferralPage() {
  const { t } = useTranslation();
  const account = useActiveAccount();

  if (!account) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">{t('common.connectWallet')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计信息 */}
      <ReferralStats />

      {/* 推荐链接 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">{t('referral.link.title')}</h2>
        <ReferralLink address={account.address} />
      </div>

      {/* 奖励信息 */}
      <ReferralRewards />
    </div>
  );
}

export default ReferralPage; 