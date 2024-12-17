import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { OPEChart } from './OPEChart';

export function OPESection() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-12">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-gradient-to-b from-purple-900/40 to-black/40 rounded-t-xl p-4 backdrop-blur-sm border border-purple-500/20"
      >
        <span className="text-lg font-semibold">{t("OPE Token Information")}</span>
        {isExpanded ? (
          <IoChevronUpOutline className="w-5 h-5" />
        ) : (
          <IoChevronDownOutline className="w-5 h-5" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-b-xl border-x border-b border-purple-500/20">
              {/* 当前阶段信息 */}
              <div className="p-6 border-b border-purple-500/20">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">{t("Current Stage")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-sm text-gray-400 mb-1">{t("Stage")}</p>
                    <p className="text-xl font-bold text-purple-400">1/4</p>
                  </div>
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-sm text-gray-400 mb-1">{t("Current Price")}</p>
                    <p className="text-xl font-bold text-purple-400">0.1 USDC</p>
                  </div>
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-sm text-gray-400 mb-1">{t("Available Supply")}</p>
                    <p className="text-xl font-bold text-purple-400">300,000 OPE</p>
                  </div>
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-sm text-gray-400 mb-1">{t("Next Price")}</p>
                    <p className="text-xl font-bold text-purple-400">1.5 USDC</p>
                  </div>
                </div>
              </div>

              {/* OPE Chart */}
              <div className="p-6">
                <OPEChart />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 