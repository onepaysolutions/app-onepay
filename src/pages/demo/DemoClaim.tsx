import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ClaimButton2 } from "@/components/community/angel/ClaimButton2";

export function DemoClaimPage() {
  const { t } = useTranslation();
  const [isDemoMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black p-4">
      <div className="fixed top-4 right-4 z-50">
        <div className="px-4 py-2 bg-purple-600/80 rounded-lg backdrop-blur-sm border border-purple-500/30">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span>{t('tutorial.demo.title')}</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-lg mx-auto">
        <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            {t("Join OnePay Community")}
          </h1>
          
          <div className="space-y-6">
            <div className="text-gray-300 space-y-2">
              <p>{t("Join our community and get:")}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t("Exclusive Angel NFT membership")}</li>
                <li>{t("1000 OPE tokens reward")}</li>
                <li>{t("Access to special features")}</li>
                <li>{t("Community voting rights")}</li>
              </ul>
            </div>
            
            <ClaimButton2 
              walletAddress="0xDemoAddress"
              isDemoMode={isDemoMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 