export interface StarNFTConfig {
  id: number;
  name: string;
  usdcDistribution: {
    referralReward: number;  // 推广奖励比例
    opsPresale: number;      // OPS预售参与比例
    opeBuyback: number;      // OPE回购比例 (固定5%)
  };
  contractValue: number;     // 合约价值
  releaseThreshold: number;  // 释放阈值
  airdropRate: number;      // 空投比例 (50%)
  maxTiers: number;         // 最大层级数
  pairTiers: number;        // 配对层级数
}

export interface PreSaleCycle {
  id: number;
  startPrice: number;        // 周期起始价格
  stages: {
    price: number;           // 每阶段价格
    amount: number;          // 每阶段销售数量
  }[];
}

// StarNFT类型配置
export const starNFTTypes: StarNFTConfig[] = [
  {
    id: 1,
    name: "Bronze Star",
    usdcDistribution: {
      referralReward: 0.15,  // 15%
      opsPresale: 0.80,      // 80%
      opeBuyback: 0.05       // 5%
    },
    contractValue: 1000,
    releaseThreshold: 2000,
    airdropRate: 0.5,
    maxTiers: 3,            // 3层推荐奖励
    pairTiers: 2            // 2层配对奖励
  },
  {
    id: 2,
    name: "Silver Star",
    usdcDistribution: {
      referralReward: 0.15,
      opsPresale: 0.80,
      opeBuyback: 0.05
    },
    contractValue: 3000,
    releaseThreshold: 6000,
    airdropRate: 0.5,
    maxTiers: 4,
    pairTiers: 3
  },
  {
    id: 3,
    name: "Gold Star",
    usdcDistribution: {
      referralReward: 0.15,
      opsPresale: 0.80,
      opeBuyback: 0.05
    },
    contractValue: 5000,
    releaseThreshold: 10000,
    airdropRate: 0.5,
    maxTiers: 5,
    pairTiers: 4
  }
];

// 预售周期配置
export const preSaleCycles: PreSaleCycle[] = [
  {
    id: 1,
    startPrice: 0.3,
    stages: Array(20).fill(null).map((_, index) => ({
      price: 0.3 * (1 + 0.05 * index),  // 每阶段价格上涨5%
      amount: 100000                     // 每阶段销售数量
    }))
  }
];

// 常量配置
export const CONSTANTS = {
  STAGES_PER_CYCLE: 20,
  AIRDROP_RATE: 0.5,
  OPE_BUYBACK_RATE: 0.05,
  REFERRAL_REWARD_RATES: {
    TIER1: 0.5,    // 一级推荐获得50%
    TIER2: 0.3,    // 二级推荐获得30%
    TIER3: 0.2     // 三级推荐获得20%
  },
  PAIR_REWARD_RATES: {
    TIER1: 0.6,    // 一级配对获得60%
    TIER2: 0.4     // 二级配对获得40%
  }
}; 