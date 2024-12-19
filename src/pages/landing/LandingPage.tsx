import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@/components/auth/ConnectButton';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@headlessui/react';
import { Dialog } from '@headlessui/react';
import { FiArrowRight, FiGlobe, FiLock, FiTrendingUp, FiShield, FiZap, FiInfo, FiArrowLeft } from 'react-icons/fi';
import { claimTo } from "thirdweb/extensions/erc1155";
import { PayEmbed, useActiveAccount, useActiveWallet } from "thirdweb/react";
import client from '@/client';
import { useTranslation } from 'react-i18next';

const USER_NFT_ADDRESS = "0x567F0669dC5280f1704485b1f8E9fd0C9056f3B3";

const TEXTS = {
  en: {
    hero: {
      title: "The Future of Finance is Here",
      subtitle: "Transform your financial journey with Web3 technology. Secure, transparent, and borderless.",
      button: "Start Now"
    },
    features: [
      {
        icon: <FiGlobe className="w-6 h-6 sm:w-8 sm:h-8" />,
        title: "Global Digital Identity",
        description: "Join the worldwide digital revolution with your unique Web3 identity"
      },
      {
        icon: <FiLock className="w-6 h-6 sm:w-8 sm:h-8" />,
        title: "Secure Asset Control",
        description: "Take full control of your digital assets with blockchain technology"
      },
      {
        icon: <FiTrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />,
        title: "Future of Finance",
        description: "Access next-generation financial services and opportunities"
      }
    ],
    wallet: {
      title: "Connect to the Future",
      subtitle: "Choose your preferred wallet to begin your journey",
      features: [
        {
          icon: <FiShield className="w-5 h-5 text-purple-400" />,
          title: "Secure Authentication",
          description: "Bank-grade security for your digital assets"
        },
        {
          icon: <FiZap className="w-5 h-5 text-purple-400" />,
          title: "Instant Access",
          description: "Quick and seamless connection to Web3"
        },
        {
          icon: <FiGlobe className="w-5 h-5 text-purple-400" />,
          title: "Global Compatibility",
          description: "Works with all major wallet providers"
        }
      ],
      security: "Your assets are protected by industry-leading security protocols",
      supported: "Supported Wallets"
    },
    claim: {
      title: "Claim User NFT",
      description: "Claim your User NFT to start your web3 world",
      button: "Claim User NFT",
      claiming: "Claiming..."
    }
  },
  zh: {
    hero: {
      title: "金融未来，就在眼前",
      subtitle: "通过 Web3 技术开启您的金融之旅。安全、透明、无国界。",
      button: "立即开始"
    },
    features: [
      {
        icon: <FiGlobe className="w-6 h-6 sm:w-8 sm:h-8" />,
        title: "全球数字身份",
        description: "加入全球数字革命，拥有独特的 Web3 身份"
      },
      {
        icon: <FiLock className="w-6 h-6 sm:w-8 sm:h-8" />,
        title: "安全资产控制",
        description: "通过区块链技术完全掌控您的数字资产"
      },
      {
        icon: <FiTrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />,
        title: "金融新未来",
        description: "获取下一代金融服务和机遇"
      }
    ],
    wallet: {
      title: "连接未来",
      subtitle: "选择您喜欢的钱包开始旅程",
      features: [
        {
          icon: <FiShield className="w-5 h-5 text-purple-400" />,
          title: "安全认证",
          description: "银行级别的数字资产安全保障"
        },
        {
          icon: <FiZap className="w-5 h-5 text-purple-400" />,
          title: "即时访问",
          description: "快速无缝连接 Web3 世界"
        },
        {
          icon: <FiGlobe className="w-5 h-5 text-purple-400" />,
          title: "全球兼容",
          description: "支持所有主流钱包"
        }
      ],
      security: "您的资产受到行业领先的安全协议保护",
      supported: "支持的钱包"
    },
    claim: {
      title: "领取用户 NFT",
      description: "领取您的用户 NFT，开启 Web3 世界",
      button: "领取用户 NFT",
      claiming: "领取中..."
    }
  }
};

export function LandingPage() {
  const navigate = useNavigate();
  const address = useActiveWallet() as unknown as string;
  const account = useActiveAccount();
  const [showWeb3, setShowWeb3] = useState(false);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [lang, setLang] = useState('en');
  const texts = TEXTS[lang as keyof typeof TEXTS];

  const handleClaimSuccess = () => {
    navigate('/landing');
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleConnect = () => {
    setShowClaimDialog(true);
  };

  useEffect(() => {
    if (account) {
      navigate('/landing');
    }
  }, [account, navigate]);

  useEffect(() => {
    if (address) {
      navigate('/home');
    }
  }, [address, navigate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900 via-black to-black relative overflow-hidden">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/20 transition-colors"
        onClick={toggleLanguage}
      >
        <FiGlobe className="w-6 h-6" />
      </motion.button>

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" />
      </div>

      <AnimatePresence mode="wait">
        {!showWeb3 ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-8 sm:px-12 lg:px-16 py-16 sm:py-32 relative z-10"
          >
            <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24">
              <motion.img
                src="/src/assets/logos/logo-white.png"
                alt="Logo"
                className="h-12 sm:h-16 md:h-20 w-auto mx-auto mb-6 sm:mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              />
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight"
              >
                {texts.hero.title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 px-4"
              >
                {texts.hero.subtitle}
              </motion.p>
              <div className="flex justify-center mt-12">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWeb3(true)}
                  className="relative group px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg transition-all duration-300 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <span>{texts.hero.button}</span>
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl group-hover:opacity-75 transition-opacity" />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-[1000px] mx-auto px-4">
              {TEXTS[lang as keyof typeof TEXTS].features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-gradient-to-b from-purple-900/40 to-black/40 p-6 sm:p-8 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="text-purple-400 mb-3 sm:mb-4">{feature.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="connect"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="container mx-auto px-8 sm:px-12 lg:px-16 py-16 sm:py-32 relative z-10"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowWeb3(false)}
              className="absolute top-6 sm:top-8 left-6 sm:left-8 p-2 rounded-full bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/20 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-16"
              >
                <div className="flex flex-col items-center gap-4">
                  <motion.img
                    src="/src/assets/logos/logo-white.png"
                    alt="Logo"
                    className="h-12 sm:h-16 md:h-20 w-auto"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {TEXTS[lang as keyof typeof TEXTS].wallet.title}
                  </h2>
                  <p className="text-gray-400 text-lg">
                    {TEXTS[lang as keyof typeof TEXTS].wallet.subtitle}
                  </p>
                </div>
              </motion.div>

              <div className="flex flex-col items-center gap-8 sm:gap-10">
                <div className="w-full max-w-lg mx-auto px-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-b from-purple-900/40 to-black/40 p-6 sm:p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 shadow-xl"
                  >
                    <ConnectButton />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-[1000px] mx-auto px-4"
                >
                  {TEXTS[lang as keyof typeof TEXTS].wallet.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-gradient-to-b from-purple-900/40 to-black/40 p-4 rounded-lg backdrop-blur-sm border border-purple-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-900/50 rounded-lg">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">
                            {feature.title}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="w-full max-w-2xl mx-auto px-4"
                >
                  <p className="text-sm text-gray-300 flex items-center gap-2">
                    <FiInfo className="shrink-0" />
                    <span>
                      {TEXTS[lang as keyof typeof TEXTS].wallet.security}
                    </span>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClaimDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <Dialog.Panel className="w-full max-w-md bg-gradient-to-b from-purple-900/80 to-black/80 p-6 sm:p-8 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-purple-500/20 shadow-2xl">
                <PayEmbed
                  client={client}
                  payOptions={{
                    mode: "transaction",
                    transaction: claimTo({
                      contract: USER_NFT_ADDRESS as any,
                      quantity: 1n,
                      tokenId: 0n,
                      to: address || '',
                    }),
                    metadata: {
                      name: "User NFT",
                      image: "https://example.com/user-nft.png",
                    },
                    onPurchaseSuccess: handleClaimSuccess,
                    buyWithCrypto: {
                      testMode: false,
                      prefillSource: {
                        chain: {
                          rpc: "https://mainnet.optimism.io",
                          id: 10,
                        },
                        token: {
                          name: "USD Coin",
                          address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                          symbol: "USDC",
                        },
                      },
                    },
                  }}
                />

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Dialog.Title className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {TEXTS[lang as keyof typeof TEXTS].claim.title}
                  </Dialog.Title>
                  <Dialog.Description className="text-center text-gray-300 mb-8">
                    {TEXTS[lang as keyof typeof TEXTS].claim.description}
                  </Dialog.Description>
                </motion.div>
              </Dialog.Panel>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 