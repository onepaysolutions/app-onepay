import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { useActiveAccount } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
import { ClaimButton2 } from "@/components/community/angel/ClaimButton2";
import { Header } from "@/components/common/layout/Header";
import { DemoModeToggle } from "@/components/community/demo/DemoModeToggle";
import { ContractAddress } from '@/components/community/info/ContractAddress';
import { ProgressBar } from '@/components/common/progress/ProgressBar';
// Removed the import for AddressCopy due to the error
import { supabase } from "@/lib/supabase/supabase";

const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

interface NFTStats {
  totalMinted: number;
  totalValueLocked: number;
  totalRewardsDistributed: number;
  averagePrice: number;
  claimed: number;
}

const defaultStats: NFTStats = {
  totalMinted: 0,
  totalValueLocked: 0,
  totalRewardsDistributed: 0,
  averagePrice: 0,
  claimed: 0
};

export function Community() {
  const { t } = useTranslation(['community', 'common']);
  const navigate = useNavigate();
  const account = useActiveAccount();
  const address = account?.address;
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<NFTStats>(defaultStats);

  const benefits = [
    {
      icon: "👥",
      key: "membership",
      description: "membership"
    },
    {
      icon: "💰",
      key: "rewards",
      description: "rewards"
    },
    {
      icon: "🎯",
      key: "features",
      description: "features"
    },
    {
      icon: "🗳️",
      key: "voting",
      description: "voting"
    }
  ];

  useEffect(() => {
    async function loadNFTStats() {
      try {
        const [angelData, starData] = await Promise.all([
          supabase.from('angel_nfts').select('*'),
          supabase.from('star_nfts').select('*')
        ]);

        if (angelData.error || starData.error) {
          throw new Error('Failed to fetch NFT data');
        }

        const totalMinted = (angelData.data?.length || 0) + (starData.data?.length || 0);
        const totalValueLocked = starData.data?.reduce((acc, nft) => 
          acc + Number(nft.contractValue || 0), 0) || 0;
        const totalRewardsDistributed = starData.data?.reduce((acc, nft) => 
          acc + Number(nft.opsRewards || 0), 0) || 0;
        const averagePrice = totalValueLocked / (starData.data?.length || 1);

        setStats({
          totalMinted,
          totalValueLocked,
          totalRewardsDistributed,
          averagePrice,
          claimed: totalMinted
        });
      } catch (error) {
        console.error('Error loading NFT stats:', error);
        setStats(defaultStats);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadNFTStats();
  }, []);

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black pt-[72px] pb-32">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className={`max-w-lg mx-auto relative ${isDemoMode ? 'demo-mode' : ''}`}>
            <div className="bg-[#1a1a1a]/50 backdrop-blur-xl rounded-xl p-4 mb-6 border border-purple-500/20">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  {t('stats.progress', { ns: 'community' })}
                </h3>
                <ProgressBar 
                  value={stats.claimed} 
                  total={300} 
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  {t('stats.contractAddress', { ns: 'community' })}
                </h3>
                <p>{CONTRACT_ADDRESS}</p>
              </div>
            </div>

            <motion.div 
              className={`relative bg-[#1a1a1a]/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 
                border ${isDemoMode ? 'border-yellow-400/30' : 'border-[#8B5CF6]/30'} 
                overflow-hidden mb-8`}
              animate={isDemoMode ? { scale: 1.02 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="absolute inset-0 rounded-2xl opacity-10 bg-cover bg-top z-0"
                style={{
                  backgroundImage: 'url(/src/assets/images/nft.png)'
                }}
              />
              
              <div className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center 
                  bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  {t('title', { ns: 'community' })}
                </h1>
                <p className="text-gray-400 text-center mb-8">
                  {t('subtitle', { ns: 'community' })}
                </p>

                <div className="space-y-4 mb-8">
                  {benefits.map((benefit) => (
                    <motion.div
                      key={benefit.key}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-3 
                        p-4 rounded-xl bg-[#1a1a1a]/60 border border-[#8B5CF6]/20
                        transition-all duration-200
                        shadow-[0_0_15px_rgba(139,92,246,0.1)]
                        relative overflow-hidden
                        ${isDemoMode ? 'text-white/50 hover:text-white/90' : 'text-white hover:text-white'}`}
                    >
                      <div className={`w-12 h-12 rounded-full 
                        flex items-center justify-center shrink-0 border border-[#8B5CF6]/30
                        shadow-[0_0_10px_rgba(139,92,246,0.2)]
                        relative z-10
                        ${isDemoMode ? 'bg-[#1a1a1a]/60 backdrop-blur-2xl' : 'bg-[#1a1a1a]/80'}`}
                      >
                        <span className={`text-2xl ${isDemoMode ? 'text-white/70' : 'text-white'}`}>
                          {benefit.icon}
                        </span>
                      </div>
                      
                      {isDemoMode && (
                        <div className="absolute inset-0 backdrop-blur-xl bg-[#1a1a1a]/60" />
                      )}
                      
                      <div className="flex-1">
                        <span className={`block text-base font-medium mb-1
                          ${isDemoMode ? 'text-white/80' : 'text-white'}`}
                        >
                          {t(`benefits.${benefit.key}.title`, { ns: 'community' })}
                        </span>
                        <span className={`block text-sm
                          ${isDemoMode ? 'text-white/50' : 'text-gray-400'}`}
                        >
                          {t(`benefits.${benefit.description}.description`, { ns: 'community' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {address ? (
                  <ClaimButton2 
                    walletAddress={address}
                    isDemoMode={isDemoMode}
                  />
                ) : (
                  <div className={`text-center p-6 rounded-xl border
                    ${isDemoMode ? 
                      'bg-yellow-400/10 border-yellow-400/30' : 
                      'bg-[#8B5CF6]/10 border-[#8B5CF6]/30'}`}
                  >
                    <p>{t('connectWallet', { ns: 'community' })}</p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/ope')}
                  className={`mt-6 w-full py-3 px-6 rounded-xl text-white/80 hover:text-white
                    transition-colors duration-200 backdrop-blur-sm
                    flex items-center justify-center gap-2
                    ${isDemoMode ?
                      'bg-yellow-400/10 hover:bg-yellow-400/20 border-yellow-400/30' :
                      'bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 border-[#8B5CF6]/30'}`}
                >
                  <span>ℹ️</span>
                  <span>{t("community.buttons.learnOPE")}</span>
                </motion.button>
              </div>
            </motion.div>

            <motion.button
              onClick={() => navigate('/demo/community')}
              className="fixed bottom-28 right-4 z-50 px-4 py-2 
                bg-gradient-to-r from-[#8B5CF6]/90 to-[#7C3AED]/90 
                hover:from-[#8B5CF6] hover:to-[#7C3AED]
                rounded-lg 
                backdrop-blur-sm border border-[#8B5CF6]/30 
                shadow-lg shadow-[#8B5CF6]/20
                transition-all duration-200
                flex items-center gap-2
                group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <span className="text-lg group-hover:scale-110 transition-transform">🎮</span>
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full 
                  animate-ping" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium">{t('tutorial.demo.tryDemo')}</span>
                <span className="text-[10px] text-white/70">{t('tutorial.demo.noRealTx')}</span>
              </div>
            </motion.button>

            <AnimatePresence>
              {isDemoMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed bottom-[160px] left-1/2 transform -translate-x-1/2 
                    bg-yellow-400/10 backdrop-blur-sm border border-yellow-400/30
                    px-4 py-2 rounded-lg text-xs text-yellow-400
                    max-w-[90vw] mx-auto text-center"
                >
                  {t('tutorial.demo.description')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <DemoModeToggle 
          isDemoMode={isDemoMode}
          onToggle={toggleDemoMode}
        />
      </div>
    </>
  );
}

export default Community; 

