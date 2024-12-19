import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useActiveWallet, PayEmbed } from "thirdweb/react";
import { toast } from "react-hot-toast";
import { claimTo } from "thirdweb/extensions/erc1155";
import { ContractOptions } from "thirdweb";
import { CONTRACT_ADDRESSES } from "@/config/contracts";
import { supabase } from '@/lib/supabase';
import client from "@/client";
import { chain } from "@/config/chain";

interface ClaimStarNFTProps {
  walletAddress: string;
  selectedLevel: number;
  price: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}

export function ClaimStarNFTButton({
  walletAddress,
  selectedLevel,
  price,
  onSuccess,
  onError,
  disabled
}: ClaimStarNFTProps) {
  const { t } = useTranslation();
  const [showPayEmbed, setShowPayEmbed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const tokenId = selectedLevel + 1;

  const handleClaimSuccess = useCallback(async (info: any) => {
    try {
      setIsProcessing(true);

      // 1. 获取 NFT 配置
      const { data: nftConfig, error: configError } = await supabase
        .from('starnftconfig')
        .select('*')
        .eq('tokenid', tokenId)
        .single();

      if (configError) throw configError;

      // 2. 获取当前阶段信息
      const { data: currentStage, error: stageError } = await supabase
        .from('stageview')
        .select('*')
        .single();

      if (stageError) throw stageError;

      // 3. 创建 NFT 认领记录
      const { data: claimData, error: claimError } = await supabase
        .from('starnftclaim')
        .insert({
          tokenid: tokenId,
          walletaddress: walletAddress.toLowerCase(),
          price: price,
          claimdate: new Date().toISOString(),
          claimstatus: 'claiming',
          status: 'ACTIVE',
          contractvalue: nftConfig.contractvalue,
          presalevalue: nftConfig.presalevalue,
          opebuybackvalue: nftConfig.opebuybackvalue,
          rewardvalue: nftConfig.rewardvalue,
          fundpoolvalue: nftConfig.fundpoolvalue,
          opsamount: Math.floor(nftConfig.presalevalue / currentStage.stageprice)
        })
        .select()
        .single();

      if (claimError) throw claimError;

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
  }, [walletAddress, tokenId, price, t, onSuccess, onError]);

  const handleClose = useCallback(() => setShowPayEmbed(false), []);

  return (
    <>
      {!showPayEmbed ? (
        <button
          onClick={() => setShowPayEmbed(true)}
          disabled={disabled || isProcessing || selectedLevel === undefined}
          className={`
            w-full px-6 py-3 rounded-lg font-semibold text-white
            transition-all duration-300 transform hover:scale-105
            ${disabled || isProcessing || selectedLevel === undefined
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
          ) : selectedLevel === undefined ? (
            t("Select NFT Level")
          ) : (
            <>
              {t("Claim Star NFT Level {{level}}", { level: selectedLevel + 1 })}
              <span className="text-sm opacity-80">({price} USDC)</span>
            </>
          )}
        </button>
      ) : (
        <PayEmbed
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
              name: `Star NFT Level ${selectedLevel + 1}`,
              image: `https://example.com/star-nft-${selectedLevel + 1}.png`,
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
      )}
    </>
  );
}