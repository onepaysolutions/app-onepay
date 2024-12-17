import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-b from-purple-900/20 to-black">
      <div className="w-full px-4 py-6 md:py-8 safe-area-top safe-area-bottom">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 