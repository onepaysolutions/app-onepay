import { useTranslation } from "react-i18next";

export function ReferralCard() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-purple-800/30 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">
        {t('components:cards.referral.title')}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">
            {t('components:cards.referral.stats.totalReferrals')}
          </p>
          <p className="text-xl font-bold">100</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:cards.referral.stats.activeReferrals')}
          </p>
          <p className="text-xl font-bold">50</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:cards.referral.stats.totalRewards')}
          </p>
          <p className="text-xl font-bold">1,000 OPS</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:cards.referral.code.your')}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">ABC123</p>
            <button className="text-sm text-purple-400 hover:text-purple-300">
              {t('common:shared.actions.copy')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 