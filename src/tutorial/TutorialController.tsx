import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => Promise<void>;
  required?: boolean;
}

interface TutorialControllerProps {
  mode: 'real' | 'demo';
  type: 'community' | 'star' | 'ops' | 'referral';
  onComplete?: () => void;
}

export function TutorialController({ mode, type, onComplete }: TutorialControllerProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // 根据类型获取教程步骤
  const getTutorialSteps = (): TutorialStep[] => {
    switch (type) {
      case 'community':
        return [
          {
            id: 'connect',
            title: t('tutorial.community.connect.title'),
            description: t('tutorial.community.connect.description'),
            target: '.connect-wallet-button',
            position: 'bottom',
            required: true
          },
          {
            id: 'claim',
            title: t('tutorial.community.claim.title'),
            description: t('tutorial.community.claim.description'),
            target: '.claim-button',
            position: 'bottom',
            action: async () => {
              if (mode === 'demo') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('模拟认领 NFT');
              }
            }
          },
          {
            id: 'payment',
            title: t('tutorial.community.payment.title'),
            description: t('tutorial.community.payment.description'),
            target: '.pay-embed',
            position: 'top',
            action: async () => {
              if (mode === 'demo') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('模拟支付确认');
              }
            }
          }
        ];
      // ... 可以添加其他类型的教程步骤
      default:
        return [];
    }
  };

  const steps = getTutorialSteps();
  const currentStepData = steps[currentStep];

  const handleNext = async () => {
    if (isProcessing) return;

    try {
      if (currentStepData.action) {
        setIsProcessing(true);
        await currentStepData.action();
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsVisible(false);
        onComplete?.();
      }
    } catch (error) {
      console.error('Error executing step action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    if (currentStepData.required) return;
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible || !currentStepData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10001] pointer-events-none"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute z-[10002] p-6 bg-black/90 rounded-xl border border-purple-500/30
            shadow-xl backdrop-blur-sm pointer-events-auto
            max-w-md w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {mode === 'demo' && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600/50 rounded text-xs">
              {t('tutorial.demo.title')}
            </div>
          )}

          <h3 className="text-xl font-bold mb-2">
            {currentStepData.title}
          </h3>
          
          <p className="text-gray-300 mb-6">
            {currentStepData.description}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              disabled={currentStepData.required}
              className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStepData.required ? t('tutorial.common.required') : t('tutorial.common.skip')}
            </button>
            
            <button
              onClick={handleNext}
              disabled={isProcessing}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {t('tutorial.common.processing')}
                </>
              ) : (
                currentStep === steps.length - 1 ? 
                  t('tutorial.common.complete') : 
                  t('tutorial.common.next')
              )}
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentStep ? 'bg-purple-500' : 'bg-purple-500/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 