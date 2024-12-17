import { useState } from 'react';
import { NFTBadge } from './NFTBadge';
import { useTranslation } from 'react-i18next';

interface ReleaseNFT {
  id: string;
  level: number;
  totalOPS: number;
  cycleStartPrice: number;
  platformLiquidityRatio: number;
  platformBuybackRatio: number;
  opsReleaseRatio: number;
}

interface ReleaseCalculation {
  userUSDC: number;
  userOPS: number;
  platformLiquidityUSDC: number;
  platformLiquidityOPS: number;
  platformBuybackUSDC: number;
  opsRelease: number;
}

interface ReleaseNFTCardProps {
  nft: ReleaseNFT;
  onRelease: (calculation: ReleaseCalculation) => void;
  onBurn: () => void;
  maxReleaseRatio?: number;
}

export function ReleaseNFTCard({ 
  nft, 
  onRelease, 
  onBurn,
  maxReleaseRatio = 70 
}: ReleaseNFTCardProps) {
  const [releaseRatio, setReleaseRatio] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const { t } = useTranslation('nft');

  const calculateRelease = (): ReleaseCalculation => {
    try {
      const userUSDC = (nft.totalOPS * releaseRatio / 100) * nft.cycleStartPrice;
      const userOPS = nft.totalOPS * (releaseRatio / 100);
      const platformLiquidityUSDC = nft.totalOPS * (nft.platformLiquidityRatio / 100) * nft.cycleStartPrice;
      const platformLiquidityOPS = nft.totalOPS * (nft.platformLiquidityRatio / 100);
      const platformBuybackUSDC = nft.totalOPS * (nft.platformBuybackRatio / 100) * nft.cycleStartPrice;
      const opsRelease = nft.totalOPS * (nft.opsReleaseRatio / 100);

      return {
        userUSDC,
        userOPS,
        platformLiquidityUSDC,
        platformLiquidityOPS,
        platformBuybackUSDC,
        opsRelease
      };
    } catch (error) {
      console.error('Error calculating release:', error);
      throw new Error('Failed to calculate release values');
    }
  };

  const handleRelease = async () => {
    try {
      setIsCalculating(true);
      const calculation = calculateRelease();
      await onRelease(calculation);
    } catch (error) {
      console.error('Release error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-purple-900/30 to-black/30 rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center gap-4 mb-6">
        <NFTBadge level={nft.level} size={48} />
        <div>
          <h3 className="text-lg font-bold">{t('release.title')}</h3>
          <p className="text-sm text-gray-400">#{nft.id}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-2">{t('release.total_ops')}</p>
          <p className="text-lg font-medium">{nft.totalOPS.toLocaleString()}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400 mb-2">{t('release.current_price')}</p>
          <p className="text-lg font-medium">${nft.cycleStartPrice.toFixed(2)}</p>
        </div>
        
        <button onClick={handleRelease} className="...">
          {t('release.buttons.confirm')}
        </button>
      </div>
    </div>
  );
} 