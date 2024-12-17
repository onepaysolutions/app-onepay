import { useTranslation } from 'react-i18next';

interface OPSStageCardProps {
  stage: number;
  price: number;
  nextPrice: number;
  soldAmount: number;
  totalAmount: number;
  startTime: string;
  endTime: string;
  onClick: () => void;
}

export function OPSStageCard({
  stage,
  price,
  nextPrice,
  soldAmount,
  totalAmount,
  startTime,
  endTime,
  onClick
}: OPSStageCardProps) {
  const { t } = useTranslation();
  const progress = (soldAmount / totalAmount) * 100;

  return (
    <div 
      onClick={onClick}
      className="bg-purple-900/20 rounded-xl p-6 border border-purple-500/20 
        hover:bg-purple-900/30 cursor-pointer transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">Stage {stage}</h3>
          <p className="text-sm text-gray-400">
            Price: ${price.toFixed(2)} → ${nextPrice.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">{progress.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">
            {soldAmount.toLocaleString()} / {totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="h-2 bg-black/30 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-sm text-gray-400">
        <p>Start: {new Date(startTime).toLocaleDateString()}</p>
        <p>End: {new Date(endTime).toLocaleDateString()}</p>
      </div>
    </div>
  );
} 