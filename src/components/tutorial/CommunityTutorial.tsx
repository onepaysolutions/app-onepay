import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaUsers, FaCoins, FaChartLine } from 'react-icons/fa';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: () => void;
}

export function CommunityTutorial() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tutorialSteps: TutorialStep[] = [
    {
      title: t("tutorial.connect.title"),
      description: t("tutorial.connect.description"),
      icon: <FaWallet className="w-6 h-6 text-purple-400" />,
    },
    {
      title: t("tutorial.claim_angel.title"),
      description: t("tutorial.claim_angel.description"),
      icon: <FaUsers className="w-6 h-6 text-purple-400" />,
    },
    {
      title: t("tutorial.check_ope.title"),
      description: t("tutorial.check_ope.description"),
      icon: <FaCoins className="w-6 h-6 text-purple-400" />,
    },
    {
      title: t("tutorial.claim_star.title"),
      description: t("tutorial.claim_star.description"),
      icon: <FaChartLine className="w-6 h-6 text-purple-400" />,
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-b from-purple-900/90 to-black/90 rounded-xl p-6 max-w-md mx-4 border border-purple-500/30"
        >
          <div className="flex items-center gap-4 mb-4">
            {tutorialSteps[currentStep].icon}
            <h3 className="text-xl font-bold text-white">
              {tutorialSteps[currentStep].title}
            </h3>
          </div>
          
          <p className="text-gray-300 mb-6">
            {tutorialSteps[currentStep].description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-purple-500' : 'bg-purple-500/30'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
            >
              {currentStep === tutorialSteps.length - 1 
                ? t("tutorial.finish")
                : t("tutorial.next")}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 