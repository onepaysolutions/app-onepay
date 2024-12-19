import { useEffect, useState } from 'react';
import { useActiveWallet } from "thirdweb/react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { IoRocketOutline, IoStarOutline, IoShareSocialOutline, IoLanguageOutline } from "react-icons/io5";
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/layout/TabBar';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' }
];

const features = [
  {
    icon: <IoRocketOutline className="w-8 h-8" />,
    title: "Launch Your Journey",
    description: "Start your DeFi journey with our Star NFTs",
    link: '/star-nft'
  },
  {
    icon: <IoStarOutline className="w-8 h-8" />,
    title: "Earn Rewards", 
    description: "Stake your NFTs to earn passive income",
    link: '/community'
  },
  {
    icon: <IoShareSocialOutline className="w-8 h-8" />,
    title: "Join Community",
    description: "Connect with other DeFi enthusiasts",
    link: '/profile'
  }
];

// 多语言内容配置
const content = {
  en: {
    hero: {
      title: "Welcome to OnePay",
      subtitle: "The next generation DeFi platform for earning rewards through NFTs"
    },
    actions: {
      getStarted: "Get Started",
      explore: "Explore Community"
    },
    features: [
      {
        title: "Launch Your Journey",
        description: "Start your DeFi journey with our Star NFTs"
      },
      {
        title: "Earn Rewards",
        description: "Stake your NFTs to earn passive income"
      },
      {
        title: "Join Community",
        description: "Connect with other DeFi enthusiasts"
      }
    ],
    stats: {
      tvl: "Total Value Locked",
      users: "Active Users",
      nfts: "NFTs Minted"
    }
  },
  zh: {
    hero: {
      title: "欢迎来到 OnePay",
      subtitle: "通过 NFT 赚取收益的下一代 DeFi 平台"
    },
    actions: {
      getStarted: "开始使用",
      explore: "探索社区"
    },
    features: [
      {
        title: "开启旅程",
        description: "通过 Star NFT 开启您的 DeFi 之旅"
      },
      {
        title: "赚取收益",
        description: "质押 NFT 获得被动收入"
      },
      {
        title: "加入社区",
        description: "与其他 DeFi 爱好者建立联系"
      }
    ],
    stats: {
      tvl: "总锁仓价值",
      users: "活跃用户",
      nfts: "已铸造 NFT"
    }
  }
};

export function Home() {
  const wallet = useActiveWallet();
  const navigate = useNavigate();
  const [showLanguages, setShowLanguages] = useState(false);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const t = content[lang];

  useEffect(() => {
    if (!wallet) {
      navigate('/');
    }
  }, [wallet, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black">
      <Header />
      
      {/* 语言切换按钮 */}
      <div className="fixed top-20 right-4 z-50">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowLanguages(!showLanguages)}
          >
            <IoLanguageOutline className="w-4 h-4" />
            {lang === 'en' ? 'Language' : '语言'}
          </Button>

          {showLanguages && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-40 py-2 bg-black/90 backdrop-blur-sm rounded-lg border border-purple-500/20 shadow-lg"
            >
              <button
                onClick={() => {
                  setLang('en');
                  setShowLanguages(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-500/20 transition-colors"
              >
                English
              </button>
              <button
                onClick={() => {
                  setLang('zh');
                  setShowLanguages(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-500/20 transition-colors"
              >
                中文
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pt-[72px] pb-24">
        {/* Hero Section */}
        <div className="relative min-h-[calc(100vh-300px)] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {t.hero.title}
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate('/star-nft')}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
              >
                {t.actions.getStarted}
              </Button>
              <Button
                onClick={() => navigate('/community')}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-500/10"
              >
                {t.actions.explore}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                onClick={() => navigate(features[index].link)}
                className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 
                  hover:border-purple-500/40 cursor-pointer transition-all duration-300 
                  transform hover:scale-105 hover:bg-purple-900/30"
              >
                <div className="text-purple-400 mb-4">{features[index].icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="mt-12 p-6 bg-purple-900/20 rounded-xl border border-purple-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">$1.2M+</div>
              <div className="text-gray-400">{t.stats.tvl}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">12K+</div>
              <div className="text-gray-400">{t.stats.users}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">5K+</div>
              <div className="text-gray-400">{t.stats.nfts}</div>
            </div>
          </div>
        </motion.div>
      </div>
      <TabBar />
    </div>
  );
}
