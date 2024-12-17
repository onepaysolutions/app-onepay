import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  element: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface ClaimTutorialGuideProps {
  isDemo?: boolean;
  onComplete?: () => void;
}

export function ClaimTutorialGuide({ isDemo = false, onComplete }: ClaimTutorialGuideProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const steps: TutorialStep[] = [
    {
      element: '.claim-button',
      title: t('tutorial.claim.step1.title'),
      description: t('tutorial.claim.step1.description'),
      position: 'bottom'
    },
    {
      element: '.pay-embed',
      title: t('tutorial.claim.step2.title'),
      description: t('tutorial.claim.step2.description'),
      position: 'top'
    }
  ];

  useEffect(() => {
    const updatePosition = () => {
      const currentStepData = steps[currentStep];
      const element = document.querySelector(currentStepData.element);
      
      if (element && tooltipRef.current) {
        const elementRect = element.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        let top = 0;
        let left = 0;

        switch (currentStepData.position) {
          case 'top':
            top = elementRect.top - tooltipRect.height - 12;
            left = elementRect.left + elementRect.width / 2 - 40;
            break;
          case 'bottom':
            top = elementRect.bottom + 12;
            left = elementRect.left + elementRect.width / 2 - 40;
            break;
          // ... 其他位置的计算
        }

        setPosition({ top, left });
        
        // 添加高亮效果
        element.classList.add('tutorial-highlight');
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      // 移除高亮效果
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    };
  }, [currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete?.();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10001]"
      >
        <style>{`
          .tutorial-highlight {
            position: relative;
            z-index: 10002;
            box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.4);
            border-radius: 4px;
          }
        `}</style>

        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-none" />
        
        <motion.div
          ref={tooltipRef}
          className="fixed z-[10002] p-5 bg-black/90 rounded-lg border border-purple-500/30
            shadow-xl backdrop-blur-sm pointer-events-auto max-w-xs"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translateX(-50%)',
            width: '320px',
          }}
        >
          {isDemo && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600/50 rounded text-xs">
              {t('tutorial.demo.title')}
            </div>
          )}

          <h4 className="text-lg font-bold mb-2">
            {steps[currentStep].title}
          </h4>
          
          <p className="text-gray-300 text-sm mb-4">
            {steps[currentStep].description}
          </p>

          <button
            onClick={handleNext}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg
              text-sm font-medium transition-colors"
          >
            {currentStep === steps.length - 1 ? 
              t('tutorial.common.gotIt') : 
              t('tutorial.common.next')}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 