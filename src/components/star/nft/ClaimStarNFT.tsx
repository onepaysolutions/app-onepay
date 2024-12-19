import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ClaimStarNFTProps {
  address: string;
}

const NFT_LEVELS = [
  {
    id: 1,
    nameKey: 'starNFT.levels.vip1.title',
    price: 500,
    opsAllocation: 677,
    benefits: [
      'starNFT.levels.vip1.benefits.tradingFee',
      'starNFT.levels.vip1.benefits.referralBonus',
      'starNFT.levels.vip1.benefits.idoAccess'
    ]
  },
  {
    id: 2,
    nameKey: 'starNFT.levels.vip2.title',
    price: 1100,
    opsAllocation: 1354,
    benefits: [
      'starNFT.levels.vip2.benefits.tradingFee',
      'starNFT.levels.vip2.benefits.referralBonus',
      'starNFT.levels.vip2.benefits.idoAccess'
    ]
  },
  {
    id: 3,
    nameKey: 'starNFT.levels.vip3.title',
    price: 3600,
    opsAllocation: 4062,
    benefits: [
      'starNFT.levels.vip3.benefits.tradingFee',
      'starNFT.levels.vip3.benefits.referralBonus',
      'starNFT.levels.vip3.benefits.idoAccess'
    ]
  },
  {
    id: 4,
    nameKey: 'starNFT.levels.vip4.title',
    price: 9100,
    opsAllocation: 9478,
    benefits: [
      'starNFT.levels.vip4.benefits.tradingFee',
      'starNFT.levels.vip4.benefits.referralBonus',
      'starNFT.levels.vip4.benefits.idoAccess'
    ]
  }
];

export function ClaimStarNFT({ address }: ClaimStarNFTProps) {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async () => {
    try {
      setIsClaiming(true);

      // 1. 记录 NFT 认领
      const { data: nft, error: nftError } = await supabase
        .from('star_nfts')
        .insert({
          token_id: selectedLevel,
          wallet_address: address.toLowerCase(),
          star_level: selectedLevel,
          contract_value: NFT_LEVELS[selectedLevel - 1].price.toString(),
          ops_holding: '0',
          ops_rewards: '0',
          current_value: NFT_LEVELS[selectedLevel - 1].price.toString(),
          release_rate: '0',
          status: 'ACTIVE',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (nftError) throw nftError;

      // 2. 记录奖励交易
      const { error: rewardError } = await supabase
        .from('reward_transactions')
        .insert({
          wallet_address: address.toLowerCase(),
          type: 'STAR_NFT_CLAIM',
          amount: (NFT_LEVELS[selectedLevel - 1].opsAllocation * 10**18).toString(),
          status: 'PENDING',
          created_at: new Date().toISOString()
        });

      if (rewardError) throw rewardError;

      toast.success(t('starNFT.claim.success'));
    } catch (error) {
      console.error('Claim error:', error);
      toast.error(t('starNFT.claim.error'));
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* NFT 等级选择 */}
      <div className="grid grid-cols-2 gap-4">
        {NFT_LEVELS.map((level) => (
          <motion.button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-xl border transition-all
              ${selectedLevel === level.id
                ? 'bg-purple-600/20 border-purple-500'
                : 'bg-purple-900/20 border-purple-500/20 hover:border-purple-500/40'
              }`}
          >
            <h3 className="text-lg font-bold mb-2">{t(level.nameKey)}</h3>
            <div className="space-y-1 text-sm">
              <p className="text-purple-300">${level.price} USDC</p>
              <p className="text-gray-400">{level.opsAllocation} OPS</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 选中等级的详细信息 */}
      <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
        <h4 className="text-sm font-medium text-purple-400 mb-3">
          {t("starNFT.levels.benefits")}
        </h4>
        <ul className="space-y-2">
          {NFT_LEVELS[selectedLevel - 1].benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              {t(benefit)}
            </li>
          ))}
        </ul>
      </div>

      {/* 认领按钮 */}
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
          t("starNFT.buttons.purchase")
        )}
      </motion.button>
    </div>
  );
}

export default ClaimStarNFT; 