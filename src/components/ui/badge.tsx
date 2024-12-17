interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  glow?: boolean;
}

export function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  glow = false 
}: BadgeProps) {
  const variants = {
    default: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    success: 'bg-green-600/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-600/20 text-red-400 border-red-500/30'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const glowEffect = {
    default: 'shadow-purple-500/30',
    success: 'shadow-green-500/30',
    warning: 'shadow-yellow-500/30',
    error: 'shadow-red-500/30'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full border
      font-medium transition-colors
      ${variants[variant]}
      ${sizes[size]}
      ${glow ? `shadow-lg ${glowEffect[variant]}` : ''}
    `}>
      {children}
    </span>
  );
} 