import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardContainerProps {
  children: ReactNode;
  className?: string;
}

export function CardContainer({ children, className }: CardContainerProps) {
  return (
    <div className={cn(
      'bg-purple-900/20 rounded-xl backdrop-blur-sm border border-purple-500/20',
      'p-4 md:p-6',
      className
    )}>
      {children}
    </div>
  );
} 