import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { ClaimButton2 } from "@/components/community/angel/ClaimButton2";
import { Header } from "@/components/layout/Header";

const benefits = [
  {
    icon: "👥",
    key: "membership"
  },
  {
    icon: "💰",
    key: "rewards"
  },
  {
    icon: "🎯",
    key: "features"
  },
  {
    icon: "🗳️",
    key: "voting"
  }
];

export function CommunityDemo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tutorialStep, setTutorialStep] = useState(1);
  const [showOPEGuide, setShowOPEGuide] = useState(true);
  const [hasVisitedOPE, setHasVisitedOPE] = useState(false);
  const [showClaimGuide, setShowClaimGuide] = useState(false);

  // 添加处理返回的函数
  const handleBackFromOPE = () => {
    setShowOPEGuide(false);
    setHasVisitedOPE(true);
    // 延迟显示 Claim 教程
    setTimeout(() => {
      setShowClaimGuide(true);
    }, 500);
  };

  // 修改监听返回事件
  useEffect(() => {
    // 监听 popstate 事件
    window.addEventListener('popstate', handleBackFromOPE);

    // 也监听 storage 事件作为备选方案
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ope_demo_visited') {
        handleBackFromOPE();
      }
    };
    window.addEventListener('storage', handleStorage);

    // 检查 URL 参数
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'ope_demo') {
      handleBackFromOPE();
    }

    return () => {
      window.removeEventListener('popstate', handleBackFromOPE);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // 添加跳过功能
  const skipToClaimGuide = () => {
    setShowOPEGuide(false);
    setHasVisitedOPE(true);
    setShowClaimGuide(true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black pt-[72px]">
        {/* 演示模式标签 */}
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 
          bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium
          border border-yellow-400/30 backdrop-blur-sm z-50">
          {t('tutorial.demo.mode')}
        </div>

        {/* 教程引导 - 第一步：查看 OPE */}
        <AnimatePresence>
          {!hasVisitedOPE && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed sm:top-32 top-[100px] left-8 sm:left-[15%] 
                bg-[#1a1a1a]/90 backdrop-blur-2xl border border-yellow-400/30
                px-4 sm:px-6 py-4 sm:py-5 rounded-xl text-yellow-400 z-50 
                max-w-[calc(100%-4rem)] sm:max-w-md"
            >
              <h3 className="text-lg font-bold mb-2">{t('tutorial.steps.checkOPE.title')}</h3>
              <p className="text-sm mb-4 text-yellow-200">{t('tutorial.steps.checkOPE.description')}</p>
              <div className="flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/demo/ope')}
                  className="py-2 px-4 bg-yellow-400 hover:bg-yellow-500 
                    text-black rounded-lg font-medium
                    border border-yellow-300/30
                    shadow-lg shadow-yellow-500/20"
                >
                  {t('tutorial.steps.checkOPE.action')}
                </motion.button>
                <button
                  onClick={skipToClaimGuide}
                  className="text-sm text-yellow-400/70 hover:text-yellow-400 
                    underline underline-offset-2"
                >
                  {t('tutorial.common.skip')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 添加 Claim 教程引导 */}
        <AnimatePresence>
          {showClaimGuide && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed sm:top-32 top-[100px] left-8 sm:left-[15%] 
                bg-[#1a1a1a]/90 backdrop-blur-sm border border-yellow-400/30
                px-4 sm:px-6 py-4 sm:py-5 rounded-xl text-yellow-400 z-50 
                max-w-[calc(100%-4rem)] sm:max-w-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">
                  {t('tutorial.steps.claim.title')}
                </h3>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                </div>
              </div>
              <p className="text-sm mb-4">{t('tutorial.steps.claim.description')}</p>
              <div className="flex items-center gap-2 text-sm text-yellow-400/70">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg"
                >
                  ↓
                </motion.div>
                <span>{t('tutorial.steps.claim.hint')}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-lg mx-auto">
            <div className="relative bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-2xl p-6 md:p-8 
              border border-yellow-400/30 overflow-hidden">
              <div 
                className="absolute inset-0 rounded-2xl opacity-5 bg-cover bg-top z-0 blur-sm"
                style={{
                  backgroundImage: 'url(/src/assets/images/nft.png)'
                }}
              />
              
              <div className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center 
                  bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  {t("community.title")}
                </h1>
                <p className="text-gray-400 text-center mb-8">
                  {t("community.subtitle")}
                </p>

                <div className="space-y-4 mb-8">
                  {benefits.map(({ icon, key }) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 text-white/50 
                        p-3 rounded-xl bg-[#1a1a1a]/60 backdrop-blur-2xl border border-yellow-400/20
                        transition-all duration-200 hover:text-white/90
                        shadow-[0_0_15px_rgba(234,179,8,0.1)]
                        relative overflow-hidden"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/60 backdrop-blur-2xl
                        flex items-center justify-center shrink-0 border border-yellow-400/30
                        shadow-[0_0_10px_rgba(234,179,8,0.2)]
                        relative z-10"
                      >
                        <span className="text-xl text-white/70">{icon}</span>
                      </div>
                      
                      <div className="absolute inset-0 backdrop-blur-xl bg-[#1a1a1a]/60" />
                      
                      <span className="text-sm md:text-base font-medium relative z-10 
                        text-white/50 hover:text-white/90 transition-colors duration-200">
                        {t(`benefits.${key}`)}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Claim Button - 只在访问过 OPE 页面后显示 */}
                {hasVisitedOPE ? (
                  <ClaimButton2 
                    walletAddress="0xdemo"
                    isDemoMode={true}
                  />
                ) : (
                  <div className="mb-6">
                    {/* 占位空间，保持布局一致 */}
                    <div className="h-[44px]"></div>
                  </div>
                )}

                {/* Learn More Button - 未访问时高亮显示 */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/demo/ope')}
                  className={`relative mt-6 w-full py-3 px-6 rounded-xl
                    transition-all duration-300
                    flex items-center justify-center gap-2
                    ${!hasVisitedOPE 
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-2 border-yellow-300 shadow-lg shadow-yellow-400/30' 
                      : 'bg-yellow-400/10 hover:bg-yellow-400/20 text-white/80 hover:text-white border border-yellow-400/30'
                    }`}
                >
                  <span>ℹ️</span>
                  <span>{t("community.buttons.learnOPE")}</span>
                  {!hasVisitedOPE && (
                    <>
                      <motion.span
                        className="absolute -right-1 -top-1 w-3 h-3 bg-purple-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.span
                        className="absolute -left-1 -bottom-1 w-3 h-3 bg-purple-400 rounded-full"
                        animate={{ scale: [1.5, 1, 1.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="absolute inset-0 bg-yellow-400/20 rounded-xl blur-xl -z-10" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* 演示模式说明 - 调整颜色和背景 */}
        <div className="fixed bottom-[160px] left-1/2 transform -translate-x-1/2 
          bg-[#1a1a1a]/90 backdrop-blur-2xl border border-yellow-400/30
          px-4 py-2 rounded-lg text-xs text-yellow-400 z-50">
          {!hasVisitedOPE 
            ? t('tutorial.demo.checkOPEFirst')
            : t('tutorial.demo.description')
          }
        </div>

        {/* 退出演示按钮 - 调整位置避开 TabBar */}
        <motion.button
          onClick={() => navigate('/community')}
          className="fixed bottom-[100px] right-4 z-50 px-4 py-2 
            bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 
            hover:from-yellow-400 hover:to-yellow-500
            rounded-lg text-black
            backdrop-blur-sm border border-yellow-400/30 
            shadow-lg shadow-yellow-400/20
            transition-all duration-200
            flex items-center gap-2
            group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <span className="text-base group-hover:scale-110 transition-transform">✖️</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium">{t('tutorial.demo.exit')}</span>
            <span className="text-[10px] opacity-70">{t('tutorial.demo.backToReal')}</span>
          </div>
        </motion.button>
      </div>
    </>
  );
}

export default CommunityDemo; 