import { useTranslation } from "react-i18next";

interface NFTInfoCardProps {
  tokenId: string;
  level: number;
  rarity: string;
  power: number;
  rewards: number;
}

export function NFTInfoCard({ tokenId, level, rarity, power, rewards }: NFTInfoCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-purple-800/30 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">
        {t('cards:nftInfo.title')}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">
            {t('cards:nftInfo.stats.level')}
          </p>
          <p className="text-xl font-bold">{level}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('cards:nftInfo.stats.rarity')}
          </p>
          <p className="text-xl font-bold">{rarity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('cards:nftInfo.stats.power')}
          </p>
          <p className="text-xl font-bold">{power}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('cards:nftInfo.stats.rewards')}
          </p>
          <p className="text-xl font-bold">${rewards.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
} 