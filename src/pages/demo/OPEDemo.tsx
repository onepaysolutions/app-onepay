import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { IoArrowBack } from "react-icons/io5";
import { OPEInfo } from "@/components/community/ope/OPEInfo";
import { OPEChart } from "@/components/community/ope/OPEChart";
import { FlowingLiquidityChart } from "@/components/community/charts/FlowingLiquidityChart";
import styles from '@/styles/demo.module.css';

const ALLOCATION_DATA = [
  { name: 'Operations', value: 30, color: '#8B5CF6' },
  { name: 'Node', value: 10, color: '#7C3AED' },
  { name: 'Planning & Risk Control', value: 10, color: '#6D28D9' },
  { name: 'Management', value: 10, color: '#5B21B6' },
  { name: 'Node Promotion', value: 10, color: '#4C1D95' },
  { name: 'Market Rewards', value: 10, color: '#6366F1' },
  { name: 'Liquidity Pool', value: 10, color: '#4F46E5' },
  { name: 'Technical Development', value: 10, color: '#4338CA' }
];

export function OPEDemo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showReturnGuide, setShowReturnGuide] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [showStepGuide, setShowStepGuide] = useState(true);

  // 每5秒自动切换到下一部分
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSection(prev => (prev < 5 ? prev + 1 : prev));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // 添加步骤提示文本
  const stepDescriptions = [
    t('tutorial.steps.ope.benefits'),
    t('tutorial.steps.ope.priceChart'),
    t('tutorial.steps.ope.allocation'),
    t('tutorial.steps.ope.liquidity'),
    t('tutorial.steps.ope.price')
  ];

  // 添加价格和供应量的动画状态
  const [currentPrice, setCurrentPrice] = useState(0.1);
  const [nextPrice, setNextPrice] = useState(1.5);
  const [totalSupply, setTotalSupply] = useState(300000);

  // 添加数字动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => prev + 0.001);
      setNextPrice(prev => prev + 0.002);
      setTotalSupply(prev => prev + 10);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 添加 USDT 总量的状态
  const [totalUSDT, setTotalUSDT] = useState(1000);

  // 添加 USDT 数字的持续增长效果
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalUSDT(prev => prev + Math.random() * 5); // 随机增加 0-5 的数值
    }, 1000); // 每秒更新一次

    return () => clearInterval(interval);
  }, []);

  // 移除原有的 setTimeout
  // 改为监听 activeSection 变化
  useEffect(() => {
    if (activeSection === 5) { // 只在显示代币分配部分时显示返回提示
      const timer = setTimeout(() => {
        setShowReturnGuide(true);
      }, 2000); // 延迟2秒显示返回提示

      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  // 添加重新打开提示卡的函数
  const reopenGuides = () => {
    setShowStepGuide(true);
    if (activeSection === 5) {
      setShowReturnGuide(true);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black pt-[72px]">
        {/* 演示模式标签 - 添加点击功能 */}
        <motion.div
          onClick={reopenGuides}
          className={`${styles.demoTag} cursor-pointer hover:bg-yellow-400/30 transition-colors`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('tutorial.demo.mode')}
        </motion.div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* 返回按钮和标题 */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/demo/community")}
              className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 
                transition-colors border border-purple-600/20"
              title={t("common.back")}
            >
              <IoArrowBack className="w-6 h-6 text-purple-400" />
            </button>
          
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 
              bg-clip-text text-transparent">
              {t("ope.title")}
            </h1>
          </div>

          {/* 内容部分 - 调整顺序 */}
          <div className="space-y-8">
            {/* 第一部分：Angel NFT 权益 */}
            <AnimatePresence>
              {activeSection >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.contentSection}
                >
                  <OPEInfo />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 第二��分：当前价格和预测 */}
            <AnimatePresence>
              {activeSection >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.contentSection}
                >
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r 
                    from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    {t("Price Information")}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-600/10 rounded-xl p-4 border border-purple-600/20">
                      <p className="text-sm text-purple-400 mb-1">{t("Current Price")}</p>
                      <p className="text-xl font-bold text-purple-100">
                        {currentPrice.toFixed(3)} USDT
                      </p>
                    </div>
                    <div className="bg-purple-600/10 rounded-xl p-4 border border-purple-600/20">
                      <p className="text-sm text-purple-400 mb-1">{t("Next Price")}</p>
                      <p className="text-xl font-bold">
                        {nextPrice.toFixed(2)} USDT
                      </p>
                    </div>
                    <div className="col-span-2 bg-purple-600/10 rounded-xl p-4 border border-purple-600/20">
                      <p className="text-sm text-purple-400 mb-1">{t("Total Supply")}</p>
                      <p className="text-xl font-bold">
                        {totalSupply.toLocaleString()} OPE
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 第三部分：预测价格图表 */}
            <AnimatePresence>
              {activeSection >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.contentSection}
                >
                  <OPEChart />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 第四部分：流动性池 - 修改为动态数值 */}
            <AnimatePresence>
              {activeSection >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.contentSection}
                >
                  <h2 className={styles.sectionTitle}>
                    {t("Liquidity Pool")}
                  </h2>
                  <FlowingLiquidityChart totalUSDT={totalUSDT} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 第五部分：代币分配 */}
            <AnimatePresence>
              {activeSection >= 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.contentSection}
                >
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r 
                    from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    {t("Token Allocation")}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {ALLOCATION_DATA.map((item) => (
                      <div 
                        key={item.name}
                        className="bg-purple-600/10 rounded-xl p-4 border border-purple-600/20
                          hover:bg-purple-600/20 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <p className="text-sm text-purple-100">{t(item.name)}</p>
                        </div>
                        <p className="text-xl font-bold text-purple-400">{item.value}%</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 步骤提示卡片 */}
        <AnimatePresence>
          {showStepGuide && activeSection < 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.guideCard}
            >
              <button
                onClick={() => setShowStepGuide(false)}
                className={styles.closeButton}
              >
                <span className="text-lg">×</span>
              </button>
              <div className="text-[10px] text-yellow-400/50 absolute top-2 left-2">
                {t('tutorial.demo.clickToReopen')}
              </div>
              <div className="flex items-center justify-between mb-3">
                <h3 className={styles.cardTitle}>
                  {t('tutorial.steps.ope.title')} {activeSection}/5
                </h3>
                <div className={styles.stepIndicator}>
                  {[1, 2, 3, 4, 5].map(step => (
                    <div
                      key={step}
                      className={`${styles.stepDot} ${
                        step === activeSection
                          ? styles.stepDotActive
                          : step < activeSection
                          ? styles.stepDotCompleted
                          : styles.stepDotInactive
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className={styles.cardDescription}>
                {stepDescriptions[activeSection - 1]}
              </p>
              <p className={styles.cardHint}>
                {t('tutorial.steps.ope.autoProgress')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 滑动提示 - 在返回提示出现前显示 */}
        <AnimatePresence>
          {activeSection < 5 && !showReturnGuide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.scrollHint}
            >
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-lg sm:text-xl"
              >
                ↓
              </motion.div>
              <span>{t('tutorial.demo.scrollToExplore')}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 返回引导提示 */}
        <AnimatePresence>
          {showReturnGuide && activeSection === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.guideCard}
            >
              <button
                onClick={() => setShowReturnGuide(false)}
                className={styles.closeButton}
              >
                <span className="text-lg">×</span>
              </button>
              <div className="text-[10px] text-yellow-400/50 absolute top-2 left-2">
                {t('tutorial.demo.clickToReopen')}
              </div>
              <h3 className={styles.cardTitle}>
                {t('tutorial.steps.backToClaim.title')}
              </h3>
              <p className={styles.cardDescription}>
                {t('tutorial.steps.backToClaim.description')}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/demo/community?from=ope_demo')}
                className={styles.actionButton}
              >
                <IoArrowBack />
                {t('tutorial.steps.backToClaim.action')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 添加紫色装饰元素 */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
        </div>
      </div>
    </>
  );
}

export default OPEDemo; 