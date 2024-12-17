import { Chain } from "@thirdweb-dev/chains";
import { createThirdwebClient } from "thirdweb";

// 定义 Optimism 链配置
const Optimism: Chain = {
  chainId: 10,
  name: 'Optimism',
  chain: 'optimism',
  rpc: ['https://mainnet.optimism.io'],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  shortName: 'op',
  slug: 'optimism',
  testnet: false,
  icon: {
    url: 'https://optimism.io/favicon.ico',
    width: 32,
    height: 32,
    format: 'png',
  },
};

// 定义 BSC 链配置
const BSC: Chain = {
  chainId: 56,
  name: 'BNB Smart Chain',
  chain: 'bsc',
  rpc: ['https://bsc-dataseed.binance.org'],
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  shortName: 'bsc',
  slug: 'binance',
  testnet: false,
  icon: {
    url: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    width: 32,
    height: 32,
    format: 'png',
  },
};

// 默认链配置
export const defaultChain = Optimism;

// 创建 ThirdWeb 客户端
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

// Provider 配置
export const providerConfig = {
  client,
  activeChain: defaultChain,
  supportedChains: [defaultChain, BSC],
  supportedWallets: [
    {
      id: "metamask",
      meta: {
        name: "MetaMask",
        iconURL: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
      },
    },
  ],
  dAppMeta: {
    name: "OnePay",
    description: "OnePay Web3 Payment Solution",
    logoUrl: "/logo.png",
    url: window.location.origin,
  },
  connectButton: {
    theme: "dark",
  },
  connectModal: {
    theme: "dark",
    showThirdwebBranding: false,
  }
};

// 工具函数
export const thirdwebUtils = {
  // 检查链是否支持
  isSupportedChain: (chainId: number) => {
    return providerConfig.supportedChains.some((chain: Chain) => chain.chainId === chainId);
  },
  
  // 获取链配置
  getChainConfig: (chainId: number) => {
    return providerConfig.supportedChains.find((chain: Chain) => chain.chainId === chainId);
  },
  
  // 格式化链名称
  formatChainName: (chainId: number) => {
    const chain = providerConfig.supportedChains.find((chain: Chain) => chain.chainId === chainId);
    return chain ? chain.name : 'Unknown Chain';
  }
}; 