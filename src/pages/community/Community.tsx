import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { useActiveAccount } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
import { ClaimButton2 } from "@/components/community/angel/ClaimButton2";
import { Header } from "@/components/layout/Header";
import { DemoModeToggle } from "@/components/community/demo/DemoModeToggle";
import { ContractAddress } from '@/components/community/info/ContractAddress';
import { ProgressBar } from '@/components/common/progress/ProgressBar';
import { supabase } from "@/lib/supabase/supabase";
import { TabBar } from '@/components/layout/TabBar';

const CONTRACT_ADDRESS = "0x620c741Ff92b992894Ab4b5d5a1Cc9F0bdDA5ce5";

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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const account = useActiveAccount();
  const address = account?.address;
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<NFTStats>(defaultStats);
  
  const isZh = i18n.language.startsWith('zh');

  const benefits = [
    {
      icon: "👥",
      title: "Exclusive Membership",
      titleZh: "专属会员",
      description: "Access to premium features and content",
      descriptionZh: "访问高级功能和内容"
    },
    {
      icon: "💰",
      title: "Earn Rewards",
      titleZh: "赚取奖励",
      description: "Get rewarded for your contributions",
      descriptionZh: "获得贡献奖励"
    },
    {
      icon: "🎯",
      title: "Special Features",
      titleZh: "特殊功能",
      description: "Unlock unique platform capabilities",
      descriptionZh: "解锁平台独特功能"
    },
    {
      icon: "🗳️",
      title: "Governance Rights",
      titleZh: "治理权",
      description: "Participate in community decisions",
      descriptionZh: "参与社区决策"
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
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-[72px] pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="w-full md:w-auto">
            <ContractAddress 
              address={CONTRACT_ADDRESS}
            
            />
          
          </div>
        </div>

        <div className="mb-8">
          <ProgressBar 
            value={stats.claimed} 
            total={300}
           
           
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index} // Changed from benefit.title to index
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
                  {isZh ? benefit.titleZh : benefit.title}
                </span>
                <span className={`block text-sm
                  ${isDemoMode ? 'text-white/50' : 'text-gray-400'}`}
                >
                  {isZh ? benefit.descriptionZh : benefit.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative">
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
              <p>{isZh ? "请连接钱包以继续" : "Please connect your wallet to continue"}</p>
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
            <span>{isZh ? "了解 OPE" : "Learn about OPE"}</span>
          </motion.button>
        </div>

        <div className="relative">
          <AnimatePresence>
            {isDemoMode && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-gray-400 text-sm bg-purple-900/20 rounded-xl p-4 mb-4
                  max-w-[90vw] mx-auto text-center"
              >
                {isZh ? 
                  "您正在演示模式中。不会产生任何真实交易。" : 
                  "You are in demo mode. No real transactions will be made."
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DemoModeToggle 
        isDemoMode={isDemoMode}
        onToggle={toggleDemoMode}
      />
      <TabBar />
    </div>
  );
}
