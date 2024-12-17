import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NFTBadge } from './NFTBadge';
import { starNFTTypes } from '@/config/starNFT';

interface ActiveNFT {
  id: string;
  type_id: number;
  presale_ops: number;
  airdrop_ops: number;
  rewards_ops: number;
  contract_value: number;
  release_threshold: number;
}

interface ActiveNFTCardProps {
  nft: ActiveNFT;
  currentOPSPrice: number;
  onWithdrawRewards?: () => void;
  onRelease?: () => void;
}

export function ActiveNFTCard({ 
  nft, 
  currentOPSPrice,
  onWithdrawRewards,
  onRelease 
}: ActiveNFTCardProps) {
  const { t } = useTranslation();
  const [isOverThreshold, setIsOverThreshold] = useState(false);

  // 获取NFT配置
  const nftConfig = starNFTTypes.find(type => type.id === nft.type_id);
  if (!nftConfig) return null;

  // 计算总OPS和当前价值
  const totalOPS = nft.presale_ops + nft.airdrop_ops + nft.rewards_ops;
  const currentValue = totalOPS * currentOPSPrice;

  // 检查是否达到释放阈值
  useEffect(() => {
    const checkThreshold = () => {
      const thresholdValue = nft.release_threshold;
      setIsOverThreshold(currentValue >= thresholdValue);
    };
    checkThreshold();
  }, [currentValue, nft.release_threshold]);

  return (
    <div className="bg-gradient-to-b from-purple-900/30 to-black/30 rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <NFTBadge level={nft.type_id} size={40} />
          <div>
            <h3 className="font-bold">{nftConfig.name}</h3>
            <p className="text-sm text-gray-400">#{nft.id}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${
          isOverThreshold ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {isOverThreshold ? t('Ready to Release') : t('Active')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/20 p-3 rounded">
          <p className="text-xs text-gray-400">{t("Presale OPS")}</p>
          <p className="font-medium">{nft.presale_ops.toLocaleString()}</p>
        </div>
        <div className="bg-black/20 p-3 rounded">
          <p className="text-xs text-gray-400">{t("Airdrop OPS")}</p>
          <p className="font-medium">{nft.airdrop_ops.toLocaleString()}</p>
        </div>
        <div className="bg-black/20 p-3 rounded">
          <p className="text-xs text-gray-400">{t("Rewards OPS")}</p>
          <p className="font-medium">{nft.rewards_ops.toLocaleString()}</p>
        </div>
        <div className="bg-black/20 p-3 rounded">
          <p className="text-xs text-gray-400">{t("Current Value")}</p>
          <p className="font-medium">
            ${currentValue.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-xs text-gray-400">{t("Contract Value")}</p>
          <p className="font-medium">${nft.contract_value.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">{t("Release Threshold")}</p>
          <p className="font-medium">${nft.release_threshold.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-3">
        {onWithdrawRewards && (
          <button 
            onClick={onWithdrawRewards}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors"
          >
            {t("Withdraw Rewards")}
          </button>
        )}
        
        {isOverThreshold && onRelease && (
          <button 
            onClick={onRelease}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors"
          >
            {t("Release NFT")}
          </button>
        )}
      </div>
    </div>
  );
} 