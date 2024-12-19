import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ClaimStarNFTButton } from './ClaimStarNFTButton';
import { NFTBadge } from './NFTBadge';
import { useActiveAccount } from "thirdweb/react";

interface StarNFTCardProps {
  level: number;
  price: number;
  opsAllocation: number;
  benefits: string[];
  isSelected?: boolean;
  onSelect?: () => void;
}

export function StarNFTCard({ 
  level, 
  price, 
  opsAllocation, 
  benefits,
  isSelected,
  onSelect 
}: StarNFTCardProps) {
  const { t } = useTranslation();
  const account = useActiveAccount();

  if (!account) return null;

  return (
    <motion.div 
      onClick={onSelect}
      className={`
        bg-gradient-to-b from-purple-900/40 to-black/40 rounded-lg p-6 
        backdrop-blur-sm border transition-all cursor-pointer
        ${isSelected 
          ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
          : 'border-purple-500/20 hover:border-purple-500/40'
        }
      `}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-4 mb-6">
        <NFTBadge level={level} size={48} />
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t(`starNFT.levels.vip${level}.title`)}
          </h3>
          <p className="text-sm text-purple-400">{level}x Multiplier</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-gray-400">{t("starNFT.price")}</p>
          <p className="text-2xl font-bold">${price.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">{t("starNFT.allocation")}</p>
          <p className="text-lg text-purple-400">{opsAllocation.toLocaleString()} OPS</p>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">{t("starNFT.benefits")}</p>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                {t(benefit)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ClaimStarNFTButton 
        walletAddress={account.address}
        selectedLevel={level - 1}
        price={price}
      />
    </motion.div>
  );
} 