import { useTranslation } from 'react-i18next';

interface OPSSaleProps {
  currentCycle: number;
  currentStage: number;
  totalStages: number;
  progress: number;
}

export function OPSSale({ currentCycle, currentStage, totalStages, progress }: OPSSaleProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2">{t('ops.sale.title')}</h3>
          <p className="text-sm text-gray-400">{t('ops.sale.description')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">{t('ops.sale.cycle')}</p>
            <p className="text-2xl font-bold">#{currentCycle}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">{t('ops.sale.stage')}</p>
            <p className="text-2xl font-bold">{currentStage}/{totalStages}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">{t('ops.sale.progress')}</span>
            <span className="text-purple-400">{progress}%</span>
          </div>
          <div className="h-2 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 