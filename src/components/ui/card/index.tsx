import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  variant = 'default',
  padding = 'md',
  className,
  ...props 
}: CardProps) {
  const variants = {
    default: 'bg-purple-900/20 border border-purple-500/20',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/20',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={cn(
        'rounded-xl',
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 