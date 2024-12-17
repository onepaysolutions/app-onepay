import { useTranslation } from "react-i18next";

interface StageData {
  cycle: number;
  stage: number;
  price: number;
  totalSupply: number;
  soldAmount: number;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed';
}

interface OPSStageInfoProps {
  currentCycle: number;
  currentStage: number;
  currentPrice: number;
  stageData: StageData[];
}

export function OPSStageInfo({ currentCycle, currentStage, currentPrice, stageData }: OPSStageInfoProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
      <h3 className="text-xl font-semibold mb-4">{t("ops.stage.title")}</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-400">{t("ops.stage.cycle")}</p>
          <p className="text-xl font-bold text-purple-400">{currentCycle}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">{t("ops.stage.current")}</p>
          <p className="text-xl font-bold text-purple-400">{currentStage}/20</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">{t("ops.stage.price")}</p>
          <p className="text-xl font-bold text-purple-400">${currentPrice}</p>
        </div>
      </div>

      {/* 显示阶段数据 */}
      {stageData.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3">{t("ops.stage.details")}</h4>
          <div className="space-y-3">
            {stageData.map((stage, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Stage {stage.stage}</span>
                  <span className="text-purple-400">${stage.price}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">{t("ops.stage.sold")}: {stage.soldAmount}</span>
                  <span className="text-gray-500">{t("ops.stage.total")}: {stage.totalSupply}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 