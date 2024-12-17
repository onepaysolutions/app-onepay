import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const CollapsibleContext = createContext<{
  isOpen: boolean;
  toggle: () => void;
}>({
  isOpen: false,
  toggle: () => {},
});

export function Collapsible({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <CollapsibleContext.Provider value={{ isOpen, toggle }}>
      {children}
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const { toggle } = useContext(CollapsibleContext);
  return (
    <div onClick={toggle} className={cn('cursor-pointer', className)}>
      {children}
    </div>
  );
}

export function CollapsibleContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen } = useContext(CollapsibleContext);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={cn(
        'animate-slideDown overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
} 