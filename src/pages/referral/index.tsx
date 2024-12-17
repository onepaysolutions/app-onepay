import { useActiveAccount } from "thirdweb/react";
import { useTranslation } from "react-i18next";
import { ShareReferralLink } from "@/components/referral/rewards/link/ShareReferralLink";
import { ReferralTree } from "@/components/referral/rewards/tree/ReferralTree";
import { DirectRewards } from "@/components/referral/rewards/direct/DirectRewards";
import { PairTierRewards } from "@/components/referral/rewards/pair/PairTierRewards";
import { GloryRewards } from "@/components/referral/rewards/glory/GloryRewards";
import { ClaimRewards } from "@/components/referral/claim/ClaimRewards";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ReferralPage() {
  const { t } = useTranslation();
  const account = useActiveAccount();

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("connect wallet")}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <ShareReferralLink address={account.address} />
        <ReferralTree address={account.address} />
        
        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="grid grid-cols-3 gap-4">
            <TabsTrigger value="direct">{t("Direct Rewards")}</TabsTrigger>
            <TabsTrigger value="pair">{t("Pair Rewards")}</TabsTrigger>
            <TabsTrigger value="glory">{t("Glory Rewards")}</TabsTrigger>
          </TabsList>

          <TabsContent value="direct">
            <DirectRewards address={account.address} />
          </TabsContent>
          <TabsContent value="pair">
            <PairTierRewards address={account.address} />
          </TabsContent>
          <TabsContent value="glory">
            <GloryRewards address={account.address} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 