import { Chain } from "@thirdweb-dev/chains";

// 定义支持的链配置
export const supportedChains: Chain[] = [
  {
    name: 'Optimism',
    chain: 'ETH',
    rpc: ['https://mainnet.optimism.io'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    shortName: 'oeth',
    chainId: 10,
    testnet: false,
    slug: 'optimism',
  },
  {
    name: 'Ethereum',
    chain: 'ETH',
    rpc: ['https://ethereum.rpc.thirdweb.com'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    shortName: 'eth',
    chainId: 1,
    testnet: false,
    slug: 'ethereum',
  },
  {
    name: 'Binance',
    chain: 'BSC',
    rpc: ['https://binance.rpc.thirdweb.com'],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    shortName: 'bnb',
    chainId: 56,
    testnet: false,
    slug: 'binance',
  },
  {
    name: 'Polygon',
    chain: 'MATIC',
    rpc: ['https://polygon.rpc.thirdweb.com'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    shortName: 'matic',
    chainId: 137,
    testnet: false,
    slug: 'polygon',
  },
  {
    name: 'Arbitrum One',
    chain: 'ETH',
    rpc: ['https://arbitrum.rpc.thirdweb.com'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    shortName: 'arb',
    chainId: 42161,
    testnet: false,
    slug: 'arbitrum',
  },
  // 测试网络
  {
    name: 'Goerli',
    chain: 'ETH',
    rpc: ['https://goerli.rpc.thirdweb.com'],
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    shortName: 'gor',
    chainId: 5,
    testnet: true,
    slug: 'goerli',
  },
  {
    name: 'Mumbai',
    chain: 'MATIC',
    rpc: ['https://mumbai.rpc.thirdweb.com'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    shortName: 'maticmum',
    chainId: 80001,
    testnet: true,
    slug: 'mumbai',
  }
];

// 导出 Optimism chain 配置，用于 ThirdwebProvider 的 activeChain
export const activeChain = {
  name: 'Optimism',
  chain: 'ETH',
  rpc: ['https://mainnet.optimism.io'],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  shortName: 'oeth',
  chainId: 10,
  testnet: false,
  slug: 'optimism',
} as const;

// 导出默认链配置，用于其他地方使用
export const chain = activeChain;

// 获取链配置
export function getChainConfig(chainId: number): Chain | undefined {
  return supportedChains.find(chain => chain.chainId === chainId);
}

// 检查链是否被支持
export function isSupportedChain(chainId: number): boolean {
  return supportedChains.some(chain => chain.chainId === chainId);
}

// 获取链名称
export function getChainName(chainId: number): string {
  return getChainConfig(chainId)?.name || 'Unknown Chain';
}

// 获取链的原生代币符号
export function getChainNativeCurrency(chainId: number): string {
  return getChainConfig(chainId)?.nativeCurrency.symbol || 'ETH';
}

// 获取链的 RPC URL
export function getChainRPC(chainId: number): string {
  const chain = getChainConfig(chainId);
  return chain?.rpc[0] || '';
}

// 获取链的浏览器 URL
export function getChainExplorer(chainId: number): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    10: 'https://optimistic.etherscan.io',
    56: 'https://bscscan.com',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
    5: 'https://goerli.etherscan.io',
    80001: 'https://mumbai.polygonscan.com'
  };
  return explorers[chainId] || '';
}