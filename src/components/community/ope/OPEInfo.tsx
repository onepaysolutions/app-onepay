import { useTranslation } from "react-i18next";

export function OPEInfo() {
  const { t } = useTranslation();

  return (
    <div className="bg-purple-800/30 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">
        {t('components:info.ope.title')}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">
            {t('components:info.ope.stats.totalSupply')}
          </p>
          <p className="text-xl font-bold">100,000,000 OPE</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:info.ope.stats.circulatingSupply')}
          </p>
          <p className="text-xl font-bold">50,000,000 OPE</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:info.ope.stats.price')}
          </p>
          <p className="text-xl font-bold">$0.1</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:info.ope.stats.marketCap')}
          </p>
          <p className="text-xl font-bold">$5,000,000</p>
        </div>
      </div>
    </div>
  );
} 