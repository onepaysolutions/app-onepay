import { useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { useActiveAccount, PayEmbed } from "thirdweb/react";
import { toast } from "react-hot-toast";
import { claimTo } from "thirdweb/extensions/erc1155";
import { ContractOptions } from "thirdweb";
import { CONTRACT_ADDRESSES } from "@/config/contracts";
import { supabase } from '@/lib/supabase';
import client from "@/client";
import { chain } from "@/config/chain";
import { starNFTTypes } from "@/config/starNFT";
import { distributeTierRewards, distributePairRewards } from '@/services/rewardService';

interface UserData {
  id: string;
  walletaddress: string;
  referreraddress: string | null;
  createdat: string;
  updatedat: string;
  is_active: boolean;
}

interface ClaimStarNFTProps {
  walletAddress: string;
  tokenId: number;
  nftTypeId: number;
  price: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}

const MemoizedPayEmbed = memo(PayEmbed);

export function ClaimStarNFTButton({ 
  walletAddress,
  tokenId,
  nftTypeId,
  price,
  onSuccess,
  onError,
  disabled
}: ClaimStarNFTProps) {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [showPayEmbed, setShowPayEmbed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClaimSuccess = useCallback(async (info: any) => {
    try {
      setIsProcessing(true);

      // 1. 获取NFT配置
      const nftConfig = starNFTTypes.find(type => type.id === nftTypeId);
      if (!nftConfig) throw new Error("Invalid NFT type");

      // 2. 获取用户数据
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select(`
          id,
          user:users!wallets_user_id_fkey (
            id,
            walletaddress,
            referreraddress
          )
        `)
        .eq('address', walletAddress.toLowerCase())
        .single();

      if (walletError) throw walletError;
      if (!walletData?.user) throw new Error('User not found');

      // 修复类型转换
      const userData = (Array.isArray(walletData.user) ? walletData.user[0] : walletData.user) as {
        id: string;
        walletaddress: string;
        referreraddress: string | null;
      };
      
      if (!userData.id) throw new Error('User not found');

      // 3. 计算USDC分配
      const usdcDistribution = {
        referralReward: price * nftConfig.usdcDistribution.referralReward,
        opsPresale: price * nftConfig.usdcDistribution.opsPresale,
        opeBuyback: price * nftConfig.usdcDistribution.opeBuyback
      };

      // 4. 创建NFT记录
      const { data: nftData, error: nftError } = await supabase
        .from('star_nfts')
        .insert({
          user_id: userData.id,
          type_id: nftTypeId,
          token_id: tokenId,
          status: 'ACTIVE',
          contract_value: nftConfig.contractValue,
          release_threshold: nftConfig.releaseThreshold,
          presale_ops: 0,
          airdrop_ops: 0,
          rewards_ops: 0,
          claimed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (nftError) throw nftError;

      // 5. 创建USDC分配记录
      await supabase.from('usdc_distributions').insert([
        {
          nft_id: nftData.id,
          type: 'REFERRAL_REWARD',
          amount: usdcDistribution.referralReward,
          status: 'PENDING'
        },
        {
          nft_id: nftData.id,
          type: 'OPS_PRESALE',
          amount: usdcDistribution.opsPresale,
          status: 'PENDING'
        },
        {
          nft_id: nftData.id,
          type: 'OPE_BUYBACK',
          amount: usdcDistribution.opeBuyback,
          status: 'PENDING'
        }
      ]);

      // 6. 如果有推荐人,分配推荐奖励
      if (userData.referreraddress) {
        // 获取推荐人信息
        const { data: referrer, error: referrerError } = await supabase
          .from('users')
          .select('id')
          .eq('walletaddress', userData.referreraddress)
          .single();

        if (referrerError) throw referrerError;

        // 分配层级奖励
        await distributeTierRewards(
          nftData.id,
          usdcDistribution.referralReward,
          referrer.id,
          nftConfig.maxTiers
        );

        // 分配配对奖励
        await distributePairRewards(
          nftData.id,
          referrer.id,
          nftConfig.pairTiers
        );
      }

      toast.success(t("StarNFT claimed successfully"));
      onSuccess?.();
      setShowPayEmbed(false);
    } catch (error) {
      console.error('Claim error:', error);
      toast.error(t("Failed to claim StarNFT"));
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
    }
  }, [walletAddress, tokenId, nftTypeId, price, t, onSuccess, onError]);

  const handleClose = useCallback(() => setShowPayEmbed(false), []);

  if (!account) return null;

  return (
    <>
      {!showPayEmbed ? (
        <button
          onClick={() => setShowPayEmbed(true)}
          disabled={disabled || isProcessing}
          className={`
            w-full px-6 py-3 rounded-lg font-semibold text-white
            transition-all duration-300 transform hover:scale-105
            ${disabled || isProcessing
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
            }
            flex items-center justify-center gap-2
          `}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              {t("Processing...")}
            </>
          ) : (
            <>
              {t("Claim Star NFT")}
              <span className="text-sm opacity-80">({price} USDC)</span>
            </>
          )}
        </button>
      ) : (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
            <div className="w-full max-w-[360px]">
              <div className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl">
                <div className="relative bg-gradient-to-r from-purple-900/60 to-black/60 backdrop-blur-lg p-3 border-b border-purple-500/30">
                  <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                    aria-label={t("Close dialog")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-bold text-center">
                    {t("Claim Star NFT")}
                  </h3>
                </div>

                <div className="p-4">
                  <MemoizedPayEmbed
                    client={client}
                    className="w-full"
                    payOptions={{
                      mode: "transaction",
                      transaction: claimTo({
                        contract: {
                          address: CONTRACT_ADDRESSES.STAR_NFT,
                          client,
                          chain: {
                            id: chain.chainId,
                            rpc: chain.rpc[0],
                          },
                        } as ContractOptions,
                        to: walletAddress,
                        quantity: 1n,
                        tokenId: BigInt(tokenId),
                      }),
                      metadata: {
                        name: "Star NFT",
                        image: "https://example.com/star-nft.png",
                      },
                      onPurchaseSuccess: handleClaimSuccess,
                      buyWithCrypto: {
                        testMode: false,
                        prefillSource: {
                          chain: {
                            rpc: "https://mainnet.optimism.io",
                            id: 10,
                          },
                          token: {
                            name: "USD Coin",
                            address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                            symbol: "USDC",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
} 