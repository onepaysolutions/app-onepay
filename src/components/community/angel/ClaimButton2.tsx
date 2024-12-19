"use client";

import { useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { PayEmbed, useActiveAccount } from "thirdweb/react";
import { claimTo } from "thirdweb/extensions/erc1155";
import { ContractOptions } from "thirdweb";
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import client from "@/client";
import { chain } from "@/config/chain";
import { ClaimTutorialGuide } from '../../tutorial/ClaimTutorialGuide';
import { supabase } from "@/lib/supabase";
import nftOperations from "@/lib/supabase/supabase";

interface ClaimButton2Props {
  walletAddress: string;
  style?: React.CSSProperties;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  isDemoMode?: boolean;
}

const MemoizedPayEmbed = memo(PayEmbed);

const chainConfig = {
  id: chain.chainId,
  rpc: chain.rpc[0],
  nativeCurrency: chain.nativeCurrency,
  name: chain.name,
  chain: chain.chain,
  testnet: true // 强制设置为 true 以匹配 ContractOptions 类型
} as const;

export function ClaimButton2({
  walletAddress,
  style,
  onSuccess,
  onError,
  disabled,
  isDemoMode = false,
}: ClaimButton2Props) {
  const { t } = useTranslation('nft');
  const account = useActiveAccount();
  const [showPayEmbed, setShowPayEmbed] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showTutorial, setShowTutorial] = useState(isDemoMode);

  const handleApproveAndClaim = async () => {
    if (!account || isApproving) return;

    try {
      setIsApproving(true);
      
      if (isDemoMode) {
        // 教学模式下的模拟交易
        await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟延迟
        handleDemoClaim();
      } else {
        // 真实交易模式
        setShowPayEmbed(true);
      }
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(t("Approval failed"));
      onError?.(error);
    } finally {
      setIsApproving(false);
    }
  };

  // 处理教学模式的认领
  const handleDemoClaim = async () => {
    try {
      // 记录演示交易
      const { error: demoTxError } = await supabase
        .from('nft_transactions')
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          transaction_hash: `demo-${Date.now()}`,
          token_id: 0,
          type: 'ANGEL',
          amount: 1,
          status: 'DEMO',
          metadata: {
            chain: chain.name,
            isDemoMode: true
          }
        });

      if (demoTxError) throw demoTxError;

      toast.success(t("Demo NFT claimed successfully!"));
      onSuccess?.();
    } catch (error) {
      console.error('Demo claim error:', error);
      toast.error(t("Error in demo claim"));
      onError?.(error as Error);
    }
  };

  // 处理真实交易的认领
  const handleClaimSuccess = useCallback(async (info: any) => {
    try {
      // 记录 NFT 认领到 Supabase
      await supabase
        .from('nft_transactions')
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          transaction_hash: info.transactionHash,
          token_id: 0,
          type: 'ANGEL',
        metadata: {
          chain: chain.name,
          blockNumber: info.blockNumber,
        },
      });

      // 激活用户
      await supabase
        .from('users')
        .update({ is_active: true })
        .eq('wallet_address', walletAddress.toLowerCase());

      toast.success(t("NFT claimed successfully!"));
      onSuccess?.();
      setShowPayEmbed(false);
    } catch (error) {
      console.error('Error handling claim success:', error);
      toast.error(t("Error processing claim"));
      onError?.(error as Error);
    }
  }, [walletAddress, t, onSuccess, onError]);

  const handleClose = useCallback(() => setShowPayEmbed(false), []);

  if (!account) return null;

  return (
    <>
      {showTutorial && (
        <ClaimTutorialGuide 
          isDemo={isDemoMode}
          onComplete={() => setShowTutorial(false)}
        />
      )}
      
      {!showPayEmbed ? (
        <button
          onClick={handleApproveAndClaim}
          disabled={disabled || isApproving}
          className={`
            w-full py-4 px-6 rounded-xl text-white font-medium
            ${isDemoMode 
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
            }
            transition-colors duration-200
            shadow-lg ${isDemoMode ? 'shadow-yellow-500/20' : 'shadow-purple-500/20'}
            border ${isDemoMode ? 'border-yellow-400/30' : 'border-purple-400/30'} 
            backdrop-blur-sm
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          style={style}
        >
          <div className="flex items-center justify-center gap-2">
            <span>
              {isApproving 
                ? t("Processing...") 
                : isDemoMode 
                  ? t("Try Demo Claim")
                  : t("Claim NFT")
              }
            </span>
            {isDemoMode && <span className="text-xs bg-yellow-400/20 px-2 py-0.5 rounded">DEMO</span>}
          </div>
        </button>
      ) : (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-[10000] flex items-center justify-center">
            <div className="w-full max-w-[360px] animate-fadeIn">
              <div className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-xl overflow-hidden 
                border border-purple-500/30 shadow-2xl shadow-purple-500/20">
                <div className="relative bg-gradient-to-r from-purple-900/60 to-black/60 backdrop-blur-lg 
                  p-3 border-b border-purple-500/30">
                  <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white 
                      transition-colors z-[10001] bg-black/40 hover:bg-black/60 
                      p-2 rounded-lg backdrop-blur-sm"
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
                    {t("Join OnePay Community")}
                  </h3>
                </div>

                <div className="p-4 max-h-[min(460px,70vh)] overflow-y-auto overflow-x-hidden
                  scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-500/20">
                  <MemoizedPayEmbed
                    client={client}
                    className="w-full [&>div]:!px-0 [&>div]:!mx-0 [&_button]:!w-full 
                      [&_input]:!w-full [&_*]:!max-w-full [&_*]:!rounded-lg 
                      [&_*]:!min-h-0 [&_*]:!text-sm
                      [&_.thirdweb-pay-button]:!bg-[#8B5CF6]
                      [&_.thirdweb-pay-button]:!hover:bg-[#7C3AED]
                      [&_.thirdweb-pay-button]:!border-[#8B5CF6]/30
                      [&_.thirdweb-pay-button]:!shadow-[#8B5CF6]/20
                      [&_.thirdweb-pay-embed]:!bg-transparent
                      [&_.thirdweb-pay-embed]:!border-none
                      [&_.thirdweb-pay-embed_input]:!bg-[#1a1a1a]
                      [&_.thirdweb-pay-embed_input]:!border-[#8B5CF6]/30
                      [&_.thirdweb-pay-embed_select]:!bg-[#1a1a1a]
                      [&_.thirdweb-pay-embed_select]:!border-[#8B5CF6]/30
                      [&_.thirdweb-pay-embed_label]:!text-gray-400
                      [&_*]:!max-w-[calc(100vw-3rem)]
                      [&_*]:!overflow-x-hidden
                      [&_*]:!break-words"
                    payOptions={{
                      mode: "transaction",
                      transaction: claimTo({
                        contract: {
                          address: CONTRACT_ADDRESSES.ANGEL_NFT,
                          client,
                          chain: chainConfig,
                        } as unknown as ContractOptions,
                        to: walletAddress,
                        quantity: 1n,
                        tokenId: 0n,
                      }),
                      metadata: {
                        name: "Community Membership NFT",
                        image: "https://example.com/community-nft.png",
                      },
                      onPurchaseSuccess: handleClaimSuccess,
                      buyWithCrypto: {
                        testMode: isDemoMode,
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

export default ClaimButton2;
