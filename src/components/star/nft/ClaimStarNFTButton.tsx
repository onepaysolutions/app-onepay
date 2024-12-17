import { useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { useActiveAccount, PayEmbed } from "thirdweb/react";
import { toast } from "react-hot-toast";
import { claimTo } from "thirdweb/extensions/erc1155";
import { ContractOptions } from "thirdweb";
import { CONTRACT_ADDRESSES } from "@/config/contracts";
import { supabase } from '@/lib/supabase';
import client from "@/client";
import { chain } from "@/chain";

interface ClaimStarNFTProps {
  walletAddress: string;
  tokenId: number;
  price: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}

const MemoizedPayEmbed = memo(PayEmbed);

export function ClaimStarNFTButton({ 
  walletAddress,
  tokenId,
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

      // 记录 NFT 认领到数据库
      const { error: nftError } = await supabase
        .from('starnfts')
        .insert({
          walletaddress: walletAddress.toLowerCase(),
          tokenid: tokenId,
          txhash: info.transactionHash,
          price: price,
          status: 'ACTIVE',
          claimedat: new Date().toISOString()
        });

      if (nftError) throw nftError;

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

  if (!account) return null;

  return (
    <>
      {!showPayEmbed ? (
        <button
          onClick={() => setShowPayEmbed(true)}
          disabled={disabled || isProcessing}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 
            rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>{t('common.processing')}</span>
            </>
          ) : (
            <span>{t('starNFT.claim')}</span>
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
              <div className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-xl overflow-hidden border border-purple-500/30">
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
                          chain,
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