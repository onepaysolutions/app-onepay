import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function OPSCalculator() {
  const { t } = useTranslation();
  const [opsAmount, setOpsAmount] = useState<string>('');
  const [airdropAmount, setAirdropAmount] = useState<number>(0);

  const calculateAirdrop = () => {
    const amount = parseFloat(opsAmount);
    if (!isNaN(amount)) {
      // 假设空投比例为 1:1，您可以根据实际需求调整计算公式
      setAirdropAmount(amount);
    }
  };

  return (
    <Card className="w-full p-4 space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2">{t("ops.calculator.title")}</h2>
        <p className="text-sm text-gray-400">{t("ops.calculator.description")}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">{t("ops.calculator.input.label")}</label>
          <Input
            type="number"
            value={opsAmount}
            onChange={(e) => setOpsAmount(e.target.value)}
            placeholder={t("ops.calculator.input.placeholder")}
            className="w-full"
          />
        </div>
        <Button
          onClick={calculateAirdrop}
          className="w-full"
        >
          {t("ops.calculator.calculate")}
        </Button>
        {airdropAmount > 0 && (
          <div className="mt-4 p-4 bg-purple-900/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{t("ops.calculator.result.title")}</h3>
            <p className="text-sm text-gray-400 mb-2">{t("ops.calculator.result.description")}</p>
            <p className="text-2xl font-bold text-purple-400">
              {airdropAmount.toLocaleString()} OPS
            </p>
          </div>
        )}
      </div>
    </Card>
  );
} 