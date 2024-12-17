// 合约地址
export const CONTRACT_ADDRESSES = {
  // BSC Mainnet
  BSC: {
    STAR_NFT: "0x620c741Ff92b992894Ab4b5d5a1Cc9F0bdDA5ce5",
    ANGEL_NFT: "0xedb44cb980C89424dacCCA244f98a22eb57bD5b6",
    OPE_TOKEN: "0x4B5A0F4E00bC0d6F16A593Aa4a7bF6fC2111B2fb",
    USDT: "0x55d398326f99059fF775485246999027B3197955",
    REFERRAL_SYSTEM: "0x5399BBb3628b60FbeD34ef6AdEe15277B53A5C75"
  },
  // Optimism Mainnet
  OP: {
    STAR_NFT: "0x8C19d0B5b8eE2C9B4F4E07666170Ef7A4339845c",
    ANGEL_NFT: "0x9E4c14403d7d9A8A782044E86a93CAE09D7B2ac9",
    OPE_TOKEN: "0x4200000000000000000000000000000000000042",
    USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    REFERRAL_SYSTEM: "0x6900000000000000000000000000000000000069"
  }
} as const;

// 网络配置
export const NETWORKS = {
  BSC: {
    CHAIN_ID: 56,
    RPC_URL: "https://bsc-dataseed.binance.org",
    EXPLORER_URL: "https://bscscan.com",
    NETWORK_NAME: "Binance Smart Chain",
    CURRENCY_SYMBOL: "BNB",
    CURRENCY_DECIMALS: 18
  },
  OP: {
    CHAIN_ID: 10,
    RPC_URL: "https://mainnet.optimism.io",
    EXPLORER_URL: "https://optimistic.etherscan.io",
    NETWORK_NAME: "Optimism",
    CURRENCY_SYMBOL: "ETH",
    CURRENCY_DECIMALS: 18
  }
} as const;

// 合约名称
export const CONTRACT_NAMES = {
  STAR_NFT: "Star NFT",
  ANGEL_NFT: "Angel NFT",
  OPE_TOKEN: "OPE Token",
  USDT: "USDT"
} as const;

// Claim 相关常量
export const CLAIM_CONSTANTS = {
  COOLDOWN_PERIOD: 24 * 60 * 60 * 1000, // 24小时（毫秒）
  MIN_CLAIM_AMOUNT: BigInt(1e18), // 1 OPE
  MAX_CLAIM_AMOUNT: BigInt(1000e18), // 1000 OPE
  CLAIM_MULTIPLIER: BigInt(1e18) // 1 OPE per level
} as const;

// NFT 相关常量
export const NFT_CONSTANTS = {
  MAX_STAR_LEVEL: 5,
  MAX_ANGEL_LEVEL: 3,
  BASE_URI: "https://api.onepay.finance/nft/metadata/",
  DEFAULT_STAR_LEVEL: 1,
  DEFAULT_ANGEL_LEVEL: 1
} as const;

// 交易相关常量
export const TRANSACTION_CONSTANTS = {
  GAS_LIMIT: "300000",
  MAX_FEE_PER_GAS: "50000000000", // 50 Gwei
  MAX_PRIORITY_FEE_PER_GAS: "1500000000", // 1.5 Gwei
  TIMEOUT_SECONDS: 60,
  CONFIRMATION_BLOCKS: 1
} as const;

// 状态常量
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  BURNED: 'burned',
  LOCKED: 'locked'
} as const;

// 区域常量
export const ZONES = {
  LEFT: 'left',
  MIDDLE: 'middle',
  RIGHT: 'right'
} as const;

// 奖励类型常量
export const REWARD_TYPES = {
  REFERRAL: 'referral',
  STAR_NFT: 'star_nft',
  ANGEL_NFT: 'angel_nft',
  OPS: 'ops',
  TEAM: 'team',
  SPECIAL: 'special'
} as const;

// API 相关常量
export const API = {
  BASE_URL: "https://api.onepay.finance",
  TIMEOUT: 10000, // 10 seconds
  RETRY_TIMES: 3,
  RETRY_DELAY: 1000 // 1 second
} as const;

// 工具函数
export const getContractAddresses = (chainId: number) => {
  switch (chainId) {
    case NETWORKS.BSC.CHAIN_ID:
      return CONTRACT_ADDRESSES.BSC;
    case NETWORKS.OP.CHAIN_ID:
      return CONTRACT_ADDRESSES.OP;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

export const getNetworkConfig = (chainId: number) => {
  switch (chainId) {
    case NETWORKS.BSC.CHAIN_ID:
      return NETWORKS.BSC;
    case NETWORKS.OP.CHAIN_ID:
      return NETWORKS.OP;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

