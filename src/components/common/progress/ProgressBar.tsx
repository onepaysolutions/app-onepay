interface ProgressBarProps {
  value: number;
  total: number;
}

export function ProgressBar({ value, total }: ProgressBarProps) {
  const percentage = Math.min((value / total) * 100, 100);
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-black/30 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-400 min-w-[3rem]">
        {percentage.toFixed(1)}%
      </span>
    </div>
  );
} 