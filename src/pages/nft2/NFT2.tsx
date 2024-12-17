"use client";
import { useTranslation } from "react-i18next";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import client from "@/client";
import { chain } from "@/chain";
import { ClaimButton2 } from "@/components/community/angel/ClaimButton2";
import nftImage from '@/assets/images/nft.png';
import { Link } from "react-router-dom";
import logoWhite from "@/assets/logos/logo-white.png";
import Select from "react-select";
import { DashboardIcon } from '@/components/common/DashboardIcon';
import { ClaimConditionsCard } from '@/components/community/angel/ClaimConditionsCard';
import { supabase } from "@/lib/supabase";

interface LanguageOption {
  value: string;
  label: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
  { value: "ko", label: "한국어", flag: "🇰🇷" },
  { value: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
  { value: "th", label: "ไท", flag: "🇹🇭" },
  { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { value: "fr", label: "Français", flag: "🇫🇷" }
];

interface ClaimProps {
  tokenId: bigint;
  walletAddress: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function NFT2() {
  const { t, i18n } = useTranslation();
  const account = useActiveAccount();

  const handleLanguageChange = (option: LanguageOption | null) => {
    if (option) {
      i18n.changeLanguage(option.value);
    }
  };

  const handleClaim = async ({ tokenId, walletAddress, onSuccess, onError }: ClaimProps) => {
    try {
      // 1. Record Angel NFT
      const { error: nftError } = await supabase
        .from('angel_nfts')
        .insert({
          token_id: Number(tokenId),
          wallet_address: walletAddress,
          join_timestamp: new Date().toISOString()
        });

      if (nftError) throw nftError;

      // 2. Record reward distribution
      const { error: rewardError } = await supabase
        .from('reward_distributions') 
        .insert({
          wallet_address: walletAddress,
          reward_type: 'angel_nft_claim',
          amount: '1000000000000000000000', // 1000 OPE
          token_address: '0x...' // OPE token address
        });

      if (rewardError) throw rewardError;

      onSuccess?.();
    } catch (error) {
      console.error(error);
      onError?.(error as Error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 sm:gap-6">
              <img 
                src={logoWhite} 
                alt="Logo" 
                className="h-6 sm:h-8 w-auto cursor-pointer"
                onClick={() => {
                  window.open('https://onepay.markets', '_blank', 'noopener,noreferrer');
                }}
              />
              <Select<LanguageOption>
                value={languageOptions.find(opt => opt.value === i18n.language)}
                onChange={handleLanguageChange}
                options={languageOptions}
                className="w-32 sm:w-40"
                classNamePrefix="select"
                formatOptionLabel={(option: LanguageOption) => (
                  <div className="flex items-center gap-2">
                    <span>{option.flag}</span>
                    <span className="text-sm">{option.label}</span>
                  </div>
                )}
                styles={{
                  control: (base) => ({
                    ...base,
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderColor: 'rgba(139, 92, 246, 0.2)',
                    '&:hover': { borderColor: 'rgba(139, 92, 246, 0.4)' },
                    boxShadow: 'none',
                  }),
                  menu: (base) => ({
                    ...base,
                    background: 'rgba(0, 0, 0, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }),
                  option: (base, state) => ({
                    ...base,
                    background: state.isFocused ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: 'white',
                    '&:hover': { background: 'rgba(139, 92, 246, 0.3)' },
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'white',
                  }),
                }}
              />
            </div>
            <div className="flex items-center gap-4">
              <DashboardIcon />
              <ConnectButton
                client={client}
                chain={chain}
                connectButton={{
                  label: t("Connect Wallet"),
                  className: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-purple-500/20",
                }}
                switchButton={{
                  label: t("Switch to BSC"),
                  className: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-purple-500/20",
                }}
                theme="dark"
                connectModal={{
                  size: "compact",
                  showThirdwebBranding: false,
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen pt-16 sm:pt-20 pb-20 sm:pb-24">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <div className="text-center mb-8 sm:mb-16 w-full">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {t("Premium NFT Collection")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300/80">{t("Claim your exclusive NFT now")}</p>
          </div>

          <div className="w-full max-w-lg mx-auto bg-gradient-to-b from-purple-900/40 to-black/40 rounded-2xl p-4 sm:p-8 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
            <div className="text-center">
              <img 
                src={nftImage}
                alt="NFT Preview"
                loading="lazy"
                className="w-full h-64 sm:h-72 md:h-96 object-contain rounded-xl mb-6 sm:mb-8 border border-purple-500/20 shadow-lg shadow-purple-500/10"
              />
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                {t("Premium NFT")}
              </h2>
              <p className="text-gray-300/80 mb-4 sm:mb-6 text-base sm:text-lg">
                {t("Limited Edition NFT Collection")}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-900/30 rounded-xl p-3 sm:p-4 border border-purple-500/20">
                  <p className="text-xs sm:text-sm text-gray-300/80 mb-1">{t("Price")}</p>
                  <p className="text-lg sm:text-xl font-bold text-purple-400">2000 USDC</p>
                </div>
                <div className="bg-purple-900/30 rounded-xl p-3 sm:p-4 border border-purple-500/20">
                  <p className="text-xs sm:text-sm text-gray-300/80 mb-1">{t("OPE Rewards")}</p>
                  <p className="text-lg sm:text-xl font-bold text-purple-400">1000 OPE</p>
                </div>
              </div>

              <div className="mb-6">
                <ClaimConditionsCard />
              </div>

              <div className="mt-6 sm:mt-8">
                {account ? (
                  <ClaimButton2 
                    walletAddress={account.address}
                    onSuccess={() => handleClaim({ walletAddress: account.address, tokenId: BigInt("yourTokenId") })}
                  />
                ) : (
                  <p className="text-gray-400/80 text-center text-base sm:text-lg">
                    {t("Please connect your wallet to claim")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 