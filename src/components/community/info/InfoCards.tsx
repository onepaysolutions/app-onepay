import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from 'framer-motion';

interface Stats {
  totalNFTSold: number;
  totalNFTRemaining: number;
  totalOPERewards: number;
  totalReferralRewards: number;
  totalMembers: number;
}

export function InfoCards() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalNFTSold: 0,
    totalNFTRemaining: 300,
    totalOPERewards: 0,
    totalReferralRewards: 0,
    totalMembers: 0
  });

  return (
    <div className="w-full max-w-lg mx-auto mt-4 mb-8">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-between 
          bg-gradient-to-b from-purple-900/40 to-black/40 
          rounded-t-xl p-4 backdrop-blur-sm 
          border border-purple-500/20
          hover:bg-purple-900/50 transition-colors"
      >
        <span className="text-lg font-semibold">
          {t('info:projectStats.title')}
        </span>
        <span className="text-sm text-gray-400">
          {isExpanded ? t('common:actions.collapse') : t('common:actions.expand')}
        </span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-b from-purple-900/40 to-black/40 
              rounded-b-xl border-x border-b border-purple-500/20">
              {/* NFT Statistics */}
              <div className="p-4 border-b border-purple-500/20">
                <h3 className="text-sm font-semibold mb-3 text-gray-300">
                  {t('info:projectStats.nftStats.title')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">
                      {t('info:projectStats.nftStats.totalSold')}
                    </p>
                    <motion.p 
                      className="text-lg font-bold text-purple-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {stats.totalNFTSold}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">
                      {t('info:projectStats.nftStats.remaining')}
                    </p>
                    <motion.p 
                      className="text-lg font-bold text-purple-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {stats.totalNFTRemaining}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* OPE Statistics */}
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-300">
                  {t('info:projectStats.opeStats.title')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">
                      {t('info:projectStats.opeStats.price')}
                    </p>
                    <motion.p 
                      className="text-lg font-bold text-purple-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      ${stats.totalOPERewards.toFixed(4)}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">
                      {t('info:projectStats.opeStats.volume')}
                    </p>
                    <motion.p 
                      className="text-lg font-bold text-purple-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      ${stats.totalReferralRewards}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Community Statistics */}
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-300">
                  {t('info.community.members', { ns: 'cards' })}
                </h3>
                <p className="text-lg font-medium">
                  {stats.totalMembers.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 