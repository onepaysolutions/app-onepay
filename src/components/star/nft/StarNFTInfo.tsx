import { useTranslation } from "react-i18next";

interface StarNFTInfoProps {
  tokenId: number;
  price: number;
  presaleRatio: number;
  presaleValue: number;
  contractValue: number;
  returnRate: number;
  levelRewards: {
    ownLevels: number;
    rollupLevels: {
      star1?: number;
      star2?: number;
      star3?: number;
    };
    directShare: {
      level: number;
      rates: number[];
    };
  };
}

export function StarNFTInfo({ 
  tokenId,
  price,
  presaleRatio,
  presaleValue,
  contractValue,
  returnRate,
  levelRewards
}: StarNFTInfoProps) {
  const { t } = useTranslation('nft');

  return (
    <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20">
      <h2 className="text-xl font-semibold mb-6 text-purple-300">
        {t('star.info.details')}
      </h2>

      <div className="space-y-6">
        {/* 销售信息 */}
        <div>
          <h3 className="text-sm font-medium text-purple-400 mb-2">
            {t('star.info.sale')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">{t('star.info.price')}</p>
              <p className="text-lg font-medium text-purple-300">${price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('star.info.ratio')}</p>
              <p className="text-lg font-medium text-purple-300">
                {(presaleRatio * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("nft.info.presale")}</p>
              <p className="text-lg font-medium text-purple-300">${presaleValue}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("nft.info.contract")}</p>
              <p className="text-lg font-medium text-purple-300">${contractValue}</p>
            </div>
          </div>
        </div>

        {/* 权益信息 */}
        <div>
          <h3 className="text-sm font-medium text-purple-400 mb-2">
            {t('star.info.benefits')}
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">{t('star.info.earnings')}</p>
              <p className="text-lg font-medium text-purple-300">
                {(returnRate * 100)}% {t('star.info.return')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("nft.info.levels")}</p>
              <p className="text-lg font-medium text-purple-300">
                {levelRewards.ownLevels} {t("nft.info.tiers")}
              </p>
            </div>
            {Object.entries(levelRewards.rollupLevels).map(([star, levels]) => (
              <div key={star}>
                <p className="text-sm text-gray-400">
                  {star.toUpperCase()} {t("nft.info.rollup")}
                </p>
                <p className="text-lg font-medium text-purple-300">
                  {levels} {t("nft.info.tiers")}
                </p>
              </div>
            ))}
            {levelRewards.directShare.level > 0 && (
              <div>
                <p className="text-sm text-gray-400">{t("nft.info.direct")}</p>
                {levelRewards.directShare.rates.map((rate, index) => (
                  <p key={index} className="text-lg font-medium text-purple-300">
                    {t("nft.info.generation")} {index + 1}: {(rate * 100)}%
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}