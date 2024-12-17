import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaCoins, FaChartBar, FaLock } from 'react-icons/fa';

export function StarNFTTutorial() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tutorialSteps = [
    {
      title: t("tutorial.star.claim.title"),
      description: t("tutorial.star.claim.description"),
      icon: <FaStar className="w-6 h-6 text-yellow-400" />,
    },
    {
      title: t("tutorial.star.presale.title"),
      description: t("tutorial.star.presale.description"),
      icon: <FaCoins className="w-6 h-6 text-yellow-400" />,
    },
    {
      title: t("tutorial.star.progress.title"),
      description: t("tutorial.star.progress.description"),
      icon: <FaChartBar className="w-6 h-6 text-yellow-400" />,
    },
    {
      title: t("tutorial.star.allocation.title"),
      description: t("tutorial.star.allocation.description"),
      icon: <FaLock className="w-6 h-6 text-yellow-400" />,
    }
  ];

  // ... 其余代码类似 CommunityTutorial 
} 