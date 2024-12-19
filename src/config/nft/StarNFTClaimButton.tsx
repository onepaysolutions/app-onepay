import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useActiveWallet } from "thirdweb/react";
import { toast } from "react-toastify";

interface StarNFTClaimButtonProps {
  userAddress: string;
  tokenId: number;
  price: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function StarNFTClaimButton({ 
  userAddress, 
  tokenId, 
  price,
  onSuccess,
  onError 
}: StarNFTClaimButtonProps) {
  const { t } = useTranslation();
  const [isClaiming, setIsClaiming] = useState(false);
  const account = useActiveWallet() as unknown as string;

  const handleClaim = async () => {
    if (!account) {
      toast.error(t("Please connect wallet first"));
      return;
    }

    if (account.toLowerCase() !== userAddress.toLowerCase()) {
      toast.error(t("Address mismatch"));
      return;
    }

    try {
      setIsClaiming(true);
      // TODO: 实现实际的 claim 逻辑
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟网络请求
      
      toast.success(t("Claim request submitted"));
      onSuccess?.();
    } catch (error) {
      console.error('Claim error:', error);
      toast.error(t("Failed to claim"));
      onError?.(error as Error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <button
      onClick={handleClaim}
      disabled={isClaiming || !account}
      className={`
        w-full px-6 py-3 rounded-lg font-semibold text-white
        transition-all duration-300 transform hover:scale-105
        ${isClaiming || !account
          ? 'bg-gray-600 cursor-not-allowed opacity-50'
          : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
        }
        flex items-center justify-center gap-2
        disabled:transform-none
      `}
    >
      {isClaiming ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          {t("Claiming...")}
        </>
      ) : !account ? (
        t("Connect Wallet")
      ) : (
        <>
          {t("Claim Star NFT")}
          <span className="text-sm opacity-80">({price} USDC)</span>
        </>
      )}
    </button>
  );
}