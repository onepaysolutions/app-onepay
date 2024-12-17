import { useTranslation } from 'react-i18next';

export function PriceChart() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-purple-800/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {t('components:charts.price.title')}
        </h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg bg-purple-700/50">
            {t('components:charts.price.timeframes.day')}
          </button>
          <button className="px-3 py-1 rounded-lg hover:bg-purple-700/30">
            {t('components:charts.price.timeframes.week')}
          </button>
          {/* ... 其他时间范围按钮 */}
        </div>
      </div>
      
      {/* 图表组件 */}
      <div className="h-80">
        {/* 图表实现 */}
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-400">
            {t('components:charts.stats.labels.holders')}
          </p>
          <p className="text-xl font-bold">10,000</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:charts.stats.labels.transactions')}
          </p>
          <p className="text-xl font-bold">50,000</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:charts.stats.labels.volume')}
          </p>
          <p className="text-xl font-bold">$1,000,000</p>
        </div>
      </div>
    </div>
  );
} 