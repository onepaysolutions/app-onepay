"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ClaimTutorialGuide } from "@/components/tutorial/ClaimTutorialGuide";

interface ClaimButtonProps {
  walletAddress: string;
  tokenId: bigint;
  style?: React.CSSProperties;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  isDemoMode?: boolean;
}

export function ClaimButton({
  style,
  onSuccess,
  isDemoMode = false,
}: ClaimButtonProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(isDemoMode);

  const handleClaim = async () => {
    setIsProcessing(true);
    try {
      // 模拟处理时间
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {showTutorial && (
        <ClaimTutorialGuide 
          isDemo={isDemoMode}
          onComplete={() => setShowTutorial(false)}
        />
      )}
      
      <motion.button
        onClick={handleClaim}
        disabled={isProcessing}
        className={`
          w-full py-3 px-4 
          bg-gradient-to-r from-purple-600 to-purple-700 
          hover:from-purple-700 hover:to-purple-800 
          text-white rounded-xl font-medium 
          transition-all duration-300 
          transform hover:scale-105 
          shadow-lg shadow-purple-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center
          claim-button
          ${isDemoMode ? 'border-2 border-yellow-400/50' : ''}
        `}
        whileTap={{ scale: 0.95 }}
        style={style}
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            <span>{t('claim.button.processing')}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>{t('claim.button.claim')}</span>
            {isDemoMode && (
              <span className="text-xs bg-yellow-400/20 px-2 py-0.5 rounded">
                {t('common.demo')}
              </span>
            )}
          </div>
        )}
      </motion.button>
    </>
  );
}

export default ClaimButton;
