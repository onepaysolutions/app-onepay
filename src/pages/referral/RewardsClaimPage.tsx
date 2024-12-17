import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { supabase } from "@/lib/supabase";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/common/PageTitle";
import { ContentCard } from "@/components/common/cards/ContentCard";
import { ClaimableRewards } from "@/components/referral/rewards/claimable/ClaimableRewards";
import { RewardsHistory } from "@/components/referral/rewards/history/RewardsHistory";
import { toast } from "react-hot-toast";
import { useDBConnection } from '@/hooks/useDBConnection';

// 模拟数据
const MOCK_DATA = {
  claimable: [
    {
      id: 'mock-1',
      type: 'DIRECT',
      amount: '1000000000000000000', // 1 OPE
      status: 'PENDING',
      created_at: new Date().toISOString()
    },
    {
      id: 'mock-2',
      type: 'PAIR',
      amount: '2000000000000000000', // 2 OPE
      status: 'PENDING',
      created_at: new Date().toISOString()
    }
  ],
  history: [
    {
      id: 'mock-3',
      type: 'GLORY',
      amount: '5000000000000000000', // 5 OPE
      status: 'CLAIMED',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      claimed_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

export function RewardsClaimPage() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const isConnected = useDBConnection();

  if (!account) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <p className="text-gray-400">{t('common.connectWallet')}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTitle title={t("rewards.claim.title")} />
      
      {!isConnected && (
        <div className="mb-6 bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-4">
          <p className="text-yellow-300 text-center">
            {t('common.demoMode')} - {t('common.featureInDevelopment')}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <ContentCard title={t("rewards.claim.available")}>
          <ClaimableRewards 
            address={account.address} 
            mockData={!isConnected ? MOCK_DATA.claimable.map(reward => ({
              ...reward,
              type: reward.type as "DIRECT" | "PAIR" | "GLORY"
            })) : undefined}
          />
        </ContentCard>

        <ContentCard title={t("rewards.claim.history")}>
          <RewardsHistory 
            address={account.address}
            mockData={!isConnected ? MOCK_DATA.history.map(reward => ({
              ...reward,
              type: reward.type as "DIRECT" | "PAIR" | "GLORY",
              status: reward.status as "CLAIMED"
            })) : undefined}
          />
        </ContentCard>
      </div>
    </AppLayout>
  );
} 