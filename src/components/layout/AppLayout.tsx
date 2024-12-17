import { ReactNode } from 'react';
import { Header } from '@/components/common/layout/Header';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  withHeader?: boolean;
}

export function AppLayout({ children, className = '', withHeader = true }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-purple-900/20 to-black">
      {withHeader && <Header />}
      <div className={`w-full px-4 pt-[72px] pb-8 safe-area-top safe-area-bottom ${className}`}>
        <div className="relative max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 