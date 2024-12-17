import { useTranslation } from "react-i18next";

export function OPSAirdropInfo() {
  const { t } = useTranslation();

  return (
    <div className="bg-purple-800/30 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">
        {t('components:ops.airdrop.title')}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">
            {t('components:ops.airdrop.info.total')}
          </p>
          <p className="text-xl font-bold">1,000,000 OPS</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:ops.airdrop.info.claimed')}
          </p>
          <p className="text-xl font-bold">500,000 OPS</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:ops.airdrop.info.remaining')}
          </p>
          <p className="text-xl font-bold">500,000 OPS</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:ops.airdrop.info.claimable')}
          </p>
          <p className="text-xl font-bold">100 OPS</p>
        </div>
      </div>

      <button className="w-full mt-6 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
        {t('components:ops.airdrop.actions.claim')}
      </button>
    </div>
  );
} 