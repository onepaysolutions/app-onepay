import { ReactNode } from 'react';

interface MainProps {
  children: ReactNode;
}

export function Main({ children }: MainProps) {
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4">
        {children}
      </div>
    </main>
  );
} 