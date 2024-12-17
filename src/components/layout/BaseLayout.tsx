import React from 'react';
import { LAYOUT_CONFIG } from '@/config/layout';

interface BaseLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function BaseLayout({ children, header, footer, className }: BaseLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      {header && (
        <header 
          className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-purple-500/20"
          style={{ height: LAYOUT_CONFIG.headerHeight }}
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            {header}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main 
        className={`flex-1 w-full mx-auto px-4 ${className}`}
        style={{ 
          maxWidth: LAYOUT_CONFIG.maxContentWidth,
          marginTop: header ? LAYOUT_CONFIG.headerHeight : '0',
          marginBottom: footer ? LAYOUT_CONFIG.footerHeight : '0',
          minHeight: `calc(100vh - ${header ? LAYOUT_CONFIG.headerHeight : '0'} - ${footer ? LAYOUT_CONFIG.footerHeight : '0'})`
        }}
      >
        {children}
      </main>

      {/* Footer */}
      {footer && (
        <footer 
          className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-t border-purple-500/20"
          style={{ height: LAYOUT_CONFIG.footerHeight }}
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
} 