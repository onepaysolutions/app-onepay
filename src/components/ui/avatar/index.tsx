import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'away';
  className?: string;
}

export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  fallback,
  status,
  className,
  ...props 
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500'
  };

  const getFallbackText = () => {
    if (fallback) return fallback;
    if (alt) return alt.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-gradient-to-br from-purple-500/10 to-purple-700/10",
          "border-2 border-purple-500/20",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className={cn(
              "w-full h-full object-cover",
              "transition-opacity duration-300",
              "hover:opacity-90"
            )}
          />
        ) : (
          <div className={cn(
            "w-full h-full flex items-center justify-center",
            "bg-gradient-to-br from-purple-500/20 to-purple-700/20",
            "text-white font-medium",
            size === 'sm' ? 'text-sm' : 'text-lg'
          )}>
            {getFallbackText()}
          </div>
        )}

        {/* 发光效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-700/5 pointer-events-none" />
      </div>

      {/* 在线状态指示器 */}
      {status && (
        <span className={cn(
          "absolute bottom-0 right-0",
          "w-3 h-3 rounded-full border-2 border-white",
          statusColors[status],
          "shadow-lg",
          size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
        )} />
      )}
    </div>
  );
}

// 添加一个 AvatarGroup 组件用于显示多个头像
interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export function AvatarGroup({ children, max = 3, size = 'md', className }: AvatarGroupProps) {
  const avatars = React.Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn("flex -space-x-4", className)}>
      {visibleAvatars.map((avatar, index) => (
        <div key={index} className="relative">
          {avatar}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full bg-purple-900/50",
            "border-2 border-purple-500/20 text-white font-medium",
            size === 'sm' ? 'w-8 h-8 text-xs' : 'w-12 h-12 text-sm'
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
} 