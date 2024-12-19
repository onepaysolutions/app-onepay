import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StarNFTService } from '@/services/starNFTService'; // 修改导入路径
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ClaimStarNFTButtonProps {
  level: number;
  price: number;
  onSuccess?: () => void;
}

export function ClaimStarNFTButton({ level, price, onSuccess }: ClaimStarNFTButtonProps) {
  const { t } = useTranslation();
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async () => {
    try {
      setIsClaiming(true);
      await StarNFTService.claimNFT(1); // 修改方法名
      onSuccess?.();
      toast.success(t('starNFT.claim.success'));
    } catch (error) {
      console.error('Claim error:', error);
      toast.error(t('starNFT.claim.error'));
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <motion.button
      onClick={handleClaim}
      disabled={isClaiming}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-3 rounded-xl font-medium transition-colors
        ${isClaiming
          ? 'bg-purple-900/50 text-purple-300 cursor-not-allowed'
          : 'bg-purple-600 hover:bg-purple-500 text-white'
        }`}
    >
      {isClaiming ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
          {t("common.processing")}
        </div>
      ) : (
        t("starNFT.buttons.claim")
      )}
    </motion.button>
  );
} 