import { useTranslation } from "react-i18next";
import { useActiveAccount } from "thirdweb/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function UserStatusDisplay() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [hasNFT, setHasNFT] = useState(false);
  const [hasRewards, setHasRewards] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      if (!account) return;

      try {
        // 检查 NFT 状态
        const { data: nftData } = await supabase
          .from('star_nfts')
          .select('id')
          .eq('owner_address', account.address)
          .limit(1);

        setHasNFT(!!nftData?.length);

        // 检查奖励状态
        const { data: rewardData } = await supabase
          .from('reward_distributions')
          .select('id')
          .eq('user_id', account.address)
          .limit(1);

        setHasRewards(!!rewardData?.length);
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }

    checkStatus();
  }, [account]);

  if (!account) {
    return null;
  }

  return (
    <div className="bg-purple-800/30 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">{t("Your Status")}</h2>
      
      <div className="grid gap-6">
        {/* 注册状态 */}
        <div className="flex items-center justify-between">
          <span>{t("Registration")}</span>
          <span className="text-green-400">
            {t("Connected")} ✓
          </span>
        </div>

        {/* NFT 认领状态 */}
        <div className="flex items-center justify-between">
          <span>{t("NFT Claim")}</span>
          <span className={hasNFT ? "text-green-400" : "text-gray-400"}>
            {hasNFT ? `${t("Claimed")} ✓` : `${t("Not Claimed")} ✗`}
          </span>
        </div>

        {/* OPE 奖励状态 */}
        <div className="flex items-center justify-between">
          <span>{t("OPE Rewards")}</span>
          <span className={hasRewards ? "text-green-400" : "text-gray-400"}>
            {hasRewards ? `${t("Received")} ✓` : `${t("Not Received")} ✗`}
          </span>
        </div>
      </div>
    </div>
  );
} 