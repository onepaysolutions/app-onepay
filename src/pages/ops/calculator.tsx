import { useTranslation } from 'react-i18next';

export function OPSCalculator() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("ops.calculator.title")}</h1>
      {/* 计算器内容 */}
    </div>
  );
} 