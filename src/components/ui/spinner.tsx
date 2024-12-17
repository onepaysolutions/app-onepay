interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'white';
}

export function Spinner({ size = 'md', color = 'purple' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  const colors = {
    purple: 'border-purple-500 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  return (
    <div
      className={`
        animate-spin rounded-full
        ${sizes[size]}
        ${colors[color]}
      `}
    />
  );
} 