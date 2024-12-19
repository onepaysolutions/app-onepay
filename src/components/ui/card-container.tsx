import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardContainerProps {
  children: ReactNode;
  className?: string;
}

export function CardContainer({ children, className }: CardContainerProps) {
  return (
    <div className={cn(
      'bg-purple-900/20 rounded-xl p-4 md:p-6',
      'border border-purple-500/20',
      className
    )}>
      {children}
    </div>
  );
} 