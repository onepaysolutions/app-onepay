import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveAccount } from 'thirdweb/react';
import { motion } from 'framer-motion';
import { ClaimStarNFTButton } from '@/components/nft/ClaimStarNFTButton';
import { NFTBadge } from '@/components/star/nft/NFTBadge';
import { CONTRACT_ADDRESSES } from "@/constants/contracts";
import { ReleaseNFTsList } from '@/components/star/nft/ReleaseNFTsList';
import { ConnectButton } from '@/components/auth/ConnectButton';
import { Header } from '@/components/layout/Header';
import { useNavigate } from 'react-router-dom';

// OPS 预售配置
const OPS_PRESALE = {
  cycle: 1,
  stage: 1,
  minAmount: 100,
  maxAmount: 10000,
  stagesPerCycle: 20,
  priceIncreasePerAmount: 100000,
  airdropRatio: 50,
  currentStageAmount: 45000,
  totalStageAmount: 100000
};

// NFT 等级配置
const NFT_LEVELS = [
  {
    id: 1,
    price: 500,
    presaleValue: 250,
    contractValue: 1250,
    maxTiers: 3,
    pairTiers: 5,
    benefits: [
      '3 Tier Reward',
      'Presale Value X 500%'
    ],
    allocation: {
      presale: 50,
      rewards: 32,
      opeBuyback: 5,
      opsPool: 13
    }
  },
  {
    id: 2,
    price: 1000,
    presaleValue: 550,
    contractValue: 3300,
    maxTiers: 8,
    pairTiers: 5,
    benefits: [
      '8 Tier Reward',
      'Presale Value X 600%',
      'Pair Tier Reward 5%'
    ],
    allocation: {
      presale: 55,
      rewards: 32,
      opeBuyback: 5,
      opsPool: 7
    }
  },
  {
    id: 3,
    price: 3000,
    presaleValue: 1800,
    contractValue: 12600,
    maxTiers: 13,
    pairTiers: 8,
    benefits: [
      '13 Tier Reward',
      'Presale Value X 700%',
      'Pair Tier Reward 8%'
    ],
    allocation: {
      presale: 60,
      rewards: 32,
      opeBuyback: 5,
      opsPool: 3
    }
  },
  {
    id: 4,
    price: 7000,
    presaleValue: 4450,
    contractValue: 26400,
    maxTiers: 20,
    pairTiers: 10,
    benefits: [
      '20 Tier Reward',
      'Presale Value X 800%',
      'Pair Tier Reward 10%'
    ],
    allocation: {
      presale: 65,
      rewards: 30,
      opeBuyback: 5,
      opsPool: 0
    }
  }
];

export function StarNFT() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [activeTab, setActiveTab] = useState<'claim' | 'active' | 'release'>('claim');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isPresaleExpanded, setIsPresaleExpanded] = useState(true);
  const [showStageDetails, setShowStageDetails] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number>(0.3);
  const [nextPrice, setNextPrice] = useState<number>(0.31);
  const navigate = useNavigate();

  // 计算选中等级的 OPS 数量
  const calculateOpsAmount = useCallback((level: typeof NFT_LEVELS[number]) => {
    if (!level) return 0;
    return Math.floor(level.presaleValue / currentPrice);
  }, [currentPrice]);

  // 更新价格的函数
  const updatePrice = useCallback((newPrice: number) => {
    setCurrentPrice(newPrice);
    setNextPrice(newPrice + 0.01);
  }, []);

  // 在展开的卡片中显示 OPS 数量
  const renderExpandedCardContent = useCallback((level: typeof NFT_LEVELS[number], index: number) => {
    const opsAmount = calculateOpsAmount(level);
    return (
      <motion.div
        initial={false}
        animate={{ 
          height: expandedCard === index ? 'auto' : 0,
          opacity: expandedCard === index ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden border-t border-purple-500/20"
      >
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-1.5 text-sm">
            <div className="bg-black/20 p-2 rounded">
              <p className="text-xs text-gray-400">OPS Amount</p>
              <p className="font-medium">{opsAmount.toLocaleString()} OPS</p>
              <p className="text-xs text-gray-400 mt-1">at ${currentPrice.toFixed(2)}/OPS</p>
            </div>
            <div className="bg-black/20 p-2 rounded">
              <p className="text-xs text-gray-400">Contract Value</p>
              <p className="font-medium">${level.contractValue.toLocaleString()}</p>
            </div>
          </div>

          {/* 权益列表 */}
          <div className="text-left">
            <p className="text-xs text-gray-400 mb-2">Benefits</p>
            <ul className="text-xs space-y-1.5">
              {level.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="min-w-[20px] text-purple-400">{i + 1})</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    );
  }, [expandedCard, calculateOpsAmount, currentPrice]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-[72px]">
        <div className="max-w-7xl mx-auto">
          {/* 标题部分 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("starNFT.title")}</h1>
            <p className="text-gray-400">{t("starNFT.subtitle")}</p>
          </div>

          {/* OPS 预售信息卡片 - 添加折叠功能 */}
          <div className="bg-gradient-to-b from-purple-900/30 to-black/30 rounded-xl backdrop-blur-sm border border-purple-500/20 mb-8">
            <div 
              className="p-6 border-b border-purple-500/20 cursor-pointer"
              onClick={() => setIsPresaleExpanded(!isPresaleExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    OPS Presale
                  </h2>
                  <span className="px-3 py-1 bg-purple-500/20 rounded-full text-xs font-medium text-purple-300">
                    Phase {OPS_PRESALE.cycle}.{OPS_PRESALE.stage}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: isPresaleExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-purple-400"
                >
                  ▼
                </motion.span>
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{ 
                height: isPresaleExpanded ? 'auto' : 0,
                opacity: isPresaleExpanded ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {/* 预售数网格 */}
              <div className="grid grid-cols-2 md:grid-cols-4 p-6 gap-6">
                {/* 当前周期 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">Current Cycle</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{OPS_PRESALE.cycle}</p>
                  <div className="text-xs text-gray-500">
                    <p>20 Stages per Cycle</p>
                    <p>50% Airdrop at End</p>
                  </div>
                </div>

                {/* 当前阶段 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">Current Stage</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{OPS_PRESALE.stage}</p>
                  <p className="text-xs text-gray-500">Stage {OPS_PRESALE.stage} of {OPS_PRESALE.stagesPerCycle}</p>
                </div>

                {/* 当前价格 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">Current Price</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="currentPriceInput" className="text-sm text-gray-400">Current Price</label>
                    <input
                      id="currentPriceInput"
                      type="number"
                      value={currentPrice}
                      onChange={(e) => updatePrice(Math.max(0.01, Number(e.target.value)))}
                      step="0.01"
                      min="0.01"
                      className="w-24 bg-purple-900/20 border border-purple-500/20 rounded px-2 py-1 text-white"
                    />
                    <p className="text-2xl font-bold text-white">USD</p>
                  </div>
                  <p className="text-xs text-gray-500">+$0.01 per 100K OPS</p>
                </div>

                {/* 下一阶段价格 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">Next Price</p>
                  </div>
                  <p className="text-2xl font-bold text-white">${nextPrice.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">After {OPS_PRESALE.priceIncreasePerAmount.toLocaleString()} OPS</p>
                </div>
              </div>

              {/* 进度条和说明 */}
              <div className="p-6 border-t border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">Stage Progress</p>
                  <p className="text-sm text-purple-400">
                    {Math.round((OPS_PRESALE.currentStageAmount / OPS_PRESALE.totalStageAmount) * 100)}% Completed
                  </p>
                </div>
                <div className="w-full h-2 bg-purple-900/40 rounded-full mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${(OPS_PRESALE.currentStageAmount / OPS_PRESALE.totalStageAmount) * 100}%` }}
                  />
                </div>
                
                {/* Active 条件说明 */}
                <div className="mb-6 p-4 bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="text-purple-400 font-medium">Active Condition:</span> To maintain Active status, 
                    your total OPS value (Presale + Airdrop + Rewards) at current price must not exceed contract value.
                  </p>
                </div>
              </div>

              {/* 添加查询阶段详情按钮 */}
              <div className="px-6 pb-6 flex gap-4">
                <button
                  onClick={() => setShowStageDetails(true)}
                  className="flex-1 bg-purple-900/30 text-purple-300 py-2 rounded-lg font-medium hover:bg-purple-900/50 transition-colors"
                >
                  {t("View All Stages")}
                </button>
                <button
                  onClick={() => navigate('/ops/calculator')}
                  className="flex-1 bg-purple-900/30 text-purple-300 py-2 rounded-lg font-medium hover:bg-purple-900/50 transition-colors"
                >
                  {t("Airdrop Calculator")}
                </button>
              </div>
            </motion.div>
          </div>

          {/* 阶段详情模态框 */}
          {showStageDetails && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-b from-purple-900/30 to-black/30 rounded-xl backdrop-blur-sm border border-purple-500/20 w-full max-w-4xl max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-purple-500/20 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">Presale Stages</h3>
                    <p className="text-sm text-gray-400 mt-1">Current Cycle: {OPS_PRESALE.cycle}</p>
                  </div>
                  <button 
                    onClick={() => setShowStageDetails(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                  <div className="grid gap-4">
                    {/* 在这里添加阶段详情 */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 标签页导航 */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('claim')}
              className={`px-6 py-3 rounded-lg transition-colors text-base font-medium
                ${activeTab === 'claim' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-900/20 text-gray-300 hover:bg-purple-900/40'}`
              }
            >
              Claim NFT to Earn
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 rounded-lg transition-colors text-base font-medium
                ${activeTab === 'active' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-900/20 text-gray-300 hover:bg-purple-900/40'}`
              }
            >
              Actived NFTs
            </button>
            <button
              onClick={() => setActiveTab('release')}
              className={`px-6 py-3 rounded-lg transition-colors text-base font-medium
                ${activeTab === 'release' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-900/20 text-gray-300 hover:bg-purple-900/40'}`
              }
            >
              Release NFTs
            </button>
          </div>

          {/* 内容区域 */}
          <div className="space-y-8">
            {activeTab === 'claim' ? (
              <div className="max-w-5xl mx-auto">
                <div className="bg-purple-900/20 rounded-xl p-8 backdrop-blur-sm border border-purple-500/20">
                  <h3 className="text-2xl font-bold text-center mb-6">
                    {t("starNFT.claim.title")}
                  </h3>
                  <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
                    {t("starNFT.claim.description")}
                  </p>
                  
                  {/* NFT 等级选择 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {NFT_LEVELS.map((level, index) => (
                      <motion.div
                        key={index}
                        className={`
                          rounded-xl border transition-all cursor-pointer
                          ${selectedLevel === index
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                            : 'bg-purple-900/20 border-purple-500/20 text-gray-300 hover:bg-purple-900/40'
                          }
                        `}
                      >
                        {/* 卡片体 - 可点击部分 */}
                        <div 
                          onClick={() => setSelectedLevel(index)}
                          className="p-4"
                        >
                          <div className="flex flex-col space-y-3">
                            {/* NFT 徽章 */}
                            <div className="flex justify-center py-2">
                              <div className="w-16 h-16 sm:w-20 sm:h-20">
                                <NFTBadge level={index + 1} size={80} />
                              </div>
                            </div>
                            
                            {/* 标题 */}
                            <h4 className="text-lg font-bold text-center">
                              STAR {index + 1}
                            </h4>
                            
                            {/* 基本信息 */}
                            <div className="grid grid-cols-2 gap-1.5 text-sm">
                              <div className="bg-black/20 p-2 rounded">
                                <p className="text-xs text-gray-400">Investment</p>
                                <p className="font-medium">${level.price}</p>
                              </div>
                              <div className="bg-black/20 p-2 rounded">
                                <p className="text-xs text-gray-400">OPS Amount</p>
                                <p className="font-medium">{calculateOpsAmount(level).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 开/收起按钮 */}
                        <button
                          onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                          className="w-full px-4 py-2 border-t border-purple-500/20 text-xs flex items-center justify-center gap-1 hover:bg-purple-600/20 transition-colors"
                        >
                          {expandedCard === index ? 'Hide Details' : 'Show Details'}
                          <motion.span
                            animate={{ rotate: expandedCard === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            ▼
                          </motion.span>
                        </button>

                        {renderExpandedCardContent(level, index)}
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Claim 按钮 */}
                  <div className="max-w-md mx-auto">
                    {account ? (
                      <ClaimStarNFTButton 
                        walletAddress={account.address}
                        tokenId={selectedLevel}
                        nftTypeId={selectedLevel + 1}
                        price={NFT_LEVELS[selectedLevel]?.price || 0}
                      />
                    ) : (
                      <ConnectButton />
                    )}
                  </div>
                </div>
              </div>
            ) : activeTab === 'active' ? (
              // Active NFTs 列表 - 这部分需要单独实现
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Active NFTs 将在这里显示 */}
              </div>
            ) : (
              account ? (
                <ReleaseNFTsList walletAddress={account.address} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">{t("Please connect your wallet to view released NFTs")}</p>
                  <ConnectButton />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StarNFT; 