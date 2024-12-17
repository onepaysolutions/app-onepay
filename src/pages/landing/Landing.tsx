import { useTranslation } from "react-i18next";
import { useActiveAccount } from "thirdweb/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoRocketOutline, IoStarOutline, IoShareSocialOutline, IoWalletOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { RiGovernmentLine } from "react-icons/ri";
import logoWhite from "@/assets/logos/logo-white.png";
import { ConnectButton } from "@/components/auth/ConnectButton";
import { mockData } from "@/mock/data";
import { Header } from '@/components/common/layout/Header';

export function Landing() {
  const { t } = useTranslation();
  const address = useActiveAccount();

  const features = [
    {
      icon: <IoRocketOutline className="w-8 h-8" />,
      title: t("Launch"),
      description: t("Be part of the next generation of decentralized finance"),
    },
    {
      icon: <IoStarOutline className="w-8 h-8" />,
      title: t("Star NFT"),
      description: t("Unlock exclusive benefits with our Star NFT collection"),
    },
    {
      icon: <IoShareSocialOutline className="w-8 h-8" />,
      title: t("Community"),
      description: t("Join our growing community of DeFi enthusiasts"),
    },
  ];

  const stats = [
    {
      icon: <FaUsers className="w-6 h-6" />,
      value: mockData.community.totalMembers.toLocaleString(),
      label: "Community",
    },
    {
      icon: <IoWalletOutline className="w-6 h-6" />,
      value: `$${(mockData.referral.zones.reduce((acc, zone) => acc + zone.performance, 0)).toLocaleString()}`,
      label: "Total Referral",
    },
    {
      icon: <RiGovernmentLine className="w-6 h-6" />,
      value: mockData.community.totalVotes.toLocaleString(),
      label: "Governance Votes",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14">
        {/* 背景动画 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/50 to-black" />
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-600/20 to-transparent blur-3xl transform -translate-y-1/2" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.img
            src={logoWhite}
            alt="Logo"
            className="w-32 h-32 mx-auto mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t("Welcome to OnePay")}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t("Your gateway to the future of decentralized finance")}
          </motion.p>

          {/* 统计数据 */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
              >
                <div className="text-purple-400 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {!address ? (
              <ConnectButton />
            ) : (
              <Link
                to="/star-nft"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20"
              >
                {t("Launch App")}
              </Link>
            )}
          </motion.div>
        </div>

        {/* 向下滚动提示 */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="text-gray-400 text-sm">Scroll Down</div>
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-transparent mx-auto mt-2 rounded-full" />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {t("Core Features")}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t("Explore OnePay's innovative features and embark on your Web3 journey")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:scale-105"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index }}
              >
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
