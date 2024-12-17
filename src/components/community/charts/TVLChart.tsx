import { useTranslation } from 'react-i18next';

export function TVLChart() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-purple-800/30 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">
        {t('components:charts.tvl.title')}
      </h2>
      
      {/* 图表组件 */}
      <div className="h-60">
        {/* 图表实现 */}
      </div>
      
      <div className="mt-4 flex justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {t('components:charts.tvl.labels.value')}
          </p>
          <p className="text-xl font-bold">$10,000,000</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            {t('components:charts.tvl.labels.change')}
          </p>
          <p className="text-xl font-bold text-green-400">+5.2%</p>
        </div>
      </div>
    </div>
  );
} 