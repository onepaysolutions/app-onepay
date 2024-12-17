import { ReactNode } from 'react';

interface ContentCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function ContentCard({ children, className = '', title }: ContentCardProps) {
  return (
    <div className={`bg-purple-900/20 rounded-xl backdrop-blur-sm border border-purple-500/20 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-purple-500/20">
          <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
} 