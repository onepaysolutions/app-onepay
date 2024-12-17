interface ProgressProps {
  value: number;
  max?: number;
  color?: 'purple' | 'blue' | 'green';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export function Progress({ 
  value, 
  max = 100, 
  color = 'purple',
  size = 'md',
  showValue = false 
}: ProgressProps) {
  const percentage = Math.min(100, (value / max) * 100);
  
  const colors = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="relative w-full">
      <div className={`w-full bg-gray-800 rounded-full ${sizes[size]}`}>
        <div
          className={`rounded-full bg-gradient-to-r ${colors[color]} transition-all duration-300 ${sizes[size]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="absolute right-0 -top-6 text-sm text-gray-400">
          {value}/{max}
        </span>
      )}
    </div>
  );
} 