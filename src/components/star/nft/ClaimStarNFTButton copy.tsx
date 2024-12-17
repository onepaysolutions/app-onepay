import { useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useActiveAccount, PayEmbed } from "thirdweb/react";
import { claimTo } from "thirdweb/extensions/erc1155";
import { ContractOptions } from "thirdweb";
import { CONTRACT_ADDRESSES} from "@/config/contracts";
import client from "@/client";
import { chain } from "@/chain";
import {supabase} from "@/lib/supabase";

interface ClaimStarNFTButtonProps {
  walletAddress: string;
  tokenId: number;
  style?: React.CSSProperties;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}

const MemoizedPayEmbed = memo(PayEmbed);

export function ClaimStarNFTButton({
  walletAddress,
  tokenId,
  style,
  onSuccess,
  onError,
  disabled,
}: ClaimStarNFTButtonProps) {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [showPayEmbed, setShowPayEmbed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClaimSuccess = useCallback(async (info: any) => {
    try {
      // 记录 NFT 交易到数据库
      await supabase.from('star_nft_transactions').insert({
        wallet_address: walletAddress,
        transaction_hash: info.transactionHash,
        token_id: tokenId,
        star_level: 1 // 初始 star level
      });

      toast.success(t("Star NFT claimed successfully!"));

      toast.success(t("Star NFT claimed successfully!"));
      onSuccess?.();
      setShowPayEmbed(false);
    } catch (error) {
      console.error('Error handling claim success:', error);
      toast.error(t("Error processing claim"));
      onError?.(error as Error);
    }
  }, [walletAddress, tokenId, t, onSuccess, onError]);

  const handleClose = useCallback(() => setShowPayEmbed(false), []);

  if (!account) return null;

  return (
    <>
      {!showPayEmbed ? (
        <button
          onClick={() => setShowPayEmbed(true)}
          disabled={disabled || isProcessing}
          className="w-full py-4 px-6 rounded-xl text-white font-medium
            bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800
            transition-colors duration-200
            shadow-lg shadow-yellow-500/20
            border border-yellow-400/30 backdrop-blur-sm
            disabled:opacity-50 disabled:cursor-not-allowed"
          style={style}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{isProcessing ? t("Processing...") : t("Claim Star NFT")}</span>
            <span className="text-xl">⭐</span>
          </div>
        </button>
      ) : (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
            <div className="w-full max-w-[360px]">
              <div className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-xl overflow-hidden border border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
                <div className="relative bg-gradient-to-r from-yellow-900/60 to-black/60 backdrop-blur-lg p-3 border-b border-yellow-500/30">
                  <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-[10001] bg-black/40 hover:bg-black/60 p-2 rounded-lg backdrop-blur-sm"
                    aria-label={t("Close")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <h3 className="text-lg font-bold text-center text-white">
                    {t("Claim Star NFT")}
                  </h3>
                </div>

                <div className="p-4 max-h-[min(460px,70vh)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-yellow-500/20">
                  <MemoizedPayEmbed
                    client={client}
                    className="w-full [&>div]:!px-0 [&>div]:!mx-0 [&_button]:!w-full [&_input]:!w-full [&_*]:!max-w-full [&_*]:!rounded-lg [&_*]:!min-h-0 [&_*]:!text-sm"
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

export type { ClaimStarNFTButtonProps }; 