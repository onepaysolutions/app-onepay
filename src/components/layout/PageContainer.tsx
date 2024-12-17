import { ReactNode } from 'react';
import { Header } from './Header';
import { Container } from './Container';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  withHeader?: boolean;
  withPadding?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function PageContainer({ 
  children, 
  withHeader = true,
  withPadding = true,
  size = 'lg',
  className 
}: PageContainerProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-purple-900/20 to-black">
      {withHeader && <Header />}
      <main className={cn(
        'w-full min-h-[calc(100vh-4rem)]',
        withHeader && 'pt-16',
        className
      )}>
        {withPadding ? (
          <Container size={size}>
            {children}
          </Container>
        ) : (
          children
        )}
      </main>
    </div>
  );
} 