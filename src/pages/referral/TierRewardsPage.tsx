import { useActiveAccount } from 'thirdweb/react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layout/Container';
import { TierRewards } from '@/components/referral/TierReward/TierRewards';

export function TierRewardsPage() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  
  if (!account) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-gray-400">{t('common.connect')}</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('referral.tierRewards.title')}</h1>
        <TierRewards address={account.address} />
      </div>
    </Container>
  );
} 