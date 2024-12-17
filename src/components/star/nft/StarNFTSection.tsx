import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

export function StarNFTSection() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'benefits' | 'rewards'>('benefits');

  const vipBenefits = {
    vip1: [
      { title: t("OPS Allocation"), value: "50% → $250" },
      { title: t("Trading Fee Discount"), value: "5%" },
      { title: t("Referral Bonus"), value: "5%" },
      { title: t("Access to IDO"), value: t("Basic Priority") }
    ],
    vip2: [
      { title: t("OPS Allocation"), value: "100% → $1000" },
      { title: t("Trading Fee Discount"), value: "10%" },
      { title: t("Referral Bonus"), value: "10%" },
      { title: t("Access to IDO"), value: t("Medium Priority") }
    ],
    vip3: [
      { title: t("OPS Allocation"), value: "300% → $9000" },
      { title: t("Trading Fee Discount"), value: "15%" },
      { title: t("Referral Bonus"), value: "15%" },
      { title: t("Access to IDO"), value: t("High Priority") }
    ],
    vip4: [
      { title: t("OPS Allocation"), value: "700% → $49000" },
      { title: t("Trading Fee Discount"), value: "20%" },
      { title: t("Referral Bonus"), value: "20%" },
      { title: t("Access to IDO"), value: t("VIP Priority") }
    ]
  };

  const vipRewards = {
    vip1: {
      investment: 500,
      opsAllocation: 677,
      tradingRewards: "5% of trading fees",
      referralRewards: "5% of referral's trading fees"
    },
    vip2: {
      investment: 1000,
      opsAllocation: 1354,
      tradingRewards: "10% of trading fees",
      referralRewards: "10% of referral's trading fees"
    },
    vip3: {
      investment: 3000,
      opsAllocation: 4062,
      tradingRewards: "15% of trading fees",
      referralRewards: "15% of referral's trading fees"
    },
    vip4: {
      investment: 7000,
      opsAllocation: 9478,
      tradingRewards: "20% of trading fees",
      referralRewards: "20% of referral's trading fees"
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-12">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-gradient-to-b from-purple-900/40 to-black/40 rounded-t-xl p-4 backdrop-blur-sm border border-purple-500/20"
      >
        <span className="text-lg font-semibold">{t("Star NFT Benefits")}</span>
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
            <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-b-xl border-x border-b border-purple-500/20 p-6">
              {/* 标签切换 */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab('benefits')}
                  className={`px-4 py-2 rounded-lg transition ${
                    activeTab === 'benefits'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-900/30 text-gray-300 hover:bg-purple-900/50'
                  }`}
                >
                  {t("VIP Benefits")}
                </button>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`px-4 py-2 rounded-lg transition ${
                    activeTab === 'rewards'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-900/30 text-gray-300 hover:bg-purple-900/50'
                  }`}
                >
                  {t("Rewards Calculator")}
                </button>
              </div>

              {activeTab === 'benefits' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* VIP 1-4 卡片 */}
                    {Object.entries(vipBenefits).map(([key, benefits], index) => (
                      <div key={key} className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
                        <h3 className="text-xl font-bold mb-4 text-center text-purple-400">
                          VIP {index + 1}
                        </h3>
                        <div className="space-y-4">
                          {benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex}>
                              <p className="text-sm text-gray-400">{benefit.title}</p>
                              <p className="text-lg font-bold text-white">{benefit.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 额外说明 */}
                  <div className="mt-8 p-6 bg-purple-900/20 rounded-xl border border-purple-500/20">
                    <h4 className="text-lg font-semibold mb-4 text-purple-400">
                      {t("Additional Benefits")}
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• {t("Lifetime membership benefits")}</li>
                      <li>• {t("Early access to new features")}</li>
                      <li>• {t("Exclusive community events")}</li>
                      <li>• {t("Special airdrops eligibility")}</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* 奖励计算器卡片 */}
                  {Object.entries(vipRewards).map(([key, rewards], index) => (
                    <div key={key} className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
                      <h3 className="text-xl font-bold mb-4 text-center text-purple-400">
                        VIP {index + 1}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400">{t("Investment")}</p>
                          <p className="text-lg font-bold text-white">${rewards.investment} USDC</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{t("OPS Allocation")}</p>
                          <p className="text-lg font-bold text-white">{rewards.opsAllocation} OPS</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{t("Trading Rewards")}</p>
                          <p className="text-lg font-bold text-white">{rewards.tradingRewards}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{t("Referral Rewards")}</p>
                          <p className="text-lg font-bold text-white">{rewards.referralRewards}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 