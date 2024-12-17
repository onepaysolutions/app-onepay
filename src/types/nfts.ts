export interface StarNFTAllocation {
    presale: number;
    rewards: number;
    opeBuyback: number;
    opsPool: number;
  }
  
  export interface StarNFTLevel {
    id: number;
    price: number;
    presaleValue: number;
    opsAllocation: number;
    rewardLevels: number;
    contractValue: number;
    benefits: string[];
    allocation: StarNFTAllocation;
  }
  
  export interface ActiveNFT {
    id: number;
    level: number;
    presaleOPS: number;
    airdropOPS: number;
    rewardsOPS: number;
    currentPrice: number;
    contractValue: number;
    status: 'active' | 'release';
  }
  
  export interface ReleaseNFT {
    id: string;
    level: number;
    totalOPS: number;
    userReleaseRatio: number; // 0-70%
    platformLiquidityRatio: number; // 10%
    platformBuybackRatio: number; // 5%
    opsReleaseRatio: number; // 15%
    cycleStartPrice: number;
  }
  
  export interface ReleaseCalculation {
    userUSDC: number;
    userOPS: number;
    platformLiquidityUSDC: number;
    platformLiquidityOPS: number;
    platformBuybackUSDC: number;
    opsRelease: number;
  }
  
  export type NFTStatus = 'active' | 'release' | 'burned';
  
  export type PresaleStageStatus = 'upcoming' | 'active' | 'completed';
  
  export type TransactionStatus = 'pending' | 'completed' | 'failed'; 