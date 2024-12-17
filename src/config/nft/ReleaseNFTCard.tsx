import { useState } from 'react';
import { NFTBadge } from './NFTBadge';

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
          <h3 className="text-lg font-bold">STAR {nft.level}</h3>
          <p className="text-sm text-gray-400">#{nft.id}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Release Ratio</span>
            <span className="text-purple-400">{releaseRatio}%</span>
          </div>
          <label htmlFor="releaseRatioInput">Release Ratio</label>
          <input
            id="releaseRatioInput"
            type="range"
            min="0"
            max={maxReleaseRatio}
            value={releaseRatio}
            onChange={(e) => setReleaseRatio(Number(e.target.value))}
            className="w-full h-2 bg-purple-900/30 rounded-lg appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, #8B5CF6 ${releaseRatio}%, transparent ${releaseRatio}%)`
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 p-3 rounded">
            <p className="text-xs text-gray-400">Total OPS</p>
            <p className="font-medium">{nft.totalOPS.toLocaleString()} OPS</p>
          </div>
          <div className="bg-black/20 p-3 rounded">
            <p className="text-xs text-gray-400">You Will Get</p>
            <p className="font-medium">
              ${((nft.totalOPS * releaseRatio / 100 * nft.cycleStartPrice).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }))}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleRelease}
            disabled={isCalculating || releaseRatio === 0}
            className={`
              flex-1 py-2 rounded font-medium transition-all
              ${isCalculating || releaseRatio === 0
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-purple-600 hover:bg-purple-700'
              }
            `}
          >
            {isCalculating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Calculating...
              </div>
            ) : (
              'Calculate Release'
            )}
          </button>
          <button
            onClick={onBurn}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded font-medium transition-colors"
          >
            Burn NFT
          </button>
        </div>
      </div>
    </div>
  );
} 