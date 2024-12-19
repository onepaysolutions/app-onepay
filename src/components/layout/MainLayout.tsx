import { ReactNode } from 'react';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
  withHeader?: boolean;
  withTabBar?: boolean;
  withGradient?: boolean;
}

export function MainLayout({ 
  children, 
  className,
  withHeader = true,
  withTabBar = true,
  withGradient = true
}: MainLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      withGradient && "bg-gradient-to-b from-black via-purple-900/10 to-black",
      className
    )}>
      {/* Header */}
      {withHeader && <Header />}
      
      {/* Main Content */}
      <main className={cn(
        "flex-1",
        withHeader && "pt-[72px]" // Header height
      )}>
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>

      {/* TabBar */}
      {withTabBar && <TabBar />}
    </div>
  );
}
