import React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  value: string;
  onChange: (value: string) => void;
}>({
  value: '',
  onChange: () => {}
});

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>
      <div className={cn('space-y-4', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div className={cn('flex bg-purple-900/20 rounded-lg p-1', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.onChange(value)}
      className={cn(
        'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
        isActive 
          ? 'bg-purple-600 text-white' 
          : 'text-gray-400 hover:text-purple-300',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  
  if (context.value !== value) {
    return null;
  }

  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  );
} 