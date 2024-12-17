// Star NFT 等级配置
export interface StarNFTLevel {
  id: number;
  nameKey: string;
  price: string;
  returnRate: string;
  opsHolding: string;
  ownLevels: number;
  benefitsKey: string;
}

// NFT 数据配置
export const NFT_DATA: StarNFTLevel[] = [
  {
    id: 0,
    nameKey: "starNFT.vipLevels.star1.name",
    price: "500",
    returnRate: "500",
    opsHolding: "1000",
    ownLevels: 3,
    benefitsKey: "starNFT.vipLevels.star1.benefits"
  },
  // ... 其他配置保持不变
];

// 周期价格配置
export const CYCLE_PRICES: Record<number, string> = {
  1: "0.30",
  2: "0.32",
  3: "0.34",
  4: "0.36"
};

// OPS 预售配置
export const OPS_PRESALE = {
  cycle: 1,
  stage: 1,
  currentPrice: "0.30",
  nextPrice: "0.31",
  soldAmount: "0",
  stageAmount: "100000",
  totalStages: 20,
  totalAmount: "2000000"
}; 