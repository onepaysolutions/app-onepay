import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface TutorialStepProps {
  step: {
    title: string;
    target: string;
    placement: "left" | "right" | "top" | "bottom";
  };
  onNext: () => void;
  onSkip: () => void;
  isLastStep: boolean;
}

export function TutorialStep({ step, onNext, onSkip, isLastStep }: TutorialStepProps) {
  const { t } = useTranslation();
  const targetElement = document.querySelector(step.target);
  const rect = targetElement?.getBoundingClientRect();

  if (!rect) return null;

  const getPosition = () => {
    const margin = 20;
    switch (step.placement) {
      case "left":
        return {
          left: rect.left - 320 - margin,
          top: rect.top + rect.height / 2 - 100
        };
      case "right":
        return {
          left: rect.right + margin,
          top: rect.top + rect.height / 2 - 100
        };
      case "top":
        return {
          left: rect.left + rect.width / 2 - 160,
          top: rect.top - 200 - margin
        };
      case "bottom":
        return {
          left: rect.left + rect.width / 2 - 160,
          top: rect.bottom + margin
        };
    }
  };

  const position = getPosition();

  return (
    <>
      {/* 高亮遮罩 */}
      <div className="fixed inset-0 bg-black/60 z-50" />
      
      {/* 目标元素高亮 */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          left: rect.left - 8,
          top: rect.top - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 15px rgba(139, 92, 246, 0.5)",
          borderRadius: "8px",
          border: "2px solid rgba(139, 92, 246, 0.5)"
        }}
      />

      {/* 教程提示框 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed z-50 bg-gradient-to-b from-purple-900/90 to-black/90 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 w-[320px]"
        style={{
          left: position.left,
          top: position.top,
        }}
      >
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          {step.title}
        </h3>

        <div className="flex justify-between mt-6">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t("tutorial.skip")}
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
          >
            {isLastStep ? t("tutorial.finish") : t("tutorial.next")}
          </button>
        </div>
      </motion.div>
    </>
  );
} 