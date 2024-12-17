import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { TutorialHighlight } from '@/types/tutorial';

interface TutorialGuideProps {
  highlight: TutorialHighlight;
  onComplete: () => void;
}

export function TutorialGuide({ highlight, onComplete }: TutorialGuideProps) {
  const { t } = useTranslation();
  const [elementPosition, setElementPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    const element = document.querySelector(highlight.selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setElementPosition(rect);
      
      element.classList.add('tutorial-highlight');
      
      return () => {
        element.classList.remove('tutorial-highlight');
      };
    }
  }, [highlight.selector]);

  if (!elementPosition) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black/50" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bg-purple-900/90 rounded-lg p-4 max-w-xs"
        style={{
          left: getPositionStyle(elementPosition, highlight.position)?.left,
          top: getPositionStyle(elementPosition, highlight.position)?.top,
        }}
      >
        <p className="text-white text-sm">{highlight.message}</p>
        <button 
          onClick={onComplete}
          className="mt-2 px-4 py-1 bg-purple-600 rounded text-sm text-white"
        >
          {t('tutorial.common.gotIt')}
        </button>
      </motion.div>
    </div>
  );
}

function getPositionStyle(elementRect: DOMRect, position: 'top' | 'bottom' | 'left' | 'right') {
  switch (position) {
    case 'top':
      return {
        left: elementRect.left + (elementRect.width / 2),
        top: elementRect.top - 10
      };
    case 'bottom':
      return {
        left: elementRect.left + (elementRect.width / 2),
        top: elementRect.bottom + 10
      };
    case 'left':
      return {
        left: elementRect.left - 10,
        top: elementRect.top + (elementRect.height / 2)
      };
    case 'right':
      return {
        left: elementRect.right + 10,
        top: elementRect.top + (elementRect.height / 2)
      };
  }
} 